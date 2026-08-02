---
title: "PI-017 -- Supported-model allowlist smoke"
description: "This scenario inspects the real Pi-supported model allowlist, confirms no `auto` default, and isolates the provider-dependent smoke dispatch for `PI-017`."
version: 1.0.0.0
---

# PI-017 -- Supported-model allowlist smoke

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `PI-017`.

---

## 1. OVERVIEW

This scenario checks the fail-closed model roster used by `cli-pi` and separately identifies the live model-turn boundary.

### Why This Matters

An `auto` default delegates model selection outside the skill's declared contract. The allowlist must be explicit before a provider-backed smoke dispatch is attempted.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the eight real Pi model IDs and prove `PI_DEFAULT_MODEL` is not `auto`.
- Real user request: `Inspect the Pi model allowlist, make sure there is no auto default, and run a harmless smoke request if provider credentials are available.`
- Prompt: `Run a harmless Pi smoke request against the configured default model. Return the response or the exact provider blocker. Do not modify files.`
- Expected execution process: Read `executor-config.ts` -> capture `PI_SUPPORTED_MODELS` and `PI_DEFAULT_MODEL` -> grep for `auto` -> if credentials exist, run the isolated smoke dispatch.
- Expected signals: Eight listed IDs are present; default is `deepseek-v4-pro`; no `auto` value occurs in the allowlist/default; a live smoke response is optional only when credentials exist.
- Desired user-visible outcome: A real source-backed allowlist result without a fabricated successful dispatch.
- Pass/fail: PASS for the allowlist inspection. SKIP the live smoke turn with blocker `provider credentials are absent on this machine`. FAIL if `auto` appears as the default or an unsupported model is admitted.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Read the allowlist and default directly from the executor configuration.
2. Search the relevant model declarations for `auto`.
3. Record the inspection PASS.
4. Only with credentials, run a bounded `pi --offline --approve -p` smoke dispatch using the explicit default model.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PI-017 | Supported-model allowlist smoke | Confirm eight IDs and no `auto` default | `Run a harmless Pi smoke request against the configured default model. Return the response or the exact provider blocker. Do not modify files.` | `sed -n '153,174p' ../../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts` -> `rg -n 'PI_SUPPORTED_MODELS|PI_DEFAULT_MODEL|auto' ../../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts` -> with credentials only, `PI_CODING_AGENT_DIR=<tmp> pi --offline --approve -p "list your available tools" </dev/null` | Eight IDs are listed; default is `deepseek-v4-pro`; `auto` is absent from the allowlist/default; live response requires credentials | Captured source output lists `deepseek-v4-pro`, `deepseek-v4-flash`, `minimax-m3`, `gpt-5.6-luna`, `gpt-5.6-sol`, `gpt-5.6-terra`, `mimo-v2.5-pro`, and `mimo-v2.5-pro-ultraspeed`; it shows `PI_DEFAULT_MODEL ... 'deepseek-v4-pro'`. The grep also finds explanatory comments and unrelated approval text, but no `auto` model value. | PASS for allowlist inspection. SKIP live smoke with blocker `provider credentials are absent on this machine`. FAIL if an `auto` model value or unsupported ID is present. | Re-read the exact allowlist, distinguish comments from values, and rerun the configuration tests before changing the roster. |

### Optional Supplemental Checks

- Run the existing executor unit tests and preserve their result beside the manual source inspection.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Model allowlist and output-first policy |
| `../../SKILL.md` | Model routing and provider preflight |
| `../../references/cli-reference.md` | Pi model option and failure handling |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `../../../../system-deep-loop/runtime/lib/deep-loop/executor-config.ts` | `PI_SUPPORTED_MODELS`, `PI_DEFAULT_MODEL`, and allowlist predicate |
| `../../../../system-deep-loop/runtime/lib/deep-loop/executor-config.vitest.ts` | Automated allowlist tests when run by the owning package |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: PI-017
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/supported-model-allowlist-smoke.md`
