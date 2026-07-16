---
title: "Feature Specification: Reconstruct the sk-design audit mode"
description: "The shipped sk-design audit mode lacked a tracked spec-folder packet, so its source-defined scoring, accessibility checks, hardening workflow, evidence contract, and owner routing were not documented in packet form. This reconstruction records only behavior stated by the intact design-audit source and its references, assets, procedures, and downstream check scripts."
trigger_phrases:
  - "sk-design audit reconstruction"
  - "design audit specification"
  - "findings first design score"
  - "audit accessibility hardening"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/004-design-audit"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "gpt-5.6-luna"
    recent_action: "Drafted source faithful audit specification"
    next_safe_action: "Review specification against shipped source"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-audit/SKILL.md"
      - ".opencode/skills/sk-design/design-audit/references/"
      - ".opencode/skills/sk-design/design-audit/assets/"
      - ".opencode/skills/sk-design/design-audit/procedures/"
      - ".opencode/skills/sk-design/design-audit/scripts/"
      - ".opencode/specs/sk-design/004-design-audit/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-design-audit-reconstruction-20260716"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Reconstruct the sk-design audit mode
<!-- SPECKIT_LEVEL: 2 -->

> RECONSTRUCTION DRAFT (best-effort). This spec did not previously exist in git or memory; it is reconstructed from the intact source .opencode/skills/sk-design/design-audit/SKILL.md and its references/, assets/, and scripts/. Verify against that source before treating any line as authoritative.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-07-16 |
| **Branch** | 0055-skilled-migration-000-scaffold |
| **Spec Folder** | 004-design-audit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The shipped `audit` mode is the cross-cutting QA and critique child of the `sk-design` family, but its packet was absent from git and memory. The intact source specifies evidence-backed review, accessibility and performance gates, responsive and theming checks, anti-pattern detection, production hardening, severity-ranked findings, and a five-dimension score that need to be represented without adding behavior.

### Purpose
Reconstruct a Level-2 packet that makes the source-defined audit contract inspectable while preserving its evidence, scoring, read-only, routing, and ownership boundaries.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Public `audit` activation triggers, skip conditions, family boundaries, and sibling integration points.
- Target resolution, Brand-vs-Product register loading, evidence types and labels, the audit context/proof gate, and the direct fallback.
- Smart routing across audit contract, accessibility/performance, critique/hardening, anti-pattern/production, transform remediation, and evidence capture domains.
- Findings-first P0-P3 severity, the Accessibility, Performance, Responsive Design, Theming, and Anti-Patterns dimensions, and the `/20` rating bands.
- Accessibility coverage, WCAG and performance checks, critique and cognitive-load lenses, production-hardening edge cases, model-specific AI tells, and register-gated transform routing.
- The two private procedure cards, the no-procedure fallback, the Read/Glob/Grep-only surface, and accepted-finding backlog handoff to `sk-code`.
- The downstream boundary for `scripts/perf_evidence_check.py` and `scripts/polish_readiness_check.py`, plus traceability to the fingerprint registry, fixtures, reports, and worksheets.

