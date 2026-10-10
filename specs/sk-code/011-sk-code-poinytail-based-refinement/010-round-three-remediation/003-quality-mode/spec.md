---
title: "Feature Specification: Phase 3: quality-mode"
description: "The sk-code-quality SKILL.md names two legacy files as its live comment-hygiene gates and still uses pre-rename mode names, and its README routes spec folders to a checklist folder without one and runs two Python checkers through bash."
trigger_phrases:
  - "quality mode"
  - "phase 3 quality mode"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 3: quality-mode

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `scaffold/003-quality-mode` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-review-mode |
| **Successor** | 004-webflow-and-obsidian |
| **Handoff Criteria** | The quality SKILL.md names the live pre-commit and write-time hooks, carries no pre-rename mode names, the README routes spec folders to system-spec-kit and runs both checkers directly, the skill, README and newest changelog read 1.1.1.0, and the three script tests, the document validators and the routing gates pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Round-three remediation child specification.

**Scope Boundary**: Prose edits to `.skilled/skills/sk-code/sk-code-quality/SKILL.md` and `README.md`, a patch version bump and one new changelog file. No script, test, asset or file outside `sk-code-quality/` changes.

**Dependencies**:
- Findings f-iter012-001, f-iter012-002 and f-iter020-001 in `../../001-ponytail-deep-research/research/lineages/r3-dsflash-llmgw/iterations/iteration-012.md` and `iteration-020.md`, and the README `bash` follow-up recorded in `../../009-round-two-follow-ups/goal.md`
- The worked example `../../009-round-two-follow-ups/002-quality-report-listing/`, whose commands this plan reuses
- `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md` section 4 (bump table) and `.skilled/skills/sk-doc/sk-create-skill/references/skill/examples-and-maintenance.md` section 3 (versioning)

