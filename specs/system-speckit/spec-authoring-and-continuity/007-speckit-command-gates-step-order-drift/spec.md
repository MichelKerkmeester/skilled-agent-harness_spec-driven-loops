---
title: "Feature Specification: Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift"
description: "Phase parent for fixing the /speckit command workflows: verification runs after the work, gates require their artifacts, every mode has a defined contract, and routers, workflows and presentation files state the same facts."
trigger_phrases:
  - "speckit command gates step order drift phase parent spec"
  - "speckit command workflow logic fixes"
  - "speckit workflow gates and step order"
  - "speckit command drift remediation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift"
    last_updated_at: "2026-04-11T00:00:00Z"
    last_updated_by: "template-author"
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

# Feature Specification: Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | None. Top-level packet in the `system-speckit/spec-authoring-and-continuity` track |
| **Parent Packet** | scaffold/007-speckit-command-gates-step-order-drift |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Every child phase is Complete, every finding in the ledger below is closed in its owning phase, and `validate.sh --recursive --strict` prints `RESULT: PASSED` for the parent |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `/speckit:plan`, `/speckit:implement`, `/speckit:complete`, `/speckit:resume`, `/speckit:save`, `/speckit:search` and `/speckit:handoff` commands are executed by AI agents on every runtime, and an agent follows the workflow text literally. A review on 2026-11-14 read all 20 files under `.skilled/commands/speckit/` and found that the text misleads that agent in four ways. Verification steps run before the work they verify. Quality gates add up points, so a run passes with a required file missing. The unattended mode is defined in one workflow and advertised in three, and the autonomous mode still contains stop-and-ask branches. The router, the workflow and the presentation file of one command state different step counts, flags and next steps. The operator pays for this as runs that report success without a real check, runs that hang with nobody to answer, and a resume that can open another session's packet.

### Purpose
An agent that follows any `/speckit` command literally does the work in an order that can succeed, is stopped by a gate whenever a required artifact or check is missing, never waits for an answer in a mode that has no operator, and reads the same facts in the router, the workflow, the presentation file and the README.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reorder the workflow steps so every verification step runs after the work it verifies (phase 1).
- Replace point-scored gates with required checks, and remove checks that no step produces (phase 2).
- Give auto, confirm and autopilot one defined contract in all three lifecycle workflows and their presentation files (phase 3).
- Wire the code review step and reduce plan's three dispatch policies to one (phase 4).
- Make resume find the calling session's packet, and merge its two workflow files into one (phase 5).
- Make save, search and handoff state one contract each (phase 6).
- Extract the blocks repeated across workflows, and remove references to retired mechanisms and unenforceable ceremony (phase 7).
- Align routers, the README, the presentation files and the asset names with the workflows as they stand after phases 1 to 7 (phase 8).

### Findings Ledger

Every finding from the 2026-11-14 review has one owning phase. A phase closes only when each of its findings is fixed or closed by a recorded decision. Lines cited are the lines at review time.

