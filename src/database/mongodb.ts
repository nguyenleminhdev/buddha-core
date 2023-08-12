import { eachOfLimit, waterfall } from 'async'
import { createConnection } from 'mongoose'
import { check_node_name } from '../server/database'
import { add_log } from '../service'
import { blue, red } from 'chalk'

import type { Schema, Connection } from 'mongoose'
import type { Cb, CbError, LogItemInfo, MongodbConfig } from '../interface'

/**cài đặt kết nối đến mongo */
export interface Mongodb {
    [index: string]: Connection
}

/**tạo kết nối đến mongodb */
export const connect_mongodb = (
    /**cài đặt cho kết nối */
    config: MongodbConfig,
    /**callback */
    proceed: Cb
) => {
    /**kết nối đến mongodb */
    const NEW_CONNECT = createConnection(
        `mongodb://${config.host}:${config.port}`,
        {
            autoIndex: true,
            serverSelectionTimeoutMS: 5000,
            connectTimeoutMS: 10000,
            socketTimeoutMS: 45000,
        }
    )

    NEW_CONNECT.on('error', e => {
        try { proceed(e.message || e) } catch (error) { }
    })

    NEW_CONNECT.on('connected', () => {
        try { proceed(null, NEW_CONNECT.useDb(config.name, { useCache: true })) } catch (e) { }
    })
}

/**tạo model cho mongodb */
export const create_model_mongodb = (
    /**tên của db */
    db_name: string,
    /**tên của model */
    model_name: string,
    /**schema của model */
    schema: Schema
) => $database?.mongodb?.[db_name]?.model(model_name, schema)

/**nạp các kết nối mongodb mặc định */
export const load_default_mongodb_connect = (proceed: Cb) => {
    const DATA: Mongodb = {}

    waterfall([
        // * tạo kết nối đến toàn bộ các db mặc định
        (cb: CbError) => eachOfLimit(
            $env?.database?.mongodb,
            20,
            // kiểm tra kết nối thoả mãn node trước khi tạo
            (config: MongodbConfig, name, next) => check_node_name(config, (e, r) => {
                // nếu kết nối thất bại thì bỏ qua
                if (e) return next()

                // tạo kết nối
                connect_mongodb(config, (e, connection: Connection) => {
                    /**dữ liệu cho log */
                    const LOG: LogItemInfo = {
                        type: 'mongodb',
                        name: name as string,
                        address: `mongodb://${config.host}:${config.port}/${config.name}`,
                    }

                    if (e) {
                        add_log({ ...LOG, status: '❌' })

                        // nếu kết nối thất bại thì bỏ qua
                        return next()
                    }

                    DATA[name] = connection

                    add_log({ ...LOG, status: '✅' })

                    next()
                })
            }),
            cb
        ),
        (cb: CbError) => { // * log
            console.log(blue`\t⇨ mongodb`)
            console.log(blue`\t\t⇨ basic`)
            console.log(red`\t\t❌ tenant`)

            cb()
        },
    ], e => e ? proceed(e) : proceed(null, DATA))
}