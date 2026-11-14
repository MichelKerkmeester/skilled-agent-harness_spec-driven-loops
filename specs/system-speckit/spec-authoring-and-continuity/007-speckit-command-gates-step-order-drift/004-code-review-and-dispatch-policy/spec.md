---
title: "Feature Specification: Phase 4: code-review-and-dispatch-policy"
description: "Implement and complete configure a blocking @review gate that no step dispatches, so a run can claim completion with no code review. Plan carries three agent dispatch policies, dispatches @context on a model its agent file does not declare and writes research/research.md, the file /deep:research owns."
trigger_phrases:
  - "code review and dispatch policy"
  - "phase 4 code review and dispatch policy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: code-review-and-dispatch-policy

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 8 |
| **Predecessor** | 003-execution-mode-and-autopilot-contract |
| **Successor** | 005-resume-detection-and-single-workflow |
| **Handoff Criteria** | Every row in this phase's `acceptance-criteria.md` is `Met`, ledger findings D1 to D7 are closed, `test-phase-command-workflows.js` prints `failed=0` and `validate.sh --strict` prints `RESULT: PASSED` for this folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Fix the speckit command workflows: step order, quality gates, execution modes, review dispatch, resume detection, save and search contracts, shared blocks and documentation drift specification.

**Scope Boundary**: Agent dispatch and code review inside `speckit-plan.yaml`, `speckit-implement.yaml` and `speckit-complete.yaml` under `.skilled/commands/speckit/assets/`. No router, presentation file, agent file or script changes in this phase.

**Dependencies**:
- Phase 1 sets the step order. The review dispatch goes into the step that runs after development in that order.
- Phase 2 turns gates into required checks. The review verdict becomes one of those checks.
- Phase 3 defines what auto, confirm and autopilot do at a halt and at a low-confidence branch. The review FAIL branch and the research trigger follow that contract.

**Deliverables**:
- One step in implement and one in complete that dispatches `@review` and acts on its verdict.
- One agent dispatch policy in plan.
- `@context` dispatches that match `.claude/agents/context.md` and name only tools that exist.
- A research trigger on the framework's 40 and 80 thresholds, and no `research/research.md` write outside `/deep:research`.
- No unread dispatch config and no pointer to a section that does not exist.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Implement and complete configure a blocking `@review` gate with a `CODE-REVIEW` marker and a severity verdict, but the marker appears only in `agent_availability` and no workflow step dispatches the agent. A run therefore reaches completion with no code review, while the configuration reads as if one blocked it. Plan gives the agent three dispatch policies that contradict each other. It dispatches `@context` on `opus` while the agent file declares `haiku`, tells it to query a Code Graph tool that does not exist and writes `research/research.md`, which `/deep:research` treats as its own synthesis.

