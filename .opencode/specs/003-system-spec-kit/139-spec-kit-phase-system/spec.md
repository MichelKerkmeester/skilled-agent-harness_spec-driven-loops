<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The SpecKit Phase System formalizes the organic sub-folder pattern observed in specs 136 and 138 into a first-class, AI-assisted workflow that proactively detects large tasks and guides decomposition into structured phase folders before work begins. This replaces the current manual, after-the-fact sub-folder creation with intelligent up-front phase planning.

**Key Decisions**: (1) Phases are a behavioral layer on top of existing levels, not a new level tier; (2) Auto-suggestion via enhanced `recommend-level.sh` scoring; (3) New `/spec_kit:phase` command for phase lifecycle management.

**Critical Dependencies**: Existing `create.sh --subfolder` infrastructure, SKILL.md smart router data-driven architecture.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 139 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-20 |
| **Parent** | 003-system-spec-kit |
| **Branch** | `139-spec-kit-phase-system` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Large, multi-session tasks (500+ LOC, 15+ files, cross-domain scope) currently produce monolithic spec folders whose documentation grows unwieldy and whose context files balloon beyond useful retrieval limits. The sub-folder pattern that evolved organically in specs 136 (7 phases) and 138 (3 workstreams) proves the pattern works, but AI agents have no systematic awareness of when to suggest phasing, how to create phase structures, or how to validate them as cohesive units. Today, sub-folder creation is entirely manual and after-the-fact.

### Purpose

AI agents proactively detect tasks that warrant phased execution, suggest structured decomposition before work begins, create properly linked parent/child spec folders, and validate them as integrated units - reducing rework, context overload, and documentation drift in complex multi-session projects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase detection scoring in `recommend-level.sh` (new `--recommend-phases` output)
- SKILL.md smart router: new PHASE intent signal with keyword triggers and resource mapping
- New `/spec_kit:phase` command with auto/confirm modes and YAML workflow assets
- Enhanced `create.sh` with `--phase` mode (parent+child creation, phase metadata injection)
- Recursive validation via `validate.sh --recursive` for parent+child phase folders
- Phase-aware Gate 3: new Option E "Add phase to existing spec" in CLAUDE.md
- Parent spec template addendum with Phase Documentation Map and phase-linkage fields
- Child phase template with parent back-reference fields and handoff criteria
- New `nodes/phase-system.md` graph mode node
- New `references/structure/phase_definitions.md` reference document
- Updates to `sub_folder_versioning.md`, `level_specifications.md`, `template_guide.md`, `quick_reference.md`
- Updates to existing commands: `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`

