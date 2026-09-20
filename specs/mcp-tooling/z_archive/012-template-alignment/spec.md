---
title: "Feature Specification: Align new MCP tooling packet documentation to canonical templates"
description: "Align the asIDE DevTools, Refero, and Mobbin packet assets, references, and script READMEs with the create-skill and create-readme templates, then prove all three deep-alignment lanes pass."
trigger_phrases:
  - "mcp tooling template alignment"
  - "aside refero mobbin docs"
  - "deep alignment packet"
  - "create skill template conformance"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/012-template-alignment"
    last_updated_at: "2026-07-17T08:07:47Z"
    last_updated_by: "codex"
    recent_action: "Closed template alignment packet"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/specs/mcp-tooling/012-template-alignment/alignment/alignment-report.md"
      - ".opencode/specs/mcp-tooling/012-template-alignment/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-alignment-closeout-20260717"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The 11 kebab-case filename advisories are an accepted operator exception under the hyphen-naming pilot."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Align new MCP tooling packet documentation to canonical templates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Workflow** | `/deep:alignment:auto` |
| **Authority** | `sk-doc` / `docs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The new `mcp-aside-devtools`, `mcp-refero`, and `mcp-mobbin` packet documentation had drifted from the canonical create-skill reference and asset templates and from the create-readme code-folder README template. Fourteen documents lacked the required overview section, all three script READMEs scored below the DQI floor, and Mobbin documentation later proved inconsistent with its confirmed discovery fixture.

### Purpose

Bring the three packet documentation surfaces into structural and factual alignment, and close only when every deep-alignment lane reports PASS with no P0 or P1 findings.

### User Story 1: Template-consistent packet navigation

As a packet maintainer, I need each asset and reference to expose a predictable overview with purpose and usage so that readers can orient before following detailed instructions.

### User Story 2: Evidence-backed tool documentation

As a packet consumer, I need Mobbin's documented tool surface and mode guidance to match the discovery fixture while uncertainty about authenticated calls remains explicitly inferred.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Assets and references under `mcp-aside-devtools`, `mcp-refero`, and `mcp-mobbin`.
- Each packet's `scripts/README.md`.
- Three deep-alignment lanes, one for each packet, under `sk-doc` / `docs` authority.
- Reconciliation of Mobbin discovery claims against the 2026-07-16 discovery fixture.
- Package, parent-skill, and link-integrity gates for the aligned packets.

### Out of Scope

- Renaming kebab-case asset and reference files. The standing kebab directive and `sk-doc/032` hyphen-naming program intentionally supersede the current snake_case rule during the sanctioned pilot.
- Changing MCP implementations, authentication, OAuth, or live service behavior.
- Claiming authenticated Mobbin calls were executed. Those claims remain explicitly Inferred.
- Editing auto-generated reducer state under `alignment/` as part of this documentation closeout.

### Surfaces Changed by the Alignment Cycle

| Surface | Change Type | Description |
|---------|-------------|-------------|
| `mcp-aside-devtools/assets/` and `references/` | Modified | Added canonical overview content where missing. |
| `mcp-refero/assets/` and `references/` | Modified | Added canonical overview content where missing. |
| `mcp-mobbin/assets/` and `references/` | Modified | Added canonical overview content and reconciled discovery-backed claims. |
| Three packet `scripts/README.md` files | Modified | Rebuilt around the create-readme code-folder scaffold. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit the three packets as independent `sk-doc` / `docs` lanes. | The reducer reports 3 applicable lanes and names each packet surface. |
| REQ-002 | Add `## 1. OVERVIEW` to every affected asset and reference that lacks it. | The overview contains Purpose and Usage, and the next audit emits zero `missing_required_section: overview` findings. |
| REQ-003 | Align all three script READMEs to the create-readme code-folder scaffold. | Each README contains OVERVIEW, ARCHITECTURE, KEY FILES, ENTRYPOINTS, VALIDATION, and RELATED sections. |
| REQ-004 | Meet the documentation quality floor for every script README. | Each README has DQI at least 75; the remediation result is 76 or higher. |
| REQ-005 | Reconcile Mobbin documentation with confirmed discovery evidence. | Asset, wiring, tool-surface, and troubleshooting docs name all three confirmed tools and treat `deep` as client-settable. |
| REQ-006 | Preserve epistemic honesty for unexecuted behavior. | Authenticated OAuth and successful call claims remain labeled Inferred. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Use the operator-directed remediation executor. | Dispatch receipts record `cli-codex`, `gpt-5.6-sol`, reasoning effort `high`, and service tier `fast`. |
| REQ-008 | Preserve the sanctioned kebab-case pilot without treating it as incomplete work. | The 11 filename advisories remain P2, are documented as an accepted exception, and do not block any lane PASS. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The final `/deep:alignment:auto` reducer verdict is PASS for 3-of-3 lanes.
- **SC-002**: The final reducer reports P0 0 / P1 0; only the 11 accepted P2 filename advisories remain.
- **SC-003**: The three script READMEs meet the DQI floor after rising from approximately 52 to at least 76.
- **SC-004**: `package_skill.py --check --strict` passes for 3-of-3 packets.
- **SC-005**: `validate_skill_package.py` passes package and parent-skill checks with 0 broken links.

