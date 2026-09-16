---
title: "Feature Specification: Phase 4: migration-design"
description: "Decide what .opencode becomes once .skilled holds the authored tree, and freeze the order, checks and rollbacks that phases 005 to 011 execute, conditioned on the phase 003 probe records."
trigger_phrases:
  - "skilled migration design"
  - "opencode layout decision"
  - "skilled cutover sequence"
  - "source root rollback plan"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Phase 4: migration-design

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

Phases 001 and 002 measured what the move touches. This phase decides what `.opencode/` becomes and the order the move happens in. The output is a 25-step cutover where each step names the surface it changes, the command that proves it worked and the way back if it did not. Every choice that depends on how a runtime or git behaves is written as a branch on a phase 003 probe, so the probe records resolve the design without rewriting it.

**Key Decisions**: what `.opencode/` becomes (ADR-001, resolved by probes P1 to P3), the cutover order and the step after which rollback becomes a forward fix (ADR-002), and which `.opencode` references survive the rewrite (ADR-003)

**Critical Dependencies**: the phase 003 probe records. The phase 001 and 002 research is committed at `728c4f3efc`. The phase 003 folder held only scaffold templates when this design was written (`003-layout-probes/spec.md:60`).

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-09-16 |
| **Branch** | `worktrees/055-skilled-source-root-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 11 |
| **Predecessor** | 003-layout-probes |
| **Successor** | 005-gate-and-ci-readiness |
| **Handoff Criteria** | The layout, cutover order and rollback are frozen, ADR-001 to ADR-003 read Accepted, and a GPT-5.6 review on cli-codex is adjudicated finding by finding |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Skilled Source-Root Migration specification.

**Scope Boundary**: design only. This phase reads the research, the maps and the phase 003 probe records, and writes the layout decision, the cutover sequence, the rollback and the review record. It changes no file outside this folder, and no cutover step runs here.

**Dependencies**:
- Phase 001 blocker inventory, silent-failure class and handoff constraints (`001-deep-research/research/research.md:53-87`, `:169-181`)
- Phase 002 reconciled maps and their class totals (`002-per-runtime-reference-map/research/maps/reconciliation.json:8-31`)
- Phase 003 verdicts for probes P1 to P9 (pending)

**Deliverables**:
- `decision-record.md`: ADR-001 layout, ADR-002 cutover order and point of no return, ADR-003 keep-list
- `plan.md`: layout options, the decision tree on phase 003, the 25-step cutover with a check and a rollback per step, the review plan and the delegation
- `tasks.md`, `acceptance-criteria.md` and `goal.md`
- `evidence/` tables from four delegated units, and `review/` holding the brief and the second-family return

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A move of this size fails in the ordering, not the rename. Retargeting a symlink before the file it points at has moved leaves a dangling link. Rewriting a path in a generated artifact instead of regenerating it leaves a value that looks right and is not. And the repository's gates do not reject a bad migration commit, they skip it: every mirror-parity check continues past a missing script (`.opencode/scripts/git-hooks/pre-commit:180`), and the agent mirror filter only matches staged names under `.opencode/` or `.claude/` (`pre-commit:95`). A green commit would prove nothing. The inventory alone does not say which step goes first, or what `.opencode/` has to become so that opencode, root discovery, seven global hooks and ten consumer links on this machine keep resolving.

### Purpose
Produce a cutover sequence that can be executed without judgment calls mid-flight, a layout decision that follows mechanically from the probe records, and a rollback for every step that names the point after which rollback becomes a forward fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The target layout: what `.skilled/` holds, what `.opencode/` becomes, and whether the links between them are relative or absolute.
- The ordered cutover sequence for phases 005 to 011, one step per surface class, each with its own observable check.
- The rollback for every step, and the step after which rollback stops being a revert and becomes a forward fix.
- The gate-teaching order: which hooks, workflows and installers learn the new root, and why they learn it before any file moves.
- The keep-list: which `.opencode` references survive the phase 009 rewrite.
- A second-model-family review of the layout, the order and the contract-file changes (parent D3, `../goal.md:48`).
- Which evidence units are delegated, to which executor, with which verification.

### Out of Scope
- Executing any cutover step. Phases 005 to 011 execute what this phase writes.
- Running the phase 003 probes. The decision tree consumes their records.
- Re-opening whether the migration happens. That is settled.
- `barter/`, whose links resolve into a different checkout (`../spec.md:90`).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Renumbered to phase 4 of 11, with the design's requirements and risks |
| `plan.md` | Modify | Layout options, decision tree, 25-step cutover, review plan and delegation |
| `tasks.md` | Modify | Ordered design tasks with executors, and the verification checklist |
| `acceptance-criteria.md` | Modify | One criterion per requirement |
| `decision-record.md` | Create | ADR-001 layout, ADR-002 cutover order, ADR-003 keep-list |
| `goal.md` | Create | The child goal for this phase |
| `evidence/*.md` | Create | Tables returned by the four delegated evidence units |
| `review/design-review-brief.md` | Create | The literal brief the second-family reviewer receives |
| `review/gpt-5-6-sol-design-review.md` | Create | The reviewer's return, kept as evidence for the adjudication |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every surface class named in phase 001, and every class the phase 002 maps add, appears in the sequence exactly once, with the step that handles it |
| REQ-002 | Every step carries a command whose output distinguishes success from failure, not a description of success |
| REQ-003 | Every step carries its rollback, and the design names the step after which rollback becomes a forward fix |
| REQ-005 | The layout decision names what `.opencode/` becomes, conditioned on each phase 003 probe it rests on, and keeps `.opencode/` resolvable for opencode, root discovery and consumers (parent D5) |
| REQ-006 | The cutover order satisfies the seven ordering constraints: gates and CI first, dual-root code before the move, the placeholder before any `git mv`, rename-only commits, the hook reinstall when the main checkout moves, regeneration by owners, and validation on the main checkout's toolchain |
| REQ-007 | GPT-5.6 on cli-codex reviews the layout, the cutover order and the contract-file changes, and every finding carries an orchestrator ruling |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The design records which phase-001 blockers it resolves and which it routes around |
| REQ-008 | The design names every `.opencode` reference it keeps, so the phase 009 rescan has a definition of done |
| REQ-009 | Every delegated evidence unit names its executor, a literal brief, a kebab-case output and the orchestrator's verification |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader who was not in this session can execute the sequence without asking a question
- **SC-002**: Every phase-001 blocker is either resolved by a step or routed around with a reason
- **SC-003**: Once the phase 003 records exist, ADR-001 resolves to exactly one layout or to a named stop, with no judgment call left
- **SC-004**: The second-family review ends with zero unadjudicated findings
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 003 probe records | ADR-001 to ADR-003 stay Proposed and phase 005 cannot start | Every layout-dependent line is written as a branch, so the records resolve the design without a rewrite |
| Risk | A generated artifact is rewritten rather than regenerated | High | Steps 14 and 16 regenerate through the owning command and check for a non-empty diff and no absolute worktree path |
| Constraint | Work stays in the dedicated worktree by operator decision, while the large-reorg runbook runs toolchain validation and metadata regeneration on main (`.opencode/skills/sk-git/references/large-reorg-playbook.md:129-141`) | Medium | Validation calls the main checkout's scripts against worktree paths, regeneration in the worktree carries a no-op check and an absolute-path check, and step 22 re-runs every check on the main checkout after its fast-forward |
| Risk | The gates pass the migration commit because they skip, not because it is correct | High | Steps 2 to 5 teach hooks and CI both roots and add an independent check before step 11 moves anything |
| Risk | Hook drivers run from the main checkout, not from the worktree | High | The seven links under `~/.config/git/hooks/` point into the main checkout, so steps 5 and 8 publish the gate and dual-root changes and fast-forward the main checkout before step 11 |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The held window from step 9 to step 19 runs back to back. Step 19 starts only when `git log <step-9 base>..origin/skilled/v4.0.0.0 -- .opencode` prints nothing, so no live-branch change under `.opencode/` lands inside the window unnoticed.

### Security
- **NFR-S01**: No step prints or copies a secret. Home-config checks read `.opencode` line numbers and counts only, and backups are file copies kept outside the repository with owner-only permissions.

### Reliability
- **NFR-R01**: Every step before step 24 reverts locally with the commands in `plan.md`, and each rollback restores ignored state, hook links and home configs where its step touched them, not only tracked files.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: `.skilled/` survives the placeholder removal holding only ignored cruft such as `.DS_Store`. Step 10's check refuses step 11 until `.skilled` is absent, because `git mv` into an existing directory nests (`001-deep-research/research/research.md:73`).
- Maximum length: one rename commit of 17,767 tracked files (`001-deep-research/research/research.md:112`). Pre-push Gate 0 runs under this machine's shared git config, which sets `diff.renameLimit` to 60000, and probe P6 decides whether it counts any rename in the push range as a deletion (`.opencode/scripts/git-hooks/pre-push:97-119`).

### Error Scenarios
- External service failure: a gate script is missing mid-cutover and the hook continues past it (`pre-commit:180`). The independent check from step 3 lives outside both roots, so it still runs and fails.
- Network timeout: a delegated unit or the review dispatch hangs. Every dispatch redirects stdin from `/dev/null` (cli-pi `SKILL.md:9`, cli-codex `SKILL.md:272`), runs one at a time and is killed by its own captured PID.
- A generator exits 0 having written nothing: step 14 requires a non-empty diff from every owner whose outputs named `.opencode`.
- The fast-forward of the main checkout refuses or removes ignored state: step 18 archives the four SQLite databases and `.state/` first, and step 19 relocates ignored entries before the fast-forward, whatever probe P7 shows.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 23/25 | Files: 17,767 renamed and 4,260 referencing. Links: 435. Systems: seven runtimes, hooks, CI |
| Risk | 23/25 | Auth: N, API: N, Breaking: Y, machine-wide hooks and a published consumer contract |
| Research | 16/20 | Nine probes, two completed research phases |
| Multi-Agent | 9/15 | Workstreams: 3, Opus authoring, DeepSeek evidence units, GPT-5.6 review |
| Coordination | 13/15 | Dependencies: seven later phases and 29 worktrees sharing one set of global hooks |
| **Total** | **84/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Gates skip instead of failing, so a broken move commits green (`pre-commit:180`, `.github/workflows/markdown-link-integrity.yml:29-33`) | H | H | Steps 2 to 4 before step 11, and an independent check outside both roots |
| R-002 | Worktree commits run the main checkout's hook drivers, so gate changes do nothing until the main checkout has them (`~/.config/git/hooks/` listing, `.opencode/scripts/install-git-hooks.sh:30-31`) | H | H | Steps 5 and 8 publish and fast-forward the main checkout before step 11 |
| R-003 | The hook installer skips every existing link whose target string names another source directory (`install-git-hooks.sh:58-67`, `:138-142`), so a reinstall from `.skilled/` reports warnings and changes nothing | H | H | Step 6 makes the ownership test accept both roots, and step 20 checks `readlink` on all seven links |
| R-004 | 62 `.gitignore` lines name `.opencode` (`../spec.md:83`), so after the move build output and databases under `.skilled/` show as untracked and a broad `git add` commits them | H | M | Step 7 adds `.skilled/` twins before step 11, and every step stages explicit paths |
| R-005 | Fast-forwarding the main checkout drops or blocks on 184 ignored entries under `.opencode/`, four of them SQLite databases | H | M | Step 18 archives them and step 19 relocates them before the fast-forward |
| R-006 | Autosync publishes a worktree commit to the live branch inside the held window (`.opencode/scripts/git-hooks/post-commit:26-32`, `.opencode/bin/git-sync.sh:5-9`) | H | L | Step 1 runs every executing session with `SPECKIT_AUTOSYNC=0` and compares the remote tip after each commit |
| R-007 | Containment snapshots nest copies of repository files and are never committed. Four untracked `containment/` directories in this packet hold 396 files, 204 of them naming `.opencode` | M | H | Stage explicit pathspecs, never `git add -A`, and exclude `**/containment/**` from the step 17 rescan |
| R-008 | A new output name breaks the kebab-case rule enforced by `.opencode/skills/sk-doc/shared/scripts/check_no_new_snake_case.py:5-15` | L | M | Every output path in `plan.md` is kebab-case, and T016 runs the guard |
| R-009 | An iteration record names its number under `run`, and the fan-out runner rejects the lane (`.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:734`) | M | L | This phase dispatches no fan-out, and any later lineage writes `iteration` |
| R-010 | A convergence threshold above 1 passed under the convergence stop policy. The runner's defaults are 0.05 for research and 0.1 for review (`fanout-run.cjs:1530`) | M | L | Never pass `--convergence-threshold` above 1, and run operator-set iteration counts with early convergence disabled |
| R-011 | A `.pytest_cache` left under a skill root lands in a regenerated leaf manifest, because the walker applies no ignore filter (`.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs:104-110`) | M | M | Step 16 deletes `.pytest_cache` under skill roots before regenerating, and verification runs pytest with `-p no:cacheprovider` |
| R-012 | The mass-deletion ceiling of 100 blocks the push if the push range counts renames as deletions (`.opencode/scripts/git-hooks/lib/mass-deletion-guard.sh:17-18`, `:45-47`) | M | M | Probe P6 measures the whole push range. A bypass is one push with `SPECKIT_ALLOW_MASS_DELETION=1` after step 12 lists every deletion |
| R-013 | The live branch moves under the held commits and a rebase hits rename conflicts across 17,767 paths | H | M | Rebase in step 9, drift check in step 19 with a rebase and re-check when it finds drift |
| R-014 | The rebuild owner of the tracked `council-graph.sqlite` is unknown (`002-per-runtime-reference-map/research/research.md:173`), and the main checkout holds it modified | M | H | Step 16 holds that one artifact until an owner is named, and step 18 settles the modified file before the fast-forward |

---

## 11. USER STORIES

### US-001: Execute the cutover without a judgment call (Priority: P0)

**As a** migration executor running phases 005 to 011, **I want** each step to carry its check and its rollback, **so that** no step needs a decision mid-flight.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

### US-002: Keep linked projects working through the move (Priority: P1)

**As a** consumer project linked to `Public/.opencode`, **I want** `.opencode/` to keep resolving through the move, **so that** none of the ten links on this machine needs an edit.

**Acceptance criteria:** see `acceptance-criteria.md` (rows referencing this story).

---

## 12. OPEN QUESTIONS

- Which layout do probes P1 to P3 select? Pending the phase 003 records.
- Which command rebuilds the tracked `council-graph.sqlite`, and are its stored paths regenerated or migrated? UNKNOWN (`002-per-runtime-reference-map/research/research.md:173`). Settled by reading the deep-loop council graph writer.
- Does opencode resolve `@opencode-ai/plugin` for a plugin reached through a link from the link path or from the real path? UNKNOWN (`.opencode/plugins/opencode-goal.js:16`). Folded into probes P1 and P2.
- Does a fast-forward over a real `.opencode/` holding ignored files refuse, remove them or leave them? UNKNOWN, probe P7. Steps 18 and 19 are ordered to be safe under each answer.
- Should the Codex project trust entry at `~/.codex/config.toml:21` name the checkout root or `.skilled`? UNKNOWN until step 21 starts Codex against each.
- What home-level state exists on machines other than this one? UNKNOWN (`001-deep-research/research/research.md:167`).
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---

