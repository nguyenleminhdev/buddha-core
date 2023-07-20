import { json, urlencoded } from 'body-parser'
import cors from 'cors'
import morgan from 'morgan'
import { green } from 'chalk'
import { size } from 'lodash'
import express from 'express'

import type { Express } from 'express'
import type { Cb } from '../interface'

/**nạp các cài đặt của express */
export const loadMiddleware = (APP: Express, proceed: Cb) => {
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