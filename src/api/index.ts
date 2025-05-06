
import * as products from './products'
import * as login from './login'
import * as register from './register'
import * as atm from './atm'
import * as verify from './verifyAccount'
import * as createPin from './createPin'

import * as ResentOTP from './restendOtp'

class API {
  products = products

  login = login
  register = register
  atm = atm
  verify = verify
  createPin = createPin
  ResentOTP = ResentOTP


}

const api = new API()
export default api
