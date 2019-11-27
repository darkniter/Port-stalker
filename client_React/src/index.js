import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import jsonp from 'jsonp';
import Logo from './Helper';
import Select from 'react-select';
import { thisExpression } from '@babel/types';



class AppD extends React.Component {

  constructor(props){

    super(props)

    this.state = {
      inputStrPlaces: {},
      StreetsList: [],
      StreetVal: '',
      inputStrReg: {},
      allRegions:{},
      street: {},
      forism: {},
      inputForm: true,
      CountCheck: 0,
      NetboxResponse: null,
      checkSite: true,
      token:'',
      NetBox_URL:'',
    };

    this.onSelectStreet = this.onSelectStreet.bind(this)
    this.onSelectRegion = this.onSelectRegion.bind(this)
    this.ReturnStreetsList = this.ReturnStreetsList.bind(this)
    this.getStreetList = this.getStreetList.bind(this)
    this.ReturnForism = this.ReturnForism.bind(this)
    this.ReturnRegions = this.ReturnRegions.bind(this)
    this.SendNetbox = this.SendNetbox.bind(this)
    this.ReverseStateForm = this.ReverseStateForm.bind(this)
    this.AfterInput = this.AfterInput.bind(this)
    this.SendNetbox = this.SendNetbox.bind(this)

    axios.get('http://localhost:5000/forism/')
      .then((res) => {
        this.setState({
          forism: res.data.forism
        })
      })
      .catch((error) => {
        console.error(error);
      });

    axios.get('http://localhost:5000/guestUser/')
      .then((res)=>{
        this.setState({
          token: res.data.token,
          NetBox_URL: res.data.url,
        })
      }).catch((error) => {
        console.error(error);
      });
      this.RegionLoad()
  }

  SendNetbox(){

      const path = `${this.state.NetBox_URL}/api/dcim/sites/`;

      const CompleteData = JSON.stringify({
          name: this.state.street.translit,
          slug: this.state.street.slug,
          status: 1,
          region: this.state.inputStrReg.id
      });

      axios.post(path, CompleteData, {
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        }
      })
        .then((res) => {
          this.setState({NetboxResponse: true});
          alert('Место успешно создано ;-)');
          this.ReverseStateForm();
        })
        .catch((error) => {
          console.log(typeof error.response.data);
          if (typeof error.response.data == 'string'){
            alert(error.response.data)
          } else{
              for (let item in error.response.data){
                alert(error.response.data[item]);
              }
            }
        });
  }

  getStreetList(q){
    if (q){
    const path = 'https://kladr-api.ru/api.php';
    jsonp(this.UrlBuilder(path, {
              query: q,
              cityId: this.state.inputStrReg.value.region_code,
              regionId: 5000000000000,
              limit: 10,
              contentType: 'building',
              oneString: 1,
              callback: 'Fias',
              withParent: 1,
    },), { name: 'Fias'}, (error, data) => {
            if (error) {
              console.error(error);
            } else {
              this.FormatDict(data);
            }
          });
    }
    }

  UrlBuilder(path, params) {
      let UrlString = '';

      for (const element in params) {
        UrlString += String('&'+ element + '=' + params[element]);
      }

      UrlString = UrlString.replace('&', '?');

      return path + UrlString;
  }

  FormatDict(res){
    let StreetsList_tmp = [];
    var res_tmp = res.result;

    for (let element in res_tmp) {
      let StreetName = '';
      StreetName = this.StreetPreProcessor(
        res_tmp[element]
      );

      StreetsList_tmp.push({value: StreetName, label: StreetName});

    }

    this.setState({
      StreetsList: StreetsList_tmp
    })

  }

  StreetPreProcessor(element){
    var StreetArr = '';
    if (element.type === 'дом') {
      element.parents.forEach(parent => {
        if (element.parentGuid === parent.guid){
          if (parent.typeShort ==='ул') {
            StreetArr = `${parent.typeShort}. ${parent.name} ${element.name}`
          }
        }

      });
    } else {
        StreetArr = `${element.typeShort}. ${element.name}`
      }

    return StreetArr;
  }

  RegionLoad(){
    axios.get('http://localhost:5000/regions-child/', { params: { q:''} })
      .then((res) => {
          this.setState({
            allRegions: res.data.regions
          });
        })
      .catch((error) => {
        console.error(error);
      });
  }

  onSelectRegion (e){
    this.setState({
      inputStrReg: e
    })
  }

  onSelectStreet(e){
    this.setState({
      inputStrPlaces: e.value
    })

    const path = 'http://localhost:5000/streets/';
    axios.get(path, { params: { street:  e.value} })
      .then((res) => {
        this.setState({street: res.data.street})
      })
      .catch((error) => {
        console.error(error);
      });
  }

  ReturnForism(){
    if(this.state.inputForm){
      return(<blockquote className="blockquote">
                <p ><cite title="Source Title">{this.state.forism.quoteText}</cite></p>
                  <footer>
                    <p v-if="forism.quoteAuthor">Автор :
                      <cite title="Source Title">{this.state.forism.quoteAuthor}</cite>
                    </p>
                  </footer>
              </blockquote>
      );
    } else {
        return '';
      }
    }

  ReverseStateForm(){
    this.setState({inputForm:(!this.state.inputForm)})
  }

  ReturnStreetsList(){
    if (this.state.inputStrReg.label && this.state.inputForm) {
      if (this.state.street){
        return(
          <div>
              <h3>Site : </h3>
              <Select options={this.state.StreetsList} onInputChange={this.getStreetList} onChange={this.onSelectStreet}></Select>
              <input type="button" value="Show me data" onClick={this.ReverseStateForm}/>
          </div>
      );
      } else {
          return(
            <div>
                <h3>Site : </h3>
                <Select options={this.state.StreetsList} onInputChange={this.getStreetList} onChange={this.onSelectStreet}></Select>
            </div>
          );
      }
    } else{
      return '';
      }
  }

  ReturnRegions(){
    if(this.state.inputForm){
      return(
      <div>
        <h3>Region : </h3>
        <Select options={this.state.allRegions} onChange={this.onSelectRegion}></Select>
      </div>
      )} else {
        return '';
      }
  }

  AfterInput(){
    if (!this.state.inputForm){
      return (
        <div>
          <input type='button' value='Back to form' onClick={this.ReverseStateForm} />
            <h3>Object Region:</h3>
              <div>
                {
                  Object.keys(this.state.inputStrReg.value).map((item)=>{
                        return <h5 key={item}> {this.state.inputStrReg.value[item]} </h5>
                      })
                }
              </div>
            <br></br>
            <h3>Region Name:</h3><p>{this.state.inputStrReg.label}</p><br></br>
            <h3>Selected address:</h3><span>{this.state.inputStrPlaces}</span><br></br>
            <br></br><h3>Translit:</h3><span>{this.state.street.translit}</span><br></br>
            <br></br><h3>Slug:</h3><span>{this.state.street.slug}</span><br></br>
          <input type='button' value='Send to NetBox' onClick={this.SendNetbox} />
        </div>
      );
    } else {
        return '';
      }
  }

  ReturnInfo(){
    return '';
  }

  render(){
        return(
          <div>
            <Logo/>
            <this.AfterInput/>
            <this.ReturnForism/>
            <this.ReturnRegions/>
            <this.ReturnStreetsList/>
            <this.ReturnInfo/>
          </div>

        );
    }
}


ReactDOM.render(
  <AppD />,
  document.getElementById('root')
);