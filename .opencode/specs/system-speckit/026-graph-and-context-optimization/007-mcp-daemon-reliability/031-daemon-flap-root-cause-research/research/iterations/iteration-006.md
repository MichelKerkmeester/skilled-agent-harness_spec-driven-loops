# Iteration 006 — Fix C: supervisor process (C1) + cold-start self-heal (C2)

- **Wave:** 3 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** be01rrgnh · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-006.txt` · **Raw (full change-site + matrices):** `../raw/iter-006.out` · **Confidence:** high (C2), medium-high (C1)

> Verdict: **ship C2 first (80/20), build C1 only if always-warm + last-owner SIGKILL/OOM survival are required; C1's durable bootstrap = ONE small OS unit for the supervisor (not cron).**

---

## C1 — dedicated supervisor (`.opencode/bin/mk-daemon-supervisor.cjs`)
Control-plane that owns all 3 daemons + the HF sidecar; **tool traffic still goes direct to daemon IPC sockets via the existing session-proxy/bridge** (supervisor is control-plane only). Exposes an admin socket (`status/ensureService/restartService/shutdown`). Sessions discover it (state file + admin-socket probe), call `ensureService`, then bridge via existing `maybeBridgeLeaseHolder` (`launcher-ipc-bridge.cjs:360-437`) + `createSessionProxy` reattach/replay (`launcher-session-proxy.cjs:725-837`).
- Add `SPECKIT_SUPERVISOR_OWNER=1` supervised-owner mode (lease `ownerPid=supervisor`, `childPid=daemon`); **client-only sessions never kill children or clear leases**. spec-memory backend-only plumbing already exists (`:1317-1325` + `context-server.ts:2267-2272`); advisor/code-index need equivalent.
- Death detection: child `exit` + periodic **deep** socket probe (`probeDaemon deepProbe`, requires JSON-RPC reply); wedged (alive but probe-dead) → SIGTERM/grace/SIGKILL/restart. Reuse crash-loop guard (`model-server-supervision.cjs:215-271`) but **don't give up forever** for main daemons (cooldown + degraded status). HF stays single-owner (refcount), 503 during cooldown.
- **Chicken-and-egg (honest):** a pure-Node supervisor can't keep itself alive after its OWN SIGKILL/OOM → durable bootstrap = **ONE OS unit for the supervisor only** (macOS LaunchAgent RunAtLoad+KeepAlive; Linux systemd --user Restart=always); first-session-detached-spawn is a fallback, not the durability story. NOT cron.

## C2 — cold-start self-heal (the 80/20, exact change sites)
Change the warm-only branch in all 3 CLIs to fire a detached cold-start BEFORE throwing 75:
```ts
if (warmOnly) { kickBackgroundColdStart(paths, {serviceName, reason}); throw new CliRetryableError(...); }
```
Sites: spec-memory-cli `:914-922` (spawn `:770-778`), code-index-cli `:1085-1092` (`:941-949`), skill-advisor-cli `:1188-1195` (`:1034-1042`). `kickBackgroundColdStart` = `detached:true, stdio:'ignore', unref()`, returns immediately, **throttle lock (10-30s) in the socket dir** to avoid a launcher storm, opt-out `SPECKIT_PROMPT_SELF_HEAL=0`.
Also kick in the prompt-time fallbacks (spec-memory/code-index/advisor cli-fallback `:~168-204/:512-523`) + **SessionStart** (Claude `session-prime.ts:384-386`, Codex `session-start.ts:218-226`) + **OpenCode plugin bridges** (mk-*-bridge.mjs). Safety: prompt-time stays fast (still returns 75); duplicate-spawn bounded by existing owner-lease/respawn/stale-reclaim serialization; crash-loop guard bounds flapping; `shouldAbortRelaunchOnFire` not relied on (C2 starts a fresh detached launcher).
**Caveat:** a fire-and-forget SessionStart kick makes recovery likely by the first prompt but can't GUARANTEE warm-on-first-turn without a small SessionStart wait budget (or C1/A).

## SIGKILL/OOM-of-last-owner survival (the decisive criterion)
| Fix | survives daemon-child kill | survives LAST-resident-owner kill |
|---|---|---|
| **A** launchd/systemd per daemon | yes | **yes (strongest)** |
| **B** pure-Node launcher hardening | yes (while launcher alive) | **no** |
| **C1** pure-Node supervisor | yes (while supervisor alive) | **no — unless bootstrapped by one OS unit, then yes** |
| **C2** cold-start self-heal | not autonomous (next prompt/CLI heals) | **no (client-triggered, not supervision)** |

## OOM-prevention (RC-1 tie-in)
Resurrection ≠ prevention. RSS caps EXIST but **default-off + uncalibrated** (`SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` unset disables; needs `_RSS_SELF_EXIT=1`), no pre-spawn memory preflight. Recommend: measure + set calibrated defaults, enable self-exit under supervised deployments, add a free-RAM preflight before HF model load (degrade/fail-open vs OS OOM-kill). Existing watchdog `model-server-supervision.cjs:167-195,359-412`; spec-memory in-place RSS recycle `:1156-1205`.

## Recommended rollout (IT6)
1. **C2 first** (smallest change, targets warm-probe trap, prompt stays non-blocking, heals within ~1 prompt).
2. Add metrics/logging (background kicks, heals, crash-loop cooldowns).
3. Build **C1 behind a supervisor-mode flag**.
4. Install **one OS unit for the supervisor only** where true SIGKILL/OOM durability is needed.

## Failure-mode map (C1 / C2)
no-supervisor: C1 fully(+OS bootstrap) / C2 partial · spec-memory-only-reelection: C1 full / C2 partial · advisor-kill-on-shutdown: C1 full(if client-only) / C2 partial · warm-probe-trap: C1 full / C2 mostly · stale-sockets: C1 full / C2 partial · SIGKILL/OOM: C1 full(while alive; durable w/ OS unit) / C2 partial.

## Confidence + unknowns
High C2 sites + SIGKILL analysis; medium-high C1 arch. Unknowns: advisor/code-index supervised-backend-only feasibility; real HF RSS ceiling (measure first); first-prompt-readiness without a wait budget; exact live kill event unrecoverable.
