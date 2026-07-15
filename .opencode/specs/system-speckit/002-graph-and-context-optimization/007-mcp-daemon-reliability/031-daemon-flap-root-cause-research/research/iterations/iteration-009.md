# Iteration 009 — phased, risk-gated implementation plan

- **Wave:** 5 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** bmfstkyvq · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-009.txt` · **Raw (full change-site/test/telemetry tables):** `../raw/iter-009.out` · **Confidence:** high on root cause + descope
- Spot-checked the C2 change sites against live source (all 3 CLIs throw on `warmOnly` before spawn; bridges pre-probe warm).

> **Decision: ship C2-minimal ONLY first. No B / C1 / OS-unit / always-warm / HF-refcount in the first implementation** (per IT8 descope).

---

## Immediate operator remediation (IT9's proposal — see correction)
IT9: run one non-warm CLI per dead daemon (`spec-memory.cjs memory_health`, `skill-advisor.cjs advisor_status`, `code-index.cjs code-graph-status`, all `--format json`), then `orphan-mcp-sweeper.sh --dry-run` before reaping the code-index pile-up.
> **⚠️ ORCHESTRATOR CORRECTION (live-verified, see orchestrator-verifications §3c):** this works for the generic warm-only case but **does NOT resurrect spec-memory right now** — its shared HF embed sidecar is dead (stale `hf-embed.pid` → pid 30817 not running), so cold-spawn fails (exit 75, launcher gives up). Clear the stale HF pidfile / revive HF (or use a fresh runtime session) first.

## Phase 1 — C2-minimal (the first ship)
**Scope:** SessionStart fires background non-warm kicks; optional warm-only-probe self-heal gated. First prompt may still see 75; next probe should succeed.
**Change sites:** 3 CLI warm branches (spec-memory-cli `:770-778,:914-922`, code-index-cli `:941-949,:1085-1092`, skill-advisor-cli `:1034-1042,:1188-1195`); SessionStart (Claude `session-prime.ts:335-416`, Codex `session-start.ts:130-182,218-226`); hook fallbacks (spec-memory `:193-218`, code-index `:196-219`); OpenCode bridges (3); **orphan-sweeper preservation** (`:181-190,:275-343`); **no-kick exclusions** (compact-inject `:213-222`, session-stop `:103-127`).
**Flags:** `SPECKIT_PROMPT_SELF_HEAL` = `0/off` (disable) | unset/`session-start` (default after stress gate: SessionStart-only kick) | `all` (opt-in warm-branch self-heal).
**Throttle:** atomic per-service/per-repo lock (`repoFingerprint+serviceName`, `mkdir`/`O_CREAT|O_EXCL`, TTL 30s, stale-recover on dead pid).
**Kick:** dead warm probe → `spawnLauncher` detached/unref + still return 75; SessionStart kicks all 3; Stop/compact/shutdown/cleanup force self-heal OFF.
**Tests:** CLI unit (flag-off = no spawn; `all` = one kick + telemetry); lock (100 concurrent → 1 owner; stale recovers; foreign refuses); **7-runtime stress (≤1 launcher/service/repo; follow-up warm succeeds within SLO)**; hook-exclusion (compact/stop don't kick); update existing release-cleanup stress + tri-daemon drill.
**Telemetry (JSONL):** kick_attempted/lock_skipped/stale_lock_recovered/kick_spawn_failed/daemon_healed/first_success_latency_ms/kick_disabled.
**Rollback:** `SPECKIT_PROMPT_SELF_HEAL=0` + rm stale `/tmp/mk-*` locks + restart session.
**Kill-criteria:** stress spawns >1 launcher/service; teardown hooks kick; sweeper reaps the resident; latency doesn't improve; RSS spikes under concurrent kicks; lock wedges.

## Phase 2 — RSS prevention (measure-then-enable, BEFORE any always-warm)
Sites: `model-server-supervision.cjs:167-195` (env parse), `:359-412` (watchdog), `:824-846` (HF spawn preflight), spec-memory recycle `:1156-1223`, advisor HF shutdown `:877-969`. Measure ≥35 starts (7 runtimes × 5 cycles + idle + embedding-heavy) → p50/p95/p99 RSS + free RAM. Then set calibrated `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` + `_RSS_SELF_EXIT=1` + **free-RAM preflight before HF load** (degrade vs OOM). Kill: no stable cap / self-exit loops / preflight denies healthy machines.

## Phase 3 — B uniform hardening (gated on Phase 2; single-writer tests)
Generalize spec-memory release/adopt to advisor+code-index; active-client fail-open; proactive stale-socket sweep; HF refcount; **lease mode/version fencing**. Flag `SPECKIT_UNIFORM_LAUNCHER_HARDENING=1` default-off. **Invariant: one service/repo/writable-owner.** Tests: two-launcher live per daemon (the 028 double-writer gate), old-version-launcher-bridges-not-kills, HF refcount shared, WAL single-writer. Kill: any double writer / old launcher kills new backend / refcount leak/cross-kill / sweep removes live or foreign socket.

## Phase 4 — C1 supervisor + ONE OS unit (gated on data that 1-3 insufficient)
New `mk-daemon-supervisor.cjs`; reuse bridge `:360-437` + proxy `:725-837`; sessions client-only. **Security: admin socket same-user 0600 + repo-fingerprint namespace + capability token; NO unauthenticated restart/shutdown** (IT8 + phase 029). One LaunchAgent (RunAtLoad+KeepAlive) / one `systemd --user` (Restart=always) supervising ONLY the supervisor. Version-hash self-restart on `git pull` drift. Explicit install/uninstall/upgrade/rollback. Kill: no token / repo-namespace collision / uninstall can't restore / stale dist resident / SPOF without visible degraded state.

## Ledger mapping + follow-on phases
Extends 017 (no-kick-from-teardown), 019 (Phase-3 proactive sweep), 020 (reuse proxy P3/4), 021 (preserve residents), 022 (P3 generalize, fenced), 029 (no global kills; auth supervisor). 027 kept for spec-memory only. 028 blocks P3 until per-daemon double-writer tests. 030 stays harness-owned. **Proposed follow-on impl phases: 032-c2-minimal-prompt-self-heal · 033-hf-rss-prevention · 034-uniform-launcher-hardening-gated · 035-supervisor-os-unit-gated** (031 = this research, research-only).

## Sequencing (prove-before-next)
P1 start: C2 scope + flag decision accepted → P1 finish: 7-runtime stress ≤1/service + telemetry + no-teardown-kick + sweeper-preserves → P2: RSS baseline + cap + preflight calibrated → P3: lease fencing + per-daemon double-writer tests → P4: only if data proves 1-3 insufficient for last-owner SIGKILL/OOM survival.

## Confidence + unknowns
High on root cause + descope. Unknowns: exact live kill event; real HF RSS ceiling; operator tolerance for default SessionStart process creation; advisor/code-index backend-only feasibility; old-launcher compat needed during rollout.
