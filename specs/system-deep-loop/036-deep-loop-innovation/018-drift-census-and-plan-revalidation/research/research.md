# Drift Census and Plan Revalidation — Merged Synthesis

> Consolidated across two independent lineages (`sol` = gpt-5.6-sol-fast @ high, `glm` = glm-5.2 @ max),
> 7 iterations each, merged via `fanout-merge.cjs` (2 lineages, 14 key findings).
> Baseline `0ce43ff589` (2026-07-16). Census executed 2026-07-19.

---

<!-- ANCHOR:executive-overview -->
## 1. Headline

**No phase is invalidated. The architecture survives intact. Three phases need refinement by unanimous
agreement; five more need it under the stricter of two defensible drift definitions.**

Both lineages independently reached the same structural conclusion: nothing that landed after the baseline
contradicts the one-architecture spine, and no phase's core purpose has already shipped in full. What changed is
the *starting point* for several phases — shipped substrate now overlaps work the plans describe as greenfield.

| | sol | glm | merged |
|---|---|---|---|
| Invalidated | 0 | 0 | **0** |
| Needs refinement | 8 | 3 | **3 unanimous + 5 disputed** |
| Still valid | 7 | 12 | **7 unanimous** |

<!-- /ANCHOR:executive-overview -->

---

<!-- ANCHOR:investigation-report -->
## 2. Per-phase verdict

| Phase | Merged verdict | Class | Evidence |
|-------|---------------|-------|----------|
| **003** baseline/taxonomy | **REFINE** (unanimous) | First-order, two engines | `cc77a1e550a` renamed `state_format.md`→`state-format.md`, `integration_points.md`→`integration-points.md`, and `behavior_benchmark/`→`behavior-benchmark/` (old glob: zero matches). `7f3216fc502` rebound "033": `003/spec.md:57,119` now points at `033-post-sync-verification-fixes`, a different packet |
| **004** architecture/ledger | **VALID** (unanimous) | — | Locked negative control. Zero `runtime/` citations; all 3 children resolve; no in-range commit touches its surfaces |
| **005** fan-out unblock | **VALID** (unanimous) | — | All cited paths resolve; `fanout-run.cjs:1382-1401` confirms the premise. Typed `liveTools`/`webSearch`/fingerprints remain unshipped |
| **006** ledger core | **REFINE** (sol) / valid (glm) | Second-order | Observability envelopes + status producers are reusable substrate (`observability-events.cjs:89-140`); authoritative replay and fail-closed transition authorization remain absent. One malformed `../../002-` link **predates the baseline** — plan defect, not drift |
| **007** shared services | **REFINE** (sol) / valid (glm) | Second-order | Receipts, caps, gauges, locks, continuity already exist (`receipt-crypto.ts:22-33`). Effect recovery, sealing, blinded adjudication, ledger-fold authority remain |
| **008** compat/shadow/rollback | **VALID** (unanimous) | — | `lifecycle-taxonomy.cjs:24-49` aliases do not satisfy upcasting, dual-read, shadow parity, or rollback drills |
| **009** durable fan-out/fan-in | **VALID** (unanimous) | — | Flat pool + checkpoints + salvage are acknowledged substrate (`fanout-run.cjs:331-411`); ledger envelopes, leases, waves, conditional fan-in remain |
| **010** novelty/claims | **REFINE** (sol) / valid (glm) | Second-order | Graph novelty, claim verification, contradiction density, conflict IDs already ship (`coverage-graph-signals.ts:580-629,715-783`). Semantic communities, durable claim lifecycle, typed focus, atomic projections remain |
| **011** convergence/health | **REFINE** (sol) / valid (glm) | Second-order | **The council-only premise is false** — generic graph-backed convergence already shipped (`convergence.cjs:723-825`). Cycle detection, separate clocks, adaptive allocation, degeneration health remain |
| **012** shared mode contracts | **REFINE** (unanimous) | Second-order | The shared boundary this phase must freeze grew by 5 components: `resourceContractVersion`, `defaultMode: null`, model/skill-benchmark signal restriction, `shared/references/smart_routing.md`, `leaf-manifest.json`. Commits `708d25acf04`, `908efde8d8f`, `6cd8ab14e4e` |
| **013** mode/lane migrations | **REFINE** (unanimous) | Second-order | Mode count **UNCHANGED**. But `defaultMode` flipped research→null, `hub-identity` dropped from all 7 modes, benchmark signals restricted to command-bridge-only. Hits route-gold fixtures and shadow-parity tests, **not** the migration substrate |
| **014** authority cutover | **VALID** (unanimous) | — | Route authority + local rollback are not canonical authority epochs, cutover certificates, or monitored rollback windows |
| **015** legacy retirement | **VALID** (unanimous) | — | Dependencies resolve post-renumber. Transitive dependency on 003's refinement is documented, not blocking |
| **016** whole-system gate | **REFINE** (sol) / valid (glm) | Second-order | Packet-033 evidence survives under archived `z_archive/027`, but executable benchmark paths moved. Five benchmark packages do not independently evidence 7 modes × 8 workstreams, and component checks are not one exact-SHA gate |
| **017** integrate/closeout | **VALID** (unanimous) | — | Inputs resolve; final receipts are future outputs. The live range confirms the recensus need this packet is executing early |

