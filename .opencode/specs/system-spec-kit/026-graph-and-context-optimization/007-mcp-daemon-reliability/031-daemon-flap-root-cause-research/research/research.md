# Deep Research — daemon-flap root cause + fix (mk-spec-memory / mk-skill-advisor / mk-code-index)

Synthesis of a 10-iteration deep-research effort (`openai/gpt-5.5-fast --variant xhigh`, read-only seats, orchestrator-written) + live orchestrator verification. Question: why do the shared MCP daemons (here: mk-skill-advisor + mk-spec-memory) keep dying with stale sockets while mk-code-index survives, and what is the definitive root-cause fix? This continues the 30-phase `007-mcp-daemon-reliability` saga.

- **Packet:** `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/031-daemon-flap-root-cause-research` (research-only)
- **Iterations (5 waves):** `iterations/iteration-00{1..10}.md`; raw seat output `raw/iter-00{1..10}.out`; live findings `iterations/orchestrator-verifications.md`; current failure `live-diagnosis.md`.

---

## 1. Root cause (converged + verified)
**Daemon liveness is session-coupled with no always-on supervisor, and the hardening is unevenly applied.** Concretely:
1. **Re-election is `mk-spec-memory`-ONLY** and is *release-for-adopt + reactive-respawn*, **NOT autonomous resurrect** — an unadopted released daemon idle-times-out and dies (`launcher-idle-timeout.ts:98-123`); a fully-dead daemon is revived only by a fresh **non-warm** launcher invocation. (Verified: `daemonReelectionEnabled` count = advisor 0 / code-index 0 / spec-memory 6.)
2. **`mk-skill-advisor` + `mk-code-index` kill-child-on-shutdown** (no release) and can kill a daemon other concurrent sessions are bridged to (no active-client check). (README:93 confirms only spec-memory is hardened.)
3. **Warm-probe trap:** every prompt-time/SessionStart hook + CLI fallback is `--warm-only` → probe-and-exit-75 *without cold-spawning*; only a **non-warm** call cold-spawns. So a session that starts with a dead daemon reports it down all session. **No `prewarm` hook exists.**
4. **Stale sockets are reaped only reactively on a fresh non-warm bind** (EADDRINUSE same-UID unlink) — never proactively swept.
5. **Ungraceful death (SIGKILL/OOM/crash-loop give-up) has no resurrector** — only an external process can restart a SIGKILL'd/OOM'd process.
6. **Lease is process/socket-based, not runtime-labeled** → pure pid contention across Claude/OpenCode/Codex; **universal, not Claude-specific** (Claude is *worse this session* only because its hooks are warm-only + no proven mid-session stdio restart).
RC-1 (from phase 003): native/sidecar **RSS/OOM pressure** is the upstream trigger for the ungraceful deaths.

## 2. The live failure (this incident) — and a decisive live finding
mk-skill-advisor + mk-spec-memory dead with stale sockets; mk-code-index up via 3 per-session reconnecting proxies (phase-020, working as designed). Ranked cause: owner-exit or idle-timeout while this session had only warm-only probes.

**⚠️ Live-verified correction (orchestrator, §3c of verifications):** the "just run a non-warm CLI to resurrect it" remediation **does NOT work for mk-spec-memory right now.** A non-warm `spec-memory.cjs` call returned exit 75 + the socket stayed dead; launchers spawned then exited. Cause: the **shared HF embed sidecar is dead with a stale pidfile** (`/tmp/mk-spec-memory/hf-embed.pid` → pid 30817 not running). spec-memory's backend needs that embed server, so it can't become ready. This is a **live confirmation** that the shared HF sidecar (flagged in IT2/IT5/IT8) is a real, compound failure axis — exactly what the HF-refcount (Phase 3) + supervisor (Phase 4) fixes target.

## 3. Fix landscape (4 options, weighted)
| Fix | What | Survives last-owner SIGKILL/OOM | Score /500 |
|---|---|---|---|
| A | launchd/systemd KeepAlive **per daemon**; launchers→clients | yes (strongest) | 369 |
| B | uniform pure-Node launcher hardening (release/adopt + sweep + HF refcount) | no (only while a launcher lives) | 324 |
| **C1** | **single Node supervisor owning all daemons+HF, bootstrapped by ONE OS unit** | **yes (with the OS unit)** | **396** |
| C2 | cold-start self-heal (warm probe kicks a detached cold-start) | no (client-triggered) | 332 |
| Prevention | calibrated RSS caps + free-RAM preflight | reduces OOM probability | 308 |
The **SIGKILL/OOM-of-last-owner gap is closed ONLY by external OS supervision** (the one supervisor OS unit).

