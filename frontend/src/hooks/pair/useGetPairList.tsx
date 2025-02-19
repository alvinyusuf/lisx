import { useReadContract } from 'wagmi'
import router from '@/abi/router.json'
import pair from '@/abi/pair.json'

export default function useGetPairList() {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
    abi: router,
    functionName: 'getAllPairsWithInfo',
  })
}

export function useGetPairInfo(pairAddress: string) {
  return useReadContract({
    address: pairAddress as `0x${string}`,
    abi: pair,
    functionName: 'getPoolInfo',
  })
}

export function useGetPairWithInfo({ addressA, addressB }: { addressA: string, addressB: string }) {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
    abi: router,
    functionName: 'getPairInfo',
    args: [addressA, addressB]
  })
}

export function useGetAmountOut({ pairAddress, amountIn, tokenOut, fee }: { pairAddress: string, amountIn: number, tokenOut: string, fee: number }) {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_ROUTER_ADDRESS as `0x${string}`,
    abi: router,
    functionName: 'getAmountOut',
    args: [
      pairAddress,
      amountIn,
      tokenOut,
      fee
    ]
  })
}