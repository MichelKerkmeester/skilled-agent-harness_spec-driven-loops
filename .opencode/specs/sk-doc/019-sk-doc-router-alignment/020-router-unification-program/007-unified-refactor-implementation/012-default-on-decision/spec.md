---
title: "Feature Specification: Compiled Routing — Default-On Decision & Safe-Cutover Contract"
description: "Settle whether SPECKIT_COMPILED_ROUTING should become the repo's effective default and, if so, on what safe path. The compiled router is built, wired, and inert behind a default-off flag: the P4b flip already moved all seven hubs' manifests to servingAuthority: compiled, and the live advisor consumes them only when the flag is 1, only for hubs in a hardcoded allowlist, and even then attaches the compiled decision as ADDITIVE metadata that never changes which skill is recommended. This phase records the decision — default-on is a Phase-4 OUTCOME, not a switch-flip — and specifies the four contracts that make an eventual global default-on safe and reversible: (P0) document the flag in ENV-REFERENCE and make the verify harness distinguish drift-to-legacy from breakage plus a per-hub serving-status readout; (P1) a drift-detection CI that recomputes each hub's live hash against its minted manifest and fails 're-mint required'; (P2) a canary default-on in one env profile with the repo default staying off; (P3) a data-driven eligibility rule (compiled-eligible IFF a valid fresh manifest exists) that single-sources the duplicated allowlist and makes no-manifest skills legacy by construction; (P4) a staged, hub-by-hub global default-on that flips the two code predicates and the seven SKILL.md directives in lockstep while keeping =0 as the documented kill-switch. The frozen benchmark scorer is never touched and every step is byte-exact reversible."
trigger_phrases:
  - "compiled routing default-on decision"
  - "SPECKIT_COMPILED_ROUTING flip default"
  - "compiled router safe cutover contract"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Settled ADR-001 and reconciled the packet to the phased path"
    next_safe_action: "Begin P0 on operator go-ahead"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 60
    open_questions: []
    answered_questions:
      - "Flip the default now or adopt the phased path? Adopt the phased path, settled on the analysis; operator may override."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

# Compiled Routing — Default-On Decision & Safe-Cutover Contract

## EXECUTIVE SUMMARY

The compiled skill-router is built, hardened, wired into the live advisor, and **inert behind a default-off flag**. The sibling P4b work (`011-runtime-engine`) already flipped all seven hubs' activation manifests to `servingAuthority: compiled`; what remains gated is whether the runtime *consumes* that state, and that gate is `SPECKIT_COMPILED_ROUTING`. The parent goal asks to make compiled routing "the effective default."

This phase is a **decision packet**, not a flip. It records — against verified source evidence, not narrative — that flipping the repo default to ON **today changes zero routing decisions** and therefore trades real operational surface for no behavioral gain, and it specifies the four contracts (P0→P4) under which a global default-on becomes a safe, observable, reversible *outcome*. The single load-bearing finding: in the only live integration point, the compiled decision is attached as **additive metadata** to a recommendation the legacy path has already computed — so enabling the flag can only make an extra `compiledRoute` field appear or silently not-appear; it cannot change which skill is recommended (`advisor-recommend.ts:357-374`, decisive line `:371`).

The ruling is **settled: adopt the phased path** — decided on the analysis and source verification above (per the session directive to settle the decision), reversible, and open to operator override to flip-now. No runtime change follows from this decision; a separate operator go-ahead gates the start of P0 implementation.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Ruling settled — adopt the phased path (P0→P4), decided on the analysis; reversible and operator-overridable. No runtime implementation started; a separate operator go-ahead gates P0. |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Migration stage** | Decision gate preceding P0 (documentation + observability); default-on is the P4 outcome |
| **Blast radius** | Decision + contracts only (no code change here). The contracts it governs range from zero-blast (docs) to the highest-blast change in the program (global serving default), each staged and reversible |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent goal frames "compiled routing as the effective default" as a switch to flip. Verified source evidence shows that framing is unsafe for five independent, non-overlapping reasons:

