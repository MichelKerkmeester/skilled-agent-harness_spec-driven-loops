---
title: "Implementation Plan: Scouted Bugfix Batch 2"
description: "Verify-first batch fix over the remaining 15 of 20 scouted candidates: 15 parallel gpt-5.5-fast confirm deep-dives classified each headline (4 CONFIRMED, 9 partial-but-real, 2 REFUTED — symlinked `specs/` path; non-leaking reconsolidation env), then 13 parallel implement-and-test agents fixed the confirmed + partial targets across 22 files (sources + added regression tests), fixing only the REAL part of each partial. Spans chunking, the deep-loop runtime, embeddings, vector-index validation, skill-advisor, code-graph, and benchmark/runner tooling; every fix has a regression test, builds + node --check pass."
trigger_phrases:
  - "scouted bugfix batch 2 plan"
  - "verify-first partial-but-real fix workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2"
    last_updated_at: "2026-06-03T07:31:00Z"
    last_updated_by: "claude-opus"
    recent_action: "15 deep-dives done; 13 implement agents fixed 22 files; builds + regression tests green"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-2-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scouted Bugfix Batch 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Mixed: TypeScript (system-spec-kit, system-skill-advisor, code-graph) + deep-loop `.cjs`/`.ts` + benchmark/runner tooling |
| **Executor** | 15 parallel `gpt-5.5-fast` confirm deep-dives + 13 disjoint-file implement-and-test agents |
| **Parallelism** | 15 deep-dives in parallel, then 13 implement agents on disjoint files (22 files = sources + tests, no overlap) |
| **Ground truth** | The real source code (deep-dive against actual loops, lease lifecycle, provider contracts); HfLocalProvider's own dim contract; core/config.ts workspace-root pattern |

### Overview
A verify-first pipeline continuing from batch 1. The same 20-target scout left 15 untriaged after batch 1's top 5. DEEP-DIVE runs 15 parallel gpt-5.5-fast passes that confirm, partially-confirm, or refute each headline against the real code — classifying 4 CONFIRMED, 9 partial-but-real, and 2 REFUTED (the hook-tests `specs/` path is fine because `specs/` is a symlink to `.opencode/specs/`; the reconsolidation env-leak does not actually leak). IMPLEMENT runs 13 parallel agents on disjoint file sets, each fixing only the REAL part of its target (never the refuted headline) and proving it with an added regression test. The orchestrator then reviews every diff, confirms comment-hygiene, and confirms builds + `node --check` before ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Remaining 15 targets carried over from the 20-target scout (after batch 1's 5)
- [x] Each headline assigned a deep-dive owner (confirm/partial/refute before any edit)
- [x] Disjoint file partition defined so the 13 implement agents never collide

### Definition of Done
- [x] 15 deep-dives done; 4 CONFIRMED, 9 partial-but-real, 2 REFUTED with code evidence
- [x] 13 confirmed + partial defects fixed across 22 files (disjoint agents), only the REAL part of each partial
- [x] Every fix has an added regression test that passes; comment-hygiene clean
- [x] system-spec-kit + skill-advisor + code-graph builds exit 0; deep-loop `.cjs` `node --check` OK
- [ ] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in with a verify gate. The 15 remaining targets flow through deep-dive (confirm/partial/refute) and then implement (disjoint files), so no edit is made on an unverified or refuted headline and no two agents touch the same file.

### Key Components
- **DEEP-DIVE (15x gpt-5.5-fast)**: confirm/partially-confirm/refute each headline against the real code; emit CONFIRMED / partial-but-real / REFUTED + the real defect.
- **IMPLEMENT (13x disjoint agents)**: fix only the REAL part of each confirmed/partial target; prove with an added regression test.
- **REVIEW (orchestrator)**: read every diff, confirm comment-hygiene, confirm builds + `node --check`, then ship.
- **Reference contracts**: HfLocalProvider dim contract (auto-select port); `core/config.ts` workspace-root helper (readiness-marker port).

### Data Flow
Remaining 15 scouted targets → DEEP-DIVE (confirm/partial/refute) → 4 confirmed + 9 partial + 2 refuted → IMPLEMENT (disjoint files, REAL part only) → 13 fixes / 22 files → REVIEW (diffs + hygiene + builds + node --check) → ship.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `chunking.ts` (P2) | critical-section loop unguarded; non-Unicode-safe `substring` truncation | `maxLength<=0` guard + `remainingBudget<=0` break + code-point-safe truncation | regression test passes; system-spec-kit build exit 0 |
| `coverage-graph-signals.ts` (P1, deep-loop) | claimVerificationRate returns 0 with no CLAIM nodes → perpetual CONTINUE | return 1.0 vacuous-pass (matching p0ResolutionRate) | regression test passes |
| `fanout-run.cjs` (P1, deep-loop) | stale cli-gemini fallback model `gemini-2.5-pro` | → `gemini-3.1-pro-preview` | regression test passes; `node --check` OK |
| `fanout-merge.cjs` (P2, deep-loop) | merge drops per-lineage resolvedQuestions/resolvedFindings | add `resolvedQuestionsById` Map mirroring `openQuestionsById` | regression test passes; `node --check` OK |
| `spec-doc-health.ts` (P2) | phase parents get false health errors on absent plan/tasks/checklist | local `isPhaseParent()` detector (advisory-only annotation) | regression test passes; system-spec-kit build exit 0 |
| `rrf-fusion.ts` (P2) | two-list `fuseResults` normalization differs from `fuseResultsMulti` | normalization parity with `fuseResultsMulti` | regression test passes |
| `auto-select.ts` (P2) | hf-local persisted dim always 768; legacy `HF_LOCAL_MODEL` env alias | mirror HfLocalProvider contract (canonical=768, custom=0); drop the env alias | regression test passes; system-spec-kit build exit 0 |
| `semantic-shadow.ts` (P2, skill-advisor) | raw `LaneMatch.shadowOnly` true does not match lane liveness | flip true→false (fusion already recomputes from `isLiveScorerLane`; inert for public scoring) | regression test passes; skill-advisor build exit 0 |
| `vector-index-schema.ts` (P1) | v28 active-row unique index unvalidated | add `idx_memory_logical_key_active_unique` to REQUIRED_INDEXES | regression test passes; system-spec-kit build exit 0 |
| `readiness-marker.ts` (P2, code-graph) | marker base dir resolved via `process.cwd()` | resolve via a workspace-root helper mirroring `core/config.ts` | regression test passes; code-graph build exit 0 |
| `dispatch-minimax.cjs` (P2, benchmark) | unconditional stale `--agent general` | conditional `--agent` (drop the unconditional flag) | regression test passes; `node --check` OK |
| `test-opencode-plugins.ts` runner (P2) | stale plugin import `spec-kit-skill-advisor.js` | → `mk-skill-advisor.js` | regression test passes |

