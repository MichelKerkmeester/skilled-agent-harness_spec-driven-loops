import { writeFileSync } from 'node:fs';

import { afterEach, describe, expect, it } from 'vitest';

import { defaultRepoConfig } from '../lib/repo-config.js';
import { identityStatePaths, userStateRoot } from '../lib/state-root.js';
import { clearSwitch, readSwitch, setSwitch, switchFile } from '../lib/switches.js';
import { cleanupTemp, tempDir } from './support.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';

describe('stop switches', () => {
  it('sets, reads and clears a switch under the user-level switches folder', () => {
    const root = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
    const set = setSwitch(root, IDENTITY, 'tidy-notes', 'disabled', new Date('2026-11-22T10:00:00Z'));
    expect(set).toEqual({ ok: true, value: switchFile(root, IDENTITY, 'tidy-notes', 'disabled') });
    if (set.ok) expect(set.value.startsWith(identityStatePaths(root, IDENTITY).switches)).toBe(true);
    expect(readSwitch(root, IDENTITY, 'tidy-notes', 'disabled')).toEqual({ setAt: '2026-11-22T10:00:00.000Z' });
    expect(readSwitch(root, IDENTITY, 'tidy-notes', 'paused')).toBeNull();
    expect(clearSwitch(root, IDENTITY, 'tidy-notes', 'disabled')).toEqual({ ok: true, value: true });
    expect(readSwitch(root, IDENTITY, 'tidy-notes', 'disabled')).toBeNull();
    expect(clearSwitch(root, IDENTITY, 'tidy-notes', 'disabled')).toEqual({ ok: true, value: false });
  });

  it('reads a damaged switch file as set and refuses an unsafe bot id', () => {
    const root = userStateRoot(defaultRepoConfig(), { XDG_STATE_HOME: tempDir() });
    const set = setSwitch(root, IDENTITY, 'tidy-notes', 'paused');
    if (!set.ok) throw new Error(set.reason);
    writeFileSync(set.value, '{ broken');
    expect(readSwitch(root, IDENTITY, 'tidy-notes', 'paused')).toEqual({ setAt: 'unknown' });
    expect(setSwitch(root, IDENTITY, '../escape', 'disabled')).toEqual({ ok: false, reason: 'bot-id-invalid' });
  });
});
