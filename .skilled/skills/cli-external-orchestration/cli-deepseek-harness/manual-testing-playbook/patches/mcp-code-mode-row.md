---
title: "PAT-003 -- MCP Code Mode row"
description: "This scenario validates that the MCP patch adds exactly one code_mode client row to the composed config and leaves the default composition without one for `PAT-003`."
version: 1.0.1.0
---

# PAT-003 -- MCP Code Mode row

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors and metadata for `PAT-003`.

---

## 1. OVERVIEW

This scenario validates the only supported way to give a dsh run an MCP tool. It focuses on the row count in the composed config, so no server starts.

### Why This Matters

MCP is off in every default dispatch. No shipped bundle mounts a client, there is no `--mcp` flag and the harness reads no project MCP file. The sole control is the patch a caller names. A patch that quietly adds two rows, or a base composition that already holds one, would widen the leaf's tool surface without the caller asking for it.

---

## 2. SCENARIO CONTRACT

- Objective: Prove the default composition has no MCP client row and the MCP patch adds exactly one `code_mode` row.
- Real user request: `Check that MCP is off in a normal DeepSeek Harness composition and that the Code Mode patch adds one client row and nothing else. Do not start the server.`
- Prompt: `Compose headless twice, first without the MCP patch and then with it, and confirm the MCP patch adds exactly one code_mode client row. Keep the run keyless and do not call a model.`
- Expected execution process: Create a scratch folder and a disposable home -> compose the route, lineage and guards patches without the MCP patch -> compose again with the MCP patch -> count the client rows and `code_mode` names in each file -> check both stderr captures.
- Expected signals: Without the patch, `dsh-mcp-client` row count is `0` and `serverName: code_mode` count is `0`. With the patch, both counts are `1`. Both stderr captures are empty. The row names `transport: stdio`, `command: node` and `startupTimeoutMs: 60000`.
- Desired user-visible outcome: A clear statement that MCP is opt-in and the patch adds exactly one row.
- Pass/fail: PASS if the counts move from `0` and `0` to `1` and `1` with empty stderr on both runs. FAIL if the base composition already holds a row, the patch adds more than one or stderr carries a warning.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Confirm the pinned dsh version.
2. Create a scratch folder and a disposable home.
3. Compose the baseline with route, lineage and guards patches.
4. Compose again with the MCP patch added last.
5. Count the rows in both files and check the stderr byte counts.

### Commands

```bash
REPO="$(pwd -P)"
RUN_DIR="$(mktemp -d)"
cd "$RUN_DIR" && DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --dump-config </dev/null >without-mcp.txt 2>without-mcp.stderr.txt
echo "exit=$?" >without-mcp.exit.txt
cd "$RUN_DIR" && DSH_HOME="$RUN_DIR/.dsh-home" dsh --profile headless --patch "$REPO/.dsh/patches/route-llmgateway-deepseek.patch.yml" --patch "$REPO/.dsh/patches/lineage.patch.yml" --patch "$REPO/.dsh/patches/guards.patch.yml" --patch "$REPO/.dsh/patches/mcp-code-mode.patch.yml" --dump-config </dev/null >with-mcp.txt 2>with-mcp.stderr.txt
echo "exit=$?" >with-mcp.exit.txt
grep -c "@deepseek-ai/dsh-mcp-client" without-mcp.txt with-mcp.txt
grep -c "serverName: code_mode" without-mcp.txt with-mcp.txt
wc -c without-mcp.stderr.txt with-mcp.stderr.txt
```

### Recorded Result

- Verdict: `PASS`.
- Basis: `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/010-dsh-mcp-code-mode/evidence/dump-config-mcp.txt`.
- Observed without the patch: exit `0`, `dsh-mcp-client` rows `0`, `code_mode` names `0`, stderr `0` bytes.
- Observed with the patch: exit `0`, `dsh-mcp-client` rows `1`, `code_mode` names `1`, stderr `0` bytes.
- The composed row names `transport: stdio`, `command: node`, the launcher at `.skilled/bin/mcp-code-mode-launcher.cjs`, `UTCP_CONFIG_FILE` in `env` and `startupTimeoutMs: 60000`.
- Support: `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/010-dsh-mcp-code-mode/evidence/keyless-mcp-boot.txt` records a keyless boot that started Code Mode, shut it down when the run ended and left no launcher process behind.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| PAT-003 | MCP Code Mode row | Prove MCP is opt-in and adds one row | `Compose headless twice, first without the MCP patch and then with it, and confirm the MCP patch adds exactly one code_mode client row. Keep the run keyless and do not call a model.` | 1. `REPO="$(pwd -P)"; RUN_DIR="$(mktemp -d)"` -> 2. compose route, lineage and guards without the MCP patch -> 3. compose again with `mcp-code-mode.patch.yml` -> 4. count `dsh-mcp-client` rows and `serverName: code_mode` in both files | Step 2: counts `0` and `0`, stderr `0` bytes. Step 3: counts `1` and `1`, stderr `0` bytes. Step 4: the row names `stdio`, `node` and `startupTimeoutMs: 60000` | `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/010-dsh-mcp-code-mode/evidence/dump-config-mcp.txt` and `keyless-mcp-boot.txt` | PASS if the counts move from `0` and `0` to `1` and `1` with empty stderr. FAIL if the base holds a row, the patch adds more than one or stderr carries a warning | 1. Confirm the MCP patch came after the guards patch in argv. 2. Confirm the base composition names no client row. 3. Read the MCP row and check that only `UTCP_CONFIG_FILE` is named in `env` |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| [manual-testing-playbook.md](../manual-testing-playbook.md) | Command notation and verdict rules |
| `../../SKILL.md` | MCP opt-in rule and the patch name |
| `../../references/mcp.md` | Client row shape, eager start and the composed result |
| `../../references/guards-and-hooks.md` | The `mcp-route-guard` allowlist that runs when the patch is present |
| `../../hard-rules.json` | `mcp-opt-in-only` |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.dsh/patches/mcp-code-mode.patch.yml` | One `code_mode` stdio client row |
| `.skilled/bin/mcp-code-mode-launcher.cjs` | Launcher the row starts |
| `.dsh/plugins/repo-guards/adapters/mcp-route-guard.mjs` | Denies a `code_mode` tool outside the four-tool allowlist |
| `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/010-dsh-mcp-code-mode/evidence/dump-config-mcp.txt` | Recorded row counts with and without the patch |

---

## 5. SOURCE METADATA

- Group: Patch Composition
- Playbook ID: PAT-003
- Canonical root source: `manual-testing-playbook.md`
- Feature file path: `patches/mcp-code-mode-row.md`
