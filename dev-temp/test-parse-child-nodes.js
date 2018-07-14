var http = require('http');
var xpath = require('xpath');
var dom = require('xmldom').DOMParser;

var stiebeleltronIP = '192.168.1.73';

/**
 * ioBroker Objekte --> Pfade
 */

var instanz = 'javascript.' + instance;

// START
var pfad_tabelle_start = instanz + '.Start.';

// INFO: Anlage
var pfad_tabelle_raumtemp = instanz + '.Info.Anlage.RAUMTEMPERATUR.';
var pfad_tabelle_warmwasser = instanz + '.Info.Anlage.WARMWASSER.';
var pfad_tabelle_waermeerzeuger = instanz + '.Info.Anlage.WAERMEERZEUGER.';
var pfad_tabelle_heizen = instanz + '.Info.Anlage.HEIZEN.';
var pfad_tabelle_lueften = instanz + '.Info.Anlage.LUEFTEN.';

// INFO: WAERMEPUMPE
var pfad_tabelle_prozesswerte = instanz + '.Info.Waermepumpe.PROZESSWERTE.';
var pfad_tabelle_leistungsaufnahme = instanz + '.Info.Waermepumpe.LEISTUNGSAUFNAHME.';
var pfad_tabelle_waermemengen = instanz + '.Info.Waermepumpe.WAERMEMENGEN.';
var pfad_tabelle_laufzeiten = instanz + '.Info.Waermepumpe.LAUFZEITEN.';

/**
 * ioBroker Objekte --> Datenpunkte
 */

// START
var STATUS = pfad_tabelle_start + 'STATUS';

// Info.Anlage: RAUMTEMPERATUR
var RAUMISTTEMP_HK1 = pfad_tabelle_raumtemp + 'RAUMISTTEMP_HK1';
var RAUMSOLLTEMP_HK1 = pfad_tabelle_raumtemp + 'RAUMSOLLTEMP_HK1';
var RAUMFEUCHTE_HK1 = pfad_tabelle_raumtemp + 'RAUMFEUCHTE_HK1';
var RAUMISTTEMP_HK2 = pfad_tabelle_raumtemp + 'RAUMISTTEMP_HK2';
var RAUMSOLLTEMP_HK2 = pfad_tabelle_raumtemp + 'RAUMSOLLTEMP_HK2';
var RAUMFEUCHTE_HK2 = pfad_tabelle_raumtemp + 'RAUMFEUCHTE_HK2';

// Info.Anlage: WARMWASSER
var WW_ISTTEMP = pfad_tabelle_warmwasser + 'WW_ISTTEMP';
var WW_SOLLTEMP = pfad_tabelle_warmwasser + 'WW_SOLLTEMP';

// Info.Anlage: WÄRMEERZEUGER
var HEIZSTUFE = pfad_tabelle_waermeerzeuger + 'HEIZSTUFE';

// Info.Anlage: HEIZEN
var AUSSENTEMPERATUR = pfad_tabelle_heizen + 'AUSSENTEMPERATUR';
var ISTWERT_HK1 = pfad_tabelle_heizen + 'ISTWERT_HK1';
var SOLLWERT_HK1 = pfad_tabelle_heizen + 'SOLLWERT_HK1';
var ISTWERT_HK2 = pfad_tabelle_heizen + 'ISTWERT_HK2';
var SOLLWERT_HK2 = pfad_tabelle_heizen + 'SOLLWERT_HK2';
var VORLAUFTEMPERATUR = pfad_tabelle_heizen + 'VORLAUFTEMPERATUR';
var RUECKLAUFTEMPERATUR = pfad_tabelle_heizen + 'RUECKLAUFTEMPERATUR';

