"use client";

import { useState } from "react";
import { ArrowDownUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import useGetTokenList, { useGetTokenDetail } from "@/hooks/token/useGetTokenList";

export function PairForm2() {
  const { data: tokens, isPending } = useGetTokenList() as { 
    data: Array<{ tokenAddress: string; name: string; symbol: string }>;
    isPending: boolean;
  };

  const [token1, setToken1] = useState<string>("");
  const [token2, setToken2] = useState<string>("");

  // Ambil detail token berdasarkan address yang dipilih
  const token1Details = useGetTokenDetail(token1);
  const token2Details = useGetTokenDetail(token2);

  return (
    <div className="w-full max-w-sm mx-auto space-y-4">
      {/* Token 1 */}
      <Card className="p-4">
        <div className="text-sm font-medium mb-2">Token 1</div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            defaultValue="0"
            className="text-3xl font-semibold border-0 p-0 h-auto focus-visible:ring-0"
          />
          <Select value={token1} onValueChange={setToken1}>
            <SelectTrigger className="w-32 bg-secondary text-white border-0">
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent>
              {isPending ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                tokens.map((token) => (
                  <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {token1Details && <p className="text-xs text-gray-400">Balance: {token1Details.balance} {token1Details.symbol}</p>}
      </Card>

      {/* Swap Button */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            size="icon"
            variant="outline"
            className="h-8 w-8 rounded-full bg-background"
            onClick={() => {
              setToken1(token2);
              setToken2(token1);
            }}
          >
            <ArrowDownUp className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Token 2 */}
      <Card className="p-4">
        <div className="text-sm font-medium mb-2">Token 2</div>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            defaultValue="0"
            className="text-3xl font-semibold border-0 p-0 h-auto focus-visible:ring-0"
          />
          <Select value={token2} onValueChange={setToken2}>
            <SelectTrigger className="w-32 bg-secondary text-white border-0">
              <SelectValue placeholder="Select Token" />
            </SelectTrigger>
            <SelectContent>
              {isPending ? (
                <SelectItem value="loading" disabled>Loading...</SelectItem>
              ) : (
                tokens.map((token) => (
                  <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
                    {token.symbol} - {token.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        {token2Details && <p className="text-xs text-gray-400">Balance: {token2Details.balance} {token2Details.symbol}</p>}
      </Card>

      {/* Submit Button */}
      <Button className="w-full bg-secondary text-white">Create Pair</Button>
    </div>
  );
}



{/* <Card className="p-4">
<div className="text-sm font-medium mb-2">Token 2</div>
<div className="flex items-center gap-2">
  <Input
    type="number"
    defaultValue="0"
    className="text-3xl font-semibold border-0 p-0 h-auto focus-visible:ring-0"
  />
  <Select value={token2} onValueChange={setToken2}>
    <SelectTrigger className="w-32 bg-secondary text-white border-0">
      <SelectValue placeholder="Select Token" />
    </SelectTrigger>
    <SelectContent>
      {isPending ? (
        <SelectItem value="loading" disabled>Loading...</SelectItem>
      ) : (
        tokens.map((token) => (
          <SelectItem key={token.tokenAddress} value={token.tokenAddress}>
            {token.symbol} - {token.name}
          </SelectItem>
        ))
      )}
    </SelectContent>
  </Select>
</div>
{token2Details && <p className="text-xs text-gray-400">Balance: {token2Details.balance} {token2Details.symbol}</p>}
</Card> */}