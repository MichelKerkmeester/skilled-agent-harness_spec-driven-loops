# Iteration 4: Cross-cutting reconciliation + the UNIFIED design-conformance fix plan

## Focus
Both root causes are LOCKED (T1 iter-3 HIGH; T2 iter-2 HIGH). This iteration does NOT
re-litigate them. It (a) reconciles each against the original launcher-concurrency /
embedding-consolidation design history to decide whether T1 is a *known* gap or net-new,
(b) pins the EXACT fix surface (file:line) for each thread, and (c) assembles ONE ordered,
design-conformant fix PLAN with test strategy, risk, and user-symptom mapping. READ-ONLY;
propose only. (Note: the brief's `006-mcp-launcher-concurrency` path is stale — the arc
physically lives at `003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/`,
and the hf-local model-server design lives at `003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server/`.
Located both before reconciling.)

## Actions Taken
1. Re-read iter-2 (T2 LOCKED) and iter-3 (T1 CONFIRMED) for the locked evidence + open discriminator question.
2. Located the real arc paths (`find -type d`) since the brief's `006-mcp-launcher-concurrency`
   path was stale; grepped the 006 arc + the 010 embedding-consolidation arc for any prior mention
   of probe-triggers-spawn, probe-vs-demand, an allowlist, a probe-marker, or a "tiny request listener".
3. Read the design-intent source for T1's spawn behavior: `010/004-launcher-supervision/spec.md`
   (REQ-001/REQ-006, open question :170) and `004-launcher-supervision/implementation-summary.md:50`.
4. Read 012's drift + consolidation decisions: `012/spec.md:158,160,168` and `012/implementation-summary.md:164-178,238`;
   checked `024-launcher-lease-integration-test/spec.md` for N-way coverage.
5. Pinned the two T1 fix anchors verbatim: `launcher-ipc-bridge.cjs:240` (the probe request string)
   and `model-server-supervision.cjs:1204-1238` (`handleModelServerDemand`, pre-`launch()` at :1216-1218).

## Findings (file:line evidence + confidence)

**F1 — T1 is a KNOWN-MECHANISM / UNTESTED-FAILURE-MODE gap, not net-new behavior — but the
overlap-spawn it produces was never anticipated. [confidence: HIGH]**
- The spawn-on-`GET /api/health` is BY DESIGN. `010/004-launcher-supervision/implementation-summary.md:50`:
  "the launcher binds a tiny demand listener on the embed UDS; the daemon-side hf-local client's first
  `/api/health` hits it, which spawns the model server (via `launchModelServer`) and replies 503-loading".
  REQ-001 (`004/spec.md:126`): "Read-only sessions do not spawn it; first embed demand spawns a sibling child".
  So "a GET to the cold demand listener spawns" is the intended lazy-spawn trigger — iter-3 F1 is the code
  faithfully implementing this.
