import { useMutation } from "@tanstack/react-query";
import { client } from "@/app/libs/hono";
import type { InferRequestType, InferResponseType } from "hono";
import toast from "react-hot-toast";
type ResponseType = InferResponseType<
  (typeof client.api.register)["$post"]>;
export type RequestType = InferRequestType<
  (typeof client.api.register)["$post"]
>["json"];

export const useRegister = () => {
  return useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.register.$post({ json });
      console.log(response, "response");
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }
      return await response.json();
    },
    onSuccess: () => {
      toast.success("注册成功");
    },
    onError: (error) => {
      toast.error(error.message || "注册失败");
    }
  });
}