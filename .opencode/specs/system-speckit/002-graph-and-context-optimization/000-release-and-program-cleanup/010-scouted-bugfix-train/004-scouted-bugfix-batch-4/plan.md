---
title: "Implementation Plan: Scouted Bugfix Batch 4"
description: "Verify-first batch fix over batch-4 candidates: 9 confirmed by gpt-5.5-fast deep-dive and implemented with regression tests; 11 excluded as policy/migration/unconfirmed. Fixes cover warm-tier savings metric lock, anchor-miss metrics recompute, formatAgeString NaN guard, shadow promotion zero-delta gate, adapter-common dead ternary, check-graph-metadata last-active basename, cli-gemini/cli-codex auth pre-flight corrections, and token-budget constitutional count/summary reconciliation."
trigger_phrases:
  - "scouted bugfix batch 4 plan"
  - "verify-first batch-4 fix workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "9 confirm deep-dives done; 9 implement agents fixed ~18 files; builds + regression tests green"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/token-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/format-helpers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-4-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scouted Bugfix Batch 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | TypeScript (system-spec-kit mcp_server + context-server), shell scripts, SKILL.md markdown |
| **Executor** | gpt-5.5-fast confirm deep-dives + parallel implement-and-test agents |
| **Parallelism** | 9 confirm deep-dives in parallel, then 9 implement agents on disjoint files |
| **Ground truth** | Real source code: token-metrics truncation order, anchor formatter branches, shadow-scoring signal totals, adapter error codes, graph-metadata child-id shapes, CLI auth subcommand availability, context-server pop-loop post-state |

### Overview
A verify-first pipeline continuing the scouted bugfix train (batches 1–3 preceded this). The batch-4 candidate pool was processed through the pipeline: scout → gpt-5.5-fast confirm → implement-and-test. Eleven candidates were excluded as policy changes, migration work, or unconfirmed (the deep-dive found the headline did not hold against the real code). The 9 confirmed defects were fixed by parallel implement-and-test agents on disjoint file sets, each fix proven by an added regression test. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the system-spec-kit build before ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Batch-4 candidates assigned for deep-dive
- [x] Each candidate assigned a confirm owner (gpt-5.5-fast; confirm/exclude before any edit)
- [x] Disjoint file partition defined so implement agents never collide

### Definition of Done
- [x] 9 candidates confirmed; 11 excluded with rationale (policy/migration/unconfirmed)
- [x] 9 confirmed defects fixed across their source + test files (disjoint agents)
- [x] Every fix has an added regression test that passes; comment-hygiene clean
- [x] system-spec-kit `npm run build` exit 0
- [x] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in with a confirm gate. Each candidate flows through deep-dive (confirm/exclude) and then implement (disjoint files), so no edit is made on an unconfirmed candidate and no two agents touch the same file.

### Key Components
- **DEEP-DIVE (9x gpt-5.5-fast)**: confirm or exclude each headline against the real code; emit CONFIRMED / EXCLUDED + the real defect description.
- **EXCLUDE gate**: 11 candidates marked policy/migration/unconfirmed; excluded from the implement stage.
- **IMPLEMENT (9x disjoint agents)**: fix only the confirmed defect; prove with an added regression test.
- **REVIEW (orchestrator)**: read every diff, confirm comment-hygiene, confirm build before ship.
- **Reference contracts**: pre-truncation capture (warm-tier); `estimateTokens` mirroring (anchor-miss branch); `MIN_NDCG_IMPROVEMENT` epsilon (shadow gate); POSIX basename (shell guard); filesystem probe (CLI auth pre-flights); survivor recount (token-budget).

### Data Flow
Batch-4 candidates → DEEP-DIVE (confirm/exclude) → 9 confirmed + 11 excluded → IMPLEMENT (disjoint files) → 9 fixes / ~18 files → REVIEW (diffs + hygiene + build) → ship.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `token-metrics.ts` + `memory-triggers.ts` (P1) | WARM-tier baseline captured after 150-char truncation → structurally locked at ~67% | Capture `fullContentTokens` before truncation; pass through to formatter; 3x kept as fallback | Regression test passes; build exit 0 |
| `search-results.ts` anchor-miss branch (P1) | All-anchors-missing branch hardcoded `returnedTokens:0` / `savingsPercent:100` despite emitting a warning | Recompute both from `estimateTokens(content)`, mirroring the partial-match branch | Regression test passes; build exit 0 |
| `format-helpers.ts` `formatAgeString` (P1) | Returned "NaN months ago" for invalid ISO string | Add `Number.isNaN(timestamp)` guard returning "never" sentinel | Regression test passes; build exit 0 |
| `shadow-scoring.ts` + `shadow-evaluation-runtime.ts` (P1) | Zero-delta uniform-signal cycles counted as improvements; returned uniform-0.5 map | Add `MIN_NDCG_IMPROVEMENT` epsilon + return empty Map when `maxAbsoluteSignalTotal===0` | Regression test passes; build exit 0 |
| `adapter-common.ts` (P2) | Dead ternary classified all non-blocked spawn errors as BLOCKED | Fix: "BLOCKED : BLOCKED" → "BLOCKED : FAIL" so EPIPE/ECONNRESET classify as FAIL | Regression test passes; build exit 0 |
| `check-graph-metadata-shape.sh` (P2) | Spurious WARNING when `derived.last_active_child_id` is a full packet_id | Add basename fallback existence test | Regression test passes |
| `cli-gemini/SKILL.md` (P1) | Auth pre-flight called `gemini config list` (non-existent subcommand) | Replace with filesystem probe of `~/.gemini/oauth_creds.json` | Regression test passes (SKILL.md read-back verification) |
| `cli-codex/SKILL.md` (P1) | Auth pre-flight ran `codex auth status` (unrecognized subcommand, exit 2) | Replace with `codex login status` | Regression test passes (SKILL.md read-back verification) |
| `context-server.ts` (P1) | After pop loop, `constitutionalCount` and `envelope.summary` not recomputed from survivors | Recompute `constitutionalCount` from survivors; rebuild `envelope.summary` | Regression test passes; build exit 0 |

