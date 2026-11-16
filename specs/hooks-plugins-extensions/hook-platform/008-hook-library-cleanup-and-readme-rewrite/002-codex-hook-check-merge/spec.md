---
title: "Feature Specification: Phase 2: codex-hook-check-merge"
description: "Two folders under .skilled/hooks index the same Codex global-hooks check. This phase merges them into codex-global-hooks-check with one feature README, and keeps both concern keys and both kill switches."
trigger_phrases:
  - "codex hook check merge"
  - "phase 2 codex hook check merge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 2: codex-hook-check-merge

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Two folders under `.skilled/hooks/`, `codex-watchdog/` and `hook-install/`, index the same check: `install-codex-hooks.mjs --check` at session start. This phase moves their four links and four leaf READMEs into one folder, `codex-global-hooks-check/`, with one feature README. After it, `find .skilled/hooks/codex-global-hooks-check -type l` lists four links that resolve, both old folders are gone and both sync checks print PASS.

**Key Decisions**: Both concern keys and both kill switches stay as they are, The four leaf READMEs move with their links and stay until phase 4 folds them

**Critical Dependencies**: Phase 001 is complete, so the gate counts this phase compares against are the phase 1 final ones.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-dead-hook-file-removal |
| **Successor** | 003-literal-hook-renames |
| **Handoff Criteria** | `codex-global-hooks-check/` holds both checks, `codex-watchdog/` and `hook-install/` are gone and both sync checks print PASS. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Hook library cleanup, literal names and README rewrite specification.

**Scope Boundary**: One new folder, `.skilled/hooks/codex-global-hooks-check/`, takes the files of `codex-watchdog/` and `hook-install/`. Both concern keys and both kill switches stay as they are. No other folder moves.

**Dependencies**:
- Phase 001 is complete, so no caller repair overlaps with this move.
- The pinned README lists and the trigger index, each rebased with its own writer.
- On 2026-11-15 `specs/hooks-plugins-extensions/` holds no `codex-watchdog` or `hook-install` sub-track, so no spec packet moves and `relocate.mjs` does not run.

**Deliverables**:
- `codex-global-hooks-check/` with the OpenCode plugin link and the Claude, Cursor and Devin links to `.skilled/bin/install-codex-hooks.mjs`.
- Every doc line that names either old folder states the new one.
- One feature README that states both checks run `install-codex-hooks.mjs --check` at session start.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader who wants to know how this repository watches Codex's user-global hook file finds two folders. `codex-watchdog/` holds the OpenCode plugin link and `hook-install/` holds the Claude, Cursor and Devin links, and both run `install-codex-hooks.mjs --check` at session start. The `hook-install/` README also says the check is "not run on every turn" and is only "explicitly invoked", while `hook-registry.json` runs it at SessionStart on Claude, Cursor and Devin.

### Purpose
One folder, `.skilled/hooks/codex-global-hooks-check/`, holds both checks, and its README states which runtime runs the check and when.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ find .skilled/hooks/codex-watchdog .skilled/hooks/hook-install -type l | sort
.skilled/hooks/codex-watchdog/opencode/codex-hooks-watchdog.js
.skilled/hooks/hook-install/claude/install-codex-hooks.mjs
.skilled/hooks/hook-install/cursor/install-codex-hooks.mjs
.skilled/hooks/hook-install/devin/install-codex-hooks.mjs
$ git ls-files .skilled/hooks/codex-watchdog .skilled/hooks/hook-install | wc -l
      10
