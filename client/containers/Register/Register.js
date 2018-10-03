import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Helmet from 'react-helmet';

import RegisterForm from '../../components/RegisterForm/RegisterForm';
import * as authActions from '../../redux/modules/auth';
import * as notifActions from '../../redux/modules/notifs';

// connect component to redux store
@connect(() => ({}), { ...notifActions, ...authActions })

class Register extends Component {

  static propTypes = {
    location: PropTypes.shape({ state: PropTypes.object }).isRequired,
    register: PropTypes.func.isRequired,
    notifSend: PropTypes.func.isRequired
  };

  getInitialValues = () => {
    const { location } = this.props;
    return location.state && location.state.oauth;
  };

  register = async data => {
    const result = await this.props.register(data);
    this.successRegister();
    return result;
  };

  successRegister = () => {
    this.props.notifSend({
      message: "You're now registered!",
      kind: 'success',
      dismissAfter: 2000
    });
  };

  render() {

    const styles = require('./scss/Register.scss');

    return (

      <div className="container">

        <div className={styles.registerContainer}>

          <Helmet title="Join Election App" />

          <div className="d-flex justify-content-center">

            <div className={styles.register}>

              <div className={`mb-3 ${styles.formTitle}`}>
                <p>
                  Join Election App
                </p>
              </div>

              <div className={styles.formContainer}>

                <RegisterForm onSubmit={this.register} initialValues={this.getInitialValues()} />

              </div>

            </div>

          </div>

        </div>

      </div>
    );
  }
}

export default Register;
