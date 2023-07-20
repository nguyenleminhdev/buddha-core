import { CronJob } from 'cron'

import type { CronCommand } from 'cron'

/**
 * tạo mới một cronjob
 * @param date chuỗi của cronjob
 * @param timezone mã của múi giờ
 * @param process code khi cronjob đến thời điểm
 * @returns 
 */
export const new_cronjob = (
    {
        date,
        timezone = 'Asia/Ho_Chi_Minh'
    }: {
        date: string,
        timezone?: string
    },
    process: CronCommand
) => new CronJob(date, process, null, true, 'Asia/Ho_Chi_Minh')