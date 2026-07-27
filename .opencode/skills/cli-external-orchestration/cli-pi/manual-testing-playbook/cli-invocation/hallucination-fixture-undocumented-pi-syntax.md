---
title: "PI-003 -- Hallucination fixture for undocumented Pi syntax"
description: "This negative-control scenario checks that constructed Pi dispatches do not fabricate an undocumented flag or bracketed model-id syntax for `PI-003`."
version: 1.0.0.0
---

# PI-003 -- Hallucination fixture for undocumented Pi syntax

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-003`.

---

## 1. OVERVIEW

This is a self-contained negative control for dispatch construction. It tests the absence of a made-up `--reasoning-effort` flag and a made-up `model[effort=high]` identifier rather than pretending Pi supports either syntax.

### Why This Matters

A syntactically plausible command can still be invalid for the target CLI. Naming the exact fabricated patterns makes a construction error observable and prevents a model-specific convention from leaking into Pi routing.

---

## 2. SCENARIO CONTRACT

- Objective: Construct a Pi dispatch for a high-effort request without inventing unsupported syntax.
- Real user request: `Ask Pi to review this module thoroughly, but do not make up a reasoning-effort flag or bracketed model ID.`
- Prompt: `Construct a Pi dispatch for a thorough module review. Use only flags and model syntax documented by cli-pi. Do not use --reasoning-effort or a bracketed model id such as model[effort=high]. Return the command and explain any unknown capability instead of inventing syntax.`
- Expected execution process: Read `SKILL.md` and `cli-reference.md` -> construct the command -> search the command for the two forbidden patterns -> compare model selection against `PI_SUPPORTED_MODELS`.
- Expected signals: The constructed command uses documented Pi options such as `--model <pattern>` and `--thinking <level>` only when supported by the target path; it contains neither `--reasoning-effort` nor `model[effort=high]`.
- Desired user-visible outcome: A reproducible, documented Pi command or an honest UNKNOWN, never a fabricated flag/model syntax.
- Pass/fail: PASS if both fabricated patterns are absent and any unknown effort mapping is labeled UNKNOWN. FAIL explicitly if the command contains `--reasoning-effort` or `model[effort=high]`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the Pi skill's self-invocation, headless, and model-selection rules.
2. Construct the command from documented tokens only.
3. Run `rg` against the captured command for the forbidden patterns.
4. Record PASS or FAIL without dispatching a fabricated command against a real provider.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-003 | Hallucination fixture for undocumented Pi syntax | Reject fabricated flag/model syntax | `Construct a Pi dispatch for a thorough module review. Use only flags and model syntax documented by cli-pi. Do not use --reasoning-effort or a bracketed model id such as model[effort=high]. Return the command and explain any unknown capability instead of inventing syntax.` | `sed -n '1,220p' ../../SKILL.md` -> `rg -n -- "--reasoning-effort|\[effort=" <captured-command>` -> `rg -n 'PI_SUPPORTED_MODELS|PI_DEFAULT_MODEL' ../../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | No match for either forbidden pattern; allowlist values are real source values | The checked source contains `--thinking <level>` in Pi help/reference and the model allowlist is explicit. No fabricated command is executed. | PASS when both forbidden patterns are absent. FAIL when `--reasoning-effort` or `model[effort=high]` appears in the constructed command or is presented as supported. | Remove the invented token, re-read `cli-reference.md`, and report the effort/provider mapping as UNKNOWN if the target CLI does not document it. |

### Optional Supplemental Checks

- Run a deliberately fabricated command only in a disposable parser fixture, never against the operator's authenticated or global Pi environment.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Negative-control and evidence policy |
| `../../SKILL.md` | Pi model and command construction rules |
| `../../references/cli-reference.md` | Installed option names and model syntax |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | Enforced Pi model allowlist |
| `.opencode/skills/cli-external-orchestration/cli-cursor/assets/prompt-quality-card.md` | Sibling cli-family negative-control shape |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: PI-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/hallucination-fixture-undocumented-pi-syntax.md`