1. **Zero routing benefit today.** The only place compiled routing enters the live advisor is `enrichCompiledRoutes()` (`advisor-recommend.ts:357`). With the flag unset it is a pure pass-through (`:362`). With the flag on, it maps over recommendations the legacy path already produced and, per recommendation, attaches `compiledRoute` as an additive sibling field — `{ ...recommendation, compiledRoute }` (`:371`) — never recomputing `skillId`/`workflowMode`. Enabling the flag cannot change which skill is chosen.
2. **Silent drift is the steady state.** The serve-time shim recomputes the decision from live hub config; on any mismatch, missing resolver, or error it emits a `{ servingAuthority: "legacy" }` sentinel (`compiled-route.cjs:36-39`), which the advisor maps to `undefined` (`advisor-recommend.ts:351`). Any edit to a hub's `SKILL.md`/router config reverts that hub to legacy invisibly until its manifest is re-minted. This repo churns hub config constantly, so "compiled" would spend much of its life silently on legacy.
3. **No observability.** Nothing distinguishes "serving compiled" from "silently fell back to legacy." A drifted hub and a broken hub read identically.
4. **Undocumented flag = governance violation.** `SPECKIT_COMPILED_ROUTING` is absent from `ENV-REFERENCE.md`, which the project constitution (CLAUDE.md §6) mandates as the source of truth for flag defaults. Flipping an undocumented flag violates that mandate.
5. **Kill-switch inversion.** Today, absence-of-var = legacy = safe. After a naive default-flip, absence = compiled, silently changing every runtime/hook/CI/launcher that assumed "absent = legacy."

A sixth, structural fragility (found this phase, under-weighted in prior handovers): the runtime front door `bin/compiled-route.cjs` resolves its resolver from a path **inside the spec tree** (`compiled-route.cjs:16-21` → `007-unified-refactor-implementation/011-runtime-engine/lib/resolve.cjs`). A spec renumber/re-nest silently breaks every compiled route to the legacy sentinel — the repo's own reorganization is a drift engine.

### Purpose

Record the decision that default-on is a Phase-4 *outcome*, not a switch, and specify the four contracts (P0→P4) that make an eventual global default-on safe, observable, and byte-exact reversible — so that when the flag is flipped, compiled routing does something legacy cannot, drift is caught by CI rather than discovered in production, and the kill-switch (`=0`) is a documented, load-bearing control rather than an accident of variable absence.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The **ruling** (settled): default-on is a staged P4 outcome; the phased path P0→P4 is adopted as the program of record, decided on the analysis and reversible. A separate operator go-ahead gates the start of P0 implementation.
- The **fallback contract**: a precise, single-sourced definition of "graceful backwards-compat for skills lacking the compiled JSONs/snapshot" — no-manifest OR stale-hash resolves to the legacy sentinel; the `sk-git` non-hub template stays pinned legacy.
- The **drift-detection CI contract**: recompute each hub's live config hash vs its minted manifest; fail "re-mint required" on mismatch; wire "edit a hub → re-mint" as an enforced rule, not a remembered one.
- The **observability contract**: the verify harness must classify drift-to-legacy as *degraded/expected*, not *broken*, and expose a per-hub serving-status readout (compiled-serving | legacy-fallback | drifted).
- The **migration map** P0→P4 with reversibility and the frozen-scorer pin at every step, including promoting or explicitly documenting the runtime→spec-tree resolver coupling as a named drift source.

### Out of Scope