// Info.Anlage: LÜFTEN
var ZULUFT_IST_LUEFTERDREHZAHL = pfad_tabelle_lueften + 'ZULUFT_IST_LUEFTERDREHZAHL';
var ZULUFT_SOLL_VOLUMENSTROM = pfad_tabelle_lueften + 'ZULUFT_SOLL_VOLUMENSTROM';
var ABLUFT_IST_LUEFTERDREHZAHL = pfad_tabelle_lueften + 'ABLUFT_IST_LUEFTERDREHZAHL';
var ABLUFT_SOLL_VOLUMENSTROM = pfad_tabelle_lueften + 'ABLUFT_SOLL_VOLUMENSTROM';

// Info.Waermepumpe: PROZESSWERTE
var HEISSGASTEMPERATUR = pfad_tabelle_prozesswerte + 'HEISSGASTEMPERATUR';
var VERDAMPFERTEMP = pfad_tabelle_prozesswerte + 'VERDAMPFERTEMP';
var VERFLUESSIGERTEMP = pfad_tabelle_prozesswerte + 'VERFLUESSIGERTEMP';
var FORTLUFT_IST_LUEFTERDREHZAHL = pfad_tabelle_prozesswerte + 'FORTLUFT_IST_LUEFTERDREHZAHL';
var FORTLUFT_SOLL_VOLUMENSTROM = pfad_tabelle_prozesswerte + 'FORTLUFT_SOLL_VOLUMENSTROM';

// Info.Waermepumpe: LEISTUNGSAUFNAHME
var P_HEIZUNG_TAG = pfad_tabelle_leistungsaufnahme + 'P_HEIZUNG_TAG';
var P_HEIZUNG_SUMME = pfad_tabelle_leistungsaufnahme + 'P_HEIZUNG_SUMME';
var P_WW_TAG = pfad_tabelle_leistungsaufnahme + 'P_WW_TAG';
var P_WW_SUMME = pfad_tabelle_leistungsaufnahme + 'P_WW_SUMME';

// Info.Waermepumpe: WAERMEMENGEN
var WM_HEIZEN_TAG = pfad_tabelle_waermemengen + 'WM_HEIZEN_TAG';
var WM_HEIZEN_SUMME = pfad_tabelle_waermemengen + 'WM_HEIZEN_SUMME';
var WM_WW_TAG = pfad_tabelle_waermemengen + 'WM_WW_TAG';
var WM_WW_SUMME = pfad_tabelle_waermemengen + 'WM_WW_SUMME';
var WM_NE_HEIZEN_SUMME = pfad_tabelle_waermemengen + 'WM_NE_HEIZEN_SUMME';
var WM_NE_WW_SUMME = pfad_tabelle_waermemengen + 'WM_NE_WW_SUMME';
var WM_WRG_TAG = pfad_tabelle_waermemengen + 'WM_WRG_TAG';
var WM_WRG_SUMME = pfad_tabelle_waermemengen + 'WM_WRG_SUMME';

// Info.Waermepumpe: LAUFZEITEN
var VERDICHTER_HEIZEN = pfad_tabelle_laufzeiten + 'VERDICHTER_HEIZEN';
var VERDICHTER_WW = pfad_tabelle_laufzeiten + 'VERDICHTER_WW';
var ELEKTR_NE_HEIZEN = pfad_tabelle_laufzeiten + 'ELEKTR_NE_HEIZEN';
var ELEKTR_NE_WW = pfad_tabelle_laufzeiten + 'ELEKTR_NE_WW';

