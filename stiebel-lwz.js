/* jshint -W097 */ // jshint strict:false
/*jslint node: true */
'use strict';

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

// SENDE DATEN AN ISG
adapter.on('stateChange', function (id, state) {

    // Debug Ausgabe im Log
    const debugging = adapter.config.debugging;

    // Warning, state can be null if it was deleted
    //adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));

    /**
     * SENDE PARAMETER AN ISG
     */

    // https://nodejs.org/api/child_process.html
    const {exec} = require('child_process');

    // Sende Parameter an ISGweb
    var parameter, wert;
    function set_isg_para(isgweburl, parameter, wert) {
        exec('bash /opt/iobroker/node_modules/iobroker.stiebel-lwz/isg_set.sh ' + isgweburl + ' ' + parameter + ' ' + wert, (err, stdout, stderr) => {
            if (err) {
                console.error(err);
                return;
            }
            if (debugging === true) console.log(stdout);
        });
    }

    // BETRIEBSART
    if (id == adapter.name + '.' + adapter.instance + '.Start.Betriebsart') {
        if (debugging === true) adapter.log.info('Setze Betriebsart auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'BETRIEBSART', state.val);
    }
    // LUEFTUNGSSTUFEN
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Lueften.Lueftungsstufen.STUFE_TAG') {
        if (debugging === true) adapter.log.info('Setze Lueftungsstufe STUFE-TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'LUEFTERSTUFETAG', state.val);
    }
    // RAUM TEMP TAG
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Heizen.Raumtemperaturen_HK1.RAUMTEMP_TAG') {
        if (debugging === true) adapter.log.info('Setze Raumtemperaturen_HK1 RAUMTEMP. TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'RAUMTEMPTAG', state.val);
    }
    // WARMWASSER TEMP TAG
    else if (id == adapter.name + '.' + adapter.instance + '.Einstellungen.Warmwasser.WW-Temperaturen.WW_SOLL_TAG') {
        if (debugging === true) adapter.log.info('Setze WW-Temperaturen WW SOLL TAG auf: ' + state.val);
        set_isg_para(adapter.config.isgIP, 'WARMWASSERTEMPTAG', state.val);
    }

});

// is called when databases are connected and adapter received configuration.
adapter.on('ready', function () {
    main();
});

function main() {
    
    // Debug Ausgabe im Log
    const debugging = adapter.config.debugging;

    // TODO: cron? automatischer adapter restart?

    // Ausgabe der eingestellten IP im Log
    if (debugging === true) adapter.log.info('isgIP: ' + adapter.config.isgIP);

    // TODO: Abbruch bei keiner eingetragenen IP
    /*
    if (adapter.config.isgIP === "0.0.0.0") {
        adapter.log.error('Keine IP Adresse eingetragen! Adapterstart wird abgebrochen!');
        fail;
    }
    */

    // LADE cheerioReq
    // https://github.com/IonicaBizau/cheerio-req
    const cheerioReq = require('cheerio-req');

    function getISGwebParameters() {

        /* cheerio & request
        const cheerio = require('cheerio');
        const request = require('request');

        request('http://' + adapter.config.isgIP + '/?s=1,0', function (error, response, body) {

            var $ = cheerio.load(body);

            .....
        }
        */

        // Funktion um die letzten Stellen des Strings zu entfernen: °C || m³/h || Hz || %
        function removeUnit(input, unitLength, unit) {
            if (unit)
                unit.valueOf = unit.toSource = unit.toString = input.substring(input.length - unitLength, input.length);
            var value = input.substring(0, input.length - unitLength);
            value = value.replace(/,/, ".");
            return parseFloat(value);
        }

        function removeSign(input, length, unit) {
            return removeUnit(input, length, unit);
        }

        /**
         * DATENQUELLE: START
         */

        cheerioReq('http://' + adapter.config.isgIP, (err, $) => {
            
            // BETRIEBSART
            var value = $('input#aval39').val();
            adapter.setState('Start.Betriebsart', value, true);
            if (debugging === true) adapter.log.info('BETRIEBSART: ' + value);

            // SYSTEMSTATUS
            var value = $('#box_start_status_system div > p.info').text().trim();
            adapter.setState('Start.Systemstatus', value, true);
            if (debugging === true) adapter.log.info('SYSTEMSTATUS: ' + value);

            // PORTALSTATUS Letzter Kontakt
            var value = $('#box_start_status_portal div p').eq(0).text().trim();
            adapter.setState('Start.Portalstatus_letzter_Kontakt', value, true);
            if (debugging === true) adapter.log.info('PORTALSTATUS: ' + value);

            // PORTALSTATUS Schlüssel
            var value = $('#box_start_status_portal div > p.info').text().trim();
            adapter.setState('Start.Portalstatus_Schluessel', value, true);
            if (debugging === true) adapter.log.info('PORTALSTATUS: ' + value);
            
            // ISGweb VERSION
            var value = $('#versionsNummer').text().trim();
            adapter.setState('Start.ISGwebVersion', value, true);
            if (debugging === true) adapter.log.info('ISGwebVersion: ' + value);

            // LUEFTERSTUFE fuer DP zum setzen der Luefterstufe --> Später 4,2
            // ==> AUS JS auslesen
            //var value = $('#versionsNummer').text().trim();
            /*
            <script type="text/javascript" language="javascript">
                var valSettings = new Array();
            var jsvalues = new Array();
            var jsobj;
                jsobj = new Array();
            jsobj['id']='val14a';
            jsobj['val']='21,0';
            jsvalues.push(jsobj);
            valSettings['val5'] = new Array();
            valSettings['val5']['type'] = 'float';
            valSettings['val5']['min'] = '10';
            valSettings['val5']['max'] = '30';
            jsobj = new Array();
            jsobj['id']='val5info';
            jsobj['val']='17,0';
            jsvalues.push(jsobj);
            jsobj = new Array();
            jsobj['id']='val11a';
            jsobj['val']='44,7';
            jsvalues.push(jsobj);
            valSettings['val17'] = new Array();
            valSettings['val17']['type'] = 'float';
            valSettings['val17']['min'] = '10';
            valSettings['val17']['max'] = '55';
            jsobj = new Array();
            jsobj['id']='val17info';
            jsobj['val']='44,0';
            jsvalues.push(jsobj);
            jsobj = new Array();
            jsobj['id']='val82a';
            jsobj['val']='1';
            jsvalues.push(jsobj);
            valSettings['val82'] = new Array();
            valSettings['val82']['type'] = 'float';
            valSettings['val82']['min'] = '0';
            valSettings['val82']['max'] = '3';
            jsobj = new Array();
            jsobj['id']='val82info';
            jsobj['val']='1';                  <================================== HIER
            jsvalues.push(jsobj);
            </script>
            */

        });
        
        /**
         * DATENQUELLE: INFO -> ANLAGE
         */

        cheerioReq('http://' + adapter.config.isgIP + '/?s=1,0', (err, $) => {

            var d = $("td.value");

            //console.log('tds: ' + d);

            // The parseFloat() function parses a string and returns a floating point number.
            // The text property sets or returns the text of an option element.
            // The trim() method removes whitespace from both sides of a string.
            // The .eq() selector selects an element with a specific index number. The index numbers start at 0, so the first element will have the index number 0 (not 1).

            var parameter, select, dp;
            function setStateRemoveUnits(parameter, select, dp) {
                var value = d.eq(select).text().trim();
                //adapter.log.info(parameter + ': ' + value);
                value = removeSign(value, 2);
                if (isNaN(value)) value = 0;
                if (debugging === true) adapter.log.info(parameter + ': ' + value);
                adapter.setState(dp, value, true);
            }

            // RAUMTEMPERATUR
            setStateRemoveUnits('RAUMISTTEMP_HK1', 0, 'Info.Anlage.Raumtemperatur.RAUMISTTEMP_HK1')
            setStateRemoveUnits('RAUMSOLLTEMP_HK1', 1, 'Info.Anlage.Raumtemperatur.RAUMSOLLTEMP_HK1')
            setStateRemoveUnits('RAUMFEUCHTE_HK1', 2, 'Info.Anlage.Raumtemperatur.RAUMFEUCHTE_HK1')
            setStateRemoveUnits('RAUMISTTEMP_HK2', 3, 'Info.Anlage.Raumtemperatur.RAUMISTTEMP_HK2')
            setStateRemoveUnits('RAUMSOLLTEMP_HK2', 4, 'Info.Anlage.Raumtemperatur.RAUMSOLLTEMP_HK2')
            setStateRemoveUnits('RAUMFEUCHTE_HK2', 5, 'Info.Anlage.Raumtemperatur.RAUMFEUCHTE_HK2')

            // HEIZEN
            setStateRemoveUnits('AUSSENTEMPERATUR', 6, 'Info.Anlage.Heizen.AUSSENTEMPERATUR')
            setStateRemoveUnits('ISTWERT_HK1', 7, 'Info.Anlage.Heizen.ISTWERT_HK1')
            setStateRemoveUnits('SOLLWERT_HK1', 8, 'Info.Anlage.Heizen.SOLLWERT_HK1')
            setStateRemoveUnits('ISTWERT_HK2', 9, 'Info.Anlage.Heizen.ISTWERT_HK2')
            setStateRemoveUnits('SOLLWERT_HK2', 10, 'Info.Anlage.Heizen.SOLLWERT_HK2')
            setStateRemoveUnits('VORLAUFTEMPERATUR', 11, 'Info.Anlage.Heizen.VORLAUFTEMPERATUR')
            setStateRemoveUnits('RUECKLAUFTEMPERATUR', 12, 'Info.Anlage.Heizen.RUECKLAUFTEMPERATUR')

            // WARMWASSER
            setStateRemoveUnits('WW_ISTTEMP', 13, 'Info.Anlage.Warmwasser.WW_ISTTEMP')
            setStateRemoveUnits('WW_SOLLTEMP', 14, 'Info.Anlage.Warmwasser.WW_SOLLTEMP')
            
            // LÜFTEN
            setStateRemoveUnits('ZULUFT_IST_LUEFTERDREHZAHL', 15, 'Info.Anlage.Lueften.ZULUFT_IST_LUEFTERDREHZAHL')
            setStateRemoveUnits('ZULUFT_SOLL_VOLUMENSTROM', 16, 'Info.Anlage.Lueften.ZULUFT_SOLL_VOLUMENSTROM')
            setStateRemoveUnits('ABLUFT_IST_LUEFTERDREHZAHL', 17, 'Info.Anlage.Lueften.ABLUFT_IST_LUEFTERDREHZAHL')
            setStateRemoveUnits('ABLUFT_SOLL_VOLUMENSTROM', 18, 'Info.Anlage.Lueften.ABLUFT_SOLL_VOLUMENSTROM')

            // WÄRMEERZEUGER
            setStateRemoveUnits('HEIZSTUFE', 19, 'Info.Anlage.Waermeerzeuger.HEIZSTUFE')

        }); // end of cheerioReq()

        /**
         * DATENQUELLE: INFO -> WAERMEPUMPE
         */
        
        cheerioReq('http://' + adapter.config.isgIP + '/?s=1,1', (err, $) => {

            var d = $("td.value");

            var parameter, select, dp;
            function setStateRemoveUnits(parameter, select, dp) {
                var value = d.eq(select).text().trim();
                //adapter.log.info(parameter + ': ' + value);
                value = removeSign(value, 2);
                if (debugging === true) adapter.log.info(parameter + ': ' + value);
                if (isNaN(value)) value = 0;
                adapter.setState(dp, value, true);
            }

            // PROZESSWERTE
            setStateRemoveUnits('HEISSGASTEMPERATUR', 0, 'Info.Waermepumpe.Prozesswerte.HEISSGASTEMPERATUR')
            setStateRemoveUnits('VERDAMPFERTEMP', 1, 'Info.Waermepumpe.Prozesswerte.VERDAMPFERTEMP')
            setStateRemoveUnits('VERFLUESSIGERTEMP', 2, 'Info.Waermepumpe.Prozesswerte.VERFLUESSIGERTEMP')
            setStateRemoveUnits('FORTLUFT_IST_LUEFTERDREHZAHL', 3, 'Info.Waermepumpe.Prozesswerte.FORTLUFT_IST_LUEFTERDREHZAHL')
            setStateRemoveUnits('FORTLUFT_SOLL_VOLUMENSTROM', 4, 'Info.Waermepumpe.Prozesswerte.FORTLUFT_SOLL_VOLUMENSTROM')

            // WAERMEMENGEN
            setStateRemoveUnits('WM_HEIZEN_TAG', 5, 'Info.Waermepumpe.Waermemengen.WM_HEIZEN_TAG')
            setStateRemoveUnits('WM_HEIZEN_SUMME', 6, 'Info.Waermepumpe.Waermemengen.WM_HEIZEN_SUMME')
            setStateRemoveUnits('WM_WW_TAG', 7, 'Info.Waermepumpe.Waermemengen.WM_WW_TAG')
            setStateRemoveUnits('WM_WW_SUMME', 8, 'Info.Waermepumpe.Waermemengen.WM_WW_SUMME')
            setStateRemoveUnits('WM_NE_HEIZEN_SUMME', 9, 'Info.Waermepumpe.Waermemengen.WM_NE_HEIZEN_SUMME')
            setStateRemoveUnits('WM_NE_WW_SUMME', 10, 'Info.Waermepumpe.Waermemengen.WM_NE_WW_SUMME')
            setStateRemoveUnits('WM_WRG_TAG', 11, 'Info.Waermepumpe.Waermemengen.WM_WRG_TAG')
            setStateRemoveUnits('WM_WRG_SUMME', 12, 'Info.Waermepumpe.Waermemengen.WM_WRG_SUMME')

            // LEISTUNGSAUFNAHME
            setStateRemoveUnits('P_HEIZUNG_TAG', 13, 'Info.Waermepumpe.Leistungsaufnahme.P_HEIZUNG_TAG')
            setStateRemoveUnits('P_HEIZUNG_SUMME', 14, 'Info.Waermepumpe.Leistungsaufnahme.P_HEIZUNG_SUMME')
            setStateRemoveUnits('P_WW_TAG', 15, 'Info.Waermepumpe.Leistungsaufnahme.P_WW_TAG')
            setStateRemoveUnits('P_WW_SUMME', 16, 'Info.Waermepumpe.Leistungsaufnahme.P_WW_SUMME')

            // LAUFZEITEN
            setStateRemoveUnits('VERDICHTER_HEIZEN', 17, 'Info.Waermepumpe.Laufzeiten.VERDICHTER_HEIZEN')
            setStateRemoveUnits('VERDICHTER_WW', 18, 'Info.Waermepumpe.Laufzeiten.VERDICHTER_WW')
            setStateRemoveUnits('ELEKTR_NE_HEIZEN', 19, 'Info.Waermepumpe.Laufzeiten.ELEKTR_NE_HEIZEN')
            setStateRemoveUnits('ELEKTR_NE_WW', 20, 'Info.Waermepumpe.Laufzeiten.ELEKTR_NE_WW')

        }); // end of cheerioReq()
        

    } // end of getISGwebParameters()

    if (adapter.config.loadISGwebParameters === true) {
        getISGwebParameters();
    }

    // in this stiebel-lwz all states changes inside the adapters namespace are subscribed
    adapter.subscribeStates('*');

    setTimeout(function () {
        getISGwebParameters();
        adapter.stop();
    }, 10000);


} // end of main()