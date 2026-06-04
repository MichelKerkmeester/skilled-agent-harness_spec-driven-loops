---
title: Deep Research Strategy - Launcher Concurrency Spawn & Bridge Investigation
description: Validate two launcher/MCP/embedder runtime root causes (T1 hf-local spurious spawn; T2 code-index+advisor daemon bridge not serving) and produce a unified design-conformance fix plan.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

Validate, stress-test, and ground in original design intent two root-cause findings about the spec-kit launcher / MCP / embedder runtime, then produce a unified design-conformance fix plan. READ-ONLY research (no code/config fixes).

---

## 2. TOPIC

Two threads in the launcher-coordination layer, both surfaced by the owner's heavy concurrent-session workflow (currently 2 Claude + 4 codex sessions sharing this repo):

- **T1 — hf-local model server spurious spawn.** A boot-time launcher liveness probe (`GET /api/health`) appears to be treated as an embed *demand* by the cold-state demand listener, spawning the (broken-on-this-host) model server.
- **T2 — mk_code_index + mk_skill_advisor disconnect for secondary sessions.** Packet `012-daemon-bridge-socket-for-skill-advisor-and-code-index` *built* a daemon IPC bridge so secondary launchers attach instead of exiting `LEASE_HELD_BY (no-bridge-socket)`. Live `lsof` shows the bridge is NOT serving → secondaries wedge. So T2 is a **regression / runtime bind-failure of packet 012**, not a missing feature.

---

## 3. KEY QUESTIONS (remaining)
- [ ] T1: Does a boot-time `GET /api/health` probe to a *cold demand listener* cause a model-server spawn (no route allowlist; any HTTP request → `launch()`)? Confirm the trigger and predict/verify the stderr line `hf-model-server demand received GET /api/health; spawning launcher-owned sibling`.
- [ ] T1-fix: Does `HfLocalProvider`'s real embed path rely on `GET /api/health` to wake the server (i.e. must the conformance fix move the wake to a real embed POST)? (`shared/embeddings/providers/hf-local.ts`)
- [ ] T2: Packet 012 built the daemon bridge socket (`advisor-server.ts` / code-index `index.ts` via `lib/ipc/socket-server.ts`). Why is it NOT serving at runtime (no `lsof` listener on the code-index/advisor `daemon-ipc.sock`)? Regression, conditional gate, silent bind failure, or stale-socket EADDRINUSE?
- [ ] T2-design: Reconcile against the 006-mcp-launcher-concurrency track (esp. 010-multi-client-stdio-socket-bridge, 012, 007-skill-advisor-zombie-launcher-fix). Is the live failure a known follow-up, a regression, or untested under N>2 concurrency?
- [ ] Cross-cutting: Are T1 and T2 both consequences of launcher-overlap concurrency, and what is the minimal unified design-conformance fix surface (daemon socket-server bind for T2; probe≠demand for T1)?

---

## 4. NON-GOALS
- Fixing the `onnxruntime-common` topology break (orthogonal; only matters on non-Ollama hosts; this host uses Ollama).
- Implementing any fix (this session is READ-ONLY research; fixes are a later, separately-approved step).
- Scanning/building the code graph (it is intentionally EMPTY here; `.opencode` tooling tree is excluded by design).
- Re-deriving the embedder cascade pointer logic (already established: both pointers valid, cascade short-circuits).

---

## 5. STOP CONDITIONS
- Both threads' root causes are validated or refined with confidence levels AND a unified design-conformance fix plan exists, grounded in 010/012/ADR-014 and the live evidence; OR
- 5 iterations reached; OR
- Convergence (newInfoRatio below threshold across the rolling window).

---

## 6. ANSWERED QUESTIONS
[None yet -- populated as iterations answer questions]

---

<!-- MACHINE-OWNED: START -->
## 7. WHAT WORKED
[Populated after iteration 1]

---

## 8. WHAT FAILED
[Populated after iteration 1]

---

## 9. EXHAUSTED APPROACHES (do not retry)
[Populated when an approach is exhausted]

---

## 10. RULED OUT DIRECTIONS
[Populated from iteration dead-end data]

---

## 11. NEXT FOCUS

**Iter 1 (done):** T2 bind is present + ungated in both running dist (`system-code-graph/mcp_server/dist/index.js:127`, `advisor-server.js:232`); socket inodes were created at startup (chmod 0o600 post-listen, `socket-server.ts:260-262`); both daemons alive but `lsof` shows no FD holder → rules out regression/gate/un-rebuilt-dist. Best fit: **(d) EADDRINUSE-unlink / teardown race under N-way concurrency** orphaning the inode; all three `socket-server.ts` copies md5-drifted; 012 only verified single-secondary. (newInfoRatio 0.9) See `iterations/iteration-001.md`.

