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

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [userFid, setUserFid] = useState('1');

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) setUserFid(String(context.user.fid));
        sdk.actions.ready();
        if (!isConnected) connect({ connector: injected() });
      } catch (e) { console.error(e); }
    };
    init();
  }, [isConnected, connect]);

  const mint = () => {
    if (!isConnected) { connect({ connector: injected() }); return; }
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), 
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      
      {/* Светлый фон с градиентом */}
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <h1 className="text-4xl font-bold mb-2 tracking-tight text-slate-800">CHROME</h1>
        <p className="text-slate-500 mb-8 text-xs uppercase tracking-widest">Liquid Metal Collection</p>
        
        {/* Картинка */}
        <div className="relative w-72 h-72 bg-gray-100 rounded-2xl overflow-hidden shadow-inner mb-8 border border-gray-200 flex items-center justify-center">
             <img 
                src={`/api/image?fid=${userFid}`} 
                className="w-full h-full object-contain mix-blend-multiply" 
                alt="Chrome Bear" 
             />
        </div>

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-black text-white font-bold py-4 rounded-full text-center uppercase tracking-widest shadow-lg">
            View on OpenSea
          </a>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-gradient-to-r from-slate-700 to-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-widest disabled:opacity-50"
          >
            {isPending ? 'Processing...' : 'Mint • 0.00001 ETH'}
          </button>
        )}
        
        <div className="mt-6 text-[10px] text-slate-400 uppercase">
           Unique ID: #{userFid}
        </div>
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
