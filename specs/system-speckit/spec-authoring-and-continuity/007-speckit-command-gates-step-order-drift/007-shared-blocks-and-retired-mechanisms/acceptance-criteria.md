---
title: "Acceptance Criteria: Phase 7: shared-blocks-and-retired-mechanisms"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "shared blocks and retired mechanisms acceptance criteria"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/007-speckit-command-gates-step-order-drift/007-shared-blocks-and-retired-mechanisms"
    last_updated_at: "2026-11-14T11:33:25Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-shared-blocks-and-retired-mechanisms"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.4 -->
# Acceptance Criteria: Phase 7: shared-blocks-and-retired-mechanisms

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill the packet id, the level, the status and the date. GOOD: `004-rotate-logs-keep`. Level 1. Draft. 2026-10-24. WEAK: Packet TBD. -->

**Packet:** `007-shared-blocks-and-retired-mechanisms`
**Level:** 2
**Status:** Draft
**Date:** 2026-11-14
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA
<!-- FILL: Write one row per requirement. The Then clause names a command. GOOD: AC-001: When `--keep 3` runs, Then `ls logs/archive | wc -l` prints 3. WEAK: The feature works. -->

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it. A new row takes the highest AC-ID plus one.

`A` is `.skilled/commands/speckit/assets` and `W` is `$A/speckit-plan.yaml $A/speckit-implement.yaml $A/speckit-complete.yaml`. Run every command from the repository root.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the lifecycle workflows and the include after this phase, When an agent reads a goal script command, Then it names `.skilled/hooks/goal/bin/goal.cjs` | `rg -n '[^/]bin/goal\.cjs' $A` prints nothing | Unmet | - |
| AC-002 | REQ-002 | Given implement, plan or complete, When a step runs the prerequisites script, Then it names `.skilled/skills/system-spec-kit/runtime/cli/setup/check-prerequisites.sh` | `rg -n '[^/]check-prerequisites\.sh' $W` prints nothing | Unmet | - |
| AC-003 | REQ-003 | Given `speckit-complete.yaml`, When the authoring-time load decides which targets need the authoring card, Then it names `specs/` and never `.opencode/specs/` | `rg -n '\.opencode/specs' $A/speckit-complete.yaml` prints nothing | Unmet | - |
| AC-004 | REQ-004 | Given the three lifecycle workflows, When an agent looks for the goal contract, Then each workflow's `goal_prompting` key points at the include and the include holds `packet_goal` once | `rg -n '^  packet_goal:' $W` prints nothing, `rg -c '^  packet_goal:' $A/speckit-lifecycle-shared.yaml` prints 1 and `rg -c '#goal_prompting"' <file>` prints 1 for each file in `W` | Unmet | - |
| AC-005 | REQ-005 | Given the checkpoint options, documentation levels and phase decomposition, When an agent reads any of them from any lifecycle workflow, Then it reads the one copy in the include with the `LOC` unit and one first-child prompt | `rg -n 'loc_guidance' $W $A/speckit-lifecycle-shared.yaml` prints three lines, all in the include and all ending `LOC"`. `rg -n '^  standard:' $W` prints nothing. `rg -n -e 'Continue planning first child' -e 'Continue with first child' $W $A/speckit-lifecycle-shared.yaml` prints at most one line, in the include | Unmet | - |
| AC-006 | REQ-006 | Given the plan, implement and complete routers, When an agent reads Owned Assets, Then the include is listed beside the save tail | `rg -c 'speckit-lifecycle-shared\.yaml' .skilled/commands/speckit/plan.md .skilled/commands/speckit/implement.md .skilled/commands/speckit/complete.md` prints 1 for each file | Unmet | - |
| AC-007 | REQ-007 | Given the goal block moved to the include, When the goal offer contract test runs, Then it pins `packet_goal` in the include and passes | `node --test .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` exits 0 and prints `ℹ fail 0`, and `rg -c 'speckit-lifecycle-shared\.yaml' .opencode/plugins/tests/speckit-goal-offer-contract.test.cjs` prints a number above 0 | Unmet | - |
| AC-008 | REQ-008 | Given the Claude Code goal-hook playbook, When a tester follows its source table, Then it names the include for `goal_prompting.set_mutation.dispatch_by_runtime` and `packet_goal.bind_by_runtime` | `rg -n 'speckit-lifecycle-shared\.yaml' .skilled/skills/cli-external-orchestration/cli-claude-code/manual-testing-playbook/goal-hook/goal-hook.md` prints the lines that name those keys | Unmet | - |
| AC-009 | REQ-009 | Given any `when:` in the lifecycle workflows or the include, When an agent evaluates it, Then it is a typed predicate under the one `predicate_grammar` in the include | `rg -n 'when: "' $W $A/speckit-lifecycle-shared.yaml` prints nothing. `rg -c '#predicate_grammar"' <file>` prints 1 for each file in `W`. `rg -n 'YAML PREDICATE GRAMMAR CONTRACT' $W` prints nothing | Unmet | - |
| AC-010 | REQ-010 | Given the lifecycle workflows, When an agent reads a save step or save check, Then it reads `continuity` wording and no retired memory key | `rg -n -e memory_saved -e memory_action $W` prints nothing | Unmet | - |
| AC-011 | REQ-011 | Given implement and complete, When either runs, Then no step captures preflight or postflight scores and every `checkpoints:` entry names a real step | `rg -n -i -e preflight -e postflight -e 'learning.index' $W` prints nothing, and `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` exits 0 and prints `failed=0` | Unmet | - |
| AC-012 | REQ-012 | Given the lifecycle workflows, When a breaker or escalation can fire, Then it fires on a count and never on elapsed time | `rg -n -e recovery_s -e timebox_minutes -e session_preference_s -e 'minutes elapsed' -e '10 minutes' $W` prints nothing | Unmet | - |
| AC-013 | REQ-013 | Given a file reference in the lifecycle workflows or the include, When an agent opens it from the repository root, Then it resolves, and only the `assets/...#key` pointers use the command directory as base | `rg -n -e '[^/]prevent-overengineering\.md' -e '\.\./deep/assets' -e 'sk-create-goal.s references' -e '[^/]sk-code/' -e '[^/]system-spec-kit/references' -e '[^/]references/workflows/' $W $A/speckit-lifecycle-shared.yaml` prints nothing | Unmet | - |
| AC-014 | REQ-014 | Given the lifecycle workflows, When an agent reads them, Then no philosophy or autonomous execution block, banner rule or ephemeral comment id remains | `rg -n -e '^planning_philosophy:' -e '^implementation_philosophy:' -e '^development_philosophy:' -e '^autonomous_execution:' $W` prints nothing, `rg -n '^# ─' $W` prints nothing and `rg -n -e 'S7 / M11' -e 'T-TEST-NEW-19' -e 'F-019-D4-02' $W` prints nothing | Unmet | - |

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

**Closeable:** No

No criterion is met yet, because the phase has not started and every row is still `Unmet`.
<!-- /ANCHOR:closure -->
