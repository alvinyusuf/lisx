export interface TransactionHashes {
  approveA: string
  approveB: string
  addLiquidity: string
}

export type TransactionStage = 'idle' | 'approveA' | 'approveB' | 'approving' | 'addingLiquidity' | 'completed' | 'failed'

interface TransactionStatusProps {
  hashes: TransactionHashes
  stage: TransactionStage
  isPendingA: boolean
  isPendingB: boolean
  isPendingPair: boolean
  errorA: Error | null
  errorB: Error | null
  errorPair: Error | null
}

export function TransactionStatus({
  hashes,
  stage,
  isPendingA,
  isPendingB,
  isPendingPair,
  errorA,
  errorB,
  errorPair
}: TransactionStatusProps) {
  return (
    <div className="space-y-2">
      {stage !== 'idle' && (
        <div className="text-sm font-medium">
          Status: {
            stage === 'approving' ? 'Approving tokens...' :
            stage === 'addingLiquidity' ? 'Adding liquidity...' :
            stage === 'completed' ? 'Transaction completed!' :
            stage === 'failed' ? 'Transaction failed' : ''
          }
        </div>
      )}
      
      {stage === 'approving' && (
        <div className="flex flex-col gap-1 text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPendingA ? 'bg-yellow-500 animate-pulse' : errorA ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span>Token A approval {isPendingA ? 'in progress' : errorA ? 'failed' : 'completed'}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPendingB ? 'bg-yellow-500 animate-pulse' : errorB ? 'bg-red-500' : 'bg-green-500'}`}></div>
            <span>Token B approval {isPendingB ? 'in progress' : errorB ? 'failed' : 'completed'}</span>
          </div>
        </div>
      )}
      
      {stage === 'addingLiquidity' && (
        <div className="flex items-center gap-2 text-sm">
          <div className={`w-2 h-2 rounded-full ${isPendingPair ? 'bg-yellow-500 animate-pulse' : errorPair ? 'bg-red-500' : 'bg-green-500'}`}></div>
          <span>Adding liquidity {isPendingPair ? 'in progress' : errorPair ? 'failed' : 'completed'}</span>
        </div>
      )}

      {(hashes.approveA || hashes.approveB || hashes.addLiquidity) && (
        <details className="text-xs">
          <summary className="cursor-pointer">Transaction Details</summary>
          <div className="pl-2 pt-1 space-y-1">
            {hashes.approveA && <div>Approve A: {hashes.approveA}</div>}
            {hashes.approveB && <div>Approve B: {hashes.approveB}</div>}
            {hashes.addLiquidity && <div>Add Liquidity: {hashes.addLiquidity}</div>}
          </div>
        </details>
      )}

      {(errorA || errorB || errorPair) && (
        <div className="text-red-500 text-sm space-y-1">
          {errorA && <p>Error approving Token A: {errorA.message}</p>}
          {errorB && <p>Error approving Token B: {errorB.message}</p>}
          {errorPair && <p>Error adding liquidity: {errorPair.message}</p>}
        </div>
      )}

      {stage === 'completed' && (
        <div className="text-green-500 mt-2 text-sm">
          <p className="font-medium">Pool creation successful!</p>
          <p>You have successfully created a liquidity pool with the selected tokens.</p>
        </div>
      )}
    </div>
  )
}