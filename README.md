# Buddha Core
```
///////////////////////////////\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
卐                          _ooOoo_                            卐
卐                         o8888888o                           卐
卐                         88" . "88                           卐
卐                         (| ^_^ |)                           卐
卐                         O\  =  /O                           卐
卐                      ____/`---'\____                        卐
卐                    .'  \\|     |//  `.                      卐
卐                   /  \\|||  :  |||//  \                     卐
卐                  /  _||||| -:- |||||-  \                    卐
卐                  |   | \\\  -  /// |   |                    卐
卐                  | \_|  ''\---/''  |   |                    卐
卐                  \  .-\__  `-`  ___/-. /                    卐
卐                ___`. .'  /--.--\  `. . ___                  卐
卐             ."" '<  `.___\_<|>_/___.'  >'"".                卐
卐            | | :  `- \`.;`\ _ /`;.`/ - ` : | |              卐
卐            \  \ `-.   \_ __\ /__ _/   .-` /  /              卐
卐      ========`-.____`-.___\_____/___.-`____.-'========      卐
卐                           `=---='                           卐
卐      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^      卐
卐      No Crash ||  Buddha Blessing my Server  || No Bug      卐
\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\////////////////////////////////
```

**Core logic of Buddha.ts**

- Buddha.ts is an npm package that helps you easily build Node.js and TypeScript applications with a well-organized, modular, and efficient project structure. 
- Designed with the flexibility and power of TypeScript, Buddha.ts makes development easier by reducing risks during the development and maintenance of your source code.

## Features
- Easy-to-manage project structure: Buddha.ts provides an optimized project structure, allowing you to focus on building essential features of your application without worrying about code organization.
- TypeScript support: Utilizing TypeScript for your source code provides superior benefits during development and maintenance, such as compile-time error detection and intelligent autocompletion.
- Modular architecture: With a modular architecture, you can reuse code and minimize conflicts between different parts of your application.
- Testing support: Buddha.ts integrates support for writing simple and effective tests, ensuring the stability and reliability of your application.
- Integration of powerful features: Take advantage of powerful features like middleware, routing, validation, logging, and more to reduce development time and accelerate the deployment of your application.

## Installation
To start using Buddha.ts in your project, install it via npm:

```bash
npm install buddha-core
```

## Usage
For detailed usage instructions, you can refer to the Documentation (incomming).

### Global middleware
Each file in `helper/global_middleware/` of the project default-exports one Express middleware. They are mounted on the app in file-name order, **before** cors, body-parser, static and every route, so they wrap the whole request lifecycle (timing, API logging, catching body-parser errors). The folder is optional. A file that throws while loading is skipped and shown as ❌ in the startup table; the other middleware and the server still start.

The default error handler stores the original error in `res.locals.error` before calling `res.err(message, code)`, and keeps the status of client errors thrown by libraries (`expose: true`, e.g. invalid JSON → 400, body too large → 413) instead of turning them into 500.

## Contributions
We always welcome contributions from the community to improve and enhance Buddha.ts. If you encounter any issues or have ideas for new features, feel free to open an issue or submit your pull request.

## Author
Buddha.ts is written and developed by Andrew Nguyen.

Email: nguyenleminhdev@gmail.com

## License
Buddha.ts is licensed under the MIT License.