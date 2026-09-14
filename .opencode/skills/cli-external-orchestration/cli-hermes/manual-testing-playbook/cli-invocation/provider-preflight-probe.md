---
title: "HERMES-021 -- Provider preflight probe"
description: "Confirm `hermes config get providers.llmgateway.base_url` is a usable provider preflight, and record that `hermes status` is not for `HERMES-021`."
version: 1.0.0.0
---

# HERMES-021 -- Provider preflight probe

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `HERMES-021`.

---

## 1. OVERVIEW

`hermes status` reads the built-in provider catalog. It does not display a custom provider block, so on a correctly configured machine it reports `Model: (not set)` and `Provider: Auto` while every dispatch works. Reading it as a preflight produces a false negative.

The usable probe is a direct config read of the provider block's own key, which prints the URL and exits 0 without contacting anything.

### Why This Matters

The first pass had to record the status screen as misleading. A dispatch that refuses to run because `hermes status` looks empty would be refusing on a reading that has never been true on this machine.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `HERMES-021` and confirm the expected signals without contradictory evidence.

- Objective: Confirm `hermes config get providers.llmgateway.base_url` is a usable provider preflight, and record that `hermes status` is not.
- Real user request: `Before I send work to Hermes, check its gateway provider is actually configured.`
- Prompt: `Check whether the llmgateway provider is configured for Hermes and report the base URL it resolves to.`
- Expected execution process: run the command sequence in §3 from the repository root with a 300-second alarm on each dispatch, capture stdout, stderr, exit code and elapsed seconds separately, then judge the result against the pass/fail criteria below.
- Expected signals: The config read prints the provider's base URL on stdout and exits `0` in about a second; the status screen, run for contrast, reports `Model: (not set)` and `Provider: Auto` on the same correctly configured machine.
- Evidence: The printed base URL, the exit code, the elapsed seconds, and the contrasting status-screen lines captured in the same session.
- Desired user-visible outcome: a concise verdict naming the observed signal and the evidence behind it.
- Pass/fail: PASS when the config read prints a non-empty URL and exits 0; FAIL when it exits non-zero or prints nothing, which means the provider block is absent or misnamed; SKIP only when a named environment blocker prevents the check, such as a missing `hermes` binary.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request and confirm the scenario ID.
2. Confirm the global preconditions in the root playbook, including `command -v hermes`.
3. Run the command sequence below exactly as written, from the repository root.
4. Capture stdout, stderr, exit code and elapsed seconds separately for every dispatch.
5. Judge the result against the pass/fail criteria and record the verdict with its evidence.

### Commands

```bash
command -v hermes

hermes config get providers.llmgateway.base_url </dev/null
echo $?

# contrast only: the status screen does not display a custom provider block
hermes status </dev/null 2>&1 | grep -E 'Model:|Provider:'
```

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| HERMES-021 | Provider preflight probe | Confirm `hermes config get providers.llmgateway.base_url` is a usable provider preflight, and record that `hermes status` is not | `Check whether the llmgateway provider is configured for Hermes and report the base URL it resolves to.` | 1. `command -v hermes` -> 2. `hermes config get providers.llmgateway.base_url </dev/null` -> 3. `echo $?` -> 4. For contrast only, `hermes status </dev/null 2>&1 | grep -E 'Model:|Provider:'` and record that it shows no custom provider | The config read prints the provider's base URL on stdout and exits `0` in about a second; the status screen, run for contrast, reports `Model: (not set)` and `Provider: Auto` on the same correctly configured machine | The printed base URL, the exit code, the elapsed seconds, and the contrasting status-screen lines captured in the same session | PASS when the config read prints a non-empty URL and exits 0; FAIL when it exits non-zero or prints nothing, which means the provider block is absent or misnamed; SKIP only when a named environment blocker prevents the check, such as a missing `hermes` binary | An empty result means the block is not named `llmgateway` in the user-level config; list the configured providers before concluding the credential is missing. Never escalate on the status screen alone: it is expected to look empty here, and treating it as the signal is the false negative this scenario exists to prevent |

### Recorded Result

**Executed 2026-09-14**: `hermes config get providers.llmgateway.base_url` printed `https://api.llmgateway.io/v1` and exited 0 in 1 s, while `hermes status` on the same machine reported `Model:        (not set)` and `Provider:     Auto`. Verdict PASS.

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Root directory page and scenario index |
| `cli-invocation/provider-preflight-probe.md` | Canonical per-feature execution contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| [cli-reference.md](../../references/cli-reference.md) | Read-only commands a dispatch may run, and the provider preflight |
| [providers-and-models.md](../../references/providers-and-models.md) | The llmgateway provider block and its credential contract |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: HERMES-021
- Canonical root source: [manual-testing-playbook.md](../manual-testing-playbook.md)
- Feature file path: `cli-invocation/provider-preflight-probe.md`
- Prompt equality requirement: SCENARIO CONTRACT prompt must equal the 9-column table Exact Prompt cell.