**Iter 2 (done) — T2 LOCKED (HIGH).** Inverted asymmetry: the WORKING spec-memory copy is PERMISSIVE (unconditional `fs.unlinkSync`+rebind on EADDRINUSE, `system-spec-kit/.../socket-server.ts:196-207`); the two FAILING copies added a later gate `canUnlinkExistingSocket()` (code-index `socket-server.ts:118-131`) with NO ENOENT guard (`:123`) → under N-way primary-vs-primary EADDRINUSE it throws ENOENT (TOCTOU) or refuses on uid/realpath mismatch (`:120-128`) → `throw err` (`:242-243`) → bind aborts, orphaning the inode. `close()` byte-identical (iter-1 close-race demoted). Secondaries never bind (`mk-code-index-launcher.cjs:100-130`) — racer is a 2nd primary. Guard added post-012, never back-ported. Fix surface: make `canUnlinkExistingSocket` race-safe (ENOENT→reclaim, never-abort) + reconverge 3 copies behind one shared module. (newInfoRatio 0.7) See `iterations/iteration-002.md`.

**Iter 3 (done) — T1 CONFIRMED (HIGH).** `handleModelServerDemand` (`model-server-supervision.cjs:1204-1238`) spawns on ANY request (routePath log-only `:1205,1216`; no allowlist); probe sends literal `GET /api/health` (`launcher-ipc-bridge.cjs:13,240`); boot probe (`:1160-1167`) lands on a live sibling's COLD listener under OVERLAP. Idle-monitor ruled out (spawn-safe `:1045-1090`). KEY: the REAL embed path ALSO wakes via `GET /api/health` (`hf-local.ts` embedPrepared:826-833 → waitForReady:718-785 → healthOnce:712) THEN `POST /api/embed:835` — so "make /api/health non-spawning" would break genuine hf-local hosts → RULED OUT. ADR-014 treats /api/health as a liveness READ (`embedder_architecture.md:47-58`). Conformant fix: launcher `probeModelServer` carries a dedicated probe-marker header that `handleModelServerDemand` treats as non-spawning, preserving the consumer wake (GET health + POST embed). (See `iterations/iteration-003.md`.)

**Iter 4 (done) — UNIFIED PLAN + T1 reconciled.** T1 is KNOWN-but-untested: spawn-on-`GET /api/health` is BY DESIGN (lazy first-embed trigger, `010/004-launcher-supervision/implementation-summary.md:50`, REQ-001 `:126`); the probe-vs-demand discriminator was a documented OPEN QUESTION never closed (`004/spec.md:170`); the sibling-overlap probe was never anticipated; no prior packet proposes a probe-marker. **Unified fix:** (T2, do first — active wedge) make `canUnlinkExistingSocket` race-safe (ENOENT→reclaim; best-effort checks; never `throw` to abort the bind) toward spec-memory's permissive copy, then reconverge the 3 `socket-server.ts` copies behind one shared module (012's deferred consolidation); (T1) emit `X-Speckit-Probe: liveness` at `launcher-ipc-bridge.cjs:240`, check `request.headers['x-speckit-probe']` in `handleModelServerDemand` before `launch()` (`model-server-supervision.cjs:1216-1218`) → non-spawning liveness reply; consumers don't send it so the lazy-spawn contract holds. Minimal surface: T1 = 2 files; T2 = 2 daemon copies (+ optional shared module). onnxruntime orthogonal. (newInfoRatio 0.5; see `iterations/iteration-004.md`.)

**Iter 5 focus — completeness critic + go/no-go before synthesis.** CRITICAL: read the history/intent of `canUnlinkExistingSocket` — WHY was the gate added (which packet; what security threat: symlinked/foreign-owned socket node, uid/realpath mismatch)? Verify the race-safe fix (ENOENT→reclaim, never-abort) PRESERVES that security intent and does NOT reopen the hole spec-memory's permissive copy may itself be vulnerable to. Then: (a) confirm ALL launcher-internal `probeModelServer` call-sites (`:1055` idle-monitor, `:1163` prepare) carry the marker and NO genuine-consumer path (`hf-local.ts`) sends it; (b) confirm the 3-copy reconvergence has no legitimate per-package divergence (service-specific socket/db paths); (c) edge cases: give-up cooldown × probe-marker, EADDRINUSE path parity, front-proxy-recycle (018) interaction; (d) GO/NO-GO verdict on the unified plan with final per-thread confidence + residual risks. READ-ONLY; propose only.

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

### Prior static investigation (this session, by main agent) — to validate/refine, not assume

