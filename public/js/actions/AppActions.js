var AppConstants = require('../constants/AppConstants');
var json_rpc = require('caf_transport').json_rpc;

var updateF = function(store, state) {
    var d = {
        type: AppConstants.APP_UPDATE,
        state: state
    };
    store.dispatch(d);
};

var errorF =  function(store, err) {
    var d = {
        type: AppConstants.APP_ERROR,
        error: err
    };
    store.dispatch(d);
};

var notifyF = function(store, message) {
    var getNotifData = function(msg) {
        return json_rpc.getMethodArgs(msg)[0];
    };
    var d = {
        type: AppConstants.APP_NOTIFICATION,
        state: getNotifData(message)
    };
    store.dispatch(d);
};

var wsStatusF =  function(store, isClosed) {
    var d = {
        type: AppConstants.WS_STATUS,
        isClosed: isClosed
    };
    store.dispatch(d);
};

var AppActions = {
    initServer(ctx, initialData) {
        updateF(ctx.store, initialData);
    },
    async init(ctx) {
        try {
            var data = await ctx.session.hello(ctx.session.getCacheKey())
                    .getPromise();
            updateF(ctx.store, data);
        } catch (err) {
            errorF(ctx.store, err);
        }
    },
    async setIdentifier(ctx, id) {
        try {
            var data = await ctx.session.setIdentifier(id).getPromise();
            updateF(ctx.store, data);
        } catch (err) {
            errorF(ctx.store, err);
        };
    },
    message(ctx, msg) {
        console.log('message:' + JSON.stringify(msg));
        notifyF(ctx.store, msg);
    },
    closing(ctx, err) {
        console.log('Closing:' + JSON.stringify(err));
        wsStatusF(ctx.store, true);
    },
    resetError: function(ctx) {
        errorF(ctx.store, null);
    },
    setError: function(ctx, err) {
        errorF(ctx.store, err);
    }

};


module.exports = AppActions;
