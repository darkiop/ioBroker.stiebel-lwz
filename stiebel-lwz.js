/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';

// https://nodejs.org/api/child_process.html
const { exec } = require('child_process');
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

    var parameter, wert;
    function set_isg_para(isgweburl, parameter, wert) {
        exec('bash /opt/iobroker/node_modules/iobroker.stiebel-lwz/isg_set.sh ' + isgweburl + ' ' + parameter + ' ' + wert, (err, stdout, stderr) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(stdout);
        });
    }

    // TODO Werte validieren
    if (id == adapter.name + '.' + adapter.instance + '.ISG_SET_BETRIEBSART') {
        adapter.log.info('Setze ISG_SET_BETRIEBSART auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'BETRIEBSART', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.ISG_SET_LUEFTERSTUFETAG') {
        adapter.log.info('Setze ISG_SET_LUEFTERSTUFETAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'LUEFTERSTUFETAG', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.ISG_SET_RAUMTEMPTAG') {
        adapter.log.info('Setze ISG_SET_RAUMTEMPTAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'RAUMTEMPTAG', state.val);
    } else if (id == adapter.name + '.' + adapter.instance + '.ISG_SET_WARMWASSERTEMPTAG') {
        adapter.log.info('Setze ISG_SET_WARMWASSERTEMPTAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'WARMWASSERTEMPTAG', state.val);
    }

});

// is called when databases are connected and adapter received configuration.
adapter.on('ready', function () {
    main();
});

function main() {

    adapter.log.info('isgIP: ' + adapter.config.isgIP);

    //var isgParameters = ['ISG_SET_BETRIEBSART', 'ISG_SET_LUEFTERSTUFETAG', 'ISG_SET_RAUMTEMPTAG', 'ISG_SET_WARMWASSERTEMPTAG'];
    var isgParameters = ['ISG_SET_LUEFTERSTUFETAG', 'ISG_SET_RAUMTEMPTAG', 'ISG_SET_WARMWASSERTEMPTAG'];

    // Betriebsart
    adapter.setObjectNotExists("ISG_SET_BETRIEBSART", {
        type: "state",
        common: {
            name: "ISG_SET_BETRIEBSART",
            type: "string",
            role: "value",
            read: true,
            write: true,
            desc: "",
            states: {
                "AUTOMATIK": "Automatik",
                "WARMWASSER": "Warmwasser"
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