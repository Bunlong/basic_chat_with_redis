import React from 'react'
import { Field, reduxForm } from 'redux-form'

let Form = props => {
  const { handleSubmit, onSubmit } = props

  return (
    <div>
      <form>
        Name: 
        <Field 
          name="name" 
          component="input" 
          type="text" 
        />
        <button onClick={handleSubmit(values => 
          onSubmit({ 
            ...values,
            pill: 'setusername'
          }))}>Set Username</button>
        <br/>
        Message:
        <Field 
          name="text" 
          component="input" 
          type="text"
        />
        <br/>
        <button onClick={handleSubmit(values => 
          onSubmit({ 
            ...values,
            pill: 'submit'
          }))}>Submit</button>
      </form>
    </div>
  )
}

Form = reduxForm({
  form: 'Form'
})(Form)

export default Form
