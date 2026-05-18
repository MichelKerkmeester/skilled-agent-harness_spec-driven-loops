---
title: "Implementation Plan: skill_graph_propagate_enhances MVP"
description: "Detailed TS module + MCP tool + 3 fixture tests. Mirrors existing system-skill-advisor lib/handler/tool patterns. Designed for SWE-1.6 implementation per cli-devin v1.0.2.0 prompt-quality contract — pre-planned, ordered, verification-bounded."
trigger_phrases:
  - "026 plan"
  - "cross-skill propagation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation"
    last_updated_at: "2026-05-15T15:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Author plan"
    next_safe_action: "Author tasks + checklist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "026-cross-skill-init"
      parent_session_id: null
    completion_pct: 25
    open_questions: []
    answered_questions: []
---
# Implementation Plan: skill_graph_propagate_enhances MVP

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2 | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node, vitest) |
| **Framework** | MCP server (`@modelcontextprotocol/sdk`); existing `mk_skill_advisor` runtime |
| **Storage** | None — operates on source `graph-metadata.json` files; SQLite is downstream (refreshed by existing daemon on file change) |
| **Testing** | vitest, fixture-based (mirrors `tests/skill-graph-handlers.vitest.ts` style) |

### Overview

Build a new module at `mcp_server/lib/cross-skill-edges/` plus a new MCP tool `skill_graph_propagate_enhances` that detects missing inbound `enhances` edges via composite scoring (family + asset-shape + sibling-transitivity) and offers report / propose / apply modes with idempotent JSON patching of source skill `graph-metadata.json` files. Schema-additive only — existing parsers tolerate the new optional `enhance_when` field on enhancer skills.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] spec.md drafted with REQ-001..REQ-016
- [x] codex research evidence at `.opencode/specs/skilled-agent-orchestration/104-cli-devin-creation/evidence/cross-skill-auto-propagation-research-codex-2026-05-15.md`
- [x] Operator approved this phase

### Definition of Done
- [ ] All 7 new TS files created + 2 graph-metadata.json edits + 1 test file
- [ ] 3 fixture tests PASS
- [ ] MCP tool registered, `tools/list` returns it
- [ ] Running tool against current HEAD returns `candidates: []` (REQ-001)
- [ ] Synthetic-removal fixture round-trip works (REQ-002)
- [ ] Strict spec validate on phase folder PASSES
- [ ] Implementation-summary.md filled with concrete file paths + LOC counts
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

**Detection-as-a-service + opt-in apply.** Pure-function detector returns `InboundEnhanceCandidate[]`; orchestrator handles modes; apply layer does idempotent JSON patches. No SQLite writes from this module — the existing daemon's chokidar watcher picks up source-file changes and re-indexes via the existing `indexSkillMetadata` pipeline.

### Key Components

**`lib/cross-skill-edges/types.ts`**
Type definitions only. Mirror the codex research's TypeScript sketches verbatim:
```typescript
export type PropagationMode = 'report' | 'propose' | 'apply';

export interface CandidateRuleEvidence {
  rule: 'family-inference' | 'asset-shape' | 'sibling-transitivity';
  contribution: number;  // 0..1
  detail: string;        // e.g. "4/4 cli-family share"
}

export interface InboundEnhanceCandidate {
  id: string;                      // hash(source + target + 'enhances')
  sourceSkillId: string;
  targetSkillId: string;
  edgeType: 'enhances';            // hardcoded; never anything else
  weight: number | null;           // null when not deterministically inferrable
  context: string | null;
  confidence: number;              // 0..1
  confidenceLabel: 'high' | 'medium' | 'low';
  rules: CandidateRuleEvidence[];
  sourcePath: string;              // absolute path to source graph-metadata.json
  targetPath: string;              // absolute path to target graph-metadata.json
  applyable: boolean;              // false when weight or context not deterministically inferrable
  blockers: string[];              // human-readable reasons for !applyable
}

export interface DetectInboundEnhancesOptions {
  minConfidence: number;           // default 0.75
  targetSkillIds?: string[];       // scope to specific targets
  sourceSkillIds?: string[];       // scope to specific sources
}

export interface PropagateEnhancesOptions {
  skillsRoot: string;
  mode: PropagationMode;
  minConfidence?: number;
  targetSkillIds?: string[];
  sourceSkillIds?: string[];
  applyCandidateIds?: string[];
  applyAllHighConfidence?: boolean;
  dryRun?: boolean;                // default true
}

export interface PropagateEnhancesResult {
  candidates: InboundEnhanceCandidate[];
  applied: string[];               // candidate IDs successfully written
  skipped_existing: string[];      // candidate IDs already present
  errors: Array<{ skillId: string; error: string }>;
  dryRun: boolean;
  mode: PropagationMode;
}
```

