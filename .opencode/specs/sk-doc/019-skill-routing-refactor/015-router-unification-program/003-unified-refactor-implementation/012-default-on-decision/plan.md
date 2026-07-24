---
title: "Implementation Plan: Compiled Routing Default-On Safe Cutover"
description: "Planned P0-to-P4 delivery sequence for the default-on ruling: establish flag governance and serving observability, enforce drift detection, run a bounded canary, single-source eligibility, then stage the global default-on cutover with a documented kill-switch."
trigger_phrases:
  - "compiled routing default-on implementation plan"
  - "P0 P4 compiled routing migration"
  - "compiled routing safe cutover plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/012-default-on-decision"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "gpt-5.6-sol"
    recent_action: "Prepared the Planned P0-to-P4 supporting plan"
    next_safe_action: "Begin P0 on operator go-ahead"
    blockers: []
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
      - "Which environment profile will host the P2 canary?"
    answered_questions:
      - "Flip the default now or adopt the phased path? Adopt the phased path, settled on the analysis; operator may override."
---
# Implementation Plan: Compiled Routing Default-On Safe Cutover

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
| **Runtime** | Node.js/CommonJS router front door plus TypeScript advisor integration |
| **Current authority** | Compiled manifests are present for seven hubs, but the runtime flag is off by default |
| **Behavior invariant** | Compiled routing decisions remain byte-identical to legacy routing decisions |
| **Protected baseline** | `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` remain frozen |
| **Verification** | Per-hub serving status, route-gold parity, drift CI, canary evidence, and kill-switch drills |

### Overview

The recommended approach is the ordered P0-to-P4 program already ruled in `decision-record.md`. P0 makes the current flag and fallback state legible, separates drift from breakage in the harness, exposes serving status per hub, and removes or explicitly guards the resolver's dependency on a spec-tree path. P1 through P4 then add drift CI, a one-profile canary, data-driven eligibility, and a hub-by-hub global default change.

Each stage preserves two invariants: the three scorer files stay byte-pinned and routing decisions stay identical to legacy. Each stage also carries its own rollback, so a later stage can be reversed without discarding earlier observability or governance gains.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The ruling is settled in `decision-record.md` (ADR-001 Accepted, adopt the phased path); an operator override to flip-now is recorded there if chosen.
- [ ] The fallback, drift-CI, observability, and migration contracts in `spec.md` and `decision-record.md` are treated as authoritative.
- [ ] Baseline hashes for the three frozen scorer files are captured before implementation.
- [ ] The P2 canary environment profile and promotion owner are named.

### Definition of Done

- [ ] P0 through P4 acceptance evidence is recorded without changing routing decisions.
- [ ] The flag is documented before any default changes.
- [ ] Drift is surfaced as drift, resolver breakage is surfaced as breakage, and per-hub authority is inspectable.
- [ ] The two eligibility consumers derive from one manifest-freshness predicate.
- [ ] `SPECKIT_COMPILED_ROUTING=0` is exercised as the fleet-wide kill-switch after the staged cutover.
- [ ] Frozen scorer hashes match the baseline after every stage.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Observe, enforce, canary, derive, then cut over. Serving authority remains data-driven and fail-safe: runtime consumption is gated by the environment flag and per-hub eligibility, while a missing or stale manifest follows the legacy path defined by the authoritative contract.

### Key Components

- **Environment contract**: documents the flag's current default, explicit enablement, and `=0` kill-switch.
- **Serving-status probe**: reports `compiled-serving`, `legacy-fallback`, or `drifted` for each hub and separates expected degradation from execution failure.
- **Drift CI**: recomputes live routing-input hashes and rejects stale manifests with a re-mint-required message.
- **Eligibility resolver**: supplies the single derived predicate consumed by both current allowlist sites.
- **Canary profile**: enables the compiled path in one bounded environment while the repository default remains off.
- **Staged cutover controller**: changes the two runtime predicates and the seven hub directives in lockstep, one hub at a time.

### Data Flow

