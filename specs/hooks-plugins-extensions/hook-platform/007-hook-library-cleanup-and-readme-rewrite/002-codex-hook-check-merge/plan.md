---
title: "Implementation Plan: Phase 2: codex-hook-check-merge"
description: "Move four runtime index folders into codex-global-hooks-check with git mv, write one feature README from the two old ones, correct the doc lines that name either old folder and rebase the pinned lists. Proof is an empty old-folder search, four links that resolve and every gate matching the phase 1 final state."
trigger_phrases:
  - "codex hook check merge plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: codex-hook-check-merge

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, symlinks, JSON pinned lists |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, Vitest, bash test scripts, two Python README tests, three README checkers |

### Overview
Move four runtime folders into `.skilled/hooks/codex-global-hooks-check/` with `git mv`, write one feature README from the two old ones, correct the doc lines that name either old folder and rebase the pinned lists. No code, registry entry, concern key or switch changes. The phase is proven by an empty old-folder search, four links that resolve and every gate matching the phase 1 final state.

### Baseline

The before-state is the phase 1 final gate run of 2026-11-15, made with `../scratch/baseline/baseline.sh` after the last phase 1 edit to a tested file.

| Gate | Command | Phase 1 final result | Expected after this phase |
|------|---------|----------------------|---------------------------|
| Hook Vitest tree | `.skilled/node_modules/.bin/vitest run --config .skilled/hooks/vitest.config.ts` | 9 files, 501 tests passed | Same |
| Hook `node --test` suites | `node --test` over the non-Vitest test files under `.skilled/hooks` and `.vibe/plugins/repo-guards/tests` | 1839 tests, 1838 pass, 1 fail | Same |
| OpenCode plugin tests | `node --test '.opencode/plugins/tests/*.test.cjs'` | 591 pass, 0 fail | Same |
| Hook registrations | `sync-hook-registrations.cjs --check` | PASS, 35-hook registry, 22 Pi extensions | Same |
| Runtime mirrors | `sync-runtime-mirrors.cjs --check` | PASS, 257 mirrors across 10 trees | Same |
| Gate inputs | `bash .github/scripts/check-gate-inputs.sh` | `files=46`, `RESULT: PASSED` | Same |
| Gate inputs test | `bash .github/scripts/tests/check-gate-inputs.test.sh` | 61 passed, 0 failed | Same |
| Primary pre-commit test | `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` | 152 passed, 0 failed | Same |
| Source-root selection test | `bash .skilled/scripts/git-hooks/tests/source-root-selection.test.sh` | 56 passed, 0 failed | Same |
| README verdict parity | `test_readme_verdict_parity.py` | `baseline_files=1142`, PASS | `baseline_files=1141`, PASS. Two feature READMEs become one. |
| README manifest | `test_readme_manifest.py` | `derived=921 frozen=921`, reproducible | `derived=920 frozen=920`, reproducible. Six directories become five. |
| Hook README structure | `validate_document.py` over the hook READMEs | 184 pass, 0 fail | 183 pass, 0 fail |
| Hook README voice | `hvr_scan.py` over the hook READMEs | 157 pass, 27 fail | The fail count does not rise. The new feature README passes. |

The one failing `node --test` case is "the Cursor preflight, MCP route and Task guards still answer a normal payload" in `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`. It failed before phase 1 and is reported at packet close.

The 1141 and 920 counts are derived from the folder shapes, not measured. T013 and T014 record what the writers print.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. `spec.md` sections 2 and 3 name every file.
- [x] Success criteria measurable. Each one in `spec.md` section 5 is a command and its output.
- [x] Dependencies identified. The baseline table above holds the phase 1 final counts.

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `find .skilled/hooks/codex-global-hooks-check -type l` lists 4 links that resolve, the REQ-003 search prints nothing and every gate in the baseline table matches its expected column
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Move and re-document. No component is added and no code changes.

### Key Components
- **`.skilled/hooks/codex-global-hooks-check/`**: the new index folder. It holds `opencode/`, `claude/`, `cursor/` and `devin/`, each with one link and one README, plus the feature README.
- **`.opencode/plugins/codex-hooks-watchdog.js`**: the OpenCode plugin. Unchanged. It reads the concern key `codex-watchdog` at line 77.
- **`.skilled/bin/install-codex-hooks.mjs`**: the installer and its `--check` mode. Unchanged. It reads the concern key `hook-install` at line 318.
- **`hook-registry.json` entry `install-codex-hooks`**: runs `node .skilled/bin/install-codex-hooks.mjs --check` at SessionStart on Claude, Cursor and Devin. Unchanged.

