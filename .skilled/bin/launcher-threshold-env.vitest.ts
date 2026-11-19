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
});
