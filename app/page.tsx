'use client';
import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';
import { 
  WagmiProvider, 
  createConfig, 
  http, 
  useSendTransaction, 
  useWaitForTransactionReceipt,
  useAccount, 
  useConnect,
  useReadContract 
} from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: { [base.id]: http() },
});
const queryClient = new QueryClient();

// АДРЕС КОНТРАКТА (Убедись, что он правильный/новый!)
const CONTRACT_ADDRESS = "0x8f305239D8ae9158e9B8E0e179531837C4646568"; 

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "nextTokenId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [userFid, setUserFid] = useState('1');

  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextTokenId',
    query: { refetchInterval: 5000 }
  });

  const mintedCount = nextId ? Number(nextId) - 1 : 0;
  const maxSupply = 100;
  const isSoldOut = mintedCount >= maxSupply;
  const progressPercent = (mintedCount / maxSupply) * 100;

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
      value: BigInt(10000000000000), // 0.00001 ETH
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <div className="mb-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
          Exclusive Farcaster Drop
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tighter text-slate-900 uppercase text-center">
          CHROME GEN
        </h1>
        
        <p className="text-slate-500 text-sm text-center mb-6 leading-snug">
          Liquid Metal Collection.<br/>
          <span className="font-bold text-slate-800">Material:</span> Unique to your FID.
        </p>
        
        {/* КАРТИНКА (Теперь статичная) */}
        <div className="relative w-64 h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-inner mb-6 border border-gray-200 flex items-center justify-center">
             <img 
                src="https://i.postimg.cc/MptNPZCX/ref.jpg" 
                className="w-full h-full object-cover hover:scale-105 transition duration-500" 
                alt="Chrome Bear Reference" 
             />
             {/* Метка ID остается, чтобы персонализировать опыт */}
             <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono font-bold">
               YOUR FID: {userFid}
             </div>
        </div>

        {/* Прогресс Бар */}
        <div className="w-full mb-6">
            <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                <span>Minted</span>
                <span className={isSoldOut ? "text-red-500" : "text-black"}>
                    {mintedCount} / {maxSupply}
                </span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-black transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
        </div>

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-center uppercase tracking-widest shadow-lg hover:bg-green-500 transition">
            Success! View on OpenSea
          </a>
        ) : isSoldOut ? (
          <button disabled className="w-full bg-gray-400 text-white font-bold py-4 rounded-full text-center uppercase tracking-widest cursor-not-allowed">
            SOLD OUT
          </button>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-widest disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? 'Processing...' : (
              <>
                <span>MINT</span>
                <span className="opacity-50">|</span>
                <span>0.00001 ETH</span>
              </>
            )}
          </button>
        )}
        
        <div className="mt-6 text-[10px] text-slate-400 uppercase tracking-widest">
           Verified Contract • Base Mainnet
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
