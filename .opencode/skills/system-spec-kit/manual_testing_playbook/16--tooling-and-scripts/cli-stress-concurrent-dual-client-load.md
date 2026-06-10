---
title: "434 -- 028 CLI Stress: Concurrent Dual-CLI+MCP Load"
description: "Stress scenario driving the three systems' sandboxed dual-client suites concurrently so real MCP and CLI clients hammer one daemon per system at the same time, with host daemons untouched."
---

# 434 -- 028 CLI Stress: Concurrent Dual-CLI+MCP Load

## 1. OVERVIEW

This stress scenario is part of the 028 CLI stress set (434-438). It loads the dual-stack contract: for each system, a real MCP client and the CLI run concurrently against one daemon, and all three systems run their dual-client suites at the same time so the host machine carries tri-system load concurrently. The suites embed their own sandbox harnesses (fresh socket dirs, temp DB paths), so the stress run never touches host daemons.

The dual-client suites are the shipped 028 hardening artifacts; the stress framing here is running them concurrently and repeatedly rather than once in isolation.

## 2. SCENARIO CONTRACT

- Objective: Confirm dual MCP+CLI clients stay correct under concurrent tri-system load across repeated runs.
- Real user request: `If my session uses MCP while hooks and cron hit the CLI on all three systems at once, does anything corrupt or wedge?`
- Prompt: `Run the spec-memory, code-index, and skill-advisor dual-client suites concurrently for three consecutive rounds and report failures, wedges, or orphans.`
- Expected execution process: Launch all three dual-client suites in parallel, wait, repeat three times, then check for orphaned launchers/daemons.
- Expected signals: All suites green in every round; zero orphan processes after the final round.
- Desired user-visible outcome: Dual-stack usage is safe under concurrent load, not just sequential smoke.
- Pass/fail: PASS only when all rounds are green and no orphans remain.

## 3. TEST EXECUTION

### Prompt

```text
Run the spec-memory, code-index, and skill-advisor dual-client suites concurrently for three consecutive rounds and report failures, wedges, or orphans.
```

### Commands

```bash
BEFORE=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
for round in 1 2 3; do
  echo "=== round $round"
  (cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/spec-memory-cli-dual-client-hardening.vitest.ts) &
  (cd .opencode/skills/system-code-graph/mcp_server && npx vitest run tests/code-index-cli-dual-client.vitest.ts) &
  (cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest run tests/skill-advisor-cli-dual-client.vitest.ts) &
  wait
done
AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
echo "launchers before=$BEFORE after=$AFTER"
```

### Expected

- Nine suite executions (3 systems x 3 rounds), all green.
- No suite wedges; `wait` returns each round.
- Launcher process count returns to the pre-run value (suites tear down their sandboxes; code-index additionally has a dedicated teardown suite asserting zero orphans).

### Evidence

Per-round vitest summaries and the launcher counts before/after.

### Pass / Fail

- **Pass**: 9/9 suite executions green, no wedge, orphan delta zero.
- **Fail**: any suite fails or hangs under concurrency, or launcher count grows.

### Failure Triage

A failure that only appears under tri-system concurrency points at shared host resources (port/socket collisions in /tmp, file-descriptor pressure) rather than per-system logic — rerun the failing suite alone to discriminate. Orphan growth means a harness teardown was skipped after a failed assertion; reap manually and triage the assertion first.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/16--tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source for the CLI surface contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `mcp_server/tests/spec-memory-cli-dual-client-hardening.vitest.ts` | Real MCP + CLI clients against one spec-memory daemon |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-dual-client.vitest.ts` | Real MCP + CLI dual-client coverage for code-index |
| `.opencode/skills/system-code-graph/mcp_server/tests/code-index-cli-teardown.vitest.ts` | Zero-orphan teardown assertion |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/skill-advisor-cli-dual-client.vitest.ts` | Dual-client MCP + CLI coverage for the advisor daemon |

## 5. SOURCE METADATA

- Group: Tooling And Scripts
- Playbook ID: 434
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `16--tooling-and-scripts/cli-stress-concurrent-dual-client-load.md`
