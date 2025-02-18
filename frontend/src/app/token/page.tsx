'use client'

import { z } from "zod";
import { formSchema } from "./form";
import useAddToken from "@/hooks/token/useAddToken";
import TokenForm from "./form";
import ListToken from "@/components/token/list-token";

export default function Tokens() {
  const { addToken } = useAddToken()

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await addToken(values.tokenName, values.tokenAddress)
  }

  return (
    <div className="flex gap-x-4 py-10">
      <div className="flex flex-col items-center gap-y-2 w-full">
        <h1 className="font-bold text-xl">List Token</h1>
        <ListToken />
      </div>
      <div className="flex flex-col items-center w-full">
        <h1 className="font-bold text-xl">Add your token</h1>
        <TokenForm onSubmit={onSubmit} />
      </div>
    </div>
  );
}