<!-- /ANCHOR:investigation-report -->

---

<!-- ANCHOR:constraints-limitations -->
## 3. Adjudicating the disagreement

The two lineages applied different drift definitions to the same evidence:

- **sol:** shipped capability overlapping a phase's scope moves that phase's *starting point* → refine.
- **glm:** premise intact unless an in-range commit touched the phase's own cited surfaces and the deliverables
  remain unshipped → still valid.

Neither is wrong; they answer different questions. glm answers *"did anything break?"* — sol answers *"would
executing this plan as written still be correct?"*

**Adopt sol's classification as primary, glm's as the conservative floor.** For a plan revalidation, sol's is the
operative question: a phase whose plan says "build X" when X partially exists will rebuild shipped code, which is
exactly the decay this census exists to catch. glm does not dispute that the cited artifacts exist — it classifies
them differently.

**One disputed finding has external corroboration.** sol's phase-011 result — that the council-only premise is
false because generic graph-backed convergence already ships — was independently reached by a separate 242-agent
analysis of this packet on the same day, which found a multi-signal weighted evaluator already serving 3 of 8
modes. That evidence originates outside both lineages, and it favors sol's reading.

---

**Primary sources for the adjudication:**
- Shipped convergence evaluator [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:723-825]
- Shipped receipt primitives [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/receipt-crypto.ts:22-33]
- Shipped graph novelty and claim signals [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts:580-629]
- Shipped observability envelopes [SOURCE: .opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs:89-140]
- Registered-mode ground truth [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:1-22]
- Routing default flip [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4-13]
<!-- /ANCHOR:constraints-limitations -->

---

## 4. Controls

| Control | Required | Result |
|---------|----------|--------|
| Positive — 003 runtime reference paths | Rediscover independently | **PASS**, both lineages, with commit + `path:line` |
| Positive — `behavior_benchmark/` glob | Rediscover zero matches | **PASS**, both lineages |
| Negative — at least one clean phase | Prove the census discriminates | **PASS** — phase 004 locked by both; glm additionally qualified 006 and 007 |

Both controls passing in both lineages means the census detects known-true drift *and* does not flag everything.

---

## 5. Open questions — both resolved

**A. Did the routing commits change the registered-mode count phase 013 assumes? NO.**
At both baseline and HEAD: `mode-registry.json` `modes` = 7 entries (identical names); `hub-router.json`
`routerSignals` = 7 keys; `tieBreak` = 7 entries. Phase 013's "eight" decomposes as **7 routing modes + 1 shared
backbone** (`deep-improvement-common`), which is reached internally by its three benchmark variants and is not a
routing identity. The three commits changed defaults and signal restrictions, not the count.

**B. Does the packet-033 benchmark dependency survive? YES, with a reference rebase.**
`7f3216fc502` moved it to `z_archive/027-deep-loop-behavior-benchmarks/`, which remains the provenance and
prior-result authority. Active execution now belongs to `shared/behavior-benchmark/behavior-bench-run.cjs` and
`<mode>/behavior-benchmark/`. Phase 003's literal "Packet 033" string now resolves to an unrelated packet.

---

## 6. Recommended actions

1. **003** — rebase the path inventory onto kebab-case runtime and benchmark surfaces; retain archived packet 027
   for provenance; fix the "Packet 033" string, which now names a different packet.
2. **012** — extend the phase to freeze the 5 components the shared boundary gained since baseline.
3. **013** — rename "eight modes" to eight migration workstreams serving seven routing modes; encode
   `defaultMode: null`; refresh route-gold fixtures and shadow-parity tests. Migration substrate is unaffected.
4. **007 / 010 / 011** — amend to start from shipped substrate and narrow new work to the missing acceptance
   contracts. 011 additionally needs its council-only anchor replaced.
5. **006** — repair the malformed research link (a pre-baseline plan defect) and explicitly reuse current
   observability producers.
6. **016** — redesign as an executable exact-SHA manifest mapping five benchmark packages to seven modes and eight
   workstreams.

---

## 7. Run integrity — read before trusting the numbers

Three defects affect confidence and are recorded rather than smoothed over:

| Defect | Impact |
|--------|--------|
| **Forced depth did not apply.** `stopPolicy` was passed inside the fan-out config JSON, but `fanoutConfigSchema` has no such key and zod stripped it silently; `fanout-run.cjs:1512` reads it only from the `--stop-policy` CLI flag. Both lineages ran 7/10 and stopped on `converged` | **sol: none.** Its convergence was legitimate — composite stop score 0.70 > 0.60, question coverage 1.00, all guards passed, newInfoRatio 0.90→0.12 monotonic. **glm: material.** It stopped at a self-reported 0.85, i.e. still finding new information |
| **glm fabricated every iteration timestamp.** Records claim 14:30→15:18 in even 8-minute steps; the actual window was 12:22→13:15. The runtime's `timestamp_anomaly` detector flagged 9 records `after_window` | glm's findings carry real `path:line` evidence and stand on their own, but its **self-reported** fields are untrustworthy — including the 0.85 that would otherwise argue it was cut off mid-discovery |
| **The lineages pinned different HEADs.** sol compared against `e4b242c3940c` (211 commits, 27 deep-loop); glm pinned `739b85ac57` (205 commits, 25 deep-loop) | Neither triage is wrong — the branch moved *during the census*. This is itself live confirmation of the plan-decay risk the packet names, observed within a single ~1h run |

The supplied 204-commit figure was already stale at census time. Both lineages detected and corrected it
independently, which is a mild positive signal on their range triage.

---

## 8. Bottom line

The packet is **not invalidated and does not need re-authoring**. Three days of concurrent AI commits produced
exactly one first-order breakage (phase 003, from a repo-wide rename that originated *outside* the runtime —
vindicating the decision to census the full commit range rather than a `system-deep-loop/`-only subset).

Everything else is second-order: the substrate moved under phases 006-016 in ways that **shrink** their remaining
work. That is a scope-reduction signal, not a decay signal, and it points the same direction as the independent
recommendation to right-size the 17-phase program before executing it.

---

## 9. Cross-program coupling — the 020 router-unification program

A follow-on impact analysis (35 agents, 6 shared surfaces, every coupling adversarially verified) asked whether
`sk-doc/019-sk-doc-router-alignment/020-router-unification-program` — a fleet-wide refactor that unifies every
parent-hub router under one compiled policy — affects this program. **Verdict: yes, one-directionally (020 → 036),
bounded, and non-blocking.** 036 must be authored against 020's landed state, not a pristine baseline; it already
holds the machinery (BASE-pin at 003, re-census/reopen at 017) to absorb it.

**Confirmed couplings (CONFIRMED against `path:line` / `git show`):**

| Sev | Coupling | What 036 must do |
|-----|----------|------------------|
| significant | 020's early phases already shipped onto this hub — `908efde8d8f`, `6cd8ab14e4e`, `708d25acf04` touch `hub-router.json` / `mode-registry.json` / `SKILL.md`; 036 has not executed | 003 pins BASE downstream of them; 012/013/018 treat `defaultMode:null`, dropped `hub-identity`, command-bridge signals as pre-existing baseline |
| significant | 036/012's frozen boundary grew by 5 components (`resourceContractVersion`, `defaultMode:null`, benchmark-signal restriction, `smart-routing.md`, `leaf-manifest.json`) | Extend the 012 freeze to include all five before authoring 013 — already the §2 REFINE verdict for 012 |
| latent | 020's compiled-policy **live-activation** (phase-010, `SPECKIT_COMPILED_ROUTING`, default-off) would make the runtime read a compiled policy instead of the registry directly | Nothing today; do not interleave it with 036's 013/014 cutover unannounced. Registered as a 003 drift dependency for 017 |
| minor | 020 hash-pins 4 parent-hub files (`SKILL.md`, `mode-registry.json`, `smart-routing.md`, `leaf-manifest.json`) in its shadow snapshot | 013's per-mode migrations must stay inside per-mode trees; touching a pinned parent-hub file forces a 020 recompile before its activation |

**Explicitly REFUTED by verification (do not carry forward):**
- *"executor-config.ts couples 020 to 036/005 and 009"* — **false**. The path 020 names
  (`system-spec-kit/mcp-server/lib/deep-loop/executor-config.ts`) does not exist; the real file is under
  `system-deep-loop/runtime/`, and 020's implementation phases never reference `executor-config`/`expandLineages`/
  fan-out. **036/005 and 009 are untouched by 020.**
- *"036's registry edits would go inert under the compiled router"* — false; 036 never writes
  `mode-registry.json` / `hub-router.json` (0 write-refs across the 012/013 tree; 003 only parses).
- *"020 and 036 are competing routing authorities"* — a category error. 020's compiled router owns
  request→mode/packet **routing**; 036's transition-authorization gateway (014) owns event-ledger **state**
  authority within a running mode. Different layers.

**Not in conflict:** the 7-mode / 5-packet / 8-workstream taxonomy (020 actively *protects* it with hard-fail
collapse guards) and the benchmark scorer `router-replay.cjs` (byte-frozen by both programs).

**Sequencing:** coordinate, do not serialize. The programs can interleave; the one constraint is that 020's
phase-010 live-activation of *this* hub should land before 036 pins BASE, or be caught as a named drift event by
017's re-census. Neither program references the other in prose (0 cross-refs both directions), so 036's 017
re-census is the only mechanism that will catch a further 020 landing — hence the explicit dependency now recorded
in 003.
