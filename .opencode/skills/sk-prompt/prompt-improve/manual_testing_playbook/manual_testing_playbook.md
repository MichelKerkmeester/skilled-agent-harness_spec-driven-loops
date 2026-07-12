---
title: "sk-prompt: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the sk-prompt skill."
version: 2.3.0.9
---

# sk-prompt: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `sk-prompt` skill and `@prompt-improver` agent — no mocks, no stubs, no "unautomatable" classification. Operators run the exact prompt and capture the actual mode detection, framework selection, DEPTH-round count, CLEAR score, and structured output block. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document combines the full manual-validation contract for the `sk-prompt` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven prompt-engineering tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-prompt` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:

- `manual_testing_playbook.md`
- `mode-detection/`
- `smart-routing/`
- `depth-clear-loop/`
- `clear-scoring/`
- `framework-selection/`
- `escalation-tiers/`
- `format-modes/`

---

## 1. OVERVIEW

This playbook provides 28 deterministic scenarios across 7 categories validating the `sk-prompt` skill surface and its escalation agent `@prompt-improver`. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-05-06): the playbook covers mode detection across 7 command prefixes, INTENT_MODEL keyword scoring, the DEPTH+CLEAR processing loop with phase exit gates, CLEAR five-dimension scoring with floors, framework selection across 7 frameworks, escalation routing to `@prompt-improver`, and on-demand format-guide loading for `$json` and `$yaml`. `sk-prompt` does not ship a `feature_catalog/`, so per-feature files anchor directly to `SKILL.md`, `references/`, and `assets/` on disk.

### Realistic Test Model

1. A realistic user request (a draft prompt or an ask to improve one) is given to an orchestrator that routes through `sk-prompt`.
2. The orchestrator decides whether to keep the request inline (fast path) or escalate to `@prompt-improver` for full DEPTH+CLEAR processing.
3. The operator captures both the routing decision and the user-visible enhanced prompt with its transparency report.
4. The scenario passes only when the workflow is sound and the returned prompt would dispatch cleanly to a downstream CLI without another framework-selection pass.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or fast-path versus deep-path routing
- The desired user-visible outcome (enhanced prompt + transparency report)
- The implementation or `SKILL.md` anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is project root.
2. `.opencode/skills/sk-prompt/prompt-improve/SKILL.md` is at HEAD-of-main and contains §2 Smart Routing (INTENT_MODEL, RESOURCE_MAP, ON_DEMAND_KEYWORDS, AMBIGUITY_DELTA, UNKNOWN_FALLBACK_CHECKLIST), §3 operating modes table, and §7 agent invocation contract.
3. `.opencode/skills/sk-prompt/prompt-improve/references/depth_framework.md`, `.opencode/skills/sk-prompt/prompt-improve/references/patterns_evaluation.md`, `.opencode/skills/sk-prompt/prompt-improve/assets/format_guide_markdown.md`, `.opencode/skills/sk-prompt/prompt-improve/assets/format_guide_json.md`, and `.opencode/skills/sk-prompt/prompt-improve/assets/format_guide_yaml.md` resolve on disk.
4. `@prompt-improver` agent is canonical at `.opencode/agents/prompt-improver.md` (verify with `ls .opencode/agents/prompt-improver.md`).
5. Destructive scenario: none in this playbook. All scenarios are read+score+return, no file mutation outside the operator's own evidence capture under `/tmp/`.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript (exact prompt sent + raw response)
- User request used (operator phrasing, separate from the framework prompt)
- Orchestrator or agent-facing prompt used
- Routing decision: which mode prefix detected (or which keyword-scored intent), fast-path vs deep-path
- Resource-loading trace: which `references/` and `assets/` files the router reports as loaded
- DEPTH-round count actually executed
- CLEAR score breakdown (C, L, E, A, R) and total
- Framework picked plus rationale line
- Final delivered prompt + transparency report
- Scenario verdict with rationale

---

## 4. DETERMINISTIC COMMAND NOTATION

