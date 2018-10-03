import React from 'react';
import { renderIntoDocument, findRenderedDOMComponentWithTag, findRenderedDOMComponentWithClass } from 'react-dom/test-utils';
import { expect } from 'chai';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router';
import createStore from '../../redux/createStore';
import apiClient from '../../../server/utils/apiClient';

// components
import { InfoBar } from '../index';

// https://github.com/airbnb/enzyme
// import { shallow } from 'enzyme';  // Shallow Rendering
// import { mount } from 'enzyme';    // Full DOM Rendering
// import { render } from 'enzyme';   // Static Rendered Markup

// renderIntoDocument(element): Render a React element into a detached DOM node in the document. This function requires a DOM.

const client = apiClient();

// ===============================================================
// ========================= InfoBar =============================
// ===============================================================

describe('InfoBar', () => {

  const mockStore = {
    info: {
      load: () => {},
      loaded: true,
      loading: false,
      data: {
        message: 'This came from the api server!',
        time: Date.now()
      }
    }
  };

  const store = createStore({
    history: MemoryRouter,
    data: mockStore,
    helpers: { client }
  });

  const renderer = renderIntoDocument(<Provider store={store} key="provider">
    <InfoBar />
  </Provider>);

  // console.log('>>>>>>>>>>>>> InfoBar-test > renderer: ', renderer)

  it('should render correctly', () => {
    console.log('>>>>>>>>>>>>> InfoBar-test 1 >>>>>>>>>>>>>>>>>>>>>>>>>>')
    // eslint-disable-next-line no-unused-expressions
    expect(renderer).to.be.ok;
  });

  it('should render with correct value (findRenderedDOMComponentWithClass: .message)', () => {
    console.log('>>>>>>>>>>>>> InfoBar-test 2 >>>>>>>>>>>>>>>>>>>>>>>>>>')
    const text = findRenderedDOMComponentWithClass(renderer, 'message').textContent;
    expect(text).to.equal(mockStore.info.data.message);
  });

  it('should render with correct value (findRenderedDOMComponentWithTag: <span/>)', () => {
    console.log('>>>>>>>>>>>>> InfoBar-test 3 >>>>>>>>>>>>>>>>>>>>>>>>>>')
    const text = findRenderedDOMComponentWithTag(renderer, 'span').textContent;
    expect(text).to.equal(mockStore.info.data.message);
  });

  it('should render with a reload button', () => {
    console.log('>>>>>>>>>>>>> InfoBar-test 4 >>>>>>>>>>>>>>>>>>>>>>>>>>')
    const text = findRenderedDOMComponentWithTag(renderer, 'button').textContent;
    expect(text).to.be.a('string');
  });

  it('should render the correct className', () => {
    console.log('>>>>>>>>>>>>> InfoBar-test 5 >>>>>>>>>>>>>>>>>>>>>>>>>>')
    const styles = require('../components/InfoBar/InfoBar.scss');
    const component = findRenderedDOMComponentWithClass(renderer, styles.infoBar);
    expect(styles.infoBar).to.be.a('string');
    expect(component.className).to.include(styles.infoBar);
  });
});
