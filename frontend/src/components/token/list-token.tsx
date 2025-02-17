import useGetTokenList, { useGetTokenDetail } from "@/hooks/token/useGetTokenList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

export default function ListToken() {
  const { data, isPending } = useGetTokenList() as { 
    data: Array<{ tokenAddress: string }>, 
    isPending: boolean 
  };

  return (
    <div className="w-full space-y-2">
      {isPending ? (
        <p>Loading token list...</p>
      ) : (
        data.map((token, idx) => (
          <TokenItem key={idx} tokenAddress={token.tokenAddress} />
        ))
      )}
    </div>
  );
}

function TokenItem({ tokenAddress }: { tokenAddress: string }) {
  const { name, symbol, totalSupply, isLoading } = useGetTokenDetail(tokenAddress);

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="bg-secondary rounded-xl text-white px-4 no-underline"
    >
      <AccordionItem value={tokenAddress} className="border-b-0">
        <AccordionTrigger className="hover:no-underline">
          {isLoading ? "Loading..." : `${name as string} (${symbol as string})`}
        </AccordionTrigger>
        <AccordionContent>
          <p>📍 Address: {tokenAddress}</p>
          <p>🔤 Symbol: {symbol as string}</p>
          <p>🔢 Total Supply: {totalSupply ? `${totalSupply.toLocaleString()} ${symbol}` : "N/A"}</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

export function SelectToken({ onSelect }: {
  onSelect: (token: string) => void
}) {
  const { data, isPending } = useGetTokenList() as {
    data: Array<{ tokenAddress: string }>,
    isPending: boolean
  }

  return (
    <Select onValueChange={onSelect}>
      <SelectTrigger className="w-32 bg-secondary text-white border-0">
        <SelectValue placeholder="Select Token" />
      </SelectTrigger>
      <SelectContent>
        {isPending ? (
          <p>Loading token list...</p>
        ) : (
          data.map((token, idx) => (
            <SelectTokenDetail key={idx} tokenAddress={token.tokenAddress} />
          ))
        )}
      </SelectContent>
    </Select>
  )
}

function SelectTokenDetail({ tokenAddress }: { tokenAddress: string }) {
  const { symbol, isLoading } = useGetTokenDetail(tokenAddress);

  return (
    <SelectItem value={tokenAddress}>
      {isLoading ? "Loading..." : symbol as string}
    </SelectItem>
  )
}