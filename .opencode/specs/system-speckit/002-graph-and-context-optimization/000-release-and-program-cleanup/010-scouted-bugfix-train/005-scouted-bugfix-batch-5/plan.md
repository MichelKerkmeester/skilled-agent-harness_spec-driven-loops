---
title: "Implementation Plan: Scouted Bugfix Batch 5"
description: "Verify-first round-3 tail: 4 originally-unconfirmed targets re-confirmed by a gpt-5.5-fast confirm pass; 1 (cli-devin phantom dangerous permission rows) already shipped via parallel 130/014, so this packet lands the remaining 3 with regression tests. Fixes cover D4-R grader dim_id mismatch, handover freshness timestamp field mismatch, and updatePhaseParentPointer Zod-validation bypass."
trigger_phrases:
  - "scouted bugfix batch 5 plan"
  - "verify-first round-3 tail workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/005-scouted-bugfix-batch-5"
    last_updated_at: "2026-06-03T11:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Confirm pass re-confirmed 4 targets; 3 implement fixes done; tests green; 1 deduped"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
    blockers: []
    key_files:
      - ".opencode/skills/deep-improvement/scripts/model-benchmark/scorer/grader/prompts/system-grader-task-outcome.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts"
      - ".opencode/skills/system-spec-kit/scripts/memory/generate-context.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-5-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Scouted Bugfix Batch 5

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | TypeScript (system-spec-kit resume-ladder + generate-context), grader prompt markdown (deep-improvement) |
| **Executor** | gpt-5.5-fast confirm pass over the round-3 tail + implement-and-test agents |
| **Parallelism** | 4 confirm deep-dives, then 3 implement agents on disjoint files (1 target deduped) |
| **Ground truth** | Real source code: grader harness strict-equality on `'D4-R'`, handover frontmatter field names, `updatePhaseParentPointer` read/write path, `graphMetadataSchema` shape |

### Overview
A verify-first pipeline continuing the scouted bugfix train (batches 1–4 preceded this). The round-3 tail had left 4 targets classified as unconfirmed. A follow-up gpt-5.5-fast confirm pass re-examined all 4 against the real code and confirmed every one. One — the cli-devin phantom "dangerous" permission rows — had already shipped via parallel `130/014` cli-doc work, so it was deduped and left untouched. The remaining 3 confirmed defects were fixed by implement-and-test agents on disjoint file sets, each fix proven by an added regression test. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the affected TS still typechecks before ship.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Round-3-tail candidates (4) assigned for the confirm pass
- [x] Each candidate assigned a confirm owner (gpt-5.5-fast; confirm/dedup before any edit)
- [x] Disjoint file partition defined so implement agents never collide

### Definition of Done
- [x] 4 candidates re-confirmed; 1 deduped (already shipped via `130/014`)
- [x] 3 confirmed defects fixed across their source + test files (disjoint agents)
- [x] Every fix has an added regression test that passes; comment-hygiene clean
- [x] Affected TS typechecks/builds clean
- [x] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in with a confirm gate and a dedup gate. Each candidate flows through deep-dive (confirm) and a dedup check against already-shipped work, then implement (disjoint files), so no edit is made on an unconfirmed or already-shipped candidate and no two agents touch the same file.

### Key Components
- **DEEP-DIVE (4x gpt-5.5-fast)**: re-confirm each round-3-tail headline against the real code; all 4 CONFIRMED.
- **DEDUP gate**: cli-devin phantom-permission-rows already shipped via `130/014`; excluded from the implement stage.
- **IMPLEMENT (3x disjoint agents)**: fix only the confirmed defect; prove with an added regression test.
- **REVIEW (orchestrator)**: read every diff, confirm comment-hygiene, confirm typecheck before ship.
- **Reference contracts**: harness strict-equality on `'D4-R'` (grader prompt); single frontmatter extraction + alias/continuity fallback (handover freshness); `graphMetadataSchema` Zod parse + typed `GraphMetadata` (phase-parent pointer).

