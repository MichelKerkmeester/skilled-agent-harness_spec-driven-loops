---
title: "bin: MCP Launchers, Daemon CLIs and Embedding Server"
description: "Top-level Node launchers that bootstrap each OpenCode MCP child process, the daemon-backed CLI shims for the same three servers, and the local HuggingFace embedding server."
trigger_phrases:
  - "mcp launcher"
  - "hf model server"
  - "mk-spec-memory launcher"
  - "spec-memory cli"
  - "code-index cli"
  - "skill-advisor cli"
---

# bin: MCP Launchers, Daemon CLIs and Embedding Server

## 1. OVERVIEW

`bin/` holds the executable entrypoints that the OpenCode runtime spawns to start each MCP server, plus the daemon-backed CLI shims that reach the same servers from a shell. Three launchers wrap the spec-kit, skill-advisor and code-graph MCP servers; three CLI shims (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) front the same daemons over the IPC socket; one process is the local HuggingFace embedding server that serves `hf-local` vector requests over a Unix domain socket or TCP loopback.

Current state:

- Each launcher loads project-local `.env.local` / `.env`, ensures the server's `dist/` artifacts are built and current, serializes concurrent starts with a filesystem bootstrap lock, then spawns the MCP child and bridges stdio to the running daemon.
- The three CLI shims run the built daemon-backed CLIs (`spec-memory` 39 tools, `code-index` 8 tools, `skill-advisor` 9 tools) against the **same unchanged daemons** the MCP registrations use — a dual-stack surface, not a replacement. Each shim enforces a dist-freshness guard (exit `69` on missing/stale dist, with a per-CLI `*_DEV_ALLOW_STALE=1` override), defaults `SPECKIT_IPC_SOCKET_DIR` to the short `/tmp/<service>` directory, and refuses a socket path over the Darwin `sun_path` limit.
- `hf-model-server.cjs` loads a transformers model and answers `/api/health` and `/api/embed` requests. It refuses any non-loopback bind unless the operator sets `HF_EMBED_ALLOW_REMOTE_BIND=1` and supplies `HF_EMBED_AUTH_TOKEN`, and it asserts ownership of the socket directory before listening.
- Shared launcher behavior (model-server supervision, stdio-to-socket bridging, sidecar env allowlist) lives in `lib/`. The CLI shims' dist entrypoints reuse `lib/launcher-ipc-bridge.cjs` for socket-path resolution and warm-daemon probes.
- Launcher reliability knobs — persistent log, lease-probe reap hardening, the mk-code-index reconnecting proxy, the Stop-hook orphan-sweep fallback, and default-on daemon re-election for mk-spec-memory — are operator-tunable via `SPECKIT_LAUNCHER_LOG`, `SPECKIT_LEASE_PROBE_RETRIES`, `SPECKIT_STOP_HOOK_ORPHAN_SWEEP`, and `SPECKIT_DAEMON_REELECTION`; see the MCP server's [`ENV_REFERENCE.md`](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md).

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                              bin/                                 │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐     ┌──────────────────────┐     ┌────────────────┐
│ OpenCode     │ ──▶ │ mk-*-launcher.cjs    │ ──▶ │ MCP server     │
│ runtime      │     │ env + build + lock   │     │ dist child     │
└──────────────┘     └──────────┬───────────┘     └────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ lib/                 │
                     │ supervision + bridge │
                     └──────────┬───────────┘
                                │ (spec-memory + advisor only)
                                ▼
                     ┌──────────────────────┐     ┌────────────────┐
                     │ hf-model-server.cjs  │ ──▶ │ transformers   │
                     │ /api/embed + health  │     │ embedding model│
                     └──────────────────────┘     └────────────────┘

