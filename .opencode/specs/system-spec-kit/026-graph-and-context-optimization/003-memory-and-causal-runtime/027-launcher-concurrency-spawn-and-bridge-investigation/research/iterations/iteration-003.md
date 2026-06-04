# Iteration 3: T1 — Validate probe=demand spawn + nail the fix-conformance constraint

## Focus
Pivot from T2 (LOCKED iter-2) to **T1**. VALIDATE/REFUTE with file:line evidence that the hf-local model server is spawned by a boot-time launcher LIVENESS PROBE (`GET /api/health`), not by any embedder/pointer path — and answer the KEY fix-conformance question: does `HfLocalProvider`'s REAL embed path call `GET /api/health` to WAKE the server before embedding? That decides whether "make `/api/health` non-spawning" is a safe fix or would break genuine hf-local hosts. Reconcile with ADR-014 design intent. READ-ONLY; no contact with `hf-embed.sock`. (T2 NOT re-investigated.)

## Actions Taken
1. Read the probe→demand→spawn chain: `model-server-supervision.cjs:1149-1238` (`prepareModelServerDemandTarget` boot probe + `handleModelServerDemand`) and `launcher-ipc-bridge.cjs:230-306` (`probeModelServer`).
2. Confirmed the `GET /api/health` literal and its constant: `launcher-ipc-bridge.cjs:13` (`MODEL_SERVER_HEALTH_PATH = '/api/health'`) + `:240` (request line built).
3. Verified the idle-monitor is spawn-safe: `model-server-supervision.cjs:1045-1090` (`tickIdleMonitor` only probes when `getPid()` already records a live resident; never calls `launch()`).
4. **KEY fix-conformance read:** `shared/embeddings/providers/hf-local.ts` — traced the real embed path `embedPrepared` (:812-875) → `waitForReady` (:718-785) → `healthOnce` (:711-716) and the embed POST (:835).
5. Grounded design intent in ADR-014: `references/memory/embedding_resilience.md:28-58` and `references/memory/embedder_architecture.md:47-58, 182` (lazy/cold sidecar; `/api/health` as selection probe). (010-embedding-consolidation packet dir is not physically present under this arc — renumbered/consolidated; the canonical ADR-014 docs are the authoritative substitute.)

## Findings (file:line evidence + confidence)

**F1 — T1 CONFIRMED: `handleModelServerDemand` spawns on ANY HTTP request; the route/method is log-only. [confidence: HIGH]**
- `handleModelServerDemand` (`model-server-supervision.cjs:1204-1238`) computes `routePath` (`:1205`) but uses it ONLY in the two `logger(...)` lines (`:1208`, `:1216`). There is NO allowlist, NO `if (routePath === '/api/health') return`, NO method check. After the give-up-cooldown guard (`:1206-1215`), every request falls through to `releaseModelServerDemandListenerForSpawn(...)` + `getSupervisor().launch()` (`:1217-1218`). So a `GET /api/health` to a cold demand listener spawns the server. `MODEL_SERVER_DEMAND_STATUS` is the 503 reply (`:1209`, `:1233`).
- Predicted stderr line matches the code exactly: `hf-model-server demand received GET /api/health; spawning launcher-owned sibling` (`:1216`).

**F2 — The probe payload IS a literal `GET /api/health`. [confidence: HIGH]**
- `probeModelServer` builds `GET ${MODEL_SERVER_HEALTH_PATH} HTTP/1.1\r\n...` (`launcher-ipc-bridge.cjs:240`), where `MODEL_SERVER_HEALTH_PATH = '/api/health'` (`:13`), and writes it on socket connect (`:268-270`). This is the exact request that lands on whatever is listening at the socket.

**F3 — Boot probe → demand handoff: the trigger requires launcher OVERLAP. [confidence: HIGH]**
- `prepareModelServerDemandTarget` (`model-server-supervision.cjs:1149-1202`) at boot, if a socket file already exists (`:1160`), probes it via `probeModelServer` (`:1163`). If the probe returns `alive` it backs off (`shouldListen:false`, `:1164-1167`). The dangerous case: the pre-existing socket is owned by a live SIBLING launcher that is itself only running a COLD demand listener (not a real model server). The sibling's demand listener answers the new owner's boot probe by running `handleModelServerDemand` → spawns. So the spawn is caused by the boot-probe GET landing on a sibling's cold demand listener — i.e. it needs two overlapping launchers. A single sequential boot finds no live sibling listener at that socket and does not trip this path. CONFIRMS the strategy §12 "launcher overlap/hand-off" precondition.