- Skill invocations shown as `sk-prompt: <mode-prefix> <user-input>`.
- Agent dispatches shown as `agent: @prompt-improver <input-payload>`.
- CLI dispatches shown as `cli-<runtime>: <prompt>`.
- Bash commands shown as `bash: <command>`.
- `->` separates sequential steps.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN__category_name/`
3. Scenario execution evidence (per §3 Global Evidence Requirements)
4. Feature-to-scenario coverage map (§15 Feature Cross-Reference Index)
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals (mode detected, DEPTH rounds run, CLEAR score range, framework family) are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:

- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete (for example transparency report missing one dimension breakdown)
- `FAIL`: expected behavior missing, contradictory output, or critical check failed (for example wrong DEPTH-round count for the detected mode)

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `PARTIAL`: at least one mapped scenario is `PARTIAL`, none are `FAIL`
- `FAIL`: any mapped scenario is `FAIL`

Hard rule:

- Any critical-path scenario `FAIL` (SP-001, SP-002, SP-009, SP-015, SP-019, SP-024) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is `READY` only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES`).
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put feature-specific acceptance caveats (for example "transparency report may omit assumption-flag list when zero assumptions surfaced") in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for executing the 28-scenario battery. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start (available executor skills).
2. Reserve one coordinator to maintain the verdict table.
3. Saturate remaining worker slots; cap concurrency per upstream throttle.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run framework-selection scenarios (SP-019..SP-022) as a dedicated wave to keep the framework-decision audit consistent.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### Suggested Waves

| Wave | Categories | Scenarios | Rationale |
|---|---|---|---|
| 1 | Mode Detection + Smart Routing | SP-001..SP-008 | Cheap, fast, exposes routing infrastructure first |
| 2 | DEPTH+CLEAR Loop | SP-009..SP-014 | Heavier (5-phase exec); run after routing is trusted |
| 3 | CLEAR Scoring + Framework Selection | SP-015..SP-022 | Framework battery; isolate to keep decisions auditable |
| 4 | Escalation Tiers + Format Modes | SP-023..SP-028 | Cross-surface (agent + format guides) |

### What Belongs In Per-Feature Files

- Real user request (operator phrasing of the underlying ask)
- Prompt field with the canonical text for this scenario
- Expected DEPTH-round count and CLEAR score range
- Expected framework or framework family
- Desired user-visible outcome (enhanced prompt shape + transparency report)
- Feature-specific acceptance caveats

---

## 7. MODE DETECTION (`SP-001..SP-004`)

### SP-001 | Default mode routing through 10-round DEPTH

#### Description

Verify that an unmarked prompt request (no `$` prefix) routes to default mode and runs the full 10-round DEPTH cycle with CLEAR scoring.

#### Scenario Contract

Prompt: `Run sk-prompt on my meeting-notes action-item prompt in default mode; verify 10 DEPTH rounds, CLEAR scoring, and threshold enforcement.`

Mode picked: default (10 DEPTH rounds, CLEAR scoring, 40+/50 threshold). Desired outcome: enhanced prompt with explicit framework rationale and CLEAR breakdown.

Desired user-visible outcome: A delivered enhanced prompt + transparency report stating "Mode: default", "DEPTH rounds: 10", and a CLEAR score >= 40/50.

#### Test Execution

> **Feature File:** [SP-001](mode_detection/default_mode_routing.md)

### SP-002 | `$raw` skips DEPTH entirely

#### Description

Verify that the `$raw` prefix bypasses DEPTH (0 rounds), skips CLEAR scoring, and emits no transparency report.

#### Scenario Contract

Prompt: `$raw clean up my prompt's whitespace only; verify DEPTH and CLEAR stay skipped and no transparency report is emitted.`

Mode picked: $raw. Desired outcome: input echoed with light formatting only.

Desired user-visible outcome: Output that is structurally identical to input plus a one-line "Mode: $raw (DEPTH skipped)" notice.

#### Test Execution

> **Feature File:** [SP-002](mode_detection/raw_mode_passthrough.md)

### SP-003 | `$short` runs 3-round DEPTH (D-P-H only)

#### Description

Verify that the `$short` prefix runs only the Discover, Prototype, and Harmonize phases for a total of 3 DEPTH rounds, omitting Engineer and Test.

#### Scenario Contract

Prompt: `$short tighten my prompt; verify only Discover, Prototype, and Harmonize run, Engineer/Test are skipped, and CLEAR still applies.`

Mode picked: $short. Desired outcome: trimmed enhancement with phases-skipped note.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode: $short", "DEPTH rounds: 3", "Phases skipped: Engineer, Test".

#### Test Execution

> **Feature File:** [SP-003](mode_detection/short_mode_three_rounds.md)

### SP-004 | Mode prefix wins over keyword scoring

#### Description

