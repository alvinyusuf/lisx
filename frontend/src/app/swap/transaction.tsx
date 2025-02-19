import React from 'react';
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

export type TransactionStage = 'idle' | 'approving' | 'swap' | 'completed' | 'failed';

// Use the existing TransactionHashes type from your useSwap hook
import { TransactionHashes } from '@/hooks/pair/useSwap';

interface TransactionDetailProps {
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

export function TransactionDetail({
  hashes,
  stage,
  isPendingA,
  isPendingB,
  isPendingPair,
  errorA,
  errorB,
  errorPair,
  onReset
}: TransactionDetailProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (stage !== 'idle') {
      setOpen(true);
    }
  }, [stage]);

  const getExplorerUrl = (hash: string) => `https://sepolia-blockscout.lisk.com/tx/${hash}`;

  const handleClose = () => {
    setOpen(false);
    if (stage === 'completed' || stage === 'failed') {
      onReset?.();
    }
  };

  if (stage === 'idle') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {stage === 'approving' ? 'Approving Tokens' :
             stage === 'swap' ? 'Processing Swap' :
             stage === 'completed' ? 'Transaction Successful' : 'Transaction Failed'}
          </DialogTitle>
          <DialogDescription>
            {stage === 'approving' ? 'Approving tokens for swap...' :
             stage === 'swap' ? 'Swapping tokens in progress...' :
             stage === 'completed' ? 'Your swap was successful!' :
             'An error occurred during the transaction.'}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Token Approval</h4>
            <div className="flex items-center gap-3">
              {isPendingA || isPendingB ? (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              ) : errorA || errorB ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : stage === 'swap' || stage === 'completed' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-300" />
              )}
              <div className="flex-1">
                <p className="text-sm">Token Approval</p>
                {/* If your TransactionHashes has an approval property, use it here */}
                {hashes.swap && stage !== 'approving' && (
                  <a href={getExplorerUrl(hashes.swap)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isPendingA || isPendingB ? 'Pending' : 
                 errorA || errorB ? 'Failed' : 
                 stage === 'swap' || stage === 'completed' ? 'Complete' : 'Waiting'}
              </span>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <h4 className="text-sm font-medium">Swap Transaction</h4>
            <div className="flex items-center gap-3">
              {isPendingPair ? (
                <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
              ) : errorPair ? (
                <XCircle className="h-5 w-5 text-red-500" />
              ) : hashes.swap ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-300" />
              )}
              <div className="flex-1">
                <p className="text-sm">Token Swap</p>
                {hashes.swap && (
                  <a href={getExplorerUrl(hashes.swap)} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 flex items-center gap-1 mt-1">
                    View on Explorer <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
              <span className="text-xs text-gray-500">
                {isPendingPair ? 'Pending' : 
                 errorPair ? 'Failed' : 
                 hashes.swap ? 'Complete' : 'Waiting'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          {stage === 'completed' || stage === 'failed' ? (
            <Button onClick={handleClose} variant={stage === 'completed' ? "default" : "outline"}>
              {stage === 'completed' ? 'Done' : 'Close'}
            </Button>
          ) : (
            <Button variant="outline" onClick={handleClose} disabled={stage === 'approving' || stage === 'swap'}>
              Cancel
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}