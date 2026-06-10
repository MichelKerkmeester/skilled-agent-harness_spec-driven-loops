---
title: "Feature Specification: Phase 2: self-check-templates [template:level_1/spec.md]"
description: "Phase 2 (T3): add concise self-check + failure-mode guidance blocks to the spec/plan/checklist manifest templates so verification is anchored to each artifact."
trigger_phrases:
  - "feature"
  - "specification"
  - "name"
  - "template"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-peck-teachings-adoption/002-self-check-templates"
    last_updated_at: "2026-06-10T04:32:22Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Completed self-check guidance in manifest templates"
    next_safe_action: "Proceed to next peck phase when ready"
    blockers: []
    key_files:
      - "templates/manifest/spec.md.tmpl"
      - "templates/manifest/plan.md.tmpl"
      - "templates/manifest/checklist.md.tmpl"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/002-self-check-templates"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 2: self-check-templates

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-02 |
| **Branch** | `001-peck-teachings-adoption` |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 4 |
| **Predecessor** | 001-peck-teachings-for-spec-kit |
| **Successor** | 003-current-state-discipline |
| **Handoff Criteria** | Self-check blocks shipped in all three templates; strict validation green on a sample scaffold |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the Adopt low-risk peck teachings (T3 self-check templates, T4 current-state discipline, T2 constitutional rule review) into system-spec-kit specification.

**Scope Boundary**: Manifest templates only. No code, no validation logic, no AC-coverage work (that is T1, deferred to a separate packet).

**Dependencies**:
- `create.sh` template renderer (so the new blocks land in scaffolds).
- The `TEMPLATE_HEADERS` / `SECTIONS_PRESENT` validators (must stay green).

**Deliverables**:
- A concise self-check + failure-modes guidance block in each of `spec.md.tmpl`, `plan.md.tmpl`, `checklist.md.tmpl`.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent phase folder name plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
system-spec-kit's self-check lives in the global CLAUDE.md, not in the manifest templates an author actually fills in. Peck attaches a short self-check plus a failure-modes list to every artifact, which lifts first-pass quality (the peck-adoption phase, T3). spec-kit's templates carry voice guides but no "audit your own output against these mistakes" block where the work happens.

### Purpose
Add a short self-check + failure-modes block to the spec, plan, and checklist manifest templates so the reminder sits on the form being filled.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add a self-check + failure-modes block to `spec.md.tmpl`, `plan.md.tmpl`, `checklist.md.tmpl`.
- Keep each block concise (about 8 lines or fewer), matching peck's high-yield brevity.
- Ship the block as HTML-comment guidance (DECIDED — see `../001-peck-teachings-for-spec-kit/research/research.md` §3): the same pattern templates already use for voice guides, so header validation is untouched.
- Inside the comment block, use plain labels (`SELF-CHECK:`, `FAILURE MODES:`) and NEVER a line starting with `## `. The header extractor strips fenced code but NOT HTML comments, so a line-start `## ` inside a comment still trips TEMPLATE_HEADERS.

### Out of Scope
- `implementation-summary.md.tmpl` (optional follow-up, not this phase).
- Any validation-rule change.
- AC-coverage / T1 work - separate, deferred.
- The `examples/` templates - only the manifest templates are authoritative.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `templates/manifest/spec.md.tmpl` | Modify | Add self-check + failure-modes guidance block |
| `templates/manifest/plan.md.tmpl` | Modify | Add self-check + failure-modes guidance block |
| `templates/manifest/checklist.md.tmpl` | Modify | Add self-check + failure-modes guidance block |
| `scripts/lib/validator-registry.json` / template header-contract | Not changed | Comment guidance needs no rule/registry edit — required headers are derived from the rendered template, not a static list. Only the rejected tracked-section approach would need this. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | spec/plan/checklist manifest templates each carry a self-check block + failure-modes list | Given a freshly scaffolded folder, when its spec/plan/checklist are opened, then each shows the self-check + failure-modes guidance |
| REQ-002 | A freshly scaffolded folder still passes strict validation, with no line-start `## ` inside guidance comments | Given a scaffold, when `validate.sh --strict` runs, then exit 0 with no new TEMPLATE_HEADERS or SECTIONS_PRESENT errors |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Blocks are concise | Given each block, when counted, then it is about 8 lines or fewer |
| REQ-004 | Failure-modes name the anti-pattern, not just steps | Given each block, when read, then it names at least one concrete failure mode (e.g. "rubber-stamping the checklist") |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A newly scaffolded spec folder surfaces the self-check guidance in all three documents.
- **SC-002**: `validate.sh --strict` stays green on a fresh scaffold after the change.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Adding a tracked `##` section breaks TEMPLATE_HEADERS (exact-order enforcement) | Strict validation fails on every scaffold | Ship as HTML-comment guidance - the validation-safe path that needs no header-manifest change |
| Risk | Block bloat dilutes signal | Authors ignore long checklists | Cap each block at about 8 lines |
| Dependency | create.sh renderer | New blocks must appear in scaffolds | Verify by scaffolding a throwaway folder |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- RESOLVED (research.md §3): ship as HTML-comment guidance, not a tracked section — and never place a line-start `## ` inside the comment.
- RESOLVED: keep `implementation-summary.md.tmpl` out of this phase; spec/plan/checklist are the adopted self-check surfaces.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
