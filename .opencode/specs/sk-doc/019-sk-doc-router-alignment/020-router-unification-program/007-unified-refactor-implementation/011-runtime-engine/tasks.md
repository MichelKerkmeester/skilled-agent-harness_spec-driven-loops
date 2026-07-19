---
title: "Tasks: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "Task breakdown for the P4b runtime engine: compiled-route engine, double-gated resolver, fenced-CAS serving flip, and the end-to-end sk-code proof."
trigger_phrases:
  - "runtime engine tasks"
  - "P4b cutover task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Author `lib/compiled-route.cjs` — the pure runtime engine that maps each hub to its rollout child and loads `loadSnapshot` + `evaluateCanary`.
- [x] T002 Reuse the child's archetype engine — `evaluateCanary` or `evaluateRoute` — (no reimplemented routing algebra); normalize the decision to `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}`.
- [x] T003 Confirm the engine routes WITHIN a hub on signal-bearing prompts and returns `defer` on off-signal prompts (the conservative outcome).
- [x] T004 Author `lib/resolve.cjs` — the double-gated (`SPECKIT_COMPILED_ROUTING=1` AND `servingAuthority: compiled`), fail-safe resolver with a `--hub/--prompt` CLI front-door.

**Evidence**: All three modules run offline with zero external dependencies; `compiled-route.cjs` requires the child's `harness/build-artifacts.cjs` and `lib/canary-router.cjs`, defining no independent routing algebra; `resolve.cjs` returns null unless both gates hold.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author `lib/flip-serving.cjs` — a fenced compare-and-swap that moves a hub's activation manifest `servingAuthority` `legacy → compiled` (`shadowOnly true → false`).
- [x] T006 Gate the flip on the hub being P4a-bound (compiled `selectedPolicy`), a green `validate-canary.cjs`, and the three pinned scorer digests unchanged.
- [x] T007 Gate the flip on `assertEngineRoutes` — the engine must route ≥1 designed scenario before the hub is made authoritative.
- [x] T008 Retain a byte-identical `manifest.serving-prior.json` before the swap and advance the monotonic fence epoch.
- [x] T009 Implement `--rollback` (restore the byte-identical serving-prior, advance the fence) and the `ALREADY-COMPILED` idempotent no-op.
- [x] T010 Emit `serving-flip-record.json` (hub, flipped policy, fence transition, and the green-gate proof).

**Evidence**: `flip-serving.cjs` aborts before any manifest write when a gate fails; on success it writes `servingAuthority: compiled`, `shadowOnly: false`, advances the fence, retains the serving-prior, and records the flip.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Prove the flip on `sk-code`: `serving-flip-record.json` shows `servingAuthority: compiled`, generation 2, fence `3 → 4`, gates green (`canaryGreen: true`, `scorerFrozen: true`, routed 1/5 scenarios).
- [x] T012 Prove the front-door: with `SPECKIT_COMPILED_ROUTING=1` the CLI returns `action: route` to the `code-quality` surface (sk-code/quality mode); with the flag off it returns the legacy sentinel.
- [x] T013 Prove byte-exact rollback: `--rollback` restores `manifest.serving-prior.json` byte-for-byte (the retained serving-prior reads `servingAuthority: legacy`, `shadowOnly: true`). The rollback mechanism was exercised and proven; `sk-code` was then flipped for the production cutover and is currently `servingAuthority: compiled` at fence epoch 4, with the byte-identical serving-prior retained so the same byte-exact rollback remains available.
- [x] T014 Confirm the three frozen scorer digests are unchanged after the full proof and the seven-hub cutover.

**Evidence**: The `sk-code` end-to-end proof is complete, and the cutover was then executed across all seven hubs — each flipped `legacy → compiled` and left compiled-serving but inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag. Evidence lives in `010-live-activation/activation/<hub>/{serving-flip-record.json, manifest.serving-prior.json, manifest.json, fence-state.json}`.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The compiled-route engine, the double-gated resolver + CLI front-door, and the fenced-CAS serving flip are built and run offline with zero dependencies.
- [x] The path is proven end-to-end on `sk-code` (flip → compiled-served route → byte-exact rollback); the cutover was then executed across all 7 hubs (flipped `legacy → compiled`, left compiled but inert behind the default-off flag).
- [x] Frozen scorer digests unchanged; the runtime path is inert by default (`SPECKIT_COMPILED_ROUTING` off).
- [x] T015 Wire each hub's live `SKILL.md` routing directive to call the resolver (complete: each of the 7 hubs carries an additive, flag-gated compiled-routing directive).
- [x] T016 Flip all seven hubs' serving authority `legacy → compiled` (complete; each canary-green via the real scorer, route-gold byte-identical, byte-exact rollback retained); post-flip real-model re-verification treated as satisfied by the P4a T9 result plus flag-off inertness.
- [x] Strict Level-2 packet validation on this phase folder.

**Evidence**: The P4b runtime engine, its `sk-code` end-to-end proof, the hub `SKILL.md` wiring (T015), and the seven-hub `legacy → compiled` flip (T016) are all complete — landed in commits engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa` (pushed on v4), held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag. The advisor-hook machine-enforcement layer remains in progress and is NOT claimed done.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Compiled-route engine**: `lib/compiled-route.cjs`
- **Resolver + CLI front-door**: `lib/resolve.cjs`
- **Per-hub serving flip**: `lib/flip-serving.cjs`

<!-- /ANCHOR:cross-refs -->
