---
title: "Feature Specification: design-mcp-open-design packet-root doc conformance"
description: "Audit `SKILL.md`, `README.md`, and `INSTALL-GUIDE.md` against their respective templates and fix any confirmed structural defects. Explicitly flag (not decide) the loose-.mjs relocation question as owned elsewhere."
trigger_phrases:
  - "design-mcp-open-design packet-root doc conformance"
  - "template conformance audit"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/005-design-mcp-open-design/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author Level 2 spec for template-conformance leaf"
    next_safe_action: "Run exhaustive audit against the governing template"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-mcp-open-design/{SKILL.md,README.md,INSTALL-GUIDE.md}"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Feature Specification: design-mcp-open-design packet-root doc conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
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
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | `002-references` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The packet root of `design-mcp-open-design/` holds seven files: `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, and four loose `.mjs` executables (`grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, `return-reconciliation.mjs`). No other sk-design mode keeps executables loose at its root — they normally live under `scripts/` or `corpus/`. Whether the three markdown files conform to their governing templates has not been checked.

### Purpose
Audit `SKILL.md`, `README.md`, and `INSTALL-GUIDE.md` against their respective templates and fix any confirmed structural defects. Explicitly flag (not decide) the loose-.mjs relocation question as owned elsewhere.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `design-mcp-open-design/SKILL.md` against `skill-md-template.md`
- `design-mcp-open-design/README.md` against `skill-readme-template.md`
- `design-mcp-open-design/INSTALL-GUIDE.md` against `install-guide-template.md`

### Out of Scope
- Relocating `grounding-receipt.mjs`, `live-transport.mjs`, `offline-gate.mjs`, `return-reconciliation.mjs` into `scripts/` or `corpus/` — owned by sibling `008-structural-anomalies`, not this leaf. This leaf documents the anomaly, it does not fix it.
- The absence of a `procedures/` directory at this packet root — this is a legitimate absence for a transport packet (`packetKind: transport`), not a defect, and needs no fix.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| design-mcp-open-design/SKILL.md | Audit/Fix | 20,798 bytes; check against skill-md-template.md |
| design-mcp-open-design/README.md | Audit/Fix | 20,583 bytes; check against skill-readme-template.md |
| design-mcp-open-design/INSTALL-GUIDE.md | Audit/Fix | 12,411 bytes; check against install-guide-template.md |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Audit SKILL.md, README.md, INSTALL-GUIDE.md against their templates | Each file's H1/H2 numbering, `---` separators, and OVERVIEW section diffed against `.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`, `skill-readme-template.md`, and `.opencode/skills/sk-doc/create-readme/assets/install-guide-template.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Fix confirmed structural defects | Diffed gaps closed with the minimal edit; unrelated prose left untouched |
| REQ-003 | Flag (not fix) the loose-.mjs relocation question | spec.md and implementation-summary.md both state the decision is owned by 008-structural-anomalies |
| REQ-004 | Record the missing procedures/ directory as a legitimate transport-packet absence | Noted in spec.md scope section as no-fix-needed, not scaffolded |
| REQ-005 | Pass validate.sh --strict for this leaf after the fix pass | CLI run recorded with exit code 0 (or documented residual warning) in implementation-summary.md |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 3 packet-root markdown files pass the template's structural checklist or are recorded as conformant with evidence
- **SC-002**: The 4 loose `.mjs` files and the missing `procedures/` directory are both explicitly flagged as out-of-scope-for-this-leaf, not silently ignored
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | 008-structural-anomalies | If this leaf silently relocates the .mjs files, it double-handles a decision owned elsewhere | Leaf scope hard-excludes the relocation; only documents the anomaly |
| Risk | Transport-packet posture misread as a defect | Medium — could cause an incorrect procedures/ directory to be scaffolded | Spec explicitly states the absence is legitimate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: N/A — static documentation

### Security
- **NFR-S01**: No secrets or credentials in scope

### Reliability
- **NFR-R01**: Audit must cover 100% of the 3 files, not a sample
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Files with mixed frontmatter conventions: verify against the template's YAML frontmatter shape, not just body headers.

### Error Scenarios
- If a file's template mapping is ambiguous (e.g. INSTALL-GUIDE.md sitting at a mode-packet root rather than a hub root): default to the closest structural analog and record the judgment call in this leaf's implementation-summary.md.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | 3 files, packet root only |
| Risk | 2/25 | Documentation-only change; no runtime code paths touched |
| Research | 4/20 | Confirm template mapping for a packet-root INSTALL-GUIDE.md |
| **Total** | **12/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None — scope is fully bounded by the known-defects list above and the exhaustive-audit mandate.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Covers**: `.opencode/skills/sk-design/design-mcp-open-design/{SKILL.md,README.md,INSTALL-GUIDE.md}`
