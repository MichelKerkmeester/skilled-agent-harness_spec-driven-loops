# Iteration 001 — daemon-reliability phase ledger + current state

- **Wave:** 1 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** ba07gymu6 · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-001.txt` · **Raw (full 30-phase ledger):** `../raw/iter-001.out` · **Confidence:** medium-high

> Read live-diagnosis + parent spec + key phase docs + current ENV/config/code. Couldn't read packet 140 (outside set) or the live process env. Full per-phase residue table in raw.

---

## Phase ledger (key phases)
- **003** research: RC-1 native/sidecar RSS, RC-2 no auto-restart, RC-3 bridge-to-dead-socket, RC-4 destructive build.
- **017** disposal-flap-guard: fire-time relaunch gate (shutdown + ppid/orphan) — stop relaunch under disposing owner.
- **018** persistent launcher log (mk-spec-memory only, text, single-gen).
- **019** dead-socket-reap-hardening: consecutive deep-probe failures before respawn (`SPECKIT_LEASE_PROBE_RETRIES=1` default).
- **020** code-index reconnecting proxy: secondary clients use the shared session proxy (read tools replay; scan/apply/verify unsafe). **Default-on, no flag.**
- **021** orphan-sweep Stop-hook: `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` — **default-OFF** (dry-run/1/on/live to enable); needs `CLAUDE_SESSION_PID`.
- **022** ownership re-election FOUNDATION (mk-spec-memory): detached spawn + release-lease-on-shutdown instead of kill. Originally default-off.
- **026** followups: **added a LaunchAgent template** + hermetic release-vs-kill test; did NOT test true adoption bookkeeping; plist machine-specific.
- **027** re-election default-on rollout (set the env in 3 configs; later moved to launcher-code default).
- **028** live two-launcher validation: found stale lease could spawn a 2nd daemon; fix reaps live released daemon before respawn. **True warm-daemon adoption deferred.**
- **029** cross-session-kill-scoping: removed PPID fallback; every cleanup kill re-proves ancestry to session pid; dirty-boot integrity gate.
- **030** client-side reconnect survival: **planned, NOT shipped** — stdio auto-reconnect is harness-owned, "not fixable from this repo except by reducing drops or moving transport."

## Current shipped state (default-on vs flag-gated)
- **Re-election:** default-ON in launcher CODE (`daemonReelectionEnabled()` true unless `SPECKIT_DAEMON_REELECTION=0/off`); configs only carry a note now (`ENV_REFERENCE.md:179`). **mk-spec-memory ONLY.**
- **Orphan-sweep Stop-hook:** flag-gated, **default-OFF** (`SPECKIT_STOP_HOOK_ORPHAN_SWEEP`).
- **Code-index reconnecting proxy:** default-on, no flag.
- **Dead-socket reap:** default-on, tunable (`SPECKIT_LEASE_PROBE_RETRIES=1`).

## Key unsolved residue (across 30 phases)
- **008/009:** SIGKILL is unhandleable — no protection against ungraceful death (corruption / no cleanup) ; daemon restart needed to load new dist.
- **022:** adoption unproven; **split-brain mechanism identified**; terminal death relies on the (default-off) orphan sweeper.
- **026/028:** true warm-daemon **adoption bookkeeping never validated**; re-election machine-local under test.
- **021:** live reap never observed; needs `CLAUDE_SESSION_PID`.
- **030:** client-side stdio reconnect NOT shipped (harness-owned).
- **017/022:** terminal-death recovery leans on the orphan sweeper (default-off).

## The gap (IT1 hypothesis — converges with IT2)
**Scope + activation mismatch**, not absent fixes:
1. **Scope:** owner-disposal re-election is **mk-spec-memory only**. `mk-skill-advisor` has the reconnecting proxy but **no re-election release branch** — its signal handler still kills the child + clears leases → dies with its session, leaves a stale socket. So "re-election default-on" does NOT protect advisor.
2. **Activation:** stale-socket healing (019) runs only when a launcher does the bridge/probe/respawn path; a **warm-only CLI probe refuses cold-spawn**, so it reports the stale socket without healing it. This Claude session wasn't cleanly bridged → no cold-start/reap ran.
3. **code-index:** proxy (020) prevents hard disconnects but not orphan-launcher accumulation; the sweep (021) is default-off.
4. Even mk-spec-memory: a released detached daemon that later dies (crash/OOM/SIGKILL) has **no live launcher to respawn it**; resurrection needs a fresh non-warm launcher invocation.

## Confidence + unknowns
Medium-high (docs + current ENV/config/code). Unverified: packet 140, live launcher env, whether the dead spec-memory launcher predated default-on code, exact kill event.
