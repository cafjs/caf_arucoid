"use strict";

var THREE = require('three');

exports.init = async function(ctx, localState, data) {

    var threeState = {};
    var arSession = localState.ar.session;

    threeState.renderer = new THREE.WebGLRenderer({
        alpha: true,
        preserveDrawingBuffer: true
    });
    threeState.renderer.autoClear = false;

    threeState.gl = threeState.renderer.getContext();
    await threeState.gl.setCompatibleXRDevice(arSession.device);

    arSession.depthNear = 0.01;
    arSession.depthFar = 1000;
    arSession.baseLayer = new window.XRWebGLLayer(arSession, threeState.gl);

    threeState.scene = new THREE.Scene();

    threeState.camera = new THREE.PerspectiveCamera();
    threeState.camera.matrixAutoUpdate = false;

    localState.three = threeState;

    console.log('threeUtil init done');
    return threeState;
/*
    var display = null;
    var group = new THREE.Group();
    var light = new THREE.DirectionalLight(0xFFFFFF, 1.5);
    group.add(light);
    var light2 = new THREE.AmbientLight(0xFFFFFF, 0.7);
    group.add(light2);
    group.visible = true;
 */
};

exports.process = function(localState, state, frame) {
    var arState = localState.ar;
    var threeState = localState.three;
    var pose = frame.getDevicePose(arState.frameOfRef);
    var session = frame.session;
    var renderer = threeState.renderer;
    var camera = threeState.camera;
    var scene = threeState.scene;
    var gl = threeState.gl;

    gl.bindFramebuffer(gl.FRAMEBUFFER, session.baseLayer.framebuffer);

    if (pose) {
        for (let view of frame.views) {
            const viewport = session.baseLayer.getViewport(view);
            renderer.setSize(viewport.width, viewport.height);
            camera.projectionMatrix.fromArray(view.projectionMatrix);
            const viewMatrix = new THREE.Matrix4()
                      .fromArray(pose.getViewMatrix(view));
            camera.matrix.getInverse(viewMatrix);
            camera.updateMatrixWorld(true);

            renderer.clearDepth();
            renderer.render(scene, camera);
        }
    }
};
