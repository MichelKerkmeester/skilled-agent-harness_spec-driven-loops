---
title: "interface: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review and orchestration guidance, execution expectations, and per-feature validation files for the interface skill."
version: 1.6.0.0
---

# interface: Manual Testing Playbook

> **EXECUTION POLICY**: Every scenario MUST be executed against the live `interface` skill and its on-disk references, scripts, and data. No mocks, no stubs, and no "unautomatable" verdicts. Acceptable verdicts are PASS, PARTIAL, FAIL, or SKIP with a concrete sandbox or tool-availability blocker.

This document combines the full manual-validation contract for the `interface` skill into one reference. The root playbook acts as the operator directory, review protocol, and orchestration guide, while the per-feature files carry scenario-specific execution truth for distinctive, intentional interface-design behavior.

---

This playbook package adopts the split-document pattern for the `design-interface` skill. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the numbered category folders at the playbook root.

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--direction-freedom-and-deviation/`
- `02--brief-pinning-and-precedence/`
- `03--quality-floor-gate/`
- `04--system-as-critique-against/`
- `05--abstention-and-routing/`
- `06--licensing-and-provenance/`
- `07--real-ui-loop/`
- `08--design-references-routing/`
- `09--mechanical-preflight-card/`
- `10--mechanical-layout-gate/`
- `11--content-and-mock-data-gate/`
- `12--brief-to-dials-intake/`

---

## 1. OVERVIEW

This playbook provides 17 deterministic scenarios across 13 categories validating the `interface` skill surface. Each scenario maps to a dedicated per-feature file with exact prompt, command sequence, expected signals, evidence, pass/fail criteria, and failure triage.

Coverage note (2026-06-26): the playbook covers the free-axis brainstorm-critique-deviate process against the three named AI-default clusters, brief-pinning precedence where the brief always wins, the objective quality-floor gate sourced from `ux_quality_reference.md`, the system-as-critique-against use where a real design system is read live as the default to deviate from with a negative control that it is never surfaced as a chooser and never copied, abstention and routing to `sk-code` for pure-logic work and to `sk-doc` for documentation work, licensing and provenance integrity confirming the skill is Apache-2.0 only with no vendored MIT material remaining, the real-UI loop covering reuse-before-generate when a design system is present, the render fidelity check gated on the quality floor and the anti-default critique, and the guarded native-image visual-direction branch for net-new, ambiguous, or image-led work with approval before code, and the design-references hybrid initiative/ask routing where the skill pulls one real-world Mobbin or Refero reference on its own initiative when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or unknown, and falls back to the generic process otherwise, with a negative control that it is never a chooser and never copied. It also covers the mechanical pre-flight card walked box by box as the binary last filter before delivery, the mechanical layout gate where the hero lines, bento cells, and eyebrows are counted and button contrast is computed against the real background, the copy and mock-data content gate swept over the real strings for lorem, AI-tell phrasing, fake precision, one copy register, and image-seed discipline, and the brief-to-dials Design Read intake that reads a brief into the variance, motion, and density dials after the register posture is set with a negative control that the dials are never surfaced as a chooser. Per-feature files anchor directly to `SKILL.md`, the `references/` docs, and `assets/interface_preflight_card.md`.

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
2. `.opencode/skills/sk-design/design-interface/SKILL.md` and all files under `.opencode/skills/sk-design/design-interface/references/` resolve on disk.
3. `.opencode/skills/sk-design/design-interface/LICENSE.txt` resolves on disk and is the skill's single Apache-2.0 license.
4. The operator can run `python3`, `rg`, and `git diff` from the repository root.
5. Routing scenarios assume `sk-code` and `sk-doc` are installed under `.opencode/skills/`; the design-system grounding scenario assumes a real design system you own is available to read live, the render fidelity scenario assumes `mcp-chrome-devtools`, and the design-references routing scenario assumes the Mobbin or Refero MCPs resolve through Code Mode with a connected subscription for its initiative path (its fall-back path stays exercisable without one), otherwise record SKIP with the missing dependency.
6. The mechanical pre-flight card, the mechanical layout gate, and the content gate each assume the operator supplies a real built or planned UI as the fixture so the boxes, counts, and sweeps run against a concrete render. The brief-to-dials intake assumes a concrete brief is supplied so the dials read from real signals.
7. No scenario writes design-system files, copies any external design-system content into the skill, or edits the skill's reference files. Any such mutation is contradictory evidence.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Exact user request used
- Exact operator or orchestrator prompt used
- Command transcript, including exit status where a command is executed
- Design plan, gate result, or routing decision produced
- The expected-default pattern named when a scenario critiques against the data
- Source-reference mapping to `SKILL.md`, `references/design-process/design_principles.md`, `references/design-process/ux_quality_reference.md`, or `references/design-grounding/design_inventory.md`
- Routing notes when the workflow hands off to `sk-code` or `sk-doc`
- Final scenario verdict with rationale: PASS, PARTIAL, FAIL, or SKIP

---

## 4. DETERMINISTIC COMMAND NOTATION

- Bash commands shown as `bash: <command>`.
- Skill-routing decisions shown as `route: -> <skill-name>`.
- Agent prompts shown as `agent: <instruction>`.
- `->` separates sequential steps inside one deterministic command sequence.
- All reads of a real design system are live and read-only. Any generated design-system file, copied external design-system content, or edited reference is contradictory evidence.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual_testing_playbook.md`
2. Referenced per-feature files under `manual_testing_playbook/NN--category-name/`
3. Scenario execution evidence from section 3
4. Feature-to-scenario coverage map from section 20
5. Triage notes for every PARTIAL, FAIL, or SKIP verdict

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present without contradictory evidence.
4. Evidence is complete and readable.
5. Pass/fail criteria cite the relevant `interface` source file.
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
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files (`COVERED_FEATURES == TOTAL_FEATURES == 17`).
4. No unresolved blocking triage item remains.
5. No scenario exposed a generator or persistence surface and no scenario overrode a pinned brief.

