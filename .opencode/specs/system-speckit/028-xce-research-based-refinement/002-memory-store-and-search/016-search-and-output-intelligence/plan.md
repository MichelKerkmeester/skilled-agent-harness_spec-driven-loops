---
title: "Implementation Plan: Phase 1: search-and-output-intelligence-implementation"
description: "[2-3 sentences: what this implements and the technical approach]"
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/002-memory-store-and-search/016-search-and-output-intelligence"
    last_updated_at: "2026-06-17T09:57:00Z"
    last_updated_by: "implementation-engineer"
    recent_action: "Phase parent: detailed planning lives in the 7 phase children; control file reconciled"
    next_safe_action: "Per-child orchestrator review + commit"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-027-002-017-search-and-output-intelligence-implementation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: search-and-output-intelligence-implementation

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

> This is a phase-parent control file. The simplest-viable plan for each finding lives in its phase child; this file records only the shared technical context and gate.

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (MCP server `lib/search/*`) + markdown command contract (`/memory:search`) |
| **Framework** | None (Node library + OpenCode command/presentation asset) |
| **Storage** | None |
| **Testing** | Vitest for S1-S5 code; render self-check + (follow-up) live A/B for O1-O2 |

### Overview
Implement the prioritized 016 research findings as 7 independent phase children: S1-S5 calibration/recall fixes in `lib/search/*` and O1-O2 command-contract/output-parity changes in `/memory:search`. Each child plans, ships, and verifies its own finding; this parent tracks aggregate progress via the phase map in `spec.md`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Per-finding library + command-contract edits in the existing search pipeline (no new architecture).

### Key Components
- **`lib/search/*` (S1-S5)**: token-budget safety, request-quality aggregation, generic-query routing, calibration infra, cosine top-N reorder.
- **`/memory:search` + `assets/search_presentation.txt` (O1-O2)**: deterministic arg handling + salience inversion, and output surface-parity.

### Data Flow
Detailed per-component data flow lives in the phase children; at the parent level, each finding tunes the gate/recall/output contract built on the 015 absolute-relevance scale.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

> Per-finding affected-surface inventories live in each phase child's plan. Parent-level summary:

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `lib/search/*` (hybrid-search, confidence-scoring, query-classifier, dynamic-token-budget, query-expander, recovery-payload, confidence-calibration, search-flags) | Owns gate/recall/budget behavior | update (S1-S5) | Per-child Vitest sweeps green |
| `/memory:search` + `assets/search_presentation.txt` | Command/output contract | update (O1-O2) | Render self-check; live A/B follow-up |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] 016 findings prioritized; one phase child scaffolded per finding

### Phase 2: Core Implementation
- [x] S1-S5 code phases shipped (children 001-005)
- [x] O1-O2 command-contract phases shipped (children 006-007)
- [x] P5 (FSRS cold-tier) dispositioned as a documented no-change

### Phase 3: Verification
- [x] Each child passes `validate.sh --strict`
- [x] Touched-surface test sweeps green per child
- [x] Per-child `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | S1-S5 search-pipeline functions (per-child focused vitests) | Vitest |
| Regression | Existing search suites; no new failures vs baseline | Vitest |
| Manual | O1-O2 contract: render self-check; live cross-model A/B is a follow-up | - |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 015 `resolveAbsoluteRelevance` cosine calibration | Internal | Green | The gate these phases tune is unavailable |
| 016 research lineages (KQ1-KQ5, recs #1-#7) | Internal | Green | No prioritized evidence base to implement |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: New search-test failures vs baseline, or a measured ranking/output regression on a child's surface.
- **Procedure**: Roll back per child. S4 calibration and S5 reorder are flag-gated (calibration default-OFF; reorder reversible via `SPECKIT_COSINE_TOPN_REORDER=false`); O1-O2 are contract-doc reverts; S1-S3 are surgical code reverts.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
