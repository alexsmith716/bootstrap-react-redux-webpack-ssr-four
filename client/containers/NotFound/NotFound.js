import React from 'react';
import Helmet from 'react-helmet';

export default function NotFound() {

	const styles = require('./scss/NotFound.scss');

	return (

    <div className="container">

      <Helmet title="Page Not Found" />

      <h1 className={`mt-4 mb-3 ${styles.notFoundUniqueColor}`}>Status Code 404!</h1>

      <p>
        Page Not Found!
      </p>

    </div>
  );
}
