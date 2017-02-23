'use strict';

const fs = require('fs');

var data = fs.readFileSync('./me_at_the_zoo.in').toString().split("\n");
for (var i = data.length - 1; i >= 0; i--) {
	data[i] = data[i].split(' ').map(parseFloat);
}

var videoCount = data[0][0];
var endPointCount = data[0][1];
var requetCount = data[0][2];
var cacheCount = data[0][3];
var cacheSize = data[0][4];


var videoSizes = [];

for (var i=0; i<data[1].length; i++){
	videoSizes.push(data[1][i]);
}

var endPoints = [];


var row = 2;


for(var i=0; i<endPointCount; i++){
	endPoints.push({data:0, cache:[], request:[]});


	endPoints[i].data = data[row][0];
	for(var j=data[row][1]; j>0; j--){
		endPoints[i].cache.push({ id:data[row+j][0], lat:data[row+j][1] });
	}

	endPoints[i].cache.sort(  (a, b)=> (a.lat-b.lat) );

	row += data[row][1] + 1;

}

var newRow;
for (var i=0; i<requetCount; i++){

	newRow = row + i;

	endPoints[data[newRow][1]].request.push( {id:data[newRow][0], count:data[newRow][2]});

}

for (var i=0; i<endPointCount; i++){
	endPoints[i].request.sort(  (a, b)=>(b.count-a.count) );

}

