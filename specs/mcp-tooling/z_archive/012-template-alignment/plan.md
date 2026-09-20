---
title: "Implementation Plan: Align new MCP tooling packet documentation to canonical templates"
description: "Run an audit-fix-reaudit cycle across one documentation lane per packet, using the operator-directed SOL high fast executor for remediation. Close after all lanes pass and record the sanctioned kebab-case advisories as an accepted exception."
trigger_phrases:
  - "template alignment plan"
  - "audit fix reaudit"
  - "mcp packet documentation"
  - "sol high fast remediation"
importance_tier: "normal"
contextType: "implementation"
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
      - ".opencode/specs/mcp-tooling/012-template-alignment/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "template-alignment-closeout-20260717"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Keep all 11 kebab-case filename advisories as an accepted P2 exception."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Align new MCP tooling packet documentation to canonical templates

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/deep:alignment:auto` |
| **Authority** | `sk-doc` / `docs` |
| **Lane Model** | Three paths lanes, one per MCP packet |
| **Remediation Executor** | `cli-codex gpt-5.6-sol`, reasoning effort `high`, service tier `fast` |
| **Source Templates** | create-skill reference/asset templates; create-readme code-folder README template |
| **Verification** | Deep-alignment reducer, package checks, parent-skill check, link check |

### Overview

Use a bounded audit-fix-reaudit loop. Audit all three lanes against the canonical templates, remediate deterministic structure and DQI failures, re-audit for factual drift, reconcile Mobbin against its discovery fixture, then run a final audit and package gates. Treat the filename-policy conflict as an explicit operator decision after the final reducer pass.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem and three-packet scope documented. [evidence: `spec.md:47`]
- [x] Canonical source templates identified. [evidence: `spec.md:201`]
- [x] Three lane boundaries established under `sk-doc` / `docs`. [evidence: `alignment/alignment-report.md:9`]

### Definition of Done

- [x] All three deep-alignment lanes report PASS. [evidence: 3-of-3 lanes PASS in `alignment/alignment-report.md:10`]
- [x] Final P0 and P1 counts are zero. [evidence: P0 0 / P1 0 in `alignment/alignment-report.md:11`]
- [x] Residual P2 findings have an explicit operator disposition. [evidence: 11-of-11 filename advisories accepted in `implementation-summary.md:126`]
- [x] Package, parent-skill, and link gates pass. [evidence: 3-of-3 strict package checks PASS and 0 broken links recorded in `implementation-summary.md:151`]
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Three-lane reducer-guided remediation loop.

### Key Components

- **Lane partitioning**: isolates asIDE DevTools, Refero, and Mobbin so each packet receives an independent verdict.
- **Deterministic template checks**: detect missing overview sections and below-floor DQI.
- **Reasoning audit**: detects fixture-to-document reality drift that structure checks cannot prove.
- **SOL remediation executor**: applies operator-directed fixes with high reasoning effort and fast service tier.
- **Reducer reports**: preserve each audit verdict and severity counts for closeout evidence.

### Control Flow

Scaffold three lanes, audit, remediate structural findings, re-audit, remediate Mobbin reality drift, final audit, accept the filename exception, then run closing gates.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Three packet `assets/` directories | Registered manuals and reusable packet assets | Add canonical overview content; reconcile Mobbin claims | No P0/P1 in final reducer |
| Three packet `references/` directories | Wiring, tool-surface, troubleshooting, and supporting guidance | Add canonical overview content; reconcile Mobbin claims | No P0/P1 in final reducer |
| Three packet `scripts/README.md` files | Code-folder navigation and validation guidance | Rebuild to six-section create-readme scaffold | DQI at least 76 |
| Kebab-case basenames | Hyphen-naming pilot | Leave unchanged by operator decision | 11 P2 advisories, all lanes PASS |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Lane Scaffolding and Baseline

- [x] Configure `/deep:alignment:auto` with three packet paths lanes.
- [x] Bind `sk-doc` / `docs` authority and the create-skill/create-readme targets.
- [x] Run Audit 1 and capture the FAIL baseline.

### Phase 2: Structural Remediation

- [x] Add `## 1. OVERVIEW` with Purpose and Usage to 11 affected asset/reference documents.
- [x] Rebuild all three script READMEs around the canonical six-section scaffold.
- [x] Confirm README DQI rises to at least 76.

