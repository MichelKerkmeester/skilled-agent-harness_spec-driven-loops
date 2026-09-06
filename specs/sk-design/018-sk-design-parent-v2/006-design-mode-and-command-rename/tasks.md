---
title: "Tasks: give the moved modes and commands the hub's name"
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
# Tasks: give the moved modes and commands the hub's name

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

- [x] **T001** Pin the closing-phase replay as the pre-rename comparison target
- [x] **T002** Measure the blast radius: 249 files inside the trees, 43 live chart references, 122 live diagram references, 527 historical
- [x] **T003** Confirm the fleet is green before renaming anything
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T004** `git mv` both mode trees; verify 249 `R` entries before going further
- [x] **T005** Sweep live references inside the trees and across `.opencode`, excluding generated artifacts
- [x] **T006** Move both commands and their six assets onto the `/design:` surface, dropping the family prefix to match `extract-*`
- [x] **T007** Rewrite the moved command files: command names, mode names, asset paths
- [x] **T008** Remove chart and diagram from the markdown agent's invocation list and resource table
- [x] **T009** Rewrite the design agent: four-mode description, four new capability rows, and nine reference paths that had pointed at the pre-hub location
- [x] **T010** Apply both agent edits across all five runtime forms
- [x] **T011** Rename two diagram docs named for the old command
- [x] **T012** Fix the command-metadata choreography asset paths the fleet gate caught
- [x] **T013** Regenerate leaf manifests, derived blocks, command bridges, the trigger index and the compiled-routing manifests
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T014** Rebuild the advisor; observe generation 649 to 650
- [x] **T015** Replay the sixteen phrases and diff against the pinned baseline
- [x] **T016** Replay the new mode names and a command-shaped phrase
- [x] **T017** Fleet metadata audit, leaf-manifest freshness, derived freshness, `skill_graph_validate`
- [x] **T018** Agent mirror-sync checker for both agents
- [x] **T019** `check-corpus.cjs --render` from the renamed chart path
- [x] **T020** Compiled-routing guard, before pushing rather than at push time
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] 249 mode files and 8 command files moved as renames
- [x] `/design:chart` and `/design:diagram` resolve; the `/create:` paths are gone
- [x] The design agent claims both; the markdown agent claims neither
- [x] Sixteen-phrase replay byte-identical to the pre-rename capture
- [x] Every gate green, including the compiled-routing guard
- [x] No live reference to an old name; `specs/` and the benchmark reports keep theirs
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
Every gate below was required to print its own result line, and the replay was taken at daemon generation 650 after an explicit rebuild, and the compiled-routing
guard was run locally rather than discovered at push time.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] `spec.md` scope frozen before any file moved
- [x] The pre-rename replay pinned before any file moved; it cannot be recaptured
- [x] The blast radius counted rather than estimated: 249 inside, 165 live outside, 527 historical
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] No task id, requirement id, phase number or spec path in any code comment
- [x] One genuine runtime path changed, the post-edit router; no adjacent hook logic touched
- [x] Existing patterns reused rather than replaced; no adjacent code tidied
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] Rename detection: 249 mode files, 8 command files, 2 docs
- [x] Sixteen-phrase replay: byte-identical to the pinned baseline
- [x] `sk-design-chart` and `sk-design-diagram`: 0.9139 each, above the 0.82 the old names scored
- [x] Fleet metadata audit: 13/13 after the choreography paths were fixed
- [x] Leaf-manifest freshness: 13 fresh
- [x] Derived freshness: 13 fresh, 0 stale
- [x] `skill_graph_validate`: 0 errors
- [x] Agent mirror-sync: both agents, all mirrors in sync
- [x] `check-corpus.cjs --render` from the renamed path: `RESULT: PASSED`
- [x] Compiled-routing guard: all hubs fresh
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] Both trees renamed, not just the chart one
- [x] Both agents updated in all five runtime forms, not only the `.opencode` originals
- [x] The design agent's nine dead reference paths fixed while it was open; they had pointed at the
      pre-hub location since the hub conversion and no gate reported them
- [x] The command-metadata choreography paths fixed after the fleet gate caught them, which a
      name-only sweep would have missed
- [x] Every generated artifact regenerated by its own tool
- [x] A mid-phase sweep that rewrote eight benchmark reports was caught and reverted; those describe
      runs against a tree that was named differently, and rewriting them falsifies the record
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

- [x] `spec.md` records why the rename reverses `004`, and what evidence changed
- [x] `implementation-summary.md` records what shipped, with the commit hash
- [x] `acceptance-criteria.md` rows carry observed evidence, not intentions
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] Both modes and both commands sit under the design hub, named for it
- [x] Nothing left at the old path that a live reference still needs
- [x] No task-created temporary file in the scoped diff
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Gate | Result |
|------|--------|
| Rename detection | 249 mode files, 8 command files, 2 docs, all `R` |
| Sixteen-phrase replay, generation 650 | Byte-identical to the pre-rename baseline |
| New mode names | `sk-design-chart` and `sk-design-diagram` at 0.9139 |
| Fleet metadata audit | 13/13, both hubs class H |
| Leaf-manifest / derived freshness | 13 fresh / 13 fresh, 0 stale |
| `skill_graph_validate` | 0 errors |
| Agent mirror-sync | Both agents in sync across five runtime forms |
| `check-corpus.cjs --render` | `RESULT: PASSED` from the renamed path |
| Compiled-routing guard | All hubs fresh |

The rename cost no routing at all: the replay is byte-identical. The new mode names score higher than
the old ones did.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] Four modes under one hub, all four named for it, with every router path resolving
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
- [x] The compiled-routing guard run locally, so the push is not the first thing to discover a stale hub
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
