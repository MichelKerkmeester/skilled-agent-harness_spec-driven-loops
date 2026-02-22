---
title: "Implementation Plan: Skill Graphs Integration [002-skill-graph-integration/plan]"
description: "This plan details the process of adding supplemental Skill Graph layers to every available OpenCode skill and integrating graph semantics into the system-spec-kit memory archite..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "skill"
  - "graphs"
  - "integration"
  - "002"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: Skill Graphs Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context
| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, Bash, TypeScript/Node (existing Spec Kit Memory scripts) |
| **Framework** | OpenCode Skills System |
| **Storage** | Local File System + existing Spec Kit Memory DB |
| **Testing** | Bash Link Checker + SGQS compatibility checks |

### Overview
This plan details the process of adding supplemental Skill Graph layers to **every available OpenCode skill** and integrating graph semantics into the `system-spec-kit` memory architecture. It defines tooling setup (link validation + Graph-Lite query layer), pilot migration, per-skill node completion across all 9 skills, and final verification of token efficiency, cross-skill traversal, and backward compatibility with existing memory tools.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- [x] Problem statement clear and scope documented
  - Evidence: `spec.md` captures boundaries (skill graph migration + SGQS integration only) and excludes unrelated refactors.
- [x] Success criteria measurable
  - Evidence: checklist includes binary validation points (`check-links.sh`, migration coverage, SGQS compatibility, Neo4j absence).
- [x] Dependencies identified
  - Evidence: internal dependencies listed with impact table and block behavior in Section 6.

### Definition of Done
- [ ] All acceptance criteria met
  - Deliverable: every TASK/CHK item in scope has completion evidence or approved deferral where allowed.
  - Validation: cross-check `tasks.md` and `checklist.md` for state consistency before closeout.
- [ ] `check-links.sh` passing across `.opencode/skill/`
  - Deliverable: global link report artifact with zero unresolved wikilinks.
  - Validation: `bash check-links.sh .opencode/skill` exits successfully.
- [ ] **All** skills converted to graph architecture
  - Deliverable: all 9 skills have index + node graph + primary `SKILL.md` entrypoint with supplemental graph layers.
  - Validation: node coverage matrix marks all rows complete with references.
- [ ] `sk-documentation` includes Skill Graph standards reference, node template asset, and updated `SKILL.md`
  - Deliverable: standards doc, template asset, and entrypoint guidance linked together.
  - Validation: direct file checks plus traversal from `SKILL.md` to both artifacts.
- [ ] SGQS implemented as an in-process graph-style query layer inside Spec Kit Memory architecture
  - Deliverable: parser/executor path that runs on existing memory entities and access patterns.
  - Validation: SGQS scenario fixtures execute without contract changes to existing tools.
- [ ] No external Neo4j dependency introduced
  - Deliverable: explicit dependency guard in verification pipeline.
  - Validation: dependency scan shows no `neo4j` package/import/protocol usage.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Skill Graph (Nodes + Edges)

### Key Components
- **Index/MOC**: Entry point that partitions each skill into discoverable domains and guarantees stable first-hop navigation.
- **Skill Nodes**: Markdown node files with normalized YAML frontmatter so indexers and agents can infer intent consistently.
- **Wikilinks**: Semantic `[[node]]` edges representing directed navigation paths and dependency relationships.
- **Graph Metadata Mapper**: Translation layer from node/frontmatter/wikilink structures into memory-compatible node-edge records.
- **SGQS Parser/Executor**: Lightweight query layer (`MATCH`, `REL`, `WHERE`, `RETURN`) running in-process against existing memory abstractions.
- **Compatibility Adapter**: Guardrail surface proving `memory_context`, `memory_search`, and `memory_save` maintain current behavior.

### Data Flow
Agent reads `index.md` -> resolves YAML intent metadata -> follows relevant `[[links]]` -> loads linked `node.md` files -> mapper materializes node-edge records compatible with memory abstractions -> SGQS executes traversal/filter queries over mapped records -> compatibility adapter validates unchanged memory-tool contracts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Tooling & Setup
- [ ] Build and validate wikilink integrity tooling (`check-links.sh`).
  - Inputs: markdown files under `.opencode/skill/`, wikilink syntax contract, relative-path resolution rules.
  - Execution guidance: implement recursive scanning, normalize `[[node]]` + `[[path/to/node]]`, and emit deterministic diagnostics per file/link.
  - Exit criteria: global command run reports checked-file count and zero unresolved links when repository state is clean.
  - Verification artifacts: `artifacts/link-check.log` with timestamp and command line used.
  - Dependencies: none; hard prerequisite for Phase 5 verification confidence.
