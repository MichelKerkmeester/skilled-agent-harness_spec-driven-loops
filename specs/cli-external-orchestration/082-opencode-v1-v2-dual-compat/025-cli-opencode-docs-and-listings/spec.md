---
title: "Feature Specification: Phase 25: cli-opencode-docs-and-listings"
description: "Five rows of the post-merge fix list are cli-opencode documentation drifts and one listing check that compares unlike things: a retired default model id, two stated agent directories, a discontinued --share flag, a stale --log-level note, and v1 and v2 command listings compared without subtracting built-ins or the v2 walk-up. This phase corrects each against live probes and adds a check that holds it."
trigger_phrases:
  - "cli opencode docs and listings"
  - "phase 25 cli opencode docs"
  - "command-listed battery leg"
  - "opencode share flag discontinued"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 25: cli-opencode-docs-and-listings

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-20 |
| **Branch** | `worktrees/164-opencode-cli-docs-listings` |
| **Parent Spec** | ../spec.md |
| **Phase** | 25 of 26 |
| **Predecessor** | 023-sk-vision-runtime-fixes |
| **Successor** | 026-ci-and-test-runners |
| **Handoff Criteria** | Every row this phase owns is fixed or recorded with live evidence, and the battery's `command-listed` leg passes on CI on both families at the pushed commit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 25** of the OpenCode v1 and v2 dual-compatibility specification. It closes the cli-opencode documentation and command-listing group of the post-merge fix list.

**Scope Boundary**: Rows 9, 10, 11, 12 and 31 of the fix list in `../014-post-merge-deep-research/research/research.md` §6. The other rows belong to phases 021 to 024 and 026.

**Dependencies**:
- The fix list in `../014-post-merge-deep-research/research/research.md`, rows 9, 10, 11, 12 and 31, and the findings it cites in `../014-post-merge-deep-research/research/iterations/iteration-003.md` and `../016-post-merge-research-cli-opencode-ci/`.
- OpenCode 1.19.3 (`opencode`) and 2.0.32 (`opencode2`) installed locally, probed only with private data homes, databases and ports.

**Deliverables**:
- A `command-listed` leg in the doctor's OpenCode version battery for both families.
- Corrected cli-opencode documentation for the default model id, the agent directory, `--share` and the `run` flag tables, and a test that keeps the default model id aligned.
- This folder's spec, plan, tasks and implementation summary, the live probe captures under `scratch/`, the mutation runs under `scratch/mutation/` and the parent phase map row.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The cli-opencode docs disagree with the installed binaries. Most of them dispatch `opencode-go/deepseek-v4-flash` on OpenCode 1, an id `opencode models opencode-go` no longer lists, while the roster and `SKILL.md` name `opencode-go/deepseek-v4.1-flash`. They say agents load from `.skilled/agents/` in some places and `.opencode/agents/` in others. They present `--share` as a flag that publishes a session, but on 1.19.3 it is a hidden, deprecated no-op. The `run` flag table calls `--log-level` unverified on OpenCode 2 and leaves out several 1.19.3 flags. Separately, the v1 and v2 command listings were compared as-is, so the v2 built-ins `init` and `review` and the v2 merge of every ancestor `.opencode` folder read as drift, and the main checkout carried an orphaned `.skilled/commands/deep/assets/compiled/` folder.

### Purpose
Every stated fact in rows 10, 11, 12 and 31 matches a live probe of 1.19.3 or 2.0.32, the default model id cannot drift again without a failing test, and the battery checks each family's command listing against the command folders it actually reads.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Row 9: a `command-listed` battery leg that subtracts the v2 built-ins and allows the v2 ancestor walk-up, with nested and isolated fixtures, and a read-only check of the orphaned folder in the main checkout.
- Row 10: one default model id across the current cli-opencode docs, and a test that holds the docs to the roster.
- Row 11: one statement of where OpenCode loads agents from, after a live agent listing on both versions.
- Row 12: `--share` documented as the hidden, deprecated no-op it is on 1.19.3 and absent on 2.0.32, and dropped from every dispatch example, including the testing playbook.
- Row 31: the `run` flag table and the core flag summary refreshed against `run --help` captured from both versions.

