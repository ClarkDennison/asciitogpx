require('dotenv').config()
var nodemailer = require("nodemailer"); 

const https = require('https')

var builder = require('xmlbuilder');

fs = require('fs');

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
  }).on('end', () => {
    body = Buffer.concat(body).toString();

    var parts = body.split(':');
    
    var obj = builder.create('gpx', { encoding: 'utf-8' })
	.att('version', '1.1')
	.att('xmlns', 'http://www.topografix.com/GPX/1/1');
//	.att('creator', 'Navionics Boating App');
//	.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
//	.att('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');
//    var metadata = obj.ele('metadata');
//    var link     = metadata.ele('link', { 'href' : 'http://www.navionics.com' } );
    
    var trk = obj.ele('trk');
    var name = trk.ele('name', 'Gulf Stream Track');
    var trkseg = trk.ele('trkseg');

    let northWallwpts = parts[1].split('GULF');
//    console.log(northWallwpts[0]);
    northWallwpts = northWallwpts[0].split(' ');
    
    for(var i = 0; i < northWallwpts.length; i++){
      var match = /\r|\n/.exec(northWallwpts[i]);	    
      if (!match && northWallwpts[i] != " " && northWallwpts[i] != null){
	 let latLong = northWallwpts[i].split('N');
// add each waypoint
	 var trkpt  = trkseg.ele('trkpt');
	 trkpt.att('lat', latLong[0]);
	 trkpt.att('lon', '-' + latLong[1].replace("W", ""));

	 var trkptname = trkpt.ele('ele', '-1'); 
	 var time      = trkpt.ele('time', new Date().toISOString());     
      }
    }

    var trkseg = trk.ele('trkseg');

    let southWallwpts = parts[2].split('2.  ');
//    console.log(southWallwpts[0]);
    southWallwpts = southWallwpts[0].split(' ');

    for(var i = 0; i < southWallwpts.length; i++){
      var match = /\r|\n/.exec(southWallwpts[i]);	    
      if (!match && southWallwpts[i] != " " && southWallwpts[i] != null){
	 let latLong =southWallwpts[i].split('N');
      
// add each waypoint
	 var trkpt  = trkseg.ele('trkpt');
	 trkpt.att('lat', latLong[0]);
	 trkpt.att('lon', '-' + latLong[1].replace("W", ""));

	 var trkptname = trkpt.ele('ele', '-1'); 
	 var time      = trkpt.ele('time', new Date().toISOString());     

      }
    }

    var xml = obj.end({ pretty: true});
    console.log(xml);
  
    fs.writeFile('GulfStream.GPX', xml, function (err) {
	if (err) {
		console.log(err)
	}
    });
  
  })	
})

req.on('error', error => {
  console.error(error)
})

req.end(data => {

  var sender = nodemailer.createTransport({ 
    service: 'gmail', 
    auth: { 
      user: process.env.USERNAME, 
      pass: process.env.PASSWORD
    } 
  }); 
  
  var mail = { 
    from: "pxx.approvals@gmail.com", 
    to: "clark.dennison@gmail.com", 
    subject: "Updated Gulstream track", 
    text: "Attached Gulfstream updates",
    attachments: [
      {
        filename: 'GulfStream.GPX',
        path: __dirname + '/GulfStream.GPX',
        cid: 'uniq-mailtrap.png' 
      }
    ]	
  }; 
  
  sender.sendMail(mail, function(error, info) { 
    if (error) { 
      console.log(error); 
    } else { 
      console.log("Email sent successfully: "
                   + info.response); 
    } 
  });  
})