var DPArray = [
    // START
    STATUS,
    // Info.Anlage: RAUMTEMPERATUR
    RAUMISTTEMP_HK1,
    RAUMSOLLTEMP_HK1,
    RAUMFEUCHTE_HK1,
    RAUMISTTEMP_HK2,
    RAUMSOLLTEMP_HK2,
    RAUMFEUCHTE_HK2,
    // Info.Anlage: WARMWASSER
    WW_ISTTEMP,
    WW_SOLLTEMP,
    // Info.Anlage: WÄRMEERZEUGER
    HEIZSTUFE,
    // Info.Anlage: HEIZEN
    AUSSENTEMPERATUR,
    ISTWERT_HK1,
    SOLLWERT_HK1,
    ISTWERT_HK2,
    SOLLWERT_HK2,
    VORLAUFTEMPERATUR,
    RUECKLAUFTEMPERATUR,
    // Info.Anlage: LÜFTEN
    ZULUFT_IST_LUEFTERDREHZAHL,
    ZULUFT_SOLL_VOLUMENSTROM,
    ABLUFT_IST_LUEFTERDREHZAHL,
    ABLUFT_SOLL_VOLUMENSTROM,
    // Info.Waermepumpe: PROZESSWERTE
    HEISSGASTEMPERATUR,
    VERDAMPFERTEMP,
    VERFLUESSIGERTEMP,
    FORTLUFT_IST_LUEFTERDREHZAHL,
    FORTLUFT_SOLL_VOLUMENSTROM,
    // Info.Waermepumpe: LEISTUNGSAUFNAHME
    P_HEIZUNG_TAG,
    P_HEIZUNG_SUMME,
    P_WW_TAG,
    P_WW_SUMME,
    // Info.Waermepumpe: WAERMEMENGEN
    WM_HEIZEN_TAG,
    WM_HEIZEN_SUMME,
    WM_WW_TAG,
    WM_WW_SUMME,
    WM_NE_HEIZEN_SUMME,
    WM_NE_WW_SUMME,
    WM_WRG_TAG,
    WM_WRG_SUMME,
    // Info.Waermepumpe: LAUFZEITEN
    VERDICHTER_HEIZEN,
    VERDICHTER_WW,
    ELEKTR_NE_HEIZEN,
    ELEKTR_NE_WW
];

DPArray.forEach(function(id,) {
    
    createState(id, 0, {
        name: '',
        desc: '',
        type: '',
        unit: '',
        read: true,
        write: false,
        role: 'value'
    });
    
});

// CRON JOB - ALLE 10 MINUTEN
schedule("*/10 * * * *", function () {
    pollStiebelEltron();
});

pollStiebelEltron();

