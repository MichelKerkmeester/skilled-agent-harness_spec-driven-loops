---
title: "MDL-001 -- LLM Gateway route"
description: "This scenario validates that a keyed request over the LLM Gateway route exits 0 and ends on a completed final event for `MDL-001`."
version: 1.0.2.0
---

# MDL-001 -- LLM Gateway route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MDL-001`.

---

## 1. OVERVIEW

This scenario validates the first roster route end to end. It focuses on the completion signal a caller must read, not on exit code alone.

### Why This Matters

The harness owns model selection, so the route patch is the model choice. A keyed LLM Gateway run ends with exit 0, a `completed` final reason and empty stderr.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a keyed LLM Gateway request exits `0` and ends on a `final` event with `reason.kind` `completed`.
- Real user request: `Send one harmless request through the LLM Gateway route and tell me whether it actually completed. I want the final event, not just the console output.`
- Prompt: `Send one harmless keyed request through the LLM Gateway route and tell me whether it completed. Keep the run in a scratch folder with a disposable DSH_HOME and do not modify files.`
- Expected execution process: Confirm the pinned dsh version -> create a scratch folder and a disposable home -> run the dispatch shape with the route, lineage and guards patches -> keep stdout, stderr and the exit code apart -> read the last JSONL line -> confirm the cwd and the provider.
- Expected signals: Exit `0`. The last line is a `final` event with `reason.kind` `completed`. `agent-default-model` would name `llmgateway` and `deepseek-v4.1-flash-1017` in the composed config. The `session` event's `cwd` is the scratch folder. stderr has no `did not activate` line.
- Desired user-visible outcome: A short answer from the route plus a clear statement that the run completed under the documented contract.
- Pass/fail: PASS if the run exits `0` and the last event has `reason.kind` `completed`. FAIL if the run exits non-zero, the last line is not a parseable `final`, the reason is not `completed` or the cwd is the checkout. SKIP if `LLMGATEWAY_API_KEY` is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the pinned dsh version.
2. Confirm `LLMGATEWAY_API_KEY` is set in the dispatch environment and never in the command text.
3. Create a scratch folder and a disposable home.
4. Run one bounded, read-only request.
5. Read the last JSONL line before the exit code.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && printf '%s' "Reply with the single word OK and nothing else." | DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --json --permission-mode read-only --approval-policy never - >stdout.jsonl 2>stderr.txt
echo "exit=$?" >exit.txt
tail -n 1 stdout.jsonl
```

### Recorded Result

- Verdict: `PASS`.
- Observed: the keyed request exited `0` and ended with `final.reason.kind` `completed`. stderr is empty.
- Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stdout.jsonl`, `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.exit.txt` and the empty `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stderr.txt`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MDL-001 | LLM Gateway route | Prove a keyed request completes | `Send one harmless keyed request through the LLM Gateway route and tell me whether it completed. Keep the run in a scratch folder with a disposable DSH_HOME and do not modify files.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. run the dispatch shape with the route, lineage and guards patches -> 3. read `exit.txt` and `tail -n 1 stdout.jsonl` -> 4. check the `session` cwd | Step 2: run starts in the scratch folder. Step 3: exit `0`, last event is `final` with `reason.kind` `completed`. Step 4: cwd is not the checkout | `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stdout.jsonl`; `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.exit.txt`; empty `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/route-llmgateway.stderr.txt` | PASS if exit `0` and the last event is `completed`. FAIL if the exit is non-zero, the last line is not `final`, the reason is not `completed` or the cwd is the checkout. SKIP while the key is absent | 1. Read the last JSONL line first. 2. Confirm the route patch basename and the provider in the composed config. 3. Confirm the key is in the environment and not in argv or a file |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Key gate, command notation and verdict rules |
| `../../SKILL.md` | Dispatch shape, completion contract and provider preflight |
| `../../references/providers-and-models.md` | Roster row, key variable and the unconfirmed request status |
| `../../references/cli-reference.md` | Exit contract and JSON stream |
| `../../hard-rules.json` | `closed-roster`, `lineage-patch-required`, `guards-patch-required`, `json-final-and-exit-required` and `pinned-version-required` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | LLM Gateway provider and default model rows |
| `.dsh/patches/lineage.patch.yml` | Telemetry, session log, goal and plan off |
| `.dsh/patches/guards.patch.yml` | Loads the repo-guards plugin for the dispatch |
| `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt` | Composed config that names the provider and model |
| `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/keyless-llmgateway.stderr.txt` | Keyless proof that the route patch was selected |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: MDL-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/llmgateway-route.md`
