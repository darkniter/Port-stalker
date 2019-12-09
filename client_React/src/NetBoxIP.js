import Select from 'react-select';
import React from 'react';
import axios from 'axios';
import config from './config.json';

class AddIp extends React.Component{
  constructor(props){

    super(props)

    this.state = {
      SelectedIp: '',
      SelectedPrefix: '',
      AvailablePrefixes: [],
      AvailableIp: [],
      token: '',
      NetBox_URL: false,
      NetBoxResponse: '',
      Pref:false,
      IP:false,
    }

    axios.get(`${config.flask}/guestUser/`)
        .then((res)=>{
          this.setState({
            token: res.data.token,
            NetBox_URL: res.data.url,
          })
          this.getAvailablePrefixes(res.data.url);
        }).catch((error) => {
          console.error(error);
        });
    this.SelectIp = this.SelectIp.bind(this)
    this.SendIpAddress = this.SendIpAddress.bind(this)
    this.ReturnIp = this.ReturnIp.bind(this)
    this.getAvailableIp = this.getAvailableIp.bind(this)
    this.ReturnPrefixes = this.ReturnPrefixes.bind(this)
    this.traceback = this.traceback.bind(this)
    this.getAvailablePrefixes = this.getAvailablePrefixes.bind(this)
  }

  getAvailablePrefixes(){
      const path = `${this.state.NetBox_URL}/api/ipam/prefixes/`;
      axios.get(path,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        }
      })
        .then((res) => {
          let resPref = res.data.results.map(Prefix =>this.renameObjPrefix(Prefix))
          this.setState({
            AvailablePrefixes: resPref
          })

        })
        .catch((error) => {
          console.error(error);
        });
    }

  renameObjPrefix(objPref){

      objPref['value'] = objPref['id'];
      delete objPref['id'];
      objPref['label'] = objPref['prefix'];
      delete objPref['prefix'];

    return objPref;
  }
  getAvailableIp(val_tmp){

      this.setState({SelectedPrefix: val_tmp, Pref: true});
      const path = `${this.state.NetBox_URL}/api/ipam/prefixes/${val_tmp.value}/available-ips/`;
      axios.get(path,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        }
      })
        .then((res) => {
          let arrIp = res.data.map(Ip=>this.renameObjIp(Ip));
          this.setState({
            AvailableIp: arrIp
          })
        })
        .catch((error) => {
          console.error(error);
        });
    }

  renameObjIp(objIp){
    objIp['value'] = objIp['family'];
      delete objIp['family'];
      objIp['label'] = objIp['address'];
      delete objIp['address'];
    return objIp;
  }

  SendIpAddress(){
      const path = `${this.state.NetBox_URL}/api/ipam/ip-addresses/`;
      let messageIp = JSON.stringify({"address": this.state.SelectedIp.label})
      axios.post(path,messageIp,{
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        }
      })
        .then((res) => {
          alert('Success');
          this.setState({NetBoxResponse: res.data})
        })
        .catch((error) => {
          if (typeof error.response.data == 'string'){
              alert(error.response.data)
            } else{
                for (let item in error.response.data){
                  alert(error.response.data[item]);
                }}
          console.error(error);
        });
    }

  SelectIp(Ip_tmp){
    this.setState({SelectedIp:Ip_tmp, IP:true})

  }
  ReturnPrefixes(){

    return(
      <div className="container">
        <label for="SelectPrefix">Prefix:</label>
          <Select
            options={this.state.AvailablePrefixes}
            id = "SelectPrefix"
            isSearchable={false}
            onChange = {this.getAvailableIp}
            maxMenuHeight='200'/>
      </div>
    )
  }

  ReturnIp(){
    return(
      <div className="container">
        <label for="SelectIP">Available Ip:</label>
          <Select
            options={this.state.AvailableIp}
            id = "SelectIP"
            isSearchable={false}
            onChange = {this.SelectIp}
            maxMenuHeight='200'/>
      </div>
    )
  }

  traceback(){
    if (this.state.IP && this.state.Pref){
      return (
        <div className='container'>
          <this.ReturnPrefixes/>
          <this.ReturnIp/>
          <input type="button" value = "Send to NetBox" onClick={this.SendIpAddress}/>
        </div>
        )

    } else if (this.state.Pref){
        return (
          <div className='container'>
            <this.ReturnPrefixes/>
            <this.ReturnIp/>
          </div>
        );

      } else {
          return (
            <div className='container'>
              <this.ReturnPrefixes/>
            </div>
          );
        }
  }

  AfterInput(){
    return(
    <div>
      <table className="col-md-6 table-striped"><tbody>
        {
          Object.keys(this.state.inputStrReg.value).map((item)=>{
                return <tr key={item}><td>{String(item)} :</td><td> {this.state.inputStrReg.value[item]} </td></tr>
              })
        }</tbody>
      </table>
    </div>
    )
  }

  render(){
    return(
      <this.traceback/>
    );

  }
}
export default AddIp;