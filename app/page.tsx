'use client';
import { useState, useEffect } from 'react';
import sdk from '@farcaster/frame-sdk';

// ТВОЙ КОНТРАКТ
const CONTRACT_ADDRESS = "0x8f305239D8ae9158e9B8E0e179531837C4646568"; 

export default function Page() {
  const [status, setStatus] = useState("Ready");
  const [fid, setFid] = useState("1");

  useEffect(() => {
    const load = async () => {
      try {
        const context = await sdk.context;
        if(context?.user?.fid) setFid(String(context.user.fid));
        sdk.actions.ready();
      } catch(e) {}
    };
    load();
  }, []);

  const rawMint = async () => {
    setStatus("Looking for wallet...");
    
    // 1. Ищем кошелек напрямую в браузере (без библиотек)
    const ethereum = (window as any).ethereum;

    if (!ethereum) {
      setStatus("No wallet found! Open in Warpcast or MetaMask app.");
      return;
    }

    try {
      // 2. Запрашиваем доступ
      setStatus("Connect wallet...");
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];

      // 3. Формируем транзакцию вручную
      setStatus("Sending transaction...");
      
      // Хеш функции mint() = 0x1249c58b
      const data = "0x1249c58b"; 
      // 0.00001 ETH в HEX формате = 0x2386f26fc10000
      const value = "0x2386f26fc10000"; 

      const txHash = await ethereum.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: CONTRACT_ADDRESS,
            value: value, 
            data: data,
          },
        ],
      });

      setStatus("Success! Tx: " + txHash.slice(0, 10));
      
    } catch (error: any) {
      console.error(error);
      setStatus("Error: " + (error.message || error.code || "Unknown"));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white font-sans p-4 text-center">
      <h1 className="text-3xl font-bold mb-4 uppercase">Chrome Gen</h1>
      
      <img 
        src="https://i.postimg.cc/MptNPZCX/ref.jpg" 
        className="w-64 h-64 object-cover rounded-xl mb-4 border border-gray-700"
      />
      
      <div className="mb-6 p-2 bg-gray-900 rounded text-xs font-mono text-yellow-400 border border-gray-700 w-full break-words">
        LOG: {status}
      </div>

      <button 
        onClick={rawMint}
        className="w-full bg-white text-black font-bold py-4 rounded-full text-xl active:scale-95 transition"
      >
        MINT (0.00001 ETH)
      </button>
      
      <div className="mt-4 text-gray-500 text-xs">FID: {fid}</div>
    </div>
  );
}
