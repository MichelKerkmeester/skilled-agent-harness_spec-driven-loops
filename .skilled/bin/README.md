---
title: "bin: MCP Launchers, Daemon CLIs, Compiled Routing and Repo Tooling"
description: "Executable entrypoints for the OpenCode runtime: the MCP launchers and their daemon-backed CLI shims, the local embedding server, the compiled-routing serving and publication tools, and the git, worktree and hook helpers."
trigger_phrases:
  - "mcp launcher"
  - "hf model server"
  - "code-index cli"
  - "skill-advisor cli"
  - "compiled route cli"
  - "compiled routing runtime"
---

# bin: MCP Launchers, Daemon CLIs, Compiled Routing and Repo Tooling

> Executable entrypoints for the OpenCode runtime include MCP launchers, daemon-backed CLI shims, the local embedding server and repository tools.

`bin/` contains MCP launchers and repository tools, including `skilled-loop`, the runtime wrapper for session relaunch.

## 1. OVERVIEW


Current state:

- Each launcher loads project-local `.env.local` / `.env`, ensures the server's `dist/` artifacts are built and current, serializes concurrent starts with a filesystem bootstrap lock, then spawns the daemon child and bridges stdio to the running daemon.
- The CLI shim runs the built daemon-backed CLI (`skill-advisor`, 9 tools) against the resident daemon. It enforces a dist-freshness guard (exit `69` on missing/stale dist, with a per-CLI `*_DEV_ALLOW_STALE=1` override), defaults `SPECKIT_IPC_SOCKET_DIR` to the short `/tmp/<service>` directory, and refuses a socket path over the Darwin `sun_path` limit.
- The freshness check itself is a shared module, not per-shim logic: every shim calls `checkPackageFreshness()` from [`system-spec-kit/runtime/cli/lib/dist-freshness.cjs`](../skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs), which also backs `validate.sh`'s hard staleness backstop, the `sk-code` PostToolUse hook, and the `system-dist-freshness-guard` OpenCode plugin, one source of truth for "is this package's dist current" across all four call sites. See §6 "Dist freshness" for the full package table and consumer list.
- `hf-model-server.cjs` loads a transformers model and answers `/api/health` and `/api/embed` requests. It refuses any non-loopback bind unless the operator sets `HF_EMBED_ALLOW_REMOTE_BIND=1` and supplies `HF_EMBED_AUTH_TOKEN`, and it asserts ownership of the socket directory before listening.
- Shared launcher behavior (model-server supervision, stdio-to-socket bridging, sidecar env allowlist) lives in `lib/`. The CLI shims' dist entrypoints reuse `lib/launcher-ipc-bridge.cjs` for socket-path resolution and warm-daemon probes.
- A second family serves and publishes **compiled routing**. `compiled-route.cjs` is the runtime front door a hub calls to ask whether the compiled router is authoritative for it, falling back to legacy routing when it is not. `compiled-route-status.cjs` reports per-hub serving state with a cause code that separates expected drift from breakage. `compiled-route-guard.cjs` is the gate: it fails when a hub's activation manifest no longer matches what its routing inputs compile to, when the promoted runtime and its authored source disagree or when the authored manifest is missing. Each failure names the manifest to copy or restore. `compiled-route-sync.cjs` publishes a new closure by tracing, staging, verifying and swapping, then it finalizes or reverts. Its build and `--check` modes stop first when the authored source under `specs/` is missing. They print one line naming the folder to restore. `compiled-route-manifest.cjs` is a thin CLI over the activation-manifest library in `lib/`.
- `check-no-spec-imports.cjs` proves the durable invariant behind that family: nothing under `bin/` reaches into `specs/` (or its `.opencode/specs` compat alias) at runtime, so the serving path cannot break when the authored tree moves.
- The remaining files are repository tooling. `worktree-*.sh` launch, prune, guard and report on per-session git worktrees. `git-sync.sh` and `git-live-follow.sh` back the continuous-integration workflow, and `git-primary-reconcile.sh` converges the primary checkout onto its live branch at session start without touching a dirty tree. `check-git-hooks.sh` warns at session start when git hooks are missing or drifted, `relink-local-specs.sh` restores the machine-local spec symlinks after a clean, and `install-codex-hooks.mjs` removes copies of the repo's Codex hooks from the user-global config.

