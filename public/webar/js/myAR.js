"use strict";

var arUtil = require('./arUtil');
var cvUtil = require('./cvUtil');
var threeUtil = require('./threeUtil');

exports.init = async function(ctx, data) {
    var state =  data || {};
    var localState = {};
    var unsubscribe = null;

    var that = {
        mount: function() {
            if (!unsubscribe) {
                unsubscribe = ctx.store.subscribe(that.onChange);
                that.onChange();
            }
        },
        unmount: function() {
            if (unsubscribe) {
                unsubscribe();
                unsubscribe = null;
            }
        },
        onChange: function() {
            if (unsubscribe) {
                state = ctx.store.getState();
            }
        }
    };

    var animate = function(time, frame) {
        // render 3D, do it first to capture the video input
        threeUtil.process(localState, state, frame);
        // get 6DoF camera position/rotation
        arUtil.process(localState, state, frame);
        // read & analyze input frame
        cvUtil.process(localState, state, frame);
        localState.ar.session.requestAnimationFrame(animate);
    };

    await arUtil.init(ctx, localState, data);
    await cvUtil.init(ctx, localState, data);
    await threeUtil.init(ctx, localState, data);
    that.mount();
    localState.ar.session.requestAnimationFrame(animate);
    return that;
};