- What was NEVER designed-for: the *launcher's own internal liveness probe* (`probeModelServer`, added
  "as a separate function from `probeDaemon`", `004/implementation-summary.md:50`) landing on a *sibling
  launcher's* cold demand listener under OVERLAP and being read as that demand (iter-3 F3). The design
  treats `probeModelServer` purely as a liveness READ (REQ-006 `004/spec.md:131`: "probeModelServer returns
  alive for health ready or loading"), yet the demand handler cannot distinguish it from a consumer's wake-GET.
- The discriminator was an OPEN QUESTION at design time and never resolved: `004/spec.md:170` —
  "Should first-embed demand signal the launcher through an existing lease/state channel or a tiny request
  listener?" They shipped the request-listener and never added a probe-vs-demand marker. ⇒ T1 = a known,
  documented-as-open design seam, surfaced as a real bug only under N-way launcher overlap. NOT a regression
  of a specific packet; an unclosed design question.

**F2 — No packet in the 006 arc or 010 arc ever mentions a probe-marker header, an allowlist, or
"probe ≠ demand". [confidence: HIGH]**
- Grep across both arcs for `allowlist | non-spawn | probe.*not.*spawn | X-Speckit-Probe | liveness read |
  any request | route.*log` returned only the 008-launcher-race-window debug-log-hygiene packet (unrelated:
  `MK_SKILL_ADVISOR_DEBUG` log routing, `008/spec.md:75,97`) — nothing about discriminating the probe from a
  demand. So the probe-marker-header fix is net-new design work; it has no prior art to back-port or conflict with.

**F3 — T2's N-way-primary failure was explicitly ASSUMED AWAY at design time; reconvergence is a
DEFERRED open question. [confidence: HIGH]**
- 012 `spec.md:158` Risk row: "Two skill-advisor daemons race-bind the same socket on cold start /
  EADDRINUSE / `socket-server.ts:148-162` already handles EADDRINUSE by `fs.unlinkSync` + retry. **Lease-based
  single-writer (006 arc invariant) prevents legitimate concurrent primaries; only stale-socket case is real.**"
  That assumption is exactly what iter-2 invalidated: under real N-way overlap there ARE two owner-eligible
  primaries racing the bind, and the LATER-added `canUnlinkExistingSocket` gate (not present when 012 wrote that
  row) turns the loser's EADDRINUSE into a hard abort.
- 012 shipped a VERBATIM permissive copy (`012/implementation-summary.md:104,164-166`; `spec.md:78`) — the
  race-introducing guard is post-012 drift exactly as 012's own dependency row warned (`012/spec.md:160`:
  "`socket-server.ts` is now duplicated across 3 packages / Drift if spec-memory's implementation evolves but
  the copies don't").
- Consolidation is an explicit DEFERRED open question: `012/spec.md:168` — "Should we consolidate the three
  `socket-server.ts` copies into a shared `system-spec-kit/shared/ipc/` module? **DEFERRED** ... reconsider if
  drift becomes a real problem." Drift is now a real problem (iter-2). `012/implementation-summary.md:238`
  repeats it.
- 024-launcher-lease-integration-test covers the bridge/lease handshake but NOT N-way EADDRINUSE bind survival
  (`024/spec.md:88,148` assert socketPath/bridging + the no-bridge-socket report path; no two-primary bind race).
  So the failing scenario is genuinely untested.

**F4 — EXACT T1 fix surface, pinned. [confidence: HIGH]**
- EMIT (add marker): `launcher-ipc-bridge.cjs:240` — the probe request literal
  `GET ${MODEL_SERVER_HEALTH_PATH} HTTP/1.1\r\nHost: localhost\r\nAccept: application/json\r\nConnection: close\r\n\r\n`.
  Insert a dedicated header line (e.g. `X-Speckit-Probe: liveness\r\n`) into THIS string only. This function is
  the launcher's internal probe (`probeModelServer`, :230), used by the boot probe and the idle tick — NOT by
  any consumer. Written on connect at :269.
- CHECK (gate the spawn): `model-server-supervision.cjs:1204-1238` (`handleModelServerDemand`). The spawn is
  unconditional after the cooldown guard: `releaseModelServerDemandListenerForSpawn(...)` + `getSupervisor().launch()`
  at :1217-1218. Add a marker read at/just before :1216: if `request.headers['x-speckit-probe']` is set, reply a
  non-spawning liveness response (reuse `writeDemandResponse(response, MODEL_SERVER_DEMAND_STATUS, {state:'loading',
  modelServerLaunchRequested:false, ...})` shape, :1233-1237) and `return` WITHOUT calling `launch()`. Node lowercases
  header names, so the launcher's `X-Speckit-Probe` arrives as `x-speckit-probe`.
- Round-trip safety: `handleModelServerDemand(request, response)` is a Node `http` request handler; `request.headers`
  is populated from the raw bytes `probeModelServer` writes over the UDS — the header survives. Genuine consumers
  (`hf-local.ts` `requestJson` GET `/api/health` :712 and POST `/api/embed` :835, iter-3 F4) do NOT set this header,
  so their wake-GET still falls through to `launch()` — the lazy-spawn contract (F1) is preserved for real hf-local hosts.
- Optional defense-in-depth: `prepareModelServerDemandTarget` (`model-server-supervision.cjs:1160-1201`) at boot
  probes a pre-existing socket (:1163). It could additionally DEFER (skip the probe / treat as alive) when the
  respawn-lock is held by a live sibling, so the boot probe never even reaches a sibling's cold listener. Lower
  priority than the marker — the marker alone closes the overlap-spawn.

**F5 — EXACT T2 fix surface, pinned (carried + sharpened from iter-2). [confidence: HIGH]**
- Make `canUnlinkExistingSocket` race-safe (code-index `socket-server.ts:118-131`; advisor `:131-`):
  wrap `fs.lstatSync(socketPath)` (:123, no ENOENT guard) so ENOENT → "reclaimable" (a vanished socket is the
  benign case, not an error); treat the `isWithinAllowedSocketRoot` / uid / realpath checks (:119-128) as
  best-effort under the workspace+tmp allowlist — degrade to reclaim-and-retry, NEVER `throw err` (:242-243 /
  advisor :255-256) which aborts the bind. Target behavior = spec-memory's permissive branch
  (`system-spec-kit/mcp_server/lib/ipc/socket-server.ts:196-207`), which always reclaims and is why it survives.
- Also soften the dir-ownership `statSync` throw block (code-index `:171-188`; iter-2 F3): uid/mode mismatch on a
  pre-existing `/tmp/mk-*` dir should not hard-abort the bind.
- Reconverge the three copies behind ONE shared module (012 `spec.md:168` deferred consolidation): the race-safe
  bind/EADDRINUSE/teardown contract + security hardening live ONCE so they cannot drift again. This is the durable
  form; a stopgap is back-porting the race-safe guard to all three identically.
- Surface is the bridge/socket-server layer + the two daemon copies, NOT the launchers (iter-2 F5: secondaries
  bridge/report, they never bind; the racer is a second primary).
- Optional: land 018's deferred (c) (store the owner's actual socket path in the lease) to remove the
  `SPECKIT_IPC_SOCKET_DIR` `/tmp`→`/private/tmp` canonicalization divergence that feeds the realpath refusal (iter-2 F2).

