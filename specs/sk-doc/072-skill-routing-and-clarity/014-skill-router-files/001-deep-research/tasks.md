---
title: "Tasks: Phase 1: deep-research"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "skill router files research tasks"
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

`R` is this phase's `research/` folder.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Write the research config with the Luna lineage (`R/deep-research-config.json`). Verify: its `fanout.executors[0].model` is `gpt-6-luna` and `iterations` is 3.
- [x] T002 Confirm Codex is logged in. Verify: `codex login status` prints `Logged in using ChatGPT`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Lineages

- [x] T003 Run the Luna lineage on RQ-1 to RQ-5 (`R/lineages/luna/`). Verify: `ls R/lineages/luna/iterations` lists three files and the ledger ends with `completed`.
- [x] T004 Run one DeepSeek iteration on RQ-6 (`R/lineages/deepseek/`). Verify: `ls R/lineages/deepseek/iterations` lists `iteration-001.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Synthesis

- [x] T005 Merge the lineages (`fanout-merge.cjs`). Verify: it prints `merged_lineages: 2`.
- [x] T006 Write the root synthesis (`R/research.md`). Verify: it has sections 1 to 17, Eliminated Alternatives and Divergence Map.
- [x] T007 Check the load-bearing citations. Verify: the Hermes copy step, the replay fallback, RS-004, the advisor freshness probes and the plugin signature match their cited lines.
- [x] T008 Record the closeout and mark the config complete. Verify: the gateway prints `"ok":true` and the config `status` is `complete`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: the cited lines match the findings
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `research/research.md`
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

- [x] CHK-001 [P0] Research questions documented in spec.md
- [x] CHK-002 [P0] The lineage plan defined in plan.md
- [x] CHK-003 [P1] Both executors available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] N/A: research changes no code
- [x] CHK-011 [P1] Every finding carries a source line or is marked unconfirmed
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Load-bearing citations checked against the code
- [x] CHK-022 [P1] The two open items are named in research section 12
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential file read
- [x] CHK-031 [P0] Lineage writes stayed inside `research/`
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same lineages
- [x] CHK-041 [P1] The spec findings block summarizes all six answers
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Research artifacts live under `research/`
- [x] CHK-051 [P1] No temporary files left in the phase folder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
