<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: README Anchor Schema & Memory System Integration

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

## EXECUTIVE SUMMARY

The Spec Kit Memory system currently excludes ~68 README files from indexing, making architectural documentation, API references, and troubleshooting guides invisible to AI agents. This specification defines a README-appropriate anchor schema and extends the memory indexing pipeline to discover, validate, and index README files while maintaining backward compatibility with existing session-based memory searches.

**Key Decisions**: Simple anchor IDs (no session qualifiers), `semantic` memory type with `important` tier, new `contentSource` field for filtered retrieval

**Critical Dependencies**: Memory indexing pipeline (memory-parser.ts, memory-index.ts), README template (readme_template.md)

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-12 |
| **Branch** | `111-readme-anchor-schema` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
Currently, ~68 README files across `.opencode/skill/` directories have NO anchor tags, NO indexing metadata, and are completely invisible to the Spec Kit Memory system. The memory system only indexes files in `specs/**/memory/` and `.opencode/skill/*/constitutional/` — READMEs are explicitly excluded (the code literally has `if (file.name.toLowerCase() === 'readme.md') continue;`). This means valuable architectural documentation, API references, usage guides, and troubleshooting information in these READMEs cannot be searched, retrieved, or utilized by AI agents through the memory system.

### Purpose
Enable AI agents to discover and retrieve README content through the memory system while maintaining clean separation from session-based memory files.

---

## 3. SCOPE

### In Scope
- Design and implement README-appropriate anchor schema (simpler than session-based memory anchors)
- Modify memory indexing pipeline to discover, validate, and index README files
- Update README template with anchor standards and indexing metadata
- Update system-spec-kit documentation to document README indexing
- Add anchors to all 68 existing project-authored README files
- Create missing root-level READMEs for 6 skills without one

