


type VerifyResponse = {
  message: string;
  status: number;
  data: {
    userID: string;
    userName: string;
    accountNumber: string;
    email: string;
    password: string;
    wallet: number;
    islock: string;
    createAt: string;
    updateAt: string;
    otp: string;
    otP_Exp: string;
    pin: number;
    status: string;
  };
}


type VerifyPayload = {
  accountNumber: string;
  otp: string;
}
