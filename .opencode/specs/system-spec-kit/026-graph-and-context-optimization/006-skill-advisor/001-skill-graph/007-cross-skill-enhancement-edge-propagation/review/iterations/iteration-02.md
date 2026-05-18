# Iteration 02 - Correctness — idempotence, hashCandidate stability, edge filter

## Focus
Correctness — idempotence, hashCandidate stability, edge filter

## Sources Read
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/detect-inbound-enhances.ts:1-246` (idempotence guard `hasEnhanceEdge`, `hashCandidate`, edgeType hardcode)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/apply-graph-metadata-patch.ts:1-58` (apply-side idempotence guard, auto-marker write)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/types.ts:1-112` (InboundEnhanceCandidate.id, edgeType literal)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/cross-skill-edges/index.ts:1-67` (batch apply orchestration, dryRun gating)
- `.opencode/skills/system-skill-advisor/mcp_server/tests/cross-skill-edges.vitest.ts:1-289` (Fixture C idempotence, edge-type filter test, weight clipping test)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/spec.md:1-247` (REQ-003, REQ-005, REQ-015)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/plan.md:1-603` (§3 architecture sketches)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/checklist.md:1-132` (CHK-FIX-001, CHK-FIX-002)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/implementation-summary.md:1-132` (claimed outcomes)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/deep-review-strategy.md:1-53` (iteration constraints)
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/007-cross-skill-enhancement-edge-propagation/review/iterations/iteration-01.md:1-152` (prior findings to avoid re-reporting)

## Findings

### F-02-001 [P2] `inferEdgePayload` enhance_when template path also returns empty blockers with `null` weight
- **Where**: `context-template.ts:107-113`
- **What**: When `inferEdgePayload` matches an `enhance_when` rule (asset-shape or files-match), it returns `blockers: []` regardless of whether `rule.weight` is a valid number. If `rule.weight` is `undefined` or `null`, `clipWeight()` returns `null` (line 55-56: `if (w == null) return null`), but no blocker is added. This means `applyable` becomes `true` with `weight: null`, violating the contract at `types.ts:31` (`weight: number | null` — allowed by the type, but `types.ts:38` says `applyable` is `false when weight or context not deterministically inferrable`). Iteration 01's F-01-006 reported the same vulnerability through the same-family exemplar fallback path (lines 116-145); this is the enhance_when template path (lines 102-114) with the same gap.
- **Why it matters**: An `enhance_when` rule matching a target but lacking an explicit `weight` field would produce an `applyable: true` candidate with `weight: null`. If applied, `applyEnhanceEdge` writes `weight: null` into the JSON (line 43), potentially breaking downstream consumers that expect numeric weights. Currently, both declared `enhance_when` rules (sk-prompt and system-skill-advisor) provide explicit weights, so this cannot trigger in production today — but the code path is unprotected against future rules that omit `weight`.
- **Evidence**:
  ```typescript
  // context-template.ts:102-113
  for (const rule of rules) {
    const assetMatch = rule.skill_has_asset && targetHasFile(target, rule.skill_has_asset);
    const filesMatch = rule.skill_has_files && rule.skill_has_files.every(f => targetHasFile(target, f));
    if (assetMatch || filesMatch) {
      return {
        weight: clipWeight(rule.weight),    // ← null if rule.weight is undefined/null
        context: substituteTemplate(rule.context_template ?? '', target),
        blockers: [],                       // ← empty despite potential null weight
      };
    }
  }
  ```
  ```typescript
  // context-template.ts:55-57
  function clipWeight(w: number | null | undefined): number | null {
    if (w == null) return null;             // ← null passthrough
    return Math.min(0.7, Math.max(0.3, w));
  }
  ```
  ```typescript
  // types.ts:38
  applyable: boolean;  // false when weight or context not deterministically inferrable
  ```
- **Fix suggestion**: After the `clipWeight(rule.weight)` call, add a weight-null check:
  ```typescript
  const weight = clipWeight(rule.weight);
  return {
    weight,
    context: substituteTemplate(rule.context_template ?? '', target),
    blockers: weight == null ? ['weight not provided by enhance_when rule'] : [],
  };
  ```
  Alternatively, make `weight` required in the `EnhanceWhenRule` interface (currently optional at `types.ts:110`) so TypeScript catches missing weights at compile time.
- **REQ trace**: REQ-011 (edge weight clipped to [0.3, 0.7]), types.ts:38 (applyable contract), extends F-01-006 to the enhance_when path

## Idempotence Trace (REQ-003) — verified, no new findings

The full idempotence chain was traced end-to-end:

