var builder = require('xmlbuilder');
var builder = require('xmlbuilder');


var obj = { gpx: { '@xmlns': 'http://www.topografix.com/GPX/1/1'} };

var obj = builder.create('gpx')
		.att('xmlns', 'http://www.topografix.com/GPX/1/1')
		.att('version', '1.1')
		.att('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance')
		.att('xsi:schemaLocation', 'http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd');
var wpt = obj.ele('wpt');
wpt.att('lat', '25.1');
wpt.att('lon', '-80.1');
var xml = obj.end({ pretty: true});
console.log(xml);
