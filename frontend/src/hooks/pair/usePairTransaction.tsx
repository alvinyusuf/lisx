// hooks/usePairTransaction.ts
import { useEffect, useState } from 'react'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import erc20 from '@/abi/erc20.json'
import router from '@/abi/router.json'
import { z } from 'zod'
import { formSchema } from '@/app/pair/form'

export type TransactionStage = 'idle' | 'approving' | 'addingLiquidity' | 'completed' | 'failed'

export interface TransactionHashes {
  approveA: string
  approveB: string
  addLiquidity: string
}

export interface TransactionStatus {
  isApproved: {
    A: boolean
    B: boolean
  }
  isPending: {
    A: boolean
    B: boolean
    liquidity: boolean
  }
  errors: {
    A: Error | null
    B: Error | null
    liquidity: Error | null
  }
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
  
  const [status, setStatus] = useState<TransactionStatus>({
    isApproved: { A: false, B: false },
    isPending: { A: false, B: false, liquidity: false },
    errors: { A: null, B: null, liquidity: null }
  })

  const { writeContract: approveA, data: hashApproveA, isPending: pendingA, error: errorA } = useWriteContract()
  const { writeContract: approveB, data: hashApproveB, isPending: pendingB, error: errorB } = useWriteContract()
  const { writeContract: addLiquidity, data: hashAddLiquidity, isPending: pendingAddLiquidity, error: errorAddLiquidity } = useWriteContract()
  
  const { isSuccess: isApproveA, isError: isErrorA } = useWaitForTransactionReceipt({ hash: hashApproveA })
  const { isSuccess: isApproveB, isError: isErrorB } = useWaitForTransactionReceipt({ hash: hashApproveB })
  const { isSuccess: isAddLiquidity, isError: isErrorLiquidity } = useWaitForTransactionReceipt({ hash: hashAddLiquidity })

  // Update status
  useEffect(() => {
    setStatus(prev => ({
      ...prev,
      isPending: {
        A: pendingA,
        B: pendingB,
        liquidity: pendingAddLiquidity
      },
      errors: {
        A: errorA,
        B: errorB,
        liquidity: errorAddLiquidity
      }
    }))
  }, [pendingA, pendingB, pendingAddLiquidity, errorA, errorB, errorAddLiquidity])

  // Handle approval statuses
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

  // Handle errors
  useEffect(() => {
    if ((isErrorA && hashApproveA) || (isErrorB && hashApproveB) || (isErrorLiquidity && hashAddLiquidity)) {
      setTransactionStage('failed')
    }
  }, [isErrorA, isErrorB, isErrorLiquidity, hashApproveA, hashApproveB, hashAddLiquidity])

  // Track transaction hashes
  useEffect(() => {
    if (hashApproveA) setTransactionHashes(prev => ({ ...prev, approveA: hashApproveA }))
    if (hashApproveB) setTransactionHashes(prev => ({ ...prev, approveB: hashApproveB }))
    if (hashAddLiquidity) setTransactionHashes(prev => ({ ...prev, addLiquidity: hashAddLiquidity }))
  }, [hashApproveA, hashApproveB, hashAddLiquidity])

  // Check if both approvals are complete and proceed to add liquidity
  useEffect(() => {
    if (status.isApproved.A && status.isApproved.B && transactionStage === 'approving') {
      setTransactionStage('addingLiquidity')
      addLiquidity({
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
        abi: router,
        functionName: 'addLiquidity',
        args: [
          values.tokenAddressA as `0x${string}`,
          values.tokenAddressB as `0x${string}`,
          BigInt(values.tokenAmountA),
          BigInt(values.tokenAmountB)
        ]
      })
    }
  }, [status.isApproved, transactionStage, addLiquidity, values])

  // Handle add liquidity completion
  useEffect(() => {
    if (isAddLiquidity && transactionStage === 'addingLiquidity') {
      setTransactionStage('completed')
    }
  }, [isAddLiquidity, transactionStage])

  function startTransaction(formValues: z.infer<typeof formSchema>) {
    setValues(formValues)
    setTransactionStage('approving')
    setStatus({
      isApproved: { A: false, B: false },
      isPending: { A: false, B: false, liquidity: false },
      errors: { A: null, B: null, liquidity: null }
    })
    
    // Request both approvals simultaneously
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
    setTransactionHashes({ approveA: '', approveB: '', addLiquidity: '' })
    setStatus({
      isApproved: { A: false, B: false },
      isPending: { A: false, B: false, liquidity: false },
      errors: { A: null, B: null, liquidity: null }
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
    pendingAddLiquidity,
    errorA,
    errorB,
    errorAddLiquidity
  }
}