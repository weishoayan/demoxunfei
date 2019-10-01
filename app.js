const koa = require('koa');
const body = require('koa-body');
const middleware = require('./middleware.js');
const router = require('./router.js');
const app = new koa();
const checkToken = require('./checkToken.js');
const wechat = require('./middleware/publicaddress.js')
app.use(body({multipart:true,formidable:{maxFileSize: 500*1024*1024}}));
middleware(app);
checkToken(app);
router(app);
wechat(app)

app.listen(3000);
console.log('[demo] start-quick is starting at port 3000')