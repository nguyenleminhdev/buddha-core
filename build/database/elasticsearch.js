"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_default_elasticsearch_connect = void 0;
const async_1 = require("async");
const database_1 = require("../server/database");
const elasticsearch_1 = require("elasticsearch");
const service_1 = require("../service");
const chalk_1 = require("chalk");
/**tạo kết nối đến các ES mặc định */
const load_default_elasticsearch_connect = (proceed) => {
    const DATA = {};
    (0, async_1.waterfall)([
        // kết nối đến toàn bộ ES
        (cb) => (0, async_1.eachOfLimit)($env.database.elasticsearch, 20, 
        // kiểm tra node có thoả mãn không trước khi kết nối
        (config, name, next) => (0, database_1.check_node_name)(config, (e, r) => {
            // nếu không thì bỏ qua
            if (e)
                return next();
            /**đường dẫn đến ES */
            const URI = `${config.protocol}://${config.host}:${config.port}/`;
            /**kết nối đến ES */
            const NEW_CONNECT = new elasticsearch_1.Client({ hosts: URI, log: false });
            /**log cho hệ thống */
            const LOG = {
                type: 'elasticsearch',
                name: name,
                address: URI,
            };
            NEW_CONNECT.ping({ requestTimeout: 3000 }, e => {
                if (e) {
                    (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '❌' }));
                    return next();
                }
                DATA[name] = NEW_CONNECT;
                (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '✅' }));
                next();
            });
        }), cb),
        (cb) => {
            console.log((0, chalk_1.blue) `\t⇨ elasticsearch`);
            cb();
        },
    ], e => e ? proceed(e) : proceed(null, DATA));
};
exports.load_default_elasticsearch_connect = load_default_elasticsearch_connect;
