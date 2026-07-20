---
title: "Implementation Plan: Compiled Routing Staged Activation Cutover (P4)"
description: "Planned delivery sequence for the terminal P4 cutover: prove the P3 coverage-closure join gate, then advance the effective default one hub at a time in ascending blast-radius order under a five-check stop-on-first-failure gate, atomically rewriting each hub's directive and catalog and advancing its cohort default, reconciling the shared create-skill templates at fleet completion, with =0 and activate --rollback as the proven rollbacks and the frozen scorer pinned throughout."
trigger_phrases:
  - "compiled routing P4 cutover plan"
  - "staged hub-by-hub activation plan"
  - "coverage-closure join gate plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/011-activation-cutover-p4"
    last_updated_at: "2026-07-20T21:44:54Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the Planned join-gate-then-per-hub-loop delivery plan"
    next_safe_action: "Prove the coverage-closure join gate green before hub 1"
    blockers:
      - "Depends on 015 children 002-010 and siblings 013/014 implemented-and-verified"
    key_files:
      - "spec.md"
      - "decision-record.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Concrete hub order within the ascending-blast-radius principle."
    answered_questions:
      - "Fleet-wide unset=on or per-hub cohort staging? Per-hub cohort staging."
---
# Implementation Plan: Compiled Routing Staged Activation Cutover (P4)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Runtime** | Node.js/CommonJS resolver + front door and the TypeScript advisor integration, consuming `002`'s tri-state flag and per-hub cohort state |
| **Current authority** | All seven activation manifests already read `servingAuthority: compiled`; the flag is off by default, so nothing serves compiled today |
| **Behavior invariant** | Compiled routing decisions stay byte-identical to legacy; this phase changes which default serves, never what routes |
| **Protected baseline** | `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` remain frozen and SHA-256-pinned |
| **Verification** | The coverage-closure join gate, then per-hub route-gold parity, serving status, clean fallback, scorer integrity, and a `=0` kill-switch drill |

### Overview

The recommended approach has two stages. First, prove the **P3 coverage-closure join gate**: every coverage and verification input from the earlier `015` children and siblings `013`/`014` must be implemented-and-verified. Second, run the **per-hub cutover loop** in ascending blast-radius order: for each hub, pass the five ordered checks stop-on-first-failure, then atomically advance that hub's cohort default and rewrite its `SKILL.md` directive and feature-catalog wording. Reconcile the two shared create-skill parent templates to fleet-default-on wording only when the seventh hub lands, under a normalized-parity fixture.

Each hub stage preserves two invariants: the three scorer files stay byte-pinned and routing decisions stay identical to legacy. Each stage carries its own rollback (`=0` fleet-wide, or `activate --rollback` per hub), so a failing hub reverses without discarding earlier landed hubs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The coverage-closure join gate inputs are all implemented-and-verified: 7 catalogs + advisor entry, 7-hub playbook matrix, Lane C compiled-parity pairs, LUNA-HIGH gold-bearing-holdout evidence, create-skill ready fixture, `verify_alignment_drift` markdown gate live, single manifest-freshness eligibility predicate, non-hub ineligibility policy, and siblings `013`/`014`.
- [ ] `002`'s tri-state flag and per-hub cohort state exist and are verified.
- [ ] `010`'s `activate --rollback` exists and restores a byte-exact prior manifest.
- [ ] Baseline SHA-256 hashes for the three frozen scorer files are captured.
- [ ] The recommended ascending-blast-radius hub order is recorded and confirmed against route-shape and volume evidence.

### Definition of Done

