"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.new_cronjob = void 0;
const cron_1 = require("cron");
/**
 * tạo mới một cronjob
 * @param date chuỗi của cronjob
 * @param timezone mã của múi giờ
 * @param process code khi cronjob đến thời điểm
 * @returns
 */
const new_cronjob = ({ date, timezone = 'Asia/Ho_Chi_Minh' }, process) => new cron_1.CronJob(date, process, null, true, 'Asia/Ho_Chi_Minh');
exports.new_cronjob = new_cronjob;
