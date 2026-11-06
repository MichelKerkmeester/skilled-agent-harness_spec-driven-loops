---
title: "PAT-001 -- Route and lineage composition"
description: "This scenario validates that each roster route composes with the lineage patch through --dump-config, with no loader warning and the expected default model row for `PAT-001`."
version: 1.0.0.0
---

# PAT-001 -- Route and lineage composition

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `PAT-001`.

---

## 1. OVERVIEW

This scenario validates the two patch layers a dispatch names before it can reach a model. It focuses on the composed config, not on a request.

### Why This Matters

A patch whose target row was renamed is only a loader warning. The run continues with the base row and the caller never learns that the route or lineage layer did nothing. `--dump-config` shows the composed result without a model call, so it is the cheapest check that both patches still bind.

---

## 2. SCENARIO CONTRACT

- Objective: Prove both route patches compose with `lineage.patch.yml`, exit `0` and leave no loader warning on stderr.
- Real user request: `Check that each DeepSeek Harness route still composes with the lineage patch before we use it. I want the default model row and the telemetry row, and I do not want a model call.`
- Prompt: `Compose each roster route with the lineage patch using --dump-config from a scratch folder and a disposable DSH_HOME. Confirm exit 0, no loader warning on stderr, and the route's provider and model in agent-default-model. Do not call a model.`
- Expected execution process: Create a scratch folder and a disposable home -> compose the LLM Gateway route with the lineage patch -> repeat for OpenCode Go -> read the exit code, stderr capture and the two named rows.
- Expected signals: Both runs exit `0`. The stderr capture holds no loader warning. `agent-default-model` names `llmgateway` and `deepseek-v4.1-flash-1017` for the first route, and `opencode-go` and `deepseek-v4.1-flash` for the second. `session-telemetry-otel` shows `mode: DISABLED`.
- Desired user-visible outcome: A clear statement that both route layers still bind, with the composed rows as evidence.
- Pass/fail: PASS if both routes exit `0`, stderr carries no loader warning and the two rows name the expected route and telemetry values. FAIL if any stderr line other than the recorded exit marker appears, the provider or model is wrong, or telemetry is not `DISABLED`.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the pinned dsh version before the composition check.
2. Create a scratch folder and a disposable home.
3. Compose each route with the lineage patch and `--dump-config`.
4. Keep stderr separate so a loader warning cannot hide in the config output.
5. Read `agent-default-model` and `session-telemetry-otel` in the composed text.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --dump-config </dev/null >dump-llmgateway.txt 2>stderr-llmgateway.txt
echo "exit=$?" >exit-llmgateway.txt
cd "$RUN_DIR" && DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-opencode-go-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --dump-config </dev/null >dump-opencode-go.txt 2>stderr-opencode-go.txt
echo "exit=$?" >exit-opencode-go.txt
grep -A3 "id: agent-default-model" dump-llmgateway.txt dump-opencode-go.txt
grep -A3 "id: session-telemetry-otel" dump-llmgateway.txt dump-opencode-go.txt
```

### Recorded Result

- Verdict: `PASS`.
- Basis: the packet capture at `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/` holds `dump-config-llmgateway.txt`, `dump-config-opencode-go.txt` and their stderr captures.
- Both runs exited `0`. Each stderr capture holds only the recorded `exit=0` marker, with no unmatched-target or loader warning.
- `agent-default-model` names `provider: llmgateway` and `model: deepseek-v4.1-flash-1017`, then `provider: opencode-go` and `model: deepseek-v4.1-flash`.
- `session-telemetry-otel` shows `mode: DISABLED` in both composed files.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAT-001 | Route and lineage composition | Prove both route patches compose with the lineage patch | `Compose each roster route with the lineage patch using --dump-config from a scratch folder and a disposable DSH_HOME. Confirm exit 0, no loader warning on stderr, and the route's provider and model in agent-default-model. Do not call a model.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. compose `route-llmgateway-deepseek.patch.yml` with `lineage.patch.yml` and `--dump-config` -> 3. repeat with `route-opencode-go-deepseek.patch.yml` -> 4. read both `agent-default-model` and `session-telemetry-otel` rows | Step 2: exit `0`, stderr has no loader warning, model is `deepseek-v4.1-flash-1017`. Step 3: exit `0`, stderr has no loader warning, model is `deepseek-v4.1-flash`. Both: telemetry is `DISABLED` | The composed files and stderr captures under `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/`, plus `commands.txt` for the literal command | PASS if both routes exit `0` with no loader warning and the expected rows. FAIL if any stderr line appears, the row is wrong or telemetry is not `DISABLED` | 1. Read stderr before the composed output. 2. Confirm both patch paths resolve and their basenames match the roster. 3. Re-run after a dsh version change, because a renamed base row turns a patch into a no-op |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Command notation and verdict rules |
| `../../SKILL.md` | Patch layers, composition order and the loader-warning escalation |
| `../../references/cli-reference.md` | `--dump-config`, patch grammar and the observed composition result |
| `../../references/runtime-folder-and-sync.md` | Patch inventory and the compose check |
| `../../hard-rules.json` | `route-patch-required`, `lineage-patch-required` and `closed-roster` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | LLM Gateway provider and default model rows |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | OpenCode Go provider and default model rows |
| `.dsh/patches/lineage.patch.yml` | Telemetry and lineage row changes |
| `.dsh/SYNC.md` | The compose check and the expected result |
| `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/004-dsh-runtime-folder-and-patches/evidence/dump-config-llmgateway.txt` | Recorded composed config for LLM Gateway |

---

## 5. SOURCE METADATA

- Group: Patch Composition
- Playbook ID: PAT-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `patches/route-and-lineage-composition.md`
