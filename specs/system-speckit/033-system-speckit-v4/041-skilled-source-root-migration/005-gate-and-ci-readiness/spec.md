---
title: "Feature Specification: Gate and CI Readiness"
description: "Before anything moves, teach every git hook, the SessionStart hook check and every CI workflow to find their scripts under .skilled or .opencode, fail loudly when a script is missing and prove it with a check that lives outside the moved tree."
trigger_phrases:
  - "skilled gate readiness"
  - "two root gate resolution"
  - "silent gate skip fix"
  - "independent gate input check"
  - "broken move dry run"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Gate and CI Readiness

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
| **Phase** | 5 of 11 |
| **Predecessor** | 004-migration-design |
| **Successor** | 006-dual-root-code-and-contracts |
| **Handoff Criteria** | Hooks and CI accept both roots and an independent check catches a broken move, shown by gate tests and a deliberately broken dry run |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Plan and execute the .skilled source-root migration specification.

**Scope Boundary**: The seven git hooks and their autostash library under `.opencode/scripts/git-hooks/`, the legacy hygiene helper `.opencode/hooks/git/pre-commit`, the SessionStart hook check `.opencode/bin/check-git-hooks.sh`, the 19 workflows under `.github/workflows/`, `.github/dependabot.yml` and new files under `.github/scripts/`. No file moves in this phase. The scripts these gates call keep their own `.opencode` literals, which phase 006 teaches.

**Dependencies**:
- Phase 004 has frozen the layout: what `.opencode/` keeps, where hook logs live and whether the move lands as one rename commit or a series.
- Phase 002 classes every gate and workflow in scope as `manual` under rule `contract-or-ci` (`../002-per-runtime-reference-map/research/maps/map-c-references.tsv`, area `ci` and the git-hook rows).
- Phase 001 names the silent-failure class this phase removes (`../001-deep-research/research/research.md` §6 and §12).

**Deliverables**:
- A missing-script rule in each gate file, keyed on `_in_toolchain_repo` (amended under L1; the copied two-root block is withdrawn).
- Hooks and workflows that look up every script and match every staged or changed path under both roots.
- A missing-script rule: blocking gates block, gates that cannot block warn and a repository that does not ship the toolchain stays untouched.
- The independent check `.github/scripts/check-gate-inputs.sh` with its always-on workflow, and a broken-move drill.
- Test cases for every gate change.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The repository's gates look for their own scripts at one literal root, `$REPO_ROOT/.opencode/`, and most of them read a missing script as a reason to skip. Once the tree moves to `.skilled/`, a commit or push that breaks the move passes, because the checks meant to catch it can no longer find themselves. Re-opened at `728c4f3efc`, the hooks show it in six places:

- The six mirror-parity scripts are addressed at `.opencode/` (`.opencode/scripts/git-hooks/pre-commit:168-175`), and the loop continues past any that is missing (`pre-commit:180`).
- Agent mirror-sync warns and skips when its checker is missing (`pre-commit:98-99`), and its staged-name filter admits only `.opencode` and `.claude` (`pre-commit:95`).
- Comment hygiene blocks a missing checker only while `.opencode/skills/sk-code` exists (`pre-commit:50`).
- Pre-push decides whether skills changed by diffing `.opencode/skills` alone (`pre-push:121`).
- Pre-push skips the remote-push permission gate when `worktree-naming.sh` is missing (`pre-push:52-54`).
- Pre-push skips the compiled-routing guard with no output at all when the guard is missing (`pre-push:252`).

CI fails the same way through three separate routes. Six missing-guard conditionals in five workflows exit green: `advisory-checks.yml:31-34` and `:42-45`, `comment-hygiene.yml:18-21`, `markdown-link-integrity.yml:30-33`, `prompt-card-sync.yml:16-19` and `skill-doc-frontmatter.yml:21-24`. Fifty-six `paths:` entries in eight workflows name `.opencode/` only, so a change under `.skilled/` never triggers them, `spec-kit-check.yml:6-20` and `:23-37` among them. And `agent-mirror-sync.yml:29` filters changed names to `.opencode`, `.claude` and `.codex`. Together these let 12 of the 19 workflows pass a moved tree without checking it. The other seven fail loudly on a missing path, because their guard fails closed or a hard-coded path breaks the step. The pull-request-only workflows never run on a direct push, and the repository relies on the pre-commit hook to cover that ground (`.github/workflows/README.md:52`).

Phase 001 recorded the CI figure as "12 of 19 workflows skip on a missing guard". The count of workflows holds but the mechanism does not. Only 6 of the 12 missing-guard conditionals skip. The other six already fail closed: `agent-mirror-sync.yml:20-23`, `command-tree-parity.yml:36-39`, `dispatch-enforcement-guard.yml:33-36`, `playbook-operator-contract.yml:44-49`, `repo-rules-corpus.yml:27-30` and `rule-canary-sync.yml:20-23`.