**`lib/cross-skill-edges/metadata-loader.ts`**
- `loadAllSkillMetadata(skillsRoot: string): Promise<SkillMetadataRecord[]>` — recursive discovery + JSON.parse + per-file error capture
- `groupByFamily(records: SkillMetadataRecord[]): Map<string, SkillMetadataRecord[]>` — bucket by `family` field
- Reuses the existing `discoverGraphMetadataFiles` helper from `lib/skill-graph/` if available; otherwise mirrors its glob pattern (`<skillsRoot>/*/graph-metadata.json`)

**`lib/cross-skill-edges/detect-inbound-enhances.ts`**
Pure function. No I/O. Takes loaded metadata, returns candidates.

```typescript
export function detectInboundEnhances(
  skills: SkillMetadataRecord[],
  options: DetectInboundEnhancesOptions,
): InboundEnhanceCandidate[] {
  const byId = new Map(skills.map(s => [s.skillId, s]));
  const byFamily = groupByFamily(skills);
  const out: InboundEnhanceCandidate[] = [];

  for (const target of skills) {
    if (options.targetSkillIds && !options.targetSkillIds.includes(target.skillId)) continue;

    for (const source of skills) {
      if (source.skillId === target.skillId) continue;
      if (options.sourceSkillIds && !options.sourceSkillIds.includes(source.skillId)) continue;

      // Skip if edge already exists
      if (hasEnhanceEdge(source, target.skillId)) continue;

      // Score each rule
      const familyScore = scoreFamilyInference(source, target, byFamily);
      const assetScore = scoreAssetShape(source, target);
      const transitivityScore = scoreSiblingTransitivity(source, target, byId);

      const rules: CandidateRuleEvidence[] = [];
      if (familyScore.contribution > 0) rules.push(familyScore);
      if (assetScore.contribution > 0) rules.push(assetScore);
      if (transitivityScore.contribution > 0) rules.push(transitivityScore);

      const confidence = rules.reduce((sum, r) => sum + r.contribution, 0);
      if (confidence < options.minConfidence) continue;

      const { weight, context, blockers } = inferEdgePayload(source, target, byFamily);

      out.push({
        id: hashCandidate(source.skillId, target.skillId),
        sourceSkillId: source.skillId,
        targetSkillId: target.skillId,
        edgeType: 'enhances',
        weight,
        context,
        confidence,
        confidenceLabel: confidence >= 0.80 ? 'high' : confidence >= 0.60 ? 'medium' : 'low',
        rules,
        sourcePath: source.filePath,
        targetPath: target.filePath,
        applyable: blockers.length === 0,
        blockers,
      });
    }
  }

  return stableSortByConfidenceDesc(out);
}
```

