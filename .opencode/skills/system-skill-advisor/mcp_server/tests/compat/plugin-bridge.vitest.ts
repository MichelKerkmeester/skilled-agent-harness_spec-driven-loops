// ───────────────────────────────────────────────────────────────
// MODULE: Plugin Bridge Tests
// ───────────────────────────────────────────────────────────────

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { findAdvisorWorkspaceRoot } from '../../lib/utils/workspace-root.js';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = findAdvisorWorkspaceRoot(here);
const bridgePath = resolve(repoRoot, '.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs');

type BridgeModule = {
  buildBrief: (input: Record<string, unknown>, dependencies?: Record<string, unknown>) => Promise<{
    status: string;
    brief: string | null;
    metadata: Record<string, unknown>;
  }>;
  createChildEnv: (sourceEnv?: NodeJS.ProcessEnv) => Record<string, string>;
  parseInput: (text: string) => Record<string, unknown>;
  renderAdvisorBrief: (result: Record<string, unknown>, options?: Record<string, unknown>) => string | null;
};

async function loadBridge(): Promise<BridgeModule> {
  return await import(pathToFileURL(bridgePath).href) as BridgeModule;
}

function bridgeInput(payload: Record<string, unknown>): Record<string, unknown> {
  return {
    workspaceRoot: repoRoot,
    maxTokens: 80,
    thresholdConfidence: 0.8,
    ...payload,
  };
}

function nativeDependencies(bridge: BridgeModule, options: {
  readonly skillId?: string;
  readonly confidence?: number;
  readonly uncertainty?: number;
  readonly score?: number;
  readonly recommendations?: readonly Record<string, unknown>[];
  readonly ambiguous?: boolean;
  readonly freshness?: string;
} = {}) {
  const skillId = options.skillId ?? 'system-spec-kit';
  const confidence = options.confidence ?? 0.91;
  const uncertainty = options.uncertainty ?? 0.12;
  const score = options.score ?? confidence;
  const recommendations = options.recommendations ?? [{ skillId, confidence, uncertainty, score }];
  const freshness = options.freshness ?? 'live';
  return {
    env: {},
    loadNativeAdvisorModules: async () => ({
      readAdvisorStatus: async () => ({
        freshness,
        generation: 7,
        trustState: { reason: null },
        errors: [],
      }),
      handleAdvisorRecommend: async () => ({
        content: [{
          text: JSON.stringify({
            status: 'ok',
            data: {
              freshness,
              cache: { hit: true },
              recommendations,
              ambiguous: options.ambiguous === true,
            },
          }),
        }],
      }),
      renderAdvisorBrief: bridge.renderAdvisorBrief,
    }),
  };
}

