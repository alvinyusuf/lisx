// hooks/usePairTransaction.ts
import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract, useReadContract } from 'wagmi'
import erc20 from '@/abi/erc20.json'
import router from '@/abi/router.json'
import { z } from 'zod'

export type TransactionStage = 'idle' | 'approving' | 'swap' | 'completed' | 'failed'

export interface TransactionHashes {
  approveA: string
  approveB: string
  swap: string
}

export interface TransactionStatus {
  isApproved: {
    A: boolean
    B: boolean
  }
  isPending: {
    A: boolean
    B: boolean
    swap: boolean
  }
  errors: {
    A: Error | null
    B: Error | null
    swap: Error | null
  }
}

export const formSchema = z.object({
  tokenAddressA: z.string().min(1, 'Token Address A is required'),
  tokenAmountA: z.number().nonnegative('Token Amount A must be a non-negative number'),
  tokenAddressB: z.string().min(1, 'Token Address B is required'),
  tokenAmountB: z.number().nonnegative('Token Amount B must be a non-negative number'),
});


export function useSwap() {
  const deadline = Math.floor(Date.now() / 1000) + 300;
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
    swap: ''
  })
  const [status, setStatus] = useState<TransactionStatus>({
    isApproved: { A: false, B: false },
    isPending: { A: false, B: false, swap: false },
    errors: { A: null, B: null, swap: null }
  })

  const { writeContract: approveA, data: hashApproveA, isPending: pendingA, error: errorA } = useWriteContract()
  const { writeContract: approveB, data: hashApproveB, isPending: pendingB, error: errorB } = useWriteContract()
  const { writeContract: swap, data: hashSwap, isPending: pendingSwap, error: errorSwap } = useWriteContract()
  
  const { isSuccess: isApproveA, isError: isErrorA } = useWaitForTransactionReceipt({ hash: hashApproveA })
  const { isSuccess: isApproveB, isError: isErrorB } = useWaitForTransactionReceipt({ hash: hashApproveB })
  const { isSuccess: isSwap, isError: isErrorSwap } = useWaitForTransactionReceipt({ hash: hashSwap })

  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      isPending: {
        A: pendingA,
        B: pendingB,
        swap: pendingSwap
      },
      errors: {
        A: errorA,
        B: errorB,
        swap: errorSwap
      }
    }))
  }, [pendingA, pendingB, pendingSwap, errorA, errorB, errorSwap])

  useEffect(() => {
    if (isApproveA) {
      setStatus(prev => ({
        ...prev,
        isApproved: { ...prev.isApproved, A: true }
      }))
    }
    if (isApproveB) {
      setStatus(prev => ({
        ...prev,
        isApproved: { ...prev.isApproved, B: true }
      }))
    }
  }, [isApproveA, isApproveB])

  useEffect(() => {
    if ((isErrorA && hashApproveA) || (isErrorB && hashApproveB) || (isErrorSwap && hashSwap)) {
      setTransactionStage('failed')
    }
  }, [isErrorA, isErrorB, isErrorSwap, hashApproveA, hashApproveB, hashSwap])

  useEffect(() => {
    if (hashApproveA) setTransactionHashes(prev => ({ ...prev, approveA: hashApproveA }))
    if (hashApproveB) setTransactionHashes(prev => ({ ...prev, approveB: hashApproveB }))
    if (hashSwap) setTransactionHashes(prev => ({ ...prev, swap: hashSwap }))
  }, [hashApproveA, hashApproveB, hashSwap])

  useEffect(() => {
    if (status.isApproved.A && status.isApproved.B && transactionStage === 'approving') {
      setTransactionStage('swap')
      swap({
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
        abi: router,
        functionName: 'swapExactTokensForTokens',
        args: [
          values.tokenAddressA as `0x${string}`,
          values.tokenAddressB as `0x${string}`,
          BigInt(values.tokenAmountA),
          BigInt(values.tokenAmountB),
          deadline
        ]
      })
    }
  }, [status.isApproved, transactionStage, swap, values, deadline])

  useEffect(() => {
    if (isSwap && transactionStage === 'swap') {
      setTransactionStage('completed')
    }
  }, [isSwap, transactionStage])

  function startTransaction(formValues: z.infer<typeof formSchema>) {
    setValues(formValues)
    setTransactionStage('approving')
    setStatus({
      isApproved: { A: false, B: false },
      isPending: { A: false, B: false, swap: false },
      errors: { A: null, B: null, swap: null }
    })
    
    try {
      approveA({
        address: formValues.tokenAddressA as `0x${string}`,
        abi: erc20,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`, BigInt(formValues.tokenAmountA)]
      })
    } catch (error) {
      console.error("Error approving token A:", error);
    }
    
    try {
      approveB({
        address: formValues.tokenAddressB as `0x${string}`,
        abi: erc20,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`, BigInt(formValues.tokenAmountB)]
      })
    } catch (error) {
      console.error("Error approving token B:", error);
    }
  }

  function resetTransaction() {
    setTransactionStage('idle')
    setTransactionHashes({ approveA: '', approveB: '', swap: '' })
    setStatus({
      isApproved: { A: false, B: false },
      isPending: { A: false, B: false, swap: false },
      errors: { A: null, B: null, swap: null }
    })
  }

  return {
    startTransaction,
    resetTransaction,
    transactionStage,
    transactionHashes,
    status,
    pendingA,
    pendingB,
    pendingSwap,
    errorA,
    errorB,
    errorSwap
  }
}

export function useGetAmountOut({ pair, amountIn, tokenOut, fee }: {
  pair: string
  amountIn: bigint
  tokenOut: string
  fee: number
}) {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
    abi: router,
    functionName: 'getAmountOut',
    args: [pair, amountIn, tokenOut, fee]
  })
}
