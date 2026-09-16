---
title: "Feature Specification: Phase 7: Source-Root Move"
description: "Move every tracked file under .opencode into .skilled through one verified rename-only commit with followable history, and leave .opencode resolvable in the shape phase 004 chose, without pushing or touching the main checkout."
trigger_phrases:
  - "skilled source root move"
  - "rename-only tree move"
  - "opencode compatibility shape commit"
  - "skilled placeholder removal"
  - "rename push deletion ceiling"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 7: Source-Root Move

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 11 |
| **Predecessor** | 006-dual-root-code-and-contracts |
| **Successor** | 008-links-and-generated-state |
| **Handoff Criteria** | Every tracked file that sat under `.opencode/` sits at the same relative path under `.skilled/` after rename-only commits with history followable, `.opencode/` tracks only the compatibility entries 004 chose and no tracked file is left at a moved path (`../spec.md:146`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the skilled source-root migration (`../spec.md`).

**Scope Boundary**: The tracked content of `.opencode/` in worktree 055, the `.skilled/` placeholder, the ignored trees that sit inside `.opencode/` and the compatibility entries phase 004 names. Links that point into `.opencode/` from elsewhere, generated state, path references, global hooks, home configs and every push belong to phases 008 to 011.

**Dependencies**:
- Phase 004's frozen layout decision: which `.opencode/` shape survives and where rollback stops being a revert.
- Phase 005's independent move check, the one that does not live under the moved tree (`../001-deep-research/research/research.md:177`).
- Phase 006's suites passing against both roots (`../spec.md:145`).
- Phase 003's probe results on whether opencode loads plugins through a linked directory and what git does with a dangling hook (`../001-deep-research/research/research.md:69`, `:163-164`).

**Deliverables**:
- C1, a commit that deletes the `.skilled/` placeholder and nothing else.
- C2, one rename-only commit that moves all 16 tracked top-level entries.
- C3, a commit that adds the compatibility entries 004 chose.
- C0, only if no earlier phase added them: `.skilled/` twins of the 56 `.gitignore` rules anchored at `.opencode/`.
- Evidence in `goal.md`'s log and handoff notes for 008 (link census), 010 (hook observations) and 011 (push-ceiling count, naming-guard preview).

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The authored tree has to change roots without losing its history, without a gate run that passes because the gates could not find themselves, and without breaking seven machine-wide hooks that point into the main checkout. Four measured facts make a naive move fail:

- `git mv .opencode .skilled` nests the tree, because `.skilled/` already tracks `future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep` (`../001-deep-research/research/research.md:73`, confirmed with `git ls-files .skilled`).
- Content edits in the same commit as the renames break rename detection, and the large-reorg runbook forbids mixing them (`.opencode/skills/sk-git/references/large-reorg-playbook.md:82-85`).
- 159 of the 208 tracked links inside `.opencode/` resolve into a different top-level entry, 70 of them from `hooks/` into `skills/`. Moving entries in separate commits leaves every commit in between with dangling links (measured with `readlink` over the mode-120000 entries of `git ls-files -s .opencode`).
- The hooks that run on each commit load their helpers from `$REPO_ROOT/.opencode/` and skip or fail open when that path is gone (`.opencode/scripts/git-hooks/pre-commit:176-180`, `.opencode/scripts/git-hooks/prepare-commit-msg:47-50`, `.opencode/scripts/git-hooks/pre-push:34-47`). A green commit is only evidence when the gates actually ran.

### Purpose

One verified rename commit puts the tree under `.skilled/`, and `.opencode/` keeps resolving so phase 008 can retarget links against a working tree.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Deleting the `.skilled/` placeholder in its own commit.
- Moving the 16 tracked top-level entries of `.opencode/`, one `git mv` each: `skills/` (17,182 tracked files), `hooks/` (179), `commands/` (162), `bin/` (95), `changelog/` (49), `plugins/` (41), `scripts/` (30), `agents/` (13), `install-guides/` (9), `logs/` (1), the files `package.json`, `package-lock.json`, `bun.lock` and `vitest.config.bin.ts`, plus the links `manual-testing-playbook` and `specs`. That is 17,767 tracked files in all (`git ls-files .opencode | wc -l`). The parent's scope list names ten of these entries (`../spec.md:80`). The other six move by default and 004's keep-list can hold them back.
- Accounting for the 12 ignored entries under `.opencode/` in this worktree: four `node_modules/` trees, four `dist/` trees, two SQLite files, one `.state` file and one `.node-version-marker` (`git ls-files --others --ignored --exclude-standard --directory .opencode`).
- Creating the `.opencode/` compatibility entries 004 chose, in a commit after the rename commit.
- Adding `.skilled/` twins of the anchored `.gitignore` rules when no earlier phase did, because `.gitignore:108` stops matching the moved `.state` file and the other anchored rules, such as `.gitignore:79-84`, stop applying at the new root.
- Recording evidence: R-status census, a path map compared by mode and blob id, `git log --follow` samples, a link census, the push-ceiling count and a naming-guard preview.

### Out of Scope

- Retargeting the 174 links that point into `.opencode/` from runtime directories and `specs/`. Phase 008 owns them, and the compatibility shape keeps them resolving until then.
- Regenerating mirrors, skill metadata, compiled routing or the trigger index. Phase 008 owns derived state.
- Rewriting path references in code, configuration, CI and documentation, including the four nested-only `.gitignore` rules. Phase 009 owns them.
- Reinstalling the global git hooks, changing home configs or letting the main checkout take the move. Phase 010 owns them.
- Any push to origin. Phase 011 owns publishing, and this phase hands it measured numbers.
- Repairing the four links that already dangle: `changelog/sk-design-md-generator`, `changelog/sk-doc/create-diagram`, `plugins/sk-vision.js` and `skills/sk-doc/scripts/validate-flowchart.sh` (`../002-per-runtime-reference-map/research/research.md:60`). A rename-only phase carries them as they are.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep` | Delete | C1, so no `git mv` can nest |
| `.opencode/**` (17,767 tracked files) | Move | C2, to `.skilled/**` at the same relative paths |
| `.opencode` or `.opencode/<entry>` | Create | C3, the compatibility entries 004 chose |
| `.gitignore` | Modify (conditional) | C0, `.skilled/` twins of the 56 rules anchored at `.opencode/` |
| `goal.md` | Modify | Log evidence, rollback record and handoff notes |
| `scratch/*.tsv`, `scratch/*.txt` | Create, never staged | Census outputs, removed at closure |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Delete the `.skilled/` placeholder in its own commit before any `git mv` runs. |
| REQ-002 | Move every tracked top-level entry of `.opencode/`, except entries 004 keeps in place, into `.skilled/` in one commit whose every status line is `R100`. |
| REQ-003 | Every moved file keeps its mode, blob id and relative path, proven by a tree comparison that does not rely on git's rename pairing. |
| REQ-004 | Leave `.opencode/` resolvable in 004's shape through a separate commit after the rename commit. |
| REQ-005 | Stage by explicit path only. No phase commit carries a path outside `.gitignore`, `.skilled/` and `.opencode`. |
| REQ-006 | Push nothing, keep the move out of the main checkout and leave the global hook links unchanged. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | History stays followable: `git log --follow` reaches pre-move commits for one sample per moved top-level entry. |
| REQ-008 | Every ignored entry under `.opencode/` is accounted for as travelled, relocated or rebuilt, and neither root shows an untracked file afterwards. |
| REQ-009 | Each phase commit's hook output is recorded, and 005's independent check passes on the phase tip. |
| REQ-010 | Phase 011 receives the pre-push deletion count, the naming-guard preview and the documented way through the deletion ceiling. |
| REQ-011 | The pre-move SHA and the rollback commands are written before the first state change. |
| REQ-012 | This folder validates on the main checkout's toolchain after its metadata is regenerated there. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git show -M --name-status --format= <C2>` prints only `R100` lines, 17,767 of them less any entries 004 keeps in place.
- **SC-002**: The pre-move `.opencode` tree and the committed `.skilled` tree, compared by mode, blob id and prefix-rewritten path, show no difference.
- **SC-003**: `git ls-files .opencode` at the phase tip lists exactly the compatibility entries 004 chose.
- **SC-004**: Dangling tracked links across `.skilled`, `.opencode`, the six runtime directories and `specs` equal the pre-move baseline of 8 (4 inside the moved tree, 4 in past-run records under `specs/`), plus under the shrunken shape only the external links 004 routes to phase 008.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 004 has not frozen the `.opencode/` shape | High: no compatibility branch to follow | T001 halts the phase until it has |
| Dependency | 005's independent check and 006's dual-root suites | High: green hooks prove nothing without them | T002 and T034 confirm both |
| Risk | Autosync publishes the move from `post-commit` (`.opencode/scripts/git-hooks/post-commit:32-56`) | High | T004 confirms `SPECKIT_AUTOSYNC` is off and every commit carries `SPECKIT_AUTOSYNC=0` |
| Risk | Broad staging sweeps untracked fan-out containment snapshots under `specs/`, or compatibility links, into C2 | High | `git mv` stages the renames, other paths are staged by name and a name-status gate runs before every commit. The runbook's `git add -A` (`.opencode/skills/sk-git/references/large-reorg-playbook.md:76`) is not used |
| Risk | Gates skip when `.opencode/` does not resolve, so C2 passes vacuously | High | The compatibility shape exists on disk before C2 is committed (T033), so the gates load and run against the moved tree |
| Risk | Running `install-git-hooks.sh` from the worktree repoints the global hooks at worktree 055 (`.opencode/scripts/install-git-hooks.sh:30-31`, `:145`) | High | Never run in this phase. Phase 010 owns the reinstall |
| Risk | The main checkout takes the move before phase 010, and hooks dangle machine-wide (`../001-deep-research/research/research.md:59`) | High | No merge, fast-forward or pull of C2 into the main checkout. T045 checks it |
| Risk | Moved runtime state and rebuilt output stop being ignored | Medium | T013 checks coverage and T015 adds the twins |
| Risk | A tool invoked through the compatibility link exits 0 having done nothing (`.opencode/skills/sk-git/references/worktree-workflows.md:537-539`) | Medium | Every tool in this phase runs by its `.skilled/` path |
| Risk | The CI naming guard reports four grandfathered snake_case names as new at their `.skilled/` paths (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:267-284`) | Medium | T043 previews them and the handoff routes them to 005 before 011 pushes |
| Risk | A push range that joins C2 with later edits pairs weakly similar files as deletions and trips the ceiling | Medium | T042 records the count, and plan.md names the one-push bypass |
| Risk | `skilled/v4.0.0.0` moves on and the merge meets rename conflicts (`.opencode/skills/sk-git/references/shared-patterns.md:798-810`) | Medium | T005 integrates before the move. After it, re-run the scripted move on the new base instead of resolving conflicts by hand |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: C2 writes no new blob. Every blob id in the committed `.skilled` tree already exists in the pre-move `.opencode` tree, which the path map in AC-003 proves.
- **NFR-P02**: Each `git mv` takes one source, so a failure leaves that entry either fully moved or untouched on disk.

### Security
- **NFR-S01**: Database snapshots live outside the repository, and census outputs never enter the index.
- **NFR-S02**: No gate bypass variable is set in this phase: `SPECKIT_ALLOW_MASS_DELETION`, `SPECKIT_MASS_DELETION_THRESHOLD` and every `SPECKIT_SKIP_*`.

### Reliability
- **NFR-R01**: The rollback commands and `PRE_MOVE_SHA` are in `goal.md`'s log before C1, and the reflog keeps every phase commit reachable.
- **NFR-R02**: `git diff --cached --name-status` is read before every commit, and no commit carries a path under `specs/`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Names with spaces: `install-guides/` holds links such as `MCP - Code Mode.md`. Every command quotes paths, and comparisons read `git ls-tree --format` and `git ls-files --format` output with `core.quotePath=false`.
- Duplicate content: 10 files under `.opencode/` are the empty blob, which is also the placeholder's blob. 114 blob ids are shared by more than one path (17,767 entries, 17,167 distinct blobs). Git can pair a rename with a same-content file at another path, so the path map is the authority and `--follow` samples use unique-content files.
- Modes: 198 executable files and 208 symlinks keep their modes, which the path map compares.

### Error Scenarios
- A `git mv` fails: the entry stays where it was. Read `git status`, then fix the cause or roll back to R1.
- A hook blocks C2 or C3: halt and record the gate with its output. The fix goes to 005 or 006, never through a bypass.
- A census unit collides with the index lock: units run with `GIT_OPTIONAL_LOCKS=0` and never while the orchestrator stages or commits.

### State Transitions
- Entries moved but C2 not committed: roll back to R1 in plan.md, then move travelled ignored trees back or rebuild them.
- C2 committed without C3: `.opencode/` does not resolve in the worktree and the hooks fail open. Commit C3 before any other work, or roll back to R2.
- `skilled/v4.0.0.0` moved after the move: re-run the scripted move on the new base rather than rebasing 17,767 renames.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | 17,767 tracked files in 16 top-level entries, three or four commits, 12 ignored entries |
| Risk | 22/25 | Machine-wide hooks, gates that pass silently, rollback turns public after the first push |
| Research | 8/20 | Measured for this plan. The open unknowns belong to phases 003 to 005 |
| **Total** | **50/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Which `.opencode/` shape will 004 freeze? plan.md §3 branches on all three candidates, and T001 records the choice.
- Does a directory-level `git mv` carry the ignored trees inside it here? The repository documents that ignored content stays behind (`.opencode/skills/sk-git/references/worktree-workflows.md:561-567`), while git renames a directory on disk as one unit. The census in T030 settles it for this move.
- Will the main checkout's hook bodies carry 005's dual-root changes when this phase runs? At authoring, the main checkout's `pre-commit` mentions `skilled` zero times (`grep -c`).
- Where must opencode's plugin dependencies live after the move? That decides whether `.opencode/node_modules` relocates under the link-farm shape, and it is a phase 003 probe.
- What does git do with a dangling hook under `core.hooksPath`? Phase 010 needs the answer before the main checkout takes the move (`../001-deep-research/research/research.md:164`).
<!-- /ANCHOR:questions -->

---