### Root-vs-Feature Rule

Keep global verdict logic in this root playbook. Put scenario-specific caveats, fixture assumptions, and source anchors in the matching per-feature files.

### Release Review Checklist

Before declaring this playbook release-ready, confirm:

1. Root validator is clean.
2. Per-feature structural sweep checks all 15 files.
3. No forbidden sidecars exist.
4. Every table row has exactly 9 columns.
5. Every scenario prompt is realistic per the RCAF-vs-natural-human heuristic in sk-doc creation reference section 5.
6. Every SCENARIO CONTRACT prompt equals its table prompt.
7. Every pass/fail rule cites a real interface source file.
8. The system-as-critique-against scenario records both the named default look and the no-chooser, no-cache negative control.
9. The licensing scenario records the actual provenance state honestly, confirming the skill is Apache-2.0 only with no vendored MIT material remaining.
10. The real-UI loop scenarios record their negative controls: no style-preset menu for reuse-before-generate, no finished-design claim from a build that never rendered or a file write with no visible UI for the fidelity check, and no native-image direction branch unless the work is net-new, ambiguous, or image-led with approval before code.
11. The design-references routing scenario records its three branches (initiative, ask, fall-back), the Mobbin-vs-Refero source pick, and its negative control: no chooser or gallery, no copied or cached reference, read live, and grounding kept upstream.
12. The mechanical pre-flight card scenario records the filled context table, a binary mark on every box, the failing box numbers, and a SHIP verdict reached only with zero failing boxes.
13. The mechanical layout gate scenario records the counted hero lines, bento cells, and eyebrows against the `ceil(sectionCount / 3)` ceiling, with button contrast computed against the real background rather than assumed white.
14. The content gate scenario records the sweeps run over the real strings, every number listed with its grounding, and the single copy register named and matched to the posture.
15. The brief-to-dials intake scenario records the register posture set first, the one-line Design Read with the three dial values, and its negative control: the dials kept internal and never surfaced as a chooser.
16. The redesign intake scenario records the greenfield, preserve or overhaul lane and every approval-gated item before any visual change.
17. The final report separates playbook defects from interface product defects.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for executing the 17-scenario design battery. It is not a runtime support matrix by itself.

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
| 2 | Quality floor + system critique | ID-003, ID-004 | The objective gate reads on-disk references while the critique-against scenario reads one real design system live, and both are read-only and isolate cleanly |
| 3 | Abstention and routing | ID-005, ID-006 | Routing away from non-visual work is read-only and isolates from the design path |
| 4 | Real-UI loop | ID-008, ID-009, ID-017 | Reuse-before-generate, the fidelity check, and the guarded native-image branch share the real-UI loop protocol and the render surface |
| 5 | Design-references routing | ID-010 | The initiative/ask/fall-back gate reads one design-references doc and exercises a paid-lookup decision, so it runs in its own wave to isolate the subscription-status branch |
| 6 | Mechanical pre-flight + layout + content gates | ID-011, ID-012, ID-013 | The three delivery gates all read on-disk references against one supplied built UI fixture, so they share the render fixture and isolate cleanly |
| 7 | Brief-to-dials intake | ID-014 | The Design Read intake reads a brief into the dials after the register posture, so it runs with the other intake-shaped checks and isolates the dial calibration |
| 8 | Redesign intake | ID-015 | Redesign classification protects existing URLs, nav labels, form fields, legal copy and locked tokens before the visual pass |
| 9 | Licensing and provenance | ID-007 | Provenance integrity is a static-inspection check and runs last |

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