**Family-inference scoring** (max contribution 0.45):
```typescript
function scoreFamilyInference(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
  byFamily: Map<string, SkillMetadataRecord[]>,
): CandidateRuleEvidence {
  if (source.family === target.family) return { rule: 'family-inference', contribution: 0, detail: 'source and target same family — skip (avoid self-enhance)' };
  const sourceEnhances = source.edges?.enhances ?? [];
  if (sourceEnhances.length < 3) return { rule: 'family-inference', contribution: 0, detail: 'source has < 3 existing enhances entries' };

  const sameFamilyTargets = sourceEnhances.filter(e => {
    const t = (byFamily.get(target.family) ?? []).find(s => s.skillId === e.target);
    return t !== undefined;
  });
  const familyPeers = (byFamily.get(target.family) ?? []).length;
  // family-share denominator excludes target itself
  const denominator = Math.max(1, familyPeers - 1);
  const familyShare = sameFamilyTargets.length / denominator;
  if (familyShare < 0.5) return { rule: 'family-inference', contribution: 0, detail: `family-share ${Math.round(familyShare * 100)}% below 50% threshold` };

  const contribution = 0.45 * familyShare;
  return {
    rule: 'family-inference',
    contribution,
    detail: `${sameFamilyTargets.length}/${denominator} ${target.family}-family peers already enhanced (${Math.round(familyShare * 100)}%)`,
  };
}
```

**Asset-shape scoring** (max contribution 0.30):
- Read `source.enhance_when` field if present (the new optional schema field)
- If declared `skill_has_asset: "<path>"`, check target's bundled assets for that file
- If `skill_has_files: ["a", "b"]`, all listed files must exist in target
- Contribution = 0.30 if match, 0 otherwise

```typescript
function scoreAssetShape(source: SkillMetadataRecord, target: SkillMetadataRecord): CandidateRuleEvidence {
  const rules = source.enhance_when ?? [];
  for (const rule of asArray(rules)) {
    if (rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset)) {
      return {
        rule: 'asset-shape',
        contribution: 0.30,
        detail: `target has ${rule.skill_has_asset}`,
      };
    }
    if (rule.skill_has_files && rule.skill_has_files.every(f => targetHasFile(target, f))) {
      return {
        rule: 'asset-shape',
        contribution: 0.30,
        detail: `target has all of ${rule.skill_has_files.join(', ')}`,
      };
    }
  }
  return { rule: 'asset-shape', contribution: 0, detail: 'no enhance_when rule matches target' };
}
```

**Sibling-transitivity scoring** (max contribution 0.15):
- If source A enhances B, and B siblings C (the target), contribute 0.15
- Walk source's enhances list; for each enhanced B, check B.edges.siblings for target
- Single positive signal triggers full contribution (binary, not graded)

**`lib/cross-skill-edges/context-template.ts`**
Deterministic inference only. No LLM calls.

```typescript
export function inferEdgePayload(
  source: SkillMetadataRecord,
  target: SkillMetadataRecord,
  byFamily: Map<string, SkillMetadataRecord[]>,
): { weight: number | null; context: string | null; blockers: string[] } {
  const blockers: string[] = [];
  const familyEdges = (source.edges?.enhances ?? [])
    .filter(e => byFamily.get(target.family)?.some(s => s.skillId === e.target));

  // 1. enhance_when explicit template wins
  const rules = asArray(source.enhance_when ?? []);
  for (const rule of rules) {
    if ((rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset))
        || (rule.skill_has_files && rule.skill_has_files.every(f => targetHasFile(target, f)))) {
      return {
        weight: clipWeight(rule.weight),
        context: substituteTemplate(rule.context_template, target),
        blockers: [],
      };
    }
  }

  // 2. Same-family exemplar — verbatim weight + context if stable
  if (familyEdges.length === 0) {
    blockers.push('no same-family exemplar to infer payload');
    return { weight: null, context: null, blockers };
  }

  const weights = familyEdges.map(e => e.weight);
  const stableWeight = allEqual(weights) ? weights[0] : medianOf(weights);

  // Context: if all family edges share verbatim context, use it. Else try provider-template substitution.
  const contexts = familyEdges.map(e => e.context);
  let context: string | null = null;
  if (allEqual(contexts)) {
    context = contexts[0];
  } else {
    // Provider-template substitution: replace any peer-skill-id appearing in an exemplar context
    const exemplar = familyEdges[0];
    const peerIds = familyEdges.map(e => e.target);
    context = substituteProviderName(exemplar.context, peerIds, target.skillId);
  }
  if (!context) {
    blockers.push('context not deterministically inferrable');
  }
  return {
    weight: clipWeight(stableWeight),
    context,
    blockers,
  };
}

function clipWeight(w: number | null | undefined): number | null {
  if (w == null) return null;
  return Math.min(0.7, Math.max(0.3, w));
}

function substituteTemplate(template: string, target: SkillMetadataRecord): string {
  return template
    .replace('${target.id}', target.skillId)
    .replace('${target.family}', target.family ?? '')
    .replace('${target.category}', target.category ?? '');
}
```

