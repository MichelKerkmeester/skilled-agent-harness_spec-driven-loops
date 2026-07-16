---
title: "Implementation Plan: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability"
description: "Six-phase remediation plan: ADR-001 adjudication gate first, then WS1 router fixes, WS2 harness route-gold enforcement with a new benchmark run-label, WS3 transport trust metadata, WS4 six-mode traceability, and a bounded terminal re-review of the same scope expected to reach PASS."
trigger_phrases:
  - "routing remediation plan"
  - "route-gold gate phases"
  - "hub router fix plan"
  - "adjudication gate"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/011-routing-remediation"
    last_updated_at: "2026-07-16T18:55:00Z"
    last_updated_by: "claude"
    recent_action: "Authored six-phase plan with FIX ADDENDUM covering F001-F015"
    next_safe_action: "Operator rules on ADR-001, then Phase 0 executes"
    blockers:
      - "Phase 0 ADR-001 ruling gate blocks Phases 1 and 2"
    key_files:
      - ".opencode/skills/mcp-tooling/hub-router.json"
      - ".opencode/skills/system-deep-loop/deep-improvement/scripts/skill-benchmark/run-skill-benchmark.cjs"
      - ".opencode/specs/mcp-tooling/007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-011-routing-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "ADR-001 ruling pending (Phase 0 gate)"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Routing remediation for the mcp-tooling six-mode hub: deterministic routing, route-gold benchmark enforcement, transport trust metadata, six-mode traceability

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS harness scripts (.cjs), JSON router/registry data, Markdown playbook corpora |
| **Framework** | system-deep-loop skill-benchmark harness (run/score/replay/loader); system-spec-kit validation |
| **Storage** | None (file-based corpora and frozen benchmark report folders) |
| **Testing** | Harness vitest suite (`skill-benchmark/tests/`), `router-replay.cjs` deterministic replay, `package_skill.py --check` and parent-skill checks, advisor ratchet and probes, `validate.sh --strict` |

