---
title: "Implementation Summary: Worktree-per-AI-session automation (core built)"
description: "The Step-0 DB-relocation gate is proven and the core is built: a launch wrapper that isolates each top-level AI session in its own git worktree + branch + MCP databases, a conservative reaper, and a .gitignore entry. Per-runtime launch wiring + guard hooks remain."
trigger_phrases:
  - "worktree automation status core built"
  - "worktree session wrapper reaper built"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-operator-tooling/005-worktree-per-session-automation"
    last_updated_at: "2026-05-30T19:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Built wrapper + reaper + guard; SC-001 + Step-0 green; sk-git/bin docs done"
    next_safe_action: "Operator wires launch aliases + SessionStart guard-hook entries"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-session.sh"
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/bin/worktree-guard.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003504"
      session_id: "035-worktree-impl"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions:
      - "Step-0 surfaced a real blocker: the daemon's unix IPC socket defaults to <db-dir>/daemon-ipc.sock; the deep worktree DB path (174 chars) exceeds the macOS sun_path limit (~104) and the daemon dies with EINVAL on listen()."
      - "Fix (verified end-to-end with a real worktree): also export SPECKIT_IPC_SOCKET_DIR pointing the socket at a short ~/.spk-wt-sock/<runtime>-<slug> dir (70-78 chars). Boots clean, socket relocates, no EINVAL."
      - "DB relocation confirmed via socket relocation + clean boot + clean-SIGTERM marker removal. The sqlite/wal/shm/marker files are created lazily on first memory tool call, NOT at boot, so a boot-only file-existence check does not see them (that is expected, not a failure)."
      - "DB dir must be inside an allowed boundary (process.cwd / home / os.tmpdir). Worktree dirs are inside the repo (cwd) so they pass; raw /tmp on macOS does not (os.tmpdir is /var/folders). The socket dir has no such boundary guard."
      - "Reaper target corrected: session-cleanup.sh does not exist; built a focused new worktree-reaper.sh instead of wedging into the operator-sensitive orphan-mcp-sweeper.sh."
