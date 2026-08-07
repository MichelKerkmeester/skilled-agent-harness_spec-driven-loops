# Iteration 007 — synthesis, decision matrix, recommendation

- **Wave:** 4 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** b2dd2h3hu · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-007.txt` · **Raw (full matrix):** `../raw/iter-007.out` · **Confidence:** high on the architecture decision

> **Recommendation: ship C2 now → B next → C1 (single supervisor + ONE OS unit) as the durable target + a prevention layer. Do NOT make per-daemon A the default.**

---

## Decision matrix (1=poor, 5=strong; weighted /500)
| Criterion | Wt | A per-daemon OS | B pure-Node hardening | **C1 supervisor+1 OS unit** | C2 cold-start self-heal | Prevention (RSS) |
|---|--:|--:|--:|--:|--:|--:|
| Survives SIGKILL/OOM of last owner | 30 | 5 | 2 | 5 | 1 | 2 |
| Cross-platform (mac/Linux/WSL) | 10 | 3 | 5 | 4 | 5 | 5 |
| Blast radius vs 30 shipped phases | 13 | 2 | 3 | 2 | 5 | 4 |
| Impl complexity/time | 10 | 2 | 3 | 2 | 5 | 3 |
| Operational friction | 8 | 2 | 4 | 3 | 5 | 4 |
| Cures vs prevents | 12 | 5 | 3 | 5 | 3 | 2 |
| Alignment w/ launcher/lease/proxy | 9 | 3 | 5 | 4 | 5 | 4 |
| Multi-session safety | 8 | 5 | 4 | 5 | 2 | 3 |
| **Weighted total** | 100 | **369** | **324** | **396** | **332** | **308** |
(C1's SIGKILL=5 ASSUMES the one OS unit bootstrap; pure-Node C1 without it = 2.)

## Recommended layered architecture
- **NOW — C2 cold-start self-heal:** warm-only probe → fire detached cold-start (throttle lock) → still return 75; also kick at SessionStart. Lowest-risk (reuses existing detached `spawnLauncher`), directly kills the live symptom (warm-only never cold-spawns → dead all session). Converts "dead all session" → "first call may fail, next likely succeeds."
- **NEXT — B hardening (all 3 daemons):** uniform release/adopt (advisor+code-index match spec-memory) + active-client fail-open + proactive same-UID stale-socket sweep + HF refcount + long/no idle for main daemons. Removes session-exit cross-kills + the spec-memory-only asymmetry + HF cross-kill.
- **DURABLE — C1 supervisor + ONE OS unit:** single supervisor owns all 3 daemons + HF; sessions become pure clients (probe supervisor → ensureService → bridge via existing proxy); bootstrap = 1 LaunchAgent (mac) / 1 `systemd --user` unit (Linux/WSL). Gets A's restart-on-any-death with less friction + better multi-daemon coordination than per-daemon units.
- **PREVENTION — calibrated RSS caps + free-RAM preflight** (after measurement). Reduces OOM probability; does NOT replace supervision.

## SIGKILL/OOM-last-owner gap → closed ONLY by external OS supervision
In the recommendation that's the **single OS unit supervising the C1 supervisor** (which restarts daemon children). C2 heals only on next prompt/CLI; B can't resurrect after all resident owners die.

## Relationship to shipped phases
Extend: 017 (keep flap-guard for launcher-owned paths), 019 (+proactive sweep), 020 (reuse proxy as client transport), 022 (generalize re-election → subsume under supervisor), 027 (keep default-on for non-supervisor mode), 028 (deferred true-adoption → B/C1 test reqs), 029 (complete via non-destructive client exits). Leave alone: 021 (cleanup tool, not liveness), 030 (harness-owned stdio reconnect). **Would-undo risk:** per-daemon-A-as-default would cause owner-fights unless launchers are FIRST made pure clients (current launchers spawn/kill/clear/reap).

## Minimal vs full
- **Minimal viable:** C2 across all 3 CLIs + prompt/SessionStart hooks (fixes the live symptom).
- **Full durable:** C2 + B + C1 + prevention (first architecture that both reduces recurrence AND survives last-owner death).

## Open decisions for the operator (IT7 recommendations)
- Accept an always-on OS unit? → **Yes** (else last-owner SIGKILL/OOM stays open).
- Per-daemon units vs one supervisor unit? → **One supervisor unit.**
- macOS-first vs both? → C2/B cross-platform first; C1 with mac LaunchAgent + Linux systemd together for durable.
- Always-warm vs idle? → main daemons warm/long-idle; tighter refcount-aware idle for HF (high-RSS).
- First-prompt wait vs non-blocking? → non-blocking for C2; add a small SessionStart wait budget only if first-turn readiness becomes mandatory.
- RSS caps default? → measure first, then calibrated caps + preflight.
- Keep per-daemon A? → yes as an emergency/operator mode, not the default.

## Confidence + unknowns
High on the architecture. Unknowns: exact live kill event (no logs); advisor/code-index backend-only feasibility (impl validation); real HF RSS ceiling (measure first).
