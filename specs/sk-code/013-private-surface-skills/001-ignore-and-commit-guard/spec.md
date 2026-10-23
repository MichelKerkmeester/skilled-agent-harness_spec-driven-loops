---
title: "Feature Specification: Phase 1: ignore-and-commit-guard"
description: "Nothing currently stops a private local-* skill from being committed: the root .gitignore has no rule for those paths and the pre-commit hook has no private-skill gate, so one forced add publishes the operator's private skill. This phase lands the two ignore rules and the blocking guard, with harness cases, before any private file exists."
trigger_phrases:
  - "ignore and commit guard"
  - "phase 1 ignore and commit guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Branch** | `deepseekpi` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-hub-surface-removal |
| **Handoff Criteria** | Both root ignore rules match the private paths as a folder and as a symlink, and the pre-commit guard refuses a staged `local-*` skill path while every existing harness case still passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* private skills that only the operator's local advisor routes specification.

**Scope Boundary**: Only three tracked files change: the root `.gitignore`, `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. This phase creates no skill folder, deletes no skill folder, touches no advisor code, regenerates no generated data and writes no private content. It only makes the private paths unstageable and refuses a staged one, so that the later phases have somewhere safe to write.

**Dependencies**:
- Upstream: none. This phase is the first in the sequence and depends only on the verified anchors at commit `42b41dd286`.
- Downstream: 002-hub-surface-removal, 003-advisor-vocabulary-cleanup, 004-private-local-skills, 005-leak-and-routing-verification, in that order. 004 depends only on the ignore rules this phase adds, but still runs after 003 so the advisor scan already follows a `local-*` symlink.

**Deliverables**:
- Two root ignore rules, `/.skilled/skills/local-*` and `/.hermes/skills/local-*`, with no trailing slash.
- A blocking private-skill guard in the pre-commit hook, inserted immediately before the comment-hygiene gate, with no bypass variable and no `lib/gates.tsv` row.
- Harness cases covering the block, the printed repair, every skill root and the false-positive boundary, all passing alongside the existing cases.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two surfaces that are about to become private skills have no safe place to live yet. At commit `42b41dd286` the root `.gitignore` carries no `local-*` rule, so `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exits 1, and the pre-commit hook carries no private-skill gate, so a single `git add -f` stages a private skill. One such commit publishes the operator's private content into the public repository, where the committed trigger index, the Hermes mirrors and every downstream clone would carry it. A guard added after private files exist would have to defend content already sitting in the working tree; added first, it defends an empty path.

### Purpose
Make a private `local-*` skill impossible to stage by accident and impossible to commit without an explicit, recorded bypass, before the first private byte exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `.gitignore`: two rules, `/.skilled/skills/local-*` and `/.hermes/skills/local-*`, with no trailing slash so each matches a real folder and a symlink.
- `.skilled/scripts/git-hooks/pre-commit`: one blocking block inserted immediately before the line `# --- Comment hygiene gate (blocking) ---`, reading `git diff --cached --name-only -z --diff-filter=ACMR` and refusing any path matching `^\.(skilled|opencode|claude|pi|devin|hermes)/skills/local-[^/]+(/|$)`.
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`: new cases for the block, the printed repair, all six skill roots and the false-positive boundary, plus the harness header line that describes what the file covers.
- Evidence that the rules and the guard behave as specified, recorded in `implementation-summary.md`.

### Out of Scope
- **The D6 boundary, copied here because the implementation must not widen it.** In scope for the packet: the sk-code hub tree, tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills (mcp-tooling/mcp-obsidian, mcp-notion, mcp-code-mode's Webflow CMS vocabulary at `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, sk-design style bundles); dated historical records (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture); git history.
- For this phase the boundary resolves to: no hub file, no advisor file, no generated data and no `changelog/` record changes. Phases 2 and 3 own those.
- No `lib/gates.tsv` row and no `SPECKIT_SKIP_*` variable for the new guard - a bypass would defeat its only purpose.
- No history scrub. Removed content stays in git history; scrubbing it with filter-repo plus a force push is an optional operator decision, recorded as D7 and deliberately not taken.
- No private skill content, no private repo link and no symlink creation beyond the disposable probe a single proof command makes and removes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | Add the two `local-*` rules with no trailing slash, in their own commented section |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Insert the blocking private-skill guard immediately before the comment-hygiene gate |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Add the guard cases and the header line describing them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The root `.gitignore` ignores `/.skilled/skills/local-*` and `/.hermes/skills/local-*`, each written without a trailing slash so the rule matches a real directory and a symlink alike. `git check-ignore -v` names both rules for a path that does not exist yet. |
| REQ-002 | The pre-commit hook refuses every staged path matching `^\.(skilled\|opencode\|claude\|pi\|devin\|hermes)/skills/local-[^/]+(/|$)`, printing each refused path and `git rm --cached -r <path>` as the repair, then exiting non-zero. |
| REQ-003 | The guard reads `git diff --cached --name-only -z --diff-filter=ACMR`, so a path with a space or non-ASCII bytes is refused rather than skipped and a staged deletion is not refused. It is inserted immediately before the line `# --- Comment hygiene gate (blocking) ---`, and carries no bypass variable and no `lib/gates.tsv` row. |
| REQ-004 | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` gains cases for the block, for the printed repair clearing the block, for all six skill roots, for a file nested inside a private skill, and for a `local-` name that sits below the skill-root level and must not block. The whole harness passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The known limit is recorded where a reader will find it: `git commit --no-verify` still bypasses the guard, the removed surfaces stay in git history, and both are covered later by the fresh-clone check in 005. |
| REQ-006 | The phase changes nothing outside its three files, and no comment it adds names a spec path, packet number or phase number. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian` prints two lines, each naming `.gitignore` and its rule, and exits 0.
- **SC-002**: A throwaway repository with a staged `.skilled/skills/local-probe/SKILL.md` runs the hook to exit 1, and the log names the path and the `git rm --cached -r` repair.
- **SC-003**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and prints `0 failed`, with the existing cases unchanged.
- **SC-004**: `git diff --name-only 42b41dd286` lists only the three code files and this packet's documents.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hook runs under `/bin/bash` 3.2 on macOS | A bash 4 idiom fails at commit time, not at review time | Every construct used is verified on 3.2: `[[ "${#ARR[@]}" -gt 0 ]]` on an empty array, `read -d ''`, and `=~` with an unquoted pattern variable |
| Dependency | The installed hook is a symlink into the source tree | In a worktree the global hook resolves to the main checkout, so a commit here does not exercise the edit | Prove the guard with the harness and the throwaway-repo probe; after merge the main checkout's file carries the guard |
| Risk | A trailing slash in the ignore rule | The rule silently misses a symlinked skill, which is the shape phase 4 may use | REQ-001 forbids the slash and AC-002 proves it with a real symlink |
| Risk | The guard blocks a legitimate path | Every commit in the repository becomes blocked | The pattern only matches a `local-*` directory directly under a skill root; AC-006 pins the false-positive boundary |
| Risk | A commit made with `git commit --no-verify` publishes the skill anyway | Private content reaches the public repository | Recorded limit, REQ-005; the fresh-clone check in 005 is the backstop that catches it |
| Risk | An operator turns every commit gate off through the shared kill switch | The guard does not run | The kill switch is repository-wide, not a per-gate bypass, and 005's fresh-clone check covers the result; this phase neither adds nor removes the switch |

