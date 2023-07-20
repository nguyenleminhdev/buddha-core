"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_master_node = void 0;
const cluster_1 = __importDefault(require("cluster"));
/**kiểm tra xem node hiện tại có phải là master hay không */
const is_master_node = () => (cluster_1.default.isPrimary ||
    process.env.NODE_APP_INSTANCE === '0');
exports.is_master_node = is_master_node;
