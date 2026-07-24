---
title: "Feature Specification: Compiled Routing — Staged Hub-by-Hub Activation Cutover (P4)"
description: "The terminal P4 phase of the routing-coverage-activation-verification program: a staged, hub-by-hub controller that advances SPECKIT_COMPILED_ROUTING from off-by-default to the effective default, one hub at a time, via per-hub cohort state — never a fleet-wide unset=on flip, because all seven activation manifests are already servingAuthority: compiled (CF-ACT-6, verification-v1 claim 6, 7/7 confirmed), so a single unset=on would light the whole fleet at once. Entry is blocked by a P3 COVERAGE-CLOSURE JOIN GATE that requires the coverage and verification children implemented-and-verified — validated 7 catalogs + advisor entry, the 7-hub playbook matrix, Lane C compiled-parity pairs, LUNA-HIGH gold-bearing-holdout evidence, the create-skill ready fixture, the verify_alignment_drift markdown gate live, the single manifest-freshness eligibility predicate, the non-hub ineligibility policy, and sibling phases 013/014 implemented-and-verified (not merely available) (CF-ACT-7). Per hub, in ascending blast-radius order with stop-on-first-failure: route-gold parity (compiled == legacy) + compiled-serving status + clean fallback + unchanged frozen-scorer hashes + a =0 kill-switch drill, ALL green BEFORE that hub's directive and catalog wording are atomically rewritten to default-on and its cohort default is advanced (CF-CAT-2). The two shared create-skill parent templates are members of the lockstep set (CF-TPL-1) and reach fleet-default-on wording only when the final hub lands. Every step is byte-exact reversible via 010's activate --rollback and the =0 kill-switch; the three frozen scorer files are never edited; no runtime path reads under .opencode/specs; compiled routing stays byte-identical to legacy on all routing fields."
trigger_phrases:
  - "compiled routing staged hub-by-hub cutover"
  - "compiled routing P4 activation controller"
  - "compiled routing coverage-closure join gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-21T02:20:48Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built + dry-run-proved the staged cutover controller (9/9); repo default unchanged"
    next_safe_action: "Land siblings 013/014 to turn the join gate green, then run under an operator go-ahead"
    blockers:
      - "Join gate BLOCKED: siblings 013/014 and the create-skill ready fixture are Planned"
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Final hub cutover order and the concrete stop-on-first-failure thresholds, confirmed at execution against per-hub route-shape and routing-volume evidence."
    answered_questions:
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging (ADR-001); all 7 manifests are already servingAuthority: compiled, so unset=on lights the whole fleet."
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

# Compiled Routing — Staged Hub-by-Hub Activation Cutover (P4)

## EXECUTIVE SUMMARY

This is the terminal phase of the routing-coverage-activation-verification program (`015`): the staged controller that makes `SPECKIT_COMPILED_ROUTING` the **effective default**, one hub at a time. It is the P4 node of the P0→P4 safety dependency graph (`001-research/synthesis-v1.md` §5, `review-v1.md` §1) and depends on every earlier `015` child (`002-010`).

The load-bearing constraint that shapes this whole phase is a verified fact: **all seven activation manifests already read `servingAuthority: compiled, shadowOnly: false`** (`verification-v1.md` claim 6 — `cat`'d all 7, upgraded from the synthesis's own 1/7-confirmed to 7/7). The manifest gate is therefore already satisfied fleet-wide; the ONLY remaining gate is the flag. So a naive fleet-wide `unset=on` default flip would not stage anything — it would light all seven hubs at the same instant (F-5-3, CF-ACT-6). The cutover is consequently modelled as a **per-hub cohort advance**: `002` ships a tri-state flag plus a per-hub `defaultEnabled` cohort state, and this phase advances that cohort one hub at a time, so `unset` resolves to compiled for exactly the hubs that have passed their gate.

