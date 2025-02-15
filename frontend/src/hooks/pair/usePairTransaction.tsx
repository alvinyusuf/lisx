import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import erc20 from '@/abi/erc20.json'
import router from '@/abi/router.json'
import { z } from 'zod'
import { formSchema } from '@/app/pair/form'

export type TransactionStage = 'idle' | 'approveA' | 'approveB' | 'addLiquidity' | 'completed'

export interface TransactionHashes {
  approveA: string
  approveB: string
  addLiquidity: string
}

export function usePairTransaction() {
  const [transactionStage, setTransactionStage] = useState<TransactionStage>('idle')
  const [values, setValues] = useState<z.infer<typeof formSchema>>({
    tokenAddressA: '',
    tokenAmountA: 0,
    tokenAddressB: '',
    tokenAmountB: 0,
  })
  const [transactionHashes, setTransactionHashes] = useState<TransactionHashes>({
    approveA: '',
    approveB: '',
    addLiquidity: ''
  })

  const { writeContract: approveA, data: hashApproveA, isPending: pendingA, error: errorA } = useWriteContract()
  const { writeContract: approveB, data: hashApproveB, isPending: pendingB, error: errorB } = useWriteContract()
  const { writeContract: addLiquidity, data: hashAddLiquidity, isPending: pendingAddLiquidity, error: errorAddLiquidity } = useWriteContract()
  
  const { isSuccess: isApproveA, isError: isErrorA } = useWaitForTransactionReceipt({ hash: hashApproveA })
  const { isSuccess: isApproveB, isError: isErrorB } = useWaitForTransactionReceipt({ hash: hashApproveB })
  const { isSuccess: isAddLiquidity, isError: isErrorLiquidity } = useWaitForTransactionReceipt({ hash: hashAddLiquidity })

  useEffect(() => {
    if (isErrorA || isErrorB || isErrorLiquidity) {
      setTransactionStage('idle')
    }
  }, [isErrorA, isErrorB, isErrorLiquidity])

  useEffect(() => {
    if (transactionStage === 'approveA' && isApproveA) {
      approveB({
        address: values.tokenAddressB as `0x${string}`,
        abi: erc20,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`, BigInt(values.tokenAmountB  * 10 ** 18)]
      })
      setTransactionStage('approveB')
    }
  }, [isApproveA, transactionStage, approveB, values.tokenAddressB, values.tokenAmountB])

  useEffect(() => {
    if (transactionStage === 'approveB' && isApproveB) {
      addLiquidity({
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
        abi: router,
        functionName: 'addLiquidity',
        args: [
          values.tokenAddressA as `0x${string}`,
          values.tokenAddressB as `0x${string}`,
          BigInt(values.tokenAmountA  * 10 ** 18),
          BigInt(values.tokenAmountB  * 10 ** 18)]
      })
      setTransactionStage('addLiquidity')
    }
  }, [isApproveB, transactionStage, addLiquidity, values.tokenAddressA, values.tokenAmountA, values.tokenAddressB, values.tokenAmountB])

  useEffect(() => {
    if (isAddLiquidity && transactionStage === 'addLiquidity') {
      setTransactionStage('completed')
    }
  }, [isAddLiquidity, transactionStage])

  useEffect(() => {
    if (hashApproveA) {
      setTransactionHashes(prev => ({ ...prev, approveA: hashApproveA }))
    }
  }, [hashApproveA])

  useEffect(() => {
    if (hashApproveB) {
      setTransactionHashes(prev => ({ ...prev, approveB: hashApproveB }))
    }
  }, [hashApproveB])

  useEffect(() => {
    if (hashAddLiquidity) {
      setTransactionHashes(prev => ({ ...prev, addLiquidity: hashAddLiquidity }))
    }
  }, [hashAddLiquidity])

  function startTransaction(values: z.infer<typeof formSchema>) {
    setValues(values)
    try {
      approveA({
        address: values.tokenAddressA as `0x${string}`,
        abi: erc20,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`, BigInt(values.tokenAmountA  * 10 ** 18)]
      })
      setTransactionStage('approveA')
    } catch (error) {
      console.error(error);
    }
  }

  return {
    startTransaction,
    transactionStage,
    transactionHashes,
    pendingA,
    pendingB,
    pendingAddLiquidity,
    errorA,
    errorB,
    errorAddLiquidity
  }
}