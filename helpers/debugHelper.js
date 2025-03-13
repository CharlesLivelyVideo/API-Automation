// debugHelper.js
import config from './config.js';
export const DEBUG_LEVEL = 0; // 0 = OFF, 1 = ON.
export function printConfig() {
	if (DEBUG_LEVEL <= 0) return;
		console.log('\n=== Configuration Values ===');
		console.log(`Timeout: ${config.timeout}ms`);
		console.log(`Keycloak Host: ${config.kc_host}`);
		console.log(`Keycloak Realm: ${config.kc_realm}`);
		console.log(`Keycloak User ID: ${config.kc_userId}`);
		console.log(`API Host: ${config.host}`);
		console.log(`Dashboard Host: ${config.dashboard_host}`);
		console.log('===========================\n');
}