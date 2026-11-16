---
title: "Implementation Plan: Phase 3: literal-hook-renames"
description: "Rename three hook folders and 16 hook files with git mv in seven serial steps. Each step replaces the old path string in every hand-written file, renders the registrations and mirrors with the two sync scripts and runs the hook suites. Proof is four empty searches, no dangling link and every gate matching the phase 2 final state."
trigger_phrases:
  - "literal hook renames plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: literal-hook-renames

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript and TypeScript hook adapters, JSON registry, YAML workflows, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, Vitest, bash test scripts, two Python README tests, three README checkers |

### Overview
Rename three folders and 16 files under `.skilled/hooks/` with `git mv`, in seven serial steps. Each step replaces the old path string in every hand-written file that names it, renders the four registration files and the mirror links with the two sync scripts and reruns the hook suites before the next step starts. The phase is proven by four empty searches, no dangling link and every gate matching the phase 2 final state.

### Baseline

The before-state is the phase 2 final gate run of 2026-11-15, recorded in `../002-codex-hook-check-merge/tasks.md` task T019. T001 reruns `../scratch/baseline/baseline.sh` before the first rename, so the counts below are observed again in the session that changes them.

| Gate | Command | Phase 2 final result | Expected after this phase |
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
| README verdict parity | `test_readme_verdict_parity.py` | `baseline_files=1141`, PASS | `baseline_files=1141`, PASS. 28 README rows change path. |
| README manifest | `test_readme_manifest.py` | `derived=920 frozen=920`, reproducible | `derived=920 frozen=920`, reproducible. 28 directory rows change name. |
| Hook README structure | `validate_document.py` over the hook READMEs | 183 pass, 0 fail | Same |
| Hook README voice | `hvr_scan.py` over the hook READMEs | 158 pass, 25 fail | The fail count does not rise. |

The one failing `node --test` case is "the Cursor preflight, MCP route and Task guards still answer a normal payload" at `.skilled/hooks/shared/hook-stdin-deadline.test.mjs:172`. It failed before phase 1 and is reported at packet close. This phase edits that file, so T001 saves the failing case's name and the comparison is by name, not by line.

Both row counts are derived from an `rg -c` on the two pinned files, not from a writer run. T041 and T042 record what the writers print.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented. `spec.md` sections 2 and 3 name every folder and file.
- [x] Success criteria measurable. Each one in `spec.md` section 5 is a command and its output.
- [x] Dependencies identified. The baseline table above holds the phase 2 final counts.

### Definition of Done
- [x] All acceptance criteria met
- [x] `SEARCH`, `REL` and `SEG` from `tasks.md` print nothing, both sync checks print PASS, the dangling-link `find` prints nothing and every gate in the baseline table matches its expected column
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Move, replace and re-render. No component is added and no hook changes what it does.

### Key Components
- **`hook-registry.json`**: holds every hook script as a literal repo-relative string in `bindings.<runtime>[].script`. 24 of those strings change. No `id`, `concern`, event or slot changes.
- **`sync-hook-registrations.cjs`**: renders `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` from the registry. It pastes the script string into each command and prints the script's basename into the drift message as `adapter=<basename>`. It also checks that each Pi extension is a one-line re-export whose target exists.
- **`sync-runtime-mirrors.cjs`**: scans the four rendered files for `.skilled/...` script paths and links each one into the runtime's flat mirror folder under its basename. It scans `.skilled/hooks/*/dsh/*.mjs` for the DSH adapter links. A write run replaces a stale link and removes a link no source expects, so no old link is removed by hand.
- **`.pi/extensions/*.ts`**: three one-line re-exports into `dispatch/pi/` and `task-dispatch/pi/`. Edited by hand.
- **Hand-written importers**: three OpenCode plugins through the `.opencode/hooks` link, two Vibe plugins, five `sk-git` files and three `system-spec-kit` runtime hook files import from `dispatch/lib/` or `task-dispatch/lib/`.

### Data Flow
A runtime reads its registration file and runs the script path found there. The registration file is rendered from the registry, and the mirror link is derived from the registration file. So the order inside one rename is fixed: move the file, change the registry string, render the registrations, render the mirrors. Imports inside a moved folder use `../lib/` and `../../shared/`, which keep their depth, so they do not change. Imports from outside name the folder and change with it.

