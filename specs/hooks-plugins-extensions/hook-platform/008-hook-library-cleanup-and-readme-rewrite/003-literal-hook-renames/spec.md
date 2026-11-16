---
title: "Feature Specification: Phase 3: literal-hook-renames"
description: "Three hook folders and 16 hook files carry names that do not say which feature they belong to. This phase renames them, one at a time, and points every registration, mirror, import, test, workflow and doc line at the new name."
trigger_phrases:
  - "literal hook renames"
  - "phase 3 literal hook renames"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.4 -->
# Feature Specification: Phase 3: literal-hook-renames

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Under `.skilled/hooks/`, `dispatch/` and `task-dispatch/` collide, `completion/` holds only `completion-evidence-*` scripts and 16 adapter files have basenames that do not name their feature in the flat runtime mirrors. This phase renames three folders and 16 files with `git mv`, one rename at a time, and repairs every reference after each one. After it, the old-name search in `tasks.md` prints nothing, both sync checks print PASS and every gate matches the phase 2 final counts.

**Key Decisions**: Kill-switch names, concern keys and registry hook ids stay as they are, Benchmark reports and captured question screens keep the paths they were recorded with

**Critical Dependencies**: Phase 002 is complete, so the Codex check paths are final before the registry is edited again.

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
| **Phase** | 3 of 4 |
| **Predecessor** | 002-codex-hook-check-merge |
| **Successor** | 004-hook-readme-fold-and-rewrite |
| **Handoff Criteria** | No old folder or file name remains outside `specs/`, changelogs, benchmark reports and captured question screens, both sync checks print PASS and the pinned README lists are rebased. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Hook library cleanup, literal names and README rewrite specification.

**Scope Boundary**: Three folder moves and 16 file moves, each with its references. Kill-switch names and concern keys do not change. One rename runs at a time, because every rename edits the registry and the root README.

**Dependencies**:
- Phase 002 is complete, so the Codex check paths are final before the registry is edited again.
- The earlier rename in commit `5ddd3e56453` and the repair order in `SYNC.md`, which this phase follows.
- `relocate.mjs` for the `dispatch` spec sub-track, which is named after a folder this phase moves.

**Deliverables**:
- Folders `cli-dispatch/`, `subagent-dispatch-guard/` and `completion-evidence/` in place of `dispatch/`, `task-dispatch/` and `completion/`.
- `post-edit-quality.cjs` in place of `claude-posttooluse.cjs`, a `handover-` prefix on eight session-handover adapters, `subagent-dispatch-guard.cjs` in place of `dispatch-guard.cjs` and `decision-capture-*` in place of six `ask-capture-*` files.
- The registry, mirrors, plugins, extensions, CI path filters, the doctor YAML, tests and docs updated, and the pinned lists and trigger index rebased.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A reader of `.skilled/hooks/` cannot tell `dispatch/` from `task-dispatch/` by name. The first guards CLI dispatch commands and the second guards sub-agent dispatch, yet the flag key `dispatch-guard` belongs to the first while `task-dispatch/lib/dispatch-guard.cjs` is the core of the second. `completion/` holds only `completion-evidence-*` scripts. The runtime mirror folders are flat, so `.claude/hooks/stop-arm.mjs`, `.claude/hooks/subagent-guard.mjs`, `.claude/hooks/claude-posttooluse.cjs` and `.claude/hooks/ask-capture-posttooluse.mjs` show a basename that does not name the feature that owns it.

### Purpose
Each of the three folders and 16 files carries a name that states its feature, and every reference in the repository resolves to the new name.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git ls-files .skilled/hooks/dispatch .skilled/hooks/task-dispatch .skilled/hooks/completion | wc -l
      71
