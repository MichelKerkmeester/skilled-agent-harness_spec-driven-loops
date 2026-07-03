---
title: "438 -- 028 CLI Stress: Trust-Gate Fuzz"
description: "Stress scenario fuzzing the skill-advisor trusted-mutation gate with adversarial flag and payload shapes: every untrusted mutation attempt must exit 64 client-side, with zero attempts reaching IPC."
version: 3.6.0.1
---

# 438 -- 028 CLI Stress: Trust-Gate Fuzz

## 1. OVERVIEW

This stress scenario is part of the 028 CLI stress set (434-438). It fuzzes the fail-closed trusted-mutation gate (scenario 431's contract) with adversarial shapes: flag-order games, JSON-payload mutations, env-zeroed grants, and alias probing. The discriminator is the same daemon-free sandbox as 431 — an attempt the gate REFUSES exits 64 before IPC, while an attempt that slips past the gate would surface as exit 75 (`backend unavailable`). Any 75 from an untrusted mutation row is therefore a gate bypass and an automatic FAIL.

The gate's mutation set is `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_propagate_enhances` in real apply mode (`mode=apply` with `dryRun` not true).

## 2. SCENARIO CONTRACT

- Objective: Confirm every untrusted mutation attempt across the fuzz matrix exits 64 and none reaches IPC.
- Real user request: `Can a cleverly-shaped CLI call — weird flag order, JSON payload, alias tricks — mutate the skill graph without an explicit trust grant?`
- Prompt: `Fuzz the skill-advisor trusted-mutation gate with adversarial flag and payload shapes and report any attempt that did not exit 64.`
- Expected execution process: Run the fuzz matrix below in an empty sandbox and count non-64 exits among untrusted mutation attempts.
- Expected signals: Zero non-64 exits in the untrusted block; the control rows behave per their comments.
- Desired user-visible outcome: The trust gate holds against shape games, not just the happy-path refusal.
- Pass/fail: PASS only when the untrusted block is uniformly 64 and the controls match.

## 3. TEST EXECUTION

### Prompt

```text
Fuzz the skill-advisor trusted-mutation gate with adversarial flag and payload shapes and report any attempt that did not exit 64.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

sa() { node .opencode/bin/skill-advisor.cjs "$@" --warm-only >/dev/null 2>&1; echo "$* -> exit=$?"; }

echo "== untrusted mutation attempts: ALL must exit 64"
sa advisor_rebuild
sa advisor_rebuild --force true
sa advisor_rebuild --untrusted
sa advisor_rebuild --trusted --untrusted                   # later flag wins -> untrusted
MK_SKILL_ADVISOR_CLI_TRUSTED=0 sa advisor_rebuild           # zeroed env grant is no grant
sa skill_graph_scan
sa skill_graph_scan --format jsonl --timeout-ms 1000
sa skill_graph_propagate_enhances --mode apply --dryRun false
sa skill_graph_propagate_enhances --json '{"mode":"apply","dryRun":false}'

echo "== controls"
sa advisor_rebuild --trusted                                # gate passes -> 75 (no daemon)
sa advisor_rebuild --maintainer                             # alias passes -> 75
MK_SKILL_ADVISOR_CLI_TRUSTED=1 sa skill_graph_scan          # env grant passes -> 75
sa skill_graph_propagate_enhances --mode apply              # dryRun defaults true -> not a mutation -> 75
sa advisor_status --workspaceRoot .                         # plain read -> 75

rm -rf "$SANDBOX"
```

### Expected

- Every row in the untrusted block exits 64 with `requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1` — including the flag-order game, the zeroed env, and the `--json` payload shape.
- Controls: the trusted/maintainer/env-granted rows and the dry-run and read rows all exit 75 (`backend unavailable`), proving the gate (not a broken CLI) produced the 64s.
- The sandbox socket dir stays empty throughout.

### Evidence

Shell transcript with the full matrix:

```text
== untrusted mutation attempts: ALL must exit 64
advisor_rebuild -> exit=64
advisor_rebuild --force true -> exit=64
advisor_rebuild --untrusted -> exit=64
advisor_rebuild --trusted --untrusted -> exit=64
advisor_rebuild -> exit=64
skill_graph_scan -> exit=64
skill_graph_scan --format jsonl --timeout-ms 1000 -> exit=64
skill_graph_propagate_enhances --mode apply --dryRun false -> exit=64
skill_graph_propagate_enhances --json {"mode":"apply","dryRun":false} -> exit=64
== controls
advisor_rebuild --trusted -> exit=75
advisor_rebuild --maintainer -> exit=75
skill_graph_scan -> exit=75
skill_graph_propagate_enhances --mode apply -> exit=75
advisor_status --workspaceRoot . -> exit=75
```

Refusal rerun without `>/dev/null`:

```text
{
  "status": "error",
  "error": "advisor_rebuild requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1",
  "exitCode": 64
}
refusal_exit=64
sandbox=/tmp/cli-playbook.t6rnij
total 0
drwx------@ 2 michelkerkmeester  wheel  64 Jul  2 22:49 .
drwx------@ 3 michelkerkmeester  wheel  96 Jul  2 22:49 ..
```

Post-matrix socket directory listing before sandbox cleanup:

```text
post_matrix_sandbox=/tmp/cli-playbook.lQRHFA
total 0
drwx------@ 2 michelkerkmeester  wheel  64 Jul  2 22:50 .
drwx------@ 3 michelkerkmeester  wheel  96 Jul  2 22:50 ..
```

### Pass / Fail

- **PASS**: untrusted block uniformly 64, controls uniformly 75, and the sandbox socket directory remained empty (`total 0`).

### Failure Triage

A 75 in the untrusted block is a gate bypass: check `assertTrustedForMutation`'s tool set and the `isPropagateApply` predicate against the attempted shape, then add the bypassing shape to the daemon-side trust-gate suite. A 64 in the control block means trust resolution broke (`--trusted` / `--maintainer` parsing or `envTrustedDefault`). Daemon-side defense in depth is locked by `advisor-trust-gate.vitest.ts`, including the daemon-environment-only `MK_SKILL_ADVISOR_TRUST_DEFAULT` grant.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../system-skill-advisor/feature_catalog/06--mcp-surface/skill-advisor-cli.md` | Feature-catalog source for the skill-advisor CLI |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | Trust-gate predicate, flag parsing (`--trusted` / `--maintainer` / `--untrusted`), env default |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Daemon-side untrusted default and `MK_SKILL_ADVISOR_TRUST_DEFAULT` |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-trust-gate.vitest.ts` | Daemon-side trust-gate regression suite |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 438
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-stress-trust-gate-fuzz.md`
