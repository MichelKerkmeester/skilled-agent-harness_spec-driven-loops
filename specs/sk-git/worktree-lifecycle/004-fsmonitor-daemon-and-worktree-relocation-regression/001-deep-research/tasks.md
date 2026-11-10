---
title: "Tasks: Phase 1: deep-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "deep research tasks"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: deep-research

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `research/` inside this phase folder. `F` is `../scratch/findings.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the symptom, evidence and five questions (`F`). Verify: `rg -n '^## 8\. Questions' F` prints one line, followed by five numbered questions.
- [x] T002 Write the run config (`R/deep-research-config.json`). Verify: `jq .maxIterations R/deep-research-config.json` prints 3.
- [x] T003 Confirm both models answer through `opencode run`. Verify: a one-line prompt returns text. The 1017 build is served only by llmgateway, and opencode-go returned `429 Go usage limit exceeded`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Run lane `llmgateway-flash-1017`, three iterations (`R/lineages/llmgateway-flash-1017/`). Verify: `ls R/lineages/llmgateway-flash-1017/iterations | wc -l` prints 3.
- [x] T005 [P] Run lane `llmgateway-flash-undated` after the operator moved the opencode-go lane to llmgateway (`R/lineages/llmgateway-flash-undated/`). Verify: one iteration recorded, then the network dropped.
- [x] T006 Rerun the interrupted lane under `llmgateway-flash-undated-run2`, after two `resume` attempts exited 1 before any model call (`R/lineages/llmgateway-flash-undated-run2/`). Verify: `ls R/lineages/llmgateway-flash-undated-run2/iterations | wc -l` prints 3.
- [x] T007 Merge the lanes and emit the resource map (`R/deep-research-findings-registry.json`, `R/resource-map.md`). Verify: `fanout-merge.cjs` reports 3 lanes merged and 1 skipped.
- [x] T008 Write the merged synthesis (`R/research.md`). Verify: `rg -n '^### Q[1-5]\.' R/research.md` prints five lines.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Check the git v2.50.1 source claims (`builtin/fsmonitor--daemon.c`, `compat/fsmonitor/fsm-health-darwin.c`, `compat/simple-ipc/ipc-unix-socket.c`). Verify: the "infinite wait" comment, the empty health functions and the deadline-free read are present at the cited lines.
- [x] T010 Check the repository claims (`.skilled/bin/worktree-session.sh`, `generate-leaf-manifest.cjs`, commit `3c7c3f83874`). Verify: the write-back at `worktree-session.sh:293`, no `timeout` at `generate-leaf-manifest.cjs:129`, and the removed reaper code matching only `context-server.js`.
- [x] T011 Validate the phase folder. Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: T009 and T010
- [x] `research/research.md` answers five questions and carries four fix layers
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `research/research.md`
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

A blocked lane is rerun under a fresh label. It is never counted toward the iteration total until its iterations exist on disk.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md: `rg -c '^\| REQ-' spec.md` prints 4
- [x] CHK-002 [P0] Technical approach defined in plan.md: section 3 names the three runtime scripts
- [x] CHK-003 [P1] Dependencies identified and available: opencode-go blocked by quota, replaced on the operator's choice
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] N/A, no code changes. `research/` holds Markdown and JSON only.
- [x] CHK-011 [P1] Every claim in `research/research.md` carries a source tag or an UNKNOWN or INFERRED mark.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met: see `acceptance-criteria.md`
- [x] CHK-021 [P0] Manual source checks complete: T009 and T010
- [x] CHK-022 [P1] Lane independence assessed: `research/research.md` section 3
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A. This phase fixes nothing. Finding classes and producer inventories are owned by phases 002 to 004.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential written into any research artifact: `rg -n -i 'api[_-]?key|token=' research/research.md` prints nothing
- [x] CHK-031 [P1] Lanes never signalled a process. The orchestrator ended wedged daemons by hand, and each kill is recorded in `../scratch/findings.md`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree on three lanes and seven iterations
- [x] CHK-041 [P1] The parent spec's phase map names this phase Complete
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Research output lives under `research/` only
- [x] CHK-051 [P1] The git source copies used for checking live in the session scratchpad, outside the repository
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-27
<!-- /ANCHOR:summary -->

---