Verify that when an explicit mode prefix and conflicting keyword signals coexist (for example `$short` on a prompt full of "improve" and "refine" keywords), the prefix wins.

#### Scenario Contract

Prompt: `$short improve and refine my prompt; verify the prefix overrides keyword scoring, runs 3 DEPTH rounds, and logs the override.`

Mode picked: $short (prefix wins). Desired outcome: 3-round enhancement, not 10.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode prefix detected: $short; keyword scoring suppressed".

#### Test Execution

> **Feature File:** [SP-004](mode_detection/mode_prefix_keyword_collision.md)

---

## 8. SMART ROUTING (`SP-005..SP-008`)

### SP-005 | INTENT_MODEL keyword scoring routes between TEXT_ENHANCE and FRAMEWORK

#### Description

Verify that without a mode prefix, INTENT_MODEL routes a prompt with high "improve/refine/enhance" weight to TEXT_ENHANCE and a prompt with high "rcaf/costar/tidd-ec/scoring" weight to FRAMEWORK.

#### Scenario Contract

Prompt: `Score these two sk-prompt inputs through INTENT_MODEL; verify TEXT_ENHANCE and FRAMEWORK routing load the expected resources.`

Intent picked: TEXT_ENHANCE for input A, FRAMEWORK for input B. Desired outcome: differentiated resource loading.

Desired user-visible outcome: Two routing traces showing intent + resource list.

#### Test Execution

> **Feature File:** [SP-005](smart_routing/intent_model_keyword_scoring.md)

### SP-006 | ON_DEMAND keyword loading

#### Description

Verify that ON_DEMAND_KEYWORDS such as "deep dive", "all frameworks", "format guide" trigger the router to load every entry in RESOURCE_MAP.values() rather than only the intent-mapped subset.

#### Scenario Contract

Prompt: `Run sk-prompt on my deep-dive framework comparison; verify ON_DEMAND loads every RESOURCE_MAP value, not only the scored intent.`

Trigger keyword detected: yes. Desired outcome: full resource set loaded, even when only one intent scored above zero.

Desired user-visible outcome: Routing trace listing all of `references/depth_framework.md`, `references/patterns_evaluation.md`, plus any format guides keyed by the keyword.

#### Test Execution

> **Feature File:** [SP-006](smart_routing/on_demand_keyword_loading.md)

### SP-007 | AMBIGUITY_DELTA top-2 tiebreaker

#### Description

Verify that when the primary and secondary intent scores differ by 1 or less, the router loads both intents' resources (top-2 selection per AMBIGUITY_DELTA=1).

#### Scenario Contract

Prompt: `Improve this framework-comparison prompt; verify near-tied TEXT_ENHANCE and FRAMEWORK intents load a deduplicated union of resources.`

Both intents loaded: yes. Desired outcome: union of TEXT_ENHANCE and FRAMEWORK resources, deduplicated.

Desired user-visible outcome: Routing trace listing resources from both branches with no duplicate paths.

#### Test Execution

> **Feature File:** [SP-007](smart_routing/ambiguity_delta_tiebreaker.md)

### SP-008 | UNKNOWN_FALLBACK with disambiguation checklist

#### Description

Verify that a zero-keyword-score prompt falls back to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST.

#### Scenario Contract

Prompt: `Run sk-prompt on plain prose with no intent keywords; verify it defaults to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST.`

Default chosen: TEXT_ENHANCE. Disambiguation checklist surfaced: yes.

Desired user-visible outcome: Routing trace showing default = TEXT_ENHANCE, plus the 4-item UNKNOWN_FALLBACK_CHECKLIST printed verbatim.

#### Test Execution

> **Feature File:** [SP-008](smart_routing/unknown_fallback_checklist.md)

---

## 9. DEPTH+CLEAR LOOP (`SP-009..SP-014`)

### SP-009 | DEPTH executes 5 phases in mandatory order

#### Description

Verify that DEPTH runs Discover -> Engineer -> Prototype -> Test -> Harmonize in that order with no phase skipped (default mode).

#### Scenario Contract

Prompt: `Improve my legal-contract summarization prompt with @prompt-improver; verify DEPTH runs Discover through Harmonize in order with no skipped phase.`

Phase order observed: D-E-P-T-H. Desired outcome: per-phase log entries in order.

Desired user-visible outcome: Transparency report including a 5-line per-phase log with phase name + 1-line outcome.

#### Test Execution

> **Feature File:** [SP-009](depth_clear_loop/depth_five_phases_order.md)

