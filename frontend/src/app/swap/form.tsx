'use client'

import { useSwap } from '@/hooks/pair/useSwap'
import React, { useEffect, useState } from 'react'
import CardToken from '../pair/card-token'
import { Button } from '@/components/ui/button'

export default function SwapForm() {
  const {
    startTransaction,
    transactionStage,
    transactionHashes,
    resetTransaction,
    pendingA,
    pendingB,
    pendingSwap,
    errorA,
    errorB,
    errorSwap
  } = useSwap()

  const [formValues, setFormValues] = useState({
    tokenAddressA: "",
    tokenAmountA: 0,
    tokenAddressB: "",
    tokenAmountB: 0,
  })

  const [rate, setRate] = useState(1)

  useEffect(() => {
    if (formValues.tokenAddressA && formValues.tokenAddressB) {
      fetchSwapRate(formValues.tokenAddressA, formValues.tokenAddressB)
    }
  }, [formValues.tokenAddressA, formValues.tokenAddressB])

  const fetchSwapRate = async (tokenA: string, tokenB: string) => {
    // Contoh hardcoded rate, kamu bisa ganti dengan fetch ke smart contract atau API
    if (tokenA === "ETH" && tokenB === "USDT") {
      setRate(3000) // 1 ETH = 3000 USDT
    } else {
      setRate(1)
    }
  }

  const handleChange = (key: keyof typeof formValues, value: string | number) => {
    setFormValues(prev => {
      const updatedValues = { ...prev, [key]: value };

      // Jika user mengubah jumlah Token A, otomatis hitung Token B
      if (key === "tokenAmountA") {
        updatedValues.tokenAmountB = Number(value) * rate;
      }

      return updatedValues;
    })
  }

  const handleSubmit = () => {
    const adjustedValues = {
      ...formValues,
      tokenAmountA: formValues.tokenAmountA * 10 ** 18,
      tokenAmountB: formValues.tokenAmountB * 10 ** 18,
    }
    startTransaction(adjustedValues)
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <CardToken
        title="Sell"
        onChange={(token, amount) => {
          handleChange("tokenAddressA", token)
          handleChange("tokenAmountA", amount)
        }}
      />
      <CardToken
        title="Buy"
        token={formValues.tokenAddressB}
        amount={formValues.tokenAmountB}
        onChange={(token) => handleChange("tokenAddressB", token)}
        disabled={true}
      />
      <Button
        className="w-full bg-secondary text-white"
        onClick={handleSubmit}
        disabled={transactionStage !== "idle"}
      >
        {transactionStage === "idle" ? "Create Pair" : "Processing..."}
      </Button>
    </div>
  )
}
