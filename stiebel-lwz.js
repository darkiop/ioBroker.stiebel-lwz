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

    // Sende Parameter an ISGweb
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

    // BETRIEBSART
    if (id == adapter.name + '.' + adapter.instance + '.Start.Betriebsart') {
        adapter.log.info('Setze Betriebsart auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'BETRIEBSART', state.val);
    }
    // LUEFTUNGSSTUFEN
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Lueften.Lueftungsstufen.STUFE_TAG') {
        adapter.log.info('Setze Lueftungsstufe STUFE-TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'LUEFTERSTUFETAG', state.val);
    }
    // RAUM TEMP TAG
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Heizen.Raumtemperaturen_HK1.RAUMTEMP_TAG') {
        adapter.log.info('Setze Raumtemperaturen_HK1 RAUMTEMP. TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'RAUMTEMPTAG', state.val);
    }
    // WARMWASSER TEMP TAG
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Warmwasser.WW-Temperaturen.WW_SOLL_TAG') {
        adapter.log.info('Setze WW-Temperaturen WW SOLL TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'WARMWASSERTEMPTAG', state.val);
    }

});

// is called when databases are connected and adapter received configuration.
adapter.on('ready', function () {
    main();
});

function main() {

    // Ausgabe der eingestellten IP im Log
    adapter.log.info('isgIP: ' + adapter.config.isgIP);
    
    // https://github.com/IonicaBizau/cheerio-req    
    const cheerioReq = require("cheerio-req");

    // Lade aktuelle Betriebsart bei Start in Objekt
    function load_isg_parameters() {

        // BETRIEBSART
        cheerioReq('http://' + adapter.config.isgIP, (err, $) => {
            var betriebsart = $('input#aval39').val();
            adapter.setState('Start.Betriebsart', betriebsart, true);
            adapter.log.info('Aktuelle Betriebsart:' + betriebsart);
        });

    }
    
    if(adapter.config.loadISGwebParameters === true){
        load_isg_parameters();
    }

    // in this stiebel-lwz all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');

} // end of main()