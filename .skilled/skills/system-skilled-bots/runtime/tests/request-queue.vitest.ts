// Request queue: every move is one rename between sibling folders on one filesystem.

import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import { buildRequest } from '../lib/request-record.js';
import {
  claimRequest,
  enqueueRequest,
  finishRequest,
  queueFolders,
  quarantineRequest,
  readClaimed,
  readQuarantineReasons,
  retryRequest,
} from '../lib/request-queue.js';
import { REQUEST_FOLDERS } from '../lib/state-root.js';
import { cleanupTemp, tempDir } from './support.js';

afterEach(cleanupTemp);

const IDENTITY = 'acme/tool';

function request(eventId: string, prompt = 'p') {
  const built = buildRequest({ workflowId: 'review', source: 'webhook', eventId, prompt, target: { identity: IDENTITY, path: '/tmp/x' } });
  if (!built.ok) throw new Error(built.reason);
  return built.value;
}

/** The folders that hold a file of this name. */
function foldersHolding(folders: ReturnType<typeof queueFolders>, name: string): string[] {
  return REQUEST_FOLDERS.filter((folder) => existsSync(join(folders[folder], name)));
}

describe('request queue', () => {
  it('puts every folder on one device and leaves only the finished request in the watched folder', () => {
    const stateRoot = tempDir();
    const sent = enqueueRequest(stateRoot, request('evt-1'));
    expect(sent).toMatchObject({ ok: true, value: { status: 'enqueued' } });
    const folders = queueFolders(stateRoot, IDENTITY);
    const devices = new Set(REQUEST_FOLDERS.map((folder) => statSync(folders[folder]).dev));
    expect(devices.size).toBe(1);
    expect(readdirSync(folders.inbox)).toHaveLength(1);
    expect(readdirSync(folders.tmp)).toHaveLength(0);
    expect(readdirSync(folders.seen)).toHaveLength(1);
  });

  it('reports a re-sent event as a duplicate and writes nothing more', () => {
    const stateRoot = tempDir();
    enqueueRequest(stateRoot, request('evt-1', 'first'));
    const again = enqueueRequest(stateRoot, request('evt-1', 'changed'));
    expect(again).toMatchObject({ ok: true, value: { status: 'duplicate', path: null } });
    const folders = queueFolders(stateRoot, IDENTITY);
    expect(readdirSync(folders.inbox)).toHaveLength(1);
    expect(readdirSync(folders.tmp)).toHaveLength(0);
  });

  it('lets only one claim win and keeps a request in exactly one folder after each move', () => {
    const stateRoot = tempDir();
    const sent = request('evt-1');
    enqueueRequest(stateRoot, sent);
    const folders = queueFolders(stateRoot, IDENTITY);
    const name = `${sent.id}.json`;

    expect(claimRequest(folders, name).ok).toBe(true);
    expect(claimRequest(folders, name)).toMatchObject({ ok: false, reason: 'claim-lost' });
    expect(foldersHolding(folders, name)).toEqual(['claimed']);

    expect(retryRequest(folders, name, sent).ok).toBe(true);
    expect(foldersHolding(folders, name)).toEqual(['inbox']);
    claimRequest(folders, name);
    expect(readClaimed(folders, name)).toMatchObject({ ok: true, value: { attempts: 1 } });

    expect(quarantineRequest(folders, name, sent.id, 'disabled', null).ok).toBe(true);
    expect(foldersHolding(folders, name)).toEqual(['quarantine']);
    expect(readQuarantineReasons(folders)).toMatchObject([{ requestId: sent.id, reason: 'disabled' }]);
    expect(finishRequest(folders, name)).toMatchObject({ ok: false, reason: 'request-vanished' });
  });

  it('reads a file that is not a request as a refusal, never as a request', () => {
    const stateRoot = tempDir();
    const folders = queueFolders(stateRoot, IDENTITY);
    writeFileSync(join(folders.claimed, 'junk.json'), '{not json');
    expect(readClaimed(folders, 'junk.json')).toMatchObject({ ok: false, reason: 'request-invalid' });
    expect(readFileSync(join(folders.claimed, 'junk.json'), 'utf8')).toBe('{not json');
  });
});
