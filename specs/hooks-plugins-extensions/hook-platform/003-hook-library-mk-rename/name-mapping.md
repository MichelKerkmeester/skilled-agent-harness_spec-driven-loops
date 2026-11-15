---
title: "Hook Library mk- Rename: Frozen Name Mapping"
description: "The single source-of-truth token map for the mk- to skill-relevant hook-library rename. Every execution phase derives its edits from this table."
trigger_phrases:
  - "hook rename mapping"
  - "mk prefix mapping"
  - "plugin rename map"
  - "token map"
importance_tier: "high"
contextType: "reference"
---
# Hook Library `mk-` Rename — Frozen Name Mapping

<!-- SPECKIT_LEVEL: 3 -->

> This is the **authoritative token map** for packet `008-hook-library-mk-rename`.
> Every phase (file renames, reference sweep, daemon rename, docs) derives its
> edits from the tables below. When execution needs a machine map, it is
> materialized from this file into `token-map.tsv` (old<TAB>new) at Phase 1.
> Nothing outside these tables is renamed. **Historical `specs/**` docs are out
> of scope** and are never rewritten.

---

## 1. OPENCODE PLUGIN FILES — `.opencode/plugins/`

| Old file | New file | New-name source |
|----------|----------|-----------------|
| `mk-skill-advisor.js` | `system-skill-advisor.js` | operator: mk→system (matches skill dir) |
| `mk-spec-gate.js` | `system-spec-gate.js` | operator: mk→system |
| `mk-spec-memory.js` | `system-spec-memory.js` | operator: mk→system |
| `mk-speckit-completion.js` | `system-speckit-completion.js` | operator: mk→system |
| `mk-deep-loop-guard.js` | `system-deep-loop-guard.js` | operator |
| `mk-completion-sentinel.js` | `system-completion-sentinel.js` | spec-kit completion family |
| `mk-dist-freshness-guard.js` | `system-dist-freshness-guard.js` | operator-confirmed |
| `mk-goal.js` | `opencode-goal.js` | operator |
| `mk-cli-dispatch-audit.js` | `cli-dispatch-audit.js` | operator: drop mk (ok as-is) |
| `mk-mcp-route-guard.js` | `mcp-route-guard.js` | operator: drop mk (ok as-is) |
| `mk-codex-hooks-watchdog.js` | `codex-hooks-watchdog.js` | drop mk (runtime hook) |
| `mk-communication-projection.js` | `sk-communication-projection.js` | owning skill `sk-communication` |
| `mk-git-preflight-advisory.js` | `sk-git-preflight-advisory.js` | owning skill `sk-git` |
| `mk-post-edit-quality.js` | `sk-code-post-edit-quality.js` | operator-confirmed (sk-code) |

## 2. PLUGIN TEST FILES — `.opencode/plugins/tests/`

Each test file follows its plugin's new stem.

| Old | New |
|-----|-----|
| `mk-communication-projection.test.cjs` | `sk-communication-projection.test.cjs` |
| `mk-completion-sentinel.test.cjs` | `system-completion-sentinel.test.cjs` |
| `mk-deep-loop-guard.test.cjs` | `system-deep-loop-guard.test.cjs` |
| `mk-dist-freshness-guard.test.cjs` | `system-dist-freshness-guard.test.cjs` |
| `mk-post-edit-quality.test.cjs` | `sk-code-post-edit-quality.test.cjs` |
| `mk-skill-advisor.test.cjs` | `system-skill-advisor.test.cjs` |
| `mk-spec-gate.test.cjs` | `system-spec-gate.test.cjs` |
| `mk-spec-memory.test.cjs` | `system-spec-memory.test.cjs` |
| `mk-speckit-completion.test.cjs` | `system-speckit-completion.test.cjs` |
| `mk-goal-capabilities.test.cjs` | `opencode-goal-capabilities.test.cjs` |
| `mk-goal-continuation.test.cjs` | `opencode-goal-continuation.test.cjs` |
| `mk-goal-export-contract.test.cjs` | `opencode-goal-export-contract.test.cjs` |
| `mk-goal-lifecycle.test.cjs` | `opencode-goal-lifecycle.test.cjs` |
| `mk-goal-state.test.cjs` | `opencode-goal-state.test.cjs` |
| `mk-goal-supervisor.test.cjs` | `opencode-goal-supervisor.test.cjs` |
| `mk-goal-tool-path.test.cjs` | `opencode-goal-tool-path.test.cjs` |

## 3. SHARED HOOK CORES + PER-RUNTIME SCRIPTS

The shared cores under `.opencode/hooks/<name>/` and the per-runtime scripts in
`.claude/hooks`, `.codex/hooks`, `.cursor/hooks`, `.devin/hooks` already use
**unprefixed** names (e.g. `mcp-route-guard.cjs`, `post-edit-quality.cjs`,
`git-preflight-advisory.mjs`). These KEEP their current directory/file stems
**except** where the stem itself must change to match a new plugin identity:

| Concern (core dir + runtime scripts) | Action |
|--------------------------------------|--------|
| `mcp-route-guard` | keep (plugin dropped mk → same stem) |
| `dispatch` (cli-dispatch-audit) | keep dir; internal labels only |
| `codex-watchdog` / `codex-hooks-watchdog` | keep |
| `spec-gate`, `spec-memory`, `skill-advisor`, `completion`, `goal`, `post-edit-quality`, `dist-freshness`, `git-preflight`, `task-dispatch` (deep-loop-guard) | keep dir stems; internal COMPONENT banners + env constants updated only |

