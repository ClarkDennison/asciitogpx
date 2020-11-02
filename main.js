const https = require('https')

var builder = require('xmlbuilder');

var obj = { gpx: { '@xmlns': 'http://www.topografix.com/GPX/1/1'} };

var obj = builder.create('gpx')
	.att('xmlns', 'http://www.topografix.com/GPX/1/1')
	.att('version', '1.1')
	.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
	.att('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');

// add each waypoint
var wpt = obj.ele('wpt');
wpt.att('lat', '25.1');
wpt.att('lon', '-80.1');

const options = {
  hostname: 'ocean.weather.gov',
  port: 443,
  path: '/gulf_stream_latest.txt',
  method: 'GET'
}

const req = https.request(options, res => {
  console.log(`statusCode: ${res.statusCode}`)

  let body = [];	
  res.on('data', d => {
    body.push(d);
//    var parts = d.split(':');
//    console.log(parts[1]);
//    console.log(parts[3]);
//    var xml = obj.end({ pretty: true});
//    console.log(xml);
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    var parts = body.split(':');
    
    let northWallwpts = parts[1].split('GULF');
//    console.log(northWallwpts[0]);
    northWallwpts = northWallwpts[0].split(' ');
    
    let southWallwpts = parts[2].split('2.  ');
//    console.log(southWallwpts[0]);
    southWallwpts = southWallwpts[0].split(' ');

    for(var i = 0; i < northWallwpts.length; i++){
      var match = /\r|\n/.exec(northWallwpts[i]);	    
      if (!match && northWallwpts[i] != " " && northWallwpts[i] != null){
	 let latLong = northWallwpts[i].split('N');
// add each waypoint
	 var wpt = obj.ele('wpt');
	 wpt.att('lat', latLong[0]);
	 wpt.att('lon', '-' + latLong[1].replace("W", ""));
	 
	 var name = wpt.ele('name', 'Gulf North Wall ' + i);
      }
    }
		  
    for(var i = 0; i < southWallwpts.length; i++){
      var match = /\r|\n/.exec(southWallwpts[i]);	    
      if (!match && southWallwpts[i] != " " && southWallwpts[i] != null){
	 let latLong =southWallwpts[i].split('N');
// add each waypoint
	 var wpt = obj.ele('wpt');
	 wpt.att('lat', latLong[0]);
	 wpt.att('lon', '-' + latLong[1].replace("W", ""));	 

	 var name = wpt.ele('name', 'Gulf South Wall ' + i);
      }
    }

    var xml = obj.end({ pretty: true});
    console.log(xml);
//    console.log(parts[1]);
//    console.log(parts[2]);
  })	
})

req.on('error', error => {
  console.error(error)
})

req.end()

// add each waypoint
var wpt = obj.ele('wpt');
wpt.att('lat', '25.1');
wpt.att('lon', '-80.1');