### Out of Scope
- Creating a new visual direction or redesign; the source routes direction work to `interface`.
- Defining static color, type, spacing, layout, responsive, or theming tokens; the source routes those fixes to `foundations`.
- Authoring motion choreography or reduced-motion repairs; the source routes those fixes to `motion`.
- Applying accepted fixes, editing source files, granting write authority, or performing broader code correctness, security, or test review; implementation belongs to `sk-code` or its code-review mode.
- Running the two deterministic check scripts, the fixture runner, browser scans, overlays, or other Bash-capable checks from the audit mode.
- Reconstructing the full schemas of shared register, context-loading, or `sk_code_handoff` documents beyond fields named by the source.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/specs/sk-design/004-design-audit/spec.md | Create | Level-2 reconstruction specification for the audit mode. |
| .opencode/specs/sk-design/004-design-audit/plan.md | Create | Source-faithful reconstruction plan and boundaries. |
| .opencode/specs/sk-design/004-design-audit/tasks.md | Create | Task breakdown for authoring and checking the packet. |
| .opencode/specs/sk-design/004-design-audit/checklist.md | Create | Unchecked Level-2 verification checklist for the reconstruction draft. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Preserve audit ownership of cross-cutting design QA and critique. | The packet names accessibility, performance, responsive behavior, theming, anti-patterns, scoring, severity, risk surfacing, and hardening as the audit axis, while separating review from creation and implementation. |
| REQ-002 | Preserve activation, skip, and family boundaries. | The packet records evaluative triggers and the stated exclusions for `interface`, `foundations`, `motion`, `sk-code`, and broader code review. |
| REQ-003 | Preserve target, evidence, register, and proof gates. | The packet records concrete target resolution, source/rendered/design-artifact evidence, confirmed/inferred/not-assessed handling, register-first scoring, and the coverage needed before readiness claims. |
| REQ-004 | Preserve findings-first severity and scoring. | The packet records P0-P3 ordering, the user-impact severity test, five 0-4 dimensions, `/20` rating bands, and the report order. |
| REQ-005 | Preserve the read-only and no-fix boundary. | The packet records Read/Glob/Grep only, no subagent dispatch in direct fallback, no Write/Edit/Bash/Task use by the mode, no silent fixes, and accepted-finding handoff to `sk-code`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Preserve smart routing and conditional resource loading. | The packet records always-loaded corpus/register/context resources, conditional domain resources, guarded discovery, existence checks, routing-key behavior, ambiguity handling, and the unknown fallback checklist. |
| REQ-007 | Preserve accessibility, performance, critique, and hardening checks. | The packet records names, keyboard, focus, semantics, forms, announcements, contrast, motion, Core Web Vitals, cognitive load, personas, polish, hostile inputs, errors, permissions, concurrency, i18n, RTL, text expansion, CJK, emoji, overlays, and constrained-device probes where the source applies them. |
| REQ-008 | Preserve anti-pattern and AI-fingerprint evidence. | The packet records token and theme drift, copy, pseudo-element and View Transition checks, the model-specific tell catalog, registry/fixture relationship, Anti-Patterns rubric, and evidence-backed severity and owner routing. |
| REQ-009 | Preserve transform remediation and downstream verification boundaries. | The packet records register-gated `bolder`, `quieter`, `distill`, and `redesign` routing, the two local deterministic scripts as downstream checks, and the distinction between a clean scan and a complete design verdict. |
| REQ-010 | Preserve source traceability without inventing behavior. | The packet cites the intact skill, real references, procedures, assets, scripts, and supporting playbook paths, and labels this packet as a reconstruction draft. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet describes `audit` as the evidence-backed, findings-first design QA and critique mode and keeps creation, repair, and broader code review with the named sibling owners.
- **SC-002**: The packet captures target resolution, register-first posture, evidence labels, accessibility coverage, P0-P3 severity, five-dimension `/20` scoring, and the required report order.
- **SC-003**: The packet records accessibility/performance gates, critique and hardening probes, anti-pattern and model-tell checks, production-readiness boundaries, and accepted-finding routing.
- **SC-004**: The packet makes the Read/Glob/Grep-only surface, no-fix rule, direct fallback, at-most-one private procedure-card rule, and no-procedure fallback explicit.
- **SC-005**: Every source claim in the reconstruction can be traced to the intact source or a cited reference, procedure, asset, script, or supporting playbook path, without claiming that runtime checks were executed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The shared Brand-vs-Product register, context-loading proof contract, and `sk_code_handoff` envelope are named by the source through sibling paths. | Their full schemas are outside this child source set. | Preserve only the fields and routing behavior named by `SKILL.md`; retain the shared-path pointers without reconstructing undisclosed content. |
| Risk | Readiness, accessibility, performance, and visual claims require evidence that may be unavailable. | A packet could turn an inferred or missing check into a false confirmed result. | Preserve the evidence labels, seven-layer accessibility coverage, not-assessed blockers, static-risk language, and residual-risk close. |
| Risk | Audit overlaps with interface, foundations, motion, and sk-code. | The reconstruction could assign direction, tokens, choreography, or implementation to the critic. | Keep the explicit family boundary, owner map, transform-routing gate, and audit-never-fixes rule. |
| Risk | Deterministic checks and fixtures are downstream of this read-only mode. | A packet could falsely claim performance, polish, or fingerprint validation. | Record the two scripts, fixture relationship, and external execution boundary without reporting a run. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: No runtime performance behavior is claimed for this reconstruction; the audit reviews performance evidence and routes fixes.
- **NFR-P02**: A Performance score above 2 requires a numeric metric or an explicit `not-assessed` label in the filled report; the deterministic gate is downstream.

