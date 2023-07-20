"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBuddha = void 0;
const fs_1 = require("fs");
const { name, version } = require(`${process.cwd()}/package.json`);
const chalk_1 = require("chalk");
/**hiển thị hình ảnh của phật tổ để phù phép cho hệ thống */
const loadBuddha = (proceed) => (0, fs_1.readFile)(`${__dirname}/../buddha.txt`, 'utf-8', (e, buddha) => {
    var _a;
    if (e)
        return proceed(e);
    if ((_a = $env === null || $env === void 0 ? void 0 : $env.app) === null || _a === void 0 ? void 0 : _a.clear_log)
        console.clear();
    console.log((0, chalk_1.yellow)(buddha));
    console.log((0, chalk_1.yellow) `✨${name}✨`, (0, chalk_1.blue) ` v${version}`, (0, chalk_1.green) `${process.env.NODE_NAME || ''}`, `${process.env.NODE_ENV || 'development'}`);
    console.table($logging);
    console.log((0, chalk_1.blue)($env === null || $env === void 0 ? void 0 : $env.app.hello_message), '✅');
    proceed();
});
exports.loadBuddha = loadBuddha;
