// ───────────────────────────────────────────────────────────────────
// MODULE: Save Continuity Write
// ───────────────────────────────────────────────────────────────────
// Drives the real save (main() through the workflow) against a throwaway
// workspace, so the continuity write, the parent routing, the pointer walk and
// the write order are checked together, the way /speckit:save runs them.

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

// The pointer store lives in a directory resolved once at module load, so it is
// redirected before any spec-kit module is imported, keeping the fixture's
// pointers out of the real store and the real store's out of the fixture.
const ORIGINAL_DB_DIR = process.env.SPEC_KIT_DB_DIR;
const STORE_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'save-continuity-store-'));
process.env.SPEC_KIT_DB_DIR = STORE_DIR;

const TRACK = 'specs/system-speckit';
const PARENT = `${TRACK}/100-parent`;
const MID = `${PARENT}/001-mid`;
const LEAF = `${MID}/001-leaf`;
const OTHER = `${PARENT}/002-other`;
const FLAT_PARENT = 'specs/200-flat';
const FLAT_CHILD = `${FLAT_PARENT}/001-child`;

let root = '';
let stderr = '';

function packetId(relativeFolder: string): string {
  return relativeFolder.replace(/^specs\//, '');
}

function graphMetadata(relativeFolder: string, lastActiveChildId: string | null = null): string {
  const id = packetId(relativeFolder);
  return `${JSON.stringify({
    schema_version: 1,
    packet_id: id,
    spec_folder: id,
    parent_id: null,
    children_ids: [],
    manual: { depends_on: [], supersedes: [], related_to: [] },
    derived: {
      trigger_phrases: [],
      key_topics: [],
      importance_tier: 'normal',
      status: 'in_progress',
      key_files: [],
      entities: [],
      causal_summary: '',
      created_at: '2026-09-01T00:00:00.000Z',
      last_save_at: '2026-09-01T00:00:00.000Z',
      last_accessed_at: null,
      source_docs: [],
      last_active_child_id: lastActiveChildId,
      last_active_at: lastActiveChildId ? '2026-09-01T00:00:00.000Z' : null,
    },
  }, null, 2)}\n`;
}

function specDoc(title: string, status = 'In Progress'): string {
  return [
    '---',
    `title: "${title}"`,
    `description: "${title} fixture packet."`,
    '---',
    `# ${title}`,
    '',
    '| Field | Value |',
    '|-------|-------|',
    `| **Status** | ${status} |`,
    '',
  ].join('\n');
}

// A hand-written block: completion_pct and the blocker validate and must survive a
// save that does not replace them; the prose answer fails and must be dropped.
function summaryDoc(relativeFolder: string, fingerprint = `sha256:${'0'.repeat(64)}`): string {
  return [
    '---',
    'title: "Implementation Summary"',
    'trigger_phrases: ["fixture summary phrase", "second fixture phrase"]',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${packetId(relativeFolder)}"`,
    '    last_updated_at: "2026-09-01T00:00:00Z"',
    '    last_updated_by: "tester"',
    '    recent_action: "Started the fixture work"',
    '    next_safe_action: "Continue the fixture work"',
    '    blockers:',
    '      - "Waiting on fixture review"',
    '    key_files: []',
    '    session_dedup:',
    `      fingerprint: "${fingerprint}"`,
    '      session_id: "fixture-session"',
    '      parent_session_id: null',
    '    completion_pct: 40',
    '    open_questions: []',
    '    answered_questions:',
    '      - "A prose answer the validator rejects"',
    '---',
    '',
    '# Implementation Summary',
    '',
    'Fixture body that a save must leave alone.',
    '',
  ].join('\n');
}

// A research record keeps its continuity block in spec.md and never gets an
// implementation summary.
function researchSpecDoc(relativeFolder: string): string {
  return [
    '---',
    'title: "Research Record: Fixture"',
    '_memory:',
    '  continuity:',
    `    packet_pointer: "${packetId(relativeFolder)}"`,
    '    last_updated_at: "2026-09-01T00:00:00Z"',
    '    last_updated_by: "tester"',
    '    recent_action: "Initialize continuity block"',
    '    next_safe_action: "Replace template defaults on first save"',
    '    blockers: []',
    '    key_files: []',
    '    session_dedup:',
    `      fingerprint: "sha256:${'0'.repeat(64)}"`,
    '      session_id: "fixture-research"',
    '      parent_session_id: null',
    '    completion_pct: 0',
    '    open_questions: []',
    '    answered_questions: []',
    '---',
    '# Research Record: Fixture',
    '',
    '<!-- SPECKIT_LEVEL: research -->',
    '',
    '| Field | Value |',
    '|-------|-------|',
    '| **Status** | In Progress |',
    '',
  ].join('\n');
}

function writeFile(relativePath: string, content: string): void {
  const absolute = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, content, 'utf8');
}

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