Entry is blocked by a **P3 COVERAGE-CLOSURE JOIN GATE** (CF-ACT-7). The four named coverage gaps and the verification surfaces are downstream of the activation foundation, not parallel to it, so no hub may be cut over until the coverage and verification children are **implemented-and-verified** — the phrase deliberately replaces the cyclic plan's weaker "available", which let the old P4 gate pass with zero completed catalogs, playbooks, durable evidence, or LUNA runs, and which depended on siblings `013`/`014` only being planned.

Per hub, in **ascending blast-radius order** with **stop-on-first-failure**, five gates must be green before anything is rewritten: route-gold parity (compiled == legacy), a `compiled-serving` status readout, clean fallback, unchanged frozen-scorer hashes, and a `=0` kill-switch drill. Only then does the controller **atomically** advance that hub's cohort default and rewrite that hub's `SKILL.md` directive and feature-catalog wording to default-on + kill-switch (CF-CAT-2). The two shared **create-skill parent templates** are members of the lockstep set that CF-TPL-1 says the old plan forgot; they carry cohort-accurate wording throughout and reach the fleet-default-on statement only when the final hub lands, bound by a normalized-parity test across both templates, all seven directives, all seven catalogs, and the create-skill docs.

**Hard invariants at every hub and every step:** the three frozen scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) are SHA-256-pinned and NEVER edited; compiled routing stays byte-identical to legacy on all routing fields (this phase changes *which default serves*, never *what routes*); every step names a proven rollback (`SPECKIT_COMPILED_ROUTING=0` as the documented fleet-wide kill-switch, or 010's `activate --rollback` restoring the byte-exact prior manifest per hub); no runtime path reads under `.opencode/specs`.

> **Status note.** The P4 controller is **built and dry-run-proven** (`controller/cutover-controller.cjs`, `verification/verify-cutover.cjs`; verdict 9/9 PASS). It consumes the committed runtime read-only and changes no runtime default, `SKILL.md`, template, catalog, manifest, or scorer. **No hub has been cut over**: the coverage-closure join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. Execution is gated on the join gate going green and an operator go-ahead.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Implemented (controller). The staged cutover controller and verification harness are built and dry-run-proven (9/9 PASS); no hub has been cut over. The coverage-closure join gate is BLOCKED (siblings `013`/`014` Planned) and the repository default remains OFF by design. Execution is gated on the join gate going green and a separate operator go-ahead. |
| **Created** | 2026-07-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Migration stage** | P4 — the staged hub-by-hub cutover; the terminal node of the P0→P4 program |
| **Blast radius** | Highest in the program: the actual fleet serving-default flip. Mitigated to per-hub, reversible increments by cohort staging, ascending blast-radius order, stop-on-first-failure gating, the `=0` kill-switch, and per-hub byte-exact manifest rollback |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent goal wants compiled routing to be "the effective default." Naively that reads as a one-line flip of `SPECKIT_COMPILED_ROUTING` from off to on. The `015` research proved that framing unsafe for reasons this phase must honor:

1. **`unset=on` lights the whole fleet at once.** All seven activation manifests already read `servingAuthority: compiled` (`verification-v1.md` claim 6, 7/7 confirmed). The runtime dual-gates on flag AND `servingAuthority === 'compiled'` (`resolve.cjs:40-42`, CONFIRMED). So the manifest gate is already met everywhere; the flag is the only remaining gate. A fleet-wide `unset=on` therefore cuts over all seven hubs simultaneously with no staging and no per-hub gate (F-5-3, CF-ACT-6). Per-hub cohort state is mandatory, not a nicety.
2. **The bi-state flag cannot express a per-hub default or a kill-switch.** `resolve.cjs:22-23` and `advisor-recommend.ts:362` both test `=== '1'`, so `unset` and `'0'` are identical today (CF-ACT-6, CONFIRMED). Staged default-on plus an explicit off control needs the tri-state flag and cohort state that `002` delivers; this phase consumes them.
3. **The old P4 gate could pass empty.** The pre-`015` plan let P4 "succeed" with zero completed catalogs, playbooks, durable evidence, or LUNA runs, and required siblings `013`/`014` only to be "available" though both are Planned (CF-ACT-7). A cutover that proves nothing is worse than no cutover.
4. **A rewritten catalog must not lead its hub.** Feature-catalog and `SKILL.md` wording is phase-gated by the authoring current-reality contract: opt-in through P0-P3, default-on only when that hub has passed parity, serving-status, fallback, and rollback checks (CF-CAT-2). A hub whose directive says default-on while its catalog still says opt-in (or the reverse) is a governance defect.
5. **The lockstep set was under-specified.** CF-TPL-1: the P4 lockstep named seven `SKILL.md` directives but omitted BOTH create-skill parent templates (active scaffold + copy-from), which still encode literal-`1` / off-by-default wording. Cutting over without them leaves new skills documented against the pre-cutover posture.

### Purpose

Specify a controller that turns "make compiled routing the default" into a sequence of small, gated, byte-exact-reversible per-hub increments: advance one hub's cohort default only after that hub proves compiled == legacy, serves compiled, falls back cleanly, keeps the scorer pinned, and honors the `=0` kill-switch; rewrite that hub's directive and catalog in the same atomic stage; stop at the first failed gate; and reach the fleet-wide effective default only when the coverage-closure join gate is green and every hub has landed, with the shared create-skill templates flipped last under a normalized-parity assertion.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The **P3 coverage-closure join gate**: the enumerated, all-must-be-green entry precondition (CF-ACT-7) — validated 7 catalogs + advisor entry (CF-CAT-*), the 7-hub playbook matrix (CF-PB-*), Lane C compiled-parity pairs (CF-ARC-4), LUNA-HIGH gold-bearing-holdout evidence (CF-BM-7), the create-skill ready fixture (CF-SC-5), the `verify_alignment_drift` markdown gate live (CF-SC-1), the single manifest-freshness eligibility predicate (ADR-002, HUB_CHILD-corrected), the non-hub ineligibility policy (CF-ACT-9), and sibling phases `013`/`014` **implemented-and-verified**, not "available".
- The **per-hub cohort advance**: advancing `002`'s tri-state per-hub `defaultEnabled` state one hub at a time, so `unset` resolves to compiled only for cut-over hubs. Never a fleet-wide `unset=on`.
- The **atomic per-hub lockstep**: at one stage for hub H, advance H's cohort default AND rewrite H's `SKILL.md` directive AND H's feature-catalog wording to default-on + `=0` kill-switch (CF-CAT-2).
- The **shared-template lockstep member**: both create-skill parent templates (CF-TPL-1) tracked in the controller's managed set, carrying cohort-accurate wording throughout and flipped to fleet-default-on wording at fleet completion, under a normalized-parity test across both templates + all 7 directives + all 7 catalogs + create-skill docs + generated-fixture tests.
- The **per-hub gate sequence** (ordered, stop-on-first-failure): route-gold parity (compiled == legacy) → `compiled-serving` status → clean fallback → unchanged frozen-scorer SHA-256 → `=0` kill-switch drill → THEN the atomic rewrite.
- The **blast-radius cutover order**: ascending blast radius, simplest route shape and lowest routing volume first, `sk-code` (surfaceBundle, composite routing) last.
- The **rollback contract**: `SPECKIT_COMPILED_ROUTING=0` as the documented fleet-wide kill-switch; per-hub byte-exact manifest rollback via 010's `activate --rollback`; stop-on-first-failure.

### Out of Scope

- Any change to routing **decisions** — [why] compiled must stay byte-identical to legacy on all routing fields; this program never changes what routes, only which default serves and how it is observed.
- Editing the three frozen benchmark scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) — [why] SHA-256-pinned and non-negotiable across the whole program; any verdict-shaping lives in the non-frozen orchestrator (CF-BM-4).
- Building the tri-state flag, cohort state, status probe, propagation, Lane C parity, playbooks, catalogs, archiving, drift guards, template validators, or the `--rollback` command — [why] each is owned by an earlier `015` child (`002-010`); this phase **consumes** them and fails its join gate if any is absent.
- Onboarding non-hub archetype skills (`sk-git`, `system-code-graph`, `system-skill-advisor`, `system-spec-kit`, `mcp-code-mode`) to compiled routing — [why] they are ineligible by design; the policy and negative fixtures live in `010` (CF-ACT-9), and this phase must not sweep them into a cohort.
- Flipping the actual repo default in this authoring pass — [why] this phase specifies the controller; execution is future work gated on the join gate and an operator go-ahead.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `011-activation-cutover-p4/spec.md` | Create | This P4 controller specification |
| `011-activation-cutover-p4/decision-record.md` | Create | The three cutover ADRs (cohort staging vs fleet flip; atomic lockstep + shared-template sequencing; join-gate entry + stop-on-first-failure rollback) with receipts |
| `011-activation-cutover-p4/{plan.md, tasks.md, checklist.md, implementation-summary.md}` | Create | Level-3 plan, task breakdown, verification gate, and Planned-state completion record |