| ID | Finding | Evidence | Phase |
|----|---------|----------|-------|
| L1 | Implement verifies acceptance criteria before development, and no step re-verifies afterwards | `speckit-implement.yaml` `step_4_acceptance_criteria` precedes `step_6_development` | 1 |
| L2 | Complete authors and verifies acceptance criteria in one step, before planning | `speckit-complete.yaml` `step_5_acceptance_criteria` | 1 |
| L3 | Implement checks for open design choices after task breakdown and analysis | `speckit-implement.yaml` `step_5_implementation_check` | 1 |
| L4 | Complete's exit gate sits after step 12 and scores the save that step 13 performs | `speckit-complete.yaml` `quality_gates.post_execution` | 1 |
| L5 | Plan's exit gate sits after step 7, the closing step, while its planning gate sits after step 5. The exit gate checks nothing step 7 adds | `speckit-plan.yaml:416` (`quality_gates.post_execution`) and `:462` (`planning_gate`) | 1 |
| L6 | The spec folder is created or verified in four places: phase decomposition P3, the intake branch, step 1 and step 3 | `speckit-plan.yaml` `optional_workflows`, `step_0.5`, `step_1`, `step_3` | 1 |
| L7 | Phase decomposition estimates size before any analysis, defaults to three phases at level 3+ and plans only the first child | `speckit-plan.yaml` `optional_workflows.phase_decomposition` | 1 |
| G1 | Point scoring lets a gate pass with a required artifact missing | `speckit-complete.yaml` `planning_gate`: threshold 70, `spec_exists` 20 | 2 |
| G2 | The planning gate scores `review_approval` and `checklist_verified`, which no step produces | `speckit-complete.yaml:516-517` | 2 |
| G3 | `tasks_exists` is scored by plan, which never writes `tasks.md`. An unfilled scaffold satisfies it | `speckit-plan.yaml:422` | 2 |
| G4 | Plan's exit gate has 85 points available against a threshold of 70 | `speckit-plan.yaml` `quality_gates.post_execution` | 2 |
| G5 | Implement step 1 requires `tasks.md` before step 2 creates it | `speckit-implement.yaml:477` | 2 |
| G6 | The consistency analysis step has no failure branch | `speckit-implement.yaml` `step_3_analysis`, `speckit-complete.yaml` `step_8_analysis` | 2 |
| G7 | Plan's entry gate passes without a feature description | `speckit-plan.yaml` `quality_gates.pre_execution` | 2 |
| M1 | Autopilot is defined only in complete. Plan and implement accept it and define nothing | `speckit-plan.yaml:18-20`, `speckit-implement.yaml:6-8` | 3 |
| M2 | Auto mode keeps stop-and-ask branches that only a dispatched child is exempt from | low-confidence branches, `debug_delegation`, `speckit-implement.yaml` `step_9` | 3 |
| M3 | Autopilot creates a branch and merges on its own, against the sk-git workspace rules in `AGENTS.md` | `speckit-complete.yaml` `step_0_autopilot_envelope`, `step_12_5` | 3 |
| M4 | The rule lists hold `do_not_prompt_for_user_approval` and `get_user_approval_for_p1_deferrals` together, with no mode tag | `rules.ALWAYS` in all three lifecycle workflows | 3 |
| M5 | No presentation file offers autopilot, shows it in a dashboard or prints `SPECKIT_AUTOPILOT_RESULT` | the four lifecycle presentation files | 3 |
| M6 | `--intake-only` has no result block. The only success text claims all steps ran | `speckit-plan-presentation.txt:136` | 3 |
| M7 | The Review and Modify checkpoint options state no loop: what happens after a review or a change | `checkpoint_options.standard` | 3 |
| D1 | Plan carries three dispatch policies: ask first, always dispatch four agents, and unused worker modes | `parallel_dispatch_config`, `step_5_planning`, `multi_agent_config` | 4 |
| D2 | No step dispatches the review agent, although its marker, verdict and blocking rule are configured | `agent_availability.review` in implement and complete | 4 |
| D3 | A pointer names `agent_dispatch.review.standards_contract`. The section is `agent_availability` | `speckit-complete.yaml:1130` | 4 |
| D4 | `multi_agent_config`, `circuit_breaker` agents and `quality_standards` are defined and never referenced by a step | `speckit-complete.yaml` | 4 |
| D5 | Plan step 5 dispatches the context agent on Opus while the persona declares Haiku, and asks for a hypothesis while forbidding conclusions | `speckit-plan.yaml` `inline_parallel_exploration` | 4 |
| D6 | The research agent triggers below 60 percent confidence. The framework's thresholds are 40 and 80 | `speckit-plan.yaml` `agent_availability.deep-research` | 4 |
| D7 | Plan step 5 always writes `research/research.md`, the file `/deep:research` owns (inferred) | `speckit-plan.yaml:758` | 4 |
| R1 | Resume falls back to the most recently modified packet, which can belong to another session. It never reads the session pointer or the handoff notes | `speckit-resume-auto.yaml` `session_detection` | 5 |
| R2 | One detection tier looks up the fixed phrase "resume work session context" | `tier_3_triggers` | 5 |
| R3 | Resume routes to a semantic or MCP fallback and carries MCP rules, while declaring both unavailable | `speckit-resume-auto.yaml:154`, `:235`, `:242`, `speckit-resume-presentation.txt:119` | 5 |
| R4 | Resume searches `.opencode/specs/`, which does not exist | `speckit-resume-auto.yaml:57` | 5 |
| R5 | The auto and confirm workflows are two files that share about half their lines and have drifted | `after_step: 4` against `after_step: 5` | 5 |
| R6 | The phase redirect reads a "telemetry store" and never says where it is. The store exists as `access-telemetry.json` | `speckit-resume-auto.yaml:82` | 5 |
| R7 | The start-new target is `/speckit:complete` in the prompt and `/speckit:plan` in the README | `speckit-resume-presentation.txt:47`, `README.txt:378` | 5 |
| R8 | A handover older than 24 hours is skipped even when nothing newer exists (inferred) | `memory_loading.behavior` | 5 |
| R9 | `--no-redirect` and `--phase-folder` have no flag table in the resume router | `resume.md:32` | 5 |
| S1 | The save tail says nothing runs after the writer, then tells the agent to regenerate metadata | `speckit-save-context-tail.yaml:17,19` | 6 |
| S2 | The tail's first key is named for an indexing handoff that no longer exists | `pre_index_instruction` | 6 |
| S3 | The save presentation shows a trigger editor keyed by a record number. No step runs it | `save-presentation.txt` section 4 | 6 |
| S4 | The writer is invoked with three argument shapes. The lifecycle shape omits `--full-auto`, so those saves write no continuity fields | `save.md:19`, tail `:16`, `handoff.md:83` | 6 |
| S5 | `save.md` lists `dsh` as a runtime and `handoff.md` does not. Both match their scripts, and neither says why they differ | `save.md:23`, `handoff.md:169` | 6 |
| S6 | The search display has one row shape and cannot render the path-only and count recipes | `search-presentation.txt:85` | 6 |
| S7 | `--limit` exists in the lookup script and the presentation, and the router does not document it | `search.md`, `lookup-trigger-index.mjs:22` | 6 |
| S8 | Exit 2 means both "retry with the raw recipe" and "execution failure" | `search.md:108`, `:120` | 6 |
| S9 | The save plan promises blockers and advisories that the display has no rows for | `save.md:18`, `save-presentation.txt:24-27` | 6 |
| S10 | The save display offers follow-ups the writer already performs, and has no full-auto result block | `save-presentation.txt:33` | 6 |
| S11 | Handoff inlines its operator text and restates the STATUS line in several places, one variant short | `handoff.md:41`, `:88`, `:182` | 6 |
| S12 | The tail makes two uppercase anchors mandatory. Neither `save.md` nor its presentation mentions it, and the ids it shows fail the corpus anchor rule | `speckit-save-context-tail.yaml:22-23` | 6 |
| S13 | The save step is defined three ways: complete and implement inline the writer and also cite the tail, plan cites only the tail | `speckit-complete.yaml:1327`, `speckit-implement.yaml:745` | 6 |
| S14 | Implement saves at three moments, and plan, implement and complete each end with a step that only offers a second save | `step_6_5`, `step_8`, `step_9` and the closing steps | 6 |
| B1 | The 71-line `goal_prompting` block is identical in all three lifecycle workflows | byte-identical under `diff` | 7 |
| B2 | `phase_decomposition`, `checkpoint_options.standard` and `documentation_levels` repeat across the workflows, and two of them have drifted | per-block diffs in the phase 7 spec | 7 |
| B3 | Implement puts prose in `when:` and lacks the predicate grammar header | `speckit-implement.yaml:748` | 7 |
| B4 | The goal block names `bin/goal.cjs`, which does not exist | `speckit-complete.yaml:236` and the same line in plan and implement | 7 |
| B5 | `check-prerequisites.sh` is cited by bare name five times | lives under `runtime/cli/setup/` | 7 |
| B6 | Complete points at `.opencode/specs/` | `speckit-complete.yaml:477`, `:1130` | 7 |
| B7 | Retired memory vocabulary remains: `memory_saved`, `memory_action: save` | `speckit-complete.yaml:528`, `speckit-implement.yaml:664` | 7 |
| B8 | No workflow step sends the preflight and postflight self-scores to anything that reads them, and the steps differ between complete and implement | `step_9_5`, `step_11_5`, `step_5_5`, `step_7_5` | 7 |
| B9 | Timers an agent cannot keep: circuit breaker recovery, the 10-minute timebox, the session preference lifetime | `circuit_breaker`, `confidence_framework.escalation`, `parallel_dispatch_config` | 7 |
| B10 | Several references are bare or relative and do not resolve as written | `prevent-overengineering.md`, the sk-create-goal references, `../deep/assets/` | 7 |
| B11 | Blocks of prose change no behavior and cost every run its reading | `planning_philosophy`, `autonomous_execution`, comment banners | 7 |
| A1 | Step counts disagree between router, workflow, presentation and README | plan 8 against 7, complete "14+" against 14 | 8 |
| A2 | The README invocation column omits autopilot and several flags | `README.txt:82-88` | 8 |
| A3 | The README tree omits the four lifecycle presentation files | `README.txt:142-150` | 8 |
| A4 | The README promises two additional flags and lists one | `README.txt:241-245` | 8 |
| A5 | Examples use a command-name suffix no router parses | `README.txt:272`, `speckit-plan.yaml` `termination.next_steps` | 8 |
| A6 | Two assets lack the `speckit-` prefix the others carry | `save-presentation.txt`, `search-presentation.txt` | 8 |
| A7 | The four lifecycle presentation files repeat the same preamble, fail-fast block, failure template and closing line | DeepSeek run B | 8 |
| A8 | Setup question Q1 packs five alternatives into option C and gives option D no stated consequence | `speckit-plan-presentation.txt:73` | 8 |
| A9 | The README command table must keep exactly one row per router. The review wrongly reported the `/speckit:handoff` row missing. It is at line 91 | `README.txt:80-91` | 8 |
| X1 | Complete and implement carry ask-first parallel checks with no mode tag, found during authoring | complete steps 3, 8 and 10, implement step 6 | 3 |
| X2 | Setup question Q3 `dispatch_mode` has no reader in any workflow, found during authoring | the lifecycle presentation files | 8 |
| X3 | `memory_choice` in the lifecycle presentation files is retired vocabulary, found during authoring | the four lifecycle presentation files | 8 |
| A10 | Plan's success text lists `tasks.md` and `acceptance-criteria.md` as artifacts plan does not write | `speckit-plan-presentation.txt:137` | 8 |

