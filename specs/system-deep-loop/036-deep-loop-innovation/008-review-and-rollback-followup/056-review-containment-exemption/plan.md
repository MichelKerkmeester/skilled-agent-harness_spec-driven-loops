---
title: "Implementation Plan: Review Containment Exemption"
description: "Technical plan for exempting regenerable runtime state from fatal write-containment. All 2 phases landed and verified in commit 1fb79e0106."
trigger_phrases:
  - "review containment exemption plan"
  - "isRegenerableRuntimeState plan"
  - "write-containment exemption plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/056-review-containment-exemption"
    last_updated_at: "2026-08-13T08:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the 2-phase plan against commit 1fb79e0106's actual diff"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Review Containment Exemption

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript |
| **Runtime surface** | `system-deep-loop` runtime, `write-containment.ts` |
| **Storage** | N/A (containment logic only; no schema change) |
| **Testing** | vitest (`tests/unit/write-containment.vitest.ts`), pinned `tsc` |

### Overview

A single new predicate, `isRegenerableRuntimeState`, identifies paths the runtime itself writes as regenerable state (telemetry under `runtime/database/`, and the memory-index files `description.json`/`descriptions.json`). `enforceWriteContainment` now partitions detected out-of-scope violations into `exempted` (matches the predicate) and `guarded` (everything else) before running the revert step, so only `guarded` violations can ever be reverted or counted as fatal.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem confirmed: fan-out review lineages were failing on the runtime's own `runtime/database/` and memory-index writes
- [x] Fix scope documented in `spec.md` (one predicate, one partition point, one test file)
- [x] Success criteria measurable (SC-001, SC-002)

### Definition of Done

- [x] REQ-001 and REQ-002 implemented (commit `1fb79e0106`)
- [x] REQ-003 control test added and passing (commit `1fb79e0106`)
- [x] REQ-004 pinned `tsc` return code 0, per-file `vitest` green — re-verified during this documentation pass: `tsc` exit 0, `vitest` 22/22 passed

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Predicate-gated partition before revert — `enforceWriteContainment` already partitioned reverted paths into `violations` (fatal) and `advisories` (preserved, non-fatal) after the revert step; this fix adds an earlier partition (`exempted` vs `guarded`) so regenerable state never even reaches the revert step.

### Key Components

- **`isRegenerableRuntimeState`** (`write-containment.ts`) — new predicate; `true` for `.opencode/skills/system-deep-loop/runtime/database/*` paths and for paths whose basename is exactly `description.json` or `descriptions.json`.
- **`enforceWriteContainment`** — now computes `exempted = detected.filter(isRegenerableRuntimeState)` and `guarded = detected.filter(!isRegenerableRuntimeState)` before calling `revertOutOfScopeViolations` with only `guarded`; the final `advisories` array is `[...exempted, ...guarded-preserved]`.
- **`__internals.isRegenerableRuntimeState`** — exported for direct unit testing of the predicate's boundary behavior.

### Data Flow

1. `enforceWriteContainment` detects out-of-scope tracked/untracked modifications during a contained lineage.
2. Detected violations are partitioned: `exempted` (regenerable runtime state) vs `guarded` (everything else).
3. Only `guarded` violations go through `revertOutOfScopeViolations`; `exempted` paths are left untouched on disk.
4. The final result's `advisories` array includes both `exempted` paths and any `guarded` paths that were preserved as untracked; `violations` (fatal) contains only `guarded` paths that were reverted from HEAD.
5. A contained review lineage that only touched `runtime/database/` or memory-index files now returns zero fatal `violations`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Predicate and partition

- [x] Add `isRegenerableRuntimeState` matching `runtime/database/*` and exact `description.json`/`descriptions.json` basenames (`write-containment.ts`, commit `1fb79e0106`)
- [x] Partition `detected` into `exempted`/`guarded` before the revert call; feed only `guarded` to `revertOutOfScopeViolations`; merge `exempted` into the final `advisories` (commit `1fb79e0106`)
- [x] Export `isRegenerableRuntimeState` via `__internals` for direct testing

### Phase 2: Verification

- [x] Add a boundary test proving the predicate matches only the intended paths and rejects near-misses (`other/database/...`, `description.json.bak`) (commit `1fb79e0106`)
- [x] Add a behavioral test proving a tracked `runtime/database/` write is preserved as a non-fatal advisory with an empty `revertResult.reverted` (commit `1fb79e0106`)
- [x] Confirm the pre-existing control proving a non-exempt out-of-scope source write is still reverted
- [x] Run pinned `tsc` (return code 0) and per-file `vitest` (green) — re-verified during this documentation pass: `tsc` exit 0, `vitest` 22/22 passed

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit (boundary) | `isRegenerableRuntimeState` path matching, including near-miss rejections | vitest (`write-containment.vitest.ts`) |
| Unit (behavioral) | `enforceWriteContainment` preserves exempted paths as non-fatal advisories | vitest (`write-containment.vitest.ts`) |
| Unit (control) | A non-exempt out-of-scope source write is still reverted | vitest (`write-containment.vitest.ts`) |
| Type-check | `write-containment.ts` and its callers | pinned `tsc`, return code 0 required |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| `write-containment.ts` | Internal | Modified, landed in commit `1fb79e0106` | REQ-001/REQ-002 cannot land |
| `.opencode/skills/system-spec-kit/node_modules/.bin/tsc` (pinned) | Internal | Present, used for the type-check gate | REQ-004 tsc leg cannot be verified |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The exemption is later found to match an unintended path, weakening source protection.
- **Procedure**:
  1. Revert `write-containment.ts` and `write-containment.vitest.ts` to their pre-`1fb79e0106` state.
  2. Fan-out review lineages return to failing whenever the runtime writes its own `runtime/database/` telemetry or memory-index metadata, until a corrected exemption lands.

<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
