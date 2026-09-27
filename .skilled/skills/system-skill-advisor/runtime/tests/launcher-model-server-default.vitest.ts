import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';

const require = createRequire(import.meta.url);
const launcher = require('../../../../bin/system-skill-advisor-launcher.cjs') as {
  isModelServerEnabled: () => boolean;
  modelServerSetting: () => 'default-on' | 'explicit-on' | 'off';
  pinModelServerToAdvisorDatabase: (env: NodeJS.ProcessEnv) => string | null;
  resolveModelServerSocketPath: (env?: NodeJS.ProcessEnv) => string;
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

describe('sandboxed launcher model-server isolation', () => {
  const SHARED_SOCKET_DIR = '/tmp/system-skill-advisor';
  const SANDBOX_DB_DIR = join(tmpdir(), 'advisor-model-server-pin-db');

  it('gives a launcher with its own database its own model-server address', () => {
    const liveEnv: NodeJS.ProcessEnv = { SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR };
    const sandboxEnv: NodeJS.ProcessEnv = {
      SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR,
      SYSTEM_SKILL_ADVISOR_DB_DIR: SANDBOX_DB_DIR,
    };

    const pinned = launcher.pinModelServerToAdvisorDatabase(sandboxEnv);

    expect(pinned).not.toBeNull();
    expect(sandboxEnv.HF_EMBED_SERVER_URL).toBe(pinned);
    expect(launcher.resolveModelServerSocketPath(sandboxEnv)).toBe(pinned);
    expect(dirname(launcher.resolveModelServerSocketPath(sandboxEnv)))
      .not.toBe(dirname(launcher.resolveModelServerSocketPath(liveEnv)));
    expect(sandboxEnv.SPECKIT_IPC_SOCKET_DIR).toBe(SHARED_SOCKET_DIR);
  });

  it('leaves a workspace launcher and an explicit model-server address alone', () => {
    const liveEnv: NodeJS.ProcessEnv = { SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR };
    expect(launcher.pinModelServerToAdvisorDatabase(liveEnv)).toBeNull();
    expect(liveEnv).toEqual({ SPECKIT_IPC_SOCKET_DIR: SHARED_SOCKET_DIR });

    const explicitEnv: NodeJS.ProcessEnv = {
      SYSTEM_SKILL_ADVISOR_DB_DIR: SANDBOX_DB_DIR,
      HF_EMBED_SERVER_URL: 'tcp://127.0.0.1:9',
    };
    expect(launcher.pinModelServerToAdvisorDatabase(explicitEnv)).toBeNull();
    expect(explicitEnv.HF_EMBED_SERVER_URL).toBe('tcp://127.0.0.1:9');
  });
});
