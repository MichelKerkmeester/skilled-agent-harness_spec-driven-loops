# Iteration 5 (FINAL): Completeness critic + GO/NO-GO before synthesis

## Focus
Adversarial completeness pass on the locked unified fix plan (iter-2 T2, iter-3 T1,
iter-4 plan). The make-or-break check: read the FULL body + intent of
`canUnlinkExistingSocket` and the `DR-008-01` hardening, determine WHY the gate exists
(which threat), and VERDICT whether the proposed "race-safe (ENOENT→reclaim, never-abort)"
shape REOPENS that threat — and crucially whether spec-memory's permissive copy (the
proposed target behavior) is ITSELF vulnerable, meaning the gate is a real security
improvement to PRESERVE rather than remove. Then verify: (a) all `probeModelServer`
call-sites + that hf-local consumers don't send the marker; (b) 3-copy reconvergence has
no per-package divergence; (c) edge cases; (d) per-fix GO/NO-GO + final confidence.
READ-ONLY; propose only.

## Actions Taken
1. Read the full failing-copy `socket-server.ts` bind path incl. `canUnlinkExistingSocket`
   body (code-index `:118-131`), the `DR-008-01` dir-ownership block (`:173-188`), and the
   EADDRINUSE reclaim arm (`:235-254`).
2. Read the WORKING spec-memory copy's full bind path (`:122-249`): the mkdir (`:129-131`),
   the EADDRINUSE arm (`:177-208`), and the close()/unlink teardown (`:222-248`) — to test
   whether the permissive target is secure.
3. Grepped ALL `probeModelServer(` call-sites (`model-server-supervision.cjs` :1055, :1163;
   `launcher-ipc-bridge.cjs` :230 def) and the hf-local consumer's header build
   (`hf-local.ts` `nodeHttpTransport` :402-413, GET `/api/health` :712, POST `/api/embed` :835).
4. Greped the 006-mcp-launcher-concurrency arc for `DR-008` / `canUnlinkExistingSocket` /
   `attacker-planted` / `group/world-writable` provenance (empty → gate is code-only, never
   spec'd: confirms iter-2 F6 / iter-4 F3 "post-012 drift").
5. Cross-checked the advisor copy parity (`canUnlinkExistingSocket` :131-141, `lstatSync`
   :136 no-ENOENT, dir block :191-200, `throw err` :253/:256) and the per-package env /
   `SOCKET_FILE_NAME` / `allowedSocketRoots` divergence across all three copies.

## Findings (file:line evidence + confidence)

**F1 — SECURITY VERDICT (make-or-break): the gate is a REAL, additive security control, and
spec-memory's permissive copy is ITSELF VULNERABLE. The fix shape (race-safe, PRESERVE the
gate) is correct; a fix that merely copies spec-memory's permissiveness would be a
REGRESSION. [confidence: HIGH]**
- WHY the gate exists — stated verbatim in the code (`DR-008-01`, code-index
  `socket-server.ts:173-175`): "`mode: 0o700` only applies when mkdir CREATES the dir. A
  pre-existing socket dir (e.g. an **attacker-planted /tmp/mk-code-index on a shared host**)
  is not protected by the mkdir above, so refuse to bind under a dir not owned by us or that
  is group/world-writable." Threat = on a multi-user/shared host, a hostile local user
  pre-creates `/tmp/mk-<svc>/` (or plants a socket node) so our daemon binds/serves under an
  attacker-controlled path, or we blindly `unlinkSync` + rebind over a foreign node. The two
  guards implement this: dir-ownership/mode check (`:176-188`) and the per-socket
  `canUnlinkExistingSocket` owner-fence (`:118-131`: parent realpath in allowlist `:119-121`,
  `isSocket()` `:123-125`, **uid == our uid** `:127-128`) gating the EADDRINUSE unlink
  (`:242-243`).
- spec-memory's "permissive" copy is the OLDER, UN-hardened one and IS vulnerable to exactly
  this: mkdir is `mode:0o700` only (`:129-131`) with NO `statSync` ownership/mode post-check,
  and on EADDRINUSE it goes straight to unconditional `fs.unlinkSync(socketPath)` + rebind
  (`:198-207`) with NO `isSocket`/uid/realpath fence. So it will unlink and rebind over a
  foreign-owned or symlinked node planted at `/tmp/mk-spec-memory/daemon-ipc.sock`.
