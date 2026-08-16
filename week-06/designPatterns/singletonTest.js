import ConfigManager from './Singleton.js';

console.log("=== TESTING SINGLETON PATTERN ===");
const config1 = ConfigManager.getInstance();
const config2 = new ConfigManager();

console.log("Config instances are strictly equal:", config1 === config2); 
config1.set("appTitle", "Notification Service");
console.log("Title read from config2:", config2.get("appTitle")); 