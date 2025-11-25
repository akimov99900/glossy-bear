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

// !!! ПРОВЕРЬ ЭТОТ АДРЕС ЕЩЕ РАЗ В REMIX !!!
const CONTRACT_ADDRESS = "0x8f305239D8ae9158e9B8E0e179531837C4646568"; 

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "nextTokenId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

function App() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  // Добавили 'error' чтобы видеть причину сбоя
  const { sendTransaction, isPending, data: hash, error: mintError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [userFid, setUserFid] = useState('1');

  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextTokenId',
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
    if (!isConnected) { 
      connect({ connector: injected() }); 
      return; 
    }
    console.log("Minting...");
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), // 0.00001 ETH
      data: "0x1249c58b" // mint()
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <div className="mb-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
          Farcaster Exclusive
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tighter text-slate-900 uppercase text-center">
          CHROME GEN
        </h1>
        
        {/* ОТЛАДКА: Показываем адрес кошелька и контракта */}
        <div className="text-[10px] text-slate-500 mb-4 text-center font-mono bg-gray-200 p-2 rounded w-full break-all">
           User: {isConnected ? address : "Not Connected"}<br/>
           Contract: {CONTRACT_ADDRESS}
        </div>

        <div className="relative w-64 h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-inner mb-6 border border-gray-200 flex items-center justify-center">
             <img src="https://i.postimg.cc/MptNPZCX/ref.jpg" className="w-full h-full object-cover" alt="Ref" />
             <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono font-bold">FID: {userFid}</div>
        </div>

        {/* СЧЕТЧИК */}
        <div className="w-full mb-6">
            <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                <span>Minted</span>
                <span>{mintedCount} / {maxSupply}</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        {/* ОШИБКА (КРАСНЫЙ БЛОК) */}
        {mintError && (
            <div className="w-full mb-4 p-3 bg-red-100 border border-red-400 text-red-700 text-xs rounded break-words font-mono">
                ERROR: {mintError.message}
            </div>
        )}

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-center uppercase tracking-widest shadow-lg">
            Success!
          </a>
        ) : isSoldOut ? (
          <button disabled className="w-full bg-gray-400 text-white font-bold py-4 rounded-full cursor-not-allowed">SOLD OUT</button>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isPending ? 'Processing...' : 'MINT • 0.00001 ETH'}
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
