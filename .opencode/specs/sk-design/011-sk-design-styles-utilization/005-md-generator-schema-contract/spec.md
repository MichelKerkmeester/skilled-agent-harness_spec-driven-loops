---
title: "Feature Specification: design-md-generator v3 schema contract"
description: "Upgrade the design-md-generator backend into a single versioned v3 schema authority that drives section requiredness, capabilities, Quick Start groups, semantic roles, formatter emission, prompt instructions, and validation from one source — removing formatter/prompt/validator drift. Planned scaffold; implementation not started."
trigger_phrases:
  - "md generator schema contract"
  - "design-md-generator v3 schema"
  - "formatters-v3 quick start"
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
# Feature Specification: design-md-generator v3 schema contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Implementation phase 005 of packet 011 turns the `design-md-generator` backend into a single versioned **v3 schema authority**. Today section requiredness, conditional capabilities, Quick Start grouping, semantic typography roles, formatter emission, prompt instructions, and validation are defined in several places, so the formatter, the write-prompt, and the validator drift apart. This phase makes one v3 schema manifest the sole source of truth for all of them, wires capability-driven Quick Start emission through `formatters-v3.ts::emitQuickStart`, adds a semantic role normalizer, builds a de-literalized corpus baseline from the 1,290 bundles via the phase-004 retrieval substrate, and splits validation into hard failures versus stratified advisory warnings.

**Key Decisions**: one versioned v3 manifest as the single authority (ADR-001); the corpus teaches shape, never target-measured values (ADR-002); hard-vs-advisory validation split (ADR-003)

**Critical Dependencies**: phase 004 retrieval substrate (`../004-retrieval-substrate/`)

<!-- /ANCHOR:executive-summary -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned — scaffold; implementation not started |
| **Created** | 2026-07-18 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | `../004-retrieval-substrate/` |
| **Successor** | `../006-md-generator-study-exemplars/` |
| **Estimated Effort** | ~10–15 engineer-days |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `design-md-generator` backend defines DESIGN.md structure in several disconnected places: the formatter (`formatters-v3.ts`) decides emission, the write-prompt builds its own instructions, and `validate.ts` re-encodes section requiredness. These definitions drift, so a section can be required by the validator but omitted by the prompt, or a capability can be emitted by the formatter but unknown to validation. The phase-002 research (`../002-md-generator-upgrade/research/lineages/sol/research.md`, Phase A) identified a "contract first" upgrade as the highest, safest lift: collapse all of these into one versioned schema authority before any corpus-conditioned prose work.

### Purpose
Upgrade the backend so that a single versioned v3 schema manifest is the one source of truth for section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic typography roles, formatter emission, prompt instructions, and validation — eliminating formatter/prompt/validator drift and giving later phases a stable contract to build STUDY exemplars against.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A versioned **v3 schema manifest** that is the ONE source of truth for section requiredness, conditional capabilities, extension slots, Quick Start groups, semantic roles, formatter emission, prompt instructions, and validation.
- Capability-driven Quick Start emission wired through `formatters-v3.ts::emitQuickStart`.
- A semantic typography-role normalizer with a stable semantic core plus namespaced extensions, preserving original source labels.
- A compact corpus baseline plus a de-literalized fixture generator built from the 1,290 bundles via the phase-004 retrieval substrate.
- A hard-vs-advisory validation split in `validate.ts`: target/schema/provenance violations stay HARD failures; corpus shape/vocabulary/density/rarity become stratified WARNINGS surfaced through `report-gen.ts`.
- A schema-drift sentinel plus counterfactual schema/emitter tests (Vitest).

