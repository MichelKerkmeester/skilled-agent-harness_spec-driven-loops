import { describe, expect, it } from 'vitest';
import { DEFAULTS, loadConfig } from '../src/infrastructure/config.js';

describe('loadConfig', () => {
  it('falls back to the exported key when the plugin option is blank', () => {
    const config = loadConfig({ JEV_API_KEY: '', TYPESAFE_API_KEY: 'exported' });
    expect(config.apiKey).toBe('exported');
  });

  it('treats a whitespace-only plugin option as unset', () => {
    const config = loadConfig({ JEV_API_KEY: '   ', TYPESAFE_API_KEY: 'exported' });
    expect(config.apiKey).toBe('exported');
  });

  it('prefers the plugin option when it carries a value', () => {
    const config = loadConfig({ JEV_API_KEY: 'from-plugin', TYPESAFE_API_KEY: 'exported' });
    expect(config.apiKey).toBe('from-plugin');
  });

  it('leaves the key empty when neither is set', () => {
    expect(loadConfig({}).apiKey).toBe('');
  });

  it('applies the defaults for everything unset', () => {
    const config = loadConfig({});
    expect(config.model).toBe(DEFAULTS.model);
    expect(config.allowSourceReading).toBe(DEFAULTS.allowSourceReading);
    expect(config.maxFileBytes).toBe(DEFAULTS.maxFileBytes);
    expect(config.maxRequests).toBe(DEFAULTS.maxRequests);
  });

  it('reads the string form a plugin option substitutes for a boolean', () => {
    expect(loadConfig({ JEV_ALLOW_SOURCE_READING: 'false' }).allowSourceReading).toBe(false);
    expect(loadConfig({ JEV_ALLOW_SOURCE_READING: '0' }).allowSourceReading).toBe(false);
    expect(loadConfig({ JEV_ALLOW_SOURCE_READING: 'true' }).allowSourceReading).toBe(true);
  });

  it('ignores a boolean it cannot read', () => {
    expect(loadConfig({ JEV_ALLOW_SOURCE_READING: 'maybe' }).allowSourceReading).toBe(true);
  });

  it('clamps numbers into their supported range', () => {
    expect(loadConfig({ JEV_MAX_FILE_BYTES: '1' }).maxFileBytes).toBe(512);
    expect(loadConfig({ JEV_MAX_REQUESTS: '9999' }).maxRequests).toBe(64);
    expect(loadConfig({ JEV_MAX_REQUESTS: 'many' }).maxRequests).toBe(DEFAULTS.maxRequests);
  });
});
