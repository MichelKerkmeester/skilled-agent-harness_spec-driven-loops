---
title: "434 -- 028 CLI Stress: Concurrent Dual-CLI+MCP Load"
description: "Stress scenario driving the three systems' sandboxed dual-client suites concurrently so real MCP and CLI clients hammer one daemon per system at the same time, with host daemons untouched."
version: 3.6.0.2
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
# Sandbox daemons reap asynchronously after suite teardown, so the count can briefly
# sit above BEFORE right after `wait`; poll up to ~15s for it to settle.
AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
for _ in $(seq 1 15); do
  [ "$AFTER" -le "$BEFORE" ] && break
  sleep 1
  AFTER=$(pgrep -f "mk-(spec-memory|code-index|skill-advisor)-launcher" | wc -l)
done
echo "launchers before=$BEFORE after=$AFTER"
```

### Expected

- Nine suite executions (3 systems x 3 rounds), all green.
- No suite wedges; `wait` returns each round.
- Launcher process count returns to the pre-run value after the async-reap settle window (suites tear down their sandboxes; code-index additionally has a dedicated teardown suite asserting zero orphans). A transient count above BEFORE immediately after `wait` is expected reap lag, not an orphan — it must settle to `<= BEFORE` within the poll window.

### Evidence

```text
=== round 1

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:43:56
   Duration  166ms (transform 28ms, setup 17ms, import 21ms, tests 58ms, environment 0ms)


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:43:56
   Duration  230ms (transform 100ms, setup 15ms, import 144ms, tests 8ms, environment 0ms)

[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] liveOwnerDetected: ownerPid=68502 classification=live-owner
[mk-code-index-launcher] bridging to lease holder pid=68502 socket=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-QCdvG7/daemon-ipc.sock
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] ready: {"start":"2026-07-02T20:43:57.037Z","end":"2026-07-02T20:43:57.049Z","actions":[],"server":".opencode/skills/system-code-graph/mcp_server/dist/index.js"}
[ipc-bridge] socket listening at /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-9KwOYv/daemon-ipc.sock
[mk-code-index] unknown tool dispatched: code_graph_not_registered
[mk-code-index] SIGTERM

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:43:56
   Duration  3.62s (transform 20ms, setup 0ms, import 27ms, tests 3.53s, environment 0ms)

=== round 2

 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:44:02
   Duration  893ms (transform 388ms, setup 172ms, import 284ms, tests 129ms, environment 0ms)

[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] liveOwnerDetected: ownerPid=68970 classification=live-owner
[mk-code-index-launcher] bridging to lease holder pid=68970 socket=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-e2Ocsm/daemon-ipc.sock

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:44:02
   Duration  1.34s (transform 740ms, setup 243ms, import 706ms, tests 20ms, environment 0ms)

[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] ready: {"start":"2026-07-02T20:44:03.914Z","end":"2026-07-02T20:44:03.929Z","actions":[],"server":".opencode/skills/system-code-graph/mcp_server/dist/index.js"}
[ipc-bridge] socket listening at /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-nkwr7g/daemon-ipc.sock
[mk-code-index] unknown tool dispatched: code_graph_not_registered
[mk-code-index] SIGTERM

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:44:02
   Duration  5.04s (transform 280ms, setup 0ms, import 332ms, tests 4.54s, environment 0ms)

=== round 3

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit


 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 RUN  v4.1.6 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-skill-advisor/mcp_server


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:44:08
   Duration  761ms (transform 450ms, setup 42ms, import 553ms, tests 12ms, environment 0ms)


 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  22:44:08
   Duration  306ms (transform 51ms, setup 39ms, import 53ms, tests 82ms, environment 0ms)

[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] liveOwnerDetected: ownerPid=69326 classification=live-owner
[mk-code-index-launcher] bridging to lease holder pid=69326 socket=/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-up0ltm/daemon-ipc.sock
[mk-code-index-launcher] loaded 1 env(s) from .env.local
[mk-code-index-launcher] env clickup_CLICKUP_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env clickup_CLICKUP_TEAM_ID from .env is not allowlisted; skipping
[mk-code-index-launcher] env figma_FIGMA_API_KEY from .env is not allowlisted; skipping
[mk-code-index-launcher] env github_GITHUB_PERSONAL_ACCESS_TOKEN from .env is not allowlisted; skipping
[mk-code-index-launcher] env SPECKIT_ABLATION from .env is not allowlisted; skipping
[mk-code-index-launcher] MAINTAINER_MODE: forcing INDEX_* to "true" for skills, plugins
[mk-code-index-launcher] ready: {"start":"2026-07-02T20:44:09.874Z","end":"2026-07-02T20:44:09.890Z","actions":[],"server":".opencode/skills/system-code-graph/mcp_server/dist/index.js"}
[ipc-bridge] socket listening at /private/var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/ci-eXStRz/daemon-ipc.sock
[mk-code-index] unknown tool dispatched: code_graph_not_registered
[mk-code-index] SIGTERM

 Test Files  1 passed (1)
      Tests  2 passed (2)
   Start at  22:44:08
   Duration  4.70s (transform 36ms, setup 0ms, import 58ms, tests 4.51s, environment 0ms)

launchers before=      14 after=      14
```

### Pass / Fail

- **PASS**: 9/9 suite executions green, no wedge, launcher count settled from `before=      14` to `after=      14`.

### Failure Triage

A failure that only appears under tri-system concurrency points at shared host resources (port/socket collisions in /tmp, file-descriptor pressure) rather than per-system logic — rerun the failing suite alone to discriminate. A launcher count that stays above BEFORE after the settle window means a harness teardown was skipped after a failed assertion (a real orphan); reap manually and triage the assertion first. A count that settled to `<= BEFORE` is clean — the suites' sandbox lease-holder daemons live in their own fresh socket dirs (e.g. `/var/folders/.../ci-*`), never the host daemon, so a bridge to such a socket during a run is expected, not a host-daemon touch.

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/tooling-and-scripts/spec-memory-cli-daemon-backed-surface.md` | Feature-catalog source for the CLI surface contract |

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
- Feature file path: `tooling-and-scripts/cli-stress-concurrent-dual-client-load.md`
