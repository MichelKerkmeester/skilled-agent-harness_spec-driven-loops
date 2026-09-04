import { createRequire } from 'node:module';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  isModelServerEnabled: () => boolean;
  modelServerSetting: () => 'default-on' | 'explicit-on' | 'off';
};

const FLAG = 'SPECKIT_SKILL_ADVISOR_MODEL_SERVER_ENABLED';
const original = process.env[FLAG];

function setFlag(value: string | undefined): void {
  if (value === undefined) delete process.env[FLAG];
  else process.env[FLAG] = value;
}

afterEach(() => {
  setFlag(original);
});

describe('skill-advisor model-server spawn default', () => {
  it('arms the spawn when the flag is unset, because no other launcher can', () => {
    setFlag(undefined);
    expect(launcher.modelServerSetting()).toBe('default-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('treats a blank value the same as unset', () => {
    setFlag('   ');
    expect(launcher.modelServerSetting()).toBe('default-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('records an explicit 1 separately so a missing supervision library can fail loudly', () => {
    setFlag('1');
    expect(launcher.modelServerSetting()).toBe('explicit-on');
    expect(launcher.isModelServerEnabled()).toBe(true);
  });

  it('turns the spawner off for 0 and for any other value', () => {
    for (const value of ['0', 'false', 'off', 'no']) {
      setFlag(value);
      expect(launcher.modelServerSetting(), value).toBe('off');
      expect(launcher.isModelServerEnabled(), value).toBe(false);
    }
  });
});
