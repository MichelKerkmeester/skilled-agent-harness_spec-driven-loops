---
title: "Decision Record: design-md-generator v3 schema contract"
description: "Architecture decisions for the versioned v3 schema authority: one manifest as single source of truth, corpus-teaches-shape-never-values iron rule, hard-vs-advisory validation split, capability-driven Quick Start, and semantic role normalization. Planned scaffold; implementation not started."
trigger_phrases:
  - "md generator schema decisions"
  - "v3 schema adr"
  - "corpus teaches shape not values"
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
# Decision Record: design-md-generator v3 schema contract

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: One versioned v3 manifest as the single schema authority

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-001-context -->
### Context

Section requiredness, conditional capabilities, Quick Start groups, semantic roles, formatter emission, prompt instructions, and validation are defined across the formatter, the write-prompt, and `validate.ts`. These definitions drift, producing formatter/prompt/validator inconsistency. The phase-002 research ranked a contract-first upgrade as the highest, safest lift.

### Constraints

- Must cover requiredness, capabilities, extension slots, Quick Start groups, roles, emission, prompt text, and validation from one place.
- Must be versioned so phase 006 can build STUDY exemplars against a stable contract.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: a single versioned v3 schema manifest that is the one source of truth for every section, capability, role, Quick Start group, emission, prompt, and validation decision.

**How it works**: a new backend `schema-v3.*` module holds the manifest; `formatters-v3.ts`, the write-prompt, and `validate.ts` become consumers that resolve against it and never redefine a schema fact locally.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Single versioned v3 manifest** | Removes drift; stable contract for later phases | One-time consumer migration | 9/10 |
| Keep separate definitions plus sync tests | Less churn | Drift persists; tests chase symptoms | 5/10 |
| Generate consumers from a schema at build time | Strong guarantee | Heavier tooling than warranted now | 6/10 |

**Why this one**: the single manifest is the direct root-cause fix for drift and gives phase 006 a stable contract at an acceptable one-time migration cost.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Formatter, prompt, and validator can no longer disagree.
- Later STUDY-exemplar work builds against one versioned contract.

**What it costs**:
- One-time migration of three consumers . Mitigation: the schema-drift sentinel proves completeness.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A consumer keeps a local definition | H | Schema-drift sentinel fails the build and names the field |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Formatter/prompt/validator drift is an observed current problem |
| 2 | **Beyond Local Maxima?** | PASS | Sync-tests and codegen alternatives were weighed |
| 3 | **Sufficient?** | PASS | One manifest plus a drift sentinel closes the gap |
| 4 | **Fits Goal?** | PASS | Phase-002 research ranked this the top lever |
| 5 | **Open Horizons?** | PASS | Versioning enables phase 006 STUDY exemplars |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- New `schema-v3.*` module (the authority).
- `formatters-v3.ts`, write-prompt, `validate.ts`, `report-gen.ts` become consumers.

**How to roll back**: revert the manifest module and consumer edits; the backend returns to its pre-v3 multi-source state.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The corpus teaches shape, never target-measured values

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-002-context -->
### Context

The v3 upgrade draws on the 1,290-style corpus via the phase-004 retrieval substrate. Without a hard rule, corpus signals could bleed into a document's measured values or average real styles into generic output.

### Constraints

- The corpus is consumed read-only through phase-004 retrieval.
- Fixtures and baselines must not carry source-specific literals or assets.
<!-- /ANCHOR:adr-002-context -->

---

<!-- ANCHOR:adr-002-decision -->
### Decision

**We chose**: the iron rule. The corpus may teach structure, relationships, semantic vocabulary, and honest absences; it may never alter target-measured values, supply source-specific literals/assets, or become an aesthetic majority vote.

**How it works**: corpus-derived signals feed only the advisory strata of validation and the de-literalized fixture generator; target values stay author/target-driven and the fixture generator strips literals and assets.
<!-- /ANCHOR:adr-002-decision -->

---

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Iron rule: shape/vocab/absences only** | Prevents slop and source leaks | Requires discipline at every corpus touch point | 10/10 |
| Let the corpus tune target values | Could smooth outliers | Averages away design intent; leak risk | 2/10 |
| Raw few-shot corpus prompting | Fast prose lift | Uncontrolled source leaks | 3/10 |

**Why this one**: the iron rule is the safety spine of the whole styles-utilization program; every downstream lever depends on it.
<!-- /ANCHOR:adr-002-alternatives -->

---

<!-- ANCHOR:adr-002-consequences -->
### Consequences

