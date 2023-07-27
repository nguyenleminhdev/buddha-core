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
exports.loadCustomRequestResponse = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const express_1 = __importDefault(require("express"));
const chalk_1 = require("chalk");
const path_2 = require("path");
/**nạp các phương thức tuỳ biến cho req, res của express */
const customRequestResponse = (type, path) => {
    // đọc các phương thức
    (0, fs_1.readdirSync)(path)
        .forEach((file_path) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        /**dữ liệu của file */
        const MODULE = yield (_a = (0, path_1.join)(path, file_path), Promise.resolve().then(() => __importStar(require(_a))));
        /**tên của phương thức */
        const METHOD_NAME = (0, path_2.parse)(file_path).name;
        // nạp các phương thức vào express
        express_1.default[type][METHOD_NAME] = MODULE.default;
        console.log((0, chalk_1.blue) `\t⇨ ${type}: ${METHOD_NAME}()`);
    }));
};
/**nạp các phương thức custom vào express */
const loadCustomRequestResponse = (proceed) => {
    console.log((0, chalk_1.green) `✔ Custom request, response loading successfully`);
    customRequestResponse('request', `${$project_dirname}/helper/request`);
    customRequestResponse('response', `${$project_dirname}/helper/response`);
    proceed();
};
exports.loadCustomRequestResponse = loadCustomRequestResponse;
