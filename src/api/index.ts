
import * as products from './products'
import * as login from './Login'
import * as register from './Register'
import * as atm from './ATM'
import * as verify from './verifyAccount'
import * as createPin from './createPin'

class API {
  products = products

  login = login
  register = register
  atm = atm
  verify = verify
  createPin = createPin


}

const api = new API()
export default api