**What improves**:
- Generated documents stay target-truthful and non-generic.
- Fixtures are safe to ship (no source leakage).

**What it costs**:
- The corpus cannot fix a target the author chose . Mitigation: that is the intended behavior.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A literal escapes into a fixture | M | De-literalization plus leak assertion tests |
<!-- /ANCHOR:adr-002-consequences -->

---

<!-- ANCHOR:adr-002-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Corpus-value bleed is a real slop/leak risk |
| 2 | **Beyond Local Maxima?** | PASS | Value-tuning and raw few-shot were rejected |
| 3 | **Sufficient?** | PASS | Advisory-only routing plus de-literalization covers it |
| 4 | **Fits Goal?** | PASS | Protects the honesty of every generated DESIGN.md |
| 5 | **Open Horizons?** | PASS | Makes phase 006 STUDY exemplars safe to attempt |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-002-five-checks -->

---

<!-- ANCHOR:adr-002-impl -->
### Implementation

**What changes**:
- Corpus baseline and fixture generator carry no literals/assets.
- Advisory strata in `validate.ts` consume corpus signals only.

**How to roll back**: this is a forward-only safety rule; it constrains all corpus usage and is not independently revertable.
<!-- /ANCHOR:adr-002-impl -->
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Hard-vs-advisory validation split

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-003-context -->
### Context

Current validation risks rejecting a target-valid DESIGN.md because it diverges from the corpus majority. The research recommended calibrating rather than majority-rejecting.

### Constraints

- Target/schema/provenance correctness must stay strictly enforced.
- Corpus-derived checks must never cause majority-rejection.
<!-- /ANCHOR:adr-003-context -->

---

<!-- ANCHOR:adr-003-decision -->
### Decision

**We chose**: split `validate.ts::validateDesignMd` (and `checkSectionCompleteness`) so target/schema/provenance violations stay HARD failures while corpus shape/vocabulary/density/rarity become stratified WARNINGS.

**How it works**: the HARD category set is closed and explicit; advisory strata are computed from the corpus baseline and surfaced distinctly via `report-gen.ts`, never blocking emission of a target-valid document.
<!-- /ANCHOR:adr-003-decision -->

---

<!-- ANCHOR:adr-003-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Hard set plus stratified advisory warnings** | Calibrates without rejecting valid docs | Two-tier reporting to design | 9/10 |
| All corpus checks hard | Simple | Majority-rejects legitimate divergence | 2/10 |
| All corpus checks silent | No noise | Loses the calibration signal entirely | 4/10 |

**Why this one**: stratified warnings give calibration value while guaranteeing a target-valid document is never rejected by corpus signals.
<!-- /ANCHOR:adr-003-alternatives -->

---

<!-- ANCHOR:adr-003-consequences -->
### Consequences

**What improves**:
- No majority-rejection regressions.
- Authors get corpus calibration as guidance, not gates.

**What it costs**:
- The report grows a warnings tier . Mitigation: `report-gen.ts` separates the two clearly.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An advisory check accidentally fails the build | M | Advisory strata cannot return a hard failure by construction |
<!-- /ANCHOR:adr-003-consequences -->

---

<!-- ANCHOR:adr-003-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Majority-rejection of valid docs is a real hazard |
| 2 | **Beyond Local Maxima?** | PASS | All-hard and all-silent were rejected |
| 3 | **Sufficient?** | PASS | Closed hard set plus stratified warnings covers both needs |
| 4 | **Fits Goal?** | PASS | Keeps validation calibrated, not punitive |
| 5 | **Open Horizons?** | PASS | Strata can be tuned without touching the hard set |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-003-five-checks -->

---

<!-- ANCHOR:adr-003-impl -->
### Implementation

**What changes**:
- `validate.ts::validateDesignMd` and `checkSectionCompleteness` gain the hard/advisory split.
- `report-gen.ts` surfaces stratified warnings distinctly.

**How to roll back**: collapse the split back to the prior single-tier validator.
<!-- /ANCHOR:adr-003-impl -->
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Capability-driven Quick Start emission

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-004-context -->
### Context

Quick Start grouping is emitted from logic that can drift from the schema, so it can misrepresent a document's actual capabilities as the schema evolves.

### Constraints

- Quick Start groups must reflect the document's real capabilities.
- Emission must stay accurate across manifest versions.
<!-- /ANCHOR:adr-004-context -->

---

<!-- ANCHOR:adr-004-decision -->
### Decision

