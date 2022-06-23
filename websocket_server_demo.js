/*
 * @Author: leon shh@byteflyer.com
 * @Date: 2022-06-22 15:49:59
 * @LastEditors: leon shh@byteflyer.com
 * @LastEditTime: 2022-06-23 11:49:59
 * @FilePath: \undefinedd:\Project_2022\nodejsProject\ws\websocket_server_demo.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

var webscoket_module = require('./webscoket_server_module'); 
webscoket_module.init();
/*
const interval = setInterval(function () {
	webscoket_module.sendMsgToClient_ex("softap_f877",'{"type":"ws-sendMsgToClient_ex","data":"Welcome"}');
}, 1000);*/