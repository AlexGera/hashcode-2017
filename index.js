'use strict';

const fs = require('fs');

var fileNames = ['./me_at_the_zoo.in', './videos_worth_spreading.in', './trending_today.in', './kittens.in'];

var data = fs.readFileSync(fileNames[0]).toString().split("\n");
for (var i = data.length - 1; i >= 0; i--) {
	data[i] = data[i].split(' ').map(parseFloat);
}


//read task size
var videoCount = data[0][0];
var endPointCount = data[0][1];
var requetCount = data[0][2];
var cacheCount = data[0][3];
var cacheSize = data[0][4];


//read video size
var videoSizes = [];
for (var i=0; i<data[1].length; i++){
	videoSizes.push(data[1][i]);
}


//read endpoint caches
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

//read request count
var newRow;
for (var i=0; i<requetCount; i++){

	newRow = row + i;

	if (videoSizes[data[newRow][0]] > cacheSize){data[newRow][2] = 0;}

	endPoints[data[newRow][1]].request.push( {id:data[newRow][0], count:data[newRow][2]});

}

//sort request by count
for (var i=0; i<endPointCount; i++){
	endPoints[i].request.sort(  (a, b)=>(b.count - a.count) );
	//console.log(endPoints[i].request);
}

var cacheToEndPoint = [];

for (var i=0; i<cacheCount; i++){
	cacheToEndPoint.push([]);	
}

for (var i=0; i<endPointCount; i++){
	for (var j=endPoints[i].cache.length - 1; j>=0; j--){
			cacheToEndPoint[endPoints[i].cache[j].id].push(i);
	}
}

//console.log(cacheToEndPoint);

var videoToCache = [];
for (var i=0; i<videoCount; i++){
	videoToCache.push([]);	

	for (var j=0; j<cacheCount; j++){
		videoToCache[i].push({ id:j, count:0, time:0, size:videoSizes[i]});

		for (var k = cacheToEndPoint[j].length - 1; k>=0; k--){
			for (var x = endPoints[cacheToEndPoint[j][k]].request.length - 1; x>=0; x--){
				if (endPoints[cacheToEndPoint[j][k]].request[x].id == i){
					videoToCache[i][j].count += endPoints[cacheToEndPoint[j][k]].request[x].count;

					for (var y = endPoints[cacheToEndPoint[j][k]].cache.length - 1; y>=0; y--){
						if (endPoints[cacheToEndPoint[j][k]].cache[y].id == j){
							videoToCache[i][j].time += ( endPoints[cacheToEndPoint[j][k]].data - endPoints[cacheToEndPoint[j][k]].cache[y].lat) * endPoints[cacheToEndPoint[j][k]].request[x].count;
							break;
						}
					}
					break;
				}
			}
		}
	}


	videoToCache[i].sort( (a, b)=> (b.time - a.time));
	for (var j=videoToCache[i].length -1; j>=0; j--){
		if (videoToCache[i][j].count < 1){
			videoToCache[i].pop();
		}
		else{ break;}
	}

	//console.log(videoToCache[i]);
}

var videoToCacheAssoc = [];

for (var i=0; i<videoCount; i++){
	videoToCacheAssoc.push({vid:i, nodes:videoToCache[i]});
}

videoToCacheAssoc.sort( function (a, b) {
	if ( (a.nodes.length + b.nodes.length) == 0){return 0;}
	else if (a.nodes.length == 0){ return 1;}
	else if (b.nodes.length == 0){ return -1;}
	else{ return b.nodes[0].time - a.nodes[0].time;}
})

//console.log(videoToCacheAssoc);