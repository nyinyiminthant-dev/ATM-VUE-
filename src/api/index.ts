
import * as products from './products'
import * as login from './login'
import * as register from './register'
import * as atm from './atm'
import * as verify from './verifyAccount'
import * as createPin from './createPin'

import * as ResentOTP from './restendOtp'
import { jwtDecode } from 'jwt-decode';





interface JwtPayload {
  accountNumber?: string;
  name?: string;
  upn?: string;
  [key: string]: unknown;
}

class API {
  products = products

  login = login
  register = register
  atm = atm
  verify = verify
  createPin = createPin
  ResentOTP = ResentOTP


  getUserAccountNumberFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No JWT token found in localStorage (expected key: "token").');
      return null;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      console.log('Decoded JWT:', decoded);

      const accountNumber = Array.isArray(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'])
        ? decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'][0]
        : null;

      if (!accountNumber || typeof accountNumber !== 'string' || accountNumber.trim() === '') {
        console.error('User account number not found in token claims (checked: "name").');
        return null;
      }

      return accountNumber;
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  };




}










const api = new API()
export default api



