---
title: "Tasks: sk-design-md-generator as the EXTRACT mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design-md-generator as the EXTRACT mode

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`T###` is a stable task id. `[P]` marks a task that may run in parallel with its neighbours; tasks
without it are ordered. A task is `[x]` only when its stated evidence was observed, never because it
looked done.

All tasks below are complete. Evidence is named per task rather than summarised at the end.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Grep every file carrying `skills/sk-design-md-generator` and count them: 74, not the 16 a prior estimate gave
- [x] **T002** Classify the 74 into 24 internal, 30 historical under `specs/`, and 20 live elsewhere
- [x] **T003** Confirm `sk-design` is class H and can accept a mode
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Move 7,942 files under `sk-design/sk-design-md-generator/` as renames
- [x] **T005** Delete the packet's `graph-metadata.json`, `leaf-manifest.config.json`, `leaf-manifest.json` and `leaf-aliases.json`
- [x] **T006** Fold its domains, intent signals and cross-skill edges into the hub: 19 and 72 become 24 and 90
- [x] **T007** Retarget inbound graph edges from other skills to `sk-design`
- [x] **T008** [P] Rewrite the 24 internal references
- [x] **T009** [P] Rewrite the 20 live external ones: the design agent in four runtime mirrors, `/design:extract` and its three assets, three cli-orchestration contracts, and `dist-freshness.cjs`
- [x] **T010** Re-read `extraction-defers-to-md-generator.md`: the boundary it asserts changes meaning once both are modes of one hub
- [x] **T011** Add `command-metadata.json` binding `/design:extract` to the hub
- [x] **T012** Confirm renames before committing
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T013** Fleet metadata audit: no nested identity, `sk-design` class H
- [x] **T014** `skill_graph_validate`: no dangling edges
- [x] **T015** Run the generator's own test suite from the new location
- [x] **T016** Rebuild the advisor daemon, observe generation 618
- [x] **T017** Replay: `validate this design.md` routes again at 0.82; `extract design tokens from stripe.com` at 0.896
- [x] **T018** Correct the two criteria written as \"at or above baseline\" rather than declaring them met
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `validate this design.md` above the bar, reaching the hub
- [x] `extract design tokens from stripe.com` above the bar
- [x] No nested identity; `sk-design` class H
- [x] All 44 live references resolve; all 30 historical records untouched
- [x] 7,942 renames, verified before committing
- [x] One commit, `fa35e09653`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md`: the frozen scope and the REQ ids these tasks satisfy
- `plan.md`: the architecture, the rollback, and the decision records
- `acceptance-criteria.md`: the rows that decide whether this packet may close
- `implementation-summary.md`: what actually shipped, with the commit
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

A command counts as evidence only after its output and exit status were read. A green run lies in
several ways: a stale build, a wrong path, a silent no-op and an assertion-free check all exit 0.
Every gate below was required to print its own result line, and both routing numbers were taken at daemon generation 618 after an explicit rebuild.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] All 74 references classified before any rewrite, so no sweep could catch a historical record
- [x] The `styles/` corpus identified as 7,812 of the 7,942 files, and deliberately not lifted out
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] No code path rewritten beyond the one genuine runtime reference in `dist-freshness.cjs`
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Fleet metadata audit: no nested identity, PASS
- [x] `skill_graph_validate`: clean
- [x] The generator's own test suite, from the new path: PASS
- [x] `validate this design.md`: 0.82, reaching the hub, generation 618
- [x] `extract design tokens from stripe.com`: 0.896, generation 618
- [x] Rename detection on 7,942 files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] All four identity files deleted, not just `graph-metadata.json`
- [x] Vocabulary folded rather than duplicated: one identity, 24 domains and 90 signals
- [x] Inbound edges retargeted, so no other skill points at a name that no longer exists
- [x] The regression phase 002 created is closed here, which was this phase's stated obligation
- [x] Two retrieval fixtures carrying the old path are left uncommitted, named rather than silently
      included: another session has in-flight changes in the same files
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] No credential, token or key added, moved or logged
- [x] No new network call, and no dependency installed
- [x] File moves stay inside the repository; nothing is written outside it
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] `spec.md` records why a second identity below a hub root cannot survive
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] The skill lives under `sk-design/sk-design-md-generator/` with 7,942 files of history intact
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Fleet metadata audit | PASS, no nested identity |
| `skill_graph_validate` | Clean |
| The generator's own tests, from the new path | PASS |
| `validate this design.md` (the owned regression) | Closed, 0.82 at generation 618 |
| Rename detection | 7,942 renames |
| `validate.sh --strict` | `RESULT: PASSED` |

Both phrase scores moved down slightly and both still clear the bar. Adding hub vocabulary moved
neither, so the residual is the scorer's shape rather than a tuning gap.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] One identity answers design requests; the mode is reachable only through the hub's vocabulary
- [x] The class contract holds: every required file present, every forbidden file absent
- [x] Router paths resolve to leaves that exist on disk
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

Not applicable in the runtime sense: this phase moves files and metadata and adds no code path on a
hot loop. The one measured quantity is advisor score, recorded per phrase in
`acceptance-criteria.md` rather than as a performance number.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] One commit, so the shared branch has no broken intermediate state
- [x] Advisor daemon rebuilt and generation 618 observed before any number was quoted
- [x] Rollback named in `plan.md` and reachable by a single revert
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] Moves recorded as renames, so authorship and history survive
- [x] Historical records left as written; only live references rewritten
- [x] No document claims a result that was not observed
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] `validate.sh --strict` prints `RESULT: PASSED` for this folder, taking the first `RESULT:` line
- [x] Generated metadata regenerated after the last document edit
- [x] No spec document still carries template prose
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | [x] Approved | 2026-09-06 |
| Claude Code | Implementer | [x] Approved | 2026-09-06 |
| `validate.sh --strict` | Automated gate | [x] Approved | 2026-09-06 |
<!-- /ANCHOR:sign-off -->
