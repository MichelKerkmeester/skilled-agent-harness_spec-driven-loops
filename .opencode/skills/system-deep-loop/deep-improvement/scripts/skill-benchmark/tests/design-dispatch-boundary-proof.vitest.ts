import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const FIXTURES = join(SKILL_ROOT, 'assets', 'skill-benchmark', 'fixtures');

const { routeSkillResources } = require(join(SB, 'router-replay.cjs'));
const {
  checkDesignDispatchBoundaryParity,
  digestFile,
  lintDesignBoundaryProof,
} = require(join(SB, 'design-dispatch-boundary-proof.cjs'));

// The canonical DESIGN_BOUNDARY_PROOF asset used to live in a sk-design hub that
// has since been retired, taking the asset and the interface mode with it. The
// checker outlives it because what it guards is envelope shape and copy-set
// parity, not one skill's tree — so the canonical asset is materialized here.
// Building it in the test also keeps the contract markers the checker requires
// visible next to the assertions that depend on them.
const CANONICAL_ASSET = [
  '# Design dispatch boundary',
  '',
  'A child dispatch must carry a DESIGN_BOUNDARY_PROOF v1 envelope with:',
  '',
  '- `version` — the envelope version, always 1.',
  '- `routedMode` — the ROUTED declaration plus expected and observed workflow mode.',
  '- `payloadDigests` — the context manifest, dispatch manifest, and proof-of-application card digests.',
  '- `designProofTokenRef` — the nonce and run id of the design proof token it rides on.',
  '- `assetDigest` — the digest of this asset.',
  '',
  'Current copy set: canonical-only.',
  '',
].join('\n');

const INTERFACE_SKILL = [
  '---',
  'name: design-interface',
  '---',
  '',
  '# Design interface',
  '',
  'Dispatch criteria require a DESIGN_BOUNDARY_PROOF v1 envelope; see',
  '../shared/design-dispatch-boundary.md for the field contract.',
  '',
].join('\n');

const tempRoots: string[] = [];
let SKILL_TREE = '';
let CANONICAL_PATH = '';
let CANONICAL_DIGEST = '';

// A skill tree shaped like the one the checker expects: the canonical asset under
// shared/, referenced from the interface mode's dispatch criteria.
function makeBoundarySkill(): string {
  const root = mkdtempSync(join(tmpdir(), 'design-boundary-'));
  tempRoots.push(root);
  mkdirSync(join(root, 'shared'), { recursive: true });
  mkdirSync(join(root, 'design-interface'), { recursive: true });
  writeFileSync(join(root, 'shared', 'design-dispatch-boundary.md'), CANONICAL_ASSET);
  writeFileSync(join(root, 'design-interface', 'SKILL.md'), INTERFACE_SKILL);
  return root;
}

function readJson(filePath: string): any {
  return JSON.parse(readFileSync(filePath, 'utf8'));
}

function loadPair(id: string): { publicFixture: any; privateFixture: any } {
  const dir = join(FIXTURES, 'sk-design-dispatch');
  return {
    publicFixture: readJson(join(dir, `${id}.public.json`)),
    privateFixture: readJson(join(dir, `${id}.private.json`)),
  };
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// The frozen fixtures record the digest of the asset as it stood when they were
// minted. Rebinding the clone to the live canonical digest keeps the fixture file
// untouched as dated evidence while letting the digest-match branch be exercised.
function bindAssetDigest(publicFixture: any, digest: string): any {
  const clone = cloneJson(publicFixture);
  const proof = clone?.public?.dispatchPayload?.designBoundaryProof;
  if (proof) proof.assetDigest = digest;
  return clone;
}

function findingCodes(result: any): string[] {
  return result.findings.map((finding: any) => finding.code);
}

function lintFixture(publicFixture: any, privateFixture: any): any {
  return lintDesignBoundaryProof(publicFixture, {
    expectedWorkflowMode: privateFixture.expected.workflowMode,
    expectedAssetDigest: CANONICAL_DIGEST,
  });
}

beforeAll(() => {
  SKILL_TREE = makeBoundarySkill();
  CANONICAL_PATH = join(SKILL_TREE, 'shared', 'design-dispatch-boundary.md');
  CANONICAL_DIGEST = digestFile(CANONICAL_PATH);
});

afterAll(() => {
  for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
});

describe('design boundary proof lint — dispatch fixtures', () => {
  it('accepts a faithful boundary envelope bound to the route-gold workflow mode', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const lint = lintFixture(bindAssetDigest(publicFixture, CANONICAL_DIGEST), privateFixture);
    expect(lint.verdict).toBe(privateFixture.expected.boundaryProof.verdict);
    expect(lint.findings).toEqual([]);
  });

  it('fails closed when the boundary envelope is absent', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-missing-001');

    const lint = lintFixture(publicFixture, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('missing-boundary-proof');
  });

  it('fails closed when the envelope version is not v1', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const mutated = bindAssetDigest(publicFixture, CANONICAL_DIGEST);
    mutated.public.dispatchPayload.designBoundaryProof.version = 2;

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('unsupported-version');
  });

  it('fails closed when the routed mode does not match route-gold', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const mutated = bindAssetDigest(publicFixture, CANONICAL_DIGEST);
    mutated.public.dispatchPayload.designBoundaryProof.routedMode.observedWorkflowMode = 'motion';
    mutated.public.dispatchPayload.designBoundaryProof.routedMode.observedIntents = ['motion'];

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('routed-mode-mismatch');
  });

  it('fails closed when a required digest is malformed', () => {
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const mutated = bindAssetDigest(publicFixture, CANONICAL_DIGEST);
    mutated.public.dispatchPayload.designBoundaryProof.payloadDigests.contextManifestDigest = 'sha256:not-a-digest';

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('malformed-digest');
  });

  it('fails closed when the envelope is bound to a different asset revision', () => {
    // The binding that stops an envelope minted against an older contract from
    // being replayed against the current one.
    const { publicFixture, privateFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const stale = bindAssetDigest(publicFixture, `sha256:${'0'.repeat(64)}`);

    const lint = lintFixture(stale, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('asset-digest-mismatch');
  });
});

