class ConfigManager {
  static #instance :ConfigManager|null = null;
  #config :Map<string,string|number> = new Map();

  constructor() {
    if (ConfigManager.#instance) {
      return ConfigManager.#instance;
    }

    this.#config.set('env', 'production');
    this.#config.set('maxRetries', 3);
    this.#config.set('timeoutMs', 5000);

    ConfigManager.#instance = this;
    Object.freeze(this); 
  }

  static getInstance() :ConfigManager{
    if (!ConfigManager.#instance) {
      ConfigManager.#instance = new ConfigManager();
    }
    return ConfigManager.#instance;
  }

  get(key:string) {
    return this.#config.get(key);
  }

  set(key:string, value:string|number) {
    this.#config.set(key, value);
    return this;
  }

  has(key:string):boolean {
    return this.#config.has(key);
  }
}
export default ConfigManager;