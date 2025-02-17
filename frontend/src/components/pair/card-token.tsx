import React, { useState } from 'react'
import { Card } from '../ui/card'
import { Input } from '../ui/input'
import { SelectToken } from '../token/list-token'

interface CardTokenProps {
  title: string
  onChange: (token: string, amount: number) => void
}

export default function CardToken({ title, onChange }: CardTokenProps) {
  const [selectedToken, setSelectedToken] = useState("")
  const [amount, setAmount] = useState(0)

  return (
    <Card className="p-4 border-2 border-primary space-y-4">
      <div className="font-bold text-lg">{title}</div>
      <div className="flex">
        <Input
          type="number"
          value={amount}
          onChange={(e) => {
            const val = Number(e.target.value)
            setAmount(val)
            onChange(selectedToken, val)
          }}
          className="w-3/4 font-bold border-0 focus-visible:ring-0"
        />
        <SelectToken onSelect={(token) => {
          setSelectedToken(token)
          onChange(token, amount)
        }} />
      </div>
    </Card>
  )
}
