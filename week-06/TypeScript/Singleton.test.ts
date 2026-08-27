import ConfigManager from './Singleton';

describe('ConfigManager (Singleton)', () => {
  it('should always return the same instance', () => {
    const instance1 = ConfigManager.getInstance();
    const instance2 = new ConfigManager();

    expect(instance1).toBe(instance2);
  });

  it('should initialize with default configuration values', () => {
    const config = ConfigManager.getInstance();

    expect(config.get('env')).toBe('production');
    expect(config.get('maxRetries')).toBe(3);
    expect(config.get('timeoutMs')).toBe(5000);
  });

  it('should set and retrieve custom configuration values', () => {
    const config = ConfigManager.getInstance();

    config.set('theme', 'dark');
    expect(config.get('theme')).toBe('dark');
  });

  it('should check if a key exists using has()', () => {
    const config = ConfigManager.getInstance();

    expect(config.has('env')).toBe(true);
    expect(config.has('Harshith')).toBe(false);
  });

  it('should share state changes across different calls to getInstance()', () => {
    const firstRef = ConfigManager.getInstance();
    firstRef.set('apiUrl', 'https://api.example.com');

    const secondRef = ConfigManager.getInstance();
    expect(secondRef.get('apiUrl')).toBe('https://api.example.com');
  });
});