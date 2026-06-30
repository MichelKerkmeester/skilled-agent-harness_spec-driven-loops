---
title: "Implementation Plan: Create sk-design-md-generator skill with an embedded extraction pipeline [template:level_3/plan.md]"
description: "Embed the design-md-generator working tool and author a conformant skill layer, registered in the advisor graph: embed -> author (DeepSeek + MiMo) -> register -> verify."
trigger_phrases:
  - "design-md-generator plan"
  - "embed working tool"
  - "skill authoring dispatch"
  - "advisor registration"
  - "design extraction skill"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator"
    last_updated_at: "2026-06-21T10:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 generator plan"
    next_safe_action: "Verify tool smoke and routing"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-generator"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Create sk-design-md-generator skill with an embedded extraction pipeline

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown skill layer over an embedded TypeScript tool (Playwright) |
| **Framework** | OpenCode skill system + system-skill-advisor graph |
| **Storage** | `skill-graph.sqlite` (advisor routing); `tool/output/<domain>/tokens.json` at runtime |
| **Testing** | `package_skill.py --check`, `quick_validate.py`, `vitest`, live extraction, `validate.sh --strict` |

### Overview
Embed the embedded working tool under `tool/`, author a conformant skill layer (`SKILL.md`, references, INSTALL_GUIDE, README, graph-metadata, changelog) with DeepSeek and MiMo doing the heavy authoring and Claude verifying, then register the skill in the advisor graph with reciprocal sibling edges and prove the tool runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Embed depth decided (full working tool)
- [x] Source tool analyzed; standards mapped
- [x] Spec folder authored

### Definition of Done
- [ ] Skill validates (package_skill.py, DQI) and is registered in the graph
- [ ] Routing resolves the skill; reciprocal edges symmetric
- [ ] Tool smoke green (install + tests + one extraction)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Embedded-tool skill: a thin advisor-routable skill layer wraps a self-contained third-party engine, mirroring `mcp-figma`.

### Key Components
- **`tool/`**: the embedded Playwright extraction pipeline (scripts, resources, examples, configs).
- **Skill layer**: `SKILL.md` (routing + cardinal rule), `references/` (framework operational docs), INSTALL_GUIDE, README, `graph-metadata.json`.
- **Advisor graph**: the new node + reciprocal sibling edges into the `sk-design-*` family.

### Data Flow
A URL -> `extract.ts` -> `tokens.json` -> agent writes `DESIGN.md` (verbatim from tokens) -> `validate.ts` confirms fidelity. The advisor routes extraction requests to the skill via graph-metadata signals.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| New skill dir | does not exist | create embed + skill layer | package_skill.py PASS |
| Advisor graph | family graph | add node + reciprocal sibling edges | sqlite node + symmetric edges |
| sk-design-interface/mcp-figma/mcp-open-design graph-metadata | sibling producers | add back-edges | skill_graph_validate isValid |

Required inventories:
- Same-class producers: the three design-family skills that should sibling the new node.
- Consumers of changed symbols: `sqlite3 skill-graph.sqlite "SELECT * FROM skill_edges WHERE target_id='sk-design-md-generator'"`.
- Matrix axes: embed-vs-author × required-doc × graph-edge.
- Algorithm invariant: `skill_id == basename(folder)`; sibling edges symmetric.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Spec folder + decision-record authored
- [x] Source extraction tool adapted into tool/

### Phase 2: Core Implementation
- [x] Embed `tool/` (scripts, resources, examples, configs)
- [x] Author SKILL.md (DeepSeek), README + INSTALL_GUIDE (MiMo), references + graph-metadata + changelog (Claude)
- [x] Reciprocal sibling back-edges in the three design-family skills

### Phase 3: Verification
- [x] package_skill.py + quick_validate.py PASS
- [x] skill_graph_scan register + skill_graph_validate isValid + routing smoke
- [ ] Tool smoke: npm install + vitest + one live extraction
- [ ] validate.sh --strict on the 152 folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Embedded pipeline (clustering, validation) | `vitest` (50 tests) |
| Integration | Live extraction produces tokens.json | `extract.ts <url> --fast` |
| Manual | Skill validity, routing, graph symmetry | package_skill.py, advisor_recommend, sqlite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Playwright + Chromium | External | Green | Extraction blocked; one-time install documented |
| Advisor daemon / CLI | Internal | Yellow (MCP flapped; CLI used) | Use skill-advisor.cjs CLI fallback |
| 153 rename (sibling names) | Internal | Green (done first) | Edges wire to sk-design-interface directly |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: skill fails validation, routing breaks, or the embed is unwanted.
- **Procedure**: `git rm -r .opencode/skills/sk-design-md-generator`, remove the three reciprocal back-edges, re-run `skill_graph_scan` to drop the node.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Embed + Author) ──► Phase 3 (Register + Verify)
                         Author depends on Embed (needs the source content)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Embed |
| Embed | Setup | Author |
| Author | Embed | Register |
| Verify | Author + Register | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Embed | Low | Done |
| Author | High | DeepSeek + MiMo dispatch + Claude verify |
| Verify | Med | Register + routing + tool smoke |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Embed committed (durable)
- [x] Skill layer committed scoped
- [ ] Graph registered + verified

### Rollback Procedure
1. `git rm -r .opencode/skills/sk-design-md-generator`.
2. Revert the reciprocal back-edges in the three sibling graph-metadata files.
3. Re-run `skill_graph_scan`; confirm the node is gone from sqlite.
4. No daemon recycle needed; the scan re-derives the graph.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git + a graph re-scan.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│   Phase 3   │
│   Setup     │     │ Embed+Auth  │     │   Verify    │
└─────────────┘     └──────┬──────┘     └─────────────┘
                          │
                    ┌─────▼─────┐
                    │ Phase 2b  │
                    │ DeepSeek+ │
                    │   MiMo    │
                    └───────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Embed tool/ | None | tool tree | SKILL.md, references |
| SKILL.md (DeepSeek) | Embed | routing entry | graph-metadata, register |
| README/INSTALL (MiMo) | Embed | human docs | register |
| graph-metadata + back-edges | SKILL.md | advisor node | Verify |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Embed tool/** - mechanical - CRITICAL (everything else needs the source)
2. **Author SKILL.md** - DeepSeek dispatch + Claude verify - CRITICAL
3. **Register + verify** - scan + routing + tool smoke - CRITICAL

**Total Critical Path**: embed -> SKILL.md -> register/verify.

**Parallel Opportunities**:
- README/INSTALL (MiMo) and references/graph-metadata (Claude) run alongside the SKILL.md dispatch.
- The 152 spec docs are authored while dispatches run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Embed complete | tool/ committed | Phase 2 |
| M2 | Skill layer authored | package_skill.py PASS | Phase 2 |
| M3 | Registered + verified | routing resolves; tool smoke green | Phase 3 |
<!-- /ANCHOR:milestones -->

---