function pointer(relativeFolder: string): string | null {
  const metadata = JSON.parse(read(`${relativeFolder}/graph-metadata.json`)) as {
    derived: { last_active_child_id?: string | null };
  };
  return metadata.derived.last_active_child_id ?? null;
}

function buildWorkspace(): string {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'save-continuity-write-'));
  root = workspace;
  // The graph writer only writes inside a workspace anchored on a real .opencode directory.
  fs.mkdirSync(path.join(workspace, '.opencode'));
  writeFile('specs/graph-metadata.json', graphMetadata('specs/root'));
  writeFile(`${TRACK}/graph-metadata.json`, graphMetadata(TRACK));
  writeFile(`${PARENT}/spec.md`, specDoc('Parent'));
  writeFile(`${PARENT}/graph-metadata.json`, graphMetadata(PARENT));
  writeFile(`${MID}/spec.md`, specDoc('Mid'));
  writeFile(`${MID}/graph-metadata.json`, graphMetadata(MID));
  writeFile(`${LEAF}/spec.md`, specDoc('Leaf'));
  writeFile(`${LEAF}/implementation-summary.md`, summaryDoc(LEAF));
  writeFile(`${LEAF}/graph-metadata.json`, graphMetadata(LEAF));
  writeFile(`${OTHER}/spec.md`, specDoc('Other'));
  writeFile(`${OTHER}/implementation-summary.md`, summaryDoc(OTHER));
  writeFile(`${OTHER}/graph-metadata.json`, graphMetadata(OTHER));
  writeFile(`${FLAT_PARENT}/spec.md`, specDoc('Flat parent'));
  writeFile(`${FLAT_PARENT}/graph-metadata.json`, graphMetadata(FLAT_PARENT));
  writeFile(`${FLAT_CHILD}/spec.md`, specDoc('Flat child'));
  writeFile(`${FLAT_CHILD}/implementation-summary.md`, summaryDoc(FLAT_CHILD));
  writeFile(`${FLAT_CHILD}/graph-metadata.json`, graphMetadata(FLAT_CHILD));
  return workspace;
}

async function save(
  target: string,
  payload: Record<string, unknown>,
  fullAuto = true,
  extraArgs: string[] = [],
): Promise<void> {
  const { main } = await import('../continuity/generate-context');
  const argv = ['--json', JSON.stringify({
    specFolder: target,
    // The workflow refuses a save with too little semantic substance, so the
    // fixture carries a summary long enough to clear that gate.
    sessionSummary: 'Exercised the continuity writer against a nested fixture packet. '
      + 'The save routed its continuity block through the phase parent into the leaf, '
      + 'merged payload fields over stored ones, pointed every ancestor back toward the leaf, '
      + 'and stamped the completion fingerprint before refreshing graph metadata.',
    keyDecisions: ['Payload paths inside a child outrank a stale parent pointer'],
    ...payload,
  }), target];
  if (fullAuto) {
    argv.push('--full-auto');
  }
  argv.push(...extraArgs);
  await main(argv, undefined, root);
}

function continuityBlock(markdown: string): string {
  const start = markdown.indexOf('_memory:');
  return markdown.slice(start, markdown.indexOf('\n---', start));
}

beforeAll(() => {
  vi.spyOn(process, 'exit').mockImplementation(((code?: string | number | null) => {
    throw new Error(`EXIT:${code ?? 0}`);
  }) as never);
});

