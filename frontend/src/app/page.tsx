import SwapForm from "./swap/form";

export default function Home() {
  return (
    <div className='w-full flex flex-col gap-4 items-center py-10'>
      <h1 className='text-3xl font-bold'>Swap</h1>
      <SwapForm />
    </div>
  );
}
