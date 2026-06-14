---
title: "sk-interface-design: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the sk-interface-design skill."
---

# sk-interface-design: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `sk-interface-design` skill and its on-disk references, scripts, and data. No mocks, no stubs, and no "unautomatable" verdicts. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete sandbox or tool-availability blocker.

This document combines the full manual-validation contract for the `sk-interface-design` skill into one reference. The root playbook acts as the operator directory, review protocol, and orchestration guide, while the per-feature files carry scenario-specific execution truth for distinctive, intentional interface-design behavior.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-interface-design` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--direction-freedom-and-deviation/`
- `02--brief-pinning-and-precedence/`
- `03--quality-floor-gate/`
- `04--system-as-critique-against/`
- `05--abstention-and-routing/`
- `06--licensing-and-provenance/`
- `07--claude-design-parity/`

---

## 1. OVERVIEW

This playbook provides 9 deterministic scenarios across 7 categories validating the `sk-interface-design` skill surface. Each scenario maps to a dedicated per-feature file with exact prompt, command sequence, expected signals, evidence, pass/fail criteria, and failure triage.

Coverage note (2026-06-14): the playbook covers the free-axis brainstorm-critique-deviate process against the three named AI-default clusters, brief-pinning precedence where the brief always wins, the objective quality-floor gate sourced from `ux_quality_reference.md`, the system-as-critique-against use where a real Open Design system is read live as the default to deviate from with a negative control that it is never surfaced as a chooser and never copied, abstention and routing to `sk-code` for pure-logic work and to `sk-doc` for documentation work, licensing and provenance integrity confirming the skill is Apache-2.0 only with no vendored MIT material remaining, and the Claude Design parity loop covering reuse-before-generate when a design system is present and the `previewImageUrl` fidelity check gated on the quality floor and the anti-default critique, each with a negative control. Per-feature files anchor directly to `SKILL.md`, the `references/` docs, and the `feature_catalog/` entries on disk.

### Realistic Test Model

1. A realistic design request is given to an orchestrator.
2. The orchestrator decides whether to plan the look locally, hand implementation to `sk-code`, or route away from a non-visual task.
3. The operator captures the exact prompt, command transcript, the design plan or routing decision, and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned plan, gate result, or routing decision would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The operator or orchestrator-facing prompt using the canonical scenario voice
- The expected execution process, including routing to `sk-code` or `sk-doc` when relevant
- The desired user-visible outcome
- The source anchors that justify pass/fail criteria

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root.
2. `.opencode/skills/sk-interface-design/SKILL.md` and all files under `.opencode/skills/sk-interface-design/references/` resolve on disk.
3. `.opencode/skills/sk-interface-design/LICENSE.txt` resolves on disk and is the skill's single Apache-2.0 license.
4. The operator can run `python3`, `rg`, and `git diff` from the repository root.
5. Routing scenarios assume `sk-code` and `sk-doc` are installed under `.opencode/skills/`; the Open Design grounding scenario assumes `mcp-open-design` and the Open Design app, otherwise record SKIP with the missing skill or app path.
6. No scenario writes design-system files, copies any Open Design content into the skill, or edits the skill's reference files. Any such mutation is contradictory evidence.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Exact user request used
- Exact operator or orchestrator prompt used
- Command transcript, including exit status where a command is executed
- Design plan, gate result, or routing decision produced
- The expected-default pattern named when a scenario critiques against the data
- Source-reference mapping to `SKILL.md`, `references/design_principles.md`, `references/ux_quality_reference.md`, or `references/design_inventory.md`
- Routing notes when the workflow hands off to `sk-code` or `sk-doc`
- Final scenario verdict with rationale: PASS, PARTIAL, FAIL, or SKIP

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Skill-routing decisions shown as `route: -> <skill-name>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps inside one deterministic command sequence.
- All reads of an Open Design system are live and read-only. Any generated design-system file, copied Open Design content, or edited reference is contradictory evidence.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence from section 3
4. Feature-to-scenario coverage map from section 13
5. Triage notes for every PARTIAL, FAIL, or SKIP verdict

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present without contradictory evidence.
4. Evidence is complete and readable.
5. Pass/fail criteria cite the relevant `sk-interface-design` source file.
6. Outcome rationale is explicit and useful to a real user.

Scenario verdict:
- `PASS`: all acceptance checks true
- `PARTIAL`: core behavior works but non-critical evidence or metadata is incomplete
- `FAIL`: expected behavior missing, contradictory output, brief override, generator or persistence use, or critical evidence missing
- `SKIP`: execution blocked by a named sandbox, missing skill, or unavailable fixture

### Feature Verdict Rules

- `PASS`: the mapped scenario is PASS.
- `PARTIAL`: the mapped scenario is PARTIAL and no critical check failed.
- `FAIL`: the mapped scenario is FAIL.

Hard rule:
- Any critical-path scenario FAIL (ID-001, ID-002, ID-003, ID-004) blocks release readiness.

### Release Readiness Rule

Release is READY only when:

1. No feature verdict is FAIL.
2. All critical-path scenarios are PASS or explicitly SKIP for environment-only reasons.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES == 9`).
4. No unresolved blocking triage item remains.
5. No scenario exposed a generator or persistence surface and no scenario overrode a pinned brief.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put scenario-specific caveats, fixture assumptions, and source anchors in the matching per-feature files.