## 4. Recommendation (post adversarial red-team — IT8 verdict = DESCOPE)
**Ship a small, flag-gated fix first; defer the heavy machinery behind data + migration gates.** Phased, risk-gated (full plan + change sites/tests/telemetry/rollback/kill-criteria in `iterations/iteration-009.md`):
- **Phase 1 — C2-minimal (now):** SessionStart background non-warm kick (preferred over every-prompt) + optional warm-branch self-heal behind `SPECKIT_PROMPT_SELF_HEAL`; atomic per-service/per-repo throttle lock; telemetry; **no kicks from Stop/compact/shutdown**; update the orphan-sweeper to preserve self-healed residents. Requires a **7-runtime stress test proving ≤1 launcher/service**. Converts "dead all session" → "first call may 75, next likely succeeds."
- **Phase 2 — RSS prevention (before any always-warm):** measure steady-state RSS, then calibrate+enable HF RSS caps + a free-RAM preflight (addresses RC-1; "always-warm" otherwise *worsens* OOM).
- **Phase 3 — B uniform hardening (gated):** give advisor+code-index release/adopt + active-client fail-open + proactive stale-socket sweep + HF refcount + **lease mode/version fencing**; blocked until per-daemon single-writer/two-launcher tests (the phase-028 double-writer risk).
- **Phase 4 — C1 supervisor + ONE OS unit (gated on data that 1-3 are insufficient):** single supervisor, sessions become clients; authenticated admin socket (capability token, 0600, repo-fingerprinted) — the only layer that survives last-owner SIGKILL/OOM.
Proposed follow-on impl phases: `032-c2-minimal-prompt-self-heal` → `033-hf-rss-prevention` → `034-uniform-launcher-hardening-gated` → `035-supervisor-os-unit-gated`.

## 5. Immediate remediation (today, no code)
- **mk-skill-advisor / mk-code-index:** a **non-warm** CLI call from a shell WITHOUT prompt-time warm-only (e.g. `node .opencode/bin/skill-advisor.cjs advisor_status --json '{"workspaceRoot":"<repo>"}'`) cold-spawns them; or start a fresh runtime session. (advisor was already back this session.)
- **mk-spec-memory (the compound case):** ALSO clear the stale HF sidecar first — remove the dead `/tmp/mk-spec-memory/hf-embed.pid` (pid 30817 not running) so a fresh launcher respawns the embed server, then non-warm cold-spawn; or a fresh session. Without clearing HF, cold-spawn returns 75.
- code-index launcher pile-up: `orphan-mcp-sweeper.sh --dry-run` first; reap only stale helpers.
- **Caveat (IT10):** resurrecting the *daemon* does NOT reconnect already-dropped **native MCP transports** in THIS session (harness-owned, phase-030 unshipped) — CLI fallbacks return, native `mcp__*` tools need a fresh session.

## 6. Live-verification acceptance checklist (before claiming any fix works)
Baseline procs/sockets/RSS/native-MCP availability · reproduce stale-socket in temp env · **prove non-warm cold-start heals real advisor+spec-memory state (incl. HF revive)** · C2 kicks exactly 1 launcher/service · 7-runtime throttle stress (no storm) · SessionStart+advisor kick per runtime · first-success latency (wait-budget decision) · confirm native-MCP restore or document fresh-session-required · trusted mutations after resurrection in fixtures · RSS under multi-session before always-warm · security (0700 socket dir, no teardown kicks, flag-disable, stale-lock recover) · observability events.

## 7. Open decisions for the operator
Accept default SessionStart process-creation (prompt-time side effect)? · `SPECKIT_PROMPT_SELF_HEAL` default on/off? · accept an always-on OS unit (needed for last-owner SIGKILL/OOM survival)? · one supervisor unit vs per-daemon units (rec: one) · always-warm vs idle (rec: warm only AFTER RSS calibration) · macOS-first vs mac+Linux together · whether to build past Phase 1 at all (gated on Phase-1 telemetry).

