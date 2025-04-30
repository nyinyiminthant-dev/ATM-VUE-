
type WithdrawPayload = {
  accountNumber: string;
  amount: number;
  pin: number;
};


type DepositePayload = {
  accountNumber: string;
  pin: number;
  amount: number;
};

type BalancePayload = {
  accountNumber: string;

};

type TransferPayload = {
  fromAccountNumber: string;
  toAccountNumber: string;
  amount: number;
  pin: number;
};


type ValidatePinPayload = {

  pin: number;
};



type TransactionResponse = {
  message: string;
  status: number;
  data: {
    transactionID: string;
    userID: string;
    transactionType: string | null;
    amount: number;
    transactionDate: string;
    accountNumber: string;
    fromAccount: string | null;
    toAccount: string | null;
  };
};

