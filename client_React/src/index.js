import React from 'react';
import logo from './assets/logo.png';
import ReactDOM from 'react-dom';
import axios from 'axios';


class AppD extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      firstName: "",
      data: '',
    };
  }

  GetFromBack = event =>
  {
    axios.get('http://localhost:5000/guestUser/')
      .then((res)=>{
        console.log(res.data.token);
        this.setState({data: res.data.token})
      });
    }


  onFirstNameChange = event =>
    this.setState({
      firstName: event.target.value
    });

  getFromBack(){
    var res = fetch('http://localhost:5000/guestUser/');
    this.setState({
      data: res
    });
  }

  render(){
        return(
            // <div>
            //   <meta charset="utf-8"></meta>
            //   <link href="./css/bootstrap.min.css" rel="stylesheet"></link>
            //   <link href="./css/styles.css" rel="stylesheet"></link>
          <div>
            <a href="https://yandex.ru/search"><img width="100" align = "center" src={logo} alt="title"></img></a>
            <br></br><a href='https://yandex.ru/search'>qwe</a>
            <div>
              <input type="text" name="firstName" onChange={this.onFirstNameChange} />

              <p>{this.state.firstName}</p>
              <input type="button" onClick={this.GetFromBack}/>
              <p>{this.state.data}</p>
            </div>
          </div>

        );
    }
}



ReactDOM.render(
  <AppD />,
  document.getElementById('root')
);