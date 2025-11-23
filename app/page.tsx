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

// !!! ВАЖНО: ВСТАВЬ СЮДА СВОЙ АДРЕС КОНТРАКТА ИЗ REMIX !!!
// Тот, который ты деплоил для GlossyBear (или создай новый, если хочешь сменить название)
const CONTRACT_ADDRESS = "0xa9E4471dA1c6A1eaF22f2a35385F28537F7e715b"; 

function App() {
  const { isConnected } = useAccount();
  const { connect } = useConnect();
  const { sendTransaction, isPending, data: hash } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  
  // Сохраняем FID пользователя, чтобы показать именно ЕГО медведя
  const [userFid, setUserFid] = useState('1');

  useEffect(() => {
    const init = async () => {
      try {
        const context = await sdk.context;
        // Если открыто в Warpcast, берем реальный FID юзера
        if (context?.user?.fid) {
          setUserFid(String(context.user.fid));
        }
        
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-zinc-950 font-sans text-white relative overflow-hidden">
      
      {/* Фоновые эффекты */}
      <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-[radial-gradient(circle,rgba(236,72,153,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>

      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl rounded-[32px] p-6 shadow-2xl border border-zinc-800 flex flex-col items-center relative z-10">
        
        <h1 className="text-3xl font-black mb-2 tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 drop-shadow-lg">
          CRYSTAL BEAR
        </h1>
        
        {/* Блок с описанием для пользователя */}
        <div className="w-full bg-zinc-800/50 rounded-xl p-3 mb-6 border border-zinc-700/50">
          <ul className="space-y-2 text-xs text-zinc-300 font-medium tracking-wide">
            <li className="flex items-center gap-2">
              <span className="text-lg">💎</span> 
              <span>Generated uniquely from <b>your FID</b></span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">✨</span> 
              <span>Swarovski style texture & iridescence</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-lg">🌊</span> 
              <span>Instantly tradeable on <b>OpenSea</b></span>
            </li>
          </ul>
        </div>
        
        {/* Картинка медведя */}
        <div className="relative w-64 h-64 bg-gradient-to-b from-zinc-800 to-black rounded-2xl overflow-hidden shadow-2xl mb-6 border border-zinc-600 flex items-center justify-center group">
             {/* Подставляем userFid, чтобы юзер видел СВОЕГО медведя */}
             <img 
                src={`/api/image?fid=${userFid}`} 
                className="w-full h-full object-contain transform group-hover:scale-105 transition-transform duration-700" 
                alt="Your Bear" 
             />
             
             {/* Бейджик с номером */}
             <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded-md text-[10px] text-white/70 font-mono border border-white/10">
                #{userFid}
             </div>
        </div>

        {isSuccess ? (
          <a href={`https://opensea.io/assets/base/${CONTRACT_ADDRESS}`} target="_blank" className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-4 rounded-xl text-center uppercase tracking-widest transition shadow-[0_0_20px_rgba(34,197,94,0.3)]">
            Success! View on OpenSea
          </a>
        ) : (
          <button 
            onClick={mint}
            disabled={isPending || isConfirming}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all active:scale-95 shadow-[0_0_30px_rgba(219,39,119,0.4)] uppercase tracking-widest disabled:opacity-50 border-t border-white/20"
          >
            {isPending ? 'Confirm in Wallet...' : 'MINT YOURS • 0.00001 ETH'}
          </button>
        )}
        
        <div className="mt-4 text-[10px] text-zinc-500 uppercase tracking-widest">
          Secured by Base
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
