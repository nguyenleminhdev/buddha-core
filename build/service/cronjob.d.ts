import { CronJob } from 'cron';
import type { CronCommand } from 'cron';
/**
 * tạo mới một cronjob
 * @param date chuỗi của cronjob
 * @param timezone mã của múi giờ
 * @param process code khi cronjob đến thời điểm
 * @returns
 */
export declare const new_cronjob: ({ date, timezone }: {
    date: string;
    timezone?: string | undefined;
}, process: CronCommand) => CronJob;
