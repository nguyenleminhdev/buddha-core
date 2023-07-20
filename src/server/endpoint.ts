import { green } from 'chalk'
import express from 'express'

import type { Request, Response, NextFunction, Express } from 'express'
import type { Cb } from '../interface'

/**nạp các xử lý api mặc định */
export const loadDefaultEndpoint = (APP: Express,proceed: Cb) => {
    // trả về thông báo chào mừng
    APP.get('/', (req, res) => res.ok($env?.app.hello_message))

    // trả về 404
    APP.use((req, res, proceed) => {
        res.err('NOT_FOUND.API', 404, req.path)
    })

    // trả về 500 khi server có lỗi hệ thống
    APP.use((
        (e, req, res, proceed) => {
            console.log(500, e)

            res.err(e.message || e, 500)
        }
    ) as (
        err: Error,
        req: Request,
        res: Response,
        proceed: NextFunction
    ) => void)

    console.log(green`✔ Default endpoint loading successfully`)

    proceed()
}