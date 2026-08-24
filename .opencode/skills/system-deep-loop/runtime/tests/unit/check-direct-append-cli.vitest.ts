// ───────────────────────────────────────────────────────────────────
// MODULE: Direct-Append Detection CLI Tests
// ───────────────────────────────────────────────────────────────────
//
// A guard that has only ever been shown a synthetic mismatch has never been
// shown to catch the thing it exists to catch. The "detects a real direct
// append" case therefore performs an actual appendFileSync onto the legacy
// file — re-running the real ledger byte stream through the real digest —
// rather than swapping a mocked digest into the watermark. The authority
// record is built with the runtime's own canonicalBytes/sha256Bytes so the
// CLI reads a genuinely valid record, which is what makes every pass/fail
// here a statement about the guard rather than about the fixture.

import { afterEach, describe, expect, it } from 'vitest';
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  appendFileSync,
  readFileSync,
  rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { canonicalBytes, sha256Bytes } from '../../lib/event-envelope/index.js';

const here = dirname(fileURLToPath(import.meta.url));
const CLI_PATH = resolve(here, '..', '..', 'scripts', 'check-direct-append.cjs');

const MODE = 'deep-review';
const ARTIFACT = 'review-state';
const WATERMARK_DIR = '.legacy-projection-watermarks';

const dirs: string[] = [];

afterEach(() => {
  while (dirs.length > 0) {
    const dir = dirs.pop();
    if (dir) rmSync(dir, { recursive: true, force: true });
  }
});

interface Fixture {
  artifactRoot: string;
  authRoot: string;
  legacyFile: string;
  watermarkFile: string;
}

function freshFixture(): Fixture {
  const dir = mkdtempSync(join(tmpdir(), 'direct-append-'));
  dirs.push(dir);
  const artifactRoot = join(dir, 'artifacts');
  const authRoot = join(dir, 'authority');
  mkdirSync(join(artifactRoot, WATERMARK_DIR), { recursive: true });
  mkdirSync(authRoot, { recursive: true });
  const legacyFile = join(artifactRoot, 'review-state.jsonl');
  const watermarkFile = join(artifactRoot, WATERMARK_DIR, `${ARTIFACT}.json`);
  return { artifactRoot, authRoot, legacyFile, watermarkFile };
}

function writeAuthority(authRoot: string, state: string): void {
  const core = {
    schemaVersion: 1,
    mode: MODE,
    state,
    epoch: 1,
    selectedWriter:
      state === 'new_authoritative_reversible' || state === 'new_authoritative_final'
        ? 'dark'
        : 'legacy',
    candidateSha: null,
    policyVersion: 0,
    cutoverCertificateDigest: null,
    lastTransitionDigest: null,
    updatedAt: new Date('2026-08-19T12:00:00Z').toISOString(),
  };
  const rec = { ...core, recordDigest: sha256Bytes(canonicalBytes(core)) };
  writeFileSync(join(authRoot, `authority-${MODE}.json`), JSON.stringify(rec, null, 2));
}

function publish(legacyFile: string, watermarkFile: string, content: string): void {
  writeFileSync(legacyFile, content);
  const bytes = readFileSync(legacyFile);
  writeFileSync(
    watermarkFile,
    JSON.stringify(
      {
        watermark_version: 1,
        artifact_id: ARTIFACT,
        ledger_id: 'l1',
        ledger_sequence: 3,
        ledger_record_hash: 'a'.repeat(64),
        projection_version: 1,
        reducer_version: 1,
        replay_fingerprint: 'b'.repeat(64),
        base_sha: 'c'.repeat(40),
        base_digest: 'd'.repeat(64),
        prior_ledger_sequence: null,
        prior_output_digest: null,
        output_digest: createHash('sha256').update(bytes).digest('hex'),
        output_byte_length: bytes.length,
        refreshed_at: '2026-08-19T12:00:00Z',
      },
      null,
      2,
    ),
  );
}

interface RunResult {
  exit: number | null;
  j: Record<string, unknown>;
}

function run(fx: Fixture): RunResult {
  const r = spawnSync(
    process.execPath,
    [
      CLI_PATH,
      '--mode',
      MODE,
      '--artifact-root',
      fx.artifactRoot,
      '--artifact-id',
      ARTIFACT,
      '--legacy-file',
      fx.legacyFile,
      '--authority-root',
      fx.authRoot,
    ],
    { encoding: 'utf8' },
  );
  const last = (r.stdout || '').trim().split(/\r?\n/).filter(Boolean).at(-1) ?? '{}';
  let j: Record<string, unknown> = {};
  try {
    j = JSON.parse(last) as Record<string, unknown>;
  } catch {
    j = { raw: last, stderr: r.stderr };
  }
  return { exit: r.status, j };
}

describe('check-direct-append CLI', () => {
  it('accepts a file the gateway published', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_reversible');
    const r = run(fx);
    expect(r.exit).toBe(0);
    expect(r.j.status).toBe('ok');
  });

  it('detects a real direct append', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_reversible');
    // Real append onto the legacy file — not a simulated digest swap.
    appendFileSync(fx.legacyFile, '{"iteration":2,"injected":"direct append"}\n');
    const r = run(fx);
    expect(r.exit).toBe(2);
    expect(r.j.status).toBe('violation');
  });

  it('names how far the file drifted', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_reversible');
    appendFileSync(fx.legacyFile, '{"iteration":2,"injected":"direct append"}\n');
    const r = run(fx);
    const namesDrift =
      typeof r.j.actualDigest === 'string' || /digest/i.test(JSON.stringify(r.j));
    expect(namesDrift).toBe(true);
  });

  it('stays inert while legacy is still the sanctioned writer', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    appendFileSync(fx.legacyFile, '{"iteration":2,"injected":"direct append"}\n');
    writeAuthority(fx.authRoot, 'legacy_authoritative');
    const r = run(fx);
    expect(r.exit).toBe(0);
    expect(r.j.status).toBe('not-enforced');
  });

  it('still enforces once the legacy shadow writer is dropped at finalize', () => {
    // Finalize routes every canonical write to the ledger and drops the legacy
    // shadow entirely, so an out-of-band append to the legacy file is a real
    // finding under the final state — the guard must not fall inert here.
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_final');
    appendFileSync(fx.legacyFile, '{"iteration":2,"injected":"direct append"}\n');
    const r = run(fx);
    expect(r.exit).toBe(2);
    expect(r.j.status).toBe('violation');
  });

  it('treats a missing watermark as a violation', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_reversible');
    rmSync(fx.watermarkFile, { force: true });
    const r = run(fx);
    expect(r.exit).toBe(2);
    expect(r.j.status).toBe('violation');
  });

  it('fails rather than passes when the authority record cannot be read', () => {
    const fx = freshFixture();
    publish(fx.legacyFile, fx.watermarkFile, '{"iteration":1}\n');
    writeAuthority(fx.authRoot, 'new_authoritative_reversible');
    writeFileSync(join(fx.authRoot, `authority-${MODE}.json`), '{ not json');
    const r = run(fx);
    expect(r.exit).toBe(1);
  });
});
