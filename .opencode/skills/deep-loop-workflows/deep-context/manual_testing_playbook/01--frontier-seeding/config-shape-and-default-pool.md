---
title: "FS-003 -- Config Shape and Default Pool"
description: "This scenario validates Config Shape and Default Pool for `FS-003`. It focuses on the default config template fields and the default heterogeneous executor pool written during fresh initialization."
---

# FS-003 -- Config Shape and Default Pool

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `FS-003`.

---

## 1. OVERVIEW

This scenario validates Config Shape and Default Pool for `FS-003`. It focuses on the `deep_context_config.json` template, the threshold defaults (`relevanceGate: 0.55`, `agreementMin: 2`, `maxIterations: 8`, `convergenceThreshold: 0.10`), the default heterogeneous pool (2 native + MiMo + gpt + deepseek), and the `fanout.mode: "by-model-shared-scope"` invariant.

### Why This Matters

The config is treated as read-only after initialization. If the template is missing fields or threshold defaults diverge from what is documented in SKILL.md or the command's Default Resolution Table, operators will get unexpected convergence behavior. Aligning template, command defaults, and SKILL.md is the baseline correctness check for every future run.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `FS-003` and confirm the expected signals without contradictory evidence.

- Objective: Verify that `assets/deep_context_config.json` contains all required threshold fields with correct defaults, the correct default pool, and the `by-model-shared-scope` fanout mode.
- Real user request: `Verify that the deep-context default config template matches the documented thresholds and default executor pool.`
- Prompt: `As a manual-testing orchestrator, validate the config shape and default pool contract for deep-context against the command entrypoint, auto YAML, asset template, and SKILL.md quick reference. Verify deep_context_config.json defines the default pool (2 native + MiMo + gpt + deepseek), relevanceGate 0.55, agreementMin 2, maxIterations 8, convergenceThreshold 0.10, and fanout.mode by-model-shared-scope. Return a concise verdict.`
- Expected execution process: Read `assets/deep_context_config.json`; compare fields against SKILL.md §8 quick reference and `context.md` Default Resolution Table; verify `by-model-shared-scope` is present.
- Expected signals: `assets/deep_context_config.json` exists; `relevanceGate`, `agreementMin`, `convergenceThreshold` fields are present with the documented defaults; `fanout.mode` is `by-model-shared-scope`; default pool includes at least one native seat and at least one CLI seat.
- Desired user-visible outcome: A fresh deep-context run without any explicit flags produces a config that matches the SKILL.md §8 quick reference table exactly.
- Pass/fail: PASS if all threshold fields exist in the template with the documented defaults and `by-model-shared-scope` is set; FAIL if any threshold field is missing or mismatched.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Decide whether the scenario should stay local; it is doc-verification only — stay local.
3. Execute the deterministic steps exactly as written.
4. Compare the observed output against the desired user-visible outcome.
5. Return a concise final answer that a real user would understand.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FS-003 | Config Shape and Default Pool | Verify default config template matches documented thresholds and pool | `Verify that the deep-context default config template matches the documented thresholds and default executor pool.` | 1. `ls .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` -> 2. `rg "relevanceGate\|agreementMin\|convergenceThreshold\|maxIterations" .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` -> 3. `rg "by-model-shared-scope" .opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` -> 4. `rg "agreementMin.*2\|relevan.*0.55\|convergence.*0.10" .opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | Step 1: file exists; Step 2: all four fields present; Step 3: `by-model-shared-scope` found; Step 4: SKILL.md quick reference matches defaults | Read outputs for config JSON and SKILL.md §8 | PASS if steps 1-4 all return matches; FAIL if any field is missing or mismatched | 1. Confirm file path is correct. 2. Check SKILL.md §8 quick reference for authoritative threshold values. 3. Inspect whether defaults live in the command doc rather than the config JSON. |

### Optional Supplemental Checks

Verify the default resolution table in `context.md` matches the config defaults:

```bash
rg "0\.55\|0\.10\|agreementMin\|maxIteration" .opencode/commands/deep/context.md
```

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/01--frontier-seeding/config-shape-and-default-pool.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/deep-context/assets/deep_context_config.json` | Default config template: all threshold fields and default pool definition |
| `.opencode/skills/deep-loop-workflows/deep-context/SKILL.md` | §8 Quick Reference: authoritative threshold and pool documentation |
| `.opencode/commands/deep/context.md` | Default Resolution Table: per-field defaults used at setup time |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_create_config`: writes the config from the resolved setup bindings |

---

## 5. SOURCE METADATA

- Group: Frontier Seeding
- Playbook ID: FS-003
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `01--frontier-seeding/config-shape-and-default-pool.md`
