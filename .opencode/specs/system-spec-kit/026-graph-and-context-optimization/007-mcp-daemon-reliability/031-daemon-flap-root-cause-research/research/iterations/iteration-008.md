# Iteration 008 — adversarial red-team of the layered fix

- **Wave:** 4 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** bu7xfv4o2 · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-008.txt` · **Raw (full):** `../raw/iter-008.out` · **Confidence:** high on root cause + advisor kill-on-shutdown; medium on OOM severity (no live RSS baseline)
- **Review status: REQUESTED_CHANGES → DESCOPE**

> The full layered fix is over-engineered for a first ship. Ship C2-minimal only; gate B/C1/OS-unit on data + explicit kill-criteria.

---

## Top risks (ranked)
- **P0 migration split-brain** — old kill-on-signal launchers (advisor `:1185-1200`, code-index `:911-928`) vs new client-only/supervisor → old owner kills new clients' backend; two owners race; client-only with absent supervisor = permanently cold. Gate: don't ship client-only until a lease `mode/version` fences old owners to bridge-only.
- **P1 warm-kick storm** — 7 runtimes × warm-only on stale sockets → launcher storm. Need an **atomic per-service/per-repo throttle lock (pid+timestamp+liveness)** + a **7-runtime stress test proving ≤1 launcher/service**. Risk: amplifies load exactly when OOM-pressured.
- **P1 always-warm worsens OOM (RC-1)** — no-idle main daemons + resident supervisor + HF sidecar raises baseline RSS; RSS caps are default-off/uncalibrated. **Kill-criterion: no always-warm default until measured steady-state RSS stays under an agreed free-RAM floor. Layer 3 (RSS) must PRECEDE always-warm, not follow.**
- **P1 supervisor = same-UID shutdown/restart API** — admin socket (`ensureService/restartService/shutdown`) is a new SPOF + attack surface. Kill-criterion: no unauthenticated `restartService`/`shutdown`; needs ownership/perms hardening + capability token (match `socket-server.ts:268-300`).
- **P1 B reopens the 028 double-writer** — uniform release/adopt is the exact risk 028 deferred (it fixed a live two-daemons-on-one-WAL by reap-before-respawn, NOT adopt). Mitigation: per-service single-writer + two-launcher live tests before default-on.
- **P2 stale-supervisor on `git pull`** — OS unit keeps old process resident after code/dist change. Mitigation: protocol/version-hash refuse-stale-clients / self-restart on hash drift.

## Regressions against shipped phases
- **017** — C2 doesn't undo the flap-guard (fresh detached launcher, not relaunch-under-disposing-owner), BUT **don't kick from Stop/compact/shutdown hooks** (could reanimate during teardown). 
- **021** — removing kill-on-shutdown leaves resident daemons → leaks if sweeper off; if sweeper on, it KILLS the new residents unless taught release/supervisor leases (`orphan-mcp-sweeper.sh:181-190,275-343`). Conflicts with 021's keep-killing-opt-in decision.
- **028** — uniform adopt reopens the double-writer class (above).
- **029** — supervisor `shutdownService` is a NEW global cross-session kill path; 029 removed unsafe PPID fallback + required ancestry proof. Must be authenticated + operator-scoped or it's a more convenient cross-session kill.

## Operator-preference conflicts
- 021 kept orphan-killing default-off + dry-run-first.
- C2 changes the prompt-time contract from "read-only probe" → "probe WITH side-effect (still returns 75)" — not neutral; should be **opt-out minimum, maybe opt-in** until operators accept prompt-time process creation.
- An always-on OS supervisor with auto-restart is a STRONGER conflict → explicit install + visible rollback (unload unit + kill supervisor-owned daemons).

## Cheapest defensible scope
- **C2 only**, + telemetry + storm controls. (Research already calls C2 the 80/20; orchestrator-verifications confirms a **non-warm CLI already resurrects daemons today** → the gap is purely the prompt-time warm-only contract.)
- Even smaller: **kick once on SessionStart** (short background non-warm launch), NOT on every prompt hook — fixes "session starts cold, stays cold" without making every warm probe a spawn trigger.
- Do NOT first-ship: uniform release/adopt (highest regression surface), the supervisor/client-only mode, the OS unit, or HF refcount (unless isolated behind tests proving HF doesn't stay resident).
- Proactive stale-socket sweep: keep out unless a test proves bind-time EADDRINUSE reclaim is insufficient (it already reclaims same-UID stale sockets).

## Verdict: DESCOPE — ship only
1. C2 cold-start self-heal for warm-only dead-daemon probes, behind `SPECKIT_PROMPT_SELF_HEAL`, **SessionStart kick preferred over every-prompt**.
2. Atomic per-service/per-repo throttle lock w/ stale-lock recovery + 7-runtime concurrent stress test.
3. Telemetry: kick attempted / lock skipped / daemon healed / first-success latency / spawn failures.
4. NO always-warm default until RSS calibration + free-RAM preflight are measured and enforced.
**Defer (gated on data):** uniform release/adopt, supervisor/client-only, OS-unit install, HF refcount.

## Confidence + unknowns
High: failure is warm-only/no-supervisor/session-coupled; advisor/code-index kill-on-shutdown is real. Medium: OOM severity (no RSS baseline read). Unknown: exact live kill event; supervisor admin-socket protocol (design kill-criterion, not yet code); whether the operator accepts prompt-time side-effect spawning (gates C2 default-on).
