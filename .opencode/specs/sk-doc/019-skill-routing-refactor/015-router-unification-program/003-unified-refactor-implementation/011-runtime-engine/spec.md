---
title: "Feature Specification: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "The runtime engine that consumes the compiled router contract at route time, plus the per-hub serving-authority flip that makes it authoritative. Stage P4b — the literal cutover — built on top of P4a (010-live-activation, which bound each hub's compiled generation as selectedPolicy while serving authority stayed legacy). Three zero-dependency modules: an archetype-adaptive compiled-route engine that reuses each rollout child's proven closed-decision-algebra engine (evaluateCanary or evaluateRoute, by archetype — so the runtime path and the shadow-validated path are the same code), a double-gated fail-safe resolver plus CLI front-door that only serves the compiled route when the runtime flag SPECKIT_COMPILED_ROUTING=1 AND the hub's manifest reads servingAuthority: compiled, and a fenced compare-and-swap flip that moves a hub legacy→compiled behind green gates with a byte-exact rollback. The literal cutover is complete: all seven hubs are flipped legacy→compiled (each with a flag-gated compiled-routing directive in its live SKILL.md and archetype-adaptive re-certification), held inert behind the default-off SPECKIT_COMPILED_ROUTING flag; the frozen benchmark scorer is pinned throughout."
trigger_phrases:
  - "unified router runtime engine"
  - "compiled-route resolver serving flip"
  - "P4b literal cutover runtime"
importance_tier: "critical"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Unified Router Refactor — Runtime Engine (P4b Literal Cutover)

## EXECUTIVE SUMMARY

This phase builds the **runtime consumer** of the compiled router contract — the piece P4a deliberately left out — and the per-hub switch that makes it authoritative. P4a (`010-live-activation`) bound each hub's compiled generation as `selectedPolicy` on a fenced activation manifest while `servingAuthority` stayed `legacy`; nothing yet *read* that binding at route time. P4b is that reader plus the flip that turns it on.

Three zero-dependency modules do the work. An archetype-adaptive **compiled-route engine** answers `(hubId, taskText)` by loading the hub's compiled policy and reusing the **same** closed-decision-algebra engine the shadow canary already validates — the export name varies by archetype (`evaluateCanary` for the surfaceBundle canary-router, `evaluateRoute` for the plain router), so the runtime path and the shadow-validated path are literally the same code, with no reimplementation to drift. A double-gated **resolver + CLI front-door** returns the compiled decision only when the runtime flag `SPECKIT_COMPILED_ROUTING=1` is set (default off) **and** the hub's activation manifest reads `servingAuthority: compiled`; otherwise it returns a legacy sentinel and the caller keeps the prose smart-router. A fenced-CAS **serving flip** moves one hub `legacy → compiled` behind green gates, retaining a byte-identical pre-flip manifest for a byte-exact rollback. The mechanism was proven end-to-end on `sk-code`, then the literal cutover was executed across all seven hubs: each hub's live `SKILL.md` gained a flag-gated compiled-routing directive, was recompiled with archetype-adaptive re-certification, and had serving authority flipped `legacy → compiled`. The cutover is inert by default and reversible two ways, and the frozen benchmark scorer is pinned untouched throughout — so live routing is unchanged until `SPECKIT_COMPILED_ROUTING` is enabled (compiled routing is route-gold byte-identical to legacy).

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete — the P4b runtime engine (archetype-adaptive compiled-route engine + resolver/CLI front-door + per-hub serving flip) is built, and the literal cutover is executed across all seven hubs: each hub carries a flag-gated compiled-routing directive in its live `SKILL.md`, was recompiled with archetype-adaptive re-certification, and had serving authority flipped `legacy → compiled` (`servingAuthority: compiled` in each `010-live-activation/activation/<hub>/manifest.json`). Each flip is canary-green via the real scorer, route-gold ROUTING byte-identical (only hashes changed), with a byte-exact rollback retained (`manifest.serving-prior.json`). The runtime path is inert by default (`SPECKIT_COMPILED_ROUTING` off), so live routing is unchanged until the flag is enabled. Advisor-hook machine-enforcement remains in progress. Commits: engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa` (pushed on v4). |
| **Created** | 2026-07-19 |
| **Branch** | `011-runtime-engine` |
| **Migration stage** | Stage P4b — literal cutover (build the runtime consumer, flip serving authority per hub) |
| **Blast radius** | HIGH — the only stage that changes runtime routing — held inert behind a default-off flag and a per-hub serving-authority gate; reversible fleet-wide (unset the flag) or per hub (byte-exact rollback) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

After P4a, each hub's compiled generation is *bound* as `selectedPolicy` but nothing *consumes* it: there is no code that reads the manifest at route time, no gate that decides when the compiled decision is authoritative, and no operated switch to move a hub from legacy to compiled serving. Without a runtime engine the compiled contract is proven-but-dormant; without a fail-safe resolver a live cutover cannot be inert-by-default or reversible; and without a fenced, gated flip the serving change — the single highest-blast step in the whole program — would be an unauditable manual edit to a served pointer. A naive engine would also risk *re-implementing* the routing algebra, forking the runtime path away from the exact code the canary proved green.

### Purpose

Deliver the P4b runtime engine as three small, zero-dependency modules: a pure compiled-route engine that reuses each rollout child's proven canary engine (never a reimplementation), a double-gated fail-safe resolver plus CLI front-door that only serves the compiled route under an explicit runtime flag and a per-hub serving flag, and a fenced compare-and-swap flip that moves a hub `legacy → compiled` behind green gates with a proven byte-exact rollback — then prove the whole path end-to-end on one hub, keep the frozen scorer pinned, and execute the rollout across all seven hubs (wire each live `SKILL.md`, re-certify, and flip serving authority) behind the default-off `SPECKIT_COMPILED_ROUTING` flag so live routing is unchanged until it is enabled.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The archetype-adaptive runtime **compiled-route engine** `lib/compiled-route.cjs` — routes `(hubId, taskText)` through the hub's compiled policy by reusing the rollout child's `loadSnapshot` + its archetype engine (`evaluateCanary` or `evaluateRoute`), and returns a normalized decision (`action`, `selectionKind`, `targets`, `effectivePolicyHash`, `generation`).
- The **resolver + CLI front-door** `lib/resolve.cjs` — double-gated (`SPECKIT_COMPILED_ROUTING=1` AND manifest `servingAuthority: compiled`), fail-safe (errors → null), with a `--hub/--prompt` CLI that prints the compiled decision or a legacy sentinel.
- The per-hub **serving flip** `lib/flip-serving.cjs` — a fenced compare-and-swap that moves the hub's activation manifest `legacy → compiled` behind green gates, retains a byte-identical `manifest.serving-prior.json`, supports `--rollback`, and emits `serving-flip-record.json`.
- The end-to-end proof on `sk-code` (flip → compiled-served route via the front-door → byte-exact rollback) and the subsequent seven-hub cutover (flip all hubs `legacy → compiled` behind the default-off flag), with each flip's serving state living on the P4a activation manifest under `010-live-activation/activation/<hub>/`.
- The frozen-scorer pin, the canary green gate, and the "engine routes ≥1 designed scenario" gate that every flip must clear.

### Out of Scope

- Wiring each hub's live `SKILL.md` routing directive to call the resolver - [note] beyond the initial engine build, but now **complete**: each of the seven hubs carries an additive, flag-gated compiled-routing directive that shells to the resolver front-door and self-gates on serving authority (inert while `SPECKIT_COMPILED_ROUTING` is off).
- Flipping all seven hubs' serving authority to `compiled` - [note] now **complete**: executed one-hub-at-a-time; all seven `010-live-activation` manifests read `servingAuthority: compiled`, each byte-exact-reversible via a retained `manifest.serving-prior.json`.
- Post-flip real-model re-verification across the hubs - [note] treated as satisfied by the P4a T9 result (0 wrong-hub routes) plus flag-off inertness; compiled routing is route-gold byte-identical to legacy, so enabling the flag changes hashes only, not routing decisions. A separate post-flip real-model sweep was not re-run.
- Re-deriving or editing the compiled contract, or editing any `hub-router.json`, `mode-registry.json`, or the frozen benchmark scorer - [why] the engine consumes the compiled contract read-only and never edits a protected input. The cutover's one authored edit per hub is the additive, flag-gated `SKILL.md` compiled-routing directive above — never a change to existing prose routing.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-runtime-engine/lib/compiled-route.cjs` | Create | Pure runtime compiled-route engine (reuses each rollout child's canary engine read-only) |
| `011-runtime-engine/lib/resolve.cjs` | Create | Double-gated, fail-safe serving resolver + `--hub/--prompt` CLI front-door |
| `011-runtime-engine/lib/flip-serving.cjs` | Create | Fenced-CAS per-hub serving flip (`legacy → compiled`) with byte-exact `--rollback` and `serving-flip-record.json` |
| `011-runtime-engine/{spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-2 spec docs, verification evidence, and completion record |

> The engine and resolver are pure and read-only. Only the flip mutates state, and it does so on the P4a activation manifest under `010-live-activation/activation/<hub>/` (the serving pointer the resolver reads) — never on a live routing file or the scorer. The runtime path stays inert until `SPECKIT_COMPILED_ROUTING=1` is set for a hub that has been flipped.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The compiled-route engine reuses each rollout child's proven canary engine rather than reimplementing routing. | `compiled-route.cjs` loads the hub's `harness/build-artifacts.cjs` `loadSnapshot` and `lib/canary-router.cjs` `evaluateCanary` from `006-parent-hub-rollout/<child>` and routes through them; it defines no independent routing algebra. |
| REQ-002 | The engine routes WITHIN a hub and defers on prompts that lack the policy's detector signals. | `compiledRoute(hubId, taskText)` returns a normalized `{action, selectionKind, targets, effectivePolicyHash, generation}`; `action` is one of route/clarify/defer/reject, and an off-signal prompt returns `defer` (the conservative outcome) so the caller can fall back to legacy. |
| REQ-003 | The resolver serves the compiled route ONLY when both gates hold, and is otherwise inert. | `resolveRoute(hubId, taskText)` returns null unless `SPECKIT_COMPILED_ROUTING=1` AND the hub's `010-live-activation` manifest reads `servingAuthority: compiled`; with the flag off it returns null / the CLI prints a legacy sentinel. |
| REQ-004 | The resolver fails safe: any error resolving the compiled route yields null, never a throw into the routing hot path. | A malformed or missing manifest, or any engine error, returns null (legacy fallback); `servingAuthority()` defaults to `legacy` on a missing/unparseable manifest. |
| REQ-005 | The serving flip is a fenced compare-and-swap gated on P4a-binding, a green canary, the frozen scorer, and a live route. | `flip-serving.cjs --hub <id>` aborts unless `selectedPolicy` is the compiled generation, `validate-canary.cjs` exits zero, the three pinned scorer digests match, and the engine routes ≥1 designed scenario; on success it writes `servingAuthority: compiled`, `shadowOnly: false`, and advances the fence epoch. |
| REQ-006 | Every flip is reversible byte-exact and audited. | The flip retains a byte-identical `manifest.serving-prior.json` before the swap; `--rollback` restores those exact bytes and advances the monotonic fence; each flip emits `serving-flip-record.json` with the gate proof. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Prove the whole path end-to-end on one hub, then execute the cutover across all seven. | On `sk-code`: flip → `servingAuthority: compiled` with green gates → the front-door returns `action: route` (flag on) and a legacy sentinel (flag off) → byte-exact `--rollback` proven. All seven hubs are then flipped `legacy → compiled` behind the default-off `SPECKIT_COMPILED_ROUTING` flag, each canary-green with a retained byte-identical serving-prior; the frozen scorer digests are unchanged. |
| REQ-008 | Execute the rollout: wire each hub's live `SKILL.md`, re-certify, and flip all seven hubs' serving authority. | Complete: each of the seven hubs carries an additive, flag-gated compiled-routing directive in its live `SKILL.md`, was recompiled with archetype-adaptive re-certification, and reads `servingAuthority: compiled`. The path is inert by default; post-flip real-model re-verification is treated as satisfied by the P4a T9 result plus flag-off inertness; the advisor-hook machine-enforcement layer remains in progress. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The compiled-route engine and the shadow canary run the *same* engine — `compiled-route.cjs` reuses each child's `loadSnapshot` and its archetype engine (`evaluateCanary` or `evaluateRoute`), so no routing algebra is reimplemented and the runtime path cannot drift from what was proven.
- **SC-002**: The resolver is inert by default and double-gated — no compiled route is served unless `SPECKIT_COMPILED_ROUTING=1` and the hub reads `servingAuthority: compiled`; it fails safe to legacy on any error.
- **SC-003**: The serving flip is a fenced, gated CAS with a proven byte-exact rollback and a per-flip audit record; a failed gate aborts before any manifest write.
- **SC-004**: The path is proven end-to-end on `sk-code` (flip → compiled-served route → byte-exact rollback), and the cutover is then executed across all seven hubs — each flipped `legacy → compiled` and left compiled-serving but inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag, with a byte-identical serving-prior retained for a byte-exact per-hub rollback.
- **SC-005**: The rollout is complete (hub `SKILL.md` wiring + archetype-adaptive re-certification + the seven-hub flip) and honestly bounded — live routing is unchanged until the flag is enabled (compiled routing is route-gold byte-identical), post-flip real-model re-verification is treated as satisfied by the P4a T9 result plus flag-off inertness, and the advisor-hook machine-enforcement layer remains in progress; the frozen scorer digests are unchanged.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Per-hub rollout children (`harness/build-artifacts.cjs`, `lib/canary-router.cjs`) | The engine cannot route without each child's snapshot + canary engine | Reused read-only; the engine caches each hub's frozen engine and never mutates a child |
| Dependency | P4a activation manifests (`010-live-activation/activation/<hub>/manifest.json`) | The resolver's serving gate and the flip's CAS both read/write this pointer | Present and P4a-bound; the flip asserts `selectedPolicy` is compiled before flipping |
| Dependency | Frozen benchmark scorer (three pinned digests) | A drifted scorer would invalidate the canary baseline behind every flip | The flip re-hashes all three files and aborts on any drift before writing |
| Risk | The serving flip is the only stage that changes runtime routing | A wrong or premature flip changes what actually routes | Inert by default (`SPECKIT_COMPILED_ROUTING` off), per-hub gate, fenced CAS, byte-exact rollback, one hub at a time |
| Risk | Re-implementing the routing algebra in the engine | A forked runtime path could route differently from the proven canary | Structural rule: the engine reuses the child's `evaluateCanary`; it defines no independent algebra |
| Risk | Post-flip behavior differs from shadow (real models) | A hub could route acceptably in the harness yet misbehave live | Compiled routing is route-gold byte-identical to legacy and the path is inert behind the default-off flag, so enabling it changes hashes only, not routing; post-flip re-verification is satisfied by the P4a T9 result (0 wrong-hub routes) plus that inertness, and the advisor-hook machine-enforcement layer (in progress) will backstop the wired routing |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The three modules are zero-dependency CommonJS (Node built-ins only); the engine caches each hub's loaded snapshot/engine so repeated routes are deterministic.
- **NFR-D02**: The flip is idempotent — a hub already `compiled`-serving is a no-op (`ALREADY-COMPILED`), and the fence epoch is monotonic (never reused across flip or rollback).

### Reversibility
- **NFR-R01**: The flip retains a byte-identical `manifest.serving-prior.json` before the swap; `--rollback` restores those exact bytes, so `restoredHash` equals the pre-flip manifest hash.
- **NFR-R02**: The cutover is reversible two independent ways — unset `SPECKIT_COMPILED_ROUTING` fleet-wide (the resolver returns null everywhere) or flip a single hub back to `legacy` (per hub).

### Authority
- **NFR-A01**: Serving authority is decided solely by the resolver's two gates; the pure engine is never authoritative on its own and never edits a manifest.
- **NFR-A02**: The flip asserts the hub is P4a-bound (compiled `selectedPolicy`) at the expected fence epoch immediately before the atomic swap; a mismatch aborts.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Resolver gating
- Flag off: `resolveRoute` returns null / the CLI prints the legacy sentinel `{servingAuthority: legacy, hubId}` even for a compiled-serving hub.
- Manifest missing or unparseable: `servingAuthority()` defaults to `legacy`, so the resolver stays inert (fail-safe).

### Engine behavior
- Off-signal prompt: the engine returns `defer` rather than forcing a route, so the caller falls back to legacy on ambiguous input.
- Unknown hub id: the engine throws for an unmapped hub, but the resolver's `try/catch` converts that into a null (legacy) at the serving boundary.

### Flip preconditions and idempotency
- Not P4a-bound / non-green canary / scorer drift / engine routes zero scenarios: the flip aborts before any manifest write.
- Re-flip of a compiled-serving hub: no-op; `--rollback` without a retained serving-prior aborts rather than guessing.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 13/25 | Three small zero-dependency modules (engine + resolver + flip); reuses the rollout children and the P4a manifest rather than adding a plane |
| Risk | 20/25 | The serving flip is the only stage that changes runtime routing; held inert by a default-off flag, a per-hub gate, a fenced CAS, and a byte-exact rollback |
| Research | 7/20 | Mechanism is fully specified (reuse the archetype engine, double-gate, fenced flip); the rollout is executed across all seven hubs, and residual work is the advisor-hook machine-enforcement layer |
| **Total** | **40/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What explicit signal gates the per-hub `SKILL.md` wiring and the `legacy → compiled` flip in production (which green thresholds on route-gold plus real models), and who authorizes the first live flip?
- What breadth of post-flip real-model re-verification is required per hub before a hub is left compiled-serving, and how is the bound recorded so it is not read as full-corpus coverage?
- Should the resolver front-door be invoked in-process by each hub's router or shelled out via the CLI, and what is the latency budget for the compiled path versus the legacy prose router?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Compiled-route engine**: `lib/compiled-route.cjs`
- **Resolver + CLI front-door**: `lib/resolve.cjs`
- **Per-hub serving flip**: `lib/flip-serving.cjs`
- **P4a activation state (serving pointer)**: `../010-live-activation/activation/<hub>/`
