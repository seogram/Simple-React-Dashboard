import React from 'react';
import {Nav,NavItem,Image,Thumbnail,Grid, Col, Row, Well, Panel,ProgressBar, Button,Label,Table,Glyphicon,Modal} from 'react-bootstrap';
import sortBy from 'lodash/sortBy'
import { Link } from 'react-router';
import { browserHistory } from 'react-router';
const DATA = require('../../../input');
const ReactHighcharts = require('react-highcharts');
require('highcharts-more');
import HighchartsMore from 'highcharts-more';
import SolidGauge from 'highcharts/modules/solid-gauge';

class Home extends React.Component{


  constructor(props) {

          super(props);
          HighchartsMore(ReactHighcharts.Highcharts);
          SolidGauge(ReactHighcharts.Highcharts);

          this.state = {
            sortedData : [],
            years: [],
            percent : [],
            units : [],
            orange_metric : '',
            gray_metric : '',
            blue_metric : ''
          }
      }

      componentDidMount(){
      var sortedData = sortBy(DATA.metrics,function(o){return o.year});
      this.setState({sortedData})
        sortedData.map(item=>{
          let years = this.state.years,
              percent = this.state.percent,
              units = this.state.units;
          years.push(item.year);
          percent.push((item.percent)*100);
          units.push(item.units);

          this.setState({
              years :  years ,
              percent : percent,
              units : units,
          });

        });

        //Set Default Values for circle chart

        this.setState({
            orange_metric :   (sortedData[0].orange_metric)*100,
            gray_metric   :   (sortedData[0].gray_metric)*100,
            blue_metric   :   (sortedData[0].blue_metric)*100
        });
      }


  handleValue(event){

        let result = (DATA.metrics).filter(function( obj ) {
          return obj.year == (event.point).category;
        });

         this.setState({
           orange_metric : (result[0].orange_metric)*100,
            gray_metric : (result[0].gray_metric)*100,
            blue_metric : (result[0].blue_metric)*100
        });
  }

render(){
  var myInstance =this;
  var years = this.state.years,
      {percent} = this.state,
      {units} = this.state,
      {orange_metric} = this.state,
      {gray_metric} = this.state,
      {blue_metric} = this.state;

  const config = (type,text1,years,data,func)=>{
        return{

          chart: {
         type : type
       },
          title: {
               text: 'Yearly Average Growth'
           },
           subtitle: {
               text: 'Source: Finance department'
           },
          xAxis: {
            categories: years
          },
          crosshair: true,
          yAxis: {
           min: 0,
           title: {
            text : text1
           }
       },
          series: [{
            name : 'Growth',
          data : data
          }],
          plotOptions: {
              series: {
                  cursor: 'pointer',
                  events: {
                       click:

                              func.bind(this)
                  }
              }
          }
        }
      };
  const config2 = function(data,title,color){
      return {
        chart: {
               type: 'solidgauge',
               height : 260
           },
           title,
           pane: {
               center: ['50%', '50%'],
               size: '50%',
               startAngle: 0,
               endAngle: 360,
               background: {
                   backgroundColor: ( ReactHighcharts.theme &&  ReactHighcharts.theme.background2) || '#f3ecec',
                   innerRadius: '60%',
                   outerRadius: '100%',
                   shape: 'arc'
               }
           },

           tooltip: {
               enabled: false
           },

           yAxis: {
             min: 0,
         max: 100,
         lineWidth: 0,
               stops: [
                  [1, color]
               ],
               lineWidth: 0,
               minorTickInterval: null,
               tickPixelInterval: 400,
               tickWidth: 0,
               title: {
                 text : title,
                   y: -60
               },
               labels: {
                   y: 16
               }
           },

           plotOptions: {
               solidgauge: {
                   dataLabels: {
                       y: -25,
                       borderWidth: 0,
                       useHTML: true
                   }
               }
           },

           series: [{
               name: 'Percent',
               data: [data],
               dataLabels: {
                   format: '<div style="text-align:center"><span style="font-size:20px;color:' +
                       (( ReactHighcharts.theme &&  ReactHighcharts.theme.contrastTextColor) || 'black') + '">{y} %</span><br/>'

               },
               tooltip: {
                   valueSuffix: 'Annual Growth %'
               }
           }]
      }
    }



return(
<div>
  <div className="space-sm" />
<Grid fluid>
  <Row className="show-grid">
    <Col className="user-menu-col" xs={3}>
      <div className="center">
        <Image className="avatar" src="images/avatar.png" responsive/>
      </div>
      <div className="user-name">{DATA.name}</div>
        <Nav bsStyle="pills"  stacked activeKey={3} >
           <NavItem eventKey={1} href="/home"><Glyphicon glyph="plus" />NEUE RECHNUNG</NavItem>
           <NavItem eventKey={2} title="Item"><Glyphicon glyph="euro" />RECHNUNGEN</NavItem>
           <NavItem eventKey={3} title="dashboard"><Glyphicon glyph="align-left" />DASHBOARD</NavItem>
           <NavItem eventKey={2} title="Item"><Glyphicon glyph="barcode" />PRODUKTE</NavItem>
           <NavItem eventKey={2} title="Item"><Glyphicon glyph="user" />KUNDEN</NavItem>
        </Nav>
        <div id="left-info-panel">
          <p>SALDO</p>
          <h1>{((DATA.saldo).toLocaleString('de-DE',{style : "currency" , currency : "EUR"}))}</h1>
          <div className="space-sm"/>
          <p className="center"><span style={{float : 'left'}}>GESENDET :</span><span style={{float:'right'}}>{DATA.gesendet.toLocaleString('de-DE',{style : "currency" , currency : "EUR"})}</span></p>

          <p className="center"><span style={{float : 'left'}}>ÜBERFÄLLIG :</span><span style={{float:'right'}}>{DATA.uberfallig.toLocaleString('de-DE',{style : "currency" , currency : "EUR"})}</span></p>

          <div className="clearfix" />
        </div>
    </Col>
    <Col xs={9}>
    <h1 className="center">DASHBOARD</h1>
    <div className="space-sm" />
      <div className="saldo">
          <p>SALDO :<span id="saldo_amount" > {(DATA.saldo).toLocaleString('de-DE',{style : "currency" , currency : "EUR"})} </span></p>
          </div>
    <Row>
      <Col xs={12} sm={4}>  <ReactHighcharts config={config2(orange_metric,'Orange Index','#FFA500')}></ReactHighcharts></Col>
      <Col xs={12} sm={4}><ReactHighcharts config={config2(gray_metric,'Blue Index','#4863A0')}></ReactHighcharts></Col>
      <Col xs={12} sm={4}>  <ReactHighcharts config={config2(blue_metric,'Gray Index','#444444')}></ReactHighcharts></Col>
    </Row>

      <div className="space-md" />
      <ReactHighcharts config = {config("column","percent",years,percent,this.handleValue)}></ReactHighcharts>
      <div className="sm" />
      <ReactHighcharts config = {config("line","unit",years,units,this.handleValue)}></ReactHighcharts>

      <div className="space-md" />

    </Col>
  </Row>
</Grid>
<div className="space-md"/>
</div>
)
}
}

export default Home;
