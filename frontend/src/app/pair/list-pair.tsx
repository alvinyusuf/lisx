import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import useGetPairList, { useGetPairInfo } from '@/hooks/pair/useGetPairList'
import { useGetTokenDetail } from '@/hooks/token/useGetTokenList';

export default function ListPair() {
  const { data = [], isLoading } = useGetPairList();

  return (
    <div className="w-full space-y-2">
      {isLoading ? (
        <p>Loading token list...</p>
      ) : (
        Array.isArray(data) && data.length > 0 ? (
          data[0]?.map((pair: string, idx: number) => (
            <PairDetails key={idx} pairAddress={pair} />
          ))
        ) : (
          <p>No pairs available</p>
        )
      )}
    </div>
  );
}

function PairDetails({ pairAddress }: { pairAddress: string }) {
  const { data, isLoading } = useGetPairInfo(pairAddress) as {  data: Array<string>, isLoading: boolean };

  return (
    <Accordion 
      type="single" 
      collapsible 
      className="bg-secondary rounded-xl text-white px-4 no-underline"
    >
      {isLoading ? "Loading..." : (
        <AccordionItem value={pairAddress} className="border-b-0">
          <AccordionTrigger className="hover:no-underline">
            {isLoading ? "Loading..." : (
              <div className='flex gap-x-2'>
                  <DetailToken tokenAddress={data[0]} />
                  <span>X</span>
                  <DetailToken tokenAddress={data[1]} />
              </div>
            )}
          </AccordionTrigger>
          <AccordionContent>
            <p>📍 Address: {pairAddress}</p>
            <p>🔤 Total Liquidity: {parseInt(data[4])/(10 ** 18)}</p>
            <div className='flex gap-x-1'>🔢 Reserve <DetailToken tokenAddress={data[0]} />: {parseInt( data[2])/(10 ** 18)} <DetailToken tokenAddress={data[0]} /></div>
            <div className='flex gap-x-1'>🔢 Reserve <DetailToken tokenAddress={data[1]} />: {parseInt( data[3])/(10 ** 18)} <DetailToken tokenAddress={data[1]} /></div>
          </AccordionContent>
        </AccordionItem>
      )}
    </Accordion>
  )
}

function DetailToken({ tokenAddress }: { tokenAddress: string }) {
  const { symbol } = useGetTokenDetail(tokenAddress);

  return (
    <div>{symbol as string}</div>
  )
  
}

