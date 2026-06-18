---
title: "431 -- skill-advisor CLI Trusted-Gate Refusal"
description: "Manual check that the skill-advisor CLI fail-closed trusted-mutation gate refuses untrusted mutation commands with exit 64 before any daemon contact, and that --trusted / MK_SKILL_ADVISOR_CLI_TRUSTED grant passage."
---

# 431 -- skill-advisor CLI Trusted-Gate Refusal

## 1. OVERVIEW

This scenario verifies the fail-closed trusted-mutation gate in the skill-advisor CLI. Calls are sent untrusted by default; the mutation set — `advisor_rebuild`, `skill_graph_scan`, and `skill_graph_propagate_enhances` in real apply mode (`mode=apply` with `dryRun` not true) — requires `--trusted` (alias `--maintainer`) or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`. An untrusted attempt is refused client-side with exit 64 (`EXIT_USAGE`) before any IPC frame is sent, which is observable in a sandbox with no daemon: the refusal returns 64 where a gate bypass would have surfaced as exit 75 (backend unavailable).

The daemon enforces the gate independently: callers carry `_meta.callerAuthority`, and the daemon's own default is untrusted unless `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` is set in the daemon's environment, so a hand-rolled IPC client cannot skip the check.

## 2. SCENARIO CONTRACT

- Objective: Confirm untrusted mutation commands exit 64 client-side, trusted flags grant passage, and read-safe defaults stay open.
- Real user request: `Can some script rebuild or rescan my skill graph through the CLI without me explicitly trusting it?`
- Prompt: `Validate the skill-advisor trusted-mutation gate: untrusted mutations exit 64 pre-IPC; --trusted passes the gate; dry-run propagate stays untrusted-allowed.`
- Expected execution process: In a daemon-less sandbox, run the mutation commands untrusted (expect 64), with `--trusted` (expect the gate to pass and the call to fail later with 75 since no daemon exists), and the dry-run propagate untrusted (expect 75, proving the gate let it through).
- Expected signals: `requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1` with exit 64 on refusals; `backend unavailable` with exit 75 on gate-passing calls.
- Desired user-visible outcome: Mutations are impossible without an explicit trust grant, and the refusal names the exact grant options.
- Pass/fail: PASS only when every untrusted mutation exits 64 and every gate-passing call reaches the IPC stage.

## 3. TEST EXECUTION

### Prompt

```text
Validate the skill-advisor trusted-mutation gate: untrusted mutations exit 64 pre-IPC; --trusted passes the gate; dry-run propagate stays untrusted-allowed.
```

### Commands

```bash
SANDBOX=$(mktemp -d /tmp/cli-playbook.XXXXXX)
export SPECKIT_IPC_SOCKET_DIR="$SANDBOX/sock"
export SPECKIT_DAEMON_REELECTION=0

# Untrusted mutations -> refused client-side, exit 64
node .opencode/bin/skill-advisor.cjs advisor_rebuild --force true --warm-only; echo "rebuild exit=$?"
node .opencode/bin/skill-advisor.cjs skill_graph_scan --warm-only; echo "scan exit=$?"
node .opencode/bin/skill-advisor.cjs skill_graph_propagate_enhances --mode apply --dryRun false --warm-only; echo "apply exit=$?"

# Gate passes -> call reaches IPC and fails retryable (75) in the empty sandbox
node .opencode/bin/skill-advisor.cjs advisor_rebuild --trusted --force true --warm-only; echo "trusted exit=$?"
MK_SKILL_ADVISOR_CLI_TRUSTED=1 node .opencode/bin/skill-advisor.cjs skill_graph_scan --warm-only; echo "env-trusted exit=$?"

# Read-safe default: propagate dry-run (schema default dryRun=true) is untrusted-allowed
node .opencode/bin/skill-advisor.cjs skill_graph_propagate_enhances --mode apply --warm-only; echo "dry-run exit=$?"
rm -rf "$SANDBOX"
```

### Expected

- `rebuild exit=64`, `scan exit=64`, `apply exit=64`, each with `"<tool> requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1"`.
- `trusted exit=75` and `env-trusted exit=75` with `backend unavailable` — the gate passed and only the absent daemon stopped the call.
- `dry-run exit=75` — `dryRun` defaults true, so apply-mode-with-default-dry-run is not a mutation and the gate lets it through.

### Evidence

Shell transcript with all six envelopes and exit codes.

### Pass / Fail

- **Pass**: the three untrusted mutations exit 64 pre-IPC; the trusted and dry-run calls reach IPC (exit 75 in the sandbox).
- **Fail**: any untrusted mutation reaches IPC (exit 75/0), any refusal carries the wrong exit code, or the trusted flag fails to pass the gate.

### Failure Triage

An untrusted mutation reaching IPC means `assertTrustedForMutation` lost a tool from its set or the propagate `isPropagateApply` predicate regressed. A trusted call exiting 64 means flag parsing dropped `--trusted` (note: when both `--trusted` and `--untrusted` are given, the later flag wins). Daemon-side enforcement is covered by `advisor-trust-gate.vitest.ts` including the `MK_SKILL_ADVISOR_TRUST_DEFAULT` grant.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../../system-skill-advisor/feature_catalog/06--mcp-surface/skill-advisor-cli.md` | Feature-catalog source for the skill-advisor CLI |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts` | `assertTrustedForMutation`, `isPropagateApply`, `callerMeta` authority tagging |
| `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` | Daemon-side trust default (`MK_SKILL_ADVISOR_TRUST_DEFAULT`) |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-trust-gate.vitest.ts` | Daemon-side trust-gate regression coverage |
| `.opencode/skills/system-skill-advisor/mcp_server/tools/skill-graph-tools.ts` | `skill_graph_propagate_enhances` schema with `dryRun` default true |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 431
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-trusted-gate-refusal.md`
