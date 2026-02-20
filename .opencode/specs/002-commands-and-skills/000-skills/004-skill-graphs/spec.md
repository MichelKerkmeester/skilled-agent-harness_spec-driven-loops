# Feature Specification: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY
The OpenCode skill system currently uses monolithic `SKILL.md` files which exhaust token windows and restrict multi-domain synthesis. This specification outlines the transition to a Skill Graph Architecture across **all available skills**, which uses small, composable markdown nodes connected by wikilinks. This progressive disclosure approach will vastly improve token efficiency, agent cognition, and context loading speed.

**Key Decisions**: 
- Adopt wikilinks `[[node]]` for semantic traversal in prose across all skills.
- Require YAML frontmatter with `description` fields on all nodes.
- Deprecate monolithic python-based Smart Routing in favor of Maps of Content (MOCs).

**Critical Dependencies**: Completion of a link validation script to ensure graph integrity across the entire `.opencode/skill/` directory.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P0 |
| **Status** | Planning |
| **Created** | 2026-02-20 |
| **Branch** | `004-skill-graphs` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Monolithic skill files (e.g., `system-spec-kit`, `workflows-documentation`) are becoming unmaintainable. They hit attention limits, cost excessive tokens, and force agents to read 1,500+ lines of context even for simple queries.

### Purpose
Implement a traversable Skill Graph architecture for **every available skill** utilizing progressive disclosure, so agents can dynamically build their context window by following relevant semantic links.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Conversion of **all existing skills** (including `system-spec-kit`, `workflows-documentation`, `workflows-code`, etc.) from monolithic `SKILL.md` format to Skill Graphs.
- Definition of YAML frontmatter standards for skill nodes.
- Implementation of a link-validation script (`check-links.sh`) supporting cross-skill node linking.
- Updates to agent instructions to natively support wikilink `[[...]]` traversal.

### Out of Scope
- Advanced automated vectorization of skill graphs (relying on standard `Read` and `Glob` tools for now).
- Altering the core behavior of the skills themselves (purely an architectural documentation refactor).

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/*/SKILL.md` | Delete/Replace | Replace with index.md and nodes across all skills |
| `.opencode/skill/*/nodes/*.md` | Create | Extracted modular skill files |
| `scripts/check-links.sh` | Create | Global link validation utility |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | YAML Frontmatter | Every node must have `description: "..."` in YAML frontmatter. |
| REQ-002 | Global Link Validation | `check-links.sh` passes with 0 broken wikilinks across the entire `.opencode/skill/` directory. |
| REQ-003 | Index Entry Points | `.opencode/skill/<skill-name>/index.md` exists and routes properly for every skill. |

### P1 - Required (complete OR user-approved deferral)
| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | MOC Organization | Sub-topics in large skills must be clustered using Maps of Content (MOCs). |
| REQ-005 | Cross-Skill Linking | Nodes should be able to reference other skills' nodes directly using paths or global MOCs. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
- **SC-001**: Agent successfully traverses multiple skill graphs to retrieve specific nested information without loading entire contents.
- **SC-002**: Token usage for initial invocation of any skill drops by at least 70%.
- **SC-003**: All existing skills have been fully migrated to the node-based architecture.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `Read` Tool | High | Ensure agent prompt explicitly instructs how to follow wikilinks using `Read`. |
| Risk | Broken Links | High | Automated `check-links.sh` required in CI/pre-commit or manual validation steps. |
| Risk | Migration Scale | Medium | Decomposing every skill takes time. Do it in phases (pilot first, then broad rollout). |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS
### Performance
- **NFR-P01**: Initial index files must be under 150 LOC.
- **NFR-P02**: Individual nodes should aim to be under 100 LOC to minimize token usage per hop.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES
### Data Boundaries
- Missing `.md` extension in wikilinks: Link validation script and agents should auto-resolve to `.md` if omitted.

### Error Scenarios
- Agent hits a dead link: Agent should report broken link and attempt to fallback to `Glob` search.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT
| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 25/25 | Modifying core architectural patterns across ALL skills in the system. |
| Risk | 20/25 | High risk of breaking existing context routing if links fail. |
| Research | 15/20 | Concept validation required (already completed). |
| Multi-Agent | 15/15 | Requires coordination between @speckit, @research, and @general. |
| Coordination | 15/15 | Changes fundamental agent instruction handling. |
| **Total** | **90/100** | **Level 3+** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX
| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Agents fail to follow links | High | Medium | Add clear instructions in the root index file explaining how to traverse. |
| R-002 | Link rot over time | Med | High | Strict enforcement of `check-links.sh`. |
| R-003 | Lost functionality | High | Low | QA each skill conversion thoroughly before deleting `SKILL.md`. |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES
### US-001: Skill Graph Traversal (Priority: P0)
**As an** AI Agent, **I want** to read an index and follow semantic wikilinks across any skill, **so that** I can retrieve exact domain knowledge without loading irrelevant context.
**Acceptance Criteria**:
1. Given an `index.md` with a link `[[validation-rules]]`, When I need validation info, Then I read `validation-rules.md`.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW
| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | OpenCode AI | Approved | 2026-02-20 |
| Implementation Review | User | Pending | |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS
### Code Compliance
- [ ] Coding standards followed (Markdown formatting)
- [ ] No hardcoded absolute paths in wikilinks (all relative to `.opencode/skill/`)
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX
| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| User | Developer | High | Spec review and PR approval |
| OpenCode AI | Agent | High | Must consume the new format |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG
### v1.1 (2026-02-20)
**Updated scope to include all OpenCode skills.**

### v1.0 (2026-02-20)
**Initial specification for Skill Graphs**
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS
- Should we build a `Glob` wrapper for wikilink resolution if strict pathing fails?
<!-- /ANCHOR:questions -->