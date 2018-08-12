#!/bin/bash

datum=`date +%Y-%m-%d`

echo ""

echo "-------- remove instance stiebel-lwz.0 --------"

sudo iobroker del stiebel-lwz.0

echo ""

echo "-------- upload stiebel-lwz --------"

sudo iobroker upload stiebel-lwz

echo ""

echo "-------- add instance stiebel-lwz.0 --------"

sudo iobroker add stiebel-lwz

echo ""

echo "-------- ioBroker Logfile: --------"

tail -f /opt/iobroker/log/iobroker.$datum.log

# EOF