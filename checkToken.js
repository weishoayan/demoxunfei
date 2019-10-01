// const checkToken = require('./middleware/token.js')
const checkToken = require('./middleware/newToken.js')

module.exports = (app) => {
	app.use(checkToken);//验证access-token
}