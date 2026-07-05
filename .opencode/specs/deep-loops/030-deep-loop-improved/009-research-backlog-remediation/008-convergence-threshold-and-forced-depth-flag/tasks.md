---
title: "Tasks: Convergence Threshold Alignment and Forced-Depth Flag"
description: "Task list for threshold alignment and stop-policy documentation."
trigger_phrases:
  - "convergence threshold alignment tasks"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/030-deep-loop-improved/009-research-backlog-remediation/008-convergence-threshold-and-forced-depth-flag"
    last_updated_at: "2026-07-01T08:10:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored tasks"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Convergence Threshold Alignment and Forced-Depth Flag

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` pending.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all three affected skills' own documented defaults directly: `deep-research` = 0.05, `deep-review` = 0.10, `deep-context` = 0.10 (each independently re-confirmed by this orchestrating session and by the dispatch). **Amended finding**: the spec's literal "flat 0.1→0.05" instruction was incomplete — `buildNativeCommandInput` serves all three loop types through the same code path, so a flat change would fix research but regress review/context (both already correctly default to 0.1)
- [x] T002 Fixed `fanout-run.cjs`'s fallback to be loop-type-conditional: `options.convergenceThreshold ?? (loopType === 'research' ? 0.05 : 0.1)` — not the spec's literal flat-value instruction, which would have been a regression
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Added `--stop-policy <convergence|max-iterations>` to `.opencode/commands/deep/research.md`'s argument-hint plus a descriptive flag section explaining the effect (was already partially present in `review.md`'s argument-hint but not fully explained)
- [x] T004 Added/completed the same in `.opencode/commands/deep/review.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T005 Added 2 new tests in `fanout-run.vitest.ts`: research-type native dispatch gets 0.05 (both `--convergence=` arg and `convergenceThreshold:` setup value); review/context-type native dispatch keeps 0.1 — a regression guard against re-flattening. Independently re-run: 2/2 pass
- [x] T006 Ran full `deep-loop-runtime` Vitest suite, independently re-run: 559/561 pass — the 2 failures are the same pre-existing, unrelated baseline confirmed present since before this remediation phase began (`dependency-seams.vitest.ts`, `executor-provenance-mismatch.vitest.ts`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All 6 tasks complete; defaults aligned per-loop-type (not a flat regression-inducing change); flag documented in both commands; suite green (2 pre-existing, unrelated failures excluded).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `./spec.md` · Plan: `./plan.md` · Implementation summary: `./implementation-summary.md`
- Source findings: `../../research/research_archive/20260701T071133Z-gen1/research.md` §4.3 (F-005/G-004), §3.4/§5#15
<!-- /ANCHOR:cross-refs -->
