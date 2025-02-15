import { useReadContract } from 'wagmi'
import abi from '@/abi/token-list.json'

export default function useGetTokenList() {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_TOKEN_LIST_ADDRESS as `0x${string}`,
    abi,
    functionName: 'getTokens',
  })
}
