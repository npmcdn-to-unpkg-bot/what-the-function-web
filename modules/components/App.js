import React from 'react'
import Title from 'react-title-component'
import QueryPage from './QueryPage'

export default React.createClass({
  render() {
    return (
      <div>
        <Title render="What the Function"/>
        <QueryPage/>
      </div>
    )
  }
})

