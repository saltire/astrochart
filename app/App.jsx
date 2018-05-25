import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

import './App.scss';
import draw from './chart';


class App extends Component {
  constructor(props) {
    super(props);

    this.svg = React.createRef();
  }

  componentDidMount() {
    axios.get('/planets')
      .then(resp => draw(this.svg.current, resp.data))
      .catch(console.error);
  }

  render() {
    return (
      <div className='App'>
        <header>
          <h1>Astro Chart</h1>
        </header>
        <main>
          <svg viewBox='0 0 400 400' ref={this.svg} />
        </main>
      </div>
    );
  }
}

export default hot(module)(App);
