---
title: "Implementation Plan: Compiled Routing Flag Propagation & Effective Consumption"
description: "Planned build sequence for un-stripping SPECKIT_COMPILED_ROUTING in both child-env allowlists and un-dropping the compiled decision through the native brief builder, the OpenCode bridge rebuild, the CLI subprocess interface, and the hook render — with manifest-fingerprint cache invalidation and e2e propagation/consumption tests. Additive, byte-identical to legacy, reversible; depends on 002."
trigger_phrases:
  - "compiled routing flag propagation plan"
  - "compiledRoute threading implementation plan"
  - "child env allowlist consumption plan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/003-flag-propagation-and-effective-consumption"
    last_updated_at: "2026-07-20T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Prepared the Planned build sequence for flag propagation and consumption"
    next_safe_action: "Begin Phase 1 once 002 lands green and the operator gives the go-ahead"
    blockers:
      - "002 promotion + tri-state flag must land before threading is meaningful"
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
      - "Full compiledRoute object or a top-level metadata.compiledRouteSummary?"
    answered_questions: []
---
# Implementation Plan: Compiled Routing Flag Propagation & Effective Consumption

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
| **Runtime** | Node.js/CommonJS launcher + `.mjs` OpenCode plugin bridge; TypeScript CLI subprocess lib; the `.opencode/plugins/mk-skill-advisor.js` hook |
| **Current state** | The flag is stripped by both `CHILD_ENV_ALLOWLIST` sets; the compiled decision is dropped at two rebuild sites (bridge `buildNativeBrief`, CLI `AdvisorRecommendation`) — default-on is a no-op end-to-end |
| **Behavior invariant** | Compiled routing decisions remain byte-identical to legacy; every change is additive |
| **Protected baseline** | `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs` remain frozen (SHA-256 pinned) |
| **Verification** | Child-env probes, bridge+plugin e2e with a real compiled decision (native + no-dist fallback), `=0` kill test, route-gold parity, frozen-digest equality |
| **Upstream dependency** | `002-runtime-promotion-and-status-foundation` (promoted closure + tri-stated flag + serving-status fingerprint) |

### Overview

The recommended approach is narrow and additive: add one literal key to two allowlists, pass the already-attached `compiledRoute` (or a compact `metadata.compiledRouteSummary`) through the three consumer surfaces that currently rebuild it away, fold a serving-state fingerprint into the two caches so a flip or `=0` invalidates a stale brief, then prove the whole chain with e2e tests across both spawn paths and a `=0` kill.

Nothing here recomputes a routing decision. The compiled decision is already attached upstream by `enrichCompiledRoutes` (`handlers/advisor-recommend.ts:371`); this phase only stops it from being stripped at the process boundary and dropped at the brief-rebuild boundary. The whole change reverts to today's no-op by removing the additions, and `SPECKIT_COMPILED_ROUTING=0` stays a live fleet-wide kill path throughout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] `002-runtime-promotion-and-status-foundation` is green: the closure is promoted out of the spec tree, the flag is tri-stated in both read sites, and the serving-status probe/fingerprint is available to consume.
- [ ] The three frozen scorer SHA-256 baselines are captured before implementation.
- [ ] The two `CHILD_ENV_ALLOWLIST` declarations, the `buildNativeBrief` rebuild, the `subprocess.ts` `AdvisorRecommendation` interface, the hook render path, and both cache sites are re-anchored on their symbols at build time (not on the cited line numbers).
- [ ] The decision on what to thread (full object vs `metadata.compiledRouteSummary`) and the fingerprint source are settled in `decision-record.md`.

### Definition of Done

