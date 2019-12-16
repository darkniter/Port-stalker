import Select from 'react-select';
import React from 'react';
import axios from 'axios';
import jsonp from 'jsonp';
import config from './config.json';

class AddSite extends React.Component {

    constructor(props){

      super(props)

      this.state = {
        searchPlacesStr:'',
        inputStrPlaces: '',
        StreetsList: [],
        StreetVal: '',
        inputStrReg: {},
        allRegions:{},
        street: {},

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

      this.ReturnRegions = this.ReturnRegions.bind(this)
      this.SendNetbox = this.SendNetbox.bind(this)
      this.ReverseStateForm = this.ReverseStateForm.bind(this)
      this.AfterInput = this.AfterInput.bind(this)
      this.SendNetbox = this.SendNetbox.bind(this)
      this.Select_tmp = this.Select_tmp.bind(this)



      axios.get(`${config.flask}/guestUser/`)
        .then((res) => {
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

    getStreetList = event =>{
      let q = event.target.value
      this.setState({
        searchPlacesStr: q,
      })
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
              StreetArr = `${parent.typeShort}. ${parent.name} ${element.name}`
          }

        });
      } else {
          StreetArr = `${element.typeShort}. ${element.name}`
        }

      return StreetArr;
    }

    RegionLoad(){
      axios.get(`${config.flask}/regions-child/`, { params: { q:''} })
        .then((res) => {
            this.setState({
              allRegions: res.data.regions
            });
          })
        .catch((error) => {
          this.setState({
            allRegions: {label:'',value:''}
          });
          console.error(error);
        });
    }

    onSelectRegion (e){
      this.setState({
        inputStrReg: e
      })
    }

    onSelectStreet=event=>{
      this.setState({
        inputStrPlaces: event.target.value,
      })


      const path = `${config.flask}/streets/`;
      axios.get(path, { params: { street:  event.target.value} })
        .then((res) => {
          this.setState({street: res.data.street})
        })
        .catch((error) => {
          console.error(error);
        });
    }

    ReverseStateForm(){
      this.setState({inputForm:(!this.state.inputForm)})
    }

    ChekSelect(){
      console.log(this.state.inputStrPlaces)
      return false
    }

    Select_tmp (){
      return( <div>


              </div>
      );
    }

    ReturnStreetsList(){
      if(this.state.inputForm){
    return(
              <div>
                <label htmlFor = "inputSearch">Search Site : </label>
                <div className = "input-group ">
                  <input
                    id = "inputSearch"
                    className = "form-control"
                    type = "text"
                    disabled={(!this.state.inputStrReg.value)?true:false}
                    value = {this.state.searchPlacesStr}
                    onChange = {this.getStreetList}
                  />
                </div>

                <div>
                  <label>Selected Site : {this.state.inputStrPlaces}</label><br/>
                  <label>Finded sites in KLADR:</label>
                    <ul data-spy="scroll" className = 'list-group KLADR col-md-auto'>
                      {this.state.StreetsList.map((index)=>{
                        return (
                        <li key = {index.label}>
                          <input
                            type="button"
                            className="list-group-item list-group-item-action"
                            value = {index.value}
                            onClick={this.onSelectStreet}
                            />
                        </li>)
                        })}
                    </ul>
                </div>
                <input type = "button" disabled={(!this.state.inputStrPlaces)?true:false} className = "btn btn-outline-secondary" value = "Show me data" onClick = {this.ReverseStateForm}/>
              </div>
            );
          } else {
             return '';
          }
    }
     

    ReturnRegions(){
      if(this.state.inputForm){
        
        return(
        <div className = "reg_select">
          <label htmlFor = "SelectReg">Region : </label>
          <Select
            value={this.state.inputStrReg}
            id = "SelectReg"
            options ={this.state.allRegions}
            onChange = {this.onSelectRegion}

          />
        </div>
        )
        
        
      } else {
          return ''
        }
    }

    AfterInput(){
      if (!this.state.inputForm){
        return (
          <div>

              <h3>Created Object : </h3>
              <table className = "col-md-6 table-striped">
                <tbody>
                  <tr><td>Region Name :</td><td> {this.state.inputStrReg.label}</td></tr>
                  <tr><td>Selected address : </td><td>{this.state.inputStrPlaces}</td></tr>
                  <tr><td>Translit : </td><td>{this.state.street.translit}</td></tr>
                  <tr><td>Slug : </td><td>{this.state.street.slug}</td></tr>
                </tbody>
              </table>
              <br></br>
              <div>
                  <h3>Region: </h3>
                  <table className="col-md-6 table-striped"><tbody>
                  {
                    Object.keys(this.state.inputStrReg.value).map((item)=>{
                          return <tr key = {item}><td>{String(item)} :</td><td> {this.state.inputStrReg.value[item]} </td></tr>
                        })
                  }</tbody></table>
              </div>
              <br/>
              <input type = 'button' className = "btn btn-dark" value = 'Back to form' onClick = {this.ReverseStateForm} />
            <input type = 'button' className = "btn btn-danger" value = 'Send to NetBox' onClick = {this.SendNetbox} />
          </div>
        );
      } else {
          return '';
        }
    }

    // ReturnInfo(){
    //   return '';
    // }

    render(){
      if (this.state.allRegions.label!=='' && this.state.token){
          return(
              <div className = "container">
                <div className = "col-md-6" align="left">
                  
                  <this.ReturnRegions/>
                  <this.ReturnStreetsList/>
                  {/* <this.ReturnInfo/> */}
                </div>
                <div>
                <this.AfterInput/>
                </div>
            </div>

          );
      } else {
        return (<div className="col-md-6"><h1>Connection with server failed. Please find the problem in config, Flask or Netbox</h1></div>);
        }
  }
}

  export default AddSite
