// NODE_DEBUG=request node test-request.js

/* jshint -W097 */ // jshint strict:false
/*jslint node: true */
'use strict';

// https://github.com/request/request
var request = require('request');

function set_isg_para() {

    var options = {
        url: 'http://isg/save.php',
        method: 'POST',
        data: { //   --data-urlencode "data=[{\"name\":\"$1\",\"value\":\"$2\"}]"   
            'name': 'val39s', // TEST, normal: parameter
            'value': '11' // TEST, normal: value
        },
        headers: {
            'Host': 'isg',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
            'Accept': 'text/plain, */*; q=0.01',
            'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
            'Referer': 'http://isg/',
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Connection': 'keep-alive',
            'Pragma': 'no-cache',
            'Cache-Control': 'no-cache'
        },
        gzip: true,
        jar: true
    };

    function callback(err, res, body) {
        console.log('REQUEST RESULTS:', err, res.statusCode, body);
    }

    request(options, callback);

};

set_isg_para();