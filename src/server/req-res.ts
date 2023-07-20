import { readdirSync } from 'fs'
import { join } from 'path'
import express from 'express'
import { green, blue } from 'chalk'

import type { Cb } from '../interface'

/**nạp các phương thức tuỳ biến cho req, res của express */
const customRequestResponse = (
    type: 'request' | 'response',
    path: string
) => {
    // đọc các phương thức
    readdirSync(path)
        .forEach(async file_path => {
            /**dữ liệu của file */
            const module = await import(join(path, file_path))

            // nạp các phương thức vào express
            express[type][module.default.name] = module.default

            console.log(blue`\t⇨ ${type}: ${module.default.name}()`)
        })
}

/**nạp các phương thức custom vào express */
export const loadCustomRequestResponse = (proceed: Cb) => {
    console.log(green`✔ Custom request, response loading successfully`)

    customRequestResponse(
        'request',
        `${process.cwd()}/src/helper/request`
    )
    customRequestResponse(
        'response',
        `${process.cwd()}/src/helper/response`
    )

    proceed()
}