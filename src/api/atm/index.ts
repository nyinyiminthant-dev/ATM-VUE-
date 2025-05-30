import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";
import {useQuery, type UseQueryOptions} from "@tanstack/vue-query";



export const withdraw = {
    useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, WithdrawPayload>>) => {
        return useMutation<TransactionResponse, Error, WithdrawPayload>({
            mutationFn: async (payload: WithdrawPayload) => {
                const response = await axios.post(`ATM/Withdraw?accountNumber=${payload.accountNumber}&pin=${payload.pin}&amount=${payload.amount}`);
                return response.data;
            },
            ...opt,
        });
    },
};

export const deposite = {
    useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, DepositePayload>>) => {
        return useMutation<TransactionResponse, Error, DepositePayload>({
            mutationFn: async (payload: DepositePayload) => {
                const response = await axios.post(`ATM/Deposit?accountNumber=${payload.accountNumber}&pin=${payload.pin}&amount=${payload.amount}`);
                return response.data;
            },
            ...opt,
        });
    },
};

export const checkBalance = {
  useQuery: (
    accountNumber: string,
    opt?: Partial<UseQueryOptions<number, Error, string>>
  ) => {
    return useQuery<number, Error, string>({
      queryKey: ["ATM", "CheckBalance", accountNumber],
      queryFn: async () => {
        const response = await axios.get(`ATM/CheckBalance?accountNumber=${accountNumber}`);
        return response.data.data.amount;
      },
      ...opt,
    });
  },
};


export const history = {
  useQuery: (
    accountNumber: string,
    opt?: Partial<UseQueryOptions<Transaction[], Error>>
  ) => {
    return useQuery<Transaction[], Error>({
      queryKey: ['ATM', 'GetAll', accountNumber],
      queryFn: async (): Promise<Transaction[]> => {
        const response = await axios.get(`ATM/GetAll?accountNumber=${accountNumber}`);
        const rawData: RawTransaction[] = response.data.data;

        return rawData.map((txn) => ({
          accountNumber: txn.accountNumber,
          date: txn.transactionDate,
          type: txn.transactionType,
          amount: txn.amount,
        }));
      },
      ...opt,
    });
  },
};







export const transfer = {
    useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, TransferPayload>>) => {
        return useMutation<TransactionResponse, Error, TransferPayload>({
            mutationFn: async (payload: TransferPayload) => {
                const response = await axios.post(`ATM/Transfer?fromAccountNumber=${payload.fromAccountNumber}&toAccountNumber=${payload.toAccountNumber}&pin=${payload.pin}&amount=${payload.amount}`);
                return response.data;
            },
            ...opt,
        });
    },
};


export const validatePin = {
    useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, ValidatePinPayload>>) => {
        return useMutation<TransactionResponse, Error, ValidatePinPayload>({
            mutationFn: async (payload: ValidatePinPayload) => {
                const response = await axios.post("ATM/ValidatePin", payload);
                return response.data;
            },
            ...opt,
        });
    },

};



export const ChangePin = {
  useMutation: (opt?: Partial<UseMutationOptions<TransactionResponse, Error, ChangePinPayload>>) => {
      return useMutation<TransactionResponse, Error, ChangePinPayload>({
          mutationFn: async (payload: ChangePinPayload) => {
              const response = await axios.post(`ATM/ChangePIn?accountNumber=${payload.accountNumber}&pin=${payload.pin}&newPin=${payload.newPin}`);
              return response.data;
          },
          ...opt,
      });
  },

};
