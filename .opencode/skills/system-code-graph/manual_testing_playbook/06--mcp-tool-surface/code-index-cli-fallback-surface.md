---
title: "025 -- code-index CLI Fallback Surface"
description: "Operator check for the daemon-backed code-index CLI: 8-command list-tools parity, warm-only no-spawn exit 75, usage-error exit 64, dist-freshness exit 69, and suite-backed blocked-read rendering."
---

# 025 -- code-index CLI Fallback Surface

## 1. OVERVIEW

This scenario validates the 028 CLI fallback for the mk-code-index server. `node .opencode/bin/code-index.cjs` exposes the same 8 tools as the `mcp__mk_code_index__*` registration via a manifest generated from `CODE_GRAPH_TOOL_SCHEMAS`, with the shared exit taxonomy 0/1/64/69/75. The check runs entirely against a sandboxed socket directory plus the shipped sandboxed suites, so host daemons are never contacted.

The program-wide CLI scenarios live in the spec-kit playbook (427 parity, 428 warm-only, 429 dist freshness, 430 blocked-read, 437 coercion); this scenario is the code-graph-local smoke that an operator can run in under a minute.

## 2. SCENARIO CONTRACT

- Objective: Confirm the CLI enumerates 8 tools, refuses bad usage with 64, exits 75 warm-only against an absent daemon, and renders blocked reads per contract.
- Prompt: `Validate the code-index CLI fallback surface: list-tools count 8, warm-only exit 75, usage exit 64, blocked-read suite green.`
- Expected execution process: Run the command block below; no daemon spawn may occur.
- Expected signals: `ok 8` from list-tools; exit 75 on the warm-only probe; exit 64 on the malformed call; blocked-read suite passes.
- Desired user-visible outcome: The operator can rely on the CLI as a faithful stand-in for the MCP surface during transport-down windows.
- Pass/fail: PASS only when all four signals match.

## 3. TEST EXECUTION

### Prompt

```text
Validate the code-index CLI fallback surface: list-tools count 8, warm-only exit 75, usage exit 64, blocked-read suite green.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

node .opencode/bin/code-index.cjs list-tools --format json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['status'], d['data']['count'])"

node .opencode/bin/code-index.cjs code_graph_status --warm-only --timeout-ms 3000 >/dev/null 2>&1; echo "warm-only exit=$?"
node .opencode/bin/code-index.cjs code_graph_query --operation outline --subject foo.ts --limit abc --warm-only >/dev/null 2>&1; echo "usage exit=$?"

(cd .opencode/skills/system-code-graph/mcp_server && npx vitest run tests/code-index-cli-blocked-read.vitest.ts)
rm -rf "$SANDBOX"
```

### Expected

- `ok 8` — manifest parity with `CODE_GRAPH_TOOL_SCHEMAS`.
- `warm-only exit=75` with no daemon spawned and no socket created in the sandbox.
- `usage exit=64` (`Invalid value for limit: expected a number, received "abc"`).
- The blocked-read suite passes its nine stale-readiness cases (`status:blocked` plus `requiredAction`, exit 0).

### Evidence

Shell transcript with the count line, both exit codes, and the vitest summary.

### Pass / Fail

- **Pass**: all four signals as expected.
- **Fail**: count drift, a spawn on the warm-only probe, a wrong exit code, or a blocked-read regression.

### Failure Triage

Count drift means the manifest no longer tracks `CODE_GRAPH_TOOL_SCHEMAS` — run the parity suite. A spawn on warm-only or a wrong exit code points at the CLI entrypoint's probe/exit mapping. Blocked-read failures localize to the envelope normalization in `code-index-cli.ts`.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/06--mcp-tool-surface/code-index-cli.md` | Feature-catalog source for the CLI fallback surface |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/code-index.cjs` | Stable shim with dist-freshness and socket guards |
| `mcp_server/code-index-cli.ts` | CLI dispatcher, coercion, blocked-read rendering, exit taxonomy |
| `mcp_server/code-index-cli-manifest.ts` | Manifest generated from `CODE_GRAPH_TOOL_SCHEMAS` |
| `mcp_server/tests/code-index-cli-blocked-read.vitest.ts` | Blocked-read rendering suite |
| `mcp_server/tests/code-index-cli-parity.vitest.ts` | 8-tool parity lock |

## 5. SOURCE METADATA

- Group: MCP tool surface
- Playbook ID: 025
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `06--mcp-tool-surface/code-index-cli-fallback-surface.md`
