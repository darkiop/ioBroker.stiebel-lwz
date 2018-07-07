// NODE_DEBUG=request node test-request.js

/* jshint -W097 */ // jshint strict:false
/*jslint node: true */
'use strict';

// https://github.com/danwrong/Restler/

function set_isg_para() {

    // data=[{"name":"val39s","value":"11"}]

    var restler = require('restler');

    restler.post("http://isg/save.php", {
        data: {
            'name': 'val39s',
            'value': 11
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
    }).on('complete', function (data) {
        console.log(data);
    });

};

set_isg_para();