> This phase authors documentation and the controller contract only. No runtime file, `SKILL.md`, create-skill template, feature-catalog, manifest, cohort state, or scorer is edited here. The runtime surfaces the eventual P4 execution touches are enumerated in `plan.md` (FIX ADDENDUM: AFFECTED SURFACES); each is owned or produced by an earlier `015` child.

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the P3 coverage-closure join gate as an all-must-be-green entry precondition, and forbid any hub cutover until it passes. | The controller enumerates every join-gate input (7 catalogs + advisor entry; 7-hub playbook matrix; Lane C compiled-parity pairs; LUNA-HIGH gold-bearing-holdout evidence; create-skill ready fixture; `verify_alignment_drift` markdown gate live; single manifest-freshness eligibility predicate; non-hub ineligibility policy; siblings `013`/`014` **implemented-and-verified**) and blocks cutover step 1 while any input is unproven. The word "available" appears nowhere as a join-gate condition (CF-ACT-7). |
| REQ-002 | Advance the default per hub via cohort state; never a fleet-wide `unset=on`. | The controller advances `002`'s per-hub `defaultEnabled` cohort state one hub at a time. It never sets a fleet-wide `unset=on` posture. A test asserts that with N of 7 hubs advanced, exactly those N hubs resolve `unset` to compiled and the remaining `7-N` resolve `unset` to legacy, given all 7 manifests already `servingAuthority: compiled` (CF-ACT-6, F-5-3). |
| REQ-003 | Gate each hub on the five ordered checks, stop-on-first-failure, before any rewrite. | For hub H, in order: route-gold parity compiled == legacy (Lane C, `004`); `compiled-serving` status readout (probe, `002`); clean fallback (drift and `=0` both return legacy); frozen-scorer SHA-256 unchanged (three files); `=0` kill-switch drill. If any check fails, the controller stops at H and rewrites nothing; H's directive, catalog, and cohort default are untouched. |
| REQ-004 | Make the per-hub rewrite atomic and lockstep. | At one stage for hub H, the controller advances H's cohort default AND rewrites H's `SKILL.md` directive AND H's feature-catalog wording to default-on + `=0` kill-switch — all together (CF-CAT-2). No intermediate state exists where H's directive and catalog disagree on the posture. |
| REQ-005 | Include BOTH create-skill parent templates in the lockstep set and flip them last under a normalized-parity assertion. | Both parent templates (active scaffold + copy-from) are tracked members of the controller's managed set (CF-TPL-1). They carry cohort-accurate wording throughout and reach fleet-default-on wording only at fleet completion. A normalized-parity test binds both templates + all 7 directives + all 7 catalogs + create-skill docs + generated-fixture tests; it is green before P4 is declared complete. |
| REQ-006 | Name a proven rollback at every step and preserve the `=0` kill-switch. | Every hub stage names its rollback: `SPECKIT_COMPILED_ROUTING=0` restores legacy fleet-wide instantly (documented kill-switch), and 010's `activate --rollback` restores that hub's byte-exact prior manifest. The controller retains each hub's prior manifest before advancing it. The frozen-scorer pin and the "no routing-decision change" invariant are restated per step; no runtime path reads under `.opencode/specs`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Fix the cutover order to ascending blast radius with `sk-code` last. | The controller cuts over hubs simplest-route-and-lowest-volume first and `sk-code` (surfaceBundle, composite routing — CF-SC-3) last. The recommended concrete order is recorded; the ordering principle (ascending blast, `sk-code` terminal) is fixed while the exact sequence is confirmed at execution against per-hub route-shape and routing-volume evidence. |
| REQ-008 | Archive per-hub cutover evidence durably and portably. | Each hub stage records parity, serving-status, fallback, scorer-integrity, `=0`-drill, and manifest-digest evidence through `007`'s durable convention (`<hub>/benchmark/compiled-routing/<run-label>/` + `serving-snapshot.json` + append-only `flip-history.jsonl`), with repo-relative provenance — never an absolute worktree path (CF-ARC-1..5). |
| REQ-009 | Honor the non-hub ineligibility policy; never sweep a non-hub into a cohort. | The controller operates only on the seven compiled-eligible hubs. A test asserts the five non-hub archetypes stay legacy by construction across the whole cutover and afterward (CF-ACT-9, `010`). |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reader can reconstruct, from this spec, why the default is advanced per-hub via cohort state rather than flipped fleet-wide, tracing it to the 7/7 `servingAuthority: compiled` fact.
- **SC-002**: The join gate is specified concretely enough that its green/red state is decidable from named artifacts, with `013`/`014` required implemented-and-verified and "available" absent as a condition.
- **SC-003**: The per-hub gate sequence, atomic lockstep, and stop-on-first-failure behavior are specified without further design, and no rewrite precedes its five green checks.
- **SC-004**: Every step names a proven rollback; `=0` is the documented fleet-wide kill-switch and 010's `activate --rollback` the per-hub byte-exact revert; the frozen-scorer pin and no-routing-change invariant are restated per step.
- **SC-005**: The status honestly reflects reality — Planned, no hub cut over, execution gated — with no premature "default-on" or "cutover complete" claim, and the create-skill templates named as a lockstep member rather than forgotten.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Fleet-wide `unset=on` used instead of cohort advance | All 7 hubs cut over at once (manifests already compiled-serving), defeating staging and stop-on-first-failure | REQ-002: advance per-hub cohort state only; a test asserts N-advanced ⇒ exactly N compiled under `unset` |
| Risk | Join gate treated as "available" rather than proven | P4 passes empty, proving nothing (the original cyclic-plan defect) | REQ-001: enumerated all-green gate; `013`/`014` implemented-and-verified; "available" forbidden as a condition |
| Risk | Catalog or directive leads its hub's actual posture | A hub advertises default-on while still opt-in (or the reverse) | REQ-004: atomic per-hub lockstep; no intermediate disagreeing state |
| Risk | Create-skill parent templates forgotten (CF-TPL-1) | New skills documented against the pre-cutover posture | REQ-005: both templates are tracked lockstep members; normalized-parity test before completion |
| Risk | A hub regresses after its gate passed | Silent drift to legacy on a later hub edit reads as broken | Consume `002` status probe + `007` snapshot; stop-on-first-failure halts the run; `=0` and `activate --rollback` restore |
| Dependency | 015 child `002` (tri-state flag + cohort state + status probe) | The cutover has nothing to advance or read without it | Join gate requires `002` implemented-and-verified |
| Dependency | 015 children `003`-`010` (propagation, Lane C parity, playbooks+LUNA, catalogs, archiving, drift guards, template validators, rollback+non-hub policy) | Each supplies a join-gate input or a per-hub gate | Join gate requires all implemented-and-verified; per-step consumption named in `plan.md` |
| Dependency | Sibling phases `013`/`014` (create-skill + benchmark alignment) | Onboarding and Lane C verification underpin the join gate | REQ-001: required implemented-and-verified, not available (CF-ACT-7) |
| Dependency | Frozen benchmark scorer (three pinned files) | Any edit invalidates the parity baseline the whole program rests on | Restated as a hard pin per hub and per step; never edited; re-hash gate aborts on drift |
| Dependency | 010's `activate --rollback` | Per-hub byte-exact manifest revert is impossible without it | Join gate requires `010` implemented-and-verified |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reversibility
- **NFR-R01**: Every hub stage names an explicit rollback; `SPECKIT_COMPILED_ROUTING=0` stays the documented, load-bearing fleet-wide kill-switch through and after the cutover.
- **NFR-R02**: Because compiled routing is byte-identical to legacy for matched hubs, each hub's rollback is behavior-neutral by construction, not merely by test; `activate --rollback` restores the byte-exact prior manifest.

