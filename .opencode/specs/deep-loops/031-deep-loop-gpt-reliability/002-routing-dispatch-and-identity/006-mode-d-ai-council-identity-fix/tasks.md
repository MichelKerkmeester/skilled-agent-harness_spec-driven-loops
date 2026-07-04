---
title: "Tasks: Mode-D Gate Fix + ai-council Route-Identity Fix"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "mode d gate fix"
  - "ai-council route identity fix"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-gpt-reliability/002-routing-dispatch-and-identity/006-mode-d-ai-council-identity-fix"
    last_updated_at: "2026-07-01T13:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "All 18 tasks complete; validate.sh --strict passing"
    next_safe_action: "Proceed to phase 009"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-008-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Mode-D Gate Fix + ai-council Route-Identity Fix

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read all 8 `/deep:*` command files' Phase-0 blocks. Structurally identical template, not byte-identical -- each substitutes its own loop description/slash-command name (and 4 of the 8 add an extra file-read step or extra indicator line); `spec.md` corrected to say "structurally identical" rather than literal byte-identity.
- [x] T002 Read `orchestrate-topic.cjs:295-325` and `deep_ai-council_auto.yaml:115-140` in full context.
- [x] T003 Dispatch-context signal: since this is a markdown prompt contract (not executable code), ground the check in the model's own evidence -- was this content reached via a direct `/deep:*` invocation (or a Task delegation naming that exact command), vs. pasted inline into another agent's dispatch prompt as ad hoc instructions. Default the ambiguous case to PROCEED (fail-open), since the original mechanism's fail-closed-on-uncertainty default is exactly what caused phase 005's confirmed false-positive block.
- [x] T004 `git status`/`git diff` both ai-council target files: found live, uncommitted, unrelated in-flight work (new `route_fields`/`resolved_route_header` additions using the already-correct `ai-council`/`@ai-council` values, wired into seat-dispatch context) sitting alongside the still-stale round-completion record emitter and YAML validator. Completed the wiring rather than duplicating it -- see T013/T014.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 [P] Replace Phase-0 block in `ai-system-improvement.md`.
- [x] T006 [P] Replace Phase-0 block in `skill-benchmark.md`.
- [x] T007 [P] Replace Phase-0 block in `context.md`.
- [x] T008 [P] Replace Phase-0 block in `review.md`.
- [x] T009 [P] Replace Phase-0 block in `ai-council.md`.
- [x] T010 [P] Replace Phase-0 block in `research.md`.
- [x] T011 [P] Replace Phase-0 block in `agent-improvement.md`.
- [x] T012 [P] Replace Phase-0 block in `model-benchmark.md`.
- [x] T013 Edited `orchestrate-topic.cjs:310-313` (`mode`, `target_agent`, `resolved_route` → `ai-council`, no `@` prefix, matching the `context`/`research`/`review` convention where `route_proof.target_agent` has no `@`).
- [x] T014 Edited `deep_ai-council_auto.yaml:132-136` (`route_proof.mode`, `route_proof.target_agent`, `route_proof.resolved_route` → `ai-council`) in the same change as T013.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 grep all 8 command files: zero remaining self-classification prose confirmed.
- [x] T016 grep both ai-council files: zero remaining `council`/`deep-ai-council` values in the touched blocks confirmed.
- [x] T017 Ran the actual vitest suite (not a constructed repro): `orchestrate-topic.vitest.ts`, `orchestrate-session.vitest.ts`, `integration-deep-mode-e2e.vitest.ts` (11/11 pass), plus the full `deep-ai-council/scripts/tests/` suite (9 files, 76/76 pass). No test asserted the old `council`/`deep-ai-council` literals.
- [x] T018 Ran `validate.sh --strict` for this phase folder: see `implementation-summary.md` Verification.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] grep checks pass (T015, T016).
- [x] Route-proof smoke passes (T017).
- [x] Strict spec validation passes (T018).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Research**: `../007-gpt-behavioral-hardening-research/research/research.md`
<!-- /ANCHOR:cross-refs -->

---
