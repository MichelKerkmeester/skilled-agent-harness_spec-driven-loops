---
title: "Launcher Idle Timeout"
description: "Shared MCP server idle self-exit knob for mk-spec-memory, mk_skill_advisor, and mk_code_index."
---

# Launcher Idle Timeout

## 1. OVERVIEW

`SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN` controls server-side idle self-exit for the three native MCP servers that share the launcher lifecycle pattern. It exists to reduce orphan accumulation without making the CJS launchers guess whether a server is still in use.

## 2. CURRENT REALITY

The setting defaults to `30` minutes. Fractional values are allowed for tests, and `0` disables the idle monitor. Primary stdio input and secondary IPC socket connect/data/write events refresh activity. Active secondary IPC clients keep the server alive past the timeout.

The idle monitor lives in the MCP server processes, not only in the CJS launchers. When the timeout fires, the server closes IPC state and exits through the existing process path. The launchers continue to handle lease cleanup through their child-process exit handlers.

This knob is documented in `mcp_server/ENV_REFERENCE.md` and surfaced in the affected runtime READMEs. It is separate from the orphan process sweeper: idle timeout prevents some future stale servers, while the sweeper remains the operator fallback for already-orphaned process classes.

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/launcher-idle-timeout.ts` | Spec Kit Memory | Parses the env value and creates the idle monitor. |
| `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/launcher-idle-timeout.ts` | Skill Advisor | Package-local copy of the shared idle monitor. |
| `.opencode/skills/system-code-graph/mcp_server/lib/ipc/launcher-idle-timeout.ts` | Code Graph | Package-local copy of the shared idle monitor. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Documentation | Canonical env var reference. |

### Validation And Tests

| File | Focus |
|---|---|
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-idle-timeout.vitest.ts` | Spec Kit Memory idle parsing and timeout behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/ipc-socket-activity.vitest.ts` | IPC activity keeps the server alive. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-idle-timeout.vitest.ts` | Skill Advisor idle behavior. |
| `.opencode/skills/system-code-graph/mcp_server/tests/launcher-idle-timeout.vitest.ts` | Code Graph idle behavior. |
| `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/419-orphan-mcp-runtime-lifecycle-guardrails.md` | Manual dry-run and lifecycle guardrail scenario. |

## 4. SOURCE METADATA

- Group: Feature Flag Reference
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `19--feature-flag-reference/12-launcher-idle-timeout.md`
