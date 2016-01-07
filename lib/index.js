'use strict';

const fs = require('fs');
const _ = require('lodash');

console.time('entire process');

function parseData(file) {
  var trafficData = fs.readFileSync('./data/' + file + '.csv').toString();
  var structuredData = trafficData.trim().split("\r\n").map(function(row) { return row.split(',') });

  var headers = _.first(structuredData);
  var data = _.rest(structuredData);

  return _.map(data, function(dataRow){
    return _.zipObject(headers, dataRow);
  });
}

console.log(parseData('traffic-accidents'));
// console.log(parseData('crime'));

console.timeEnd('entire process');