---

## UNIFIED DESIGN-CONFORMANCE FIX PLAN (PROPOSAL — do NOT implement)

**Shared root invariant:** both T1 and T2 are launcher-OVERLAP-under-N-way-concurrency consequences of design
decisions that assumed a single active primary. T1: a launcher's internal liveness probe lands on a *sibling's*
cold demand listener and is misread as demand → spurious spawn. T2: two owner-eligible primaries race the daemon
socket bind and the loser's non-race-safe reclaim gate aborts → orphaned inode, no listener. Neither is the
`onnxruntime-common` topology break (orthogonal; portability-only, matters only on non-Ollama hosts — this host
uses Ollama; NON-GOAL per strategy §4).

### Ordered fix steps (minimal surface)

**Step 1 — T2 first (it is the active, repeatable wedge; highest user impact).**
1a. Make the socket-reclaim path race-safe in the two drifted copies: `canUnlinkExistingSocket`
    (code-index `socket-server.ts:118-131`, advisor `:131-`) — ENOENT→reclaimable; allowlist/uid/realpath →
    best-effort, never abort. Soften the dir-ownership `statSync` block (code-index `:171-188`). Bind degrades to
    reclaim-and-retry (spec-memory `:196-207`), never `throw err`.
1b. Reconverge all three `socket-server.ts` copies behind one shared `system-spec-kit/shared/ipc/` module
    (012 `spec.md:168`). Stopgap if shared-module packaging is too heavy this pass: back-port the identical
    race-safe guard to all three copies + add a drift-detection diff check.

**Step 2 — T1 (closes the spurious-spawn / give-up churn seam).**
2a. Add `X-Speckit-Probe: liveness` to the launcher probe request at `launcher-ipc-bridge.cjs:240` only.
2b. In `handleModelServerDemand` (`model-server-supervision.cjs:1204-1238`), read `request.headers['x-speckit-probe']`
    before :1216; when present, return a non-spawning liveness reply and `return` before `launch()` (:1217-1218).
    Consumer wake (GET `/api/health` + POST `/api/embed`) is unaffected (no marker).
2c. (Optional defense-in-depth) `prepareModelServerDemandTarget` (:1160-1201): defer/skip the boot probe when a
    live sibling holds the respawn-lock.

### Verification / test strategy
- **T2 — deterministic N-way concurrency test (the gap 012/024 never covered, F3):** spawn N≥3 owner-eligible
  daemon `startIpcSocketServer` attempts against the SAME `/tmp/mk-<svc>/daemon-ipc.sock` (inject the socket dir),
  force EADDRINUSE + a racing unlink (simulate TOCTOU at :123), assert: exactly one listener ends up bound, the
  losers reclaim-and-rebind or cleanly defer (NEVER `throw`), and no orphaned inode without an `lsof` holder
  remains. Run it against all reconverged copies. Add to the 024 integration suite.
- **T1 — probe-no-spawn assertion:** unit-test `handleModelServerDemand` with a request carrying
  `x-speckit-probe: liveness` → assert `getSupervisor().launch()` is NOT called and a liveness reply is returned;
  and WITHOUT the header (consumer wake) → assert `launch()` IS called (preserves F1/iter-3 F4). Optionally an
  integration assertion that `probeModelServer` against a cold sibling demand listener does not emit the
  "spawning launcher-owned sibling" stderr line (:1216).

### Risk assessment (per fix)
- **T2 race-safe guard [LOW risk]:** strictly loosens an over-strict gate toward the proven spec-memory behavior;
  the worst case is reclaiming a stale socket that the permissive copy already reclaims today. Keep the
  ownership/allowlist checks as best-effort (don't drop the security intent, just don't let it abort the bind).
