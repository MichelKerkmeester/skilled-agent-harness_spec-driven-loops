---
title: "Implementation Plan: interface + audit contrasting pilots"
description: "Level-3 plan for wiring design-interface (relational-exemplar pilot) and design-audit (non-authoritative comparison lane) to the styles library through the phase-007 shared context seam, with a dependency graph, critical path, milestones, and an ADR summary."
trigger_phrases:
  - "interface audit pilots plan"
  - "design-interface pilot plan"
  - "design-audit comparison plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/008-interface-audit-pilots"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the interface/audit pilots scaffold (six L3 planning docs)"
    next_safe_action: "Wire the phase-007 seam into design-interface, then design-audit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-iface-audit-011-008"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: interface + audit contrasting pilots

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-design/{design-interface,design-audit}/` mode dirs |
| **Consumes** | Phase 004 retrieval substrate + phase 007 shared context seam (`CORPUS_CONTEXT_PLAN`) |
| **Pattern** | Two contrasting corpus consumers over one shared envelope |
| **Status** | Planned — scaffold; implementation not started |

### Overview
Two modes are wired to the styles library as contrasting pilots over the phase-007 shared seam. `design-interface` retrieves a single coherent anchor (plus an optional bounded contrast / rejected-default) and produces a relational exemplar with a decision-only, source-aware handoff. `design-audit` retrieves 0–2 comparison references, consumes them as non-authoritative context, and emits intended-anchor drift fixtures with evidence labels. The contrast between a generative consumer and a critique consumer is the mechanism that stabilizes the shared proof/handoff fields before the relationship-heavy modes (phase 009) arrive.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004 retrieval substrate is landed and callable
- [x] Phase 007 `CORPUS_CONTEXT_PLAN` envelope + proof/handoff fields are frozen
- [x] The interface and audit contracts (authority order, non-authority rules) are agreed
- [x] Fixture atlas naming convention is defined

### Definition of Done
- [x] Interface emits a relational exemplar + decision-only handoff without overriding brief/target/preflight
- [x] Audit emits non-authoritative comparison context + drift fixtures with no verdict from the corpus
- [x] Shared proof/handoff fields are populated by both pilots with contrasting shapes
- [x] Falsification + counterfactual fixtures demonstrate fail-closed behaviour
- [x] `validate.sh <folder> --strict` passes

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Two divergent consumers over a single neutral envelope. The phase-007 seam owns generation, provenance, role, transformation, fallback, and proof fields; each pilot binds those fields to its own job without extending the shared schema.

### Key Components
- **InterfaceConsumer** (`design-interface/`): anchor + bounded-contrast retrieval, relational exemplar builder, decision-only handoff emitter, counterfactual recorder.
- **AuditConsumer** (`design-audit/`): non-authoritative comparison retrieval, intended-anchor drift detector, evidence labeller.
- **Shared seam (phase 007, consumed)**: `CORPUS_CONTEXT_PLAN` envelope + proof/handoff fields.
- **Fixture atlas**: maintainer-facing positive / no-fit / rejected-default / drift / comparison-unavailable cases.

### Data Flow
```
brief/target ─▶ phase-004 retrieval ─▶ phase-007 envelope ─┬─▶ InterfaceConsumer ─▶ relational exemplar + decision-only handoff
                                                           └─▶ AuditConsumer ─────▶ non-authoritative context + drift fixtures
                          (corpus never overrides brief / target evidence / preflight)
