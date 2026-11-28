---
title: "Feature Specification: Phase 12: folder-architecture"
description: "Give every .skilled path the parity build touched a clearer folder and file architecture with less unneeded nesting, through a measured move map, git mv and a reference update in the same change, with no behavior change and every gate still green."
trigger_phrases:
  - "folder architecture"
  - "phase 12 folder architecture"
  - "bots skill folder structure"
  - "less unneeded nesting"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 12: folder-architecture

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-28 |
| **Branch** | `system-skilled-bots` |
| **Parent Spec** | ../spec.md |
| **Phase** | 12 of 15 |
| **Predecessor** | 011-messaging-channels |
| **Successor** | 013-manual-testing-scenarios |
| **Handoff Criteria** | `scratch/move-map.md` holds a reason for every move it lists and every move landed through `git mv`. The runtime suite and typecheck, the crate's fmt, clippy and tests, the deep-loop executor audit tests, `parent-skill-check.cjs`, the gate-input check and the playbook validator at `scenarios=58 violations=0` all pass from the final state. Every folder in the move map's README table that reads `readme` holds a `README.md` that `validate_document.py` passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 12** of the Build OpenBot parity for skilled bots from the 002 research: activity, routines, terminal screen, workspace, memory, approvals, apps, vault, skills and chat specification. The operator added it on 2026-11-28 to make the folder and file architecture clearer, with less unneeded nesting, across all of `.skilled` that the build touched.

**Scope Boundary**: Moves, the reference updates each move needs and a README for each folder the README table lists, nothing else. The phase changes no behavior, no output, no record shape and no test assertion beyond a path it names.

**Dependencies**:
- 011.007, 010.003 and every runtime unit, because 011.005 to 011.007 and 010.003 still add files to the tree this phase restructures. The phase measures the tree only once they have merged.
- `relocate.mjs` for a move inside `specs/`, which owns the path records a packet move leaves behind.

**Deliverables**:
- `scratch/tree-baseline.md`: the tree measured when the phase opens.
- `scratch/move-map.md`: one row per candidate with its verdict, its target and its reason.
- The moves, each a `git mv` with every reference to the old path rewritten in the same change.
- A `README.md` in `.skilled/crates/`, a refreshed one in `.skilled/crates/bots-tui/` and one in each other folder the move map's README table lists, each authored through `/create:readme` and saying what belongs in the folder and what does not.
- `scratch/tree-after.md`: the same measures from the final state.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Eleven phases each added files where their own plan put them, so the bots skill grew by accretion rather than by a layout. On 2026-11-28 the skill held 365 tracked files, and 123 of its folders held exactly one file. Its `scripts/` tree is the extreme case, with 93 files in 92 folders, and a reader who opens a fixture walks up to nine path parts to reach it.

### Purpose
Every `.skilled` path the build touched sits in a layout a reader can follow without a map, with no folder that exists only to hold one file unless a reason in the move map keeps it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files .skilled/skills/system-skilled-bots | wc -l
     365
$ git ls-files .skilled/skills/system-skilled-bots | xargs -n1 dirname | sort | uniq -c | awk '$1==1' | wc -l
     123
$ git ls-files .skilled/skills/system-skilled-bots/scripts | wc -l
      93
$ git ls-files .skilled/skills/system-skilled-bots/scripts | xargs -n1 dirname | sort -u | wc -l
      92
$ git ls-files .skilled/skills/system-skilled-bots | awk -F/ '{print NF}' | sort -n | tail -1
9
$ git ls-files .skilled/crates/bots-tui | wc -l
      61
