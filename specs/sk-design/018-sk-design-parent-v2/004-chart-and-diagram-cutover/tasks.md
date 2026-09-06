---
title: "Tasks: chart and diagram as sk-design modes"
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
# Tasks: chart and diagram as sk-design modes

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

- [x] **T001** Confirm both hubs are class H and their current router signals resolve to packets on disk
- [x] **T002** Inventory every surface that must change on both hubs, including the counts written in prose
- [x] **T003** Record the baseline scores for the four chart and diagram phrases and the three `sk-doc` controls
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** Move both mode trees under `sk-design/` as 249 renames
- [x] **T005** Move registry rows, router signals, vocabulary classes and tie-break order between the two hubs
- [x] **T006** Update both `ROUTER.md` intents and resource maps
- [x] **T007** Move the chart and diagram vocabulary between the two `graph-metadata.json` files
- [x] **T008** Add eleven `intent_signals` to `sk-design` to fix four phrases that reached nobody at baseline
- [x] **T009** [P] Update both `description.json` files and both `SKILL.md` mode tables, including the counts in prose
- [x] **T010** [P] Rebind `command-metadata.json` for `/create:chart` and `/create:diagram`
- [x] **T011** Update the Python scorer shim that hardcodes `diagram` and `flowchart` to `sk-doc`
- [x] **T012** Regenerate the four runtime command mirrors with their own scripts rather than by hand
- [x] **T013** Update `post-edit-router.cjs`, a genuine runtime path
- [x] **T014** Follow the 56 live path references
- [x] **T015** Re-mint the `sk-doc` compiled routing manifest
- [x] **T016** Confirm renames before committing; both hubs in one commit
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T017** Fleet metadata audit: both hubs class H, in the same commit
- [x] **T018** Rebuild the advisor daemon, observe generation 628
- [x] **T019** Replay: `create a chart`, `chart template`, `sk-create-chart` and `make a diagram` name `sk-design`
- [x] **T020** Replay the three `sk-doc` controls and confirm they are unchanged
- [x] **T021** Confirm the four previously dead phrases are now above the bar
- [x] **T022** Run `check-corpus.cjs --render` from the skill's new location; require `RESULT: PASSED`
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Chart and diagram phrases name `sk-design`, above the bar
- [x] `sk-doc` no longer claims them; its three controls unchanged
- [x] Both hubs class H in the same commit
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED`, 26 forms
- [x] 249 renames, verified before committing
- [x] Daemon rebuilt and generation 628 observed before any routing claim
- [x] One commit, `e34e225517`
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
Every gate below was required to print its own result line, and the replay was taken at daemon generation 628 after an explicit rebuild, and the `sk-doc` compiled routing was re-minted rather than assumed fresh.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] Both hubs confirmed class H before either was edited
- [x] Baseline scores recorded for the four moving phrases and the three controls
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] `post-edit-router.cjs` updated as a real code path; no adjacent hook logic touched
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Fleet metadata audit, both hubs class H: PASS
- [x] `create a chart`, `chart template`, `sk-create-chart`, `make a diagram`: all name `sk-design`
- [x] `write a readme`, `build a feature catalog`, `create a repo rule file`: unchanged
- [x] `flowchart`, `make a chart of orders by month`, `redraw this drawio diagram`, `ascii flowchart of the approval loop`: above the bar, previously nothing
- [x] `check-corpus.cjs --render`, 26 forms, errors: 0
- [x] Rename detection on 249 files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Both hubs edited, not just the receiving one
- [x] Prose counts corrected wherever a mode count is written out, not only the registry rows
- [x] The scorer shim's hardcoded `diagram` and `flowchart` updated; a registry edit alone would have
      left it routing to `sk-doc`
- [x] The four runtime mirrors regenerated by their own scripts, so they cannot drift from source
- [x] Both silent caches refreshed by name: the advisor daemon and the `sk-doc` compiled routing
- [x] A regression the move introduced, where `chart template` briefly reached nobody, found and fixed
      rather than shipped
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

- [x] `spec.md` records why chart and diagram belong to a design hub rather than a documentation one
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Both mode trees live under `sk-design/`, keeping their `sk-create-` prefix by decision
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Fleet metadata audit, both hubs | PASS, class H |
| Four chart and diagram phrases | Name `sk-design`, generation 628 |
| Three `sk-doc` control phrases | Unchanged |
| Four previously dead phrases | Above the bar |
| `check-corpus.cjs --render` | `RESULT: PASSED`, 26 forms |
| Rename detection | 249 renames |
| `validate.sh --strict` | `RESULT: PASSED` |

The phase found more than a clean cutover: vocabulary in `description.json` moves no advisor score at
all, confirmed twice. Eleven signals in `graph-metadata.json` fixed four phrases the packet had
recorded as an inherited weakness and put out of scope.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Two hubs stay internally consistent: no router signal names a packet that is not on disk
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
- [x] Advisor daemon rebuilt at generation 628 and the `sk-doc` compiled routing re-minted
- [x] Rollback named in `plan.md` and reachable by a single revert, plus a re-mint and a rebuild on the way back
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