- [ ] Every hub was gated by the five ordered checks before its rewrite, stop-on-first-failure.
- [ ] Each cut-over hub's directive and catalog agree on the default-on + `=0` posture.
- [ ] The two shared create-skill parent templates reconcile to fleet-default-on wording; the normalized-parity fixture is green.
- [ ] `SPECKIT_COMPILED_ROUTING=0` was exercised as the fleet-wide kill-switch and per-hub `activate --rollback` was drilled.
- [ ] Frozen scorer hashes match the baseline after every hub and at fleet completion.
- [ ] The five non-hub archetypes stayed legacy by construction throughout.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Gate, then advance one hub at a time, then reconcile. Entry is a single all-green join gate. The per-hub loop is a fixed check sequence followed by an atomic rewrite and a cohort advance. Served authority stays a pure function of (cohort default, flag), fail-safe to legacy on any miss, with `=0` overriding cohort state.

### Key Components

- **Join-gate evaluator**: reports every coverage/verification input as proven or unproven and blocks hub 1 while any is unproven; requires `013`/`014` implemented-and-verified.
- **Per-hub gate**: route-gold parity, serving status, clean fallback, scorer integrity, and a `=0` drill, run in order and stop-on-first-failure.
- **Atomic rewriter**: advances a hub's cohort default and rewrites its directive and catalog in one stage.
- **Shared-template reconciler**: tracks cohort-accurate wording on both create-skill parent templates and flips them to fleet-default-on at fleet completion, bound by the normalized-parity fixture.
- **Rollback controller**: `=0` fleet-wide and `activate --rollback` per hub, with each hub's prior manifest retained before it advances.

### Data Flow

