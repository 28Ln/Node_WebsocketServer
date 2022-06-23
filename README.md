<!--
 * @Author: leon shh@byteflyer.com
 * @Date: 2022-06-23 11:51:06
 * @LastEditors: leon shh@byteflyer.com
 * @LastEditTime: 2022-06-23 11:57:15
 * @FilePath: \undefinedd:\Project_2022\nodejsProject\ws\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
# V1.0.0
----
基础实现了NodeJS Websocket Server端module，和一些对外的方法调用。
## 使用方法：
### 1.引入websocket module
```
var webscoket_module = require('./webscoket_server_module'); 
webscoket_module.init();
```
### 2.测试方法
```
使用postman，websocket测试 连接：ws://192.168.1.7:8001
发送：{"type":"client_send","command":"connect","client_name":"softap_f877"} 
客户端15秒没有发送再次发送这个心跳，server会断开连接。
```

