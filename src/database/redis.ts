import { createClient } from 'redis'
import { eachOfLimit, waterfall } from 'async'
import { check_node_name } from '../server/database'
import { add_log } from '../service'
import { blue } from 'chalk'

import type { RedisClient } from 'redis'
import type { Cb, CbError, RedisConfig } from '../interface'

/**cài đặt kết nối đến redis */
export interface Redis {
    [index: string]: RedisClient
}

/**tạo kết nối đến redis */
export const load_default_redis_connect = (proceed: Cb) => {
    const DATA: Redis = {}
    waterfall([
        // * tạo kết nối đến toàn bộ redis
        (cb: CbError) => eachOfLimit(
            $env?.database?.redis,
            20,
            // kiểm tra kết nối có thoả mãn node không
            (config: RedisConfig, name, next) => check_node_name(config, (e, r) => {
                // nếu không thì bỏ qua
                if (e) return next()

                /**đường dẫn đến redis */
                const URI = `redis://${config.host}:${config.port}/${config.name}`

                /**kết nối đến redis */
                const NEW_CONNECT = createClient(URI)

                /**gắn cờ nếu xảy ra lỗi */
                let error_flag: any

                /**log cho hệ thống */
                const LOG = {
                    type: 'redis',
                    name: name as string,
                    address: URI,
                }

                NEW_CONNECT.on('error', e => {
                    if (error_flag) return

                    error_flag = e

                    add_log({ ...LOG, status: '❌' })

                    try { next() } catch (e) {}
                })

                NEW_CONNECT.on('ready', () => {
                    DATA[name] = NEW_CONNECT

                    add_log({ ...LOG, status: '✅' })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ redis`)

            cb()
        }
    ], e => e ? proceed(e) : proceed(null, DATA))
}