Dependency direction: launchers ───▶ lib/ ───▶ hf-model-server.cjs
```

---

## 3. DIRECTORY TREE

```text
bin/
+-- mk-spec-memory-launcher.cjs    # Launches mk-spec-memory MCP, owns shared hf-model-server lease
+-- mk-skill-advisor-launcher.cjs  # Launches mk-skill-advisor MCP, optional model-server supervision
+-- mk-code-index-launcher.cjs     # Launches mk-code-index MCP, maintainer-mode INDEX_* override
+-- spec-memory.cjs                # Daemon-backed CLI shim for mk-spec-memory (39 tools)
+-- code-index.cjs                 # Daemon-backed CLI shim for mk-code-index (8 tools)
+-- skill-advisor.cjs              # Daemon-backed CLI shim for mk-skill-advisor (9 tools)
+-- cli-offline-smoke.cjs          # Daemon-free smoke: list-tools counts (39/8/9), cwd-independent
+-- cli-exit-taxonomy-smoke.cjs    # Daemon-free smoke: CLI failure contract (exit 64/69/75, parseable envelopes)
+-- cli-offline-smoke.test.cjs     # Test runner asserting cli-offline-smoke.cjs passes
+-- hf-model-server.cjs            # Local HTTP/UDS HuggingFace embedding server
+-- worktree-session.sh            # Launch an AI session in an isolated git worktree + branch + DBs
+-- worktree-reaper.sh             # Prune merged/clean per-session worktrees + stale socket dirs
+-- worktree-guard.sh              # SessionStart detect-and-warn when a top-level session is on shared main
+-- lib/                           # Shared supervision, IPC bridge, env allowlist
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `mk-spec-memory-launcher.cjs` | Boots the mk-spec-memory MCP child. Manages the shared hf-model-server lease, respawn locks, and reaping a dead lease child before respawn. |
| `mk-skill-advisor-launcher.cjs` | Boots the mk-skill-advisor MCP child. Loads model-server supervision when enabled, enforces a strict single-writer lease, and rebuilds `dist/` from `handlers`, `lib`, `schemas`, `tools` when stale. |
| `mk-code-index-launcher.cjs` | Boots the mk-code-index MCP child. Applies the maintainer-mode `INDEX_*` override, migrates the code-graph database back to the skill-local path, and sets `SPECKIT_CODE_GRAPH_DB_DIR` for the child. |
| `spec-memory.cjs` | CLI shim for mk-spec-memory. Checks dist freshness (exit `69`; `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1` to override), ensures the socket dir, then runs `mcp_server/dist/spec-memory-cli.js` with inherited stdio. |
| `code-index.cjs` | CLI shim for mk-code-index. Same guard pattern (`SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1` override), runs `mcp_server/dist/code-index-cli.js`. Blocked-read payloads render as actionable answers (exit `0`); `detect_changes` `parse_error` exits `64`. |
| `skill-advisor.cjs` | CLI shim for mk-skill-advisor. Same guard pattern (`MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` override), runs `mcp_server/dist/mcp_server/skill-advisor-cli.js`. Mutation tools require `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`; calls are sent untrusted by default. |
| `hf-model-server.cjs` | Loads a transformers embedding model and serves `/api/health` and `/api/embed`. Enforces the loopback bind perimeter guard, socket-dir ownership, request size limits and inference timeouts. |

Lifecycle parity note: `mk-spec-memory-launcher.cjs` is the hardened reference for persistent launcher logging, detached daemon re-election/adoption, and owner-release-on-shutdown. `mk-code-index-launcher.cjs` and `mk-skill-advisor-launcher.cjs` currently stop with their child and rely on fresh-session reload plus bridge/respawn paths instead.

---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Launchers require `./lib/model-server-supervision.cjs` and `./lib/launcher-ipc-bridge.cjs`. The model server requires only Node core plus `@huggingface/transformers` loaded at runtime. |
| Exports | Launchers run as CLI processes. `hf-model-server.cjs` exports `createHfModelServer`, `loadHfModel`, `resolveListenTarget`, `assertLoopbackBindAllowed`, `assertSocketDirOwnership` and `probeSocketResident` for tests and direct callers. |
| Ownership | This folder owns process bootstrap, lease arbitration and the embedding HTTP surface. MCP request handling, schemas and tools live in each server's own skill directory under `.opencode/skills/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ OpenCode runtime spawns mk-*-launcher    │
╰──────────────────────────────────────────╯
                  │
                  ▼
