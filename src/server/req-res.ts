import { readdirSync } from 'fs'
import { join } from 'path'
import express from 'express'
import { green, blue } from 'chalk'
import { parse } from 'path'

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
            const MODULE: { 
                default: Function 
            } = await import(join(path, file_path))

            /**tên của phương thức */
            const METHOD_NAME = parse(file_path).name

            // nạp các phương thức vào express
            express[type][METHOD_NAME] = MODULE.default

            console.log(blue`\t⇨ ${type}: ${METHOD_NAME}()`)
        })
}

/**nạp các phương thức custom vào express */
export const loadCustomRequestResponse = (proceed: Cb) => {
    console.log(green`✔ Custom request, response loading successfully`)

    customRequestResponse(
        'request',
        `${$project_dirname}/helper/request`
    )
    customRequestResponse(
        'response',
        `${$project_dirname}/helper/response`
    )

    proceed()
}