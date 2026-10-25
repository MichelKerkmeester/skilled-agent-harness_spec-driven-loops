// The launcher forwards only allowlisted environment keys to the advisor daemon
// child. The trusted private-skill roots must be one of them, otherwise the
// daemon cannot follow a `local-*` link and indexes zero private skills.

import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const requireCjs = createRequire(import.meta.url);
const HERE = dirname(fileURLToPath(import.meta.url));
const launcher = requireCjs(join(HERE, 'system-skill-advisor-launcher.cjs'));

const KEY = 'SPECKIT_PRIVATE_SKILL_ROOTS';

describe('private skill roots through the launcher child-env allowlist', () => {
  it('forwards the trusted roots value unchanged to the daemon child', () => {
    const roots = '/work/a/local-skills:/work/b/local-skills';
    const childEnv = launcher.createChildEnv({ [KEY]: roots, PATH: '/usr/bin' });
    expect(childEnv[KEY]).toBe(roots);
  });

  it('adds no key when the roots are unset and does not widen to a neighbour', () => {
    const unset = launcher.createChildEnv({ PATH: '/usr/bin' });
    expect(Object.prototype.hasOwnProperty.call(unset, KEY)).toBe(false);
    const neighbour = launcher.createChildEnv({ [`${KEY}_EXTRA`]: '/x', PATH: '/usr/bin' });
    expect(Object.prototype.hasOwnProperty.call(neighbour, `${KEY}_EXTRA`)).toBe(false);
    expect(Object.prototype.hasOwnProperty.call(neighbour, KEY)).toBe(false);
  });
});
