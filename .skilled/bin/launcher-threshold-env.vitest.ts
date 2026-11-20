// The launcher forwards only allowlisted environment keys to the advisor daemon
// child. The scorer reads both routing thresholds in the daemon, so without these
// keys a documented threshold override never reaches the scorer.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const launcher = requireCjs(join(HERE, 'system-skill-advisor-launcher.cjs'));

describe('routing thresholds through the launcher child-env allowlist', () => {
  it.each([
    ['SPECKIT_ADVISOR_CONFIDENCE_THRESHOLD', '0.7'],
    ['SPECKIT_ADVISOR_UNCERTAINTY_THRESHOLD', '0.4'],
  ])('forwards %s unchanged to the daemon child', (key, value) => {
    const childEnv = launcher.createChildEnv({ [key]: value, PATH: '/usr/bin' });
    expect(childEnv[key]).toBe(value);
  });

  it('forwards Ollama embedding settings unchanged to the daemon child', () => {
    const childEnv = launcher.createChildEnv({
      OLLAMA_BASE_URL: 'http://127.0.0.1:11434',
      OLLAMA_REQUEST_TIMEOUT_MS: '120000',
      PATH: '/usr/bin',
    });

    expect(childEnv.OLLAMA_BASE_URL).toBe('http://127.0.0.1:11434');
    expect(childEnv.OLLAMA_REQUEST_TIMEOUT_MS).toBe('120000');
  });

  it('forwards the daemon embedding refresh setting unchanged to the daemon child', () => {
    const childEnv = launcher.createChildEnv({
      SYSTEM_SKILL_ADVISOR_EMBED_REFRESH: 'off',
      PATH: '/usr/bin',
    });

    expect(childEnv.SYSTEM_SKILL_ADVISOR_EMBED_REFRESH).toBe('off');
  });

  it('sets the advisor database directory when the source environment has none', () => {
    const expectedDbDir = dirname(launcher.ownerLeasePath());
    const childEnv = launcher.createChildEnv({ PATH: '/usr/bin' });

    expect(childEnv.SYSTEM_SKILL_ADVISOR_DB_DIR).toBe(expectedDbDir);
  });

  it('keeps an explicit advisor database directory from the source environment', () => {
    const explicitDbDir = '/tmp/explicit-advisor-db';
    const childEnv = launcher.createChildEnv({
      SYSTEM_SKILL_ADVISOR_DB_DIR: explicitDbDir,
      PATH: '/usr/bin',
    });

    expect(childEnv.SYSTEM_SKILL_ADVISOR_DB_DIR).toBe(explicitDbDir);
  });
});