### Purpose

Before anything moves, every gate finds its scripts under `.skilled/` or `.opencode/`. No gate treats a missing script as a pass inside this repository, and a check that lives outside the moved tree proves both.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A two-root lookup for every script path the seven hooks, the autostash library, the legacy hygiene helper and the SessionStart hook check use (plan §3, rows H01 to H24).
- Both roots in every staged-name filter and pathspec those files match on.
- The missing-script rule for those files, keeping the global-hook allowance for repositories that do not ship the toolchain (`pre-commit:46-49`, `prepare-commit-msg:39-41`).
- `.skilled/` twins for the 56 workflow `paths:` entries and for `.github/dependabot.yml:13`, and `skilled` in the name filter at `agent-mirror-sync.yml:29`.
- A source-root step in each of the 21 workflow jobs, with the 87 executable `.opencode/` references moved onto it.
- Fail-closed replacements for the six skip conditionals.
- The independent check with its workflow and test script, plus the broken-move drill.
- New cases in the four hook test scripts whose files change, plus a new test script for the SessionStart hook check.
- Behavior notes in `.opencode/scripts/git-hooks/README.md`, its `tests/README.md` and `.github/workflows/README.md`.

### Out of Scope
- Moving any file. Phase 007 moves the tree.
- The code the gates call. Its own root literals stay for phase 006: `check-agent-mirror-sync.cjs:28` and `:32`, `lib/mirror-sync-verify.cjs:19`, `hooks/shared/hook-flags.sh:15`, `sk-git/scripts/worktree-naming.sh:145` and however `compiled-route-manifest.cjs` treats `--skill-root`.
- The installers. `install-git-hooks.sh:30`, its ownership check at `:58-67` and `hooks/git/install-hooks.sh:15` belong to phase 006.
- Human-facing text that names `.opencode`, such as the fix hints at `pre-commit:322-323` and `pre-push:152`, and the two echo lines and three comments in workflows. Phase 009 rewrites that text.
- Runtime hook registrations that call the SessionStart hook check by path. They are generated output that phase 008 regenerates.
- The global hook links under `~/.config/git/hooks/`. Phase 010 reinstalls them.
- `check-contract-drift.cjs`. No hook or workflow calls it: a search of `.github` and `.opencode/scripts/git-hooks` for its name returns nothing.
- Retiring the `.opencode` lookup once the move is proven.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.github/scripts/source-root.sh` | Not created | Withdrawn by the L1 amendment |
| `.github/scripts/check-gate-inputs.sh` | Create | Independent check that fails when a gate names an input that exists under neither root |
| `.github/workflows/gate-inputs.yml` | Create | Runs the check and its tests on every push to `main` and `skilled/**` and on every pull request, with no path filter |
| `.github/scripts/tests/source-root.test.sh` | Create | Layout-matrix test for the block |
| `.github/scripts/tests/check-gate-inputs.test.sh` | Create | Fixture test for the check |
| `.github/scripts/tests/broken-move-drill.sh` | Create | Deliberately broken dry run in a disposable clone |
| `.opencode/scripts/git-hooks/pre-commit` | Modify | Eight gates: filter twins, script lookup, missing-script rule |
| `.opencode/scripts/git-hooks/pre-push` | Modify | Five gates: skill detector, routing-byte twins, script lookup, missing-script rule |
| `.opencode/scripts/git-hooks/prepare-commit-msg` | Modify | Allocator lookup and a warning when it is missing |
| `.opencode/scripts/git-hooks/post-commit`, `post-merge`, `post-rewrite` | Modify | Autostash library, kill switch and `git-sync.sh` lookup |
| `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` | Modify | Block copy and the log root phase 004 names |
| `.opencode/hooks/git/pre-commit` | Modify | Legacy hygiene helper under the same rules |
| `.opencode/bin/check-git-hooks.sh` | Modify | Hook source directory, kill switch and installer lookup |
| `.opencode/scripts/git-hooks/tests/pre-commit.test.sh`, `pre-push.test.sh`, `prepare-commit-msg.test.sh`, `autostash-orphan-guard.test.sh` | Modify | Cases for `.skilled/` layouts, missing scripts and foreign repositories |
| `.opencode/bin/tests/check-git-hooks.test.sh` | Create | Test script for the SessionStart hook check |
| `.github/workflows/*.yml` (19 files) | Modify | Filter twins in 8, source-root step and paths in all 19, fail-closed guards in 5 |
| `.github/dependabot.yml` | Modify | `.skilled/**` twin of line 13 |
| `.opencode/scripts/git-hooks/README.md`, `tests/README.md`, `.github/workflows/README.md` | Modify | The missing-script rule, the new cases and the new workflow |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every script path the seven hooks, the autostash library, the legacy hygiene helper and the SessionStart hook check use resolves in this repository before and after the move, through the tracked `.opencode -> .skilled` link that phase 004 chose (amended under L1: the two-root lookup is withdrawn). |
| REQ-002 | Every staged-name filter and pathspec in those files admits both roots: `pre-commit:95`, `:131`, `:139-141`, `:143`, `:145`, `:202`, `:224`, `:259-260`, `:302-305`, `pre-push:121`, `:281-286` and `.opencode/hooks/git/pre-commit:53`. |
| REQ-003 | In a repository whose spec-kit sentinel resolves under either root, a gate script missing under both roots is never silent. A blocking gate exits 1 naming the path, and a gate that cannot block prints a warning naming the path and keeps its exit status. A repository with no sentinel under either root sees no new output and no new block. |
| REQ-004 | Every workflow `paths:` entry naming `.opencode/` has a `.skilled/` twin (56 entries in 8 workflows) and so does `.github/dependabot.yml:13`. The name filter at `agent-mirror-sync.yml:29` admits `skilled`. |
| REQ-005 | The six missing-guard skip conditionals in the workflows fail closed. Amended under L1: the per-job export step and `$SOURCE_ROOT` paths are withdrawn, because CI checkouts carry the tracked link. |
| REQ-006 | One independent check outside `.opencode/` and `.skilled/` fails when a gate file is missing, when a literal gate or workflow input resolves nowhere, when a filter lacks its `.skilled/` twin, or when a file naming a root yields no extracted input. It runs in CI on every push to `main` and `skilled/**` and on every pull request, with no path filter. |
| REQ-007 | A deliberately broken dry run fails as designed. In a disposable L1 clone, the check passes on the whole tree. Deleting a gate input makes the check exit 1 and its hook block or warn. The same break under the pre-change hooks reproduces today's silent pass, and a foreign repository stays silent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-008 | Every gate change has test coverage. The six existing hook test scripts keep their 126 passing cases, and each new case is seen failing against the unchanged file before its change lands. |
| REQ-009 | Every contract change carries a GPT-5.6 review, with each finding fixed or answered before its commit. The contract changes are the missing-script rule, the fail-closed workflows, the independent check, the drill and the naming guard rule. |
| REQ-010 | No new code comment carries a spec path, packet or phase number or task id, and every new file name is kebab-case. |
| REQ-011 | The handoff to phase 006 names each script the gates call whose own root literal this phase leaves in place, with its line. |
| REQ-012 | The naming guard's changed-since mode reports no offender for a rename or copy that keeps its basename, so a pure move of a grandfathered name passes. A new snake_case basename, and a new snake_case directory on the destination path, still fail. Today four tracked names would fail once moved: `commands/prompt/assets/prompt_improve_auto.yaml`, `prompt_improve_confirm.yaml`, `prompt_improve_presentation.txt` and the grep-convention fixture `naming-exception/Spec_Draft.md`, whose name is the fixture's purpose (`.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:143-176`, `:266-282`). |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With the tree renamed to `.skilled/` in a disposable clone, every gate invokes its `.skilled/` script and the independent check prints `RESULT: PASSED`.
- **SC-002**: In that clone, deleting any single gate input makes the independent check exit 1 naming it, and makes its hook exit 1 or print a warning naming it.
- **SC-003**: The six existing hook test scripts pass at or above their 126-case baseline, with no case removed.
- **SC-004**: In a repository with no spec-kit sentinel under either root, every hook exits 0 with no gate output.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004's frozen layout | The literal run paths, the log root and the move's commit shape stay unknown, so this phase cannot start (parent decision D1) | Wait for phase 004 to validate, and halt with a LOGIC-SYNC report if its layout contradicts this plan |
| Dependency | DeepSeek V4.1 Flash on cli-pi through the LLM Gateway | Literal edits stall | The orchestrator makes them and records the deviation in `goal.md` |
| Dependency | GPT-5.6 on cli-codex | A contract change lacks its second model family | The change waits for its review and is never merged unreviewed |
| Risk | Live hooks run from the main checkout: every file in `~/.config/git/hooks/` links to `Public/.opencode/scripts/git-hooks/` | High | A hook edited in the worktree is not live, so the tests call the worktree's hook files directly. Once the main checkout carries this phase, every repository on this machine that uses the global hooks runs the new code, so the foreign-repository proof passes first |
| Risk | A new block fires in a repository that is not this one | High | The sentinel decides only what a missing script means. A present script runs as it does today in any repository, and a repository with no sentinel is never blocked |
| Risk | A consumer project reaches this checkout through `.opencode -> Public/.opencode` (`PUBLIC-RELEASE.md:22`) | Med | The sentinel resolves through the link, so gates keep running there. If phase 004 shrinks `.opencode/`, phase 010 owns keeping consumers gated |
| Risk | A new code comment carries a packet, phase or task id | Med | `check-comment-hygiene.sh:163-172` rejects it. Each brief forbids such ids, and the orchestrator runs the checker on every changed file |
| Risk | Running the naming guard's pytest suite leaves a `.pytest_cache` that stales leaf manifests | Med | Run pytest with `-p no:cacheprovider` |
| Risk | Validation inside the worktree reads a stale toolchain | Med | Validate from the main checkout's toolchain |
| Risk | The move's push counts as a mass deletion if rename detection misses | Low here | The guard counts `--diff-filter=D` (`lib/mass-deletion-guard.sh:45-47`) and `SPECKIT_ALLOW_MASS_DELETION=1` authorizes one operation (`:18`). Phases 007 and 011 own that push |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The shared block adds under 50 ms to a pre-commit run that stages no gate trigger, measured as the median of ten runs against a baseline taken before the change.
- **NFR-P02**: `check-gate-inputs.sh` finishes in under 10 seconds on this repository.

### Security
- **NFR-S01**: No gate gains a new bypass variable and no existing bypass name changes. Two pre-push gates without a skip variable accept their existing approval variable instead (plan §3, rows H11 and H12).
- **NFR-S02**: The independent check only reads. No gate change writes outside the paths the gate already writes.

### Reliability
- **NFR-R01**: Every shell change runs under macOS `/bin/bash` 3.2.57, the version observed on this machine.
- **NFR-R02**: The independent check never prints `RESULT: PASSED` after extracting no input from a file that names a root.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- `.skilled/` holding only its placeholder, as it does today (`.skilled/future-task-placeholder-move-opencode-contents-to-here-and-relative-symlink-back/.gitkeep`): every path resolves under `.opencode/`.
- `.opencode` as a symlink to `.skilled`: both lookups reach the same file, and the block reports the `.skilled/` path.
- The same path present as a real file under both roots: `.skilled/` wins, so a stale `.opencode/` copy never shadows the moved file.
- A path pattern such as `skills/*/mode-registry.json` in a workflow: the independent check requires at least one match.

### Error Scenarios
- `node` missing: node-based gates keep today's warning and skip (`pre-commit:98`, `:120`, `:253`), because a missing runtime is an environment gap rather than a moved script.
- The kill switch `hooks/shared/hook-flags.sh` missing inside this repository: gates stay enabled as today, and one warning names the file.
- A dangling `.opencode` link in a consumer project: no sentinel resolves, so the global-hook allowance applies.
- The shared block itself absent from a gate file: the independent check's `block-copies` rule fails, and so does the gate's own test script.

### State Transitions
- A partly moved tree during phase 007's rename-only commits: hooks resolve per path, so each of those commits is still checked. CI resolves one root per job, so a partly moved tip that gets pushed fails loudly.
- A hook copied rather than linked, as the autostash test script does (`tests/autostash-orphan-guard.test.sh:43-48`): the block travels inside the file, so nothing has to be sourced from elsewhere.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 40 files: 9 gate files, 19 workflows, dependabot, 6 new files under `.github/scripts/` and 5 test scripts |
| Risk | 20/25 | Changes a shared gate contract that runs machine-wide through the global hooks, and changes CI |
| Research | 8/20 | Phases 001 and 002 mapped the surface. The block location and the missing-script rule are design choices under review |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which executable paths does phase 004 keep literal under `.opencode/`, such as the `npm --prefix .opencode ci` installs at `spec-kit-check.yml:64` and `dispatch-enforcement-guard.yml:44-45`? UNKNOWN until phase 004 freezes its layout.
- Does `compiled-route-manifest.cjs refresh` accept `--skill-root .skilled/skills/<hub>`? UNKNOWN, because this phase did not open that code. The pre-commit test script stubs the mint tool (`tests/pre-commit.test.sh:62-70`), and phase 006 owns the real answer.
- Should a missing mass-deletion library block pushes in this repository, reversing the documented fail-open at `pre-push:34-36`? Proposed yes. The GPT-5.6 review and the orchestrator decide.
- When the kill switch cannot be read, should live-sync publishing stay enabled as it does today (`post-commit:36-49`)? Proposed: keep today's behavior and warn. The GPT-5.6 review decides.
- Which pushed tip first carries this phase, so its CI runs can be read? UNKNOWN. The parent goal pre-authorizes pushes to `skilled/v4.0.0.0` and `main` (`../goal.md`, decision D2).
<!-- /ANCHOR:questions -->

---
