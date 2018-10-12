ACHTUNG:
Wird unter
https://github.com/unltdnetworx/ioBroker.stiebel-isg
weiterentwickelt!



![Logo](admin/stiebel-lwz.png)
# ioBroker.stiebel-lwz
=================

[![NPM version](https://img.shields.io/npm/v/iobroker.stiebel-lwz.svg)](https://www.npmjs.com/package/iobroker.stiebel-lwz)
[![Downloads](https://img.shields.io/npm/dm/iobroker.stiebel-lwz.svg)](https://www.npmjs.com/package/iobroker.stiebel-lwz)
[![Tests](https://travis-ci.org/darkiop/ioBroker.stiebel-lwz.svg?branch=master)](https://travis-ci.org/darkiop/ioBroker.stiebel-lwz)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/darkiop/ioBroker.stiebel-lwz)

[![NPM](https://nodei.co/npm/iobroker.stiebel-lwz.png?downloads=true)](https://nodei.co/npm/iobroker.stiebel-lwz/)

This adapter provides an interface to the Stiebel Eltron Web [1] to control a LWZ (heat pump) over it. Tested with ISGweb version 8.5.6/8.6.4 on a LWZ 303i (production year 2011).

Use at your own risk!

[1] https://www.stiebel-eltron.de/de/home/produkte-loesungen/erneuerbare_energien/regelung_energiemanagement/internet_servicegateway/isg_web.html

## Disucssion
https://forum.iobroker.net/viewtopic.php?f=30&t=14309

## TODO
* add more adjustable parameters from ISGweb
* write isg_set.sh in JS (request, restler, needle?)
* cronjob or adapter restart to update parsed parameters --> workaround: instance > expert > adapter restart
* documenation
* load vales for adjustable parameters at adapter start

## Changelog
### 0.1.0 (2018-07-14)
- (darkiop) load parameters from ISGweb at adapter start
### 0.0.3 (2018-07-06)
- (darkiop) set 'betriebsart' at adapter start
### 0.0.2 (2018-06-21)
- (darkiop) removed widgets & www folders
- (darkiop) changes io-package.json: adapter type climate-control, native default IP 0.0.0.0, removed restartAdapters
### 0.0.1 (2018-05-18)
- (darkiop) initial version

## License
The MIT License (MIT)

Copyright (c) 2018 Thorsten Walk <darkiop@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