- [ ] Establish graph directory and metadata conventions for all skills.
  - Inputs: existing skill folder inventory and node/frontmatter conventions from completed pilot work.
  - Execution guidance: standardize `index.md` + `nodes/*.md` layout, frontmatter key contract, and Graph Status header expectations.
  - Exit criteria: conventions are explicit and reusable across all remaining six pending skills without per-skill reinterpretation.
  - Verification artifacts: structure audit notes and standards references linked from planning docs.
  - Dependencies: alignment with current skill authoring patterns.
- [ ] Finalize SGQS grammar and mapping prerequisites (design-only at this phase).
  - Inputs: existing memory entities, required query scenarios, current API contract boundaries.
  - Execution guidance: define clause order (`MATCH` -> `REL` -> `WHERE` -> `RETURN`), operators, parse errors, and AST targets.
  - Exit criteria: grammar and mapping are specific enough that TASK-401 implementation can proceed without scope ambiguity.
  - Verification artifacts: SGQS grammar specification and parser fixture plan.
  - Dependencies: memory architecture boundaries and in-process execution stance.
- [ ] Baseline the 9-skill coverage matrix and governance loop.
  - Inputs: all nine skills, completion definition, task IDs TASK-310..TASK-318.
  - Execution guidance: create/update matrix as source-of-truth and tie state updates to task/checklist evidence.
  - Exit criteria: matrix state aligns with documented current reality (3 complete, 6 pending) and can be audited.
  - Verification artifacts: matrix snapshot and sync check notes against `tasks.md` and `checklist.md`.
  - Dependencies: finalized completion criteria and documentation synchronization.

### Phase 2: Pilot Migration (`system-spec-kit`)
- [ ] Execute pilot node decomposition for `system-spec-kit`.
  - Inputs: current `SKILL.md` domains (routing, memory, validation, workflows).
  - Execution guidance: split by stable conceptual domains, prevent overlap, and keep each node independently useful.
  - Exit criteria: every pilot domain is reachable from `index.md` with no orphan content.
  - Verification artifacts: traversal notes showing entrypoint -> index -> node coverage across all core domains.
  - Dependencies: Phase 1 link tooling and conventions.
- [ ] Build deterministic pilot index and add Graph Status header to SKILL.md.
  - Inputs: decomposed pilot nodes and backward-compatibility requirement for skill loading.
  - Execution guidance: create deterministic first-hop ordering in `index.md`; keep `SKILL.md` concise and routing-focused.
  - Exit criteria: legacy invocation behavior remains intact while deep guidance is served from graph nodes.
  - Verification artifacts: manual hop transcript from `SKILL.md` into targeted domains.
  - Dependencies: successful pilot decomposition.
- [ ] Integrate pilot graph metadata into memory indexing flow.
  - Inputs: frontmatter + wikilink graph artifacts and SGQS mapping assumptions.
  - Execution guidance: ingest node-edge metadata in-process without altering existing memory tool interfaces.
  - Exit criteria: mapped metadata is available for SGQS scenarios while baseline memory flows stay stable.
  - Verification artifacts: pilot indexing report + pre/post behavior comparison for core memory tools.
  - Dependencies: SGQS grammar/mapping definitions and compatibility boundaries.

### Phase 3: Broad Migration (All Other Skills)
- [ ] Migrate and verify `sk-documentation` as standards-producing exemplar.
  - Inputs: pilot migration approach, existing documentation skill corpus.
  - Execution guidance: keep graph navigation explicit and publish reusable standards/template artifacts as part of migration.
  - Exit criteria: `sk-documentation` supports graph-first authoring and one-hop discoverability of standards/template assets.
  - Verification artifacts: traversal transcript + direct file checks for standards/template presence.
  - Dependencies: pilot patterns and authoring conventions.
- [ ] Roll out remaining six pending skills with matrix-driven governance.
  - Inputs: six pending skills, node template, standards reference, per-skill completion criteria.
  - Execution guidance: migrate one skill at a time; after each skill, run link check, update matrix, and capture traversal evidence.
  - Exit criteria: each skill transitions from pending to complete only when `SKILL.md`, `index.md`, and node coverage all pass verification.
  - Verification artifacts: per-skill traversal notes, matrix updates, and periodic global link-check logs.
  - Dependencies: standards/template readiness, matrix governance (TASK-105), and Phase 1 integrity tooling.