**We chose**: wire capability-driven Quick Start emission through `formatters-v3.ts::emitQuickStart`, deriving groups from the manifest capabilities.

**How it works**: `emitQuickStart` resolves capabilities and Quick Start groups from the v3 manifest, so any capability or group change flows automatically into the emitted Quick Start.
<!-- /ANCHOR:adr-004-decision -->

---

<!-- ANCHOR:adr-004-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Capability-driven from manifest** | Stays accurate as the schema evolves | Requires the manifest first (ADR-001) | 9/10 |
| Hardcoded Quick Start groups | Simple today | Drifts from capabilities over time | 3/10 |

**Why this one**: deriving Quick Start from the single authority keeps it correct without a separate maintenance burden.
<!-- /ANCHOR:adr-004-alternatives -->

---

<!-- ANCHOR:adr-004-consequences -->
### Consequences

**What improves**:
- Quick Start cannot misstate capabilities.

**What it costs**:
- Depends on ADR-001 landing first . Mitigation: sequenced in the plan.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A capability absent from the manifest is emitted | L | Emission rejects unknown capabilities |
<!-- /ANCHOR:adr-004-consequences -->

---

<!-- ANCHOR:adr-004-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Quick Start can drift from real capabilities today |
| 2 | **Beyond Local Maxima?** | PASS | Hardcoded grouping was rejected |
| 3 | **Sufficient?** | PASS | Manifest-derived emission closes the gap |
| 4 | **Fits Goal?** | PASS | Directly serves the single-authority goal |
| 5 | **Open Horizons?** | PASS | New capabilities flow through automatically |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-004-five-checks -->

---

<!-- ANCHOR:adr-004-impl -->
### Implementation

**What changes**:
- `formatters-v3.ts::emitQuickStart` reads groups/capabilities from the manifest.

**How to roll back**: restore the prior hardcoded Quick Start emission.
<!-- /ANCHOR:adr-004-impl -->
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Semantic typography-role normalizer

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-07-18 |
| **Deciders** | sk-design maintainer |

---

<!-- ANCHOR:adr-005-context -->
### Context

Typography roles across sources use inconsistent labels. Normalizing naively would lose original source labels; leaving them raw prevents stable reasoning about roles.

### Constraints

- Preserve original source labels.
- Provide a stable semantic core other components can rely on.
<!-- /ANCHOR:adr-005-context -->

---

<!-- ANCHOR:adr-005-decision -->
### Decision

**We chose**: a semantic typography-role normalizer with a stable semantic core plus namespaced extensions, preserving the original source labels.

**How it works**: roles map to a stable core vocabulary; source-specific or novel roles are retained as namespaced extensions so they never shadow the core and no original label is discarded.
<!-- /ANCHOR:adr-005-decision -->

---

<!-- ANCHOR:adr-005-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stable core plus namespaced extensions** | Stable reasoning without losing labels | Slightly more mapping logic | 9/10 |
| Flatten all roles to a fixed core | Simple | Loses source labels and novel roles | 3/10 |
| Keep raw source labels | No loss | No stable core to reason against | 4/10 |

**Why this one**: namespaced extensions give a stable core while preserving every source label, which the corpus baseline and Quick Start both rely on.
<!-- /ANCHOR:adr-005-alternatives -->

---

<!-- ANCHOR:adr-005-consequences -->
### Consequences

**What improves**:
- Downstream components reason against a stable role core.
- No source label is discarded.

**What it costs**:
- Namespacing rules must be maintained . Mitigation: encoded in the manifest (ADR-001).

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| An extension role shadows a core role | L | Namespacing prevents collision by construction |
<!-- /ANCHOR:adr-005-consequences -->

---

<!-- ANCHOR:adr-005-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Inconsistent role labels block stable reasoning |
| 2 | **Beyond Local Maxima?** | PASS | Flatten and raw-label options were rejected |
| 3 | **Sufficient?** | PASS | Core plus namespaced extensions covers both needs |
| 4 | **Fits Goal?** | PASS | Feeds emitQuickStart and the corpus baseline |
| 5 | **Open Horizons?** | PASS | New roles land as extensions without core churn |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-005-five-checks -->

---

<!-- ANCHOR:adr-005-impl -->
### Implementation

**What changes**:
- New role normalizer; consumed by `emitQuickStart` and the corpus baseline.

**How to roll back**: remove the normalizer; consumers fall back to raw role labels.
<!-- /ANCHOR:adr-005-impl -->
<!-- /ANCHOR:adr-005 -->
