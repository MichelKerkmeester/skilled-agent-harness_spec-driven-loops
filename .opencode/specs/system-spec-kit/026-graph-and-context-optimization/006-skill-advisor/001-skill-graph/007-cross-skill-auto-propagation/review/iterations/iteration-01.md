# Iteration 01 - Correctness — composite scoring math + detection logic

## Focus
Correctness — composite scoring math + detection logic

## Sources Read
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/spec.md` (full — REQ-001..REQ-016)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/plan.md` (full — §3 TypeScript sketches)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/checklist.md` (full — P0/P1/P2 items)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/implementation-summary.md` (full — claimed outcomes)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-auto-propagation/review/deep-review-strategy.md` (full)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/metadata-loader.ts:1-193`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/context-template.ts:1-146`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58`
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:1-75`
- `.opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/index.ts:1-8`
- `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts:55-145`
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289`
- `.opencode/skills/system-skill-advisor/graph-metadata.json:1-208`
- `.opencode/skills/sk-prompt/graph-metadata.json:1-178`

## Findings

### F-01-001 [P2] Family-inference contribution not clamped — can exceed stated max 0.45 with duplicate edges
- **Where**: `detect-inbound-enhances.ts:121`
- **What**: `const contribution = 0.45 * familyShare;` applies no upper-bound clamp. Under normal data, `familyShare ≤ 1.0` because `sameFamilyTargets` (line 108) excludes the target (blocked by `hasEnhanceEdge` at line 209) and the denominator equals `familyPeers - 1`. However, if a source's `edges.enhances[]` contains duplicate entries to the same family peer, `sameFamilyTargets.length` can exceed `denominator`, pushing `familyShare > 1.0` and `contribution > 0.45`. REQ-010 states "Family contribution ≤ 0.45" as a hard constraint.
- **Why it matters**: Violates spec REQ-010 invariant. In the worst case (family with 2 members, denominator=1, source with 2 duplicate edges to the peer), contribution reaches 0.90 from family-inference alone, inflating composite confidence above the intended 0.90 maximum (0.45+0.30+0.15).
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:107-121
  const targetFamilyPeers = byFamily.get(target.family) ?? [];
  const sameFamilyTargets = sourceEnhances.filter(e => {
    return targetFamilyPeers.some(s => s.skillId === e.target);
  });
  // ...no deduplication of sameFamilyTargets...
  const familyShare = sameFamilyTargets.length / denominator;
  // ...
  const contribution = 0.45 * familyShare;  // ← no Math.min(0.45, ...)
  ```
- **Fix suggestion**: Either deduplicate `sameFamilyTargets` by target skill ID before counting (`Array.from(new Set(sameFamilyTargets.map(e => e.target)))`) or clamp contribution: `Math.min(0.45, 0.45 * familyShare)`.
- **REQ trace**: REQ-010 ("Family contribution ≤ 0.45")

### F-01-002 [P2] Dead code: `allEqual` and `medianOf` defined but never called in detect-inbound-enhances.ts
- **Where**: `detect-inbound-enhances.ts:36-53`
- **What**: Functions `allEqual` (lines 36-40) and `medianOf` (lines 45-53) are declared locally but never invoked within this module. They are used exclusively in `context-template.ts` (which defines its own copies at lines 33-50). These are unreachable/dead code in `detect-inbound-enhances.ts`.
- **Why it matters**: Suggests to readers that these helpers participate in detection logic when they don't. If one copy is fixed in the future and the other isn't, divergence risks subtle bugs.
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:36-53 — allEqual + medianOf declared,
  // but grep of this file shows zero call sites
  function allEqual<T>(values: T[]): boolean { /* ... */ }
  function medianOf(values: number[]): number { /* ... */ }
  ```
- **Fix suggestion**: Remove `allEqual` and `medianOf` from `detect-inbound-enhances.ts`. They are provided by `context-template.ts` where actually needed.

### F-01-003 [P2] Misleading JSDoc: `detectInboundEnhances` claims "no I/O" but reaches filesystem
- **Where**: `detect-inbound-enhances.ts:191-193`
- **What**: The JSDoc states `"Pure function - no I/O"`, but the function calls `scoreAssetShape` (line 213) and `inferEdgePayload` (line 225), both of which invoke `targetHasFile` → `existsSync` (a synchronous filesystem check). The function is NOT pure.
- **Why it matters**: If a future caller assumes zero side effects (e.g., embedding this in a hot path or sandboxed pipeline), the unexpected `existsSync` calls may cause permission errors or performance surprises.
- **Evidence**:
  ```typescript
  // detect-inbound-enhances.ts:191-193
  /**
   * Detect missing inbound enhances edges across all skills.
   * Pure function - no I/O. Returns candidates sorted by confidence.
   */
  export function detectInboundEnhances(
  ```
  ```typescript
  // detect-inbound-enhances.ts:27-31 — reachable via scoreAssetShape + inferEdgePayload
  function targetHasFile(target: SkillMetadataRecord, filePath: string): boolean {
    return existsSync(absolutePath);  // ← fs I/O
  }
  ```
- **Fix suggestion**: Update JSDoc to `"Deterministic function — may check filesystem for asset-shape matching"`.