beforeEach(() => {
  buildWorkspace();
  fs.rmSync(path.join(STORE_DIR, 'access-telemetry.json'), { force: true });
  stderr = '';
  vi.spyOn(process.stderr, 'write').mockImplementation(((chunk: string | Uint8Array) => {
    stderr += typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8');
    return true;
  }) as never);
  vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
    stderr += `${args.map(String).join(' ')}\n`;
  });
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  vi.spyOn(console, 'log').mockImplementation(() => undefined);
});

afterEach(async () => {
  vi.mocked(process.stderr.write).mockRestore();
  vi.mocked(console.error).mockRestore();
  vi.mocked(console.warn).mockRestore();
  vi.mocked(console.log).mockRestore();
  const { CONFIG } = await import('../core');
  CONFIG.DATA_FILE = null;
  CONFIG.SPEC_FOLDER_ARG = null;
  fs.rmSync(root, { recursive: true, force: true });
});

afterAll(() => {
  vi.restoreAllMocks();
  fs.rmSync(STORE_DIR, { recursive: true, force: true });
  if (ORIGINAL_DB_DIR === undefined) {
    delete process.env.SPEC_KIT_DB_DIR;
  } else {
    process.env.SPEC_KIT_DB_DIR = ORIGINAL_DB_DIR;
  }
});

