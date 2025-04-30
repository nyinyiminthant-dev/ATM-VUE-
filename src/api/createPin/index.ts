import axios from "axios";
import { useMutation, type UseMutationOptions } from "@tanstack/vue-query";


export const createPin = {
  useMutation: (opt?: Partial<UseMutationOptions<CreatePinResponse, Error, CreatePinPayload>>) => {
      return useMutation<CreatePinResponse, Error, CreatePinPayload>({
          mutationFn: async (payload: CreatePinPayload) => {
              const response = await axios.post(`Bank/CreatePIN?accountNumber=${payload.accountNumber}`, payload);
              return response.data;
          },
          ...opt,
      });
  },
};
