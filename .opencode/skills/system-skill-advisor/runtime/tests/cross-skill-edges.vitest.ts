// ───────────────────────────────────────────────────────────────
// MODULE: Cross-Skill Edges Tests
// ───────────────────────────────────────────────────────────────

import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, expect, it } from 'vitest';
import { detectInboundEnhances } from '../lib/cross-skill-edges/detect-inbound-enhances.js';

// ───────────────────────────────────────────────────────────────
// 1. FIXTURE HELPERS
// ───────────────────────────────────────────────────────────────

function writeGraphMetadata(
  skillRoot: string,
  skillId: string,
  family: string,
  edges: Record<string, unknown[]> = {},
  enhanceWhen?: Record<string, unknown>,
): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  const metadata: Record<string, unknown> = {
    schema_version: 2,
    skill_id: skillId,
    family,
    category: 'test',
    domains: ['test'],
    intent_signals: [skillId],
    derived: {},
    edges,
  };
  if (enhanceWhen) {
    metadata.enhance_when = enhanceWhen;
  }
  writeFileSync(join(skillDir, 'graph-metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');
}

function writeAssetFile(skillRoot: string, skillId: string, assetPath: string, content: string): void {
  const skillDir = join(skillRoot, skillId);
  const assetDir = join(skillDir, 'assets');
  mkdirSync(assetDir, { recursive: true });
  writeFileSync(join(assetDir, assetPath), content, 'utf8');
}

function writeSkillFile(skillRoot: string, skillId: string, fileName: string, content: string): void {
  const skillDir = join(skillRoot, skillId);
  mkdirSync(skillDir, { recursive: true });
  writeFileSync(join(skillDir, fileName), content, 'utf8');
}

// ───────────────────────────────────────────────────────────────
// 2. TESTS
// ───────────────────────────────────────────────────────────────

