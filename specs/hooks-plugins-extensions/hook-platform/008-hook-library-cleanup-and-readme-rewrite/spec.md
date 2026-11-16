---
title: "Feature Specification: Hook library cleanup, literal names and README rewrite"
description: "The hook library carries dead files, two folders that run the same Codex check, names that do not say which feature a file belongs to and READMEs that are long and hard to read. Four phases remove the dead files, join the two Codex checks, give folders and files literal names and rewrite the READMEs."
trigger_phrases:
  - "hook library cleanup and readme rewrite"
  - "hook library cleanup phase parent spec"
  - "literal hook folder names"
  - "hook readme rewrite"
  - "dead hook file removal"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite"
    last_updated_at: "2026-11-15T15:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Phase parent created, child phases own continuity"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Hook library cleanup, literal names and README rewrite

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/411-hook-library-cleanup` |
| **Parent Spec** | None |
| **Parent Packet** | hooks-plugins-extensions/hook-platform/008-hook-library-cleanup-and-readme-rewrite |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All four children are Complete, recursive strict validation reports RESULT: PASSED, both sync checks print PASS and the hook test suites match the baseline captured before the first edit. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A person who opens `.skilled/hooks/` to learn which hook does what meets four obstacles. Some files are dead: a legacy `git/` pre-commit that this checkout does not install and a `shared/hook-flags.ts` facade that only its own test imports. Two folders, `codex-watchdog/` and `hook-install/`, both run `install-codex-hooks.mjs --check` at session start. Several names do not say what they hold: `dispatch/` and `task-dispatch/` read alike, `completion/` holds only `completion-evidence-*` scripts and adapters such as `stop-arm.mjs` show no feature name once a runtime mirror flattens them to a basename. The READMEs are the fourth obstacle. An analysis run on main on 2026-11-15 counted 185 READMEs. The 27 feature READMEs hold 63,299 words at a mean of 17.5 words a sentence, 12% of their sentences run past 30 words and 27 READMEs carry human-voice hard blockers. Another 81 leaf READMEs describe a folder that holds only a symlink. Each child phase captures its own numbers again in the worktree before it edits.

### Purpose
A reader of `.skilled/hooks/` finds only live files, can tell from a name which feature a folder or file belongs to and can read any hook README in one pass.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove the dead files: the legacy `git/` folder, `shared/hook-flags.ts` and five untracked stray paths on the main checkout. Repair every caller.
- Put the two Codex global-hooks checks in one folder, `codex-global-hooks-check/`, with one feature README.
- Give three folders and 16 adapter, library and test files names that state their feature. Update the hook registry, the runtime mirrors and every hand-written reference.
- Fold the 81 symlink-only leaf READMEs into their feature README's runtime table and delete them.
- Rewrite the root README, the feature READMEs and the leaf READMEs for real code. Author the two missing feature READMEs and split `session-handover/README.md` into an orientation page plus sibling reference docs.

### Out of Scope
- Kill-switch names and concern keys. They stay as they are, so operator config keeps working.
- Hook behaviour. No phase changes what a hook does when it fires.
- The dead legacy import fallbacks in four Pi adapters and the Vitest alias that exists only for them. Found during analysis and reported at close.
- OpenCode plugin file prefixes that do not match concern names. Reported at close.
- `coverage-rationale.md` and `injection-contract.md`. They have the same density problem but are not READMEs.
- Old code paths inside historical spec documents. They stay as written.
- Commit, merge and push. Nothing leaves the worktree until the operator asks.

### Files to Change
This is a phase-level file summary. Each child plan owns the detailed file list.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/hooks/git/`, `.skilled/hooks/shared/hook-flags.ts` | Delete | 001-dead-hook-file-removal | The legacy pre-commit folder and the unused TypeScript flags facade. |
| `.github/workflows/opencode-plugin-tests.yml`, `.github/scripts/check-gate-inputs.sh` and its test, `.skilled/scripts/git-hooks/tests/`, `.skilled/hooks/shared/hook-flags.test.cjs`, skill docs that name `git/` | Modify | 001-dead-hook-file-removal | Callers and tests that name the removed files. |
| Five untracked stray paths under `.skilled/hooks/` on the main checkout | Delete | 001-dead-hook-file-removal | Empty leftover folders, one stray log and three test-runner caches. Needs its own operator yes. |
| `.skilled/hooks/codex-watchdog/`, `.skilled/hooks/hook-install/`, `.skilled/hooks/codex-global-hooks-check/` | Move and create | 002-codex-hook-check-merge | One folder for both checks. Both concern keys and both switches stay. |
| `.skilled/hooks/dispatch/`, `task-dispatch/`, `completion/` and 16 files in `post-edit-quality/`, `session-handover/`, `task-dispatch/lib/` and `decision-capture/` | Move | 003-literal-hook-renames | Literal folder and file names. |
| `hook-registry.json`, runtime mirrors, `.opencode/plugins/`, `.pi/extensions/`, `.vibe/`, `.dsh/`, `tsconfig.pi.json`, CI workflows, the doctor YAML, tests, skill docs | Modify | 003-literal-hook-renames | Every reference to a moved path. |
| `.skilled/hooks/README.md`, the feature READMEs, the leaf READMEs, two new feature READMEs, `session-handover/` reference docs | Modify, create and delete | 004-hook-readme-fold-and-rewrite | Fold, rewrite, author and split. |
| `baseline-readme-verdicts.json`, `durable-directory-manifest.json`, `trigger-index.json`, `corpus-manifest.json` | Modify | 001, 002, 003 and 004 | Pinned lists that name hook folders or READMEs, rebased after each phase that moves or removes one. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-dead-hook-file-removal/ | Delete the legacy `git/` folder, `shared/hook-flags.ts` and the untracked strays. Repair every caller and test that names them. | Complete |
| 2 | 002-codex-hook-check-merge/ | One folder, `codex-global-hooks-check/`, holds the OpenCode plugin link and the Claude, Cursor and Devin links to the Codex hooks check. | Complete |
| 3 | 003-literal-hook-renames/ | Three folders and 16 files get names that state their feature. One rename at a time, each followed by the registry edit, both sync runs and the hand-written references. | Complete |
| 4 | 004-hook-readme-fold-and-rewrite/ | Fold 81 symlink-only leaf READMEs, rewrite the rest to the skill-README voice, author two missing feature READMEs and split the session-handover README. | Complete |
| 5 | 005-closeout-follow-up-fixes/ | Fix the no-behavior-change findings reported at the phase 4 close: the actionlint path filter, stale citations and comments, doc-checker markers and the dead Pi import fallbacks. | Complete |
| 6 | 006-codex-check-and-advisory-fixes/ | Let the Codex hook check run in a linked worktree, make Pi and DSH show it only when it fails, and remove the spec-kit Vitest alias if the suites prove it unused. | Complete |
| 8 | 008-claude-hook-tree-guard/ | Make the Claude hook check test for `.skilled/hooks`, so a user-level copy stays silent in a home folder that keeps a `.skilled` data directory. | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-dead-hook-file-removal | 002-codex-hook-check-merge | `git/` and `shared/hook-flags.ts` are gone, no file outside `specs/` and changelogs names them and the hook suites match the baseline. | `git ls-files .skilled/hooks/git .skilled/hooks/shared/hook-flags.ts` prints nothing, the caller search prints nothing and the suites listed in the phase 1 plan pass. |
| 002-codex-hook-check-merge | 003-literal-hook-renames | `codex-global-hooks-check/` holds both checks, the two old folders are gone and both concern keys still resolve. | `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` print PASS. |
| 003-literal-hook-renames | 004-hook-readme-fold-and-rewrite | No old folder or file name remains outside `specs/`, changelogs and the relocation ledger, and the pinned README lists are rebased. | The old-name search prints nothing, both sync checks print PASS and the README parity and manifest tests pass. |
| 004-hook-readme-fold-and-rewrite | 005-closeout-follow-up-fixes | Phase 4 is Complete and on main, and its close-out lists the findings. | `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED`. |
| 005-closeout-follow-up-fixes | 006-codex-check-and-advisory-fixes | Phase 5 is Complete and on main, and the operator chose the phase 6 fixes. | `validate.sh --recursive --strict` on this packet prints `RESULT: PASSED`. |
| 007-review-doc-reconciliation | 008-claude-hook-tree-guard | The operator reported the home-folder hook notice. | `hook-registration-sync.vitest.ts` passes and both sync checks print PASS. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Does anyone outside this repository install `.skilled/hooks/git/pre-commit`? Unknown. The release note gets a line that names the removal.
- How do Vibe's billing pool and rate limits behave under a parallel worker swarm? Unknown. The phase 4 pilot of one feature README and one leaf README shows it before any fan-out.
- The other session's edits on main may conflict with this branch in README files and generated indexes at merge time. The size of that conflict is unknown until the merge is attempted.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: None. This packet sits directly under the `hooks-plugins-extensions/hook-platform` sub-track.
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
