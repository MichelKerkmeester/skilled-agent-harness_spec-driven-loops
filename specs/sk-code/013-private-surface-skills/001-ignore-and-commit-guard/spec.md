---
title: "Feature Specification: Phase 1: ignore-and-commit-guard"
description: "Nothing currently stops a private local-* skill from being committed: the root .gitignore has no rule for those paths and the pre-commit hook has no private-skill gate, so one forced add publishes the operator's private skill. This phase lands four ignore rules and the blocking guard, with harness cases, before any private file exists."
trigger_phrases:
  - "ignore and commit guard"
  - "phase 1 ignore and commit guard"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: ignore-and-commit-guard

<!-- SPECKIT_LEVEL: 3 -->
---

<!-- ANCHOR:metadata -->
## EXECUTIVE SUMMARY

Nothing in this repository stops a private `local-*` skill from being committed. The root `.gitignore` carries no rule for those paths, so `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exits 1 today, and the pre-commit hook carries no private-skill gate, so one `git add -f` stages the operator's private content. This phase closes that path before the first private byte exists: four slash-less ignore rules, one blocking guard inserted ahead of the comment-hygiene gate, and seven harness cases that pin the block, its repair, all eight guarded roots, the false-positive boundary and three adversarial index shapes.

**Key Decisions**: Guard eight skill roots rather than the six the earlier draft named, adding `.codex` and `.cursor` (ADR-001); enforce with a blocking hook that has no bypass variable and no `lib/gates.tsv` row (ADR-002); match on the staged path name and record the renamed-copy limit rather than claim a content check (ADR-003).

**Critical Dependencies**: The hook runs under `/bin/bash` 3.2 and must stay pure bash, with no `node` and no `python3` (ADR-004). No upstream phase. Phases 002 through 005 depend on the ignore rules and the guard this phase lands.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-10-23 |
| **Executor** | OpenCode 2 orchestrator; reviews via the `subagent` tool, agent `review` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-hub-surface-removal |
| **Handoff Criteria** | Both root ignore rules match the private paths as a folder and as a symlink, and the pre-commit guard refuses a staged `local-*` skill path under any guarded root while every existing harness case still passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Move the Webflow and Obsidian surfaces out of the shipped sk-code hub into gitignored local-* skills that this checkout links to but never tracks, routed only by the operator's local advisor specification.

**Scope Boundary**: Only three tracked files change: the root `.gitignore`, `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`. This phase creates no skill folder, deletes no skill folder, touches no advisor code, regenerates no generated data and writes no private content. It only makes the private paths unstageable and refuses a staged one, so that the later phases have somewhere safe to write.

**Dependencies**:
- Upstream: none. This phase is the first in the sequence and depends only on the anchors re-read at the start of execution, plus the planning commit that ships the Level 3 upgrade of all five phases.
- Downstream: 002-hub-surface-removal, 003-advisor-vocabulary-cleanup, 004-private-local-skills, 005-leak-and-routing-verification, in that order. 004 depends only on the ignore rules this phase adds, but still runs after 003 so the advisor scan already follows a `local-*` symlink.

**Deliverables**:
- Four root ignore rules, `/.skilled/skills/local-*`, `/.hermes/skills/local-*`, `/.codex/skills/local-*` and `/.cursor/skills/local-*`, each with no trailing slash.
- A blocking private-skill guard in the pre-commit hook, inserted immediately before the comment-hygiene gate, covering eight skill roots, with no bypass variable and no `lib/gates.tsv` row.
- Seven harness cases: the block, the printed repair, all eight roots plus a nested file, the false-positive boundary, a renamed copy, a staged symlink and a staged gitlink.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The two surfaces that are about to become private skills have no safe place to live yet. At the current base the root `.gitignore` carries no `local-*` rule, so `git check-ignore -v .skilled/skills/local-webflow/SKILL.md` exits 1, and the pre-commit hook carries no private-skill gate, so a single `git add -f` stages a private skill. One such commit publishes the operator's private content into the public repository, where the committed trigger index, the Hermes mirrors and every downstream clone would carry it. A guard added after private files exist would have to defend content already sitting in the working tree; added first, it defends an empty path.

The earlier draft of this phase covered six skill roots and left `.codex` and `.cursor` out. Both directories are tracked in this repository (77 and 81 tracked files respectively) and neither carries a `skills/` child today, so the omission is invisible until one appears. A guard whose matrix silently trails the runtime roots is the same defect one release later.

### Purpose
Make a private `local-*` skill impossible to stage by accident and impossible to commit without an explicit, recorded bypass, before the first private byte exists.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Root `.gitignore`: four rules, `/.skilled/skills/local-*`, `/.hermes/skills/local-*`, `/.codex/skills/local-*` and `/.cursor/skills/local-*`, with no trailing slash so each matches a real folder and a symlink.
- `.skilled/scripts/git-hooks/pre-commit`: one blocking block inserted immediately before the line `# --- Comment hygiene gate (blocking) ---`, reading `git diff --cached --name-only -z --diff-filter=ACMR` and refusing any path matching the eight-root private-skill pattern in REQ-002.
- `.skilled/scripts/git-hooks/tests/pre-commit.test.sh`: seven new cases covering the block, the printed repair, all eight skill roots, a file nested inside a private skill, the false-positive boundary, a renamed copy, a staged symlink and a staged gitlink, plus the harness header line that describes what the file covers.
- Evidence that the rules and the guard behave as specified, recorded in `implementation-summary.md`.

