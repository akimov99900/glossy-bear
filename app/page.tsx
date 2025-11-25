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
  useReadContract,
  useSwitchChain
} from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors'; // Убрали coinbaseWallet
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. КОНФИГУРАЦИЯ: ТОЛЬКО INJECTED (Встроенный кошелек)
// Мы убрали Coinbase SDK, чтобы не было всплывающих окон с ошибкой
const config = createConfig({
  chains: [base],
  connectors: [injected()], 
  transports: { [base.id]: http() },
  ssr: true, 
});

const queryClient = new QueryClient();

const CONTRACT_ADDRESS = "0x8f305239D8ae9158e9B8E0e179531837C4646568"; 

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "nextTokenId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

function App() {
  const { isConnected, address, chainId } = useAccount();
  const { connectAsync, connectors } = useConnect();
  const { switchChainAsync } = useSwitchChain();
  const { sendTransaction, isPending, data: hash, error: mintError } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const [userFid, setUserFid] = useState('1');
  const [debugMsg, setDebugMsg] = useState('');

  const { data: nextId } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'nextTokenId',
  });

  const mintedCount = nextId ? Number(nextId) - 1 : 0;
  const maxSupply = 100;
  const progressPercent = (mintedCount / maxSupply) * 100;

  // 2. УМНАЯ ИНИЦИАЛИЗАЦИЯ
  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) setUserFid(String(context.user.fid));
        sdk.actions.ready();

        // ХАК: Ждем 1 секунду, чтобы Warpcast успел "вставить" кошелек
        if (!isConnected) {
            setTimeout(async () => {
                try {
                    // Пытаемся подключиться к Injected принудительно
                    const injectedConnector = connectors.find(c => c.id === 'injected');
                    if (injectedConnector) {
                        await connectAsync({ connector: injectedConnector });
                    }
                } catch (err) {
                    console.log("Auto-connect skipped");
                }
            }, 1000);
        }
      } catch (e: any) { 
        console.error(e);
      }
    };
    init();
  }, []); // Пустой массив = только при загрузке

  const handleMainButton = async () => {
    setDebugMsg(""); 
    
    try {
      // 1. ПОДКЛЮЧЕНИЕ (С ПОВТОРОМ)
      if (!isConnected) {
        setDebugMsg("Connecting wallet...");
        const connector = connectors[0]; // Тут только Injected
        await connectAsync({ connector });
        return; 
      }

      // 2. СЕТЬ
      if (chainId !== base.id) {
        setDebugMsg("Switching network...");
        await switchChainAsync({ chainId: base.id });
        return;
      }

      // 3. МИНТ
      setDebugMsg("Transaction sent...");
      sendTransaction({
        to: CONTRACT_ADDRESS,
        value: BigInt(10000000000000), 
        data: "0x1249c58b"
      });

    } catch (e: any) {
      console.error(e);
      // Обработка ошибок
      if (e.message.includes("User rejected")) {
        setDebugMsg("Cancelled");
      } else if (e.message.includes("Connector not found")) {
        setDebugMsg("Wallet not found. Try refreshing.");
      } else {
        setDebugMsg(`Error: ${e.message.slice(0, 40)}...`);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <div className="mb-4 px-3 py-1 bg-black text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
          Farcaster Exclusive
        </div>

        <h1 className="text-4xl font-black mb-2 tracking-tighter text-slate-900 uppercase text-center">
          CHROME GEN
        </h1>
        
        {/* СТАТУС (Чтобы ты видел, что происходит) */}
        <div className="text-[9px] text-slate-400 mb-4 font-mono text-center">
           {isConnected ? `● Connected: ${address?.slice(0,4)}...${address?.slice(-4)}` : "○ Waiting for wallet..."}
        </div>

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

        {/* СООБЩЕНИЯ */}
        {(debugMsg || mintError) && (
            <div className="w-full mb-4 p-2 bg-yellow-100 text-yellow-800 text-[10px] rounded text-center font-mono">
                {debugMsg || mintError?.message}
            </div>
        )}

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-center uppercase tracking-widest shadow-lg">
            Success! View on OpenSea
          </a>
        ) : (
          <button 
            onClick={handleMainButton}
            disabled={isPending || isConfirming}
            className="w-full bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl uppercase tracking-widest flex items-center justify-center gap-2"
          >
            {isPending ? 'Processing...' : isConnected ? 'MINT • 0.00001 ETH' : 'CONNECT & MINT'}
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
