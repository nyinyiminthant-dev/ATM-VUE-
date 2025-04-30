import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";


export const verifyAccount = {
  useMutation: (opt?: Partial<UseMutationOptions<VerifyResponse, Error, VerifyPayload>>) => {
      return useMutation<VerifyResponse, Error, VerifyPayload>({
          mutationFn: async (payload: VerifyPayload) => {
              const response = await axios.post(`Bank/VerifyAccount?accountNumber=${payload.accountNumber}&otp=${payload.otp}`);
              return response.data;
          },
          ...opt,
      });
  },
};
