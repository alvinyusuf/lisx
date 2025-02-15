'use client'

import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi'
import router from '@/abi/router.json'
import erc20 from '@/abi/erc20.json'
import { useEffect } from 'react'

export default function useAddPair(tokenAddressA: string, tokenAmountA: number, tokenAddressB: string, tokenAmountB: number) {
  const { data: hashA } = useApproveToken(tokenAddressA, tokenAmountA)
  const { data: hashB } = useApproveToken(tokenAddressB, tokenAmountB)

  const { isSuccess: isApproveA } = useWaitForTransactionReceipt({ hash: hashA })
  const { isSuccess: isApproveB } = useWaitForTransactionReceipt({ hash: hashB })

  const { writeContract, data } = useWriteContract()

  useEffect(() => {
    if (isApproveA && isApproveB) {
      writeContract({
        address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
        abi: router,
        functionName: 'addLiquidity',
        args: [tokenAddressA as `0x${string}`, BigInt(tokenAmountA), tokenAddressB as `0x${string}`, BigInt(tokenAmountB)]
      })
    }
  }, [isApproveA, isApproveB, tokenAddressA, tokenAddressB, tokenAmountA, tokenAmountB, writeContract])

  return {
    data,
  }
}


export function useApproveToken(tokenAddress: string, amount: number) {
  const { writeContract, data } = useWriteContract()

  writeContract({
    address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
    abi: erc20,
    functionName: 'approve',
    args: [tokenAddress as `0x${string}`, BigInt(amount)]
  })

  return {
    data,
  }
}