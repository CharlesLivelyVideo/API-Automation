// config.js
export default {
  timeout: parseInt(process.env.API_TIMEOUT || '1500', 10),
  kc_host: process.env.KC_HOST_URL || 'https://keycloak.nativeframe.com',
  kc_realm: process.env.KC_REALM_TAG || 'livelyvideo-dev',
  kc_userId: process.env.KC_USER_ID || '42ce130a-b0a8-4fba-b945-a6d7c7399f9b',
  host: process.env.HOST_URL || 'https://platform.nativeframe.com',
  dashboard_host: process.env.DASHBOARD_HOST_URL || 'https://dashboard.qa8.devspace.lsea4.livelyvideo.tv'
};