┌──────────────────────────────────────────┐
│ load .env.local / .env, refresh paths    │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ build dist if artifacts stale            │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ acquire bootstrap + respawn lease        │
└──────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────┐
│ spawn MCP child, bridge stdio to socket  │
└──────────────────────────────────────────┘
                  │
                  ▼
╭──────────────────────────────────────────╮
│ runtime talks to the live daemon         │
╰──────────────────────────────────────────╯
```

---

## 6. ENTRYPOINTS

| Entrypoint | Type | Purpose |
|---|---|---|
| `node .opencode/bin/mk-spec-memory-launcher.cjs` | CLI | Start the mk-spec-memory MCP server. |
| `node .opencode/bin/mk-skill-advisor-launcher.cjs` | CLI | Start the mk-skill-advisor MCP server. |
| `node .opencode/bin/mk-code-index-launcher.cjs` | CLI | Start the mk-code-index MCP server. |
| `node .opencode/bin/spec-memory.cjs <tool> [flags]` | CLI | Call any of the 37 mk-spec-memory tools from a shell (`list-tools` enumerates them offline). |
| `node .opencode/bin/code-index.cjs <tool> [flags]` | CLI | Call any of the 8 mk-code-index tools from a shell. |
| `node .opencode/bin/skill-advisor.cjs <tool> [flags]` | CLI | Call any of the 9 mk-skill-advisor tools from a shell; pass `--trusted` for maintainer mutations. |
| `node .opencode/bin/hf-model-server.cjs` | CLI | Start the local embedding server (via `main`). |
| `createHfModelServer` | Function | Build an embedding server instance with `listen`, `close`, `dispose` and `inject` for tests. |
| `assertLoopbackBindAllowed` | Function | Refuse non-loopback binds unless remote bind plus auth token are set. |
| `bash .opencode/bin/worktree-session.sh <runtime> [args]` | CLI | Launch an AI session in its own git worktree + branch + isolated MCP databases. Top-level sessions isolate; orchestrated children (`AI_SESSION_CHILD=1` or already inside a linked worktree) exec in place. `--dry-run` prints the plan. |
| `bash .opencode/bin/worktree-reaper.sh [--dry-run] [--reap-daemons]` | CLI | Prune merged + clean per-session worktrees and stale socket dirs; report orphan daemons (kill only with `--reap-daemons`). |
| `bash .opencode/bin/worktree-guard.sh` | CLI / SessionStart hook | Detect-and-warn: prints a one-line stderr warning when a top-level session is on shared `main`/`master` instead of an isolated worktree. Non-fatal (always exits 0); silent for children, inside worktrees, non-git dirs, or with `SPECKIT_WORKTREE_GUARD=off`. |

### Daemon-backed CLI shims

The three CLI shims are the dual-stack front door shipped by the MCP-to-CLI transition: the MCP registrations stay unchanged, and the CLI is an additive surface over the same daemons for hooks, cron, CI and transport-down recovery. Usage is uniform across all three: `<shim> <tool_name> [--json '{...}' | --param value] [--format json|text|jsonl] [--timeout-ms N]`, with `list-tools` answering offline (no daemon contact). Flag values are coerced against each tool's input schema, so `--limit 3` arrives as a number, not a string.

**Exit taxonomy (shared).** `0` success, `1` runtime error, `64` usage/schema error, `69` protocol mismatch or missing/stale dist, `75` retryable daemon error. A `spawnSync` failure in the shim itself also exits `75`.

**Warm-only and prompt time.** `--warm-only` (or the per-CLI `*_CLI_WARM_ONLY` / `*_CLI_PROMPT_TIME` envs, plus the shared `SPECKIT_CLI_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, `CODEX_PROMPT_TIME`, `CLAUDE_CODE_PROMPT_TIME`) makes the CLI probe the daemon and exit `75` instead of cold-spawning it — the contract prompt-time hooks rely on. Without warm-only, a cold daemon is auto-spawned through the matching `mk-*-launcher.cjs`, so non-prompt contexts (scripts, CI) work from a cold start.