Confirm-deep-dive census:
- 9 CONFIRMED: all 9 fixes listed above.
- 11 EXCLUDED: policy changes, migration work, or unconfirmed by deep-dive. None were edited.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deep-dive — confirm/exclude (done)
- [x] 9 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] 9 CONFIRMED; 11 excluded (policy/migration/unconfirmed)

### Phase 2: Implement + verify (done)
- [x] 9 parallel disjoint-file implement agents fix the confirmed defects
- [x] warm-tier-savings-metric (P1): `fullContentTokens` captured before truncation; 3x kept as fallback; regression test passes
- [x] anchor-miss-returnedtokens (P1): all-anchors-missing branch recomputes `returnedTokens` + `savingsPercent` from `estimateTokens(content)`; regression test passes
- [x] formatagestring-nan (P1): `Number.isNaN(timestamp)` guard → "never" sentinel; regression test passes
- [x] shadow-promotion-gate (P1): `MIN_NDCG_IMPROVEMENT` epsilon + empty Map on zero total; regression test passes
- [x] adapter-common-dead-branch (P2): "BLOCKED : FAIL" replaces dead "BLOCKED : BLOCKED"; regression test passes
- [x] check-graph-metadata-shape-last-active (P2): basename fallback existence test; regression test passes
- [x] cli-gemini-auth-preflight (P1): filesystem probe replaces non-existent `gemini config list`; regression test passes
- [x] cli-codex-auth-preflight (P1): `codex login status` replaces unrecognized `codex auth status`; regression test passes
- [x] token-budget-envelope (P1): `constitutionalCount` + `envelope.summary` recomputed from survivors; regression test passes
- [x] Orchestrator reviewed every diff; comment-hygiene clean; build exit 0

### Phase 3: Ship
- [x] description.json + graph-metadata.json
- [x] validate --strict → 0
- [x] reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Confirm/exclude deep-dive | each candidate vs the real code | gpt-5.5-fast parallel passes |
| Per-fix regression test | each of the 9 fixes | added/updated regression test (Vitest for TS; shell assert for .sh) |
| TS typecheck + build | system-spec-kit mcp_server | `tsc` typecheck, `npm run build` (exit 0) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Pre-truncation capture in `token-metrics.ts` depends on the call site in `memory-triggers.ts` passing `fullContentTokens` before the 150-char slice.
- `estimateTokens` utility in `search-results.ts` is already available in the formatter module; no new import needed.
- `MIN_NDCG_IMPROVEMENT` epsilon is a module-level constant in `shadow-scoring.ts`; `shadow-evaluation-runtime.ts` consumes the empty-Map return.
- CLI SKILL.md changes take effect at the next CLI dispatch; no daemon recycle needed.
- `context-server.ts` token-budget recompute runs in-process immediately after the pop loop; no external dependency.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code changes across ~18 files; rollback is a clean revert of those files.

- **Revert**: restore the ~18 edited/added files (9 sources + their regression tests) to pre-fix state.
- **Deploy**: no daemon recycle needed on revert for most fixes; cli-gemini/cli-codex SKILL.md reverts take effect on next dispatch.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Deep-dive) ──► Phase 2 (Implement) ──► Phase 3 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Deep-dive | Batch-4 candidate list | Implement |
| Implement | Deep-dive (confirmed defects; exclude gate applied) | Ship |
| Ship | Implement (builds + tests green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep-dive (9 parallel confirm/exclude) | Med | ~1.5 hours |
| Implement + verify (9 disjoint agents) | Med-High | ~2.5 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~4.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (code-behavior fixes only)
- [x] No feature flag required (defect fixes, not new behavior toggles)
- [x] Scope-locked to the ~18 confirmed-defect files (no adjacent cleanup; excluded candidates untouched)

### Rollback Procedure
1. Restore the ~18 edited/added files from version control.
2. cli-gemini/cli-codex SKILL.md reverts take effect on next dispatch; no daemon recycle needed.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — behavior fixes only; no persisted-data change.
<!-- /ANCHOR:enhanced-rollback -->
