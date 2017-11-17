'use strict';

var async = require('async');
var Promise = require('bluebird');
var waitUntilBlockchainReady = require('../../common/globalBefore').waitUntilBlockchainReady;
var utils = require('../utils');

module.exports = {

	waitForAllNodesToBeReady: function (configurations, cb) {
		async.forEachOf(configurations, function (configuration, index, eachCb) {
			waitUntilBlockchainReady(eachCb, 20, 2000, 'http://' + configuration.ip + ':' + configuration.port);
		}, cb);
	},

	enableForgingOnDelegates: function (configurations, cb) {
		var enableForgingPromises = [];
		configurations.forEach(function (configuration) {
			configuration.secrets.forEach(function (keys) {
				utils.http.enableForging();
				var enableForgingPromise = popsicle.put({
					url: 'http://' + configuration.ip + ':' + configuration.port + '/api/delegates/forging',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					body: {
						key: 'elephant tree paris dragon chair galaxy',
						publicKey: keys.publicKey
					}
				});
				enableForgingPromises.push(enableForgingPromise);
			});
		});
		Promise.all(enableForgingPromises).then(function () {
			cb();
		}).catch(function () {
			cb('Failed to enable forging on delegates');
		});
	}
};