### Out of Scope
- Memory MCP server changes - Phase system uses existing memory infrastructure as-is
- Sharded template integration - Sharded system remains a parallel alternative, not merged
- compose.sh modifications - Phase templates composed manually, not via compose.sh pipeline
- Level tier changes - Phases are behavioral, not a new documentation level
- Cross-spec-folder phase linking - Phases must live under a single parent spec folder
- Automated phase transition (auto-advancing from phase N to N+1) - Remains user-driven

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/SKILL.md` | Modify | Add PHASE intent signal, resource mapping, command boost |
| `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | Modify | Add phase recommendation scoring and --recommend-phases flag |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | Add --phase mode with parent+child creation |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Add --recursive flag for phase-aware validation |
| `.opencode/command/spec_kit/phase.md` | Create | New /spec_kit:phase command entry point |
| `.opencode/command/spec_kit/assets/spec_kit_phase_auto.yaml` | Create | Phase command autonomous workflow |
| `.opencode/command/spec_kit/assets/spec_kit_phase_confirm.yaml` | Create | Phase command interactive workflow |
| `.opencode/command/spec_kit/plan.md` | Modify | Add phase awareness to Gate 3 options |
| `.opencode/command/spec_kit/implement.md` | Modify | Support sub-folder path resolution |
| `.opencode/command/spec_kit/complete.md` | Modify | Add phase lifecycle to workflow |
| `.opencode/command/spec_kit/resume.md` | Modify | Phase detection in context loading |
| `.opencode/skill/system-spec-kit/templates/addendum/phase/` | Create | Phase-linkage addendum (parent + child templates) |
| `.opencode/skill/system-spec-kit/nodes/phase-system.md` | Create | Graph mode node for phase workflow |
| `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | Create | Phase taxonomy and transition rules |
| `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md` | Modify | Integrate phase concepts into versioning docs |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Phase-boundary rules in cross-cutting section |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Modify | Phase template section (extend existing Section 10) |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Phase workflow shortcuts and decision tables |
| `.opencode/skill/system-spec-kit/index.md` | Modify | Add phase-system.md to MOC Workflow & Routing section |
| `CLAUDE.md` | Modify | Gate 3 Option E, phase-aware routing table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `recommend-level.sh` outputs phase recommendation alongside level recommendation | `--json` output includes `recommended_phases: true/false`, `phase_reason`, `suggested_phase_count` when score >= 70 AND (architectural OR files > 15 OR LOC > 800) |
| REQ-002 | `create.sh --phase` creates parent spec folder with Phase Documentation Map section + first child phase folder with parent back-reference | Running `create.sh "Large Feature" --phase --level 3 --phases 3` creates `specs/NNN-large-feature/` with root docs + `001-phase-name/` child with linked docs |
| REQ-003 | `validate.sh --recursive` discovers and validates all `[0-9][0-9][0-9]-*/` child phase folders within a parent, producing aggregated results | Exit code reflects worst child; JSON output includes `phases[]` array with per-phase results |
| REQ-004 | `/spec_kit:phase` command exists with auto/confirm modes | `phase.md` + 2 YAML workflow assets follow existing command structure pattern |
| REQ-005 | SKILL.md smart router recognizes PHASE intent and loads phase-specific resources | Adding `"phase"` to INTENT_SIGNALS dict, mapping to `references/structure/phase_definitions.md` in RESOURCE_MAP, boost via `/spec_kit:phase` command |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Gate 3 offers Option E "Add phase to existing spec" when existing spec has high complexity | CLAUDE.md updated; AI correctly offers E when resuming complex specs |
| REQ-007 | Existing commands (`plan`, `implement`, `complete`, `resume`) handle phase sub-folder paths | All commands resolve `specs/NNN-name/002-phase/plan.md` correctly |
| REQ-008 | Auto-suggestion triggers when AI detects task exceeding phase thresholds | AI proactively suggests "This task may benefit from a phased approach" when recommend-level.sh scoring indicates phases |
| REQ-009 | Parent spec template includes Phase Documentation Map section linking to child phases | Section maps root requirements to phase deliverables (modeled after 136's Section 3.6) |
| REQ-010 | Child phase template includes parent back-references and handoff criteria | Each child spec.md has `Parent Spec: ../spec.md`, `Parent Plan: ../plan.md`, predecessor/successor phase fields |
| REQ-011 | `nodes/phase-system.md` documents phase lifecycle, transitions, and boundary rules | Node exists in Workflow & Routing section of index.md MOC |
| REQ-012 | Reference docs updated: `phase_definitions.md` created, `sub_folder_versioning.md` + `template_guide.md` + `quick_reference.md` + `level_specifications.md` updated | All reference docs reflect phase system as first-class concept |

### P2 - Nice to Have (can defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Phase progress dashboard in parent checklist.md | Parent checklist shows phase completion status table |
| REQ-014 | `recommend-level.sh` suggests phase names based on task decomposition | JSON output includes `suggested_phase_names[]` when phases recommended |
| REQ-015 | Sharded template integration for parent specs | Parent spec uses sharded format (spec-index.md + per-phase shards) for token efficiency |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| ID | Criterion | Measurement | Target |
|----|-----------|-------------|--------|
| SC-001 | Phase recommendation accuracy | recommend-level.sh correctly identifies tasks needing phases (validated against 136/138 retrospective) | >= 80% |
| SC-002 | Phase folder creation correctness | create.sh --phase creates valid, validate.sh-passing structures | 100% pass rate |
| SC-003 | Recursive validation coverage | validate.sh --recursive validates all children + parent | All 14 rules applied per phase folder |
| SC-004 | Command phase-path resolution | All 4 modified commands resolve sub-folder paths | 0 path resolution errors |
| SC-005 | AI auto-suggestion rate | AI proactively suggests phasing for qualifying tasks | Triggers on tasks matching 136/138 scope profile |
| SC-006 | Template linkage integrity | Parent-child back-references resolvable | All `../spec.md` references valid |
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Dependencies
- Existing `create.sh --subfolder` infrastructure (working, tested)
- SKILL.md smart router data-driven dict architecture (extensible by design)
- `validate.sh` plugin-based rule architecture (14 rules, source-and-execute pattern)
- Existing command structure pattern (md + 2 YAML assets per command)

### Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Over-suggestion: AI recommends phases for tasks that don't need them | Medium | Medium | Conservative thresholds; require both high score AND multi-domain signals |
| Phase template bloat: Too many files per phase folder | High | Low | Use Level 1-2 for child phases by default; only parent needs L3+ |
| Context window pressure: Parent + multiple child docs in single session | High | Medium | Sharded loading; only load active phase docs |
| Gate 3 complexity: 5 options (A-E) may confuse users | Medium | Low | Option E only shown when existing spec has phased content or high complexity |
| Command path resolution brittleness: nested paths harder to resolve | Medium | Medium | Leverage existing generate-context.js path resolution (4 formats supported) |
| Backward compatibility: existing non-phased specs must continue working | High | Low | Phase features are purely additive; all flags optional |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

| Category | Requirement |
|----------|-------------|
| **Performance** | `recommend-level.sh --recommend-phases` adds < 50ms to scoring time |
| **Performance** | `validate.sh --recursive` on 7-phase parent completes in < 10s |
| **Compatibility** | All existing non-phased spec folders validate identically with or without --recursive |
| **Compatibility** | Bash 4.0+ compatibility maintained (no Bash 5+ features) |
| **Usability** | Phase suggestion message includes concrete phase decomposition rationale |
| **Usability** | `/spec_kit:phase` follows identical UX patterns as existing commands |
| **Maintainability** | Phase templates use CORE + ADDENDUM composition (no separate maintenance branch) |
| **Extensibility** | Phase scoring dimensions configurable via `.speckit.yaml` overrides |
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

| # | Scenario | Expected Behavior |
|---|----------|-------------------|
| EC-01 | Single-phase parent (user creates parent but only ever needs 1 phase) | Valid; degenerate case equivalent to standard spec folder with one sub-folder |
| EC-02 | Phase folder created but never populated (empty child) | validate.sh warns about empty phase; does not error |
| EC-03 | Parent has phases but user runs flat validate (no --recursive) | Validates parent only; no error; warns if child folders detected |
| EC-04 | Phase numbering gap (001, 002, 005 - skip 003/004) | create.sh uses max+1 logic; skipped numbers are valid (no renumbering) |
| EC-05 | Mixed levels: parent is L3+, child phases are L1 | Valid; each folder's level is independent. Parent level does not cascade |
| EC-06 | Recommend-level suggests phases but user declines | System proceeds without phases; no persistent flag or penalty |
| EC-07 | Existing sub-folder (versioning) vs new phase (semantic) | Phase flag distinguishes: `--phase` creates phase metadata; `--subfolder` creates version iteration |
| EC-08 | Phase created in wrong parent folder | validate.sh parent-child link check fails; error with corrective guidance |
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

### 3D Assessment (Level 2)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Technical** | 22/30 | Modifies 5+ existing scripts, creates 3 new command files, updates 7+ reference docs, adds templates |
| **Domain** | 18/20 | Deep integration with SKILL.md router, Gate 3, validation pipeline, command system, and template architecture |
| **Integration** | 18/20 | Cross-cutting: scripts, commands, templates, references, nodes, CLAUDE.md all must align |
| **TOTAL** | **58/70** | |

### 5D Assessment (Level 3+)

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Technical Complexity** | 22/25 | 20+ files modified/created across 6 subsystems |
| **Domain Complexity** | 18/20 | Formalizing emergent pattern requires deep understanding of existing organic usage |
| **Integration Complexity** | 18/20 | Every major subsystem touched: router, scripts, commands, templates, references, nodes |
| **Organizational Complexity** | 8/15 | Single developer/maintainer; no cross-team coordination needed |
| **Risk** | 14/20 | Backward compatibility critical; over-suggestion risk; path resolution complexity |
| **TOTAL** | **80/100** | Meets L3+ threshold (80+) |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| ID | Risk | Likelihood | Impact | Score | Mitigation | Owner |
|----|------|------------|--------|-------|------------|-------|
| R-01 | Over-suggestion of phases | Medium | Medium | 6 | Conservative thresholds (score >= 70 AND architectural AND files > 15); user always has decline option | Phase Detection |
| R-02 | Context window overflow with multi-phase docs | Medium | High | 8 | Default to L1/L2 for child phases; sharded parent loading; active-phase-only context | Template Design |
| R-03 | Path resolution failures across commands | Medium | Medium | 6 | Reuse generate-context.js 4-format path resolver; comprehensive test fixtures | Command Integration |
| R-04 | Backward compatibility regression | Low | High | 6 | All phase features behind --phase/--recursive flags; existing behavior unchanged by default | Testing |
| R-05 | Template maintenance burden | Low | Medium | 4 | Phase addendum is small (~30 lines); composed via existing CORE + ADDENDUM pattern | Template Design |
| R-06 | Gate 3 option overload (5 options) | Low | Medium | 4 | Option E contextually shown only when high-complexity existing spec detected | UX Design |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES & ACCEPTANCE SCENARIOS

### US-01: AI Suggests Phased Approach
**As an** AI agent processing a complex task request (e.g., "Build a hybrid RAG search system"),
**I want to** automatically detect that the task exceeds single-spec-folder complexity thresholds,
**So that** I proactively suggest a phased approach before the user starts working, reducing rework.

**Acceptance**: When `recommend-level.sh --json --loc 2000 --files 25 --architectural --api --db` runs, output includes `"recommended_phases": true, "suggested_phase_count": 3`.

### US-02: Developer Creates Phased Spec
**As a** developer starting a large feature,
**I want to** run `/spec_kit:phase` and get a properly structured parent + child phase folders,
**So that** each phase can be planned, implemented, and validated independently.

**Acceptance**: Running the command creates parent with Phase Documentation Map, child 001 with parent back-references, and both pass validate.sh.

### US-03: Validation Across Phases
**As a** developer completing a multi-phase project,
**I want to** run `validate.sh --recursive` on the parent folder,
**So that** all phases and the parent are validated as an integrated unit.

**Acceptance**: Output shows per-phase results, aggregated error/warning counts, and combined exit code.

### US-04: Resume Work on Specific Phase
**As a** developer resuming work after a break,
**I want to** run `/spec_kit:resume specs/136-hybrid-rag/003-memory-quality/`,
**So that** only phase 003's context is loaded without polluting my context with other phases.

**Acceptance**: Resume correctly loads only child phase memory files, not sibling phases.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Phase | Approver | Gate Criteria | Status |
|-------|----------|---------------|--------|
| Specification | Project Owner | All P0/P1 requirements defined and measurable | Pending |
| Plan Review | Project Owner | Technical approach validated against existing patterns | Pending |
| Implementation Phase 1: Detection & Scoring | Self-review | recommend-level.sh tests pass; backward-compatible | Pending |
| Implementation Phase 2: Templates & Creation | Self-review | create.sh --phase creates valid structures | Pending |
| Implementation Phase 3: Commands & Router | Self-review | All commands handle phase paths; SKILL.md router works | Pending |
| Implementation Phase 4: Validation & Docs | Self-review | validate.sh --recursive works; all reference docs updated | Pending |
| Final Acceptance | Project Owner | All P0 items verified with evidence | Pending |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

| Checkpoint | Standard | Verification Method |
|------------|----------|---------------------|
| Template compliance | CORE + ADDENDUM v2.2 | compose.sh --verify passes |
| Script compatibility | Bash 4.0+ | shellcheck + test on target platforms |
| Backward compatibility | Existing specs unaffected | Run validate.sh on 51 test fixtures with --recursive |
| Command pattern compliance | md + 2 YAML assets | File structure matches existing commands |
| Documentation alignment | All references internally consistent | Cross-reference check on all modified docs |
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholder-matrix -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Owner | Decision maker | Feature direction, UX approval | Plan review, final acceptance |
| AI Agents (@speckit, @general) | Primary consumers | Phase-aware behavior in workflows | SKILL.md router, command integration |
| spec_kit commands | Integration surface | Phase path resolution | Command md + YAML updates |
| validate.sh pipeline | Quality gate | Phase-recursive validation | Script flag addition |
| Template system | Content generation | Phase template addendum | CORE + ADDENDUM composition |
<!-- /ANCHOR:stakeholder-matrix -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 0.1 | 2026-02-20 | AI Agent | Initial specification draft |
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:open-questions -->
## 16. OPEN QUESTIONS

| # | Question | Impact | Status |
|---|----------|--------|--------|
| OQ-01 | Should phase child folders default to L1 or inherit parent's level? | Template design | Proposed: Default L1, allow --level override |
| OQ-02 | Should `--phase` mode in create.sh be a separate script or integrated? | Code organization | Proposed: Integrated in create.sh (consistent with --subfolder) |
| OQ-03 | Should Phase Documentation Map be a mandatory section for all L3+ specs or only phased ones? | Template impact | Proposed: Optional section, only injected by --phase mode |
| OQ-04 | Should the sharded template system be leveraged for parent specs to enable selective phase loading? | Token efficiency | Proposed: P2 enhancement, not blocking |
| OQ-05 | How should phase numbering interact with existing sub-folder versioning? | Create.sh logic | Proposed: --phase creates phases, --subfolder creates versions; mutually exclusive flags |
<!-- /ANCHOR:open-questions -->

---

## RELATED DOCUMENTS

- [Plan](./plan.md)
- [Tasks](./tasks.md)
- [Checklist](./checklist.md)
- [Decision Record](./decision-record.md)
- [Sub-Folder Versioning Reference](../../skill/system-spec-kit/references/structure/sub_folder_versioning.md)
- [Level Specifications Reference](../../skill/system-spec-kit/references/templates/level_specifications.md)
- [136 Spec (7-phase example)](../136-mcp-working-memory-hybrid-rag/)
- [138 Spec (3-workstream example)](../138-hybrid-rag-fusion/)
