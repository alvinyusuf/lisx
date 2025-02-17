import { useReadContract } from 'wagmi'
import tokenList from '@/abi/token-list.json'
import erc20 from '@/abi/erc20.json'

export default function useGetTokenList() {
  return useReadContract({
    address: process.env.NEXT_PUBLIC_TOKEN_LIST_ADDRESS as `0x${string}`,
    abi: tokenList,
    functionName: 'getTokens',
  })
}

export function useGetTokenDetail(tokenAddress: string) {
  const { data: name, isLoading: isLoadingName } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20,
    functionName: 'name',
  });

  const { data: symbol, isLoading: isLoadingSymbol } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20,
    functionName: 'symbol',
  });

  const { data: decimals, isLoading: isLoadingDecimals } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20,
    functionName: 'decimals',
  });

  const { data: totalSupplyRaw, isLoading: isLoadingTotalSupply } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: erc20,
    functionName: 'totalSupply',
  });

  const totalSupply = totalSupplyRaw && decimals 
  ? Number(totalSupplyRaw) / Math.pow(10, Number(decimals)) 
  : undefined;

  return {
    name,
    symbol,
    totalSupply,
    isLoading: isLoadingName || isLoadingSymbol  || isLoadingTotalSupply || isLoadingDecimals,  
  };
}

export function useGetTokenListDetail() {
  const { data: tokens, isLoading } = useGetTokenList() as { 
    data: Array<{ tokenAddress: string; name: string; symbol: string }>;
    isLoading: boolean;
  };

  return {
    tokens: tokens.map(token => ({
      ...token,
      ...useGetTokenDetail(token.tokenAddress),
    })),
    isLoading,
  };
}