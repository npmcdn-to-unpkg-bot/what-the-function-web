import React from 'react'
import styles from './styles.css'
import Query from '../Query'
import Editor from '../Editor'
import Manual from '../Manual'
import Suggestions from '../Suggestions'
import ProgressBar from './../ProgressBar'

export default ({ onArgumentsChange, onResultChange, suggestions = [], loading, progress }) => {
  return (
      <div className={styles.component}>
        <Manual/>
        <Query {...{onArgumentsChange, onResultChange}} />
        <Suggestions {...{suggestions, loading}}/>
        <ProgressBar percent={progress} />
      </div>
  )
}
