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
import { injected, coinbaseWallet } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. ПОДКЛЮЧАЕМ ВСЁ ЧТО МОЖНО
const config = createConfig({
  chains: [base],
  connectors: [
    // Coinbase - это "родной" кошелек для Base и Farcaster
    coinbaseWallet({ appName: 'Chrome Bear', preference: 'smartWalletOnly' }),
    // Injected - стандартный (на всякий случай)
    injected(),
  ],
  transports: { [base.id]: http() },
  ssr: true, 
});

const queryClient = new QueryClient();
const CONTRACT_ADDRESS = "0x474c5382F8CDf7412c171f91675bB9f154cF9e5c"; 

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "nextTokenId", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

function App() {
  const { isConnected, address } = useAccount();
  // Получаем список ВСЕХ доступных кошельков
  const { connect, connectors, error: connectError } = useConnect();
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
  const progressPercent = (mintedCount / maxSupply) * 100;

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        if (context?.user?.fid) setUserFid(String(context.user.fid));
        sdk.actions.ready();
      } catch (e) {}
    };
    init();
  }, []);

  const mint = () => {
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), 
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black relative">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-[30px] p-8 shadow-2xl border border-white flex flex-col items-center relative z-10">
        
        <h1 className="text-3xl font-black mb-4 tracking-tighter text-slate-900 uppercase">CHROME GEN</h1>
        
        <img src="https://i.postimg.cc/MptNPZCX/ref.jpg" className="w-48 h-48 object-cover rounded-xl mb-4" />

        <div className="w-full mb-4 text-xs font-bold text-center">
            MINTED: {mintedCount} / 100
        </div>

        {/* БЛОК ОШИБОК */}
        {(connectError || mintError) && (
            <div className="w-full mb-4 p-2 bg-red-100 text-red-600 text-[10px] rounded text-center break-words">
                {connectError?.message || mintError?.message}
            </div>
        )}

        {isSuccess ? (
           <div className="p-4 bg-green-500 text-white rounded-xl font-bold">SUCCESS!</div>
        ) : isConnected ? (
           // ЕСЛИ ПОДКЛЮЧЕН -> КНОПКА МИНТ
           <div className="w-full">
             <div className="text-[10px] text-center text-gray-500 mb-2">Connected: {address?.slice(0,6)}...</div>
             <button 
               onClick={mint}
               disabled={isPending || isConfirming}
               className="w-full bg-black text-white font-bold py-4 rounded-full transition-all active:scale-95 shadow-xl"
             >
               {isPending ? 'MINTING...' : 'MINT 0.00001 ETH'}
             </button>
           </div>
        ) : (
           // ЕСЛИ НЕ ПОДКЛЮЧЕН -> СПИСОК ВСЕХ КНОПОК
           <div className="w-full flex flex-col gap-2">
             <p className="text-xs text-center mb-2 font-bold">CHOOSE WALLET:</p>
             {connectors.map((connector) => (
               <button
                 key={connector.uid}
                 onClick={() => connect({ connector })}
                 className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl text-sm hover:bg-blue-700 transition"
               >
                 Connect {connector.name}
               </button>
             ))}
           </div>
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
