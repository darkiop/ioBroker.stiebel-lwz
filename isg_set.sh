#!/bin/bash
#
# set Parameters for Stiebel Eltron over ISG Web (Version: 8.5.6)
#
# call with 'isg_set_bash.sh parameter wert'
#
# https://forum.iobroker.net/viewtopic.php?t=5835
# http://www.mit.edu/afs.new/sipb/user/ssen/src/curl-7.11.1/docs/curl.html
#
# curl $isg_website/save.php \
#  -H "Host: isg" \
#  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0" \
#  -H "Accept: text/plain, */*; q=0.01" \
#  -H "Accept-Language: de,en-US;q=0.7,en;q=0.3" \
#  -H "Referer: http://isg/" \
#  -H "Content-Type: application/x-www-form-urlencoded" \
#  -H "X-Requested-With: XMLHttpRequest" \
#  -H "Connection: keep-alive" \
#  -H "Pragma: no-cache" \
#  -H "Cache-Control: no-cache" \
#  --compressed \
#  --data "make=send" \
#  --cookie-jar "cookie.txt"
#  --data-urlencode "data=[{\"name\":\"val82\",\"value\":\"3\"}]"

# URL
isg_website="http://isg"

# Keine Parameter uebergeben
if [ $# -eq  0 ]
  then
    echo "Keine Parameter, Ende"
    exit
fi

# Zuviele Parameter uebergeben
if [ $# -gt 2 ]
  then
    echo "Zu viele Parameter, Ende"
    exit
fi

# https://stackoverflow.com/questions/3685970/check-if-a-bash-array-contains-a-value
function contains() {
  local n=$#
  local value=${!n}
  for ((i=1;i < $#;i++)) {
    if [ "${!i}" == "${value}" ]; then
      echo "y"
      return 0
    fi
  }
  echo "n"
  return 1
}

# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
# TODO CHECK $1 = korrekter Parameter, $2 valider Wert
# !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

# Parameter Check
#first_parameter=("val39s" "val82" "val5" "val17")
#second_parameter=("0" "1" "2" "3")

#A=("one" "two" "three four")

#if [ $(contains "${A[@]}" "one") == "y" ]; then
#    echo "contains one"
#fi

#if [ $(contains "${A[@]}" "three") == "y" ]; then
#    echo "contains three"
#fi

#if [ $? -eq 0 ]; then
    #echo OK
#else
    #echo FAIL
#fi

# WERTE UBER ISG AENDERN
# para1 = Parameter
# para2 = Wert
function set_isg_para () {
  curl $isg_website/save.php \
  -H "Host: isg" \
  -H "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:60.0) Gecko/20100101 Firefox/60.0" \
  -H "Accept: text/plain, */*; q=0.01" \
  -H "Accept-Language: de,en-US;q=0.7,en;q=0.3" \
  -H "Referer: http://isg/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -H "X-Requested-With: XMLHttpRequest" \
  -H "Connection: keep-alive" \
  -H "Pragma: no-cache" \
  -H "Cache-Control: no-cache" \
  --compressed \
  --data "make=send" \
  --cookie-jar "cookie.txt" \
  --data-urlencode "data=[{\"name\":\"$1\",\"value\":\"$2\"}]"
}

case "$1" in
  
  BETRIEBSART)
  # val39s
  # Gültige Werte:
  # 11 = AUTOMATIK, 1 = BEREITSCHAFT, 3 = TAGBETRIEB, 4 = ABSENKBETRIEB,
  # 5 = WARMWASSER, 14 = HANDBETRIEB, 0 = NOTBETRIEB
  para=val39s
  case "$2" in
    AUTOMATIK)
    value=11
    ;;
    BEREITSCHAFT)
    value=1
    ;;
    TAGBETRIEB)
    value=3
    ;;
    ABSENKBETRIEB)
    value=4
    ;;
    WARMWASSER)
    value=5
    ;;
    HANDBETRIEB)
    value=14
    ;;
    NOTBETRIEB)
    value=0
    ;;
  esac
  echo "setze BETRIEBSART ($para) auf WERT: $value"
  set_isg_para $para $value
  exit
  ;;
  
  LUEFTERSTUFETAG)
  # val82
  # Gültige Werte:
  # 0,1,2,3
  para=val82
  value=$2
  echo "setze LUEFTERSTUFETAG"
  echo "auf WERT: $value"
  set_isg_para $para $value
  exit
  ;;
  
  RAUMTEMPTAG)
  # val5
  # Gültige Werte:
  # 10.0 bis 30.0
  para=val5
  value=$2
  echo "setze RAUMTEMPTAG ($para) auf WERT: $value"
  set_isg_para $para $value
  exit
  ;;
  
  WARMWASSERTEMPTAG)
  # val17
  # Gültige Werte:
  # 10.0 bis 55.0
  para=val17
  value=$2
  echo "setze WARMWASSERTEMPTAG ($para) auf WERT: $value"
  set_isg_para $para $value
  exit
  ;;

esac

# EOF
