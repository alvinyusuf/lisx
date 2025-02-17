import { useGetAllTokensWithDetails } from "@/hooks/token/useGetTokenList";

export default function MyComponent() {
  const { tokens, isLoading } = useGetAllTokensWithDetails();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {tokens.map(token => (
        <div key={token.address}>
          {token.error ? (
            <p>Error: {token.error}</p>
          ) : (
            <>
              <h3>{token.name} ({token.symbol})</h3>
              <p>Total Supply: {token.totalSupply}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}