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

function groupIncidentsByAttribute(incidents, attribute, optional_filter) {
  if (optional_filter) {
    incidents = _.filter(incidents, function(incident){
      return incident['OFFENSE_CATEGORY_ID'] !== optional_filter
    })
  }

  return _.chain(incidents)
          .filter(function(incident) { return incident[attribute]; })
          .groupBy(function(incident) { return incident[attribute]; })
          .map(function(value, key) { return [key, value.length]; })
          .sortBy(function(countByAddress) { return -countByAddress[1]; })
          .slice(0, 5)
          .value();
}

var trafficObjects = parseData('traffic-accidents');
var incidentsByAddress = groupIncidentsByAttribute(trafficObjects, 'INCIDENT_ADDRESS');
var incidentsByNeighborhood = groupIncidentsByAttribute(trafficObjects, 'NEIGHBORHOOD_ID');
console.log(incidentsByAddress);
console.log(incidentsByNeighborhood);

var crimeObjects = parseData('crime');
var crimesByNeighborhood = groupIncidentsByAttribute(crimeObjects, 'NEIGHBORHOOD_ID', 'traffic-accident');
console.log(crimesByNeighborhood);

console.timeEnd('entire process');
