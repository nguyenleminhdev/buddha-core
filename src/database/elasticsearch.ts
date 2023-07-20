import { eachOfLimit, waterfall } from 'async'
import { check_node_name } from '../server/database'
import { Client } from 'elasticsearch'
import { add_log } from '../service'
import { blue } from 'chalk'

import type { Cb, CbError, ElasticsearchConfig } from '../interface'

/**cài đặt kết nối đến ES */
export interface Elasticsearch {
    [index: string]: Client
}

/**tạo kết nối đến các ES mặc định */
export const load_default_elasticsearch_connect = (proceed: Cb) => {
    const DATA: Elasticsearch = {}
    waterfall([
        // kết nối đến toàn bộ ES
        (cb: CbError) => eachOfLimit(
            $env.database.elasticsearch,
            20,
            // kiểm tra node có thoả mãn không trước khi kết nối
            (config: ElasticsearchConfig, name, next) => check_node_name(config, (e, r) => {
                // nếu không thì bỏ qua
                if (e) return next()

                /**đường dẫn đến ES */
                const URI = `${config.protocol}://${config.host}:${config.port}/`

                /**kết nối đến ES */
                const NEW_CONNECT = new Client({ hosts: URI, log: false })

                /**log cho hệ thống */
                const LOG = {
                    type: 'elasticsearch',
                    name: name as string,
                    address: URI,
                }

                NEW_CONNECT.ping({ requestTimeout: 3000 }, e => {
                    if (e) {
                        add_log({ ...LOG, status: '❌' })
                        return next()
                    }

                    DATA[name] = NEW_CONNECT

                    add_log({ ...LOG, status: '✅' })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ elasticsearch`)

            cb()
        },
    ], e => e ? proceed(e) : proceed(null, DATA))
}