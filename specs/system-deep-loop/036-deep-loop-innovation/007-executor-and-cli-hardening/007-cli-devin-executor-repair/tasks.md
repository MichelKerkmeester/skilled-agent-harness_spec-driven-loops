---
title: "Tasks: cli-devin Executor Repair"
description: "Task breakdown for the cli-devin workspace-trust flag fix and model-list reconciliation, landed in commit dfdd41f531. All tasks complete with evidence from that commit's verification."
trigger_phrases:
  - "cli-devin executor repair tasks"
  - "respect-workspace-trust false task"
  - "devin model list reconciliation task"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/007-cli-devin-executor-repair"
    last_updated_at: "2026-08-12T21:11:31Z"
    last_updated_by: "markdown-agent"
    recent_action: "Checked off all tasks with evidence from commit dfdd41f531"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: cli-devin Executor Repair

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

> All tasks complete. Landed and verified in commit `dfdd41f531` by a parallel process; evidence below is reproduced from that verification.

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

- [x] T001 Confirm the live devin model catalog (`glm-5-2` family, `swe-1-7` family, `grok-4-5` family, `deepseek-v4` family) before editing any model list
  - **Evidence**: Confirmed against `devin models list` in commit `dfdd41f531`; surviving ids verified live.
- [x] T002 [P] Identify every call site that reads `DEVIN_DEFAULT_MODEL`, `DEVIN_ALLOWED_MODELS`, or `DEVIN_SUPPORTED_MODELS` (`fanout-run.cjs`, `executor-config.ts`)
  - **Evidence**: Both call sites updated together in commit `dfdd41f531`.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `--respect-workspace-trust false` to the `args` array built by `buildDevinLineageCommand` (`fanout-run.cjs`) [REQ-001]
  - **Evidence**: `fanout-run.cjs:1895`, `args.push('--respect-workspace-trust', 'false');`, unconditional (commit `dfdd41f531`).
- [x] T004 Reconcile `DEVIN_DEFAULT_MODEL` to `glm-5-2` (`fanout-run.cjs`) [REQ-002]
  - **Evidence**: Changed from dead `swe` to live `glm-5-2` (commit `dfdd41f531`).
- [x] T005 Prune `DEVIN_ALLOWED_MODELS` to live-only uids (`fanout-run.cjs`) [REQ-002]
  - **Evidence**: Dropped dead `swe` and `deepseek-v4` (commit `dfdd41f531`).
- [x] T006 Reconcile `DEVIN_DEFAULT_MODEL` and prune `DEVIN_SUPPORTED_MODELS` to the same live-only uids (`executor-config.ts`), kept identical to `DEVIN_ALLOWED_MODELS` [REQ-002]
  - **Evidence**: `DEVIN_SUPPORTED_MODELS` now identical to `DEVIN_ALLOWED_MODELS` (commit `dfdd41f531`).
- [x] T007 Add a hermetic unit test asserting the built command carries `--respect-workspace-trust false` and a valid model (`fanout-run.vitest.ts`) [REQ-003]
  - **Evidence**: New cell "builds a trusted command for an allowed model and rejects the retired swe alias" plus two CJS/TS alignment cells (commit `dfdd41f531`).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run pinned `tsc`, confirm return code 0 [REQ-003]
  - **Evidence**: Pinned `tsc` return code 0 (commit `dfdd41f531`).
- [x] T009 Run per-file `vitest` for `fanout-run.vitest.ts`, confirm green [REQ-003]
  - **Evidence**: `vitest` 115 passed (was 114, +1 cell, no regression).
- [x] T010 Capture a live devin red-before reproduction (workspace-trust refusal, current adapter, fresh untrusted directory) [REQ-004]
  - **Evidence**: `devin -p ... --model glm-5-2 --permission-mode auto` (no flag, fresh dir) exited 1, "Refusing to run in an untrusted workspace".
- [x] T011 Capture a live devin green-after reproduction (no refusal, fixed adapter, same directory type) [REQ-004]
  - **Evidence**: With `--respect-workspace-trust false`, exit 0, devin returned "PONG".
- [x] T012 Update `implementation-summary.md` with the verification evidence above
  - **Evidence**: `implementation-summary.md` Verification table updated with REQ-001..004 rows (commit `dfdd41f531`).

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
  - **Evidence**: T001-T012 above, all landed in commit `dfdd41f531`.
- [x] No `[B]` blocked tasks remaining
  - **Evidence**: No `[B]` markers present in this file.
- [x] REQ-004 live red-before/green-after evidence recorded
  - **Evidence**: Red exit 1 "Refusing to run in an untrusted workspace"; green exit 0 "PONG" (commit `dfdd41f531`).

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
