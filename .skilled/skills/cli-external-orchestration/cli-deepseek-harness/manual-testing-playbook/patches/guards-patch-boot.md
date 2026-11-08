---
title: "PAT-002 -- Guards patch boot"
description: "This scenario validates that the guards patch loads the repo-guards bundle with no failed plugin entry and reaches the provider call for `PAT-002`."
version: 1.0.2.0
---

# PAT-002 -- Guards patch boot

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `PAT-002`.

---

## 1. OVERVIEW

This scenario validates the guards patch as a load layer. It focuses on whether the bundle activates before the model call, not on a guard verdict.

### Why This Matters

A plugin that fails to load prints `N entry did not activate` and the run continues unguarded. The failure is easy to miss because the stream still parses and the provider error still arrives. A zero count for that line is the signal that the bundle is active before the model is asked anything.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the guards patch loads the bundle with no failed entry and the run reaches credential resolution.
- Real user request: `Boot a keyless DeepSeek Harness run with the guards patch and tell me whether the guard bundle actually loaded. A missing key is fine, I only care about a failed plugin entry.`
- Prompt: `Boot headless with the guards patch on the LLM Gateway route and confirm the repo-guards bundle loads. I want the exit code and a zero count for "did not activate". A missing key is expected.`
- Expected execution process: Create a scratch folder and a disposable home -> run the keyless dispatch with the route, lineage and guards patches -> count the `did not activate` lines -> read the last event and the exit code.
- Expected signals: The run exits `1` with `MISSING_CREDENTIAL`. `grep -c "did not activate"` returns `0`. The guards patch is present in the argv before the app options.
- Desired user-visible outcome: A clear statement that the bundle loaded, with the zero count and the reached provider call as evidence.
- Pass/fail: PASS if the run reaches `MISSING_CREDENTIAL` and the failed-entry count is `0`. FAIL if any `did not activate` line appears or the run stops before the provider call.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the pinned dsh version.
2. Create a scratch folder and a disposable home.
3. Run the keyless dispatch with the route, lineage and guards patches.
4. Count the failed-entry lines on stderr.
5. Read the last JSONL line and the exit code.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && printf '%s' "Say ok." | env -i PATH="$PATH" HOME="$RUN_DIR" DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --json --permission-mode read-only --approval-policy never - >stdout.jsonl 2>stderr.txt
echo "exit=$?" >exit.txt
grep -c "did not activate" stderr.txt
tail -n 1 stdout.jsonl
```

### Recorded Result

- Verdict: `PASS`.
- Basis: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt`.
- Observed: exit `1`, stderr names `LLMGATEWAY_API_KEY` with `MISSING_CREDENTIAL`, `grep -c "did not activate"` returns `0`, and the last event is a `final` event with `reason.kind` `error`.
- The same capture records the plugin suite run in that packet, but this scenario grades the boot only. The current suite count lives in `GRD-001`.
- Note: the saved capture omits `--permission-mode`. The command above adds the read-only preset for a dispatch that could reach a tool.
- Rerun after hook parity: both compositions exit `1` with `MISSING_CREDENTIAL` and print no `did not activate` line. The interactive boot, with the route and guards patches only, also carried the skill-advisor brief, the worktree advisory and the `dsh_goal` tool. The lineage boot carried none of them and kept the session-prime context. Evidence: `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/015-dsh-hook-parity/evidence/keyless-boot-interactive.txt` and `keyless-boot-lineage.txt`.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAT-002 | Guards patch boot | Prove the bundle activates before the provider call | `Boot headless with the guards patch on the LLM Gateway route and confirm the repo-guards bundle loads. I want the exit code and a zero count for "did not activate". A missing key is expected.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. run the dispatch shape from section 3 with the route, lineage and guards patches -> 3. `grep -c "did not activate" stderr.txt` -> 4. `tail -n 1 stdout.jsonl` | Step 2: exit `1`, stderr names `LLMGATEWAY_API_KEY`. Step 3: `0`. Step 4: last event is `final` with `reason.kind` `error` | `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt` | PASS if the run reaches `MISSING_CREDENTIAL` and the failed-entry count is `0`. FAIL if a `did not activate` line appears or the run stops before the provider call | 1. Read stderr in full and search for `did not activate`. 2. Confirm the guards patch path resolves by relative plugin name. 3. Run the plugin suite in `GRD-001` before changing the patch |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Isolation policy and verdict rules |
| `../../SKILL.md` | Guard bundle delivery and the failed-entry escalation |
| `../../references/guards-and-hooks.md` | The twenty adapters, both compositions, error policies and the keyless boot evidence |
| `../../references/runtime-folder-and-sync.md` | Guards patch inventory |
| `../../hard-rules.json` | `no-repo-root-dotenv` and `dsh-home-isolated` for the boot shape |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/guards.patch.yml` | Inserts the repo-guards row by relative path and turns the skill advisor on |
| `.dsh/plugins/repo-guards/index.mjs` | Registers the 20 adapters |
| `.dsh/plugins/repo-guards/lineage-leaf.mjs` | The marker row the lineage patch inserts, which keeps the four interactive-only adapters off |
| `.dsh/plugins/repo-guards/README.md` | Adapter policies and the failed-entry behavior |
| `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/009-dsh-context-guards-and-goal-bridge/evidence/keyless-guards-boot.txt` | Recorded guards boot with a zero failed-entry count |

---

## 5. SOURCE METADATA

- Group: Patch Composition
- Playbook ID: PAT-002
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `patches/guards-patch-boot.md`
