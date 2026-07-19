---
title: "DAL-001 -- Invocation contract and forbidden patterns"
description: "Verify that SKILL.md documents one coherent deep-alignment invocation contract (argument-hint, exclusive command entry, FORBIDDEN/ALWAYS lists) matching the mode's read-only, lane-first, verify-first design."
version: 1.0.0.0
---

# DAL-001 -- Invocation contract and forbidden patterns

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DAL-001`.

---

## 1. OVERVIEW

This scenario validates the invocation contract for `DAL-001`. The objective is to verify that `SKILL.md`'s frontmatter argument-hint, its exclusive `/deep:alignment` entry rule, and its FORBIDDEN/ALWAYS lists together describe one coherent mode that is lane-first, verify-first, and read-only by default.

### WHY THIS MATTERS

The `/deep:alignment` command layer is not built yet (phase 009), so `SKILL.md` is the authoritative contract an operator or a dispatching agent reads to understand how the mode is meant to be driven. If the argument-hint, the exclusivity rule, and the forbidden-pattern list disagree, the mode can be mis-invoked (ad-hoc dispatchers, ungated remediation) before the command ever ships.

---

## 2. SCENARIO CONTRACT

Operators should run this as a real orchestrator-led check rather than a synthetic command-matrix exercise. The scenario is only complete when the operator can explain the behavior back to a user in plain language.

- Objective: Verify that SKILL.md documents one coherent invocation contract matching the mode's four invariants.
- Real user request: How am I supposed to launch a conformance audit against sk-doc, and what is it not allowed to do while running?
- Prompt: `Validate the deep-alignment invocation contract in SKILL.md and report whether the argument-hint, exclusive-command rule, and FORBIDDEN/ALWAYS lists agree with the mode's four invariants.`
- Expected execution process: Read the frontmatter argument-hint and allowed-tools first, then the FORBIDDEN INVOCATION PATTERNS block, then the RULES section, confirming each reinforces lane-first, verify-first, read-only, gated-remediation.
- Desired user-facing outcome: The user is told the mode is invoked exclusively via `/deep:alignment :auto|:confirm`, resolves lanes before discovering anything, re-verifies every finding, and never modifies audited artifacts outside a separate gated remediation pass.
- Expected signals: The argument-hint names `[target] [authority] [:auto|:confirm] [--lane-config <file.json>] [--max-iterations=N] [--convergence=N]`; the NEVER list forbids custom dispatchers, direct CLI loops, direct `@deep-alignment` Task dispatch, ad-hoc state, and ungated remediation; the ALWAYS list requires exclusive command invocation, lanes-before-discovery, per-finding re-verification, and a read-only default.
- Pass/fail posture: PASS if the argument-hint, exclusivity rule, and FORBIDDEN/ALWAYS lists are mutually consistent and map onto the four invariants. FAIL if any of them contradicts another or omits an invariant.

---

## 3. TEST EXECUTION

### RECOMMENDED ORCHESTRATION PROCESS

1. Restate the user request in plain language before inspecting implementation details.
2. Follow the listed command sequence in order so the frontmatter contract is checked before the prose rules.
3. Capture evidence that would let another operator reproduce the verdict without re-deriving the scenario.
4. Return a short user-facing explanation, not just raw implementation notes.
### Prompt
Validate the deep-alignment invocation contract in SKILL.md and report whether the argument-hint, exclusive-command rule, and FORBIDDEN/ALWAYS lists agree with the mode's four invariants.
### Commands
1. `bash: sed -n '1,12p' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
2. `bash: rg -n 'argument-hint|allowed-tools|FORBIDDEN INVOCATION|NEVER|ALWAYS|EXCLUSIVELY' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
3. `bash: rg -n 'Verify-first|Known-deviation suppression|Read-only by default|Gated remediation' .opencode/skills/system-deep-loop/deep-alignment/SKILL.md`
### Expected
The argument-hint names all six tokens; the mode is invoked EXCLUSIVELY through `/deep:alignment`; the NEVER list forbids custom dispatchers, direct CLI loops, direct `@deep-alignment` Task dispatch, ad-hoc state, and ungated remediation; the ALWAYS list requires exclusive invocation, lanes-before-discovery, per-finding re-verification, and read-only default; the four invariants are named in "The Alignment Contract".
### Evidence
Capture the frontmatter block, the FORBIDDEN INVOCATION PATTERNS NEVER/ALWAYS lists, and the four-invariant list together.
### Pass/Fail
PASS if the argument-hint, exclusivity rule, and FORBIDDEN/ALWAYS lists are mutually consistent and map onto the four invariants. FAIL if any contradicts another or omits an invariant.
### Failure Triage
Start with the frontmatter argument-hint, then confirm each NEVER/ALWAYS bullet has a matching invariant in "The Alignment Contract"; a missing or contradictory bullet is the finding.
---

## 4. SOURCE FILES

### PLAYBOOK SOURCES

| File | Role |
|---|---|
| `manual-testing-playbook.md` | Root directory page, integrated alignment protocol, and scenario summary |
| `entry-points-and-modes/` | Entry-point category; validates the SKILL contract, not a live command file (phase 009 unbuilt) |

### IMPLEMENTATION AND RUNTIME ANCHORS

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md` | Mode contract: frontmatter argument-hint/allowed-tools, FORBIDDEN INVOCATION PATTERNS, RULES, and the four invariants |
| `.opencode/skills/system-deep-loop/deep-alignment/changelog/v1.0.0.0.md` | Confirms the `/deep:alignment` command is not built yet, so SKILL.md is the authoritative contract today |

---

## 5. SOURCE METADATA

- Group: ENTRY POINTS AND MODES
- Playbook ID: DAL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `entry-points-and-modes/invocation-contract-and-forbidden-patterns.md`
- Build-state note: The `/deep:alignment` command, YAML workflows, and `@deep-alignment` agent are phase 009 deliverables and do not exist yet; this scenario validates the documented SKILL contract only.