```

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Contract binding
- [x] Bind the phase-007 envelope fields into both mode contracts
- [x] Fix the authority order (brief > mode judgment > target evidence > corpus > transport)

### Phase 2: Interface pilot
- [x] Anchor + optional bounded-contrast retrieval
- [x] Relational exemplar builder
- [x] Decision-only, source-aware handoff emitter
- [x] Counterfactual (no-corpus default) recorder

### Phase 3: Audit lane
- [x] 0–2 non-authoritative comparison retrieval
- [x] Intended-anchor drift detector + evidence labels
- [x] Non-authority guards (no severity/score/WCAG/perf/copying/fix)

### Phase 4: Fixtures + verification
- [x] Falsification (counterexample) fixtures — fail-closed
- [x] Maintainer fixture atlas (no user gallery)
- [x] Cross-pilot shared-field verification

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Approach | Target |
|-----------|-------|----------|--------|
| Contract | Authority order, non-authority guards | Fixture assertions | Corpus never overrides brief/target |
| Interface | Anchor/contrast retrieval, handoff | Positive + no-fit + rejected-default fixtures | Decision-only handoff, `anchor:null` path |
| Audit | Comparison context, drift | Drift + comparison-unavailable fixtures | No corpus verdict |
| Shared-field | Proof/handoff population | Both pilots write the same fields | Contrasting content, stable shape |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 retrieval substrate | Internal (sibling phase) | Planned | No anchors/comparison refs; both pilots blocked |
| Phase 007 shared context seam | Internal (predecessor) | Planned | No envelope/proof/handoff fields; both pilots blocked |
| Styles library corpus | Internal | Available (read-only) | No corpus evidence to ground/compare |
| `design-interface` / `design-audit` runtimes | Internal | Available | Nothing to wire into |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The corpus path emits authority it should not, or a pilot overrides brief/target/preflight.
- **Procedure**: Feature-gate both consumers off; both modes fall back to their pre-corpus behaviour. Envelope, proof, and handoff fields are additive, so disabling the consumers leaves phases 004/007 intact.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Contract) ──▶ Phase 2 (Interface) ──┐
                   └──▶ Phase 3 (Audit) ──────┴──▶ Phase 4 (Fixtures + verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Contract binding | Phase 004, Phase 007 | Interface, Audit |
| Interface pilot | Contract | Fixtures |
| Audit lane | Contract | Fixtures |
| Fixtures + verify | Interface, Audit | None (phase 009 consumes stabilized fields) |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Component | Complexity | Estimated Effort |
|-----------|------------|------------------|
| Interface pilot | High | 8–12 days |
| Audit lane | Medium-high | 6–11 days |
| **Combined (with shared-field overlap)** | | **~11–18 days (overlap-reduced from the naive 14–23)** |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Phase 004 + 007 landed and tagged
- [x] Feature gate for each consumer defined
- [x] Fixture atlas baseline captured

### Rollback Procedure
1. **Immediate**: disable the interface and audit corpus consumers via their feature gates.
2. **Verify**: both modes run their pre-corpus behaviour; phase-007 fields remain but unread.
3. **Discard fixtures**: remove the mode-local fixture atlas additions if reverting fully.

<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌────────────────────┐      ┌────────────────────┐
│ Phase 004          │      │ Phase 007          │
│ retrieval substrate│      │ shared context seam│
└─────────┬──────────┘      └─────────┬──────────┘
          └───────────┬───────────────┘
                      ▼
             ┌────────────────┐
             │ Contract bind  │
             └───────┬────────┘
              ┌──────┴───────┐
              ▼              ▼
      ┌───────────────┐ ┌───────────────┐
      │ Interface     │ │ Audit lane    │
      │ pilot         │ │ (comparison)  │
      └───────┬───────┘ └───────┬───────┘
              └───────┬─────────┘
                      ▼
             ┌────────────────┐
             │ Fixtures +     │
             │ verification   │
             └────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Contract bind | Phase 004, Phase 007 | bound envelope fields | Interface, Audit |
| Interface pilot | Contract | relational exemplar, decision-only handoff | Fixtures |
| Audit lane | Contract | non-authoritative context, drift fixtures | Fixtures |
| Fixtures + verify | Interface, Audit | fixture atlas, stabilized fields | Phase 009 |

<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 004 + 007 landed** - prerequisite - CRITICAL
2. **Contract binding** - CRITICAL
3. **Interface pilot** (higher complexity of the two) - CRITICAL
4. **Fixtures + shared-field verification** - CRITICAL

**Parallel Opportunities**:
- The audit lane runs in parallel with the interface pilot after contract binding.
- Fixture authoring can begin alongside each consumer.

<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Contract bound | Both modes read the phase-007 envelope; authority order fixed | Planned |
| M2 | Interface pilot working | Relational exemplar + decision-only handoff, `anchor:null` path | Planned |
| M3 | Audit lane working | Non-authoritative context + drift fixtures, no corpus verdict | Planned |
| M4 | Fields stabilized | Both pilots populate the shared proof/handoff fields; fail-closed fixtures pass | Planned |

<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | Corpus is falsification infrastructure, not an authority | Counterexamples prove unsafe integrations fail; corpus never selects/proves |
| ADR-002 | Interface handoff is decision-only and source-aware | Ship decisions + sources, never raw style bodies, into the target render |
| ADR-003 | Audit corpus is strictly non-authoritative | Severity/score/WCAG/perf/copying/fix all need target evidence, not corpus |
| ADR-004 | Two contrasting pilots before relationship-heavy modes | Contrast forces the shared proof/handoff fields to be general |

---

## RELATED DOCUMENTS

- **Specification**: `spec.md`
- **Tasks**: `tasks.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Parent**: ../spec.md

<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->

