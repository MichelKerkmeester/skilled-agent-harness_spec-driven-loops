---
title: "Plan: sk-design foundations, motion, and audit-depth expansion"
description: "Build plan for ten sk-design additions across foundations, motion, and audit, grounded in the 009 deep-research deliverable. Two references and one asset for foundations, one reference and three assets for motion, two references and one asset for audit depth. Executed, and the sk-design family passes package_skill --check."
trigger_phrases:
  - "sk-design foundations motion audit plan"
  - "design data viz motion restraint plan"
  - "design audit evidence hardening plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/012-foundations-motion-audit"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the build plan and wired the ten additions into the routers"
    next_safe_action: "Execute 013-mdgen-boundary-cleanup (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-012-foundations-motion-audit"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design foundations, motion, and audit-depth expansion

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown authoring under `.opencode/skills/sk-design/` (references and assets) |
| **Framework** | sk-design mode packets: design-foundations, design-motion, design-audit |
| **Storage** | Files under each mode's `references/` and `assets/`. This packet holds the build-tracking docs |
| **Testing** | Per-file path-and-purpose review against the 009 deliverable + `validate.sh --strict` on this packet |

### Overview
Author ten additions across three sk-design modes in one phase, each grounded in `../009-reference-asset-expansion/research/research.md`. Foundations gained the data-viz reference (its one real hole), the adaptation matrix, and the first foundations asset. Motion gained the restraint gate plus three reusable asset cards. Audit gained the evidence model, the accessibility quick-fixes, and the hardening matrix. Every file is bounded to the named coverage hole and references existing mode content rather than re-declaring it, so the family gains checkable depth, not volume. This phase is EXECUTED. All ten files are built and wired into their mode routers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The shared register and audit base are in place (`010-shared-register` and `011-interface-audit-core`) so the audit-depth files have a base to extend
- [x] Grounding confirmed: `../009-reference-asset-expansion/research/research.md` sections 3.2, 3.3, 3.4, and the priority ranking
- [x] Live `sk-design/` foundations, motion, and audit homes and the existing references each new file keys into are confirmed

### Definition of Done
- [x] All ten files exist under their named paths and each delivers the purpose stated in `spec.md`
- [x] No addition duplicates content already owned by an existing mode reference, and each cites the 009 deliverable
- [x] `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Three independent mode clusters (foundations, motion, audit), each authored as references plus assets, all keyed to existing mode content and the shared register.

### Key Components
- **Foundations cluster**: `references/data_viz.md`, `references/layout/adaptation_matrix.md`, `assets/token_starter.md`. These close the data-viz hole, add context adaptation, and wire the static-system references into the first fill-in token scaffold.
- **Motion cluster**: `references/animation_decision_framework.md` plus `assets/motion_pattern_cards.md`, `assets/animate_presence_checklist.md`, `assets/motion_performance_failure_card.md`. These add the restraint gate plus the first reusable motion cards.
- **Audit-depth cluster**: `references/evidence_capture.md`, `references/hardening_edge_cases.md`, `assets/a11y_quick_fixes.md`. These add the evidence model, the production-readiness matrix, and snippet-level accessibility fixes.

### Data Flow
`../009-reference-asset-expansion/research/research.md` (sections 3.2, 3.3, 3.4, priority ranking) + the live `sk-design/` mode trees → author each file under its mode's `references/` or `assets/`, referencing existing content and the shared register → validate the packet.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase wrote new references and assets under three `sk-design/` mode packets. It added files and wired each into its mode SKILL.md router. It did not modify the existing references and assets in those modes. The predecessor phases landed first.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `design-foundations/references/` and `assets/` | static-system foundations, first asset added | created 2 references + 1 asset | files present, data-viz and adaptation holes closed, first asset added and routed |
| `design-motion/references/` and `assets/` | motion basics covered, first assets added | created 1 reference + 3 assets | restraint gate present, three reusable cards added and routed |
| `design-audit/references/` and `assets/` | densest expansion target, first asset added | created 2 references + 1 asset | evidence model, hardening matrix, and a11y fixes present and routed |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the predecessors (`010-shared-register`, `011-interface-audit-core`) have landed so the audit-depth files have a base
- [x] Re-read `../009-reference-asset-expansion/research/research.md` sections 3.2, 3.3, 3.4, and the priority ranking
- [x] Confirm the foundations, motion, and audit homes and the existing references each new file keys into

### Phase 2: Core Implementation
- [x] Foundations: author `references/data_viz.md` (the one real hole), then `references/layout/adaptation_matrix.md`, then `assets/token_starter.md`
- [x] Motion: author `references/animation_decision_framework.md` (restraint gate), then `assets/motion_pattern_cards.md`, `assets/animate_presence_checklist.md`, and `assets/motion_performance_failure_card.md`
- [x] Audit: author `references/evidence_capture.md`, then `assets/a11y_quick_fixes.md`, then `references/hardening_edge_cases.md`

### Phase 3: Verification
- [x] Verify each file delivers its named path and purpose and references existing content rather than duplicating it
- [x] Verify each addition cites the 009 deliverable as its source
- [x] Run `validate.sh --strict` on this packet and on the touched mode packets, then update continuity and STOP for review
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual | Each file's path and purpose against the 009 deliverable | Read + diff against `research/research.md` sections 3.2/3.3/3.4 |
| Manual | No-duplication check vs existing mode references | Grep across each mode's `references/` for the owned-basics topics |
| Integration | Packet doc validity | `validate.sh --strict` on this packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../009-reference-asset-expansion/research/research.md` | Internal | Green | Additions cannot be grounded |
| `../010-shared-register` (shared register) | Internal | Green (built) | Foundations/motion/audit defaults have no shared signal to reference |
| `../011-interface-audit-core` (audit base) | Internal | Green (built) | Audit-depth files have no base to extend |
| Live `sk-design/` mode trees | Internal | Green | Mode homes and keyed references unconfirmed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An addition duplicates owned content, drifts into volume import, or cannot be grounded in the 009 deliverable.
- **Procedure**: Each addition is a new, isolated file under a mode's `references/` or `assets/`. Remove the offending file or files and revert the matching router rows. No existing mode content is modified in this phase, so rollback is a per-file removal with no migration to unwind.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
