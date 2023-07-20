"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRouter = void 0;
const fs_1 = require("fs");
const async_1 = require("async");
const path_1 = require("path");
const lodash_1 = require("lodash");
const chalk_1 = require("chalk");
const service_1 = require("../service");
const express_1 = __importDefault(require("express"));
/**đọc toàn bộ tên file của folder */
const get_all_file_name_folder = (root_path, proceed) => {
    const DATA = [];
    /**đệ quy đọc toàn bộ tên file của folder */
    const recursive = (path, proceed) => (0, async_1.eachOfLimit)(
    // đọc tên file của folder hiện tại
    (0, fs_1.readdirSync)(path), 1, (name, i, next) => {
        /**đường dẫn đến file hiện tại */
        const CURRENT_PATH = `${path}/${name}`;
        // lấy thông tin của tập tin này
        (0, fs_1.lstat)(CURRENT_PATH, (e, r) => {
            if (e)
                return next(e);
            // nếu là folder thì đệ quy để lấy toàn bộ dự liệu cần thiết bên trong
            if (r.isDirectory())
                return recursive(CURRENT_PATH, next);
            DATA.push({
                full_path: CURRENT_PATH,
                // xoá bỏ các dữ liệu thừa để lấy path
                path: CURRENT_PATH
                    .replace(root_path, '')
                    .replace('.ts', '')
                    .replace('.js', '')
                    .replace(/index/g, ''),
            });
            next();
        });
    }, proceed);
    // bắt đầu chạy
    recursive(root_path, e => e ? proceed(e) : proceed(null, DATA));
};
/**nạp các middleware vào router */
const load_middleware = (ROUTER, proceed) => {
    /**đường dẫn đến nơi chứa middleware */
    const PATH = `${process.cwd()}/src/api/middleware`;
    const DATA = {
        config_middleware: {},
        list_middleware: {}
    };
    (0, async_1.waterfall)([
        // * đọc code của middleware
        (cb) => Promise.all((0, fs_1.readdirSync)(PATH).map((n) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            return {
                name: (0, service_1.get_file_name)(n),
                source: yield (_a = (0, path_1.join)(PATH, n), Promise.resolve().then(() => __importStar(require(_a))))
            };
        }))).then(n => {
            DATA.list_middleware = (0, lodash_1.keyBy)(n, 'name');
            cb();
        }),
        // * đọc cấu hình
        (cb) => {
            var _a;
            (_a = `${process.cwd()}/src/config/middleware`, Promise.resolve().then(() => __importStar(require(_a)))).then(r => {
                DATA.config_middleware = r === null || r === void 0 ? void 0 : r.default;
                cb();
            });
        },
        // * thêm middleware vào router
        (cb) => {
            console.log((0, chalk_1.green) `✔ Middleware loading successfully`);
            (0, async_1.eachOfLimit)(DATA.config_middleware, 1, (v, k, next) => {
                /**code của middleware */
                const LIST_HANDLE = v.map(n => (0, lodash_1.get)(DATA.list_middleware, [n, 'source', 'default'])).filter(n => n);
                if (!LIST_HANDLE.length)
                    return next();
                // thêm vào router
                ROUTER.use((0, path_1.join)('/', k), ...LIST_HANDLE);
                console.log((0, chalk_1.blue) `\t⇨ ${v.join(' >> ')} >> ${k}`);
                next();
            }, cb);
        }
    ], proceed);
};
/**xử lý code thành dạng chuẩn */
const handle_controller = (path, source, proceed) => {
    const DATA = {
        controller_list: []
    };
    (0, async_1.eachOfLimit)(source, 1, (controller, name, next) => {
        DATA.controller_list.push({
            path: (0, path_1.join)(path, name.replace(/index/g, '')),
            controller
        });
        next();
    }, e => e ? proceed(e) : proceed(null, DATA.controller_list));
};
/**xử lý code ban đầu để nạp vào router */
const handle_controller_list = (input, proceed) => {
    const DATA = {
        controller_list: []
    };
    (0, async_1.waterfall)([
        // * export const
        (cb) => handle_controller(input.path, input.source, (e, r) => {
            if (e)
                return cb(e);
            DATA.controller_list = [...DATA.controller_list, ...r];
            cb();
        }),
        // * export default
        (cb) => handle_controller(input.path, input.default, (e, r) => {
            if (e)
                return cb(e);
            DATA.controller_list = [...DATA.controller_list, ...r];
            cb();
        }),
    ], e => e ? proceed(e) : proceed(null, DATA.controller_list));
};
/**nạp toàn bộ dữ liệu của controller vào làm api */
const load_controller = (ROUTER, proceed) => {
    const DATA = {
        path_list: [],
        source_list: [],
        controller_list: [],
    };
    (0, async_1.waterfall)([
        // * đọc tên của toàn bộ các file trong controller
        (cb) => get_all_file_name_folder(`${process.cwd()}/src/api/controller`, (e, r) => {
            if (e)
                return cb(e);
            DATA.path_list = r;
            cb();
        }),
        // * import code của các file đã đọc được
        (cb) => Promise.all(DATA.path_list.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            /**code các api của file này */
            const SOURCE = yield (_a = file.full_path, Promise.resolve().then(() => __importStar(require(_a))));
            /**code dạng default của file */
            const DEFAULT = SOURCE.default || {};
            // loại bỏ code default trong source gốc
            delete SOURCE.default;
            // thêm code đọc được vào đường dẫn
            return Object.assign(Object.assign({}, file), { source: SOURCE, default: DEFAULT });
        }))).then(r => {
            DATA.source_list = r;
            cb();
        }),
        // * xử lý code để nạp vào router
        (cb) => {
            console.log((0, chalk_1.green) `✔ Api loading successfully`);
            // * xử lý source
            (0, async_1.eachOfLimit)(DATA.source_list, 1, (source_data, i, next) => handle_controller_list(source_data, (e, r) => {
                if (e)
                    return next(e);
                DATA.controller_list = [...DATA.controller_list, ...r];
                r.map(n => console.log((0, chalk_1.blue) `\t⇨ ${n.path}`));
                next();
            }), cb);
        },
        // * nạp code vào router
        (cb) => (0, async_1.eachOfLimit)(DATA.controller_list, 1, (n, i, next) => {
            if ((0, lodash_1.isArray)(n.controller))
                ROUTER.all(n.path, ...n.controller);
            else
                ROUTER.all(n.path, n.controller);
            next();
        }, cb)
    ], proceed);
};
/**nạp toàn bộ các xử lý api vào router */
const loadRouter = (APP, proceed) => {
    /**khởi tạo đối tượng router */
    const ROUTER = express_1.default.Router();
    (0, async_1.waterfall)([
        // * nạp toàn bộ các middleware
        (cb) => load_middleware(ROUTER, cb),
        // * nạp toàn bộ các controller
        (cb) => load_controller(ROUTER, cb),
        // * nạp prefix cho router
        (cb) => {
            var _a;
            APP.use(`/${(_a = $env === null || $env === void 0 ? void 0 : $env.app) === null || _a === void 0 ? void 0 : _a.prefix}`, ROUTER);
            cb();
        },
    ], proceed);
};
exports.loadRouter = loadRouter;
