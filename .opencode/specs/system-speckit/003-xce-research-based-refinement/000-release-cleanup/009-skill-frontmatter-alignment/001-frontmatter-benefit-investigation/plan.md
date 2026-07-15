---
title: "Implementation Plan: Phase 1: Frontmatter Benefit Investigation"
description: "Three-track read-only investigation: frontmatter inventory sweep, runtime consumer audit with file:line evidence, and sk-doc contract analysis."
trigger_phrases:
  - "frontmatter investigation plan"
  - "consumer audit approach"
  - "frontmatter inventory sweep"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/003-xce-research-based-refinement/000-release-cleanup/009-skill-frontmatter-alignment/001-frontmatter-benefit-investigation"
    last_updated_at: "2026-06-11T06:10:00Z"
    last_updated_by: "claude-fable"
    recent_action: "Plan executed; all three tracks complete"
    next_safe_action: "Operator decides canonical contract; then start skill children"
    blockers: []
    key_files:
      - "research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-11-frontmatter-benefit-investigation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Frontmatter Benefit Investigation

<!-- SPECKIT_LEVEL: 1 -->
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
| **Language/Stack** | Markdown docs; TypeScript/Python runtime code (read-only) |
| **Framework** | Spec Kit Memory MCP, Skill Advisor MCP, Code Graph MCP |
| **Storage** | None (read-only investigation) |
| **Testing** | Evidence verification: every consumer claim cites file:line |

### Overview
Answer the benefit question with three read-only tracks: (1) sweep `references/` and `assets/` of all 21 skills to quantify frontmatter practice, (2) audit the three plausible runtime consumers (memory indexer, skill-advisor compiler, code-graph scope) in source, (3) read sk-doc's skill-creation guidance and templates for the prescribed contract. Synthesize into a recommendation in research.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (not applicable - read-only investigation)
- [x] Docs updated (spec/plan/tasks/research/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only evidence audit (inventory sweep + source-code consumer trace + contract document analysis)

### Key Components
- **Inventory sweep**: `rg -l "trigger_phrases:"` plus first-line frontmatter probe over 369 docs, grouped per skill
- **Consumer audit**: gating functions in `memory-parser.ts` (`isIndexablePath`), `skill_graph_compiler.py` / `skill-graph-db.ts` (graph-metadata-only inputs), `index-scope.ts` (skills excluded from code graph by default)
- **Contract analysis**: `sk-doc/references/skill_creation.md`, `sk-doc/assets/frontmatter_templates.md`, feature_catalog/readme templates

### Data Flow
Sweep counts + consumer evidence + contract quotes converge in research.md §2; the recommendation derives only from cited evidence.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Inventory
- [x] Count detailed-block docs per skill (references/, assets/)
- [x] Count title+description-only and no-frontmatter docs

### Phase 2: Consumer Audit
- [x] Trace memory indexing gate (isIndexablePath: spec docs + constitutional only)
- [x] Trace skill-advisor inputs (graph-metadata.json only; 24-phrase schema cap)
- [x] Trace code-graph scope policy (skills excluded by default)

### Phase 3: Synthesis
- [x] Read sk-doc contract docs and record contradictions
- [x] Write research.md with findings and recommendation
- [x] Record operator decision point in implementation-summary.md
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Evidence check | Every consumer/non-consumer claim has file:line citation | Read/rg verification |
| Reproducibility | Sweep commands recorded in research.md appendix | rg/find |
| Manual | Operator review of recommendation options | research.md |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Source access to mcp_server code (spec-kit, skill-advisor) | Internal | Green | Consumer audit impossible without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Not applicable - this phase writes only packet-local documentation.
- **Procedure**: Delete or amend packet docs; no production surface touched.
<!-- /ANCHOR:rollback -->
