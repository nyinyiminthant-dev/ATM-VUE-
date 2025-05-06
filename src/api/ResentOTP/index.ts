import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";


export const ResendOTP = {
  useMutation: (opt?: Partial<UseMutationOptions<ResendOTPResponse, Error, ResendPayLoad>>) => {
      return useMutation<ResendOTPResponse, Error, ResendPayLoad>({
          mutationFn: async (payload: ResendPayLoad) => {
              const response = await axios.post(`Bank/ResendOTP?accountNumber=${payload.accountNumber}`);
              return response.data;
          },
          ...opt,
      });
  },
};
