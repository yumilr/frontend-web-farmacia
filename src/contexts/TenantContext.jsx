import React, { createContext, useContext } from 'react';

const TenantContext = createContext();
export const useTenant = () => useContext(TenantContext);

export const TenantProvider = ({ children }) => {
  // Fijo mientras desarrollas solo con un tenant
  const tenantFromURL = 'Cloudfarma';

  return (
    <TenantContext.Provider value={{ tenantId: tenantFromURL }}>
      {children}
    </TenantContext.Provider>
  );
};
