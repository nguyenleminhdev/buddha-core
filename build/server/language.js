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
exports.loadLanguage = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const lodash_1 = require("lodash");
const chalk_1 = require("chalk");
const service_1 = require("../service");
/**trả về dữ liệu i18n */
const t = (alias, language = 'vn') => {
    /**dữ liệu nguồn của ngôn ngữ được chọn */
    const SOURCE = (0, lodash_1.get)($lang.source, language, {});
    // trả về i18n
    return (0, lodash_1.get)(SOURCE, alias, alias);
};
/**nạp các phương thức của i18n */
function loadLanguage(proceed) {
    return __awaiter(this, void 0, void 0, function* () {
        /**đường dẫn đến thư mục chứa source i18n */
        const LANG_PATH = `${process.cwd()}/src/lang`;
        Promise
            .all(
        // nạp toàn bộ các file trong thư mục
        (0, fs_1.readdirSync)(LANG_PATH)
            .map((file_path) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            return ({
                name: (0, service_1.get_file_name)(file_path),
                data: yield (_a = (0, path_1.join)(LANG_PATH, file_path), Promise.resolve().then(() => __importStar(require(_a))))
            });
        })))
            .then(r => {
            /**dữ liệu nguồn của i18n */
            let source = {};
            console.log((0, chalk_1.green) `✔ Language i18n loading successfully`);
            // nạp dữ liệu của các file vào nguồn
            r.map(n => {
                /**dữ liệu nguồn của 1 tập tin */
                const TEMP = {};
                // map lại dữ liệu theo tên của tập tin
                TEMP[n.name] = n.data.default;
                // nạp dữ liệu vào nguồn
                source = Object.assign(Object.assign({}, source), TEMP);
                (0, lodash_1.keys)(TEMP).map(n => console.log((0, chalk_1.blue) `\t⇨ ${n}`));
            });
            // nap vào cài đặt của i18n
            globalThis.$lang = { source, t };
            proceed();
        });
    });
}
exports.loadLanguage = loadLanguage;
