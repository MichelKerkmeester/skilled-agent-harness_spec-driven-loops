---
title: "Implementation Plan: Rename sk-interface-design skill to sk-design-interface across the framework [template:level_2/plan.md]"
description: "Dependency-ordered rename of the sk-interface-design judgment skill to sk-design-interface: filesystem move, reciprocal graph-edge repair before rebuild, cross-skill prose, history rewrite, and a verified skill-graph re-registration."
trigger_phrases:
  - "rename plan"
  - "sk-design-interface"
  - "skill-graph rebuild"
  - "reciprocal edges"
  - "history rewrite"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/007-sk-design-interface-rename"
    last_updated_at: "2026-06-21T09:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Completed rename and graph rebuild"
    next_safe_action: "Verify packet 153 closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-interface/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp_server/database/skill-graph.sqlite"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-153-rename"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Rename sk-interface-design skill to sk-design-interface across the framework

<!-- SPECKIT_LEVEL: 2 -->
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
| **Language/Stack** | Markdown + JSON metadata; TypeScript advisor daemon (SQLite) |
| **Framework** | OpenCode skill system + system-skill-advisor graph |
| **Storage** | `skill-graph.sqlite` (binary, runtime authority); `graph-metadata.json` (authoring) |
| **Testing** | `skill_graph_validate`, `advisor_validate`, `validate.sh --strict`, ripgrep + sqlite checks |

### Overview
Rename the skill directory `sk-interface-design` → `sk-design-interface` history-preservingly, edit its internal identity, repair reciprocal sibling graph edges BEFORE rebuilding the binary advisor graph, update cross-skill prose and root indexes, rewrite historical spec records with pointer reconciliation, then re-register via `skill_graph_scan` and verify zero live old-name references.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified (advisor daemon, skill-graph.sqlite, shared git index)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001..007)
- [ ] Graph rebuilt; 6 edges intact; old node absent
- [ ] Docs updated (spec/plan/tasks/checklist/impl-summary synchronized)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic refactor — identity rename with referential-integrity repair across a binary graph and a doc/registry layer.

### Key Components
- **Skill folder + `graph-metadata.json`**: the skill's authoring identity (`skill_id` must equal folder basename).
- **`skill-graph.sqlite`**: runtime routing authority; rebuilt by `skill_graph_scan` which prunes stale nodes and re-publishes edges from each skill's metadata.
- **Reciprocal sibling edges**: `mcp-open-design`/`mcp-figma`/`sk-code` point at the skill; must be updated before rebuild or edges silently drop.

### Data Flow
Author edits `graph-metadata.json` → `skill_graph_scan` reads all metadata → prunes nodes not in current set, cascade-deletes their edges, re-inserts current nodes + edges → advisor routing reads the rebuilt SQLite.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-interface-design/` skill dir | Owns the skill identity | move → `sk-design-interface/` + edit `skill_id` | `ls` new dir; folder-name guard does not throw |
| `.opencode/changelog/sk-interface-design` (symlink) | Convenience alias to changelog | move + retarget | `readlink` resolves to existing target |
| `{mcp-open-design,mcp-figma,sk-code}/graph-metadata.json` | Edge producers pointing at the skill | update target string | `skill_edges` has 6 edges, zero UNKNOWN-TARGET |
| `{mcp-open-design,mcp-figma,sk-prompt}` prose | Co-load mandates / handoff docs | update name | grep clean |
| `/README.md`, `.opencode/skills/README.md` | Skill index | update name + link path | grep clean; link resolves |
| `143-sk-interface-design/` + `descriptions.json` | Historical spec records | rename + reconcile pointers | spec-graph validates |

Required inventories:
- Same-class producers: `rg -n 'sk-interface-design' .opencode/skills` (cross-skill edges + prose).
- Consumers of changed symbols: `sqlite3 skill-graph.sqlite "SELECT * FROM skill_edges WHERE target_id='sk-interface-design'"`.
- Matrix axes: live-vs-historical × name-string-vs-filesystem-path × graph-edge-vs-prose.
- Algorithm invariant: `skill_id == basename(folder)` must hold at every scan; reciprocal edges must be symmetric.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Pre-flight snapshot: git status, baseline sqlite nodes/edges, symlink mode
- [x] Confirm target folders (143/145) not in concurrent-session dirty set
- [x] Author spec/plan/tasks/checklist

### Phase 2: Core Implementation
- [ ] Step 1: `git mv` skill dir + changelog symlink (recreate target)
- [ ] Step 2: edit renamed skill internals (SKILL.md, README, graph-metadata, feature_catalog, playbook, references)
- [ ] Step 3: reciprocal sibling graph edges (mcp-open-design, mcp-figma, sk-code) — BEFORE rebuild
- [ ] Step 4: cross-skill live prose (mcp-open-design, mcp-figma, sk-prompt)
- [ ] Step 5: root + index docs
- [ ] Step 6: history rewrite (143 folder rename, prose, descriptions.json) + pointer reconcile

### Phase 3: Verification
- [ ] Step 7: `skill_graph_scan` rebuild + `skill_graph_validate` + `advisor_validate`
- [ ] Step 8: zero-live-hits grep, sqlite node/edge checks, routing smoke, symlink check, validate.sh --strict
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Skill-graph node/edge integrity | `sqlite3` queries |
| Integration | Advisor routing resolves new id | `advisor_recommend`, `advisor_validate` |
| Manual | Zero live references; symlink resolves; spec docs validate | `rg`, `readlink`, `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor daemon + skill-graph.sqlite | Internal | Green | Stale routing until rebuild; recycle owner if needed |
| Shared git index (concurrent sessions) | Internal | Yellow | Scoped staging only; no broad commits |
| `skill_graph_scan` trusted mutation | Internal | Green | In-session MCP is trusted; CLI fallback needs `--trusted` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Broken routing, dropped edges, or pointer-drift validation failure.
- **Procedure**: All changes are git-tracked; `git checkout -- <paths>` / `git restore` the touched files and folders, then re-run `skill_graph_scan` to restore the prior graph from the reverted metadata.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Steps 1-6, ordered) ──► Phase 3 (Steps 7-8)
                         Step 3 (edges) MUST precede Step 7 (rebuild)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core Steps 1-2 | Setup | Steps 3-6 |
| Core Step 3 (edges) | Steps 1-2 | Step 7 (rebuild) |
| Verify Steps 7-8 | Steps 1-6 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Done |
| Core Implementation | Med | 1-2 hours |
| Verification | Low | 0.5-1 hour |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline captured (sqlite nodes/edges, symlink mode)
- [ ] Reciprocal edges updated before rebuild
- [ ] `advisor_status` checked post-rebuild

### Rollback Procedure
1. `git restore --staged --worktree` the renamed paths and edited metadata/prose.
2. Restore the original folder/symlink names via `git mv` back (or `git checkout`).
3. Re-run `skill_graph_scan` to rebuild from the reverted metadata.
4. Verify `skill_nodes` shows `sk-interface-design` restored with 6 edges.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: git-based; the binary graph is regenerated from metadata, not hand-edited.
<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~140 lines)
- Core + Verification additions
- Phase dependencies, effort estimation
- Enhanced rollback procedures
-->
