'use client'

import React, { useEffect, useState } from 'react'
import { Card } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { SelectToken } from '../../components/token/list-token'

interface CardTokenProps {
  title: string
  onChange: (token: string, amount: number) => void
  token?: string
  amount?: number
  disabled?: boolean
  excludeToken?: string
}

export default function CardToken({ title, onChange, token = "", amount = 0, disabled = false, excludeToken }: CardTokenProps) {
  const [selectedToken, setSelectedToken] = useState("")
  const [inputAmount, setInputAmount] = useState(0)

  useEffect(() => {
    setSelectedToken(token)
    setInputAmount(amount)
  }, [token, amount])

  return (
    <Card className="p-4 border-2 border-primary space-y-4">
      <div className="font-bold text-lg">{title}</div>
      <div className="flex">
        <Input
          type="number"
          value={inputAmount}
          onChange={(e) => {
            if (!disabled) {
              const val = Number(e.target.value)
              setInputAmount(val)
              onChange(selectedToken, val)
            }
          }}
          className="w-3/4 font-bold border-0 focus-visible:ring-0"
          disabled={disabled}
        />
        <SelectToken onSelect={(token) => {
          setSelectedToken(token)
          onChange(token, inputAmount)
        }} excludeToken={excludeToken} />
      </div>
    </Card>
  )
}