- THEREFORE: the asymmetry iter-2 found (permissive = working) is a *correctness/race*
  asymmetry, NOT a security one. The gate is a genuine improvement. The plan's chosen shape —
  **keep the ownership/realpath intent but make it race-safe and non-aborting**, do NOT drop
  to spec-memory's behavior (iter-4 F5/risk note "don't drop the security intent, just don't
  let it abort the bind") — is CORRECT and security-preserving. The reconvergence must move
  spec-memory UP to the hardened-but-race-safe contract, not move the others DOWN. This is the
  single most important correction the critic pass confirms.

**F2 — The "race-safe" reshape does NOT reopen the hole, IF done as specified. [confidence: HIGH]**
- The hole is reopened only if the uid/realpath/isSocket checks are *removed* or made to
  default-allow on error. The plan instead: ENOENT on `lstatSync` (`:123`) → treat as
  *reclaimable* (the node already vanished — there is nothing to hijack, so reclaiming is
  safe AND race-correct); uid mismatch / non-socket / parent-not-in-allowlist → still
  REFUSE the unlink (security preserved) but **degrade to a clean non-aborting return / defer
  the bridge** instead of `throw err` (`:242-243`) which currently crashes the bind path. Key
  distinction the synthesis must encode: *refuse-to-unlink-a-foreign-node* (keep) vs
  *abort-the-whole-bind-on-a-benign-stale-socket-or-TOCTOU* (the bug). A foreign-owned node
  should make us decline to reclaim (and ideally pick an alternate path or report), NOT make
  us unlink it, and NOT crash. So race-safe ≠ permissive. No reopening.
- One residual nuance for the fix packet: when the gate legitimately refuses (genuine
  foreign/world-writable dir), the bridge SHOULD end up disabled-but-daemon-alive (a security
  stance), which on a *non-attacked* host must never trigger — hence the ENOENT→reclaim and
  best-effort realpath handling so the common stale-socket case always reclaims.

