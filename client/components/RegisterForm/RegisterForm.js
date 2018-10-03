import React from 'react';
import { Form, Field } from 'react-final-form';
import PropTypes from 'prop-types';

import registerValidation from './registerValidation';


const Input = ({input, label, type, meta: { touched, error, submitError }, ...rest}) => (

  <div className={`form-group ${(error || submitError) && touched ? 'has-error' : ''}`}>

    <label htmlFor={input.name} className="font-weight-600">{label}</label>

    <div className={input}>

      <input {...input} {...rest} type={type} className="form-control" />

      {(error || submitError) && touched && <span className="glyphicon glyphicon-remove form-control-feedback" />}

      {(error || submitError) &&
        touched && (
        <div className="text-danger">
          <strong>{error || submitError}</strong>
        </div>
      )}

    </div>

  </div>
);


Input.propTypes = {
  input: PropTypes.objectOf(PropTypes.any).isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  meta: PropTypes.objectOf(PropTypes.any).isRequired
};


const RegisterForm = ({ onSubmit, initialValues }) => (

  <Form

    initialValues={initialValues}
    onSubmit={values => onSubmit(values).then(() => {}, err => err)}
    validate={registerValidation}

    render={({ handleSubmit, submitError }) => (

      <form onSubmit={handleSubmit}>

        <div className="form-group">
          <Field name="username" type="text" component={Input} label="Username" />
        </div>

        <div className="form-group">
          <Field name="email" type="text" component={Input} label="Email Address" />
        </div>

        <div className="form-group">
          <Field name="password" type="password" component={Input} label="Password" />
        </div>

        <div className="form-group">
          <Field name="password_confirmation" type="password" component={Input} label="Password confirmation" />
        </div>

        {submitError && (
          <p className="text-danger">
            <strong>{submitError}</strong>
          </p>
        )}

        <div className="d-flex justify-content-center mt-4">
          <a className="btn btn-success btn-width-one-third" href="index.html">Register</a>
        </div>

      </form>

    )}
  />
);


RegisterForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  initialValues: PropTypes.objectOf(PropTypes.any)
};

RegisterForm.defaultProps = {
  initialValues: {}
};

export default RegisterForm;
