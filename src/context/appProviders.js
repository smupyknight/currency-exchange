import React from 'react';

import { WalletProvider } from './wallet.context';

function AppProviders({ children }) {
  return (
    <WalletProvider>
      {children}
    </WalletProvider>
  );
}

export default AppProviders;