## 8. Addendum — concurrent-session forensics (independently verified, 2026-06-14)
A parallel session deep-diagnosed the *live wedge* and found a **more proximate root cause** than this 10-iteration research, which read the launcher/lease/socket layer but NOT the memory-save enrichment handler. I independently confirmed both defects against real source (a finding is a hypothesis until the cited code is opened):
- **Proximate wedge bug — CONFIRMED (structure):** `mcp_server/handlers/memory-save.ts` `scheduleBackgroundEnrichment` — `activeBackgroundEnrichments` (`:2920`), `++` (`:2936`), `--` (`:2957`), cap check `if (active < MAX_BACKGROUND_ENRICHMENTS)` (`:2963`) immediately before `setImmediate(run)` (`:2964`). Under a synchronous producer burst (the post-spec-reorg startup scan over ~11,507 paths → ~2,947 incomplete enrichments) the cap is read before the deferred increment lands, so it never throttles → an unbounded microtask self-rearm loop that never yields to libuv's poll phase → the daemon wedges (alive but not serving). **This is the proximate cause of *this* incident's wedge; my research did not reach it.**
- **Self-heal defect — CONFIRMED exactly:** `mk-spec-memory-launcher.cjs` stale-reclaim adopts a daemon at `:1582` gated on `bridgeReadiness()` (`:614`), which returns `ready` purely on `fs.existsSync(socket)` — no request/response. So a wedged-but-socket-present daemon is **adopted instead of reaped**. This is a line-pinned instance of this research's IT2/IT3 "bridges to a wedged/dead socket; adopt-not-resurrect."
- **The fix is low-cost:** a real JSON-RPC deep probe already exists — `launcher-ipc-bridge.cjs` `probeDaemon(... deepProbe:true)` (`:145-157`, used at `:350`). Gating adoption on it (instead of `existsSync`) closes the self-heal hole using present machinery.

**Reconciliation / revised ordering:** the concurrent session's two-line-class fix (throttle the enrichment cap + replace adopt-on-`existsSync` with the existing `deepProbe`) is the **correct *first* move** — it kills the proximate wedge and restores auto-recovery. It is being built under `026/006-operator-tooling` (packet not yet created at time of writing). This research's **C2-minimal (warm-probe self-heal)** addresses a *different, complementary* layer (prompt-time hooks never cold-spawn) and should be a **follow-on after** their fix lands, not a competing concurrent build. The live HF-sidecar stale-pidfile remediation (§2 / orchestrator-verifications §3c) remains valid and orthogonal.

<!-- ANCHOR:references -->
## References
- `iterations/iteration-001.md` — 30-phase reliability ledger + current shipped state
- `iterations/iteration-002.md` — live supervision-code trace (the crux)
- `iterations/iteration-003.md` — cross-runtime lifecycle + exact failure sequence
- `iterations/iteration-004.md` — Fix A: launchd/systemd OS supervision
- `iterations/iteration-005.md` — Fix B: uniform pure-Node launcher hardening
- `iterations/iteration-006.md` — Fix C1 supervisor + C2 cold-start self-heal
- `iterations/iteration-007.md` — decision matrix + layered recommendation
- `iterations/iteration-008.md` — adversarial red-team (DESCOPE verdict)
- `iterations/iteration-009.md` — phased, risk-gated implementation plan
- `iterations/iteration-010.md` — completeness critic + final convergence
- `iterations/orchestrator-verifications.md` — live findings (re-election scope, warm-only/cold-spawn, the dead-HF-sidecar blocker)
- `live-diagnosis.md` — the confirmed current down state
- Code under investigation: `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/mk-{spec-memory,skill-advisor,code-index}-launcher.cjs`, the 3 CLI dist warm/non-warm branches, `launcher-idle-timeout.ts`, the shared `socket-server`
- Prior packet: `system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability` (phases 001-030)
<!-- /ANCHOR:references -->

<!-- _memory:
  last_updated_by: orchestrate
  recent_action: completed 10-iter research + live verification; added §8 addendum reconciling a concurrent session's verified deeper proximate root cause (enrichment busy-loop + adopt-on-existsSync self-heal defect)
  next_safe_action: let the concurrent 026/006 daemon-fix (throttle enrichment cap + adopt-on-deepProbe) land FIRST; build this research's C2-minimal as a complementary follow-on after, do NOT compete on mk-spec-memory-launcher.cjs/memory-save.ts
-->
