import React, { PropTypes } from 'react'
import { Editor as DraftEditor, EditorState, convertFromRaw } from 'draft-js'
import PrismDecorator from 'draft-js-prism'
import transform from './../../transform'
import styles from './styles.css'
import classnames from 'classnames'

export default class Editor extends React.Component {
  constructor(props) {
    super(props)
    const decorator = new PrismDecorator({ defaultSyntax: 'javascript', filter: () => true })
    this.state = { editorState: EditorState.createEmpty(decorator) }

    this.onCodeChange = (editorState) => {
      let text = editorState.getCurrentContent().getPlainText()
      if (this.props.wrap) {
        text = this.props.wrap(text)
      }
      if (text !== this.state.text) {
        this.props.onChange(text)
      }
      let isError
      try {
        transform(text).code
        isError = false
      } catch (e) {
        isError = true
      }
      this.setState({ editorState, isError, text })
    }
  }
  shouldComponentUpdate(nextProps, nextState) {
    return nextState.editorState !== this.state.editorState
  }
  render() {
    const { editorState } = this.state
    return (
      <div className={classnames(styles.component, { [styles.error]: this.state.isError })}>
        <DraftEditor
          editorState={editorState}
          onChange={this.onCodeChange}
          placeholder="..." />
      </div>
    )
  }
}

Editor.propTypes = {
  onChange: PropTypes.func,
  wrap: PropTypes.func
}
