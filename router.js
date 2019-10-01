const Router = require('koa-router')
const router = new Router();
const index = require('./routes/index.js')
const upRid = require('./routes/upRid.js')

module.exports = (app) => {
	

    router.use('/', index.routes())
	router.use('/upRid', upRid.routes())
   
    app.use(router.routes()).use(router.allowedMethods())
}