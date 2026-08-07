# Iteration 04 — Traceability — REQ-001..REQ-007 (P0) coverage

## Focus
Traceability — REQ-001..REQ-007 (P0) coverage

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:1-75`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/index.ts:1-8`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:1-145`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289`
- `.opencode/skills/sk-prompt/graph-metadata.json:1-178`
- `.opencode/skills/system-skill-advisor/graph-metadata.json:1-208`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/spec.md:1-247`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/plan.md:1-603`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/checklist.md:1-132`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/implementation-summary.md:1-132`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/deep-review-strategy.md:1-53`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-01.md:1-152`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-02.md:1-101`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-03.md:1-182`

## Findings

### F-04-001 [P1] REQ-002 high-confidence path has zero automated test coverage — validated only by manual smoke
- **Where**: `cross-skill-edges.vitest.ts:1-289` (entire file — no test fixture produces confidence ≥ 0.80)
- **What**: REQ-002 acceptance criteria state: *"Test fixture removes the sk-prompt → cli-devin edge from sk-prompt/graph-metadata.json; detector returns 1 candidate with confidence ≥ 0.80 and source sk-prompt"*. None of the 5 vitest tests produce a candidate above 0.30 confidence. Fixture A uses `minConfidence: 0.25` and only triggers asset-shape scoring (0.30 contribution). Fixtures B and C likewise never reach the high-confidence threshold. The family-inference scorer (max 0.45) is never triggered in any test because the synthetic enhancer skills have 0 or <3 existing enhances entries. Sibling-transitivity (max 0.15) is likewise untested. The only validation of the high-confidence composite path is manual smoke 2 (CHK-023), which is not repeatable by CI and depends on production state.
- **Why it matters**: REQ-002 is a P0 requirement. Without an automated test exercising the full composite scoring pipeline (family-inference + asset-shape + sibling-transitivity → confidence ≥ 0.80), a regression in any scorer goes undetected. The spec explicitly calls for a "Test fixture" for this scenario, not manual smoke.
- **Evidence**:
  ```typescript
  // cross-skill-edges.vitest.ts:108 — Fixture A threshold too low for high-confidence
  const candidates = detectInboundEnhances(skills, { minConfidence: 0.25 });
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:63 — misleading test name (already flagged F-01-004)
  it('Fixture A: cli-family arrival → 2 high-confidence candidates', async () => {
  ```
  ```markdown
  # spec.md:129 — REQ-002 acceptance criterion
  | REQ-002 | ...detector returns 1 candidate with confidence ≥ 0.80 and source sk-prompt |
  ```
  ```markdown
  # implementation-summary.md:118
  Manual smoke 2 (synthetic-removal round-trip) — PASS (found high-confidence candidate...)
  ```
  No vitest test fixture exists for the "synthetic removal → high-confidence detection" scenario.
- **Fix suggestion**: Add a test fixture that creates a real family-inference scenario: build 5 skills in the same target family, have the source skill enhance 3+ of them (≥ 50% share), then add a new target in that family with matching assets. Assert at least one candidate with `confidence >= 0.80` and `confidenceLabel: 'high'`. Alternatively, assert that `detectInboundEnhances` with `minConfidence: 0.80` returns ≥ 1 candidate.
- **REQ trace**: REQ-002