**F3 — T1 marker discriminator is sound: exactly 2 internal probe call-sites, single emit
point covers both, and consumers provably don't send the header. [confidence: HIGH]**
- `probeModelServer(` call-sites: `model-server-supervision.cjs:1055` (idle-monitor tick) and
  `:1163` (`prepareModelServerDemandTarget` boot probe). BOTH go through `probeModelServer`
  (`launcher-ipc-bridge.cjs:230`), which builds the single request literal at `:240`. So
  adding `X-Speckit-Probe: liveness` to that ONE string (iter-4 F4) marks BOTH internal
  probes — no call-site can be missed (mitigates iter-4's "forgetting a call-site" risk).
- Genuine consumer path: hf-local `nodeHttpTransport` (`hf-local.ts:402-413`) sets headers to
  ONLY `content-type`/`content-length`, and ONLY when there is a request body
  (`requestBody === undefined ? undefined : {...}` :407-412). The wake GET `/api/health`
  (`:712`) passes `undefined` body → `headers: undefined` → it sends NO custom headers, so it
  carries NO `x-speckit-probe` and still falls through to `launch()`. POST `/api/embed`
  (`:835`) likewise sets no probe marker. ⇒ the lazy-spawn wake contract (iter-3 F4 / iter-4
  F1) is preserved; only the launcher's internal liveness probe is made non-spawning.
- Round-trip: `handleModelServerDemand(request,response)` reads `request.headers`
  (Node `http` server lowercases `X-Speckit-Probe` → `x-speckit-probe`) from the raw bytes the
  launcher writes; the header survives the UDS HTTP/1.1 write+parse. Confirmed structurally by
  iter-4 F4 + the consumer-header read above.

**F4 — 3-copy reconvergence is SAFE: no legitimate per-package divergence beyond comments.
[confidence: HIGH]**
- All three copies share identical `SOCKET_FILE_NAME = 'daemon-ipc.sock'` (code-index :14,
  advisor :13, spec-memory :12), identical env names (`SPECKIT_IPC_SOCKET_DIR`,
  `SPECKIT_MAX_SECONDARY_CLIENTS`), and identical `allowedSocketRoots()` (cwd + tmpdir + /tmp).
  Service-specific socket/db paths come from the CALLER (each daemon passes its own `dbDir` /
  `socketPath` into `startIpcSocketServer`), NOT from the module — so one shared module
  parameterized on `socketPath` already abstracts the only real difference.
- The only drift between the two hardened copies is cosmetic: a helper-name difference
  (`isWithinWorkspace` code-index :102 vs `isWithinRoot` advisor :111) and one comment line.
  Spec-memory is missing the whole hardening block. ⇒ a single shared module is feasible with
  no behavioral loss; 012's deferred consolidation (`012/spec.md:168`) remains the durable
  fix; the back-port stopgap (identical race-safe guard in all 3) is the low-risk interim.
- 012's OPEN QUESTION on consolidation is real and still open (iter-4 F3); the fix packet
  should add a drift-detection diff check regardless of which path it picks, so the
  bind/EADDRINUSE/teardown + security contract cannot silently diverge a third time.

**F5 — Gate provenance: the security hardening is code-only, never captured in a 006-arc spec
(confirms post-012 drift). [confidence: HIGH]**
- Grep of the entire 006-mcp-launcher-concurrency arc for `DR-008` / `canUnlinkExistingSocket`
  / `attacker-planted` / `group/world-writable` returned EMPTY. The gate exists only as the
  `DR-008-01` code comment + impl, added after 012's verbatim permissive copy and never
  back-ported to spec-memory or written into 006/012 specs. This is exactly iter-2 F6 /
  iter-4 F3 ("post-012 drift, 012 D-001 warned"). Implication for synthesis: the fix packet
  must DOCUMENT the security intent (currently undocumented outside one code comment) when it
  reconverges — otherwise the next refactor may delete it as "spec-memory doesn't have it."

**F6 — Edge cases / residual risks audited. [confidence: HIGH for the enumerations]**
- **give-up cooldown × probe-marker:** `handleModelServerDemand` already short-circuits to a
  non-spawning 503 when the crash-loop cooldown is active (iter-3/iter-4: cooldown guard before
  `launch()` at ~:1197-1218). The marker adds an ORTHOGONAL earlier non-spawning branch (probe
  → liveness reply). They don't conflict: cooldown = "broken, backing off"; marker = "this is
  a probe, never demand." Both end without `launch()`. No interaction hazard. The marker
  actually REDUCES give-up churn because the spurious overlap-spawn (the thing that arms the
  cooldown, iter-4 symptom mapping) stops happening.
- **EADDRINUSE path parity:** the tcp branch differs across copies (spec-memory has a
  `retryTcpListenAfterEaddrInUse` + graceful "bridge disabled" return `:181-195`; the failing
  copies just `throw err` for tcp `:239`). The fix targets the UNIX-socket arm (the live
  failure). The fix packet should also bring the unix-socket arm to the same graceful
  "degrade, never throw" stance the tcp arm already models in spec-memory — i.e. the
  permissive copy ALREADY proves "degrade-not-throw" is acceptable for the bridge.
- **front-proxy-recycle (018) rebind:** 018 hardened only spec-memory's launcher (recycle
  hang) and DEFERRED storing the owner's real socket path in the lease ((c), `018/spec.md:76`).
  That deferral feeds T2's realpath/`/tmp`→`/private/tmp` divergence (iter-2 F2). 018's recycle
  rebinds spec-memory, which (being permissive) always reclaims — so 018 never exercised the
  code-index/advisor gate. No conflict; landing 018(c) is an optional reinforcement that
  removes one input to the realpath refusal.
- **T2-alone vs T1-alone partial failure:** they are INDEPENDENT seams on different sockets
  (T2 = daemon `daemon-ipc.sock` bind; T1 = launcher `hf-embed.sock` demand probe). Shipping
  ONLY T2 fixes the active mk_code_index/mk_skill_advisor wedge (highest user impact) and
  leaves T1's spurious hf-local spawn/give-up churn (cosmetic on this Ollama host, real on a
  host that overlaps launchers). Shipping ONLY T1 stops the spurious spawn but leaves the
  secondaries wedged. No shared code, so no half-fix hazard — but T2-first is the correct
  order (active wedge). Neither fix depends on the other.
- **onnxruntime orthogonality:** re-affirmed NON-GOAL (strategy §4). The
  `onnxruntime-common` topology break is portability-only (matters on non-Ollama hosts); both
  T1 and T2 are launcher-overlap/concurrency seams independent of the embedder backend. No
  code overlap with either fix.

**RULED OUT this iteration:**
- "Make `canUnlinkExistingSocket` permissive (copy spec-memory)" as the T2 fix — RULED OUT:
  spec-memory is the *un-hardened* copy and is vulnerable to the DR-008-01 attacker-planted-dir
  /foreign-socket threat (F1). Removing the gate would be a security regression. Correct shape =
  preserve the ownership/realpath INTENT, make it race-safe + non-aborting (F2).
