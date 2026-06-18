# Iteration 004 — OS-level supervision (launchd/systemd) as the root-cause fix [Fix A]

- **Wave:** 2 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** byx00oghb · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-004.txt` · **Raw (full file:line):** `../raw/iter-004.out` · **Confidence:** high

> Independently confirmed the orchestrator-verification: the existing LaunchAgent is an orphan-sweeper, not a daemon supervisor. This iteration designs OS-supervision as Fix A.

---

## The existing LaunchAgent (confirmed: NOT a daemon supervisor)
`.opencode/scripts/launchagents/com.michelkerkmeester.orphan-sweep.plist` runs `orphan-mcp-sweeper.sh --dry-run`; `StartInterval=600`, `RunAtLoad=false`, **no `KeepAlive`**, **TEMPLATE-ONLY / not installed by default** (manual `cp` + `launchctl load`). README confirms "versioned template only." So it periodically sweeps orphans; it does NOT keep any mk- daemon alive.

## Why added but not default
Phase 026 just shipped a missing template (scenario 419 linted a never-committed plist). Rollout is deliberately dry-run-first + operator-activated; the plist is machine-specific (absolute paths). Existing lifecycle stays per-session-launcher. Later phases kept pieces opt-in (027 orphan-sweep opt-in; 028 deferred true warm-daemon adoption → reap-and-respawn).

## Does OS supervision fix the root cause? (mapped per failure mode)
Current template: **No** (periodic dry-run sweeper). A REAL OS supervisor that OWNS each daemon + restarts on death: **Yes**, conditionally:
- **Adopt-not-resurrect** → directly fixed (launchd/systemd resurrects autonomously, no fresh-launcher needed).
- **Ungraceful death (SIGKILL/OOM/crash)** → correct class of fix (KeepAlive restarts on ANY exit; SIGKILL is unhandleable in-process so external supervision is the only fix).
- **Stale-socket-not-swept** → fixed because relaunch reaches the daemon bind path (socket-server unlinks reclaimable same-user stale socket on EADDRINUSE).
- **Advisor kill-on-shutdown / cross-session kill** → fixed ONLY IF session launchers stop killing the daemon (become clients).
- **Warm-probe trap** → reduced (daemons normally warm, so warm probes succeed).

## Required changes (the fix's real cost — INFERRED from code)
1. Add an **OS-supervised mode** where launchd/systemd is the ONLY daemon owner.
2. **Session launchers become pure bridge/proxy clients**: resolve socket → warm-probe → bridge stdio; **never spawn/kill/clear daemon leases**. (Keep `launcher-session-proxy` — it already reconnects/replays safe read frames across backend recycle.)
3. **Reinterpret leases** so the service-managed daemon owns the lease; session clients aren't the lifecycle owner.
4. **Disable spec-memory re-election/reap-on-stale under OS-mode** (or make them service-aware) so a client can't reap the OS-owned daemon (avoid two-owners-fighting).
5. **Make advisor + code-index shutdown non-destructive** (today they kill child + clear leases).

## Cross-platform + scope
- macOS: LaunchAgent per daemon — `RunAtLoad=true`, `KeepAlive`, `ThrottleInterval`, abs paths, logs.
- Linux: `systemd --user` units, `Restart=always` + `RestartSec`. Windows WSL → Linux path.
- **Scope = all 3 daemons** (not just spec-memory) + a decision on the **shared HF model-server sidecar** (shared by spec-memory + advisor): supervise it separately or make it **refcount/service-owned** so one daemon/session can't recycle another's embedding sidecar.

## Confidence + unknowns
High that the current plist isn't the fix; high that OS-supervision is the right CLASS if paired with the launcher→client refactor. Unknowns: whether the orphan-sweep plist is installed here; whether any external config installs units; the exact clean OS-owned daemon entrypoint (current launchers aren't safe to run unchanged as the long-lived owner).