### Data Flow
Round-3-tail candidates (4) → DEEP-DIVE (confirm) → 4 confirmed → DEDUP (`130/014`) → 3 to implement → IMPLEMENT (disjoint files) → 3 fixes / 5 files → REVIEW (diffs + hygiene + typecheck) → ship.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-grader-task-outcome.md` D4-R prompt (P1) | Prompt told grader to return `"dim_id": "D4R"` (no hyphen); harness strict-equals `'D4-R'` → confidence capped at 0.3 + mismatch annotation on every real grade | Change prompt to `"dim_id": "D4-R"` | Regression test passes (real-path grade no longer capped) |
| `resume-ladder.ts` `parseHandoverSignal()` (P1) | Tried only `last_updated` / `last_updated_at` top-level; `updated:` and `_memory.continuity.last_updated_at` fell through to unreliable mtime | Extract frontmatter once; add `updated` alias + continuity-block fallback | 11/11 tests pass (9 pre-existing + 2 new) |
| `generate-context.ts` `updatePhaseParentPointer` (P1) | Highest-frequency graph-metadata mutation read via plain JSON.parse, wrote via atomicWriteJson with NO schema validation; accepted malformed timestamps / empty `last_active_child_id` | Parse on-disk file with `graphMetadataSchema` (Zod) before mutating; construct typed `GraphMetadata` | Regression test passes via `tsx` (vitest segfaults on Node v25 — env issue) |

Confirm-deep-dive census:
- 4 CONFIRMED: all 4 round-3-tail targets confirmed against the real code.
- 1 DEDUPED: cli-devin phantom "dangerous" permission rows — already shipped via parallel `130/014` cli-doc work; not re-edited.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deep-dive — re-confirm / dedup (done)
- [x] 4 gpt-5.5-fast confirm deep-dives against the real code
- [x] 4 CONFIRMED; 1 deduped (cli-devin phantom-permission-rows already shipped via `130/014`)

### Phase 2: Implement + verify (done)
- [x] 3 disjoint-file implement agents fix the confirmed defects
- [x] d4-r-grader-dim-id (P1): prompt changed `"dim_id": "D4R"` → `"dim_id": "D4-R"`; regression test passes
- [x] handover-freshness-timestamp (P1): `parseHandoverSignal()` extracts frontmatter once; adds `updated` alias + continuity-block fallback; 11/11 tests pass (9 pre-existing + 2 new)
- [x] phase-parent-pointer-zod (P1): `updatePhaseParentPointer` parses on-disk file with `graphMetadataSchema` before mutating; constructs typed `GraphMetadata`; regression test passes via `tsx`
- [x] Orchestrator reviewed every diff; comment-hygiene clean; affected TS typechecks

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
| Confirm deep-dive | each round-3-tail candidate vs the real code | gpt-5.5-fast confirm pass |
| Per-fix regression test | each of the 3 fixes | added/updated regression test (Vitest for resume-ladder; tsx for generate-context; grader-prompt assertion) |
| TS typecheck | system-spec-kit resume-ladder + generate-context | `tsc` typecheck / `tsx` run (vitest segfaults on Node v25 in this env) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- D4-R prompt fix is a single string change in the grader prompt; the harness already strict-equals `'D4-R'`, so no harness change is needed.
- `parseHandoverSignal()` resolves all field aliases from a single frontmatter extraction; no new parser import needed.
- `graphMetadataSchema` already exists in the generate-context module; `updatePhaseParentPointer` consumes it directly.
- cli-devin phantom-permission-rows fix already shipped via `130/014`; this packet has no dependency on it beyond the dedup note.
- vitest segfaults on Node v25 in this env; the phase-parent-pointer test runs green via `tsx` instead (known environment issue, not a fix problem).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code changes across 5 files; rollback is a clean revert of those files.

- **Revert**: restore the 5 edited/added files (3 sources + their regression tests) to pre-fix state.
- **Deploy**: recycle the mk-spec-memory daemon after commit so the `resume-ladder.ts` and `generate-context.ts` fixes take effect in the running daemon. The grader prompt is read at benchmark dispatch time; no daemon recycle needed.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Deep-dive) ──► Phase 2 (Implement) ──► Phase 3 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Deep-dive | Round-3-tail candidate list | Implement |
| Implement | Deep-dive (confirmed defects; dedup gate applied) | Ship |
| Ship | Implement (typecheck + tests green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep-dive (4 confirm + 1 dedup) | Low-Med | ~1 hour |
| Implement + verify (3 disjoint agents) | Med | ~1.5 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (code-behavior fixes only; new Zod gate rejects malformed input rather than rewriting data)
- [x] No feature flag required (defect fixes, not new behavior toggles)
- [x] Scope-locked to the 5 confirmed-defect files (no adjacent cleanup; cli-devin target deduped and untouched)

### Rollback Procedure
1. Restore the 5 edited/added files from version control.
2. Recycle the mk-spec-memory daemon for the `resume-ladder.ts` / `generate-context.ts` reverts; the grader prompt revert is live at next benchmark dispatch.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — behavior fixes only; the Zod gate validates on read/write and does not migrate persisted data.
<!-- /ANCHOR:enhanced-rollback -->