### SP-010 | Discover phase blocks below 3 perspectives

#### Description

Verify that the Discover-phase exit gate blocks advancement when fewer than 3 perspectives have been collected (target 5, blocking minimum 3).

#### Scenario Contract

Prompt: `Tighten my code-review feedback prompt; verify Discover evaluates at least 3 perspectives before Engineer starts or blocks for a rerun.`

Floor enforced: yes. Desired outcome: blocked advancement until 3+ perspectives collected.

Desired user-visible outcome: Transparency report stating either "Discover phase: 3+ perspectives collected" or "Discover phase: floor unmet, re-ran perspective discovery".

#### Test Execution

> **Feature File:** [SP-010](depth_clear_loop/perspectives_floor_three.md)

### SP-011 | Iteration cap at 3 CLEAR re-score loops

#### Description

Verify that after three CLEAR re-score iterations, the loop terminates and delivers the best version with a quality note instead of running a fourth iteration.

#### Scenario Contract

Prompt: `Improve my technical-writing prompt; verify CLEAR loops stop after 3 attempts and return the best version with a quality note.`

Iteration cap enforced: 3. Desired outcome: deliver-best-with-note, no infinite loop.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Iterations: 3", "Best CLEAR: <score>/50", "Note: max iterations reached, delivering best version".

#### Test Execution

> **Feature File:** [SP-011](depth_clear_loop/depth_iteration_cap.md)

### SP-012 | RICCE validation gate

#### Description

Verify that the Harmonize-phase exit gate validates Role, Instructions, Context, Constraints, Examples (RICCE) presence or explicit justification before delivery.

#### Scenario Contract

Prompt: `Strengthen my new-engineer onboarding prompt; verify the final output accounts for Role, Instructions, Context, Constraints, and Examples.`

RICCE coverage: 5/5 present-or-justified. Desired outcome: no silent omissions.

Desired user-visible outcome: Transparency report listing each RICCE element with status `present` or `omitted because <reason>`.

#### Test Execution

> **Feature File:** [SP-012](depth_clear_loop/ricce_validation_gate.md)

### SP-013 | Mechanism-first prototype (WHY before WHAT)

#### Description

Verify that the Prototype phase produces a prompt structure that leads with mechanism (WHY/role/context) before delivering the action (WHAT/instructions).

#### Scenario Contract

Prompt: `Refactor my microservices explanation prompt; verify Prototype orders WHY and context before WHAT and instructions.`

Mechanism-first ordering: yes. Desired outcome: structural alignment with WHY-before-WHAT contract.

Desired user-visible outcome: Enhanced prompt whose first 1-2 sentences establish role + context before any imperative verb.

#### Test Execution

> **Feature File:** [SP-013](depth_clear_loop/mechanism_first_prototype.md)

### SP-014 | Phase exit gates block advancement until met

#### Description

Verify that each DEPTH phase has a named exit criterion and the loop refuses to advance until that criterion is met.

#### Scenario Contract

Prompt: `Improve my SQL query prompt; verify every DEPTH phase reports exit criteria and failed gates block or rerun before advancing.`

Gate enforcement: per-phase. Desired outcome: blocked advancement on simulated failure.

Desired user-visible outcome: Transparency report listing each phase with `gate: <criterion>` and `status: passed|re-ran|blocked`.

#### Test Execution

> **Feature File:** [SP-014](depth_clear_loop/phase_exit_gate_blocking.md)

---

## 10. CLEAR SCORING (`SP-015..SP-018`)

### SP-015 | All five CLEAR dimensions scored

#### Description

Verify that every delivery includes per-dimension scores for Correctness, Logic, Expression, Arrangement, and Reusability — not just a total.

#### Scenario Contract

Prompt: `Score and improve my customer-feedback parsing prompt; verify CLEAR reports all five dimension scores plus the total.`

Dimensions scored: 5/5. Desired outcome: per-dimension breakdown not collapsed into a total.

Desired user-visible outcome: Transparency report containing `CLEAR_SCORE: <n>/50 (C:<n> L:<n> E:<n> A:<n> R:<n>)`.

#### Test Execution

> **Feature File:** [SP-015](clear_scoring/clear_five_dimensions.md)

### SP-016 | Per-dimension floors trigger re-score

#### Description

Verify that any dimension breaching its floor (C<7, L<7, E<10, A<7, R<3) triggers a re-score even if the total exceeds 40/50.