### F-04-002 [P1] REQ-004 auto-marker fields not verified by automated test round-trip
- **Where**: `cross-skill-edges.vitest.ts:210-226` (Fixture C — applies edge but never re-reads JSON to verify auto-marker fields)
- **What**: REQ-004 is a P0 requirement: *"New edges in source graph-metadata.json carry auto_added_at (ISO 8601 UTC) and auto_added_reason (provenance string)"*. The code writes these fields (`apply-graph-metadata-patch.ts:45-46`), and the production edge at `system-skill-advisor/graph-metadata.json:104-105` confirms they exist. However, no automated test re-reads the patched `graph-metadata.json` after `applyEnhanceEdge` to assert that `auto_added_at` and `auto_added_reason` are present, correctly formatted, and survive the JSON read-write round-trip. Fixture C at line 214 only asserts `expect(applyResult.applied).toBe(true)` — it trusts the return value, not the on-disk state.
- **Why it matters**: If a future refactor to `applyEnhanceEdge` omits or renames auto-marker fields, the existing test suite would not catch it. The return value `{ applied: true }` confirms the write was attempted, not that the write contained the correct fields.
- **Evidence**:
  ```typescript
  // cross-skill-edges.vitest.ts:213-216 — only checks return value, not disk state
  if (candidate) {
    const applyResult = await applyEnhanceEdge(candidate);
    expect(applyResult.applied).toBe(true);  // ← no follow-up read
  }
  ```
  ```typescript
  // apply-graph-metadata-patch.ts:45-46 — fields ARE written correctly
  auto_added_at: new Date().toISOString(),
  auto_added_reason: candidate.rules.map(r => `${r.rule}:${r.contribution.toFixed(2)}`).join(' + '),
  ```
  ```json
  // system-skill-advisor/graph-metadata.json:104-105 — production evidence they exist
  "auto_added_at": "2026-05-15T14:10:44.259Z",
  "auto_added_reason": "family-inference:0.45 + asset-shape:0.30 + sibling-transitivity:0.15"
  ```
- **Fix suggestion**: After `applyEnhanceEdge` in Fixture C, read the patched file with `readFileSync`, parse JSON, find the edge by `target: 'cli-new'`, and assert:
  ```typescript
  const raw = readFileSync(candidate.sourcePath, 'utf8');
  const parsed = JSON.parse(raw);
  const edge = parsed.edges.enhances.find((e: any) => e.target === 'cli-new');
  expect(edge.auto_added_at).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
  expect(edge.auto_added_reason).toBe('asset-shape:0.30');
  ```
- **REQ trace**: REQ-004

### F-04-003 [P2] `handleTool` for `skill_graph_propagate_enhances` passes args with `as unknown` cast, bypassing TypeScript validation — unlike sibling tools
- **Where**: `skill-graph-tools.ts:140-141`
- **What**: The dispatch for `skill_graph_propagate_enhances` uses `args as unknown as Parameters<typeof handleSkillGraphPropagateEnhances>[0]`, which is a double-cast that renders TypeScript type-checking ineffective for runtime input validation. Contrast this with `skill_graph_query` (lines 130-134), which calls `getMissingRequiredStringArgs(args, ['queryType'])` before dispatching. The propagate-enhances handler has no required args, so missing-field validation isn't needed, but the `as unknown` cast means malformed inputs (e.g., `mode: 'invalid'`) reach the handler without compile-time detection and rely entirely on the handler's own `??` defaults at line 57 (`args.mode ?? 'report'`) to silently coerce.
- **Why it matters**: If a future caller passes a typo'd field through the MCP protocol (e.g., `mode: 'reprot'`), the handler silently defaults to `'report'` instead of surfacing a validation error. The `as unknown` cast prevents TypeScript from catching type mismatches between the tool's `inputSchema` and the handler's `PropagateEnhancesArgs` interface. This is a defense-in-depth gap — the tool schema is the runtime contract, but the TypeScript layer doesn't enforce it.
- **Evidence**:
  ```typescript
  // skill-graph-tools.ts:140-141 — double-cast avoids type checking
  case 'skill_graph_propagate_enhances':
    return toMCP(await handleSkillGraphPropagateEnhances(
      args as unknown as Parameters<typeof handleSkillGraphPropagateEnhances>[0], callerContext));
  ```
  ```typescript
  // skill-graph-tools.ts:130-134 — sibling tool validates args properly
  case 'skill_graph_query': {
    const missingKeys = getMissingRequiredStringArgs(args, ['queryType']);
    if (missingKeys.length > 0) {
      return validationError(name, missingKeys);
    }
  ```
  ```typescript
  // propagate-enhances.ts:57 — handler silently defaults invalid mode
  mode: args.mode ?? 'report',
  ```
