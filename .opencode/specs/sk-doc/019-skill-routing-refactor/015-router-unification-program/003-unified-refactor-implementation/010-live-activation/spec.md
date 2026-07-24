---
title: "Feature Specification: Unified Router Refactor — Live Activation"
description: "Activate the compiled router contract across all seven parent hubs in two ordered stages. Stage P4a (design-faithful): a fenced compare-and-swap binds each hub's compiled policy generation as the SELECTED policy on a dedicated per-hub activation manifest, advancing a monotonic fence epoch, while serving authority stays legacy and no runtime consumer is touched; rollback restores the byte-identical prior manifest. Stage P4b (literal cutover, now complete in the sibling 011-runtime-engine): a runtime resolver consumes the compiled contract and serving authority was flipped hub-by-hub across all seven hubs, re-verified, with the byte-identical legacy manifest retained for rollback and the compiled path held inert behind the default-off SPECKIT_COMPILED_ROUTING flag. The shared benchmark scorer is frozen and pinned throughout; every activation proves a byte-exact rollback and rides a green canary."
trigger_phrases:
  - "unified router live activation"
  - "design-faithful fenced-CAS activation"
  - "hub activation manifest selectedPolicy binding"
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

# Unified Router Refactor — Live Activation

## EXECUTIVE SUMMARY

This phase turns the shadow-complete compiled router contract into an **activated** one, in two deliberately separated stages so the highest-blast change is isolated and gated.

Every parent hub already owns a real-green rollout canary: its authored routing (`SKILL.md` + `hub-router.json` + `mode-registry.json`) is projected into a content-addressed `CompiledPolicyV1`, proven route-gold byte-green against the real read-only benchmark scorer, closed-algebra-valid, and reversible by a byte-exact shadow rollback. What did **not** exist was an activation layer: a place where the compiled generation is *bound* as authoritative, distinct from where it is *served*. Stage P4a builds exactly that layer, and it is this phase's shipped work; Stage P4b — the only stage that changes what actually routes — is now complete: executed in the sibling `011-runtime-engine`, which flipped all seven hubs' serving authority `legacy → compiled` behind the default-off `SPECKIT_COMPILED_ROUTING` flag (route-gold ROUTING byte-identical — only hashes changed), with a byte-identical legacy manifest retained per hub for a byte-exact rollback.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete — P4a design-faithful activation + T9 real-model verification (0 wrong-hub routes) complete for all 7 hubs, and the P4b literal cutover (`011-runtime-engine`) is complete: all 7 hubs flipped `legacy → compiled` (`servingAuthority: compiled`, `shadowOnly: false`), inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag, byte-exact rollback retained. Advisor-hook machine-enforcement remains in progress |
| **Created** | 2026-07-19 |
| **Branch** | `010-live-activation` |
| **Migration stage** | Stage P4a — design-faithful activation (bind, do not serve); the sibling P4b flip (`011`) has since advanced serving authority to compiled |
| **Blast radius** | Governance binding (selectedPolicy CAS) — reversible, pre-effect; the P4b runtime flip (`011`) is complete but held inert by default behind `SPECKIT_COMPILED_ROUTING` and reversible per-hub or fleet-wide |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The compiled router contract is shadow-complete but never *bound*. "Shadow-complete" means each hub's compiled policy is proven equivalent to the authored routing, but nothing records that a specific compiled generation is the accepted, authoritative one — the per-hub manifests all read `selectedPolicy: {null, generation: 0}` (legacy). Without a fenced binding step there is no auditable, reversible boundary between "compiled and proven" and "compiled and accepted," and no clean seam at which a future runtime cutover can flip serving authority. Conflating "bind the generation" with "serve the generation" would also make the highest-blast change (live routing) inseparable from the low-blast one (governance binding).

### Purpose

Establish a phase-local activation layer that binds each hub's compiled generation as `selectedPolicy` through a fenced compare-and-swap while leaving `servingAuthority` at `legacy`, proves a byte-exact rollback for every activation, and provides the proven, reversible foundation that the subsequent P4b flip (executed in `011-runtime-engine`) built on to move all seven hubs to compiled serving behind the default-off `SPECKIT_COMPILED_ROUTING` flag.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The seven parent hubs, activated in this order: `sk-code → mcp-tooling → system-deep-loop → cli-external-orchestration → sk-prompt → sk-design → sk-doc`.
- The shared, zero-dependency fenced-CAS activation driver `lib/activate-hub.cjs`.
- Per-hub activation manifests and audit records under this phase (`activation/<hub>/`), seeded byte-for-byte from each hub's shadow rollout child.
- The frozen-scorer pin, the canary green gate, and the byte-exact rollback proof that every activation must clear.

### Out of Scope

