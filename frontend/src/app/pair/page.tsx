'use client'

import React from 'react'
import { PairForm } from './form'

export default function Pair() {
  return (
    <div className='flex'>
      <div className='w-full'>
        list pair
      </div>
      <div className='w-full flex flex-col gap-4 items-center py-10'>
        <h1 className='text-3xl font-bold'>add pair</h1>
        <PairForm />
      </div>
    </div>
  )
}