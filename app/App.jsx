import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import axios from 'axios';

import './App.scss';
import draw from './chart';


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };

    this.svg = React.createRef();
  }

  componentDidMount() {
    axios.get('/planets')
      .then((resp) => {
        this.setState({ data: resp.data });
      });
    draw(this.svg.current);
  }

  render() {
    return (
      <div className='App'>
        <header>
          <h1>Astro Chart</h1>
        </header>
        <main>
          <svg width='400' height='400' ref={this.svg} />
        </main>
      </div>
    );
  }
}

export default hot(module)(App);