### Release Review Checklist

Before declaring this playbook release-ready, confirm:

1. Root validator is clean.
2. Per-feature structural sweep checks all 9 files.
3. No forbidden sidecars exist.
4. Every table row has exactly 9 columns.
5. Every scenario prompt is realistic per the RCAF-vs-natural-human heuristic in sk-doc creation reference section 5.
6. Every SCENARIO CONTRACT prompt equals its table prompt.
7. Every pass/fail rule cites a real sk-interface-design source file.
8. The system-as-critique-against scenario records both the named default look and the no-chooser, no-cache negative control.
9. The licensing scenario records the actual provenance state honestly, confirming the skill is Apache-2.0 only with no vendored MIT material remaining.
10. The parity scenarios record their negative controls: no style-preset menu for reuse-before-generate, and no session-gated browser screenshot for the fidelity check.
11. The final report separates playbook defects from sk-interface-design product defects.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for executing the 7-scenario design battery. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start: script availability, data-set presence, and the presence of `sk-code` and `sk-doc`.
2. Reserve one coordinator to maintain the verdict table and prompt-equality audit.
3. Saturate remaining worker slots only when scenarios use disjoint read-only scopes.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run the routing scenarios in a dedicated wave so the abstention decision can be compared against the same brief framing.
6. After each wave, save evidence paths and verdict rationale before starting the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### Suggested Waves

| Wave | Categories | Scenarios | Rationale |
|---|---|---|---|
| 1 | Direction freedom + brief pinning | ID-001, ID-002 | The deviate-vs-obey precedence pair is the core behavior and isolates cleanly |
| 2 | Quality floor + data critique | ID-003, ID-004 | The objective gate and the query-only lookup share script and data preconditions |
| 3 | Abstention and routing | ID-005, ID-006 | Routing away from non-visual work is read-only and isolates from the design path |
| 4 | Claude design parity | ID-008, ID-009 | Reuse-before-generate and the fidelity check share the parity protocol and the magicpath surface |
| 5 | Licensing and provenance | ID-007 | Provenance integrity is a static-inspection check and runs last |

### What Belongs In Per-Feature Files

- Real user request
- Prompt field with the canonical text for this scenario
- Expected design plan, gate result, or routing decision
- Expected handoff to `sk-code` or `sk-doc` when relevant
- Desired user-visible outcome
- Feature-specific acceptance caveats and source anchors

---

## 7. DIRECTION FREEDOM AND DEVIATION (ID-001)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-001 | Free-axis brainstorm critique and deliberate deviation

#### Description

A design task with free axes that must brainstorm a token system, critique it against the three AI-default clusters, and deviate deliberately rather than ship a templated default.

#### Scenario Contract

Prompt: `Design a landing page for an artisan letterpress studio; the brand has no fixed colors or fonts yet, so make it feel distinctive rather than generic.`