describe('design boundary proof parity — canonical asset and declared copies', () => {
  it('passes the canonical-only copy-set guard', () => {
    const result = checkDesignDispatchBoundaryParity({ skillRoot: SKILL_TREE });

    expect(result.verdict).toBe('valid');
    expect(result.copySetDecision).toBe('canonical-only');
    expect(result.driftDetected).toBe(false);
    expect(result.findings).toEqual([]);
  });

  it('detects drift and missing files in a declared copy set', () => {
    const root = makeBoundarySkill();

    const canonical = join(root, 'shared', 'design-dispatch-boundary.md');
    const copyPath = join(root, 'declared-copy.md');
    writeFileSync(copyPath, readFileSync(canonical, 'utf8'));

    const identical = checkDesignDispatchBoundaryParity({ skillRoot: root, copies: ['declared-copy.md'] });
    expect(identical.verdict).toBe('valid');
    expect(identical.copies[0].matchesCanonical).toBe(true);

    writeFileSync(copyPath, `${readFileSync(canonical, 'utf8')}\nDrift.\n`);
    const drifted = checkDesignDispatchBoundaryParity({ skillRoot: root, copies: ['declared-copy.md'] });
    expect(drifted.verdict).toBe('rejected');
    expect(findingCodes(drifted)).toContain('asset-copy-drift');

    const missing = checkDesignDispatchBoundaryParity({ skillRoot: root, copies: ['missing-copy.md'] });
    expect(missing.verdict).toBe('rejected');
    expect(findingCodes(missing)).toContain('missing-copy');
  });

  it('fails closed when the canonical asset is absent from the skill tree', () => {
    // The live sk-design tree no longer carries the asset at all; the checker must
    // say so rather than report a clean canonical-only copy set.
    const empty = mkdtempSync(join(tmpdir(), 'design-boundary-empty-'));
    tempRoots.push(empty);

    const result = checkDesignDispatchBoundaryParity({ skillRoot: empty });
    expect(result.verdict).toBe('rejected');
    expect(result.copySetDecision).toBe('unreadable-canonical');
    expect(findingCodes(result)).toContain('unparseable-input');
  });
});

describe('design boundary proof — retired sk-design hub', () => {
  it('no longer hub-routes the dispatch prompts the fixtures were minted against', () => {
    // sk-design is a standalone skill now, so the dispatch fixtures are frozen
    // evidence rather than a live route expectation. This pins the retirement so a
    // sk-design that silently regains hub routing forces them to be revisited.
    const skdesign = resolve(SKILL_ROOT, '..', '..', 'sk-design');
    const { publicFixture } = loadPair('sk-design-dispatch-boundary-present-001');
    const route = routeSkillResources({ skillRoot: skdesign, taskText: publicFixture.public.prompt });

    expect(route.parseable).toBe(true);
    expect(route.intents).toEqual([]);
    expect(route.routeTelemetry).toMatchObject({ observed: false, reason: 'no-hub-router' });
  });
});
