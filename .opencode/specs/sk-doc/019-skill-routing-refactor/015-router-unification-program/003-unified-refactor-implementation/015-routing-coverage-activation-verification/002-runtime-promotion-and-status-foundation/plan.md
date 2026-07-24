---
title: "Implementation Plan: Runtime Promotion & Status Foundation (P0)"
description: "Planned build sequence for the compiled-routing P0 foundation: promote the resolver/engine/activation/bundle closure to a stable runtime path, split eligibility from the engine-dispatch table, ship the per-hub status probe and wire it into advisor_status and session_bootstrap, document and tri-state the flag, add stderr breadcrumbs, and add a durable no-spec-import CI rule — all behind the still-off flag, byte-identical to legacy, with a named rollback per step and the frozen scorer never edited."
trigger_phrases:
  - "runtime promotion status foundation plan"
  - "compiled routing P0 build sequence"
  - "promote closure status probe plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/002-runtime-promotion-and-status-foundation"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the Planned build sequence for the P0 foundation"
    next_safe_action: "Begin Phase 1 inventory on operator go-ahead"
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
      - "Which stable runtime directory hosts the promoted closure?"
    answered_questions: []
---
# Implementation Plan: Runtime Promotion & Status Foundation (P0)

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
| **Runtime** | Node.js/CommonJS router front door + resolver + engine loader; TypeScript advisor integration; MCP status surfaces |
| **Current coupling** | The runtime resolver, engine loader, seven activation manifests, and seven per-hub bundles are all read from inside `.opencode/specs` |
| **Behavior invariant** | Compiled routing decisions remain byte-identical to legacy; no hub is lit by this packet |
| **Protected baseline** | `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs` remain frozen and SHA-256-pinned |
| **Verification** | Spec-tree-move simulation, eligibility cross-check, status-probe `causeCode` matrix, flag truth-table, legacy Lane C parity, frozen-digest equality |

### Overview

The simplest viable approach is a single closure move followed by four additive plumbing changes and one durable guard, all behind the still-off flag. Promote the resolver + engine loader + activation manifests + per-hub bundles to a stable runtime path so the runtime never reads under `.opencode/specs`, keeping the spec-tree copy as the authored source that builds/copies into place. Split manifest-derived eligibility from the `HUB_CHILD` engine map and add the divergence cross-check. Ship the `compiled-route-status.cjs` probe and wire it into `advisor_status` and `session_bootstrap`. Document and tri-state the flag without lighting a hub. Add stderr breadcrumbs to the three catches. Add a durable CI rule blocking future spec-imports.

Two invariants hold at every step: the three scorer files stay byte-pinned, and routing decisions stay identical to legacy. Each step carries its own byte-exact or flag rollback, so a later step reverts without discarding the promotion or observability gains earned earlier.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The parent decisions are authoritative: ADR-002 (eligibility) and ADR-003 (promote resolver) in `../../012-default-on-decision/decision-record.md`.
- [ ] Baseline SHA-256 digests for the three frozen scorer files are captured before implementation.
- [ ] The complete inventory of flag reads, eligibility consumers, engine-entrypoint call sites, activation manifests, and resolver paths exists.
- [ ] The stable runtime directory for the promoted closure is chosen (see OPEN QUESTIONS Q1).

### Definition of Done

- [ ] No runtime path reads under `.opencode/specs`, proven by a spec-tree-move simulation.
- [ ] Eligibility is derived from manifest freshness; the cross-check test fails loudly on divergence.
- [ ] `compiled-route-status.cjs --all` emits seven rows with distinct `causeCode` values, surfaced in `advisor_status` and `session_bootstrap`.
- [ ] The flag is documented in ENV-REFERENCE and tri-state in both read sites; unset stays byte-identical to today.
- [ ] The three catches emit breadcrumbs; a durable rule blocks future spec-imports.
- [ ] Frozen scorer digests match the baseline after every step; legacy Lane C replay is byte-identical.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Promote, separate, observe, govern, guard. The runtime dependency graph is pulled out of the mutable spec tree; eligibility becomes a property of manifest freshness while engine-dispatch stays a decoupled map; serving state becomes inspectable with a cause code; the flag becomes documented and tri-state without changing behavior; and a durable rule prevents the coupling from returning.

