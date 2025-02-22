"use client";
import Button from "@/app/components/Button";
import Input from "@/app/components/inputs/Input";
import { useCallback, useEffect, useState } from "react";
import { useForm, FieldValues, type SubmitHandler } from "react-hook-form";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { useRegister ,RequestType } from "../api/use-register";
import { signIn, useSession } from "next-auth/react";
import toast from "react-hot-toast";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession()
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate } = useRegister()
  const toggleVariant = useCallback(() => {
    setVariant((currentVariant) =>
      currentVariant === "LOGIN" ? "REGISTER" : "LOGIN"
    );
  }, [variant]);

  useEffect(() => {
    if (session.status === "authenticated") {
      toast.success('登录成功')
    }
    
  },[session?.status])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
      .then((callback) => {
        if(callback?.error) {
          toast.error('登录失败')
        }
        if(callback?.ok && !callback?.error) {
          toast.success('登录成功')
        }
      })
      .finally(() => {
        setIsLoading(false);
      })
    }
    if (variant === "REGISTER") {
      mutate(data as RequestType, {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);  
        }
      })
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);
    signIn(action, { redirect: false })
    .then((callback) => {
      if(callback?.error) {
        toast.error('登录失败')
      }
      if(callback?.ok && !callback?.error) {
        toast.success('登录成功')
      }
    })
    .finally(() => {
      setIsLoading(false);
    })
  };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name"
              label="姓名"
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            type="email"
            required
            id="email"
            label="邮箱"
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            type="password"
            required
            id="password"
            label="密码"
          />

          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "登录" : "注册"}
            </Button>
          </div>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className=" absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500 dark:bg-dusk dark:text-gray-200">
                  或者使用
                </span>
              </div>
          </div>
          <div className="mt-6 flex gap-2">
              <AuthSocialButton icon={BsGithub} onClick={() => socialAction("github")} />
              <AuthSocialButton icon={BsGoogle} onClick={() => socialAction("google")} />
            </div>
        </div>
        <div
            className="
            mt-6 
            flex 
            justify-center 
            gap-2 
            px-2 
            text-sm 
            text-gray-500
            dark:text-gray-400
          "
          >
            <div>{variant === "LOGIN" ? "第一次使用Messenger?" : "已经有一个账户?"}</div>
            <div onClick={toggleVariant} className="cursor-pointer underline">
              {variant === "LOGIN" ? "创建一个账户" : "登录"}
            </div>
          </div>
      </div>
    </div>
  );
};

export default AuthForm;
