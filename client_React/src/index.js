import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import jsonp from 'jsonp';
import Logo from './Helper';
import Select from 'react-select';


class AppD extends React.Component {

  constructor(props){

    super(props)

    this.state = {
      inputStrPlaces: '',
      StreetsList: [],
      StreetVal: '',
      res: {},
      inputStrReg: {},
      allRegions:[''],
      street: {},
      forism: [],
      inputForm: true,
      CountCheck: 0,
      NetboxResponse: null,
      checkSite: true,
      token:'',
      NetBox_URL:'',
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

    axios.get('http://localhost:5000/guestUser/')
      .then((res)=>{
        console.log(res.data.token);
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
    if (this.CountCheck === 0){
      this.CountCheck+=1;
      this.YellowPress('Лучше бы вам нажать на чек хоть раз! Но если вы так уверены - отправьте еще раз')
    } else {
      const path = `${this.NetBoxUrl}/api/dcim/sites/`;

      const CompleteData = JSON.stringify({
          name: this.street.translit,
          slug: this.street.slug,
          status: 1,
          region: this.inputStrReg.id
      });

      axios.post(path, CompleteData, {
        headers: {
          accept: 'application/json',
          "Content-Type": "application/json",
          Authorization: `Token ${this.state.token}`,
        }
      })
        .then((res) => {
          this.NetboxResponse = true;
          // this.GreenCard('Место успешно создано ;-)')
        })
        .catch((error) => {
          // for (let item in error.response.data){
          // this.RedAlert(error.response.data[item]);
          // }
        });
      }
      // this.checker = 0;
  }
  getStreetList(query) {
    const path = 'https://kladr-api.ru/api.php';
    jsonp(this.UrlBuilder(path, {
              query: query,
              cityId: this.inputStrReg.region_code,
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

  FormatDict(res){
    console.log('Format',res.result)
    let StreetsList_tmp = [];
    var res_tmp = res.result;

    for (let element in res_tmp) {
      let StreetName = '';
      StreetName = this.StreetPreProcessor(
        res_tmp[element]
      );

      StreetsList_tmp.push({name: StreetName});

    }

    this.StreetsList = StreetsList_tmp;
  }

  StreetPreProcessor(element){
    var StreetArr = '';
    var ParentStr = '';
    if (element.type === 'дом') {
      element.parents.forEach(parent => {
        if (element.parentGuid === parent.guid){
          if (parent.typeShort ==='ул') {
            ParentStr = `${parent.name}`;
          } else {
            ParentStr = `${parent.type} ${parent.name}`;
        }
        StreetArr= ` ${ParentStr} ${element.name}`}
      });
    } else {
        let fullName = element.fullName
        StreetArr = fullName.split(',');
        StreetArr.reverse();
        StreetArr = StreetArr.join(' ')
      }

    return StreetArr;
  }

  RegionLoad(){
    axios.get('http://localhost:5000/regions-child/', { params: { q:''} })
      .then((res) => {
          this.setState({allRegions: res.data.regions});
        })
      .catch((error) => {
        console.error(error);
      });
  }
  onSelectRegion = event =>{

    this.setState({
      inputStrReg: event.target.value
    })
  }

  getStreet() {
    const path = 'http://localhost:5000/streets/';
    axios.get(path, { params: { street: this.inputStrPlaces } })
      .then((res) => {
        this.street = res.data.street;
      })
      .catch((error) => {
        console.error(error);
      });
  }


  ReturnList


  render(){
        return(
          <div>
            <Logo/>
            <blockquote className="blockquote">
              <p ><cite title="Source Title">{this.state.forism.quoteText}</cite></p>
                <footer>
                  <p v-if="forism.quoteAuthor">Автор :
                    <cite title="Source Title">{this.state.forism.quoteAuthor}</cite>
                  </p>
                </footer>
            </blockquote>


            <div>
              <h3>Region : </h3>
              <Select options={this.state.allRegions}></Select>
            </div>

            <div>
            </div>

          </div>

        );
    }
}


ReactDOM.render(
  <AppD />,
  document.getElementById('root')
);