### Key Components

- **Promoted closure**: resolver + engine loader + seven activation manifests + seven per-hub bundles at a stable runtime path; the spec-tree copy is the authored source built/copied into place.
- **Stable front door**: `.opencode/bin/compiled-route.cjs` requires the promoted resolver, never reaching into `.opencode/specs`.
- **Eligibility predicate**: manifest-freshness-derived; separate from the `HUB_CHILD` engine-location map, guarded by the divergence cross-check.
- **Status probe**: `compiled-route-status.cjs --hub | --all` emitting the stable JSON contract with a `causeCode` that separates drift from breakage.
- **Flag reader**: tri-state parsing in both `resolve.cjs` and `advisor-recommend.ts`, with an empty per-hub default-on cohort pre-P4.
- **Durable guard**: a CI rule failing any future runtime `require`/import under `.opencode/specs`.

### Data Flow

```text
runtime front door (.opencode/bin)
      |
      v require (stable path, never .opencode/specs)
promoted resolver + engine loader
      |
      v
flag tri-state gate ---- '0'|'false'|'off' ----> legacy sentinel + breadcrumb
      |
      v unset(cohort) / '1'
manifest-freshness eligibility ---- stale/missing ----> legacy sentinel + causeCode
      |
      v fresh + eligible
compiled decision (byte-identical to legacy)  --->  status probe reads authority + causeCode
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `.opencode/bin/compiled-route.cjs` | Stable shim that requires into the spec tree | Require the promoted resolver from a stable runtime path; add a sentinel breadcrumb | Spec-tree-move simulation; fail-safe fallback check |
| `011-runtime-engine/lib/resolve.cjs` (authored source) | Reads activation from the spec tree; bi-state flag; silent catch | Tri-state the flag; add a breadcrumb; remain the built/copied authored source | Truth-table fixtures; move simulation; breadcrumb capture |
| `011-runtime-engine/lib/compiled-route.cjs` (authored source) | `HUB_CHILD` engine map + `loadHubEngine` | Standardize one stable per-hub engine entrypoint; keep the map decoupled from eligibility | Cross-check test; engine-load fixtures |
| `advisor-recommend.ts` | Additive attach; bi-state flag; discarded child stderr | Tri-state the flag; add a breadcrumb; stop discarding the child stderr the breadcrumb needs | Truth-table fixtures; byte-identical attach; breadcrumb visible |
| `compiled-route-status.cjs` (new) | None | Emit the stable per-hub JSON status contract for one hub or all seven | `causeCode` matrix over fresh/stale/missing/broken fixtures |
| `advisor-status.ts` (both copies) + `mk-skill-advisor.js` | Emit plugin status, no compiled fields | Surface the per-hub serving status, prompt-safe and size-capped | Output-schema review; no-secret assertion |
| `session-bootstrap.ts` | No router-posture probe | Surface the serving-status readout, no blocking spawn | Bootstrap fixture; no-spawn assertion |
| `system-spec-kit/mcp-server/ENV-REFERENCE.md` | No `SPECKIT_COMPILED_ROUTING` entry | Add the feature-flag entry: default-off, tri-state, `=0` kill-switch, eligibility gating | Reference lint; default/override text assertion |
| Runtime dirs (lint scope) | No guard against spec-imports | Add the durable no-spec-import CI rule | Positive (seeded import) and negative (clean) fixtures |
| Frozen scorer trio | Stable route-gold baseline | Read and hash only; never edit | Before/after SHA-256 equality per step |
| `../../012-default-on-decision/implementation-summary.md` | Carries a stale residual-coupling follow-up | Correct the `:170` line to match the Accepted ADR-003 | Cross-document status audit |

Required inventories before implementation:

- Locate every read of `SPECKIT_COMPILED_ROUTING` and every consumer of the resolved authority.
- Locate `COMPILED_ROUTING_HUBS`, `HUB_CHILD`, and every `loadHubEngine`/engine-entrypoint call site.
- Record all seven activation manifests and per-hub bundle locations before choosing the promotion destination.
- Capture the three frozen-scorer digests and the current legacy Lane C replay baseline.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (inventory and baselines)

- [ ] Re-verify every load-bearing receipt named in `spec.md` against source, treating each `file:line` as +/-10 and re-anchoring on the symbol.
- [ ] Capture baseline SHA-256 values for the three frozen scorer files and make digest equality a gate for every later step.
- [ ] Inventory flag reads, eligibility consumers, engine-entrypoint call sites, the seven activation manifests, and the seven per-hub bundles.
- [ ] Choose the stable runtime directory for the promoted closure and record the choice (OPEN QUESTIONS Q1).
- [ ] Rollback: none required; Phase 1 authors no runtime change.

### Phase 2: Implementation (promotion, split, observability, governance, guard)

- [ ] Promote the closure (resolver + engine loader + seven manifests + seven bundles) to the stable runtime path; point the shim's require at it; keep the spec-tree copy as the authored source with a build/copy step.
- [ ] Make promotion binding: delete the residual-coupling branch and correct `../../012-default-on-decision/implementation-summary.md:170`.
- [ ] Split manifest-derived eligibility from `HUB_CHILD`; standardize one stable per-hub engine entrypoint; add the `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` cross-check test.
- [ ] Ship `compiled-route-status.cjs --hub | --all` emitting the stable JSON contract with `causeCode`.
- [ ] Wire the readout into `spec_kit_skill_advisor_status` (both copies) and `session_bootstrap`, prompt-safe, size-capped, no blocking spawn.
- [ ] Add the `SPECKIT_COMPILED_ROUTING` entry to ENV-REFERENCE (default-off, tri-state, `=0` kill-switch, eligibility gating).
- [ ] Tri-state the flag in both read sites with an empty per-hub default-on cohort; unset resolves to legacy for all hubs.
- [ ] Add stderr breadcrumbs to the three catches without changing the fallback outcome.
- [ ] Add the durable no-spec-import lint/CI rule with positive and negative fixtures.
- [ ] Re-hash the three frozen scorer files after each change; abort on any digest drift.
- [ ] Rollback: restore the shim's prior require path; revert each plumbing edit file-locally; keep the flag off; the spec-tree closure copy is retained throughout.

### Phase 3: Verification

- [ ] Run the spec-tree-move simulation and confirm all seven hubs still resolve outside `.opencode/specs`.
- [ ] Run the eligibility cross-check, the flag truth-table (unset/`0`/`1`/invalid), and the status `causeCode` matrix (fresh/stale/missing/broken).
- [ ] Confirm legacy Lane C replay is byte-identical before and after; confirm the frozen-scorer digests match the baseline.
- [ ] Confirm the durable rule fails a seeded spec-import and passes a clean runtime; confirm the breadcrumbs appear without changing served authority.
- [ ] Run `validate.sh --strict` on this folder to Errors 0; record an honest Planned-state handoff if implementation has not begun.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools and Evidence |
|-----------|-------|----------------------------|
| Simulation | Runtime resolves outside the spec tree | Spec-tree-move fixture; assert no read under `.opencode/specs` |
| Unit | Tri-state flag precedence | Unset, `0`, `1`, `false`, `off`, and invalid fixtures |
| Unit | Eligibility vs engine-dispatch split | `sort(COMPILED_ROUTING_HUBS)===sort(keys(HUB_CHILD))` cross-check; diverging-hub-named failure |
| Unit | Status `causeCode` classification | Fresh, stale, missing-manifest, and broken-resolver fixtures |
| Integration | Front door + advisor + status surfaces | Flag-on/flag-off child-process probes; `advisor_status`/`session_bootstrap` readout |
| Parity | Compiled versus legacy route-gold | Frozen Lane C scorer consumed read-only; normalized routing equality byte-identical |
| CI contract | Future spec-import blocked | Seeded-import positive fixture (fails); clean-runtime negative fixture (passes) |
| Integrity | Frozen scorer pin | SHA-256 before and after every step |
| Governance | ENV-REFERENCE entry | Reference lint; default/override/kill-switch text assertions |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Operator go-ahead to begin implementation | Governance | Pending | No implementation step begins until given |
| Parent ADR-002 / ADR-003 contracts | Internal | Available | The promotion and eligibility split must follow the parent decisions, not invent new ones |
| Stable runtime directory choice | Architecture | Pending | Promotion cannot land without a destination (OPEN QUESTIONS Q1) |
| Three frozen scorer files | Internal | Pinned | Any digest change invalidates the parity baseline the whole program rests on |
| Downstream P1 drift-CI freshness check | Sibling phase | Planned | The promoted runtime copy has no automated staleness gate until `../010-.../` lands |
| Downstream children 003-011 | Sibling phases | Planned | All are blocked until this foundation is green |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any scorer digest mismatch, route-gold divergence, a hub lit under unset, a runtime read still under `.opencode/specs`, an ambiguous serving status, or a breadcrumb that alters served authority.
- **Procedure**: Stop the step; restore the shim's prior require path (the spec-tree closure copy is retained); revert the affected plumbing edit file-locally; keep `SPECKIT_COMPILED_ROUTING` off; re-run the move simulation, parity, and scorer-integrity gates before resuming.
- **Preserved gains**: Earlier documentation, the status probe, and the durable rule remain unless they caused the fault. Rollback targets the smallest step that introduced the regression.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Operator go-ahead to begin
        |
        v
Phase 1 inventory + baselines
        |
        v
Phase 2 promotion + split + probe + governance + guard
        |
        v
Phase 3 verification (simulation, truth-table, parity, integrity)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | Operator go-ahead | Phase 2 |
| Phase 2 | Phase 1 inventory + baseline digests | Phase 3 |
| Phase 3 | Phase 2 changes landed behind the still-off flag | Children 003-011 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Phase 1 inventory + baselines | Medium | Careful receipt re-anchoring and digest capture |
| Phase 2 closure promotion | High | The largest change: a whole runtime closure moves with a build/copy step |
| Phase 2 split + status probe | High | New CLI, contract, cross-check, and two MCP wiring points |
| Phase 2 tri-state + breadcrumbs + governance | Medium | Two read sites, three catches, one reference entry |
| Phase 2 durable no-spec-import rule | Medium | One deterministic scan plus CI wiring and fixtures |
| Phase 3 verification | High | Simulation, truth-table, parity, and integrity gates together |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checklist

- [ ] The spec-tree closure copy is retained as the authored source and rollback target.
- [ ] The scorer digests match their pinned values.
- [ ] Legacy and compiled routing are equal for the target corpus.
- [ ] The per-hub default-on cohort is confirmed empty before the tri-state change.
- [ ] `SPECKIT_COMPILED_ROUTING` off/`0` has been exercised as the safe state.

### Rollback Procedure

1. Restore the shim's require path to the spec-tree resolver; confirm fail-safe legacy serving.
2. Revert the affected plumbing edit (flag site, breadcrumb, status wiring) file-locally.
3. Re-run the move simulation, flag truth-table, and parity gates.
4. Confirm the frozen-scorer digests still match the baseline.
5. Record the failed step and evidence before another attempt.

### Data Reversal

- **Has data migrations?** No persistent user data migration is planned.
- **Reversal procedure**: Promoted runtime files revert to the retained spec-tree source bytes; documentation and diagnostics remain as evidence.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
                +-------------------------+
                | Parent ADR-002 / ADR-003 |
                +------------+------------+
                             |
                +------------v------------+
                | Closure promotion       |
                +------+------------+-----+
                       |            |
             +---------v--+      +--v-----------+
             | Elig/engine|      | Status probe |
             | split      |      | + causeCode  |
             +---------+--+      +--+-----------+
                       |            |
                       +-----+------+
                             |
                  +----------v-----------+
                  | Tri-state flag + ENV |
                  | + breadcrumbs        |
                  +----------+-----------+
                             |
                  +----------v-----------+
                  | Durable no-spec-import|
                  | CI rule              |
                  +----------+-----------+
                             |
          +------------------v------------------+
          | Foundation consumed by children 003-011 |
          +-------------------------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Closure promotion | Parent ADR-003; runtime directory choice | Runtime reads outside `.opencode/specs` | Every downstream child |
| Eligibility split | Parent ADR-002; promoted engine map | Manifest-derived eligibility + cross-check | Derived-eligibility work in 003/011 |
| Status probe | Promoted manifests; resolver | Per-hub JSON status + `causeCode` | Benchmark (004), playbooks (005), archiving (007), cutover (011) |
| Tri-state flag | Both read sites; empty cohort | Documented default-on/kill-switch semantics | Flag propagation (003); cutover (011) |
| Durable rule | Promotion landed | A gate against future spec-imports | Regression of the coupling |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Operator go-ahead to begin implementation** - execution gate; the plan itself is settled.
2. **Closure promotion** - the prerequisite that removes the spec-tree coupling; everything else builds on the stable runtime path.
3. **Eligibility split + status probe** - parallel once the closure is promoted; both read the promoted manifests.
4. **Tri-state flag + ENV entry + breadcrumbs** - governance and observability plumbing on the stable base.
5. **Durable no-spec-import rule** - locks in the promotion so it cannot silently regress.

**Parallel Opportunities**:

- The eligibility split and the status probe can proceed in parallel after promotion; both consume the promoted manifests.
- ENV-REFERENCE documentation and the durable-rule fixtures can be drafted while the promotion build/copy step is wired.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Ready to build | Baselines captured; runtime directory chosen; receipts re-anchored | Phase 1 |
| M1 | Runtime stabilized | Closure promoted; move simulation green; residual-coupling branch deleted | Phase 2 |
| M2 | Separated + observable | Eligibility split with cross-check; status probe emitting `causeCode`; wired into advisor/bootstrap | Phase 2 |
| M3 | Governed | Flag documented and tri-state; unset byte-identical; breadcrumbs in the three catches | Phase 2 |
| M4 | Guarded + verified | Durable no-spec-import rule live; parity + truth-table + integrity green; `validate --strict` Errors 0 | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm the operator go-ahead to begin is recorded before starting Phase 2.
- Read every target file and the parent decision contracts before editing.
- Capture the frozen-scorer digests and the legacy Lane C baseline before each change.
- Confirm the change list stays inside this packet's scope and names a byte-exact or flag rollback.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Ordered steps | Do not begin a later step until the earlier step's exit criteria are evidenced |
| Scope lock | Modify only the surfaces named in the AFFECTED SURFACES table; route unrelated work to Follow-ups |
| Frozen scorer | Treat the three pinned scorer files as read-only and fail on any digest drift |
| No hub lit | Keep the per-hub default-on cohort empty; unset must resolve to legacy for every hub |
| Reversibility | Preserve the spec-tree closure copy and each step's byte-exact or flag rollback |
| Evidence | Keep tasks and checklist items unchecked until the named command or artifact exists |

### Status Reporting Format

```text
Step: [inventory|promotion|split|status-probe|governance|tri-state|breadcrumb|durable-rule|verify]
Status: [planned|in-progress|blocked|verified]
Changed surfaces: [paths]
Parity and scorer pin: [command + result]
Move simulation: [command + result]
Rollback evidence: [command or artifact]
Next safe action: [single step-local action]
```

### Blocked Task Protocol

If parity diverges, a frozen digest changes, a hub lights under unset, a runtime read remains under `.opencode/specs`, or a rollback cannot be proved, stop the current step. Preserve the failing evidence and report the exact command, exit code, affected hub or surface, and last verified rollback point before proposing a narrower remediation.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

The authoritative decisions live in this packet's `decision-record.md` and the parent `../../012-default-on-decision/decision-record.md`; this plan creates no alternatives to them.

| Decision | Status | Plan Consequence |
|----------|--------|------------------|
| Bind ADR-003 and promote the full closure | Accepted (local ADR-001) | Promotion is binding; the residual-coupling branch is deleted, not guarded |
| Split eligibility from the engine-dispatch table | Accepted (local ADR-002) | `HUB_CHILD` stays an engine map; eligibility derives from manifest freshness; cross-check guards divergence |
| Ship the stable status JSON contract | Accepted (local ADR-003) | One field set + `causeCode` enum that downstream children derive from |
| Tri-state the flag with an empty cohort | Accepted (local ADR-004) | Unset stays byte-identical to today; no hub is lit before P4 |
| Add the durable no-spec-import rule | Accepted (local ADR-005) | A recurring CI gate, not a one-time move |
<!-- /ANCHOR:adr-summary -->
