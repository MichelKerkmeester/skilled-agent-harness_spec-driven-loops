---
title: "427 -- CLI list-tools Parity Per System"
description: "Manual check that each 028 daemon-backed CLI enumerates exactly its system's tool surface — spec-memory 39, code-index 8, skill-advisor 9 — generated from the same schema source the MCP registration uses."
version: 3.6.0.2
---

# 427 -- CLI list-tools Parity Per System

## 1. OVERVIEW

This scenario verifies the tool-surface parity contract of the three 028 CLIs. Each CLI generates its command map from the same schema source its MCP server registers (`TOOL_DEFINITIONS` for spec-memory and skill-advisor, `CODE_GRAPH_TOOL_SCHEMAS` for code-index), so `list-tools` must enumerate exactly 39, 8, and 9 tools respectively. A count drift means the CLI and MCP surfaces have diverged.

`list-tools` is served locally from the loaded definitions — no daemon contact happens — so the check is host-safe by construction. The parity suites lock the same invariant in CI.

## 2. SCENARIO CONTRACT

- Objective: Confirm each CLI's `list-tools` count matches its system's registered MCP tool surface (39 / 8 / 9).
- Real user request: `If the MCP transport drops mid-session, does the CLI fallback expose every tool I had over MCP?`
- Prompt: `Validate list-tools parity for spec-memory, code-index, and skill-advisor against their schema sources.`
- Expected execution process: Run the unified offline smoke check (`node .opencode/bin/cli-offline-smoke.cjs`) as the primary daemon-free parity gate — it verifies the 39/8/9 counts plus dist freshness in one pass — then optionally cross-check per-CLI `list-tools --format json` counts and the parity vitest suites for granular evidence.
- Expected signals: `status: "ok"` with `data.count` of 39 (spec-memory), 8 (code-index), and 9 (skill-advisor); parity suites green.
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

# Primary: unified offline smoke check — verifies the 39/8/9 counts + dist freshness, daemon-free.
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

- `spec-memory: ok 39`, `code-index: ok 8`, `skill-advisor: ok 9`.
- All three parity suites pass (spec-memory locks 39 tools against `TOOL_DEFINITIONS`; code-index locks 8 against `CODE_GRAPH_TOOL_SCHEMAS`; skill-advisor locks 9 with byte-identical schemas).
- No daemon is spawned: `list-tools` answers from local definitions and `$SANDBOX/sock` stays empty.

### Evidence

Shell transcript from the required command block:

```text
CLI offline smoke: FAIL
scenario=cli-list-tools-parity
spec-memory: fail count=n/a/39 freshness=unknown daemonFree=true
code-index: ok count=8/8 freshness=fresh daemonFree=true
skill-advisor: ok count=9/9 freshness=fresh daemonFree=true
scenario=cli-cwd-independent-resolution
spec-memory: fail count=n/a/39 cwd=[unrelated-temp-dir] daemonFree=true
code-index: ok count=8/8 cwd=[unrelated-temp-dir] daemonFree=true
skill-advisor: ok count=9/9 cwd=[unrelated-temp-dir] daemonFree=true
spec-memory: @spec-kit/mcp-server dist is stale. Run: cd .opencode/skills/system-spec-kit/mcp_server && npm run build
Traceback (most recent call last):
  File "<string>", line 1, in <module>
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py", line 293, in load
    return loads(fp.read(),
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/__init__.py", line 346, in loads
    return _default_decoder.decode(s)
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 337, in decode
    obj, end = self.raw_decode(s, idx=_w(s, 0).end())
  File "/Applications/Xcode.app/Contents/Developer/Library/Frameworks/Python3.framework/Versions/3.9/lib/python3.9/json/decoder.py", line 355, in raw_decode
    raise JSONDecodeError("Expecting value", s, err.value) from None
json.decoder.JSONDecodeError: Expecting value: line 1 column 1 (char 0)
code-index: ok 8
skill-advisor: ok 9

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:43:57
   Duration  204ms (transform 89ms, setup 12ms, import 129ms, tests 4ms, environment 0ms)


 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:43:58
   Duration  150ms (transform 31ms, setup 0ms, import 41ms, tests 50ms, environment 0ms)


 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server

 ❯ tests/skill-advisor-cli-parity.vitest.ts (1 test | 1 failed) 21874ms
     × keeps top recommendations identical across ten representative prompts 21873ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/skill-advisor-cli-parity.vitest.ts > skill-advisor CLI local/native parity fixture > keeps top recommendations identical across ten representative prompts
AssertionError: expected null to be 'sk-code' // Object.is equality

- Expected:
"sk-code"

+ Received:
null

 ❯ tests/skill-advisor-cli-parity.vitest.ts:136:22
    134|       const cliTop = cliTopSkill(row.prompt, scope);
    135|       expect(pythonTop).toBe(row.skill);
    136|       expect(cliTop).toBe(row.skill);
       |                      ^
    137|       if (pythonTop !== cliTop) mismatches.push({ prompt: row.prompt, …
    138|     }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯


 Test Files  1 failed (1)
      Tests  1 failed (1)
   Start at  22:43:58
   Duration  21.99s (transform 20ms, setup 13ms, import 28ms, tests 21.87s, environment 0ms)
```

### Pass / Fail

- **FAIL**: `spec-memory` did not return the expected `ok 39` count, the offline smoke reported `spec-memory: fail count=n/a/39 freshness=unknown daemonFree=true`, and `tests/skill-advisor-cli-parity.vitest.ts` failed with `AssertionError: expected null to be 'sk-code'`.

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
| `.opencode/bin/cli-offline-smoke.cjs` | Unified offline smoke check (primary daemon-free 39/8/9 + freshness gate) |
| `.opencode/bin/spec-memory.cjs` | spec-memory shim |
| `.opencode/bin/code-index.cjs` | code-index shim |
| `.opencode/bin/skill-advisor.cjs` | skill-advisor shim |
| `mcp_server/tests/spec-memory-cli-parity-and-help.vitest.ts` | 39-tool parity lock |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | 8-tool parity lock |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-parity.vitest.ts` | 9-tool parity lock |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 427
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-list-tools-parity.md`
