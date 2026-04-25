import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import keycloak from '../keycloak';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const keycloakConfig = {
    url: window.location.origin + '/auth',
    realm: 'medvoice',
    clientId: 'medvoice-dashboard'
  };

  const mapUserFromToken = useCallback((kc) => {
    if (!kc.tokenParsed) return null;
    
    // Check for admin role in both Realm Access and Client Access
    const realmRoles = kc.tokenParsed?.realm_access?.roles || [];
    const clientRoles = kc.tokenParsed?.resource_access?.['medvoice-dashboard']?.roles || [];
    
    const isAdmin = realmRoles.includes('admin') || clientRoles.includes('admin');

    return {
      email: kc.tokenParsed?.email || kc.tokenParsed?.preferred_username,
      name: kc.tokenParsed?.name || kc.tokenParsed?.preferred_username || 'User',
      type: isAdmin ? 'Admin' : 'Vendor',
      roles: [...realmRoles, ...clientRoles]
    };
  }, []);

  useEffect(() => {
    const initKeycloak = async () => {
      try {
        const token = localStorage.getItem('medvoice_access_token');
        const refreshToken = localStorage.getItem('medvoice_refresh_token');

        const authenticated = await keycloak.init({
          onLoad: 'check-sso',
          token: token || undefined,
          refreshToken: refreshToken || undefined,
          checkLoginIframe: false,
          enableLogging: true
        });

        if (authenticated) {
          setIsAuthenticated(true);
          setUser(mapUserFromToken(keycloak));
          
          // Set up token refresh interval
          const refreshInterval = setInterval(() => {
            keycloak.updateToken(30) // Refresh if token is about to expire in 30s
              .then((refreshed) => {
                if (refreshed) {
                  localStorage.setItem('medvoice_access_token', keycloak.token);
                  localStorage.setItem('medvoice_refresh_token', keycloak.refreshToken);
                }
              })
              .catch(() => {
                console.error('Failed to refresh token');
                logout();
              });
          }, 30000); // Check every 30 seconds

          return () => clearInterval(refreshInterval);
        }
      } catch (error) {
        console.error('Keycloak initialization failed', error);
      } finally {
        setIsInitializing(false);
      }
    };

    initKeycloak();
  }, [mapUserFromToken]);

  const login = async (email, password) => {
    try {
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('client_id', keycloakConfig.clientId);
      params.append('username', email);
      params.append('password', password);
      params.append('scope', 'openid');

      const response = await fetch(`${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      
      // Store tokens for the next initialization
      localStorage.setItem('medvoice_access_token', data.access_token);
      localStorage.setItem('medvoice_refresh_token', data.refresh_token);

      // Force a reload to cleanly re-initialize the Keycloak instance with the new tokens.
      // This avoids the "Keycloak instance can only be initialized once" error.
      window.location.reload();
      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('medvoice_access_token');
    localStorage.removeItem('medvoice_refresh_token');
    setIsAuthenticated(false);
    setUser(null);
    keycloak.logout({ redirectUri: window.location.origin });
  };

  if (isInitializing) {
     return (
       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
           <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Verifying Session...</p>
         </div>
       </div>
     );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);