**F4 — DECISIVE fix-conformance result: the REAL embed path DOES wake via `GET /api/health` before the embed POST. [confidence: HIGH]**
- Real embed path `embedPrepared` (`hf-local.ts:812-875`): before issuing the embed it calls `await this.waitForReady()` whenever the ready-latch is missing/stale or state≠ready (`:826-833`).
- `waitForReady` (`:718-785`) loops calling `healthOnce` (`:732`), which issues `requestJson('GET', '/api/health', ...)` (`:712`). On a cold server this GET is the FIRST request that reaches the socket.
- The embed itself is `POST /api/embed` (`:835`), issued only AFTER readiness is observed.
- Also `HfLocalProvider.canLoad` (`:586-619`) and `healthCheck` (`:994-1007`) issue `GET /api/health` (`:595`, `:712`). So `/api/health` is the genuine consumer's wake/readiness step.
- **Implication:** "make `/api/health` non-spawning at the demand listener" WOULD break genuine hf-local hosts — a real consumer's readiness GET would hit the cold demand listener and get a 503 forever, never triggering the spawn, so `POST /api/embed` would never get a live server. The probe-vs-demand distinction CANNOT be drawn on the path/method `/api/health` alone.

**F5 — Design-intent reconciliation: ADR-014 treats `/api/health` as a liveness SELECTION probe, and the sidecar/model-server is LAZY/COLD by design. [confidence: HIGH]**
- ADR-014 bootstrap (`embedding_resilience.md:30-33`; `embedder_architecture.md:47-58`): hf-local is chosen when "the Node.js model server answers `/api/health` (ready OR loading both count)". The probe is a READ of liveness for cascade selection — design intent is that a server which *answers* is already alive/booting, supervised by the launcher.
- Lazy/cold intent (`embedder_architecture.md:182`): "Sidecars are lazy: the worker is not forked until the first embedding request"; idle eviction returns memory to the OS. So the design DOES intend on-demand spawn — but tied to a real EMBED demand, not to a bare liveness read. The current code conflates "read liveness (`GET /api/health`)" with "demand a spawn", which is the precise T1 design violation.

**F6 — The pointer/cascade paths do NOT reach hf-local on this Ollama host (re-confirmed from strategy §12, not re-derived).** Only the launcher boot probe contacts the socket; valid Ollama pointers short-circuit auto-select/advisor/embedder-status. So the 15:21 spawn was launcher-probe-driven, consistent with F1–F3. [confidence: HIGH, carried]

**RULED OUT this iteration:**
- "The idle-monitor can spuriously spawn" — RULED OUT: `tickIdleMonitor` (`model-server-supervision.cjs:1045-1090`) early-returns unless `getPid()` is a live resident (`:1049-1050`) and never calls `launch()`; it only reaps/re-arms. Spawn-safe.
- "Making `/api/health` non-spawning is the T1 fix" — RULED OUT by F4: genuine consumers wake via that exact GET; suppressing it breaks real hf-local hosts.

## Questions Answered
- **KQ1 (T1 probe=demand):** CONFIRMED HIGH. `handleModelServerDemand` spawns on ANY request (`:1204-1238`, route/method log-only); the probe sends literal `GET /api/health` (`launcher-ipc-bridge.cjs:13,240`); trigger requires launcher overlap (boot probe lands on a sibling's cold demand listener, `:1160-1167` + F3).
- **KQ2 (T1-fix conformance):** ANSWERED HIGH. The real embed path DOES rely on `GET /api/health` to wake the server (`hf-local.ts:826-833 → 718-785 → 712`, then `POST /api/embed` :835). Therefore the fix must distinguish probe-vs-demand by something OTHER than the `/api/health` path — a dedicated probe marker (header) on the launcher's `probeModelServer` request, so a bare liveness probe does NOT spawn while a genuine consumer's readiness GET (and/or the embed POST) still does.

## Questions Remaining
- The EXACT discriminator design for the unified fix: (a) launcher `probeModelServer` adds a `X-Speckit-Probe: 1` (or similar) header that `handleModelServerDemand` treats as non-spawning read-only; vs (b) only `POST /api/embed` triggers `launch()` and a bare `GET /api/health` to a cold listener returns 503 — but (b) collides with F4 (consumer's pre-embed readiness GET would then never wake a cold server). Leaning (a). Needs iter-4 design pass against the single-resident socket model + 018 recycle semantics.
- Whether `prepareModelServerDemandTarget`'s own boot probe (`:1163`) should be exempted distinctly from a consumer probe (it is launcher-internal, so the same probe-header marker covers it).
- T1↔T2 cross-cutting: both are launcher-OVERLAP consequences (T1: boot probe lands on sibling cold listener; T2: N-way EADDRINUSE bind race). Confirm the minimal unified fix surface.

## Next Focus
Iteration 4: **cross-cutting reconciliation + unified design-conformance fix plan.** Synthesize T1 (probe≠demand: add a launcher-probe marker header so a bare liveness read never spawns, preserving the consumer wake-via-`/api/health` + `POST /api/embed` path — F4/F5) with T2 (race-safe `canUnlinkExistingSocket` reclaim + reconverge the 3 `socket-server.ts` copies — iter-2 LOCKED). Both rooted in launcher overlap under N-way concurrency. Ground the T1 marker design in ADR-014 lazy-sidecar intent and the single-resident socket model; specify the minimal, design-conformant fix surface for each thread and the shared concurrency invariant. Do NOT implement.
