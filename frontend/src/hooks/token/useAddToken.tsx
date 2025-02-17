'use client'

import { useWriteContract } from 'wagmi'
import abi from '@/abi/token-list.json'

export default function useAddToken() {
  const { writeContract, data: hash, isPending, error, isSuccess } = useWriteContract();

  const addToken = async (tokenName: string, tokenAddress: string) => {
    try {
      writeContract({
        address: process.env.NEXT_PUBLIC_TOKEN_LIST_ADDRESS as `0x${string}`,
        abi,
        functionName: 'addToken',
        args: [tokenName, tokenAddress]
      })
    } catch (error) {
      console.log(error)
    }
  }

  return { addToken, hash, isPending, error, isSuccess }
}
