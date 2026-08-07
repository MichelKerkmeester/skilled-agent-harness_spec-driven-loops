---
title: "Implementation Plan: design-md-generator v3 schema contract"
description: "Plan to build the versioned v3 schema authority for design-md-generator: a single manifest driving section requiredness, capabilities, Quick Start groups, semantic roles, formatter emission, prompt text, and validation, plus a hard-vs-advisory validation split and a de-literalized corpus baseline. Planned scaffold; implementation not started."
trigger_phrases:
  - "md generator schema plan"
  - "v3 schema contract plan"
  - "formatters-v3 validation split"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/011-sk-design-styles-utilization/005-md-generator-schema-contract"
    last_updated_at: "2026-07-18T13:40:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the v3 schema-contract L3 scaffold docs"
    next_safe_action: "Implement the v3 schema manifest as the single section authority"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-mdgen-schema-011-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: design-md-generator v3 schema contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (design-md-generator backend) |
| **Subject** | `.opencode/skills/sk-design/design-md-generator/` |
| **Testing** | Vitest (schema-drift sentinel + counterfactual schema/emitter tests) |
| **Depends on** | Phase 004 retrieval substrate (`../004-retrieval-substrate/`) |

### Overview
Build one versioned v3 schema manifest that is the single source of truth for section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic typography roles, formatter emission, prompt instructions, and validation. Then migrate `formatters-v3.ts`, the write-prompt, `validate.ts`, and `report-gen.ts` to read from it, add a semantic role normalizer, build a de-literalized corpus baseline + fixture generator from the 1,290 bundles via phase-004 retrieval, split validation into hard failures versus stratified advisory warnings, and lock the whole thing with a schema-drift sentinel and counterfactual tests. This is planning only — nothing in the backend is changed yet.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 004 retrieval substrate is available and its interface is stable
- [x] The v3 manifest authoring format (TS/JSON/hybrid) is decided in decision-record.md
- [x] The closed set of HARD validation categories (target/schema/provenance) is agreed
- [x] The advisory strata (shape/vocabulary/density/rarity) are enumerated

### Definition of Done
- [x] One versioned v3 manifest is the sole authority; formatter/prompt/validator read from it
- [x] `emitQuickStart` derives groups from manifest capabilities
- [x] Hard-vs-advisory split live in `validateDesignMd` / `checkSectionCompleteness`, surfaced by `report-gen.ts`
- [x] Schema-drift sentinel + counterfactual Vitest tests pass
- [x] Corpus baseline + de-literalized fixtures generated, carrying no source literals

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-authority schema contract: one versioned manifest module; formatter, write-prompt, and validator are consumers that resolve every section/capability/role/Quick-Start decision against it. A drift sentinel enforces that no consumer redefines a schema fact locally.

### Key Components
- **schema-v3 manifest** (new backend module): the one versioned source of truth for requiredness, capabilities, extension slots, Quick Start groups, semantic roles, emission, prompt text, and validation.
- **`formatters-v3.ts::emitQuickStart`**: capability-driven Quick Start emission derived from the manifest.
- **Semantic role normalizer** (new): stable semantic core + namespaced extensions, preserving original source labels.
- **Corpus baseline + fixture generator** (new): compact de-literalized baseline built from the 1,290 bundles via phase-004 retrieval.
- **`validate.ts::validateDesignMd` / `checkSectionCompleteness`**: hard-vs-advisory validation split.
- **`report-gen.ts`**: surfaces stratified advisory warnings distinctly from hard failures.
- **Schema-drift sentinel + counterfactual tests** (Vitest): fail when consumers diverge from the manifest.

### Data Flow
```
v3 schema manifest (single authority)
      │
      ├─► formatters-v3.ts::emitQuickStart  (capability-driven emission)
      ├─► write-prompt (instructions)
      ├─► validate.ts::validateDesignMd → checkSectionCompleteness
      │        ├─ HARD: target / schema / provenance
      │        └─ ADVISORY (stratified warnings): shape / vocabulary / density / rarity
      └─► report-gen.ts (hard failures vs advisory warnings)

corpus (1,290 bundles) ──(phase-004 retrieval)──► de-literalized baseline + fixtures ──► advisory strata only
```

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: v3 Schema Manifest
- [x] Author the versioned v3 manifest module (requiredness, capabilities, extension slots, Quick Start groups, semantic roles, emission, prompt text, validation)
- [x] Define the closed HARD category set (target/schema/provenance) and the advisory strata