### Out of Scope
- **The D6 boundary, copied here because the implementation must not widen it.** In scope for the packet: the sk-code hub tree, tracked consumers that name `sk-code-webflow`, `sk-code-obsidian`, or the `WEBFLOW` / `OBSIDIAN` surface tokens, and the advisor's sk-code surface vocabulary. Out of scope, kept unchanged: generic Webflow/Obsidian words in other skills (mcp-tooling/mcp-obsidian, mcp-notion, mcp-code-mode's Webflow CMS vocabulary at `fusion.ts:600-602`, `explicit.ts:131`, `skill_advisor.py:2181`, the `P1-MCP-002` regression and holdout rows, sk-design style bundles); dated historical records (every `changelog/` file, `.skilled/changelog/skilled/*.md`, `benchmark/reports/`, `specs/**/z_archive/`, the `doctor-update-*` playbooks in `.skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/` that name units of the past v4.0.0.2 release, and the `anchor-repair-sample` test fixture); git history.
- For this phase the boundary resolves to: no hub file, no advisor file, no generated data and no `changelog/` record changes. Phases 2 and 3 own those.
- No `lib/gates.tsv` row and no `SPECKIT_SKIP_*` variable for the new guard - a bypass would defeat its only purpose.
- No content-based detection. The guard matches the staged path name, so a private skill copied to a non-local name passes it; that limit is recorded in ADR-003 and covered by the blob comparison in phase 5, not by a manifest this phase would have to invent.
- No history scrub. Removed content stays in git history; scrubbing it with filter-repo plus a force push is an optional operator decision, recorded as D7 and deliberately not taken.
- No private skill content, no link to an external repository and no symlink creation beyond the disposable probe a single proof command makes and removes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore` | Modify | Add the four `local-*` rules with no trailing slash, in their own commented section |
| `.skilled/scripts/git-hooks/pre-commit` | Modify | Insert the blocking private-skill guard immediately before the comment-hygiene gate |
| `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` | Modify | Add seven guard cases and the header line describing them |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The root `.gitignore` ignores `/.skilled/skills/local-*`, `/.hermes/skills/local-*`, `/.codex/skills/local-*` and `/.cursor/skills/local-*`, each written without a trailing slash so the rule matches a real directory and a symlink alike. `git check-ignore -v` names each rule for a path that does not exist yet. |
| REQ-002 | The pre-commit hook refuses every staged path matching the private-skill pattern below, printing each refused path and the `git rm --cached -r` command that clears it, then exiting non-zero. |
| REQ-003 | The guard reads `git diff --cached --name-only -z --diff-filter=ACMR`, so a path with a space or non-ASCII bytes is refused rather than skipped and a staged deletion is not refused. It is inserted immediately before the line `# --- Comment hygiene gate (blocking) ---`, and carries no bypass variable and no `lib/gates.tsv` row. |
| REQ-004 | `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` gains cases for the block, for the printed repair clearing the block, for all eight skill roots, for a file nested inside a private skill, for a `local-` name that sits below the skill-root level and must not block, for a renamed copy that must not block, for a staged symlink named `local-*` and for a staged gitlink named `local-*`. The whole harness passes. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The known limits are recorded where a reader will find them: `git commit --no-verify` still bypasses the guard, the removed surfaces stay in git history, a renamed copy of a private skill passes a name-based guard, and no ongoing pre-push surface-token guard exists - the fresh-clone sweep in 005 is a one-time closure gate. |
| REQ-006 | The phase changes nothing outside its three files, and no comment it adds names a spec path, packet number or phase number. |

### The private-skill pattern

Exactly as the hook carries it:

```bash
^\.(skilled|opencode|claude|pi|devin|hermes|codex|cursor)/skills/local-[^/]+(/|$)
```

