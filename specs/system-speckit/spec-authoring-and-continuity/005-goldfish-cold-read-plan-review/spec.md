---
title: "Feature Specification: Fresh-context plan checks and chat-path workflow guards: research plus the builds its confirmed recommendations need"
description: "Research and staged changes address gaps in fresh-context plan review, one-lineage deep-loop routing and chat access to SpecKit authoring guidance."
trigger_phrases:
  - "goldfish cold read plan review phase parent spec"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review"
    last_updated_at: "2026-11-11T21:06:04Z"
    last_updated_by: "template-author"
    recent_action: "Initialize phase-parent continuity block"
    next_safe_action: "Plan or resume a child phase folder"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-goldfish-cold-read-plan-review"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.2 -->

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

# Feature Specification: Fresh-context plan checks and chat-path workflow guards: research plus the builds its confirmed recommendations need

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-11 |
| **Branch** | main |
| **Parent Spec** | None |
| **Parent Packet** | None (track folder: specs/system-speckit/spec-authoring-and-continuity/) |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | Each child phase passes its handoff checks in sequence, the scoped workflow checks for Phase 6 pass, and strict recursive validation of the parent reports RESULT: PASSED. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
SpecKit planning can let the same session write and judge a plan, while a chat-started deep loop can bypass the workflow steps that enforce it. The command policy also sends one-lineage executor matrices to fan-out, and a plain chat write can miss the authoring card and its guidance.

### Purpose
Use the research and the five follow-on phases to make plan checks easier for a fresh reader to apply, route one-lineage deep-loop requests through the intended path, protect direct fan-out calls, make plan phases name their files, surface the authoring card in chat workflows, and define clear SpecKit workflow gates.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. All detailed planning, task breakdowns, checklists, and decisions live in the child phase folders listed in the Phase Documentation Map below. This keeps the parent from drifting stale as phases execute and pivot.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record the research on fresh-context cold reads, decision-free readiness checks, where those checks fit, and which model elements to leave out.
- Route a matrix that expands to one lineage through the single-executor path, keep fan-out for two or more lineages, and add an explicit guard for direct one-lineage research or review fan-out.
- Name target files in plan phase examples and keep the plan template, authoring card, skill guidance, and generated snapshots aligned.
- Check from the files that each carrier reaches a session that types no command, then surface the authoring card through existing scaffold output, the first-mutation notice, and the system-spec-kit router.
- Define the existing SpecKit workflow checks and stops for plan clarity, unresolved design choices, failed tests, technical approach, and repeated clarification passes.

### Out of Scope
- Add a new single-executor runner, command, agent, hook, schema, or workflow file.
- Refuse two-lineage or larger fan-out runs. The known count-based bypass remains outside this decomposition.
- Change the task-line Verify contract or add a Verify requirement to plan phase lines.
- Extend AGENTS.md for the separate Devin file-size issue.
- Remove the quality_gates or circuit_breaker blocks, or default_level: level_2, until the open operator decisions are resolved.

### Files to Change

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps/research/research.md | Create | 001 research | Synthesize the research findings and recommendation. |
| .skilled/commands/deep/research.md | Modify | 002 executor routing | Correct the one-lineage and multi-lineage policy. |
| .skilled/commands/deep/review.md | Modify | 002 executor routing | Correct the one-lineage and multi-lineage policy. |
| .skilled/commands/deep/assets/deep-research-presentation.txt | Modify | 002 executor routing | Align the research presentation policy. |
| .skilled/commands/deep/assets/deep-review-presentation.txt | Modify | 002 executor routing | Align the review presentation policy. |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | Modify | 002 executor routing | Correct the one line that restates the default policy. |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | Regenerate | 002 executor routing | Regenerate the research command contract from maintained sources. |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | Regenerate | 002 executor routing | Regenerate the review command contract from maintained sources. |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | Modify | 003 lineage refusal | Register the explicit single-lineage opt-in and refuse unapproved direct runs. |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | Modify | 003 lineage refusal | Cover refusal and opt-in behavior, pass the opt-in from the shared launch helper and in the recorded-run case. |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts | Modify | 003 lineage refusal | Pass the opt-in from the shared one-executor fixture. |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | Modify | 003 lineage refusal | Pass the opt-in to intentional one-lineage stress cases. |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | Modify | 003 lineage refusal | Pass the opt-in to the one-lineage review fixture. |
| .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md | Modify | 003 lineage refusal | Update the intentional direct-run procedure. |
| .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | Modify | 004 plan file naming | Name a file in each phase example. |
| .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md | Modify | 004 plan file naming | Align the authoring-card phase example. |
| .skilled/skills/system-spec-kit/SKILL.md | Modify | 004 plan file naming | Scope the card entry sentence to plan and implement requests. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | Modify | 004 plan file naming | Regenerate the plan-example snapshots. |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | Modify | 005 chat authoring path | Add the authoring-card path to standard and phase scaffold next steps. |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | Modify | 005 chat authoring path | Make both scaffold helpers fail when the card path is missing from the output. |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | Modify | 005 chat authoring path | Add the card pointer to the first-mutation notice. |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | Modify | 005 chat authoring path | Update the mutation-notice expectation. |
| .skilled/skills/system-spec-kit/ROUTER.md | Modify | 005 chat authoring path | Add six write verbs to the IMPLEMENT keyword row and to the prose list of the same keywords; phase 007 moved them to a WRITE intent at weight 1. |
| .skilled/commands/speckit/assets/speckit-implement.yaml | Modify | 006 workflow gates | Define plan clarity and add design-choice and test-failure stops. |
| .skilled/commands/speckit/assets/speckit-complete.yaml | Modify | 006 workflow gates | Require a technical approach at the phase gate. |
| .skilled/commands/speckit/assets/speckit-plan.yaml | Modify | 006 workflow gates | Clarify that clarification markers are resolved in repeated batches. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-research-egm-checks-and-chat-path-gaps/ | Research only: record fresh-context evidence, check placement, level fit, exclusions, and chat-path gaps. | Complete |
| 2 | 002-bind-single-entry-executors-to-single-path/ | Route one-lineage matrices to config.executor, preserve fan-out routing for two or more, refresh both compiled contracts, and record the council-contract drift fix. | Complete |
| 3 | 003-refuse-single-lineage-fanout-run/ | Refuse direct one-lineage research or review fan-out without explicit opt-in and update intentional callers. | Complete |
| 4 | 004-name-file-in-plan-phase-lines/ | Name target files in plan phase examples and align the card, skill entry, and generated snapshots. | Complete |
| 5 | 005-point-chat-sessions-at-authoring-card/ | Check each carrier's reach from its files, then point scaffold output, the mutation notice, and the router's write route at the authoring card. | Complete |
| 6 | 006-repair-speckit-workflow-gates/ | Define plan clarity, design-choice and test-failure stops, the technical-approach gate, and repeated clarification passes. | Complete |
| 7 | 007-fix-deep-review-p2-findings-for-plan-check-builds/ | Reconcile the deep-review P2 findings, verify path trust boundaries, and regenerate and test maintained command contracts. | Complete |