Reading a matching real design system live returns one realized look for a subject, which is then deviated from rather than copied, with a negative control proving it is never surfaced as a chooser menu and never cached into the skill.

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

Provenance is intact: the vendored Apache-2.0 principles are unchanged from upstream, `LICENSE.txt` resolves on disk, and a de-vendor grep confirms no vendored MIT data, search-script, vendored-license, or third party notice material remains, so the skill is Apache-2.0 only.

#### Scenario Contract

Prompt: `Confirm the design data and principles in this skill are properly licensed and attributed before we ship it.`

Desired user-visible outcome: A provenance report confirming `design_principles.md` is unchanged Apache-2.0 content, `LICENSE.txt` is present, and the skill is Apache-2.0 only with no vendored MIT material or notices remaining.

#### Test Execution

> **Feature File:** [ID-007](06--licensing-and-provenance/licensing-and-provenance-integrity.md)

---

## 13. REAL-UI LOOP (ID-008, ID-009, ID-017)

This category covers 3 scenarios while the linked feature files remain the canonical execution contract.

### ID-008 | Reuse before generate when a design system is present

#### Description

When a design system is present, the real-UI loop searches the system's registered components and tokens before authoring net-new, with a negative control proving no style-preset or pick-a-vibe menu exists.

#### Scenario Contract

Prompt: `Build this pricing section using our existing design system; reuse the components and tokens we already have before making anything new.`

Desired user-visible outcome: A result that reuses the system's components and tokens where they fit, justifies any net-new authoring against the gap, and offers no choosable style axis.

#### Test Execution

> **Feature File:** [ID-008](07--real-ui-loop/reuse-before-generate-with-design-system.md)

### ID-009 | Render fidelity check gated on the quality floor and anti-default critique

#### Description

The fidelity check inspects the dev-server build's render via an `mcp-chrome-devtools` screenshot and judges it against the quality floor and the anti-default critique, with a negative control proving a design is not claimed from a build that never rendered or a file write with no visible UI.

#### Scenario Contract

Prompt: `Verify the built UI actually rendered a design that matches the intent, and tell me if it clears our quality bar.`

Desired user-visible outcome: A fidelity verdict over the real render that names the quality-floor result and the anti-default result, with no pixel-diff claim and no design claimed from a build that never rendered.

#### Test Execution

> **Feature File:** [ID-009](07--real-ui-loop/render-fidelity-check.md)

### ID-017 | Guarded native-image visual-direction branch