The pattern is anchored at the repository root and matches a `local-*` directory directly under `skills/` in any of the eight roots. `(/|$)` is what makes a staged symlink named exactly `local-x` match: it has no child path, so a pattern that required a trailing slash would miss it.

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `git check-ignore -v .skilled/skills/local-webflow/SKILL.md .hermes/skills/local-obsidian .codex/skills/local-probe .cursor/skills/local-probe` prints four lines, each naming `.gitignore` and its rule, and exits 0.
- **SC-002**: A throwaway repository with a staged `.skilled/skills/local-probe/SKILL.md` runs the hook to exit 1, and the log names the path and the `git rm --cached -r` repair.
- **SC-003**: `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` exits 0 and prints `pre-commit gates: 131 passed, 0 failed`, with the existing cases unchanged.
- **SC-004**: The phase commit changes only the three code files outside `specs/`, and no added code comment names a spec path, packet number or phase number.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hook runs under `/bin/bash` 3.2 on macOS | A bash 4 idiom fails at commit time, not at review time | Every construct used is verified on 3.2: `[[ "${#ARR[@]}" -gt 0 ]]` on an empty array, `read -d ''`, and `=~` with an unquoted pattern variable |
| Dependency | The installed hook is a symlink into the source tree, and in this worktree it is `SHADOWED` | A commit made here does not exercise the edit, so a green local commit proves nothing about the installed gate | Prove the guard with the harness and the throwaway-repo probe; after merge the main checkout's file carries the guard |
| Risk | A trailing slash in the ignore rule | The rule silently misses a symlinked skill, which is the shape phase 4 uses | REQ-001 forbids the slash and AC-002 proves it with a real symlink |
| Risk | The guard blocks a legitimate path | Every commit in the repository becomes blocked | The pattern only matches a `local-*` directory directly under a skill root; AC-006 pins the false-positive boundary |
| Risk | A commit made with `git commit --no-verify` publishes the skill anyway | Private content reaches the public repository | Recorded limit, REQ-005; the fresh-clone check in 005 is the backstop that catches it |
| Risk | An operator turns every commit gate off through the shared kill switch | The guard does not run | The kill switch is repository-wide, not a per-gate bypass, and 005's fresh-clone check covers the result; this phase neither adds nor removes the switch |
| Risk | A private skill copied to a tracked name that does not start with `local-` | The guard passes it, because the match is on the path name | Deliberate and recorded: ADR-003, AC-011 pins the exit code 0, and phase 5 compares blobs rather than names |
| Risk | `.codex/skills` and `.cursor/skills` do not exist in this checkout | The two new ignore rules are inert today, so a reader may mistake them for dead config | The guard matches the path name whether or not the directory exists, and the ignore rules apply the moment the directory appears; ADR-001 records the choice and the evidence |
| **Maintenance limit** | **No ongoing pre-push surface-token guard exists.** The fresh-clone sweep in phase 5 runs once, at closure, and nothing recurring re-checks the public tip for `WEBFLOW` or `OBSIDIAN` tokens afterwards | A later commit can reintroduce a surface token and no gate would say so; only a reviewer or a future phase would notice | Recorded here and in ADR-005. The recurring checks that do exist are CI's routing-registry drift and the trigger-index rebuild, and neither scans for these tokens. Reopening this needs a new packet, not a change to this phase |

### Rollback

