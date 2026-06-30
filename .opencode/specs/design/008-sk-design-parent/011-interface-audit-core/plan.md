---
title: "Plan: sk-design interface and audit core asset build"
description: "Build plan for the seven highest-leverage interface and audit references and assets from the 009 expansion research. Interface authors the N1/N2 gates once and audit references them. Register-gated on 010. Executed, and the sk-design hub check passes."
trigger_phrases:
  - "design interface audit core build plan"
  - "sk-design preflight audit report plan"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/011-interface-audit-core"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Executed the build plan and wired the seven additions into the routers"
    next_safe_action: "Execute 012-foundations-motion-audit (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-011-interface-audit-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: sk-design interface and audit core asset build

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
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
| **Language/Stack** | Markdown authoring (`sk-doc` references and assets) inside the `sk-design` family |
| **Framework** | sk-design mode packets: `design-interface` and `design-audit` |
| **Storage** | Files under `sk-design/design-interface/{assets,references/design-process}/` and `sk-design/design-audit/{assets,references}/` |
| **Testing** | Existence and content checks per file, the author-once N1/N2 reference check, plus `validate.sh --strict` on this packet |

### Overview
Author seven references and assets that convert the 009 research findings for the two densest modes into checkable artifacts. Interface gains a mechanical pre-flight card plus three references (the N2 mechanical-defaults gate, the N1 copy-and-mock-data gate, and the brief-to-dials intake). Audit gains the audit report template plus the AI-fingerprint tells catalog and the register-gated transform/remediation routing. The N1 and N2 gates are authored once in interface; audit references them so the build-side and review-side views share one source. The transform verbs are gated on the operating register built in `010-shared-register`, so this phase follows it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `010-shared-register` built, so the transform verbs have a register to gate against
- [x] The 009 expansion research re-read (sections 3.2 design-interface, 3.5 design-audit, 4 priority ranking) to ground each addition
- [x] The live `design-interface` and `design-audit` trees confirmed so additions do not duplicate existing references

### Definition of Done
- [x] All seven references and assets exist under their named paths
- [x] The N1 and N2 gates are authored once in interface; audit references them with no duplicated gate content
- [x] `transform_remediation.md` cites the `010-shared-register` register as its gate, and `validate.sh --strict` passes on this packet
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Author-once, reference-twice: the N1 content gate and N2 mechanical gate live in interface; audit links to them. First-asset-first within each mode (pre-flight card and audit report template), then the supporting references.

### Key Components
- **design-interface additions**: `assets/interface_preflight_card.md` (mechanical pass/fail card), `references/design-process/mechanical_defaults.md` (N2 gate), `references/design-process/copy_and_mock_data.md` (N1 gate), `references/design-process/brief_to_dials.md` (three-dial intake).
- **design-audit additions**: `assets/audit_report_template.md` (5-dimension score + P0-P3 report), `references/ai_fingerprint_tells.md` (model-tell catalog), `references/transform_remediation.md` (register-gated directional verbs).
- **Shared gates**: N1 (`copy_and_mock_data.md`) and N2 (`mechanical_defaults.md`) are interface-owned and referenced by audit.

### Data Flow
`../009-reference-asset-expansion/research/research.md` (sections 3.2, 3.5, 4) + the operating register from `010-shared-register` → author the seven additions under `design-interface/` and `design-audit/` → audit references the interface N1/N2 gates → `validate.sh --strict`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase writes seven new references and assets into two live `sk-design` mode packets. It adds files only; it does not edit existing SKILL.md routing tables or other mode content. The operating register in `010-shared-register` is read as the gate for the transform verbs.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-design/design-interface/assets/` | no assets today | create (1 asset) | file present, mechanical sections complete |
| `sk-design/design-interface/references/design-process/` | existing process references | create (3 references, incl. N1/N2 gates) | files present; N1/N2 authored once |
| `sk-design/design-audit/assets/` | no assets today | create (1 asset) | file present, 5-dimension + P0-P3 skeleton complete |
| `sk-design/design-audit/references/` | existing audit references | create (2 references) | files present; transform reference register-gated |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm `010-shared-register` is built so the transform verbs have a register gate
- [x] Re-read the 009 expansion research (sections 3.2, 3.5, 4) to ground each of the seven additions
- [x] Confirm the live `design-interface` and `design-audit` trees so additions do not duplicate existing references

### Phase 2: Core Implementation
- [x] Author the N1 content gate and N2 mechanical gate in interface first (`copy_and_mock_data.md`, `mechanical_defaults.md`), since audit references them
- [x] Author the two first-assets (`interface_preflight_card.md`, `audit_report_template.md`) and the `brief_to_dials.md` intake
- [x] Author the audit `ai_fingerprint_tells.md` catalog and the register-gated `transform_remediation.md`, pointing the N1/N2 references back to interface
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Existence | All seven references and assets present at their named paths | `ls`/`test -f` |
| Content | Each file carries its full mechanical sections; the audit N1/N2 references point to the interface gates | Read + grep for the reference links |
| Manual | Register-gating of the transform verbs + spec validation | Read `transform_remediation.md`, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `010-shared-register` operating register | Internal | Green (built) | The transform verbs have no register to gate against |
| `009-reference-asset-expansion` research | Internal | Green | Additions cannot be grounded |
| Live `sk-design/design-interface` + `design-audit` packets | Internal | Green | No surface to expand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: An addition duplicates existing mode content, or the transform verbs cannot be gated because `010-shared-register` is not built.
- **Procedure**: All additions are net-new files under `design-interface/` and `design-audit/`; remove the newly created files to revert. No existing mode files are edited, so rollback is a file removal with no merge to unwind.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