---
# Implementation Summary: Worktree-per-AI-session automation (core built)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 035-worktree-per-session-automation |
| **Completed** | BUILT + TESTED (SC-001 passed); only operator-machine wiring remains |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The contention this feature fixes is real (concurrent sessions sharing `main` + shared MCP DBs caused this very session's collisions), and the core that ends it is now built and verified.

### Step-0 gate — PASSED, after finding and fixing a real blocker
The hard prerequisite (REQ-001) is green, but only after Step-0 surfaced an architectural problem the original design did not anticipate, which is exactly what a gate is for.

**The blocker.** The daemon's unix-domain IPC socket defaults to `<db-dir>/daemon-ipc.sock`. With the DBs placed deep inside the worktree as designed, that socket path is 174 characters — past the macOS `sun_path` limit (~104; ~108 on Linux). The daemon dies immediately with `EINVAL` on `listen()`. The deep-worktree DB layout cannot work unchanged.

**The fix (verified end-to-end with a real worktree).** The wrapper also exports `SPECKIT_IPC_SOCKET_DIR` pointing the socket at a short per-session dir under `$HOME` (`~/.spk-wt-sock/<runtime>-<slug>`, ~70-78 chars). A real `git worktree add` + daemon boot with the long (158-char) worktree DB dir plus this short socket dir boots clean, lands the socket in the override dir, and shows no `EINVAL`; the worktree and branch then remove cleanly.

**What "relocation proven" actually means here.** The database files (`context-index__<profile>.sqlite`, `-wal`, `-shm`, `.unclean-shutdown`) are created lazily on the first memory tool call, not at daemon boot, so a boot-only file-existence check legitimately sees none of them — that is expected behavior, not a failure. Relocation is evidenced instead by the IPC socket relocating to the override dir, the daemon booting against the override, the shared DB staying untouched, and a clean `SIGTERM` running `close_db()` and removing the marker.

**Boundary constraint.** The config's guard only allows DB dirs inside `process.cwd()`, the home dir, or `os.tmpdir()`. Worktree DB dirs live inside the repo (= cwd) so they pass; a raw `/tmp` path does not on macOS (`os.tmpdir()` is `/var/folders/...`). The socket dir has no such guard, so `$HOME/.spk-wt-sock` is fine.

### `worktree-session.sh` — the launch wrapper
A top-level session gets its own worktree (`.worktrees/<runtime>-<slug>`), branch (`work/<runtime>/<slug>`), isolated MCP databases via `SPEC_KIT_DB_DIR` + `SPECKIT_CODE_GRAPH_DB_DIR`, and a short IPC socket dir via `SPECKIT_IPC_SOCKET_DIR` (the sun_path fix above). Shared `node_modules`/`dist` are symlinked from main so there is no per-worktree reinstall or rebuild. Child detection has two signals: `AI_SESSION_CHILD=1` (set at dispatch) and a structural backstop (`git --git-dir` differs from `--git-common-dir` → already inside a linked worktree). Either makes the wrapper exec in place; an unknown signal defaults to top-level (isolate), the safe failure mode. The wrapper exports `AI_SESSION_CHILD=1` for its own descendants so orchestrated children never re-nest. It also warns if the computed socket path would still approach the platform limit.

### `worktree-reaper.sh` — conservative cleanup
Prunes only `.worktrees/*` whose branch is fully merged into main AND whose tree is clean; a dirty or unmerged worktree is left alone. Runs `git worktree prune` for stale admin entries. Also prunes the short `~/.spk-wt-sock/<slug>` socket dirs whose matching worktree is gone. Orphan daemons are reported by default and only killed with explicit `--reap-daemons` — daemon killing stays opt-in to protect live sessions.

### `worktree-guard.sh` — detect-and-warn backstop
A SessionStart hook cannot relocate an already-started process, but it can warn. This guard prints a one-line stderr warning when a top-level session is running on shared `main`/`master` instead of an isolated worktree, then always exits 0. It stays silent for orchestrated children (`AI_SESSION_CHILD=1`), sessions already inside a linked worktree, non-git dirs, and when `SPECKIT_WORKTREE_GUARD=off`. The operator adds it as an extra command in each runtime's SessionStart chain.

### Verified end to end (SC-001)
Two concurrent wrapper-style sessions were allocated as real worktrees and proven independent: distinct branches, DB dirs, and socket dirs; a commit in session A moved only A's HEAD (B and main unchanged, the probe file absent from both); and — the part the sun_path fix unblocked — both daemons booted concurrently on their own sockets with no `EINVAL`. Main's HEAD was unchanged and both worktrees + branches + socket dirs were removed cleanly afterward.

### `.gitignore`
`.worktrees/` is now ignored so worktree contents never show as untracked in the main checkout.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/worktree-session.sh` | Created | Launch wrapper (isolate top-level, suppress children, socket-dir fix) |
| `.opencode/bin/worktree-reaper.sh` | Created | Prune merged/clean worktrees + stale socket dirs; report/kill orphan daemons |
| `.opencode/bin/worktree-guard.sh` | Created | Detect-and-warn SessionStart guard for top-level-on-main sessions |
| `.gitignore` | Modified | Ignore `.worktrees/` |
| `.opencode/bin/README.md` | Modified | Document the three entrypoints + child-injection + guard wiring |
| `.opencode/skills/sk-git/SKILL.md` | Modified | §3 Launch-Wrapper Worktrees vs the In-Session Ask-First Rule + deps-override note |
| `035-…/spec.md`, `tasks.md`, `implementation-summary.md` | Modified | Reflect built + tested state |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Step-0 first, as the design demanded — a direct `context-server.js` boot against an isolated DB dir (not via the launcher, so it could not touch the live daemon). The first harness attempt produced a 0-byte log because the compiled entry's `isMain` guard (`import.meta.url` ends-with `argv[1]`) failed on a non-realpath path; rerunning with the realpath form booted correctly and proved relocation. The wrapper and reaper were then verified by `bash -n` plus dry-run exercises of every branch, including a throwaway `/tmp` worktree to confirm the structural child-detection backstop, which was removed cleanly afterward.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Build the core now, defer per-runtime wiring | The wrapper + reaper are new opt-in files with zero effect on existing behavior; per-runtime entry points are shell aliases specific to the operator's environment |
| New `worktree-reaper.sh`, not session-cleanup.sh | The design's `session-cleanup.sh` does not exist; a focused new script is cleaner and avoids the operator-sensitive `orphan-mcp-sweeper.sh` (flagged in memory as reverted by a parallel session) |
| Daemon killing is opt-in (`--reap-daemons`) | Auto-killing daemons risks live operator sessions; report-by-default is the safe posture |
| Default unknown sessions to top-level | If child-detection is uncertain, isolating is the safe failure mode (never accidental nesting onto a shared tree) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Step-0 socket-length blocker found | CONFIRMED — 174-char worktree socket path > macOS sun_path ~104 → daemon EINVAL on listen() |
| Step-0 fix (SPECKIT_IPC_SOCKET_DIR) end-to-end | PASS — real `git worktree add` + boot with long DB dir + short socket dir: BOOTED=1, EINVAL=0, socket in override dir, worktree+branch removed cleanly |
| DB-dir relocation under override | PASS — daemon boots against SPEC_KIT_DB_DIR, IPC socket relocates, shared DB untouched, clean SIGTERM removes marker (DB files are lazy-created on first tool call, not at boot) |
| SC-001 two-concurrent-session isolation | PASS — distinct branches/DB-dirs/sockets; A commit independent; B + main unaffected (probe absent in both); both daemons booted concurrently EINVAL=0; main HEAD unchanged; worktrees cleaned |
| worktree-guard.sh (5 paths) | PASS — top-level-on-main warns + exit 0; child / GUARD=off / inside-worktree / non-git all silent + exit 0 |
| Reaper safety dry-run | PASS — prunes nothing with no worktrees; never touches main or sibling |
| bash -n + shellcheck (3 scripts) | PASS — clean |
| `worktree-session.sh` `bash -n` | PASS |
| Child detection — `AI_SESSION_CHILD=1` | PASS — exec in place, no worktree |
| Child detection — structural (inside linked worktree) | PASS — exec in place (throwaway worktree test) |
| Top-level dry-run plan | PASS — correct worktree/branch/DB dirs; all 6 shared paths resolve |
| `worktree-reaper.sh` `bash -n` + dry-run | PASS — prunes nothing with no worktrees; reports 0 orphans; main untouched |
| Worktree cleanup after tests | PASS — `git worktree list` back to main only; HEAD unchanged |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Operator-machine wiring is the only remainder.** The three scripts are built and tested, but turning them on for real sessions is operator-environment-specific and intentionally not done here: (a) launch aliases per runtime (`alias claude='.../worktree-session.sh claude'`), (b) adding `worktree-guard.sh` as a SessionStart hook entry in each runtime's machine-specific config (e.g. `.claude/settings.local.json`), and (c) setting `AI_SESSION_CHILD=1` at cli-* dispatch sites. The pattern for all three is documented in `bin/README.md` and `sk-git` §3.
2. **Reaper daemon-orphan detection is heuristic.** It matches live `context-server.js` processes referencing a `.worktrees/` path via `pgrep`; it reports rather than kills by default. A lease-file-based mapping would be more precise.
3. **Socket-dir override is required, not optional, on this layout.** Because the worktree DB path exceeds sun_path, the daemon only boots with `SPECKIT_IPC_SOCKET_DIR` set. The wrapper sets it automatically, but any hand-rolled launch into a worktree must do the same or the daemon dies with EINVAL.
4. **Cross-runtime child signal is best-effort.** `AI_SESSION_CHILD=1` must be set at each dispatch site; the structural `git-common-dir` backstop catches the common case (child already inside the parent's worktree), and unknowns default to isolate. There is no universal native child signal across all five runtimes.

<!-- /ANCHOR:limitations -->