### Out of Scope
- STUDY prose exemplars, hydration, provenance envelopes, and source-leak gates — deferred to `../006-md-generator-study-exemplars/` (research Phase B).
- Changing the extracted styles library contents or the phase-004 retrieval mechanism.
- The learned/fuzzy ranking or prose-judge experiment (research rank 9, advisory only).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-md-generator/**/schema-v3.*` | Create (proposed) | New backend schema module: the single versioned v3 authority |
| `design-md-generator/**/formatters-v3.ts` | Modify (proposed) | Capability-driven `emitQuickStart` reads groups/roles from the manifest |
| `design-md-generator/**/validate.ts` | Modify (proposed) | Hard-vs-advisory split in `validateDesignMd` / `checkSectionCompleteness` |
| `design-md-generator/**/report-gen.ts` | Modify (proposed) | Surface stratified advisory warnings distinctly from hard failures |
| `design-md-generator/**/*.test.ts` | Create (proposed) | Schema-drift sentinel + counterfactual schema/emitter tests (Vitest) |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Single versioned v3 schema authority | One versioned manifest defines section requiredness, capabilities, extension slots, Quick Start groups, semantic roles, emission, prompt text, and validation; formatter/prompt/validator read from it, none redefine it. |
| REQ-002 | Iron rule enforced in code and docs | The corpus may teach structure, relationships, semantic vocabulary, and honest absences; it may NEVER alter target-measured values, supply source-specific literals/assets, or become an aesthetic majority vote. |
| REQ-003 | Hard-vs-advisory validation split | `validate.ts::validateDesignMd` keeps target/schema/provenance violations as HARD failures; corpus shape/vocabulary/density/rarity become stratified WARNINGS that never cause majority-rejection. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Capability-driven Quick Start | `formatters-v3.ts::emitQuickStart` derives Quick Start groups from the manifest capabilities, not from hardcoded lists. |
| REQ-005 | Semantic typography-role normalizer | A stable semantic core plus namespaced extensions normalizes roles while preserving the original source labels. |
| REQ-006 | De-literalized corpus baseline + fixtures | A compact baseline and a de-literalized fixture generator are built from the 1,290 bundles via the phase-004 retrieval substrate, carrying no source literals or assets. |
| REQ-007 | Schema-drift sentinel + counterfactual tests | A drift sentinel fails when formatter/prompt/validator diverge from the manifest; counterfactual Vitest cases mutate the schema and assert emission/validation follow. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Exactly one versioned v3 manifest exists and every section/capability/role/Quick-Start decision resolves to it.
- **SC-002**: A schema mutation changes formatter emission, prompt text, and validation together, proven by counterfactual tests.
- **SC-003**: Corpus-derived checks emit only stratified warnings; no corpus signal can reject a target-valid DESIGN.md.
- **SC-004**: The fixture generator produces de-literalized fixtures containing no source-specific literals or assets.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 004 retrieval substrate | Cannot build corpus baseline/fixtures | Sequence 005 strictly after 004; fixtures consume 004 read-only |
| Risk | Corpus leaks into target values | High — aesthetic majority vote | Enforce the iron rule (REQ-002); corpus signals stay advisory only |
| Risk | Manifest becomes yet another partial source | High — drift returns | Schema-drift sentinel (REQ-007) fails the build on divergence |
| Risk | De-literalization incomplete | Medium — source leak in fixtures | Fixture generator strips literals/assets; counterfactual tests assert absence |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Schema resolution adds negligible overhead to a single DESIGN.md generation (manifest loaded once per run).
- **NFR-P02**: The corpus baseline is compact enough to load in-process without a retrieval round-trip per generation.

### Security / Provenance
- **NFR-S01**: Fixtures and baselines carry no source-specific literals, assets, or identifying phrases.
- **NFR-S02**: Provenance violations remain HARD validation failures, never downgraded to advisory.

### Reliability
- **NFR-R01**: Formatter, prompt, and validator remain consistent for any manifest version (single-authority invariant).
- **NFR-R02**: Advisory warnings never block emission of a target-valid document.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Unknown capability**: A capability absent from the manifest is rejected at emission, not silently emitted.
- **Empty corpus stratum**: A stratum with no corpus support yields no warning rather than a false rejection.
- **Namespaced role collision**: Extension roles are namespaced so they never shadow the stable semantic core.

### Error Scenarios
- **Manifest/formatter divergence**: The schema-drift sentinel fails the build with the diverging field named.
- **Fixture contains a literal**: The de-literalization check fails fixture generation before the fixture is written.

### Honest Absence
- **Section legitimately absent**: The schema records the absence as honest, and validation treats it as valid, not missing.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | New schema module + edits to formatters-v3/validate/report-gen; ~10–15 eng-days |
| Risk | 20/25 | Corpus-value leakage, majority-rejection regression, cross-consumer drift |
| Research | 8/20 | Phase-002 research already converged; contract is well-specified |
| Multi-Agent | 4/15 | Single implementer stream |
| Coordination | 8/15 | Hard dependency on phase 004; hands contract to phase 006 |
| **Total** | **58/100** | **Level 3** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Corpus values override target-measured values | H | M | Iron rule in code; corpus signals advisory-only |
| R-002 | Manifest not adopted by all three consumers | H | M | Schema-drift sentinel fails on any un-migrated consumer |
| R-003 | De-literalization misses a source literal | M | M | Fixture generator strips + counterfactual leak assertions |
| R-004 | Advisory warnings cause majority-rejection regression | M | L | Stratified warnings can never fail; hard set is closed and explicit |
| R-005 | Phase 004 substrate changes shape after 005 starts | M | L | Consume 004 through a stable retrieval interface |

<!-- /ANCHOR:risk-matrix -->
---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: One schema authority (Priority: P0)

**As a** maintainer of the design-md-generator, **I want** section requiredness, capabilities, Quick Start groups, roles, emission, prompt text, and validation to come from one versioned manifest, **so that** the formatter, prompt, and validator can never drift apart.

**Acceptance Criteria**:
1. Given the v3 manifest, When I change a section's requiredness, Then the formatter, write-prompt, and validator all reflect it without separate edits.
2. Given a consumer that redefines a schema fact locally, When the build runs, Then the schema-drift sentinel fails and names the divergence.

### US-002: Calibrated, not majority-ruled, validation (Priority: P0)

**As a** design engineer, **I want** corpus signals to advise rather than reject, **so that** a target-valid DESIGN.md is never rejected because it differs from the corpus majority.

**Acceptance Criteria**:
1. Given a target-valid document that diverges from corpus shape, When validation runs, Then it passes with stratified warnings, not a hard failure.
2. Given a target/schema/provenance violation, When validation runs, Then it is a HARD failure.

### US-003: Capability-driven Quick Start (Priority: P1)

**As a** consumer of generated DESIGN.md, **I want** the Quick Start section to reflect the document's actual capabilities, **so that** it stays accurate as the schema evolves.

**Acceptance Criteria**:
1. Given a capability set, When `emitQuickStart` runs, Then Quick Start groups are derived from the manifest, not a hardcoded list.

<!-- /ANCHOR:user-stories -->
---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should the v3 manifest be authored as TypeScript, JSON, or a hybrid schema module? (Resolve in plan/decision-record before build.)
- Where should the compact corpus baseline live so it loads in-process without a per-generation retrieval call?
- Which strata (shape, vocabulary, density, rarity) warrant separate warning tiers versus a single advisory tier?

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent**: `../spec.md`
- **Predecessor**: `../004-retrieval-substrate/`
- **Successor**: `../006-md-generator-study-exemplars/`
- **Source research**: `../002-md-generator-upgrade/research/lineages/sol/research.md` (Phase A)
- **Subject backend**: `.opencode/skills/sk-design/design-md-generator/`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`

<!-- /ANCHOR:related-docs -->