- Any change to routing **decisions** — [why] compiled must stay byte-identical to legacy; this program never changes what routes, only what is served and how it is observed.
- Editing the frozen benchmark scorer (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — [why] pinned and non-negotiable across the whole program.
- Actually flipping `SPECKIT_COMPILED_ROUTING` to a repo default in this phase — [why] this phase decides and contracts; the flip is the P4 execution phase, gated on P0–P3 landing green.
- The `sk-doc:create-skill` generator alignment and the skill-benchmark alignment — [why] delivered in the sibling phases `013-create-skill-alignment` and `014-benchmark-alignment`, which consume this phase's fallback and eligibility contracts.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `012-default-on-decision/spec.md` | Create | This decision spec |
| `012-default-on-decision/decision-record.md` | Create | The ruling, the verified evidence with file:line receipts, alternatives weighed, and the fallback/drift/observability contracts in full |
| `012-default-on-decision/{plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-3 planning, task breakdown, verification checklist, and Planned-state completion record |

> This phase authors documentation and contracts only. No runtime file, `SKILL.md`, manifest, or scorer is edited here.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | State the ruling and its evidence such that each of the five premise-failures and the sixth structural fragility is backed by a verifiable file:line receipt, distinguishing confirmed from inferred. | `decision-record.md` lists each finding with its receipt (e.g. additive metadata `advisor-recommend.ts:371`; sentinel `compiled-route.cjs:36-39`; flag absent from `ENV-REFERENCE.md`; allowlist duplicated in `COMPILED_ROUTING_HUBS` + `HUB_CHILD`; resolver spec-path coupling `compiled-route.cjs:16-21`); no load-bearing claim is unsourced. |
| REQ-002 | Specify the fallback contract precisely and single-sourced. | The contract defines that a hub is compiled-served IFF a valid, fresh manifest exists AND `SPECKIT_COMPILED_ROUTING=1` AND the hub is eligible; every other state resolves to the legacy sentinel with no behavior change. The eligibility predicate is named as the single source both `COMPILED_ROUTING_HUBS` and `HUB_CHILD` must derive from (delivered in P3). |
| REQ-003 | Specify the drift-detection CI contract. | The contract defines: recompute each hub's live config hash, compare to its minted manifest digest, exit non-zero with "re-mint required: <hub>" on mismatch; and the enforced rule "editing a hub's routing inputs requires re-minting its manifest in the same change." |
| REQ-004 | Specify the observability contract. | The contract defines a per-hub serving-status readout with three states (compiled-serving | legacy-fallback | drifted) and requires the verify harness to score drift-to-legacy as degraded/expected rather than a hard failure, so a red signal means breakage, not routine churn. |
| REQ-005 | Record the P0→P4 migration map with reversibility and the frozen-scorer pin at every step, and name the runtime→spec-tree resolver coupling as a P0 remediation (promote the resolver to a stable runtime path OR document the coupling as an explicit drift source). | `decision-record.md` and `plan.md` carry the ordered P0→P4 map; each step names its rollback; the scorer pin and "no routing-decision change" invariant are restated per step. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Settle the ruling on the analysis (adopt phased path) and record it, leaving an explicit override (flip now) open to the operator. | The decision-record ADR-001 status reads Accepted (adopt the phased path, decided on the analysis, reversible); an operator override to flip-now can be recorded at any time. |
| REQ-007 | Cross-link the two dependent alignment phases so the fallback and eligibility contracts have exactly one home. | `013-create-skill-alignment` and `014-benchmark-alignment` reference this phase's contracts rather than restating them; this spec's RELATED DOCUMENTS lists both. |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The decision is legible — a reader can reconstruct, from receipts, why flipping the default today is zero-benefit and why the phased path is recommended, without re-deriving it from source.
- **SC-002**: The fallback contract is unambiguous and single-sourced: "no valid fresh manifest ⇒ legacy" holds by construction, and the eligibility predicate has one named home for P3 to implement.
- **SC-003**: The drift-CI and observability contracts are specified concretely enough to implement in P0/P1 without further design.
- **SC-004**: The P0→P4 map is reversible at every step, restates the frozen-scorer pin and the no-routing-change invariant per step, and names the resolver spec-path coupling as a P0 remediation.
- **SC-005**: The ruling's status honestly reflects reality — settled on the analysis (adopt the phased path), reversible and operator-overridable — with no premature "default-on" or "implementation started" claim.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Premise capture — treating default-on as a switch | Flips an undocumented flag that inverts the kill-switch for zero routing benefit | This decision reframes default-on as a P4 outcome gated on P0–P3; the flip is never this phase's action |
| Risk | Silent drift normalized as "compiled" | A drifted hub serves legacy while dashboards claim compiled | P1 drift-CI fails re-mint-required; P0 observability distinguishes drifted from broken |
| Risk | Duplicated allowlist diverges | `COMPILED_ROUTING_HUBS` and `HUB_CHILD` drift apart, mis-gating hubs | P3 single-sources eligibility to "valid fresh manifest exists"; both predicates derive from it |
| Risk | Runtime resolver coupled to a spec-tree path | A spec renumber breaks all compiled routing to the sentinel | REQ-005 P0 remediation: promote the resolver to a stable runtime path or document the coupling as a named drift source with a guard |
| Dependency | Frozen benchmark scorer (three pinned files) | Any edit invalidates the parity baseline the whole program rests on | Restated as a hard pin per migration step; never edited |
| Dependency | Sibling `013`/`014` alignment phases | Onboarding (create-skill) and validation (benchmarks) must consume this phase's contracts | REQ-007 cross-links; the contracts live here once and are referenced, not restated |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: Every step P0→P4 names an explicit rollback; the P4 global default-on keeps `SPECKIT_COMPILED_ROUTING=0` as the documented, load-bearing kill-switch.
- **NFR-R02**: Because compiled routing is byte-identical to legacy for matched hubs, any step's rollback is behavior-neutral by construction, not merely by test.

### Determinism
- **NFR-D01**: The fallback is deterministic: identical (hub config, manifest, flag) inputs always yield the same served-authority; drift is a pure function of a hash mismatch, not timing.

### Authority
- **NFR-A01**: Serving authority is conferred only by a valid, fresh manifest under an enabled flag for an eligible hub; nothing else grants it, and the eligibility predicate has exactly one source of truth (P3).

---

## 8. EDGE CASES

### Fallback correctness
- Hub with no manifest (a freshly created skill, pre-`013`): resolves to the legacy sentinel; routing unchanged — backward-compat by construction.
- Hub with a stale manifest (config edited, not re-minted): live hash ≠ minted digest ⇒ legacy sentinel; P1 CI fails re-mint-required.

### Observability boundaries
- Drifted hub vs broken resolver: both currently read identically; P0 observability must separate "degraded/expected (drift)" from "broken (error)".
- All-legacy fleet under flag-on: a valid state (e.g. every hub mid-edit), must read as degraded, not failed.

### Kill-switch
- `SPECKIT_COMPILED_ROUTING=0` after P4 default-on: must fully restore legacy serving fleet-wide, documented as the kill-switch, not an incidental default.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | A decision plus four contracts plus a migration map; no runtime code authored in this phase |
| Risk | 18/25 | The decision governs the highest-blast change in the program (the global serving default); the phase itself is zero-blast documentation, but its ruling is load-bearing for every later phase |
| Research | 12/20 | Mechanism verified from source this phase (additive metadata, sentinel fallback, allowlist duplication, resolver coupling); residual is P0 implementation, not investigation |
| **Total** | **39/70** | **Level 3** — decision-record plus architecture-level consequence, not authoring volume, sets the level |

---

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| Operator overrides to flip default-on now | Medium | Medium | Fallback is genuinely fail-safe today, so an early flip is survivable; still land P0 docs + observability first to satisfy governance and avoid a two-meaning red signal | Operator |
| A hub edit silently reverts that hub to legacy | High | Medium | P1 drift-CI fails re-mint-required at edit time; P0 readout shows the drifted state | P1 owner |
| The two hardcoded allowlists diverge | Medium | High | P3 single-sources eligibility to "valid fresh manifest exists"; both predicates derive from it | P3 owner |
| A spec renumber severs the runtime resolver path | Medium | High | ADR-003: promote the resolver to a stable runtime path (recommended) or guard the path loudly | P0 owner |
| Frozen scorer edited, invalidating the parity baseline | Low | High | Hard pin restated per migration step; never edited; re-hash gate aborts on drift | Whole program |

---

## 11. USER STORIES

- **US-001 (operator).** As the operator overseeing the cutover, I want the default-on question recorded with verifiable receipts and the settled ruling, so I can see how it was decided and override to flip-now if I choose, with full information rather than a narrative.
- **US-002 (skill author).** As someone creating a new hub via `create-skill`, I want compiled eligibility to follow from minting a manifest, so my skill onboards by a documented step and, until then, routes via legacy by construction instead of being silently half-wired.
- **US-003 (maintainer).** As a maintainer editing a hub's routing inputs, I want CI to fail "re-mint required" when I forget to re-mint, so a silent revert to legacy becomes a loud, fixable signal instead of an invisible regression.
- **US-004 (release owner).** As the owner of the eventual global flip, I want a per-hub serving-status readout and a documented `=0` kill-switch, so I can flip hub-by-hub, watch each land, and revert instantly if any hub misbehaves.

---

## 12. OPEN QUESTIONS

- **Q1 (resolved).** The ruling is settled: adopt the phased path (default-on as a staged P4 outcome after P0–P3), decided on the analysis and reversible. An operator override to flip `SPECKIT_COMPILED_ROUTING` on now remains available but is not blocking; the steelman for flipping now is recorded in `decision-record.md` ("flip it when compiled does something legacy can't").
- **Q2.** For the P0 resolver-coupling remediation: promote `resolve.cjs` out of the spec tree into a stable runtime location, or keep it in place behind a path-integrity guard that fails loudly on a renumber? (Recommendation: promote; it removes the drift source rather than guarding it.)
- **Q3.** Which single env profile hosts the P2 canary default-on (repo default staying off), and what parity + clean-fallback thresholds gate promotion from P2 to P3?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **The ruling, receipts, and full contracts**: See `decision-record.md`
- **Build approach (P0→P4)**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record (Planned state)**: See `implementation-summary.md`
- **Runtime front door**: `011-runtime-engine/lib/resolve.cjs` and `.opencode/bin/compiled-route.cjs`
- **Live integration point**: `system-skill-advisor/mcp-server/handlers/advisor-recommend.ts` (`enrichCompiledRoutes`, `compiledRouteForRecommendation`)
- **Onboarding alignment (consumes fallback/eligibility contracts)**: `../013-create-skill-alignment/`
- **Validation alignment (consumes fallback/eligibility contracts)**: `../014-benchmark-alignment/`