### Security
- **NFR-S01**: No authentication or authorization behavior is specified by the audit source.
- **NFR-S02**: The documented mode surface excludes workspace mutation and shell execution, including direct invocation of downstream scripts.

### Reliability
- **NFR-R01**: Findings remain evidence-backed, severity ordered, owner mapped, and labeled confirmed or inferred through the score and handoff.
- **NFR-R02**: Any accessibility, accessible, WCAG, release-ready, or production-ready claim carries the seven-layer coverage matrix and cannot pass an unqualified `not-assessed` layer.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Unresolved target: escalate rather than audit a guess; the target must be a file, URL, screenshot, or concrete design artifact.
- Source-only, rendered-only, screenshot-only, or design-plan-only evidence: label the finding according to the evidence type, and treat screenshot-only findings as inferred when source is unavailable.
- Large source tree or CSS-only target: narrow to the surface and pass markup to deterministic scans rather than scanning a stylesheet alone.
- Full versus focused audit: score all five dimensions for a full audit and mark unavailable dimensions not assessed with the reason.

### Error Scenarios
- Browser, overlay, deterministic scan, or metric unavailable: report the fallback or static-risk signal and never present the missing check as a clean pass.
- Accessibility coverage has a `not-assessed` layer: block accessibility, WCAG, release-ready, and production-ready claims until the gap is resolved or honestly caveated.
- No private procedure card matches: state `Procedure applied: none - baseline audit workflow` and continue with the audit contract.
- Subagents are unavailable or disallowed: execute the same selection, context, proof, findings, and score directly with Read, Glob, and Grep only.
- Accepted findings or zero accepted findings: emit the shared backlog handoff, including an empty valid backlog when applicable; do not apply changes.

### State Transitions
- Public mode selected: load the always-needed corpus, register, and context resources, then conditionally load the matching audit domains and guarded keyed resources.
- Procedure trigger matched: choose at most one primary private card and cite its relative path and proof; otherwise use the exact no-card fallback.
- Evidence captured: carry confirmed, inferred, blocked, or not-assessed labels into findings, scores, handoff, and residual-risk notes.
- Directional finding identified: resolve register posture, route to `bolder`, `quieter`, `distill`, or `redesign`, name the owner, and leave implementation to `sk-code` after acceptance.
- Review complete: report findings first, then score, anti-pattern verdict, positive findings, owner actions, evidence limits, and residual risks.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | One cross-cutting mode with evidence, routing, scoring, accessibility, hardening, anti-pattern, procedure, handoff, and downstream-check boundaries. |
| Risk | 13/25 | The main risks are false readiness claims, evidence-label drift, sibling-owner confusion, and mistaken script execution; no runtime code is changed. |
| Research | 18/20 | Reconstruction requires the intact skill, ten references, two procedures, twenty-seven assets, two scripts, and related supporting materials named by the source. |
| **Total** | **49/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- The exact shared register, context-loading, and `sk_code_handoff` schemas remain owned by their shared references and are not reconstructed here.
- Runtime truth of any `confirmed` evidence label belongs to an actual audit pass; this packet records the contract, not a target-specific verdict.
<!-- /ANCHOR:questions -->