### Out of Scope
- Changes to the scripts the workflows call, such as `validate.sh`, `create.sh` and `generate-context.js`. The workflows are corrected to match the scripts, not the reverse. A phase that finds a script defect records it as an open question.
- The `/deep:*`, `/create:*`, `/doctor:*` and `/design:*` command groups.
- New capabilities. Every change here corrects, removes or relocates something that exists.
- Three review items that were checked and judged intentional: implement's full-workspace edit scope, the empty `level_3_required` list and the `approvals: none` base wording that `mode_overrides.confirm` replaces.

### Files to Change
All paths are under `.skilled/commands/speckit/`. Per-phase detail lives in each child's `plan.md`.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `assets/speckit-implement.yaml` | Modify | 1, 2, 3, 4, 6, 7 | Step order, gates, modes, review step, save step, shared blocks |
| `assets/speckit-complete.yaml` | Modify | 1, 2, 3, 4, 6, 7 | Step order, gates, autopilot, review step, save step, shared blocks |
| `assets/speckit-plan.yaml` | Modify | 1, 2, 3, 4, 6, 7 | Gate location, gates, modes, dispatch policy, closing step, shared blocks |
| `assets/speckit-resume-auto.yaml`, `assets/speckit-resume-confirm.yaml` | Modify, then merge into one | 5 | Detection, retired fallbacks, one workflow for both modes |
| `assets/speckit-save-context-tail.yaml` | Modify | 6 | One writer contract |
| `assets/*-presentation.txt` | Modify | 3, 5, 6, 8 | Mode text, result blocks, displays, shared text |
| `plan.md`, `implement.md`, `complete.md`, `resume.md`, `save.md`, `search.md`, `handoff.md` | Modify | 3, 5, 6, 8 | Flag tables, writer invocation, step counts |
| `README.txt` | Modify | 8 | Command table, tree, examples |
| The three lifecycle workflow files | Modify | 8 | Step counts, examples and the skip option, after phases 1 to 7 |
| Files outside `.skilled/commands/speckit/` that name these assets or assert their text: `command-metadata.json`, `command-contract.json`, the workflow and goal-offer contract tests, the autopilot contract test, `boolean-expr.test.ts`, the feature catalog and playbook pages, three sk-create-command files | Modify | 3, 5, 6, 7, 8 | Each phase lists its own. Without these edits the existing tests fail or the docs describe the old behavior |
| One shared lifecycle include under `assets/` | Create | 7 | Holds the blocks that are identical in three workflows today. Without it each copy drifts, as `phase_decomposition` and `documentation_levels` already have |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-step-order-acceptance-after-development/ | Every verification step runs after the work it verifies, and each gate sits where its checks can be true | Complete |
| 2 | 002-required-artifact-gates/ | Gates require their artifacts and checks. No points, and no check without a step behind it | Complete |
| 3 | 003-execution-mode-and-autopilot-contract/ | Auto, confirm and autopilot each have one contract in all three lifecycle workflows and their presentation files | Complete |
| 4 | 004-code-review-and-dispatch-policy/ | The code review step is dispatched, and plan has one dispatch policy | Pending |
| 5 | 005-resume-detection-and-single-workflow/ | Resume opens the calling session's packet and runs from one workflow file | Pending |
| 6 | 006-save-search-handoff-contracts/ | Save, search and handoff each state one contract | Pending |
| 7 | 007-shared-blocks-and-retired-mechanisms/ | Repeated blocks live once, and retired mechanisms and unenforceable ceremony are gone | Pending |
| 8 | 008-router-readme-presentation-alignment/ | Routers, README, presentation files and asset names match the workflows | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-step-order-acceptance-after-development | 002-required-artifact-gates | Implement and complete run acceptance verification after development, and findings L1 to L7 are closed | Phase 1 `acceptance-criteria.md` has no `Unmet` row |
| 002-required-artifact-gates | 003-execution-mode-and-autopilot-contract | Every gate is a list of required checks and findings G1 to G7 are closed | Phase 2 `acceptance-criteria.md` has no `Unmet` row |
| 003-execution-mode-and-autopilot-contract | 004-code-review-and-dispatch-policy | All three lifecycle workflows define the three modes the same way and findings M1 to M7 are closed | Phase 3 `acceptance-criteria.md` has no `Unmet` row |
| 004-code-review-and-dispatch-policy | 005-resume-detection-and-single-workflow | The review step and the single dispatch policy are in place and findings D1 to D7 are closed | Phase 4 `acceptance-criteria.md` has no `Unmet` row |
| 005-resume-detection-and-single-workflow | 006-save-search-handoff-contracts | One resume workflow exists and findings R1 to R9 are closed | Phase 5 `acceptance-criteria.md` has no `Unmet` row |
| 006-save-search-handoff-contracts | 007-shared-blocks-and-retired-mechanisms | Save, search and handoff contracts are single and findings S1 to S14 are closed | Phase 6 `acceptance-criteria.md` has no `Unmet` row |
| 007-shared-blocks-and-retired-mechanisms | 008-router-readme-presentation-alignment | The workflows have their final step lists and blocks, and findings B1 to B11 are closed | Phase 7 `acceptance-criteria.md` has no `Unmet` row |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

