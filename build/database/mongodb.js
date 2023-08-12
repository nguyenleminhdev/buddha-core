"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.load_default_mongodb_connect = exports.create_model_mongodb = exports.connect_mongodb = void 0;
const async_1 = require("async");
const mongoose_1 = require("mongoose");
const database_1 = require("../server/database");
const service_1 = require("../service");
const chalk_1 = require("chalk");
/**tạo kết nối đến mongodb */
const connect_mongodb = (
/**cài đặt cho kết nối */
config, 
/**callback */
proceed) => {
    /**kết nối đến mongodb */
    const NEW_CONNECT = (0, mongoose_1.createConnection)(`mongodb://${config.host}:${config.port}`, {
        autoIndex: true,
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
        socketTimeoutMS: 45000,
    });
    NEW_CONNECT.on('error', e => {
        try {
            proceed(e.message || e);
        }
        catch (error) { }
    });
    NEW_CONNECT.on('connected', () => {
        try {
            proceed(null, NEW_CONNECT.useDb(config.name, { useCache: true }));
        }
        catch (e) { }
    });
};
exports.connect_mongodb = connect_mongodb;
/**tạo model cho mongodb */
const create_model_mongodb = (
/**tên của db */
db_name, 
/**tên của model */
model_name, 
/**schema của model */
schema) => { var _a, _b; return (_b = (_a = $database === null || $database === void 0 ? void 0 : $database.mongodb) === null || _a === void 0 ? void 0 : _a[db_name]) === null || _b === void 0 ? void 0 : _b.model(model_name, schema); };
exports.create_model_mongodb = create_model_mongodb;
/**nạp các kết nối mongodb mặc định */
const load_default_mongodb_connect = (proceed) => {
    const DATA = {};
    (0, async_1.waterfall)([
        // * tạo kết nối đến toàn bộ các db mặc định
        (cb) => {
            var _a;
            return (0, async_1.eachOfLimit)((_a = $env === null || $env === void 0 ? void 0 : $env.database) === null || _a === void 0 ? void 0 : _a.mongodb, 20, 
            // kiểm tra kết nối thoả mãn node trước khi tạo
            (config, name, next) => (0, database_1.check_node_name)(config, (e, r) => {
                // nếu kết nối thất bại thì bỏ qua
                if (e)
                    return next();
                // tạo kết nối
                (0, exports.connect_mongodb)(config, (e, connection) => {
                    /**dữ liệu cho log */
                    const LOG = {
                        type: 'mongodb',
                        name: name,
                        address: `mongodb://${config.host}:${config.port}/${config.name}`,
                    };
                    if (e) {
                        (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '❌' }));
                        // nếu kết nối thất bại thì bỏ qua
                        return next();
                    }
                    DATA[name] = connection;
                    (0, service_1.add_log)(Object.assign(Object.assign({}, LOG), { status: '✅' }));
                    next();
                });
            }), cb);
        },
        (cb) => {
            console.log((0, chalk_1.blue) `\t⇨ mongodb`);
            console.log((0, chalk_1.blue) `\t\t⇨ basic`);
            console.log((0, chalk_1.red) `\t\t❌ tenant`);
            cb();
        },
    ], e => e ? proceed(e) : proceed(null, DATA));
};
exports.load_default_mongodb_connect = load_default_mongodb_connect;
