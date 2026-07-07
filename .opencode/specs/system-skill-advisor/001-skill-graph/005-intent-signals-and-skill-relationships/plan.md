---
title: "Implementation Plan: Populate intent_signals + manual relationships"
description: "Per-skill author intent_signals + manual.depends_on + manual.related_to; validate; ship."
trigger_phrases:
  - "intent signals plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/005-intent-signals-and-skill-relationships"
    last_updated_at: "2026-05-14T01:30:00Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded packet"
    next_safe_action: "Dispatch codex"
    blockers: []
    key_files:
      - "plan.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Plan: Populate intent_signals + manual relationships

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## SUMMARY

For each active skill, author 3-7 `derived.intent_signals` + populate `manual.depends_on` + `manual.related_to` in `graph-metadata.json`. Stay scoped to those three fields. Validate via skill_graph_scan + advisor_recommend spot-check.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## QUALITY GATES

### Definition of Ready
- [x] 015/005 audit-report.md available as reference.
- [x] Skill set known: 17 active.
- [x] graph-metadata.json schema accepts the three target fields.

### Definition of Done
- [x] All 17 skills carry the three fields.
- [x] No `lane-registry.ts` change.
- [x] Strict spec validation passes.
- [x] At least one advisor_recommend probe shows non-zero graph_causal raw input.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## ARCHITECTURE

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON edits only |
| **Framework** | Spec Kit MCP server skill-advisor scoring |
| **Storage** | `.opencode/skills/<skill>/graph-metadata.json` |
| **Testing** | skill_graph_scan + advisor_recommend probes |

### Approach
1. Enumerate active skills (the 17).
2. For each: read SKILL.md description + existing graph-metadata.json.
3. Compose `derived.intent_signals` from concrete intent verbs the skill genuinely owns.
4. Compose `manual.depends_on` from actual mechanical dependencies (e.g., `spec_kit:complete` -> system-spec-kit + sk-doc).
5. Compose `manual.related_to` from sibling skills users typically pair (e.g., sk-code <-> sk-code-review).
6. Apply minimal diffs; touch ONLY these three fields per file.
7. Validate: skill_graph_scan + advisor_recommend spot-check.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## IMPLEMENTATION PHASES

### Phase 1: Setup
- Enumerate skills + read SKILL.md + existing graph-metadata.json.
- Inventory existing manual.* references in any skill that already has them (none expected per 015/005 audit).

### Phase 2: Implementation
- Compose per-skill triples.
- Apply edits.
- Run skill_graph_scan to confirm no schema errors.

### Phase 3: Verification
- typecheck PASS (no code changed but run for completeness).
- vitest skill_advisor: only the known plugin-bridge baseline fails.
- npx tsc --build refresh dist.
- advisor_recommend probe on 2-3 fixture prompts to confirm graph_causal raw signal moved.
- Strict validate this packet + parent 015.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## TESTING STRATEGY

| Layer | What | How |
|-------|------|-----|
| Schema validity | Edited graph-metadata.json files parse | skill_graph_scan over the 17 skills |
| Field presence | All 17 carry the three fields | Audit script in implementation-summary |
| graph_causal lane | Has non-zero raw input for at least one prompt | advisor_recommend probe |
| Strict | Spec packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## DEPENDENCIES

- 015/005 audit-report.md.
- skill_graph_scan tool.
- advisor_recommend tool.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## ROLLBACK PLAN

Single-commit revert restores all 17 skills' graph-metadata.json to prior state. No code touched.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## PHASE DEPENDENCIES

| Phase | Depends On | Why |
|-------|-----------|-----|
| Phase 1 | 015/005 audit | Reference for which signals belong where |
| Phase 2 | Phase 1 | Authoring follows discovery |
| Phase 3 | Phase 2 | Validation runs after edits |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## EFFORT ESTIMATE

| Component | Estimate |
|-----------|----------|
| Per-skill compose (17 skills × 3 fields) | ~340 LOC of JSON |
| Validation harness | trivial (reuse skill_graph_scan) |
| Implementation summary | ~80 LOC of doc |
| **Total** | **~440 LOC** |

cli-codex gpt-5.5 high: 12-20 min.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## ENHANCED ROLLBACK

### Triggers
- Any of the 17 skills fails to parse after edits.
- Vitest skill_advisor adds new failures beyond plugin-bridge baseline.

### Recovery
1. Revert this commit.
2. Run skill_graph_scan to confirm 17 skills present.

### Data Safety
JSON-only; revert restores prior state byte-for-byte.
<!-- /ANCHOR:enhanced-rollback -->
