---
title: "Implementation Plan: Phase 7: output-surface-parity"
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
    packet_pointer: "027/002/017/007-output-surface-parity"
    last_updated_at: "2026-06-17T08:40:00Z"
    last_updated_by: "contract-engineer"
    recent_action: "Mandated similarity-only render + surface-parity clause; plan superseded by impl-summary"
    next_safe_action: "Run live cross-model A/B render-consistency probe"
    blockers: []
    key_files:
      - ".opencode/commands/memory/search.md"
      - ".opencode/commands/memory/assets/search_presentation.txt"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "system-speckit/027-017/007-output-surface-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which single metric governs rendered output? similarity, 0–1, two decimals, on every surface."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: output-surface-parity

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
| **Language/Stack** | OpenCode/Claude slash-command markdown + a presentation asset |
| **Framework** | None (command contract + render policy) |
| **Storage** | None |
| **Testing** | Cross-file consistency grep + `validate.sh --strict`; live cross-model A/B is a follow-up |

### Overview
Strengthen the existing soft 0–1 hint into a hard `similarity` mandate plus an explicit `confidence`/percentage ban, name the five mandatory core slots and two optional trailing fields, and add a surface-parity clause and COSTAR register note - layered on top of the prior O1 structural layer without touching it. See `implementation-summary.md` for the delivered detail.
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
Command-contract markdown + presentation asset render policy (no application architecture).

### Key Components
- **§3 render mandate (`search.md`)**: `similarity` 0–1 / 2dp sole metric, `confidence`/percentage ban, five named core slots, surface-parity clause, named optional fields, extended self-check.
- **§2 render policy (`search_presentation.txt`)**: same mandate/ban/core-slots/parity/optional-field rules mirrored in the asset.

### Data Flow
A retrieval result is rendered through the contract: each row emits the five core slots with `similarity` only, optional `requestQuality`/`citationPolicy` between the block and the terminal STATUS footer; the self-check rejects `confidence`/percentage before output.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/commands/memory/search.md` §3/§7 | Owns the render contract | update (mandate, ban, core slots, parity clause, optional fields, self-check) | Cross-file grep: mandate/ban/slots/parity present |
| `.opencode/commands/memory/assets/search_presentation.txt` §2 | Render policy read alongside the contract | update (same mandate/ban/slots/parity mirrored) | Cross-file grep on the asset |
| `search.md` §0 header / salience / startup gating (O1) | Phase-006 structural layer | unchanged | Grep: O1 lines unchanged |
| Constitutional-rows-excluded rule | Existing render exclusion | unchanged | Grep: preserved |

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
- [x] Confirmed the existing field-mapping table is correct; the failure is optional compliance, not mapping

### Phase 2: Core Implementation
- [x] §3 score mandate + `confidence`/percentage ban (search.md)
- [x] Five named mandatory core slots + extended render self-check (both files)
- [x] Surface-parity clause + named optional trailing fields + COSTAR register note (both files)

### Phase 3: Verification
- [x] Cross-file consistency grep: mandate, ban, slots, parity, named optional, register
- [x] O1 §0 header + salience + startup gating confirmed untouched
- [x] `validate.sh --strict` PASS; `implementation-summary.md` written
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static | Cross-file consistency grep (mandate, ban, slots, parity, optional, register) | grep |
| Structural | Spec-folder validation | `validate.sh --strict` |
| Behavioral A/B | Cross-model render consistency on `--command` | Live run (follow-up; not runnable here) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 006 (O1) structural layer | Internal | Green | This phase layers render policy on top of O1; O1 must stay intact |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The mandate breaks a downstream consumer of the rendered block, or live A/B shows worse parity.
- **Procedure**: Revert the contract/asset edits; this phase is additive render policy on top of the committed O1 layer, so reverting restores the prior soft-hint contract.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->

