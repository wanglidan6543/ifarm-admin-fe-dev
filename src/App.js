import React, { Component } from 'react'
import RootRouter from './router';
import { Provider } from 'react-redux';
import store from './store/index';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Provider store={store}>
          <RootRouter />
        </Provider>
      </div>
    )
  }
}
export default App;