### Phase 3: Reality-Drift Audit

- [x] Run Audit 2 and confirm asIDE DevTools and Refero pass.
- [x] Isolate Mobbin's three P1 reality-drift findings.

### Phase 4: Fixture Reconciliation

- [x] Reconcile Mobbin asset, wiring, tool-surface, and troubleshooting guidance with the discovery fixture.
- [x] Preserve authenticated OAuth and call claims as Inferred.
- [x] Run Audit 3 and confirm 3-of-3 lanes pass with P0 0 / P1 0.

### Phase 5: Exception and Gate Closure

- [x] Accept the 11 kebab-case filename advisories under the sanctioned hyphen-naming pilot.
- [x] Run three strict package checks, parent-skill validation, and link validation.
- [x] Author the Level 2 completion packet and run strict spec-folder validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool or Evidence |
|-----------|-------|------------------|
| Structural | Required overview sections and README scaffold | Deep-alignment deterministic `sk-doc` adapter |
| Quality | Script README documentation quality | DQI floor 75; observed remediation result 76 |
| Factual | Mobbin tools and `deep` mode | 2026-07-16 discovery fixture plus reasoning audit |
| Package | All three MCP packets | `package_skill.py --check --strict` |
| Integration | Package and parent routing contracts | `validate_skill_package.py` package plus parent-skill-check |
| Link integrity | Local documentation links | Link scan with 0 broken links |
| Packet docs | Level 2 spec contract | `validate.sh ... --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Create-skill reference and asset templates | Internal | Available | Overview conformance cannot be adjudicated. |
| Create-readme code-folder README template | Internal | Available | README structure and DQI remediation lose their canonical target. |
| Mobbin 2026-07-16 discovery fixture | Internal evidence | Confirmed | Tool names and `deep` mode cannot be upgraded from Inferred. |
| SOL high fast executor configuration | Operator-directed | Confirmed in receipts | Remediation would violate the frozen execution mechanism. |
| Hyphen-naming pilot decision | Operator governance | Accepted | Filename advisories would remain dispositionless. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remediation introduces factual drift, breaks package validation, or removes required template content.
- **Procedure**: Revert only the affected documentation edits to the pre-remediation state, preserve reducer reports as evidence, and rerun the same lane audit before proceeding.
- **Data impact**: None. The alignment cycle changes documentation only.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Lane Scaffolding and Baseline | None | Structural Remediation |
| Structural Remediation | Audit 1 findings | Reality-Drift Audit |
| Reality-Drift Audit | Remediation 1 | Fixture Reconciliation |
| Fixture Reconciliation | Audit 2 findings | Exception and Gate Closure |
| Exception and Gate Closure | Audit 3 PASS | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual Shape |
|-------|------------|--------------|
| Lane Scaffolding and Baseline | Medium | 3 lanes, 17 artifacts, one FAIL audit |
| Structural Remediation | Medium | 11 overview additions and 3 README restructures |
| Reality-Drift Audit | Medium | 3 P1 findings isolated to Mobbin |
| Fixture Reconciliation | Medium | 4 Mobbin documentation surfaces reconciled |
| Exception and Gate Closure | Low | 11 P2 advisories accepted; package and link gates run |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Remediation Controls

- [x] Reducer report captured before each remediation round.
- [x] Lane boundaries kept independent by packet.
- [x] Confirmed and Inferred claims separated before factual edits.

### Rollback Procedure

1. Identify the first audit where the lane regressed.
2. Revert only the corresponding remediation edits.
3. Re-run that lane under the same `sk-doc` / `docs` authority.
4. Restore closure only after the reducer returns PASS and package gates remain green.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Documentation-only version-control revert.
<!-- /ANCHOR:enhanced-rollback -->