Desired user-visible outcome: A grounded design plan with a named token system whose free axes deviate deliberately from the three AI-default looks, each deviation justified against the brief.

#### Test Execution

> **Feature File:** [ID-001](01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md)

---

## 8. BRIEF PINNING AND PRECEDENCE (ID-002)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-002 | Pinned brief is followed verbatim

#### Description

A brief that pins the visual direction, including an AI-default look, must be followed verbatim and never overridden by the skill's deviation guidance.

#### Scenario Contract

Prompt: `Build the hero using exactly this direction: cream #F4F1EA background, a high-contrast serif display, and a terracotta accent. Do not change the palette.`

Desired user-visible outcome: A design plan that follows the pinned cream-serif-terracotta direction verbatim, with no substitution and no deviation argument applied to the pinned axes.

#### Test Execution

> **Feature File:** [ID-002](02--brief-pinning-and-precedence/pinned-brief-followed-verbatim.md)

---

## 9. QUALITY FLOOR GATE (ID-003)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-003 | Quality-floor gate on a built UI

#### Description

A built UI is checked against the objective quality floor in `ux_quality_reference.md` across contrast, focus, reduced motion, touch targets, and responsive behavior.

#### Scenario Contract

Prompt: `Check this finished landing page against the accessibility and quality floor and tell me what fails before I ship.`

Desired user-visible outcome: A pass/fail gate report keyed to the `ux_quality_reference.md` rules, naming each failing rule with the specific floor it breaks and how to fix it.

#### Test Execution

> **Feature File:** [ID-003](03--quality-floor-gate/quality-floor-gate-on-built-ui.md)

---

## 10. SYSTEM AS CRITIQUE-AGAINST (ID-004)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-004 | Read a design system as the default, then deviate

#### Description

Reading a matching Open Design system live via `mcp-open-design` returns one realized look for a subject, which is then deviated from rather than copied, with a negative control proving it is never surfaced as a chooser menu and never cached into the skill.

#### Scenario Contract

Prompt: `Look up the typical look for a luxury e-commerce site so we know the cliche, then propose something that deliberately moves off it.`

Desired user-visible outcome: A named expected-default look from a real system, a justified deviation away from it, and confirmation that the system is read live, resolved as one system rather than a chooser, and never copied into the skill.

#### Test Execution

> **Feature File:** [ID-004](04--system-as-critique-against/query-default-then-deviate.md)

---

## 11. ABSTENTION AND ROUTING (ID-005..ID-006)

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### ID-005 | Pure-logic task routes away to sk-code

#### Description

A pure-logic or back-end task with no visual surface routes away from the design skill to `sk-code` instead of producing a design plan.

#### Scenario Contract

Prompt: `Write a function that dedupes and sorts a list of order records by timestamp, then total the amounts per customer.`

Desired user-visible outcome: A clear routing decision that this is non-visual work for `sk-code`, with no palette, typography, or layout plan produced.

#### Test Execution

> **Feature File:** [ID-005](05--abstention-and-routing/pure-logic-routes-to-sk-code.md)

### ID-006 | Documentation task routes away to sk-doc

#### Description

A documentation or prose task with no interface surface routes away from the design skill to `sk-doc` instead of producing a design plan.

#### Scenario Contract

Prompt: `Write the README for this CLI tool: install steps, usage examples, and a troubleshooting section.`

Desired user-visible outcome: A clear routing decision that this is documentation work for `sk-doc`, with no design token system produced.

#### Test Execution

> **Feature File:** [ID-006](05--abstention-and-routing/docs-task-routes-to-sk-doc.md)

---

## 12. LICENSING AND PROVENANCE (ID-007)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-007 | Licensing and provenance integrity

#### Description

Provenance is intact: the vendored Apache-2.0 principles are unchanged from upstream and the MIT data and search are attributed, with the notices map verified against what is actually present on disk.

#### Scenario Contract

Prompt: `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.`

Desired user-visible outcome: A provenance report confirming `design_principles.md` is unchanged Apache-2.0 content, the data and search are MIT-attributed, and an honest note on whether the referenced notices file is present.

#### Test Execution

> **Feature File:** [ID-007](06--licensing-and-provenance/licensing-and-provenance-integrity.md)

