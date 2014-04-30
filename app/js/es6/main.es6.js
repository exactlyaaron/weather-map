/* global google:true */
/* jshint unused:false */
/* jshint camelcase:false */
/* global AmCharts:true */


(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    initMap(36, -86, 3);
    $('#add').click(add);
  }

  var map;
  function initMap(lat, lng, zoom){
    let styles = [{'featureType':'water','stylers':[{'color':'#46bcec'},{'visibility':'on'}]},{'featureType':'landscape','stylers':[{'color':'#f2f2f2'}]},{'featureType':'road','stylers':[{'saturation':-100},{'lightness':45}]},{'featureType':'road.highway','stylers':[{'visibility':'simplified'}]},{'featureType':'road.arterial','elementType':'labels.icon','stylers':[{'visibility':'off'}]},{'featureType':'administrative','elementType':'labels.text.fill','stylers':[{'color':'#444444'}]},{'featureType':'transit','stylers':[{'visibility':'off'}]},{'featureType':'poi','stylers':[{'visibility':'off'}]}];

    let mapOptions = {center: new google.maps.LatLng(lat, lng), zoom: zoom, mapTypeId: google.maps.MapTypeId.ROADMAP, styles: styles};
    map = new google.maps.Map(document.getElementById('map'), mapOptions);

    var cloudLayer = new google.maps.weather.CloudLayer();
    cloudLayer.setMap(map);
  }

  function add(){
    var place = $('#place').val().trim();
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({address: place}, (results, status)=>{

      let name = results[0].formatted_address;
      let lat = results[0].geometry.location.lat();
      let lng = results[0].geometry.location.lng();
      let icon = './media/flag.png';

      addMarker(lat,lng,name, icon);

      let latLng = new google.maps.LatLng(lat, lng);
      map.setCenter(latLng);
      map.setZoom(5);
      getWeather(place, name);
    });

    $('#location').val('');
    $('#location').focus();
  }

  function addMarker(lat, lng, name, icon){
    let latLng = new google.maps.LatLng(lat, lng);
    new google.maps.Marker({map: map, position: latLng, title: name});
  }

  function getWeather(place, name){

    var url = 'http://api.wunderground.com/api/bd42f70292516b80/forecast10day/q/'+place+'.json?callback=?';

    $.getJSON(url, data=>{
      $('#charts').prepend(`<div class="chartdiv" data-place=${place}>`);
      generateChart(place);
      //populateChart(data);
      data.forecast.simpleforecast.forecastday.forEach(f=>chart[place].dataProvider.push({day: f.date.weekday,lowtemp: f.low.fahrenheit,hightemp: f.high.fahrenheit}));
      $('.chartdiv[data-place="'+place+'"]').prepend(`<h2>${name}</h2>`);
      chart[place].validateData();
    });
  }

  var chart;
  var chartData;
  function generateChart(place){
      chart = $(`.chartdiv[data-place=${place}]`)[0];
      chartData = [];
      chart[place] = AmCharts.makeChart(chart, {
          'type': 'serial',
          'theme': 'light',
          'pathToImages': 'http://www.amcharts.com/lib/3/images/',
          'legend': {
            'useGraphSettings': true
          },
          'dataProvider': chartData,
          'valueAxes': [{
              'axisAlpha': 0.2,
              'dashLength': 1,
              'position': 'left'
          }],
          'graphs': [{
              'id':'g1',
              'balloonText': 'High Temp<br /><b><span style=\'font-size:14px;\'>value: [[value]]</span></b>',
              'bullet': 'round',
              'bulletBorderAlpha': 1,
      		    'bulletColor':'#FFFFFF',
              'hideBulletsCount': 50,
              'title': 'Highs',
              'valueField': 'hightemp',
      		    'useLineColorForBulletBorder':true
          }, {
              'id':'g2',
              'balloonText': 'Low Temp<br /><b><span style=\'font-size:14px;\'>value: [[value]]</span></b>',
              'bullet': 'round',
              'bulletBorderAlpha': 1,
              'bulletColor':'#FFFFFF',
              'hideBulletsCount': 50,
              'title': 'Lows',
              'valueField': 'lowtemp',
              'useLineColorForBulletBorder':true
          }],
            'chartScrollbar': {
                'autoGridCount': false,
                'graph': 'g1',
                'scrollbarHeight': 10
          },
          'chartCursor': {
              'cursorPosition': 'mouse'
          },
          'categoryField': 'day',
          'categoryAxis': {
              'axisColor': '#DADADA',
              'dashLength': 1,
              'minorGridEnabled': true,
              'labelRotation':30
          },
      	'exportConfig':{
      	  menuRight: '20px',
            menuBottom: '30px',
            menuItems: [{
            icon: 'http://www.amcharts.com/lib/3/images/export.png',
            format: 'png'
            }]
      	}
      });

  }

  // function populateChart(data){
  //
  //   var place = $('#place').val().trim();
  //
  //   var forecast = data.forecast.simpleforecast.forecastday;
  //
  //   for(var i = 0; i < forecast.length; i++){
  //     chart[place].dataProvider.push({
  //       day: forecast[i].date.weekday,
  //       lowtemp: forecast[i].low.fahrenheit,
  //       hightemp: forecast[i].high.fahrenheit
  //     });
  //   }
  //   chart[place].validateData();
  // }



})();
