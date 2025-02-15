'use client'

import React, { useEffect, useState } from 'react'
import PairForm from './form'
import { z } from 'zod'
import { formSchema } from './form'
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import erc20 from '@/abi/erc20.json'
import router from '@/abi/router.json'

export default function Pair() {
  const [transactionStage, setTransactionStage] = useState<'idle' | 'approveA' | 'approveB' | 'addLiquidity' | 'completed'>('idle')
  const [values, setValues] = useState<z.infer<typeof formSchema>>({
    tokenAddressA: '',
    tokenAmountA: 0,
    tokenAddressB: '',
    tokenAmountB: 0,
  })
  const [transactionHashes, setTransactionHashes] = useState({
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
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}` as `0x${string}`, BigInt(values.tokenAmountB)]
      })
      setTransactionStage('approveB')
    }
  }, [isApproveA, isApproveB, isAddLiquidity, transactionStage, approveB, values.tokenAddressB, values.tokenAmountB])

  useEffect(() => {
    if (transactionStage === 'approveB' && isApproveB) {
      addLiquidity({
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
        abi: router,
        functionName: 'addLiquidity',
        args: [
          values.tokenAddressA as `0x${string}`,
          values.tokenAddressB as `0x${string}`,
          BigInt(values.tokenAmountA),
          BigInt(values.tokenAmountB)]
      })
      setTransactionStage('addLiquidity')
    }
  }, [isApproveA, isApproveB, isAddLiquidity, transactionStage, addLiquidity, values.tokenAddressA, values.tokenAmountA, values.tokenAddressB, values.tokenAmountB])

  function onSubmit(values: z.infer<typeof formSchema>) {
    setValues(values)
    try {
      approveA({
        address: values.tokenAddressA as `0x${string}`,
        abi: erc20,
        functionName: 'approve',
        args: [process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`, BigInt(values.tokenAmountA)]
      })
      setTransactionStage('approveA')
    } catch (error) {
      console.error(error);
      
    }
  }

  useEffect(() => {
    if (hashApproveA) {
      setTransactionHashes(prev => ({
        ...prev,
        approveA: hashApproveA
      }))
    }
  }, [hashApproveA])

  useEffect(() => {
    if (hashApproveB) {
      setTransactionHashes(prev => ({
        ...prev,
        approveB: hashApproveB
      }))
    }
  }, [hashApproveB])

  useEffect(() => {
    if (hashAddLiquidity) {
      setTransactionHashes(prev => ({
        ...prev,
        addLiquidity: hashAddLiquidity
      }))
    }
  }, [hashAddLiquidity])

  return (
    <div className='flex'>
      <div className='w-full'>
        list pair
      </div>
      <div className='w-full'>
        <h1>add pair</h1>
        <PairForm
          onSubmit={onSubmit}
          isPendingA={pendingA}
          isPendingB={pendingB}
          isPendingPair={pendingAddLiquidity}
          errorA={errorA}
          errorB={errorB}
          errorPair={errorAddLiquidity}
          transactionHashes={transactionHashes}
          transactionStage={transactionStage}
        />
      </div>
    </div>
  )
}