- The four non-hub single-skill routers - [why] different archetype (`fenced-manifest.cjs`, no `acceptance.json`), not in the seven-hub activation order.
- Stage P4b's runtime resolver build - [why] delivered in the sibling `011-runtime-engine`, not authored in this phase. (P4b has since consumed this phase's binding and flipped these activation manifests `legacy → compiled`; that flip is 011's work, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag.)
- Any edit to a live `SKILL.md`, `hub-router.json`, `mode-registry.json`, or the frozen benchmark scorer - [why] activation binds a generation; it never edits a serving policy or a protected input.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `010-live-activation/lib/activate-hub.cjs` | Create | Shared fenced-CAS activation driver (authored in this phase) |
| `010-live-activation/activation/<hub>/manifest.json` | Create | Per-hub serving manifest with the bound `selectedPolicy` and fence epoch |
| `010-live-activation/activation/<hub>/{manifest.prior.json, manifest.candidate.json, fence-state.json}` | Create | Seeded prior/candidate manifests and fence state |
| `010-live-activation/activation/<hub>/activation-record.json` | Create | Per-hub audit trail (eligibility, CAS transition, rollback proof, real-model slot) |
| `010-live-activation/{spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-2 spec docs, verification evidence, and completion record |

> All activation state is phase-local under `activation/`. Live runtime routing files remain read-only. P4a bound the candidate shadow-only with legacy serving; the sibling P4b flip (`011`) has since advanced these manifests to `servingAuthority: compiled`, `shadowOnly: false` behind the default-off `SPECKIT_COMPILED_ROUTING` flag.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Bind each of the seven hubs' compiled generation as `selectedPolicy` via a fenced CAS, advancing `fencingEpoch` `0 → 1`, while `servingAuthority` stays `legacy` and `shadowOnly` stays `true`. | Each hub's `manifest.json` binds `selectedPolicy` = the hub's compiled generation; P4a held `servingAuthority: "legacy"`, `shadowOnly: true` at fence epoch 1, and the sibling P4b flip (`011`) has since advanced the committed state to `servingAuthority: "compiled"`, `shadowOnly: false` (sk-code at fence epoch 4), retaining a byte-identical `manifest.serving-prior.json` for rollback. |
| REQ-002 | Gate every activation on the frozen benchmark scorer: re-hash the three shared scorer files and abort on any drift from the pinned digests. | The driver re-hashes `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs`; a digest mismatch aborts before any manifest write; records report `scorerFrozen=true`. |
| REQ-003 | Gate every activation on the child's canary: run the child's `harness/validate-canary.cjs` and abort on a non-zero exit. | A non-GREEN canary (route-gold not green, rollback not pass, serving-authority not legacy, or protected-digest drift) aborts activation; records report `canaryGreen=true`. |
| REQ-004 | Prove a byte-exact rollback for every hub in a scope-validated temp dir without disturbing the committed activated state. | Each record shows `rollbackProof.byteExact: true` and `restoredHash` equal to the accepted `priorManifestHash`; the committed `manifest.json` is unchanged by the drill. |
| REQ-005 | Treat the completed rollout children as read-only inputs; confine all activation state to `010-live-activation/activation/`. | The driver never writes under a child path; seed is a byte-for-byte copy; the seeded prior hash equals the accepted `priorManifestHash`. |
| REQ-006 | Emit a per-hub `activation-record.json` audit trail (eligibility, CAS transition, rollback proof, real-model verification slot). | Each `activation/<hub>/activation-record.json` records `activated`, `shippedThisRun`, the CAS transition, the rollback proof, and a `realModelVerification` slot. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | P4a T9 — real-model routing verification per hub on playbook prompts (GPT-5.6-LUNA high/fast, GPT-SOL medium/fast, MiniMax M3). | Complete: recorded in `real-model/<hub>/verdict.json` and each record's `realModelVerification` field; 40/42 pass across 3 models × 7 hubs, **0 wrong-hub routes** (the 2 non-passes are LUNA transport timeouts, correct on run2). Breadth is bounded (2 playbook prompts per hub) and honestly labeled — a sample, not full-corpus. |
| REQ-008 | Stage P4b — a runtime resolver that consumes `selectedPolicy`, plus a `servingAuthority` `legacy → compiled` flip, one hub at a time, with post-flip re-verification and proven rollback — delivered in the sibling `011-runtime-engine`. | Complete: the P4b runtime engine (`011`) is built and all 7 hubs are flipped `legacy → compiled` behind the default-off `SPECKIT_COMPILED_ROUTING` flag; each flip is canary-green via the real scorer, route-gold ROUTING byte-identical (only hashes changed), the 3 frozen scorer digests are unchanged, and the byte-exact rollback is retained (`manifest.serving-prior.json`). Commits: engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa` (pushed on v4). |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven hubs are bound — each `manifest.json` carries the compiled generation as `selectedPolicy`. P4a bound them at fence epoch 1 with `servingAuthority: "legacy"`, `shadowOnly: true`; the sibling P4b flip (`011`) has since moved the committed state to `servingAuthority: "compiled"`, `shadowOnly: false`.
- **SC-002**: Every activation proves a byte-exact rollback (`restoredHash` = accepted `priorManifestHash`) that leaves the committed activated state untouched.
- **SC-003**: The frozen-scorer pin and the canary green gate are enforced as hard preconditions; drift or a non-green canary aborts activation before any write.
- **SC-004**: The completed rollout children remain byte-unchanged; all activation state is confined to `activation/`.
- **SC-005**: Stage P4b (runtime resolver + serving-authority flip) is complete in the sibling `011-runtime-engine` — all 7 hubs flipped `legacy → compiled`, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag (routing byte-identical, so live routing is unchanged until the flag is enabled) and byte-exact-reversible — and T9 real-model verification is complete (0 wrong-hub routes). Post-flip real-model re-verification is treated as satisfied by the T9 result plus flag-off inertness; the advisor-hook machine-enforcement layer remains in progress — no premature "machine-enforced" claim.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Per-hub shadow rollout children (prior/candidate manifests + `validate-canary.cjs`) | Cannot seed or gate activation without green canary children | Green: the driver seeds byte-for-byte from each child and runs the child's canary as a precondition |
| Dependency | Frozen benchmark scorer (three pinned digests) | A drifted scorer would invalidate the canary baseline | The driver re-hashes all three files and aborts on any drift before writing |
| Risk | Conflating "bind" with "serve" | The highest-blast change (live routing) becomes inseparable from governance binding | Two-stage split: P4a binds `selectedPolicy` only; P4b (serving flip) is a separate stage, executed in `011` behind the default-off `SPECKIT_COMPILED_ROUTING` flag |
| Risk | Real-model verification cost/breadth (T9) | Verifying routing across three real models on playbook prompts is expensive and nondeterministic | Bound the breadth (sample vs full corpus) and label it honestly in the evidence; never silently truncate |
| Risk | P4b blast radius | The serving-authority flip is the only stage that changes runtime routing | Executed one-hub-at-a-time behind the default-off `SPECKIT_COMPILED_ROUTING` flag; reversible per-hub (retained serving-prior) or fleet-wide (flag off); route-gold ROUTING byte-identical, so live routing is unchanged until the flag is enabled |
| Risk | Activation mutating a completed child | A write under a child path would break a proven canary | Structural rule: activation state is confined to `activation/`; the driver never writes under a child |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The activation driver is zero-dependency CommonJS; a re-run for an already-bound hub is a no-op ship that still proves rollback (idempotent).
- **NFR-D02**: Seeding is byte-for-byte, so the seeded prior hash is bit-identical to the child's retained prior manifest hash.

