'use client';
import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { WagmiProvider, createConfig, http, useSendTransaction, useWaitForTransactionReceipt, useAccount, useConnect } from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: { [base.id]: http() },
});
const queryClient = new QueryClient();

// !!! ВСТАВЬ СЮДА АДРЕС КОНТРАКТА (из Remix), если уже есть !!!
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
        if (!isConnected) connect({ connector: injected() });
      } catch (e) { console.error(e); }
    };
    init();
  }, [isConnected, connect]);

  const mint = () => {
    if (!isConnected) { connect({ connector: injected() }); return; }
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), // 0.00001 ETH
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-950 font-sans text-white">
      <div className="w-full max-w-md bg-zinc-900 rounded-[40px] p-8 shadow-2xl border border-zinc-800 flex flex-col items-center relative overflow-hidden">
        
        {/* Фоновый блик */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-pink-500/10 to-transparent pointer-events-none"></div>

        <h1 className="text-4xl font-black mb-2 tracking-tighter italic">GLOSSY 3D</h1>
        <p className="text-pink-400 mb-8 font-medium tracking-widest text-xs uppercase">Limited Edition Drop</p>
        
        <div className="relative w-72 h-72 bg-gradient-to-b from-zinc-800 to-black rounded-3xl overflow-hidden shadow-inner mb-8 border border-zinc-700 flex items-center justify-center">
             <img src="/api/image?fid=1" className="w-full h-full object-contain transform scale-90 hover:scale-100 transition-transform duration-500" alt="Bear" />
        </div>

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-500 text-black font-bold py-5 rounded-2xl text-center uppercase tracking-widest hover:bg-green-400 transition">View on OpenSea</a>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-5 rounded-2xl transition-all active:scale-95 shadow-[0_0_30px_rgba(219,39,119,0.4)] uppercase tracking-widest disabled:opacity-50"
          >
            {isPending ? 'Processing...' : 'MINT 0.00001 ETH'}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}><App /></QueryClientProvider>
    </WagmiProvider>
  );
}
