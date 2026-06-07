---
title: "SWEEP-004 -- Per-Model Prompt Framework"
description: "This scenario validates Per-Model Prompt Framework for `SWEEP-004`. It focuses on per-seat prompt framing (MiMo → COSTAR, MiniMax/DeepSeek → TIDD-EC, native → none) and the mandatory four-part lineage contract in every rendered prompt."
---

# SWEEP-004 -- Per-Model Prompt Framework

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SWEEP-004`.

---

## 1. OVERVIEW

This scenario validates Per-Model Prompt Framework for `SWEEP-004`. It focuses on `step_render_seat_prompts` applying per-seat prompt framing via `sk-prompt-small-model` (MiMo → COSTAR, MiniMax/DeepSeek → TIDD-EC, native seats carry no framework) and requiring the four-part lineage contract (gather-subject, shared current_focus, known-context, output schema) in every rendered prompt.

### Why This Matters

Small models without a structured prompt framework return generic noise against generic "analyze this code" instructions. The four-part lineage contract is what distinguishes a useful sweep from noise: without gather-subject the seat does not know what context to prioritize; without known-context the seat re-derives findings already confirmed by prior iterations.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SWEEP-004` and confirm the expected signals without contradictory evidence.

- Objective: Verify that per-seat prompt framing is applied using `sk-prompt-small-model` and the four-part lineage contract is mandatory in every rendered seat prompt.
- Real user request: `Verify that deep-context applies the correct prompt framework to each executor seat type before dispatch.`
- Prompt: `As a manual-testing orchestrator, validate the per-model prompt framework application for deep-context against the command entrypoint, auto YAML, SKILL.md, and sk-prompt-small-model references. Verify MiMo seats use COSTAR, DeepSeek and MiniMax seats use TIDD-EC, native seats carry no framework, and every seat prompt includes all four lineage contract fields. Return a concise verdict.`
- Expected execution process: Read SKILL.md §4 ALWAYS rule 3 for `sk-prompt-small-model` mandate; read `start-context-loop.md` PRE-BOUND SETUP ANSWERS schema for the `promptFramework` field; read loop_protocol.md §5 for the four-part contract; verify per-framework references in SKILL.md or the command.
- Expected signals: SKILL.md ALWAYS rule 3 names `sk-prompt-small-model`; `promptFramework` field is in the executor JSON schema in `start-context-loop.md`; `MiMo → COSTAR` and `TIDD-EC` are documented in SKILL.md or command; the four-part contract fields are listed in loop_protocol.md §5.
- Desired user-visible outcome: Each seat prompt is rendered with model-specific structure before dispatch, ensuring small-model seats receive actionable lineage context rather than a generic "analyze" instruction.
- Pass/fail: PASS if `sk-prompt-small-model` is mandated in SKILL.md, per-framework assignments are documented, and the four-part contract is in loop_protocol.md; FAIL if any of these are missing.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; doc-verification only.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SWEEP-004 | Per-Model Prompt Framework | Verify per-seat prompt framing with mandatory lineage contract | `Verify that deep-context applies the correct prompt framework to each executor seat type before dispatch.` | 1. `rg "sk-prompt-small-model\|promptFramework" .opencode/skills/deep-context/SKILL.md` -> 2. `rg "COSTAR\|TIDD.EC\|MiMo\|mimo" .opencode/commands/deep/start-context-loop.md .opencode/skills/deep-context/SKILL.md` -> 3. `rg "gather-subject\|known-context\|output schema\|four.part" .opencode/skills/deep-context/references/protocol/loop_protocol.md` -> 4. `rg "step_render_seat_prompts\|promptFramework" .opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | Step 1: `sk-prompt-small-model` mandate found; Step 2: per-framework assignments found; Step 3: four-part contract documented; Step 4: render step present in YAML | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if sk-prompt-small-model mandate or four-part contract is absent | 1. Check SKILL.md §4 ALWAYS rules specifically. 2. Confirm loop_protocol.md §5 is the prompt-contract section. 3. Verify command's executor schema includes `promptFramework`. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/02--by-model-parallel-sweep/per-model-prompt-framework.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_start-context-loop_auto.yaml` | `step_render_seat_prompts`: per-seat prompt rendering step |
| `.opencode/skills/deep-context/SKILL.md` | §4 ALWAYS rule 3: `sk-prompt-small-model` mandate and per-framework assignments |
| `.opencode/skills/deep-context/references/protocol/loop_protocol.md` | §5: four-part lineage contract (gather-subject, scope/slice, known-context, output schema) |
| `.opencode/commands/deep/start-context-loop.md` | PRE-BOUND SETUP ANSWERS schema: `promptFramework` field per executor seat |

---

## 5. SOURCE METADATA

- Group: By-Model Parallel Sweep
- Playbook ID: SWEEP-004
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--by-model-parallel-sweep/per-model-prompt-framework.md`
