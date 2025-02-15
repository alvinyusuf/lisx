'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { TransactionHashes, TransactionStage, TransactionStatus } from "./transaction"

export const formSchema = z.object({
  tokenAddressA: z.string(),
  tokenAmountA: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number({ message: "Amount of token A be a number" }).positive()
  ),
  tokenAddressB: z.string(),
  tokenAmountB: z.preprocess(
    (value) => parseInt(value as string, 10),
    z.number({ message: "Amount of token B be a number" }).positive()
  ),
})

export default function PairForm({
  onSubmit,
  isPendingA,
  isPendingB,
  isPendingPair,
  errorA,
  errorB,
  errorPair,
  transactionHashes,
  transactionStage }: {
    onSubmit: (values: z.infer<typeof formSchema>) => void,
    isPendingA: boolean
    isPendingB: boolean
    isPendingPair: boolean
    errorA: Error | null
    errorB: Error | null
    errorPair: Error | null
    transactionHashes: TransactionHashes
    transactionStage: TransactionStage
  }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tokenAddressA: '',
      tokenAmountA: 0,
      tokenAddressB: '',
      tokenAmountB: 0,
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 w-full">
        <FormField
          control={form.control}
          name="tokenAddressA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token A Address</FormLabel>
              <FormControl>
                <Input placeholder="Token A Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenAmountA"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token A Amount</FormLabel>
              <FormControl>
                <Input placeholder="Token A Amount" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenAddressB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token B Address</FormLabel>
              <FormControl>
                <Input placeholder="Token B Address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tokenAmountB"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token B Amount</FormLabel>
              <FormControl>
                <Input placeholder="Token B Amount" {...field} type="number" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Add Token</Button>
        <TransactionStatus
          errorA={errorA}
          errorB={errorB}
          errorPair={errorPair}
          isPendingA={isPendingA}
          isPendingB={isPendingB}
          isPendingPair={isPendingPair}
          hashes={transactionHashes}
          stage={transactionStage}
        />
      </form>
    </Form>
  )
}