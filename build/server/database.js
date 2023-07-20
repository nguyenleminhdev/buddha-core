"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadDatabase = exports.check_node_name = void 0;
const async_1 = require("async");
const lodash_1 = require("lodash");
const chalk_1 = require("chalk");
const database_1 = require("../database");
/**kiểm tra kết nối đến db có thoả mãn ở node này hay không */
const check_node_name = (config, proceed) => {
    if (!config.node_name)
        return proceed();
    if (!process.env.NODE_NAME)
        return proceed();
    if (process.env.NODE_NAME === config.node_name)
        return proceed();
    if ((0, lodash_1.isArray)(config.node_name) &&
        config.node_name.includes(process.env.NODE_NAME))
        return proceed();
    proceed('BLOCK');
};
exports.check_node_name = check_node_name;
/**nạp các CSDL vào biến toàn cục */
const loadDatabase = (proceed) => {
    console.log((0, chalk_1.green) `✔ Database is loading successfully`);
    const DATA = {};
    (0, async_1.waterfall)([
        (cb) => (0, database_1.load_default_mongodb_connect)((e, r) => {
            if (e)
                return cb(e);
            DATA.mongodb = r;
            cb();
        }),
        (cb) => (0, database_1.load_default_redis_connect)((e, r) => {
            if (e)
                return cb(e);
            DATA.redis = r;
            cb();
        }),
        (cb) => (0, database_1.load_default_elasticsearch_connect)((e, r) => {
            if (e)
                return cb(e);
            DATA.elasticsearch = r;
            cb();
        }),
        // * nạp các kết nối db vào biến toàn cục
        (cb) => {
            globalThis.$database = DATA;
            cb();
        },
    ], proceed);
};
exports.loadDatabase = loadDatabase;
