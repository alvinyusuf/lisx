// 'use client'

// import React, { useEffect, useState } from 'react'
// import { useSwap } from '@/hooks/pair/useSwap'
// import CardToken from '../pair/card-token'
// import { Button } from '@/components/ui/button'
// import { useGetAmountOut, useGetPairWithInfo } from '@/hooks/pair/useGetPairList'

// export default function SwapForm() {
//   const {
//     startTransaction,
//     transactionStage,
//     transactionHashes,
//     resetTransaction,
//     pendingA,
//     pendingB,
//     pendingSwap,
//     errorA,
//     errorB,
//     errorSwap
//   } = useSwap()

//   const [formValues, setFormValues] = useState({
//     tokenAddressA: "",
//     tokenAmountA: 0,
//     tokenAddressB: "",
//     tokenAmountB: 0,
//   })

//   const { data: pairInfo, isLoading, isError: isErrorPairInfo } = useGetPairWithInfo({
//     addressA: formValues.tokenAddressA,
//     addressB: formValues.tokenAddressB,
//   }) as { data: Array<string>[], isLoading: boolean, isError: boolean }

//   const { data: getAmountOut } = useGetAmountOut({
//     pairAddress: pairInfo && typeof pairInfo[0] === 'string' ? pairInfo[0] : "",
//     amountIn: formValues.tokenAmountA,
//     tokenOut: formValues.tokenAddressB,
//     fee: 3
//   })

//   useEffect(() => {
//     if (getAmountOut) {
//       setFormValues(prev => ({
//         ...prev,
//         tokenAmountB: Number(getAmountOut)
//       }))
//     }
//   }, [getAmountOut])

//   const handleChange = (key: keyof typeof formValues, value: string | number) => {
//     setFormValues(prev => ({
//       ...prev,
//       [key]: value
//     }))
//   }

//   const handleSubmit = () => {
//     if (!formValues.tokenAddressA || !formValues.tokenAddressB) {
//       alert("Please select both tokens.");
//       return;
//     }
//     if (formValues.tokenAmountA <= 0) {
//       alert("Please enter a valid token amount.");
//       return;
//     }

//     const adjustedValues = {
//       tokenAddressA: formValues.tokenAddressA,
//       tokenAmountA: BigInt(formValues.tokenAmountA * 10 ** 18),  // Convert to BigInt
//       tokenAddressB: formValues.tokenAddressB,
//       tokenAmountB: BigInt(formValues.tokenAmountB * 10 ** 18),  // Convert to BigInt
//     }

//     startTransaction(adjustedValues)
//   }

//   return (
//     <div className="w-full max-w-sm mx-auto space-y-4">
//       <CardToken
//         title="Sell"
//         onChange={(token, amount) => {
//           handleChange("tokenAddressA", token)
//           handleChange("tokenAmountA", amount)
//         }}
//         excludeToken={formValues.tokenAddressB}
//       />
//       <CardToken
//         title="Buy"
//         token={formValues.tokenAddressB}
//         amount={formValues.tokenAmountB}
//         onChange={(token) => handleChange("tokenAddressB", token)}
//         disabled={true}
//         excludeToken={formValues.tokenAddressA}
//       />

//       {isLoading && <p className="text-sm text-gray-500">Loading pair info...</p>}
//       {isErrorPairInfo && <p className="text-sm text-red-500">Error fetching pair info</p>}
//       {pairInfo && (
//         <div className="bg-gray-100 p-2 rounded">
//           <p className="text-sm text-gray-700">Pair Details:</p>
//           <p className="text-sm font-semibold">{pairInfo[0]}</p>
//         </div>
//       )}

//       {/* Display transaction status */}
//       {transactionStage !== 'idle' && (
//         <div className="text-sm p-2 rounded bg-gray-100">
//           {transactionStage === 'approving' && <p>Approving tokens...</p>}
//           {transactionStage === 'swap' && <p>Swapping tokens...</p>}
//           {transactionStage === 'completed' && <p>Swap successful! 🎉</p>}
//           {transactionStage === 'failed' && <p className="text-red-500">Transaction failed. ❌</p>}
//         </div>
//       )}

//       <Button
//         className="w-full bg-secondary text-white"
//         onClick={handleSubmit}
//         disabled={transactionStage !== "idle"}
//       >
//         {transactionStage === "idle" ? "Swap Tokens" : "Processing..."}
//       </Button>
//     </div>
//   )
// }


'use client'

import React, { useEffect, useState } from 'react'
import { useSwap } from '@/hooks/pair/useSwap'
import CardToken from '../pair/card-token'
import { Button } from '@/components/ui/button'
import { useGetAmountOut, useGetPairWithInfo } from '@/hooks/pair/useGetPairList'
import { TransactionDetail } from './transaction'

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

  const { data: pairInfo, isLoading, isError: isErrorPairInfo } = useGetPairWithInfo({
    addressA: formValues.tokenAddressA,
    addressB: formValues.tokenAddressB,
  }) as { data: Array<string>[], isLoading: boolean, isError: boolean }

  const { data: getAmountOut } = useGetAmountOut({
    pairAddress: pairInfo && typeof pairInfo[0] === 'string' ? pairInfo[0] : "",
    amountIn: formValues.tokenAmountA,
    tokenOut: formValues.tokenAddressB,
    fee: 3
  })

  useEffect(() => {
    if (getAmountOut) {
      setFormValues(prev => ({
        ...prev,
        tokenAmountB: Number(getAmountOut)
      }))
    }
  }, [getAmountOut])

  const handleChange = (key: keyof typeof formValues, value: string | number) => {
    setFormValues(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = () => {
    if (!formValues.tokenAddressA || !formValues.tokenAddressB) {
      alert("Please select both tokens.");
      return;
    }
    if (formValues.tokenAmountA <= 0) {
      alert("Please enter a valid token amount.");
      return;
    }

    const adjustedValues = {
      tokenAddressA: formValues.tokenAddressA,
      tokenAmountA: Number(BigInt(formValues.tokenAmountA * 10 ** 18)),
      tokenAddressB: formValues.tokenAddressB,
      tokenAmountB: Number(BigInt(formValues.tokenAmountB * 10 ** 18)),
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
        excludeToken={formValues.tokenAddressB}
      />
      <CardToken
        title="Buy"
        token={formValues.tokenAddressB}
        amount={formValues.tokenAmountB}
        onChange={(token) => handleChange("tokenAddressB", token)}
        disabled={true}
        excludeToken={formValues.tokenAddressA}
      />

      {isLoading && <p className="text-sm text-gray-500">Loading pair info...</p>}
      {isErrorPairInfo && <p className="text-sm text-red-500">Error fetching pair info</p>}
      {pairInfo && (
        <div className="bg-gray-100 p-2 rounded">
          <p className="text-sm text-gray-700">Pair Details:</p>
          <p className="text-sm font-semibold">{pairInfo[0]}</p>
        </div>
      )}

      <TransactionDetail
        hashes={transactionHashes}
        stage={transactionStage}
        isPendingA={pendingA}
        isPendingB={pendingB}
        isPendingPair={pendingSwap}
        errorA={errorA}
        errorB={errorB}
        errorPair={errorSwap}
        onReset={resetTransaction}
      />

      <Button
        className="w-full bg-secondary text-white"
        onClick={handleSubmit}
        disabled={transactionStage !== "idle"}
      >
        {transactionStage === "idle" ? "Swap Tokens" : "Processing..."}
      </Button>
    </div>
  )
}