---

## 13. CLAUDE DESIGN PARITY (ID-008..ID-009)

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### ID-008 | Reuse before generate when a design system is present

#### Description

When a design system is present, the parity loop searches the system's registered components and tokens before authoring net-new, with a negative control proving no style-preset or pick-a-vibe menu exists.

#### Scenario Contract

Prompt: `Build this pricing section using our existing design system; reuse the components and tokens we already have before making anything new.`

Desired user-visible outcome: A result that reuses the system's components and tokens where they fit, justifies any net-new authoring against the gap, and offers no choosable style axis.

#### Test Execution

> **Feature File:** [ID-008](07--claude-design-parity/reuse-before-generate-with-design-system.md)

### ID-009 | previewImageUrl fidelity check gated on the quality floor and anti-default critique

#### Description

The fidelity check fetches the backend-rendered `previewImageUrl` and judges it against the quality floor and the anti-default critique, with a negative control proving the check is not a browser screenshot of the session-gated canvas.

#### Scenario Contract

Prompt: `Verify the built MagicPath component matches the design intent using its rendered preview, and tell me if it clears our quality bar.`

Desired user-visible outcome: A fidelity verdict over the real render that names the quality-floor result and the anti-default result, with no pixel-diff claim and no browser screenshot of the hosted canvas.

#### Test Execution

> **Feature File:** [ID-009](07--claude-design-parity/preview-image-fidelity-check.md)

---

## 14. AUTOMATED TEST CROSS-REFERENCE

The current repository has no dedicated automated test module for `sk-interface-design/manual_testing_playbook/`, and the sk-doc validator currently checks the root playbook only. The scenarios exercise the on-disk reference surface and the live Open Design transport directly.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `references/design_inventory.md` | The reuse-ground and critique-against framing over a live Open Design system; the no-chooser and no-cache hard rules | ID-004 |
| `references/ux_quality_reference.md` | Objective quality-floor rule set used as the pass/fail gate | ID-003, ID-009 |
| `references/claude_design_parity.md` | The shared parity loop: reuse-before-generate, the fidelity check, and the no-style-presets guardrail | ID-008, ID-009 |
| `../mcp-magicpath/scripts/design_fidelity.py` | Query-only helper that fetches the backend-rendered preview for the fidelity check | ID-009 |

Validator limitation: per-feature file completeness requires the structural sweep described in this playbook until `validate_document.py` recurses into category folders.

---

## 15. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| ID-001 | Free-axis brainstorm critique and deliberate deviation | DIRECTION FREEDOM AND DEVIATION | [ID-001](01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md) |
| ID-002 | Pinned brief is followed verbatim | BRIEF PINNING AND PRECEDENCE | [ID-002](02--brief-pinning-and-precedence/pinned-brief-followed-verbatim.md) |
| ID-003 | Quality-floor gate on a built UI | QUALITY FLOOR GATE | [ID-003](03--quality-floor-gate/quality-floor-gate-on-built-ui.md) |
| ID-004 | Read a design system as the default, then deviate | SYSTEM AS CRITIQUE-AGAINST | [ID-004](04--system-as-critique-against/query-default-then-deviate.md) |
| ID-005 | Pure-logic task routes away to sk-code | ABSTENTION AND ROUTING | [ID-005](05--abstention-and-routing/pure-logic-routes-to-sk-code.md) |
| ID-006 | Documentation task routes away to sk-doc | ABSTENTION AND ROUTING | [ID-006](05--abstention-and-routing/docs-task-routes-to-sk-doc.md) |
| ID-007 | Licensing and provenance integrity | LICENSING AND PROVENANCE | [ID-007](06--licensing-and-provenance/licensing-and-provenance-integrity.md) |
| ID-008 | Reuse before generate when a design system is present | CLAUDE DESIGN PARITY | [ID-008](07--claude-design-parity/reuse-before-generate-with-design-system.md) |
| ID-009 | previewImageUrl fidelity check gated on the quality floor and anti-default critique | CLAUDE DESIGN PARITY | [ID-009](07--claude-design-parity/preview-image-fidelity-check.md) |
