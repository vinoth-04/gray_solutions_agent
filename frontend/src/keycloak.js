import Keycloak from 'keycloak-js';

const keycloakConfig = {
  url: import.meta.env.VITE_KEYCLOAK_URL || window.location.origin + '/auth',
  realm: 'medvoice',
  clientId: 'medvoice-dashboard'
};

const keycloak = new Keycloak(keycloakConfig);

export default keycloak;