> Rationale: the cores are runtime-neutral and already unprefixed; renaming their
> dirs would multiply churn across 5 runtimes for zero readability gain. The
> **plugin adapters** carry the new identity; the cores keep stable stems. Banner
> comments and `DISABLED_ENV` constants inside them are updated to the new names.

## 4. LIVE DAEMON LAYER (high-risk — Phase 5, gated)

### 4a. MCP server keys (configs)
| Old key | New key | Files |
|---------|---------|-------|
| `mk-spec-memory` | `system-spec-memory` | `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` |
| `mk_skill_advisor` | `system_skill_advisor` | `opencode.json`, `.claude/mcp.json`, `.codex/config.toml` |
| `mk-skill-advisor` (hyphen variant) | `system-skill-advisor` | wherever it appears |

### 4b. Launcher / bridge binaries
| Old | New |
|-----|-----|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | `.opencode/bin/system-spec-memory-launcher.cjs` |
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | `.opencode/bin/system-skill-advisor-launcher.cjs` |
| `…/plugin-bridges/mk-spec-memory-bridge.mjs` | `…/plugin-bridges/system-spec-memory-bridge.mjs` |
| `…/plugin-bridges/mk-skill-advisor-bridge.mjs` | `…/plugin-bridges/system-skill-advisor-bridge.mjs` |
| `mk-code-graph-bridge` (stem) | `system-code-graph-bridge` |

### 4c. Socket dirs (verify sun_path < 104 chars before cutover)
| Old | New | Longest path check |
|-----|-----|--------------------|
| `/tmp/mk-spec-memory` | `/tmp/system-spec-memory` | +4 chars |
| `/tmp/mk-skill-advisor` | `/tmp/system-skill-advisor` | +4 chars |
| `/tmp/mk-hf-embed` | `/tmp/system-hf-embed` | +4 chars |

### 4d. Tool namespaces (in ~96 active agent/command files, 4 runtimes)
| Old | New | Active files |
|-----|-----|--------------|
| `mcp__mk_spec_memory__` | `mcp__system_spec_memory__` | 78 |
| `mcp__mk_skill_advisor__` | `mcp__system_skill_advisor__` | 14 |
| `mcp__mk_code_index__` | `mcp__system_code_index__` | 4 |

### 4e. Internal component tokens (spec-memory package)
| Old | New |
|-----|-----|
| `mk-code-index` / `mk_code_index` | `system-code-index` / `system_code_index` |
| `mk-code-graph` / `mk_code_graph` | `system-code-graph` / `system_code_graph` |
| `mk-hf-embed` | `system-hf-embed` |
| `mk-reranker` | `system-reranker` |

## 5. ENV VARS (Phase 4 — new canonical + permanent `MK_` alias)

Convention: `MK_<CONCERN>_<REST>` → `<NEWPREFIX>_<CONCERN>_<REST>`. **Every old
`MK_*` name is retained permanently as an alias** — DISABLED flags via
`hook-flags.cjs` `LEGACY_ALIASES`; direct-read config vars via a
`readEnv(newName, ...oldNames)` shared helper. No operator config ever breaks.

| Plugin / concern | New env prefix |
|------------------|----------------|
| system-* plugins (spec-gate, spec-memory, skill-advisor, speckit-completion, deep-loop-guard, completion-sentinel, dist-freshness-guard) | `SYSTEM_*` |
| sk-code-post-edit-quality | `SK_CODE_POST_EDIT_QUALITY_*` |
| sk-communication-projection | `SK_COMMUNICATION_PROJECTION_*` |
| sk-git-preflight-advisory | `SK_GIT_PREFLIGHT_*` |
| cli-dispatch-audit | `CLI_DISPATCH_AUDIT_*` |
| mcp-route-guard | `MCP_ROUTE_GUARD_*` |
| codex-hooks-watchdog | `CODEX_HOOKS_WATCHDOG_*` |
| opencode-goal | `OPENCODE_GOAL_*` |
| cross-cutting / global / non-plugin hooks (`MK_HOOKS_DISABLED`, `MK_SCOPE_*`, `MK_SPEC_FOLDER`, session/git/live/permission/directive-lifecycle flags) | `SYSTEM_*` |

Master switch: `MK_HOOKS_DISABLED` → `SYSTEM_HOOKS_DISABLED` (MK_ alias kept).

> **ADR-004 open point:** operator may veto the env-var rename entirely (keep
> `MK_` — it is a deliberately unique, collision-safe namespace) without blocking
> any other phase. Resolve before Phase 4 executes.

## 6. LOG FILES
| Old | New |
|-----|-----|
| `.opencode/logs/post-edit-quality.log` | unchanged (stem already unprefixed) |
| any `mk-*.log` | `<new-stem>.log` |

## 7. OUT OF SCOPE (never touched)
- `specs/**` historical docs and past packet folder names (~45,534 occurrences).
- `.worktrees/*` sibling copies; `barter/ai-speckit/coder/` subproject.
- `node_modules/`, `dist/` build outputs.
- The `MK_` token where it is a person's initials or unrelated (none found in code).
