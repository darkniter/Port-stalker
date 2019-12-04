import logo from './assets/n_logo.png';
import axios from 'axios';
import React from 'react';

class MainPage extends React.Component{
  constructor(props){

    super(props)

    this.state = {
      forism: {},
    };

  axios.get('http://localhost:5000/forism/')
      .then((res) => {
        this.setState({
          forism: res.data.forism
        })
      })
      .catch((error) => {
        console.error(error);
      });
  }



  render(){
      return(
        <div align="center">
          <a href={console.log(window.location.href)}>
            <img width="350" src={logo} alt="logo"/>
          </a>
        <blockquote className="blockquote">
                  <p ><cite title="Source Title">{this.state.forism.quoteText}</cite></p>
                    <footer>
                      <p v-if="forism.quoteAuthor">Автор : <cite title="Source Title">{''+this.state.forism.quoteAuthor}</cite>
                      </p>
                    </footer>
                </blockquote>
        </div>

      );
  }
  }
export default MainPage