### Phase Transition Rules

- Each child phase MUST pass strict validation before the next phase begins.
- The parent map tracks aggregate progress. Phases 1 through 7 are Complete.
- Every phase is Complete. Resume follow-up work with /speckit:resume specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/, or pass a child's full folder path.
- Run strict recursive validation on the parent after all child phases are complete.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-research-egm-checks-and-chat-path-gaps | 002-bind-single-entry-executors-to-single-path | The research recommendation and trust-check notes are recorded, and the Phase 2 policy scope matches the source evidence. | Compare the research report and trust checks with the Phase 2 spec, then inspect the referenced command policy and workflow lines. |
| 002-bind-single-entry-executors-to-single-path | 003-refuse-single-lineage-fanout-run | The normal command policy routes one expanded lineage to config.executor and reserves config.fanout for two or more lineages. The compiled research and review contracts match the maintained sources. | Run the Phase 2 audit over the four maintained policy sources, the feature catalog entry and both generated contracts, then confirm strict validation passes for Phase 2. |
| 003-refuse-single-lineage-fanout-run | 004-name-file-in-plan-phase-lines | Direct one-lineage research and review runs stop before side effects without explicit opt-in, and intentional direct callers use the opt-in. | Run the focused refusal and opt-in checks, the listed timestamp and adapter stress checks, and strict validation for Phase 3. |
| 004-name-file-in-plan-phase-lines | 005-point-chat-sessions-at-authoring-card | The template and card examples name their target file, the skill entry is scoped to plan and implement requests, and the generated snapshots match. | Run the focused snapshot check without update mode and strict validation for Phase 4. |
| 005-point-chat-sessions-at-authoring-card | 006-repair-speckit-workflow-gates | Each carrier's reach is checked from its files before its edit, the advisor result for a plain write is recorded, and the three carrier checks pass. | Run the three reach checks, the focused scaffold and spec-gate tests and the router keyword probe, and confirm strict validation passes for Phase 5. |
| 006-repair-speckit-workflow-gates | Parent closure | The five scoped workflow corrections meet their acceptance criteria. The pending removal questions remain out of scope unless the operator decides otherwise. | Run the focused workflow checks and strict validation for Phase 6, then strict recursive validation of the parent. |
| 006-repair-speckit-workflow-gates | 007-fix-deep-review-p2-findings-for-plan-check-builds | Phases 2 through 6 are built and the five-iteration deep review report exists with its findings registry. | Read `review/review-report.md` sections 3 and 8, then run the Phase 7 suites and strict validation for Phase 7. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- UNKNOWN: Does a cold read of a finished packet predict the deviations its implementation summary records? No run has measured this. A later research packet must compare cold-read findings with completed summaries.
- Should a planning step dispatch a fresh-context reader or only prompt for one? The choice changes workflow contracts and needs a decision record.
- UNKNOWN: Does a live natural-language write session open system-spec-kit and load the authoring card? The skill advisor does not recommend system-spec-kit for a plain write, measured in Phase 5's spec. No phase measures a live session; that needs a traced chat run in its own packet.
- UNKNOWN: How often does a chat-started loop bypass its workflow through routes other than fanout-run.cjs? The research did not measure those routes.
- Should Phase 6 remove the quality_gates and circuit_breaker blocks or default_level: level_2 from the workflow assets? Phase 6 leaves them unchanged pending the operator decision.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See the seven numbered child folders under specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/ for per-phase specs, plans, and tasks.
- **Parent Spec**: None. This phase parent sits under the sub-track folder specs/system-speckit/spec-authoring-and-continuity/.
- **Graph Metadata**: See graph-metadata.json for the derived.last_active_child_id pointer.

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- The map includes all seven child folders and marks each Complete once its own acceptance criteria are Met.
- The parent identifies each in-scope outcome and preserves the known exclusions and operator decisions.
- Each phase transition names evidence that must be present and a verification that must pass before the next phase or parent closure.
<!-- /ANCHOR:requirements -->
