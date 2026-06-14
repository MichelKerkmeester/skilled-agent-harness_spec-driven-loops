---
title: "Implementation Plan: mcp-magicpath"
description: "Vendor the upstream magicpath skill into .opencode/skills/mcp-magicpath, author house README + schema-2 graph metadata + CLI installer, register in the catalog and advisor graph, then validate."
trigger_phrases:
  - "magicpath plan"
  - "install magicpath"
  - "mcp-magicpath"
  - "skill install plan"
  - "vendor skill"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/147-mcp-magicpath"
    last_updated_at: "2026-06-13T11:20:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan for mcp-magicpath framework install"
    next_safe_action: "Run validate.sh --strict then generate-context.js"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-magicpath/SKILL.md"
      - ".opencode/skills/mcp-magicpath/scripts/install.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-147-mcp-magicpath"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: mcp-magicpath

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill docs + JSON metadata + Bash installer |
| **Framework** | `.opencode/skills` curated skill framework; mk_skill_advisor graph |
| **Storage** | `skill-graph.sqlite` (advisor graph); no app data |
| **Testing** | sk-doc readme validator, `skill_graph_validate`, `advisor_recommend`, `validate.sh --strict` |

### Overview
Vendor the upstream `magicpath` skill verbatim, then wrap it in the framework's conventions: rename to `mcp-magicpath`, add a house README, schema-2 graph metadata, and a CLI installer modeled on `mcp-click-up`/`mcp-chrome-devtools`. Register it in the hand-maintained catalog and the advisor SQLite graph, then validate routing end to end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (`magicpath-ai` npm package verified published)

### Definition of Done
- [x] All acceptance criteria met
- [x] Validators passing (readme, graph, strict spec)
- [x] Docs updated (spec/plan/tasks/checklist/impl-summary + catalog)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Vendored-skill integration: upstream content preserved, framework adapter layer added around it.

### Key Components
- **SKILL.md**: runtime instructions (upstream body, framework frontmatter).
- **graph-metadata.json**: schema-2 advisor node + edges, drives Gate 2 routing.
- **scripts/install.sh**: makes the `magicpath-ai` CLI available, family-consistent.

### Data Flow
Operator prompt -> advisor scores against graph -> routes to `mcp-magicpath` -> agent reads SKILL.md -> invokes `magicpath-ai` CLI -> MagicPath backend over authenticated session.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Not a bug fix. This packet is additive; no existing behavior is modified except the catalog index counts. The single shared surface touched is the skills catalog.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/README.md` | Hand-maintained skill catalog + counts | update (add row, bump total + mcp-*) | visual diff; counts match family rows |
| `skill-graph.sqlite` | Advisor routing graph | update (index 1 new node) | `skill_graph_validate` errorCount 0; `advisor_recommend` top match |
| Existing skills' metadata | Sibling graph nodes | unchanged (loose `related_to`, no forced reciprocity) | `skill_graph_validate` reports no broken edges |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm install target and skill name with operator
- [x] Download upstream files; verify SHA parity
- [x] Scaffold spec folder 147

### Phase 2: Core Implementation
- [x] Place SKILL.md + references; adapt frontmatter (name + keywords)
- [x] Author README.md and graph-metadata.json
- [x] Author and run scripts/install.sh (global CLI install)
- [x] Update catalog index

### Phase 3: Verification
- [x] sk-doc readme validator: 0 issues
- [x] skill_graph_scan + validate (0 errors) + advisor_recommend (top match, Gate 2 pass)
- [x] validate.sh --strict on the spec folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structure | README + spec docs conform to templates | sk-doc validator, `validate.sh --strict` |
| Integration | Advisor routing picks the skill | `skill_graph_scan`, `skill_graph_validate`, `advisor_recommend` |
| Manual | CLI reachable and idempotent | `scripts/install.sh`, `magicpath-ai --version` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `magicpath-ai` (npm) | External | Green | No CLI; skill docs still valid but non-functional |
| mk_skill_advisor daemon | Internal | Green | Cannot index/route; skill still loads via direct read |
| Node.js >= 16 | External | Green | Installer + CLI cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Skill misroutes, breaks the graph, or the operator rejects the vendored content.
- **Procedure**: `rm -rf .opencode/skills/mcp-magicpath`, revert the catalog edits, re-run `skill_graph_scan` to drop the node, and `npm uninstall -g magicpath-ai` if the CLI is unwanted.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Operator decisions ───┘
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
| Core Implementation | Medium | 1.5 hours |
| Verification | Low | 0.5 hour |
| **Total** | | **~2.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Upstream content preserved at full SHA parity before adaptation
- [x] Additive change; no existing skill files modified
- [x] Graph validation gate before claiming done

### Rollback Procedure
1. Remove `.opencode/skills/mcp-magicpath/`.
2. Revert the four catalog edits in `.opencode/skills/README.md`.
3. Re-run `skill_graph_scan` so the dropped node leaves the graph.
4. Optionally `npm uninstall -g magicpath-ai`.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A (no persistent app data; the only DB write is the advisor graph node, removed by a re-scan)
<!-- /ANCHOR:enhanced-rollback -->
