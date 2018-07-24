var React = require('react');
var rB = require('react-bootstrap');
var AppActions = require('../actions/AppActions');
var AppStatus = require('./AppStatus');
var DisplayError = require('./DisplayError');
var urlParser = require('url');

var cE = React.createElement;

var MyApp = {
    getInitialState: function() {
        return this.props.ctx.store.getState();
    },
    componentDidMount: function() {
        if (!this.unsubscribe) {
            this.unsubscribe = this.props.ctx.store
                .subscribe(this._onChange.bind(this));
            this._onChange();
        }
    },
    componentWillUnmount: function() {
        if (this.unsubscribe) {
            this.unsubscribe();
            this.unsubscribe = null;
        }
    },
    _onChange : function() {
        if (this.unsubscribe) {
            this.setState(this.props.ctx.store.getState());
        }
    },

    doAR: function() {
        if (window && window.location && window.location.href) {
            var myURL = urlParser.parse(window.location.href);
            myURL.pathname = '/webar/index.html';
            myURL.hash = myURL.hash.replace('session=default', 'session=ar');
            delete myURL.search; // delete cacheKey
            window.open(urlParser.format(myURL), '_blank');
        }
    },

    render: function() {
        return cE('div', {className: 'container-fluid'},
                  cE(DisplayError, {
                      error: this.state.error
                  }),
                  cE(rB.Panel, {
                      header: cE(rB.Grid, {fluid: true},
                                 cE(rB.Row, null,
                                    cE(rB.Col, {sm:1, xs:1},
                                       cE(AppStatus, {
                                           isClosed: this.state.isClosed
                                       })),
                                    cE(rB.Col, {
                                        sm: 5,
                                        xs:10,
                                        className: 'text-right'
                                    }, 'Aruco'),
                                    cE(rB.Col, {
                                        sm: 5,
                                        xs:11,
                                        className: 'text-right'
                                    }, this.state.fullName)
                                   )
                                )
                  }, cE(rB.Panel, {header: 'Aruco Identifier'},
                        cE(rB.Grid, {fluid: true},
                           cE(rB.Row, null,
                              cE(rB.Col, { sm:6, xs:10}, this.state.id),
                              cE(rB.Col, { sm: 6, xs:10}, cE(rB.Button, {
                                  bsStyle: 'primary',
                                  onClick: this.doAR
                              }, "Show AR"))
                             )
                          )
                       )
                    )
                 );
    }
};

module.exports = React.createClass(MyApp);