Three name-derived values do not follow a folder or file name and stay as they are. The kill-switch name comes from the concern id passed to `isHookEnabled`, such as `'dispatch'`, `'task-dispatch'` or `'completion'`. The Pi extension name comes from `hook.pi.extension`. The handover log event ids, such as `stop-arm-error` and `compact-pointer-skipped`, are emitted by the Pi, Vibe and OpenCode adapters too, and tests assert them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The inventory comes from four searches outside `specs/`, `node_modules`, changelog folders, benchmark reports and captured question screens. `tasks.md` defines them. `SEARCH` finds a path or file name as literal text and printed 558 lines in 159 files. `REL` finds a relative mention with no `hooks/` prefix and printed 20 lines in 3 files. `SEG` finds a path built from quoted segments and printed 7 lines in 4 files. `BARE` finds a folder mention inside `.skilled/hooks/` and printed 34 lines in 9 files. Four read-only explorers then looked for reference kinds these searches miss. Each finding below that came from an explorer was confirmed with a search or a file read.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/hooks/dispatch/`, `task-dispatch/`, `completion/` (71 tracked files, 12 of them links) | Three feature folders. | `git mv` each to its new name. | REQ-001. No link dangles, because each link target keeps its depth. |
| The 16 files named in `spec.md` section 3 | Adapters, one core and three tests. | `git mv` each to its new name. | REQ-002. |
| `hook-registry.json` | 24 `script` strings: 7 `dispatch`, 4 `task-dispatch`, 1 post-edit-quality, 2 decision-capture and 10 session-handover. | Replace the path string. | `sync-hook-registrations.cjs --check` prints PASS and the hook id list is unchanged. |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Rendered from the registry. The drift message holds each adapter's basename. | Render with `sync-hook-registrations.cjs`. Never edit by hand. | The same check. |
| 25 mirror links under `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/` and `.dsh/plugins/repo-guards/adapters/` | Derived from the rendered files and from a scan of `*/dsh/`. | Render with `sync-runtime-mirrors.cjs`. | `sync-runtime-mirrors.cjs --check` prints PASS and the dangling-link `find` prints nothing. |
| `.pi/extensions/dispatch-audit.ts`, `dispatch-preflight-lint.ts`, `task-dispatch-guard.ts` | One-line re-exports into two moved folders. | Replace the path string. | The registration check resolves all 22 Pi extensions. |
| `.opencode/plugins/cli-dispatch-audit.js`, `sk-git-preflight-advisory.js`, `system-deep-loop-guard.js` | Import `../hooks/dispatch/lib/` or `../hooks/task-dispatch/lib/` through the `.opencode/hooks` link. | Replace the path string. | The OpenCode plugin tests print `fail 0`. |
| `.vibe/plugins/repo-guards/dispatch-preflight.mjs`, `deep-loop-guard.mjs`, `.vibe/hooks.toml:136` | Two imports and one command path. `.vibe/hooks.toml` is hand-written, not rendered. | Replace the path string. | The `node --test` suites, which include `.vibe/plugins/repo-guards/tests`. |
| `sk-git/scripts/hooks/git-preflight-advisory.mjs`, `dsh/`, `pi/`, `sk-git/scripts/lib/advisory-noise-audit.mjs`, `git-rule-checks.test.mjs` | Import `dispatch/lib/dispatch-rule-checks.mjs` by relative path. | Replace the path string. | `node --test .skilled/skills/sk-git/scripts/lib/git-rule-checks.test.mjs` exits 0. |
| `system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`, `devin/permission-request-policy.mjs`, `claude/shared.ts` | Two imports and one comment that name a moved path. | Replace the path string. | `SEARCH` prints nothing. |
| `subagent-dispatch-guard/cursor/task-dispatch-guard.mjs:43` | Holds the Claude adapter's repo-relative path as a constant and spawns it. | Replaced with the folder string. | The hook suites. |
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs:39-52,134-192` | A table of `<folder>/<runtime>/<file>` strings with no `hooks/` prefix, spawned from the hooks root. | Replace `'dispatch/` and `'task-dispatch/` at the start of a quoted string, and the two `ask-capture` file names. | `REL` prints nothing and the suite keeps its counts. |
| `.opencode/plugins/tests/claude-task-dispatch-guard.test.cjs:28-47`, `claude-fable-subagent-guard.test.cjs:28`, `cli-opencode/scripts/tests/opencode-setup-classify.test.cjs:24`, `doctor/scripts/tests/opencode-version-battery.test.cjs:86` | Build a path from quoted segments: `'hooks', 'task-dispatch', ...` or `'hooks', 'dispatch', 'lib', ...`. | Edit the folder segment by hand. | `SEG` prints nothing, and each of the four files passes under `node --test`. |
| `session-handover/tests/adapter-conformance.test.cjs`, `claude-adapters.test.cjs`, `codex-adapters.test.cjs`, `subagent-guard.test.cjs` | Name the adapters by path, by basename pair and in an event-to-path map. Test titles and log ids also hold the bare words. | Replace the file names that end in `.mjs`. Titles and log ids stay. | The `node --test` suites keep their counts. |
| `.github/workflows/dispatch-enforcement-guard.yml:42`, `opencode-dual-version.yml:16,17,41,42` | One suite path, which fails closed, and two path filters, which would stop matching in silence. | Replace the path string. | `SEARCH` prints nothing under `.github`. |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml:61,65,66,82,83,95,110,119` | `file_exists` rows on moved paths. | Replace the path string. | `SEARCH` prints nothing in that file. |
| READMEs under `.skilled/hooks/`, `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.devin/hooks/README.md`, `.pi/extensions/README.md`, `.vibe/plugins/README.md`, playbooks, feature catalogs, `SECURITY.md`, `ENV-REFERENCE.md`, `injection-contract.md` | Name a moved path or file as text or as a link target. | Replace the path string. Nothing else on the line changes. | `SEARCH` prints nothing, and REQ-012 compares the reference checker's failing count. |
| `.skilled/hooks/README.md`, `shared/README.md`, `permission-policy/devin/README.md:33`, the three moved feature READMEs, root `README.md` core list, `coverage-rationale.md` | Name a folder with no `hooks/` prefix: a tree row, a `folder/{a,b}` form, a `../../dispatch/lib/` link or a bare word in a list. | Read each `BARE` and `REL` line and edit by hand. A line that names a concern key stays. | `REL` prints nothing and `BARE` prints only the three `dispatch/spawn` comment lines. |
| `specs/hooks-plugins-extensions/dispatch/` | A spec sub-track named after a moved folder. | Move to `cli-dispatch` with `relocate.mjs`, dry run first. | REQ-009. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json` | Pinned lists that name the old folders or their READMEs. | Regenerate with each list's own writer, once, after the last rename. | REQ-008. |
| `hook-flags.cjs`, every `isHookEnabled('dispatch' / 'task-dispatch' / 'completion' / 'dispatch-guard')` caller, registry `id` values, Pi extension names, handover log event ids | Concern ids, kill switches, hook ids and event labels. | Not a consumer of a folder or file name. Unchanged. | REQ-007. |
| `**/benchmark/reports/**`, `fixtures/question-screens/devin-*.txt` (3 files), changelogs, `specs/` | Recorded run output, captured screens and historical documents. | Unchanged. ADR-002. | REQ-010. |
| `sk-code-quality/scripts/hooks/claude-posttooluse.sh` with its two tests, `claude-posttooluse-askuserquestion.json`, `fable-subagent-guard.mjs`, `task-dispatch-guard.{cjs,mjs,ts}`, `quality-gate-layers-and-generated.test.cjs:226,267` | Look-alike names that belong to other files. | Unchanged. Each replacement pattern is anchored so it cannot match them. | `git diff --stat HEAD` on the first two paths prints nothing. |

