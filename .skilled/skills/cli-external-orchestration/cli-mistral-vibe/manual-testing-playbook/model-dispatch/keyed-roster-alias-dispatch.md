---
title: "VIB-MOD-001 -- Keyed roster alias dispatch"
description: "This scenario validates that a keyed Vibe lineage on the deepseek-flash alias resolves the roster row, finishes, and records exit_code 0 with outcome finished."
version: 1.0.0.0
---

# VIB-MOD-001 -- Keyed roster alias dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `VIB-MOD-001`.

---

## 1. OVERVIEW

This scenario validates model dispatch on one roster alias. It focuses on the alias-to-row resolution and on the outcome the run records, not on the reply text.

### Why This Matters

The roster is closed by `allowed_models`, which matches each `[[models]]` row's `name` and not its alias. A dispatch names `deepseek-flash` or `glm-flash`; the row behind that alias carries `thinking = "max"` and the provider `mistral`. Vibe's built-in `mistral-medium-3.5` stays selectable beside the roster unless the config closes it. A caller that only checks that a reply arrived cannot tell which row answered, and a row without the `max` pin is not the contract the packet promises.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a keyed dispatch on `deepseek-flash` resolves the roster row and finishes with the `0`/`finished` pair.
- Real user request: `Dispatch one keyed Vibe task on deepseek-flash and prove from the run record which model row answered and whether the run finished.`
- Prompt: `Read the file named by the lineage prompt, report the single line it contains, and stop. Use no other tool.`
- Expected execution process: Start the keyed lineage or a scratch print-mode dispatch on `deepseek-flash` -> keep the run's `export.json` and its invocation metadata -> compare `config.active_model` and `effectiveConfig.model` with the alias -> require the `0`/`finished` pair.
- Expected signals: `export.json` records `exit_code` `0`, `outcome` `finished`, `stop_reason` null and `error` null. `config.active_model` is `deepseek-flash`. The invocation metadata records `model` `deepseek-flash` and `executable` `vibe`. The alias row's `name` is `deepseek-v4-1-flash-1017` with `thinking` `max`.
- Evidence: The `export.json` record, the invocation metadata and the alias row quoted from `config.models`.
- Desired user-visible outcome: A clear statement that the alias resolved to the roster row and the run finished, with the evidence paths.
- Pass/fail: PASS if the pair is `0`/`finished`, `config.active_model` and `effectiveConfig.model` both name `deepseek-flash`, and the row carries `thinking` `max`. FAIL if the run names another alias or row, if the pair differs, or if the alias is inferred from the prompt rather than read from the record.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `MISTRAL_API_KEY` is exported and `vibe --version </dev/null` prints `vibe 3.1.2`.
2. Give the run its own `VIBE_HOME` and `--output-dir`, whether it is a scratch print-mode dispatch or a lineage.
3. Name exactly one roster alias with `--model`.
4. Read `export.json` and the invocation metadata.
5. Compare `config.active_model` with the alias and with the row's `name` and `thinking` fields.

### Commands

```bash
node -e 'const j=require("./specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json"); console.log(JSON.stringify({exit_code:j.exit_code,outcome:j.outcome,active_model:j.config.active_model,steps:j.steps,row:j.config.models["deepseek-flash"]},null,2))'
node -e 'const m=require("./specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/invocation-metadata.json"); console.log(JSON.stringify(m.effectiveConfig,null,2))'
```

### Recorded Result

- Verdict: `PASS`.
- Date: 2026-11-14.
- Basis: recorded evidence from an earlier keyed lineage, not a run started by this review. The record at `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json` exists, and `node` read `exit_code` `0` and `outcome` `finished` from it.
- Observed: `config.active_model` `deepseek-flash`, `steps` `50`, `vibe_version` `3.1.2`, `stop_reason` null and `error` null. The `deepseek-flash` row records `name` `deepseek-v4-1-flash-1017`, `provider` `mistral`, `thinking` `max` and the `thinking_levels` ladder `off`, `low`, `medium`, `high`, `max`.
- Observed: the invocation metadata records `model` `deepseek-flash`, `executable` `vibe`, `reasoningEffort` null, `sandboxMode` null and `permissionMode` null.
- Observed: the run summary records two lineages, two succeeded and zero failed, with `completed_with_containment_advisory` `2`.
- Caveat: a lineage runs with `--auto-approve` and with no confinement, and the recorded run predates the rendered home hooks, so its journal holds no repository hook record. This scenario proves alias resolution and completion; it does not prove the hard-rule-checked dispatch shape, which `VIB-HR-001` covers statically, or the guards, which `VIB-GRD-001` covers.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| VIB-MOD-001 | Keyed roster alias dispatch | Prove deepseek-flash resolves the roster row and finishes | `Read the file named by the lineage prompt, report the single line it contains, and stop. Use no other tool.` | 1. confirm the key and `vibe 3.1.2` -> 2. run one keyed dispatch or lineage with `--model deepseek-flash` and `--output-dir` -> 3. read `export.json` with the `node -e` reader -> 4. read `invocation-metadata.json` | Step 3: `exit_code` `0`, `outcome` `finished`, `active_model` `deepseek-flash`, row `name` `deepseek-v4-1-flash-1017`, `thinking` `max`. Step 4: `model` `deepseek-flash`, `executable` `vibe` | The saved record `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json` and its `invocation-metadata.json` | PASS if the pair is `0`/`finished` and both the record and the metadata name `deepseek-flash` on the `max` row. FAIL if another alias or row answered, or the pair differs | 1. Read `config.active_model` before stdout. 2. If it names `mistral-medium-3.5`, the home did not carry `allowed_models`. 3. If `usage_error` appears, confirm the home carried both roster rows |

### Failure Triage

1. Read `config.active_model` and the row it points at before reading any reply text.
2. If the alias is absent, confirm the home carried `config.toml` and that `allowed_models` names the row's `name`, not its alias.
3. If the pair is not `0`/`finished`, read `stop_reason` and `error` from the same record.
4. If the metadata and the record disagree, trust the record and treat the metadata as a stale invocation fingerprint.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Command notation, evidence rules and verdict policy |
| [SKILL.md](../../SKILL.md) | Closed roster, alias selection and the completion pair |
| [providers-and-models.md](../../references/providers-and-models.md) | The `mistral` provider row, the two aliases and the `allowed_models` close |
| [cli-reference.md](../../references/cli-reference.md) | `export.json` fields, the exit taxonomy and the reasoning-effort note |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.vibe/config.toml` | The two hand-written rows and the `allowed_models` list |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Builds the lineage command and its effective config |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/vibe-output/export.json` | Recorded outcome record for the cited lineage |
| `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/009-deep-loop-executor-kind/research/keyed-lineage-run/lineages/vibe-1/invocation-metadata.json` | Recorded model and executable for the cited lineage |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: VIB-MOD-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/keyed-roster-alias-dispatch.md`
