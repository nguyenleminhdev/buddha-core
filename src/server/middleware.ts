import { existsSync, readdirSync } from 'fs'
import { join } from 'path'
import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import { green } from 'chalk'
import { size, sortBy } from 'lodash'
import { add_log, get_file_name } from '../service'

import type { Express } from 'express'
import type { Cb } from '../interface'

/**
 * nạp middleware cấp app của dự án ở `helper/global_middleware`
 * - mỗi file export default 1 middleware, nạp theo thứ tự tên file
 * - chạy TRƯỚC cors, body-parser, static và mọi route: dành cho việc cần bao
 *   trọn vòng đời request như đo thời gian, log api, bắt cả lỗi giải mã body
 * - không có thư mục thì bỏ qua, dự án cũ không bị ảnh hưởng
 * - 1 file lỗi khi nạp thì chỉ bỏ file đó (báo ❌ ở bảng trạng thái lúc khởi
 *   động), không chặn các middleware khác và việc khởi động server
 */
const load_global_middleware = (APP: Express) => {
    try {
        /**đường dẫn đến nơi chứa middleware cấp app */
        const PATH = `${$project_dirname}/helper/global_middleware`

        if (!existsSync(PATH)) return

        sortBy(readdirSync(PATH))
            // chỉ nạp file code, bỏ file khai báo kiểu
            .filter(file_path => /\.(js|ts)$/.test(file_path) && !file_path.endsWith('.d.ts'))
            .forEach(file_path => {
                try {
                    /**middleware export default của file */
                    const MIDDLEWARE = require(join(PATH, file_path))?.default

                    if (MIDDLEWARE) APP.use(MIDDLEWARE)
                } catch (e) {
                    add_log({
                        type: 'middleware',
                        name: get_file_name(file_path),
                        address: (e as Error)?.message || String(e),
                        status: '❌',
                    })
                }
            })
    } catch (e) {
        // không đọc được thư mục (vd trùng tên với 1 file) thì bỏ cả nhóm, server vẫn khởi động
        add_log({
            type: 'middleware',
            name: 'global_middleware',
            address: (e as Error)?.message || String(e),
            status: '❌',
        })
    }
}

/**nạp các cài đặt của express */
export const loadMiddleware = (APP: Express, proceed: Cb) => {
    // nạp middleware cấp app của dự án đầu tiên để bao trọn vòng đời request
    load_global_middleware(APP)

    // load cors nếu có cài đặt
    if (size($env?.cors)) APP.use(cors($env?.cors))
    // nếu không thì không check cors
    else APP.use(cors())

    // bật log api nếu có cài đặt
    if ($env?.app?.log_level !== 'none') APP.use(morgan($env?.app?.log_level))

    // giới hạn kích thước tối đa body có thể truyền lên
    APP.use(json({ limit: $env?.app?.max_body_size }))

    // giải mã body truyền lên thành object
    APP.use(urlencoded({ limit: $env?.app?.max_body_size, extended: true }))

    APP.use((req, res, next) => {
        // gán giá trị i18n từ api
        req.locale = req.headers.locale as string

        // cho phép tất cả origin có thể gọi api
        res.setHeader('Access-Control-Allow-Origin', '*')

        next()
    })

    console.log(green`✔ Cors, body-parser, morgan loading successfully`)

    proceed()
}