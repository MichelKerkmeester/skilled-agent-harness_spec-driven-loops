---
title: "SP-009 -- DEPTH executes 5 phases in mandatory order"
description: "This scenario validates DEPTH phase ordering for `SP-009`. It focuses on proving D->E->P->T->H execution without shortcuts."
version: 2.3.0.5
---

# SP-009 -- DEPTH executes 5 phases in mandatory order

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SP-009`.

---

## 1. OVERVIEW

This scenario validates that standard sk-prompt enhancement runs the DEPTH phases in the mandatory Discover, Engineer, Prototype, Test, Harmonize order. The operator uses a realistic legal-contract summarization prompt and checks that `@prompt-improver` exposes per-phase evidence in order.

### Why This Matters

DEPTH order is the backbone of sk-prompt quality control. If phases reorder or skip, later CLEAR and RICCE claims are no longer trustworthy.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SP-009` and confirm the expected signals without contradictory evidence.

- Objective: Confirm default DEPTH execution follows Discover -> Engineer -> Prototype -> Test -> Harmonize.
- Real user request: `I'm crafting a prompt to summarize legal contracts — ensure it goes through every DEPTH phase, no shortcuts.`
- Prompt: `Improve my legal-contract summarization prompt with @prompt-improver; verify DEPTH runs Discover through Harmonize in order with no skipped phase.`
- Expected execution process: sk-prompt detects standard enhancement, `@prompt-improver` loads DEPTH and CLEAR references, runs D-E-P-T-H in order, and records one observable result for each phase.
- Expected signals: Phase log contains Discover before Engineer before Prototype before Test before Harmonize; no missing phase; no duplicate out-of-order phase.
- Desired user-visible outcome: Enhanced prompt plus transparency report stating `DEPTH phase order: Discover -> Engineer -> Prototype -> Test -> Harmonize`.
- Pass/fail: PASS if all five phases appear once in order; FAIL if any phase is missing, skipped, renamed ambiguously, duplicated out of order, or contradicted by the execution log.

---

## 3. TEST EXECUTION

### Prompt

```
Improve my legal-contract summarization prompt with @prompt-improver; verify DEPTH runs Discover through Harmonize in order with no skipped phase.
```

### Commands

1. `sk-prompt: I'm crafting a prompt to summarize legal contracts — ensure it goes through every DEPTH phase, no shortcuts.`
2. `agent: @prompt-improver raw_task="Improve a prompt for summarizing legal contracts while proving every DEPTH phase runs in order." task_type=generation target_cli=opencode complexity_hint=8 constraints="Show phase-order evidence."`
3. `bash: rg 'Phase Exit Criteria|D -- DISCOVER|E -- ENGINEER|P -- PROTOTYPE|T -- TEST|H -- HARMONIZE' .opencode/skills/sk-prompt/references/depth_framework.md`

### Expected

The response lists the five DEPTH phases in D-E-P-T-H order, includes an enhanced legal-contract summarization prompt, and includes CLEAR scoring after Test.

### Evidence

Capture the full `@prompt-improver` response, the phase-order transparency report, and the `rg` output proving source phase names.

### Pass / Fail

- **Pass**: Phase log shows Discover -> Engineer -> Prototype -> Test -> Harmonize, with one outcome per phase.
- **Fail**: Any phase is absent, out of order, skipped, or replaced with an unrelated process label.

### Failure Triage

1. Confirm the operator request did not use `$short` or `$raw`, which intentionally changes phase behavior.
2. Inspect `references/depth_framework.md` Phase Exit Criteria for the canonical order.
3. Re-run through `@prompt-improver` with `constraints="include explicit phase log"` and compare ordering.

### Optional Supplemental Checks

Check that CLEAR scoring appears only after the Test phase, not before Prototype completes.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../SKILL.md` | sk-prompt skill source: §3 enhancement pipeline, §7 `@prompt-improver` contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../references/depth_framework.md` | DEPTH phase definitions and mandatory exit criteria |
| `../../references/patterns_evaluation.md` | CLEAR scoring reference used at Test phase |

---

## 5. SOURCE METADATA

- Group: DEPTH+CLEAR Loop
- Playbook ID: SP-009
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `03--depth-clear-loop/depth-five-phases-order.md`
