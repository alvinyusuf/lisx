import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Loader2,
  XCircle
} from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface TransactionHashes {
  approveA: string;
  approveB: string;
  addLiquidity: string;
}

export type TransactionStage = 'idle' | 'approveA' | 'approveB' | 'approving' | 'addingLiquidity' | 'completed' | 'failed';

interface TransactionStatusProps {
  hashes: TransactionHashes;
  stage: TransactionStage;
  isPendingA: boolean;
  isPendingB: boolean;
  isPendingPair: boolean;
  errorA: Error | null;
  errorB: Error | null;
  errorPair: Error | null;
  onReset?: () => void;
}

export function TransactionStatus({
  hashes,
  stage,
  isPendingA,
  isPendingB,
  isPendingPair,
  errorA,
  errorB,
  errorPair,
  onReset
}: TransactionStatusProps) {
  const [open, setOpen] = useState(false);
  
  // Automatically open dialog when transaction starts
  useEffect(() => {
    if (stage !== 'idle') {
      setOpen(true);
    }
  }, [stage]);

  // Helper function to get explorer URL
  const getExplorerUrl = (hash: string) => {
    return `https://sepolia-blockscout.lisk.com/tx/${hash}`;
  };

  // Close dialog and reset transaction if needed
  const handleClose = () => {
    setOpen(false);
    if (stage === 'completed' || stage === 'failed') {
      onReset?.();
    }
  };

  // Don't render dialog for idle state
  if (stage === 'idle') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stage === 'approving' ? 'Approving Tokens' :
             stage === 'addingLiquidity' ? 'Adding Liquidity' :
             stage === 'completed' ? 'Transaction Complete' : 'Transaction Failed'}
          </DialogTitle>
          <DialogDescription>
            {stage === 'approving' ? 'Please approve both tokens to continue.' :
             stage === 'addingLiquidity' ? 'Creating the liquidity pool...' :
             stage === 'completed' ? 'Your liquidity pool has been created successfully!' :
             'There was an error creating your liquidity pool.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          {/* Approval Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Token Approvals</h4>
            
            <div className="flex items-center gap-3">
              {isPendingA ? (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              ) : errorA ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : hashes.approveA ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-300" />
              )}
              <div className="flex-1">
                <p className="text-sm">Token A Approval</p>
                {hashes.approveA && (
                  <a 
                    href={getExplorerUrl(hashes.approveA)} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-500 flex items-center gap-1 mt-1"
                  >
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isPendingA ? 'Pending' : errorA ? 'Failed' : hashes.approveA ? 'Complete' : 'Waiting'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {isPendingB ? (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              ) : errorB ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : hashes.approveB ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-300" />
              )}
              <div className="flex-1">
                <p className="text-sm">Token B Approval</p>
                {hashes.approveB && (
                  <a 
                    href={getExplorerUrl(hashes.approveB)} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-500 flex items-center gap-1 mt-1"
                  >
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isPendingB ? 'Pending' : errorB ? 'Failed' : hashes.approveB ? 'Complete' : 'Waiting'}
              </span>
            </div>
          </div>

          <Separator />

          {/* Liquidity Pool Status */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Liquidity Pool Creation</h4>
            
            <div className="flex items-center gap-3">
              {isPendingPair ? (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              ) : errorPair ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : hashes.addLiquidity ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-300" />
              )}
              <div className="flex-1">
                <p className="text-sm">Creating Pool</p>
                {hashes.addLiquidity && (
                  <a 
                    href={getExplorerUrl(hashes.addLiquidity)} 
                    target="_blank"
                    rel="noopener noreferrer" 
                    className="text-xs text-blue-500 flex items-center gap-1 mt-1"
                  >
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isPendingPair ? 'Pending' : errorPair ? 'Failed' : hashes.addLiquidity ? 'Complete' : 'Waiting'}
              </span>
            </div>
          </div>

          {/* Error Messages */}
          {(errorA || errorB || errorPair) && (
            <>
              <Separator />
              <div className="text-red-500 text-sm space-y-2">
                <h4 className="font-medium">Errors</h4>
                {errorA && <p className="text-xs">• Token A: {errorA.message}</p>}
                {errorB && <p className="text-xs">• Token B: {errorB.message}</p>}
                {errorPair && <p className="text-xs">• Pool creation: {errorPair.message}</p>}
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {stage === 'completed' || stage === 'failed' ? (
            <Button 
              onClick={handleClose}
              variant={stage === 'completed' ? "default" : "outline"}
            >
              {stage === 'completed' ? 'Done' : 'Close'}
            </Button>
          ) : (
            <Button 
              variant="outline" 
              onClick={handleClose}
              disabled={stage === 'approving' || stage === 'addingLiquidity'}
            >
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}