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
  useSwitchChain,
  useReadContract
} from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors'; // ТОЛЬКО INJECTED
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// КОНФИГУРАЦИЯ БЕЗ ЛИШНИХ SDK
const config = createConfig({
  chains: [base],
  connectors: [injected()], // Только встроенный, никаких popups
  transports: { [base.id]: http() },
  ssr: true, 
});

const queryClient = new QueryClient();

// Твой контракт (проверь адрес!)
const CONTRACT_ADDRESS = "0x6d3e3e80B479cc51023F52349E6a51021139113a"; 

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

function App() {
  const { isConnected, chainId } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransaction, isPending, data: hash, error: mintError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const [userFid, setUserFid] = useState('1');
  const [status, setStatus] = useState('');

  const { data: supply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
  });

  const mintedCount = supply ? Number(supply) : 0;
  const maxSupply = 100;
  const isSoldOut = mintedCount >= maxSupply;
  const progressPercent = (mintedCount / maxSupply) * 100;

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) setUserFid(String(context.user.fid));
        sdk.actions.ready();
        
        // Авто-подключение БЕЗ лишнего шума
        if (!isConnected) {
            const connector = connectors[0];
            if (connector) connectAsync({ connector });
        }
      } catch (e) { console.error(e); }
    };
    init();
  }, []);

  const handleMint = async () => {
    setStatus("");
    try {
      // 1. Подключение (если отвалилось)
      if (!isConnected) {
        setStatus("Connecting...");
        await connectAsync({ connector: connectors[0] });
      }
      
      // 2. Проверка сети
      if (chainId !== base.id) {
        setStatus("Switching Network...");
        await switchChainAsync({ chainId: base.id });
      }

      // 3. Минт
      setStatus("Tx sent...");
      sendTransaction({
        to: CONTRACT_ADDRESS,
        value: BigInt(10000000000000), 
        data: "0x1249c58b"
      });
    } catch (e: any) {
      console.error(e);
      setStatus(e.message.includes("User rejected") ? "Cancelled" : "Error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-300 pointer-events-none"></div>

      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <div className="mb-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">Farcaster Exclusive</div>
        <h1 className="text-4xl font-black mb-2 tracking-tighter text-slate-900 uppercase text-center">CHROME GEN</h1>
        
        <div className="relative w-64 h-64 bg-gray-100 rounded-2xl overflow-hidden shadow-inner mb-6 border border-gray-200 flex items-center justify-center">
             <img src="https://i.postimg.cc/MptNPZCX/ref.jpg" className="w-full h-full object-cover" alt="Ref" />
             <div className="absolute top-2 right-2 bg-white/80 backdrop-blur px-2 py-1 rounded text-[10px] font-mono font-bold">FID: {userFid}</div>
        </div>

        <div className="w-full mb-6">
            <div className="flex justify-between text-xs font-bold mb-1 uppercase tracking-wider">
                <span>Minted</span>
                <span>{mintedCount} / 100</span>
            </div>
            <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-black" style={{ width: `${progressPercent}%` }}></div>
            </div>
        </div>

        {(status || mintError) && (
            <div className="w-full mb-4 p-2 bg-yellow-100 text-yellow-800 text-[10px] rounded text-center font-mono">
                {status} {mintError?.message?.slice(0,50)}
            </div>
        )}

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-center uppercase tracking-widest shadow-lg">
            Success! View on OpenSea
          </a>
        ) : (
          <button 
            onClick={handleMint}
            disabled={isSoldOut || isPending}
            className={`w-full text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-widest flex items-center justify-center gap-2 ${isSoldOut ? 'bg-gray-400' : 'bg-black'}`}
          >
            {isSoldOut ? 'SOLD OUT' : isPending ? 'Processing...' : 'MINT • 0.00001 ETH'}
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
