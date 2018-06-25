
# PARAMETERS
*extracted from ISGweb v8.5.6*

## START
|name|code and value|valid values|
|---|---|---|
|BETRIEBSART|{"name":"val39s","value":"11"}|11 = AUTOMATIK, 1 = BEREITSCHAFT, 3 = TAGBETRIEB, 4 = ABSENKBETRIEB,5 = WARMWASSER, 14 = HANDBETRIEB, 0 = NOTBETRIEB|

## PROGRAMME

### HEIZPROGRAMM

#### HEIZPROGRAMM HK1
*tbd*
24 * 4 = 96:
0 = 0 Uhr
1 = 0:15 Uhr
2 = 0:30 Uhr
3 = 0:45 Uhr
4 = 1:00 Uhr
5 = 1:15 Uhr
*...*
96 = 23:59 Uhr

Von 0 bis 1 Uhr: value = 0;4
Von 23 bis 0 Uhr: value = 92;96

{"name":"val238","value":"0;96"}      Montag erster Zeitstrahl
{"name":"val239","value":"128;128"}   Montag zweiter Zeitstrahl
{"name":"val240","value":"128;128"}   Montag dritter Zeitstrahl
{"name":"val241","value":"0;96"}      Dienstag?
{"name":"val242","value":"128;128"}
{"name":"val243","value":"128;128"}
{"name":"val244","value":"0;96"}      Mittwoch?
{"name":"val245","value":"128;128"}
{"name":"val246","value":"128;128"}
{"name":"val247","value":"0;96"}      Donnerstag?
{"name":"val248","value":"128;128"}
{"name":"val249","value":"128;128"}
{"name":"val250","value":"0;96"}      Freitag?
{"name":"val251","value":"128;128"}
{"name":"val252","value":"128;128"}
{"name":"val253","value":"0;96"}      Samstag?
{"name":"val254","value":"128;128"}
{"name":"val255","value":"128;128"}
{"name":"val256","value":"0;96"}      Sonntag?
{"name":"val257","value":"128;128"}
{"name":"val258","value":"128;128"}]


## EINSTELLUNGEN

### HEIZEN

#### RAUMTEMPERATUREN HK1
|name|code and value|valid values|
|---|---|---|
|RAUMTEMP. TAG | {"name":"val5","value":"17,0"} | zwischen 10 °C und 30 °C|
|RAUMTEMP. NACHT | {"name":"val7","value":"19,0"} | zwischen 10 °C und 30 °C|
|RAUMTEMP. BEREITSCHAFT | {"name":"val58","value":"10,0"} | zwischen 10 °C und 30 °C|
|HEIZKREISSOLL HAND | {"name":"val54","value":"30,0"} | zwischen 10 °C und 65 °C|

#### RAUMTEMPERATUREN HK2
|name|code and value|valid values|
|---|---|---|
|RAUMTEMP. TAG | {"name":"val6","value":"21,0"} | zwischen 10 °C und 30 °C|
|RAUMTEMP. NACHT | {"name":"val8","value":"21,0"} | zwischen 10 °C und 30 °C|
|RAUMTEMP. BEREITSCHAFT | {"name":"val59","value":"10,0"} | zwischen 10 °C und 30 °C|
|HEIZKREISSOLL HAND | {"name":"val55","value":"30,0"} | zwischen 10 °C und 65 °C|

#### GRUNDEINSTELLUNG
|name|code and value|valid values|
|---|---|---|
|INTEGRALANTEIL HEIZEN | {"name":"val61","value":"100"} | zwischen 1 Kmin und 999 Kmin|
|MAX. STUFEN HEIZUNG | {"name":"val130","value":"3"} | zwischen 0 und 3 |
|MAXIMALE VORLAUFTEMP | {"name":"val21","value":"75,0"} | zwischen 10 °C und 75 °C|
|SOMMERBETRIEB | {"name":"val40","value":"13,0"}| z wischen 10 °C und 25 °C|
|HYSTERESE SOMMER/WINTER | {"name":"val133","value":"4,0"} | zwischen 1 K und 7 K|
|DÄMPFUNG AUSSENTEMP. | {"name":"val34","value":"1"} | zwischen 0 h und 24 h|
|BIVALENZ-HZG | {"name":"val64","value":"-10,0"} | zwischen -20 °C und 10 °C|
|ZEITSPERRE NE | {"name":"val131","value":"20"} | zwischen 0 min und 60 min|
|KORREKTUR AT | {"name":"val134","value":"-2,0" } | zwischen -20 °C und 30 °C|
|MASKIERZEIT TEMP. MESSUNG | {"name":"val187","value":"60"} | zwischen 0 s und 120 s|