#### Scenario Contract

Prompt: `Improve my user-story prompt; verify any CLEAR dimension below its floor triggers another improvement cycle even when total score passes.`

Floor enforcement: per-dimension. Desired outcome: re-score on floor breach.

Desired user-visible outcome: Transparency report listing `re-score reason: dimension floor breach (E:9 < floor:10)`.

#### Test Execution

> **Feature File:** [SP-016](clear_scoring/dimension_floors_block.md)

### SP-017 | Total below 40/50 triggers improvement cycle (max 3)

#### Description

Verify that a total CLEAR score below 40/50 triggers another DEPTH iteration, capped at 3 total iterations (per SP-011).

#### Scenario Contract

Prompt: `Improve my ML hyperparameter tuning prompt; verify CLEAR below 40 triggers another cycle and stops after 3 total attempts.`

Improvement cycle: yes. Cap honored: yes.

Desired user-visible outcome: Transparency report showing iteration count >= 2, with "delivering best version" note if cap hit.

#### Test Execution

> **Feature File:** [SP-017](clear_scoring/forty_of_fifty_threshold.md)

### SP-018 | Per-dimension rationale included

#### Description

Verify that the CLEAR breakdown includes a one-line rationale per dimension, not just the numeric score.

#### Scenario Contract

Prompt: `Score my data-validation prompt; verify every CLEAR dimension includes a numeric score and one-line rationale.`

Per-dimension rationale present: 5/5. Desired outcome: auditable score reasoning.

Desired user-visible outcome: Transparency report containing five lines of the form `<Dimension>: <score> — <rationale>`.

#### Test Execution

> **Feature File:** [SP-018](clear_scoring/dimension_drilldown_rationale.md)

---

## 11. FRAMEWORK SELECTION (`SP-019..SP-022`)

### SP-019 | Complexity score routes to correct framework family

#### Description

Verify that complexity scoring routes a request to the correct framework: low complexity (1-3) -> RACE, low-medium (1-4) -> RCAF, medium (3-6) -> COSTAR, instruction-heavy (4-6) -> CIDI, creative (5-7) -> CRISPE, precision (6-8) -> TIDD-EC, comprehensive (7-10) -> CRAFT.

#### Scenario Contract

Prompt: `Improve my customer-support response prompt; verify framework selection evaluates complexity, chooses the right family, and returns score plus rationale.`

Matrix alignment: 3/3. Desired outcome: framework family matches complexity bucket.

Desired user-visible outcome: Three transparency reports each naming the selected framework and the complexity score that drove the choice.

#### Test Execution

> **Feature File:** [SP-019](framework_selection/framework_by_complexity.md)

### SP-020 | User-named framework override wins

#### Description

Verify that when a user explicitly names a framework in their request (for example "use COSTAR"), that framework is selected even if complexity scoring would have picked another.

#### Scenario Contract

Prompt: `Apply CRAFT to my technical-spec authoring prompt; verify it overrides automatic framework routing and logs the user-named override.`

User override honored: yes. Desired outcome: COSTAR selected; override logged in rationale.

Desired user-visible outcome: Transparency report containing `Framework: COSTAR (user-named, complexity-routing override)`.

#### Test Execution

> **Feature File:** [SP-020](framework_selection/user_named_framework_override.md)

### SP-021 | Selection rationale required

#### Description

Verify that every framework selection includes a "why this over alternatives" justification listing at least one rejected framework and the reason.

#### Scenario Contract

Prompt: `Tighten my code documentation prompt; verify the framework rationale names the choice, a rejected alternative, and the differentiating criterion.`

Rationale completeness: chosen + 1+ rejected + criterion. Desired outcome: auditable selection.

Desired user-visible outcome: Transparency report containing `Framework: <name>; rejected: <other>; reason: <one-line>`.

#### Test Execution

> **Feature File:** [SP-021](framework_selection/framework_rationale_required.md)

### SP-022 | Mid-flight framework switch on Test-phase failure

#### Description

Verify that when the first framework underdelivers at the Test phase (CLEAR below threshold and dimension floors breached), DEPTH switches framework and restarts from the Engineer phase rather than ending.

#### Scenario Contract

Prompt: `Improve my sentiment-analysis prompt; verify a failing first framework switches to another and restarts from Engineer before final delivery.`

Switch behavior: framework swap + Engineer restart. Desired outcome: second framework attempt before iteration cap.

