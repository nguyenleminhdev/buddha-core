import type { Cb } from '../interface'

/**bắt lỗi của hệ thống, làm máy chủ không bị sập */
export const CatchAllServerUnknownError = (proceed: Cb) => {
    process.on('unhandledRejection', (e: any) => {
        // nếu là lỗi kết nối của mongo thì bỏ qua
        if (e.stack.includes('MongooseServerSelectionError: connect ECONNREFUSED')) return

        console.log('CATCH [unhandledRejection]::', e)
    })

    process.on('uncaughtException', function (e) {
        console.log('CATCH [uncaughtException]::', e)
    })

    proceed()
}