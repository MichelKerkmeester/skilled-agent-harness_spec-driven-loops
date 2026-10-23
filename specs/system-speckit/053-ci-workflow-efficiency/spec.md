---
title: "Feature Specification: CI workflow efficiency, speed and operator control"
description: "Phased packet to cut the CI load of the 33 GitHub Actions workflows, give clones an on/off control, and add a /doctor:ci command and an sk-code-ci standard. Phase 001 is the research; 002-009 are the planned implementation phases."
trigger_phrases:
  - "ci workflow efficiency phase parent spec"
  - "053 ci workflow efficiency"
  - "github actions efficiency packet"
  - "doctor ci and sk-code-ci packet"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/053-ci-workflow-efficiency"
    last_updated_at: "2026-10-23T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Planned phases 002-009 from the final review"
    next_safe_action: "Operator decides D1, then implement 002-rebuild-fanout-removal"
    blockers: []
    key_files:
      - "001-research/research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-10-23-053-ci-workflow-efficiency"
      parent_session_id: null
    completion_pct: 13
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: CI workflow efficiency, speed and operator control

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | In Progress |
| **Created** | 2026-10-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each phase validates strict on its own; the research phase's `research.md` is the plan the implementation phases follow |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repository's 33 workflows spend about 3,812 runner-minutes a day. More than half comes from a bot commit that re-runs 13 workflows on files they never read, and nothing is cached. Almost nothing cancels superseded runs, and one serial test project sets the wall-clock tail. A clone of the repo cannot switch workflows off without editing YAML, and the rules for writing a workflow are scattered and mostly unenforced.

### Purpose
Cut the CI load and the time to a signal, give base repos and clones an on/off control that defaults to everything on, and give workflow authoring one standard (`sk-code-ci`) and one operator command (`/doctor:ci`).

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Measuring CI cost and designing the fixes (phase 001, complete).
- Trigger and path-filter changes, caching and provisioning dedupe, slow and failing suites.
- A `vars.*` on/off control, workflow hygiene (timeouts, permissions), and a consolidation decision.
- The `sk-code-ci` standards surface and the `/doctor:ci` command.

