---
title: "Implementation Summary: Skill metadata quality audit"
description: "Pending; filled by codex with the executive audit summary and ranked recommendations."
trigger_phrases:
  - "skill metadata audit summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/003-skill-metadata-embedding-quality-audit"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "research/audit-report.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Summary: Skill metadata quality audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `005-skill-metadata-quality-audit` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

- Total skills audited: 17 active `.opencode/skills/<skill>/` directories with both `SKILL.md` and `graph-metadata.json`.
- Average total score: 21.6 / 25. Descriptions are generally healthy: every audited `SKILL.md` description is present and falls inside the 80-300 character sweet spot.
- Worst 3 skills by score: `cli-codex` (18), `cli-gemini` (18), and `deep-review` (19).
- Most-duplicated phrase: `cross ai`, which appears as a trigger phrase on `cli-codex` and `cli-gemini`, and as a key topic on all four `cli-*` skills.
- Duplicated phrase count: 10 normalized cross-skill phrases across trigger phrases and key topics.
- The main quality weakness is not missing metadata; it is family-level vocabulary reuse. The `cli-*` skills share `cli`, `delegation`, `cross ai`, and sometimes `web research`; the deep-loop skills share `convergence`, `convergence detection`, and `externalized state`.
- `derived.intent_signals` and `manual.depends_on` / `manual.related_to` were absent across the active set, so the advisor has little explicit intent or graph-causal metadata to distinguish adjacent skills.
- Interpretation (b) is partially supported. Metadata is not thin enough to say cosine "couldn't possibly help", but several skill families use generic or duplicated wording that would blunt lexical and derived lanes, and may make semantic similarity less discriminating inside those families.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Codex inspected each active skill's `graph-metadata.json` and `SKILL.md` description, scored the set on dimensions D1-D5, computed normalized cross-skill phrase duplication, ranked the lowest-scoring skills for improvement, and wrote the report to `research/audit-report.md`. No skill files were modified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Research only, no edits | Operator should review recommendations before changes land |
| Tie each dimension to a specific advisor lane | Recommendations stay anchored to mechanical effect, not aesthetics |
| Numeric rubric (0-5) | Removes "I think this is bad" subjectivity |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | 015/005 strict validator exited 0; parent 015 strict validator exited 0. |
| Audit covers all active skills | Pass | Discovery command found 17 active skill dirs with both files; report score table has 17 rows. |
| Top-N recommendations have WHAT/WHY/EXAMPLE | Pass | `research/audit-report.md` lists 8 ranked recommendations, each with target fields, lane impact, and concrete phrasing. |
| No skill files modified | Pass | `git status --short .opencode/skills/*/graph-metadata.json .opencode/skills/*/SKILL.md` returned empty. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scoring is rubric-based, not learned**: a future packet could train a model on actual recall data to produce more objective scores.
2. **Recommendations are advisory**: applying them requires a separate edit packet plus a re-run of the seeded sweep to confirm impact.
3. **Cross-skill duplication does not always indicate a problem**: some overlap is correct (e.g., multiple skills genuinely deal with "memory"). The audit flags overlap; human review confirms whether to dedupe.
<!-- /ANCHOR:limitations -->