describe('save writer continuity write', () => {
  it('writes the payload fields into the leaf and keeps valid stored fields', async () => {
    await save(LEAF, {
      recent_action: 'Wired the continuity writer',
      nextSafeAction: 'Verify the nested fixture',
      key_files: [`${LEAF}/spec.md`],
      open_questions: ['Q2'],
    });

    const block = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    expect(block).toContain('recent_action: "Wired the continuity writer"');
    expect(block).toContain('next_safe_action: "Verify the nested fixture"');
    expect(block).toContain('last_updated_by: "generate-context"');
    expect(block).toContain(`packet_pointer: "${packetId(LEAF)}"`);
    expect(block).toContain('- "Q2"');
    // Left out of the payload and valid, so carried over from the stored block.
    expect(block).toContain('- "Waiting on fixture review"');
    expect(block).toContain('completion_pct: 40');
  });

  it('drops a stored field that fails validation and names it', async () => {
    await save(LEAF, { recent_action: 'Wired the continuity writer' });

    const summary = read(`${LEAF}/implementation-summary.md`);
    expect(continuityBlock(summary)).not.toContain('A prose answer');
    expect(stderr).toContain('Dropped stored continuity fields that fail validation: answered_questions');
  });

  it('leaves every frontmatter line outside the continuity block and the body untouched', async () => {
    const before = read(`${LEAF}/implementation-summary.md`);
    await save(LEAF, { recent_action: 'Wired the continuity writer' });
    const after = read(`${LEAF}/implementation-summary.md`);

    expect(after).toContain('trigger_phrases: ["fixture summary phrase", "second fixture phrase"]');
    expect(after.slice(after.indexOf('\n---\n', 4))).toBe(before.slice(before.indexOf('\n---\n', 4)));
  });

  it('fails the save and writes nothing when a payload value is rejected', async () => {
    const summaryBefore = read(`${LEAF}/implementation-summary.md`);
    const graphBefore = read(`${LEAF}/graph-metadata.json`);

    await expect(save(LEAF, { recent_action: 'x'.repeat(120) })).rejects.toThrow('EXIT:1');

    expect(read(`${LEAF}/implementation-summary.md`)).toBe(summaryBefore);
    expect(read(`${LEAF}/graph-metadata.json`)).toBe(graphBefore);
    expect(fs.existsSync(path.join(root, LEAF, 'description.json'))).toBe(false);
  });

  it('writes no continuity without continuity fields or outside --full-auto', async () => {
    const before = continuityBlock(read(`${LEAF}/implementation-summary.md`));

    await save(LEAF, {});
    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toBe(before);

    await save(LEAF, { recent_action: 'Ignored in plan-only mode' }, false);
    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toBe(before);
  });

  it('copies the nearest authored purpose into the leaf a parent-targeted save reaches', async () => {
    writeFile(`${PARENT}/spec.md`, `${specDoc('Parent')}\n### Purpose\nKeep the fixture purpose in view. This sentence is dropped.\n`);
    await save(PARENT, { recent_action: 'Wired the continuity writer', key_files: [`${LEAF}/spec.md`] });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toContain(
      `packet_purpose: "Parent purpose (${PARENT}): Keep the fixture purpose in view."`,
    );
  });

  it('removes a stored purpose copy once no purpose is authored', async () => {
    writeFile(
      `${LEAF}/implementation-summary.md`,
      summaryDoc(LEAF).replace('    blockers:', '    packet_purpose: "Purpose: A purpose the spec no longer holds."\n    blockers:'),
    );
    await save(LEAF, { recent_action: 'Wired the continuity writer' });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).not.toContain('packet_purpose');
  });

  it('stores the track root pointer only in the store, and resume lands on the leaf', async () => {
    const trackGraphBefore = fs.readFileSync(path.join(root, `${TRACK}/graph-metadata.json`));
    await save(LEAF, { recent_action: 'Wired the continuity writer' });

    expect(pointer(MID)).toBe(packetId(LEAF));
    expect(pointer(PARENT)).toBe(packetId(MID));
    expect(fs.readFileSync(path.join(root, `${TRACK}/graph-metadata.json`))).toEqual(trackGraphBefore);
    const { resolveLastActiveChildFromStore } = await import('@spec-kit/runtime/api');
    expect(resolveLastActiveChildFromStore(packetId(TRACK))).toBe(packetId(PARENT));

    const { followPhaseParentRedirect } = await import('../../lib/resume/resume-ladder');
    const landed = followPhaseParentRedirect(
      path.join(root, PARENT),
      packetId(PARENT),
      [],
      path.join(STORE_DIR, 'access-telemetry.json'),
    );
    expect(landed.folderPath).toBe(path.join(root, LEAF));
  });

  it('routes a parent-targeted save by payload paths even when a valid pointer names another child', async () => {
    writeFile(`${PARENT}/graph-metadata.json`, graphMetadata(PARENT, packetId(OTHER)));
    const otherBefore = read(`${OTHER}/implementation-summary.md`);

    await save(PARENT, {
      recent_action: 'Routed by payload paths',
      filesModified: [`${LEAF}/spec.md`, '.skilled/skills/example/outside-the-tree.ts'],
    });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toContain('Routed by payload paths');
    expect(read(`${OTHER}/implementation-summary.md`)).toBe(otherBefore);
    expect(pointer(PARENT)).toBe(packetId(MID));
    expect(pointer(MID)).toBe(packetId(LEAF));
  });

  it('routes a parent-targeted save down the pointer chain when no payload path lies inside the tree', async () => {
    writeFile(`${PARENT}/graph-metadata.json`, graphMetadata(PARENT, packetId(MID)));
    writeFile(`${MID}/graph-metadata.json`, graphMetadata(MID, packetId(LEAF)));

    await save(PARENT, {
      recent_action: 'Routed by the pointer chain',
      filesModified: ['.skilled/skills/example/outside-the-tree.ts'],
    });

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toContain('Routed by the pointer chain');
    expect(read(`${LEAF}/graph-metadata.json`)).not.toBe(graphMetadata(LEAF));
  });

  it('writes nothing and names the candidates when payload paths span two children', async () => {
    writeFile(`${PARENT}/graph-metadata.json`, graphMetadata(PARENT, packetId(OTHER)));
    const pointersBefore = [PARENT, MID, TRACK].map((folder) => read(`${folder}/graph-metadata.json`));
    const leafBefore = read(`${LEAF}/implementation-summary.md`);
    const otherBefore = read(`${OTHER}/implementation-summary.md`);

    await save(PARENT, {
      recent_action: 'Ambiguous parent save',
      filesModified: [`${LEAF}/spec.md`, `${OTHER}/spec.md`],
    });

    expect(read(`${LEAF}/implementation-summary.md`)).toBe(leafBefore);
    expect(read(`${OTHER}/implementation-summary.md`)).toBe(otherBefore);
    expect(stderr).toContain('Continuity not written: payload paths name more than one child');
    expect(stderr).toContain(MID);
    expect(stderr).toContain(OTHER);
    expect(pointer(PARENT)).toBe(packetId(OTHER));
    expect(read(`${MID}/graph-metadata.json`)).toBe(pointersBefore[1]);
    expect(read(`${TRACK}/graph-metadata.json`)).toBe(pointersBefore[2]);
  });

  // With no payload path to go on, the pointer alone decides where the write lands,
  // so a pointer that no longer names a child packet inside the parent must route nowhere.
  it.each([
    ['names a child that no longer exists', `${packetId(PARENT)}/003-removed`],
    ['climbs out of the parent', `${packetId(PARENT)}/../../200-flat/001-child`],
    ['is not shaped like a child', 'Not A Child'],
  ])('writes nothing when the only pointer %s', async (_label, badPointer) => {
    writeFile(`${PARENT}/graph-metadata.json`, graphMetadata(PARENT, badPointer));
    const summaries = [LEAF, OTHER, FLAT_CHILD].map((folder) => read(`${folder}/implementation-summary.md`));
    const pointersBefore = [MID, TRACK, FLAT_PARENT].map((folder) => read(`${folder}/graph-metadata.json`));

    await save(PARENT, {
      recent_action: 'Refused a pointer that routes nowhere',
      filesModified: ['.skilled/skills/example/outside-the-tree.ts'],
    });

    expect([LEAF, OTHER, FLAT_CHILD].map((folder) => read(`${folder}/implementation-summary.md`))).toEqual(summaries);
    expect([MID, TRACK, FLAT_PARENT].map((folder) => read(`${folder}/graph-metadata.json`))).toEqual(pointersBefore);
    expect(stderr).toContain('it has no usable pointer');
  });

  it('writes a research record continuity into its spec.md', async () => {
    const research = `${TRACK}/300-research`;
    writeFile(`${research}/spec.md`, researchSpecDoc(research));
    writeFile(`${research}/graph-metadata.json`, graphMetadata(research));

    await save(research, { recent_action: 'Closed the fixture research', next_safe_action: 'Verify the research findings' });

    const spec = read(`${research}/spec.md`);
    const block = continuityBlock(spec);
    expect(block).toContain('recent_action: "Closed the fixture research"');
    expect(block).toContain('next_safe_action: "Verify the research findings"');
    expect(block).not.toContain('Initialize continuity block');
    expect(spec).toContain('<!-- SPECKIT_LEVEL: research -->');
    expect(fs.existsSync(path.join(root, research, 'implementation-summary.md'))).toBe(false);
  });

  it('still writes no continuity into a non-research leaf without an implementation summary', async () => {
    const plain = `${TRACK}/301-plain`;
    writeFile(`${plain}/spec.md`, specDoc('Plain'));
    writeFile(`${plain}/graph-metadata.json`, graphMetadata(plain));
    const before = read(`${plain}/spec.md`);

    await save(plain, { recent_action: 'Refused without a summary' });

    expect(read(`${plain}/spec.md`)).toBe(before);
    expect(stderr).toContain('has no implementation-summary.md yet');
  });

  it('stops the pointer walk below the specs root', async () => {
    const rootMetadataBefore = read('specs/graph-metadata.json');

    await save(FLAT_CHILD, { recent_action: 'Saved a child of a root-level parent' });

    expect(pointer(FLAT_PARENT)).toBe(packetId(FLAT_CHILD));
    expect(read('specs/graph-metadata.json')).toBe(rootMetadataBefore);
  });

  it('stamps a completed leaf saved without continuity fields', async () => {
    writeFile(`${LEAF}/spec.md`, specDoc('Leaf', 'Complete'));

    await save(LEAF, {});

    const stamped = read(`${LEAF}/implementation-summary.md`).match(/fingerprint:\s*"(sha256:[a-f0-9]{64})"/)?.[1];
    expect(stamped).toBeDefined();
    expect(stamped).not.toBe(`sha256:${'0'.repeat(64)}`);
  });

  it('stamps a completed leaf before the graph refresh, so the graph fingerprint matches', async () => {
    writeFile(`${LEAF}/spec.md`, specDoc('Leaf', 'Complete'));

    await save(PARENT, {
      recent_action: 'Closed the fixture leaf',
      filesModified: [`${LEAF}/spec.md`],
    });

    const summary = read(`${LEAF}/implementation-summary.md`);
    const stamped = summary.match(/fingerprint:\s*"(sha256:[a-f0-9]{64})"/)?.[1];
    expect(stamped).toBeDefined();
    expect(stamped).not.toBe(`sha256:${'0'.repeat(64)}`);

    const { checkGeneratedMetadataIntegrity } = await import('../../api');
    const report = checkGeneratedMetadataIntegrity(path.join(root, LEAF));
    expect(report.violations.map((violation) => violation.code)).not.toContain('SOURCE_FINGERPRINT_MISMATCH');
  });
});

