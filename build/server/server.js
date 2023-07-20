"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadServer = void 0;
const http_1 = require("http");
const chalk_1 = require("chalk");
const service_1 = require("../service");
/**khởi chạy server */
const loadServer = (APP, proceed) => {
    /**
     * ưu tiên ghi đè host, port ở env config của pm2
     * sau đó mới đến config của env
     */
    var _a, _b;
    /**host được khởi chạy */
    const HOST = process.env.HOST || ((_a = $env === null || $env === void 0 ? void 0 : $env.app) === null || _a === void 0 ? void 0 : _a.host) || '0.0.0.0';
    /**port được khởi chạy */
    const PORT = process.env.PORT || ((_b = $env === null || $env === void 0 ? void 0 : $env.app) === null || _b === void 0 ? void 0 : _b.port) || 1337;
    (0, http_1.createServer)(APP)
        .listen(PORT, HOST, () => {
        var _a;
        (0, service_1.add_log)({
            type: 'server',
            name: 'static',
            address: `http://${HOST}:${PORT}/*`,
            status: '✅'
        });
        (0, service_1.add_log)({
            type: 'server',
            name: 'http',
            address: `http://${HOST}:${PORT}/${(_a = $env === null || $env === void 0 ? void 0 : $env.app) === null || _a === void 0 ? void 0 : _a.prefix}/*`,
            status: '✅'
        });
        console.log((0, chalk_1.green) `✔ Server static loading successfully`);
        console.log((0, chalk_1.green) `✔ Http server loading successfully`);
        proceed();
    })
        .on('error', proceed);
};
exports.loadServer = loadServer;