### Purpose
An agent running plan, implement or complete dispatches each agent from exactly one rule, and implement and complete cannot claim completion while `@review` reports a P0 or an open P1 finding.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ rg -n -o '^agent_availability:|^workflow:|subagent_type: context, model: opus|^model: haiku|marker: "CODE-REVIEW"|agent_dispatch\.review\.standards_contract|confidence < 60%|outputs: \[plan\.md, research/research\.md\]' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml .claude/agents/context.md
.claude/agents/context.md:4:model: haiku
.skilled/commands/speckit/assets/speckit-implement.yaml:349:agent_availability:
.skilled/commands/speckit/assets/speckit-implement.yaml:356:marker: "CODE-REVIEW"
.skilled/commands/speckit/assets/speckit-implement.yaml:471:workflow:
.skilled/commands/speckit/assets/speckit-plan.yaml:392:agent_availability:
.skilled/commands/speckit/assets/speckit-plan.yaml:395:confidence < 60%
.skilled/commands/speckit/assets/speckit-plan.yaml:473:workflow:
.skilled/commands/speckit/assets/speckit-plan.yaml:672:subagent_type: context, model: opus
.skilled/commands/speckit/assets/speckit-plan.yaml:759:outputs: [plan.md, research/research.md]
.skilled/commands/speckit/assets/speckit-complete.yaml:443:agent_availability:
.skilled/commands/speckit/assets/speckit-complete.yaml:445:confidence < 60%
.skilled/commands/speckit/assets/speckit-complete.yaml:446:confidence < 60%
.skilled/commands/speckit/assets/speckit-complete.yaml:456:marker: "CODE-REVIEW"
.skilled/commands/speckit/assets/speckit-complete.yaml:612:workflow:
.skilled/commands/speckit/assets/speckit-complete.yaml:896:subagent_type: context, model: opus
.skilled/commands/speckit/assets/speckit-complete.yaml:1130:agent_dispatch.review.standards_contract
```

The two `marker: "CODE-REVIEW"` lines, implement line 356 and complete line 456, both sit inside `agent_availability`, which opens at line 349 and line 443. `workflow:` starts later, at line 471 and line 612. No line under `workflow:` names the marker, so no step dispatches `@review`. Line 1130 points at `agent_dispatch`, a section that does not exist. Lines 672 and 896 override the `haiku` model that `context.md` line 4 declares.

Three facts were checked read-only for this phase. No Code Graph tool exists here: `.mcp.json` and `opencode.json` register only `code_mode`, `.utcp_config.json` lists no code graph manual and `.claude/agents/context.md` grants only `Read, Grep, Glob`. `/deep:research` owns `research/research.md`: `.skilled/commands/deep/research.md` calls it the source of truth, and `step_compile_research` in `deep-research-auto.yaml` reads an existing file as its own progressive synthesis. `.claude/agents/review.md` section 7 takes `gate_type`, `task_id`, `artifact` and `context` and returns `pass` from its severity table.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Add a review dispatch and a verdict branch to the step that `agent_availability.review.available_at_step` names in implement and complete.
- Reduce plan to one agent dispatch policy, the fixed `@context` exploration in `step_5_planning`.
- Stop plan `step_5_planning` and complete `step_6_planning` from writing `research/research.md`.
- Align the `@context` dispatch and its prompts with `.claude/agents/context.md`, and the research trigger with the 40 and 80 confidence thresholds.
- Fix the `agent_dispatch` pointer and remove the dispatch config that no step reads.

No file is created. Every change edits or removes text in the three workflow files.

### Out of Scope
- Removing setup question Q3 Dispatch Mode and the `dispatch_mode` field from the lifecycle presentation files - phase 8 owns this as finding X2. This phase removes the config Q3 maps to, and phase 8 removes Q3 and the field.
- Showing the review verdict in the implement and complete presentation files - phase 8 owns presentation text.
- The `.opencode/specs/` text on complete line 1130 - phase 7 owns it as finding B6. This phase changes only the pointer on that line.
- `circuit_breaker` timers and `session_preference_s` in implement and complete - phase 7 owns them as finding B9. This phase removes only `circuit_breaker.agents` in complete.
- The ask-first `pre_phase_parallel_check` blocks in complete steps 3, 8 and 10 and implement step 6 - phase 3 owns them as finding X1, because each is a stop-and-ask branch of the M2 class.
- Edits to `.claude/agents/context.md`, `.claude/agents/review.md` or any `/deep:*` file - the workflows are corrected to match the agents and `/deep:research`, not the reverse.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/speckit/assets/speckit-implement.yaml` | Modify | Review dispatch and verdict branch, single review mode, remove `multi_agent_config` |
| `.skilled/commands/speckit/assets/speckit-complete.yaml` | Modify | Review dispatch and verdict branch, single review mode, `@context` dispatch, research trigger, no `research/research.md` write, pointer fix, remove unread config |
| `.skilled/commands/speckit/assets/speckit-plan.yaml` | Modify | One dispatch policy, `@context` dispatch, research trigger, no `research/research.md` write |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Implement and complete each dispatch `@review` once per run, as the first activity of the step that `agent_availability.review.available_at_step` names. That is `step_7_completion` in implement and `step_11_acceptance_verify` in complete today, or the keys phase 1 leaves after development. The rendered prompt starts with the line `CODE-REVIEW` and one blank line, asks for Gate Validation mode with `gate_type: post_execution` and passes the spec folder and the files the run changed. Run per file: `awk '/^workflow:/{w=1} w && /CODE-REVIEW/{n++} END{print n+0}' .skilled/commands/speckit/assets/speckit-implement.yaml` prints 1 or more, and the same command on `speckit-complete.yaml` prints 1 or more. (closes D2) |
| REQ-002 | The step that dispatches `@review` acts on the verdict from `.claude/agents/review.md` section 5. `REQUESTED_CHANGES` (any P0 or an open P1) blocks writing `implementation-summary.md` and any completion claim. It returns the run to development to fix those findings and dispatches `@review` once more. A second `REQUESTED_CHANGES` halts the run with the findings listed and no completion claimed. The advisory score never blocks. One Gate Validation dispatch replaces `dual_phase`. Run per file: `awk '/^workflow:/{w=1} w && /REQUESTED_CHANGES/{n++} END{print n+0}' .skilled/commands/speckit/assets/speckit-implement.yaml` prints 1 or more, the same on `speckit-complete.yaml` prints 1 or more, and `rg -n dual_phase .skilled/commands/speckit/assets/` prints nothing. (closes D2) |
| REQ-003 | Plan carries one dispatch policy: `step_5_planning` dispatches the four `@context` explorers with no question asked. `parallel_dispatch_config`, `multi_agent_config` and `step_3_specification.pre_phase_parallel_check` are removed. `rg -n -e parallel_dispatch_config -e multi_agent_config -e pre_phase_parallel_check -e session_preference_s .skilled/commands/speckit/assets/speckit-plan.yaml` prints nothing and `rg -c 'subagent_type: context' .skilled/commands/speckit/assets/speckit-plan.yaml` prints 1. (closes D1) |
| REQ-004 | Plan `step_5_planning` and complete `step_6_planning` write no `research/research.md`. Their Phase 0 activity records unknowns in `plan.md` Technical Context and names `/deep:research` for an unknown that needs investigation. They may read an existing `research/research.md` as input. `rg -n -e 'Generate research/research' -e 'research/research.md: resolved_unknowns' -e 'outputs: \[plan.md, research/research.md\]' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing. (closes D7) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-005 | The pointer in complete `step_10_development` names `agent_availability.review.standards_contract`. `rg -n 'agent_dispatch.review' .skilled/commands/speckit/assets/` prints nothing and `rg -c 'agent_availability.review.standards_contract' .skilled/commands/speckit/assets/speckit-complete.yaml` prints 1. (closes D3) |
| REQ-006 | Complete has no `multi_agent_config`, no `quality_standards` and no `circuit_breaker.agents`. Implement has no `multi_agent_config`, the same unread block. The rule that `circuit_breaker.agents.review.preserve: [blocking]` carried moves into `agent_availability.review` as one line: the `general` fallback keeps the blocking verdict. `rg -n -e '^multi_agent_config:' -e '^quality_standards:' -e '^  agents: ' .skilled/commands/speckit/assets/speckit-complete.yaml .skilled/commands/speckit/assets/speckit-implement.yaml` prints nothing. (closes D4) |
| REQ-007 | The `@context` dispatch in plan `step_5_planning` and complete `step_6_planning` names no model, so the `model: haiku` that `.claude/agents/context.md` declares applies. `rg -n 'subagent_type: context' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints two lines and `rg -n 'subagent_type: context.*model:' .skilled/commands/speckit/assets/` prints nothing. (closes D5) |
| REQ-008 | The eight `@context` explorer prompts in plan and complete ask for findings with file paths and line numbers, not a hypothesis. They name only the `Read`, `Grep` and `Glob` tools the agent file grants. The `Query Code Graph` line goes, because no Code Graph tool exists in this repository. The verification approach reads "Verify each finding" in place of "Verify/refute each hypothesis". `rg -n -e 'Query Code Graph' -e hypothesis .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints nothing. (closes D5) |
| REQ-009 | The research trigger uses the framework's low band. Plan `agent_availability.deep-research.condition`, complete `agent_availability.deep-research` and complete `phase_3_research.condition` read below 40 percent in place of below 60. `rg -n -e 'confidence < 60' -e 'confidence_score < 60' .skilled/commands/speckit/assets/` prints nothing and `rg -n -e 'confidence < 40' -e 'confidence_score < 40' .skilled/commands/speckit/assets/` prints one line in plan and three in complete. (closes D6) |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `awk '/^workflow:/,0' .skilled/commands/speckit/assets/speckit-implement.yaml | grep -c 'CODE-REVIEW'` prints 1 or more, and the same command on `speckit-complete.yaml` prints 1 or more.
- **SC-002**: `rg -c 'model: opus' .skilled/commands/speckit/assets/` prints nothing, so no workflow overrides an agent file's model.
- **SC-003**: `node .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-command-workflows.js` prints a `Result:` line with `failed=0`, as it did before this phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 1 renames or moves the implement and complete steps around development | The review dispatch lands in a step that runs before development | Read `agent_availability.review.available_at_step` after phase 1 closes and place the dispatch in the step it names. Update the field if phase 1 renamed the step |
| Risk | A review FAIL loops between development and review with no end | An unattended run never finishes | REQ-002 allows one re-dispatch, then halts with the findings. Phase 3's halt contract decides what auto and autopilot print at that halt |
| Risk | Removing the `research/research.md` write hides unknowns that plan used to record there | Unknowns go unrecorded | REQ-004 sends them to `plan.md` Technical Context, which `step_5_planning` already fills |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- FILL: Name one measurable limit per line. Write `N/A` and one reason when the packet runs no service, or delete the whole section. GOOD: The option adds under 5 ms to a run. WEAK: Performance is good. -->
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: A plan run dispatches at most four `@context` agents, all in one message.
- **NFR-P02**: An implement or complete run dispatches `@review` at most twice: once, and once more after a FAIL.

### Security
- **NFR-S01**: Every dispatched agent stays read-only. `@context` keeps `Read, Grep, Glob` and `@review` keeps `Read, Bash, Grep, Glob` as their agent files declare. No dispatch prompt grants a write tool.
- **NFR-S02**: The review prompt passes file paths, not file contents, so no secret from a changed file enters the prompt text.

### Reliability
- **NFR-R01**: When `review.md` is missing on a runtime, the `general` fallback runs with the same `CODE-REVIEW` marker and the same blocking verdict.
- **NFR-R02**: The three edited workflow files keep `test-phase-command-workflows.js` at `failed=0`.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES
<!-- FILL: Name the empty input, the maximum input and the failure path. One line each. Write `N/A` with one reason, or delete the whole section. GOOD: Empty input: an empty `logs/archive/` deletes nothing and exits 0. Maximum: `--keep 3` over 10,000 archives keeps the newest 3. Failure path: a missing `--keep` value exits 2 with usage. WEAK: Handle edge cases. -->

- Empty input: a run that changed no file still dispatches `@review` on the spec folder, and `@review` returns `APPROVED` when it finds nothing, so the gate passes.
- Maximum input: a run that changed many files passes the full changed-file list in the one dispatch, and `@review` decides its own depth from that list.
- Failure path: a second `REQUESTED_CHANGES` halts the run, lists the P0 and open P1 findings and writes no `implementation-summary.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT
<!-- FILL: Score each row with the number the change earns. The total must match the level. Write `N/A` with one reason, or delete the whole section. GOOD: Scope 6/25: one option in `scripts/rotate-logs.sh`. Total 18/100. WEAK: Complexity is medium. -->

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three workflow files. About 150 lines removed or rewritten, about 30 added for the review step |
| Risk | 12/25 | The review gate changes what a completed implement or complete run means |
| Research | 6/20 | Four facts checked read-only: the `@context` model, Code Graph tooling, `research/research.md` ownership and the `@review` gate contract |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Decided 2026-11-14: plan always dispatches its four `@context` explorers (D-15). REQ-003 holds it, because `step_5_planning` is the only policy with prompts behind it and it never stops to ask.
- Decided 2026-11-14: the review runs once, in Gate Validation mode (D-15). REQ-002 holds it, because the Pre-Commit pass blocks nothing and costs a second dispatch.
- Decided 2026-11-14: the `@context` dispatch names no model (D-15). REQ-007 holds it, so the agent file stays the one owner of its model.
- Phase 3 owns the ask-first `pre_phase_parallel_check` blocks in complete steps 3, 8 and 10 and implement step 6 as finding X1.
- Phase 8 owns setup question Q3 and the `dispatch_mode` field in the plan, implement and complete presentation files as finding X2. Nothing reads that answer after this phase.

None
<!-- /ANCHOR:questions -->

---
