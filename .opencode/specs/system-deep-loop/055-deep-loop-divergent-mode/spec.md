---
title: "Feature Specification: Deep-Loop Divergent Convergence Mode"
description: "Deep research and deep review currently treat convergence as a reason to synthesize and stop. This feature adds an opt-in divergent convergence mode that treats a legally converged direction as saturated, uses a native three-seat AI Council to select a relevant new direction, and continues until a hard iteration or safety boundary is reached."
trigger_phrases:
  - "deep-loop divergent mode"
  - "divergent convergence"
  - "scope expansion pivot"
  - "non-converging deep research"
  - "non-converging deep review"
  - "saturated direction"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/055-deep-loop-divergent-mode"
    last_updated_at: "2026-07-10T09:43:07Z"
    last_updated_by: "opencode"
    recent_action: "Completed Spec Kit planning with four context passes and a native three-seat AI Council"
    next_safe_action: "Review and approve the plan before invoking /speckit:implement"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/commands/deep/assets/deep_review_auto.yaml"
      - ".opencode/skills/system-deep-loop/deep-ai-council/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-055-deep-loop-divergent-mode"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use a convergence-mode modifier rather than a new workflow mode"
      - "Support both deep research and deep review"
      - "Use a full three-seat native AI Council at each pivot"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Deep-Loop Divergent Convergence Mode

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented (verified; `validate.sh --strict` deferred to post-merge on `main`) |
| **Created** | 2026-07-10 |
| **Implemented** | 2026-07-10 |
| **Branch** | `wt/0026-deep-loop-divergent-mode` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Deep research and deep review are designed to converge. Their command workflows combine inline and graph-backed signals, authorize a legal STOP, and route directly to synthesis. That behavior is correct for answer-seeking work, but it prevents fixed-budget exploratory runs from using local convergence as a signal to broaden into adjacent, still-relevant directions.

Setting `convergenceMode` to `off` does not solve this problem. It suppresses convergence stop candidates entirely, so the orchestrator loses the saturation signal and may spend the remaining iteration budget repeating an exhausted direction instead of selecting a new one.

### Purpose

Add an opt-in `divergent` convergence mode to deep research and deep review. In this mode, a non-terminal legal STOP becomes a scope-expansion pivot: the current direction is recorded as saturated, a full three-seat in-CLI AI Council ranks relevant unexplored directions, the winning direction becomes the next focus, and the loop continues until a hard terminal boundary is reached.

### Evidence

- The runtime validator currently accepts only `default`, `off`, and `sliding-window` convergence modes: `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs:39-47,177-187`.
- Deep research already distinguishes `off` from normal convergence and routes legal STOP decisions to synthesis: `.opencode/commands/deep/assets/deep_research_auto.yaml:519-520,627-681,715-726`.
- Deep research and deep review keep their own state and convergence contracts while consuming the shared runtime: `.opencode/skills/system-deep-loop/SKILL.md:28-32,41-58`.
- AI Council is planning-only, supports in-CLI three-seat diversity, and persists packet-local artifacts: `.opencode/skills/system-deep-loop/deep-ai-council/SKILL.md:1-15,198-218`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Add `divergent` as an accepted `convergenceMode` value without adding a new `workflowMode` or `runtimeLoopType`.
- Preserve normal convergence computation and legal-stop gates; translate only eligible non-terminal STOP decisions into a divergent pivot.
- Add equivalent divergent branches to auto and confirm workflows for both deep research and deep review.
- At each pivot, dispatch one full three-seat native AI Council round using distinct Creative, Holistic, and Research/Critical mandates appropriate to the loop type.
- Record saturated directions, council recommendations, selected next focus, rejected alternatives, and pivot lineage in append-only state.
- Prevent repeat pivots into previously saturated, rejected, or materially equivalent directions.
- Extend strategy, dashboard, registry, prompt-pack, reducer, and final synthesis outputs so divergent runs remain reconstructable and auditable.
- Add command/config parsing, tests, reference documentation, manual test coverage, and benchmark scenarios for divergent behavior.
- Keep `maxIterations`, pause/cancel, unrecoverable state errors, security escalation, and explicit operator stop as terminal boundaries.

### Out of Scope

