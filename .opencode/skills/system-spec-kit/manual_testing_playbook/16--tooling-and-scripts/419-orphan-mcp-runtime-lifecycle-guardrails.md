---
title: "419 -- Orphan MCP Runtime Lifecycle Guardrails"
description: "Manual validation for dry-run orphan MCP cleanup, preservation rules, LaunchAgent template lint, Claude cleanup syntax, and launcher idle-timeout discoverability."
---

# 419 -- Orphan MCP Runtime Lifecycle Guardrails

## 1. OVERVIEW

This scenario validates the operator-facing lifecycle guardrails added for orphan MCP leak prevention. It focuses on proving that the sweeper can be reviewed safely in dry-run mode, that preserve decisions are visible, that the LaunchAgent template is only a valid template, and that the shared idle-timeout knob is discoverable from runtime docs.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm dry-run orphan cleanup is observable and non-mutating, Claude cleanup remains session-scoped, the LaunchAgent template lints without being installed, and `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` is documented for all affected MCP runtimes.
- Real user request: `Please validate the orphan MCP leak prevention runbook without killing processes or deleting /tmp files. Show me the dry-run command, preservation evidence, syntax checks, plist lint, and where the idle-timeout knob is documented.`
- Prompt: `Validate orphan MCP runtime lifecycle guardrails in dry-run mode and report cited pass/fail evidence.`
- Expected execution process: Run the documented commands, capture transcripts, compare the observed output against the expected signals, and return a concise verdict.
- Expected signals: syntax checks pass; plist lint passes; sweeper dry-run logs `[DRY-RUN]` actions or summary without killing/removing; verbose output shows preserve decisions when matching live preserved processes exist; `/tmp/devin-*` and `/tmp/codex-browser-use` are never removal candidates; `SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` appears in the env reference and affected runtime docs.
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS if every command is non-mutating, the dry-run output is reviewable, and documentation references align with the implementation packet.

---

## 3. TEST EXECUTION

### Prompt

```text
Validate orphan MCP runtime lifecycle guardrails in dry-run mode and report cited pass/fail evidence.
```

### Commands

1. `bash -n .opencode/scripts/orphan-mcp-sweeper.sh`
2. `bash -n .opencode/scripts/claude-session-cleanup.sh`
3. `plutil -lint .opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist`
4. `bash .opencode/scripts/orphan-mcp-sweeper.sh --dry-run --verbose --log-path /tmp/orphan-sweeper-review.log`
5. `rg -n "SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN|orphan-mcp-sweeper|claude-session-cleanup|orphan-sweep" README.md .opencode/scripts .opencode/skills/system-spec-kit .opencode/skills/system-skill-advisor .opencode/skills/system-code-graph`
6. `test ! -f ~/Library/LaunchAgents/com.michelkerkmeester.orphan-sweep.plist || echo "operator-installed copy exists outside repo"`

### Expected

Syntax checks exit `0`; plist lint reports OK; dry-run output contains summary lines and does not mutate PIDs or `/tmp`; discoverability grep finds the root README, scripts runbook, env reference, runtime READMEs, catalog entry, and this playbook scenario. The final command is informational: a home-level plist may exist later only after operator rollout, but this packet does not install it.

### Evidence

Shell transcript for all commands, `/tmp/orphan-sweeper-review.log`, relevant dry-run preserve/action lines, and grep output showing the documentation anchors.

### Pass / Fail

- **Pass**: all checks pass, dry-run is non-mutating, and documentation references align with the implementation packet.
- **Fail**: any syntax/lint check fails, dry-run performs a mutation, documentation omits the idle-timeout knob, or the runbook describes the LaunchAgent as active by default.

### Failure Triage

If syntax or plist lint fails, inspect the exact script/template before rerunning. If dry-run mutates anything, block rollout and inspect `log_action`, `remove_tmp_path`, and `terminate_candidates`. If documentation drift appears, update `.opencode/scripts/README.md`, `mcp_server/ENV_REFERENCE.md`, and the affected runtime README before repeating the grep.

## 4. SOURCE FILES

- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Feature catalog: [16--tooling-and-scripts/248-orphan-mcp-sweeper-and-launchagent-template.md](../../feature_catalog/16--tooling-and-scripts/248-orphan-mcp-sweeper-and-launchagent-template.md)
- Feature catalog: [19--feature-flag-reference/284-launcher-idle-timeout.md](../../feature_catalog/19--feature-flag-reference/284-launcher-idle-timeout.md)
- Runbook: [../../../../scripts/README.md](../../../../scripts/README.md)
- Spec packet: [../../../../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md](../../../../specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/022-orphan-mcp-leak-prevention/implementation-summary.md)

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 419
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/419-orphan-mcp-runtime-lifecycle-guardrails.md`
