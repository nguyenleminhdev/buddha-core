import { waterfall } from 'async'
import { isArray } from 'lodash'
import { green } from 'chalk'
import {
    load_default_mongodb_connect, load_default_redis_connect,
    load_default_elasticsearch_connect
} from '../database'

import type { Cb, CbError } from '../interface'

/**
 * trong trường hợp deploy ở nhiều máy chủ, có khả năng sẽ sử dụng đến db nội bộ
 * của máy, mà không thể được truy cập từ bên ngoài
 * sử dụng cài đặt này để chỉ định node_name nào được phép kết nối, hạn chế việc
 * node kết nối đến một db không tiếp cập được
 */
export interface NodeName {
    /**tên của node */
    node_name?: string | string[]
}

/**kiểm tra kết nối đến db có thoả mãn ở node này hay không */
export const check_node_name = (config: NodeName, proceed: Cb) => {
    if (!config.node_name) return proceed()
    if (!process.env.NODE_NAME) return proceed()
    if (process.env.NODE_NAME === config.node_name) return proceed()
    if (
        isArray(config.node_name) &&
        config.node_name.includes(process.env.NODE_NAME)
    ) return proceed()

    proceed('BLOCK')
}

/**nạp các CSDL vào biến toàn cục */
export const loadDatabase = (proceed: Cb) => {
    console.log(green`✔ Database is loading successfully`)

    const DATA: any = {}
    waterfall([
        (cb: CbError) => load_default_mongodb_connect((e, r) => {
            if (e) return cb(e)

            DATA.mongodb = r
            cb()
        }),
        (cb: CbError) => load_default_redis_connect((e, r) => {
            if (e) return cb(e)

            DATA.redis = r
            cb()
        }),
        (cb: CbError) => load_default_elasticsearch_connect((e, r) => {
            if (e) return cb(e)

            DATA.elasticsearch = r
            cb()
        }),
        // * nạp các kết nối db vào biến toàn cục
        (cb: CbError) => {
            globalThis.$database = DATA

            cb()
        },
    ], proceed)
}