---
title: "Feature Specification: Phase 10: machine-and-consumer-cutover"
description: "Seven global git hooks, four home configs and ten consumer links on this machine resolve into the main checkout's .opencode tree, and no commit can update them. This phase moves them to .skilled around the main checkout's landing, without a single moment where a global hook points at a missing file."
trigger_phrases:
  - "skilled machine cutover"
  - "global git hooks reinstall"
  - "home config cutover"
  - "consumer project skilled links"
  - "hook bridge window"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: machine-and-consumer-cutover

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 11 |
| **Predecessor** | 009-reference-rewrite |
| **Successor** | 011-verification-and-rollout |
| **Handoff Criteria** | All seven global hooks resolve into the main checkout's `.skilled/scripts/git-hooks/`, `install-codex-hooks.mjs --check` prints OK, every edited home file has a backup and a restore command in the manifest and every consumer `.opencode` link resolves the root sentinel |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the skilled source-root migration in `../spec.md`. It is the only phase that changes state outside the repository.

**Scope Boundary**: Everything on this machine that lives outside Git and resolves into the main checkout's `.opencode/` tree. That means the global git hooks and the home-level runtime configs, plus the consumer projects that link the checkout. Tracked files belong to phases 005 to 009. Other machines are out of reach: this phase writes their checklist and cannot run it.

**Dependencies**:
- Phase 003's probe of whether git 2.50.1 skips or fails a dangling hook under `core.hooksPath` (`001-deep-research/research/research.md:164`).
- Phase 004's frozen shape for `.opencode/`, the consumer contract it publishes and the step where the main checkout first holds the move. This spec calls that step the landing.
- Phase 005's hook bodies, which must run in a checkout that holds only `.opencode/` and in one that holds `.skilled/`.
- Phase 006's installers: `install-git-hooks.sh` sourcing `.skilled/scripts/git-hooks` and `install-codex-hooks.mjs` replacing the 18 legacy Codex entries rather than keeping them beside new ones.
- Phase 008's regenerated `.codex/hooks.json` naming `.skilled/` adapters and phase 009's rescan passing.

**Deliverables**:
- The cutover on this machine: relinked global hooks, reinstalled Codex hooks, edited home configs and consumer `.skilled` links.
- A backup root whose manifest restores every item with one command each.
- Probe evidence from a scratch repository, a pre-migration checkout, a consumer-shaped repository and a residue census.
- The other-machine checklist in `plan.md`, handed to the operator through the parent goal log.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Git cannot move what lives outside it. `core.hooksPath` sends every repository on this machine to `~/.config/git/hooks`, and all seven hooks there are absolute symlinks into the main checkout's `.opencode/scripts/git-hooks/` (`plan.md` evidence E1 to E4). When the main checkout's working tree drops those files, every commit and push on the machine loses its hooks, the pre-push remote allowlist included. Whether git then skips the hooks silently or fails is UNKNOWN until phase 003's probe. Four home configs and a 38-file Codex prompt directory name the same tree (E6, E8, E9, E12, E14), and ten consumer links resolve into it (E18). No validator in the repository sees any of them (`001-deep-research/research/research.md:61-67`).

### Purpose

Every machine-level reference resolves into `.skilled/` in the main checkout, no global hook ever points at a missing file along the way and every consumer project on this machine keeps working.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The seven global hook symlinks in `~/.config/git/hooks/` and the `core.hooksPath` value in `~/.gitconfig`, which this phase flips to a bridge directory and back.
- `~/.codex/hooks.json` (18 repository entries among 33), the trust entry at `~/.codex/config.toml:21` and the launcher argument at `~/.hermes/config.yaml:17`.
- `~/.pi/agent/SYNC.md` at lines 73 and 75, plus `~/.codex/prompts/` (38 files with two path mentions each) if Codex 0.154.0 loads that directory.
- Consumer projects on this machine: 4 project roots, 6 consumer worktrees and the local hooks of `Websites/anobel.com`.
- The backup root, its manifest and the probe evidence.
- Proof that the unchanged items stay unchanged: `~/.pi/agent/trust.json`, `~/.zshrc`, `~/.claude.json` and the history records listed in `plan.md`.