describe('mk-skill-advisor plugin bridge compat path', () => {
  it('publishes one effective-threshold contract for the native bridge route', async () => {
    const bridge = await loadBridge();
    const parsed = await bridge.buildBrief(
      bridgeInput({ prompt: 'save this conversation context to memory' }),
      nativeDependencies(bridge),
    );
    expect(parsed.status).toBe('ok');
    expect(parsed.brief).toContain('Advisor:');
    expect(parsed.brief).toContain('system-spec-kit');
    expect(parsed.brief).toMatch(/\d+\.\d{2}\/\d+\.\d{2} pass\./);
    expect(parsed.metadata.route).toBe('native');
    expect(parsed.metadata.workspaceRoot).toBe(repoRoot);
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('defaults omitted thresholdConfidence to the live 014 threshold pair', async () => {
    const bridge = await loadBridge();
    const parsed = await bridge.buildBrief(
      bridgeInput({
        prompt: 'save this conversation context to memory',
        thresholdConfidence: undefined,
      }),
      nativeDependencies(bridge),
    );
    expect(parsed.status).toBe('ok');
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('renders native uncertainty from the recommendation instead of a literal zero', async () => {
    const bridge = await loadBridge();
    const source = readFileSync(bridgePath, 'utf8');
    const parsed = await bridge.buildBrief(
      bridgeInput({ prompt: 'save this conversation context to memory' }),
      nativeDependencies(bridge, { confidence: 0.86, uncertainty: 0.23 }),
    );

    // The bridge sources its defaults from compat-contract.json (deep-review remediation
    // commit 8c8c3fcc42). Assert the import + assignment + contract values rather than
    // inline numeric literals, so the test stays stable under contract refactors.
    const contractPath = resolve(repoRoot, '.opencode/skills/system-skill-advisor/mcp_server/schemas/compat-contract.json');
    const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
    expect(contract.defaults.confidenceThreshold).toBe(0.8);
    expect(contract.defaults.uncertaintyThreshold).toBe(0.35);
    expect(source).toContain('const DEFAULT_CONFIDENCE_THRESHOLD = COMPAT_CONTRACT.defaults.confidenceThreshold;');
    expect(source).toContain('const DEFAULT_UNCERTAINTY_THRESHOLD = COMPAT_CONTRACT.defaults.uncertaintyThreshold;');
    // The dead `renderNativeBrief()` was removed; bridge output now
    // flows exclusively through `renderAdvisorBrief()` loaded via
    // `loadNativeAdvisorModules()`. The original literal-zero regression guard
    // (against `${formatScore(top.confidence)}/0.00 pass.`) is preserved here
    // since `renderAdvisorBrief()` in `lib/render.ts` is the live renderer.
    expect(source).toContain('renderAdvisorBrief');
    expect(source).not.toContain('${formatScore(top.confidence)}/0.00 pass.');
    expect(parsed.brief).toContain('0.86/0.23 pass.');
  });

  it('renders the ambiguous branch when native scorer output is ambiguous', async () => {
    const bridge = await loadBridge();
    const parsed = await bridge.buildBrief(
      bridgeInput({ prompt: 'route a near-tied request' }),
      nativeDependencies(bridge, {
        ambiguous: true,
        recommendations: [
          { skillId: 'sk-code', confidence: 0.95, uncertainty: 0.10, score: 0.50 },
          { skillId: 'sk-doc', confidence: 0.80, uncertainty: 0.12, score: 0.47 },
        ],
      }),
    );

    expect(parsed.status).toBe('ok');
    expect(parsed.brief).toContain('Advisor: live; ambiguous: sk-code 0.95/0.10 vs sk-doc 0.80/0.12 pass.');
    expect(parsed.metadata.tokenCap).toBe(120);
  });

  it('keeps bridge renderer single-brief output for separated recommendations', async () => {
    const bridge = await loadBridge();
    const rendered = bridge.renderAdvisorBrief({
      status: 'ok',
      freshness: 'live',
      recommendations: [
        { skill: 'sk-code', confidence: 0.95, uncertainty: 0.10, score: 0.70, passes_threshold: true },
        { skill: 'sk-doc', confidence: 0.80, uncertainty: 0.12, score: 0.60, passes_threshold: true },
      ],
      metrics: { tokenCap: 120 },
    });

    expect(rendered).toContain('Advisor: live; use sk-code 0.95/0.10 pass.');
  });

  // drift: verified against shipped behavior during Unit H
  it('fails open when the forced-local Python bridge script is unavailable', async () => {
    const bridge = await loadBridge();
    const parsed = await bridge.buildBrief(
      bridgeInput({ prompt: 'help me commit my changes', forceLocal: true }),
      { env: { SPECKIT_SKILL_ADVISOR_FORCE_LOCAL: '1' } },
    );
    expect(parsed.status).toBe('fail_open');
    expect(parsed.metadata.route).toBe('python');
    expect(parsed.brief).toBeNull();
    expect(parsed.metadata.effectiveThresholds).toEqual({
      confidenceThreshold: 0.8,
      uncertaintyThreshold: 0.35,
      confidenceOnly: false,
    });
  });

  it('returns a prompt-safe silent fail-open for the shared disabled flag', async () => {
    // Disabled mode now silently fails open (brief is null), aligning
    // OpenCode with every other runtime (OpenCode, Claude, Copilot). Callers
    // still detect the disabled state via metadata.route === 'disabled'. Privacy
    // guard preserved: prompt content must not leak to stdout.
    const bridge = await loadBridge();
    const parsed = await bridge.buildBrief(
      bridgeInput({ prompt: 'private@example.com should not appear' }),
      { env: { SPECKIT_SKILL_ADVISOR_HOOK_DISABLED: '1' } },
    );
    expect(parsed.status).toBe('skipped');
    expect(parsed.brief).toBeNull();
    expect(parsed.metadata.route).toBe('disabled');
    expect(parsed.metadata.freshness).toBe('unavailable');
    expect(parsed.metadata.recommendationCount).toBe(0);
    expect(JSON.stringify(parsed)).not.toContain('private@example.com');
  });

  it('rejects malformed input through the pure parser path', async () => {
    const bridge = await loadBridge();
    expect(() => bridge.parseInput('')).toThrow(/Missing bridge input/);
    expect(() => bridge.parseInput(JSON.stringify({ prompt: 'no workspace root' }))).toThrow(/Missing workspace root/);
  });

  it('filters parent environment keys before spawning the advisor launcher', async () => {
    const bridge = await loadBridge();
    const env = bridge.createChildEnv({
      PATH: '/bin',
      SPECKIT_RUNTIME: 'opencode',
      SECRET_TOKEN: 'should-not-leak',
      AWS_SECRET_ACCESS_KEY: 'should-not-leak',
    });

    expect(env).toEqual({
      PATH: '/bin',
      SPECKIT_RUNTIME: 'opencode',
    });
  });
});
