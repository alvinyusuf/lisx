'use client'

import { getDefaultConfig } from "@rainbow-me/rainbowkit"
import { arbitrum, base, mainnet, optimism, polygon, sepolia, liskSepolia, anvil, lisk } from "viem/chains"

export const rainbowConfig = getDefaultConfig({
  appName: 'Swap App',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    lisk,
    ...(process.env.NEXT_PUBLIC_ENABLE_TESTNETS === 'true' ? [sepolia, liskSepolia, anvil] : []),
  ],
  ssr: true,
})
