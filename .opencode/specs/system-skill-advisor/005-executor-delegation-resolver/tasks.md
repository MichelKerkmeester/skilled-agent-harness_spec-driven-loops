---
title: "Task Breakdown: Metadata-Driven Executor-Delegation Resolver"
description: "Executable task list for WS2: build the metadata-driven executor-delegation resolver, wire the post-fusion override, remove the band-aid, mirror in Python, and verify with a shared parity fixture."
trigger_phrases:
  - "executor delegation resolver tasks"
  - "ws2 task breakdown"
importance_tier: "high"
contextType: "implementation"
parent: "system-skill-advisor"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/005-executor-delegation-resolver"
    last_updated_at: "2026-07-06T21:30:00.000Z"
    last_updated_by: "opus-4.8"
    recent_action: "All tasks complete and verified"
    next_safe_action: "Orchestrator pushes the working tree to the shared branch"
---
# Task Breakdown: Metadata-Driven Executor-Delegation Resolver

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[P]` parallelizable
- Each task lists its evidence (file, test, or command).
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Read the WS2 plan + all referenced scorer files, metadata sources, and test harness. Evidence: fusion.ts / explicit.ts / types.ts / projection.ts / text.ts / skill_advisor.py read.
- [x] T-002 Verify corpus-neutrality up front. Evidence: grep of `labeled-prompts.jsonl` shows zero delegation-alias tokens.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-010 Create `lib/scorer/executor-delegation.ts` (alias table, `resolveExecutorDelegation`, `applyExecutorDelegationOverride` with inject-if-absent + abstain). Evidence: file created; typecheck exit 0.
- [x] T-011 Wire the post-fusion override into `fusion.ts` at the plan's anchor (after breadth abstention, before `passing`). Evidence: `fusion.ts` diff.
- [x] T-012 Delete the `+0.9`/`-3.0` band-aid from `explicit.ts`; add no replacement penalty. Evidence: `explicit.ts` diff; grep for `cli-opencode-disambiguation` in lib returns 0.
- [x] T-013 Mirror in `skill_advisor.py`: metadata alias table, `_resolve_executor_delegation`, `_apply_executor_delegation_disambiguation`, aligned code-edit skip-guard, updated call site. Evidence: `py_compile` OK.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-020 Author the shared fixture `tests/parity/fixtures/executor-delegation-cases.json` (11 cases, every branch). Evidence: file created.
- [x] T-021 Author `tests/scorer/executor-delegation.vitest.ts` (unit + native + TS/Python parity). Evidence: 10 tests pass.
- [x] T-022 Confirm vitest exercises source `.ts` via a temporary throw probe. Evidence: probe test hit the throw, then removed.
- [x] T-023 Run `python-ts-parity.vitest.ts`; confirm 105/101/4. Evidence: 2 tests pass (hard asserts held).
- [x] T-024 Reconcile the ratchet ledger by removing only `harder:79997ebae7df`; run the ratchet. Evidence: ratchet 6/6 pass; ledger 75 entries.
- [x] T-025 Run the full advisor suite; confirm no new regressions. Evidence: 631 passed, 4 pre-existing failures (advisor-graph-health, manual-testing-playbook, skill-advisor-cli-parity, compat/shim - all non-delegation).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0/P1 requirements met (REQ-001..REQ-008).
- Band-aid removed, no pre-clamp penalty introduced, comment hygiene clean.
- 105/101/4 held; new fixture + ratchet green; zero new regressions.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` · Plan: `plan.md` · Checklist: `checklist.md`
- Design input: `system-skill-advisor/001-scorer-saturation-root-fix` (WS2 umbrella).
<!-- /ANCHOR:cross-refs -->
