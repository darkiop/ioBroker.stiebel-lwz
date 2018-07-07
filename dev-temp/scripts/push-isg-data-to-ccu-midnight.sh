#!/bin/bash
#
# liest Werte aus Stiebel Eltron ISG Web und pusht diese an eine CCU
#
# runs with crontab at midnight

# config
IP_CCU2="192.168.1.74"
IP_ISG="192.168.1.73"
PARAMETER_WGET="-q -O - --timeout=10"
ISG_DATA_ISTWERTE=/tmp/isg_ist_midnight
URL="http://$IP_CCU2/addons/db/state.cgi?item="

# get data from ISGweb
wget $PARAMETER_WGET "http://$IP_ISG/?s=1,1" | html2text | tr -s " \t\r\n" > $ISG_DATA_ISTWERTE

ISG_WM_HEIZEN_TAG=$(cat $ISG_DATA_ISTWERTE | grep "WM HEIZEN TAG" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_HEIZEN_SUMME=$(cat $ISG_DATA_ISTWERTE | grep "WM HEIZEN SUMME" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_WW_TAG=$(cat $ISG_DATA_ISTWERTE | grep "WM WW TAG" | cut -f4 -d" " | sed 's/','/'.'/g')
ISG_WM_WW_SUMME=$(cat $ISG_DATA_ISTWERTE | grep "WM WW SUMME" | cut -f4 -d" " | sed 's/','/'.'/g')

# PUSH
wget $PARAMETER_WGET $URL"ISG_WM_HEIZEN_TAG&value="$ISG_WM_HEIZEN_TAG
wget $PARAMETER_WGET $URL"ISG_WM_HEIZEN_SUMME&value="$ISG_WM_HEIZEN_SUMME
wget $PARAMETER_WGET $URL"ISG_WM_WW_TAG&value="$ISG_WM_WW_TAG
wget $PARAMETER_WGET $URL"ISG_WM_WW_SUMME&value="$ISG_WM_WW_SUMME

# EOF