None open. The operator answered on 2026-11-14 and asked for no further questions, so the remaining items took their recommended default.

Operator decisions:
- Phases may edit the tests and docs outside `.skilled/commands/speckit/` that assert the current text. Each phase updates the ones it invalidates.
- Autopilot stops at a verified branch. It never merges or pushes (finding M3).
- Lifecycle saves pass `--full-auto` to the continuity writer (finding S4).
- Under auto and autopilot an unfinished P1 item fails the run (finding M4).
- `/speckit:plan` writes `tasks.md` in a task breakdown step of its own, and its exit gate requires a filled file (finding G3).
- Preflight and postflight scoring is removed (finding B8). The operator asked which choice gives the better result. Removal does: nothing reads the scores, so the result of a run is the same, and each run loses two steps and two checkpoints.
- The closing step that only offers a second save is removed from plan, implement and complete (finding S14).
- The asset names `save-presentation.txt` and `search-presentation.txt` stay. Finding A6 closes as intentional.

Defaults taken without a question, each recorded in its phase:
- CRITICAL and HIGH analysis findings block a run (phase 2).
- Auto keeps the ask at confidence below 40 percent (phase 3).
- Plan and complete name the remaining phase children at termination and do not loop over them (phase 1).
- Two script defects are follow-ups outside this packet: relaunch has no `dsh` runtime, and `rg-wrapper.mjs` does not accept `--` (phase 6).

Standing notes:
- Phases 1 and 2 both require `checklist_verified` to leave implement's entry gate. Phase 1 owns the edit and phase 2 verifies the same final state.
- Phase 1 moves complete's late autopilot step to `step_13_5_autopilot_archive_verify_merge`. Phase 3, which runs later, renames that key to `step_13_5_autopilot_archive_verify` when it removes the merge.
- Findings X1, X2 and X3 were found while the phases were authored. Phase 3 owns X1 and phase 8 owns X2 and X3.
- `recommend-level.sh` scored this work Level 2 with no phase recommendation (phase score 20, threshold 25). The operator asked for a phased packet on 2026-11-14, so the children are Level 2 phases by instruction.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