#### Description

The native-image branch runs only for net-new, ambiguous, or image-led mid-fidelity work when image generation is available, confirms the palette first, creates 1-3 brief-specific mock directions, critiques them, and waits for approval before code.

#### Scenario Contract

Prompt: `This is a net-new image-led landing page. Use native image generation to explore the visual direction before writing code.`

Desired user-visible outcome: A compact visual-direction packet with guarded-condition proof, palette, 1-3 mock directions, critique, approval request, and no implementation started from an unapproved image direction.

#### Test Execution

> **Feature File:** [ID-017](07--real-ui-loop/native-image-visual-direction-branch.md)

---

## 14. DESIGN-REFERENCES ROUTING (ID-010)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-010 | Design-references initiative/ask routing for Mobbin and Refero

#### Description

The hybrid initiative/ask routing pulls ONE real-world Mobbin or Refero reference on its own initiative when a convention-heavy category benefits and a subscription is connected, asks the user when borderline or the subscription is unknown, and falls back to the generic anti-default process otherwise, picking Mobbin for app/iOS and Refero for web/styles, with a negative control proving it is never a chooser and never copied.

#### Scenario Contract

Prompt: `Design the checkout flow for our new payments app; ground it against the real-world default for this kind of screen, then deviate deliberately.`

Desired user-visible outcome: A single named real-world default with its cited URL when the initiative path runs, an explicit one-line ask before any paid lookup when borderline or unknown, a clean non-blocking fall-back when not connected or declined, the correct Mobbin-vs-Refero source pick, and confirmation that no chooser is offered, nothing is copied, and grounding stays upstream.

#### Test Execution

> **Feature File:** [ID-010](08--design-references-routing/initiative-ask-fallback-routing.md)

---

## 15. MECHANICAL PRE-FLIGHT CARD (ID-011)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-011 | Mechanical pre-flight card on a built UI

#### Description

A built or planned interface is walked box by box against the binary fill-in card in `assets/interface_preflight_card.md`, the context is recorded, and the verdict is SHIP only when every box passes, with the register and dials setting context without relaxing any mechanical box.

#### Scenario Contract

Prompt: `Run the interface pre-flight card over this built page and give me a SHIP or FIX verdict with the failing box numbers.`

Desired user-visible outcome: A filled pre-flight card with a binary mark on every box, the context recorded, the failing box numbers listed, and a SHIP verdict reached only when no box fails.

#### Test Execution

> **Feature File:** [ID-011](09--mechanical-preflight-card/preflight-card-on-built-ui.md)

---

## 16. MECHANICAL LAYOUT GATE (ID-012)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-012 | Mechanical layout gate on a built UI

#### Description

A built UI is graded against the countable layout rules in `references/design-process/mechanical_defaults.md` across the hero line count, gapless bento math, the eyebrow ceiling, button contrast, and section spacing, where each check is binary and counted rather than estimated.

#### Scenario Contract

Prompt: `Run the mechanical layout gate over this built page: count the hero lines, the bento cells, the eyebrows, and check button contrast, then tell me what fails.`

Desired user-visible outcome: A pass/fail layout report keyed to the `mechanical_defaults.md` rules, with the countable checks shown as actual counts, each failing rule named, and a concrete fix for each.

#### Test Execution

> **Feature File:** [ID-012](10--mechanical-layout-gate/mechanical-layout-gate-on-built-ui.md)

---

## 17. CONTENT AND MOCK-DATA GATE (ID-013)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-013 | Content and mock-data gate on a built UI

#### Description

A built UI is swept against `references/design-process/copy_and_mock_data.md` across no lorem, no AI-tell phrasing, plausible names and numbers, one copy register matched to the posture, and descriptive unique image seeds, where each check is a pass or fail sweep run over the real strings rather than from memory.

#### Scenario Contract

Prompt: `Sweep this built page for content tells: lorem, AI-tell phrasing, fake-precise numbers, mixed copy register, and lazy image seeds, then tell me what fails.`