### Out of Scope
- Deleting anything in the main checkout - the orphaned folder was already gone when this phase checked it (`scratch/row9-main-orphan.txt`).
- The changelog and benchmark folders - they are dated records of what was true then.
- `opencode2 models <provider>`, which 2.0.32 rejects with `Unexpected positional argument` - found while probing row 10, not a row of this group, recorded in the implementation summary.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modify | The `command-listed` leg for both families and the v2 command read |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modify | Nested, isolated, v1, missing, unparsed, global and folder-spelling cases, and R9 with the third degraded row |
| `.skilled/command-support/doctor/scripts/README.md` | Modify | The `command-listed` leg in the leg list |
| `.skilled/skills/cli-external-orchestration/cli-opencode/**` current docs | Modify | The default model id, the agent directory, `--share` and the flag tables (changelog and benchmark folders untouched) |
| `.skilled/skills/cli-external-orchestration/cli-opencode/hard-rules.json` | Modify | The `share-requires-confirmation` message only |
| `.skilled/skills/cli-external-orchestration/cli-opencode/scripts/tests/default-model-id.test.cjs` | Create | The roster default, `SKILL.md`'s default and no current doc on the retired id |
| `.skilled/hooks/dispatch/README.md` | Modify | The `share-requires-confirmation` row description |
| `.github/workflows/opencode-dual-version.yml` | Modify | Run the new test in the unit-test step and trigger on the cli-opencode skill |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Row 9: the battery compares each family's command listing like for like. | The `command-listed` leg passes on v1 and v2 live in this nested worktree, its tests fail on main's battery and on each of two mutants (`scratch/mutation/row9-*.txt`), and it passes on CI on both families at the pushed commit. |
| REQ-002 | Row 10: one default model id, held by a test. | `default-model-id.test.cjs` passes, fails against main's docs (`scratch/mutation/row10-m0-old-docs.txt`), and runs in the blocking battery job. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Row 11: one agent directory statement. | The live listings show the same 11 repo agents on both versions (`scratch/row11-v1-agent-list.txt`, `scratch/row9-row11-v2-nested-listings.txt`), and no current doc says OpenCode loads agents from `.skilled/agents/`. |
| REQ-004 | Row 12: `--share` matches the binary. | The binary defines it as hidden and deprecated, a live run prints `Session sharing has been discontinued` (`scratch/row12-*.txt`), and no current doc or playbook command passes it or says it publishes. |
| REQ-005 | Row 31: the flag table matches `run --help`. | Every flag in `scratch/row31-v1-run-help.txt` and `scratch/row31-v2-run-help.txt` has a row or a mention, and `--log-level` is no longer called unverified on OpenCode 2. |
| REQ-006 | Row 9 cleanup: the orphaned folder is accounted for. | A read-only check of the main checkout records whether `.skilled/commands/deep/assets/compiled/` exists and is tracked (`scratch/row9-main-orphan.txt`). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Each of rows 9, 10, 11, 12 and 31 is fixed, documented or upstream, with its live evidence in this folder.
- **SC-002**: The changed workflow passes `check-gate-inputs.sh` and `actionlint`, and every CI run on the pushed main commit is read.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A runner with a global OpenCode command folder fails `command-listed` | Low | Global config folders are read from the same environment the binary sees and allowed on both families |
| Risk | A future v2 adds a built-in command | Low | The leg names the stray, and CI pins 2.0.32 |
| Risk | A probe touches the shared v2 service | High | Every v2 read starts its own `serve` on a free loopback port with a private database and data home; `opencode2 models` was run only in its failing positional form, which exits before contacting a server |
| Dependency | Phases 022 and 024 may land on main while this phase works | Low | The merge keeps every parent phase map row from both sides |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which user-level agent directories OpenCode 2.0.32 reads. 1.19.3's are confirmed from its config directory list; 2.0.32's are not.
<!-- /ANCHOR:questions -->

---
