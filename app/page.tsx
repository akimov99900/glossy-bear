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

// МАКСИМАЛЬНО ПРОСТОЙ КОНФИГ
// Только один тип кошелька - Injected (это и есть Warpcast wallet)
const config = createConfig({
  chains: [base],
  connectors: [injected()],
  transports: { [base.id]: http() },
  ssr: true, 
});

const queryClient = new QueryClient();

// ТВОЙ КОНТРАКТ
const CONTRACT_ADDRESS = "0x8f305239D8ae9158e9B8E0e179531837C4646568"; 

function App() {
  const { isConnected, address } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash, error } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  const [ready, setReady] = useState(false);

  useEffect(() => {
    sdk.actions.ready();
    setReady(true);
  }, []);

  const handleMint = () => {
    // 1. Если не подключен - подключаем
    if (!isConnected) {
      connect({ connector: injected() });
      return;
    }
    // 2. Если подключен - минтим
    sendTransaction({
      to: CONTRACT_ADDRESS,
      value: BigInt(10000000000000), // 0.00001 ETH
      data: "0x1249c58b"
    });
  };

  if (!ready) return <div className="flex h-screen items-center justify-center text-white">Loading...</div>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-black text-white font-sans">
      <div className="w-full max-w-md border border-gray-800 rounded-2xl p-6 bg-zinc-900 text-center">
        
        <h1 className="text-3xl font-bold mb-4">CHROME GEN</h1>
        
        <div className="mb-6 p-4 bg-black rounded-xl border border-gray-700">
           {/* Статичная картинка для надежности */}
           <img src="https://i.postimg.cc/MptNPZCX/ref.jpg" className="w-full rounded-lg" />
        </div>

        {/* СТАТУС И ОШИБКИ */}
        <div className="mb-4 text-xs text-gray-400 font-mono">
           Status: {isConnected ? "🟢 Connected" : "🔴 Not Connected"} <br/>
           {error && <span className="text-red-500">Error: {error.message.slice(0, 40)}...</span>}
        </div>

        {isSuccess ? (
          <div className="p-4 bg-green-900 text-green-100 rounded-xl font-bold">
            MINT SUCCESSFUL!
          </div>
        ) : (
          <button 
            onClick={handleMint}
            disabled={isPending || isConfirming}
            className="w-full bg-white text-black font-bold py-4 rounded-full active:scale-95 transition text-xl"
          >
            {isPending ? 'Waiting...' : isConnected ? 'MINT NOW' : 'CONNECT WALLET'}
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