$ ls -d .skilled/hooks/*/ | wc -l
      28
$ rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/(codex-watchdog|hook-install)|(codex-watchdog|hook-install)/' . | wc -l
      42
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move the four runtime folders (`opencode/`, `claude/`, `cursor/`, `devin/`), each with its link and its README, into `.skilled/hooks/codex-global-hooks-check/` with `git mv`.
- Write one feature README for the new folder from the two old ones, and remove both old feature READMEs.
- Correct the folder name in the four moved leaf READMEs.
- Correct the three doc lines outside the two folders that name either one as a folder: `.skilled/hooks/README.md:215`, the `codex-watchdog` section of `.skilled/hooks/coverage-rationale.md` and the core list in the root `README.md`.
- Rebase the pinned lists that name the old paths: the durable directory manifest, the README verdict baseline and the trigger index with its fixture files.

### Out of Scope
- The concern keys `codex-watchdog` and `hook-install` and the switches `CODEX_HOOKS_WATCHDOG_DISABLED` and `SYSTEM_HOOK_INSTALL_DISABLED` - operator config and five code callers read them.
- `hook-registry.json` and the runtime registrations - every script field already points at `.skilled/bin/install-codex-hooks.mjs`, not into either folder.
- `.opencode/plugins/codex-hooks-watchdog.js` and `.skilled/bin/install-codex-hooks.mjs` - no behaviour changes.
- Folding the four leaf READMEs into the feature README - phase 4 does that for every symlink-only folder.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/codex-watchdog/opencode/` (2 files) | Move | To `.skilled/hooks/codex-global-hooks-check/opencode/`. |
| `.skilled/hooks/hook-install/claude/`, `cursor/`, `devin/` (6 files) | Move | To `.skilled/hooks/codex-global-hooks-check/`. |
| `.skilled/hooks/hook-install/README.md` | Move and rewrite | Becomes `.skilled/hooks/codex-global-hooks-check/README.md` and covers both checks. |
| `.skilled/hooks/codex-watchdog/README.md` | Delete | Its content is folded into the new feature README. |
| `.skilled/hooks/codex-global-hooks-check/*/README.md` (4 files) | Modify | The folder name in the title, the description and the overview. |
| `.skilled/hooks/README.md` | Modify | Line 215, which lists `codex-watchdog/` among the symlink-only folders. |
| `.skilled/hooks/coverage-rationale.md` | Modify | The section headed `codex-watchdog`: folder only on opencode. |
| `README.md` | Modify | The core list in "Shared Hook Cores", which names both old folders. |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/durable-directory-manifest.json` | Regenerate | With `test_readme_manifest.py --write`. |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Regenerate | With `test_readme_verdict_parity.py --write`. |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and three files under `runtime/cli/retrieval/fixtures/` | Regenerate | With `generate-trigger-index.mjs`. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `ls -d .skilled/hooks/codex-global-hooks-check` exits 0, and `git ls-files .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` prints nothing. |
| REQ-002 | `find .skilled/hooks/codex-global-hooks-check -type l` lists 4 links, and `find .skilled/hooks/codex-global-hooks-check -type l ! -exec test -e {} \; -print` prints nothing. |
| REQ-003 | `rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' 'hooks/(codex-watchdog\|hook-install)\|(codex-watchdog\|hook-install)/' .` prints nothing. |
| REQ-004 | `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS, and the hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests report the counts of the phase 1 final state. |
| REQ-005 | `git diff --stat HEAD -- .skilled/hooks/shared/hook-flags.cjs .opencode/plugins/codex-hooks-watchdog.js .skilled/bin/install-codex-hooks.mjs .skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | `.skilled/hooks/codex-global-hooks-check/README.md` passes `validate_document.py`, `hvr_scan.py` and `check_readme_references.py`, names `install-codex-hooks.mjs --check` and names both switches. |
| REQ-007 | `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0, and `generate-trigger-index.mjs --check` exits 0. |
| REQ-008 | Outside the new folder, every line that still names `codex-watchdog` or `hook-install` names a concern key, not a folder. The per-file counts match the table in `plan.md`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls -d .skilled/hooks/*/ | wc -l` prints 27. It prints 28 today.
- **SC-002**: The REQ-003 search prints no line. It prints 42 today.
- **SC-003**: Every gate in the `plan.md` baseline table passes from the final state, and each count differs from the phase 1 final count only where the table says it will.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase 1 final gate run | Without it "no regressions" has no before | Its counts are recorded in the `plan.md` baseline table. |
| Risk | A moved link stops resolving | High | Each link's relative target keeps the same depth. `readlink` and `test -e` run on all four after the move. |
| Risk | A bare `codex-watchdog` or `hook-install` in a doc means the folder, not the concern key, and survives | Med | `plan.md` classifies each of the 22 bare mentions, and REQ-008 compares the per-file counts after the move. |
| Risk | The other session on main edits the root `README.md` or the trigger index | Low | Keep each edit to the named line, and regenerate the index after the merge. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. The phase moves index links and docs and changes no code path.

### Security
- **NFR-S01**: N/A. The phase touches no authentication path, and both kill switches keep their names.

### Reliability
- **NFR-R01**: The check still runs at session start on Claude, Cursor, Devin and OpenCode. REQ-005 proves the plugin, the installer, the resolver and the registry are unchanged.

---

## 8. EDGE CASES

- Empty input: N/A. The phase processes no input.
- Maximum input: N/A. The phase processes no variable-size input.
- Failure path: a doc link into `codex-watchdog/` or `hook-install/` that the search missed would break. `check_readme_references.py` on the hooks READMEs reports an unresolved reference and exits non-zero.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 7/25 | Files: 10 moved or deleted, 8 edited, 6 regenerated, LOC: about 250 README lines rewritten, Systems: hooks docs |
| Risk | 3/25 | Auth: N, API: N, Breaking: N |
| Research | 3/20 | The reference inventory is done and recorded in `plan.md` |
| Multi-Agent | 1/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: the live session on main and phases 3 and 4 |
| **Total** | **18/100** | **Level 3** |

The child scores below Level 3 alone. It carries Level 3 because `recommend-level.sh` scored the whole decomposition at 75/100 and the children were scaffolded at the parent's level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A moved link dangles | H | L | `find ... -type l ! -exec test -e {} \; -print` prints nothing after the move. |
| R-002 | A bare folder mention survives because it looks like a concern key | M | M | The classified inventory in `plan.md` and the per-file count check in REQ-008. |
| R-003 | The merged README repeats a wrong fact from an old one | M | M | Each runtime row is written from `hook-registry.json`, the plugin source and the installer source, not from the old READMEs. |
| R-004 | A pinned list is rebased and absorbs an unrelated change | L | L | Diff each regenerated list and confirm only rows for the two old folders and the new one changed. |

---

## 11. USER STORIES

### US-001: One folder answers "what checks Codex's global hooks" (Priority: P0)

**As a** maintainer reading `.skilled/hooks/`, **I want** one folder to hold every runtime's link to the Codex global-hooks check, **so that** I do not read two READMEs to learn it is one check.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: The README states when the check runs (Priority: P1)

**As an** operator who sees a drift message at session start, **I want** the feature README to say which runtime runs the check, on which event and under which switch, **so that** I can turn one off without reading the registry.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The folder name and the rule that both concern keys stay were decided by the operator in the approved plan.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
