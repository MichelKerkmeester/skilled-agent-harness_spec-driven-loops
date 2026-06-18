---
title: "427 -- CLI list-tools Parity Per System"
description: "Manual check that each 028 daemon-backed CLI enumerates exactly its system's tool surface — spec-memory 37, code-index 8, skill-advisor 9 — generated from the same schema source the MCP registration uses."
---

# 427 -- CLI list-tools Parity Per System

## 1. OVERVIEW

This scenario verifies the tool-surface parity contract of the three 028 CLIs. Each CLI generates its command map from the same schema source its MCP server registers (`TOOL_DEFINITIONS` for spec-memory and skill-advisor, `CODE_GRAPH_TOOL_SCHEMAS` for code-index), so `list-tools` must enumerate exactly 37, 8, and 9 tools respectively. A count drift means the CLI and MCP surfaces have diverged.

`list-tools` is served locally from the loaded definitions — no daemon contact happens — so the check is host-safe by construction. The parity suites lock the same invariant in CI.

## 2. SCENARIO CONTRACT

- Objective: Confirm each CLI's `list-tools` count matches its system's registered MCP tool surface (37 / 8 / 9).
- Real user request: `If the MCP transport drops mid-session, does the CLI fallback expose every tool I had over MCP?`
- Prompt: `Validate list-tools parity for spec-memory, code-index, and skill-advisor against their schema sources.`
- Expected execution process: Run the unified offline smoke check (`node .opencode/bin/cli-offline-smoke.cjs`) as the primary daemon-free parity gate — it verifies the 37/8/9 counts plus dist freshness in one pass — then optionally cross-check per-CLI `list-tools --format json` counts and the parity vitest suites for granular evidence.
- Expected signals: `status: "ok"` with `data.count` of 37 (spec-memory), 8 (code-index), and 9 (skill-advisor); parity suites green.
- Desired user-visible outcome: The operator can state that the CLI fallback surface is tool-for-tool identical to the MCP surface for all three systems.
- Pass/fail: PASS only when all three counts match and the parity suites pass.

## 3. TEST EXECUTION

### Prompt

```text
Validate list-tools parity for spec-memory, code-index, and skill-advisor against their schema sources.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

# Primary: unified offline smoke check — verifies the 37/8/9 counts + dist freshness, daemon-free.
node .opencode/bin/cli-offline-smoke.cjs

# Granular cross-check: per-CLI list-tools counts.
for cli in spec-memory code-index skill-advisor; do
  printf '%s: ' "$cli"
  node .opencode/bin/$cli.cjs list-tools --format json \
    | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['status'], d['data']['count'])"
done

(cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/spec-memory-cli-parity-and-help.vitest.ts)
(cd .opencode/skills/system-code-graph/mcp_server && npx vitest run tests/code-index-cli-parity.vitest.ts)
(cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/skill-advisor-cli-parity.vitest.ts)

rm -rf "$SANDBOX"
```

### Expected

- `spec-memory: ok 37`, `code-index: ok 8`, `skill-advisor: ok 9`.
- All three parity suites pass (spec-memory locks 37 tools against `TOOL_DEFINITIONS`; code-index locks 8 against `CODE_GRAPH_TOOL_SCHEMAS`; skill-advisor locks 9 with byte-identical schemas).
- No daemon is spawned: `list-tools` answers from local definitions and `$SANDBOX/sock` stays empty.

### Evidence

Shell transcript with the three count lines and the three vitest pass summaries.

### Pass / Fail

- **Pass**: counts are exactly 37 / 8 / 9 and all parity suites pass.
- **Fail**: any count differs, `status` is not `ok`, or a parity suite fails.

### Failure Triage

A count drift means a tool was added or removed in the schema source without the CLI manifest following (code-index and skill-advisor) or signals a generation bug (spec-memory generates at runtime and cannot drift unless the schema import itself broke). Diff `tool-schemas.ts` / `TOOL_DEFINITIONS` against the CLI manifest module and rebuild dist.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/16--tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source for the CLI surface contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/cli-offline-smoke.cjs` | Unified offline smoke check (primary daemon-free 37/8/9 + freshness gate) |
| `.opencode/bin/spec-memory.cjs` | spec-memory shim |
| `.opencode/bin/code-index.cjs` | code-index shim |
| `.opencode/bin/skill-advisor.cjs` | skill-advisor shim |
| `mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` | 37-tool parity lock |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | 8-tool parity lock |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | 9-tool parity lock |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 427
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-list-tools-parity.md`
