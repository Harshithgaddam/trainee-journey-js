class ConfigManager {
  static #instance = null;
  #config = new Map();

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

  static getInstance() {
    if (!ConfigManager.#instance) {
      ConfigManager.#instance = new ConfigManager();
    }
    return ConfigManager.#instance;
  }

  get(key) {
    return this.#config.get(key);
  }

  set(key, value) {
    this.#config.set(key, value);
    return this;
  }

  has(key) {
    return this.#config.has(key);
  }
}
export default ConfigManager;