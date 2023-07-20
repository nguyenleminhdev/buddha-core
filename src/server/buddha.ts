import { readFile } from 'fs'
const { name, version } = require(`${process.cwd()}/package.json`)
import { yellow, blue, green } from 'chalk'

import type { Cb } from '../interface'

/**hiển thị hình ảnh của phật tổ để phù phép cho hệ thống */
export const loadBuddha = (proceed: Cb) => readFile(
    `${__dirname}/../buddha.txt`,
    'utf-8',
    (e, buddha) => {
        if (e) return proceed(e)

        if ($env?.app?.clear_log) console.clear()

        console.log(yellow(buddha))

        console.log(
            yellow`✨${name}✨`,
            blue` v${version}`,
            green`${process.env.NODE_NAME || ''}`,
            `${process.env.NODE_ENV || 'development'}`
        )

        console.table($logging)

        console.log(blue($env?.app.hello_message), '✅')

        proceed()
    }
)