**Dist freshness.** Each shim compares its CLI source mtimes against the built dist entrypoint and exits `69` with a rebuild instruction when stale. Dev overrides: `SPECKIT_SPEC_MEMORY_CLI_DEV_ALLOW_STALE=1`, `SPECKIT_CODE_INDEX_CLI_DEV_ALLOW_STALE=1`, `MK_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`.

**Trust (skill-advisor only).** `advisor_rebuild`, `skill_graph_scan` and apply-mode `skill_graph_propagate_enhances` require `--trusted` or `MK_SKILL_ADVISOR_CLI_TRUSTED=1`; everything else is sent untrusted by default. The daemon-side gate fails closed when transport `_meta` is absent — see the skill-advisor server docs.

Full env-var detail lives in the MCP server's [`ENV_REFERENCE.md`](../skills/system-spec-kit/mcp_server/ENV_REFERENCE.md).

### Worktree session isolation

`worktree-session.sh` ends the cross-session contention where every runtime shared one working tree on `main` plus one set of MCP databases. A top-level session gets `.worktrees/<runtime>-<slug>` on `work/<runtime>/<slug>`, with `SPEC_KIT_DB_DIR` + `SPECKIT_CODE_GRAPH_DB_DIR` pointed at per-worktree databases and `SPECKIT_IPC_SOCKET_DIR` pointed at a short `~/.spk-wt-sock/<slug>` dir (the daemon's unix socket path would otherwise exceed the platform `sun_path` limit from inside a deep worktree). Shared `node_modules`/`dist` are symlinked from the main checkout, so there is no per-worktree reinstall or rebuild.

**Child suppression.** Orchestrated children must NOT create their own worktree. Two signals make the wrapper exec in place: the env var `AI_SESSION_CHILD=1` (which the wrapper exports for its own descendants, and which cli-* dispatch recipes should set when spawning a child runtime), and a structural backstop (`git --git-dir` differs from `--git-common-dir`, i.e. already inside a linked worktree). An unknown signal defaults to top-level (isolate) — the safe failure mode.

To make a runtime isolate by default, alias its launch through the wrapper, e.g. `alias claude='bash /abs/path/.opencode/bin/worktree-session.sh claude'`. See [`sk-git`](../skills/sk-git/SKILL.md) §3 for how this relates to the in-session worktree ask-first rule.

**Backstop warning.** For sessions that still start directly (no alias), add `worktree-guard.sh` as a SessionStart hook step so the operator is warned when a top-level session lands on shared `main`. It is detect-and-warn only — it never relocates or blocks the session.

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "require('./.opencode/bin/hf-model-server.cjs')"
node -e "require('./.opencode/bin/lib/model-server-supervision.cjs')"
node .opencode/bin/spec-memory.cjs list-tools --format text | head -3
node .opencode/bin/code-index.cjs list-tools --format text | head -3
node .opencode/bin/skill-advisor.cjs list-tools --format text | head -3
node .opencode/bin/cli-offline-smoke.cjs --format text          # daemon-free: list-tools counts 39/8/9, cwd-independent
node .opencode/bin/cli-exit-taxonomy-smoke.cjs --format text    # daemon-free: CLI failure contract (exit 64/69/75)
bash -n .opencode/bin/worktree-session.sh
bash -n .opencode/bin/worktree-reaper.sh
AI_SESSION_CHILD=1 bash .opencode/bin/worktree-session.sh --dry-run claude   # must report exec-in-place, no worktree
```

Expected result: each `.cjs` module loads without throwing; each CLI shim lists tool names offline and exits 0; both daemon-free smokes pass (offline tool counts + the failure-contract exit taxonomy); both shell scripts pass `bash -n`; the child dry-run reports it would exec in place without creating a worktree.

---

## 8. RELATED

- [`lib/`](lib/README.md)
- [`system-spec-kit MCP server`](../skills/system-spec-kit/mcp_server/)
- [`system-skill-advisor MCP server`](../skills/system-skill-advisor/mcp_server/)
- [`system-code-graph skill`](../skills/system-code-graph/)
