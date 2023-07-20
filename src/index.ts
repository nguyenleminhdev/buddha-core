import express from 'express'
import { waterfall } from 'async'
import {
    CatchAllServerUnknownError, loadCurrentEnvConfig, loadCustomRequestResponse,
    loadBuddha, loadBootstrap, loadConstant, loadLanguage, loadMiddleware,
    loadDefaultEndpoint, loadRouter, loadServer, loadStatic, loadSocket,
    loadDatabase,
} from './server'

export * from './interface'
export * from './service'
export * from './server'
export * from './database'

import type { CbError } from './interface'

/**khởi chạy hệ thống */
export const init = () => {
    // khởi tạo đối tượng của server
    const APP = express()

    // xoá toàn bộ log trước đó
    console.clear()

    waterfall([
        (cb: CbError) => CatchAllServerUnknownError(cb),
        (cb: CbError) => loadCurrentEnvConfig(cb),
        (cb: CbError) => loadConstant(cb),
        (cb: CbError) => loadLanguage(cb),
        (cb: CbError) => loadDatabase(cb),
        (cb: CbError) => loadMiddleware(APP, cb),
        (cb: CbError) => loadStatic(APP, cb),
        (cb: CbError) => loadCustomRequestResponse(cb),
        (cb: CbError) => loadRouter(APP, cb),
        (cb: CbError) => loadBootstrap(cb),
        (cb: CbError) => loadDefaultEndpoint(APP, cb),
        (cb: CbError) => loadSocket(cb),
        (cb: CbError) => loadServer(APP, cb),
        (cb: CbError) => loadBuddha(cb),
    ], e => { if (e) console.log('START SERVER ERROR::', e) })
}