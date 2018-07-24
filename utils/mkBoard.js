#!/usr/bin/env node
var parseArgs = require('minimist');
var cv = require('./opencv.js');
var PNG = require('pngjs').PNG;
var fs = require('fs');
var fec = require('./fec.js');


var cleanup = fec.cwrap('cleanup', null, []);
var encode = fec.cwrap('encode', 'number', ['number', 'number']);

var NUM_SYMBOLS = 20;
var NUM_DATA = 8;

var N_COLUMNS = 8;
var N_ROWS = 5;

var WIDTH = 2700;
var HEIGHT = 1800;

var mkBoard = function(outFile, dataList) {

    var data = fec._malloc(NUM_SYMBOLS);
    var erasure = fec._malloc(NUM_SYMBOLS);
    var dataArray = fec.HEAPU8.subarray(data, data + NUM_SYMBOLS);
    var erasureArray = fec.HEAPU8.subarray(erasure, erasure + NUM_SYMBOLS);

    for (let i = 0; i< NUM_DATA; i++) {
        dataArray[i] = (dataList ? dataList[i] : Math.floor(Math.random()*32));
    }

    encode(data, NUM_SYMBOLS);

    var str = dataArray.toString().replace(/,/g, "-");
    console.log(str);

    var dict = new cv.Dictionary(cv.DICT_4X4_50);
    var p = new cv.CharucoBoard(N_COLUMNS, N_ROWS, 0.04, 0.02, dict);
    var iv = new cv.IntVector();

    for (let i=0; i< p.ids.size(); i++) {
        iv.push_back(dataArray[i]);
    }

    var old = p.ids;
    p.ids = iv;
    old.delete();

    var dest = new cv.Mat();
    p.draw(new cv.Size(WIDTH, HEIGHT), dest, 150, 1);
    var destColor = new cv.Mat();
    cv.cvtColor(dest, destColor, cv.COLOR_GRAY2RGBA);

    cv.putText(destColor, str, {x: 150, y: HEIGHT - 80}, cv.FONT_HERSHEY_PLAIN,
               3.0, new cv.Scalar(0, 0, 255, 255), 2);

    var buffer = PNG.sync.write({data: destColor.data, width: WIDTH,
                                 height: HEIGHT, colorType: 6});
    fs.writeFileSync(outFile, buffer);

    fec._free(data);
    fec._free(erasure);
    cleanup();
};


var condInsert = function(target, key, value) {
    if ((target[key] === undefined) ||
        //minimist sets undefined boolean flags to 'false'
        // do not set both a qualified and unqualified value on boolean...
        (target[key] === false)) {
        target[key] = value;
    }
};


var usage = function(x) {
     if (x.indexOf('--') !== 0) {
         return true;
     } else {
         console.log('Invalid ' + x);
         console.log('Usage:  mkBoard.js <outputFile>');
         process.exit(1);
         return false;
     }
};


var args = process.argv.slice(2);

var argv = parseArgs(args, {
    string : ['outputFile'],
    unknown: usage
});

var options = argv._ || [];
var outF = options.shift();
condInsert(argv, 'outputFile', outF);
if (!argv.outputFile) {
    usage('outputFile');
} else {
    mkBoard(argv.outputFile);
}
