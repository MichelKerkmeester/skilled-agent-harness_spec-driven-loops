---
title: "Feature Specification: design-interface packet-root conformance"
description: "Audit SKILL.md and README.md at the design-interface packet root against skill-md-template.md and skill-readme-template.md; LICENSE.txt is explicitly out of scope."
trigger_phrases:
  - "design-interface SKILL.md conformance"
  - "design-interface README conformance"
  - "packet root template audit"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/002-design-interface/001-packet-root"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Planned spec with measured SKILL.md/README.md sizes"
    next_safe_action: "Run exhaustive package_skill.py --check audit, then fix deviations"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/design-interface/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: design-interface packet-root conformance

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance/002-design-interface` |
| **Predecessor** | None |
| **Successor** | `002-references` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The `design-interface` packet root has `SKILL.md` (345 lines, 4,336 words per `wc -w`, 36,702 bytes) and `README.md` (202 lines, 2,260 words, 16,826 bytes). The dispatching brief for this program flagged both as over the `skill-md-template.md` ceiling and the README as missing its `## 1. AT A GLANCE` table and blockquote pitch. A direct read found that framing only partly holds: `SKILL.md` is under the hard ceiling (`<5000 words`, `<3000 lines` per `skill-md-template.md` §3) but at 4,336 words it is 45% over the 3,000-word *recommended* target. `README.md` already opens with a one-line blockquote pitch after the H1 and already has `## 1. AT A GLANCE` as its first section with a four-row table — the two specific items the brief named as missing are, on inspection, already present.

### Purpose
Run the exhaustive `skill-md-template.md` and `skill-readme-template.md` checklists (not just the two items sampled above) against both files, record every real deviation with line evidence, and fix only what is actually broken — do not "fix" the AT A GLANCE table or pitch, which already conform.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `SKILL.md` — full audit against `skill-md-template.md` §1-§6 (word/line ceiling, frontmatter, section structure, resource-loading table, common pitfalls).
- `README.md` — full audit against `skill-readme-template.md` §1-§5 (AT A GLANCE, OVERVIEW required-header, optional sections, validation checklist).

### Out of Scope
- `LICENSE.txt` — owned by sibling packet `001-apache-devendoring`; do not open, move, or reference it as a fix target here.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-interface/SKILL.md` | Audit/Modify | Trim toward the 3,000-word recommended target if the exhaustive audit confirms padding; otherwise document why the size is earned |
| `.opencode/skills/sk-design/design-interface/README.md` | Audit/Modify | Verify remaining structural sections (`HOW IT WORKS`, `VERIFICATION`, etc.) against §2's section model; AT A GLANCE and the pitch are already conformant |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Exhaustive read of `SKILL.md` against `skill-md-template.md` §2-§6 | Every section checked; deviations listed with line numbers or "conformant" recorded |
| REQ-002 | Exhaustive read of `README.md` against `skill-readme-template.md` §2, §5 | Every section checked; deviations listed with line numbers or "conformant" recorded |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `package_skill.py --check` run against the packet root | Command output captured in `checklist.md` evidence |
| REQ-004 | Confirm no unlisted file exists at the packet root beyond `SKILL.md`, `README.md`, `LICENSE.txt`, and the seven bundled-resource folders | `ls` output recorded, discrepancies flagged |
| REQ-005 | Cross-references from `SKILL.md`/`README.md` into `references/`, `assets/`, `procedures/` still resolve after any edit | `rg` spot-check on any changed link |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `SKILL.md` and `README.md` deviations from their governing templates are each either fixed or explicitly deferred with operator sign-off.
- **SC-002**: `package_skill.py --check` (or equivalent packet-root checker) passes clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Sibling packet `001-apache-devendoring` | `LICENSE.txt` edits would conflict with that packet's ownership | Do not touch `LICENSE.txt` under any circumstance |
| Risk | Trimming `SKILL.md` could remove load-bearing routing logic | Cutting toward 3,000 words could break Smart Routing behavior | Any trim is content-neutral (move to `references/`), never a routing-logic deletion |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `SKILL.md`'s 4,336 words be trimmed toward 3,000, or is the excess earned by Smart Routing pseudocode/tables that would degrade if moved to `references/`? Needs the exhaustive audit before deciding.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Parent Spec**: `../spec.md`
- **Governing templates**: `.opencode/skills/sk-doc/create-skill/assets/skill/skill-md-template.md`, `.opencode/skills/sk-doc/create-skill/assets/skill/skill-readme-template.md`
- **Checker**: `.opencode/skills/sk-doc/create-skill/scripts/package_skill.py`