**`lib/cross-skill-edges/apply-graph-metadata-patch.ts`**
Idempotent JSON read-modify-write. Adds the new edge with auto-marker fields. Skips if edge already exists.

```typescript
export async function applyEnhanceEdge(candidate: InboundEnhanceCandidate): Promise<{ applied: boolean; reason: string }> {
  if (!candidate.applyable) {
    return { applied: false, reason: `not applyable: ${candidate.blockers.join('; ')}` };
  }

  const raw = await fs.readFile(candidate.sourcePath, 'utf-8');
  const parsed = JSON.parse(raw);
  const enhances: Array<Record<string, unknown>> = parsed.edges?.enhances ?? [];

  // Idempotence guard
  if (enhances.some(e => e.target === candidate.targetSkillId)) {
    return { applied: false, reason: 'edge already exists' };
  }

  const newEdge = {
    target: candidate.targetSkillId,
    weight: candidate.weight,
    context: candidate.context,
    auto_added_at: new Date().toISOString(),
    auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + '),
  };
  enhances.push(newEdge);
  parsed.edges = parsed.edges ?? {};
  parsed.edges.enhances = enhances;

  await fs.writeFile(candidate.sourcePath, JSON.stringify(parsed, null, 2) + '\n', 'utf-8');
  return { applied: true, reason: 'edge added with auto-marker fields' };
}
```

**`lib/cross-skill-edges/index.ts`**
Public entry point. Orchestrates load → detect → (optional) apply.

```typescript
export async function propagateInboundEnhances(options: PropagateEnhancesOptions): Promise<PropagateEnhancesResult> {
  const skills = await loadAllSkillMetadata(options.skillsRoot);
  const detectOpts: DetectInboundEnhancesOptions = {
    minConfidence: options.minConfidence ?? 0.75,
    targetSkillIds: options.targetSkillIds,
    sourceSkillIds: options.sourceSkillIds,
  };
  const candidates = detectInboundEnhances(skills, detectOpts);

  const result: PropagateEnhancesResult = {
    candidates,
    applied: [],
    skipped_existing: [],
    errors: [],
    dryRun: options.dryRun ?? true,
    mode: options.mode,
  };

  if (options.mode === 'apply' && (options.dryRun !== true)) {
    const toApply = candidates.filter(c => {
      if (options.applyCandidateIds?.includes(c.id)) return true;
      if (options.applyAllHighConfidence && c.confidenceLabel === 'high' && c.applyable) return true;
      return false;
    });
    for (const c of toApply) {
      const r = await applyEnhanceEdge(c);
      if (r.applied) result.applied.push(c.id);
      else if (r.reason === 'edge already exists') result.skipped_existing.push(c.id);
      else result.errors.push({ skillId: c.sourceSkillId, error: r.reason });
    }
  }

  return result;
}
```

**`handlers/skill-graph/propagate-enhances.ts`**
Wraps the public entry point with MCP-handler boilerplate matching `handlers/skill-graph/scan.ts` style.