- [ ] Maintain state synchronization across spec artifacts during rollout.
  - Inputs: `tasks.md`, `checklist.md`, matrix snapshot, implementation summary status.
  - Execution guidance: treat task/check IDs as canonical; update status in lockstep to avoid drift.
  - Exit criteria: no contradiction between plan/task/checklist state for any skill-row completion claim.
  - Verification artifacts: synchronization review note attached at each migration batch checkpoint.
  - Dependencies: disciplined documentation updates after each skill migration.

### Phase 4: SGQS Implementation & Compatibility
- [ ] Implement SGQS parser/executor in-process on existing memory architecture.
  - Inputs: finalized SGQS grammar, mapping model, existing memory DB access patterns.
  - Execution guidance: parse into canonical AST, execute over mapped metadata records, and return deterministic traversal/filter results.
  - Exit criteria: supported clauses (`MATCH`, `REL`, `WHERE`, `RETURN`) pass fixture suite with explicit parse/runtime error behavior.
  - Verification artifacts: SGQS fixture report with expected-vs-actual outputs.
  - Dependencies: grammar and mapping readiness from Phase 1.
- [ ] Execute compatibility and regression gates for memory MCP tools.
  - Inputs: baseline snapshots for `memory_context`, `memory_search`, `memory_save` plus SGQS scenarios.
  - Execution guidance: run baseline and SGQS-enabled suites in the same pipeline and diff contract-relevant output surfaces.
  - Exit criteria: no contract deltas in baseline behavior while SGQS scenarios pass.
  - Verification artifacts: compatibility report documenting baseline parity and SGQS pass status.
  - Dependencies: SGQS parser/executor implementation.
- [ ] Enforce Neo4j exclusion at dependency and source levels.
  - Inputs: manifests, lockfiles, source scan patterns.
  - Execution guidance: add scan rule for `neo4j` package/import/protocol references and fail verification on detections.
  - Exit criteria: repeated scans show no external Neo4j introduction.
  - Verification artifacts: dependency scan logs and CI/local gate outputs.
  - Dependencies: scan tooling availability and verification pipeline integration.

### Phase 5: Verification
- [ ] Execute final global link-integrity sweep.
  - Inputs: complete graph corpus across all nine skills.
  - Execution guidance: run global command after all migration edits are in scope; fix issues immediately and rerun until clean.
  - Exit criteria: zero unresolved wikilinks and reproducible command success.
  - Verification artifacts: final `artifacts/link-check.log` and remediation notes for any intermediate failures.
  - Dependencies: completion of migration edits affecting links.
- [ ] Validate multi-skill progressive-disclosure traversal behavior.
  - Inputs: prompt pack with at least three cross-skill user scenarios.
  - Execution guidance: capture hop-by-hop routing (`SKILL.md` -> `index.md` -> node chain) and confirm intended guidance resolution.
  - Exit criteria: all scenarios complete without wrong-branch routing or dead ends.
  - Verification artifacts: `artifacts/traversal-transcript.md` with scenario labels and expected outcomes.
  - Dependencies: complete node graphs and stable links.
- [ ] Validate SGQS behavior on real mapped skill graph metadata.
  - Inputs: traversal, filter, and error scenarios with deterministic expected outputs.
  - Execution guidance: execute scenarios against live mapped metadata and compare outputs to expected results.
  - Exit criteria: scenario matrix passes and compatibility claims are evidence-backed.
  - Verification artifacts: `artifacts/sgqs-compat-report.md` with expected-vs-actual comparisons.
  - Dependencies: SGQS implementation, compatibility suite, and Neo4j exclusion check.

