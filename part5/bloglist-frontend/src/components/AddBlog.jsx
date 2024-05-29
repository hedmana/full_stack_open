import { useState, forwardRef, useImperativeHandle } from 'react'
import PropTypes from 'prop-types'

const AddBlog = forwardRef((props, refs) => {
  const [visible, setVisible] = useState(false)

  const hide = { display: visible ? 'none' : '' }
  const show = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility,
    }
  })

  return (
    <div>
      <div style={hide}>
        <button id="newBlogButton" onClick={toggleVisibility}>
          {props.buttonText}
        </button>
      </div>
      <div style={show}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

AddBlog.propTypes = {
  buttonText: PropTypes.string.isRequired,
}

AddBlog.displayName = 'AddBlog'

export default AddBlog