#### HYSTERESEN
|name|code and value|valid values|
|---|---|---|
| ± HYSTERESE 1 | {"name":"val162","value":"3,0"} | zwischen 0 K und 10 K |
| ± HYSTERESE 2 | {"name":"val163","value":"4,0"} | zwischen 0 K und 10 K |
| ± HYSTERESE 3 | {"name":"val164","value":"3,0"} | zwischen 0 K und 5 K |
| ± HYSTERESE 4 | {"name":"val165","value":"2,0"} | zwischen 0 K und 5 K |
| ± HYSTERESE 5 | {"name":"val166","value":"1,0"} | zwischen 0 K und 5 K |
| ASYMETRIE DER HYST. | {"name":"val167","value":"2"} | zwischen 1 und 5 |

#### HEIZKURVE HK1
|name|code and value|valid values|
|---|---|---|
| STEIGUNG| {"name":"val35","value":"0,30"} | zwischen 0 und 5|
| FUSSPUNKT| {"name":"val16","value":"4,0"} | zwischen 0 °C und 20 °C|
| RAUMEINFLUSS| {"name":"val37","value":"0"} | zwischen 0 und 100|
| ANTEIL VORLAUF| {"name":"val127","value":"30"}| zwischen 0 % und 100 %|
| HK-TEMP. SOLL MAX.| {"name":"val22","value":"45,0"} | zwischen 10 °C und 65 °C|
| HK-TEMP. SOLL MIN.| {"name":"val56","value":"5,0"} | zwischen 0 °C und 40 °C|

#### HEIZKURVE HK1
|name|code and value|valid values|
|---|---|---|
| STEIGUNG| {"name":"val36","value":"0,30"} | zwischen 0 und 5 |
| FUSSPUNKT| {"name":"val129","value":"0,0"} | zwischen 0 °C und 20 °C |
| RAUMEINFLUSS| {"name":"val38","value":"0"} | zwischen 0 und 100 |
| HK-TEMP. SOLL MAX.| {"name":"val23","value":"55,0"} | zwischen 10 °C und 65 °C |
| HK-TEMP. SOLL MIN.| {"name":"val57","value":"5,0"}] | zwischen 0 °C und 40 °C |

### WARMWASSER

#### WW-TEMPERATUREN
|name|code and value|valid values|
|---|---|---|
| WW SOLL TAG | {"name":"val17","value":"40,0"} | zwischen 10 °C und 55 °C |
| WW SOLL NACHT | {"name":"val161","value":"44,0"} | zwischen 10 °C und 55 °C |
| WW SOLL BEREITSCHAFT | {"name":"val102","value":"10,0"} | zwischen 10 °C und 55 °C |
| WW SOLL HANDBETRIEB | {"name":"val101","value":"46,0"} | zwischen 10 °C und 55 °C |

#### GRUNDEINSTELLUNG
|name|code and value|valid values|
|---|---|---|
| HYSTERESE | {"name":"val60","value":"2,0"} | zwischen 2 K und 10 K |
| ZEITSPERRE NE | {"name":"val111","value":"90"} | zwischen 0 min und 360 min |
| TEMP. FREIGABE NE | {"name":"val112","value":"-7,0"}| zwischen -10 °C und 10 °C |
| INTERVALL ANTILEGIONELLEN | {"name":"val109","value":"30"} | zwischen 1 d und 30 d |
| MAX DAUER WW-ERZEUG. | {"name":"val62","value":"12"} | zwischen 6 h und 12 h |
| ANTILEGIONELLENTEMPERATUR | {"name":"val110","value":"59.5"} | zwischen 10 °C und 65 °C |
| NE STUFE WW | {"name":"val113","value":"3"} | zwischen 1 und 3 |
| MAXIMALE VORLAUFTEMP | {"name":"val115","value":"75,0"} | zwischen 10 °C und 75 °C |
| WW-ECO | {"name":"val116","value":"1"} | an / aus (0/1) |

### LÜFTEN

#### LÜFTUNGSSTUFEN
|name|code and value|valid values|
|---|---|---|
| STUFE-TAG | {"name":"val82","value":"0"} | zwischen 0 und 3 |
| STUFE-NACHT | {"name":"val83","value":"3"} | zwischen 0 und 3 |
| STUFE-BEREITSCHAFT | {"name":"val84","value":"1"} | zwischen 0 und 3 |
| STUFE-PARTY | {"name":"val85","value":"3"} | zwischen 0 und 3 |
| STUFE-HAND | {"name":"val188","value":"2"} | zwischen 0 und 3 |

#### LÜFTUNGSZEITEN
*tbd*

#### LUFTVOLUMENSTROM
*tbd*

#### PASSIVKÜHLUNG
|name|code and value|valid values|
|---|---|---|
|PASSIVKÜHLUNG | {"name":"val90","value":"0"} | an / aus (0/1) |
|PASSIVKÜHLUNG FORTL. | {"name":"val179","value":"0"} | an / aus (0/1) |

#### OFEN / KAMIN
|name|code and value|valid values|
|---|---|---|
|OFEN / KAMIN | {"name":"val97","value":"0"} | an / aus (0/1)|

#### LUFT/LUFT-WT