| Layer | Location | Mechanism | Verdict |
|-------|----------|-----------|---------|
| Detection guard | `detect-inbound-enhances.ts:58-61` | `hasEnhanceEdge(source, target.skillId)` checks `source.edges?.enhances` for matching `e.target` | PASS |
| Detection skip | `detect-inbound-enhances.ts:209` | `if (hasEnhanceEdge(source, target.skillId)) continue;` | PASS |
| Apply guard | `apply-graph-metadata-patch.ts:37-39` | Re-reads file from disk, checks `enhances.some(e => e.target === candidate.targetSkillId)` | PASS |
| Apply batch guard | `apply-graph-metadata-patch.ts:37-39` | Each `applyEnhanceEdge` call re-reads disk, so sequential applies in the same batch (via `applyAllHighConfidence`) catch edges written by prior calls | PASS |
| Test coverage | `cross-skill-edges.vitest.ts:169-228` | Fixture C: detect → apply → re-detect yields 0 candidates | PASS |

Both guards use the same matching predicate (`e.target === targetSkillId/candidate.targetSkillId`) against the `enhances` array only. The match is consistent between detection (in-memory) and apply (on-disk read). No gap found.

## hashCandidate Stability (REQ-015) — verified, no new findings

- **Implementation** (`detect-inbound-enhances.ts:66-69`): SHA-256 of `"${sourceSkillId}->${targetSkillId}->enhances"`, truncated to 16 hex chars.
- **Determinism**: `createHash('sha256')` from `node:crypto` produces identical output for identical input. The "->" delimiter prevents ambiguity (skill IDs are folder names and cannot contain "->").
- **Collision risk**: For ~20 skills producing ~400 possible pairs, the 64-bit keyspace (16 hex chars) has birthday collision probability ≈ 4.35×10⁻¹⁵. Negligible.
- **Usage**: Candidate IDs are stable across runs because they depend only on source/target skill IDs (not paths, not timestamps, not scoring). An operator can reference a candidate by ID across detect/apply invocations.
- **Test coverage**: IDs are implicitly exercised by Fixture C (applyCandidateIds would use hash-based IDs in production), though no unit test directly calls `hashCandidate` in isolation. The function is not exported, so library-consumer tests can't unit-test it directly — this is acceptable for a private helper.

## Edge-Type Filter (REQ-005) — verified, no new findings

- **Hardcode** (`detect-inbound-enhances.ts:231`): `edgeType: 'enhances'` is a literal string, never derived from scoring rules or input data. All three scoring functions (`scoreFamilyInference`, `scoreAssetShape`, `scoreSiblingTransitivity`) compute evidence for the `enhances` edge type — they never suggest other edge types.
- **Type-level enforcement**: `InboundEnhanceCandidate.edgeType` is the literal type `'enhances'` (types.ts:30). TypeScript rejects assignment of any other string.
- **Construction defense**: The detection loop only examines `source.edges?.enhances` (line 59, 103, 168). It never reads `depends_on`, `siblings`, `conflicts_with`, or `prerequisite_for`. Even if a bug introduced wrong edge types, the detection data sources would not produce them.
- **Test coverage** (`cross-skill-edges.vitest.ts:230-257`): Test `'emits only enhances edge type'` sets `minConfidence: 0.0` to emit all possible candidates, then asserts every candidate has `edgeType: 'enhances'`. The test exercises the candidate constructor path at line 231 where `edgeType` is set.

## New Info Ratio
1 new weighted finding this iteration. 1 total finding considered. **newInfoRatio: 1.00**. The single finding (F-02-001) is a P2 extension of iteration 01's F-01-006 to a different code path. No P0 or P1 findings in the idempotence, hashCandidate stability, or edge-type filter areas — these three focus areas are implemented correctly and consistently.

## Quality Gates
- **Evidence**: pass — every finding cites file:line with quoted code and surrounding context
- **Scope**: pass — all files in the review scope were read; focus-area files re-read for deep tracing
- **Coverage**: D1 (Correctness) — idempotence (detection + apply + batch), hashCandidate determinism + collision analysis, edge-type filter (hardcode + type system + test), REQ-003/REQ-005/REQ-015 end-to-end trace

## Convergence Signal
approaching-convergence — this iteration focused on a narrow correctness slice (idempotence + hash + edge filter) and found only one new P2 issue (extension of prior F-01-006). Combined with iteration 01's 6 P2 findings, the total is 7 P2 findings with zero P0/P1. The core correctness areas (idempotence, hash stability, edge filtering) are solid. Remaining dimensions: D2 (Security — path traversal in apply mode, JSON parse resilience), D3 (Traceability — REQ-to-code mapping), D4 (Maintainability — naming, dead code, error clarity).
