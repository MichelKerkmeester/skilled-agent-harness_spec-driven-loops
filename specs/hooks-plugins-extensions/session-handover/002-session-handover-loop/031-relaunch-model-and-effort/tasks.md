---
title: "Tasks: Phase 31: relaunch-model-and-effort"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch model and effort tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 31: relaunch-model-and-effort

<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Probe each runtime's model and effort flags and level lists from its `--help`
- [x] T002 Find the live sources: Claude log `requestedModel` and `effort`, Codex rollout `turn_context`, Pi `ctx.model` and `getThinkingLevel`, Hermes `post_api_request` model and provider, Cursor `cli-config.json` `selectedModel`
- [x] T003 Baseline the gates: relaunch 837, plugins 552, Pi 52
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Capture and replay the launch effort flag per runtime (`.skilled/bin/skilled-loop`)
- [x] T005 Read the sender's live values at prepare and keep them on the record (`lib/relaunch-core.cjs`, `lib/context-usage.cjs`, `bin/session-relaunch.cjs`)
- [x] T006 Pi extension hands its model, provider and thinking level to `arm` (`pi/session-relaunch.ts`)
- [x] T011 Hermes plugin hands the requested model and provider to `arm` at session end (`.hermes/plugins/repo-guards/__init__.py`, `hermes/session-end-arm.mjs`)
- [x] T012 Read the Cursor selection at prepare when it changed after the wrapper's launch stamp (`lib/relaunch-core.cjs`, `skilled-loop`)
- [x] T007 Drop an unknown level or a malformed model with a warning, never fail the relaunch
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Live hops on Claude, Codex, Pi and Hermes; Cursor by tests, since no live hop can run there
- [x] T009 Rerun the whole relaunch, plugin, Pi and Hermes gates and the Pi typecheck
- [x] T010 README section, handoff command line
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001 to REQ-005)
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (level lists from each runtime's `--help`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks (`bash -n`, Pi `tsc`, comment hygiene, rule copies)
- [x] CHK-011 [P0] No console errors or warnings (only the intended drop warnings)
- [x] CHK-012 [P1] Error handling implemented (every reader fails closed, a rejected value is dropped)
- [x] CHK-013 [P1] Code follows project patterns (live values ride the record like `goal_packet`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001 to AC-011)
- [x] CHK-021 [P0] Manual testing complete (live hops on Claude, Codex, Pi and Hermes)
- [x] CHK-022 [P1] Edge cases tested (rejected level, malformed model, provider without a model, Cursor selection older than the launch)
- [x] CHK-023 [P1] Error scenarios validated (missing log, Codex `minimal` rejected by the model, probed live)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Class: `cross-consumer`, every runtime's relaunch dropped the sender's settings.
- [x] CHK-FIX-002 [P0] Producers: `build_relaunch_arguments` builds every relaunch line, and `prepare` and the Pi and Hermes arms are the only record writers.
- [x] CHK-FIX-003 [P0] Consumers: `consume`, the wrapper, the README, the feature catalog and the handoff command, each updated.
- [x] CHK-FIX-004 [P0] The values reach a command line, so the wrapper checks each against a level list or an id pattern, with drop and fallback cases.
- [x] CHK-FIX-005 [P1] Axes: seven runtimes by launch flag, live value, both or neither. The README lists each runtime's row.
- [x] CHK-FIX-006 [P1] The suites clear inherited loop variables and `CODEX_HOME`, and the Cursor cases set `HOME` and the launch stamp per case.
- [x] CHK-FIX-007 [P1] Evidence is pinned to `b9bbe3ff85` plus the uncommitted Hermes and Cursor diff on top of `301185ee9f`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets (evidence scanned)
- [x] CHK-031 [P0] Input validation implemented (wrapper level and id checks)
- [x] CHK-032 [P1] Auth/authz: not applicable
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate
- [x] CHK-042 [P2] README updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
- [x] CHK-051 [P1] scratch/ holds only the harnesses and the run evidence
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-25
<!-- /ANCHOR:summary -->

---



