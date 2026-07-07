---
title: "Feature Specification: Populate intent_signals + manual.depends_on / related_to across active skills"
description: "For each active skill, populate derived.intent_signals + manual.depends_on + manual.related_to in graph-metadata.json so the lexical/derived/graph_causal lanes have skill-side structured signal."
trigger_phrases:
  - "skill intent signals populate"
  - "skill manual relationships seed"
  - "graph causal lane skill side"
  - "advisor structured intent metadata"
importance_tier: "important"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-intent-signals-and-skill-relationships"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000001508"
      session_id: "008-populate-intent-signals-and-relationships"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Edits stay in derived.intent_signals + manual.depends_on + manual.related_to. SKILL.md description and derived.trigger_phrases / key_topics are NOT touched (those were 015/006's scope)."
      - "depends_on and related_to are populated based on actual skill mechanics, not aspiration."
      - "lane-registry.ts unchanged."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Populate intent_signals + manual.depends_on / related_to across active skills

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Planned |
| **Created** | 2026-05-14 |
| **Branch** | `008-populate-intent-signals-and-relationships` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 015/005's audit found that across all 17 active skills, three structured-signal fields are universally absent:

- `derived.intent_signals` — short verbs/phrases the skill genuinely owns (e.g., for sk-code: "implement", "fix bug", "refactor"). Feeds the `derived_generated` lane.
- `manual.depends_on` — concrete skill packets this skill needs to run correctly (e.g., spec_kit:complete depends on sk-doc + system-spec-kit). Feeds the `graph_causal` lane.
- `manual.related_to` — sibling skills the user often pairs with this one (e.g., sk-code is related_to sk-code-review). Feeds `graph_causal` for tiebreak signal.

Result: 15% of advisor weight (`graph_causal: 0.13` plus part of `derived_generated: 0.12`) currently has nothing skill-side to traverse. Those lanes score entirely off causal edges in the spec-doc memory graph (which is populated) and auto-derived phrases (which already exist) — but the skill-graph itself has no manual relationship metadata authored.

### Purpose
For every active skill: populate `derived.intent_signals` (3-7 entries) and `manual.depends_on` + `manual.related_to` (each with the genuine relationships, not aspirational ones). Stay scoped to those three fields. Ship as production metadata.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- For each active skill under `.opencode/skills/<skill_id>/`:
  - Add or update `derived.intent_signals` with 3-7 short intent-verb phrases
  - Add or update `manual.depends_on` with skill packet refs that this skill genuinely requires
  - Add or update `manual.related_to` with sibling skills users typically reach for in adjacency
- Authored from the skill's actual SKILL.md description + scope, not invented
- Run `skill_graph_scan` (or equivalent test) to confirm the new fields are accepted by the schema and surfaced
- Spot-check 2-3 fixture prompts via `advisor_recommend` to confirm `graph_causal` lane now has non-zero skill-side input on at least one prompt

### Out of Scope
- Modifying `derived.trigger_phrases`, `derived.key_topics`, `derived.causal_summary` (015/006 covered these)
- Modifying SKILL.md (frontmatter or body)
- Modifying `lane-registry.ts`
- Re-running the lane-weight sweep (sibling 007 covers harder-corpus sweep work; 015/008 is metadata-population only)
- Adding new skills or removing existing ones
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Every active skill carries `derived.intent_signals` with 3-7 entries. | All 17 skills' graph-metadata.json have the field populated. |
| REQ-002 | Every active skill carries `manual.depends_on` with at least 0 valid entries (empty allowed for truly leaf skills, but document the reason). | Field present; entries point to real skill packet ids. |
| REQ-003 | Every active skill carries `manual.related_to` with at least 0 valid entries (empty allowed but documented). | Field present; entries point to real skill packet ids. |
| REQ-004 | Schema validation passes after edits. | Each edited file parses; no skill_graph_scan errors. |
| REQ-005 | Edits do not touch any other field in graph-metadata.json. | Spot diff shows changes only in `derived.intent_signals`, `manual.depends_on`, `manual.related_to`. |
| REQ-006 | Edit ledger documents per-skill choices. | implementation-summary.md table lists each skill + its 3 field values. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Strict spec validation passes.
- **SC-002**: All 17 skills still discoverable.
- **SC-003**: At least one fixture prompt's `graph_causal` lane now produces a non-zero raw score (verifying skill-side input is reaching it).
- **SC-004**: `lane-registry.ts` unchanged.
- **SC-005**: Vitest skill_advisor: only the pre-existing plugin-bridge baseline still fails.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Manual depends_on points at a skill packet id that does not exist | Schema validation may break, OR graph_causal silently drops the edge | Validate refs against the active skill list before writing |
| Risk | Aspirational intent_signals don't reflect skill mechanics | Lane signal is noise | Author each signal from the SKILL.md description and known scope; no invention |
| Risk | Edits collide with sibling 015/007 dispatch (parallel) | Two cli-codex sandboxes touching graph-metadata.json | 015/007 only touches sweep test + new fixture file; 015/008 only touches skill graph-metadata.json fields. Disjoint write scopes |
| Dependency | 015/005 audit-report.md available as reference for which skills need which kinds of signals | Authoring grounded | Already on main |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None for the dispatcher. Codex resolves these inline:
- Whether to also seed `intent_signals` for archived/deprecated skills (default: skip)
- Format of intent signals (single verb vs short phrase; default: 1-3 word phrase)
- How to record an empty `manual.depends_on` (`[]` is valid; document reason in commit if leaf skill)
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

| ID | Class | Requirement |
|----|-------|-------------|
| NFR-P01 | Performance | Edits + validation under 5 minutes. |
| NFR-S01 | Security | No secrets in any field. |
| NFR-R01 | Reliability | All 17 skills still parse + discover after edits. |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 9. EDGE CASES

- Skill is genuinely a leaf (no depends_on, no related_to): write `[]` and document.
- Skill description is too thin to derive intent signals: skip and note in implementation-summary.
- Manual.depends_on ref needs a packet id that includes the parent chain: use the canonical `system-spec-kit/<...>` form when referencing spec packets, OR the bare skill id when referencing other `.opencode/skills/<id>/` skills (codex picks based on schema convention; check existing examples).
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY ASSESSMENT

| Aspect | Rating | Note |
|--------|--------|------|
| **LOC estimate** | 250-500 | 17 skills × 3 fields × variable entries |
| **Surface area** | Medium | Production-visible across all active skills |
| **Risk** | Medium-low | Additive to fields most consumers tolerate as empty; no schema change |
| **Reversibility** | High | Single-commit revert |
<!-- /ANCHOR:complexity -->
