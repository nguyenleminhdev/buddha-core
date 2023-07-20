import express from 'express'

import type { Cb } from '../interface'
import type { Express } from 'express'

/**cài đặt server phục vụ static cho các file */
export const loadStatic = (APP: Express, proceed: Cb) => {
    APP.use(express.static(
        // nơi folder được phục vụ
        `${process.cwd()}/${$env.app.public_path}`,
        {
            setHeaders: function setHeaders(res, path, stat) {
                // cho phép tất cả origin gọi được tập tin
                res.header('Access-Control-Allow-Origin', '*')
            }
        }
    ))

    proceed()
}