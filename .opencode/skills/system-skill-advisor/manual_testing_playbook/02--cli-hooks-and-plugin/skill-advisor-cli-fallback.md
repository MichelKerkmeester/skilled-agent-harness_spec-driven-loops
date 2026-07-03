---
title: "CL-006 -- skill-advisor CLI Fallback Surface"
description: "Operator check for the daemon-backed skill-advisor CLI shipped by the 028 program: 9-command list-tools parity, warm-only no-spawn exit 75, fail-closed trusted-mutation refusal exit 64, and dist-freshness guard exit 69."
version: 0.8.0.1
---

# CL-006 -- skill-advisor CLI Fallback Surface

## 1. OVERVIEW

This scenario validates the 028 CLI fallback for the advisor daemon. `node .opencode/bin/skill-advisor.cjs` exposes 9 commands with byte-identical schemas to `TOOL_DEFINITIONS`, sends calls untrusted by default behind a fail-closed trusted-mutation gate, and shares the program exit taxonomy 0/1/64/69/75. All checks below run against a sandboxed socket directory and refuse-before-IPC paths, so host daemons are never contacted and nothing is spawned.

The program-wide CLI scenarios live in the spec-kit playbook (427 parity, 428 warm-only, 431 trusted gate, 432 tri-daemon drill, 438 trust-gate fuzz); this scenario is the advisor-local smoke an operator can run in under a minute.

## 2. SCENARIO CONTRACT

- Objective: Confirm list-tools parity (9), warm-only no-spawn (75), untrusted mutation refusal (64), and trusted pass-through.
- User request: `If the advisor MCP transport drops, can I still query the advisor — and is mutation still impossible without an explicit trust grant?`
- Expected execution process: Run the command block below in a fresh sandbox.
- Expected signals: `ok 9`; exit 75 on the warm-only read; exit 64 with the trust-grant message on untrusted `advisor_rebuild`; exit 75 on the `--trusted` variant (gate passed, daemon absent).
- Desired user-visible outcome: The CLI is a faithful, fail-closed stand-in for the MCP surface during transport-down windows.
- Pass/fail: PASS only when all four signals match.

## 3. TEST EXECUTION

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

node .opencode/bin/skill-advisor.cjs list-tools --format json \
  | python3 -c "import json,sys; d=json.load(sys.stdin); print(d['status'], d['data']['count'])"

node .opencode/bin/skill-advisor.cjs advisor_status --workspaceRoot . --warm-only --timeout-ms 3000 >/dev/null 2>&1; echo "warm-only exit=$?"
node .opencode/bin/skill-advisor.cjs advisor_rebuild --force true --warm-only >/dev/null 2>&1; echo "untrusted exit=$?"
node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --warm-only >/dev/null 2>&1; echo "trusted exit=$?"

ls "$SANDBOX/sock" 2>/dev/null || echo "socket dir empty"
rm -rf "$SANDBOX"
```

### Expected

- `ok 9` — manifest parity with `TOOL_DEFINITIONS`.
- `warm-only exit=75` (`backend unavailable`) with no spawn and no socket created.
- `untrusted exit=64` with `advisor_rebuild requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1`, refused client-side before IPC.
- `trusted exit=75` — the gate passed and only the absent daemon stopped the call.

### Evidence

Shell transcript from `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public`:

```text
ok 9
warm-only exit=75
untrusted exit=64
trusted exit=75
```

The final `ls "$SANDBOX/sock" 2>/dev/null || echo "socket dir empty"` command produced no additional stdout after `trusted exit=75`.

### Pass / Fail

- **PASS**: all four expected signals matched: `ok 9`, `warm-only exit=75`, `untrusted exit=64`, and `trusted exit=75`; the socket-dir listing printed no socket entries.

### Failure Triage

Count drift means the manifest no longer tracks `TOOL_DEFINITIONS` — run the parity suite. An untrusted mutation reaching IPC is a trust-gate bypass: inspect `assertTrustedForMutation` and add the shape to `advisor-trust-gate.vitest.ts`. A trusted refusal points at flag parsing or `envTrustedDefault`.

## 4. SOURCE FILES

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/bin/skill-advisor.cjs` | Stable shim with recursive source-mtime dist guard (exit 69) |
| `mcp_server/skill-advisor-cli.ts` | Dispatcher, trusted-mutation gate, warm-only probe, exit taxonomy |
| `mcp_server/skill-advisor-cli-manifest.ts` | Manifest generated from `TOOL_DEFINITIONS` |
| `mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | Parity fixture (local real-python3 vs native) |
| `mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Dual-client MCP + CLI coverage |
| `mcp_server/tests/handlers/advisor-trust-gate.vitest.ts` | Daemon-side trust-gate enforcement |
| `../../feature_catalog/06--mcp-surface/skill-advisor-cli.md` | Feature-catalog source for this surface |

## 5. SOURCE METADATA

- Group: CLI hooks and plugin
- Scenario ID: CL-006
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `02--cli-hooks-and-plugin/skill-advisor-cli-fallback.md`