- **Fix suggestion**: Add runtime validation matching the tool's `inputSchema` before dispatching, or at minimum validate `mode` against `['report', 'propose', 'apply']` and reject unknown values.
- **REQ trace**: REQ-006 (tool input validation hygiene)

### F-04-004 [P2] `propagateInboundEnhances` filter block (`applyCandidateIds` / `applyAllHighConfidence`) has zero automated test coverage
- **Where**: `index.ts:44-52`
- **What**: The orchestration function `propagateInboundEnhances` contains a filter block that selects candidates for application based on `applyCandidateIds` (explicit ID list) and `applyAllHighConfidence` (auto-select high-confidence candidates). The vitest tests (`cross-skill-edges.vitest.ts`) never call `propagateInboundEnhances` — they import `detectInboundEnhances` and `applyEnhanceEdge` directly. The `applyAllHighConfidence` filter at line 50 (`c.confidenceLabel === 'high' && c.applyable`) and the `applyCandidateIds` filter at line 48 are exercised only by the unverified manual smoke tests.
- **Why it matters**: Both `applyCandidateIds` and `applyAllHighConfidence` are documented in the tool schema (`skill-graph-tools.ts:78-79`) and documented in the spec as apply-mode gates (spec.md:85: "Apply requires explicit candidate IDs or applyAllHighConfidence flag"). Without test coverage, a typo in the filter logic (e.g., `c.applyable` vs `c.applicable`) would silently produce zero applied edges with no error.
- **Evidence**:
  ```typescript
  // index.ts:44-52 — filter block with zero test coverage
  if (options.mode === 'apply' && (options.dryRun !== true)) {
    const toApply = candidates.filter(c => {
      if (options.applyCandidateIds?.includes(c.id)) return true;
      if (options.applyAllHighConfidence && c.confidenceLabel === 'high' && c.applyable) return true;
      return false;
    });
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:9 — tests only import detectInboundEnhances, never propagateInboundEnhances
  import { detectInboundEnhances } from '../lib/cross-skill-edges/detect-inbound-enhances.js';
  ```
- **Fix suggestion**: Add a vitest test that calls `propagateInboundEnhances` with `mode: 'apply', dryRun: false, applyAllHighConfidence: true` against a fixture where a high-confidence candidate exists, and asserts `result.applied.length >= 1`.
- **REQ trace**: REQ-003 (apply-mode idempotence through full orchestration path)

### F-04-005 [P2] `dryRun` default behavior has no test confirming it blocks writes
- **Where**: `index.ts:45`
- **What**: The `dryRun` gate at line 45 (`options.dryRun !== true`) defaults `dryRun` to `true` (line 40: `options.dryRun ?? true`), which is safe — omitting the flag prevents writes. However, no automated test verifies that calling `propagateInboundEnhances` with `mode: 'apply'` but WITHOUT `dryRun: false` results in zero applied edges. The tool schema at `skill-graph-tools.ts:80` declares `"default": true`, but the code path that enforces this is untested.
- **Why it matters**: The `dryRun: true` default is the primary safety gate preventing destructive writes. If a future change accidentally defaults `dryRun` to `false` (e.g., switching `??` to `||` and `options.dryRun` being `undefined`), no test would catch the regression.
- **Evidence**:
  ```typescript
  // index.ts:40, 45 — dryRun default + guard
  dryRun: options.dryRun ?? true,         // line 40: default true
  if (options.mode === 'apply' && (options.dryRun !== true)) {  // line 45: gate
  ```
  ```typescript
  // skill-graph-tools.ts:80 — schema declares default
  dryRun: { type: 'boolean', default: true },
  ```
