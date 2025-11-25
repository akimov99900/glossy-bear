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
  useConnect
} from 'wagmi';
import { base } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// КОНФИГ ТОЛЬКО ДЛЯ WARPCAST
const config = createConfig({
  chains: [base],
  connectors: [injected()], 
  transports: { [base.id]: http() },
  ssr: true,
});

const queryClient = new QueryClient();

// ТВОЙ АДРЕС КОНТРАКТА (Вставь тот, который ты задеплоил последним!)
const CONTRACT_ADDRESS = "0x474c5382F8CDf7412c171f91675bB9f154cF9e5c"; 

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, data: hash, error: mintError } = useSendTransaction();
  const { isLoading, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [fid, setFid] = useState('1');

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if(context?.user?.fid) setFid(String(context.user.fid));
        sdk.actions.ready();
        // Авто-коннект для мобилок
        connect({ connector: injected() });
      } catch(e) {}
    };
    load();
  }, []);

  const handleMint = () => {
    // Если каким-то чудом не подключились - пробуем еще раз
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }

    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), // 0.00001 ETH
      data: "0x1249c58b"
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[#e0e0e0] font-sans text-black">
      <div className="w-full max-w-md bg-white/90 backdrop-blur rounded-[30px] p-8 shadow-2xl flex flex-col items-center">
        
        <h1 className="text-3xl font-black mb-4 uppercase tracking-tighter">CHROME GEN</h1>
        
        {/* КАРТИНКА: Теперь берется из API (Уникальная) */}
        <div className="relative w-64 h-64 bg-gray-200 rounded-2xl overflow-hidden shadow-inner mb-6 flex items-center justify-center">
             <img 
                src={`/api/image?fid=${fid}`} 
                className="w-full h-full object-contain mix-blend-multiply" 
             />
             <div className="absolute top-2 right-2 bg-white/80 px-2 py-1 rounded text-[10px] font-bold">#{fid}</div>
        </div>

        {/* ОШИБКИ */}
        {mintError && (
            <div className="w-full mb-4 p-2 bg-red-100 text-red-600 text-[10px] rounded text-center">
                {mintError.message.includes("User rejected") ? "Cancelled" : "Error. Check Balance."}
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
            className="w-full bg-black text-white font-bold py-4 rounded-full active:scale-95 transition shadow-xl flex justify-center gap-2"
          >
            {isLoading ? 'MINTING...' : isConnected ? 'MINT 0.00001 ETH' : 'CONNECT WALLET'}
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
