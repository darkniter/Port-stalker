import Select from 'react-select';
import React from 'react';
import axios from 'axios';
import jsonp from 'jsonp';

class AddSite extends React.Component {

    constructor(props){

      super(props)

      this.state = {
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

    getStreetList = event =>{
      let q = event.target.value
      this.setState({
        inputStrPlaces: q,
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
      axios.get('http://localhost:5000/regions-child/', { params: { q:''} })
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

    onSelectStreet(e){
      this.setState({
        inputStrPlaces: e.value,
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

      if (this.state.inputStrReg.label && this.state.inputForm) {
        if (this.state.street.slug){
          return(
            <div>
              <label for="inputSearch">Search Site : </label>
                <div className="input-group mb-3">
                  <input
                    id="inputSearch"
                    className="form-control"
                    type="text"
                    value={this.state.inputStrPlaces}
                    onChange={this.getStreetList}
                  />
                </div>

              <div className="input-group-append">
                <input type="button" className="btn btn-outline-secondary" value="Show me data" onClick={this.ReverseStateForm}/>
              </div>

                <div>
                  <label for="SelectStreetFIAS">Site in Kladr : </label>
                    <Select
                      id = "SelectStreetFIAS"
                      defaultMenuIsOpen={true}
                      closeMenuOnSelect={true}
                      isSearchable={false}
                      options = {this.state.StreetsList}
                      onChange = {this.onSelectStreet}
                      maxMenuHeight='200'
                    />
                </div>

            </div>
        );
        } else {
            return(
              <div>
                <label for="inputSearch">Search Site : </label>
                <div className="input-group mb-3">
                  <input
                    id="inputSearch"
                    className="form-control"
                    type="text"
                    value={this.state.inputStrPlaces}
                    onChange={this.getStreetList}
                  />
                </div>

                <div>
                  <label for="SelectStreetFIAS">Site in Kladr : </label>
                    <Select
                      id = "SelectStreetFIAS"
                      menuIsOpen={true}
                      isSearchable={false}
                      options = {this.state.StreetsList}
                      onChange = {this.onSelectStreet}
                      maxMenuHeight='200'
                    />
                </div>
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
          <label htmlFor="SelectReg">Region : </label><Select maxMenuHeight='200' id="SelectReg" options={this.state.allRegions} onChange={this.onSelectRegion}></Select>
        </div>
        )} else {
          return '';
        }
    }

    AfterInput(){
      if (!this.state.inputForm){
        return (
          <div>

              <h3>Created Object : </h3>
              <table className="col-md-6 table-striped">
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
                          return <tr key={item}><td>{String(item)} :</td><td> {this.state.inputStrReg.value[item]} </td></tr>
                        })
                  }</tbody></table>
              </div>
              <br/>
              <input type='button' className="btn btn-dark" value='Back to form' onClick={this.ReverseStateForm} />
            <input type='button' className="btn btn-danger" value='Send to NetBox' onClick={this.SendNetbox} />
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
          return(
              <div className="container">
                <div className="col-md-6" align="left">
                  <this.ReturnRegions/>
                  <this.ReturnStreetsList/>
                  {/* <this.ReturnInfo/> */}
                </div>
                <div>
                <this.AfterInput/>
                </div>
            </div>

          );
      }
  }

  export default AddSite