**Workflow deviation (discovery substitution)**: This plan's discovery phase is NOT the standard parallel exploration fan-out. It is substituted by the completed 4-iteration deep review (`007-mcp-tooling-parent/007-routing-benchmark-and-review/review-report.md`, executor gpt-5.6-sol, 4/4 dimensions, 15 adjudicated findings with replay proof) plus the orchestrator's independent verification of the three P0 mechanisms against real files (recorded in that phase's `implementation-summary.md`). Rationale: the review already produced per-finding mechanisms, locations, and replay evidence at higher rigor than a fresh exploration pass would; re-discovering would duplicate verified work and risk drift from the adjudicated finding registry. Residual discovery is limited to the ADR-001 lineage check (done during planning: the original hub ADRs do not define `defaultResource`) and per-phase verification evidence.

### Overview

Fix the mcp-tooling six-mode routing surface as one coherent change set in the review's four workstreams, gated by one adjudication: first the operator rules on `defaultResource` semantics (ADR-001), then WS1 corrects the hub router data and scenario gold, WS2 makes route gold a hard benchmark gate in the shared harness (ADR-002) and re-runs the benchmark into a NEW run-label with `baseline/` frozen, WS3 fixes the Figma transport's trust metadata and sk-design pairing, WS4 regenerates the six-mode traceability surfaces, and a bounded terminal re-review of the SAME scope confirms PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented (spec.md, from the review's Planning Packet)
- [ ] Success criteria measurable (SC-001 to SC-004)
- [ ] Dependencies identified (ADR-001 ruling; shared-harness consumers)

### Definition of Done
- [ ] All acceptance criteria met (per-finding criteria under REQ-001 to REQ-004)
- [ ] Tests passing (harness vitest, replay parity, package/hub gates, ratchet, advisor probes)
- [ ] Docs updated (spec/plan/tasks; phase-007 acceptance amendment; playbook index)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Data-driven router (JSON policy and vocabulary) with a deterministic replay consumer and a scenario-gold benchmark gate; remediation follows a producer-consumer-gold alignment pattern: every semantics decision lands simultaneously in the policy data (producer), the replay/runtime paths (consumers), and the scenario corpus (gold).

### Key Components

- **`hub-router.json` (policy producer)**: routerPolicy (defaultMode, ambiguityDelta, tieBreak, outcomes, defaultResource) plus per-mode signal classes and vocabulary; WS1's primary surface.
- **`router-replay.cjs` (deterministic consumer)**: replays prompts against router data; its resource assembly (line 514 unions `defaultResource` unconditionally) is the F002 consumer; WS2 parity target.
- **`load-playbook-scenarios.cjs` (gold loader)**: parses `expected_intent`/`expected_resources` from playbook scenarios (lines 313-316); currently parsed but not hard-gated in Mode A.
- **`run-skill-benchmark.cjs` (gate)**: Mode A entry point; gains the ADR-002 route-gold flag and report fields.
- **Six packet routers and corpora**: each packet's SKILL.md runtime pseudocode plus `intra_routing_recall`/`intra-routing-recall` scenarios; F012/F013/F014/F015 surfaces.
- **Traceability projections**: hub `graph-metadata.json` derived signals, phase-007 acceptance docs, hub playbook index.

### Data Flow

Prompt text scores against vocabulary classes per mode; scores plus ambiguityDelta produce an outcome (single, orderedBundle, defer); the selected mode maps to declared resources (plus defaultResource per the ADR-001 ruling); the benchmark compares selected intents and assembled resources against scenario gold and (post-WS2) fails on any mismatch.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Planning basis: the review's Planning Packet `activeFindings` (id, severity, findingClass) mapped per finding into affected surfaces, fix class, and verification. All Planning Packet values are quoted as inert data from the review.

| Finding (severity, findingClass) | Affected surfaces | Fix class | Verification |
|----------------------------------|-------------------|-----------|--------------|
| F001 (P0, routing-positive-failure) | `hub-router.json` figma-aliases/design-transport classes; `manual_testing_playbook/hub_routing/figma_transport.md`; hub `description.json` trigger example | class-of-bug (vocabulary recall) | Replay of the committed prompt selects `mcp-figma`; route gold passes in the new benchmark run |
| F002 (P0, cross-mode-resource-contamination) | `hub-router.json` `routerPolicy.defaultResource`; `router-replay.cjs:514` union consumer; all 13 scenarios' `expected_resources` | cross-consumer (policy producer plus replay consumer plus gold) | Replay of every non-Chrome scenario assembles no Chrome resource; ADR-001 ruling recorded |
| F003 (P1, defer-contract-bypass) | `hub-router.json` hub-identity class shared at weight 4 by all six modes; `ambiguityDelta`; `outcomes.defer`; MT-004 scenario | algorithmic (discovery vs scoring separation) | MT-004 replays to defer, not a six-mode bundle; tie behavior unit-asserted |
| F004 (P1, blind-holdout-recall-gap) | `hub-router.json` vocabulary classes; `hub_routing/holdout_*.md` (MT-H02 to MT-H06) | matrix/evidence (adjudicate then bind gold) | Each retained holdout replays to intended mode; removals recorded with rationale |
| F005 (P1, cross-transport-vocabulary-collision) | `hub-router.json` design-reference-research and mobbin-aliases classes (duplicate `screen examples`); orderedBundle path | class-of-bug (provider-neutral vocabulary) | Unqualified screen-examples prompt defers or routes per spec seed; no dual-transport selection |
| F006 (P1, workspace-mutation-metadata) | `mode-registry.json:139-156` figma `toolSurface.mutatesWorkspace`; transport-axis description | instance-only (metadata semantics) | Registry mutation classes match packet command taxonomy; grep proves no other mode misdeclares |
| F007 (P1, design-judgment-pairing-gap) | `mcp-figma/SKILL.md` activation/ALWAYS/integration sections; crossHubPairing doctrine | class-of-bug (pairing precondition coverage) | Every design-affecting authoring path names the sk-design precondition; consistent with hub ADR-002 |
| F008 (P0, benchmark-route-gate-blindness) | `run-skill-benchmark.cjs`; Mode A scoring path; `load-playbook-scenarios.cjs` silent-skip; report route-gold counters | algorithmic (gate capability) plus cross-consumer (flag scope per ADR-002) | New run-label report shows routeGold rows above 0; control violation FAILS; non-hub control skill unchanged with flag off |
| F009 (P1, graph-projection-drift) | `graph-metadata.json:196-218` derived intent_signals, depends/enhances contexts, causal summary | instance-only (regenerate projection) | Derived projections cover all six modes; diff reviewed against registry inventory |
| F010 (P1, phase-acceptance-drift) | Phase-007 `spec.md:61-148`, `plan.md`, `tasks.md` three-mode framing and stale `.gitkeep`/`router-final` claims | matrix/evidence (acceptance amendment) | Amended docs name six modes and real evidence paths; `validate.sh` re-run on that phase |
| F011 (P2, playbook-index-drift) | `manual_testing_playbook/manual_testing_playbook.md` (lists 3 modes, 4 scenarios; directory holds 6 and 13) | instance-only (regenerate index) | Index enumerates 13 files and six modes; link check passes |
| F012 (P1, packet-holdout-recall-gap) | ClickUp and Mobbin packet routers plus holdout scenarios (CU-H01, CU-H02, MB-H01, MB-H02) | matrix/evidence (adjudicate semantic recall) | All 12 packet holdouts replay to declared intent or are re-adjudicated; loader-enumerated |
| F013 (P1, packet-negative-suppression-bypass) | All six packets' negative fixtures and runtime zero-score branches (incl. `UNKNOWN_FALLBACK`, ClickUp hardcoded fallback) | class-of-bug (one negative semantics) | Six negative scenarios pass under the chosen rejection-vs-fallback semantics in runtime and replay |
| F014 (P1, packet-replay-runtime-parity) | Six packet SKILL.md runtime pseudocode vs generic replay (`selectIntents`, `DEFAULT_RESOURCE` paths) | cross-consumer (parity assertions) | Parity test per documented fallback branch; CI and runtime contracts agree |
| F015 (P2, packet-base-gold-drift) | 11 positive rows across Aside (4), Chrome (3), Mobbin (2), Refero (2) omitting universal preambles from `expected_resources` | matrix/evidence (adjudicate base resources) | Adjudicated base list recorded; exact-resource scoring passes without blessing unrelated eager loads |

Required inventories:
- Same-class producers: search the router and all six packet routers for `defaultResource`, `DEFAULT_RESOURCE`, and fallback labels before editing any one of them (F002/F013/F014 are one class).
- Consumers of changed symbols: search harness, packets, and docs for `defaultResource`, `expected_intent`, `expected_resources`, `routeGold` before changing loader/report field shapes.
- Matrix axes: 13 hub scenarios (7 primary, 6 holdout) by outcome (single/bundle/defer) by resource assertion; 49 packet scenarios by packet (6) by kind (positive/holdout/negative); enumerate via the loader, not by hand.
- Algorithm invariant (routing): a scored route loads exactly its mode's declared resources; zero-score behavior is single-valued (per ADR-001 ruling) and identical in runtime, replay, and gold. Adversarial cases: hub-identity-only prompts, dual-provider phrases, zero-signal prompts, explicit multi-tool bundles.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: P0 Adjudication and regression freeze (GATE)
- [ ] Operator ruling on ADR-001 (`defaultResource` semantics); record ruling and flip ADR-001 to Accepted
- [ ] Confirm ADR-002 scope (route-gold flag, hub-type default) or record amendment
- [ ] Capture current failing replays for all 13 hub and 49 packet scenarios as frozen regression fixtures (review planSeed step 1)
- [ ] Baseline capture: current package/hub gate, ratchet, and advisor probe outputs for the regression delta

### Phase 1: WS1 hub router fixes (F001-F005)
- [ ] Apply ADR-001 ruling to `hub-router.json` and scenario `expected_resources`
- [ ] Separate hub-identity discovery evidence from per-mode scoring; executable defer for MT-004
- [ ] Fix Figma lexical recall (F001) and Refero/Mobbin provider collision (F005)
- [ ] Adjudicate and bind hub holdouts MT-H02 to MT-H06 (F004)
- [ ] Re-replay all 13 hub scenarios; certified-clean boundaries (MT-H01, aliases) unchanged

### Phase 2: WS2 harness enforcement and benchmark re-run (F008, F012-F015)
- [ ] Implement route-gold hard gate per ADR-002 (flag, loud parse failures, report fields)
- [ ] Align packet holdouts (F012), negative semantics (F013), base gold (F015); add replay/runtime parity assertions (F014)
- [ ] Prove enforcement: a previously-passing route-violating scenario now FAILS
- [ ] Re-run benchmark into NEW run-label folder; `baseline/` stays frozen; non-hub control skill unchanged

### Phase 3: WS3 transport trust metadata (F006, F007)
- [ ] Define mutation classes in `mode-registry.json` for the Figma transport (F006)
- [ ] Make sk-design pairing mandatory on all design-affecting Figma authoring paths (F007)

### Phase 4: WS4 six-mode traceability (F009-F011)
- [ ] Regenerate hub `graph-metadata.json` projections for six modes (F009)
- [ ] Amend phase-007 acceptance docs to the six-mode corpus and real evidence paths (F010)
- [ ] Regenerate the hub playbook index from the committed corpus (F011)

### Phase 5: Terminal bounded re-review
- [ ] Re-run the SAME review scope and dimensions (correctness, security, traceability, maintainability over the same sources); expect PASS
- [ ] Re-run core traceability protocols (`spec_code`, `checklist_evidence`) and `playbook_capability` overlay; expect clean
- [ ] Regression delta against Phase 0 baselines; all existing gates green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic replay | All 13 hub and 49 packet scenarios, before/after each workstream | `router-replay.cjs` via `run-skill-benchmark.cjs --trace-mode router` |
| Loader runs | Scenario/gold enumeration and parse-failure loudness | `load-playbook-scenarios.cjs`; harness vitest suite |
| Harness unit tests | Route-gold gate on/off, hub-type detection, parity assertions | `skill-benchmark/tests/*.vitest.ts` |
| Package and hub gates | Six packets plus hub structural conformance | `package_skill.py --check`; parent-skill checks |
| Advisor regression | Routing intent stability after vocabulary edits | Advisor ratchet; `advisor-probe.cjs` probes |
| Docs validation | This packet and the amended phase-007 folder | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ADR-001 operator ruling | Internal (decision) | Red (pending) | Phases 1 and 2 cannot change router data or resource gold |
| Review Planning Packet (finding registry) | Internal (evidence) | Green (committed) | None; frozen source of truth |
| Shared skill-benchmark harness | Internal (code) | Green | WS2 blocked; other consumers (sk-code, sk-design, sk-git, cli-external-orchestration, system-deep-loop) constrain the change shape per ADR-002 |
| Frozen `benchmark/baseline/` report | Internal (evidence) | Green (frozen) | Comparison anchor lost if overwritten; new runs use new run-labels |
| Deep-review loop runtime (terminal re-review) | Internal (workflow) | Green | SC-001 unverifiable; fall back to manual same-scope audit only with operator approval |
| Phase-007 acceptance docs | Internal (docs) | Green | F010 amendment blocked; spec_code protocol stays failed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any existing gate (package/hub checks, ratchet, harness vitest, non-hub control benchmark) regresses and cannot be fixed forward within the workstream; or the terminal re-review surfaces a new P0 caused by remediation.
- **Procedure**: `git revert` per workstream commit - each workstream (WS1 router data, WS2 harness plus corpora, WS3 metadata, WS4 traceability) lands as its own revertable commit (or commit series); the ADR-002 flag additionally allows behavioral rollback by policy (default off) without reverting code. The frozen `baseline/` report and Phase 0 fixtures preserve the pre-change record for verification after revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 0 (Adjudication + freeze) ──► Phase 1 (WS1 router) ──► Phase 2 (WS2 harness + re-run) ──► Phase 5 (Re-review)
                                 └─► Phase 3 (WS3 metadata) ─────────────────────────────────┘
                                 └─► Phase 4 (WS4 traceability) ─────────────────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 0 Adjudication | None | All others |
| Phase 1 WS1 router | Phase 0 (ADR-001 ruling) | Phase 2 (gold must reflect ruled semantics before hard-gating) |
| Phase 2 WS2 harness | Phase 0, Phase 1 | Phase 5 |
| Phase 3 WS3 metadata | Phase 0 | Phase 5 |
| Phase 4 WS4 traceability | Phase 0 (Phase 1 vocabulary settles graph regeneration inputs) | Phase 5 |
| Phase 5 Re-review | Phases 1-4 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0 Adjudication + freeze | Low | 1-2 hours |
| Phase 1 WS1 router | High | 4-8 hours |
| Phase 2 WS2 harness + re-run | High | 6-10 hours |
| Phase 3 WS3 metadata | Low | 1-2 hours |
| Phase 4 WS4 traceability | Medium | 2-4 hours |
| Phase 5 Re-review | Medium | 2-4 hours (loop runtime) |
| **Total** | | **16-30 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phase 0 regression fixtures captured (replay outputs, gate baselines)
- [ ] ADR-002 flag configured (route-gold gate default derivation testable per run)
- [ ] Frozen `baseline/` folder confirmed untouched before any benchmark re-run

### Rollback Procedure
1. If the route-gold gate misbehaves for other consumers: set the ADR-002 flag default off (policy rollback, no code revert)
2. Revert the offending workstream commit(s) with `git revert`
3. Re-run the harness vitest suite and one non-mcp-tooling control benchmark; verdicts must match pre-change baselines
4. Re-run `router-replay.cjs` over the Phase 0 fixtures; outputs must match the frozen record

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (file-based corpora and reports; git history is the record)
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌───────────────┐     ┌───────────────┐     ┌───────────────────┐     ┌───────────────┐
│   Phase 0     │────►│  Phase 1      │────►│  Phase 2          │────►│  Phase 5      │
│  Adjudication │     │  WS1 router   │     │  WS2 harness+run  │     │  Re-review    │
└──────┬────────┘     └───────────────┘     └───────────────────┘     └───────▲───────┘
       │              ┌───────────────┐                                       │
       ├─────────────►│  Phase 3 WS3  │───────────────────────────────────────┤
       │              └───────────────┘                                       │
       │              ┌───────────────┐                                       │
       └─────────────►│  Phase 4 WS4  │───────────────────────────────────────┘
                      └───────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| ADR-001 ruling | Operator | defaultResource semantics | WS1 router data, WS2 resource gold |
| WS1 router fixes | ADR-001 | Correct 13-scenario routing and gold | WS2 hard-gating of that gold |
| WS2 harness + corpora | ADR-002, WS1 | Route-gold gate; new run-label report | Terminal re-review evidence |
| WS3 metadata | ADR lineage (hub ADR-002) | Truthful mutation/pairing contracts | Re-review security dimension |
| WS4 traceability | WS1 vocabulary (for graph regen) | Six-mode projections, amended phase docs, index | Re-review traceability dimension |
| Terminal re-review | WS1-WS4 | PASS verdict, protocol re-runs | Packet completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 0 ADR-001 ruling** - 1-2 hours - CRITICAL
2. **Phase 1 WS1 router fixes** - 4-8 hours - CRITICAL
3. **Phase 2 WS2 harness enforcement and re-run** - 6-10 hours - CRITICAL
4. **Phase 5 terminal re-review** - 2-4 hours - CRITICAL

**Total Critical Path**: 13-24 hours

**Parallel Opportunities**:
- Phase 3 (WS3) and Phase 4 (WS4 docs/index portions) can run parallel to Phases 1-2 after the Phase 0 gate
- F009 graph regeneration waits for Phase 1 vocabulary to settle; F010/F011 do not
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Adjudication complete | ADR-001 Accepted with recorded ruling; regression fixtures frozen | End of Phase 0 |
| M2 | Hub routes deterministically | 13/13 hub scenarios replay to intended outcome with isolated resources | End of Phase 1 |
| M3 | Gate is trustworthy | Route-violating control FAILS; new run-label report with route-gold rows above 0; non-hub control unchanged | End of Phase 2 |
| M4 | Trust and traceability restored | F006/F007 contracts truthful; six-mode inventory consistent across all projections | End of Phase 4 |
| M5 | Release readiness | Same-scope re-review PASS; SC-001 to SC-004 evidenced | End of Phase 5 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Fallback-only semantics for routerPolicy.defaultResource

**Status**: Proposed (operator ruling required at Phase 0)

**Context**: `defaultResource` names the Chrome packet and is unioned into every route by the replay consumer, producing the review's F002 P0. The original hub ADR lineage (`002-architecture-decision`) defines `defaultMode` as a weak default with defer-on-ambiguity but never defines `defaultResource`.

**Decision**: Recommend fallback-only semantics: scored routes assemble exactly the selected mode's resources; `defaultResource` applies only on the zero-signal branch (or becomes the defer-time suggestion). Full record in `decision-record.md` ADR-001.

**Consequences**:
- Restores single-mode isolation and makes exact resource gold assertable
- All zero-score branches (hub and six packets) must adopt the same ruled semantics; mitigated by F013/F014 parity work in Phase 2

**Alternatives Rejected**:
- Remove `defaultResource` entirely: loses the zero-signal affordance; more gold churn for equal correctness
- Universal base gold: normalizes the contamination the review flagged as P0

### ADR-002: Route-gold hard gate as harness-wide opt-in flag, default on for hub-type skills

**Status**: Proposed

**Context**: The Mode A benchmark parses route gold but never scores it (F008); the harness is shared by other skills' frozen baselines.

**Decision**: Implement gating in the shared harness behind a flag defaulting on for hub-type skills; report records flag state and route-gold row count. Full record in `decision-record.md` ADR-002.

**Consequences**:
- A hub PASS becomes a real route-contract signal; other consumers' baselines stay valid
- Small configuration surface; hub-type detection must be unit-tested

**Alternatives Rejected**:
- mcp-tooling-only enforcement: forks shared scoring semantics and leaves the bug live for other hubs
- Unconditional harness-wide gate: retroactively invalidates other consumers' baselines without their owners' consent