Desired user-visible outcome: Transparency report containing `Framework switch: <first> -> <second> (Test-phase floor breach)`.

#### Test Execution

> **Feature File:** [SP-022](framework_selection/framework_switch_mid_flight.md)

---

## 12. ESCALATION TIERS (`SP-023..SP-026`)

### SP-023 | Inline fast path: low-complexity prompts are not escalated

#### Description

Verify that a low-complexity routine prompt passes the CLEAR check inline without escalating to `@prompt-improver`.

#### Scenario Contract

Prompt: `Run sk-prompt on a low-complexity prompt. Verify it passes the CLEAR check inline and does not dispatch @prompt-improver. Return the verdict.`

Fast-path execution: inline. Desired outcome: no agent escalation.

Desired user-visible outcome: Notice "Handled inline; CLEAR passed; no @prompt-improver escalation."

#### Test Execution

> **Feature File:** [SP-023](escalation_tiers/cli_card_five_question_fast_path.md)

### SP-024 | Escalation triggers (complexity / compliance / multi-stakeholder / ambiguity)

#### Description

Verify that any of (complexity >= 7, compliance constraints, multi-stakeholder audience, ambiguity) triggers escalation to `@prompt-improver`.

#### Scenario Contract

Prompt: `Run sk-prompt on a HIPAA-bound, high-complexity prompt. Verify it escalates to @prompt-improver and the routing decision names the reason. Return the escalation payload.`

Escalation count: 4/4. Desired outcome: all four trigger deep path.

Desired user-visible outcome: Four routing decisions logged as `Escalation: @prompt-improver (<trigger reason>)`.

#### Test Execution

> **Feature File:** [SP-024](escalation_tiers/escalation_trigger_thresholds.md)

### SP-025 | `@prompt-improver` input payload contract

#### Description

Verify that `@prompt-improver` accepts the input payload with required `raw_task` and the four optional fields (`task_type`, `target_cli`, `complexity_hint`, `constraints`).

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch @prompt-improver with raw_task plus task_type=review, target_cli=opencode, complexity_hint=8, and safety constraints. Verify the agent accepts the payload, preserves constraints, and returns the structured output block.`

Payload accepted: yes. Constraints preserved: yes.

Desired user-visible outcome: Structured output block listing FRAMEWORK / CLEAR_SCORE / RATIONALE / ENHANCED_PROMPT / ESCALATION_NOTES with caller constraints visible inside ENHANCED_PROMPT.

#### Test Execution

> **Feature File:** [SP-025](escalation_tiers/prompt_improver_input_payload.md)

### SP-026 | `@prompt-improver` structured output block

#### Description

Verify that every `@prompt-improver` return contains the five-block contract: FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, ESCALATION_NOTES.

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch @prompt-improver on a data-extraction prompt. Verify the response contains FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, and ESCALATION_NOTES. Return the structured block verdict.`

Output-block coverage: 5/5 fields. Desired outcome: ready-for-CLI-handoff structure.

Desired user-visible outcome: Five labelled fields present, ENHANCED_PROMPT multi-line, ESCALATION_NOTES non-empty when ambiguity exists.

#### Test Execution

> **Feature File:** [SP-026](escalation_tiers/prompt_improver_output_block.md)

---

## 13. FORMAT MODES (`SP-027..SP-028`)

### SP-027 | `$json` / `$yaml` / markdown delivery in correct format

#### Description

Verify that `$json`, `$yaml`, and default markdown modes deliver enhanced prompts in the correct structural format with format-specific scaffolding.

#### Scenario Contract

Prompt: `$json improve my API request prompt; verify the enhanced prompt is valid JSON with format-specific keys, not markdown sections.`

Format compliance: 3/3. Desired outcome: format-correct enhanced prompts.

Desired user-visible outcome: Three enhanced prompts that parse as valid JSON, YAML, and Markdown respectively.

#### Test Execution

> **Feature File:** [SP-027](format_modes/format_mode_delivery.md)

### SP-028 | Format-guide assets loaded only on demand

#### Description

Verify that `assets/format_guide_json.md`, `format_guide_yaml.md`, `format_guide_markdown.md` load only when both the format-mode prefix is set and the ON_DEMAND keyword is matched in the request.

#### Scenario Contract

Prompt: `$yaml improve my CI/CD config prompt; verify YAML guide loading appears in the trace and the output uses YAML structure.`

Conditional load: yes. Desired outcome: token-efficient resource loading.