- "A probe call-site might be missed by the marker" — RULED OUT: single emit point at
  `launcher-ipc-bridge.cjs:240` covers both call-sites (:1055, :1163) (F3).
- "Per-package divergence blocks a shared module" — RULED OUT: only cosmetic helper-name /
  comment drift; service paths are caller-supplied (F4).

## GO / NO-GO VERDICT

- **T2 (race-safe `canUnlinkExistingSocket` + reconverge 3 copies): GO-WITH-CONDITIONS,
  confidence HIGH.** Conditions: (1) PRESERVE the ownership/realpath/isSocket security intent —
  do NOT drop to spec-memory's permissive behavior; reconverge spec-memory UP to the hardened
  contract, not the others down. (2) Race-safe means ENOENT→reclaim and "refuse-to-unlink but
  degrade-don't-throw" on a foreign/benign-stale node — never `throw err` to abort the bind.
  (3) Document the DR-008-01 security intent in the reconverged module (currently code-comment
  only, F5). (4) Add the N-way EADDRINUSE+TOCTOU regression test 012/024 never had (iter-4).
- **T1 (probe-marker header): GO, confidence HIGH.** Single emit point covers both internal
  probes; consumers provably don't send it (F3); no interaction with cooldown (F6). Lowest
  risk in the plan. Optional boot-probe-deferral is belt-and-suspenders, not required.
- **Prioritized ordering:** T2 FIRST (active, repeatable mk_code_index/mk_skill_advisor wedge,
  highest user impact), then T1 (stops spurious hf-local spawn / give-up churn). Independent
  seams — order is by impact, not dependency.
- **Plan-breaking gaps found:** NONE. The one material refinement (not a break) is the
  security framing: the locked plan already says "keep the security intent, make it race-safe"
  (iter-4 F5 + risk note), and this pass CONFIRMS that is mandatory because the permissive
  target is itself vulnerable. Synthesis must state this explicitly so the fix packet doesn't
  "simplify" by removing the gate.

## Questions Answered
- **Does the race-safe (ENOENT→reclaim, never-abort) change reopen the DR-008-01 hole?** NO
  (F2) — provided the uid/realpath/isSocket *refusal* semantics are kept and only the
  abort-the-bind / TOCTOU-throw behavior is removed. Race-safe ≠ permissive.
- **Is spec-memory's permissive copy itself vulnerable (i.e. is the gate a real improvement to
  PRESERVE)?** YES (F1) — spec-memory has no dir-ownership check and unconditionally unlinks on
  EADDRINUSE, so it is vulnerable to the attacker-planted-dir / foreign-socket threat. The gate
  is a genuine security improvement; reconvergence must level UP, not down.
- **Do all `probeModelServer` call-sites carry the marker and do consumers avoid it?** YES (F3)
  — 2 call-sites, single emit point; hf-local consumer sends no custom header on the wake-GET.
- **Is 3-copy reconvergence safe (no legit per-package divergence)?** YES (F4) — only cosmetic
  drift; caller-supplied paths.
- **Edge cases (cooldown, EADDRINUSE parity, 018 recycle, partial T1/T2, onnxruntime)?**
  ANSWERED (F6) — no blockers; T2-first ordering; onnxruntime orthogonal.

## Questions Remaining
- (Fix-packet decisions, not research) shared-module packaging vs back-port-stopgap (012
  deferred for build complexity); whether to also land 018(c) socket-path-in-lease; whether the
  optional T1 boot-probe-deferral is worth the branch.
- A live captured `[ipc-bridge]` stderr of an N-way EADDRINUSE abort would upgrade T2 from
  structural+live-state proof to a captured repro — useful as the regression-test seed, not
  required to ship (mechanism is locked).
- (Hardening follow-up) what the gate should DO when it legitimately refuses a foreign node:
  decline-and-disable-bridge vs pick-alternate-path — a security-design choice for the fix packet.

## Next Focus
Research is COMPLETE (5/5, both threads LOCKED, plan stress-tested, GO/GO-WITH-CONDITIONS).
Hand to SYNTHESIS (`research.md`): write up T1 + T2 root causes, the unified design-conformance
fix plan, the security-preserving T2 condition (level UP to hardened-race-safe, do NOT remove
the gate; document DR-008-01 intent), the T2-first ordering, and the residual fix-packet
decisions. Then memory save. No further research iteration needed — READY FOR SYNTHESIS.
