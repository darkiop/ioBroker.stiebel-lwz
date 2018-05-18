var instanz = 'javascript.' + instance;
var pfad = '.ISG.SET.';

var ISG_SET_BETRIEBSART = instanz + pfad + 'Betriebsart';
createState(ISG_SET_BETRIEBSART, { 
    type: 'string',
    name: '',
    desc: '',
    def: ' ',
    role: 'value'
});

var ISG_SET_LUEFTERSTUFETAG = instanz + pfad + 'Luefterstufetag';
createState(ISG_SET_LUEFTERSTUFETAG, { 
    type: 'string',
    name: '',
    desc: '',
    def:  '',
    role: 'value'
});

var ISG_SET_RAUMTEMPTAG = instanz + pfad + 'Raumtemptag';
createState(ISG_SET_RAUMTEMPTAG, { 
    type: 'string',
    name: '',
    desc: '',
    def:  '',
    role: 'value'
});

var ISG_SET_WARMWASSERTEMPTAG = instanz + pfad + 'Warmwassertemptag';
createState(ISG_SET_WARMWASSERTEMPTAG, { 
    type: 'string',
    name: '',
    desc: '',
    def:  '',
    role: 'value'
});

var parameter, wert;
function set_isg_para(parameter, wert) {
    
    exec('bash /opt/iobroker/iobroker-data/isg-set/isg_set.sh "' + parameter + '" "' + wert + '"', function(err, stdout, stderr) {

        if (err) {
            log(err);
            return;
        }
        log(stdout);
    });

}

// TEST
//exec('bash /opt/iobroker/iobroker-data/isg-set/isg_set.sh BETRIEBSART WARMWASSER')
//set_isg_para("BETRIEBSART", "AUTOMATIK");
//set_isg_para("BETRIEBSART", "WARMWASSER");

on({id: ISG_SET_BETRIEBSART, change: "any"}, function (obj) {
    
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    var BETRIEBSART;
  
    set_isg_para("BETRIEBSART", value);

});

on({id: ISG_SET_LUEFTERSTUFETAG, change: "any"}, function (obj) {
    
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    var LUEFTERSTUFETAG;
  
    set_isg_para("LUEFTERSTUFETAG", value);

});

on({id: ISG_SET_RAUMTEMPTAG, change: "any"}, function (obj) {
    
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    var RAUMTEMPTAG;
  
    set_isg_para("RAUMTEMPTAG", value);

});

on({id: ISG_SET_WARMWASSERTEMPTAG, change: "any"}, function (obj) {
    
    var value = obj.state.val;
    var oldValue = obj.oldState.val;
    var WARMWASSERTEMPTAG;
  
    set_isg_para("WARMWASSERTEMPTAG", value);

});