**`tools/skill-graph-tools.ts` (modify)**
Add the tool spec:
```typescript
export const skillGraphPropagateEnhancesTool: Tool = {
  name: 'skill_graph_propagate_enhances',
  description: '[L7:Maintenance] Detect, report, and optionally apply missing inbound edges.enhances[] declarations across skills. Default mode: report (no writes).',
  inputSchema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      skillsRoot: { type: 'string', description: 'Defaults to .opencode/skills' },
      mode: { type: 'string', enum: ['report', 'propose', 'apply'], default: 'report' },
      minConfidence: { type: 'number', minimum: 0, maximum: 1, default: 0.75 },
      targetSkillIds: { type: 'array', items: { type: 'string' } },
      sourceSkillIds: { type: 'array', items: { type: 'string' } },
      applyCandidateIds: { type: 'array', items: { type: 'string' } },
      applyAllHighConfidence: { type: 'boolean', default: false },
      dryRun: { type: 'boolean', default: true },
    },
  },
};
```

### Data Flow

```text
Operator invokes skill_graph_propagate_enhances (MCP)
  |
  v
handlers/skill-graph/propagate-enhances.ts
  |
  v
lib/cross-skill-edges/index.ts: propagateInboundEnhances(options)
  |
  +-- loadAllSkillMetadata(skillsRoot)
  +-- detectInboundEnhances(skills, detectOpts)
  |     |
  |     +-- scoreFamilyInference(...)        -> max 0.45
  |     +-- scoreAssetShape(...)              -> max 0.30
  |     +-- scoreSiblingTransitivity(...)     -> max 0.15
  |     +-- inferEdgePayload(...)             -> weight + context + applyable
  |
  +-- (if mode === 'apply' && !dryRun) applyEnhanceEdge(candidate)
  |     |
  |     +-- read source graph-metadata.json
  |     +-- check idempotence (edge already exists?)
  |     +-- append new edge with auto-marker fields
  |     +-- write back
  |
  v
Return PropagateEnhancesResult { candidates, applied, skipped_existing, errors, ... }
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Module scaffold + types
- [ ] T001 Create `lib/cross-skill-edges/` directory
- [ ] T002 Author `types.ts` (all interfaces from §3)
- [ ] T003 Author `metadata-loader.ts` (load + group-by-family)
- [ ] T004 Verify TS compiles (`npm run typecheck`)

### Phase 2: Detection
- [ ] T005 Author `detect-inbound-enhances.ts` with family-inference scorer
- [ ] T006 Add asset-shape scorer (reads `enhance_when` from source)
- [ ] T007 Add sibling-transitivity scorer
- [ ] T008 Wire composite scorer + confidence cutoffs (high ≥ 0.80, medium ≥ 0.60, default threshold 0.75)
- [ ] T009 Add hasEnhanceEdge / hashCandidate / stableSort helpers

### Phase 3: Payload inference + apply
- [ ] T010 Author `context-template.ts` (inferEdgePayload + clipWeight + substituteTemplate + substituteProviderName)
- [ ] T011 Author `apply-graph-metadata-patch.ts` (idempotent JSON patcher + auto-marker fields)
- [ ] T012 Verify both modules compile

### Phase 4: Public entry + MCP wiring
- [ ] T013 Author `index.ts` (orchestration)
- [ ] T014 Author `handlers/skill-graph/propagate-enhances.ts` (MCP handler boilerplate)
- [ ] T015 Register tool in `tools/skill-graph-tools.ts`
- [ ] T016 Wire handler into `advisor-server.ts` tool router

### Phase 5: Tests + verification
- [ ] T017 Author `tests/cross-skill-edges.vitest.ts` with 3 fixtures (cli-family arrival, non-family, idempotent)
- [ ] T018 Add `enhance_when` field to sk-prompt graph-metadata.json (`skill_has_asset: assets/prompt_quality_card.md`)
- [ ] T019 Add `enhance_when` field to system-skill-advisor graph-metadata.json (`skill_has_files: [SKILL.md, graph-metadata.json]`)
- [ ] T020 Run `npm test` — 3 new fixtures PASS, no existing-tests regression
- [ ] T021 Manual smoke: invoke tool against repo, expect `candidates: []` (no drift today)
- [ ] T022 Synthetic smoke: temporarily remove cli-devin enhance from sk-prompt, expect 1 candidate at high confidence, apply it, verify idempotent re-run
- [ ] T023 Fill `implementation-summary.md` with file paths + LOC + verification table
- [ ] T024 Run `validate.sh --strict` on phase folder — expect 0 errors
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (pure detector) | `detectInboundEnhances` on fixture data | vitest |
| Unit (apply) | `applyEnhanceEdge` against tmp fixtures | vitest, tmp dir |
| Idempotence | apply same candidate twice → 1 edge, not 2 | vitest |
| Schema additive | parse a graph-metadata.json with `enhance_when` field through existing parser | vitest |
| Manual smoke | run MCP tool against live repo | bash + jq |

Fixture shapes:
- **Fixture A — cli-family arrival**: 5 synthetic skills (3 enhancer skills sk-foo/sk-bar/sk-baz + 1 newcomer cli-newfoo + 1 existing peer cli-existing). Expected: detector returns 2 candidates for cli-newfoo with confidence ≥ 0.80.
- **Fixture B — non-family arrival**: target skill not in any family the enhancers historically enhance. Expected: 0 candidates.
- **Fixture C — idempotent re-run**: apply a candidate, re-run detector with same options, expect 0 candidates because the edge now exists.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| system-skill-advisor existing modules (lib/skill-graph, lib/derived, handlers/) | Internal | Green | Reference patterns; no code-import dependency (separation per codex recommendation) |
| `@modelcontextprotocol/sdk` types | External | Green | Already in use across handlers/ |
| vitest | External | Green | Already configured (`package.json` test script) |
| sk-prompt + system-skill-advisor graph-metadata.json files | Internal | Green | Phase 5 T018/T019 modify these; small additive change |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: tests fail OR strict validate fails OR running the tool against current HEAD returns non-empty candidates (means false positive)
- **Procedure**:
  1. `git restore .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/` — remove the new module
  2. `git restore .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts` — remove handler
  3. `git restore .opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` `mcp_server/advisor-server.ts` — revert wiring
  4. `git restore .opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts` — remove tests
  5. `git restore .opencode/skills/sk-prompt/graph-metadata.json .opencode/skills/system-skill-advisor/graph-metadata.json` — revert enhance_when additions
  6. Update spec.md status to `Rolled Back`
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Scaffold + types) ──► Phase 2 (Detection) ──► Phase 3 (Apply) ──► Phase 4 (MCP wiring) ──► Phase 5 (Tests)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 1 | None | 2, 3, 4 |
| 2 | 1 | 4 |
| 3 | 1 | 4 |
| 4 | 1, 2, 3 | 5 |
| 5 | 4 | (terminal) |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| 1 — Scaffold + types | Low | 15-20 min |
| 2 — Detection | Medium | 45-60 min |
| 3 — Payload inference + apply | Medium | 30-45 min |
| 4 — MCP wiring | Low | 15-20 min |
| 5 — Tests + verification | Medium | 30-45 min |
| **Total** | | **~2.5-3.5 hours wall-clock for SWE-1.6** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Author on main (no feature branch)
- [x] Codex research saved as evidence
- [ ] All P0 checklist items verified before claiming completion
- [ ] Synthetic-removal smoke test executed AND restored

### Rollback Procedure
1. `rm -rf .opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/`
2. `git restore` the modified handler/tool/server files
3. `git restore` the 2 `enhance_when`-decorated graph-metadata.json files
4. Update implementation-summary.md with rollback record

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — pure TS module + 2 schema-additive jq patches that the existing parser already tolerates (no migration required to revert)
<!-- /ANCHOR:enhanced-rollback -->
