---
title: "Feature Specification: Skill graph-metadata.json and SKILL.md quality audit"
description: "Read every active skill's graph-metadata.json and SKILL.md description, score quality on dimensions that affect cosine + lexical + derived advisor lanes, recommend per-skill improvements."
trigger_phrases:
  - "skill metadata quality audit"
  - "graph metadata trigger phrases audit"
  - "skill description embedding quality"
  - "advisor recall improvement"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/003-skill-metadata-quality-audit"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001505"
      session_id: "005-skill-metadata-quality-audit"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Output is a research report; this packet does NOT modify any skill's metadata or SKILL.md."
      - "Audit covers all active skills under .opencode/skills/<skill>/ that have graph-metadata.json AND SKILL.md."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Skill graph-metadata.json and SKILL.md quality audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `005-skill-metadata-quality-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 015/004 seeded sweep proved that the cosine lane cannot flip routing decisions on the current 24-prompt corpus regardless of weight (V0–V6, including V6-cosine-dominant at semantic=0.30). One plausible explanation: the per-skill embeddings (computed from SKILL.md descriptions) are not discriminating enough. If two skills carry generic, overlapping descriptions, their embeddings will be near each other in vector space and cosine similarity will not pick the correct one. Same problem exists for the lexical and derived lanes when `trigger_phrases` and `key_topics` are too generic or duplicative.

### Purpose
Audit every active skill's `graph-metadata.json` plus the description block of its `SKILL.md`. Score each skill on dimensions that materially affect advisor recall, and recommend per-skill improvements. Research output only — no skill files modified by this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Inventory of every `.opencode/skills/<skill>/graph-metadata.json` that pairs with a `.opencode/skills/<skill>/SKILL.md`.
- Per-skill quality scoring across these dimensions:
  - Description specificity (concrete intent vocabulary vs generic words)
  - Description length (too short = thin embedding; too long = diluted)
  - `derived.trigger_phrases` count + uniqueness (dedup against other skills)
  - `derived.key_topics` count + diversity vs trigger_phrases
  - `derived.intent_signals` presence and coverage
  - Cross-skill duplication: which trigger_phrases or key_topics appear on more than one skill (and whether that overlap is correct or noise)
- A ranked list of skills most likely to benefit from metadata improvement
- Concrete per-skill recommendations (specific phrasing changes, not vague "improve this")

### Out of Scope
- Modifying any `graph-metadata.json` or `SKILL.md`. Recommendations only.
- Re-running the lane-weight sweep with improved metadata (separate packet).
- Auto-generating new metadata via codex. The recommendations are for human review first.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Inventory ALL active skills with graph-metadata.json + SKILL.md. | Audit covers every skill under .opencode/skills/ that has both files. |
| REQ-002 | Per-skill score table with at least 5 quality dimensions. | Markdown table with skill_id rows × dimension columns × scores 0-5 or letter grade. |
| REQ-003 | Cross-skill duplication report. | Table of trigger_phrases / key_topics that appear on more than one skill, with skill_id list. |
| REQ-004 | Ranked list of top 5-10 skills most needing improvement. | Justified by score numbers; not vague ranking. |
| REQ-005 | Concrete recommendations per top-listed skill. | Each recommendation includes: WHAT to change, WHY (cite the failing dimension), and an EXAMPLE phrasing. |
| REQ-006 | Output as a markdown report under packet's research/ subdir. | `research/audit-report.md` exists and is referenced from implementation-summary.md. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: Audit covers ≥ 20 skills (current active set).
- **SC-003**: Each top-recommended skill has at least one specific phrasing example.
- **SC-004**: No skill files modified.
- **SC-005**: Cross-skill duplication report identifies at least the obvious overlaps (e.g., generic terms like "context", "session" if any).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Subjective scoring | Recommendations dismissed as opinion | Use measurable criteria: token counts, unique phrase counts, char counts; document the rubric in the report |
| Risk | Audit becomes a wishlist disconnected from advisor mechanics | Recommendations don't actually move recall | Tie each dimension explicitly to which advisor lane consumes it (lexical / derived / cosine) |
| Risk | Cosine improvement claims that aren't empirically validated | Future packet acts on noise | Mark all recommendations as advisory; sibling packet would re-run the seeded sweep to confirm |
| Dependency | Active skill set stable during the audit | Mid-run skill add/remove distorts duplication math | Read all source files first, then score; do not interleave |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Exact scoring rubric (numeric 0-5 vs letter grade vs descriptive)
- Whether to include archived skills (default: skip)
- How to handle skills whose SKILL.md description is missing entirely
<!-- /ANCHOR:questions -->