Required inventories:
- Same-class producers: `SEARCH`, `REL`, `SEG` and `BARE` in `tasks.md`.
- Consumers of changed symbols: none. No exported symbol, hook id or switch changes. The only changed values are path strings.
- Matrix axes: seven renames by nine reference kinds (moved file, registry string, rendered registration, mirror link, import or re-export, segment-built path, CI or doctor path, doc line, pinned list). Each rename's task group in `tasks.md` covers the kinds that apply to it.
- Algorithm invariant: a replacement matches a path form or a full file name, never a bare word. `hooks/dispatch/` cannot match `hooks/cli-dispatch/`. `dispatch-guard.cjs` is matched only when no letter or hyphen stands before it, so `task-dispatch-guard.cjs` is safe. The five handover basenames are matched only with `.mjs` and with no letter or hyphen before them, so `fable-subagent-guard.mjs`, `subagent-guard.test.cjs` and the log ids are safe.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Setup reruns the baseline and saves the four search outputs, the hook id list and the working-tree patch. Implementation runs seven renames in order, each one moved, replaced, synced and tested before the next, then moves the spec sub-track and rebases the pinned lists. Verification reruns the four searches, the link check and every gate in the baseline table from the final state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The hook suites and the four segment-path test files, after every rename | Hook Vitest tree, hook `node --test` suites, OpenCode plugin tests, `node --test` on the two files outside those globs |
| Integration | Both sync checks, the gate-input checks, the two README tests and the README checkers | `../scratch/baseline/baseline.sh`, each row compared with the baseline table |
| Manual | Each renamed Claude adapter through its registered command | The command string from `.claude/settings.json`, run from the worktree root with a payload on stdin |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 closed | Internal | Green | The Codex check paths and the baseline counts would not be final. |
| `sync-hook-registrations.cjs` and `sync-runtime-mirrors.cjs` | Internal | Green | The registrations and mirrors could not be rendered, and no rename could be verified. |
| `relocate.mjs` | Internal | Green | The `dispatch` spec sub-track would keep its old name. |
| `python3` for the two README tests and their `--write` modes | External | Green | The pinned lists cannot be rebased. |
| `sk-code` routing before the first code write | Internal | Green | The replacement run edits code files, so Gate 2 of `AGENTS.md` requires it first. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a rename leaves a sync check, a link or a suite failing for a reason three fixes do not clear, or the operator reverses a name.
- **Procedure**: nothing in this phase is committed, and phases 1 and 2 are uncommitted in the same tree, so no whole-file `git restore` is used. Undo one rename by running its `git mv` in the other direction, then running its replacement with the two strings swapped. Each new string is unique in the tree except `post-edit-quality.cjs`, whose inverse is limited to `post-edit-quality/claude/post-edit-quality.cjs` and `.claude/hooks/post-edit-quality.cjs`. Then rerun both sync scripts. T003 saves `git diff HEAD --binary` as `scratch/pre-phase3.patch`. After a full rollback the same command prints a patch equal to that file, apart from this packet's folder.
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
| Setup | Phase 002 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close, and phase 004 |
<!-- /ANCHOR:phase-deps -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│ R1 to R4  │──►│ R5 to R7  │──►│ Bare and  │──►│ Sub-track │──►│ Final     │
│ folders   │   │ files     │   │ doc lines │   │ and lists │   │ gates     │
└───────────┘   └───────────┘   └───────────┘   └───────────┘   └───────────┘
```

Each rename is itself a chain: move, replace, render registrations, render mirrors, test.

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| R1 `dispatch/` to `cli-dispatch/` | Setup | The folder and its references | R2 |
| R2 `task-dispatch/` to `subagent-dispatch-guard/` | R1 | The folder and its references | R3 |
| R3 `dispatch-guard.cjs` to `subagent-dispatch-guard.cjs` | R2 | The core file and its importers | R4 |
| R4 `completion/` to `completion-evidence/` | R3 | The folder and its references | R5 |
| R5 `claude-posttooluse.cjs` to `post-edit-quality.cjs` | R4 | The adapter, its registration and its mirror | R6 |
| R6 `handover-` prefix on eight adapters | R5 | Eight adapters, ten registry strings, eight mirrors | R7 |
| R7 `ask-capture-*` to `decision-capture-*` | R6 | Six files, two registry strings, `.vibe/hooks.toml` | Bare and doc lines |
| Bare and doc lines | R1 to R7 | Docs that name the new folders | Sub-track and lists |
| Sub-track and lists | Bare and doc lines | `specs/.../cli-dispatch`, rebased manifests and trigger index | Final gates |
| Final gates | All of the above | The evidence in `acceptance-criteria.md` | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

Durations are assumptions, not measurements.

1. **Seven renames, each with its replacement, both sync runs and the three suites** - about 15 minutes each, 105 minutes - CRITICAL
2. **Bare and doc lines read by hand** - about 20 minutes - CRITICAL
3. **Sub-track move and pinned lists** - about 15 minutes - CRITICAL
4. **Every baseline gate from the final state** - about 10 minutes - CRITICAL

**Total Critical Path**: about 150 minutes

**Parallel Opportunities**:
- None. Every rename edits `hook-registry.json` or a doc another rename also edits, so the steps run in series.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Folders renamed | REQ-001 holds, both sync checks print PASS and the three suites keep their counts after R4 | Implementation |
| M2 | Files renamed | REQ-002 holds and `SEARCH` prints nothing outside the pinned lists after R7 | Implementation |
| M3 | Gates green | Every row of the baseline table matches its expected column | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: One path-form replacement per rename

**Status**: Accepted

**Context**: 159 files name an old path, in 558 lines. Editing each by hand invites a missed line. One replacement for all seven renames at once would leave no point at which a failure names its cause.

**Decision**: Each rename runs one replacement over the files its own search lists. The pattern is a path form or a full file name, never a bare word. The four rendered registration files and the five pinned lists are excluded, because their own writers produce them. Segment-built paths and bare folder mentions are edited by hand.

**Consequences**:
- A failed suite after a rename points at that rename, and the rollback is the same replacement with its strings swapped.
- A replacement edits a line the author would have worded differently by hand. Mitigation: the diff of each rename is read before the next one starts, and phase 4 rewrites the READMEs.

**Alternatives Rejected**:
- Hand-edit every file: 558 lines, with no check that the edit matched the search.
- One replacement for all renames: a failing gate would not say which rename caused it.

### ADR-002: Recorded output keeps the paths it was recorded with

**Status**: Accepted

**Context**: Report files under `**/benchmark/reports/**` and three captured screens under `sk-create-manual-testing-playbook/scripts/tests/fixtures/question-screens/` name an old path. They are the output of past runs. The parent goal's decision D3 keeps historical spec documents and changelogs as written.

**Decision**: These files stay as written, and the four searches exclude both folders. REQ-010 proves no file in them changed.

**Consequences**:
- A past report still shows the command that ran.
- A repository search for an old folder name still finds these files. Mitigation: the exclusion is written into `SEARCH`, so the handoff criterion in `spec.md` names it.

**Alternatives Rejected**:
- Rewrite the paths: a report would then show a command that never ran, and a captured screen would no longer be what the runtime printed.

### ADR-003: The sub-agent guard test keeps its file name

**Status**: Accepted

**Context**: `.skilled/hooks/session-handover/tests/subagent-guard.test.cjs` tests `claude/subagent-guard.mjs`, which becomes `handover-subagent-guard.mjs`. The approved plan gives the `handover-` prefix to adapters, because the flat mirror folders show only a basename. A test file is not mirrored, and its folder already names the feature.

**Decision**: The test file keeps its name. The adapter path inside it changes.

**Consequences**:
- The rename count stays at the 16 files the phase scope states.
- The test's name no longer equals its subject's basename. Mitigation: its sibling tests are named `claude-adapters` and `codex-adapters`, so the folder has no such convention to break.

**Alternatives Rejected**:
- Rename it to `handover-subagent-guard.test.cjs`: it adds a move the approved plan does not list, for a file no flat folder shows.

### ADR-004: Log event ids and concern ids stay

**Status**: Accepted

**Context**: The handover adapters log events named `stop-arm-error`, `context-nudge-skipped` and `compact-pointer-stale-note`. The Pi, Vibe and OpenCode adapters emit the same ids with no file of that name, and three test files assert them. The strings `'dispatch'`, `'task-dispatch'` and `'completion'` passed to `isHookEnabled` build the kill-switch names.

**Decision**: Neither changes. The parent goal freezes kill switches and concern keys as D1 and hook behaviour as D2, and a log id is behaviour a reader of the log depends on.

**Consequences**:
- Operator config and the handover log keep working.
- `handover-stop-arm.mjs` logs `stop-arm-error`. Mitigation: the id names the event, not the file, and it is shared by four runtimes.

**Alternatives Rejected**:
- Rename the ids with the files: it changes log output on eight runtimes and breaks saved operator config, for a browsing fix.

---
