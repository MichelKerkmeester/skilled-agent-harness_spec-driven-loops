---
title: "Decision Record: Spec-Kit Data Quality by Default [template:level_3/decision-record.md]"
description: "Decision record for running a research loop before building any spec-kit data-quality change."
trigger_phrases:
  - "spec data quality decision"
  - "research before build"
  - "data quality adr"
  - "stage 0 decision"
  - "data quality default"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality"
    last_updated_at: "2026-07-04T17:11:44.982Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Confirmed research-before-build and scaffolded the 28 phase children"
    next_safe_action: "Build 026 the shared safe-fix engine, then 004 the schema gate"
    blockers: []
    key_files:
      - "research/stage-0-external-findings.md"
    session_dedup:
      fingerprint: "sha256:a13d79278b8e7546f3edb041b539b5aa0a91ec037e7cd0e86fb96918be7acc04"
      session_id: "031-stage-0-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Spec-Kit Data Quality by Default

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Research before building any data-quality change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-21 |
| **Deciders** | Operator, Orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

We needed to choose between building the highest-ranked data-quality candidate right away and running a research loop first. The candidates carry real cost. Several rest on vendor-only claims or on a chunker choice that is corpus-dependent. Picking wrong by default would degrade retrieval across the whole spec corpus.

### Constraints

- Some candidates rest on vendor-only claims that no independent benchmark confirms
- The chunking choice is corpus-dependent, so a single chunker is not a safe default
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Run a by-angle research loop and rank candidates by external evidence before any build.

**How it works**: Stage 0 captures the external sweep and the ranked candidates. The loop then verifies each candidate against the spec-kit corpus and separates robust signals from corpus-specific ones. The verdict feeds a later build packet.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Research loop first** | Verifies vendor and corpus claims before any default lands | Adds time before code | 9/10 |
| Build the top candidate now | Fast | Risks a wrong default across the corpus | 4/10 |

**Why this one**: The cost of a wrong default across every packet is far higher than the cost of one research loop.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The build packet starts from corpus-verified evidence
- Vendor-only claims get downgraded before they drive a default

**What it costs**:
- The research phase adds time before any code lands. Mitigation: run the seven angles as parallel research seats

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The loop confirms a corpus-specific chunker as universal | M | Carry metadata fusion as the robust signal rather than a chunker |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Retrieval, adherence and logic reading all underperform the stored data today |
| 2 | **Beyond Local Maxima?** | PASS | Stage 0 swept about thirty external sources across seven angles |
| 3 | **Sufficient?** | PASS | A research loop is the simplest way to verify vendor and corpus claims |
| 4 | **Fits Goal?** | PASS | The verdict is on the critical path to a safe default change |
| 5 | **Open Horizons?** | PASS | A verified verdict keeps later schema and index work aligned |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- This packet adds research docs only
- A later build packet would change the metadata JSON schemas and the index pipeline

**How to roll back**: Archive the packet under z_archive. No live system changed, so there is nothing to revert.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->