### Out of Scope

- Tracked files in this repository, `PUBLIC-RELEASE.md` and its consumer contract text included. Phases 005 to 009 own them.
- Tracked files inside consumer repositories, such as `AI Systems/opencode.json` and `Mobile CLI/.mcp.json`. They belong to other repositories, and 11 of their 15 `.opencode` paths are already stale today (E21). This phase reports that and fixes none of it.
- The 30 temporary `AI Systems` worktrees under `/private/tmp/claude-501/` (E19). They are session scratch that their own sessions recreate.
- Stale entries unrelated to this checkout: the two `~/.opencode/bin` PATH lines in `~/.zshrc` and the dangling links under `~/.codex/prompts.bak-pre138/`, `~/.codex/prompts.backup.20260403091105/` and `~/.codex/memories/spec_kit_memory/` (E11, E15).
- History records that name `.opencode`, such as `~/.codex/memories/`, `~/.claude/plans/` and the `lastSessionFirstPrompt` string in `~/.claude.json` (E10, E16). Rewriting a record would falsify it.
- The six links in the main checkout's own `.git/hooks/` (E22). Git ignores that directory while `core.hooksPath` is set, and the other-machine checklist covers machines where it is not.
- Other machines. This phase writes their checklist and cannot reach them.

### Files to Change

