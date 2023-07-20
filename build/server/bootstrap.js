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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadBootstrap = exports.check_node_valid = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const lodash_1 = require("lodash");
const chalk_1 = require("chalk");
/**chỉ load code bên trong khi node thoả mãn */
const check_node_valid = (
/**tên của node */
name, 
/**callback */
proceed) => {
    // nếu không có node name thì cho qua
    if (!process.env.NODE_NAME)
        return proceed();
    // nếu node name khớp thì cho qua
    if (process.env.NODE_NAME === name)
        return proceed();
    // nếu node name khớp thì cho qua
    if ((0, lodash_1.isArray)(name) && name.includes(process.env.NODE_NAME))
        return proceed();
    return;
};
exports.check_node_valid = check_node_valid;
/**nạp các code xử lý khi hệ thống khởi động */
const loadBootstrap = (proceed) => {
    /**đường dẫn đến code */
    const PATH = `${process.cwd()}/src/helper/bootstrap`;
    Promise
        .all((0, fs_1.readdirSync)(PATH).map((r) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        // nạp toàn bộ code
        yield (_a = (0, path_1.join)(PATH, r), Promise.resolve().then(() => __importStar(require(_a))));
        return r;
    })))
        .then(r => {
        console.log((0, chalk_1.green) `✔ Bootstrap loading successfully`);
        console.log((0, chalk_1.blue) `\t⇨ ${r}`);
        proceed();
    })
        .catch(e => proceed());
};
exports.loadBootstrap = loadBootstrap;