- **T2 reconvergence [MEDIUM risk]:** shared-module packaging across 3 independent npm dist trees adds
  build-system surface (the exact reason 012 deferred it, `012/implementation-summary.md:166`). Mitigate with the
  back-port-stopgap + drift check if shared packaging is out of scope for the fix packet.
- **T1 probe marker [LOW risk]:** additive header on a launcher-internal request + one early-return branch; cannot
  affect consumers (they don't send it). Main risk is forgetting a probe call-site — mitigate by setting the
  header inside `probeModelServer` itself (single emit point at :240), not at each caller.
- **T1 defense-in-depth [LOW-MEDIUM]:** deferring the boot probe on a sibling-held lock must not deadlock a
  genuine cold start; gate it on "lock held by a *live* sibling pid" only.

### Mapping to user-visible symptoms
- **T1 → give-up-marker churn / spurious crash-loop:** the spurious spawn of the broken-on-this-host model server
  writes `/tmp/mk-hf-embed/hf-embed-giveup.json` (strategy §12 live evidence: writtenAt 15:21:26, pid 44195) and
  arms the crash-loop cooldown (:1197-1199) — visible as repeated give-up churn / a "spurious crash-loop" the
  operator never asked for, on a host that doesn't even use hf-local.
- **T2 → wedged secondary launchers + mk_code_index / mk_skill_advisor "disconnect":** the orphaned inode with no
  listener means secondaries can't bridge → the ~49 MB wedged codex code-index launchers (strategy §12) and the
  user-reported MCP disconnects for `mk_code_index` + `mk_skill_advisor` while `mk-spec-memory` (permissive copy)
  stays connected.

---

## Questions Answered
- **Is T1 known or net-new?** ANSWERED HIGH: the spawn-on-health-GET is BY DESIGN (`004/implementation-summary.md:50`,
  REQ-001 `004/spec.md:126`); the probe-vs-demand discriminator was a documented OPEN QUESTION (`004/spec.md:170`)
  that was never closed. So T1 is a known-but-untested design SEAM (overlap-spawn), not a regression and not novel
  behavior. No prior packet proposes a probe-marker (F2).
- **Cross-cutting unified surface (KQ5):** ANSWERED. T1 = probe-marker header (emit `launcher-ipc-bridge.cjs:240`,
  check `model-server-supervision.cjs:1216`); T2 = race-safe `canUnlinkExistingSocket` reclaim + reconverge 3
  copies. Shared invariant: single-active-primary assumption broken under N-way overlap. Minimal surface = 2 files
  for T1 + 2 daemon copies (+ optional shared module) for T2.
- **T2-design reconciliation (KQ4):** ANSWERED HIGH: 012 explicitly assumed lease-single-writer prevents
  concurrent primaries (`012/spec.md:158`) and DEFERRED consolidation (`:168`); 024 never tests N-way bind
  survival — the failure is a designed-away + untested case, not a missing feature.

## Questions Remaining
- Exact packaging of the T2 shared module vs the back-port stopgap (build-system decision for the FIX packet,
  not this research) — 012 deferred it for build-complexity reasons; the fix packet must pick one.
- Whether the optional T1 defense-in-depth (boot-probe deferral on a sibling-held lock) is worth the added
  branch once the marker lands (the marker alone closes the overlap-spawn; the deferral is belt-and-suspenders).
- Direct stderr/`[ipc-bridge]` capture of a live N-way EADDRINUSE abort would upgrade T2 from
  structural+live-state proof to a captured repro — not required to lock the mechanism, useful for the fix-packet
  regression test seed.

## Next Focus
Iteration 5 (FINAL before synthesis): **completeness critic / gap audit + verification of the unified plan.**
Adversarially check the plan for: (1) any consumer or internal call-site of `probeModelServer` / the demand
listener that the marker would mis-handle (does the idle-monitor tick or any test harness send `/api/health`
without the marker and expect non-spawn, or with it and expect spawn?); (2) whether making
`canUnlinkExistingSocket` permissive re-opens any security concern 012's hardening was meant to close (uid/world-
writable socket hijack) and how to keep that intent while being race-safe; (3) whether the three-copy
reconvergence has any per-package divergence (env names, allowlist roots) that a single shared module would break;
(4) confirm onnxruntime-common is fully orthogonal and out of scope. Produce a go/no-go completeness verdict and a
short residual-risk list so synthesis (research.md) can finalize. READ-ONLY.
