#!/bin/bash
#
# liest Werte aus Stiebel Eltron ISG Web und pusht diese an eine CCU
#
# runs with crontab every 5mins

# config
IP_CCU2="192.168.1.74"
IP_ISG="192.168.1.73"
PARAMETER_WGET="-q -O - --timeout=10"
ISG_DATA_STARTPAGE=/tmp/isg_start
ISG_DATA_ISTWERTE=/tmp/isg_ist
ISG_DATA_STATUS=/tmp/isg_status
URL="http://$IP_CCU2/addons/db/state.cgi?item="

# get data from isg
wget $PARAMETER_WGET "http://$IP_ISG/?s=0" | html2text | tr -s " \t\r\n" > $ISG_DATA_STARTPAGE
wget $PARAMETER_WGET "http://$IP_ISG/?s=1,0" | html2text | tr -s " \t\r\n" > $ISG_DATA_ISTWERTE
wget $PARAMETER_WGET "http://$IP_ISG/?s=2,0" | html2text | tr -s " \t\r\n" > $ISG_DATA_STATUS

ISG_DATUM=$(date +%Y%m%d%H%M)
ISG_LUEFTERSTUFE=$(php /home/darkiop/bin/isg_get_luefterstufe.php)
ISG_AUSSENTEMP=$(cat $ISG_DATA_ISTWERTE | grep "AUSSENTEMPERATUR" | cut -f2 -d" " | sed 's/','/'.'/g')
ISG_RAUMIST_HK1=$(cat $ISG_DATA_ISTWERTE | grep "RAUMISTTEMP. HK1" | cut -f3 -d" " | sed 's/','/'.'/g')
ISG_IST_HK1=$(cat $ISG_DATA_ISTWERTE | grep "ISTWERT HK1" | cut -f3 -d" " | sed 's/','/'.'/g')
ISG_SOLL_HK1=$(cat $ISG_DATA_ISTWERTE | grep "SOLLWERT HK1" | cut -f3 -d" " | sed 's/','/'.'/g')
ISG_WW_SOLL=$(cat $ISG_DATA_ISTWERTE | grep "WW-SOLLTEMP." | cut -f2 -d" " | sed 's/','/'.'/g')
ISG_WW_IST=$(cat $ISG_DATA_ISTWERTE | grep "WW-ISTTEMP." | cut -f2 -d" " | sed 's/','/'.'/g')
ISG_VORLAUF=$(cat $ISG_DATA_ISTWERTE | grep "VORLAUFTEMP." | cut -f2 -d" " | sed 's/','/'.'/g')
ISG_RUECKLAUF=$(cat $ISG_DATA_ISTWERTE | grep "RÜCKLAUFTEMPERATUR" | sed 's/'RÜCKLAUFTEMPERATUR'/''/g' | cut -f1 -d " " | sed 's/','/'.'/g')
ISG_HEIZSTUFE=$(cat $ISG_DATA_ISTWERTE | grep "HEIZSTUFE" | cut -f2 -d" ")
ISG_WM_HEIZEN_TAG=$(cat $ISG_DATA_ISTWERTE | grep "WM HEIZEN TAG" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_HEIZEN_SUMME=$(cat $ISG_DATA_ISTWERTE | grep "WM HEIZEN SUMME" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_WW_TAG=$(cat $ISG_DATA_ISTWERTE | grep "WM WW TAG" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_WW_SUMME=$(cat $ISG_DATA_ISTWERTE | grep "WM WW SUMME" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_LZ_VERDICHTER_HEIZEN=$(cat $ISG_DATA_ISTWERTE | grep "VERDICHTER HEIZEN" | cut -f3 -d" ")
ISG_LZ_VERDICHTER_WW=$(cat $ISG_DATA_ISTWERTE | grep "VERDICHTER WW" | cut -f3 -d" ")
ISG_LZ_ELEKTR_NE_HEIZEN=$(cat $ISG_DATA_ISTWERTE | grep "ELEKTR. NE HEIZEN" | cut -f4 -d" ")
ISG_LZ_ELEKTR_NE_WW=$(cat $ISG_DATA_ISTWERTE | grep "ELEKTR. NE WW" | cut -f4 -d" ")

# FILTERWECHSEL
ISG_FILTERWECHSEL=$(cat $ISG_DATA_STATUS | grep FILTERWECHSEL | grep symbol_an)
if [ $? -ne 0 ]; then
  ISG_FILTERWECHSEL="nicht erforderlich"
else
  ISG_FILTERRWECHSEL="erforderlich"
fi

# BETRIEBSART
if test `grep '#AUTOMATIK' $ISG_DATA_STARTPAGE | sed 's/'#'/''/g'`; then
  ISG_BETRIEBSART=Automatik
elif test `grep '#WARMWASSER' $ISG_DATA_STARTPAGE | sed 's/'#'/''/g'`; then
  ISG_BETRIEBSART=Warmwasser
fi

# STATUS
if [ $(cat $ISG_DATA_ISTWERTE | grep "SCHALTPROGRAMM AKTIV" | wc -l) -gt 0 ]; then
  ISG_ST_SCHALTPROGRAMM=aktiv
else
  ISG_ST_SCHALTPROGRAMM=inaktiv
fi
if [ $(cat $ISG_DATA_ISTWERTE | grep "HEIZKREISPUMPE" | wc -l) -gt 0 ]; then
  ISG_ST_HEIZKREISPUMPE=aktiv
else
  ISG_ST_HEIZKREISPUMPE=inaktiv
fi
if [ $(cat $ISG_DATA_ISTWERTE | grep "VERDICHTER" | wc -l) -gt 0 ]; then
  ISG_ST_VERDICHTER=aktiv
else
  ISG_ST_VERDICHTER=inaktiv
fi
if [ $(cat $ISG_DATA_ISTWERTE | grep "WARMWASSERBEREITUNG" | wc -l) -gt 0 ]; then
  ISG_ST_WARMWASSERBEREITUNG=aktiv
else 
  ISG_ST_WARMWASSERBEREITUNG=inaktiv
fi

# PUSH TEST
#wget $PARAMETER_WGET $URL"ISG_TEST&value="$ISG_TEST

# PUSH DATUM
wget $PARAMETER_WGET $URL"ISG_DATUM&value="$ISG_DATUM

# PUSH IST-WERTE
wget $PARAMETER_WGET $URL"ISG_LUEFTERSTUFE&value="$ISG_LUEFTERSTUFE
wget $PARAMETER_WGET $URL"ISG_AUSSENTEMP&value="$ISG_AUSSENTEMP
wget $PARAMETER_WGET $URL"ISG_RAUMIST_HK1&value="$ISG_RAUMIST_HK1
wget $PARAMETER_WGET $URL"ISG_IST_HK1&value="$ISG_IST_HK1
wget $PARAMETER_WGET $URL"ISG_SOLL_HK1&value="$ISG_SOLL_HK1
wget $PARAMETER_WGET $URL"ISG_WW_SOLL&value="$ISG_WW_SOLL
wget $PARAMETER_WGET $URL"ISG_WW_IST&value="$ISG_WW_IST
wget $PARAMETER_WGET $URL"ISG_VORLAUF&value="$ISG_VORLAUF
wget $PARAMETER_WGET $URL"ISG_RUECKLAUF&value="$ISG_RUECKLAUF
wget $PARAMETER_WGET $URL"ISG_HEIZSTUFE&value="$ISG_HEIZSTUFE
wget $PARAMETER_WGET $URL"ISG_WM_HEIZEN_TAG&value="$ISG_WM_HEIZEN_TAG
#wget $PARAMETER_WGET $URL"ISG_WM_HEIZEN_SUMME&value="$ISG_WM_HEIZEN_SUMME
wget $PARAMETER_WGET $URL"ISG_WM_WW_TAG&value="$ISG_WM_WW_TAG
#wget $PARAMETER_WGET $URL"ISG_WM_WW_SUMME&value="$ISG_WM_WW_SUMME
wget $PARAMETER_WGET $URL"ISG_LZ_VERDICHTER_HEIZEN&value="$ISG_LZ_VERDICHTER_HEIZEN
wget $PARAMETER_WGET $URL"ISG_LZ_VERDICHTER_WW&value="$ISG_LZ_VERDICHTER_WW
wget $PARAMETER_WGET $URL"ISG_LZ_ELEKTR_NE_HEIZEN&value="$ISG_LZ_ELEKTR_NE_HEIZEN
wget $PARAMETER_WGET $URL"ISG_LZ_ELEKTR_NE_WW&value="$ISG_LZ_ELEKTR_NE_WW

# FILTERWECHSEL
wget $PARAMETER_WGET $URL"ISG_FILTERWECHSEL&value="$ISG_FILTERRWECHSEL

# PUSH BETRIEBSART
wget $PARAMETER_WGET $URL"ISG_BETRIEBSART&value="$ISG_BETRIEBSART

# PUSH STATUS
wget $PARAMETER_WGET $URL"ISG_ST_SCHALTPROGRAMM&value="$ISG_ST_SCHALTPROGRAMM
wget $PARAMETER_WGET $URL"ISG_ST_HEIZKREISPUMPE&value="$ISG_ST_HEIZKREISPUMPE
wget $PARAMETER_WGET $URL"ISG_ST_VERDICHTER&value="$ISG_ST_VERDICHTER
wget $PARAMETER_WGET $URL"ISG_ST_WARMWASSERBEREITUNG&value="$ISG_ST_WARMWASSERBEREITUNG

# EOF
