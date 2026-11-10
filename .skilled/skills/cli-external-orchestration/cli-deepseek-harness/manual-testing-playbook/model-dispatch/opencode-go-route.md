---
title: "MDL-002 -- OpenCode Go route"
description: "This scenario validates that a keyed request over the OpenCode Go route exits 0 and ends on a completed final event for `MDL-002`, and records the endpoint it answers on."
version: 1.0.2.0
---

# MDL-002 -- OpenCode Go route

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `MDL-002`.

---

## 1. OVERVIEW

This scenario validates the second roster route end to end. It focuses on the completion signal and on the endpoint the request reaches.

### Why This Matters

Two endpoints are documented for OpenCode Go, and a keyed session through the checked-in patch answered on `https://opencode.ai/zen/go/v1`. The route patch composes, but composition proves only that the YAML binds. A keyed request is the evidence that settles an endpoint, so a re-run after a re-pin still records which URL it reached.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a keyed OpenCode Go request exits `0` and ends on a `final` event with `reason.kind` `completed`, and record which endpoint answered.
- Real user request: `Try one harmless request on the OpenCode Go route and tell me whether it completed. If the endpoint is wrong, I want to know that too.`
- Prompt: `Send one harmless keyed request through the OpenCode Go route and tell me whether it completed. Keep the run in a scratch folder with a disposable DSH_HOME, and report the endpoint behavior rather than assuming it.`
- Expected execution process: Confirm the pinned dsh version -> create a scratch folder and a disposable home -> run the dispatch shape with the route, lineage and guards patches -> keep stdout, stderr and the exit code apart -> read the last JSONL line -> record the endpoint in the patch and the response.
- Expected signals: Exit `0`. The last line is a `final` event with `reason.kind` `completed`. `agent-default-model` names `opencode-go` and `deepseek-v4.1-flash` in the composed config. The `session` event's `cwd` is the scratch folder. The recorded endpoint is the one the patch carries.
- Desired user-visible outcome: A short answer from the route, a clear completion statement and a named endpoint that now has evidence.
- Pass/fail: PASS if the run exits `0` and the last event has `reason.kind` `completed`, with the endpoint recorded. FAIL if the run exits non-zero, the last line is not a parseable `final`, the reason is not `completed` or the endpoint rejects the request. SKIP if `OPENCODE_API_KEY` is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the pinned dsh version.
2. Confirm `OPENCODE_API_KEY` is set in the dispatch environment and never in the command text.
3. Read the route patch and record which endpoint it names.
4. Create a scratch folder and a disposable home.
5. Run one bounded, read-only request.
6. Read the last JSONL line and the endpoint result together.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && printf '%s' "Reply with the single word OK and nothing else." | DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-opencode-go-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --json --permission-mode read-only --approval-policy never - >stdout.jsonl 2>stderr.txt
echo "exit=$?" >exit.txt
grep -n "baseURL" "$REPO/.dsh/patches/route-opencode-go-deepseek.patch.yml"
tail -n 1 stdout.jsonl
```

### Recorded Result

- Verdict: `SKIP`.
- Blocker: no provider key is available in this environment, so the keyed request cannot run.
- Key gate: blocked until `OPENCODE_API_KEY` exists in the dispatch environment. That is separate setup work, not a defect in the route patch.
- What is already known: `--dump-config` names `opencode-go` and `deepseek-v4.1-flash`, and the keyless run exits `1` with `MISSING_CREDENTIAL` for `OPENCODE_API_KEY`. The checked-in patch carries `https://opencode.ai/zen/go/v1`, the endpoint a keyed session answered on. A re-run must still record which URL it reached.
- Re-run condition: the key variable is set and the operator records the endpoint in the patch beside the result.
- Later evidence: a keyed session ran through this route against `https://opencode.ai/zen/go/v1`, so the re-run condition is met.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| MDL-002 | OpenCode Go route | Prove a keyed request completes and name the endpoint | `Send one harmless keyed request through the OpenCode Go route and tell me whether it completed. Keep the run in a scratch folder with a disposable DSH_HOME, and report the endpoint behavior rather than assuming it.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. record the `baseURL` in `route-opencode-go-deepseek.patch.yml` -> 3. run the dispatch shape with the route, lineage and guards patches -> 4. read `exit.txt` and `tail -n 1 stdout.jsonl` | Step 2: the endpoint is recorded. Step 3: the run starts in the scratch folder. Step 4: exit `0`, last event is `final` with `reason.kind` `completed` | The keyed transcript with stdout JSONL, stderr, exit code, the composed `agent-default-model` row and the endpoint from the patch. Re-run after a key is available | PASS if exit `0` and the last event is `completed`, with the endpoint recorded. FAIL if the exit is non-zero, the last line is not `final`, the reason is not `completed` or the endpoint rejects the request. SKIP while the key is absent | 1. Record the endpoint before the run so a rejection names a URL. 2. Read the last JSONL line and stderr. 3. If the endpoint rejects the request, try the other documented endpoint in a fresh scratch folder and record both results |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Key gate, command notation and verdict rules |
| `../../SKILL.md` | Dispatch shape, completion contract and the settled endpoint |
| `../../references/providers-and-models.md` | Roster row, key variable and the two documented endpoints |
| `../../references/cli-reference.md` | Exit contract and JSON stream |
| `../../hard-rules.json` | `closed-roster`, `lineage-patch-required`, `guards-patch-required`, `json-final-and-exit-required` and `pinned-version-required` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | OpenCode Go provider and default model rows |
| `.dsh/patches/lineage.patch.yml` | Telemetry, session log, goal and plan off |
| `.dsh/patches/guards.patch.yml` | Loads the repo-guards plugin for the dispatch |
| `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-opencode-go.txt` | Composed config that names the provider and model |
| `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/keyless-opencode-go.stderr.txt` | Keyless proof that the route patch was selected |

---

## 5. SOURCE METADATA

- Group: Model Dispatch
- Playbook ID: MDL-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `model-dispatch/opencode-go-route.md`
