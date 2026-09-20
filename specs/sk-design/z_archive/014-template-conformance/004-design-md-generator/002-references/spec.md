---
title: "Spec: design-md-generator references/ conformance"
description: "Audit the 10 flat references/ files and the 4-vendor examples/ tree against skill-reference-template.md; fix the known importance_tier and H2-casing defects, and decide the exemplar-placement question for examples/."
trigger_phrases:
  - "design-md-generator references conformance"
  - "extraction-workflow importance_tier enum"
  - "vendor DESIGN.md exemplar placement decision"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/004-design-md-generator/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit spec with known defects and exemplar decision"
    next_safe_action: "Read all 10 root references files and the 4-vendor examples/ tree"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
      - ".opencode/skills/sk-design/design-md-generator/references/examples/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-md-generator references/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — known defects and an open placement decision, not yet resolved |
| **Spec Folder** | 002-references |
| **Parent** | 004-design-md-generator |
| **Predecessor** | `001-packet-root` (map position only; no hard dependency, independently executable) |
| **Successor** | `003-assets` (map position only; no hard dependency, independently executable) |
| **Phase** | 2 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`references/` holds 10 flat files plus an `examples/` tree with 4 vendor subdirectories (`linear/`, `stripe/`, `supabase/`, `vercel/`), each carrying `DESIGN.md`, `tokens.json`, and `writing-notes.md`. A sample pass already confirmed real defects: `extraction-workflow.md` declares `importance_tier: "high"`, a value outside the template's allowed vocabulary (`normal` | `important`) — an enum violation the 100%-frontmatter-presence figure hides because it checks presence, not validity. `quality-checklist.md`, `writing-style-guide.md`, and `design-md-format.md` number their H2s but in sentence case, not ALL-CAPS. Separately, the 8 files under `examples/{linear,stripe,supabase,vercel}/` (`DESIGN.md` + `writing-notes.md` each) have no numbered H2 anywhere, no OVERVIEW section, and `contextType: reference`, a value outside the allowed enum (`planning` | `research` | `implementation` | `general`) — `stripe/DESIGN.md` alone runs 618 lines. These are arguably intentional: they are **output exemplars** demonstrating the DESIGN.md format the mode produces, not skill reference docs — but they physically live under `references/`, so any mechanical audit flags them.

### Purpose
Fix the two confirmed defect classes (the `importance_tier` enum violation and the three sentence-case H2 files), and make and record an explicit decision on the `examples/` vendor exemplars: relocate them out of `references/` to a path that doesn't imply skill-reference-template conformance, or document a sanctioned exemption that lets them stay. Either choice is acceptable; a silent pass or a silent rewrite is not.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `extraction-workflow.md` — fix `importance_tier` to an allowed value (`normal` or `important`).
- `quality-checklist.md`, `writing-style-guide.md`, `design-md-format.md` — convert numbered H2s from sentence case to ALL-CAPS.
- `anti-patterns.md`, `authoring-boundary.md`, `color-role-taxonomy.md`, `component-taxonomy.md`, `guided-run.md`, `troubleshooting.md` — full read against the template; fix if a real gap is confirmed (not part of the seed sample).
- `examples/{linear,stripe,supabase,vercel}/{DESIGN.md,writing-notes.md}` (8 files) — decide and execute: relocate out of `references/`, or record a sanctioned exemption via `decision-record.md`.

### Out of Scope
- `design-md-generator`'s other folders (siblings 001, 003-008).
- Rewriting the vendor exemplar content itself, or the `tokens.json` files — placement/exemption decision only, not content authorship.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md` | Modify | Fix `importance_tier` enum violation |
| `.opencode/skills/sk-design/design-md-generator/references/{quality-checklist,writing-style-guide,design-md-format}.md` | Modify | Convert sentence-case numbered H2s to ALL-CAPS |
| `.opencode/skills/sk-design/design-md-generator/references/{anti-patterns,authoring-boundary,color-role-taxonomy,component-taxonomy,guided-run,troubleshooting}.md` | Audit (Modify if confirmed) | Full template diff |
| `.opencode/skills/sk-design/design-md-generator/references/examples/**` | Decide + Modify | Relocate or exempt per `decision-record.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `importance_tier` enum violation fixed | `extraction-workflow.md`'s `importance_tier` is `normal` or `important`, not `"high"` |
| REQ-002 | H2 casing fixed in the 3 known files | `quality-checklist.md`, `writing-style-guide.md`, `design-md-format.md` all carry ALL-CAPS numbered H2s |
| REQ-003 | Exemplar placement decision made and recorded | `decision-record.md` states relocate-or-exempt with rationale, alternatives considered, and consequences |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Remaining 6 root files exhaustively read | `anti-patterns.md`, `authoring-boundary.md`, `color-role-taxonomy.md`, `component-taxonomy.md`, `guided-run.md`, `troubleshooting.md` each diffed section-by-section with cited evidence |
| REQ-005 | Decision executed | The chosen relocate-or-exempt path is actually carried out (files moved, or exemption note added), not left as a recorded intent only |
| REQ-006 | Confirmed gaps in the remaining 6 fixed | Any real gap found under REQ-004 fixed in place |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `extraction-workflow.md` and the three H2-casing files pass a `skill-reference-template.md` diff.
- **SC-002**: The vendor exemplar question has one recorded, executed decision — not an open question carried forward.
- **SC-003**: The remaining 6 unsampled root files pass the same diff, or every confirmed gap is fixed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Relocating `examples/` breaks a cross-reference from `extraction-workflow.md` or `SKILL.md` | Broken link | Grep for `examples/` references across the packet before moving, update any hit |
| Risk | Treating the exemplars as ordinary reference docs and rewriting them to add H2s/OVERVIEW | Destroys their value as literal, unedited vendor output samples | Frame this as a placement decision, not a content-conformance fix |
| Dependency | `package_skill.py`'s directory rules, to confirm what a "sanctioned exemption" needs to look like | Decision record cites the wrong authority | Read `overview.md` + `package_skill.py` before drafting the decision |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The 6 unsampled root files get a full read, not a spot-check.

### Determinism
- **NFR-D01**: The exemplar decision is recorded once, in `decision-record.md`, and is not re-litigated by a later audit without a documented reason.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- Relocate `examples/` to a non-`references/` path (e.g. a new `examples/` at packet root, or under `assets/`), or keep it in place under a documented exemption? Resolved by this child's `decision-record.md`, not left open past this packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Parent Spec**: See `../spec.md`
