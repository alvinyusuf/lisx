'use client'

import { z } from "zod";
import { formSchema } from "./form";
import useAddToken from "@/hooks/token/useAddToken";
import useGetTokenList from "@/hooks/token/useGetTokenList";
import { IoIosArrowDropdownCircle } from "react-icons/io";
import TokenForm from "./form";

export default function Tokens() {
  const { addToken } = useAddToken()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addToken(values.tokenName, values.tokenAddress)
  }

  const { data, isPending } = useGetTokenList() as { data: Array<{ name: string, tokenAddress: string }>, isPending: boolean }

  return (
    <div className="flex gap-x-4 py-10">
      <div className="flex flex-col items-center gap-y-2 w-full">
        <h1 className="font-bold text-xl">List Token</h1>
        {!isPending && (
          data?.map((token, idx) => (
            <div key={idx} className="flex justify-between px-4 py-2 items-center bg-secondary rounded-xl text-white">
              <p className="font-bold text-xl">{token.name}</p>
              <div className="flex items-center gap-x-4">
                <p>{token.tokenAddress}</p>
                <IoIosArrowDropdownCircle size={24} />
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex flex-col items-center w-full">
        <h1 className="font-bold text-xl">Add your token</h1>
        <TokenForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
