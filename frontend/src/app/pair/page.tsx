'use client'

import React from 'react'
import { PairForm } from './form'
import ListPair from './list-pair'

export default function Pair() {
  return (
    <div className='flex'>
      <div className='w-full flex flex-col gap-4 items-center py-10'>
        <h1 className='text-3xl font-bold'>List Pairs</h1>
        <ListPair />
      </div>
      <div className='w-full flex flex-col gap-4 items-center py-10'>
        <h1 className='text-3xl font-bold'>Add Pair</h1>
        <PairForm />
      </div>
    </div>
  )
}