### Out of Scope
- Moving CI off GitHub Actions or onto self-hosted runners.
- Changing what any check verifies, as distinct from when and how it runs.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `specs/system-speckit/053-ci-workflow-efficiency/001-research/` | Create | 001 | Research run and synthesis |
| `.github/workflows/*.yml`, `.github/workflows/README.md` | Modify | 002, 003, 004, 007, 008 | Rebuild skip, triggers, concurrency, checkout depth, cache adoption, timeouts, permissions, switches, consolidation |
| `.github/scripts/check-gate-inputs.sh` and its fixture test | Modify | 004 | Scan `.github/actions/**` (R12) |
| `.github/actions/setup/action.yml` (composite setup action) | Create | 004 | Shared cached setup |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/trigger-index-rebuild-workflow.vitest.ts` | Modify | 002 | Assert the skip token and the trailer (R2) |
| `.skilled/skills/system-spec-kit/vitest.config.ts` | Modify | 005 | CLI vitest project parallelism or shard (R20) |
| `.skilled/skills/sk-code/` (sk-code-ci surface, hub registration, stack detection) | Create/Modify | 006, 009 | Standards surface, review wiring and the CI surface value |
| `.skilled/commands/doctor/ci.md` and its route assets | Create | 009 | The `/doctor:ci` router |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children. Phase 001 is research; phases 002 onward are the planned implementation phases, each with its own folder.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research/ | Research: 20-iteration measured study and phase plan (`research/research.md`) | Complete |
| 2 | 002-rebuild-fanout-removal/ | Implementation: stop the CI fan-out on trigger-index rebuild commits with a `[skip ci]` token (R1), assert that token in the rebuild workflow's vitest suite (R2), and record the post-change 24 h baseline every later phase measures against | Planned |
| 3 | 003-trigger-and-job-hygiene/ | Implementation: PR-only cancel-in-progress concurrency (R3), a real path filter on command-tree-parity (R4), the changed-packet-validation and pre-commit duplication probes (R5, R11), the dispatch-enforcement-guard dedupe (R6), the double-suppression removal (R7), shallower checkouts (R8), PR-time path filters (R9) and the skill-doc-frontmatter filter gap (R10) | Planned |
| 4 | 004-setup-caching-provisioning/ | Implementation: gate-inputs scanning `.github/actions/**` (R12), the cache probe (R13), the composite setup action (R14), the hooks/plugin workflow merge (R15), npm install dedupe (R16), pip cache (R17) and the sparse-checkout probe (R18) | Planned |
| 5 | 005-slow-and-failing-tests/ | Implementation: the `fileParallelism` probe (R19), the spec-kit CLI vitest project made parallel or sharded (R20), and the re-check and root-cause of the failing workflows (R21) | Planned |
| 6 | 006-sk-code-ci-surface/ | Implementation: the read-only `sk-code-ci` surface packet and its hub registration (R22), plus message-contract's every-branch trigger recorded as an intentional exception (R23) | Planned |
| 7 | 007-workflow-hygiene-on-off-control/ | Implementation: per-job timeouts sized on job samples (R24), least-privilege permissions and the dependabot job split (R25), and the `vars.SKILLED_CI*` on/off switches defaulting on (R26) | Planned |
| 8 | 008-consolidation-decision/ | Implementation: re-measure the always-run workflows after phases 002 to 007 and merge them into one switch group only on an operator yes (R27) | Planned |
| 9 | 009-doctor-ci-review-wiring/ | Implementation: the repository-variable probe (R28), the `/doctor:ci` command with its advisor bridges (R29), and the CI surface value in sk-code's stack detection and review selection (R30) | Planned |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | `research/research.md` sections 14-15 hold the ranked plan, and `final-review.md` reduces the open decisions to D1 as the only blocker | `001-research/acceptance-criteria.md` all Met |
| 002 | 003, 004, 005 | The rebuild commit starts no run (option A) or exactly the rebuild workflow's own run (option B), gate-inputs passes and spec-kit-check is green, so the fresh 24 h snapshot is the baseline every later phase measures against | Three consecutive rebuild SHAs by `gh run list --commit`; `check-gate-inputs.sh` prints `RESULT: PASSED`; `002-rebuild-fanout-removal/scratch/baseline-24h/summary.md` recorded |
| 004 | 006 | The gate-inputs actions scan (R12) and the composite setup action (R14) have landed, so the packet records real patterns rather than proposals | gate-inputs passes with `.github/actions/**` scanned; a warm run's job seconds recorded against the 002 baseline |
| 003, 004, 005, 006 | 007 | The job shapes are final: 003's concurrency and filter edits, 004's composite action and merge, 005's CLI step, and 006's timeout, least-privilege and switch rule data | The seven hooks vitest suites still run; the cold-path run passes; the CLI vitest step is under 400 s; `006-sk-code-ci-surface` passes `validate.sh --strict` |
| 002-007 | 008 | A re-measured after snapshot exists for the nine always-run workflows, and D8 is answered | `008-consolidation-decision/scratch/consolidation-decision.md` carries the before and after numbers; under D8 = no the phase's `.github/workflows` diff is empty |
| 006, 007 | 009 | The `sk-code-ci` packet supplies its rule data and templates, and the six `vars.SKILLED_CI*` names exist in the workflows | `/doctor:ci report` lists all 33 workflows with switch state; `route-validate.sh` and the bridge deriver pass |

### Recommendation Traceability

- R1 (P0): stop the CI fan-out on trigger-index rebuild commits -> 002-rebuild-fanout-removal
- R2 (P1): assert the R1 skip and run that assertion when the workflow changes -> 002-rebuild-fanout-removal
- R3 (P1): concurrency groups with cancel-in-progress on pull requests -> 003-trigger-and-job-hygiene
- R4 (P2): real path filter on command-tree-parity -> 003-trigger-and-job-hygiene
- R5 (P3): optional path filter on changed-packet-validation -> 003-trigger-and-job-hygiene
- R6 (P2): dispatch-enforcement-guard keeps the whole-tree vitest run and drops duplicate work -> 003-trigger-and-job-hygiene
- R7 (P2): remove the double suppression in report-only workflows -> 003-trigger-and-job-hygiene
- R8 (P2): shallow checkout where history is unread -> 003-trigger-and-job-hygiene
- R9 (P3): path filters on the PR-only review-time checks -> 003-trigger-and-job-hygiene
- R10 (P3): skill-doc-frontmatter filters name their own guard and workflow -> 003-trigger-and-job-hygiene
- R11 (P3, probe): inventory CI jobs that duplicate pre-commit hooks -> 003-trigger-and-job-hygiene
- R12 (P1): gate-inputs scans `.github/actions/**` -> 004-setup-caching-provisioning
- R13 (P1, probe): measure cache size, restore throughput and staleness -> 004-setup-caching-provisioning
- R14 (P1): composite setup action with cache, pinned bun setup and cold-path verification -> 004-setup-caching-provisioning
- R15 (P2): merge hooks-node-tests into opencode-plugin-tests -> 004-setup-caching-provisioning
- R16 (P2): npm install dedupe in the multi-install workflows -> 004-setup-caching-provisioning
- R17 (P3): pip cache, only through the composite action -> 004-setup-caching-provisioning
- R18 (P3, probe): partial or sparse checkout for light workflows -> 004-setup-caching-provisioning
- R19 (P1, probe): spec-kit CLI tests under `fileParallelism: true` -> 005-slow-and-failing-tests
- R20 (P1): make spec-kit-check's CLI vitest project parallel, or shard it -> 005-slow-and-failing-tests
- R21 (P2): re-check and root-cause the real failures -> 005-slow-and-failing-tests
- R22 (P2): sk-code-ci surface packet -> 006-sk-code-ci-surface
- R23 (P3): record message-contract's every-branch push trigger as intentional -> 006-sk-code-ci-surface
- R24 (P2): per-job timeouts sized on job execution samples -> 007-workflow-hygiene-on-off-control
- R25 (P2): least-privilege permissions and the dependabot split -> 007-workflow-hygiene-on-off-control
- R26 (P2): CI on/off switches -> 007-workflow-hygiene-on-off-control
- R27 (P3): job consolidation decision gate -> 008-consolidation-decision
- R28 (P2, probe): can the owner's token write repository variables? -> 009-doctor-ci-review-wiring
- R29 (P2): `/doctor:ci` command -> 009-doctor-ci-review-wiring
- R30 (P3): fifth stack-detection surface value for workflow diffs -> 009-doctor-ci-review-wiring

### Operator Decisions

| Decision | Phase folder | Recommended default |
|----------|--------------|---------------------|
| D1: how rebuild commits skip CI | 002-rebuild-fanout-removal | Option A, a `[skip ci]` token in the rebuild commit body; R1's acceptance check proves it on the first three rebuilds |
| D2: cancel-in-progress on main | 003-trigger-and-job-hygiene | Pull requests only; on main it reclaims about 89 wall-min per window after R1 and costs per-commit verdicts |
| D3: command-tree-parity path filter | 003-trigger-and-job-hygiene | Approve R4, worth about 123 runner-min/day after R1 |
| D4: dispatch-enforcement-guard shape | 003-trigger-and-job-hygiene | Keep the two jobs and delete the duplicate `dispatch-audit` step, because the guard is protected and merging renames its checks |
| D5: the hooks-node-tests merge renames a check | 004-setup-caching-provisioning | Approve the R15 merge and the renamed `plugin-and-hook-tests` check |
| D6: timeout floor | 007-workflow-hygiene-on-off-control | 10 minutes, applied uniformly rather than per job |
| D7: deep-loop-runtime `fetch-depth: 2` | 003-trigger-and-job-hygiene | Depth 2, because the mode-event suites need only the parent commit |
| D8: job consolidation after re-measurement | 008-consolidation-decision | No merge; the decision record carries the numbers either way |
| D9: `/doctor:ci` toggle writes variables or prints the command | 009-doctor-ci-review-wiring | Write when the R28 probe exits 0; otherwise print the command |
| D10: changed-packet-validation filter | 003-trigger-and-job-hygiene | Skip it, because 33 of 38 human pushes touch `specs/` and it is worth about 10 runner-min/day |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Are the spec-kit CLI tests safe under `fileParallelism: true`, or does phase 005 need sharding?
- Can the owner's token write repository variables, so that `/doctor:ci` toggle writes rather than prints?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Research**: `001-research/research/research.md`
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
