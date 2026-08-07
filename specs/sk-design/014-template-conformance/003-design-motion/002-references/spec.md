---
title: "Spec: design-motion references/ conformance"
description: "Audit the 7 flat references/ files against skill-reference-template.md; fix the known separator-discipline and H2-casing defects and confirm the rest."
trigger_phrases:
  - "design-motion references conformance"
  - "motion-strategy separator discipline"
  - "advanced-craft H2 casing"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/003-design-motion/002-references"
    last_updated_at: "2026-07-27T10:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Author references audit spec with known defects"
    next_safe_action: "Read all 7 references files against skill-reference-template.md"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-motion/references/motion-strategy.md"
      - ".opencode/skills/sk-design/design-motion/references/micro-interactions.md"
      - ".opencode/skills/sk-design/design-motion/references/advanced-craft.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: design-motion references/ conformance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — known defects, not yet fixed |
| **Spec Folder** | 002-references |
| **Parent** | 003-design-motion |
| **Predecessor** | `001-packet-root` (map position only; no hard dependency, independently executable) |
| **Successor** | `003-assets` (map position only; no hard dependency, independently executable) |
| **Phase** | 2 of 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`references/` holds 7 flat files, all governed by `skill-reference-template.md`. A sample pass already confirmed three defects: `motion-strategy.md` and `micro-interactions.md` both abandon `---` separator discipline after the first two numbered sections (separators present only before §1 and §2; §3 onward run together with no rule between them), and `advanced-craft.md` numbers its H2s in sentence case instead of the required ALL-CAPS. The other four files (`animate-presence-patterns.md`, `animation-decision-framework.md`, `corpus-map.md`, `performance-reduced-motion.md`) were not part of the sample and have unknown conformance status.

### Purpose
Fix the three confirmed defects, and read the remaining four files against `skill-reference-template.md` to confirm or fix their conformance.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- `motion-strategy.md` — restore `---` separators between every numbered H2 section, §3 through §7.
- `micro-interactions.md` — same separator-discipline fix.
- `advanced-craft.md` — convert numbered H2s from sentence case to ALL-CAPS.
- `animate-presence-patterns.md`, `animation-decision-framework.md`, `corpus-map.md`, `performance-reduced-motion.md` — full read against the template; fix if a real gap is confirmed.

### Out of Scope
- `design-motion`'s other folders (siblings 001, 003-008).
- Rewriting reference content beyond the structural/formatting defects listed above.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/design-motion/references/motion-strategy.md` | Modify | Add `---` separators before §3-§7 |
| `.opencode/skills/sk-design/design-motion/references/micro-interactions.md` | Modify | Add `---` separators before §3 onward |
| `.opencode/skills/sk-design/design-motion/references/advanced-craft.md` | Modify | Convert sentence-case numbered H2s to ALL-CAPS |
| `.opencode/skills/sk-design/design-motion/references/{animate-presence-patterns,animation-decision-framework,corpus-map,performance-reduced-motion}.md` | Audit (Modify if confirmed) | Full template diff |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Separator discipline restored | `motion-strategy.md` and `micro-interactions.md` carry a `---` before every numbered H2, matching the discipline already present for §1-§2 |
| REQ-002 | H2 casing fixed | `advanced-craft.md`'s numbered H2s are ALL-CAPS, matching `skill-reference-template.md` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Remaining 4 files exhaustively read | Each of `animate-presence-patterns.md`, `animation-decision-framework.md`, `corpus-map.md`, `performance-reduced-motion.md` diffed section-by-section against the template with cited evidence |
| REQ-004 | Confirmed gaps in the remaining 4 fixed | Any real gap found under REQ-003 fixed in place |
| REQ-005 | No prose content altered beyond the formatting fixes | Diff shows only `---` placement and heading-case changes for the 3 known files |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 7 `references/` files pass a `skill-reference-template.md` diff — consistent separator discipline and ALL-CAPS numbered H2s throughout.
- **SC-002**: The three known defects are gone and no new defect was introduced by the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Separator/casing fix accidentally alters prose content | Content drift beyond formatting | Touch only `---` placement and heading casing; leave body text untouched |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: The 4 unsampled files get a full read, not a spot-check, closing the sampling gap this child exists to close.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
- None for the 3 confirmed defects. The 4 unsampled files may surface new questions once read.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
