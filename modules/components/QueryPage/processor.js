import Worker from 'worker!./worker'
import throttle from 'lodash/function/throttle'
import { timeout } from './../../constants'

export default (progressCallback, suggestionsCallback) => {
  let worker, currentIteration = 0, totalIterations = 0, lastResultTimestamp
  let searchParams

  const onProgress = throttle(progressCallback, 25)

  const inProgress = () => currentIteration < totalIterations

  const getWorker = () => {
    worker = worker || new Worker

    worker.onmessage = ({data}) => {
      if (data.suggestions) {
        suggestionsCallback(data.suggestions)
      }
      if (data.totalIterations) {
        totalIterations = data.totalIterations
      }
      if (data.currentIteration) {
        lastResultTimestamp = new Date().getTime()
        currentIteration = data.currentIteration
        onProgress(Math.round(100 * currentIteration / totalIterations))
      }
    }
    return worker
  }

  const check = () => {
    if (inProgress() && lastResultTimestamp && new Date().getTime() - lastResultTimestamp > timeout) {
      console.error('Stalled on iteration %s from %s. Restart.', currentIteration, totalIterations)
      getWorker().terminate()
      worker = undefined
      lastResultTimestamp = 0
      getWorker().postMessage({ ...searchParams, startIteration: currentIteration + 1 })
    }
  }
  setInterval(check, timeout)

  getWorker()

  return {
    start(args, result, modules) {
      searchParams = { args, result, modules }
      getWorker().postMessage(searchParams)
    }
  }
}