- **Fix suggestion**: Add a test: call `propagateInboundEnhances({ mode: 'apply', skillsRoot: tmpDir })` without `dryRun: false` and assert `result.applied.length === 0`.
- **REQ trace**: REQ-014 (dryRun default true)

### F-04-006 [P2] REQ-001 and REQ-002 validated only by manual smoke tests — production-state-dependent and non-repeatable
- **Where**: `implementation-summary.md:117-118` (manual smoke entries) vs `cross-skill-edges.vitest.ts:1-289` (no automated equivalent)
- **What**: Both REQ-001 ("0 candidates against current HEAD") and REQ-002 ("confidence ≥ 0.80 after synthetic removal") are P0 requirements validated exclusively by manual smoke tests. REQ-001's criterion depends on the exact set of skills in the production repo — any future skill added to the codebase with missing `enhances` edges silently violates this invariant. REQ-002's synthetic-removal test requires temporarily mutating `sk-prompt/graph-metadata.json` (the real file) — not a synthetic fixture — which is inherently a manual operation that cannot run in CI.
- **Why it matters**: These are P0 acceptance criteria (checklist CHK-022, CHK-023 are both P0 for manual smoke, but the spec language uses "Test fixture" for REQ-002, implying automated coverage). The checklist item CHK-020 says "All 3 vitest fixtures PASS" but those 3 fixtures alone do not satisfy REQ-001 or REQ-002. The implementation-summary checks off REQ-001 and REQ-002 based on manual operations, but neither has an automated regression guard. If detection logic changes and the tool returns non-zero candidates against HEAD or fails to detect a synthetic gap at high confidence, CI will not catch it.
- **Evidence**:
  ```markdown
  # spec.md:131 — REQ-001 acceptance
  propagateInboundEnhances({ mode: 'report' }) returns candidates: []
  ```
  ```markdown
  # spec.md:132 — REQ-002 acceptance (language says "Test fixture")
  Test fixture removes the sk-prompt → cli-devin edge from sk-prompt/graph-metadata.json
  ```
  ```markdown
  # implementation-summary.md:117-118
  Manual smoke 1 (HEAD = 0 candidates) — PASS
  Manual smoke 2 (synthetic-removal round-trip) — PASS
  ```
  ```markdown
  # checklist.md:73-74
  CHK-022 [P0] Manual smoke 1 verified... CHK-023 [P1] Manual smoke 2 verified...
  ```