Desired user-visible outcome: A pass/fail content report keyed to the `copy_and_mock_data.md` rules, each failing string or value named, the copy register stated, and a concrete fix for each finding.

#### Test Execution

> **Feature File:** [ID-013](11--content-and-mock-data-gate/content-and-mock-data-gate-on-built-ui.md)

---

## 18. BRIEF-TO-DIALS INTAKE (ID-014, ID-016)

This category covers 2 scenarios while the linked feature files remain the canonical execution contract.

### ID-014 | Brief read into the variance, motion, and density dials

#### Description

A brief is read into the three working dials of variance, motion, and density after the register posture is set, the one-line Design Read states the values, and the dials stay an internal calibration the agent sets rather than a style chooser surfaced to the user.

#### Scenario Contract

Prompt: `Read this premium cookware landing brief into the variance, motion, and density dials and state your one-line Design Read before you design.`

Desired user-visible outcome: A one-line Design Read that names the subject, the posture, and the three dial values, with the dials used as internal calibration and never offered to the user as a style menu.

#### Test Execution

> **Feature File:** [ID-014](12--brief-to-dials-intake/brief-read-into-dials.md)

### ID-016 | Register-first context gate on a UI build

#### Description

A UI build request sets the Brand-vs-Product register and dials before palette, layout, motion, copy, or delivery language, names the loaded context bundle, and refuses to proceed when those proof fields are missing.

#### Scenario Contract

Prompt: `Design a dense operations dashboard for incident commanders and show the register, dials, and loaded context before any visual choices.`

Desired user-visible outcome: A context-loaded card that sets Product register first, states the variance, motion, and density dials, names the required files from the shared context-loading contract, and blocks any palette, layout, motion, or copy decision until the register proof is present.

#### Test Execution

> **Feature File:** [ID-016](12--brief-to-dials-intake/register-first-context-gate.md)

---

## 19. REDESIGN INTAKE (ID-015)

This category covers 1 scenario while the linked feature file remains the canonical execution contract.

### ID-015 | Redesign intake classification

#### Description

An existing surface is classified as greenfield, preserve or overhaul before visual work begins. The intake protects URLs, nav labels, form fields, legal copy and locked tokens from silent change.

#### Scenario Contract

Prompt: `Redesign this account settings page, but do not surprise returning users. Classify the redesign lane before you change the UI.`

Desired user-visible outcome: A compact redesign intake that names the lane, approval-gated preserve list and next step before design work.

#### Test Execution

> **Feature File:** [ID-015](13--redesign-intake/redesign-intake-classification.md)

---

## 20. AUTOMATED TEST CROSS-REFERENCE

The current repository has no dedicated automated test module for `interface/manual_testing_playbook/`, and the sk-doc validator currently checks the root playbook only. The scenarios exercise the on-disk reference surface and a live design-system read directly.

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `references/design-grounding/design_inventory.md` | The reuse-ground and critique-against framing over a live design system; the no-chooser and no-cache hard rules | ID-004 |
| `references/design-process/ux_quality_reference.md` | Objective quality-floor rule set used as the pass/fail gate | ID-003, ID-009 |
| `references/design-process/real_ui_loop.md` | The shared real-UI loop: reuse-before-generate, the fidelity check, the guarded native-image branch, and the no-style-presets guardrail | ID-008, ID-009, ID-017 |
| `references/design-grounding/design_references_mcp.md` | The design-references initiative/ask/fall-back gate, the Mobbin-vs-Refero source pick, and the no-chooser, read-live, never-copied hard rules | ID-010 |
| `assets/interface_preflight_card.md` | The binary fill-in pre-flight card walked box by box as the last filter, with the SHIP-only-when-all-pass verdict | ID-011 |
| `references/design-process/mechanical_defaults.md` | The mechanical layout gate: counted hero lines, gapless bento math, the eyebrow ceiling, button contrast, and section spacing | ID-012 |
| `references/design-process/copy_and_mock_data.md` | The content gate: lorem and filler sweep, AI-tell phrasing, fake-precision rules, one copy register, and image-seed discipline | ID-013 |
| `../shared/context_loading_contract.md` | The shared context manifest and register/dials gate that blocks design decisions before loaded-file proof exists | ID-016 |
| `../shared/register.md` | The Brand-vs-Product operating posture that must be set before color, type, layout, motion, copy, or audit severity decisions | ID-016 |
| `references/design-process/brief_to_dials.md` | The Design Read intake that reads a brief into the variance, motion, and density dials with the no-chooser guard | ID-014, ID-016 |
| `references/design-process/redesign_intake.md` | The redesign classification gate and never-silently-change list for existing surfaces | ID-015 |