Desired user-visible outcome: Routing trace listing `format_guide_json.md` only on the second run.

#### Test Execution

> **Feature File:** [SP-028](format_modes/format_guide_on_demand.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| _none ship with sk-prompt at this time_ | n/a | n/a |

`sk-prompt` does not ship automated test modules. All validation runs through this manual playbook plus the `validate_document.py` structural check on the root playbook. When automated tests are added (for example a smart-router unit-test suite), update this table with module path and overlapping scenario IDs.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| SP-001 | Default mode routing | Mode Detection | [SP-001](mode_detection/default_mode_routing.md) |
| SP-002 | `$raw` passthrough | Mode Detection | [SP-002](mode_detection/raw_mode_passthrough.md) |
| SP-003 | `$short` 3-round DEPTH | Mode Detection | [SP-003](mode_detection/short_mode_three_rounds.md) |
| SP-004 | Mode prefix vs keyword collision | Mode Detection | [SP-004](mode_detection/mode_prefix_keyword_collision.md) |
| SP-005 | INTENT_MODEL keyword scoring | Smart Routing | [SP-005](smart_routing/intent_model_keyword_scoring.md) |
| SP-006 | ON_DEMAND keyword loading | Smart Routing | [SP-006](smart_routing/on_demand_keyword_loading.md) |
| SP-007 | AMBIGUITY_DELTA tiebreaker | Smart Routing | [SP-007](smart_routing/ambiguity_delta_tiebreaker.md) |
| SP-008 | UNKNOWN_FALLBACK checklist | Smart Routing | [SP-008](smart_routing/unknown_fallback_checklist.md) |
| SP-009 | DEPTH 5-phase order | DEPTH+CLEAR Loop | [SP-009](depth_clear_loop/depth_five_phases_order.md) |
| SP-010 | Perspectives floor (3) | DEPTH+CLEAR Loop | [SP-010](depth_clear_loop/perspectives_floor_three.md) |
| SP-011 | DEPTH iteration cap (3) | DEPTH+CLEAR Loop | [SP-011](depth_clear_loop/depth_iteration_cap.md) |
| SP-012 | RICCE validation gate | DEPTH+CLEAR Loop | [SP-012](depth_clear_loop/ricce_validation_gate.md) |
| SP-013 | Mechanism-first prototype | DEPTH+CLEAR Loop | [SP-013](depth_clear_loop/mechanism_first_prototype.md) |
| SP-014 | Phase exit gate blocking | DEPTH+CLEAR Loop | [SP-014](depth_clear_loop/phase_exit_gate_blocking.md) |
| SP-015 | CLEAR five dimensions | CLEAR Scoring | [SP-015](clear_scoring/clear_five_dimensions.md) |
| SP-016 | Dimension floors block | CLEAR Scoring | [SP-016](clear_scoring/dimension_floors_block.md) |
| SP-017 | 40/50 threshold + 3-cap | CLEAR Scoring | [SP-017](clear_scoring/forty_of_fifty_threshold.md) |
| SP-018 | Per-dimension rationale | CLEAR Scoring | [SP-018](clear_scoring/dimension_drilldown_rationale.md) |
| SP-019 | Framework by complexity | Framework Selection | [SP-019](framework_selection/framework_by_complexity.md) |
| SP-020 | User-named framework override | Framework Selection | [SP-020](framework_selection/user_named_framework_override.md) |
| SP-021 | Framework rationale required | Framework Selection | [SP-021](framework_selection/framework_rationale_required.md) |
| SP-022 | Framework switch mid-flight | Framework Selection | [SP-022](framework_selection/framework_switch_mid_flight.md) |
| SP-023 | Inline fast path (no escalation) | Escalation Tiers | [SP-023](escalation_tiers/cli_card_five_question_fast_path.md) |
| SP-024 | Escalation trigger thresholds | Escalation Tiers | [SP-024](escalation_tiers/escalation_trigger_thresholds.md) |
| SP-025 | `@prompt-improver` input payload | Escalation Tiers | [SP-025](escalation_tiers/prompt_improver_input_payload.md) |
| SP-026 | `@prompt-improver` output block | Escalation Tiers | [SP-026](escalation_tiers/prompt_improver_output_block.md) |
| SP-027 | Format mode delivery | Format Modes | [SP-027](format_modes/format_mode_delivery.md) |
| SP-028 | Format guide on-demand | Format Modes | [SP-028](format_modes/format_guide_on_demand.md) |