- **Fix suggestion**: REQ-001 cannot be fully automated (it depends on production state), but the checklist should acknowledge this as a "manual-only" P0 item. For REQ-002, add a vitest fixture that constructs the synthetic-removal scenario entirely from synthetic skills (not touching real `graph-metadata.json` files): build skills with real family-inference data (source enhances 3+ peers in target's family at 50%+), then detect with `minConfidence: 0.80` and assert ≥ 1 high-confidence candidate.
- **REQ trace**: REQ-001, REQ-002

## REQ-001..REQ-007 Traceability Matrix

| REQ | P0/P1 | Code Evidence | Test Evidence | Verdict |
|-----|-------|---------------|---------------|---------|
| REQ-001 | P0 | `detect-inbound-enhances.ts:193-246` — detector returns candidates filtered by `hasEnhanceEdge` guard at line 209 | Manual smoke only (CHK-022). No automated test. | PASS (manual) / GAP (automated) |
| REQ-002 | P0 | `detect-inbound-enhances.ts:212-222` — composite scoring across all 3 scorers | Manual smoke only (CHK-023). No vitest fixture produces conf ≥ 0.80. | PASS (manual) / GAP (automated) |
| REQ-003 | P0 | `detect-inbound-enhances.ts:209` (detect guard) + `apply-graph-metadata-patch.ts:37` (apply guard) | Fixture C at `cross-skill-edges.vitest.ts:169-228` | PASS |
| REQ-004 | P0 | `apply-graph-metadata-patch.ts:45-46` writes auto_added_at + auto_added_reason. Production evidence at `system-skill-advisor/graph-metadata.json:104-105` | None — Fixture C does not re-read JSON after apply | PASS (code) / GAP (test) |
| REQ-005 | P0 | `detect-inbound-enhances.ts:231` — edgeType literal `'enhances'`. Type-level enforcement at `types.ts:30` | Edge-type filter test at `cross-skill-edges.vitest.ts:230-257` | PASS |
| REQ-006 | P0 | `skill-graph-tools.ts:66-83, 90, 140-141` — tool registered + dispatched. `handlers/skill-graph/index.ts:8` — handler exported | No integration test. `advisor-server.ts` wiring not in review scope | LIKELY PASS (code) / UNVERIFIED (server wiring) |
| REQ-007 | P0 | `metadata-loader.ts:96-99` — schema_version 1 or 2 only. `metadata-loader.ts:128-132` — enhance_when optional, ignored by existing code | Implicit — parser tolerates field. No explicit test. | PASS |

## Non-Findings (Verified as PASS)

### Family-inference self-enhance guard (REQ-005 related)
- **Status**: PASS
- `scoreFamilyInference` at `detect-inbound-enhances.ts:98-99` correctly returns `contribution: 0` when `source.family === target.family`. This prevents skills in the same family from suggesting enhance edges to each other via family-inference. Asset-shape can still fire (which is correct — an enhancer in `sk-util` family might still enhance a `sk-util` sibling if asset-shape matches).

### `enhance_when` field format consistency between sk-prompt and system-skill-advisor
- **Status**: PASS
- Both `enhance_when` fields match their respective `EnhanceWhenRule` types. `sk-prompt/graph-metadata.json:45-49` uses `skill_has_asset`, `weight`, `context_template`. `system-skill-advisor/graph-metadata.json:200-207` uses `skill_has_files`, `weight`, `context_template`. Both provide explicit `weight` values (0.4 and 0.7). No null-weight edge case.

### NO `advisor-server.ts` in review scope
- **Status**: NOTED (not a finding)
- `advisor-server.ts` is listed in spec.md "Files to Change" but is NOT in this iteration's review scope. It is also absent from the implementation-summary "Files Changed" table. The tool is registered in `skill-graph-tools.ts` and dispatched in `handleTool`; whether the MCP server framework picks up `skillGraphToolDefinitions` automatically or requires wiring in `advisor-server.ts` cannot be verified within this iteration's scope. This is an informational gap, not a finding about the code reviewed.

## New Info Ratio
6 new weighted findings this iteration. All 6 are novel — no overlap with iteration 01 (correctness/scoring), iteration 02 (idempotence/hash/edge filter), or iteration 03 (security/path traversal). **newInfoRatio: 1.00**.

New weighted findings this iteration: 6. Any weighted findings considered: 6.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code; adversarial self-check verified all 7 REQ claims against actual source and test files; traceability matrix maps each REQ to code + test evidence
- **Scope**: pass — all 13 files in the review scope were read and analyzed; edge-case re-reads performed for the 7 P0 REQ trace paths
- **Coverage**: D3 (Traceability) — REQ-001..REQ-007 mapped to code lines, test lines, and checklist items. Automated-test gaps identified for REQ-001, REQ-002, REQ-004. REQ-003 and REQ-005 have complete automated coverage. REQ-006 and REQ-007 have partial coverage.

## Convergence Signal
not-converged — 4 P1 findings (F-04-001, F-04-002) in the test-coverage dimension for P0 requirements; 4 P2 findings in tool hygiene and dryRun guard coverage. This is the first traceability-focused iteration. Combined with prior iterations (7 total P2 from D1, 1 P2 + 1 P1 from D2, 2 P1 + 4 P2 from D3), the remaining uncovered dimension is D4 (Maintainability — naming, dead code resolution, error message clarity, function-level JSDoc). Recommend iteration 05 cover D4.