**Deliverables**:
- The comment-hygiene gate table, its note and three resource rows in `SKILL.md` name the live hooks and mark the legacy files as test helpers
- Every pre-rename mode name in `SKILL.md` prose replaced with the current `sk-code-*` name
- README spec-folder routing pointed at `system-spec-kit`, and its two checker commands run directly
- `SKILL.md` and README moved from 1.1.0.0 to 1.1.1.0 with `changelog/v1.1.1.0.md`

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The quality mode owns the comment-hygiene gate, yet its `SKILL.md` names `scripts/hooks/claude-posttooluse.sh` as the write-time warning and `.skilled/hooks/git/pre-commit` as the pre-commit block (lines 132, 133 and 136, plus lines 94, 112 and 322). Neither is installed: the live pre-commit gate is `.skilled/scripts/git-hooks/pre-commit`, installed through `core.hooksPath` by `.skilled/scripts/install-git-hooks.sh`, and the live write-time warning is `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, wired for `Write|Edit` at `.claude/settings.json:202-206`. The same file uses the pre-rename names `code-webflow`, `code-opencode`, `code-review` and `code-quality` on 13 lines. Its README routes spec folders to the OpenCode checklist folder, which holds no spec-folder checklist (lines 50, 87 and 129), and runs `check-comment-hygiene.sh` and `check-dist-staleness.sh` through `bash` (lines 64, 115 and 116), which fails because both are Python programs.

### Purpose
An operator reading the quality mode is told the hooks that actually run, sees current mode names, finds the spec-folder checklist where `SKILL.md` already routes it, and can paste every checker command and have it run.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- f-iter012-001, quality half: six hook-naming lines in `SKILL.md` (94, 112, 132, 133, 136 and 322)
- f-iter012-002: the 13 `SKILL.md` lines that still carry a pre-rename name (15, 36, 39, 47, 50, 142, 145, 182, 188, 202, 248, 280 and 281)
- f-iter020-001: README lines 50, 87 and 129
- The round-two follow-up: README lines 64, 115 and 116
- The README title `code-quality` on lines 2 and 14, renamed to `sk-code-quality` so the sibling claim checker finds no pre-rename mode name
- A patch bump, 1.1.0.0 to 1.1.1.0, in `SKILL.md` line 5 and README line 11, and the new file `changelog/v1.1.1.0.md`

### Out of Scope
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` - the shared standard's half of f-iter012-001 belongs to child 001
- The `<!-- Keywords: code-quality, ... -->` line 11 and `schema_version: code-quality/v1` line 214 in `SKILL.md` - the first is a search keyword list and the second is a contract identifier that consumers parse, not prose naming a mode
- The `assets/code-quality-checklist/` folder name and every `sk-code-opencode/assets/...` path - these are current paths, and they are why the finding's raw count is 39 while only 13 lines are stale
- The two-surface lists at README lines 57 and 106 and their `SKILL.md` counterparts - no round-three finding names them, so they are reported, not changed
- Every script, test and `scripts/README.md`, every `.hermes/` file, the `INTENT_SIGNALS` and `RESOURCE_MAP` blocks
- Running `sync-skills-hermes.cjs` in write mode - the orchestrator runs it once after every child is built
- Anything under `../../001-ponytail-deep-research/research/`

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/sk-code-quality/SKILL.md` | Modify | Version line, six hook-naming lines, 13 rename lines (20 single-line edits, two of them on line 142) |
| `.skilled/skills/sk-code/sk-code-quality/README.md` | Modify | Version line, three spec-folder routing edits, three direct-run edits, two title renames |
| `.skilled/skills/sk-code/sk-code-quality/changelog/v1.1.1.0.md` | Create | Compact changelog entry for the four fixes |
| `.skilled/skills/sk-code/sk-code-quality/scripts/README.md` | Modify | Scope amendment after verification: retired mode name and stale hook-location claims flagged by the doc-claims checker, which the parent goal requires at 4/4 |
| `.skilled/skills/sk-code/sk-code-quality/scripts/lib/README.md` | Modify | Scope amendment after verification: two hook paths that did not resolve, plus the adjacent claims that the module lives here |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/manual-testing-playbook.md` | Modify | Scope amendment after verification: retired mode name |
| `.skilled/skills/sk-code/sk-code-quality/manual-testing-playbook/quality-gate/quality-checklist.md` | Modify | Scope amendment after verification: three retired mode names |
| `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode/` | Modify | Task checkboxes, goal log, implementation summary and `scratch/` copies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` names the live hooks as the gates and the legacy files as test helpers | `rg -n 'scripts/git-hooks/pre-commit' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints lines 133 and 136, `rg -n 'post-edit-quality/claude/claude-posttooluse.cjs' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints lines 94 and 132, and `rg -n '^\| (Write-time warning\|Pre-commit block) \| .(scripts/hooks\|\.skilled/hooks/git)' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1 |
| REQ-002 | The hooks `SKILL.md` names are the ones wired | `grep -n 'post-edit-quality/claude/claude-posttooluse.cjs' .claude/settings.json` prints line 206, `sed -n 202p .claude/settings.json` prints `"matcher": "Write\|Edit",`, and `ls .skilled/scripts/git-hooks/pre-commit .skilled/scripts/install-git-hooks.sh .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs` exits 0 |
| REQ-003 | No pre-rename mode name remains in `SKILL.md` prose | `rg -n '(^\|[^-])code-(webflow\|opencode\|review)' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1, and `rg -n '(^\|[^-])code-quality (routes\|owns)\|score code-quality' .skilled/skills/sk-code/sk-code-quality/SKILL.md` prints nothing and exits 1 |
| REQ-004 | README routes spec folders to `system-spec-kit` | `rg -n 'spec-folder and MCP\|spec folders, MCP' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1, and `rg -n 'system-spec-kit' .skilled/skills/sk-code/sk-code-quality/README.md` prints lines 50, 88 and 131 |
| REQ-005 | README runs both checkers directly | `rg -n 'bash \.skilled' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1, and the two commands as written run: `check-comment-hygiene.sh` on `scripts/ceiling-report.sh` and `check-dist-staleness.sh --all` each exit 0 |
| REQ-006 | Version and changelog agree at 1.1.1.0 | `rg -n '^version:'` over `SKILL.md`, `README.md` and `changelog/v1.1.1.0.md` prints `SKILL.md:5`, `README.md:11` and `v1.1.1.0.md:11`, each `version: 1.1.1.0`, and `validate_document.py` prints `VALID` and `Total issues: 0` for the changelog |
| REQ-007 | The scripts are unchanged and their tests pass | `ceiling-report.test.sh` ends `All ceiling report test cases passed`, `check-comment-hygiene.test.sh` ends `All comment hygiene test cases passed`, `scripts/hooks/claude-posttooluse.test.sh` prints `Post-edit adapter parse regression fixture passed`, each exits 0, and `git status --porcelain -- .skilled/skills/sk-code/sk-code-quality/scripts` prints nothing |
| REQ-008 | The sk-doc validators pass on both edited files | `validate_document.py` prints `VALID` and `Total issues: 0` for `SKILL.md` and (with `--type readme`) for `README.md`, and `package_skill.py --check --strict` prints `Result: PASS` |
| REQ-009 | The routing gates stay fresh | `node .skilled/bin/compiled-route-guard.cjs` lists `sk-code` as `fresh`, `ci-leaf-manifest-freshness.cjs` ends `checked=14 fresh=14 failed=0`, and `verify_router_sync.cjs --checks 1a,1b,2,3,4` ends `router-sync: 5/5 checks passed`, each exit 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | The Hermes copy is not regenerated by the builder | `git status --porcelain -- .hermes/skills/sk-code-quality` prints nothing, and `sync-skills-hermes.cjs --check` names `sk-code-quality` as drift until the orchestrator runs the write form |
| REQ-011 | Only the files in the table above changed | The saved `git status --porcelain` snapshot compared with the final one differs by exactly ` M` `SKILL.md`, ` M` `README.md` and `??` `changelog/v1.1.1.0.md` |
| REQ-012 | No link breaks | `check-markdown-links.cjs` ends `0 broken` and exits 0 |
| REQ-013 | No bare `code-quality` mode name remains in the README | `rg -n '(^\|[^-/\w])code-quality($\|[^-/\w])' .skilled/skills/sk-code/sk-code-quality/README.md` prints nothing and exits 1, and README lines 2 and 14 read `title: sk-code-quality` and `# sk-code-quality` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: An operator who reads the gate table in `SKILL.md` finds the two hooks that run: both paths it names exist, the write-time path is the one `.claude/settings.json` wires, and the pre-commit path is the one `install-git-hooks.sh` installs.
- **SC-002**: Every checker command the README prints runs when pasted from the repository root, and the spec-folder checklist the README links resolves.
- **SC-003**: The compiled routing gate, the leaf manifest gate, the router-sync guard and the root metadata gate report no failure this fix caused.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | `check-comment-hygiene.sh`, `check-dist-staleness.sh` and `ceiling-report.sh` are Python programs with a `.sh` name, so `bash <file>` runs Python lines as shell | High | No task runs any of them through `bash`. Only the three `*.test.sh` files run through `bash` |
| Risk | The finding's reproducing count is 39, but 28 of those matches are current `sk-code-opencode/assets/...` paths | Med | The plan edits only the 13 stale lines and the check uses a pattern that excludes a preceding hyphen. The count is recorded in the goal log |
| Risk | Child 005 adds a documentation claim checker that may lint the two-surface phrasing `sk-code-webflow` / `sk-code-opencode` this fix keeps | Med | Recorded as a handoff in `plan.md`. This child renames only and does not add Obsidian, because no finding asks it to and the target-path map has no Obsidian row |
| Risk | The Hermes copy of `SKILL.md` drifts after the edit | Med | The orchestrator runs the write form once after every child. The builder runs only `--check` |
| Dependency | Sibling children build in parallel | Low | No sibling owns a file under `sk-code-quality/`. A stale hub or leaf manifest caused by a sibling is recorded, not repaired |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None open. The bump is patch (1.1.1.0) because every change repairs wrong prose and adds no capability, as `plan.md` section 3 states.
<!-- /ANCHOR:questions -->

---
