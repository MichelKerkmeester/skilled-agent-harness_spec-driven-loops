---
title: "FAN-001 -- Deep-research lineage"
description: "This scenario validates a research lineage on the cli-deepseek-harness executor kind, including its lineage command, isolated home and completion check for `FAN-001`."
version: 1.0.2.0
---

# FAN-001 -- Deep-research lineage

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `FAN-001`.

---

## 1. OVERVIEW

This scenario validates the shared deep-loop runner as the only process adapter for a dsh lineage. It focuses on the built command, the per-lineage home and the result check.

### Why This Matters

The packet must not grow a second spawn path. The runner owns the version probe, the route patch mapping, the guards patch, the environment allowlist, stdin closure, the timeout and the containment scan. A lineage that runs outside that path can bypass any one of them.

---

## 2. SCENARIO CONTRACT

- Objective: Prove a research lineage on kind `cli-deepseek-harness` builds the documented command and completes on exit `0` plus a `completed` final event.
- Real user request: `Run a deep-research pass on DeepSeek Harness through the normal lineage runner and tell me whether it completed. Use the LLM Gateway route and do not give it MCP tools.`
- Prompt: `Run a deep-research lineage on the cli-deepseek-harness executor kind with the LLM Gateway route and read-only permissions. Return the lineage status and the final reason, and do not mount MCP.`
- Expected execution process: Name the kind and model explicitly -> let the runner probe `dsh` and the pinned version in a throwaway home -> create disposable `dsh-home-*` under the OS temp directory, outside the checkout and lineage, and remove it after the run -> build the argv with the route, lineage and guards patches -> write the prompt to stdin and close it -> apply `timeoutSeconds` -> read the result and the containment scan.
- Expected signals: The cwd is the lineage directory, never the repository root. `DSH_HOME` points to disposable `dsh-home-*` under the OS temp directory, outside the checkout and lineage, and the runner removes it after the run. The argv carries the route patch mapped from `deepseek-v4.1-flash-1017`, the lineage patch and the guards patch. Exit is `0`, the last line is a `final` event with `reason.kind` `completed`, stderr has no `did not activate` line and the containment scan finds no write outside the lineage.
- Desired user-visible outcome: A completed research lineage with a recorded executable version, invocation fingerprint and attempt outcome.
- Pass/fail: PASS if the runner builds the documented command and the run ends on exit `0` with `completed`. FAIL if the runner omits a required patch, starts in the checkout, inherits `DSH_HOME` or grades a non-zero exit as complete. SKIP if the route key is missing from the environment, and name that blocker.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the runtime carries the `cli-deepseek-harness` executor kind and that the kind is not in a default allowlist.
2. Name the kind, model and route explicitly.
3. Leave `liveTools.mcpServers` unset so the MCP patch is not added.
4. Let the runner create the home and the lineage cwd.
5. Read the attempt outcome, the final reason and the containment result.

### Commands

```text
agent: Start a research lineage with kind cli-deepseek-harness, model deepseek-v4.1-flash-1017, permission read-only and no MCP servers.
agent: Confirm the runner probes the pinned dsh version in a throwaway home, sets DSH_HOME to disposable dsh-home-* under the OS temp directory, outside the checkout and lineage, removes it after the run, keeps the cwd in the lineage directory, and builds the route, lineage and guards patches with the prompt on stdin.
bash: read the lineage result and confirm exit 0, a last final event with reason.kind completed, no "did not activate" line and a clean containment scan.
```

### Recorded Result

- Verdict: `PASS`.
- Observed: the clean LLM Gateway deep-research lineage completed with exit 0 and a `completed` final event. Its containment scan reported zero advisory events and no quarantine.
- Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage.md`, `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage-clean.exit.txt` and `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage-clean.stdout.txt`.
- OpenCode Go remains configured, not verified, and stays out of default allowlists while its key is unset.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| FAN-001 | Deep-research lineage | Prove the runner builds and completes a dsh research lineage | `Run a deep-research lineage on the cli-deepseek-harness executor kind with the LLM Gateway route and read-only permissions. Return the lineage status and the final reason, and do not mount MCP.` | 1. `agent:` start the lineage with the kind, model and route named -> 2. `agent:` confirm the runner builds the route, lineage and guards patches and sets the lineage home -> 3. `bash:` read the result, the last event and the containment scan | Step 1: cwd is the lineage directory and `DSH_HOME` points to disposable `dsh-home-*` under the OS temp directory, outside the checkout and lineage. Step 2: argv carries the mapped route patch, lineage and guards. Step 3: exit `0`, `final` reason `completed`, no `did not activate`, clean containment and the home removed after the run | `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage.md`; `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage-clean.exit.txt`; `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/fanout-lineage-clean.stdout.txt` | PASS if the command shape matches and the run ends on exit `0` with `completed`. FAIL if a required patch is missing, the cwd is the checkout, `DSH_HOME` is inherited or a non-zero exit is graded complete. SKIP while the route key is absent | 1. Confirm the kind is not in a default allowlist and was named explicitly. 2. Check the model-to-route mapping. 3. Confirm `SPECKIT_DEEPSEEK_HARNESS_STATE_DIR` and `DSH_HOME` were unset before the spawn |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Isolation policy, key gate and verdict rules |
| `../../SKILL.md` | Deep-loop ownership and the no-second-adapter rule |
| `../../references/fanout-executor.md` | Lineage command, environment allowlist, recursion and result checks |
| `../../references/mcp.md` | The `code_mode` opt-in for a lineage |
| `../../hard-rules.json` | `lineage-patch-required`, `dsh-home-isolated` and `no-repo-root-dotenv` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/lineage.patch.yml` | Required lineage layer |
| `.dsh/patches/guards.patch.yml` | Required guard layer |
| `.dsh/patches/route-llmgateway-deepseek.patch.yml` | Route selected by `deepseek-v4.1-flash-1017` |
| `.dsh/patches/route-opencode-go-deepseek.patch.yml` | Route selected by `deepseek-v4.1-flash` |

---

## 5. SOURCE METADATA

- Group: Fan-Out Executor
- Playbook ID: FAN-001
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `fanout/deep-research-lineage.md`
