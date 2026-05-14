---
title: "Skill Advisor Native Bootstrap"
description: "Bootstrap, verification, compatibility, rollback, and operator notes for the native advisor_recommend architecture."
---

# Skill Advisor Native Bootstrap

This is the canonical bootstrap guide for the standalone Skill Advisor MCP server. The advisor runs as `system_skill_advisor`, separate from `spec_kit_memory`, while preserving the public tool ids `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1-overview)
- [2. PREREQUISITES](#2-prerequisites)
- [3. INSTALLATION](#3-installation)
- [4. VERIFICATION](#4-verification)
- [5. NATIVE PACKAGE CHECKS](#5-native-package-checks)
- [6. COMPAT SHIMS](#6-compat-shims)
- [7. ROLLBACK](#7-rollback)
- [8. OPERATOR CHECKS](#8-operator-checks)
- [9. RELATED RESOURCES](#9-related-resources)

---

## 1. OVERVIEW

The native advisor is a TypeScript package under `.opencode/skills/system-skill-advisor/mcp_server/` with the public MCP tools `advisor_recommend`, `advisor_rebuild`, `advisor_status`, and `advisor_validate`. The standalone MCP server owns the advisor handlers, schemas, launcher, and package-local SQLite DB at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. The Python `skill_advisor.py` shim remains as the compatibility surface for scripts and prompt hooks.

---

## 2. PREREQUISITES

- Node.js and npm available for the standalone system-skill-advisor MCP server.
- Repository root as the working directory.
- Runtime MCP configuration includes both `spec_kit_memory` and `system_skill_advisor`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless intentionally testing rollback.

---

## 3. INSTALLATION

Install dependencies and build the advisor MCP server:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server install
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

Start or refresh the `system_skill_advisor` MCP server in the active runtime. The launcher is:

```bash
node .opencode/bin/skill-advisor-launcher.cjs
```

---

## 4. VERIFICATION

Verify native tool registration through `system_skill_advisor`:

```text
system_skill_advisor.advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
system_skill_advisor.advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1}})
system_skill_advisor.advisor_validate({"skillSlug":null})
```

Also verify the active runtime lists both MCP servers: `spec_kit_memory` for memory/context tools and `system_skill_advisor` for advisor tools.

Expected:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount`, and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata, and freshness trust.
- `advisor_rebuild` rebuilds stale, absent, or unavailable advisor state and returns before/after freshness diagnostics.
- `advisor_validate` returns real corpus, holdout, parity, safety, and latency measurements.

---

## 5. NATIVE PACKAGE CHECKS

Run before declaring bootstrap complete:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/compat/plugin-bridge-smoke.vitest.ts tests/handlers/advisor-recommend.vitest.ts --reporter=default
```

Current native advisor baseline:

| Metric | Expected |
| --- | --- |
| Full corpus top-1 | 80.5% |
| Holdout top-1 | 77.5% |
| UNKNOWN count | <= 10 |
| Python-correct regressions | 0 |
| Python regression suite | 52/52 passed |
| Package-local tests | 23 files / 167 tests |

---

## 6. COMPAT SHIMS

`skill_advisor.py` remains the CLI compatibility surface. In one-shot mode it probes the native advisor first and translates `advisor_recommend` output back to the legacy JSON-array shape. If the native probe is unavailable, it falls back to the local Python scorer.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin
```

Testing controls:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this context"
```

The OpenCode plugin bridge follows the same pattern: MCP-level `system_skill_advisor.advisor_recommend` delegation with prompt-safe fail-open behavior. Plugin consumers must use the stable bridge entrypoint:

```text
.opencode/skills/system-spec-kit/mcp_server/plugin_bridges/spec-kit-skill-advisor-bridge.mjs
```

If a package-level import is needed inside a subprocess fallback, it must target the standalone advisor package, never the old system-spec-kit advisor path. After build, the standalone server entrypoint is:

```text
.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js
```

---

## 7. ROLLBACK

Use rollback only long enough to diagnose or recover the native path.

```bash
# Disable prompt-time advisor surfaces and native recommendation output.
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1

# Keep hooks enabled but force Python compatibility where supported.
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1

# CLI-only Python path.
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "your prompt"
```

Unset variables after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

---

## 8. OPERATOR CHECKS

Use `advisor_status` as the prompt-safe health source:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

State interpretation:

| State | Meaning | Action |
| --- | --- | --- |
| `live` | Current graph generation is trusted | No action. |
| `stale` | Source files are newer than graph state | Run `skill_graph_scan` or restart the watcher. |
| `absent` | Graph state is missing | Rebuild from source; `advisor_recommend` should return an empty fail-open set. |
| `unavailable` | Status cannot be read | Inspect daemon logs and rebuild source state. |
| `degraded` | Runtime can only provide limited trust | Follow OP-001 in the manual playbook. |
| `quarantined` | Malformed skill metadata was isolated | Follow OP-002 in the manual playbook. |

Manual recovery scenarios live at:

```text
.opencode/skills/system-skill-advisor/mcp_server/manual_testing_playbook/manual_testing_playbook.md
```

---

## 9. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Package-local architecture and public API entrypoints. |
| [README.md](./README.md) | Operator overview, quick start, runtime integrations. |
| [Hook reference](../../references/hooks/skill-advisor-hook.md) | Claude, Copilot, Gemini, Codex, and OpenCode plugin hook contract. |