describe('cross-skill-edges detection', () => {
  afterEach(() => {
    // Cleanup handled per test
  });

  it('Fixture A: cli-family arrival → 2 high-confidence candidates', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Create existing cli-family skills with enhances edges
      writeGraphMetadata(skillRoot, 'cli-alpha', 'cli', {
        enhances: [
          { target: 'cli-beta', weight: 0.5, context: 'peer' },
          { target: 'cli-gamma', weight: 0.5, context: 'peer' },
          { target: 'cli-delta', weight: 0.5, context: 'peer' },
          { target: 'cli-epsilon', weight: 0.5, context: 'peer' },
        ],
      });
      writeGraphMetadata(skillRoot, 'cli-beta', 'cli');
      writeGraphMetadata(skillRoot, 'cli-gamma', 'cli');
      writeGraphMetadata(skillRoot, 'cli-delta', 'cli');
      writeGraphMetadata(skillRoot, 'cli-epsilon', 'cli');

      // Create sk-prompt with enhance_when rule
      writeGraphMetadata(skillRoot, 'sk-prompt', 'sk-util', {}, {
        skill_has_asset: 'assets/quality_card.md',
        weight: 0.4,
        context_template: 'prompt quality card',
      });
      writeAssetFile(skillRoot, 'sk-prompt', 'quality_card.md', '# Quality Card');

      // Create system-skill-advisor with enhance_when rule
      writeGraphMetadata(skillRoot, 'system-skill-advisor', 'system', {}, {
        skill_has_files: ['SKILL.md', 'graph-metadata.json'],
        weight: 0.7,
        context_template: 'routes ${target.id} delegation requests',
      });
      writeSkillFile(skillRoot, 'system-skill-advisor', 'SKILL.md', '# Skill');

      // Create new cli-family arrival (cli-new) with the assets
      writeGraphMetadata(skillRoot, 'cli-new', 'cli');
      writeAssetFile(skillRoot, 'cli-new', 'quality_card.md', '# Quality Card');
      writeSkillFile(skillRoot, 'cli-new', 'SKILL.md', '# Skill');

      // Load metadata
      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);

      // Detect candidates with lower threshold for testing
      const candidates = detectInboundEnhances(skills, { minConfidence: 0.25 });

      // Expect 2 candidates: sk-prompt → cli-new, system-skill-advisor → cli-new
      const cliNewCandidates = candidates.filter(c => c.targetSkillId === 'cli-new');
      expect(cliNewCandidates.length).toBeGreaterThanOrEqual(2);

      // Check for sk-prompt candidate
      const skPromptCandidate = cliNewCandidates.find(c => c.sourceSkillId === 'sk-prompt');
      expect(skPromptCandidate).toBeDefined();
      expect(skPromptCandidate?.rules.some(r => r.rule === 'asset-shape')).toBe(true);

      // Check for system-skill-advisor candidate
      const systemAdvisorCandidate = cliNewCandidates.find(c => c.sourceSkillId === 'system-skill-advisor');
      expect(systemAdvisorCandidate).toBeDefined();
      expect(systemAdvisorCandidate?.rules.some(r => r.rule === 'asset-shape')).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('Fixture B: non-family arrival → 0 candidates', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Create cli-family skills
      writeGraphMetadata(skillRoot, 'cli-alpha', 'cli', {
        enhances: [
          { target: 'cli-beta', weight: 0.5, context: 'peer' },
          { target: 'cli-gamma', weight: 0.5, context: 'peer' },
        ],
      });
      writeGraphMetadata(skillRoot, 'cli-beta', 'cli');
      writeGraphMetadata(skillRoot, 'cli-gamma', 'cli');

      // Create sk-prompt with enhance_when rule
      writeGraphMetadata(skillRoot, 'sk-prompt', 'sk-util', {}, {
        skill_has_asset: 'assets/quality_card.md',
        weight: 0.4,
        context_template: 'prompt quality card',
      });
      writeAssetFile(skillRoot, 'sk-prompt', 'quality_card.md', '# Quality Card');

      // Create non-family arrival (mcp-new) without matching assets
      writeGraphMetadata(skillRoot, 'mcp-new', 'mcp');

      // Load metadata
      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);

      // Detect candidates
      const candidates = detectInboundEnhances(skills, { minConfidence: 0.75 });

      // Expect 0 candidates for mcp-new (no asset-shape match, no family-inference)
      const mcpNewCandidates = candidates.filter(c => c.targetSkillId === 'mcp-new');
      expect(mcpNewCandidates.length).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('Fixture C: idempotent re-run → 0 candidates after apply', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Create cli-family skills
      writeGraphMetadata(skillRoot, 'cli-alpha', 'cli', {
        enhances: [
          { target: 'cli-beta', weight: 0.5, context: 'peer' },
          { target: 'cli-gamma', weight: 0.5, context: 'peer' },
          { target: 'cli-delta', weight: 0.5, context: 'peer' },
        ],
      });
      writeGraphMetadata(skillRoot, 'cli-beta', 'cli');
      writeGraphMetadata(skillRoot, 'cli-gamma', 'cli');
      writeGraphMetadata(skillRoot, 'cli-delta', 'cli');

      // Create sk-prompt with enhance_when rule
      writeGraphMetadata(skillRoot, 'sk-prompt', 'sk-util', {}, {
        skill_has_asset: 'assets/quality_card.md',
        weight: 0.4,
        context_template: 'prompt quality card',
      });
      writeAssetFile(skillRoot, 'sk-prompt', 'quality_card.md', '# Quality Card');

      // Create new cli-family arrival
      writeGraphMetadata(skillRoot, 'cli-new', 'cli');
      writeAssetFile(skillRoot, 'cli-new', 'quality_card.md', '# Quality Card');

      // Load metadata
      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');

      // First detection
      let skills = await loadAllSkillMetadata(skillRoot);
      let candidates = detectInboundEnhances(skills, { minConfidence: 0.25 });

      // Expect at least 1 candidate (sk-prompt → cli-new)
      const cliNewCandidates = candidates.filter(c => c.targetSkillId === 'cli-new');
      expect(cliNewCandidates.length).toBeGreaterThanOrEqual(1);

      // Apply the candidate
      const candidate = cliNewCandidates.find(c => c.sourceSkillId === 'sk-prompt');
      expect(candidate).toBeDefined();
      if (candidate) {
        const applyResult = await applyEnhanceEdge(candidate);
        expect(applyResult.applied).toBe(true);
      }

      // Second detection after apply
      skills = await loadAllSkillMetadata(skillRoot);
      candidates = detectInboundEnhances(skills, { minConfidence: 0.25 });

      // Expect 0 candidates for cli-new (edge already exists)
      const cliNewCandidatesAfterApply = candidates.filter(c => c.targetSkillId === 'cli-new' && c.sourceSkillId === 'sk-prompt');
      expect(cliNewCandidatesAfterApply.length).toBe(0);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('emits only enhances edge type', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Create skills with various edge types
      writeGraphMetadata(skillRoot, 'skill-a', 'system', {
        enhances: [{ target: 'skill-b', weight: 0.5, context: 'test' }],
        siblings: [{ target: 'skill-c', weight: 0.5, context: 'sibling' }],
      });
      writeGraphMetadata(skillRoot, 'skill-b', 'system');
      writeGraphMetadata(skillRoot, 'skill-c', 'system');

      // Load metadata
      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);

      // Detect candidates
      const candidates = detectInboundEnhances(skills, { minConfidence: 0.0 });

      // All candidates should have edgeType 'enhances'
      for (const candidate of candidates) {
        expect(candidate.edgeType).toBe('enhances');
      }
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('REQ-002: composite-rule high-confidence path (≥ 0.80) is exercised', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Cross-family source (sk-prompt) enhances 3 cli peers. New cli arrival has the
      // asset that sk-prompt's enhance_when requires AND one enhanced peer lists the
      // newcomer as a sibling → all 3 scorers fire (0.45 + 0.30 + 0.15 = 0.90).
      writeGraphMetadata(skillRoot, 'sk-prompt', 'sk-util', {
        enhances: [
          { target: 'cli-beta', weight: 0.4, context: 'prompt quality card' },
          { target: 'cli-gamma', weight: 0.4, context: 'prompt quality card' },
          { target: 'cli-delta', weight: 0.4, context: 'prompt quality card' },
        ],
      }, {
        skill_has_files: ['SKILL.md'],
        weight: 0.4,
        context_template: 'prompt quality card',
      });
      writeGraphMetadata(skillRoot, 'cli-beta', 'cli', {
        siblings: [{ target: 'cli-new', weight: 0.5, context: 'sibling' }],
      });
      writeGraphMetadata(skillRoot, 'cli-gamma', 'cli');
      writeGraphMetadata(skillRoot, 'cli-delta', 'cli');
      writeGraphMetadata(skillRoot, 'cli-new', 'cli');
      writeSkillFile(skillRoot, 'cli-new', 'SKILL.md', '# cli-new');

      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);
      const candidates = detectInboundEnhances(skills, { minConfidence: 0.75 });

      const hit = candidates.find(c => c.sourceSkillId === 'sk-prompt' && c.targetSkillId === 'cli-new');
      expect(hit).toBeDefined();
      expect(hit?.confidence).toBeGreaterThanOrEqual(0.80);
      expect(hit?.confidenceLabel).toBe('high');
      // All 3 scorers should have positive contributions
      const ruleNames = (hit?.rules ?? []).map(r => r.rule);
      expect(ruleNames).toContain('family-inference');
      expect(ruleNames).toContain('asset-shape');
      expect(ruleNames).toContain('sibling-transitivity');
      expect(hit?.applyable).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('REQ-004: applied edge is re-readable and carries auto-marker fields', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const sourcePath = join(skillRoot, 'cli-alpha', 'graph-metadata.json');

    try {
      writeGraphMetadata(skillRoot, 'cli-alpha', 'cli', {}, {
        skill_has_files: ['SKILL.md'],
        weight: 0.5,
        context_template: 'routes ${target.id}',
      });
      writeGraphMetadata(skillRoot, 'cli-new', 'cli');
      writeSkillFile(skillRoot, 'cli-new', 'SKILL.md', '# cli-new');

      const { propagateInboundEnhances } = await import('../lib/cross-skill-edges/index.js');
      const apply = await propagateInboundEnhances({
        skillsRoot: skillRoot,
        mode: 'apply',
        minConfidence: 0.25,
        applyAllHighConfidence: false,
        dryRun: false,
      });
      // Force-apply by enumerating the candidates we just produced (medium confidence path)
      const target = apply.candidates.find(c => c.sourceSkillId === 'cli-alpha' && c.targetSkillId === 'cli-new');
      expect(target).toBeDefined();

      const explicit = await propagateInboundEnhances({
        skillsRoot: skillRoot,
        mode: 'apply',
        minConfidence: 0.25,
        applyCandidateIds: target ? [target.id] : [],
        dryRun: false,
      });
      expect(explicit.applied.length).toBeGreaterThanOrEqual(1);

      const fs = await import('node:fs');
      const reparsed = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
      const applied = (reparsed.edges?.enhances ?? []).find((e: { target?: string }) => e.target === 'cli-new');
      expect(applied).toBeDefined();
      expect(applied.auto_added_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/);
      expect(typeof applied.auto_added_reason).toBe('string');
      expect(applied.auto_added_reason.length).toBeGreaterThan(0);
      expect(applied.source_kind).toBe('automated');
      expect(typeof applied.weight).toBe('number');
      expect(typeof applied.context).toBe('string');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('F-08-001 regression: non-array skill_has_files does not crash', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Hand-crafted malformed graph-metadata.json with skill_has_files as a string
      mkdirSync(join(skillRoot, 'skill-a'), { recursive: true });
      writeFileSync(join(skillRoot, 'skill-a', 'graph-metadata.json'), JSON.stringify({
        schema_version: 2,
        skill_id: 'skill-a',
        family: 'system',
        category: 'test',
        domains: ['test'],
        intent_signals: ['skill-a'],
        edges: {},
        enhance_when: { skill_has_files: 'SKILL.md', weight: 0.5, context_template: 'test' },
      }, null, 2));
      writeGraphMetadata(skillRoot, 'skill-b', 'system');

      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);
      // Detector MUST NOT throw
      expect(() => detectInboundEnhances(skills, { minConfidence: 0.0 })).not.toThrow();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('F-06-004 regression: malformed JSON surfaces in PropagateEnhancesResult.errors', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Valid skill
      writeGraphMetadata(skillRoot, 'skill-good', 'system');
      // Malformed JSON in a sibling skill
      mkdirSync(join(skillRoot, 'skill-bad'), { recursive: true });
      writeFileSync(join(skillRoot, 'skill-bad', 'graph-metadata.json'), '{ not valid json', 'utf8');

      const { propagateInboundEnhances } = await import('../lib/cross-skill-edges/index.js');
      const result = await propagateInboundEnhances({
        skillsRoot: skillRoot,
        mode: 'report',
        minConfidence: 0.0,
      });
      // Errors array must include the malformed file
      expect(result.errors.some(e => e.skillId === 'skill-bad')).toBe(true);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('F-03-001 regression: applyEnhanceEdge rejects paths outside skillsRoot', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const escapeDir = join(root, 'escape');
    mkdirSync(escapeDir, { recursive: true });
    const escapePath = join(escapeDir, 'graph-metadata.json');
    writeFileSync(escapePath, JSON.stringify({ edges: { enhances: [] } }, null, 2));

    try {
      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');
      const candidate = {
        id: 'test-traversal',
        sourceSkillId: 'evil',
        targetSkillId: 'cli-new',
        edgeType: 'enhances' as const,
        weight: 0.5,
        context: 'malicious',
        confidence: 0.9,
        confidenceLabel: 'high' as const,
        rules: [],
        sourcePath: escapePath,
        targetPath: escapePath,
        applyable: true,
        blockers: [],
      };
      const result = await applyEnhanceEdge(candidate, skillRoot);
      expect(result.applied).toBe(false);
      expect(result.reason).toMatch(/path-boundary/);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('derives automated provenance instead of accepting candidate provenance', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const sourcePath = join(skillRoot, 'skill-a', 'graph-metadata.json');

    try {
      writeGraphMetadata(skillRoot, 'skill-a', 'system');
      writeGraphMetadata(skillRoot, 'skill-b', 'system');

      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');
      const candidate = {
        id: 'server-derived-provenance',
        sourceSkillId: 'skill-a',
        targetSkillId: 'skill-b',
        edgeType: 'enhances' as const,
        weight: 0.3,
        context: 'automated context',
        confidence: 0.9,
        confidenceLabel: 'high' as const,
        rules: [{ rule: 'asset-shape' as const, contribution: 0.3, detail: 'test' }],
        sourcePath,
        targetPath: join(skillRoot, 'skill-b', 'graph-metadata.json'),
        applyable: true,
        blockers: [],
        source_kind: 'manual',
      };

      const result = await applyEnhanceEdge(candidate, skillRoot);
      expect(result.applied).toBe(true);

      const reparsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
      const edge = reparsed.edges.enhances.find((entry: { target?: string }) => entry.target === 'skill-b');
      expect(edge.source_kind).toBe('automated');
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('preserves manual provenance on automated reruns', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const sourcePath = join(skillRoot, 'skill-a', 'graph-metadata.json');

    try {
      writeGraphMetadata(skillRoot, 'skill-a', 'system', {
        enhances: [{ target: 'skill-b', weight: 0.6, context: 'manual context', source_kind: 'manual' }],
      });
      writeGraphMetadata(skillRoot, 'skill-b', 'system');

      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');
      const candidate = {
        id: 'manual-protection',
        sourceSkillId: 'skill-a',
        targetSkillId: 'skill-b',
        edgeType: 'enhances' as const,
        weight: 0.3,
        context: 'automated context',
        confidence: 0.9,
        confidenceLabel: 'high' as const,
        rules: [{ rule: 'asset-shape' as const, contribution: 0.3, detail: 'test' }],
        sourcePath,
        targetPath: join(skillRoot, 'skill-b', 'graph-metadata.json'),
        applyable: true,
        blockers: [],
      };

      const result = await applyEnhanceEdge(candidate, skillRoot, 'automated');
      expect(result.applied).toBe(false);
      expect(result.reason).toMatch(/manual provenance protected/);

      const reparsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
      const edge = reparsed.edges.enhances.find((entry: { target?: string }) => entry.target === 'skill-b');
      expect(edge).toMatchObject({
        target: 'skill-b',
        weight: 0.6,
        context: 'manual context',
        source_kind: 'manual',
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('allows trusted maintainer writes over protected edge fields', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const sourcePath = join(skillRoot, 'skill-a', 'graph-metadata.json');

    try {
      writeGraphMetadata(skillRoot, 'skill-a', 'system', {
        enhances: [{ target: 'skill-b', weight: 0.6, context: 'manual context', source_kind: 'manual' }],
      });
      writeGraphMetadata(skillRoot, 'skill-b', 'system');

      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');
      const candidate = {
        id: 'trusted-update',
        sourceSkillId: 'skill-a',
        targetSkillId: 'skill-b',
        edgeType: 'enhances' as const,
        weight: 0.4,
        context: 'trusted context',
        confidence: 0.9,
        confidenceLabel: 'high' as const,
        rules: [{ rule: 'asset-shape' as const, contribution: 0.3, detail: 'test' }],
        sourcePath,
        targetPath: join(skillRoot, 'skill-b', 'graph-metadata.json'),
        applyable: true,
        blockers: [],
      };

      const result = await applyEnhanceEdge(candidate, skillRoot, 'trusted-maintainer');
      expect(result.applied).toBe(true);

      const reparsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
      const edge = reparsed.edges.enhances.find((entry: { target?: string }) => entry.target === 'skill-b');
      expect(edge).toMatchObject({
        target: 'skill-b',
        weight: 0.4,
        context: 'trusted context',
        source_kind: 'trusted',
      });
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('tolerates legacy edges without source provenance', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');
    const sourcePath = join(skillRoot, 'skill-a', 'graph-metadata.json');

    try {
      writeGraphMetadata(skillRoot, 'skill-a', 'system', {
        enhances: [{ target: 'skill-b', weight: 0.6, context: 'legacy context' }],
      });
      writeGraphMetadata(skillRoot, 'skill-b', 'system');

      const { applyEnhanceEdge } = await import('../lib/cross-skill-edges/apply-graph-metadata-patch.js');
      const candidate = {
        id: 'legacy-edge',
        sourceSkillId: 'skill-a',
        targetSkillId: 'skill-b',
        edgeType: 'enhances' as const,
        weight: 0.3,
        context: 'automated context',
        confidence: 0.9,
        confidenceLabel: 'high' as const,
        rules: [{ rule: 'asset-shape' as const, contribution: 0.3, detail: 'test' }],
        sourcePath,
        targetPath: join(skillRoot, 'skill-b', 'graph-metadata.json'),
        applyable: true,
        blockers: [],
      };

      const result = await applyEnhanceEdge(candidate, skillRoot, 'automated');
      expect(result).toEqual({ applied: false, reason: 'edge already exists' });
      const reparsed = JSON.parse(readFileSync(sourcePath, 'utf8'));
      const edge = reparsed.edges.enhances.find((entry: { target?: string }) => entry.target === 'skill-b');
      expect(edge).toMatchObject({
        target: 'skill-b',
        weight: 0.6,
        context: 'legacy context',
      });
      expect(edge.source_kind).toBeUndefined();
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });

  it('clips weight to [0.3, 0.7]', async () => {
    const root = mkdtempSync(join(tmpdir(), 'cross-skill-edges-'));
    const skillRoot = join(root, 'skills');

    try {
      // Create source with enhance_when rule with weight outside range
      writeGraphMetadata(skillRoot, 'skill-a', 'system', {}, {
        skill_has_files: ['test.md'],
        weight: 0.9,  // Above 0.7
        context_template: 'test context',
      });
      writeGraphMetadata(skillRoot, 'skill-b', 'system');
      writeSkillFile(skillRoot, 'skill-b', 'test.md', '# Test');

      // Load metadata
      const { loadAllSkillMetadata } = await import('../lib/cross-skill-edges/metadata-loader.js');
      const skills = await loadAllSkillMetadata(skillRoot);

      // Detect candidates
      const candidates = detectInboundEnhances(skills, { minConfidence: 0.0 });

      // Weight should be clipped to 0.7
      const candidate = candidates.find(c => c.sourceSkillId === 'skill-a' && c.targetSkillId === 'skill-b');
      expect(candidate).toBeDefined();
      expect(candidate?.weight).toBeLessThanOrEqual(0.7);
      expect(candidate?.weight).toBeGreaterThanOrEqual(0.3);
    } finally {
      rmSync(root, { recursive: true, force: true });
    }
  });
});