Confirm-deep-dive census:
- 15 parallel deep-dives over the remaining scouted targets: 4 CONFIRMED, 9 partial-but-real, 2 REFUTED.
- 2 REFUTED: the `package.json` hook-tests `specs/` path is fine (`specs/` is a symlink to `.opencode/specs/`); the reconsolidation env-leak does not actually leak. Neither was edited.
- The 9 partials were fixed for the REAL lesser defect only; the refuted headline of each was not acted on.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deep-dive — confirm/partial/refute (done)
- [x] 15 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] Classified 4 CONFIRMED, 9 partial-but-real, 2 REFUTED (symlinked `specs/`; non-leaking reconsolidation env)

### Phase 2: Implement + verify (done)
- [x] 13 parallel disjoint-file implement agents fix the confirmed + partial defects (22 files, REAL part only)
- [x] chunking: `maxLength<=0` guard + `remainingBudget<=0` break + code-point-safe truncation
- [x] coverage-graph-signals: vacuous-pass 1.0; fanout-run: gemini-3.1-pro-preview; fanout-merge: resolvedQuestionsById Map
- [x] spec-doc-health: local `isPhaseParent()`; rrf-fusion: two-list normalization parity; auto-select: hf-local dim contract + drop env alias
- [x] semantic-shadow: shadowOnly true→false; vector-index-schema: unique-index validation; readiness-marker: workspace-root base
- [x] dispatch-minimax: conditional `--agent`; test-opencode-plugins runner: mk-skill-advisor.js import
- [x] Orchestrator reviewed every diff; comment-hygiene clean; builds + `node --check` OK

### Phase 3: Ship
- [ ] description.json + graph-metadata.json
- [ ] validate --strict → 0
- [ ] reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Confirm/partial/refute deep-dive | each headline vs the real code | gpt-5.5-fast parallel passes |
| Per-fix regression test | each of the 13 fixes | added regression test (Vitest for TS; deep-loop harness for `.cjs`) |
| TS typecheck + build | system-spec-kit, skill-advisor, code-graph mcp_server | `tsc` typecheck, `npm run build` (all three exit 0) |
| `node --check` | deep-loop `.cjs` (fanout-run, fanout-merge, dispatch-minimax) | `node --check` OK (run via the consuming toolchain, no build) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- HfLocalProvider's own dim contract (canonical=768, custom=0) is the reference for the auto-select persisted-dim fix; the change mirrors the provider's first-embed drift hook.
- `core/config.ts` workspace-root resolution is the reference for the readiness-marker base-dir fix.
- Deploy depends on the orchestrator recycling the mk-spec-memory daemon (shared/ + migration changes); skill-advisor + code-graph dist deploy on their next restart (parallel session); deep-loop `.cjs`/`.ts` run via the consuming toolchain (no build); the benchmark + runner docs need no deploy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code change across 22 files; rollback is a clean revert of those files.

- **Revert**: restore the 22 edited files (13 sources + their added regression tests) to pre-fix state.
- **Deploy**: a revert also requires re-recycling the mk-spec-memory daemon to drop the shared/migration-affected behavior; skill-advisor + code-graph drop their fixes on the next dist restart; deep-loop `.cjs`/`.ts` need no build action on revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Deep-dive) ──► Phase 2 (Implement) ──► Phase 3 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Deep-dive | Remaining 15 targets (from the 20-target scout) | Implement |
| Implement | Deep-dive (confirmed + partial defects) | Ship |
| Ship | Implement (builds + tests green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep-dive (15 parallel confirm/partial/refute) | Med | ~2 hours |
| Implement + verify (13 disjoint agents, 22 files) | High | ~3.5 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (code-behavior fixes only)
- [x] No feature flag required (defect fixes, not new behavior toggles)
- [x] Scope-locked to the 22 confirmed/partial-defect files (no adjacent cleanup; refuted headlines untouched)

### Rollback Procedure
1. Restore the 22 edited files from version control.
2. Re-recycle the mk-spec-memory daemon to drop the shared/migration-affected behavior; skill-advisor + code-graph drop their fixes on the next dist restart.
3. The deep-loop `.cjs`/`.ts` revert needs no build action (run via the consuming toolchain).

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — behavior fixes only; no persisted-data change.
<!-- /ANCHOR:enhanced-rollback -->
</content>
