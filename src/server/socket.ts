import { red } from 'chalk'

import type { Cb } from '../interface'

/**nạp logic cho socket */
export const loadSocket = (proceed: Cb) => {
    console.log(red`❌ Socket is incomming feature`)
    console.log(red`\t⇨ socket.io`)
    console.log(red`\t⇨ websocket`)

    proceed()
}