describe('save writer session_ref', () => {
  const SESSION_ID = 'session-abc-123';
  const RUNTIME = 'opencode';

  async function storedRef(folder: string): Promise<Record<string, unknown> | undefined> {
    const { readThinContinuityRecord } = await import('@spec-kit/runtime/api');
    return readThinContinuityRecord(read(`${folder}/implementation-summary.md`)).record?.session_ref as
      | Record<string, unknown>
      | undefined;
  }

  it('mints exactly the six pointer keys from the explicit inputs', async () => {
    await save(LEAF, { recent_action: 'Minted the session pointer' }, true, [
      '--session-id', SESSION_ID,
      '--runtime', RUNTIME,
    ]);

    const ref = await storedRef(LEAF);
    expect(Object.keys(ref ?? {}).sort()).toEqual([
      'locatorKind',
      'runtime',
      'savedAt',
      'sessionId',
      'version',
      'workspace',
    ]);
    expect(ref).toMatchObject({
      runtime: RUNTIME,
      sessionId: SESSION_ID,
      locatorKind: 'session-store',
      version: 1,
    });
    expect(fs.realpathSync(String(ref?.workspace))).toBe(fs.realpathSync(root));
  });

  it.each([
    ['claude', 'transcript_path'],
    ['devin', 'transcript_file'],
    ['pi', 'live_branch_or_session_log'],
    ['dsh', 'session_log'],
  ])('mints the canonical %s locator kind directly', async (runtime, locatorKind) => {
    await save(LEAF, { recent_action: 'Minted a runtime-specific pointer' }, true, [
      '--session-id', SESSION_ID,
      '--runtime', runtime,
    ]);

    expect(await storedRef(LEAF)).toMatchObject({
      runtime,
      sessionId: SESSION_ID,
      locatorKind,
      version: 1,
    });
  });

  it('carries the stored pointer on a later save that cannot mint a new one', async () => {
    await save(LEAF, { recent_action: 'Minted the session pointer' }, true, [
      '--session-id', SESSION_ID,
      '--runtime', RUNTIME,
    ]);
    const minted = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    const savedAt = /savedAt: "([^"]+)"/.exec(minted)?.[1];
    expect(savedAt).toBeTruthy();

    await save(LEAF, { recent_action: 'Second save without the pointer inputs' });

    const carried = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    expect(carried).toContain(`sessionId: "${SESSION_ID}"`);
    expect(carried).toContain('recent_action: "Second save without the pointer inputs"');
    expect(carried).toContain(`savedAt: "${savedAt}"`);
  });

  it.each([
    ['plan-only', false, [] as string[]],
    ['hybrid', false, ['--planner-mode', 'hybrid']],
  ])('writes no pointer on a %s save', async (_label, fullAuto, extraArgs) => {
    const before = continuityBlock(read(`${LEAF}/implementation-summary.md`));

    await save(
      LEAF,
      { recent_action: 'No pointer on this save' },
      fullAuto,
      ['--session-id', SESSION_ID, '--runtime', RUNTIME, ...extraArgs],
    );

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).toBe(before);
  });

  it('omits the pointer and names the reason when --runtime is given without --session-id', async () => {
    await save(LEAF, { recent_action: 'No explicit session id' }, true, ['--runtime', RUNTIME]);

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).not.toContain('session_ref:');
    expect(stderr).toContain('session_ref skipped: no explicit --session-id supplied');
  });

  it('omits the pointer and names the reason when the session id fails the continuity shape', async () => {
    await save(LEAF, { recent_action: 'Skipped a session id the validator would reject' }, true, [
      '--session-id', 'session/abc',
      '--runtime', 'claude',
    ]);

    const block = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    expect(block).toContain('recent_action: "Skipped a session id the validator would reject"');
    expect(block).not.toContain('session_ref:');
    expect(stderr).toContain('session_ref skipped: session id does not match the continuity shape');
  });

  it('omits the pointer for a known runtime without a locator', async () => {
    await save(LEAF, { recent_action: 'Cursor has no locator' }, true, [
      '--session-id', SESSION_ID,
      '--runtime', 'cursor',
    ]);

    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).not.toContain('session_ref:');
    expect(stderr).toContain('session_ref skipped');
    expect(stderr).toContain('no supported locator');
  });

  it('ignores a payload-supplied pointer, names it and mints its own', async () => {
    const payloadRef = {
      runtime: 'claude',
      sessionId: 'payload-session-999',
      workspace: '/payload/workspace',
      savedAt: '2020-01-01T00:00:00Z',
      locatorKind: 'transcript_path',
      version: 1,
    };

    await save(
      LEAF,
      { recent_action: 'Ignored the payload pointer', session_ref: payloadRef },
      true,
      ['--session-id', SESSION_ID, '--runtime', RUNTIME],
    );

    const block = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    expect(block).toContain(`sessionId: "${SESSION_ID}"`);
    expect(block).not.toContain('payload-session-999');
    expect(stderr).toContain('Ignoring payload-supplied session_ref');
  });

  it('never writes a payload-supplied pointer when the writer cannot mint one', async () => {
    const payloadRef = {
      runtime: 'claude',
      sessionId: 'payload-session-999',
      workspace: '/payload/workspace',
      savedAt: '2020-01-01T00:00:00Z',
      locatorKind: 'transcript_path',
      version: 1,
    };

    await save(LEAF, { recent_action: 'Ignored the payload pointer', session_ref: payloadRef });

    const block = continuityBlock(read(`${LEAF}/implementation-summary.md`));
    expect(block).not.toContain('session_ref:');
    expect(block).not.toContain('payload-session-999');
  });

  it('drops a stored pointer that fails validation and names the field', async () => {
    const malformed = summaryDoc(LEAF).replace(
      '    completion_pct: 40',
      [
        '    session_ref:',
        '      runtime: "opencode"',
        '      sessionId: "bad-session"',
        '      workspace: "/tmp/another-checkout"',
        '      savedAt: "2026-09-01T00:00:00Z"',
        '      locatorKind: "transcript"',
        '      version: 2',
        '    completion_pct: 40',
      ].join('\n'),
    );
    writeFile(`${LEAF}/implementation-summary.md`, malformed);

    await save(LEAF, { recent_action: 'Dropped the malformed pointer' });

    expect(stderr).toContain('Dropped stored continuity fields that fail validation');
    expect(stderr).toContain('session_ref');
    expect(continuityBlock(read(`${LEAF}/implementation-summary.md`))).not.toContain('session_ref:');
  });
});

