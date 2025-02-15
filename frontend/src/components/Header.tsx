import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import React from 'react'

export default function Header() {
  return (
    <div className='w-full flex justify-between items-center py-4'>
      <div className='flex items-center gap-x-8'>
        <div className='bg-gray-200 h-14 w-14 rounded-full'></div>
        <ul className='flex gap-x-6 items-center font-bold text-primary'>
          <li>Swap</li>
          <li>
            <Link href='/pair'>Pair</Link>
          </li>
          <li>
            <Link href='/token'>Token</Link>
          </li>
        </ul>
      </div>
      <ConnectButton />
    </div>
  )
}