### Rollback

The phase ships as one commit. `git revert --no-edit <phase-commit-sha>` restores `.gitignore`, `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` to their `42b41dd286` content; per file, `git checkout 42b41dd286 -- <the three files>` does the same without a commit. Verify with `git check-ignore -v .skilled/skills/local-webflow` exiting 1 again and `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` still passing, because the revert removes only the new cases. A revert here deletes no private file: this phase creates none, and a rollback that finds a `local-*` path on disk must stop and ask rather than remove it, because a later phase may own real private content there.
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The guard adds one `git diff --cached` call and one loop over the staged paths; it starts no `node`, `python3` or network call, so it stays under roughly 50 ms on a normal index.
- **NFR-P02**: Cost is linear in staged paths only; the guard reads names, never blobs.

### Security
- **NFR-S01**: The guard fails closed. A staged private path blocks the commit, and there is no environment variable, git config key or `lib/gates.tsv` row that disables it.
- **NFR-S02**: The guard must not depend on `node` or `python3`, so a checkout whose runtime is broken still refuses to publish a private skill.

### Reliability
- **NFR-R01**: A repository that stages no `local-*` path behaves exactly as before; the existing harness cases are the proof.
- **NFR-R02**: The guard runs before the comment-hygiene gate and after the trust and kill-switch blocks, so it inherits their documented behavior and adds none of its own.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty index: the loop body never runs, `${#PRIVATE_STAGED[@]}` is 0, and the hook continues - verified on bash 3.2 with `set -u`.
- Maximum length: no limit is imposed; a path of any length is matched by the anchored pattern.
- Invalid format: a staged name with a space or non-ASCII bytes is read NUL-separated and refused rather than skipped.

### Error Scenarios
- External service failure: none; the guard reads only the local index.
- Network timeout: not applicable; the guard makes no network call.
- Concurrent access: two commits in one repository each read their own index; an alternate `GIT_INDEX_FILE` is honored because `git diff --cached` reads the index the hook was given.

### State Transitions
- Partial completion: a guard added without its harness cases leaves REQ-004 unmet and blocks closure, while the ignore rules still hold.
- Session expiry: not applicable.
- Staged deletion: `--diff-filter=ACMR` excludes `D`, so running the printed `git rm --cached -r` does not itself block.
- Rename into a private path: `R` is in the filter, so the destination path is refused.
- `local-` below the skill root: `.skilled/skills/sk-code/local-notes.md` does not match, because the pattern requires `local-` to be the directory name directly under a skill root.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | Three files, roughly 60 added lines, no new module and no API change |
| Risk | 10/25 | A blocking commit gate, so a false positive stops every commit; mitigated by the harness and the pinned false-positive case |
| Research | 6/20 | Anchors are verified at `42b41dd286`; the bash 3.2 constraints were checked against the running shell |
| **Total** | **24/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None open. Two limits are recorded rather than questioned: `git commit --no-verify` bypasses the guard, and the surfaces stay in git history until an operator decides to scrub it (D7). The fresh-clone check in 005 covers both.
<!-- /ANCHOR:questions -->

---