### Phase 2: Consumer Migration
- [x] Migrate `formatters-v3.ts::emitQuickStart` to capability-driven emission from the manifest
- [x] Migrate the write-prompt instructions to read from the manifest
- [x] Add the semantic typography-role normalizer (stable core + namespaced extensions)

### Phase 3: Validation Split
- [x] Split `validate.ts::validateDesignMd` / `checkSectionCompleteness` into hard vs advisory
- [x] Surface stratified advisory warnings through `report-gen.ts`

### Phase 4: Corpus Baseline
- [x] Build the compact corpus baseline via phase-004 retrieval over the 1,290 bundles
- [x] Build the de-literalized fixture generator; assert no source literals/assets escape

### Phase 5: Drift + Counterfactual Tests
- [x] Add the schema-drift sentinel
- [x] Add counterfactual schema/emitter Vitest tests (mutate schema, assert emission/validation follow)

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools | Target |
|-----------|-------|-------|--------|
| Unit | v3 manifest resolution, role normalizer | Vitest | Deterministic resolution |
| Counterfactual | Mutate schema, assert formatter+prompt+validator follow | Vitest | Single-authority invariant |
| Drift sentinel | Consumer divergence from manifest | Vitest | Build fails on drift |
| Provenance | Fixtures carry no source literals/assets | Vitest | Zero-leak assertion |
| Advisory | Corpus-divergent target-valid doc | Vitest | Passes with warnings, never rejected |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 004 retrieval substrate | Internal | Planned | Cannot build corpus baseline/fixtures |
| `design-md-generator` backend | Internal | Existing | Subject of the migration |
| The 1,290-style bundles | Internal | Existing | Source for de-literalized fixtures (read-only) |
| Vitest | External | Existing | Cannot run drift/counterfactual tests |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Migration regresses generation or validation, or the drift sentinel cannot be satisfied.
- **Procedure**: Revert the schema-module + consumer edits; the backend returns to its pre-v3 multi-source state. No corpus contents or phase-004 artifacts are mutated by this phase, so rollback is code-only.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Manifest) ──► Phase 2 (Consumers) ──► Phase 3 (Validation split) ──► Phase 5 (Drift + tests)
        │                                                                        ▲
        └────────────────────────► Phase 4 (Corpus baseline via 004) ───────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Manifest | Phase 004 substrate | Consumers, Validation, Corpus |
| Consumers | Manifest | Validation split, Tests |
| Validation split | Manifest, Consumers | Tests |
| Corpus baseline | Manifest, Phase 004 | Advisory strata, Tests |
| Drift + tests | All | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Manifest | High | 3–4 days |
| Consumers (emit + prompt + normalizer) | Medium-high | 3–4 days |
| Validation split | Medium | 2–3 days |
| Corpus baseline + fixtures | Medium | 2–3 days |
| Drift + counterfactual tests | Medium | 1–2 days |
| **Total** | | **~10–15 engineer-days** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation Checklist
- [x] Backend baseline captured (current formatter/prompt/validator behavior snapshot)
- [x] Phase 004 substrate interface pinned
- [x] Golden DESIGN.md outputs recorded for regression comparison

### Rollback Procedure
1. Revert the new `schema-v3` module and consumer edits to `formatters-v3.ts`, `validate.ts`, `report-gen.ts`.
2. Re-run the generator against the golden outputs to confirm the pre-v3 behavior is restored.
3. Delete generated fixtures/baseline artifacts (no source data mutated).

### Data Reversal
- **Has data migrations?** No — code + generated fixtures only.
- **Reversal procedure**: Remove generated baseline/fixtures; corpus and phase-004 artifacts are untouched.

<!-- /ANCHOR:enhanced-rollback -->
---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐
│  Phase 004 substrate │
└──────────┬───────────┘
           │
           ▼
   ┌───────────────┐
   │ v3 Manifest   │
   │  (Phase 1)    │
   └───┬───────┬───┘
       │       │
       ▼       ▼
