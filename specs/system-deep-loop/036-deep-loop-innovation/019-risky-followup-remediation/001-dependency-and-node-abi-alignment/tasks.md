---
title: "Tasks: better-sqlite3 Version + Node-ABI Alignment"
description: "Task breakdown for aligning better-sqlite3 across skills and adding a self-healing Node-ABI guard."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T11:05:01.015Z"
    last_updated_by: "claude"
    recent_action: "Authored the dependency/Node-ABI task list"
    next_safe_action: "Execute Phase 1"
---
# Tasks: better-sqlite3 Version + Node-ABI Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[B]` | Blocked |

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture installed + declared better-sqlite3 in runtime + system-spec-kit (`package.json`, lockfiles)
- [ ] T002 Enumerate every other repo consumer of better-sqlite3 (`rg better-sqlite3`)
- [ ] T003 Capture running Node `process.versions.modules`; confirm ABI is the real matcher
- [ ] T004 Decide canonical version + direction (default: runtime up to `12.11.1`) with rationale
- [ ] T005 Decide ABI-guard location + rebuild trigger

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 Align `better-sqlite3` to the canonical version + lockfiles
- [ ] T007 Update the `dependency-seams` PINNED constant only if the version moved
- [ ] T008 Add the ABI-mismatch guard + `npm rebuild` (warn-and-continue when toolchain absent)
- [ ] T009 `node --check` / typecheck the guard module

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T010 `dependency-seams.vitest.ts` passes
- [ ] T011 better-sqlite3 loads from both skills; memory MCP smoke passes
- [ ] T012 Force a stale-ABI build; confirm the guard repairs it
- [ ] T013 Whole runtime suite vs 017 baseline: no new failures
- [ ] T014 `validate.sh --strict` clean; reconcile docs

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] Canonical version aligned across both skills
- [ ] ABI guard proven to self-heal
- [ ] No new whole-suite regression
- [ ] Docs validated

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Parent**: `../spec.md`

<!-- /ANCHOR:cross-refs -->