- [ ] The flag reaches the daemon child on the native launcher AND the no-dist fallback path.
- [ ] A real compiled decision survives through the native brief, the CLI interface, and the hook render into the injected system-context.
- [ ] The 4-action outcome (route / clarify / defer / reject) is legible in the injected brief; absent a compiled decision the brief is byte-identical to legacy.
- [ ] A manifest flip or `=0` invalidates a stale compiled brief in both caches.
- [ ] `SPECKIT_COMPILED_ROUTING=0` disables consumption end-to-end (proven by the kill test).
- [ ] Legacy route-gold replay is byte-identical before/after; the three frozen scorer digests match baseline.
- [ ] No touched runtime path reads under `.opencode/specs`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Un-strip, then un-drop, then invalidate, then prove. The flag flows into the child env by an explicit-allowlist addition; the already-attached compiled decision flows to the agent by pass-through (never recompute) across the brief surfaces; a serving-state fingerprint makes the caches track the currently-served authority; e2e tests close the loop on both spawn paths.

### Key Components

- **Child-env allowlists**: two explicit `Set`s (`launcher:99`, `bridge:58`) that filter the spawned daemon's environment; each gains the literal `SPECKIT_COMPILED_ROUTING` key.
- **Native brief builder**: `buildNativeBrief` (`bridge:539-551`) rebuilds recommendations through a field allowlist; it gains `compiledRoute`/`metadata.compiledRouteSummary` as a pass-through field.
- **CLI subprocess interface**: `AdvisorRecommendation` in `subprocess.ts` (the second drop site) gains the optional field so the CLI brief path preserves it.
- **Hook render**: `.opencode/plugins/mk-skill-advisor.js` renders the compiled 4-action outcome into the injected system-context.
- **Cache keys**: `cacheKeyForPrompt` (`:271`) and `engineCache` (`compiled-route.cjs:33`) fold in a serving-state fingerprint so a flip/`=0` is a guaranteed miss.

### Data Flow

