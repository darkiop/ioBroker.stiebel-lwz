var cron = '*/30 * * * *';

var IPAnlage = '192.168.1.73';

createState('ISGTEST', {
  type: 'string',
  name: '',
  role: 'value'
});


function ISG() {

  var cheerio = require('cheerio');
  var request = require('request');

  request('http://' + IPAnlage + '/?s=1,0', function (error, response, body) {

    $ = cheerio.load(body);

    var d = $("td.value");

    //console.log('tds: ' + d);
   
    // The parseFloat() function parses a string and returns a floating point number.
    // The text property sets or returns the text of an option element.
    // The trim() method removes whitespace from both sides of a string.
    // The :eq() selector selects an element with a specific index number. The index numbers start at 0, so the first element will have the index number 0 (not 1).
    
    var AUSSENTEMPERATUR = d.eq(6).text().trim();
    AUSSENTEMPERATUR = removeDegreeUnit(AUSSENTEMPERATUR);
    console.log('AUSSENTEMPERATUR: ' + AUSSENTEMPERATUR);

    var ISTWERT_HK1 = d.eq(7).text().trim();
    ISTWERT_HK1 = removeDegreeUnit(ISTWERT_HK1);
    console.log('ISTWERT_HK1: ' + ISTWERT_HK1);

    var SOLLWERT_HK1 = d.eq(8).text().trim();
    SOLLWERT_HK1 = removeDegreeUnit(SOLLWERT_HK1);
    console.log('SOLLWERT_HK1: ' + SOLLWERT_HK1);
    
    var ISTWERT_HK2 = d.eq(9).text().trim();
    ISTWERT_HK2 = removeDegreeUnit(ISTWERT_HK2);
    console.log('ISTWERT_HK2: ' + ISTWERT_HK2);

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



    /*
    var test2 = parseFloat(d.eq(2).text().trim());
    console.log(test2);

    var test3 = parseFloat(d.eq(3).text().trim());
    console.log(test3);

    var test4 = parseFloat(d.eq(4).text().trim());
    console.log(test4);

    var test5 = parseFloat(d.eq(5).text().trim());
    console.log(test5);

    var test6 = parseFloat(d.eq(4).text().trim());
    console.log(test6);
  
    var test13 = parseFloat(d.eq(13));
    //var test13 = parseFloat(d.eq(13).text().trim());
    console.log(test13);

    // WW-SOLLTEMP.
    var pwr = parseFloat(d.eq(14).text().trim());
    console.log(pwr);

    */

  });
}

// Skript ausführen
schedule(cron, function () {
  ISG();
});

ISG();