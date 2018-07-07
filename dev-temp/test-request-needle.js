// NODE_DEBUG=request node test-request.js

/* jshint -W097 */ // jshint strict:false
/*jslint node: true */
'use strict';

// https://github.com/danwrong/Restler/

function set_isg_para() {

    // data=[{"name":"val39s","value":"11"}]

    var needle = require('needle');

    var isgdata = {
        data: {
            name: 'val39s',
            value: 11
        }
    }

    needle.post('http://isg/save.php', isgdata, {
        compressed: true,
        content_type: 'application/x-www-form-urlencoded',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0'
    }, function (err, resp, body) {
        console.log(body);
    });

};

set_isg_para();