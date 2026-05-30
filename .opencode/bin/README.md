---
title: "bin: MCP Launchers and Embedding Server"
description: "Top-level Node launchers that bootstrap each OpenCode MCP child process and the local HuggingFace embedding server."
trigger_phrases:
  - "mcp launcher"
  - "hf model server"
  - "mk-spec-memory launcher"
---

# bin: MCP Launchers and Embedding Server

## 1. OVERVIEW

`bin/` holds the executable entrypoints that the OpenCode runtime spawns to start each MCP server. Three launchers wrap the spec-kit, skill-advisor and code-graph MCP servers; one process is the local HuggingFace embedding server that serves `hf-local` vector requests over a Unix domain socket or TCP loopback.

Current state:

- Each launcher loads project-local `.env.local` / `.env`, ensures the server's `dist/` artifacts are built and current, serializes concurrent starts with a filesystem bootstrap lock, then spawns the MCP child and bridges stdio to the running daemon.
- `hf-model-server.cjs` loads a transformers model and answers `/api/health` and `/api/embed` requests. It refuses any non-loopback bind unless the operator sets `HF_EMBED_ALLOW_REMOTE_BIND=1` and supplies `HF_EMBED_AUTH_TOKEN`, and it asserts ownership of the socket directory before listening.
- Shared launcher behavior (model-server supervision, stdio-to-socket bridging, sidecar env allowlist) lives in `lib/`.

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
+-- hf-model-server.cjs            # Local HTTP/UDS HuggingFace embedding server
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
| `hf-model-server.cjs` | Loads a transformers embedding model and serves `/api/health` and `/api/embed`. Enforces the loopback bind perimeter guard, socket-dir ownership, request size limits and inference timeouts. |

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
| `node .opencode/bin/hf-model-server.cjs` | CLI | Start the local embedding server (via `main`). |
| `createHfModelServer` | Function | Build an embedding server instance with `listen`, `close`, `dispose` and `inject` for tests. |
| `assertLoopbackBindAllowed` | Function | Refuse non-loopback binds unless remote bind plus auth token are set. |
| `bash .opencode/bin/worktree-session.sh <runtime> [args]` | CLI | Launch an AI session in its own git worktree + branch + isolated MCP databases. Top-level sessions isolate; orchestrated children (`AI_SESSION_CHILD=1` or already inside a linked worktree) exec in place. `--dry-run` prints the plan. |
| `bash .opencode/bin/worktree-reaper.sh [--dry-run] [--reap-daemons]` | CLI | Prune merged + clean per-session worktrees and stale socket dirs; report orphan daemons (kill only with `--reap-daemons`). |
| `bash .opencode/bin/worktree-guard.sh` | CLI / SessionStart hook | Detect-and-warn: prints a one-line stderr warning when a top-level session is on shared `main`/`master` instead of an isolated worktree. Non-fatal (always exits 0); silent for children, inside worktrees, non-git dirs, or with `SPECKIT_WORKTREE_GUARD=off`. |

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
bash -n .opencode/bin/worktree-session.sh
bash -n .opencode/bin/worktree-reaper.sh
AI_SESSION_CHILD=1 bash .opencode/bin/worktree-session.sh --dry-run claude   # must report exec-in-place, no worktree
```

Expected result: each `.cjs` module loads without throwing; both shell scripts pass `bash -n`; the child dry-run reports it would exec in place without creating a worktree.

---

## 8. RELATED

- [`lib/`](lib/README.md)
- [`system-spec-kit MCP server`](../skills/system-spec-kit/mcp_server/)
- [`system-skill-advisor MCP server`](../skills/system-skill-advisor/mcp_server/)
- [`system-code-graph skill`](../skills/system-code-graph/)