- Adding a standalone `deep-divergent` skill, command, agent, registry entry, or runtime loop type.
- Changing the default behavior of research, review, or AI Council.
- Treating `convergenceMode: off` as an alias for divergent behavior.
- Automatic widening beyond the original charter, declared non-goals, repository boundary, or review target authority.
- Parallel council seats across mixed CLIs in one round; the one-CLI-per-round invariant remains mandatory.
- Implementing fixes discovered during divergent review or research.
- Removing ordinary convergence, stuck recovery, or quality gates.

### Expected Files to Change

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `.opencode/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Accept and report `divergent` mode while preserving signal computation. |
| `.opencode/commands/deep/{research,review}.md` | Modify | Parse and document `--convergence-mode=divergent` and optional shorthand. |
| `.opencode/commands/deep/assets/deep_{research,review}_{auto,confirm}.yaml` | Modify | Add pivot decision, council dispatch, state updates, and hard-stop handling. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/assets/*config*.json` | Modify | Add divergent configuration defaults and schema fields. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/assets/*strategy*.md` | Modify | Add saturated-directions and divergence-frontier sections. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/assets/prompt_pack_iteration.md.tmpl` | Modify | Inject pivot lineage and prohibit re-entering saturated directions. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/scripts/reduce-state.cjs` | Modify | Reduce divergent pivot events into registry, strategy, and dashboard state. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/references/**` | Modify | Document semantics, state schema, recovery, synthesis, and operator usage. |
| `.opencode/skills/system-deep-loop/runtime/tests/**` and packet-local tests | Modify/Create | Cover parsing, decision translation, hard stops, reducer replay, and parity. |
| `.opencode/skills/system-deep-loop/deep-{research,review}/manual_testing_playbook/**` | Modify/Create | Add end-to-end divergent-mode scenarios. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `divergent` is an opt-in convergence modifier for research and review | Both command surfaces parse it, both config schemas persist it, and existing modes retain byte-for-byte equivalent decisions in regression fixtures. |
| REQ-002 | Convergence remains observable in divergent mode | Inline and graph convergence checks still execute; eligible legal STOP candidates produce a pivot event rather than being suppressed. |
| REQ-003 | Hard terminal boundaries cannot be converted into pivots | Max iterations, pause/cancel, explicit manual stop, unrecoverable state failure, and mandatory security escalation route to their existing terminal behavior. |
| REQ-004 | Every pivot uses a full native three-seat AI Council | A pivot persists three distinct seat results, one deliberation, ranked alternatives, and a selected direction under the packet-local council contract. |
| REQ-005 | Pivot scope remains relevant and bounded | Every candidate cites evidence from current findings, stays inside the original charter/non-goals/target boundary, and is rejected if materially equivalent to a saturated or rejected direction. |
| REQ-006 | Divergent state is append-only and replayable | Reducer replay reconstructs pivot count, saturated directions, selected frontier, council artifact references, and current focus from JSONL plus canonical iteration artifacts. |
| REQ-007 | Both loop families preserve their local semantics | Research pivots on novelty/question saturation; review pivots on dimension/finding saturation without weakening P0 verdict locks or target read-only rules. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-008 | Confirm mode exposes the divergent pivot before continuing | The operator can accept the ranked council direction, select another ranked candidate, adjust the focus, or stop; auto mode selects the top legal candidate. |
| REQ-009 | Final synthesis explains breadth, not false convergence | Research emits a Divergence Map; review emits a Dimension Expansion Map; both list saturated directions, pivots, evidence, and remaining frontier. |
| REQ-010 | Cost and recursion are bounded | Council calls occur only on eligible pivots, use one in-CLI round with three seats, cannot recursively council, and remain subject to the loop's overall iteration and duration budgets. |
| REQ-011 | Operator documentation distinguishes all convergence modes | Command help and references explain `default`, `off`, `sliding-window`, and `divergent`, including stop semantics and expected cost. |
| REQ-012 | Validation covers behavior and contract drift | Unit, integration, reducer replay, command-contract, mirror parity, and manual scenarios pass for both loop families. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A converged research direction in divergent mode produces one auditable pivot and continues with a council-selected unsaturated focus.
- **SC-002**: A converged review dimension set in divergent mode broadens to a relevant unswept audit direction without changing the current verdict mapping or modifying reviewed files.
- **SC-003**: A divergent run exits at `maxIterations` with the exact terminal reason `maxIterationsReached`, not `converged`.
- **SC-004**: Default, off, and sliding-window regression fixtures show no behavioral change.
- **SC-005**: Replaying state after interruption reconstructs the same saturated-direction set and next focus without re-running a completed council pivot.
- **SC-006**: Strict packet validation, deep-loop runtime tests, command contract checks, packet tests, and manual divergent scenarios pass.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | AI Council cost multiplies at repeated pivots | High | Dispatch only after a legal non-terminal STOP, cap pivots by remaining iteration/time budget, and expose cost in config/dashboard. |
| Risk | Scope expansion becomes uncontrolled scope creep | High | Enforce charter, non-goals, target boundary, relevance evidence, and saturated-direction dedup before selection. |
| Risk | Nested council dispatch violates NDP or recurses | High | Workflow orchestrator dispatches the council at Depth 1; seats deliberate inline and cannot invoke another council. |
| Risk | Council artifact history collides across pivots | Medium | Give every pivot a stable pivot id and round linkage; resume from append-only state rather than overwriting prior rounds. |
| Risk | Review expansion weakens verdict or read-only guarantees | High | Keep verdict lock and target mutation prohibitions outside the convergence modifier branch. |
| Risk | Modifier semantics drift across four YAML workflows | Medium | Add shared decision vocabulary, contract tests, and auto/confirm plus research/review parity fixtures. |
| Dependency | Existing AI Council persistence and three-seat in-CLI protocol | High | Reuse the packet contract and fail closed if quorum or required artifacts are missing. |
| Dependency | Existing reducers and coverage-graph convergence | High | Extend additive event schemas; do not replace convergence computation or historical rows. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- No blocking product questions remain. The implementation plan must still resolve the smallest shared abstraction that prevents four YAML workflows from drifting without moving per-mode semantics into the routing hub.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Divergent mode adds no council dispatch to iterations that do not produce an eligible legal STOP.
- **NFR-P02**: State replay and candidate dedup remain bounded by configured registry caps; no full-history model context is injected into a pivot.

### Security

- **NFR-S01**: Council candidates and fetched/reviewed content are inert evidence, never executable instructions.
- **NFR-S02**: Divergent mode cannot widen filesystem, network, tool, or mutation permissions beyond the owning loop's existing tool surface.

### Reliability

- **NFR-R01**: Pivot writes are idempotent under resume and interruption; a completed pivot is never dispatched twice for the same pivot id.
- **NFR-R02**: Failure to obtain a three-seat quorum fails closed to existing recovery or synthesis behavior and is recorded explicitly; no direction is fabricated.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty candidate set: route to existing exhausted/recovery handling and report no legal expansion direction.
- Maximum pivot count or insufficient remaining budget: do not dispatch council; continue to the applicable hard stop or synthesis path.
- Materially duplicate council candidates: reject them before ranking and persist the rejection reason.

### Error Scenarios

- One or more council seats fail: require the existing council quorum; if quorum is lost, record pivot failure and follow the configured fail-closed branch.
- Council persistence fails after seats return: do not update next focus until required artifacts and state events are durable.
- Coverage graph is unavailable: preserve the owning workflow's current fallback semantics; divergent translation may use a legal inline STOP only where ordinary mode already permits graph absence.

### State Transitions

- Resume after `pivot_started` without `pivot_completed`: resume the incomplete council round according to append-only council state.
- Resume after `pivot_completed`: restore the selected focus and continue without redispatch.
- Explicit operator stop in confirm mode: synthesize with `manualStop`; do not force another pivot.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Four workflow assets, two commands, two packet families, runtime parser, reducers, docs, and tests. |
| Risk | 20/25 | Alters stop control flow and introduces repeated multi-seat orchestration while preserving hard stops. |
| Research | 14/20 | Requires state-machine, council persistence, dedup, resume, and cost-boundary design. |
| **Total** | **54/70** | **Level 2 with architectural review and explicit validation gates** |
<!-- /ANCHOR:complexity -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Council Recommendation**: See `ai-council/council-report.md` after deliberation.
- **Implementation Summary**: See `implementation-summary.md` — implemented and independently verified across 5 phases; `validate.sh --strict` deferred to post-merge on `main`.