```text
hub routing inputs
      |
      v
freshness check ---- stale/missing ----> legacy path + explicit status
      |
      v fresh
flag + serving gate ---- disabled -----> legacy path + explicit status
      |
      v enabled
compiled decision ---- parity gate ----> served only when legacy-equivalent
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `ENV-REFERENCE.md` | Source of truth for environment defaults | Document the flag, current default, explicit enablement, and `=0` kill-switch | Documentation lint plus runtime default/override probes |
| Verify harness | Treats fallback outcomes without enough cause detail | Add drift-vs-breakage classification and a per-hub status readout | Fresh, stale, missing, and broken fixtures |
| Runtime resolver/front door | Reads a resolver beneath the spec tree | Promote the resolver to a stable runtime path, or guard and document the coupling if promotion is rejected | Spec-tree move simulation and fail-safe fallback check |
| CI | Does not enforce manifest freshness | Add live-hash versus minted-digest comparison | Positive fresh case and negative re-mint-required case |
| Environment profiles | Repository default remains off | Enable one named canary profile only | Profile-specific flag assertion; all other profiles remain off |
| Eligibility consumers | Two hand-maintained hub sets | Derive both from the single manifest-freshness predicate | Consumer parity and no-manifest legacy case |
| Hub directives and runtime defaults | Seven additive directives, default-off predicate | Stage P4 changes in lockstep, one hub at a time | Per-hub route parity, status readout, and `=0` rollback |
| Frozen scorer files | Stable route-gold baseline | Read and hash only; never edit | Before/after digest equality per stage |

Required inventories before implementation:

- Locate every read of `SPECKIT_COMPILED_ROUTING` and every environment profile that can set it.
- Locate both current eligibility sets and every caller that assumes their shape.
- Record all seven hub directives and their exact fallback behavior.
- Record the resolver's current spec-tree dependency before choosing promotion or an explicit guard.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (P0 governance and observability)

- [ ] Document `SPECKIT_COMPILED_ROUTING` in the environment reference with default-off semantics and the explicit `=0` kill-switch.
- [ ] Extend the verify harness so drift-to-legacy is reported as degraded/expected while a broken resolver remains a hard failure.
- [ ] Add the per-hub serving-status readout required by the observability contract.
- [ ] Remediate the runtime-to-spec-tree resolver coupling by promoting the resolver to a stable runtime path; if the operator rejects promotion, add a loud path-integrity guard and document the residual drift source.
- [ ] Re-hash the three frozen scorer files before and after P0.
- [ ] Rollback: revert the documentation, harness, and resolver-location changes; keep the flag off and restore the prior resolver path if promotion was attempted.

### Phase 2: Implementation (P1 and P2 enforcement)

- [ ] P1: add CI that recomputes each hub's live routing-input hash and compares it with the minted manifest digest.
- [ ] P1: fail with `re-mint required: <hub>` whenever a routing input changes without a matching manifest update.
- [ ] P2: select one environment profile and enable compiled routing only there; keep the repository default and all other profiles off.
- [ ] P2: record parity, serving-status, drift, and fallback evidence for the canary.
- [ ] Re-hash the frozen scorer files after P1 and P2.
- [ ] Rollback: disable the drift-CI job without removing its diagnostic command; unset the canary override or set it to `0`.

### Phase 3: Verification and Cutover (P3 and P4)

- [ ] P3: implement one data-driven eligibility predicate using the valid-fresh-manifest rule from `decision-record.md`.
- [ ] P3: make both existing eligibility consumers derive from that predicate, retaining the old constants as a temporary rollback path until parity is proven.
- [ ] P4: change the repository default in a staged hub order, updating the two runtime predicates and each hub directive in lockstep.
- [ ] P4: after every hub, require route-gold parity, a `compiled-serving` status, clean fallback behavior, and unchanged scorer hashes before proceeding.
- [ ] P4: exercise `SPECKIT_COMPILED_ROUTING=0` as the fleet-wide kill-switch and retain per-hub manifest rollback.
- [ ] Rollback: stop at the first failed gate, set the flag to `0`, restore the affected hub's prior authority, and, if needed, restore the temporary hardcoded eligibility constants.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools and Evidence |
|-----------|-------|----------------------------|
| Documentation | Environment flag entry and kill-switch semantics | Reference lint and targeted text assertions |
| Unit | Freshness predicate, status classification, flag precedence | Fresh, missing, stale, malformed, and explicit `=0` fixtures |
| Integration | Resolver/front door plus advisor metadata | Flag-on and flag-off child-process probes |
| CI contract | Hub edit without re-mint | Temp fixture mutation; expected non-zero re-mint-required result |
| Parity | Compiled versus legacy route-gold outcomes | Frozen Lane C scorer consumed read-only; normalized routing equality |
| Canary | One environment profile only | Profile matrix proving the repository default remains off |
| Rollback | Per-hub authority and fleet kill-switch | Prior-manifest restore plus `=0` legacy-serving proof |
| Integrity | Frozen scorer pin | SHA-256 before and after every migration stage |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator go-ahead to begin implementation | Governance | Pending | No implementation stage begins until given |
| Authoritative contracts in `spec.md` and `decision-record.md` | Internal | Available | Dependent phases must not invent alternate fallback or eligibility rules |
| Create-skill onboarding alignment | Sibling phase | Planned | Future hubs cannot self-onboard as compiled-ready |
| Lane C benchmark alignment | Sibling phase | Planned | The benchmark does not yet exercise the compiled-serving path |
| Stable resolver location decision | Architecture | Pending | P0 must either remove or explicitly guard the spec-tree coupling |
| Named P2 canary profile | Operations | Pending | Canary enablement cannot be bounded or audited |
| Three frozen scorer files | Internal | Pinned | Any digest change invalidates migration evidence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any scorer digest mismatch, route-gold divergence, unresolved resolver error, unexpected environment-profile enablement, stale eligibility decision, or per-hub serving regression.
- **Procedure**: Stop the stage; set `SPECKIT_COMPILED_ROUTING=0` for fleet-wide legacy serving; restore the affected hub's retained prior manifest when a per-hub pointer changed; restore the prior resolver location or temporary eligibility constants when those components caused the failure; rerun the status and parity gates before resuming.
- **Preserved gains**: Earlier documentation, read-only diagnostics, and drift evidence remain unless they caused the fault. Rollback targets the smallest stage that introduced the regression.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Operator go-ahead to begin
        |
        v
P0 governance + observability
        |
        v
P1 drift CI -----> P2 one-profile canary
        |                 |
        +--------+--------+
                 v
         P3 derived eligibility
                 |
                 v
         P4 staged default-on
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| P0 | Operator go-ahead to begin | P1, P2 |
| P1 | P0 status classification and stable resolver decision | P3, P4 |
| P2 | P0 observability and named canary profile | P3, P4 |
| P3 | P1 green and P2 canary evidence | P4 |
| P4 | P0-P3 green, sibling alignment phases available | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| P0 governance, observability, resolver remediation | High | Largest design and harness change |
| P1 drift CI | Medium | One deterministic gate plus CI wiring |
| P2 canary | Medium | Bounded profile configuration and evidence |
| P3 eligibility | High | Two consumers move to one derived predicate |
| P4 staged cutover | High | Seven sequential gates with rollback evidence |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Cutover Checklist

- [ ] The retained prior manifest exists for the target hub.
- [ ] The scorer digests match their pinned values.
- [ ] Legacy and compiled routing are equal for the target corpus.
- [ ] The per-hub status readout reports the expected pre-cutover state.
- [ ] `SPECKIT_COMPILED_ROUTING=0` has been exercised in the target environment.

### Rollback Procedure

1. Set `SPECKIT_COMPILED_ROUTING=0` and verify fleet-wide legacy serving.
2. Restore the target hub's retained prior manifest when per-hub authority changed.
3. Restore the previous predicate or directive only for the affected stage.
4. Re-run serving-status, parity, and scorer-integrity gates.
5. Record the failed stage and evidence before another promotion attempt.

### Data Reversal

- **Has data migrations?** No persistent user data migration is planned.
- **Reversal procedure**: Configuration and manifest state return to retained prior bytes; diagnostics and reports remain as evidence.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
                +-------------------------+
                | Authoritative decision  |
                +------------+------------+
                             |
                +------------v------------+
                | P0 docs + observability |
                +------+------------+-----+
                       |            |
             +---------v--+      +--v-----------+
             | P1 drift CI|      | P2 canary    |
             +---------+--+      +--+-----------+
                       |            |
                       +------++----+
                              ||
                    +---------vv----------+
                    | P3 eligibility      |
                    +----------+----------+
                               |
          +--------------------v--------------------+
          | P4 staged hub-by-hub global default-on  |
          +--------------------+--------------------+
                               |
       +-----------------------+-----------------------+
       |                                               |
+------v------------------+                 +----------v-------------+
| create-skill alignment  |                 | benchmark alignment    |
+-------------------------+                 +------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Flag documentation | Decision contract | Governed flag semantics | Canary and global default change |
| Status probe | Runtime/front-door inspection | Per-hub authority evidence | Canary and staged cutover |
| Drift CI | Manifest freshness computation | Re-mint enforcement | Derived eligibility promotion |
| Canary profile | Status probe and parity harness | Bounded enablement evidence | Global default change |
| Eligibility resolver | Drift semantics and manifest source | One predicate for both consumers | Self-serve onboarding and P4 |
| Staged cutover | All prior gates | Effective default with kill-switch | Program outcome |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Operator go-ahead to begin implementation** - execution gate; the ruling itself is settled.
2. **P0 flag governance, observability, and resolver remediation** - prerequisite safety surface.
3. **P1 drift CI and P2 canary** - parallel only after P0 is green.
4. **P3 derived eligibility** - requires both enforcement and canary evidence.
5. **P4 staged cutover** - sequential per hub with a stop-on-first-failure gate.

**Parallel Opportunities**:

- The create-skill alignment and benchmark alignment packets can be implemented after their consumed interfaces are stable.
- P1 CI wiring and P2 profile preparation can proceed in parallel after P0, but promotion evidence joins before P3.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Ruling settled | ADR-001 Accepted in `decision-record.md` (adopt the phased path) | Done |
| M1 | Safe to observe | Flag documented; status and drift classification available; resolver coupling remediated or guarded | P0 |
| M2 | Safe to enforce | Re-mint-required CI catches stale manifests | P1 |
| M3 | Safe to canary | One profile runs flag-on with parity and clean fallback evidence | P2 |
| M4 | Safe to scale | Eligibility is derived from manifest freshness and consumers agree | P3 |
| M5 | Effective default | Seven staged gates pass and `=0` restores legacy serving | P4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the operator go-ahead to begin is recorded before starting P0.
- Read every target file and the authoritative decision contracts before editing.
- Capture the frozen-scorer digests and the relevant baseline gate before each stage.
- Confirm the change list remains inside the authorized stage and names a byte-exact or flag-based rollback.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Ordered gates | Do not start a later stage until all earlier stage exit criteria are evidenced |
| Scope lock | Modify only surfaces named by the authorized stage; route unrelated work to Follow-ups |
| Frozen scorer | Treat the three pinned scorer files as read-only and fail on digest drift |
| Reversibility | Preserve `SPECKIT_COMPILED_ROUTING=0` and each stage's rollback evidence |
| Evidence | Keep tasks and checklist items unchecked until the named command or artifact exists |

### Status Reporting Format

```text
Stage: [P0|P1|P2|P3|P4]
Status: [planned|in-progress|blocked|verified]
Changed surfaces: [paths]
Parity and scorer pin: [command + result]
Rollback evidence: [command or artifact]
Next safe action: [single stage-local action]
```

### Blocked Task Protocol

If parity fails, a frozen digest changes, serving status is ambiguous, or rollback cannot be proved, stop the current stage. Preserve the failing evidence and report the exact command, exit code, affected hub or profile, and last verified rollback point before proposing a narrower remediation.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

The authoritative decisions remain in `decision-record.md`; this plan does not create alternatives to them.

| Decision | Status | Plan Consequence |
|----------|--------|------------------|
| Defer global default-on to the staged P4 outcome | Proposed, recommended | No runtime default changes before P0-P3 evidence |
| Derive compiled eligibility from a valid fresh manifest | Proposed | P3 removes hand-maintained eligibility as the source of truth |
| Promote the resolver to a stable runtime path | Proposed, recommended | P0 removes the spec-tree layout dependency, or records an explicit guarded exception |
<!-- /ANCHOR:adr-summary -->
