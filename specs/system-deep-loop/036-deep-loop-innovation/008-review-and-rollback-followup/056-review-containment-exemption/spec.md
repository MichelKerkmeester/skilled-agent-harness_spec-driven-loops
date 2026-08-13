---
title: "Feature Specification: Review Containment Exemption"
description: "Exempt the runtime's own generated state (runtime/database telemetry + description.json/descriptions.json memory-index metadata) from fatal write-containment reverts, so fan-out reviews can run without the runtime's own writes failing the lineage."
trigger_phrases:
  - "review containment exemption"
  - "isRegenerableRuntimeState predicate"
  - "write-containment regenerable state exemption"
  - "fan-out review runtime database exempt"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/008-review-and-rollback-followup/056-review-containment-exemption"
    last_updated_at: "2026-08-13T14:27:57.000Z"
    last_updated_by: "markdown-agent"
    recent_action: "Documented the landed fix in commit 1fb79e0106, verified via git show and tsc"
    next_safe_action: "None; packet complete, no follow-up required"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the exemption weaken source protection elsewhere? No; only runtime/database/* and description.json/descriptions.json basenames match, and a control test proves a non-exempt out-of-scope source write is still reverted."
---
# Feature Specification: Review Containment Exemption

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `system-deep-loop/0144-036-p0-remediation` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Fan-out review lineages died because the runtime writes its own git-tracked generated state during a contained lineage: telemetry under `runtime/database/` and the spec memory-index (`descriptions.json` / `description.json`). `enforceWriteContainment` treated any tracked out-of-scope modification as a fatal breach, reverting it and failing the lineage, even though those files are regenerable runtime state, not lineage source output.

### Purpose

Add a narrow predicate that reclassifies exactly those paths as advisory: preserved on disk, never reverted, never fatal. Every other out-of-scope tracked write stays fatally guarded, so lineage source is still protected.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `isRegenerableRuntimeState` predicate in `write-containment.ts`: matches `.opencode/skills/system-deep-loop/runtime/database/*` paths and exact `description.json`/`descriptions.json` basenames (including nested paths ending in those basenames).
- Partitioning detected out-of-scope violations into `exempted` (regenerable state) and `guarded` (everything else) before the revert step, so only `guarded` violations are ever reverted.
- A new test suite proving the exemption is narrow: it matches only the intended paths, preserves tracked runtime-database writes as non-fatal advisories, and a non-exempt out-of-scope source write is still reverted.

### Out of Scope

- Any other write-containment behavior (in-HEAD vs not-in-HEAD partitioning, the containment_violation event log, unattributable-path handling) beyond adding the new exemption.
- Fixing any other finding from `053-runtime-code-review`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` | Modify | Add `isRegenerableRuntimeState`; partition detected violations into exempted vs guarded before revert |
| `.opencode/skills/system-deep-loop/runtime/tests/unit/write-containment.vitest.ts` | Modify | Add tests for the predicate's narrowness and the exemption's non-fatal-advisory behavior |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `isRegenerableRuntimeState` exempts only runtime-database paths and exact memory-index basenames | Returns `true` for `runtime/database/*.sqlite` and `description.json`/`descriptions.json` (including nested), `false` for arbitrary source paths, other `database/` directories, and near-miss basenames (e.g. `description.json.bak`) |
| REQ-002 | Exempted paths are preserved on disk, never reverted, never fatal | `enforceWriteContainment` returns exempted paths in `advisories` with an empty `violations` list and no revert action for them |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Non-exempt out-of-scope source writes remain fatally guarded | A control test proves a write outside the exemption is still reverted |
| REQ-004 | Pinned `tsc` and per-file `vitest` both pass | `tsc --noEmit` return code 0; `vitest` for `write-containment.vitest.ts` green |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A contained lineage that writes to `runtime/database/` or `description.json`/`descriptions.json` no longer fails the lineage or loses that regenerated state.
- **SC-002**: A non-exempt out-of-scope source write is still fatally reverted, proving the exemption did not widen the containment boundary.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | An overly broad predicate could exempt real source writes | Source protection would silently weaken | Predicate matches only an exact directory prefix and exact basenames, not substrings; a dedicated test proves `other/database/graph.sqlite` and `description.json.bak` are NOT exempt |
| Dependency | `runtime/database/` as the sole telemetry write location | If telemetry writes move elsewhere, the exemption would miss them | Out of scope for this fix; would need a follow-up predicate update |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

(none)

<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
