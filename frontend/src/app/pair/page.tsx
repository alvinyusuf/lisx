'use client'

import React from 'react'
import PairForm from './form'
import { usePairTransaction } from '@/hooks/pair/usePairTransaction'
import { PairForm2 } from './form2'
import MyComponent from './cek'

export default function Pair() {
  const {
    startTransaction,
    transactionStage,
    transactionHashes,
    pendingA,
    pendingB,
    pendingAddLiquidity,
    errorA,
    errorB,
    errorAddLiquidity
  } = usePairTransaction()

  return (
    <div className='flex'>
      <div className='w-full'>
        {/* <PairForm2 /> */}
        <MyComponent />
      </div>
      <div className='w-full'>
        <h1>add pair</h1>
        <PairForm
          onSubmit={startTransaction}
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