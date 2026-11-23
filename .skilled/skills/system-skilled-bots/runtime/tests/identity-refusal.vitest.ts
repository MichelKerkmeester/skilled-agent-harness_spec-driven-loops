// Identity: a repository with no remote and no declared identity cannot enqueue, and writes nothing trying.

import { afterEach, describe, expect, it } from 'vitest';

import { botWorld, filesUnder, runCli } from './runner-support.js';
import { entries, queueOf } from './queue-support.js';
import { cleanupTemp, writeConfig } from './support.js';

afterEach(cleanupTemp);

describe('enqueue identity refusal', () => {
  it('refuses with no identity and writes nothing, then enqueues once identity is set', () => {
    const world = botWorld();
    // The world's checkout has no remote; dropping the declared identity leaves it with none.
    writeConfig(world.checkoutRoot, {});
    const refused = runCli(world, ['enqueue', 'manual-ok', '--source', 'test', '--event-id', 'evt-1']);
    expect(refused.status).not.toBe(0);
    expect(refused.stderr).toContain('identity-unknown');
    expect(refused.stderr).toContain('"identity"');
    expect(refused.stderr).toContain('bots/config.json');
    expect(filesUnder(world.stateHome)).toEqual([]);

    writeConfig(world.checkoutRoot, { identity: 'acme/tool' });
    const sent = runCli(world, ['enqueue', 'manual-ok', '--source', 'test', '--event-id', 'evt-1']);
    expect(sent.status).toBe(0);
    expect(entries(queueOf(world).inbox)).toHaveLength(1);
  }, 60_000);
});