describe('save writer operator decisions', () => {
  // One confirmed operator answer, shaped the way the decision-capture queue hands
  // it to the save payload.
  const decision = {
    sourceKey: 'claude:s1:toolu_a:0',
    decided: 'Use the blue badge.',
    carriedBy: 'REQ-001',
    question: 'Which colour should the badge use?',
    options: ['Blue', 'Green'],
    answer: 'Blue',
  };

  // The writer keeps its state per project, and still reads the root-level log
  // left behind by earlier versions, so reading the project path is the only way
  // this assertion can tell a fresh key from an inherited one.
  async function consumedKeys(): Promise<string> {
    const { consumedLogPath } = await import('../../api');
    const absolute = consumedLogPath(root);
    return fs.existsSync(absolute) ? fs.readFileSync(absolute, 'utf8') : '';
  }

  function hasRecord(relativeFolder: string): boolean {
    return fs.existsSync(path.join(root, relativeFolder, 'decision-record.md'));
  }

  it('writes the decision into the leaf record and consumes its key', async () => {
    await save(LEAF, { operatorDecisions: [decision] });

    const record = read(`${LEAF}/decision-record.md`);
    expect(record).toContain('| Q001 | Use the blue badge. | Not stated. | None | REQ-001 |');
    expect(record).toContain('<!-- source: claude:s1:toolu_a:0 -->');
    expect(await consumedKeys()).toContain('claude:s1:toolu_a:0');
  });

  it('writes operator decisions from a save that carries little else', async () => {
    // A runtime whose save payload holds only a one-line summary and the swept
    // answers must still record them: the answers are the session's evidence.
    const answers = [
      decision,
      {
        sourceKey: 'codex:s1:call_b:0',
        decided: 'The badge supports Web, iOS and Android.',
        carriedBy: 'REQ-002',
        question: 'Which platforms must the badge support?',
        options: ['Web', 'iOS', 'Android'],
        answer: 'Web, iOS, Android',
      },
      {
        sourceKey: 'codex:s1:call_c:0',
        decided: 'The badge label reads Needs review.',
        carriedBy: 'REQ-003',
        question: 'What should the badge label say?',
        options: ['Pending', 'Needs review'],
        answer: 'Needs review',
      },
      {
        sourceKey: 'codex:s1:chat:1',
        decided: 'The badge stays static and does not blink.',
        carriedBy: 'REQ-004',
        question: 'Should the badge blink?',
        options: [],
        answer: 'No, keep it static.',
      },
    ];

    await save(LEAF, { sessionSummary: 'Recorded the badge answers.', keyDecisions: [], operatorDecisions: answers });

    const record = read(`${LEAF}/decision-record.md`);
    expect(record).toContain('| Q001 | Use the blue badge.');
    expect(record).toContain('| Q002 | The badge supports Web, iOS and Android.');
    expect(record).toContain('| Q004 | The badge stays static and does not blink.');
  });

  it('leaves the record byte-identical when the same save runs twice', async () => {
    await save(LEAF, { operatorDecisions: [decision] });
    const first = read(`${LEAF}/decision-record.md`);

    await save(LEAF, { operatorDecisions: [decision] });

    expect(read(`${LEAF}/decision-record.md`)).toBe(first);
  });

  it('lists the entries and writes nothing outside --full-auto', async () => {
    await save(LEAF, { operatorDecisions: [decision] }, false);

    expect(hasRecord(LEAF)).toBe(false);
    expect(await consumedKeys()).toBe('');
  });

  it('writes a cross-phase decision to the phase parent', async () => {
    await save(PARENT, { operatorDecisions: [{ ...decision, scope: 'cross-phase' }] });

    expect(read(`${PARENT}/decision-record.md`)).toContain('Use the blue badge.');
    expect(hasRecord(LEAF)).toBe(false);
  });

  it('routes a local decision to the leaf the payload paths name', async () => {
    await save(PARENT, {
      operatorDecisions: [decision],
      filesModified: [`${LEAF}/spec.md`],
    });

    expect(read(`${LEAF}/decision-record.md`)).toContain('Use the blue badge.');
    expect(hasRecord(PARENT)).toBe(false);
  });

  it('writes nothing and leaves the key pending when the payload paths span two children', async () => {
    await save(PARENT, {
      operatorDecisions: [decision],
      filesModified: [`${LEAF}/spec.md`, `${OTHER}/spec.md`],
    });

    expect(hasRecord(PARENT)).toBe(false);
    expect(hasRecord(LEAF)).toBe(false);
    expect(hasRecord(OTHER)).toBe(false);
    expect(await consumedKeys()).not.toContain('claude:s1:toolu_a:0');
  });

  it('fails the save and writes no record when a decision has no decided statement', async () => {
    const { decided: _decided, ...incomplete } = decision;

    await expect(save(LEAF, { operatorDecisions: [incomplete] })).rejects.toThrow();

    expect(hasRecord(LEAF)).toBe(false);
  });
});