### Phase Acceptance Summary (Execution Gate)
- **Phase 1 gate**: tooling and conventions are stable enough for repeatable migration with auditable outputs.
- **Phase 2 gate**: pilot proves graph decomposition + primary SKILL.md with graph layer + metadata viability.
- **Phase 3 gate**: all nine skills reach complete matrix state with synchronized task/checklist evidence.
- **Phase 4 gate**: SGQS works in-process and preserves memory-tool contracts without Neo4j dependencies.
- **Phase 5 gate**: link integrity, traversal behavior, and SGQS scenario results are all artifact-backed and reproducible.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
| Test Type | Scope | Tools | Pass Criteria | Evidence Artifact |
|-----------|-------|-------|---------------|-------------------|
| Integration | Link Integrity | `check-links.sh` | No unresolved wikilinks across `.opencode/skill/` | `artifacts/link-check.log` |
| Manual | Agent Traversal | Prompting & Tool Observation | All scenarios reach expected nodes without dead-end hops | `artifacts/traversal-transcript.md` |
| Integration | SGQS Compatibility | Existing memory tool tests + SGQS query fixtures | Baseline memory-tool behavior unchanged; SGQS fixtures pass | `artifacts/sgqs-compat-report.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
| Dependency | Type | Status | Impact if Blocked | Verification Signal |
|------------|------|--------|-------------------|---------------------|
| Agent `Read` Tool | Internal | Green | Agents cannot traverse graph | Cross-skill traversal prompt execution succeeds |
| Spec Kit Memory DB/Tool Contracts | Internal | Green | SGQS cannot be introduced safely | Compatibility tests for `memory_context/search/save` remain stable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
- **Trigger**: Agents fail to navigate the new graph structure.
- **Procedure**:
  1. Revert migration commits that introduced graph nodes for affected skills.
  2. Remove graph status headers from `SKILL.md` for impacted directories.
  3. Re-run link and traversal checks to confirm baseline behavior is recovered.
  4. Log root cause and remediation plan before reattempting rollout.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
```
Phase 1 (Tooling) ────► Phase 2 (Pilot) ────► Phase 3 (Broad Rollout) ────► Phase 4 (SGQS) ────► Phase 5 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Tooling | None | Pilot |
| Pilot | Tooling | Broad Rollout |
| Broad Rollout | Pilot | SGQS Implementation |
| SGQS Implementation | Broad Rollout | Verify |
| Verify | SGQS Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Tooling | Low | 1 hour |
| Pilot Migration | High | 2-3 hours |
| Broad Migration | High | 6-8 hours |
| SGQS Implementation | High | 3-4 hours |
| Verify | Med | 1 hour |
| **Total** | | **13-17 hours** |
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
┌─────────────┐     ┌─────────────┐     ┌───────────────┐    ┌─────────────┐    ┌─────────────┐
│   Phase 1   │────►│   Phase 2   │────►│    Phase 3    │───►│   Phase 4   │───►│   Phase 5   │
│   Tooling   │     │    Pilot    │     │ Broad Rollout │    │    SGQS     │    │   Verify    │
└─────────────┘     └─────────────┘     └───────────────┘    └─────────────┘    └─────────────┘
```
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH
1. **Tooling** - 1h - CRITICAL
2. **Pilot** - 3h - CRITICAL
3. **Broad Migration** - 8h - CRITICAL
4. **SGQS Implementation** - 4h - CRITICAL
5. **Verify** - 1h - CRITICAL

**Total Critical Path**: 17h
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES
| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Tooling Ready | `check-links.sh` works | Phase 1 |
| M2 | Pilot Done | `system-spec-kit` graph verified | Phase 2 |
| M3 | Global Rollout | Per-skill matrix shows first 3 complete + remaining 6 tracked | Phase 3 |
| M4 | SGQS Ready | Graph-style query layer works with existing memory architecture | Phase 4 |
| M5 | Verified | Zero broken links globally + SGQS compatibility passes | Phase 5 |
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
**Task**: SGQS compatibility validation, link validation, and final verification
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
| W-D | SGQS Layer | @general | `system-spec-kit/scripts/dist/memory/*` | Blocked on W-B |
| W-E | Traversal Testing | @debug | `testing/traversal.test` | Blocked on W-C and W-D |

### Sync Points
| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A, W-B complete | @general, @speckit | Pilot integrity verified |
| SYNC-002 | W-C, W-D complete | @general | Global integrity + SGQS compatibility verified |
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN
### Checkpoints
- **Per Phase**: Update `tasks.md`
<!-- /ANCHOR:communication -->

## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- Confirm scoped files and validation commands before edits.

### Execution Rules
| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Validate context before modification and verify after changes |
| TASK-SCOPE | Restrict edits to declared phase files |

### Status Reporting Format
- STATE: current checkpoint
- ACTIONS: files/commands run
- RESULT: pass/fail and next action

### Blocked Task Protocol
1. Mark BLOCKED with evidence.
2. Attempt one bounded workaround.
3. Escalate with options if unresolved.
