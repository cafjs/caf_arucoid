'use strict';
var caf = require('caf_core');
var app = require('../public/js/app.js');


var APP_SESSION = 'default';


// opencv coordinates, scan by row (left-right) then column (top-bottom)
var DEFAULT_CALIB_3D = [
    [-0.1575,-0.2625,-0.15],
    [-0.105,-0.2625,-0.15],
    [-0.0525,-0.2625,-0.15],
    [0,-0.2625,-0.15],
    [0.0525,-0.2625,-0.15],
    [0.105,-0.2625,-0.15],
    [0.1575,-0.2625,-0.15],
    [-0.1575,-0.21,-0.15],
    [-0.105,-0.21,-0.15],
    [-0.0525,-0.21,-0.15],
    [0,-0.21,-0.15],
    [0.0525,-0.21,-0.15],
    [0.105,-0.21,-0.15],
    [0.1575,-0.21,-0.15],
    [-0.1575,-0.1575,-0.15],
    [-0.105,-0.1575,-0.15],
    [-0.0525,-0.1575,-0.15],
    [0,-0.1575,-0.15],
    [0.0525,-0.1575,-0.15],
    [0.105,-0.1575,-0.15],
    [0.1575,-0.1575,-0.15],
    [-0.1575,-0.105,-0.15],
    [-0.105,-0.105,-0.15],
    [-0.0525,-0.105,-0.15],
    [0,-0.105,-0.15],
    [0.0525,-0.105,-0.15],
    [0.105,-0.105,-0.15],
    [0.1575,-0.105,-0.15]
];

/* original X orientation
 [
    [0.1575,-0.2625,-0.15],
    [0.105,-0.2625,-0.15],
    [0.0525,-0.2625,-0.15],
    [0,-0.2625,-0.15],
    [-0.0525,-0.2625,-0.15],
    [-0.105,-0.2625,-0.15],
    [-0.1575,-0.2625,-0.15],
    [0.1575,-0.21,-0.15],
    [0.105,-0.21,-0.15],
    [0.0525,-0.21,-0.15],
    [0,-0.21,-0.15],
    [-0.0525,-0.21,-0.15],
    [-0.105,-0.21,-0.15],
    [-0.1575,-0.21,-0.15],
    [0.1575,-0.1575,-0.15],
    [0.105,-0.1575,-0.15],
    [0.0525,-0.1575,-0.15],
    [0,-0.1575,-0.15],
    [-0.0525,-0.1575,-0.15],
    [-0.105,-0.1575,-0.15],
    [-0.1575,-0.1575,-0.15],
    [0.1575,-0.105,-0.15],
    [0.105,-0.105,-0.15],
    [0.0525,-0.105,-0.15],
    [0,-0.105,-0.15],
    [-0.0525,-0.105,-0.15],
    [-0.105,-0.105,-0.15],
    [-0.1575,-0.105,-0.15]
];
*/
var DEFAULT_CALIB_DIM = [4, 7]; // 4 rows, 7 columns

var DEFAULT_ARUCO_DIM = [5, 4]; // 5 rows * 4 cols= 20 patches

exports.methods = {

    // Called by the framework
    async __ca_init__() {
        this.state.id = null;
        this.$.session.limitQueue(1, APP_SESSION); // last notification
        this.state.fullName = this.__ca_getAppName__() + '#' +
            this.__ca_getName__();
        this.state.calibration = {
            points2D: DEFAULT_CALIB_DIM,
            points3D: DEFAULT_CALIB_3D,
            dimAruco: DEFAULT_ARUCO_DIM
        };
        return [];
    },

    async __ca_pulse__() {
        this.$.react.render(app.main, [this.state]);
        return [];
    },

    // Called by the vanilla web app
    async hello(key) {
        key && this.$.react.setCacheKey(key);
        return this.getState();
    },

    // Called by the webAR app
    async setIdentifier(id) {
        if (this.state.id !== id) {
            this.state.id = id;
            this.$.session.notify([this.state], APP_SESSION);
        }
        return this.getState();
    },

    async getState() {
        this.$.react.coin();
        return [null, this.state];
    }

};

caf.init(module);
