/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// https://nodejs.org/api/child_process.html
// https://github.com/request/request
const { exec } = require('child_process');
var request = require('request');

var utils = require(__dirname + '/lib/utils'); // Get common adapter utils
var adapter = new utils.Adapter('stiebel-lwz');

// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {

    // Warning, state can be null if it was deleted
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    // TODO array mit Parameter-Namen aus ISGweb und Namen für ioBroker-DP
    // ==> https://www.w3schools.com/js/js_arrays.asp

    // paramaters can be found in isg_web_parameters.md
    function set_isg_para(parameter, value) {
        var options = {
            url: 'http://' + adapter.config.isgIP + '/save.php',
            method: 'POST',
            form: {
                'data': parameter,
                'value': value
            },
            headers: {
                'Host': 'isg',                                                  // TODO adapter.config.isgIP ?
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0',
                'Accept': 'text/plain, */*; q=0.01',
                'Accept-Language': 'de,en-US;q=0.7,en;q=0.3',
                'Referer': 'http://isg/',                                       // TODO adapter.config.isgIP ?
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Connection': 'keep-alive',
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache'
            }
        };
        request(options);
        adapter.log.info('parameter:' + parameter + '| value:' + value);
    };

    // TODO Werte validieren bevor übertragen wird
    // ==> ggf. schon bei Anlage ioBroker DP?
    if (id == adapter.name + '.' + adapter.instance + '.Start.Betriebsart') {
        adapter.log.info('Setze Betriebsart auf: ' + state.val);
        set_isg_para('val39s', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Lueften.Lueftungsstufen.Luefterstufe_Tag') {
        adapter.log.info('Setze Luefterstufe_Tag auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'LUEFTERSTUFETAG', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Heizen.Raumtemperaturen_HK1.Raumtemp_Tag') {
        adapter.log.info('Setze Raumtemp_Tag auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'RAUMTEMPTAG', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Warmwasser.WW-Temperaturen.Warmwassertemp_Tag') {
        adapter.log.info('Setze Warmwassertemp_TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'WARMWASSERTEMPTAG', state.val);
    }

}); // end of adapter.on('stateChange', function (id, state) {

// is called when databases are connected and adapter received configuration.
adapter.on('ready', function () {
    main();
});

function main() {

    adapter.log.info('ISGweb Hostname / IP: ' + adapter.config.isgIP);

    var isgParameters = [
        'Einstellungen.Lueften.Lueftungsstufen.Luefterstufe_Tag',
        'Einstellungen.Heizen.Raumtemperaturen_HK1.Raumtemp_Tag',
        'Einstellungen.Warmwasser.WW-Temperaturen.Warmwassertemp_Tag'
    ];

    // Betriebsart
    adapter.setObjectNotExists("Start.Betriebsart", {
        type: "state",
        common: {
            name: "Betriebsart",
            type: "string",
            role: "value",
            read: true,
            write: true,
            desc: "",
            states: {
                "AUTOMATIK": "Automatik",           // 11
                "WARMWASSER": "Warmwasser",         // 5
                11: "Automatik_Test",
                5: "Warmwasser_Test"                
                /*
                "BEREITSCHAFT": "Bereitschaft",     // 1
                "TAGBETRIEB": "Tagbetrieb",         // 3
                "ABSENKBETRIEB": "Absenkbetrieb",   // 4
                "HANDBETRIEB": "Handbetrieb",       // 14
                "NOTBETRIEB": "Notbetrieb"          // 0
                */
            }
        },
        native: {}
    });

    for (var key in isgParameters) {
        
        var obj = isgParameters[key];
        
        adapter.setObjectNotExists(isgParameters[key], {
            type: 'state',
            common: {
                name: isgParameters[key],
                type: 'string',
                role: 'value'
            },
            native: {}
        });

      }
       
    // in this stiebel-lwz all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');

}