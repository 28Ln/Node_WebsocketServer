//*************************************************************//

// import ws library / framework
var WebSocketServer = require('ws').Server
// create websocket server

var _HOST_ = "0.0.0.0";
var _PORT_ = 8080;
var wss = new WebSocketServer({ host: _HOST_, port: _PORT_ });
var clients_ws = [];  //keep track of open ws sockets
var clients_name = [];//keep track of connected clients(stores usernames)
var checkIsAliveTimeOut = 15000;

//*************************************************************//
const Logger = require('2o3t-logger');
const logger = Logger.instance('names', {
	disabledFile: false,
});
/* @example:

Log_info('2o3t!');
Log_warn('2o3t!');
logger.error('2o3t!');
logger.fatal('2o3t!');*/
//*************************************************************//
const LOG_DEBUG = true;
const LOG_INFO = true;
const LOG_WARN = true;
const LOG_ERROR = true;
const LOG_FATAL = true;

function Log_debug(msg) { if (LOG_DEBUG) logger.debug(msg); }
function Log_info(msg) { if (LOG_INFO) logger.info(msg); }
function Log_warn(msg) { if (LOG_WARN) logger.warn(msg); }
function Log_fatal(msg) { if (LOG_FATAL) logger.fatal(msg); }
function Log_error(msg) { if (LOG_ERROR) logger.error(msg); }
//*************************************************************//

var webscoket_module = {
	init(){
		const thiz = this
		const interval = setInterval(function ping() {
			clients_ws.forEach(function each(ws) {
				if (ws.isAlive == false) {
					if (ws.readyState != 2) {
						ws.terminate();
					}
					thiz.removeClients(ws, "checkIsAlive-close");
					Log_warn(`[checkIsAlive] ClientName=${ws.ClientName} IP=${ws.ip}:PORT=${ws.port} checkIsAliveTimeOut=${checkIsAliveTimeOut}ms exec ws.terminate()`);
				} else {
					if (ws.readyState === 1) {
						ws.ping();
					}
					ws.isAlive = false;
					Log_warn(`[checkIsAlive] ClientName=${ws.ClientName} ws.isAlive=${ws.isAlive} && ws.readyState=${ws.readyState}  IP=${ws.ip}:PORT=${ws.port} Alive send ping..`);
				}
			});
		}, checkIsAliveTimeOut);

		wss.on('connection', function (ws, req) {
			const ip = req.connection.remoteAddress;
			const port = req.connection.remotePort;

			Log_debug(`[connection] IP=${ip}:PORT=${port} clients_ws number of ws:${clients_ws.length}`);
			//add client ws socket to active list
			clients_ws.push(ws);
			//holds client's username (uid)
			var username;
			ws.isAlive = true;
			ws.ip = ip;
			ws.port = port;
			// Welcome the user (connection ack)
			ws.on('pong', function heartbeat() {
				//ws.isAlive = true;
				Log_info(`[pong] ClientName=${ws.ClientName} isAlive=${ws.isAlive} IP=${ip}:PORT=${port} `);
			});


			ws.on('message', function (JSONmessage) {
				//convert message to JSON Object
				if (!JSONmessage.includes("keepalive")) {
					var jsO = JSON.parse(JSONmessage);
					//*******************************************//
					//determine type of message
					switch (jsO.command) {
						case "connect":// client connected
							ws.isAlive = true;
							ws.ClientName = jsO.client_name;
							//is username taken?
							if (clients_name.indexOf(ws.ClientName) >= 0) {
								Log_debug(`[message-connect-1] ClientName=${ws.ClientName} is already taken::${clients_name} | clients count=${clients_ws.length} `);
							} else {
								thiz.addClient(ws.ClientName);
								thiz.addClientFristSendMsg(ws);
							}
							break;
						/*case "remove_monitor":
						case "add_monitor":
							thiz.sendMsgToClient(ws, '{"type":"ws-message","data":"remove_monitor-remove_monitor"}');
							break;*/

					}
					//*******************************************//
				}
			});

			ws.on('close', function () {
				//thiz.removeClients(ws, "connect-close");
			});
		});
	},

	getClientIsAlive(client_name) {
		return clients_name.indexOf(client_name) >= 0;
	},

	removeClients(ws, msg) {
		//remove ws from active list
		//clearInterval(interval);
		var i = clients_ws.indexOf(ws);
		var ClientName = ws.ClientName;
		clients_ws.splice(i, 1);
		// check if ClientName was accepted		
		if (ClientName) {
			// remove client from active list
			var j = clients_name.indexOf(ClientName);
			clients_name.splice(j, 1);
			Log_warn(`[${msg}] ClientName=${ClientName} dropped => number of clients:${clients_name.length}}`);
		}
	},
	addClient(ClientName) {
		//add client to active list
		clients_name.push(ClientName);
		Log_debug(`[addClient] ClientName=${ClientName} number of clients:${clients_name.length}`);
	},

	addClientFristSendMsg(ws) {
		Log_info(`[addClientFristSendMsg] ClientName=${ws.ClientName} frist connect send msg`);
		this.sendMsgToClient(ws, "frist connect msg");
	},

	sendMsgToClient(ws, msg) {
		if (this.getClientIsAlive(ws.ClientName) && ws.readyState === 1) {
			ws.send(msg);
			Log_info(`[sendMsgToClient-1] ClientName=${ws.ClientName} Online Send Msg:${msg}`);
		} else {
			Log_info(`[sendMsgToClient-2] ClientName=${ws.ClientName} Not Online, Msg:${msg}}`);
		}
	},
	getClient(ClientName) {
		/*clients_ws.forEach(function each(ws) {
			if (ws.ClientName === ClientName) {
				Log_warn(`[getClient] ClientName=${ws.ClientName} IP=${ws.ip}:PORT=${ws.port} `);
				return ws;
			}
		});*/
		for (var i = 0; i < clients_ws.length; i++) {
			if (clients_ws[i].ClientName === ClientName) {
				Log_info(`[getClient-1] ClientName=${clients_ws[i].ClientName} IP=${clients_ws[i].ip}:PORT=${clients_ws[i].port} `);
				return clients_ws[i];
			}
		}
		Log_warn(`[getClient-2] Not find ClientNmae=${ClientName} clients_ws count:${clients_ws.length} `);
	},
	sendMsgToClient_ex(ClientName, msg) {
		var ws = this.getClient(ClientName);
		if (ws && ws.readyState === 1) {
			ws.send(msg);
			Log_info(`[sendMsgToClient_ex-1] ClientName=${ws.ClientName} Online Send msg:${msg}`);
		} else {
			Log_info(`[sendMsgToClient_ex-2] ClientName=${ClientName} Not online, and messages cannot be sent.}`);
		}
	}

}


module.exports = webscoket_module;