$ ls -d .skilled/hooks/*/ | wc -l
      27
$ find .claude/hooks .codex/hooks .cursor/hooks .devin/hooks .dsh/plugins/repo-guards/adapters -type l \( -lname '*hooks/dispatch/*' -o -lname '*hooks/task-dispatch/*' -o -lname '*claude-posttooluse.cjs' -o -lname '*ask-capture-*' -o -lname '*session-handover/claude/*' -o -lname '*session-handover/codex/*' \) | wc -l
      25
$ rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -e 'hooks/(dispatch|task-dispatch|completion)/' -e 'claude-posttooluse\.cjs' -e 'ask-capture-post' -e '(^|[^a-z-])dispatch-guard\.cjs' -e '(^|[^a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs' . | wc -l
     558
$ rg -l --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -e 'hooks/(dispatch|task-dispatch|completion)/' -e 'claude-posttooluse\.cjs' -e 'ask-capture-post' -e '(^|[^a-z-])dispatch-guard\.cjs' -e '(^|[^a-z-])(compact-pointer|context-nudge|stop-arm|prompt-seed|subagent-guard)\.mjs' . | wc -l
     159
$ rg -n --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -P -e '(?<![a-z-])(?<!hooks/)(dispatch|task-dispatch|completion)/(lib|claude|codex|cursor|devin|dsh|pi|opencode|vibe|tests)\b' . | wc -l
      20
$ rg -n -U --hidden -g '!specs/**' -g '!**/changelog/**' -g '!**/node_modules/**' -g '!**/benchmark/reports/**' -g '!**/fixtures/question-screens/**' -e "['\"]hooks['\"],\s*['\"](dispatch|task-dispatch|completion)['\"]" . | wc -l
       7
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Move `dispatch/` to `cli-dispatch/`, `task-dispatch/` to `subagent-dispatch-guard/` and `completion/` to `completion-evidence/` with `git mv`.
- Move 16 files with `git mv`: one post-edit-quality adapter, eight session-handover adapters, the sub-agent guard core and six decision-capture files. The table below names each one.
- Point the 24 `script` fields in `hook-registry.json` at the new paths, then render the four registration files and the 25 mirror links with the two sync scripts.
- Correct every hand-written reference the four searches in `tasks.md` find: imports, re-exports, tests, two CI workflows, the doctor YAML, `.vibe/hooks.toml`, READMEs, playbooks, feature catalogs and root docs.
- Move the spec sub-track `specs/hooks-plugins-extensions/dispatch` to `cli-dispatch` with `relocate.mjs`, and rebase the durable directory manifest, the README verdict baseline and the trigger index.

### Out of Scope
- Kill-switch names, concern keys and the `id` of every registry hook - operator config and code read them, and the parent goal freezes them as decision D1.
- What any hook does when it fires - the parent goal freezes it as decision D2.
- Files under `**/benchmark/reports/**` and `sk-create-manual-testing-playbook/scripts/tests/fixtures/question-screens/` - they are recorded run output and captured screens. ADR-002 in `plan.md` holds the reason.
- `.skilled/hooks/session-handover/tests/subagent-guard.test.cjs` keeps its file name - the approved plan renames adapters, and a test is not mirrored into a flat folder. ADR-003 in `plan.md` holds the reason. Its contents follow the adapter's new name.
- `.skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.sh`, its two tests and the fixture `claude-posttooluse-askuserquestion.json` - different files from the adapter this phase renames.
- Rewriting any README beyond the path or file name on a line - phase 4 does that.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/` (34 files) | Move | To `.skilled/hooks/cli-dispatch/`. |
| `.skilled/hooks/task-dispatch/` (18 files) | Move | To `.skilled/hooks/subagent-dispatch-guard/`. |
| `.skilled/hooks/completion/` (19 files) | Move | To `.skilled/hooks/completion-evidence/`. |
| `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` | Move | To `post-edit-quality.cjs` in the same folder. |
| `.skilled/hooks/session-handover/claude/{compact-pointer,context-nudge,stop-arm,subagent-guard}.mjs` | Move | Each gains the `handover-` prefix. |
| `.skilled/hooks/session-handover/codex/{compact-pointer,context-nudge,prompt-seed,stop-arm}.mjs` | Move | Each gains the `handover-` prefix. |
| `.skilled/hooks/subagent-dispatch-guard/lib/dispatch-guard.cjs` | Move | To `subagent-dispatch-guard.cjs` in the same folder, after the folder move. |
| `.skilled/hooks/decision-capture/{claude,devin}/ask-capture-posttooluse.mjs` and `.test.mjs` (4 files) | Move | To `decision-capture-posttooluse.mjs` and `.test.mjs`. |
| `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs` and `.test.mjs` (2 files) | Move | To `decision-capture-post-tool.mjs` and `.test.mjs`. |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modify | 24 `script` fields. No `id`, `concern`, event or slot changes. |
| `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json` | Regenerate | With `sync-hook-registrations.cjs`. |
| 25 links under `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/`, `.devin/hooks/` and `.dsh/plugins/repo-guards/adapters/` | Regenerate | With `sync-runtime-mirrors.cjs`. |
| `.opencode/plugins/*.js` (3), `.pi/extensions/*.ts` (3), `.vibe/plugins/repo-guards/*.mjs` (2), `.vibe/hooks.toml`, `sk-git/scripts/hooks/` and `sk-git/scripts/lib/` (5 code files), `system-spec-kit/runtime/hooks/` (3 code files) | Modify | The import, re-export or command path on each matching line. |
| Test files that name an old path: `.opencode/plugins/tests/` (2), `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, `runtime/hooks/lib/hook-stdin-deadline.test.mjs`, `session-handover/tests/` (4), `decision-capture/` (4), `system-deep-loop/runtime/tests/unit/` (2), `runtime/tests/completion-evidence-sentinel.vitest.ts` | Modify | The path or file name on each matching line. |
| `.github/workflows/dispatch-enforcement-guard.yml`, `opencode-dual-version.yml` | Modify | The suite path and the path filters. |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | Modify | The `path` of each `file_exists` row that names a moved file. |
| READMEs, playbooks, feature catalogs, `SECURITY.md`, `ENV-REFERENCE.md`, `injection-contract.md`, `coverage-rationale.md` and the root `README.md` that the four searches list | Modify | The path or file name on each matching line, nothing else. |
| `specs/hooks-plugins-extensions/dispatch/` | Move | To `specs/hooks-plugins-extensions/cli-dispatch/` with `relocate.mjs --apply`, after a dry run. |
| `durable-directory-manifest.json`, `baseline-readme-verdicts.json`, `trigger-index.json` and the files under `runtime/cli/retrieval/fixtures/` | Regenerate | With each list's own writer. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | `ls -d` on `cli-dispatch`, `subagent-dispatch-guard` and `completion-evidence` under `.skilled/hooks/` exits 0, and `git ls-files .skilled/hooks/dispatch .skilled/hooks/task-dispatch .skilled/hooks/completion` prints nothing. |
| REQ-002 | `find .skilled/hooks -name 'claude-posttooluse.cjs' -o -name 'dispatch-guard.cjs' -o -name 'ask-capture-*'` prints nothing, `find .skilled/hooks/decision-capture -name 'decision-capture-post*'` lists 6 files and `find .skilled/hooks/session-handover/claude .skilled/hooks/session-handover/codex -name 'handover-*.mjs'` lists 8 files. |
| REQ-003 | The old-name search in `tasks.md` (`SEARCH`) prints nothing. It prints 558 lines today. |
| REQ-004 | The relative-path search (`REL`) and the path-segment search (`SEG`) in `tasks.md` print nothing. They print 20 and 7 lines today. The bare-folder search (`BARE`) prints only lines that hold `dispatch/spawn`. |
| REQ-005 | `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` each print PASS, and `find .skilled/hooks .claude/hooks .codex/hooks .cursor/hooks .devin/hooks .dsh/plugins/repo-guards/adapters .pi/extensions -type l ! -exec test -e {} \; -print` prints nothing. |
| REQ-006 | The hook Vitest tree, the hook `node --test` suites and the OpenCode plugin tests report the counts of the phase 2 final state. The `node --test` suites fail only the case in `hook-stdin-deadline.test.mjs` that failed before the first edit. |
| REQ-007 | The list of registry hook ids is the same before and after, and `git diff --stat HEAD -- .skilled/hooks/shared/hook-flags.cjs` prints nothing. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `test_readme_manifest.py` and `test_readme_verdict_parity.py` exit 0, and `generate-trigger-index.mjs --check` prints `trigger index matches the corpus`. |
| REQ-009 | `ls -d specs/hooks-plugins-extensions/cli-dispatch` exits 0, `ls -d specs/hooks-plugins-extensions/dispatch` reports it missing and the move ran through `relocate.mjs`. |
| REQ-010 | `git diff --stat HEAD -- ':(glob)**/benchmark/reports/**' ':(glob)**/fixtures/question-screens/**'` prints nothing. |
| REQ-011 | Each Claude adapter whose path changed exits 0 when the command `.claude/settings.json` registers for it runs from the worktree root with a payload on stdin. |
| REQ-012 | `check_readme_references.py` over the hook READMEs reports no more failing files than it did before the first rename. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The REQ-003 search prints no line. It prints 558 lines in 159 files today.
- **SC-002**: `ls -d .skilled/hooks/*/ | wc -l` still prints 27, with three folders under new names.
- **SC-003**: Every gate in the `plan.md` baseline table passes from the final state, and each count differs from the phase 2 final count only where the table says it will.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The phase 2 final gate run | Without it "no regressions" has no before | The first task reruns `../scratch/baseline/baseline.sh` and records the counts before any rename. |
| Risk | A registration points at a path that no longer exists, so a guard hook fails on every tool call in this worktree | High | Each rename ends with both sync checks and the dangling-link search before the next one starts. |
| Risk | A relative import or a path built from segments is missed, because it does not contain `hooks/<folder>/` | High | The `REL` and `SEG` searches cover both forms, and the hook suites and plugin tests run after each rename. |
| Risk | A text replacement changes a concern key, a hook id or a kill switch that only looks like a folder name | Med | Replacements match path forms only. REQ-007 compares the hook id list and the `hook-flags.cjs` diff. |
| Risk | The other session on main edits the root `README.md` or a generated index | Low | Keep each edit to the matching line, and regenerate the indexes after the merge. |
<!-- /ANCHOR:risks -->

---


## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A. A rename changes no code path.

### Security
- **NFR-S01**: Every guard hook stays registered on every runtime it had. REQ-005 and REQ-007 prove the registrations resolve and the hook id list is unchanged.

### Reliability
- **NFR-R01**: No runtime loses a hook between two renames. Each rename leaves both sync checks at PASS before the next one starts.

---

## 8. EDGE CASES

- Empty input: N/A. The phase processes no input.
- Maximum input: the widest rename is `dispatch/`, with 223 matching lines. It runs as one step like the others.
- Failure path: a path the searches missed leaves a dangling link or a failed import. The REQ-005 `find` prints the link, and the hook suites or plugin tests exit non-zero and name the file.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 87 moved, about 150 edited, 9 regenerated, LOC: about 560 lines changed, Systems: hooks, eight runtime registrations, CI |
| Risk | 10/25 | Auth: N, API: N, Breaking: Y, a missed path breaks a hook registration |
| Research | 4/20 | The reference inventory is done and recorded in `plan.md` |
| Multi-Agent | 2/15 | Workstreams: 1, serial |
| Coordination | 8/15 | Dependencies: the live session on main, the shared registry and phase 4 |
| **Total** | **42/100** | **Level 3** |

The child scores below Level 3 alone. It carries Level 3 because `recommend-level.sh` scored the whole decomposition at 75/100 and the children were scaffolded at the parent's level.

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A registration or mirror link points at a path that is gone | H | M | Both sync checks and the dangling-link `find` after every rename. |
| R-002 | A relative import or a path built from quoted segments is missed | H | M | The `REL` and `SEG` searches, plus the hook suites and plugin tests after each rename. |
| R-003 | A replacement rewrites a concern key, hook id or switch | H | L | Replacements match `hooks/<folder>/` and full file names only. REQ-007 checks the ids and `hook-flags.cjs`. |
| R-004 | A bare folder mention in a README tree survives | M | M | The `BARE` search over `.skilled/hooks/` is read line by line after the three folder moves. |
| R-005 | A pinned list is rebased and absorbs an unrelated change | L | L | Diff each regenerated list and confirm only rows for renamed paths changed. |

---

## 11. USER STORIES

### US-001: A folder name states its feature (Priority: P0)

**As a** maintainer reading `.skilled/hooks/`, **I want** `cli-dispatch/`, `subagent-dispatch-guard/` and `completion-evidence/` in place of three names that collide or mislead, **so that** I open the right folder without reading two READMEs.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: A mirrored basename states its feature (Priority: P1)

**As an** operator reading `.claude/hooks/` or a hook error, **I want** each adapter's basename to carry its feature, **so that** `handover-stop-arm.mjs` or `decision-capture-posttooluse.mjs` tells me which feature to switch off.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- None. The operator decided the new names in the approved plan. The three choices planning made are recorded as ADR-001 to ADR-003 in `plan.md`.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`

---
