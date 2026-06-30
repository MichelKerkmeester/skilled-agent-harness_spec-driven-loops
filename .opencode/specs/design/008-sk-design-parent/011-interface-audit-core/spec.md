---
title: "Feature Specification: sk-design interface and audit core asset build"
description: "Executed Level-1 phase: built the seven highest-leverage interface and audit references and assets from the 009 expansion research. Interface authors the N1 content gate and N2 mechanical gate once and audit references them. The sk-design hub passes package_skill --check."
trigger_phrases:
  - "design interface audit core build"
  - "sk-design preflight card audit report"
  - "design N1 N2 gate authoring"
  - "design interface audit assets phase"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/011-interface-audit-core"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Built the seven interface and audit files and wired the routers, hub check passes"
    next_safe_action: "Execute 012-foundations-motion-audit (next phase)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-011-interface-audit-core"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: sk-design interface and audit core asset build

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-26 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../010-shared-register/spec.md |
| **Successor** | ../012-foundations-motion-audit/spec.md (planned) |
| **Handoff Criteria** | The seven planned interface/audit references and assets exist under `sk-design/design-interface/` and `sk-design/design-audit/`; the N1 content gate and N2 mechanical gate are authored once in interface and referenced (not duplicated) by audit; `validate.sh --strict` passes on this packet |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 009 expansion research (`../009-reference-asset-expansion/research/research.md`) settled which references and assets each sk-design mode should gain, but produced findings only. Two of the five modes carry the densest, highest-leverage gaps: `design-interface` ships zero assets and has no mechanical layout pre-flight gate or mock-content discipline, and `design-audit` ships zero assets despite its deliverable being a report. The research ranks the interface and audit first-assets, the model-tell catalog, and the author-once N1/N2 gates as the top operator-leverage work after the shared register. Left unbuilt, the family keeps converting common LLM design defects into prose rather than checkable gates.

### Purpose
Build the interface and audit core: the two highest-ROI fill-in cards (interface pre-flight card and audit report template), the model-specific AI-fingerprint catalog, the register-gated transform/remediation routing, the brief-to-dials intake, and the N1 content gate and N2 mechanical gate. The N1 and N2 gates are authored once in `design-interface` and referenced by `design-audit` so the two surfaces share one source of truth instead of drifting. This phase is the build follow-up to the 009 research; the shared operating register it depends on is built in `010-shared-register` first.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Four `design-interface` additions: the mechanical pre-flight card asset, and the mechanical-defaults (N2), copy-and-mock-data (N1), and brief-to-dials references.
- Three `design-audit` additions: the audit report template asset, the AI-fingerprint tells reference, and the register-gated transform/remediation reference.
- Authoring the N1 content gate and N2 mechanical gate once in interface; audit references them rather than duplicating.

### Out of Scope
- The shared operating register itself (built in `010-shared-register`; this phase depends on it).
- Foundations and motion references and assets (later phases, e.g. `012-foundations-motion-audit`).
- The md-generator authoring-boundary reference and any other mode's expansions.
- Editing `sk-design/` SKILL.md routing tables or any file outside the seven named targets.

### Inputs (read-only)
- The 009 expansion research: `../009-reference-asset-expansion/research/research.md` (the source of every addition here; see sections 3.2 design-interface, 3.5 design-audit, 4 priority ranking).
- The live mode packets `.opencode/skills/sk-design/design-interface/` and `.opencode/skills/sk-design/design-audit/` (the surfaces being expanded).
- The operating register produced by `010-shared-register` (gates the transform verbs).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md` | Create | Mechanical pass/fail pre-flight card: hero line count, eyebrow/meta-label sweep, gapless bento, real-imagery, button contrast, copy audit, motion motivation, reduced-motion, mobile collapse, AI tells. First asset for the mode. |
| `.opencode/skills/sk-design/design-interface/references/design-process/mechanical_defaults.md` | Create | The mechanical anti-default checklist (the layout "N2" gate). Authored once here; audit references it. |
| `.opencode/skills/sk-design/design-interface/references/design-process/copy_and_mock_data.md` | Create | Realistic mock-content discipline (the "N1" content gate): no lorem, no fake-round numbers, no AI-tell copy, image-seed discipline. Authored once here; audit references it. |
| `.opencode/skills/sk-design/design-interface/references/design-process/brief_to_dials.md` | Create | Design-Read intake mapping the variance/motion/density dials to layout/motion/density choices. |
| `.opencode/skills/sk-design/design-audit/assets/audit_report_template.md` | Create | Fill-in 5-dimension score plus P0-P3 findings report (the audit deliverable is a report). First asset for the mode. |
| `.opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md` | Create | Model-specific "this looks AI-generated" defect catalog turned into checkable P0-P3 findings. |
| `.opencode/skills/sk-design/design-audit/references/transform_remediation.md` | Create | Directional transform verbs (bolder/quieter/distill) mapped to findings plus remediation paths; register-gated (depends on `010-shared-register`). |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The two first-assets exist and are usable as fill-in artifacts | `design-interface/assets/interface_preflight_card.md` and `design-audit/assets/audit_report_template.md` exist with their full mechanical sections |
| REQ-002 | The N1 content gate and N2 mechanical gate are authored once and referenced, not duplicated | `mechanical_defaults.md` (N2) and `copy_and_mock_data.md` (N1) exist under design-interface; the audit references point back to them rather than restating the gates |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The AI-fingerprint catalog turns model tells into checkable findings | `design-audit/references/ai_fingerprint_tells.md` lists model-specific tells as P0-P3 findings, not prose impressions |
| REQ-004 | The transform/remediation routing is register-gated | `design-audit/references/transform_remediation.md` maps directional verbs to findings and remediation and references the `010-shared-register` register as its gate |
| REQ-005 | The brief-to-dials intake maps the three dials to choices | `design-interface/references/design-process/brief_to_dials.md` records the Design-Read intake mapping variance/motion/density dials to layout/motion/density decisions |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All seven named references and assets exist under `design-interface/` and `design-audit/`, each tracing to the 009 expansion research.
- **SC-002**: The N1 and N2 gates are authored once in interface and referenced by audit; no gate content is duplicated across the two modes.
- **SC-003**: The transform/remediation reference is register-gated against `010-shared-register`, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `010-shared-register` operating register | The transform verbs in `transform_remediation.md` have no register to gate against | Build `010-shared-register` first; treat the register as the predecessor for this phase |
| Risk | N1/N2 gates duplicated across interface and audit | The two surfaces drift; the "author once" rule is lost | Author N1/N2 in interface only; audit references them by path |
| Risk | Additions drift into bulk corpus import | Family dilutes; the leverage bar set by 009 is lost | Build only the seven ranked additions; cite the 009 research source per file |
| Dependency | The 009 expansion research | Additions cannot be grounded | Read `../009-reference-asset-expansion/research/research.md` (sections 3.2, 3.5, 4) as the source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All build-time questions are resolved.

- Three-dials ownership (foundations vs interface or shared). Resolved: `brief_to_dials.md` places the variance, motion, and density intake in interface and defers the Brand-vs-Product posture to the shared register. The density dial may still coordinate with foundations in a later phase.
- N1/N2 owning home (shared vs interface-owned-with-audit-reference). Resolved: interface-owned, with audit referencing the gates by path, per the priority ranking.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