**T1 (mechanism confidence ~90%, proven from code):** `probeModelServer` (`.opencode/bin/lib/launcher-ipc-bridge.cjs:230-306`, request built :240, written :269) sends a literal `GET /api/health` over the model-server socket. `prepareModelServerDemandTarget` (`.opencode/bin/lib/model-server-supervision.cjs:1160-1168`) probes any pre-existing socket at boot. `handleModelServerDemand` (`:1204-1238`) spawns on ANY HTTP request when no give-up cooldown is active — `routePath` is used only for the log line; `MODEL_SERVER_DEMAND_STATUS=503`. The idle-monitor (`:1045-1050`) is safe (only probes when a model server already runs). The auto-select cascade short-circuits on a persisted pointer (`shared/embeddings/auto-select.ts:528-545`); advisor `ensureActiveEmbedder` short-circuits on a valid pointer (`system-skill-advisor/.../embedders/schema.ts:223-230`); `embedder_status` only touches hf-local when `effectiveProvider==='hf-local'` (`mcp_server/handlers/embedder-status.ts:62-67`). So with valid Ollama pointers NO embedder path reaches hf-local — only the launcher probe does. Triggering scenario: launcher overlap/hand-off where a new owner probes a still-cold sibling listener.

**T2 (REFRAMED — confidence dropped pending reconciliation):** Initial static read suggested "no front-proxy in the launchers." That was wrong in mechanism: packet `012-daemon-bridge-socket-for-skill-advisor-and-code-index` (2026-05-20, "Implementation + smoke evidence captured") LIFTED the IPC bridge-socket binding from mk-spec-memory's `socket-server.ts` INTO the daemon `.ts` server children (`advisor-server.ts`, code-index `index.ts`, each via `lib/ipc/socket-server.ts`) — NOT the launcher `.cjs` (which is why a launcher grep finds no `createSessionProxy`). So the bridge EXISTS. Yet live `lsof` shows NO listener on `/tmp/mk-code-index/daemon-ipc.sock` and `/tmp/mk-skill-advisor/daemon-ipc.sock`, while `/tmp/mk-spec-memory/daemon-ipc.sock` HAS one. ⇒ T2 is a runtime bind-failure / regression of packet 012, NOT a missing feature. The fix is NOT "port createSessionProxy to the launchers."

### Live runtime evidence (read-only, this session)
- Give-up marker `/tmp/mk-hf-embed/hf-embed-giveup.json`: writtenAt 2026-06-04T15:21:26.973Z, pid 44195, cooldown long expired (stale). `lsof` hf-embed.sock → cold demand listener pid 61625.
- Embedder pointers valid at the 15:21 spawn: memory `vec_metadata` created 2026-06-04 07:01 provider=ollama; advisor 2026-05-21; `nomic-embed-text:v1.5` pulled → `probeOllama` succeeds; advisor `vec_768=22=skill_nodes` (recovered).
- Concurrency: daemon-owner Claude (pid 60494) owns the live trio (code-index 60717 + server child 60718; advisor 61316 + child 61317; spec-memory 61625). A 2nd Claude (8421) + FOUR `codex gpt-5.5 xhigh exec` sessions (62664/65/66/69) each spawned their own launcher; the 4 codex code-index launchers are alive ~49 MB (wedged), not exiting.
- code-index owner lease `.code-graph-owner.json`: pid 60718, lastHeartbeat ≈ now, ttl 60s → daemon alive + heartbeating but NOT serving the bridge socket.

### Grounding specs (read these for design intent)
- `003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/` children 001-013, esp. **010-multi-client-stdio-socket-bridge**, **012-daemon-bridge-socket-for-skill-advisor-and-code-index**, **007-skill-advisor-zombie-launcher-fix**, 013-launcher-lease-acquisition-reclaim, 002-cross-launcher-lease-propagation.
- `003-memory-and-causal-runtime/` siblings: 010-embedding-consolidation-hf-local-server, 018-front-proxy-recycle-hardening, 020-lease-socket-path, 024-launcher-lease-integration-test, 016-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle.
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` + `embedding_resilience.md` (ADR-013 → ADR-014).

### Key source files
- T1: `.opencode/bin/lib/model-server-supervision.cjs`, `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts`, `shared/embeddings/auto-select.ts`, `shared/embeddings/factory.ts`.
- T2: `.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` + `lib/ipc/socket-server.ts`; `.opencode/skills/system-code-graph/mcp_server/index.ts` + `lib/ipc/socket-server.ts`; mk-spec-memory's working `socket-server.ts` (locate under `system-spec-kit/mcp_server/`); the three `*-launcher.cjs`.

### Hard constraints
- READ-ONLY. No code/config mutations. Do NOT curl/connect to `hf-embed.sock` (a request triggers the spawn under study). Do NOT scan the code graph. Quote repo paths. Durable fixes belong in Public source (this IS Public).

### Known context summary
T1 root cause is strong (probe = demand). T2 was misdiagnosed initially; packet 012 already built the daemon bridge, so the real question is why it is not serving at runtime under N-way concurrency. Reconcile both with the 006-mcp-launcher-concurrency design history and produce one unified design-conformance fix plan.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (newInfoRatio, negative-knowledge emphasis)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-06-04T17:40:59Z
