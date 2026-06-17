---
title: "Implementation Plan: install-claude-frontend-design"
description: "Vendor Anthropic's frontend-design skill as sk-interface-design: relocate guidance to a reference, author a lean conformant SKILL.md + README + schema-2 graph metadata, register in catalog and advisor, validate."
trigger_phrases:
  - "interface design plan"
  - "sk-interface-design"
  - "skill install plan"
  - "vendor frontend-design"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/143-sk-interface-design/001-install-claude-frontend-design"
    last_updated_at: "2026-06-13T13:55:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for sk-interface-design install"
    next_safe_action: "Run validate.sh --strict"
    blockers: []
    key_files:
      - ".opencode/skills/sk-interface-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-148-001-install-claude-frontend-design"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: install-claude-frontend-design

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON metadata |
| **Framework** | `.opencode/skills` curated framework; mk_skill_advisor graph |
| **Storage** | `skill-graph.sqlite` (advisor); no app data |
| **Testing** | package_skill.py, validate_document.py, skill_graph_validate, advisor_recommend, validate.sh --strict |

### Overview
Vendor Anthropic's `frontend-design` skill and reshape it to house conventions: relocate the guidance prose verbatim into a reference-template doc, author a lean house-template SKILL.md that routes to it, add a house README and schema-2 graph metadata in the sk-code family, then register in the catalog, root README, and advisor graph.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Source located (anthropics/skills/skills/frontend-design)
- [x] Name and family decided with operator (sk-interface-design, sk-code family)
- [x] License terms understood (Apache-2.0, attribution required)

### Definition of Done
- [x] All acceptance criteria met
- [x] Validators passing (package_skill, document, graph, strict spec)
- [x] Catalog + root README + advisor updated and consistent
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Vendored-skill integration: upstream guidance preserved in a reference; a thin house-template SKILL.md acts as the routing/rules layer over it.

### Key Components
- **SKILL.md**: WHEN TO USE / SMART ROUTING / HOW IT WORKS / RULES / REFERENCES.
- **references/design_principles.md**: the verbatim upstream guidance.
- **graph-metadata.json**: schema-2 node in the sk-code family, sibling of sk-code.

### Data Flow
Design prompt -> advisor scores graph -> routes to sk-interface-design -> agent reads SKILL.md -> loads design_principles.md -> hands implementation to sk-code.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Additive packet. The only shared surfaces touched are the two READMEs (counts) and one reciprocal edge in sk-code.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/README.md` | Skill catalog + counts | update (row, sk-* 6->7, total 22->23) | counts match family rows |
| `README.md` (root) | Showcase + counts | update (listing, table row, 22->23) | grep counts = 23 |
| `.opencode/skills/sk-code/graph-metadata.json` | Sibling graph node | update (add reciprocal sibling) | skill_graph_validate: no symmetry warning |
| `skill-graph.sqlite` | Advisor graph | update (index 1 node) | errorCount 0; top match |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate upstream skill, confirm name/family with operator
- [x] Download SKILL.md + LICENSE.txt; scaffold spec folder 148

### Phase 2: Core Implementation
- [x] Author references/design_principles.md (reference template, verbatim guidance)
- [x] Author lean house-template SKILL.md + README.md + graph-metadata.json
- [x] Preserve LICENSE.txt + attribution
- [x] Update catalog + root README; add reciprocal sk-code sibling edge

### Phase 3: Verification
- [x] package_skill.py + validate_document.py (SKILL/README/reference) all green
- [x] skill_graph_scan + validate (errorCount 0) + advisor_recommend (top match)
- [x] validate.sh --strict on the spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | Skill + docs conform to templates | package_skill.py, validate_document.py, validate.sh --strict |
| Integration | Advisor routing | skill_graph_scan, skill_graph_validate, advisor_recommend |
| Consistency | Skill counts across READMEs | grep |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| anthropics/skills upstream | External | Green | Vendored copy is self-contained once installed |
| mk_skill_advisor daemon | Internal | Green | Cannot index/route; skill still loads via direct read |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill misroutes, breaks the graph, or the operator rejects it.
- **Procedure**: `rm -rf .opencode/skills/sk-interface-design`, revert the catalog/root-README edits and the sk-code sibling edge, then re-run `skill_graph_scan`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Core) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Operator decisions | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Core Implementation | Medium | 1 hour |
| Verification | Low | 0.5 hour |
| **Total** | | **~2 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Upstream guidance preserved verbatim + LICENSE retained
- [x] Additive change; one core-skill metadata edit, validated
- [x] Graph + strict validation gate before completion

### Rollback Procedure
1. Remove `.opencode/skills/sk-interface-design/`.
2. Revert the catalog + root README edits and the sk-code sibling edge.
3. Re-run `skill_graph_scan` so the node leaves the graph.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (only the advisor graph node, removed by re-scan)
<!-- /ANCHOR:enhanced-rollback -->
