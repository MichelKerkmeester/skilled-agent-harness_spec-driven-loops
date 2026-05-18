---
title: "Implementation Plan: Skill metadata quality audit"
description: "Inventory skills, score on 5+ dimensions, find cross-skill duplication, rank for improvement, recommend concrete changes."
trigger_phrases:
  - "skill metadata audit plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/003-skill-metadata-quality-audit"
    last_updated_at: "2026-05-14T00:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Implementation Plan: Skill metadata quality audit

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

Walk every active skill under `.opencode/skills/<skill>/`, read its `graph-metadata.json` plus the description block of its `SKILL.md`, score on dimensions that materially affect lexical / derived_generated / semantic_shadow advisor lanes, identify cross-skill duplication, output a ranked recommendation report at `005-skill-metadata-quality-audit/research/audit-report.md`. Research only; no skill files modified.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/004 shipped; the cosine-lane-can't-flip-routings finding is the motivating signal.
- [x] Skill set known: `ls .opencode/skills/` enumerates the active set.
- [x] graph-metadata.json schema understood from prior packets.

### Definition of Done
- [x] Audit report covers all active skills.
- [x] Per-skill score table present.
- [x] Cross-skill duplication report present.
- [x] Top-5+ ranked recommendation list present with concrete examples.
- [x] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research output |
| **Framework** | Spec Kit Level 1 packet |
| **Storage** | Single markdown report under packet's research/ |
| **Testing** | Strict spec validate only; no code |

### Approach
1. Enumerate skills via `ls .opencode/skills/`.
2. For each: read `graph-metadata.json` (focus on `derived.trigger_phrases`, `derived.key_topics`, `derived.causal_summary`, `derived.intent_signals` if present) and the `description:` field of `SKILL.md` frontmatter.
3. Score on these dimensions (0-5):
   - **D1 Description specificity**: concrete intent vocabulary vs generic words; penalize "this skill", "provides", "helps with"
   - **D2 Description length**: 80-300 chars sweet spot; penalize too short or too long
   - **D3 Trigger phrases coverage**: count + uniqueness vs other skills
   - **D4 Key topics diversity**: not just splittings of trigger phrases
   - **D5 Cross-skill duplication**: how many of this skill's phrases appear on other skills
4. Compose:
   - A scoring table (skills × dimensions)
   - A duplication table (phrase × skill_ids list)
   - A ranked top-N improvement list
   - Per-skill concrete recommendations (WHAT, WHY, EXAMPLE)
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate skills.
- Read each skill's two source files.

### Phase 2: Implementation
- Score per skill per dimension.
- Compute cross-skill duplication.
- Rank top-N for improvement.
- Author concrete recommendations.
- Write `research/audit-report.md`.
- Update `implementation-summary.md` with the executive summary.

### Phase 3: Verification
- Strict spec validate this packet.
- Strict spec validate parent 015.
- Spot-check 2-3 of the recommendations for plausibility.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Coverage | All active skills audited | Verify report row count == `ls .opencode/skills/` count (minus archived) |
| Rubric explained | Each dimension defined in report | Manual read |
| Recommendations actionable | Each top-N entry has WHAT/WHY/EXAMPLE | Manual read |
| Strict | Spec packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/004 motivating finding (cosine lane couldn't flip routings).
- All active skills present at audit time.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert deletes the audit packet. No skill files touched, no production behavior to restore.
<!-- /ANCHOR:rollback -->