### Determinism
- **NFR-D01**: With all 7 manifests `servingAuthority: compiled`, the served authority for a hub is a pure function of (cohort `defaultEnabled`, flag value): `=0` forces legacy; `=1` forces compiled; `unset` follows the hub's cohort default. Advancing N hubs yields exactly N compiled under `unset`.

### Authority
- **NFR-A01**: Serving authority is conferred only by a valid, fresh manifest under an enabled resolution for an eligible hub. The kill-switch (`=0`) overrides cohort state; no per-hub cohort default can override an explicit `=0`.

## 8. EDGE CASES

### Cohort correctness
- Hub advanced, manifest fresh: `unset` resolves compiled; `=0` still forces legacy (kill-switch precedence).
- Hub not yet advanced, manifest already compiled-serving: `unset` resolves legacy by cohort default, even though the manifest gate is met — the cohort is the staging control.
- Non-hub archetype at any point: stays legacy by construction; never enters a cohort (CF-ACT-9).

### Gate failure
- Any of the five per-hub checks red: stop at that hub; rewrite nothing; the run halts with the failing hub, check, and evidence recorded. Later hubs are not attempted.
- Frozen-scorer SHA-256 drift detected mid-run: abort immediately; this is a program-wide integrity failure, not a hub-local one.

### Kill-switch and rollback
- `=0` after a partial cutover: restores legacy serving fleet-wide instantly, including advanced hubs; documented as the kill-switch, not an incidental default.
- Per-hub revert after a hub landed: `activate --rollback` restores that hub's byte-exact prior manifest; cohort default for that hub is reverted in the same step.

