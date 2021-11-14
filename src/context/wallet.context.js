import React, { useState } from 'react';

const WalletContext = React.createContext({});

/**
 * @return {null}
 */
function WalletProvider(props) {
  const [wallet, setWallet] = useState({
    USD: 200,
    EUR: 150,
    GBP: 10,
  });

  const updateWallet = (fromCurrency, toCurrency, withDraw, deposit) => {
    setWallet({
      ...wallet,
      [fromCurrency]: wallet[fromCurrency] - withDraw,
      [toCurrency]: wallet[toCurrency] + deposit,
    });
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        updateWallet,
      }}
      {...props}
    />
  );
}

function useWallet() {
  const context = React.useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}

export { WalletProvider, useWallet };
