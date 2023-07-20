"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSocket = void 0;
const chalk_1 = require("chalk");
/**nạp logic cho socket */
const loadSocket = (proceed) => {
    console.log((0, chalk_1.red) `❌ Socket is incomming feature`);
    console.log((0, chalk_1.red) `\t⇨ socket.io`);
    console.log((0, chalk_1.red) `\t⇨ websocket`);
    proceed();
};
exports.loadSocket = loadSocket;