### Shared-template sequencing
- Partial fleet (N of 7 advanced): create-skill parent templates carry cohort-accurate wording; they must not claim fleet-default-on before the 7th hub lands.
- Fleet complete: both templates flip to fleet-default-on wording; normalized-parity test binds them to all directives, catalogs, and create-skill docs.

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | A single controller plus a join gate and a per-hub gate sequence over seven hubs; it authors no new subsystem but orchestrates the outputs of eight earlier children in lockstep |
| Risk | 24/25 | This is the highest-blast change in the program — the actual fleet serving-default flip. Every mitigation (cohort staging, stop-on-first-failure, `=0`, per-hub byte-exact rollback) exists to keep that blast reversible and incremental |
| Research | 8/20 | Mechanism verified upstream (`synthesis-v1` + `verification-v1`: 7/7 compiled manifests, dual-gate resolver, bi-state flag, lockstep omissions); residual is execution against earlier children, not investigation |
| **Total** | **44/70** | **Level 3** — the architecture-level consequence (the effective default flip) and the decision-record, not authoring volume, set the level |

## 10. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation | Owner |
|------|-----------|--------|------------|-------|
| Cohort state advanced out of blast-radius order | Medium | Medium | REQ-007 fixes ascending order, `sk-code` last; order confirmed at execution against route-shape/volume evidence | P4 owner |
| A join-gate input regresses between proof and cutover | Medium | High | Re-assert the gate immediately before hub 1; consume live status probe rather than a cached claim | P4 owner |
| `=0` precedence broken by a per-hub cohort default | Low | High | NFR-A01 + a fixture asserting `=0` overrides cohort state for every hub | P4 owner |
| Frozen scorer edited, invalidating the parity baseline | Low | High | Hard pin restated per hub and per step; re-hash gate aborts on drift; verdict-shaping stays in the non-frozen orchestrator (CF-BM-4) | Whole program |
| Runtime reads a cohort/manifest under `.opencode/specs` | Low | High | Depends on `002`'s ADR-003 promotion (closure out of the spec tree); join gate requires it verified | P0/`002` owner |

