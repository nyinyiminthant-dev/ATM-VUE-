type LoginPayload = {

  accountNumber: string
  password: string
}

type LoginResponse = {
  message: string;
  status: number;
  data: {
    userId: string;
    accountNumber: string;
    accountStatus: boolean;
    token: string;
    passwordStatus: boolean;
    balance: number;


  }
  };