```text
operator env (SPECKIT_COMPILED_ROUTING)
      |
      v allowlist filter (launcher / bridge)  ---- absent ----> stripped (today's no-op)
      |
      v present in daemon child
enrichCompiledRoutes attaches compiledRoute (advisor-recommend.ts:371)
      |
      v brief rebuild (buildNativeBrief + CLI AdvisorRecommendation)
pass-through (not dropped) ---- serving-state fingerprint ----> cache (invalidates on flip/=0)
      |
      v hook render (route/clarify/defer/reject)
injected system-context reaching the agent
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Planned Action | Verification |
|---------|--------------|----------------|--------------|
| `mk-skill-advisor-launcher.cjs` `CHILD_ENV_ALLOWLIST` (`:99`) | Strips the flag from the native daemon child | Add the literal `SPECKIT_COMPILED_ROUTING` key | Native child-env probe: unset/`0`/`1` present as set |
| `mk-skill-advisor-bridge.mjs` `CHILD_ENV_ALLOWLIST` (`:58`) | Strips the flag from the bridge-spawned child | Add the same literal key | Fallback child-env probe on the no-dist chain |
| `mk-skill-advisor-bridge.mjs` `buildNativeBrief` (`:539-551`) | Rebuilds recommendations through a field allowlist that omits `compiledRoute` | Pass `compiledRoute`/`metadata.compiledRouteSummary` through the `.map()` | Bridge e2e: field present in the built brief |
| `subprocess.ts` `AdvisorRecommendation` interface | Second drop site; no `compiledRoute` field | Add the optional field | Typecheck passes; CLI brief preserves the field |
| `.opencode/plugins/mk-skill-advisor.js` render | Injects a brief into system-context; no compiled outcome | Render route/clarify/defer/reject when served | Injected-context fixture per outcome; legacy-identical when absent |
| `cacheKeyForPrompt` (`:271`) + `engineCache` (`compiled-route.cjs:33`) | Key on prompt only; no invalidation on flip | Fold in a serving-state fingerprint | Flip/`=0` fixture: previously-cached compiled brief not re-served |
| Frozen scorer files | Stable route-gold baseline | Read and hash only; never edit | Before/after digest equality |

Required inventories before implementation:

- Re-anchor each of the six runtime symbols at build time; confirm the cited lines against the live checkout (drift is expected — `subprocess.ts` interface was at `:16` here, `:25` in the review checkout).
- Confirm both allowlist Sets are explicit (no prefix matching) before adding a single literal key.
- Confirm 002 has promoted the closure and exposed a serving-state fingerprint to consume, so the cache change reads no spec-tree path.
- Enumerate every consumer of the brief shape (native + CLI + hook) so the pass-through field is added in all three, not one.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (readiness and inventory)

- [ ] Confirm 002 is green (promoted closure, tri-state flag, serving-status fingerprint available).
- [ ] Capture the three frozen scorer SHA-256 baselines.
- [ ] Re-anchor the six runtime symbols against the live checkout and record confirmed line numbers.
- [ ] Settle ADR-001 (full object vs summary) and ADR-002 (fingerprint source) in `decision-record.md`.
- [ ] Rollback: none needed; no runtime change in this phase.

### Phase 2: Implementation (propagate + consume + invalidate)

- [ ] Add `SPECKIT_COMPILED_ROUTING` to BOTH `CHILD_ENV_ALLOWLIST` sets (launcher `:99`, bridge `:58`) — one literal key each, no prefix widening.
- [ ] Pass `compiledRoute`/`metadata.compiledRouteSummary` through the bridge `buildNativeBrief` rebuild (`:539-551`) as an additive field.
- [ ] Add the optional field to the CLI `subprocess.ts` `AdvisorRecommendation` interface (second drop site) and preserve it through the CLI brief path.
- [ ] Render the compiled 4-action outcome (route/clarify/defer/reject) in the hook render before system-context injection; keep the brief byte-identical to legacy when no decision is served.
- [ ] Fold a serving-state fingerprint into `cacheKeyForPrompt` and the `engineCache` invalidation input (coordinated with 002's promoted closure; no spec-tree read).
- [ ] Re-hash the three frozen scorer files before and after.
- [ ] Rollback: remove the allowlist entries and the brief/interface/render threading; behavior returns to today's no-op.

### Phase 3: Verification (e2e + parity + kill)

- [ ] Child-env probe: flag present in the daemon child on native AND no-dist fallback paths for unset/`0`/`1`.
- [ ] Bridge+plugin e2e with a real compiled decision: `compiledRoute` survives to the injected brief on both spawn paths.
- [ ] `=0` propagation kill test: flag propagates as `0`; consumption disabled end-to-end; brief byte-identical to legacy.
- [ ] Cache invalidation: a manifest flip or `=0` produces a cache miss and a fresh brief in both caches.
- [ ] Route-gold parity: legacy replay byte-identical before/after; frozen digests match baseline.
- [ ] No-spec-read assertion on every touched runtime path.
- [ ] Rollback: the additive change is revertible by removing it; the `=0` kill path stays live.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Planned Tools and Evidence |
|-----------|-------|----------------------------|
| Unit | Allowlist membership; brief field pass-through; interface shape | Set-contains assertions; brief-object field assertions; TypeScript typecheck |
| Integration | Env propagation into the spawned daemon child | Child-process env probe on native launcher and no-dist fallback |
| e2e | Bridge + plugin carrying a real compiled decision | End-to-end brief capture showing `compiledRoute` survives to injected system-context (both spawn paths) |
| Kill test | `SPECKIT_COMPILED_ROUTING=0` end-to-end | Flag propagates as `0`; consumption disabled; brief legacy-identical |
| Cache | Manifest flip / `=0` invalidation | Fingerprint-change cache-miss fixture on `cacheKeyForPrompt` and `engineCache` |
| Parity | Compiled vs legacy route-gold | Frozen Lane C scorer consumed read-only; normalized routing equality before/after |
| Integrity | Frozen scorer pin | SHA-256 before and after implementation |
| Boundary | No runtime read under `.opencode/specs` | Resolved-path inspection on each touched file |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-runtime-promotion-and-status-foundation` | Upstream phase (P0) | Planned/prerequisite | Threading is meaningless while the resolver reads under `specs` and the flag is bi-state |
| Serving-state fingerprint from 002's status probe | Interface | Planned | The cache-invalidation slice needs one source of serving truth |
| Operator go-ahead to begin | Governance | Pending | No implementation begins until given |
| Three frozen scorer files | Internal | Pinned | Any digest change invalidates the parity baseline |
| No-dist launcher fallback path | Runtime | Available | Both spawn paths must forward the flag; the fallback is a first-class test target |
| Line-number drift in cited sources | Risk | Known | Re-anchor on symbols at build time; do not trust the cited numbers |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any scorer digest mismatch, route-gold divergence, a routing field changed by the brief rebuild, env leaking into the child beyond the one literal key, a stale compiled brief re-served after a flip/`=0`, or a touched path reading under `.opencode/specs`.
- **Procedure**: Remove the two allowlist entries and the brief/interface/render threading (behavior returns to today's end-to-end no-op); if only the cache slice faulted, revert the fingerprint input and keep the propagation/consumption additions; set `SPECKIT_COMPILED_ROUTING=0` for immediate fleet-wide legacy serving; re-run the parity and no-spec-read gates before resuming.
- **Preserved gains**: The additions are independent — allowlist entries, brief threading, and the cache slice can each be reverted alone. Rollback targets the smallest addition that introduced the regression.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
002 green (promoted closure + tri-state flag + fingerprint)
        |
        v
Phase 1 readiness + inventory
        |
        v
Phase 2 propagate (allowlists) --> consume (brief + CLI + hook) --> invalidate (caches)
        |
        v
Phase 3 e2e + parity + =0 kill
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | 002 green; operator go-ahead | Phase 2 |
| Phase 2 | Phase 1 inventory + settled ADRs | Phase 3 |
| Phase 3 | Phase 2 additions in place | 004+ consumers of the flowing decision |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Relative Effort |
|-------|------------|-----------------|
| Phase 1 readiness + inventory | Low | Symbol re-anchoring and ADR settlement |
| Phase 2 propagate + consume + invalidate | Medium | Two allowlists, three brief surfaces, two cache sites |
| Phase 3 e2e + parity + kill | Medium-High | Two spawn paths, real compiled decision, flip/kill fixtures |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Cutover Checklist

- [ ] 002 is green and its serving-state fingerprint is consumed, not recomputed.
- [ ] The three scorer digests match their pinned values.
- [ ] Legacy and compiled route-gold are equal for the target corpus.
- [ ] The `=0` kill test passes on both spawn paths.
- [ ] No touched runtime path resolves under `.opencode/specs`.

### Rollback Procedure

1. Set `SPECKIT_COMPILED_ROUTING=0` and verify fleet-wide legacy serving.
2. Remove the smallest failing addition (allowlist entry, brief-threading field, CLI interface field, hook render, or cache fingerprint).
3. Re-run the child-env probe, e2e, parity, and no-spec-read gates.
4. Record the failed addition and evidence before another attempt.

### Data Reversal

- **Has data migrations?** No. This phase changes env plumbing, brief fields, and cache keys — no persistent data.
- **Reversal procedure**: Removing the additions restores the prior byte-identical behavior; no state to migrate back.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
                +-----------------------------+
                | 002 promoted closure +      |
                | tri-state flag + fingerprint|
                +--------------+--------------+
                               |
              +----------------v----------------+
              | Flag propagation (both allowlists)|
              +--------+----------------+--------+
                       |                |
          +------------v----+   +-------v-------------+
          | Native brief +  |   | CLI subprocess      |
          | hook render     |   | AdvisorRecommendation|
          +------------+----+   +-------+-------------+
                       |                |
                       +-------+--------+
                               |
                    +----------v-----------+
                    | Cache fingerprint    |
                    | invalidation         |
                    +----------+-----------+
                               |
                    +----------v-----------+
                    | e2e + parity + kill  |
                    +----------------------+
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Flag propagation | 002 tri-state flag | Reachable flag in the daemon child | Canary; consumption tests |
| Native brief + hook render | Attached `compiledRoute` upstream | Consumed decision in system-context | Agent-facing effectiveness |
| CLI interface | Same attach | CLI-path decision survival | CLI-brief consumers |
| Cache fingerprint | 002 serving-state fingerprint | Flip/`=0`-aware caches | Correct kill-switch behavior |
| e2e + parity + kill | All above | Proof of propagation/consumption/reversibility | 004+ downstream children |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **002 green** - the promoted closure and tri-state flag are the hard prerequisite.
2. **Both allowlist additions** - without the flag in the child, nothing downstream is testable.
3. **Brief threading across all three surfaces** - native brief, CLI interface, hook render, in one coherent change.
4. **Cache fingerprint** - so the kill-switch and flip behave correctly.
5. **e2e + parity + `=0` kill** - the effectiveness and reversibility proof.

**Parallel Opportunities**:

- The two allowlist edits are independent and land together.
- The CLI interface field and the native brief field can be authored in parallel, then joined by a shared e2e.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M0 | Ready | 002 green; frozen baselines captured; ADRs settled | Phase 1 |
| M1 | Flag reachable | Flag present in the daemon child on both spawn paths | Phase 2 |
| M2 | Decision consumable | `compiledRoute` survives to the injected brief (native + CLI + hook) | Phase 2 |
| M3 | Kill-safe caches | Flip/`=0` invalidates a stale compiled brief | Phase 2 |
| M4 | Proven | e2e + parity + `=0` kill green; frozen digests unchanged; no spec-read | Phase 3 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist

- Confirm 002 is green and the operator go-ahead is recorded before starting Phase 2.
- Read every target file and re-anchor on its symbol before editing; do not trust the cited line numbers.
- Capture the frozen-scorer digests and the legacy route-gold baseline before implementation.
- Confirm the change list stays inside this packet's Files to Change and names a byte-scoped rollback.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Additive only | Pass `compiledRoute` through; never recompute a routing field in the brief |
| Explicit allowlist | Add one literal key; never introduce prefix matching |
| Frozen scorer | Treat the three pinned scorer files as read-only; fail on digest drift |
| No spec read | No touched runtime path may resolve under `.opencode/specs` |
| Both spawn paths | Every propagation/consumption claim is tested on native AND no-dist fallback |
| Evidence | Keep tasks and checklist items unchecked until the named command or artifact exists |

### Status Reporting Format

```text
Phase: [1|2|3]
Status: [planned|in-progress|blocked|verified]
Changed surfaces: [paths]
Parity and scorer pin: [command + result]
=0 kill + no-spec-read: [command + result]
Rollback evidence: [command or artifact]
Next safe action: [single phase-local action]
```

### Blocked Task Protocol

If parity fails, a frozen digest changes, the flag reaches only one spawn path, a routing field changes, or a stale compiled brief is re-served, stop the current phase. Preserve the failing evidence and report the exact command, exit code, affected spawn path or surface, and last verified rollback point before proposing a narrower remediation.
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

The authoritative decisions live in `decision-record.md`; this plan does not create alternatives to them.

| Decision | Status | Plan Consequence |
|----------|--------|------------------|
| Thread a top-level `metadata.compiledRouteSummary` (vs the full object) | Proposed, recommended | Minimizes the field surface crossing the CLI interface and the brief |
| Consume 002's serving-state fingerprint (vs a local recompute) | Proposed, recommended | One source of serving truth; the cache reads no spec-tree path |
| Render the outcome as an additive brief line (vs a structured field) | Proposed, recommended | Legacy brief stays byte-identical when no compiled decision is served |
<!-- /ANCHOR:adr-summary -->
