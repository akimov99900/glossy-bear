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
  ssr: true,
});

const queryClient = new QueryClient();

const CONTRACT_ADDRESS = "0x474c5382F8CDf7412c171f91675bB9f154cF9e5c"; // ТВОЙ КОНТРАКТ

const CONTRACT_ABI = [
  { inputs: [], name: "mint", outputs: [], stateMutability: "payable", type: "function" },
  { inputs: [], name: "totalSupply", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "MAX_SUPPLY", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" }
] as const;

// ТВОИ КАРТИНКИ (Вставь те же ссылки сюда!)
const BEAR_IMAGES = [
    "https://i.postimg.cc/MptNPZCX/ref.jpg", 
    "https://i.postimg.cc/ВТОРАЯ_ССЫЛКА.jpg", 
    "https://i.postimg.cc/ТРЕТЬЯ_ССЫЛКА.jpg"  
];

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, data: hash, error: mintError } = useSendTransaction();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });

  const { data: supply } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'totalSupply',
    query: { refetchInterval: 3000 }
  });

  const mintedCount = supply ? Number(supply) : 0;
  // Вычисляем, какой медведь следующий (0, 1 или 2)
  const nextBearIndex = mintedCount % 3; 
  const currentImage = BEAR_IMAGES[nextBearIndex];

  useEffect(() => {
    sdk.actions.ready();
    connect({ connector: injected() });
  }, []);

  const handleMint = () => {
    if (!isConnected) { connect({ connector: injected() }); return; }
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), 
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-[30px] p-8 shadow-2xl flex flex-col items-center">
        
        <h1 className="text-3xl font-black mb-2 uppercase tracking-tighter">CHROME DROP</h1>
        <p className="text-xs text-gray-500 mb-4 uppercase tracking-widest">Next available unit</p>
        
        {/* Показываем ТОГО МЕДВЕДЯ, который выпадет следующим */}
        <div className="relative w-64 h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-inner mb-6 flex items-center justify-center">
             <img 
                src={currentImage} 
                className="w-full h-full object-cover" 
             />
             <div className="absolute bottom-2 left-2 bg-black text-white px-2 py-1 rounded text-[10px] font-bold">
               #{mintedCount + 1}
             </div>
        </div>

        <div className="w-full mb-4 text-xs font-bold text-center uppercase">
            Minted: {mintedCount} / 100
        </div>

        {mintError && (
            <div className="w-full mb-4 p-2 bg-red-100 text-red-600 text-[10px] rounded text-center">
                {mintError.message.includes("User rejected") ? "Cancelled" : "Error"}
            </div>
        )}

        {isSuccess ? (
          <div className="w-full bg-green-600 text-white font-bold py-4 rounded-full text-center shadow-lg">
            MINTED! CHECK OPENSEA
          </div>
        ) : (
          <button 
            onClick={handleMint}
            disabled={isLoading}
            className="w-full bg-black text-white font-bold py-4 rounded-full active:scale-95 transition shadow-xl"
          >
            {isLoading ? 'MINTING...' : isConnected ? 'MINT NEXT • 0.00001 ETH' : 'CONNECT WALLET'}
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
