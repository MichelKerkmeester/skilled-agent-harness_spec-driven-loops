---
title: "437 -- 028 CLI Stress: Numeric-Coercion Edge Args"
description: "Stress scenario fuzzing schema-driven argv coercion in the code-index CLI: numeric strings must coerce and pass validation while garbage values exit 64, using the warm-only 75/64 discriminator so no daemon is needed."
---

# 437 -- 028 CLI Stress: Numeric-Coercion Edge Args

## 1. OVERVIEW

This stress scenario is part of the 028 CLI stress set (434-438). Flag values arrive as strings, so the code-index CLI applies schema-driven coercion (`coerceArgsToSchema`): a number-typed field like `limit` accepts `"5"` and rejects `"abc"`, and boolean-typed fields accept `true`/`false`. The scenario fuzzes edge values against this layer using a daemon-free discriminator: in a sandbox with an empty socket and `--warm-only`, an argument that PASSES validation proceeds to IPC and exits 75 (`backend unavailable`), while one that FAILS validation exits 64 before any IPC. The exit code therefore reveals exactly where each edge value landed.

Validation runs entirely client-side, so the whole fuzz matrix is host-safe and fast.

## 2. SCENARIO CONTRACT

- Objective: Confirm valid numeric/boolean strings coerce (exit 75 in the sandbox) and malformed values are rejected with exit 64.
- Real user request: `If a script passes --limit 1e3 or --limit abc to the CLI, do I get a clear usage error or does garbage reach the daemon?`
- Prompt: `Fuzz code-index numeric and boolean argv coercion with edge values and report the 64/75 split against the expected matrix.`
- Expected execution process: Run the edge matrix below against `code_graph_query` with `--warm-only` in an empty sandbox and record exit codes.
- Expected signals: Each case lands on its expected side: coercible values (including out-of-range numbers, whose clamping is handler-owned) exit 75, while malformed values exit 64 with a clear `Invalid value for limit` style message.
- Desired user-visible outcome: Argument mistakes produce immediate, named usage errors; valid values never get mangled.
- Pass/fail: PASS only when the full matrix matches.

## 3. TEST EXECUTION

### Prompt

```text
Fuzz code-index numeric and boolean argv coercion with edge values and report the 64/75 split against the expected matrix.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

run() { node .opencode/bin/code-index.cjs code_graph_query --operation outline --subject foo.ts "$@" --warm-only >/dev/null 2>&1; echo "$* -> exit=$?"; }

# Expect 75 (coerced, passed validation, stopped only by the absent daemon)
run --limit 5
run --limit 1000           # schema maximum
run --includeTransitive true --maxDepth 3
run --minConfidence 0.5
run --limit 0              # out-of-range: coerced, range left to handler clamping
run --limit 1001           # out-of-range: coerced, range left to handler clamping
run --maxDepth 21          # out-of-range: coerced, range left to handler clamping
run --minConfidence 1.5    # out-of-range: coerced, range left to handler clamping

# Expect 64 (rejected client-side before IPC)
run --limit abc            # non-numeric
run --limit ""             # empty value
run --nosuchflag 1         # unknown key (additionalProperties false)
run --operation bogus      # enum violation (overrides the valid value)

rm -rf "$SANDBOX"
```

### Expected

- The first eight cases exit 75. Note the deliberate asymmetry: out-of-range numbers (`--limit 0`, `--limit 1001`, `--maxDepth 21`, `--minConfidence 1.5`) coerce to numbers and pass CLI validation because range is left to handler clamping (the schema documents "handler clamps"), matching the MCP path's behavior.
- The remaining cases exit 64 with messages naming the offending field (for example `Invalid value for limit: expected a number, received "abc"`).
- No case exits 0 or 1, and nothing is spawned.

### Evidence

Shell transcript with the full matrix of `case -> exit` lines; rerun a sample failure without `>/dev/null` to capture the message text.

### Pass / Fail

- **Pass**: every case lands on its expected exit code.
- **Fail**: any malformed value reaches IPC (75/0), any valid value is rejected (64), or an unknown flag is silently accepted.

### Failure Triage

A malformed numeric reaching IPC means `coerceArgsToSchema` started passing unparseable strings through — the validation parity with `validateToolArgs()` is the invariant to restore. An out-of-range number suddenly exiting 64 means CLI-side validation started enforcing ranges the handler is supposed to clamp, breaking MCP/CLI behavior parity; the parity suite (scenario 427) localizes that drift.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../system-code-graph/feature_catalog/06--mcp-tool-surface/code-index-cli.md` | Feature-catalog source for the code-index CLI |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-code-graph/mcp_server/code-index-cli.ts` | `coerceArgsToSchema` and the usage-error exit mapping |
| `.opencode/skills/system-code-graph/mcp_server/tool-schemas.ts` | `code_graph_query` schema with `limit` 1-1000, `maxDepth` 1-20, `minConfidence` 0-1 |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-parity.vitest.ts` | Schema parity lock backing the matrix expectations |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 437
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-stress-numeric-coercion-edge-args.md`