`MAIN` is `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`, and `B` is the backup root that `plan.md` defines.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `~/.config/git/hooks/` (7 hook links) | Modify | Relinked by the installer run from `MAIN`, to `MAIN/.skilled/scripts/git-hooks/`, while the bridge serves every repository |
| `~/.config/git/hooks-bridge/` | Create, then Delete | Seven copied hook bodies that serve every repository during the landing |
| `~/.gitconfig` | Modify twice | `core.hooksPath` to the bridge before the landing, then back to `~/.config/git/hooks` |
| `~/.codex/hooks.json` | Modify | Reinstalled by `install-codex-hooks.mjs`: the 18 repository entries move to `.skilled/`, the 15 others stay |
| `~/.codex/config.toml` | Modify | The trust header at line 21 names `.skilled` instead of `.opencode` |
| `~/.hermes/config.yaml` | Modify or keep | The launcher argument at line 17 follows the consumer contract |
| `~/.pi/agent/SYNC.md` | Modify | Lines 73 and 75 name `.skilled/` paths that resolve |
| `~/.codex/prompts/` (23 of 38 files) | Modify or keep | Pointer stubs whose targets exist, only if Codex loads the directory |
| Consumer roots in `scratch/consumer-links-classified.tsv` | Create | An untracked `.skilled` link beside `.opencode` and a `.skilled` line in the repository's `.git/info/exclude` |
| `Websites/anobel.com/.git/hooks/` (6 links) | Modify or keep | Reinstalled only if they stop resolving after the landing |
| `B` under `~/.skilled-cutover-backup/` | Create | Copies, link manifests, checksums and restore commands |
| `scratch/*.tsv` in this phase | Create | Census, classification and residue evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | A pure-read census of every home-level file and consumer link precedes the first backup or change, and the orchestrator has verified every census row it acts on |
| REQ-002 | Before any item changes, its backup copy, link or line manifest, checksum and restore command exist under the backup root |
| REQ-003 | The seven global hooks end resolving to `MAIN/.skilled/scripts/git-hooks/<hook>`, relinked by the installer run from `MAIN`. At no checkpoint does `core.hooksPath` name a directory with a hook entry that fails `test -e`, and no hook target names a linked worktree |
| REQ-004 | A commit in a scratch repository proves the relinked hooks run: `commit-msg` blocks a non-conforming subject, and the trace names all seven hooks across a commit, an amend, a merge and a push |
| REQ-005 | `~/.codex/hooks.json` holds each of the 18 repository hook identities exactly once, under `.skilled/`, and keeps its 15 other entries. `install-codex-hooks.mjs --check` prints OK |
| REQ-006 | Every consumer project on this machine keeps working after the landing: each `.opencode` link resolves `skills/system-spec-kit/SKILL.md`, each symlinked root file resolves and the 4 consumer-owned paths that resolved before the landing still resolve |
| REQ-007 | No secret value from a home config reaches a delegate brief, a log, a census file or a spec document |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | `~/.codex/config.toml`, `~/.hermes/config.yaml` and `~/.pi/agent/SYNC.md` each change by exactly the planned line or carry a recorded keep decision. A diff against each backup shows nothing else |
| REQ-009 | Hooks still run in a checkout at the pre-migration commit, proven by a commit in a temporary detached worktree that is removed afterwards |
| REQ-010 | The residue census classifies every remaining `.opencode` mention in home-level files as kept by design, a record or a backup, and `~/.pi/agent/trust.json` and `~/.zshrc` keep their pre-cutover checksums |
| REQ-011 | The other-machine checklist is in `plan.md`, and the parent goal log names it as the operator's item |
| REQ-012 | Whether Codex 0.154.0 loads `~/.codex/prompts/` is settled with evidence, and the directory is handled per that answer |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Zero hook entries fail `test -e` in the active `core.hooksPath` directory at each of five checkpoints: before the first flip, after it, after the landing, after the relink and after the flip back.
- **SC-002**: Every row in the Files to Change table has a restore command, and the restorability check ran each one against a copy.
- **SC-003**: All 10 consumer `.opencode` links and every `.skilled` link this phase creates resolve the root sentinel.
- **SC-004**: The residue census leaves zero unclassified `.opencode` mentions in home-level files.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's `.opencode/` shape, consumer contract and landing step | Without them the consumer plan and the Hermes decision cannot be made, and the bracket has no landing to wrap | T001 halts this phase until 004's record names all three |
| Dependency | Phase 006's installers | `install-git-hooks.sh` skips a link it did not install (`install-git-hooks.sh:58-67`, `:138-142`), and `install-codex-hooks.mjs` keeps a legacy entry whose path still resolves on disk (`install-codex-hooks.mjs:106-109`), which would run every Codex hook twice | T001 reads both installers, the relink moves the old links aside first and the Codex dry-run in T017 fails closed on duplicates |
| Risk | A relink run from a worktree binds every repository on the machine to a branch (`install-git-hooks.sh:24`, `:30-31`) | High | The installer runs only after `cd` into `MAIN` and a check that `git rev-parse --absolute-git-dir` equals `MAIN/.git`, and every installed target must start with `MAIN/.skilled/` |
| Risk | A dirty main checkout refuses the landing | Medium | E23 shows `council-graph.sqlite` modified under `.opencode/` today. T012 requires `git status --porcelain -- .opencode` in `MAIN` to print nothing before the bracket opens |
| Risk | Secrets in `~/.claude.json`, `~/.codex/config.toml`, `~/.hermes/config.yaml` or `~/.zshrc` leak into a brief or a log | High | Only the orchestrator reads home files. The delegate receives path, key and count rows. Backups sit in a mode 700 directory outside every repository and outside the MEGA sync tree |
| Risk | Codex or Hermes rewrites its own config between backup and restore | Medium | A restore reverses the single edited line first and falls back to the file copy only when a diff against the backup shows no other change |
| Risk | A session starting in `MAIN` during the bracket self-heals the hooks (`check-git-hooks.sh:119-133`) | Low | The bridge holds regular files. The guard reports them missing (`check-git-hooks.sh:96-97`), and the installer it runs skips every file it did not install (`install-git-hooks.sh:138-142`) |
| Risk | Work in the main checkout sits against the parent rule that phases work only in the worktree (`../spec.md:134`) | Medium | Both installers refuse or mis-bind from a worktree (`install-codex-hooks.mjs:290-322`, `install-git-hooks.sh:24`), so they must run from `MAIN`. Main-checkout work is limited to the landing and read-and-install commands, and T002 records that clarification in the parent goal log |
| Risk | `Websites/anobel.com` sets its own `core.hooksPath`, so the bridge does not cover it (E22) | Low | Its six links chain through its `.opencode` link, the landing lasts seconds and T020 reinstalls them only if they fail `test -e` afterwards |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The bridge stays active for one landing plus the relink. The plan records the timestamp of both `core.hooksPath` flips, so the window is measured, not assumed.
- **NFR-P02**: Every census command reads named paths or runs `find` with a depth limit, and none walks the whole home directory.