### Data Flow
At session start Claude, Cursor and Devin run the registry entry, which calls the installer in `--check` mode. OpenCode's plugin runs the same command on `session.created`. Pi and DSH run it inside their `session-start-advisories` adapters. None of these paths passes through `.skilled/hooks/codex-watchdog/` or `.skilled/hooks/hook-install/`. Each of the four links there is a browsing index entry, and each relative target keeps its depth in the new folder: `../../../bin/install-codex-hooks.mjs` and `../../../../.opencode/plugins/codex-hooks-watchdog.js`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The inventory comes from two searches outside `specs/`, `node_modules` and changelog folders. The path search is the REQ-003 pattern, which printed 42 lines. The bare-name search is `rg -c -e 'codex-watchdog' -e 'hook-install\b'` over non-JSON files outside the two folders, which printed 22 lines in 14 files. Each bare line was read.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/hooks/codex-watchdog/opencode/`, `.skilled/hooks/hook-install/claude/`, `cursor/`, `devin/` | Four index folders, each one link and one README. | `git mv` each into `codex-global-hooks-check/`. | `find ... -type l` lists 4, and none dangles. |
| `.skilled/hooks/hook-install/README.md`, `.skilled/hooks/codex-watchdog/README.md` | Two feature READMEs for one check. The first says the check is not run on every turn. The second writes the plugin target as `../../../plugins/...`. | Move the first to the new folder and rewrite it for both checks. Delete the second. | REQ-006 checks pass on the new README. |
| The four moved leaf READMEs | Each names its old folder in the title, the description or the overview. | Correct the folder name. Leave the rest for phase 4. | The REQ-003 search prints nothing. |
| `.skilled/hooks/README.md:215` | Lists `codex-watchdog/` among the symlink-only concern folders. | Name `codex-global-hooks-check/`. | Bare count for the file drops from 5 to 4. |
| `.skilled/hooks/coverage-rationale.md:65-67` | A section headed `codex-watchdog`: folder only on opencode. | Head it with the new folder and name its four runtime folders. | Bare count for the file drops from 2 to 1. |
| `README.md:1166` | Lists `hook-install` among the git cores and `codex-watchdog` among the rest. | Name `codex-global-hooks-check` once. | The file leaves the bare-count output. |
| `.skilled/hooks/README.md:49,69,321,354`, `.skilled/hooks/shared/README.md:49,109`, `.skilled/hooks/coverage-rationale.md:40`, `.skilled/hooks/session-lifecycle/README.md:134`, `ENV-REFERENCE.md:70`, `.opencode/plugins/README.md:46`, `.opencode/plugins/ARCHITECTURE.md:162` | Rows and sentences keyed by concern. | Unchanged. They name a concern key. | Bare counts stay as listed below. |
| `.skilled/hooks/shared/hook-flags.cjs:51,88,91`, `.opencode/plugins/codex-hooks-watchdog.js:77`, `.skilled/bin/install-codex-hooks.mjs:318`, `runtime/hooks/dsh/session-start-advisories.mjs:36`, `runtime/hooks/pi/session-start-advisories.ts:45`, `session-lifecycle/tests/dsh-session-lifecycle.test.mjs:113` | Code that reads or tests a concern key. | Not a consumer of the folder name. | REQ-005 diff prints nothing. |
| `hook-registry.json:746-790`, `.claude/settings.json:211`, `.cursor/hooks.json:31`, `.devin/hooks.v1.json:28` | Register `.skilled/bin/install-codex-hooks.mjs --check`. | Not a consumer. No path names either folder. | Both sync checks print PASS. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` | Pinned lists that name the old folders or their READMEs. | Regenerate with each list's own writer. | Both README tests exit 0 and `generate-trigger-index.mjs --check` exits 0. |
| Symlinks elsewhere in the tree | None targets either folder. `find . -type l -lname '*hook-install*' -o -lname '*codex-watchdog/*'` printed nothing outside `specs/`. | Not a consumer. | The same `find` prints nothing after the move. |

Bare-name counts per file, before and expected after:

| File | Before | After |
|------|--------|-------|
| `.opencode/plugins/ARCHITECTURE.md` | 1 | 1 |
| `.opencode/plugins/codex-hooks-watchdog.js` | 1 | 1 |
| `.opencode/plugins/README.md` | 1 | 1 |
| `.skilled/bin/install-codex-hooks.mjs` | 1 | 1 |
| `.skilled/hooks/coverage-rationale.md` | 2 | 1 |
| `.skilled/hooks/README.md` | 5 | 4 |
| `.skilled/hooks/session-lifecycle/README.md` | 1 | 1 |
| `.skilled/hooks/session-lifecycle/tests/dsh-session-lifecycle.test.mjs` | 1 | 1 |
| `.skilled/hooks/shared/hook-flags.cjs` | 3 | 3 |
| `.skilled/hooks/shared/README.md` | 2 | 2 |
| `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` | 1 | 1 |
| `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-start-advisories.mjs` | 1 | 1 |
| `.skilled/skills/system-spec-kit/runtime/hooks/pi/session-start-advisories.ts` | 1 | 1 |
| `README.md` | 1 | 0 |

Required inventories:
- Same-class producers: the REQ-003 search in `spec.md`.
- Consumers of changed symbols: none. No symbol changes.
- Matrix axes: two old folders by four reference kinds (moved file, doc line, pinned list, symlink target). Every cell has a row above.
- Algorithm invariant: N/A. No path, parser or resolver logic changes.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup saves the bare-name counts before the move. Implementation moves the four folders, writes the feature README, corrects the doc lines and rebases the pinned lists. Verification reruns the old-folder search, the link checks and every gate in the baseline table from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | N/A. No code changes. | REQ-005 diff prints nothing |
| Integration | The hook suites, both sync checks, the gate-input checks and the two README tests | `../scratch/baseline/baseline.sh`, each row compared with the baseline table |
| Manual | The four links and the new README | `readlink` and `test -e` on each link, then `validate_document.py`, `hvr_scan.py` and `check_readme_references.py` on the README |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 closed | Internal | Green | The baseline counts would not be final. |
| `python3` for the two README tests and their `--write` modes | External | Green | The pinned lists cannot be rebased. |
| `sk-create-readme` standards and the human-voice rules | Internal | Green | The new README would need a second rewrite in phase 4. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a link dangles, a gate in the baseline table fails for a reason three fixes do not clear, or the operator reverses the merge.
- **Procedure**: nothing in this phase is committed. `git restore --staged --worktree -- .skilled/hooks/codex-watchdog .skilled/hooks/hook-install` brings the old folders back, `git rm -r --cached .skilled/hooks/codex-global-hooks-check` followed by removing that folder drops the new one, and `git restore` on the three edited docs and the six pinned files returns them to the phase 1 state. Phase 1's uncommitted edits to `.skilled/hooks/README.md`, `coverage-rationale.md` and `README.md` share those files, so restore them line by line, not with a whole-file `git restore`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close, and phase 003 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────┐   ┌────────────────────┐   ┌──────────────┐   ┌──────────────┐
│ Move four    │──►│ Feature README and │──►│ Pinned lists │──►│ Final gates  │
│ folders      │   │ leaf README names  │   │ rebased      │   │              │
└──────┬───────┘   └────────────────────┘   └──────────────┘   └──────────────┘
       │                                           ▲
       │           ┌────────────────────┐          │
       └──────────►│ Three doc lines    │──────────┘
                   └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Folder moves | None | `codex-global-hooks-check/` with four links | README work, doc lines |
| Feature README and leaf names | Folder moves | One README for both checks | Pinned lists |
| Three doc lines | Folder moves | Docs that name the new folder | Pinned lists |
| Pinned lists | README work, doc lines | Rebased manifests and trigger index | Final gates |
| Final gates | All of the above | The evidence in `acceptance-criteria.md` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Durations are assumptions, not measurements.

1. **Move the folders and write the feature README** - about 40 minutes - CRITICAL
2. **Rebase the pinned lists** - about 10 minutes - CRITICAL
3. **Rerun every baseline gate** - about 5 minutes, as the phase 1 final run took - CRITICAL

**Total Critical Path**: about 55 minutes

**Parallel Opportunities**:
- The three doc lines and the feature README touch disjoint files
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Folders merged | Four links resolve under `codex-global-hooks-check/` and `git ls-files` on the two old folders prints nothing | Implementation |
| M2 | Docs state the new folder | The REQ-003 search prints nothing and the bare counts match the table | Implementation |
| M3 | Gates green | Every row of the baseline table matches its expected column | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Keep both concern keys and both switches

**Status**: Accepted

**Context**: The folder name and the concern key are separate things. `codex-watchdog` and `hook-install` are plain strings read by `hook-flags.cjs`, the OpenCode plugin, the installer and the Pi and DSH advisories. `CODEX_HOOKS_WATCHDOG_DISABLED` and `SYSTEM_HOOK_INSTALL_DISABLED` may sit in an operator's `hook-flags.env`.

**Decision**: The operator decided in the approved plan that kill-switch names and concern keys do not change. Only the two index folders merge.

**Consequences**:
- Operator config keeps working and no code changes.
- One folder now answers to two concern keys. Mitigation: the feature README names both keys and both switches in one table.

**Alternatives Rejected**:
- Merge the keys into one: it breaks saved operator config and changes five code callers for a browsing fix.

### ADR-002: Move the leaf READMEs with their links

**Status**: Accepted

**Context**: Each of the four runtime folders holds one link and one README. Phase 4 folds every symlink-only leaf README into its feature README's runtime table.

**Decision**: Move each runtime folder whole with `git mv` and correct only the folder name inside its README.

**Consequences**:
- History follows the files, and the folder keeps the shape every other symlink-only concern has until phase 4.
- The four leaf READMEs are edited twice across the packet. Mitigation: this phase changes only the folder name.

**Alternatives Rejected**:
- Delete the leaf READMEs now: the new folder would differ from every sibling until phase 4, and the README manifest would need a second rebase for the same folders.

### ADR-003: Build the feature README on the `hook-install` file

**Status**: Accepted

**Context**: `hook-install/README.md` documents the installer, its three modes and its flags. `codex-watchdog/README.md` documents the OpenCode plugin. The new README needs both.

**Decision**: Move `hook-install/README.md` to the new folder with `git mv`, rewrite it to cover both checks and delete `codex-watchdog/README.md`.

**Consequences**:
- One file keeps the longer history.
- The rewrite can carry a wrong fact over. Mitigation: each runtime row is checked against `hook-registry.json`, the plugin source and the installer source.

**Alternatives Rejected**:
- Write a new file and delete both: it drops the history of the installer documentation for no gain.

---