### Reversibility
- **NFR-R01**: Activation is a fenced compare-and-swap with the prior manifest retained; rollback restores the byte-identical prior manifest (`restoredHash` = `priorManifestHash`).
- **NFR-R02**: Because P4a is pre-effect (no runtime consumer exists), rollback is clean; the post-effect caveat (a served flip cannot be silently undone) applies only to P4b.

### Authority
- **NFR-A01**: Binding a generation as `selectedPolicy` never confers serving authority; `servingAuthority` stayed `legacy` throughout P4a (the separate P4b flip in `011` later moved it to `compiled`).
- **NFR-A02**: The fenced CAS asserts the expected prior generation at the expected fence epoch immediately before the atomic write; a mismatch aborts.

<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Precondition failures
- Scorer digest drift: the driver aborts before any manifest write; no partial activation is possible.
- Non-green canary: a non-zero `validate-canary.cjs` exit aborts activation for that hub.

### Idempotency and re-runs
- Re-running an already-bound hub: a no-op ship that still executes and proves the rollback drill.
- Fence-epoch mismatch: the CAS compare fails and the ship aborts rather than advancing a stale fence.

### Boundary integrity
- Seed source missing/altered: a seeded prior hash that does not equal the accepted `priorManifestHash` aborts before the CAS.
- Child mutation attempt: writes are confined to `activation/`; the completed child stays byte-unchanged.

<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | One shared driver plus seven per-hub manifests/records; no new plane, seeds from existing children |
| Risk | 16/25 | Governance binding is pre-effect and reversible; the real blast (P4b serving flip) is split out and executed in `011` behind the default-off `SPECKIT_COMPILED_ROUTING` flag |
| Research | 6/20 | Mechanism is fully specified (fenced CAS, frozen-scorer pin, byte-exact rollback); residual work is real-model verification design |
| **Total** | **34/70** | **Level 2** |

<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- What sample breadth (per-hub playbook subset vs full corpus) should the P4a T9 real-model verification cover, and how is the bound recorded so it is not read as a full-corpus claim?
- What explicit signal gates the P4b cutover per hub (which green thresholds on route-gold + real models), and who authorizes the first `servingAuthority` flip?
- Do the four non-hub single-skill routers get an equivalent activation pass on their `fenced-manifest.cjs` archetype, and if so under which follow-up packet?

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Build approach**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Activation driver**: `lib/activate-hub.cjs`
- **Per-hub activation state**: `activation/<hub>/`
