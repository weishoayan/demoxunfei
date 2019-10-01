const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser')
const path = require('path')
const static = require('koa-static')
const koaViews= require('koa-views');

module.exports = (app) => {
	
    app.use(cors());
    app.use(bodyParser());
    app.use(static(path.join(__dirname, './public')))
    app.use(koaViews(path.join(__dirname, './views'), {extension: 'ejs'}));
}