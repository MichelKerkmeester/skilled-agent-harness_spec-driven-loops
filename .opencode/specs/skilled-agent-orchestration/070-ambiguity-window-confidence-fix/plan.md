---
title: "Implementation Plan: Ambiguity Window Confidence Fix"
description: "Plan for adding the confidence-margin parallel check to lib/scorer/ambiguity.ts so cross-domain prompts surface as ambiguous when confidence gap is ≤ 0.05."
trigger_phrases:
  - "ambiguity plan"
  - "confidence margin plan"
  - "SAD-002 fix plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/070-ambiguity-window-confidence-fix"
    last_updated_at: "2026-05-06T13:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Patch ambiguity.ts"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-2026-05-06-084"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Ambiguity Window Confidence Fix

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Node.js, ESM, vitest) |
| **Module** | `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts` |
| **Build** | `npm --prefix .opencode/skills/system-spec-kit/mcp_server run build` |
| **Test** | `npx vitest run --root .opencode/skills/system-spec-kit/mcp_server` (focused on scorer suites) |

### Overview
Replace the single-margin (score-only) ambiguity check with a dual-margin OR: a candidate is in the ambiguity cluster if the score gap to the top OR the confidence gap to the top is within 0.05. Score margin keeps ranking-alignment (F-012-C2-04 invariant). Confidence margin restores feature-catalog-documented behavior and resolves the SAD-002 calibration gap.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] SAD-002 evidence captured and root cause traced to `ambiguity.ts` margin field choice
- [x] Affected tests located: `native-scorer.vitest.ts`, `advisor-quality-049-003.vitest.ts`
- [x] Feature catalog text reviewed (already says "0.05 confidence window")

### Definition of Done
- [x] `ambiguity.ts` exports `AMBIGUITY_CONFIDENCE_MARGIN`
- [x] `ambiguousCluster` returns dual-margin OR cluster
- [x] Two affected vitest suites updated and passing
- [x] Feature-catalog file describes the dual-margin rule
- [x] SAD-002 re-run reports `ambiguous: true`
- [x] SAD-001 re-run still PASS (single-winner case unaffected)

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place predicate widening. The `ambiguousCluster` function already filters passing candidates within margin of top — extend the predicate from `(score within margin)` to `(score within margin) OR (confidence within margin)`.

### Key Components
- **`ambiguity.ts`**: Single source of truth for the cluster predicate
- **`fusion.ts`**: Calls `applyAmbiguity` and `isAmbiguousTopTwo` once each — no changes needed
- **Test fixtures**: Pin behavior via explicit `score` and `confidence` values; updates are surgical

### Data Flow
1. `scoreAdvisorPrompt` (fusion.ts) ranks recommendations by `score`.
2. `applyAmbiguity` enriches candidates with `ambiguousWith: string[]` if in cluster.
3. `isAmbiguousTopTwo` returns `cluster.length >= 2` for the response envelope's `ambiguous` flag.

The widening at step 2 propagates to step 3 automatically; no other call sites change.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder scaffolded
- [x] Audit confirmed only 4 files in scope

### Phase 2: Core Implementation
- [x] Add `AMBIGUITY_CONFIDENCE_MARGIN = 0.05` constant
- [x] Update `ambiguousCluster` predicate to OR-check both gaps
- [x] Update inline comment to explain dual-margin rationale

### Phase 3: Test + Doc Updates
- [x] `native-scorer.vitest.ts` line 80–100: bump confidence on second fixture so BOTH gaps exceed margin
- [x] `advisor-quality-049-003.vitest.ts` lines 230–239: update "uses ranking score not confidence" test fixture so confidences also differ; rename intent in inline comment
- [x] `advisor-quality-049-003.vitest.ts`: add new test "F-012-C2-04+: score-outside-confidence-inside is ambiguous" covering SAD-002 scenario
- [x] `feature_catalog/04--scorer-fusion/03-ambiguity.md`: rewrite "current reality" anchor to describe dual-margin
- [x] Build MCP server
- [x] Run vitest on focused suites
- [x] Run vitest on broader scorer suites to catch any indirect breakage

### Phase 4: Verification
- [x] advisor_rebuild --force
- [x] advisor_recommend with SAD-002 prompt
- [x] Confirm `ambiguous: true` and `recommendations[0].ambiguousWith: ["sk-prompt"]`
- [x] Spot-run SAD-001 to confirm single-winner case unchanged
- [x] Save context via generate-context.js

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | dual-margin OR predicate | vitest fixtures in native-scorer + advisor-quality-049-003 |
| Integration | live MCP advisor_recommend on SAD-002 prompt | mcp__spec_kit_memory__advisor_recommend |
| Regression | F-012-C2-04 ranking alignment | updated test asserting "outside both margins → not ambiguous" |
| Smoke | SAD-001 single-winner case | live MCP call; expect `ambiguous: false` |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| TypeScript build (`tsc`) | Internal | Green | Cannot ship change |
| vitest harness | Internal | Green | Cannot regression-test |
| Live MCP advisor | Internal | Green | Cannot verify SAD-002 fix |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vitest regression beyond the two updated suites, or SAD-002 still reports `ambiguous: false` after the change
- **Procedure**:
  1. `git checkout HEAD -- .opencode/skills/system-spec-kit/mcp_server/skill_advisor/lib/scorer/ambiguity.ts`
  2. Revert the test + catalog edits
  3. Rebuild and re-run vitest to confirm baseline
  4. Open follow-on packet to investigate the deeper interaction

<!-- /ANCHOR:rollback -->