---

## 2. ARCHITECTURE

```text
╭──────────────────────────────────────────────────────────────────╮
│                              bin/                                 │
╰──────────────────────────────────────────────────────────────────╯

┌──────────────┐     ┌──────────────────────┐     ┌────────────────┐
│ OpenCode     │ ──▶ │ *-launcher.cjs       │ ──▶ │ MCP server     │
│ runtime      │     │ env + build + lock   │     │ dist child     │
└──────────────┘     └──────────┬───────────┘     └────────────────┘
                                │
                                ▼
                     ┌──────────────────────┐
                     │ lib/                 │
                     │ supervision + bridge │
                     └──────────┬───────────┘
                                │ (advisor only)
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
+-- system-skill-advisor-launcher.cjs  # Launches the system-skill-advisor daemon, optional model-server supervision
+-- skill-advisor.cjs              # Daemon-backed CLI shim for system-skill-advisor (9 tools)
+-- cli-offline-smoke.cjs          # Daemon-free smoke: list-tools counts, cwd-independent
+-- cli-exit-taxonomy-smoke.cjs    # Daemon-free smoke: CLI failure contract (exit 64/69/75, parseable envelopes)
+-- cli-offline-smoke.test.cjs     # Test runner asserting cli-offline-smoke.cjs passes
+-- hf-model-server.cjs            # Local HTTP/UDS HuggingFace embedding server
+-- worktree-session.sh            # Launch an AI session in an isolated git worktree + branch + DBs
+-- worktree-reaper.sh             # Prune merged/clean per-session worktrees + stale socket dirs
+-- worktree-guard.sh              # SessionStart detect-and-warn when a top-level session is on shared main
+-- worktree-status.sh             # Reports worktree, branch and sync state
+-- git-sync.sh                    # Autosync helper for the git continuous-integration workflow
+-- git-live-follow.sh             # Live-follow watcher for the same workflow
+-- check-git-hooks.sh             # SessionStart guard warning on missing or drifted git hooks
+-- check-agent-mirror-sync.cjs    # Checks each runtime's agent mirrors against .skilled/agents
+-- git-primary-reconcile.sh       # SessionStart reconcile: converge the primary checkout onto its live branch
+-- relink-local-specs.sh          # Restore machine-local spec symlinks after a destructive clean
+-- install-codex-hooks.mjs        # Removes repo-owned Codex hooks from the user-global config
+-- speckit-completion.cjs         # Completion-state CLI over the runtime-neutral core
+-- skilled-loop                    # Runs Claude, Pi, OpenCode, Codex, Cursor, Hermes or Devin under a session relaunch loop
+-- skilled-loop-shell.sh           # Sourced by zsh or bash so each interactive runtime launch starts under skilled-loop
+-- compiled-route.cjs             # Runtime front door: is the compiled router authoritative for a hub
+-- compiled-route-status.cjs      # Per-hub serving status with a cause code separating drift from breakage
+-- compiled-route-guard.cjs       # Freshness gate: serving matches inputs, runtime matches source
+-- compiled-route-manifest.cjs    # CLI over the activation-manifest library in lib/
+-- compiled-route-sync.cjs        # Publication tool: trace, stage, verify, swap, finalize or revert
+-- check-no-spec-imports.cjs      # Proves nothing here reaches into the spec tree at runtime
+-- compiled-routing-*.vitest.ts   # Routing foundation and flag-propagation suites
+-- tests/                         # node:test suite for the publication lifecycle
+-- lib/                           # Shared supervision, IPC bridge, env allowlist, routing library
`-- README.md
```

---

## 4. KEY FILES

| File | Responsibility |
|---|---|
| `system-skill-advisor-launcher.cjs` | Boots the system-skill-advisor daemon child. Loads model-server supervision when enabled, enforces a strict single-writer lease, and rebuilds `dist/` from `handlers`, `lib`, `schemas`, `tools` when stale. |
| `skill-advisor.cjs` | CLI shim for system-skill-advisor. Same guard pattern (`SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1` override), runs `runtime/dist/runtime/skill-advisor-cli.js`. Mutation tools require `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`. calls are sent untrusted by default. |
| `hf-model-server.cjs` | Loads a transformers embedding model and serves `/api/health` and `/api/embed`. Enforces the loopback bind perimeter guard, socket-dir ownership, request size limits and inference timeouts. |


---

## 5. BOUNDARIES AND FLOW

| Boundary | Rule |
|---|---|
| Imports | Launchers require `./lib/model-server-supervision.cjs` and `./lib/launcher-ipc-bridge.cjs`. The model server requires only Node core plus `@huggingface/transformers` loaded at runtime. |
| Exports | Launchers run as CLI processes. `hf-model-server.cjs` exports `createHfModelServer`, `loadHfModel`, `resolveListenTarget`, `assertLoopbackBindAllowed`, `assertSocketDirOwnership` and `probeSocketResident` for tests and direct callers. |
| Ownership | This folder owns process bootstrap, lease arbitration and the embedding HTTP surface. MCP request handling, schemas and tools live in each server's own skill directory under `.skilled/skills/`. |

Main flow:

```text
╭──────────────────────────────────────────╮
│ OpenCode runtime spawns *-launcher       │
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
│ spawn daemon child, bridge stdio to sock │
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
| `bash .skilled/bin/skilled-loop [claude|pi|opencode|codex|cursor|hermes|devin] [args...]` | CLI wrapper | Run one of seven runtimes under one loop id (`cursor` launches `cursor-agent`). The wrapper relaunches eligible sessions with a handoff seed. Claude, Pi, OpenCode, Codex and Hermes arm automatically through their adapters. Cursor and Devin never arm. They enter through `/speckit:handoff`. When the session exits with the record still pending, the wrapper prints the manual claim command. Each relaunch it approves is recorded in the hop history that `session-relaunch.cjs history` prints. |
| `source /path/to/repo/.skilled/bin/skilled-loop-shell.sh` | Shell shim | Defines `claude`, `pi`, `opencode`, `codex`, `hermes`, `devin` and `cursor-agent` as functions that start an interactive session through the nearest `.skilled/bin/skilled-loop` at or above the current directory, a symlinked `.skilled` included. Subcommands, print and one-shot modes, version and help, non-terminal launches and sessions already under a loop run the binary directly. `skilled_loop_resolve <runtime> [args...]` prints the wrapper the shim would use, or nothing. |
| `node .skilled/bin/system-skill-advisor-launcher.cjs` | CLI | Start the system-skill-advisor daemon. |
| `node .skilled/bin/skill-advisor.cjs <tool> [flags]` | CLI | Call any of the 9 system-skill-advisor tools from a shell. pass `--trusted` for maintainer mutations. |
| `node .skilled/bin/hf-model-server.cjs` | CLI | Start the local embedding server (via `main`). |
| `createHfModelServer` | Function | Build an embedding server instance with `listen`, `close`, `dispose` and `inject` for tests. |
| `assertLoopbackBindAllowed` | Function | Refuse non-loopback binds unless remote bind plus auth token are set. |
| `bash .skilled/bin/worktree-session.sh <runtime> [args]` | CLI | Launch an AI session in its own git worktree + branch + isolated MCP databases. Top-level sessions isolate. orchestrated children (`AI_SESSION_CHILD=1` or already inside a linked worktree) exec in place. `--dry-run` prints the plan. |
| `bash .skilled/bin/worktree-reaper.sh [--dry-run]` | CLI | Prune merged + clean per-session worktrees, stale socket dirs and session markers. never signals a process. Auto-reap is restricted to proven-inactive exact `work/<runtime>/<slug>` pairs (the whole marker file must match a PID grammar, a malformed marker is treated as ambiguous and the worktree is kept. the branch's runtime/slug must equal the directory basename). |
| `bash .skilled/bin/worktree-guard.sh` | CLI / SessionStart hook | Detect-and-warn: prints a one-line stderr warning when a top-level session is on shared `main`/`master` instead of an isolated worktree. Non-fatal (always exits 0). silent for children, inside worktrees, non-git dirs, or with `SPECKIT_WORKTREE_GUARD=off`. |
| `node .skilled/bin/compiled-route.cjs --hub <id> --prompt "<task>"` | CLI | Ask whether the compiled router is authoritative for a hub. Returns a legacy sentinel when it is not. `--prompt-stdin` reads the prompt from stdin instead, which keeps a user's prompt out of the process table. `--surface-hint <SURFACE>` passes the surface the caller's session works in, which leads a keyword tie between surfaces the prompt matched. |
| `node .skilled/bin/compiled-route-status.cjs --all` | CLI | Report per-hub serving authority and a cause code separating expected drift from breakage. |
| `node .skilled/bin/compiled-route-guard.cjs [--warn-only] [--json]` | CLI | Fail when a hub's serving manifest no longer matches its inputs, when the runtime and its authored source disagree, or when the authored manifest is missing. Each failure names the manifest to copy or restore. |
| `node .skilled/bin/compiled-route-sync.cjs [--check] [--verify] [--finalize <path>] [--revert <path>]` | CLI | Trace the authored closure, publish it atomically, and finalize or revert the retained rollback. The build and `--check` stop with one line naming the folder to restore when the authored source is missing. |
| `node .skilled/bin/compiled-route-manifest.cjs <command>` | CLI | Mint, refresh or inspect a hub activation manifest through the library in `lib/`. |
| `node .skilled/bin/check-no-spec-imports.cjs` | CLI | Prove no file here reaches into the spec tree at runtime. |
| `node .skilled/bin/check-agent-mirror-sync.cjs [--all]` | CLI | Blocks agent edits that desync the runtime mirrors. Run by both pre-commit hooks and the agent-mirror-sync CI workflow. |
| `node .skilled/bin/install-codex-hooks.mjs` | CLI | Remove copies of the repo's Codex hooks and orphaned repo entries from user-global `~/.codex/hooks.json`. Codex already runs the project's own `.codex/hooks.json`, so a copy would run each hook twice. Backs up to `.bak-<ts>` first, preserves Superset and other third-party entries, and never rewrites a clean file. `--check` exits 1 while a copy or orphan remains. |

`skilled-loop` carries model, name, Pi extension and Pi or Hermes provider values only when each value differs from `--` and does not begin with `-`. For handoff paths, it prints each `!` in single quotes outside the seed's double quotes so interactive Bash keeps the path when history expansion is on. If it cannot decode the record returned by `should-relaunch`, it prints `warning: could not read the relaunch record` and consumes the record. When `should-relaunch` approves the hop, the wrapper consumes the record and relaunches the runtime with the seed. It prints `warning: could not read the relaunch record`, consumes the record and exits 1, with no manual claim command, when the record cannot be read or the handoff path is empty. It consumes the record, prints the manual claim command and exits 1 when the cwd is empty or contains a line break, when the handoff path contains a line break, or when `cd` to the cwd fails. A runtime exit of 130 consumes the record, prints the manual claim command and exits 130. When `should-relaunch` declines (status 1), the wrapper consumes the record and exits with the runtime's own exit code. When `should-relaunch` itself fails (status 2 or more), the wrapper warns `should-relaunch failed with status N; preserving runtime exit M`, consumes the record and exits with the runtime's exit code. It prints the manual claim command only for the `not-armed`, `stale` and `hop-cap` reasons, and only when the handoff path has no line break. A line-broken handoff path prints a warning instead, and a `no-file` decline prints nothing. Startup failures, such as a missing CLI or a non-integer `SKILLED_LOOP_HOPS`, also exit 1 before the first launch.

`SKILLED_LOOP_MANUAL_TEMPLATE` builds the wrapper's manual claim command and the killer's timeout notification from the first launch's model, provider, name and Pi extension flags. If the wrapper exits with a record still pending, it prints that command and consumes the record. The carried model keeps a command-only hop on the selected model.

### Daemon-backed CLI shims

The CLI shim is the advisor's single front door: it registers no MCP server, and reaches the resident daemon over the advisor's own socket protocol. Other MCP servers keep their own registrations, unaffected. It shares the same daemons for hooks, cron, CI and transport-down recovery. Usage is uniform across all three: `<shim> <tool_name> [--json '{...}' | --param value] [--format json|text|jsonl] [--timeout-ms N]`, with `list-tools` answering offline (no daemon contact). Flag values are coerced against each tool's input schema, so `--limit 3` arrives as a number, not a string.

**Exit taxonomy (shared).** `0` success, `1` runtime error, `64` usage/schema error, `69` protocol mismatch or missing/stale dist, `75` retryable daemon error. A `spawnSync` failure in the shim itself also exits `75`.

**Warm-only and prompt time.** `--warm-only` (or the per-CLI `*_CLI_WARM_ONLY` / `*_CLI_PROMPT_TIME` envs, plus the shared `SPECKIT_CLI_PROMPT_TIME`, `OPENCODE_PROMPT_TIME`, `CLAUDE_CODE_PROMPT_TIME`) makes the CLI probe the daemon and exit `75` instead of cold-spawning it, the contract prompt-time hooks rely on. Without warm-only, a cold daemon is auto-spawned through the matching `*-launcher.cjs`, so non-prompt contexts (scripts, CI) work from a cold start.

**Dist freshness.** Each shim calls the shared `checkPackageFreshness()` (`system-spec-kit/runtime/cli/lib/dist-freshness.cjs`) to compare its package's watched source files against the built dist entrypoint, exiting `69` with a rebuild instruction when stale. Dev overrides: `SYSTEM_SKILL_ADVISOR_CLI_DEV_ALLOW_STALE=1`.

The same shared module tracks 6 dist-producing packages total (`system-spec-kit/{shared,runtime,runtime/cli}`, `system-skill-advisor/runtime`, `mcp-code-mode/mcp-server`, and `sk-design-md-generator/backend`) and backs three other consumers: `validate.sh`'s `run_node_orchestrator()` fails closed (exit `3`, no auto-rebuild) when the compiled spec-validation orchestrator it depends on is stale. the `sk-code` `claude-posttooluse.sh` PostToolUse hook prints a non-blocking `STALE DIST WARNING` banner when an edit lands in a watched source tree. and the `system-dist-freshness-guard` OpenCode plugin (`.skilled/plugins/`) surfaces stale packages to the agent via bounded system-context injection (`experimental.chat.system.transform`) plus an append-only `.skilled/logs/dist-freshness-guard.log`, never stdout/stderr, which the TUI would paint over the chat input, refreshed before a Bash call matching `opencode run`/`validate.sh` and once per session on `session.created`. Root cause and full design: `system-speckit/028-memory-search-intelligence/002-spec-data-quality/050-validate-sh-dist-freshness-and-repo-remediation/001-dist-freshness-enforcement` spec folder.

**Trust (skill-advisor only).** `advisor_rebuild`, `skill_graph_scan` and apply-mode `skill_graph_propagate_enhances` require `--trusted` or `SYSTEM_SKILL_ADVISOR_CLI_TRUSTED=1`. everything else is sent untrusted by default. The daemon-side gate fails closed when transport `_meta` is absent, see the skill-advisor server docs.

Full env-var detail lives in the spec-kit runtime's [`ENV-REFERENCE.md`](../skills/system-spec-kit/runtime/ENV-REFERENCE.md).

### Worktree session isolation

`worktree-session.sh` ends the cross-session contention where every runtime shared one working tree on `main` plus one set of MCP databases. A top-level session gets `.worktrees/<runtime>-<slug>` on `work/<runtime>/<slug>`, with `SPEC_KIT_DB_DIR` pointed at per-worktree databases and `SPECKIT_IPC_SOCKET_DIR` pointed at a short `~/.spk-wt-sock/<slug>` dir (the daemon's unix socket path would otherwise exceed the platform `sun_path` limit from inside a deep worktree). Shared `node_modules`/`dist` are symlinked from the main checkout, so there is no per-worktree reinstall or rebuild. Adversarial inputs are rejected before they can act: a runtime identity that cannot form a legal Git ref is refused before `worktree add`, and any `SPECKIT_WORKTREE_SHARED_PATHS` entry with `..`/absolute components is rejected, source and destination are canonicalized and containment-checked so a shared-path copy can never delete or symlink outside the worktree.

**Child suppression.** Orchestrated children must NOT create their own worktree. Two signals tell the wrapper to exec in place: the env var `AI_SESSION_CHILD=1` (which the wrapper exports for its own descendants, and which cli-* dispatch recipes should set when spawning a child runtime), and a structural backstop (`git --git-dir` differs from `--git-common-dir`, i.e. already inside a linked worktree). An unknown signal defaults to top-level (isolate), the safe failure mode.

**Spec-gate enforce neutralization.** Every `exec_in_place` path (both child signals above) also exports `SYSTEM_SPEC_GATE_ENFORCE=0` before handing off to the runtime, so a child cannot inherit an enforced spec-mutation gate from its parent shell. This is belt-and-suspenders: the spec-gate core independently treats `AI_SESSION_CHILD=1` as a complete no-op in both classify and enforce, so a leaked enforce env is harmless even without this wrapper. See the [spec-gate core reference](../skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md) for the shared contract.

To isolate a runtime by default, alias its launch through the wrapper, e.g. `alias claude='bash /abs/path/.skilled/bin/worktree-session.sh claude'`. See [`sk-git`](../skills/sk-git/SKILL.md) §3 for how this relates to the in-session worktree ask-first rule.

**Backstop warning.** For sessions that still start directly (no alias), add `worktree-guard.sh` as a SessionStart hook step so the operator is warned when a top-level session lands on shared `main`. It is detect-and-warn only, it never relocates or blocks the session.

---

## 7. VALIDATION

Run from the repository root.

```bash
node -e "require('./.skilled/bin/hf-model-server.cjs')"
node -e "require('./.skilled/bin/lib/model-server-supervision.cjs')"
node .skilled/bin/skill-advisor.cjs list-tools --format text | head -3
node .skilled/bin/cli-offline-smoke.cjs --format text          # daemon-free: list-tools counts, cwd-independent
node .skilled/bin/cli-exit-taxonomy-smoke.cjs --format text    # daemon-free: CLI failure contract (exit 64/69/75)
bash -n .skilled/bin/worktree-session.sh

# Compiled routing
node .skilled/bin/compiled-route-guard.cjs                     # every hub fresh, runtime matches source
node .skilled/bin/compiled-route-status.cjs --all              # per-hub serving authority and cause code
node .skilled/bin/compiled-route-sync.cjs --check              # authored closure resolves every hub and matches its served copies
node .skilled/bin/compiled-route-sync.cjs --verify             # promoted closure resolves with no spec reads
node .skilled/bin/check-no-spec-imports.cjs                    # nothing here imports from the spec tree
node .skilled/bin/tests/compiled-route-manifest.test.cjs       # publication lifecycle suite

# Vitest suites for this folder, run from .skilled
npx vitest run --config vitest.config.bin.ts
bash -n .skilled/bin/worktree-reaper.sh
AI_SESSION_CHILD=1 bash .skilled/bin/worktree-session.sh --dry-run claude   # must report exec-in-place, no worktree
```

Expected result: each `.cjs` module loads without throwing. each CLI shim lists tool names offline and exits 0. both daemon-free smokes pass (offline tool counts + the failure-contract exit taxonomy). both shell scripts pass `bash -n`. the child dry-run reports it would exec in place without creating a worktree.

---

## 8. RELATED

- [`lib/`](lib/README.md)
- [`system-spec-kit runtime engine`](../skills/system-spec-kit/runtime/)
- [`system-skill-advisor runtime package`](../skills/system-skill-advisor/runtime/)