### F-01-004 [P2] Test Fixture A description claims "high-confidence" but candidates have confidence 0.30 (low)
- **Where**: `cross-skill-edges.vitest.ts:63`
- **What**: The `it()` description says `"Fixture A: cli-family arrival → 2 high-confidence candidates"`. However, the test sets `minConfidence: 0.25` (line 108), and only the asset-shape scorer fires (contribution 0.30). The `confidenceLabel` threshold for "high" is ≥0.80 (detect-inbound-enhances.ts:235). The candidates actually have `confidenceLabel: 'low'` at 0.30 confidence.
- **Why it matters**: Misleading test documentation. A reader skimming test names might believe this validates the high-confidence code path when it actually validates low-confidence asset-shape detection only. The family-inference scorer (max 0.45) is only minimally tested — the synthetic fixtures never trigger its ≥3 enhances threshold (the enhancer skills in the fixture have 0 enhances entries).
- **Evidence**:
  ```typescript
  // cross-skill-edges.vitest.ts:63
  it('Fixture A: cli-family arrival → 2 high-confidence candidates', async () => {
  ```
  ```typescript
  // cross-skill-edges.vitest.ts:108
  const candidates = detectInboundEnhances(skills, { minConfidence: 0.25 });
  ```
  ```typescript
  // detect-inbound-enhances.ts:235
  confidenceLabel: confidence >= 0.80 ? 'high' : confidence >= 0.60 ? 'medium' : 'low',
  ```
- **Fix suggestion**: Correct test description to `"2 asset-shape candidates (low confidence)"`. Optionally add a separate test that actually triggers family-inference scoring with ≥3 enhances entries to validate the "high" confidence path.
- **REQ trace**: REQ-010 (confidence cutoffs), REQ-002 (high-confidence gap detection)

### F-01-005 [P2] Utility function duplication across `detect-inbound-enhances.ts` and `context-template.ts`
- **Where**: `detect-inbound-enhances.ts:27-53` AND `context-template.ts:24-50`
- **What**: Four helper functions — `targetHasFile`, `asArray`, `allEqual`, `medianOf` — are duplicated identically (or near-identically) across the two modules. This creates a maintenance hazard: changes to one copy won't propagate to the other.
- **Why it matters**: Already partially manifested: `allEqual` and `medianOf` in `detect-inbound-enhances.ts` are dead code (F-01-002). A future fix to `context-template.ts`'s `medianOf` (e.g., adding NaN handling) would leave the dead copy in `detect-inbound-enhances.ts`, creating confusion and inconsistency risk.
- **Evidence**:
  ```
  Duplicated symbols:
    asArray:        detect-inbound-enhances.ts:20 | context-template.ts:17
    targetHasFile:  detect-inbound-enhances.ts:27 | context-template.ts:24
    allEqual:       detect-inbound-enhances.ts:36 | context-template.ts:33
    medianOf:       detect-inbound-enhances.ts:45 | context-template.ts:42
  ```
- **Fix suggestion**: Extract shared utilities to a small `lib/cross-skill-edges/helpers.ts` and import from both modules. Or, if the plan intentionally keeps modules self-contained, at minimum remove the dead copies in `detect-inbound-enhances.ts` (F-01-002).

### F-01-006 [P2] `inferEdgePayload` doesn't block on null weight — `applyable` contract gap with malformed data
- **Where**: `context-template.ts:92-145`
- **What**: When inferring edge payload from same-family exemplars (the fallback path at lines 116-145), `stableWeight` can be `undefined` if all exemplar edges lack a `weight` field or have non-numeric weights. `clipWeight(undefined)` returns `null` (line 56). However, no blocker is added for null weight — only `'no same-family exemplar'` and `'context not deterministically inferrable'` are possible blockers. This means `applyable` (blockers.length === 0; detect-inbound-enhances.ts:239) can be `true` with `weight: null`, violating the spec contract at types.ts:38: `"applyable: false when weight or context not deterministically inferrable"`.
- **Why it matters**: An applied edge with `weight: null` would be written into `graph-metadata.json` by `applyEnhanceEdge` (apply-graph-metadata-patch.ts:43), which writes `candidate.weight` without null-checking. The downstream skill advisor (which reads edge weights as numbers) may encounter a null reference. In practice, this requires malformed source `graph-metadata.json` (edges without numeric `weight` fields), which the `metadata-loader.ts` does not validate at runtime (it uses type assertions without guard clauses).
- **Evidence**:
  ```typescript
  // context-template.ts:55-57
  function clipWeight(w: number | null | undefined): number | null {
    if (w == null) return null;
    return Math.min(0.7, Math.max(0.3, w));
  }
  ```
  ```typescript
  // context-template.ts:122-123, 141-142
  const stableWeight = allEqual(weights) ? weights[0] : medianOf(weights);
  // ...
  return {
    weight: clipWeight(stableWeight),  // null if stableWeight is undefined
    context,
    blockers,  // no weight-related blocker added
  };
  ```
  ```typescript
  // types.ts:38-39
  applyable: boolean;  // false when weight or context not deterministically inferrable
  ```
- **Fix suggestion**: After computing `stableWeight` and before the return, add: `if (stableWeight == null || typeof stableWeight !== 'number') blockers.push('weight not deterministically inferrable')`.
- **REQ trace**: types.ts:38-39 (applyable contract), REQ-011 (edge weight inference)

## New Info Ratio
6 new weighted findings this iteration. 6 total findings considered. **newInfoRatio: 1.00** (first iteration — all findings are novel). All findings are P2. No P0 or P1 blockers found in the composite scoring math or detection logic.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code
- **Scope**: pass — all files in the review scope were read and analyzed
- **Coverage**: D1 (Correctness) — composite scoring math verified against plan §3; detection logic traced end-to-end; confidence cutoffs confirmed; edge-type filter confirmed; idempotence guard verified; weight clipping confirmed

## Convergence Signal
not-converged — first iteration with 6 P2 findings (primarily robustness and code hygiene). D2 (Security), D3 (Traceability), and D4 (Maintainability) dimensions not yet covered. Recommend next iteration focus on path traversal safety in apply mode + JSON parse resilience (D2 Security).
