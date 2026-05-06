---
title: "sk-prompt: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the sk-prompt skill."
---

# sk-prompt: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `sk-prompt` skill and `@prompt-improver` agent — no mocks, no stubs, no "unautomatable" classification. Operators run the exact prompt and capture the actual mode detection, framework selection, DEPTH-round count, CLEAR score, and structured output block. Acceptable verdicts: PASS, PARTIAL, FAIL, or SKIP (with documented blocker).

This document combines the full manual-validation contract for the `sk-prompt` skill into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven prompt-engineering tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-prompt` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:

- `manual_testing_playbook.md`
- `01--mode-detection/`
- `02--smart-routing/`
- `03--depth-clear-loop/`
- `04--clear-scoring/`
- `05--framework-selection/`
- `06--escalation-tiers/`
- `07--format-modes/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. REVIEW PROTOCOL AND RELEASE READINESS](#5--review-protocol-and-release-readiness)
- [6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#6--sub-agent-orchestration-and-wave-planning)
- [7. MODE DETECTION (`SP-001..SP-004`)](#7--mode-detection-sp-001sp-004)
- [8. SMART ROUTING (`SP-005..SP-008`)](#8--smart-routing-sp-005sp-008)
- [9. DEPTH+CLEAR LOOP (`SP-009..SP-014`)](#9--depthclear-loop-sp-009sp-014)
- [10. CLEAR SCORING (`SP-015..SP-018`)](#10--clear-scoring-sp-015sp-018)
- [11. FRAMEWORK SELECTION (`SP-019..SP-022`)](#11--framework-selection-sp-019sp-022)
- [12. ESCALATION TIERS (`SP-023..SP-026`)](#12--escalation-tiers-sp-023sp-026)
- [13. FORMAT MODES (`SP-027..SP-028`)](#13--format-modes-sp-027sp-028)
- [14. AUTOMATED TEST CROSS-REFERENCE](#14--automated-test-cross-reference)
- [15. FEATURE CROSS-REFERENCE INDEX](#15--feature-cross-reference-index)

---

## 1. OVERVIEW

This playbook provides 28 deterministic scenarios across 7 categories validating the `sk-prompt` skill surface and its escalation agent `@prompt-improver`. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract.

Coverage note (2026-05-06): the playbook covers mode detection across 7 command prefixes, INTENT_MODEL keyword scoring, the DEPTH+CLEAR processing loop with phase exit gates, CLEAR five-dimension scoring with floors, framework selection across 7 frameworks, escalation routing through `cli_prompt_quality_card.md` and `@prompt-improver`, and on-demand format-guide loading for `$json` and `$yaml`. `sk-prompt` does not ship a `feature_catalog/`, so per-feature files anchor directly to `SKILL.md`, `references/`, and `assets/` on disk.

### Realistic Test Model

1. A realistic user request (a draft prompt or an ask to improve one) is given to an orchestrator that routes through `sk-prompt`.
2. The orchestrator decides whether to keep the request inline (fast path with `cli_prompt_quality_card.md`) or escalate to `@prompt-improver` for full DEPTH+CLEAR processing.
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
2. `.opencode/skill/sk-prompt/SKILL.md` is at HEAD-of-main and contains §2 Smart Routing (INTENT_MODEL, RESOURCE_MAP, ON_DEMAND_KEYWORDS, AMBIGUITY_DELTA, UNKNOWN_FALLBACK_CHECKLIST), §3 operating modes table, §7 agent invocation contract, and §8 fast-path asset section.
3. `.opencode/skill/sk-prompt/references/depth_framework.md`, `.opencode/skill/sk-prompt/references/patterns_evaluation.md`, `.opencode/skill/sk-prompt/assets/cli_prompt_quality_card.md`, `assets/format_guide_markdown.md`, `assets/format_guide_json.md`, and `assets/format_guide_yaml.md` resolve on disk.
4. `@prompt-improver` agent is canonical at `.opencode/agent/prompt-improver.md` (verify with `ls .opencode/agent/prompt-improver.md`).
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
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
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

1. Probe runtime capacity at start (cli-claude-code, cli-codex, cli-opencode availability).
2. Reserve one coordinator to maintain the verdict table.
3. Saturate remaining worker slots; cap at 3 concurrent for cli-copilot per upstream throttle.
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
- Prompt field following the Role -> Context -> Action -> Format contract
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

Prompt: `As a prompt engineer, take the operator's draft and run sk-prompt default-mode enhancement against it. Verify mode detection picks default ($improve equivalent) and DEPTH runs 10 rounds. Return the enhanced prompt plus transparency report.`

Mode picked: default (10 DEPTH rounds, CLEAR scoring, 40+/50 threshold). Desired outcome: enhanced prompt with explicit framework rationale and CLEAR breakdown.

Desired user-visible outcome: A delivered enhanced prompt + transparency report stating "Mode: default", "DEPTH rounds: 10", and a CLEAR score >= 40/50.

#### Test Execution

> **Feature File:** [SP-001](01--mode-detection/001-default-mode-routing.md)

### SP-002 | `$raw` skips DEPTH entirely

#### Description

Verify that the `$raw` prefix bypasses DEPTH (0 rounds), skips CLEAR scoring, and emits no transparency report.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against the operator input prefixed with $raw. Verify DEPTH runs 0 rounds, CLEAR scoring is skipped, no transparency report is emitted, and the input passes through with minimal structural cleanup.`

Mode picked: $raw. Desired outcome: input echoed with light formatting only.

Desired user-visible outcome: Output that is structurally identical to input plus a one-line "Mode: $raw (DEPTH skipped)" notice.

#### Test Execution

> **Feature File:** [SP-002](01--mode-detection/002-raw-mode-passthrough.md)

### SP-003 | `$short` runs 3-round DEPTH (D-P-H only)

#### Description

Verify that the `$short` prefix runs only the Discover, Prototype, and Harmonize phases for a total of 3 DEPTH rounds, omitting Engineer and Test.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against the operator input prefixed with $short. Verify DEPTH runs exactly 3 rounds (Discover, Prototype, Harmonize), CLEAR scoring still applies, and the transparency report names which phases were skipped.`

Mode picked: $short. Desired outcome: trimmed enhancement with phases-skipped note.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode: $short", "DEPTH rounds: 3", "Phases skipped: Engineer, Test".

#### Test Execution

> **Feature File:** [SP-003](01--mode-detection/003-short-mode-three-rounds.md)

### SP-004 | Mode prefix wins over keyword scoring

#### Description

Verify that when an explicit mode prefix and conflicting keyword signals coexist (for example `$short` on a prompt full of "improve" and "refine" keywords), the prefix wins.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against operator input that begins with $short but also contains heavy keyword density that would otherwise score TEXT_ENHANCE high. Verify the prefix wins: mode detected = $short, DEPTH rounds = 3.`

Mode picked: $short (prefix wins). Desired outcome: 3-round enhancement, not 10.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Mode prefix detected: $short; keyword scoring suppressed".

#### Test Execution

> **Feature File:** [SP-004](01--mode-detection/004-mode-prefix-keyword-collision.md)

---

## 8. SMART ROUTING (`SP-005..SP-008`)

### SP-005 | INTENT_MODEL keyword scoring routes between TEXT_ENHANCE and FRAMEWORK

#### Description

Verify that without a mode prefix, INTENT_MODEL routes a prompt with high "improve/refine/enhance" weight to TEXT_ENHANCE and a prompt with high "rcaf/costar/tidd-ec/scoring" weight to FRAMEWORK.

#### Scenario Contract

Prompt: `As a prompt engineer, score two operator inputs through sk-prompt's INTENT_MODEL: one heavy on "improve/refine/enhance" tokens and one heavy on "rcaf/costar/tidd-ec/scoring" tokens. Verify the first routes to TEXT_ENHANCE and the second to FRAMEWORK with the correct RESOURCE_MAP loads.`

Intent picked: TEXT_ENHANCE for input A, FRAMEWORK for input B. Desired outcome: differentiated resource loading.

Desired user-visible outcome: Two routing traces showing intent + resource list.

#### Test Execution

> **Feature File:** [SP-005](02--smart-routing/001-intent-model-keyword-scoring.md)

### SP-006 | ON_DEMAND keyword loading

#### Description

Verify that ON_DEMAND_KEYWORDS such as "deep dive", "all frameworks", "format guide" trigger the router to load every entry in RESOURCE_MAP.values() rather than only the intent-mapped subset.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt with an operator input that contains an ON_DEMAND keyword such as "give me a deep dive on all frameworks". Verify the router loads every RESOURCE_MAP value, not only the intent-scored subset.`

Trigger keyword detected: yes. Desired outcome: full resource set loaded, even when only one intent scored above zero.

Desired user-visible outcome: Routing trace listing all of `references/depth_framework.md`, `references/patterns_evaluation.md`, plus any format guides keyed by the keyword.

#### Test Execution

> **Feature File:** [SP-006](02--smart-routing/002-on-demand-keyword-loading.md)

### SP-007 | AMBIGUITY_DELTA top-2 tiebreaker

#### Description

Verify that when the primary and secondary intent scores differ by 1 or less, the router loads both intents' resources (top-2 selection per AMBIGUITY_DELTA=1).

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against an operator input crafted so TEXT_ENHANCE and FRAMEWORK score within AMBIGUITY_DELTA=1 of each other. Verify resources from both intents are loaded.`

Both intents loaded: yes. Desired outcome: union of TEXT_ENHANCE and FRAMEWORK resources, deduplicated.

Desired user-visible outcome: Routing trace listing resources from both branches with no duplicate paths.

#### Test Execution

> **Feature File:** [SP-007](02--smart-routing/003-ambiguity-delta-tiebreaker.md)

### SP-008 | UNKNOWN_FALLBACK with disambiguation checklist

#### Description

Verify that a zero-keyword-score prompt falls back to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against operator input that contains zero INTENT_MODEL keywords (no improve, enhance, prompt, framework, rcaf, etc.). Verify the router defaults to TEXT_ENHANCE and surfaces UNKNOWN_FALLBACK_CHECKLIST as a disambiguation prompt.`

Default chosen: TEXT_ENHANCE. Disambiguation checklist surfaced: yes.

Desired user-visible outcome: Routing trace showing default = TEXT_ENHANCE, plus the 4-item UNKNOWN_FALLBACK_CHECKLIST printed verbatim.

#### Test Execution

> **Feature File:** [SP-008](02--smart-routing/004-unknown-fallback-checklist.md)

---

## 9. DEPTH+CLEAR LOOP (`SP-009..SP-014`)

### SP-009 | DEPTH executes 5 phases in mandatory order

#### Description

Verify that DEPTH runs Discover -> Engineer -> Prototype -> Test -> Harmonize in that order with no phase skipped (default mode).

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt default-mode enhancement on the operator input and capture the per-phase log. Verify phases execute in D-E-P-T-H order with no phase skipped or reordered.`

Phase order observed: D-E-P-T-H. Desired outcome: per-phase log entries in order.

Desired user-visible outcome: Transparency report including a 5-line per-phase log with phase name + 1-line outcome.

#### Test Execution

> **Feature File:** [SP-009](03--depth-clear-loop/001-depth-five-phases-order.md)

### SP-010 | Discover phase blocks below 3 perspectives

#### Description

Verify that the Discover-phase exit gate blocks advancement when fewer than 3 perspectives have been collected (target 5, blocking minimum 3).

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against an operator input deliberately scoped so only 1-2 perspectives surface organically. Verify the Discover phase blocks at the exit gate and either re-runs perspective discovery or surfaces an explicit "perspectives floor unmet" notice before advancing.`

Floor enforced: yes. Desired outcome: blocked advancement until 3+ perspectives collected.

Desired user-visible outcome: Transparency report stating either "Discover phase: 3+ perspectives collected" or "Discover phase: floor unmet, re-ran perspective discovery".

#### Test Execution

> **Feature File:** [SP-010](03--depth-clear-loop/002-perspectives-floor-three.md)

### SP-011 | Iteration cap at 3 CLEAR re-score loops

#### Description

Verify that after three CLEAR re-score iterations, the loop terminates and delivers the best version with a quality note instead of running a fourth iteration.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against an operator input crafted so CLEAR scoring stays below 40/50 across iterations. Verify the loop terminates after the third iteration, delivers the highest-scoring version, and emits a "max iterations reached" quality note.`

Iteration cap enforced: 3. Desired outcome: deliver-best-with-note, no infinite loop.

Desired user-visible outcome: Enhanced prompt + transparency report stating "Iterations: 3", "Best CLEAR: <score>/50", "Note: max iterations reached, delivering best version".

#### Test Execution

> **Feature File:** [SP-011](03--depth-clear-loop/003-depth-iteration-cap.md)

### SP-012 | RICCE validation gate

#### Description

Verify that the Harmonize-phase exit gate validates Role, Instructions, Context, Constraints, Examples (RICCE) presence or explicit justification before delivery.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against the operator input and inspect the Harmonize-phase output. Verify each RICCE element is either present in the enhanced prompt or explicitly justified as omitted in the transparency report.`

RICCE coverage: 5/5 present-or-justified. Desired outcome: no silent omissions.

Desired user-visible outcome: Transparency report listing each RICCE element with status `present` or `omitted because <reason>`.

#### Test Execution

> **Feature File:** [SP-012](03--depth-clear-loop/004-ricce-validation-gate.md)

### SP-013 | Mechanism-first prototype (WHY before WHAT)

#### Description

Verify that the Prototype phase produces a prompt structure that leads with mechanism (WHY/role/context) before delivering the action (WHAT/instructions).

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt and inspect the Prototype-phase output. Verify the prompt orders Role/Context (WHY) before Instructions/Action (WHAT). Reject outputs that lead with imperatives.`

Mechanism-first ordering: yes. Desired outcome: structural alignment with WHY-before-WHAT contract.

Desired user-visible outcome: Enhanced prompt whose first 1-2 sentences establish role + context before any imperative verb.

#### Test Execution

> **Feature File:** [SP-013](03--depth-clear-loop/005-mechanism-first-prototype.md)

### SP-014 | Phase exit gates block advancement until met

#### Description

Verify that each DEPTH phase has a named exit criterion and the loop refuses to advance until that criterion is met.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt and force one phase exit gate to fail (for example artificially insufficient CLEAR score at Test phase). Verify the loop refuses to advance to the next phase until the criterion is met or a re-run is attempted.`

Gate enforcement: per-phase. Desired outcome: blocked advancement on simulated failure.

Desired user-visible outcome: Transparency report listing each phase with `gate: <criterion>` and `status: passed|re-ran|blocked`.

#### Test Execution

> **Feature File:** [SP-014](03--depth-clear-loop/006-phase-exit-gate-blocking.md)

---

## 10. CLEAR SCORING (`SP-015..SP-018`)

### SP-015 | All five CLEAR dimensions scored

#### Description

Verify that every delivery includes per-dimension scores for Correctness, Logic, Expression, Arrangement, and Reusability — not just a total.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt and inspect the CLEAR scoring output. Verify all five dimensions (Correctness, Logic, Expression, Arrangement, Reusability) are scored with explicit per-dimension values.`

Dimensions scored: 5/5. Desired outcome: per-dimension breakdown not collapsed into a total.

Desired user-visible outcome: Transparency report containing `CLEAR_SCORE: <n>/50 (C:<n> L:<n> E:<n> A:<n> R:<n>)`.

#### Test Execution

> **Feature File:** [SP-015](04--clear-scoring/001-clear-five-dimensions.md)

### SP-016 | Per-dimension floors trigger re-score

#### Description

Verify that any dimension breaching its floor (C<7, L<7, E<10, A<7, R<3) triggers a re-score even if the total exceeds 40/50.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against an operator input crafted so total CLEAR is 41/50 but Expression dimension is 9 (below floor 10). Verify the re-score is triggered despite the total clearing 40.`

Floor enforcement: per-dimension. Desired outcome: re-score on floor breach.

Desired user-visible outcome: Transparency report listing `re-score reason: dimension floor breach (E:9 < floor:10)`.

#### Test Execution

> **Feature File:** [SP-016](04--clear-scoring/002-dimension-floors-block.md)

### SP-017 | Total below 40/50 triggers improvement cycle (max 3)

#### Description

Verify that a total CLEAR score below 40/50 triggers another DEPTH iteration, capped at 3 total iterations (per SP-011).

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against operator input that scores 38/50 on the first pass. Verify another iteration runs, capped at 3 total iterations even if the score never clears 40.`

Improvement cycle: yes. Cap honored: yes.

Desired user-visible outcome: Transparency report showing iteration count >= 2, with "delivering best version" note if cap hit.

#### Test Execution

> **Feature File:** [SP-017](04--clear-scoring/003-forty-of-fifty-threshold.md)

### SP-018 | Per-dimension rationale included

#### Description

Verify that the CLEAR breakdown includes a one-line rationale per dimension, not just the numeric score.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt and inspect the CLEAR breakdown. Verify each dimension carries a one-line rationale stating why the score was assigned at that level.`

Per-dimension rationale present: 5/5. Desired outcome: auditable score reasoning.

Desired user-visible outcome: Transparency report containing five lines of the form `<Dimension>: <score> — <rationale>`.

#### Test Execution

> **Feature File:** [SP-018](04--clear-scoring/004-dimension-drilldown-rationale.md)

---

## 11. FRAMEWORK SELECTION (`SP-019..SP-022`)

### SP-019 | Complexity score routes to correct framework family

#### Description

Verify that complexity scoring routes a request to the correct framework: low complexity (1-3) -> RACE, low-medium (1-4) -> RCAF, medium (3-6) -> COSTAR, instruction-heavy (4-6) -> CIDI, creative (5-7) -> CRISPE, precision (6-8) -> TIDD-EC, comprehensive (7-10) -> CRAFT.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against three operator inputs at complexity 2, 5, and 9. Verify the framework selected matches the matrix in §3 of SKILL.md (RACE/RCAF for low, COSTAR/CIDI/CRISPE for mid, TIDD-EC/CRAFT for high).`

Matrix alignment: 3/3. Desired outcome: framework family matches complexity bucket.

Desired user-visible outcome: Three transparency reports each naming the selected framework and the complexity score that drove the choice.

#### Test Execution

> **Feature File:** [SP-019](05--framework-selection/001-framework-by-complexity.md)

### SP-020 | User-named framework override wins

#### Description

Verify that when a user explicitly names a framework in their request (for example "use COSTAR"), that framework is selected even if complexity scoring would have picked another.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against operator input that explicitly names a framework ("apply COSTAR to this prompt") on a complexity-2 task that would normally route to RACE. Verify COSTAR is selected and the override is logged.`

User override honored: yes. Desired outcome: COSTAR selected; override logged in rationale.

Desired user-visible outcome: Transparency report containing `Framework: COSTAR (user-named, complexity-routing override)`.

#### Test Execution

> **Feature File:** [SP-020](05--framework-selection/002-user-named-framework-override.md)

### SP-021 | Selection rationale required

#### Description

Verify that every framework selection includes a "why this over alternatives" justification listing at least one rejected framework and the reason.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt and inspect the framework-selection rationale. Verify the rationale names the chosen framework, at least one rejected alternative, and the differentiating criterion.`

Rationale completeness: chosen + 1+ rejected + criterion. Desired outcome: auditable selection.

Desired user-visible outcome: Transparency report containing `Framework: <name>; rejected: <other>; reason: <one-line>`.

#### Test Execution

> **Feature File:** [SP-021](05--framework-selection/003-framework-rationale-required.md)

### SP-022 | Mid-flight framework switch on Test-phase failure

#### Description

Verify that when the first framework underdelivers at the Test phase (CLEAR below threshold and dimension floors breached), DEPTH switches framework and restarts from the Engineer phase rather than ending.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt against an operator input where the first-selected framework produces below-threshold CLEAR at the Test phase. Verify DEPTH switches framework, restarts from Engineer, and notes the switch in the transparency report.`

Switch behavior: framework swap + Engineer restart. Desired outcome: second framework attempt before iteration cap.

Desired user-visible outcome: Transparency report containing `Framework switch: <first> -> <second> (Test-phase floor breach)`.

#### Test Execution

> **Feature File:** [SP-022](05--framework-selection/004-framework-switch-mid-flight.md)

---

## 12. ESCALATION TIERS (`SP-023..SP-026`)

### SP-023 | `cli_prompt_quality_card.md` 5-question fast path

#### Description

Verify that the fast-path card runs its 5-question CLEAR check inline without escalating to `@prompt-improver` for low-complexity routine prompts.

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch a routine low-complexity prompt and apply the cli_prompt_quality_card 5-question CLEAR check inline. Verify no @prompt-improver dispatch occurs and the card passes the prompt as-is or with minor adjustment.`

Fast-path execution: inline. Desired outcome: no agent escalation.

Desired user-visible outcome: Notice "Fast-path: 5/5 CLEAR questions passed; dispatching as-is" with no `@prompt-improver` invocation.

#### Test Execution

> **Feature File:** [SP-023](06--escalation-tiers/001-cli-card-five-question-fast-path.md)

### SP-024 | Escalation triggers (complexity / compliance / multi-stakeholder / ambiguity)

#### Description

Verify that any of (complexity >= 7, compliance constraints, multi-stakeholder audience, ambiguity) triggers escalation to `@prompt-improver`.

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch four prompts: one at complexity 8, one with HIPAA compliance language, one with three named stakeholders, and one deeply ambiguous. Verify each one escalates to @prompt-improver rather than running fast-path.`

Escalation count: 4/4. Desired outcome: all four trigger deep path.

Desired user-visible outcome: Four routing decisions logged as `Escalation: @prompt-improver (<trigger reason>)`.

#### Test Execution

> **Feature File:** [SP-024](06--escalation-tiers/002-escalation-trigger-thresholds.md)

### SP-025 | `@prompt-improver` input payload contract

#### Description

Verify that `@prompt-improver` accepts the input payload with required `raw_task` and the four optional fields (`task_type`, `target_cli`, `complexity_hint`, `constraints`).

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch @prompt-improver with raw_task plus all four optional fields populated. Verify the agent accepts the payload, returns the structured output block, and preserves caller-supplied constraints.`

Payload accepted: yes. Constraints preserved: yes.

Desired user-visible outcome: Structured output block listing FRAMEWORK / CLEAR_SCORE / RATIONALE / ENHANCED_PROMPT / ESCALATION_NOTES with caller constraints visible inside ENHANCED_PROMPT.

#### Test Execution

> **Feature File:** [SP-025](06--escalation-tiers/003-prompt-improver-input-payload.md)

### SP-026 | `@prompt-improver` structured output block

#### Description

Verify that every `@prompt-improver` return contains the five-block contract: FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, ESCALATION_NOTES.

#### Scenario Contract

Prompt: `As a CLI orchestrator, dispatch @prompt-improver and verify the return contains exactly the FRAMEWORK / CLEAR_SCORE / RATIONALE / ENHANCED_PROMPT / ESCALATION_NOTES block specified in SKILL.md §7.`

Output-block coverage: 5/5 fields. Desired outcome: ready-for-CLI-handoff structure.

Desired user-visible outcome: Five labelled fields present, ENHANCED_PROMPT multi-line, ESCALATION_NOTES non-empty when ambiguity exists.

#### Test Execution

> **Feature File:** [SP-026](06--escalation-tiers/004-prompt-improver-output-block.md)

---

## 13. FORMAT MODES (`SP-027..SP-028`)

### SP-027 | `$json` / `$yaml` / markdown delivery in correct format

#### Description

Verify that `$json`, `$yaml`, and default markdown modes deliver enhanced prompts in the correct structural format with format-specific scaffolding.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt with the same underlying request three times under $json, $yaml, and default modes. Verify each delivers a syntactically valid prompt in the corresponding format with the correct scaffold (object keys for JSON, indented mapping for YAML, fenced sections for Markdown).`

Format compliance: 3/3. Desired outcome: format-correct enhanced prompts.

Desired user-visible outcome: Three enhanced prompts that parse as valid JSON, YAML, and Markdown respectively.

#### Test Execution

> **Feature File:** [SP-027](07--format-modes/001-format-mode-delivery.md)

### SP-028 | Format-guide assets loaded only on demand

#### Description

Verify that `assets/format_guide_json.md`, `format_guide_yaml.md`, `format_guide_markdown.md` load only when both the format-mode prefix is set and the ON_DEMAND keyword is matched in the request.

#### Scenario Contract

Prompt: `As a prompt engineer, run sk-prompt under $json mode twice: once with no ON_DEMAND keyword, once with "format guide" present. Verify format_guide_json.md loads only in the second run.`

Conditional load: yes. Desired outcome: token-efficient resource loading.

Desired user-visible outcome: Routing trace listing `format_guide_json.md` only on the second run.

#### Test Execution

> **Feature File:** [SP-028](07--format-modes/002-format-guide-on-demand.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| _none ship with sk-prompt at this time_ | n/a | n/a |

`sk-prompt` does not ship automated test modules. All validation runs through this manual playbook plus the `validate_document.py` structural check on the root playbook. When automated tests are added (for example a smart-router unit-test suite), update this table with module path and overlapping scenario IDs.

---

## 15. FEATURE CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| SP-001 | Default mode routing | Mode Detection | [SP-001](01--mode-detection/001-default-mode-routing.md) |
| SP-002 | `$raw` passthrough | Mode Detection | [SP-002](01--mode-detection/002-raw-mode-passthrough.md) |
| SP-003 | `$short` 3-round DEPTH | Mode Detection | [SP-003](01--mode-detection/003-short-mode-three-rounds.md) |
| SP-004 | Mode prefix vs keyword collision | Mode Detection | [SP-004](01--mode-detection/004-mode-prefix-keyword-collision.md) |
| SP-005 | INTENT_MODEL keyword scoring | Smart Routing | [SP-005](02--smart-routing/001-intent-model-keyword-scoring.md) |
| SP-006 | ON_DEMAND keyword loading | Smart Routing | [SP-006](02--smart-routing/002-on-demand-keyword-loading.md) |
| SP-007 | AMBIGUITY_DELTA tiebreaker | Smart Routing | [SP-007](02--smart-routing/003-ambiguity-delta-tiebreaker.md) |
| SP-008 | UNKNOWN_FALLBACK checklist | Smart Routing | [SP-008](02--smart-routing/004-unknown-fallback-checklist.md) |
| SP-009 | DEPTH 5-phase order | DEPTH+CLEAR Loop | [SP-009](03--depth-clear-loop/001-depth-five-phases-order.md) |
| SP-010 | Perspectives floor (3) | DEPTH+CLEAR Loop | [SP-010](03--depth-clear-loop/002-perspectives-floor-three.md) |
| SP-011 | DEPTH iteration cap (3) | DEPTH+CLEAR Loop | [SP-011](03--depth-clear-loop/003-depth-iteration-cap.md) |
| SP-012 | RICCE validation gate | DEPTH+CLEAR Loop | [SP-012](03--depth-clear-loop/004-ricce-validation-gate.md) |
| SP-013 | Mechanism-first prototype | DEPTH+CLEAR Loop | [SP-013](03--depth-clear-loop/005-mechanism-first-prototype.md) |
| SP-014 | Phase exit gate blocking | DEPTH+CLEAR Loop | [SP-014](03--depth-clear-loop/006-phase-exit-gate-blocking.md) |
| SP-015 | CLEAR five dimensions | CLEAR Scoring | [SP-015](04--clear-scoring/001-clear-five-dimensions.md) |
| SP-016 | Dimension floors block | CLEAR Scoring | [SP-016](04--clear-scoring/002-dimension-floors-block.md) |
| SP-017 | 40/50 threshold + 3-cap | CLEAR Scoring | [SP-017](04--clear-scoring/003-forty-of-fifty-threshold.md) |
| SP-018 | Per-dimension rationale | CLEAR Scoring | [SP-018](04--clear-scoring/004-dimension-drilldown-rationale.md) |
| SP-019 | Framework by complexity | Framework Selection | [SP-019](05--framework-selection/001-framework-by-complexity.md) |
| SP-020 | User-named framework override | Framework Selection | [SP-020](05--framework-selection/002-user-named-framework-override.md) |
| SP-021 | Framework rationale required | Framework Selection | [SP-021](05--framework-selection/003-framework-rationale-required.md) |
| SP-022 | Framework switch mid-flight | Framework Selection | [SP-022](05--framework-selection/004-framework-switch-mid-flight.md) |
| SP-023 | CLI card 5-question fast path | Escalation Tiers | [SP-023](06--escalation-tiers/001-cli-card-five-question-fast-path.md) |
| SP-024 | Escalation trigger thresholds | Escalation Tiers | [SP-024](06--escalation-tiers/002-escalation-trigger-thresholds.md) |
| SP-025 | `@prompt-improver` input payload | Escalation Tiers | [SP-025](06--escalation-tiers/003-prompt-improver-input-payload.md) |
| SP-026 | `@prompt-improver` output block | Escalation Tiers | [SP-026](06--escalation-tiers/004-prompt-improver-output-block.md) |
| SP-027 | Format mode delivery | Format Modes | [SP-027](07--format-modes/001-format-mode-delivery.md) |
| SP-028 | Format guide on-demand | Format Modes | [SP-028](07--format-modes/002-format-guide-on-demand.md) |