Validator limitation: per-feature file completeness requires the structural sweep described in this playbook until `validate_document.py` recurses into category folders.

---

## 21. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| ID-001 | Free-axis brainstorm critique and deliberate deviation | DIRECTION FREEDOM AND DEVIATION | [ID-001](01--direction-freedom-and-deviation/free-axis-brainstorm-and-deviation.md) |
| ID-002 | Pinned brief is followed verbatim | BRIEF PINNING AND PRECEDENCE | [ID-002](02--brief-pinning-and-precedence/pinned-brief-followed-verbatim.md) |
| ID-003 | Quality-floor gate on a built UI | QUALITY FLOOR GATE | [ID-003](03--quality-floor-gate/quality-floor-gate-on-built-ui.md) |
| ID-004 | Read a design system as the default, then deviate | SYSTEM AS CRITIQUE-AGAINST | [ID-004](04--system-as-critique-against/query-default-then-deviate.md) |
| ID-005 | Pure-logic task routes away to sk-code | ABSTENTION AND ROUTING | [ID-005](05--abstention-and-routing/pure-logic-routes-to-sk-code.md) |
| ID-006 | Documentation task routes away to sk-doc | ABSTENTION AND ROUTING | [ID-006](05--abstention-and-routing/docs-task-routes-to-sk-doc.md) |
| ID-007 | Licensing and provenance integrity | LICENSING AND PROVENANCE | [ID-007](06--licensing-and-provenance/licensing-and-provenance-integrity.md) |
| ID-008 | Reuse before generate when a design system is present | REAL-UI LOOP | [ID-008](07--real-ui-loop/reuse-before-generate-with-design-system.md) |
| ID-009 | Render fidelity check gated on the quality floor and anti-default critique | REAL-UI LOOP | [ID-009](07--real-ui-loop/render-fidelity-check.md) |
| ID-017 | Guarded native-image visual-direction branch | REAL-UI LOOP | [ID-017](07--real-ui-loop/native-image-visual-direction-branch.md) |
| ID-010 | Design-references initiative/ask routing for Mobbin and Refero | DESIGN-REFERENCES ROUTING | [ID-010](08--design-references-routing/initiative-ask-fallback-routing.md) |
| ID-011 | Mechanical pre-flight card on a built UI | MECHANICAL PRE-FLIGHT CARD | [ID-011](09--mechanical-preflight-card/preflight-card-on-built-ui.md) |
| ID-012 | Mechanical layout gate on a built UI | MECHANICAL LAYOUT GATE | [ID-012](10--mechanical-layout-gate/mechanical-layout-gate-on-built-ui.md) |
| ID-013 | Content and mock-data gate on a built UI | CONTENT AND MOCK-DATA GATE | [ID-013](11--content-and-mock-data-gate/content-and-mock-data-gate-on-built-ui.md) |
| ID-014 | Brief read into the variance, motion, and density dials | BRIEF-TO-DIALS INTAKE | [ID-014](12--brief-to-dials-intake/brief-read-into-dials.md) |
| ID-015 | Redesign intake classification | REDESIGN INTAKE | [ID-015](13--redesign-intake/redesign-intake-classification.md) |
| ID-016 | Register-first context gate on a UI build | BRIEF-TO-DIALS INTAKE | [ID-016](12--brief-to-dials-intake/register-first-context-gate.md) |
