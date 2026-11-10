---
title: "CLI-001 -- Keyless boot per route"
description: "This scenario validates that each roster route stops at its own key variable with MISSING_CREDENTIAL and never reports a completed run for `CLI-001`."
version: 1.0.1.0
---

# CLI-001 -- Keyless boot per route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `CLI-001`.

---

## 1. OVERVIEW

This scenario validates the keyless boot contract for both roster routes. It focuses on the key variable each route resolves and the failure shape a caller must read.

### Why This Matters

A keyless dsh run still writes a well-formed JSON stream. The last line is a `final` event with `reason.kind` `error` and `error.code` `MISSING_CREDENTIAL`. A caller that checks only for parseable JSON, a non-empty stream or exit `1` can record a failure as a result. The route patch decides which key variable the run asks for, so the route name in stderr also proves that the intended patch composed.

---

## 2. SCENARIO CONTRACT

- Objective: Prove each roster route fails keyless on its own key variable and never reports `reason.kind` `completed`.
- Real user request: `Check both DeepSeek Harness routes without a provider key and tell me whether each one stops on its own key. I want to see the exit code and the last event, not just the console text.`
- Prompt: `Run the keyless headless probe on both roster routes from a scratch folder with a disposable DSH_HOME. Capture stdout, stderr and the exit code for each route, then tell me whether each run failed on its own route key: LLMGATEWAY_API_KEY for LLM Gateway and OPENCODE_API_KEY for OpenCode Go. Do not modify the repository.`
- Expected execution process: Create a scratch folder and a disposable home -> run the LLM Gateway probe -> run the OpenCode Go probe -> read each exit code, stderr and last JSONL line -> compare the named key variable with the route.
- Expected signals: Each run exits `1`. stderr begins `dsh: MISSING_CREDENTIAL:` and names that route's key variable. The last stdout line is a `final` event with `reason.kind` `error` and `error.code` `MISSING_CREDENTIAL`. The `session` event's `cwd` is the scratch folder, not the checkout.
- Desired user-visible outcome: A clear statement that both routes stopped on their own credentials, with the exact evidence a later caller can reproduce.
- Pass/fail: PASS if each route exits `1`, names its own key variable and ends on a `final` event with `MISSING_CREDENTIAL`. FAIL if a route names the other route's key, exits `0` or reports `reason.kind` `completed`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm `command -v dsh` and the pinned version before the probes.
2. Create one scratch folder and one disposable home for each route.
3. Run each probe with a clean environment so neither route key is present.
4. Keep stdout, stderr and the exit code in separate files.
5. Read the last JSONL line before you read the exit code.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && printf '%s' "Reply with the single word OK" | env -i PATH="$PATH" HOME="$RUN_DIR" DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --json --permission-mode read-only --approval-policy never - >stdout-llmgateway.jsonl 2>stderr-llmgateway.txt
echo "exit=$?" >exit-llmgateway.txt
cd "$RUN_DIR" && printf '%s' "Reply with the single word OK" | env -i PATH="$PATH" HOME="$RUN_DIR" DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-opencode-go-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --json --permission-mode read-only --approval-policy never - >stdout-opencode-go.jsonl 2>stderr-opencode-go.txt
echo "exit=$?" >exit-opencode-go.txt
tail -n 1 stdout-llmgateway.jsonl
tail -n 1 stdout-opencode-go.jsonl
```

### Recorded Result

- Verdict: `PASS`.
- Basis: the packet capture at `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/` holds the keyless run for both routes.
- LLM Gateway: exit `1`, stderr `dsh: MISSING_CREDENTIAL: llm-pi-ai: no credential for provider route "llmgateway"` naming `LLMGATEWAY_API_KEY`, and a last `final` event with `reason.kind` `error` and `error.code` `MISSING_CREDENTIAL`.
- OpenCode Go: exit `1`, stderr `dsh: MISSING_CREDENTIAL: llm-pi-ai: no credential for provider route "opencode-go"` naming `OPENCODE_API_KEY`, with the same `final` shape.
- Note: the saved capture omits `--permission-mode`. The command above adds the read-only preset for a dispatch that could reach a tool.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| CLI-001 | Keyless boot per route | Prove each route fails on its own key variable | `Run the keyless headless probe on both roster routes from a scratch folder with a disposable DSH_HOME. Capture stdout, stderr and the exit code for each route, then tell me whether each run failed on its own route key: LLMGATEWAY_API_KEY for LLM Gateway and OPENCODE_API_KEY for OpenCode Go. Do not modify the repository.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. run the dispatch shape from section 3 with `route-llmgateway-deepseek.patch.yml` -> 3. repeat with `route-opencode-go-deepseek.patch.yml` -> 4. read `exit-*.txt`, `stderr-*.txt` and `tail -n 1 stdout-*.jsonl` | Step 2: exit `1`, stderr names `LLMGATEWAY_API_KEY`, last event is `MISSING_CREDENTIAL`. Step 3: exit `1`, stderr names `OPENCODE_API_KEY`, last event is `MISSING_CREDENTIAL` | The four capture files under `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/`: `keyless-llmgateway.stderr.txt`, `keyless-llmgateway.stdout.jsonl`, `keyless-opencode-go.stderr.txt`, `keyless-opencode-go.stdout.jsonl` | PASS if each route exits `1`, names its own key and ends on a `final` event with `MISSING_CREDENTIAL`. FAIL if a route names the other route's key, exits `0` or reports `completed` | 1. Read stderr and the last JSONL line before the exit code. 2. Confirm the route patch basename matches the route in stderr. 3. Confirm the `session` event `cwd` is the scratch folder and not the checkout |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Isolation policy, command notation and verdict rules |
| `../../SKILL.md` | Dispatch shape, provider preflight and the keyless failure shape |
| `../../references/cli-reference.md` | Exit contract, stderr shape and JSON stream order |
| `../../references/providers-and-models.md` | Roster, key variable per route and the route patch names |
| `../../hard-rules.json` | `route-patch-required`, `lineage-patch-required`, `guards-patch-required`, `json-final-and-exit-required` and `closed-roster` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | LLM Gateway provider row and default model row |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | OpenCode Go provider row and default model row |
| `.dsh/patches/lineage.patch.yml` | Telemetry off, session log off, goal and plan off |
| `.dsh/patches/guards.patch.yml` | Loads the repo-guards plugin for the dispatch |
| `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/keyless-llmgateway.stderr.txt` | Recorded LLM Gateway keyless failure |
| `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/keyless-opencode-go.stderr.txt` | Recorded OpenCode Go keyless failure |

---

## 5. SOURCE METADATA

- Group: CLI Invocation
- Playbook ID: CLI-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `cli-invocation/keyless-boot-per-route.md`