### Out of Scope
- Automatic anchor generation (manual anchor placement required) - AI can assist but not fully automated
- Migration of existing memory files - only READMEs are affected
- Changes to memory search ranking algorithms - existing scoring remains

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/memory/memory-parser.ts` | Modify | Add `findSkillReadmes()`, update `extractSpecFolder()` |
| `.opencode/skill/system-spec-kit/mcp_server/lib/memory/memory-index.ts` | Modify | Add `includeReadmes` flag, integrate README discovery |
| `.opencode/skill/system-spec-kit/mcp_server/lib/memory/memory-types.ts` | Modify | Add `contentSource` field to schema |
| `.opencode/skill/system-spec-kit/mcp_server/lib/search/memory-search.ts` | Modify | Add `contentSource` filter parameter |
| `.opencode/skill/workflows-documentation/assets/readme_template.md` | Modify | Add anchor placement guide, YAML frontmatter schema |
| `.opencode/skill/*/README.md` | Modify | Add anchors to 68 existing files |
| `.opencode/skill/*/README.md` | Create | Create 6 missing root READMEs |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README anchors use simple format: `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` | No session IDs or spec folder qualifiers in anchor tags |
| REQ-002 | Standard anchor names map to README sections | Defined set: overview, quick-start, structure, features, configuration, examples, troubleshooting, faq, related |
| REQ-003 | Memory system discovers READMEs via new `findSkillReadmes()` function | Function returns all README.md files in `.opencode/skill/` directories |
| REQ-004 | READMEs indexed as `semantic` memory type with `important` tier | Database records show memoryType='semantic', importanceTier='important' |
| REQ-005 | New `contentSource` field prevents README noise in session searches | Schema includes contentSource enum: 'memory' \| 'constitutional' \| 'readme' |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | `extractSpecFolder()` returns `skill:SKILL-NAME` for README paths | Spec folder extraction handles `.opencode/skill/skill-name/README.md` → `skill:skill-name` |
| REQ-007 | readme_template.md updated with anchor placement guide | Template includes anchor syntax, standard names, YAML frontmatter schema |
| REQ-008 | Backward compatibility maintained | Existing memory search tests pass without modification |
| REQ-009 | All 68 READMEs receive appropriate anchors | Manual or AI-assisted anchor addition to existing files |
| REQ-010 | 6 missing skill root READMEs created | New README.md files created using updated template |

---

## 5. SUCCESS CRITERIA

- **SC-001**: `memory_index_scan()` discovers and indexes all 68+ README files
- **SC-002**: `memory_search({ query: "cognitive memory" })` returns relevant README results
- **SC-003**: `memory_search({ query: "session state", contentSource: "memory" })` excludes READMEs
- **SC-004**: All README anchors pass `check-anchors.sh` validation
- **SC-005**: No regression in existing memory system tests
- **SC-006**: readme_template.md passes `validate_document.py` after updates

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Memory indexing pipeline | Changes affect all memory operations | Comprehensive test coverage, feature flag for README indexing |
| Risk | Search result pollution | READMEs dilute session-specific searches | `contentSource` filter provides clean separation |
| Risk | Manual anchor placement errors | Invalid anchors break extraction | `check-anchors.sh` validation before indexing |
| Dependency | README template accuracy | Template errors propagate to all new READMEs | Validate template with `validate_document.py` before rollout |

---

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: README indexing adds <2s to full scan time (68 files)
- **NFR-P02**: Search with `contentSource` filter performs within 10% of unfiltered search

### Security
- **NFR-S01**: No sensitive information exposed through README indexing

### Reliability
- **NFR-R01**: Invalid README anchors logged but do not break indexing pipeline
- **NFR-R02**: `includeReadmes` flag allows disabling README indexing if issues arise

---

## 8. EDGE CASES

### Data Boundaries
- Empty README files: Indexed with no content sections (valid but low utility)
- READMEs without anchors: Indexed as single content block (search entire file)
- Maximum README size: No hard limit, but large files (>50KB) may slow extraction

### Error Scenarios
- Invalid anchor syntax: Logged as warning, anchor skipped, file still indexed
- Duplicate anchor names within one README: First occurrence used, duplicates logged
- README in unexpected location: Only `.opencode/skill/*/README.md` paths indexed

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: 70+, LOC: ~2500, Systems: 4 (parser, indexer, search, templates) |
| Risk | 15/25 | Breaking change potential (memory pipeline), No auth/API, Manual migration |
| Research | 12/20 | Anchor schema design, contentSource architecture, template standards |
| Multi-Agent | 8/15 | Workstreams: 2 (code changes, README updates) |
| Coordination | 10/15 | Dependencies: memory system, template system, validation scripts |
| **Total** | **63/100** | **Level 3** (bumped to 3+ for governance/documentation rigor) |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Search result pollution from READMEs | M | M | `contentSource` filter, `important` tier (not constitutional) |
| R-002 | Breaking changes to memory pipeline | H | L | Feature flag, comprehensive testing, backward compatibility |
| R-003 | Manual anchor placement errors | L | H | Validation script, template guidance, AI-assisted review |
| R-004 | Performance degradation from 68 new files | L | L | Benchmark tests, lazy loading, incremental indexing |

---

## 11. USER STORIES

### US-001: Search README Content (Priority: P0)

**As an** AI agent, **I want** to search memory for "how does the search system work?", **so that** I get relevant README content from `mcp_server/lib/search/README.md`.

**Acceptance Criteria**:
1. Given a query about documented features, When I call `memory_search()`, Then README results appear in ranked results
2. Given README content indexed, When I search for specific terms, Then anchor-based sections are extractable

### US-002: Anchor-Specific Retrieval (Priority: P0)

**As an** AI agent, **I want** to request specific anchors (e.g., `anchors: ['troubleshooting']`), **so that** I get only troubleshooting sections from indexed READMEs.

**Acceptance Criteria**:
1. Given anchors parameter provided, When I call `memory_search({ anchors: ['troubleshooting'] })`, Then only troubleshooting sections returned
2. Given multiple anchor types, When I filter by anchor name, Then correct sections retrieved

### US-003: Filter Session Context (Priority: P1)

**As an** AI agent, **I want** to filter memory search results to exclude README content, **so that** I only get session context when needed.

**Acceptance Criteria**:
1. Given `contentSource: 'memory'` parameter, When I search, Then README results excluded
2. Given default search (no filter), When I search, Then all content types included

### US-004: Create New READMEs (Priority: P1)

**As a** documentation maintainer, **I want** to use the updated `readme_template.md`, **so that** I can create new READMEs with proper anchors.

**Acceptance Criteria**:
1. Given updated template, When I copy it, Then anchor syntax and placement clear
2. Given YAML frontmatter schema, When I fill metadata, Then validation passes

### US-005: Discover READMEs (Priority: P0)

**As the** memory system, **I want** to discover and index README files, **so that** they are available for search alongside constitutional and memory files.

**Acceptance Criteria**:
1. Given `includeReadmes: true`, When I run `memory_index_scan()`, Then all README files discovered
2. Given README files indexed, When I check database, Then contentSource='readme' set correctly

---

## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Spec Review | @speckit | Pending | 2026-02-12 |
| Design Review | Lead Developer | Pending | - |
| Implementation Review | QA Engineer | Pending | - |
| Launch Approval | Project Owner | Pending | - |

---

## 13. COMPLIANCE CHECKPOINTS

### Security Compliance
- [x] Security review completed (no sensitive data in READMEs)
- [x] OWASP Top 10 addressed (N/A - read-only indexing)
- [x] Data protection requirements met (public documentation only)

### Code Compliance
- [ ] Coding standards followed (pending implementation)
- [ ] License compliance verified (all files MIT licensed)

---

## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| AI Agents | Consumer | High | Via memory_search() API |
| Documentation Team | Maintainer | High | Template updates, anchor standards |
| Memory System | Owner | High | Pipeline changes, indexing logic |

---

## 15. CHANGE LOG

### v1.0 (2026-02-12)
**Initial specification**
- Defined README anchor schema
- Outlined memory system integration approach
- Identified 68 existing READMEs + 6 missing
- Established requirements and success criteria

---

## 16. OPEN QUESTIONS

- Should READMEs have a separate importance tier (e.g., `reference`) or use existing `important`?
  - **Decision**: Use `important` tier for simplicity (DR-002)
- Should anchor validation be blocking or warning-only during indexing?
  - **Proposed**: Warning-only to avoid breaking indexing pipeline
- What is the maximum acceptable README size before performance issues?
  - **Proposed**: No hard limit, monitor 95th percentile during testing

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3+ SPEC
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
