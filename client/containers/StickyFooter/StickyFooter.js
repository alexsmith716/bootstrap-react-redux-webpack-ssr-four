import React, { Component } from 'react';
import Helmet from 'react-helmet';

class StickyFooter extends Component {

  render() {

    const styles = require('./scss/StickyFooter.scss');

    return (

      <div className="container">

        <h1 className={styles.stickyFooterUniqueColor}>Sticky Footer Test</h1>

        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Et, consequuntur, modi mollitia corporis ipsa voluptate corrupti eum ratione ex ea praesentium quibusdam? Aut, in eum facere corrupti necessitatibus perspiciatis quis?</p>

      </div>
    );
  }
}

export default StickyFooter;