```text
coverage-closure join gate
      |
      v all-green (else block)
per-hub loop (ascending blast radius)
      |
      v  parity -> status -> fallback -> scorer -> =0 drill  (stop on first failure)
atomic rewrite: cohort default + directive + catalog
      |
      v after 7th hub
shared-template reconcile + normalized-parity fixture -> effective default reached
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

> These are the runtime and doc surfaces the eventual P4 execution touches. Each is owned or produced by an earlier `015` child; this authoring pass changes none of them.

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| Per-hub cohort `defaultEnabled` state (`002`) | Not yet advanced for any hub | Advance one hub at a time in ascending blast-radius order | N-advanced ⇒ exactly N compiled under `unset` |
| Seven hub `SKILL.md` directives | Off-by-default / opt-in wording | Rewrite to default-on + `=0` kill-switch, atomically with that hub's catalog | Per-hub directive/catalog agreement; normalized-parity fixture |
| Seven feature-catalog wordings (`006`) | Opt-in additive wording | Rewrite to default-on at the same stage as the hub's directive | Catalog validator + parity fixture |
| Both create-skill parent templates (`009`) | Literal-`1` / off-by-default wording | Track cohort-accurate wording; reconcile to fleet-default-on at fleet completion | Normalized parity across both templates + 7 directives + 7 catalogs + create-skill docs + generated-fixture tests |
| Tri-state flag read sites (`002`) | Consumed read-only | Read `unset`/`0`/`1` against cohort default; `=0` overrides | Truth-table fixture; `=0` precedence over cohort |
| Lane C compiled-parity harness (`004`) | Produces route-gold parity pairs | Consumed read-only per hub as the parity gate | compiled == legacy per hub |
| Status probe (`002`) | Reports per-hub serving authority | Consumed read-only per hub as the status gate | `compiled-serving` readout per advanced hub |
| Durable archiving (`007`) | Report-path convention + serving-snapshot + flip-history | Record per-hub cutover evidence portably | Repo-relative provenance; append-only `flip-history.jsonl` |
| `activate --rollback` (`010`) | Per-hub byte-exact manifest revert | Drilled per hub; used on any gate failure | Prior-manifest byte-exact restore |
| Frozen scorer files | Stable route-gold baseline | Read and hash only; never edit | Before/after digest equality per hub and at completion |

Required inventories before execution:

- Confirm the join-gate inputs are each implemented-and-verified, not merely available.
- Record the recommended ascending-blast-radius hub order and its route-shape/volume basis.
- Record each hub's prior manifest digest before advancing it.
- Confirm the five non-hub archetypes have no manifest and no cohort entry.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (prove the coverage-closure join gate)

- [ ] Evaluate every join-gate input and record it proven or unproven; block cutover while any is unproven.
- [ ] Confirm siblings `013`/`014` are implemented-and-verified (not "available").
- [ ] Confirm `002`'s tri-state flag + cohort state and `010`'s `activate --rollback` exist and are verified.
- [ ] Capture baseline SHA-256 for the three frozen scorer files.
- [ ] Record the recommended ascending-blast-radius hub order (`sk-code` last) and its route-shape/volume basis.
- [ ] Rollback: no runtime change in setup; if the gate is red, do not begin the loop.

### Phase 2: Implementation (the per-hub cutover loop)

- [ ] For each hub in ascending blast-radius order, run the five ordered checks stop-on-first-failure: route-gold parity (compiled == legacy), `compiled-serving` status, clean fallback, unchanged frozen-scorer SHA-256, `=0` kill-switch drill.
- [ ] Only on all five green, atomically advance that hub's cohort default and rewrite its `SKILL.md` directive and feature-catalog wording to default-on + `=0`.
- [ ] Record per-hub cutover evidence through `007`'s durable convention with repo-relative provenance.
- [ ] Retain each hub's prior manifest before advancing it; on any failure, stop at that hub and rewrite nothing further.
- [ ] After the seventh hub, reconcile both create-skill parent templates to fleet-default-on wording; run the normalized-parity fixture.
- [ ] Rollback: `SPECKIT_COMPILED_ROUTING=0` fleet-wide, or `activate --rollback` for the affected hub; revert that hub's directive/catalog/cohort together.

### Phase 3: Verification and Closeout

- [ ] Verify `=0` restores legacy serving fleet-wide, including advanced hubs.
- [ ] Verify per-hub `activate --rollback` restores byte-exact prior manifests.
- [ ] Verify the five non-hub archetypes stayed legacy by construction.
- [ ] Re-hash the frozen scorer files; run `validate.sh --strict`; record an honest Planned-or-Done state without an unproven success claim.
- [ ] Rollback: the closeout is read-only; any regression it finds routes back to a per-hub stop-and-revert.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools and Evidence |
|-----------|-------|----------------------------|
| Join gate | Coverage + verification inputs | Enumerated all-green evaluator; `013`/`014` implemented-and-verified assertion |
| Unit | Cohort resolution and flag precedence | `unset`/`0`/`1`/invalid truth table; `=0` overrides cohort; N-advanced ⇒ N compiled |
| Parity | Compiled versus legacy per hub | Frozen Lane C scorer consumed read-only; normalized routing equality (compiled == legacy) |
| Integration | Status probe + fallback per hub | `compiled-serving` readout; drift and `=0` both return legacy |
| Lockstep | Directive + catalog + templates | Per-hub directive/catalog agreement; normalized-parity fixture across both templates + 7 directives + 7 catalogs + create-skill docs |
| Rollback | Per-hub and fleet | `activate --rollback` byte-exact restore; `=0` fleet-wide legacy-serving proof |
| Non-hub | Ineligibility | Five archetypes stay legacy by construction across and after the cutover |
| Integrity | Frozen scorer pin | SHA-256 before and after every hub and at completion |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator go-ahead to begin cutover | Governance | Pending | No hub is cut over until given |
| 015 child `002` (tri-state flag + cohort state + status probe + promotion) | Sibling child | Planned | The cutover has nothing to advance, read, or resolve outside the spec tree |
| 015 children `003`-`009` (propagation, Lane C parity, playbooks+LUNA, catalogs, archiving, drift guards, templates) | Sibling children | Planned | Join-gate inputs and per-hub gates are missing |
| 015 child `010` (`activate --rollback`, non-hub policy) | Sibling child | Planned | Per-hub byte-exact rollback and non-hub exclusion are unavailable |
| Sibling phases `013`/`014` (create-skill + benchmark alignment) | Sibling phase | Planned | The join gate cannot go green (required implemented-and-verified) |
| Three frozen scorer files | Internal | Pinned | Any digest change invalidates parity evidence |
| Recommended hub order | Operations | Pending | Cutover order cannot be bounded or audited |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any red join-gate input, any failed per-hub check (parity divergence, non-`compiled-serving` status, unclean fallback, scorer digest drift, failed `=0` drill), or a post-cutover regression on a landed hub.
- **Procedure**: Stop at the current hub; set `SPECKIT_COMPILED_ROUTING=0` for fleet-wide legacy serving; run `activate --rollback` to restore the affected hub's byte-exact prior manifest; revert that hub's directive, catalog, and cohort default together; re-run the status, parity, and scorer-integrity gates before resuming.
- **Preserved gains**: Earlier landed hubs and all durable evidence remain unless they caused the fault. Rollback targets the smallest hub that introduced the regression; the run never proceeds past a failed gate.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Coverage-closure join gate (all green)
        |
        v
Per-hub loop (ascending blast radius, stop-on-first-failure)
        |
        v
Shared-template reconcile + normalized-parity fixture
        |
        v
Effective default reached
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Join gate | 002-010 + 013/014 implemented-and-verified | Per-hub loop |
| Per-hub loop | Green join gate; `002` cohort state; `004` parity; `010` rollback | Shared-template reconcile |
| Shared-template reconcile | The 7th hub landed | Effective-default declaration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Join-gate evaluation | Medium | Enumerated inputs, mostly read-only assertions over earlier children |
| Per-hub loop | High | Seven sequential gated stages with atomic rewrites and rollback evidence |
| Shared-template reconcile | Medium | One terminal reconciliation plus the normalized-parity fixture |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Cutover Checklist

- [ ] The coverage-closure join gate is green for every input.
- [ ] The target hub's prior manifest is retained and its digest recorded.
- [ ] The scorer digests match their pinned values.
- [ ] Legacy and compiled routing are equal for the target hub's route-gold corpus.
- [ ] `SPECKIT_COMPILED_ROUTING=0` has been exercised in the target environment.

### Rollback Procedure

1. Set `SPECKIT_COMPILED_ROUTING=0` and verify fleet-wide legacy serving.
2. Run `activate --rollback` to restore the target hub's byte-exact prior manifest.
3. Revert the target hub's directive, catalog, and cohort default together.
4. Re-run serving-status, parity, and scorer-integrity gates.
5. Record the failed hub, check, and evidence before another cutover attempt.

### Data Reversal

- **Has data migrations?** No persistent user data migration is planned.
- **Reversal procedure**: Manifest and cohort state return to retained prior bytes; durable evidence remains as record.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
        +-------------------------------+
        | 002 tri-state flag + cohort   |
        | + status probe + promotion    |
        +---------------+---------------+
                        |
   +--------+-----------+-----------+--------+--------+
   |        |           |           |        |        |
+--v--+ +---v---+ +-----v----+ +----v--+ +---v---+ +--v----+
|003  | |004    | |005       | |006    | |008    | |010    |
|prop | |LaneC  | |playbooks | |catalog| |drift  | |rollbk |
+--+--+ +---+---+ +-----+----+ +----+--+ +---+---+ +--+----+
   |        |           |           |        |        |
   +--------+-----+-----+-----+-----+--------+--------+
                  |     |     |
              +---v-----v-----v---+     +-------------------+
              | 009 templates     |     | 013/014 siblings  |
              +---------+---------+     +---------+---------+
                        |                         |
                +-------v-------------------------v-------+
                | 011 P4 coverage-closure JOIN GATE       |
                +-------------------+---------------------+
                                    |
                    +---------------v----------------+
                    | Per-hub cutover loop (7 hubs)  |
                    +---------------+----------------+
                                    |
                    +---------------v----------------+
                    | Shared-template reconcile      |
                    | -> effective default reached   |
                    +--------------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Join gate | 002-010 + 013/014 verified | A real green entry condition | The per-hub loop |
| Per-hub gate | 004 parity, 002 status, frozen scorer | Per-hub go/no-go | The atomic rewrite |
| Atomic rewriter | Green per-hub gate | Directive + catalog + cohort in agreement | The next hub |
| Shared-template reconciler | The 7th hub landed | Fleet-default-on templates + parity proof | Effective-default declaration |
| Rollback controller | 010 `activate --rollback`, `=0` | Byte-exact per-hub and fleet reverts | Nothing (always available) |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **All earlier `015` children and siblings `013`/`014` implemented-and-verified** - the join gate cannot go green otherwise.
2. **Coverage-closure join gate proven green** - the entry precondition for any cutover.
3. **Per-hub loop in ascending blast-radius order** - seven sequential gated stages, stop-on-first-failure, `sk-code` last.
4. **Shared-template reconcile + normalized-parity fixture** - the terminal step that reaches the effective default.

**Parallel Opportunities**:

- The earlier `015` children (`003`-`010`) are largely parallelizable once `002` lands; that parallelism is theirs, not this phase's.
- Within this phase the per-hub loop is strictly sequential by design (stop-on-first-failure), so there is no intra-loop parallelism.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Join gate green | Every coverage/verification input implemented-and-verified; `013`/`014` verified | Entry |
| M1 | First hub landed | Lowest-blast hub passes the five checks; directive + catalog + cohort agree | Hub 1 |
| M2 | Fleet advancing | Hubs cut over in ascending blast-radius order, stop-on-first-failure, evidence archived | Hubs 2-6 |
| M3 | `sk-code` landed | The highest-blast hub (surfaceBundle) passes last | Hub 7 |
| M4 | Effective default | Shared templates reconciled; normalized-parity fixture green; `=0` drilled fleet-wide | Completion |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the coverage-closure join gate is green before touching any hub.
- Read the target hub's current directive, catalog, manifest, and cohort state before rewriting.
- Capture the frozen-scorer digests and the target hub's prior manifest digest before its stage.
- Confirm the change list stays inside the current hub and names a byte-exact or flag-based rollback.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Ordered gates | Do not start a hub until the join gate is green and the prior hub's stage is fully evidenced |
| Stop-on-first-failure | On any red per-hub check, stop at that hub and rewrite nothing further |
| Atomic lockstep | Advance cohort default and rewrite directive + catalog together; never leave them disagreeing |
| Frozen scorer | Treat the three pinned scorer files as read-only and fail on digest drift |
| Reversibility | Retain each hub's prior manifest; preserve `=0` and `activate --rollback` as proven reverts |
| Non-hub exclusion | Never enter a non-hub archetype into a cohort |

### Status Reporting Format

```text
Hub: [hub-id]  (order N of 7, ascending blast radius)
Join gate: [green|red] (inputs: ...)
Checks: parity[pass|fail] status[compiled-serving|...] fallback[clean|...] scorer[pinned|drift] =0-drill[pass|fail]
Rewrite: [not-started|atomic-done] directive+catalog+cohort
Rollback evidence: [=0 result | activate --rollback result]
Next safe action: [advance next hub | stop-and-revert]
```

### Blocked Task Protocol

If a per-hub check fails, a frozen digest changes, serving status is ambiguous, or `activate --rollback` cannot be proved, stop at the current hub. Preserve the failing evidence and report the exact command, exit code, affected hub, and last verified rollback point before proposing a narrower remediation.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

The authoritative decisions remain in `decision-record.md`; this plan does not create alternatives to them.

| Decision | Status | Plan Consequence |
|----------|--------|------------------|
| Advance the default per hub via cohort state, never fleet-wide `unset=on` | Accepted | The loop advances `002`'s cohort state one hub at a time |
| Atomic per-hub lockstep; shared create-skill templates reconciled last | Accepted | Per-hub directive + catalog + cohort flip together; templates flip at fleet completion under a parity fixture |
| Gate entry on a proven join gate; per-hub stop-on-first-failure with byte-exact rollback | Accepted | No hub starts until the gate is green; a failure halts the run with a named rollback |
<!-- /ANCHOR:adr-summary -->