---

## 11. SOURCES / TRACEABILITY

The following intact paths were read as reconstruction evidence. They are source references, not additional behavior:

### Skill, references, procedures, and scripts

- .opencode/skills/sk-design/design-audit/SKILL.md
- .opencode/skills/sk-design/design-audit/references/accessibility_performance.md
- .opencode/skills/sk-design/design-audit/references/ai_fingerprint_tells.md
- .opencode/skills/sk-design/design-audit/references/anti_patterns_production.md
- .opencode/skills/sk-design/design-audit/references/audit_contract.md
- .opencode/skills/sk-design/design-audit/references/corpus_map.md
- .opencode/skills/sk-design/design-audit/references/critique_hardening.md
- .opencode/skills/sk-design/design-audit/references/evidence_capture.md
- .opencode/skills/sk-design/design-audit/references/hardening_edge_cases.md
- .opencode/skills/sk-design/design-audit/references/smart_router_pseudocode.md
- .opencode/skills/sk-design/design-audit/references/transform_remediation.md
- .opencode/skills/sk-design/design-audit/procedures/accessibility_audit.md
- .opencode/skills/sk-design/design-audit/procedures/ai_slop_check.md
- .opencode/skills/sk-design/design-audit/scripts/perf_evidence_check.py
- .opencode/skills/sk-design/design-audit/scripts/polish_readiness_check.py

### Assets

- .opencode/skills/sk-design/design-audit/assets/a11y_quick_fixes.md
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_registry.json
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_self_defect_card.md
- .opencode/skills/sk-design/design-audit/assets/anti_patterns_score_rubric.md
- .opencode/skills/sk-design/design-audit/assets/audit_evidence_worksheet.md
- .opencode/skills/sk-design/design-audit/assets/audit_report_template.md
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/README.md
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_cream_or_sand_body_background/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_cream_or_sand_body_background/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_diagonal_stripe_background/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_diagonal_stripe_background/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_element_tracking_on_display_type/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_element_tracking_on_display_type/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_eyebrow_above_every_section/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_eyebrow_above_every_section/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_ghost_card_border_plus_shadow/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_ghost_card_border_plus_shadow/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_image_hover_animation/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_image_hover_animation/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_over_rounded_cards/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_over_rounded_cards/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_sketchy_svg_illustration/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_sketchy_svg_illustration/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_theater_meta_criticism_copy/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_theater_meta_criticism_copy/tell.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_uniform_section_fade_and_rise/clean.html
- .opencode/skills/sk-design/design-audit/assets/ai_fingerprint_fixtures/ai_fingerprint_uniform_section_fade_and_rise/tell.html

### Supporting shipped material

- .opencode/skills/sk-design/design-audit/README.md
- .opencode/skills/sk-design/design-audit/feature_catalog/feature_catalog.md
- .opencode/skills/sk-design/design-audit/feature_catalog/ai_tell_catalog/ai_fingerprint_tell_catalog.md
- .opencode/skills/sk-design/design-audit/feature_catalog/findings_first_review/findings_first_report_and_scoring.md
- .opencode/skills/sk-design/design-audit/feature_catalog/findings_first_review/register_gated_severity.md
- .opencode/skills/sk-design/design-audit/feature_catalog/procedure_cards/audit_procedure_card_inventory.md
- .opencode/skills/sk-design/design-audit/manual_testing_playbook/manual_testing_playbook.md
- .opencode/skills/sk-design/design-audit/changelog/v1.0.0.0.md

The manual playbook supplies scenario-level evidence expectations and downstream execution policy; it is supporting material, not a claim that any scenario or script ran during this reconstruction.

---

## RELATED DOCUMENTS

- Implementation Plan: See plan.md
- Task Breakdown: See tasks.md
- Verification Checklist: See checklist.md