The phase ships as one commit. `git revert --no-edit HEAD` restores `.gitignore`, `.skilled/scripts/git-hooks/pre-commit` and `.skilled/scripts/git-hooks/tests/pre-commit.test.sh` to their pre-phase content; per file, `git checkout HEAD~1 -- .gitignore .skilled/scripts/git-hooks/pre-commit .skilled/scripts/git-hooks/tests/pre-commit.test.sh` does the same without a commit. Verify with `git check-ignore -v .skilled/skills/local-webflow` exiting 1 again and `bash .skilled/scripts/git-hooks/tests/pre-commit.test.sh` still passing, because the revert removes only the new cases. A revert here deletes no private file: this phase creates none, and a rollback that finds a `local-*` path on disk must stop and ask rather than remove it, because a later phase may own real private content there.
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

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
## 8. EDGE CASES

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
- Staged symlink named `local-*`: the index records mode `120000`, the name still matches, and the guard refuses it - AC-009.
- Staged gitlink named `local-*`: the index records mode `160000`, the name still matches, and the guard refuses it - AC-010. The comment-hygiene gate below handles the same entry type by skipping the blob read.
- Renamed copy at a non-local name: the guard passes it, by design - AC-011 and ADR-003.
- `local-` below the skill root: `.skilled/skills/sk-code/local-notes.md` does not match, because the pattern requires `local-` to be the directory name directly under a skill root.
- `.codex` and `.cursor` before their `skills/` child exists: the guard still matches a staged path under either root, and the ignore rule still matches a path that does not exist yet.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | Three files and 116 added lines, measured against the phase base; no new module and no API change |
| Risk | 11/25 | A blocking commit gate, so a false positive stops every commit; mitigated by the harness and the pinned false-positive case |
| Research | 6/20 | Anchors are verified on disk; the bash 3.2 constraints were checked against the running shell, and the regex was exercised against eight roots and six non-matching shapes |
| Multi-Agent | 2/15 | One writer, one read-only reviewer round; no parallel workstream and no workstream table |
| Coordination | 3/15 | No upstream phase; four downstream phases wait on these rules, and the planning commit must land before execution starts |
| **Total** | **31/100** | **Level 3** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | The guard refuses a legitimate path because the pattern overreaches | H | L | AC-006 pins `local-` below the skill root as committable; AC-012 requires the existing cases to stay green |
| R-002 | The guard never runs because the operator bypasses it with `--no-verify` | H | L | Recorded as a limit in REQ-005 and ADR-002; phase 5's fresh-clone sweep is the backstop |
| R-003 | A private skill is copied to a tracked name that does not start with `local-` | H | L | Name-based matching is deliberate (ADR-003); phase 5 compares blobs and AC-011 records the exit code 0 |
| R-004 | The ignore rule misses a symlinked private skill because a trailing slash crept in | M | L | REQ-001 forbids the slash and AC-002 proves it with a real symlink |
| R-005 | A later commit reintroduces a surface token and nothing recurring notices | M | M | Recorded as a maintenance limit in section 6 and ADR-005; reopening it needs a new packet |
| R-006 | The hook edit is never exercised in this worktree because the installed hook is shadowed | M | H | The harness runs the real file against throwaway repositories, and the probe runs this checkout's hook by absolute path |

## 11. USER STORIES

### US-001: The operator cannot publish a private skill by accident (Priority: P0)

**As an** operator who keeps private `local-*` skills on this machine, **I want** a staged private skill to be refused by the commit hook and by the ignore layer, **so that** one careless `git add -f` cannot publish content that exists only here.

**Acceptance criteria:** AC-001, AC-002, AC-003, AC-004, AC-009 and AC-010 in `acceptance-criteria.md`.

---

### US-002: A blocked commit names its own repair (Priority: P1)

**As a** developer who just hit the guard, **I want** the refusal to print the exact `git rm --cached -r` command that clears it, **so that** I fix the index in one step instead of reading the hook source.

**Acceptance criteria:** AC-003 and AC-004 in `acceptance-criteria.md`.

---

### US-003: A maintainer can see the guard's whole matrix (Priority: P1)

**As a** maintainer reviewing the hook, **I want** the harness to name every guarded root and every adversarial index shape, **so that** adding a runtime root later fails a visible case instead of silently widening the gap.

**Acceptance criteria:** AC-005, AC-006, AC-011, AC-012 in `acceptance-criteria.md`.

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

## 12. OPEN QUESTIONS

- None open. The limits are recorded rather than questioned: `git commit --no-verify` bypasses the guard, the surfaces stay in git history until an operator decides to scrub it (D7), a renamed copy passes a name-based guard (ADR-003), and no ongoing pre-push surface-token guard exists (ADR-005). The fresh-clone check in 005 covers the first and the last.

### Corrections made when this phase was rewritten for Level 3

- **The base commit in the earlier draft is stale.** `42b41dd286` is an ancestor of the current HEAD `583316d083`, and `git diff --name-only 42b41dd286 -- . ':(exclude)specs/**'` already lists four regenerated retrieval artifacts that this phase does not touch. The plan no longer diffs against that commit; T001 records the phase base with `git rev-parse HEAD` into `scratch/phase-base.txt`, and every scope proof reads it from there.
- **The `.gitignore` anchor does exist.** The earlier plan said the file had no line anchor; the section header `# Runtime state leaked into nested trees` sits at line 228, with its divider at line 227.
- **The guard matrix covered six roots, not the runtime's full set.** `.codex` and `.cursor` are tracked roots with no `skills/` child today. ADR-001 adds both, and the pattern now names eight roots.
- **"Roughly 60 added lines" understated the change.** The measured diff against the base is 116 added lines across the three files: 14 in `.gitignore`, 25 in the hook and 77 in the harness. The harness header loses two comment lines and gains two, so the net change is 114.
<!-- /ANCHOR:questions -->

---
