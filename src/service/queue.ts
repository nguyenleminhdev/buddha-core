import Bull from 'bull'
import { keys, map, size } from 'lodash'

import type { Queue as QueueType } from 'bull'
import type { RedisConfig, ProcessInfo } from '../interface'

/**danh sách các xử lý sự kiện */
interface ListProcess {
    [index: string]: ProcessInfo
}

/**tạo queue cho hệ thống */
export class Queue {
    private queue: QueueType<{
        /**tên sự kiện */
        event: string
        /**dữ liệu đầu vào của sự kiện */
        payload: any
    }>

    constructor(
        /**tên của queue */
        name: string,
        /**đường dẫn kết nối đến db redis */
        redis_config: RedisConfig,
        /**danh sách các code xử lý */
        list_process: ListProcess,
        /**giới hạn max số task cùng chạy một lúc */
        limit: number
    ) {
        this.queue = this._init(name, redis_config)

        this._fix_bug()

        this._add_process(list_process, limit)

        this._make_global(name)
    }

    /**khởi tạo queue */
    private _init(name: string, redis_config: RedisConfig) {
        return new Bull(
            name,
            `redis://${redis_config.host}:${redis_config.port}/${redis_config.name}`,
            // không chạy lại các task có vấn đề
            { settings: { maxStalledCount: 0 } }
        )
    }

    /**sử dụng một số thủ thuật để fix bug của thư viên bull */
    private _fix_bug() {
        // fix lỗi job đã done nhưng vẫn gắn cờ faild
        this.queue.on('failed', (job, e) => job.remove())
    }

    /**thêm các code xử lý cho queue */
    private _add_process(list_process: ListProcess, limit: number) {
        this.queue.process(limit, (job, done) => {
            let { event, payload } = job.data

            // nếu event không tồn tại thì kết thúc queue
            if (!keys(list_process).includes(event)) return done()

            // nạp danh sách các xử lý vào queue
            map(list_process, (process, process_name) => {
                if (event !== process_name) return

                process(payload, done)
            })
        })
    }

    /**thêm instant vào biến toàn cục */
    private _make_global(name: string) {
        if (!globalThis.$queue || !size(globalThis.$queue))
            globalThis.$queue = {}

        globalThis.$queue[name] = this
    }

    /**truyền dữ liệu vào queue để khởi chạy */
    public exec(event: string, payload?: any, priority?: number) {
        this.queue.add(
            {
                event,
                payload: payload || {}
            },
            {
                priority: priority || 1,
                // xoá task khi hoàn thành hay lỗi để giải phóng bộ nhớ
                removeOnComplete: true, removeOnFail: true
            }
        )
    }
}