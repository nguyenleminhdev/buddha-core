"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_default_redis_connect = void 0;
const redis_1 = require("redis");
const async_1 = require("async");
const database_1 = require("../server/database");
const service_1 = require("../service");
const chalk_1 = require("chalk");
/**tạo kết nối đến redis */
const load_default_redis_connect = (proceed) => {
    const DATA = {};
    (0, async_1.waterfall)([
        // * tạo kết nối đến toàn bộ redis
        (cb) => {
            var _a;
            return (0, async_1.eachOfLimit)((_a = $env === null || $env === void 0 ? void 0 : $env.database) === null || _a === void 0 ? void 0 : _a.redis, 20, 
            // kiểm tra kết nối có thoả mãn node không
            (config, name, next) => (0, database_1.check_node_name)(config, (e, r) => {
                // nếu không thì bỏ qua
                if (e)
                    return next();
                /**đường dẫn đến redis */
                const URI = (config === null || config === void 0 ? void 0 : config.username) && (config === null || config === void 0 ? void 0 : config.password) ?
                    `redis://${config.username}:${config.password}@${config.host}:${config.port}/${config.name}` :
                    `redis://${config.host}:${config.port}/${config.name}`;
                /**kết nối đến redis */
                const NEW_CONNECT = (0, redis_1.createClient)(URI);
                /**gắn cờ nếu xảy ra lỗi */
                let error_flag;
                /**log cho hệ thống */
                const LOG = {
                    type: 'redis',
                    name: name,
                    address: URI,
                };
                NEW_CONNECT.on('error', e => {
                    if (error_flag)
                        return;
                    error_flag = e;
                    (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '❌' }));
                    try {
                        next();
                    }
                    catch (e) { }
                });
                NEW_CONNECT.on('ready', () => {
                    DATA[name] = NEW_CONNECT;
                    (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '✅' }));
                    next();
                });
            }), cb);
        },
        (cb) => {
            console.log((0, chalk_1.blue) `\t⇨ redis`);
            cb();
        }
    ], e => e ? proceed(e) : proceed(null, DATA));
};
exports.load_default_redis_connect = load_default_redis_connect;
