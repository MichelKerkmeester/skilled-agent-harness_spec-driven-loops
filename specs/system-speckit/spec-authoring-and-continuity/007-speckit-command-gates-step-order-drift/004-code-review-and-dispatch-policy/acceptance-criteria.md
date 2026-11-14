---
title: "Acceptance Criteria: Phase 4: code-review-and-dispatch-policy"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "code review and dispatch policy acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/004-code-review-and-dispatch-policy"
    last_updated_at: "2026-11-14T11:33:21Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion verified at a60db6556f"
    next_safe_action: "None. The packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-004-code-review-and-dispatch-policy"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 4: code-review-and-dispatch-policy

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** 004-code-review-and-dispatch-policy
**Level:** 2
**Status:** Complete
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given an implement or complete run that finished development, When it reaches the step `agent_availability.review.available_at_step` names, Then that step dispatches `@review` with `CODE-REVIEW` as the first prompt line | `awk '/^workflow:/{w=1} w && /CODE-REVIEW/{n++} END{print n+0}' .skilled/commands/speckit/assets/speckit-implement.yaml` prints 1 or more, and the same command on `.skilled/commands/speckit/assets/speckit-complete.yaml` prints 1 or more. Observed at `a60db6556f`: the counter prints 1 on implement and 1 on complete. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:738 | Met | - |
| AC-002 | REQ-002 | Given `@review` returns `REQUESTED_CHANGES`, When the step reads the verdict, Then no `implementation-summary.md` is written, the run returns to development once and a second FAIL halts with the findings | `awk '/^workflow:/{w=1} w && /REQUESTED_CHANGES/{n++} END{print n+0}' .skilled/commands/speckit/assets/speckit-implement.yaml` prints 1 or more, the same on `.skilled/commands/speckit/assets/speckit-complete.yaml` prints 1 or more, and `rg -n dual_phase .skilled/commands/speckit/assets/` prints nothing. Observed at `a60db6556f`: the counter prints 4 on implement and 4 on complete, and the `dual_phase` search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-implement.yaml:749 | Met | - |
| AC-003 | REQ-003 | Given a plan run in any mode, When it reaches agent dispatch, Then it follows only `step_5_planning` and asks no dispatch question | `rg -n -e parallel_dispatch_config -e multi_agent_config -e pre_phase_parallel_check -e session_preference_s .skilled/commands/speckit/assets/speckit-plan.yaml` prints nothing and `rg -c 'subagent_type: context' .skilled/commands/speckit/assets/speckit-plan.yaml` prints 1. Observed at `a60db6556f`: the key search prints nothing and the count prints 1. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:692 | Met | - |
| AC-004 | REQ-004 | Given a spec folder that holds a `/deep:research` synthesis, When plan or complete runs its planning step, Then `research/research.md` is not written | `rg -n -e 'Generate research/research' -e 'research/research.md: resolved_unknowns' -e 'outputs: \[plan.md, research/research.md\]' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing. Observed at `a60db6556f`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:927 | Met | - |
| AC-005 | REQ-005 | Given complete `step_10_development`, When the agent follows its standards pointer, Then the pointer names a section that exists | `rg -n 'agent_dispatch.review' .skilled/commands/speckit/assets/` prints nothing and `rg -c 'agent_availability.review.standards_contract' .skilled/commands/speckit/assets/speckit-complete.yaml` prints 1. Observed at `a60db6556f`: the `agent_dispatch.review` search prints nothing and the count prints 1. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:1110 | Met | - |
| AC-006 | REQ-006 | Given implement and complete, When the agent reads their top-level config, Then no block remains that no step reads | `rg -n -e '^multi_agent_config:' -e '^quality_standards:' -e '^  agents: ' .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-implement.yaml` prints nothing. Observed at `a60db6556f`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:525 | Met | - |
| AC-007 | REQ-007 | Given plan or complete dispatches `@context`, When the runtime picks the model, Then it uses the `model: haiku` that `.claude/agents/context.md` declares | `rg -n 'subagent_type: context' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints two lines and `rg -n 'subagent_type: context.*model:' .skilled/commands/speckit/assets/` prints nothing. Observed at `a60db6556f`: two lines, one per file, and the model search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:876 | Met | - |
| AC-008 | REQ-008 | Given an explorer prompt in plan or complete, When `@context` reads it, Then it asks for findings with paths and lines and names no tool the agent lacks | `rg -n -e 'Query Code Graph' -e hypothesis .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing. Observed at `a60db6556f`: the search prints nothing. Evidence: .skilled/commands/speckit/assets/speckit-plan.yaml:710 | Met | - |
| AC-009 | REQ-009 | Given a planning confidence of 50 percent and no `:with-research` flag, When plan or complete checks the research trigger, Then research is not dispatched because the trigger is below 40 percent | `rg -n -e 'confidence < 60' -e 'confidence_score < 60' .skilled/commands/speckit/assets/` prints nothing and `rg -n -e 'confidence < 40' -e 'confidence_score < 40' .skilled/commands/speckit/assets/` prints one line in plan and three in complete. Observed at `a60db6556f`: the below 60 search prints nothing, and the below 40 search prints one line in plan and three in complete. Evidence: .skilled/commands/speckit/assets/speckit-complete.yaml:748 | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT
<!-- FILL: Write Yes or No and one sentence. Name a criterion by its id only when it blocks closure. Never write a count of criteria or an id range, because every added row makes it wrong. GOOD: No. AC-002 is unmet. WEAK: All eight criteria AC-001 to AC-008 are met. -->

**Closeable:** Yes

Yes. Every criterion is Met with output observed at commit `a60db6556f`.
<!-- /ANCHOR:closure -->