### Security
- **NFR-S01**: No home-file value leaves the machine or enters a document. Census commands print paths, key names, line numbers and counts only.
- **NFR-S02**: The backup root is mode 700 and sits outside every repository and outside `~/MEGA`.

### Reliability
- **NFR-R01**: Every item restores with one documented command, and the restorability check runs each restore against a copy before completion.
- **NFR-R02**: A failed step leaves the machine with resolving hooks: either the bridge is active or the original links resolve, never neither.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A hook file added to the source directory after the census: T011 copies whatever entries the global directory holds at that moment, never a fixed list of seven, and the installer in T015 links every file with a Git hook name (`install-git-hooks.sh:38-52`), so the checkpoints compare against the count that installer reports.
- A `.skilled` project header already present in `~/.codex/config.toml`: renaming the `.opencode` header would create a duplicate TOML table and stop Codex from starting, so the edit removes the `.opencode` table instead.
- Third-party Codex hook entries: 15 today, none with a runner match (E6). The dry-run must report the same 15 as kept.
- A consumer root that already holds a `.skilled` entry: skipped and reported, never overwritten.

### Error Scenarios
- The Codex installer prints nothing and exits 0: `SYSTEM_HOOKS_DISABLED` or its alias switched it off (`install-codex-hooks.mjs:365`, `hook-flags.cjs:25-28`). The step requires the JSON report, not the exit code.
- The git hook installer prints its "not a symlink we installed" warning: the old links were not moved aside, so no link changed. Move them aside and rerun.
- The landing fails midway: keep the bridge active, restore the tree through phase 004's rollback and flip back only when the original links resolve again.
- A `git config --global` write fails on a held lock: nothing changed, since git writes the file through a lock and a rename. Retry once the lock clears.

### State Transitions
- Bridge active and landing not started: flip back and delete the bridge. Nothing else changed.
- Landing done and relink failed: the bridge keeps serving every repository. Repair the relink and flip back only after the resolution check passes.
- Partial home-config edits: each item restores from its own backup, so the phase resumes at the first item without a verified change.
- Linked worktrees during and after the bracket: `check-git-hooks.sh` warns there about mismatched links and never installs (`check-git-hooks.sh:120-131`), which is also true today.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | 10 home-level items, about 60 files outside Git, 10 consumer links and one local hooks directory |
| Risk | 21/25 | Hooks for every repository on the machine (15 under `~/MEGA/Development`, 29 checkouts of this one), configs that hold secrets, no Git history to revert with |
| Research | 9/20 | The census is done. Seven UNKNOWNs remain, owned by phases 003 and 004 and by tasks T008 and T025 |
| **Total** | **43/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- UNKNOWN: which `.opencode/` shape phase 004 freezes, which consumer contract it publishes and which step lands the move in `MAIN`. Its unfrozen draft places the landing in this phase and prefers a relative-link `.opencode` (`goal.md` log). T001 reads the frozen record.
- UNKNOWN: whether git 2.50.1 skips or fails a dangling hook under `core.hooksPath` (`001-deep-research/research/research.md:164`). The bridge makes this phase independent of the answer, but the quiet-window fallback for other machines depends on it. Phase 003's probe settles it.
- UNKNOWN: whether Codex 0.154.0 loads `~/.codex/prompts/`. No script in the tree writes that directory (E14). T008 settles it from the installed Codex's own help or documentation.
- UNKNOWN: which working directory Hermes v0.21.1 resolves `mcp_servers.code_mode.args` against, and whether Hermes runs inside consumer projects. Until phase 011's live load test answers it, line 17 follows the consumer contract.
- UNKNOWN: whether the trust entry keyed to `MAIN/.opencode` affects any Codex session, given that `MAIN` has its own entry at `~/.codex/config.toml:15`.
- UNKNOWN: which other machines hold a checkout or a consumer project, and what their home configs name (`001-deep-research/research/research.md:167`). The operator runs the checklist on each.
- UNKNOWN: the trace field that names a hook on git 2.50.1. T025 confirms the pattern on the known `pre-commit` instance before reading any absence.
<!-- /ANCHOR:questions -->

---

