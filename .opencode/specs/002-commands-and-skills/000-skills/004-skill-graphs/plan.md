# Implementation Plan: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, Bash |
| **Framework** | OpenCode Skills System |
| **Storage** | Local File System |
| **Testing** | Bash Link Checker |

### Overview
This plan details the process of decomposing **every available OpenCode skill** into a interconnected Skill Graph. It defines the setup of tooling (link validation), a pilot migration, broad migration for all other skills, and the final verification of token efficiency and cross-skill traversal.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `check-links.sh` passing across `.opencode/skill/`
- [ ] **All** skills converted to graph architecture
- [ ] `workflows-documentation` includes Skill Graph standards reference, node template asset, and updated `SKILL.md`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Skill Graph (Nodes + Edges)

### Key Components
- **Index/MOC**: The entry point that maps the domain for each skill.
- **Skill Nodes**: Individual markdown files with YAML frontmatter.
- **Wikilinks**: Semantic edges connecting nodes `[[node]]`.

### Data Flow
Agent reads `index.md` -> reads YAML descriptions -> determines relevant `[[links]]` -> reads linked `node.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tooling & Setup
- [ ] Create `check-links.sh` to parse `[[link]]` syntax and verify relative paths across all subdirectories.
- [ ] Establish directory structures (`.opencode/skill/*/nodes/`).

### Phase 2: Pilot Migration (`system-spec-kit`)
- [ ] Extract Validation logic, Memory systems, and Document Levels to nodes.
- [ ] Create `index.md` pointing to these nodes via wikilinks.
- [ ] Convert `SKILL.md` to a lightweight graph entrypoint for backward compatibility.

### Phase 3: Broad Migration (All Other Skills)
- [ ] Decompose `workflows-documentation` into a Skill Graph.
- [ ] Add `workflows-documentation/references/skill_graph_standards.md`.
- [ ] Add `workflows-documentation/assets/opencode/skill_graph_node_template.md`.
- [ ] Update `workflows-documentation/SKILL.md` to document graph-first authoring and route to new references.
- [ ] Decompose `workflows-code` (and variations) into Skill Graphs.
- [ ] Decompose `mcp-code-mode` into a Skill Graph.
- [ ] Decompose `workflows-chrome-devtools` into a Skill Graph.
- [ ] Decompose `workflows-git` and `mcp-figma` into Skill Graphs.

### Phase 4: Verification
- [ ] Run `check-links.sh` globally to ensure graph integrity.
- [ ] Test agent traversal: Trigger a prompt that requires deep context spanning multiple skills.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools |
|-----------|-------|-------|
| Integration | Link Integrity | `check-links.sh` |
| Manual | Agent Traversal | Prompting & Tool Observation |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Agent `Read` Tool | Internal | Green | Agents cannot traverse graph |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Agents fail to navigate the new graph structure.
- **Procedure**: `git revert` the migration commits to restore the monolithic `SKILL.md` files.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
```
Phase 1 (Tooling) ────► Phase 2 (Pilot) ────► Phase 3 (Broad Rollout) ────► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tooling | None | Pilot |
| Pilot | Tooling | Broad Rollout |
| Broad Rollout | Pilot | Verify |
| Verify | Broad Rollout | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tooling | Low | 1 hour |
| Pilot Migration | High | 2-3 hours |
| Broad Migration | High | 6-8 hours |
| Verify | Med | 1 hour |
| **Total** | | **10-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK
### Pre-deployment Checklist
- [ ] Commit all current `SKILL.md` files safely to the git index.
### Rollback Procedure
1. Git checkout all `.opencode/skill/*/SKILL.md` files.
2. Remove all `nodes/` directories.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH
```
┌─────────────┐     ┌─────────────┐     ┌───────────────┐    ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│    Phase 3    │───►│   Phase 4   │
│   Tooling   │     │    Pilot    │     │ Broad Rollout │    │   Verify    │
└─────────────┘     └─────────────┘     └───────────────┘    └─────────────┘
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. **Tooling** - 1h - CRITICAL
2. **Pilot** - 3h - CRITICAL
3. **Broad Migration** - 8h - CRITICAL
4. **Verify** - 1h - CRITICAL

**Total Critical Path**: 13h
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Tooling Ready | `check-links.sh` works | Phase 1 |
| M2 | Pilot Done | `system-spec-kit` graph verified | Phase 2 |
| M3 | Global Rollout | All skills migrated + docs standards added | Phase 3 |
| M4 | Verified | Zero broken links globally | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD
See `decision-record.md` for the ADR regarding Skill Graphs.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK
### Tier 1: Sequential Foundation
**Files**: check-links.sh
**Agent**: Primary

### Tier 2: Parallel Execution
| Agent | Focus | Files |
|-------|-------|-------|
| Extraction Agent | Break down SKILL files | `nodes/*.md` |
| Index Agent | Create MOCs | `index.md` |

### Tier 3: Integration
**Agent**: Primary
**Task**: Link validation and final verification
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION
### Workstream Definition
| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Link Tooling | @general | `check-links.sh` | Pending |
| W-B | Pilot Extraction | @speckit | `system-spec-kit/nodes/*.md` | Pending |
| W-C | Broad Extraction | @general | All other skill directories | Blocked on W-B |
| W-D | Traversal Testing | @debug | `testing/traversal.test` | Blocked on W-C |

### Sync Points
| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A, W-B complete | @general, @speckit | Pilot integrity verified |
| SYNC-002 | W-C complete | @general | Global integrity verified |
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN
### Checkpoints
- **Per Phase**: Update `tasks.md`
<!-- /ANCHOR:communication -->