### Acceptance Scenarios

- **Given** an asset or reference without an overview, **When** Remediation 1 applies the create-skill template, **Then** the document contains `## 1. OVERVIEW` with Purpose and Usage.
- **Given** a script README below the 75 DQI floor, **When** it is rebuilt with the create-readme code-folder scaffold, **Then** its DQI reaches at least 76.
- **Given** Audit 1 reports 14 P0 overview findings, **When** Remediation 1 completes, **Then** Audit 2 reports P0 0.
- **Given** Audit 2 reports three Mobbin P1 reality-drift findings, **When** Remediation 2 reconciles the fixture-backed claims, **Then** Audit 3 reports P1 0.
- **Given** the operator-sanctioned hyphen-naming pilot, **When** Audit 3 reports 11 filename advisories, **Then** the advisories remain documented P2 exceptions and all three lanes still PASS.
- **Given** the aligned packets at close, **When** package, parent-skill, and link gates run, **Then** all three packages pass and broken links equal 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Create-skill asset and reference templates | Defines required overview structure. | Use `sk-doc` as the alignment authority. |
| Dependency | Create-readme code-folder README template | Defines the six-section script README scaffold. | Audit each README against the same canonical section set. |
| Dependency | Mobbin 2026-07-16 discovery fixture | Grounds the confirmed tool names and `deep` mode. | Keep live-call and OAuth claims separate and Inferred. |
| Risk | Conflicting filename policies | Could cause unnecessary renames and link churn. | Record the standing kebab directive and `sk-doc/032` pilot as an accepted exception. |
| Risk | Structural pass with factual drift | Template conformance alone could preserve stale guidance. | Run a second audit focused on reality drift, then re-audit after remediation. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Quality

- **NFR-Q01**: Every audited script README must score at least 75 DQI.
- **NFR-Q02**: Every final lane must report PASS with no P0 or P1 findings.

### Traceability

- **NFR-T01**: Audit outcomes and accepted exceptions must remain traceable to reducer reports.
- **NFR-T02**: Confirmed Mobbin discovery claims must remain distinguishable from Inferred authentication and call claims.

### Reliability

- **NFR-R01**: Package validation must pass for all three packets.
- **NFR-R02**: All local documentation links must resolve at close.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Policy Boundaries

- Filename advisories do not trigger remediation because the kebab naming is an intentional pilot, not accidental drift.
- A deterministic template pass does not override fixture-backed factual evidence.
- A confirmed discovery schema does not prove authenticated OAuth or successful production calls.

### State Transitions

- Audit FAIL requires remediation of P0 findings before re-audit.
- Audit CONDITIONAL requires remediation or approved handling of P1 findings before close.
- Audit PASS with only accepted P2 advisories permits completion when the exception is explicit and non-blocking.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Three packets, 17 audited artifacts, and two remediation rounds. |
| Risk | 12/25 | Documentation-only changes, with factual tool-surface and naming-policy risks. |
| Research | 11/20 | Required reducer interpretation and discovery-fixture reconciliation. |
| **Total** | **39/70** | **Level 2 verification packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

None. The operator resolved the sole policy question by accepting the 11 kebab-case filename advisories under the hyphen-naming pilot.
<!-- /ANCHOR:questions -->