┌────────────┐ ┌────────────────┐
│ Consumers  │ │ Corpus baseline│
│ (Phase 2)  │ │  (Phase 4)     │
└──────┬─────┘ └───────┬────────┘
       ▼               │
┌────────────┐         │
│ Validation │◄────────┘
│  (Phase 3) │
└──────┬─────┘
       ▼
┌────────────────┐
│ Drift + tests  │
│  (Phase 5)     │
└────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| v3 Manifest | Phase 004 substrate | Single schema authority | Consumers, Validation, Corpus |
| emitQuickStart | Manifest | Capability-driven Quick Start | Tests |
| Role normalizer | Manifest | Stable core + namespaced roles | Tests |
| Validation split | Manifest, Consumers | Hard/advisory result | Tests, report-gen |
| Corpus baseline | Manifest, Phase 004 | De-literalized fixtures | Advisory strata, Tests |
| Drift sentinel | All consumers | Build-fail on divergence | None |

<!-- /ANCHOR:dependency-graph -->
---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 004 substrate available** — prerequisite — CRITICAL
2. **v3 Manifest authored** — 3–4 days — CRITICAL
3. **Consumer migration (emit/prompt/normalizer)** — 3–4 days — CRITICAL
4. **Validation split + report-gen** — 2–3 days — CRITICAL
5. **Drift + counterfactual tests** — 1–2 days — CRITICAL

**Parallel Opportunities**:
- The corpus baseline (Phase 4) can proceed alongside consumer migration once the manifest exists.
- The role normalizer can be developed alongside `emitQuickStart`.

<!-- /ANCHOR:critical-path -->
---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Single authority | v3 manifest is the sole source; consumers read from it | End of Phase 2 |
| M2 | Calibrated validation | Hard-vs-advisory split live, no majority-rejection | End of Phase 3 |
| M3 | De-literalized corpus | Baseline + fixtures generated, zero source leaks | End of Phase 4 |
| M4 | Drift-locked | Schema-drift sentinel + counterfactual tests green | End of Phase 5 |

<!-- /ANCHOR:milestones -->
---

<!-- ANCHOR:adr-summary -->
## L3: ARCHITECTURE DECISION SUMMARY

See `decision-record.md` for full ADRs:

| ADR | Decision | Rationale |
|-----|----------|-----------|
| ADR-001 | One versioned v3 manifest is the single authority | Removes formatter/prompt/validator drift |
| ADR-002 | Corpus teaches shape, never target-measured values | Prevents aesthetic majority vote / source leaks |
| ADR-003 | Hard-vs-advisory validation split | Calibrates instead of majority-rejecting |
| ADR-004 | Capability-driven Quick Start via `emitQuickStart` | Quick Start stays accurate as schema evolves |
| ADR-005 | Semantic role normalizer with namespaced extensions | Stable core without losing source labels |

<!-- /ANCHOR:adr-summary -->

---

<!-- ANCHOR:ai-execution -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [x] Confirm the phase-004 retrieval substrate exists and its interface is pinned
- [x] Read `spec.md`, this `plan.md`, and `decision-record.md` before editing backend code
- [x] Capture the golden DESIGN.md baseline outputs for regression comparison

### Task Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Execute phases in order: manifest (Phase 1) before consumers (Phase 2) before verification (Phase 3) |
| TASK-SCOPE | Touch only the `design-md-generator` backend surfaces named in Files-to-Change; no adjacent cleanup |
| TASK-AUTHORITY | Never redefine a schema fact outside the v3 manifest; the drift sentinel is the gate |
| TASK-IRON-RULE | The corpus may teach shape, never target-measured values or source literals |

### Status Reporting Format
Report each task as `T### STATUS=<PENDING|IN-PROGRESS|DONE|BLOCKED>` with a one-line evidence pointer (file:symbol or test name). Roll up per phase before advancing.

### Blocked Task Protocol
If a task is Blocked, mark it `[B]`, record the blocker and the missing precondition (for example, phase-004 substrate unavailable), and stop that lane. Do not work around a blocked schema-authority dependency; escalate for an amendment decision.
<!-- /ANCHOR:ai-execution -->