## 11. USER STORIES

- **US-001 (release owner).** As the owner of the effective-default flip, I want to advance one hub at a time behind a green join gate, watch each land, and revert instantly with `=0` or `activate --rollback` if any hub misbehaves, so the highest-blast change in the program is a sequence of small reversible steps.
- **US-002 (maintainer).** As a maintainer of a hub mid-cutover, I want its `SKILL.md` directive and feature-catalog wording to flip together, so the docs never claim a posture the runtime has not reached.
- **US-003 (skill author).** As someone creating a new skill via create-skill, I want both parent templates to describe the current cohort-accurate posture and reach fleet-default-on wording only when the fleet does, so I never scaffold against a posture that is not live yet.
- **US-004 (operator).** As the operator, I want cutover blocked until the coverage and verification children and siblings `013`/`014` are implemented-and-verified, so P4 cannot pass having proven nothing.

## 12. OPEN QUESTIONS

- **Q1.** The concrete hub cutover order within the ascending-blast-radius principle, and the exact stop-on-first-failure thresholds (parity tolerance is zero by invariant; the question is the status/fallback evidence bar per hub). Confirmed at execution against per-hub route-shape and routing-volume evidence; `sk-code` is terminal regardless.
- **Q2.** Whether the two shared create-skill parent templates flip in one terminal step or track the cohort continuously with a final fleet-default-on reconciliation. Recommendation: track cohort-accurate wording throughout, reconcile to fleet-default-on at the 7th hub, bound by the normalized-parity test (ADR-002).
- **Q3.** Whether a single canary hub outside the `sk-code`-last order is desirable as hub 0 (a pre-flight of the whole controller on the lowest-blast hub). Recommendation: treat the first hub in ascending order as the canary and require a clean full stage before advancing.

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **The cutover decisions, receipts, and contracts**: See `decision-record.md`
- **Build approach (join gate → per-hub gate loop → fleet completion)**: See `plan.md`
- **Task breakdown**: See `tasks.md`
- **Verification checklist**: See `checklist.md`
- **Completion record (Planned state)**: See `implementation-summary.md`
- **Program spine (P0→P4 graph, per-child findings)**: `../001-research/synthesis-v1.md` §5-6, `../001-research/review-v1.md`
- **Adversarial verification (7/7 compiled manifests, frozen-scorer safety, no premature flip)**: `../001-research/verification-v1.md`
- **Phase parent**: `../spec.md`
- **Foundation consumed (tri-state flag, cohort state, status probe, resolver promotion)**: `../002-runtime-promotion-and-status-foundation/`
- **Rollback command and non-hub policy consumed**: `../010-rollback-audit-and-non-hub-policy/`
- **Sibling alignment phases required implemented-and-verified**: `../../013-create-skill-alignment/`, `../../014-benchmark-alignment/`
