/*==========================
demo.js  http://plugins.jquery.com/soap/ or https://github.com/doedje/jquery.soap
part of the jQuery.soap distribution version: 1.3.6

this file contains the javascript for the jQuery.soap demo
===========================*/

$(document).ready(function() {
	$('#test').click(function(e) {
		// stop the form to be submitted...
		e.preventDefault();
		var data = $('#params').val();
		if ($('#paramsType').val() == 'json') {
			data = eval("("+data+")");
		}

		var wss;
		if ($('#enableWSS').prop('checked')) {
			wss = {
				username: $('#wssUsername').val(),
				password: $('#wssPassword').val(),
				nonce: 'aepfhvaepifha3p4iruaq349fu34r9q',
				created: new Date().getTime()
			};
		}

		$.soap({
			url: $('#url').val(),
			method: $('#method').val(),

			appendMethodToURL: $('#appendMethodToURL').prop('checked'),
			SOAPAction: $('#SOAPAction').val(),
			soap12: $('#soap12').prop('checked'),
			async: $('#async').prop('checked'),

			data: data,
			wss: wss,

			HTTPHeaders: {
				Authorization: 'Basic ' + btoa('test:test')
			},

			namespaceQualifier:  $('#namespaceQualifier').val(),
			namespaceURL: $('#namespaceURL').val(),
			noPrefix: $('#noPrefix').prop('checked'),
			elementName: $('#elementName').val(),

			enableLogging: $('#enableLogging').prop('checked'),

			beforeSend: function(SOAPEnvelope) {
				var out = dom2html($.parseXML(SOAPEnvelope.toString()).firstChild);
				$('#request').text(out);
			},
			success: function(SOAPResponse) {
				$('#feedbackHeader').html('Success!');
				$('#feedback').text(SOAPResponse.toString());
			},
			error: function(SOAPResponse) {
				$('#feedbackHeader').html('Error!');
				$('#feedback').text(SOAPResponse.toString());
			}
		});
	});
});

function dom2html(xmldom, tabcount) {
	var whitespace = /^\s+$/;
	var tabs = '  ';
	var xmlout = [];
	tabcount = (tabcount) ? tabcount : 0;

	xmlout.push('<', xmldom.nodeName);
	for (var i in xmldom.attributes) {
		var attribute = xmldom.attributes[i];
		if (attribute.nodeType === 2) {
			xmlout.push(' ', attribute.name, '="', attribute.value, '"');
		}
	}
	xmlout.push('>\n');
	++tabcount;
	for (var j in xmldom.childNodes) {
		var child = xmldom.childNodes[j];
		if (child.nodeType === 1) {
			xmlout.push(repeat(tabs, tabcount), dom2html(child, tabcount));
		}
		if (child.nodeType === 3 && !whitespace.test(child.nodeValue)) {
			xmlout.push(child.nodeValue);
		}
	}
	xmlout.push(repeat(tabs, --tabcount), '</', xmldom.nodeName, '>\n');
	return xmlout.join('');
}
function repeat(x, n) {
	var s = '';
	for (;;) {
		if (n & 1) s += x;
		n >>= 1;
		if (n) x += x;
		else break;
	}
	return s;
}