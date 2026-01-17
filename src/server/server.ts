import { createServer } from 'http'
import { green } from 'chalk'
import { add_log } from '../service'

import type { Express } from 'express'
import type { Cb } from '../interface'

/**khởi chạy server */
export const loadServer = (APP: Express, proceed: Cb) => {
    /**
     * ưu tiên ghi đè host, port ở env config của pm2
     * sau đó mới đến config của env
     */

    /**host được khởi chạy */
    const HOST = process.env.HOST || $env?.app?.host || '0.0.0.0'
    /**port được khởi chạy */
    const PORT = process.env.PORT || $env?.app?.port || 1337

    // gán vào biến toàn cục
    globalThis.$server = createServer(APP)

    // khởi chạy server
    $server.listen(PORT as number, HOST, () => {
        add_log({
            type: 'server',
            name: 'static',
            address: `http://${HOST}:${PORT}/*`,
            status: '✅'
        })

        add_log({
            type: 'server',
            name: 'http',
            address: `http://${HOST}:${PORT}/${$env?.app?.prefix}/*`,
            status: '✅'
        })

        console.log(green`✔ Server static loading successfully`)

        console.log(green`✔ Http server loading successfully`)

        proceed()
    })
    .on('error', proceed)
}