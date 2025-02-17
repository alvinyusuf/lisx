import { Button } from "@/components/ui/button";
import CardToken from "@/components/pair/card-token";
import { useState } from "react";
import { usePairTransaction } from "@/hooks/pair/usePairTransaction";
import { TransactionStatus } from "./transaction";

export function PairForm() {
  const {
    startTransaction,
    transactionStage,
    transactionHashes,
    resetTransaction,
    pendingA,
    pendingB,
    pendingAddLiquidity,
    errorA,
    errorB,
    errorAddLiquidity
  } = usePairTransaction()

  const [formValues, setFormValues] = useState({
    tokenAddressA: "",
    tokenAmountA: 0,
    tokenAddressB: "",
    tokenAmountB: 0,
  })

  const handleChange = (key: keyof typeof formValues, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    startTransaction(formValues) // Memulai transaksi dengan nilai form
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      <CardToken
        title="Token 1"
        onChange={(token, amount) => {
          handleChange("tokenAddressA", token)
          handleChange("tokenAmountA", amount)
        }}
      />
      <CardToken
        title="Token 2"
        onChange={(token, amount) => {
          handleChange("tokenAddressB", token)
          handleChange("tokenAmountB", amount)
        }}
      />
      <Button
        className="w-full bg-secondary text-white"
        onClick={handleSubmit}
        disabled={transactionStage !== "idle"}
      >
        {transactionStage === "idle" ? "Create Pair" : "Processing..."}
      </Button>

      <TransactionStatus
        hashes={transactionHashes}
        stage={transactionStage}
        isPendingA={pendingA}
        isPendingB={pendingB}
        isPendingPair={pendingAddLiquidity}
        errorA={errorA}
        errorB={errorB}
        errorPair={errorAddLiquidity}
        onReset={resetTransaction}
      />
    </div>
  );
}
