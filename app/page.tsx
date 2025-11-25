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

// !!! АДРЕС КОНТРАКТА !!!
// Можешь оставить старый (если не хочешь деплоить новый), 
// но лучше создать новый контракт с названием "Base Droid"
const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; 

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [userFid, setUserFid] = useState('888');

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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#0a0a0a] font-mono text-zinc-300 relative">
      
      {/* Сетка на фоне */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(30,30,30,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(30,30,30,0.5)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

      <div className="w-full max-w-md bg-[#111] border-2 border-[#333] rounded-none p-6 shadow-[10px_10px_0px_0px_rgba(40,40,40,1)] relative z-10 flex flex-col items-center">
        
        {/* Хедер в стиле терминала */}
        <div className="w-full flex justify-between items-center mb-6 border-b border-[#333] pb-2">
            <span className="text-orange-500 font-bold tracking-widest">PROTOCOL: DROID</span>
            <span className="text-xs bg-zinc-800 px-2 py-1">SYS.ONLINE</span>
        </div>

        <h1 className="text-4xl font-black mb-2 text-zinc-100 tracking-tighter">BASE DROID</h1>
        <p className="text-orange-700/80 mb-6 text-xs uppercase tracking-[0.2em]">Battle-Scarred Unit #{userFid}</p>
        
        {/* Картинка */}
        <div className="relative w-72 h-72 bg-[#050505] border border-orange-900/30 mb-8 flex items-center justify-center">
             {/* Угловые маркеры */}
             <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-orange-500"></div>
             <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-orange-500"></div>
             <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-orange-500"></div>
             <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-orange-500"></div>

             <img 
                src={`/api/image?fid=${userFid}`} 
                className="w-full h-full object-contain filter contrast-125" 
                alt="Droid" 
             />
        </div>

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-700 text-black font-bold py-4 text-center hover:bg-green-600 transition uppercase tracking-widest border border-green-500">
            UNIT ACQUIRED -> OPENSEA
          </a>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-orange-600 hover:bg-orange-500 text-black font-bold py-4 transition-all active:translate-y-1 uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed border border-orange-400"
          >
            {isPending ? 'INITIALIZING...' : 'MINT UNIT • 0.00001 ETH'}
          </button>
        )}
        
        <div className="mt-6 text-[10px] text-zinc-600 flex gap-4 uppercase">
           <span>SECURE: BASE</span>
           <span>//</span>
           <span>GEN: V3</span>
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
