---
title: "Skill Advisor Install + Setup Guide"
description: "Bootstrap, verification, runtime hooks, compatibility shim, rollback, operator notes and reference commands for the native advisor_recommend architecture (merged INSTALL_GUIDE + SET-UP_GUIDE)."
---

# Skill Advisor Install + Setup Guide

<!-- sk-doc-template: skill_reference_install_guide -->

This is the canonical install + setup guide for the standalone Skill Advisor MCP server. The advisor runs as `mk_skill_advisor`, separate from `mk-spec-memory`. It preserves the public tool ids `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` plus one internal trusted-caller tool `skill_graph_propagate_enhances`. This document merges the previously-separate `SET-UP_GUIDE.md` (runtime hooks, rollback CLI, operator states, reference commands) into the install bootstrap so there is a single source of truth.

---

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PREREQUISITES](#2--prerequisites)
- [3. INSTALLATION](#3--installation)
- [4. VERIFICATION](#4--verification)
- [5. NATIVE PACKAGE CHECKS](#5--native-package-checks)
- [6. RUNTIME HOOKS AND PLUGIN](#6--runtime-hooks-and-plugin)
- [7. COMPAT SHIMS](#7--compat-shims)
- [8. ROLLBACK](#8--rollback)
- [9. OPERATOR CHECKS](#9--operator-checks)
- [10. TROUBLESHOOTING](#10--troubleshooting)
- [11. REFERENCE COMMANDS](#11--reference-commands)
- [12. RELATED RESOURCES](#12--related-resources)

---

<!-- /ANCHOR:table-of-contents -->

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The native advisor is a TypeScript package under `.opencode/skills/system-skill-advisor/mcp_server/`. It exposes 8 public MCP tools (`advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`) plus 1 internal trusted-caller tool (`skill_graph_propagate_enhances`, gated behind auth). The standalone MCP server owns the advisor handlers, schemas, launcher, plus the package-local SQLite DB at `.opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite`. The Python `skill_advisor.py` shim remains as the compatibility surface for scripts and prompt hooks.

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-prerequisites -->
## 2. PREREQUISITES

- Node.js and npm available for the standalone system-skill-advisor MCP server.
- Repository root as the working directory.
- Runtime MCP configuration includes both `mk-spec-memory` and `mk_skill_advisor`.
- `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` is unset unless intentionally testing rollback.
- The local shared package at `.opencode/skills/system-spec-kit/shared` is present; `npm install` links it into `mcp_server/node_modules/@spec-kit/shared`.

---

<!-- /ANCHOR:2-prerequisites -->

<!-- ANCHOR:3-installation -->
## 3. INSTALLATION

Install dependencies and build the advisor MCP server:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server install
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
```

Verify the local shared package link exists. Missing this link causes MCP startup to fail with `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared`.

```bash
test -e .opencode/skills/system-skill-advisor/mcp_server/node_modules/@spec-kit/shared && echo "shared dependency linked"
```

Start or refresh the `mk_skill_advisor` MCP server in the active runtime. The launcher is:

```bash
node .opencode/bin/mk-skill-advisor-launcher.cjs
```

---

<!-- /ANCHOR:3-installation -->

<!-- ANCHOR:4-verification -->
## 4. VERIFICATION

Verify native tool registration through `mk_skill_advisor`:

```text
mk_skill_advisor.advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
mk_skill_advisor.advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1}})
mk_skill_advisor.advisor_validate({"skillSlug":null})
```

Also verify the active runtime lists both MCP servers: `mk-spec-memory` for memory/context tools and `mk_skill_advisor` for advisor tools.

Expected:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastGenerationBump`, `lastScanAt`, `skillCount` and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata and freshness trust.
- `advisor_rebuild` rebuilds stale, absent or unavailable advisor state and returns before/after freshness diagnostics.
- `advisor_validate` returns real corpus, holdout, parity, safety and latency measurements.

---

<!-- /ANCHOR:4-verification -->

<!-- ANCHOR:5-native-package-checks -->
## 5. NATIVE PACKAGE CHECKS

Run before declaring bootstrap complete:

```bash
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build
node -e "import('./.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/lib/scorer/lanes/semantic-shadow.js')"
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run test -- tests/compat/plugin-bridge-smoke.vitest.ts tests/handlers/advisor-recommend.vitest.ts --reporter=default
```

Current native advisor baseline:

| Metric | Expected |
| --- | --- |
| Full corpus top-1 | 80.5% |
| Holdout top-1 | 77.5% |
| UNKNOWN count | <= 10 |
| Python-correct regressions | 0 |
| Python regression suite | regression harness available |
| Package-local tests | 23 files / 167 tests |

---

<!-- /ANCHOR:5-native-package-checks -->

<!-- ANCHOR:6-runtime-hooks-and-plugin -->
## 6. RUNTIME HOOKS AND PLUGIN

Prompt-time routing is available across runtime adapters:

| Runtime | Hook Surface |
| --- | --- |
| Claude Code | `.opencode/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts` |
| Gemini CLI | `.opencode/skills/system-skill-advisor/hooks/gemini/user-prompt-submit.ts` |
| Codex CLI | `.opencode/skills/system-skill-advisor/hooks/codex/user-prompt-submit.ts` plus `prompt-wrapper.ts` fallback and `lib/codex-hook-policy.ts` |
| Devin CLI | `.opencode/skills/system-skill-advisor/hooks/devin/user-prompt-submit.ts` via `.devin/hooks.v1.json` |
| OpenCode | `.opencode/plugins/mk-skill-advisor.js` plus the cross-process gateway at `.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs` |

The OpenCode bridge must use the stable package entrypoint:

```text
.opencode/skills/system-skill-advisor/mcp_server/compat/index.ts
```

After build, plugin consumers load:

```text
.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/compat/index.js
```

---

<!-- /ANCHOR:6-runtime-hooks-and-plugin -->

<!-- ANCHOR:7-compat-shims -->
## 7. COMPAT SHIMS

`skill_advisor.py` remains the CLI compatibility surface. In one-shot mode it probes the native advisor first and translates `advisor_recommend` output back to the legacy JSON-array shape. If the native probe is unavailable, it falls back to the local Python scorer.

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "help me commit my changes"
printf '%s' "help me commit my changes" | python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin
```

Mode meanings:

| Mode | Behavior |
| --- | --- |
| default | Probe native. Use native if live/stale. Otherwise local Python fallback. |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require native routing and fail prompt-safely when unavailable. |
| `--force-local` | Bypass native routing and run local Python scoring. |

Testing controls:

```bash
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this context"
```

The OpenCode plugin bridge follows the same pattern: MCP-level `mk_skill_advisor.advisor_recommend` delegation with prompt-safe fail-open behavior. Plugin consumers must use the stable bridge entrypoint:

```text
.opencode/skills/system-skill-advisor/mcp_server/plugin_bridges/mk-skill-advisor-bridge.mjs
```

If a package-level import is needed inside a subprocess fallback, it must target the standalone advisor package, never the old system-spec-kit advisor path. After build, the standalone server entrypoint is:

```text
.opencode/skills/system-skill-advisor/mcp_server/dist/system-skill-advisor/mcp_server/advisor-server.js
```

---

<!-- /ANCHOR:7-compat-shims -->

<!-- ANCHOR:8-rollback -->
## 8. ROLLBACK

Use rollback only long enough to diagnose or recover the native path.

| Control | Scope |
| --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables prompt-time advisor surfaces and native recommendations across Claude, Codex, Gemini, OpenCode hooks. |
| `MK_SKILL_ADVISOR_HOOK_DISABLED=1` | **Devin-specific disable flag.** The Devin hook checks this variable first, then falls back to `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`. Set both when disabling all runtimes including Devin. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Forces Python fallback in shim or plugin bridge diagnostics. |
| `--force-local` | CLI-only Python scorer path. |
| `--force-native` | CLI-only native-required path. |

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

<!-- /ANCHOR:8-rollback -->

<!-- ANCHOR:9-operator-checks -->
## 9. OPERATOR CHECKS

`skill_graph_*` tools are owned by the `mk_skill_advisor` MCP server as of `013/009/008`. Public tool ids remain unchanged.

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

### Indexer scan-vs-index counts

`skill_graph_scan` reports two numbers: `scannedFiles` (every `graph-metadata.json` discovered) and `indexedFiles` (real skills indexed into SQLite). The delta is normally 1 or 2 files. The indexer skips `scripts/test-fixtures/*/graph-metadata.json` (test scaffolding) and emits a `NON-SKILL-METADATA: skipped` warning. A larger delta means real skills are being filtered, so inspect the warning list.

H5 operator scenarios live in the manual playbook under `04--operator-h5/`.

---

<!-- /ANCHOR:9-operator-checks -->

<!-- ANCHOR:10-troubleshooting -->
## 10. TROUBLESHOOTING

| What You See | Cause | Fix |
| --- | --- | --- |
| MCP startup logs show `ERR_MODULE_NOT_FOUND` for `@spec-kit/shared` from `semantic-shadow.js` | The advisor package was built, but its local shared package link is missing from `mcp_server/node_modules`. | Run `npm --prefix .opencode/skills/system-skill-advisor/mcp_server install` and `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build`, then restart `mk_skill_advisor`. |
| `/doctor:mcp debug --server mk_skill_advisor` fails `shared_dependency` or `shared_import` | Doctor detected the same missing local package link before runtime startup. | Run `/doctor:mcp debug --server mk_skill_advisor --fix` or run the commands above manually. |

---

<!-- /ANCHOR:10-troubleshooting -->

<!-- ANCHOR:11-reference-commands -->
## 11. REFERENCE COMMANDS

```bash
# Build native package
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run build

# Typecheck native package
npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck

# Python shim default
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py "create a pull request on github"

# Python shim stdin
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --stdin

# Native required
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-native "save this context"

# Python fallback required
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor.py --force-local "save this context"

# Regression compatibility
python3 .opencode/skills/system-skill-advisor/mcp_server/scripts/skill_advisor_regression.py \
  --dataset .opencode/skills/system-skill-advisor/mcp_server/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

---

<!-- /ANCHOR:11-reference-commands -->

<!-- ANCHOR:12-related-resources -->
## 12. RELATED RESOURCES

| Document | Purpose |
| --- | --- |
| [README.md](./README.md) | Operator overview, quick start, runtime integrations. |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | Package-local architecture and public API entrypoints. |
| [Hook reference](./references/hooks/skill-advisor-hook.md) | Claude, Copilot, Gemini, Codex, Devin and OpenCode plugin hook contract. |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | OP-001 / OP-002 operator scenarios + indexer edge cases. |

<!-- /ANCHOR:12-related-resources -->
