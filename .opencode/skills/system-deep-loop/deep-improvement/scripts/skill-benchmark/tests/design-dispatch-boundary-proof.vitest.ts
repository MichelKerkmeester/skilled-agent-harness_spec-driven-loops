import { afterAll, describe, expect, it } from 'vitest';
import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const SKILL_ROOT = resolve(__dirname, '..', '..', '..');
const REPO_SKILLS = resolve(SKILL_ROOT, '..', '..');
const SB = join(SKILL_ROOT, 'scripts', 'skill-benchmark');
const SKDESIGN = join(REPO_SKILLS, 'sk-design');
const FIXTURES = join(SKILL_ROOT, 'assets', 'skill_benchmark', 'fixtures');
const ASSET = join(SKDESIGN, 'shared', 'design-dispatch-boundary.md');

const { routeSkillResources } = require(join(SB, 'router-replay.cjs'));
const {
  checkDesignDispatchBoundaryParity,
  digestFile,
  lintDesignBoundaryProof,
} = require(join(SB, 'design-dispatch-boundary-proof.cjs'));

const tempRoots: string[] = [];

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

function findingCodes(result: any): string[] {
  return result.findings.map((finding: any) => finding.code);
}

function lintFixture(publicFixture: any, privateFixture: any): any {
  return lintDesignBoundaryProof(publicFixture, {
    expectedWorkflowMode: privateFixture.expected.workflowMode,
    expectedAssetDigest: digestFile(ASSET),
  });
}

function expectDesignRoute(publicFixture: any, privateFixture: any): void {
  const route = routeSkillResources({ skillRoot: SKDESIGN, taskText: publicFixture.public.prompt });
  expect(route.parseable).toBe(true);
  expect(route.intents).toContain(privateFixture.expected.workflowMode);
  expect(route.resources).toContain('design-interface/SKILL.md');
  expect(route.routeTelemetry.workflowMode).toContain(privateFixture.expected.workflowMode);
}

describe('design boundary proof lint — dispatch fixtures', () => {
  it('accepts a faithful boundary envelope bound to the route-gold workflow mode', () => {
    const { publicFixture, privateFixture } = loadPair('sk_design_dispatch_boundary_present_001');
    expectDesignRoute(publicFixture, privateFixture);

    const lint = lintFixture(publicFixture, privateFixture);
    expect(lint.verdict).toBe(privateFixture.expected.boundaryProof.verdict);
    expect(lint.findings).toEqual([]);
  });

  it('fails closed when the boundary envelope is absent', () => {
    const { publicFixture, privateFixture } = loadPair('sk_design_dispatch_boundary_missing_001');
    expectDesignRoute(publicFixture, privateFixture);

    const lint = lintFixture(publicFixture, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('missing-boundary-proof');
  });

  it('fails closed when the envelope version is not v1', () => {
    const { publicFixture, privateFixture } = loadPair('sk_design_dispatch_boundary_present_001');
    const mutated = cloneJson(publicFixture);
    mutated.public.dispatchPayload.designBoundaryProof.version = 2;

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('unsupported-version');
  });

  it('fails closed when the routed mode does not match route-gold', () => {
    const { publicFixture, privateFixture } = loadPair('sk_design_dispatch_boundary_present_001');
    const mutated = cloneJson(publicFixture);
    mutated.public.dispatchPayload.designBoundaryProof.routedMode.observedWorkflowMode = 'motion';
    mutated.public.dispatchPayload.designBoundaryProof.routedMode.observedIntents = ['motion'];

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('routed-mode-mismatch');
  });

  it('fails closed when a required digest is malformed', () => {
    const { publicFixture, privateFixture } = loadPair('sk_design_dispatch_boundary_present_001');
    const mutated = cloneJson(publicFixture);
    mutated.public.dispatchPayload.designBoundaryProof.payloadDigests.contextManifestDigest = 'sha256:not-a-digest';

    const lint = lintFixture(mutated, privateFixture);
    expect(lint.verdict).toBe('rejected');
    expect(findingCodes(lint)).toContain('malformed-digest');
  });
});

describe('design boundary proof parity — canonical asset and declared copies', () => {
  afterAll(() => {
    for (const root of tempRoots) rmSync(root, { recursive: true, force: true });
  });

  it('passes the live canonical-only copy-set guard', () => {
    const result = checkDesignDispatchBoundaryParity({ skillRoot: SKDESIGN });

    expect(result.verdict).toBe('valid');
    expect(result.copySetDecision).toBe('canonical-only');
    expect(result.driftDetected).toBe(false);
    expect(result.findings).toEqual([]);
  });

  it('detects drift and missing files in a declared copy set', () => {
    const root = mkdtempSync(join(tmpdir(), 'design-boundary-parity-'));
    tempRoots.push(root);
    cpSync(SKDESIGN, root, { recursive: true });

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
});
