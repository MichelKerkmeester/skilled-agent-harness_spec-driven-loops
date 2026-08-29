---
title: "PI-023 -- Cline provider model-id format dispatch"
description: "This scenario proves the cline-pass provider model-id format contract: pi forwards a model's `id` verbatim, the Cline API requires the slashed `cline-pass/<model>` form, and a bare id returns a 400 invalid-model-format error. It confirms the config declares slashed ids and isolates the credentialed positive-control dispatch for `PI-023`."
version: 1.0.0.0
---

# PI-023 -- Cline provider model-id format dispatch

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-023`.

---

## 1. OVERVIEW

This scenario checks the config-wired `cline-pass` provider and its model-id format, then separately identifies the live model-turn boundary. It is distinct from `PI-017`, which checks the deep-loop executor allowlist that the Cline provider is deliberately not part of.

### Why This Matters

pi builds providers from `.pi/models.json` and, on dispatch, sends a model object's `id` verbatim as the API `model` parameter. The Cline API requires the `modelType/model` slashed form and rejects a bare id with `400 "invalid model format. Expected format: modelType/model"`. That failure hides from `pi --list-models` and `pi auth check`, which never send a completion, so a bare id passes every static check and only breaks on the first real dispatch. The config must therefore declare the slashed id, and the contract must be provable.

---

## 2. SCENARIO CONTRACT

- Objective: Prove that `.pi/models.json` declares slashed `cline-pass/<model>` ids, that `.pi/settings.json` mirrors them as three-segment references, and that a credentialed dispatch to the slashed model returns a model reply rather than a 400.
- Real user request: `Check that the Cline provider is wired correctly in pi and that a flash dispatch actually works, not just that it lists.`
- Prompt: `Reply with exactly this token and nothing else: CLI_PI_FLASH_OK`
- Expected execution process: Grep `.pi/models.json` for the cline-pass model ids -> confirm flash is slashed (`cline-pass/deepseek-v4-flash`), not bare -> confirm `.pi/settings.json` `enabledModels` carry the three-segment `cline-pass/cline-pass/...` references and `defaultModel` is `cline-pass/deepseek-v4-flash` -> if credentials exist, run the isolated positive-control dispatch and inspect the output text.
- Expected signals: Both model ids keep the `cline-pass/` prefix; settings references are three-segment; a live dispatch returns the exact token with no `invalid model format` string; the exit code is not treated as the availability signal.
- Desired user-visible outcome: A source-backed confirmation that the id format is correct and, with credentials, an observed model reply proving dispatch works end to end.
- Pass/fail: PASS for the id-format inspection. PASS the live positive control only when the output text contains the token and no `400 invalid model format`. SKIP the live turn with blocker `provider credentials are absent on this machine`. FAIL if `.pi/models.json` declares a bare id, if settings drift from the model id, or if a dispatch to a bare id is admitted.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the cline-pass model ids directly from `.pi/models.json`.
2. Confirm the ids are slashed and that `.pi/settings.json` mirrors them as three-segment references.
3. Record the id-format inspection PASS.
4. Only with credentials, run a bounded positive-control dispatch and inspect the output text for the token and the absence of the 400 string.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-023 | Cline provider model-id format dispatch | Confirm slashed cline-pass ids and prove a credentialed flash dispatch returns a reply | `Reply with exactly this token and nothing else: CLI_PI_FLASH_OK` | `bash: command -v pi` -> `jq -r '.providers["cline-pass"].models[].id' .pi/models.json` -> `jq -r '.enabledModels[] , .defaultModel' .pi/settings.json | grep cline` -> with credentials only, `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "Reply with exactly this token and nothing else: CLI_PI_FLASH_OK" --provider cline-pass --model cline-pass/cline-pass/deepseek-v4-flash --thinking xhigh </dev/null` | Model ids are `cline-pass/deepseek-v4-flash` (slashed, not bare); `enabledModels` carry `cline-pass/cline-pass/deepseek-v4-flash` (the retired `deepseek-v4-pro` entry may still appear and must not be dispatched); `defaultModel` is `cline-pass/deepseek-v4-flash`; the live dispatch output text contains `CLI_PI_FLASH_OK` and no `invalid model format` | Config inspection shows the cline-pass id slashed and settings three-segment. A live print-mode dispatch on 2026-08-18 returned the token `CLI_PI_FLASH_OK` with no `400 invalid model format` (a `deep-pi` statistics-lock extension warning printed after the reply and did not block the turn). | PASS for id-format inspection. PASS the live control only when the token is present and no 400 string appears. SKIP the live turn with blocker `provider credentials are absent on this machine`. FAIL if a bare id is declared or admitted, or if settings drift from the model id. | Re-read `.pi/models.json`, confirm the `cline-pass/` prefix on every id, reconcile the settings references, and rerun the positive control before changing the provider block. |

### Optional Supplemental Checks

- Negative control: a dispatch whose model id is bare `deepseek-v4-flash` returns `400 "invalid model format. Expected format: modelType/model"` from the Cline API. This is the pre-fix symptom that phase 006 corrected; do not run it as a success path.
- DeepSeek V4 Pro was retired from the roster; a `cline-pass/cline-pass/deepseek-v4-pro` dispatch is no longer a supported scenario and its `.pi` config entries are inert leftovers, not dispatch targets.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Credential boundary and output-first policy |
| `../../SKILL.md` | Provider preflight and exit-code-is-not-auth rule |
| `../../references/providers-and-models.md` | cline-pass roster, three-segment references, and the slashed-id gotcha |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.pi/models.json` | The `cline-pass` provider block and the slashed model `id` values pi forwards as the API `model` |
| `.pi/settings.json` | `enabledModels` three-segment references and the `cline-pass` default |
| `.pi/custom-providers.md` | The custom-provider setup and the documented slashed-id gotcha |
| `../../../../../../specs/cli-external-orchestration/049-cline-provider-roster/006-cline-pi-model-id-format-fix/implementation-summary.md` | The model-id format regression and its fix |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: PI-023
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/cline-provider-id-format-dispatch.md`