```
Measured on 2026-11-28 before 011.005 to 011.007 and 010.003 merged. These numbers describe the problem only. T001 measures again when the phase opens, and the move map reads that measure.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measure every in-scope root when the phase opens: its file count, its folder count, its folders that hold one file and its deepest path.
- Write a move map that gives each candidate a verdict, a target and a reason, and keeps a folder whenever moving it would break a gate or a routing rule.
- Move each mapped path with `git mv` and rewrite every reference to it in code, CI, docs and specs in the same change.
- Author a README through `/create:readme` for `.skilled/crates/`, `.skilled/crates/bots-tui/`, each new folder the move map lands and each folder the build created under an in-scope root, unless the README table gives the reason to skip it.
- Prove that nothing behaves differently: every gate passes from the final state with the same test counts as the baseline.

The in-scope roots are every `.skilled` path the build touched:
- `.skilled/skills/system-skilled-bots/`: the runtime lib and tests, the scripts and fixtures, the four mode packets, the playbook, the feature catalog, the references and the assets.
- `.skilled/crates/bots-tui/`.
- `.skilled/bin/bots.cjs`.
- The deep-loop executor audit files the build edited, `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` and the tests and docs that name it.

### Out of Scope
- Any change to behavior, output, a record shape or a test assertion beyond the path it names - the phase is a layout change and the gates prove it.
- A file the build did not touch - the operator scoped the phase to the build's own change set.
- The packet's own spec folders - they follow spec-kit's folder grammar, and `relocate.mjs` owns any move there.
- The hub root's fixed shape - `parent-skill-check.cjs` fixes which folders a hub root holds, so a move never adds a folder it forbids, such as `crates`.

### Files to Change

The exact paths come from the move map, so this table names the roots and what happens in each.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skilled-bots/` | Move/Modify | The mapped moves inside the skill and the reference updates they need |
| `.skilled/crates/bots-tui/` | Move/Modify | The mapped moves inside the crate, with its `design/` copy kept equal to the packet's design folders |
| `.skilled/bin/bots.cjs` | Modify | Any path the CLI names that a move changes |
| `.skilled/skills/system-deep-loop/runtime/` | Move/Modify | Only the executor audit files the build edited, when the map moves one |
| `.github/workflows/bots-runtime.yml` | Modify | Any path filter, manifest path or diff guard path a move changes |
| `specs/system-skilled-bots/003-openbot-parity-build/` | Modify | Every spec that names a moved path |
| `.skilled/crates/README.md` | Create | What belongs in the crates folder and what does not, authored through `/create:readme` |
| `.skilled/crates/bots-tui/README.md` | Modify | Refreshed through `/create:readme` so it says what belongs in the crate folder and what does not |
| `README.md` in each folder the README table marks `readme` | Create | One per new folder the move map lands and per build-created folder with no README, authored through `/create:readme` |
| `012-folder-architecture/scratch/` | Create | `tree-baseline.md`, `move-map.md`, `gate-baseline.md` and `tree-after.md`. The two `draft-*.md` files there are read-only drafts the opener replaces and deletes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The phase opens only after 011.007, 010.003 and every runtime unit have merged, and its first task measures every in-scope root as it then stands into `scratch/tree-baseline.md` |
| REQ-002 | `scratch/move-map.md` holds one row per candidate with its old path, its verdict of move or keep, its new path for a move and a reason. No move lands that the map does not list |
| REQ-003 | Every move is a `git mv`, so `git diff -M --diff-filter=D --name-only <base> HEAD` prints no path under an in-scope root, where `<base>` is the commit the phase opened on |
| REQ-004 | Every reference to a moved path is rewritten in the same change: for each move row, `rg -n -F '<old path>'` over the repository prints nothing outside this phase's `scratch/` |
| REQ-005 | No behavior changes. The runtime `npm test` prints the same `Test Files` and `Tests` counts as `scratch/gate-baseline.md` with no `failed`, and `npm run typecheck` exits 0 |
| REQ-006 | The crate gates hold. `cargo fmt --check`, `cargo clippy --locked --all-targets -- -D warnings` and `cargo test --locked` each pass with `--manifest-path` naming the crate, and each target prints the baseline's passed and ignored counts |
| REQ-007 | The deep-loop executor audit tests pass with the baseline counts, and the bots CI design diff guard passes when its diff commands run by hand |
| REQ-008 | `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/validate-playbook-package.cjs --package system-skilled-bots` prints `PASS` with `scenarios=58` and `violations=0` |
| REQ-009 | The hub stays valid: `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-skilled-bots` prints `OK: parent-skill-check`, and every path in the hub's `mode-registry.json` and `hub-router.json` resolves |
| REQ-010 | `bash .github/scripts/check-gate-inputs.sh` prints `RESULT: PASSED` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-011 | `scratch/tree-after.md` repeats the baseline's measures from the final state, and each root shows fewer one-file folders or a shallower deepest path, or the map's keep rows give the reason it does not |
| REQ-012 | Every folder the build created or that is unique in the layout holds a `README.md` authored through `/create:readme` that says what belongs in the folder and what does not. The set is `.skilled/crates/`, `.skilled/crates/bots-tui/`, each new folder the move map lands and each build-created folder under an in-scope root. The move map's README table lists each one with `readme` or `skip` and a reason. A skip is a fixture case folder, the crate's `design/` copy the CI diff guard compares, a feature catalog category folder or a folder whose parent README already says what it holds. Each `readme` row's file passes `validate_document.py` |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git diff -M --diff-filter=D --name-only <base> HEAD -- .skilled` prints nothing, so every move reads as a rename.
- **SC-002**: The runtime suite, the typecheck, the three cargo gates, the executor audit tests, the hub check, the gate-input check and the playbook validator all pass from the final state with the baseline counts.
- **SC-003**: `scratch/tree-after.md` shows fewer one-file folders under the skill than `scratch/tree-baseline.md`, or the map says why not.
- **SC-004**: `.skilled/crates/README.md`, `.skilled/crates/bots-tui/README.md` and every `readme` row's `README.md` exist and pass `validate_document.py`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 011.005 to 011.007 and 010.003 still add files | A map written before they merge misses their paths | REQ-001: the phase waits for them and measures only then |
| Risk | A moved path stays named somewhere a test does not read, such as a doc, a playbook step or a CI filter | High: a stale path fails later in CI or in an operator's hands | REQ-004's per-row `rg` over the whole repository, plus the gate-input check and the playbook validator |
| Risk | A move under the hub root breaks mode routing | High: a mode stops resolving | Keep rows for every folder `parent-skill-check.cjs` or the mode registry fixes, and REQ-009 |
| Risk | The crate's `design/` copy drifts from the packet's design folders | Med: the CI diff guard fails | REQ-007 runs the guard's diff commands by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A for performance and security targets: the phase moves files and changes no running code path. Reliability is the gate set in REQ-005 to REQ-010.
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: Every gate the baseline records passes from the final state with the same counts.
- **NFR-R02**: A revert of the phase's commits restores the baseline tree, because every move is a rename.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a measure that finds no folder worth moving yields a map of keep rows with reasons, and the phase closes with no move.
- Maximum input: a move of a folder that many files name is one row and one change, and its `rg` check covers every one of them.
- Failure path: a gate that fails after a move reverts that move's change rather than patching a test to match the new path.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | Four roots and about 430 tracked files today, plus every reference to a moved path |
| Risk | 14/25 | No behavior change, and the gate set catches a stale path, but a move under the hub can break routing |
| Research | 8/20 | The measure and the move map are the design work |
| **Total** | **40/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator fixed the number, the scope and the goal amendment on 2026-11-28, and the move map decides each move.
<!-- /ANCHOR:questions -->

---