function pollStiebelEltron() {
    log("polling stiebel eltron adapter");

    http.get("http://" + stiebeleltronIP + "/?s=0", function (http_res) {

        // initialize the container for our data
        var data = "";

        // this event fires many times, each time collecting another piece of the response
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            data += chunk;
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {

            try {

                var doc = new dom().parseFromString(data);

                /**
                 * Tabelle BETRIEBSART - DOING
                 */
                /*
                var nodes1 = xpath.select("//*[@id=\"aval39\"]", doc);
                var temp10 = nodes1[0].data;
                setState('javascript.0.stiebeleltron.TEMP10', temp10);
                */

                /**
                 * Tabelle PROZESSDATEN - DONE
                 */

                // ==> STATUS
                var nodes = xpath.select("//*[@id=\"box_start_status_system\"]", doc);
                var value = nodes[0].childNodes[1].childNodes[2].childNodes[0].data;
                setState(STATUS, value);

            } catch (e) {
                log("stiebeleltron: Cannot set Website 1 data:" + e, 'error');
            }
        });
    });

    http.get("http://" + stiebeleltronIP + "/?s=1,0", function (http_res) {

        // initialize the container for our data
        var data = "";

        // this event fires many times, each time collecting another piece of the response
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            data += chunk;
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {

            try {

                var doc = new dom().parseFromString(data);
                var nodes = xpath.select("//*[@id=\"content\"]", doc);

                /**
                 * Tabelle RAUMTEMPERATUR
                 */

                // ==> RAUMISTTEMP. HK1
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(RAUMISTTEMP_HK1, value);

                // ==> RAUMSOLLTEMP. HK1
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(RAUMSOLLTEMP_HK1, value);

                // ==> RAUMFEUCHTE HK1
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(RAUMFEUCHTE_HK1, value);

                // ==> RAUMISTTEMP. HK2
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(RAUMISTTEMP_HK2, value);

                // ==> RAUMSOLLTEMP. HK2
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[10].childNodes[3].childNodes[0].data);
                setState(RAUMSOLLTEMP_HK2, value);

                // ==> RAUMFEUCHTE HK2
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[12].childNodes[3].childNodes[0].data);
                setState(RAUMFEUCHTE_HK2, value);


                /**
                 * Tabelle HEIZEN - DONE
                 */

                // ==> AUSSENTEMPERATUR
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(AUSSENTEMPERATUR, value);

                // ==> ISTWERT HK1
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(ISTWERT_HK1, value);

                // ==> SOLLWERT HK1
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(SOLLWERT_HK1, value);

                // ==> ISTWERT HK2
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(ISTWERT_HK2, value);

                // ==> SOLLWERT HK2
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[10].childNodes[3].childNodes[0].data);
                setState(SOLLWERT_HK2, value);

                // ==> VORLAUFTEMPERATUR
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[12].childNodes[3].childNodes[0].data);
                setState(VORLAUFTEMPERATUR, value);

                // ==> RÜCKLAUFTEMPERATUR
                var value = removeDegreeUnit(nodes[0].childNodes[2].childNodes[0].childNodes[14].childNodes[3].childNodes[0].data);
                setState(RUECKLAUFTEMPERATUR, value);


                /**
                 * Tabelle WARMWASSER
                 */

                // ==> WW-ISTTEMP.
                var value = removeDegreeUnit(nodes[0].childNodes[3].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(WW_ISTTEMP, value);

                // ==> WW-SOLLTEMP.
                var value = removeDegreeUnit(nodes[0].childNodes[3].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(WW_SOLLTEMP, value);


                /**
                 * Tabelle LÜFTEN
                 */

                // ==> ZULUFT SOLL VOLUMENSTROM
                var value = removeDegreeUnit(nodes[0].childNodes[4].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(ZULUFT_IST_LUEFTERDREHZAHL, value);

                // ==> ZULUFT SOLL VOLUMENSTROM
                var value = removeDegreeUnit(nodes[0].childNodes[4].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(ZULUFT_SOLL_VOLUMENSTROM, value);

                // ==> ABLUFT IST LÜFTERDREHZAHL
                var value = removeDegreeUnit(nodes[0].childNodes[4].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(ABLUFT_IST_LUEFTERDREHZAHL, value);

                // ==> ABLUFT SOLL VOLUMENSTROM
                var value = removeDegreeUnit(nodes[0].childNodes[4].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(ABLUFT_SOLL_VOLUMENSTROM, value);

                /**
                 * Tabelle WÄRMEERZEUGER
                 */

                // ==> HEIZSTUFE 
                var value = nodes[0].childNodes[5].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data;
                setState(HEIZSTUFE, value);


            } catch (e) {
                log("stiebeleltron: Cannot set Website 10 data:" + e, 'error');
            }
        });
    });

    http.get("http://" + stiebeleltronIP + "/?s=1,1", function (http_res) {
        // initialize the container for our data
        var data = "";

        // this event fires many times, each time collecting another piece of the response
        http_res.on("data", function (chunk) {
            // append this chunk to our growing `data` var
            data += chunk;
        });

        // this event fires *one* time, after all the `data` events/chunks have been gathered
        http_res.on("end", function () {

            try {

                // the website has some </divs> without starttags, they must be removed to use dom 
                //var newdata = data.replace(/<\/div>\s<\/div>\s<\/div>\s<\/div>\s/gmi, "<\/div>\r\n<\/div>");
                var doc = new dom().parseFromString(data);
                var nodes = xpath.select("//*[@id=\"content\"]", doc);

                /**
                 * Tabelle PROZESSWERTE
                 */

                // ==> HEISSGASTEMPERATUR
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(HEISSGASTEMPERATUR, value);

                // ==> VERDAMPFERTEMP.
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(VERDAMPFERTEMP, value);

                // == VERFLÜSSIGERTEMP.
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(VERFLUESSIGERTEMP, value);

                // ==> FORTLUFT IST LÜFTERDREHZAHL
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(FORTLUFT_IST_LUEFTERDREHZAHL, value);

                // ==> FORTLUFT SOLL VOLUMENSTROM
                var value = removeDegreeUnit(nodes[0].childNodes[1].childNodes[0].childNodes[10].childNodes[3].childNodes[0].data);
                setState(FORTLUFT_SOLL_VOLUMENSTROM, value);


                /**
                 * Tabelle WAERMEMENGEN - DONE
                 */

                // ==> WM HEIZEN TAG
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(WM_HEIZEN_TAG, value);

                // ==> WM HEIZEN SUMME
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(WM_HEIZEN_SUMME, value);

                // ==> WM WW TAG
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(WM_WW_TAG, value);

                // ==> WM WW SUMME
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(WM_WW_SUMME, value);

                // ==> WM NE HEIZEN SUMME
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[10].childNodes[3].childNodes[0].data);
                setState(WM_NE_HEIZEN_SUMME, value);

                // ==> WM NE WW SUMME
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[12].childNodes[3].childNodes[0].data);
                setState(WM_NE_WW_SUMME, value);

                // ==> WM WRG TAG
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[14].childNodes[3].childNodes[0].data);
                setState(WM_WRG_TAG, value);

                // ==> WM WRG SUMME
                var value = removePowerUnit(nodes[0].childNodes[2].childNodes[0].childNodes[16].childNodes[3].childNodes[0].data);
                setState(WM_WRG_SUMME, value);

                /**
                 * Tabelle LEISTUNGSAUFNAHME - DONE
                 */

                // ==> P HEIZUNG TAG
                var value = removePowerUnit(nodes[0].childNodes[3].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(P_HEIZUNG_TAG, value);

                // ==> P HEIZUNG SUMME
                var value = removePowerUnit(nodes[0].childNodes[3].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(P_HEIZUNG_SUMME, value);

                // ==> P WW TAG
                var value = removePowerUnit(nodes[0].childNodes[3].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(P_WW_TAG, value);

                // ==> P WW SUMME
                var value = removePowerUnit(nodes[0].childNodes[3].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(P_WW_SUMME, value);


                /**
                 * Tabelle LAUFZEITEN - DONE
                 */

                // ==> VERDICHTER HEIZEN
                var value = removeHourUnit(nodes[0].childNodes[4].childNodes[0].childNodes[2].childNodes[3].childNodes[0].data);
                setState(VERDICHTER_HEIZEN, value);

                // ==> VERDICHTER WW
                var value = removeHourUnit(nodes[0].childNodes[4].childNodes[0].childNodes[4].childNodes[3].childNodes[0].data);
                setState(VERDICHTER_WW, value);

                // ==> ELEKTR. NE HEIZEN
                var value = removeHourUnit(nodes[0].childNodes[4].childNodes[0].childNodes[6].childNodes[3].childNodes[0].data);
                setState(ELEKTR_NE_HEIZEN, value);

                // ==> ELEKTR. NE WW
                var value = removeHourUnit(nodes[0].childNodes[4].childNodes[0].childNodes[8].childNodes[3].childNodes[0].data);
                setState(ELEKTR_NE_WW, value);

            } catch (e) {
                log("stiebeleltron: Cannot set Website 11 data:" + e, 'error');
            }
        });
    });
}

function checkFalseBool(input, checkvalue) {
    var result = (input != checkvalue);
    return Boolean(result);
}

function checkTrueBool(input, checkvalue) {
    var result = input == checkvalue;
    return Boolean(result);
}

function removeUnit(input, unitLength, unit) {
    if (unit)
        unit.valueOf = unit.toSource = unit.toString = input.substring(input.length - unitLength, input.length);
    var value = input.substring(0, input.length - unitLength);
    value = value.replace(/,/, ".");
    return parseFloat(value);
}

function removeHourUnit(input, unit) {
    return removeUnit(input, 2, unit);
}

function removePowerUnit(input, unit) {
    return removeUnit(input, 4);
}

function removePressureUnit(input, unit) {
    return removeUnit(input, 4);
}

function removeDegreeUnit(input, unit) {
    return removeUnit(input, 2, unit);
}