# Implementation Plan: README Anchor Schema & Memory System Integration

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript 5.x |
| **Framework** | Node.js 20.x, MCP (Model Context Protocol) |
| **Storage** | SQLite (better-sqlite3) |
| **Testing** | Jest, manual anchor validation |

### Overview
Extend the Spec Kit Memory indexing pipeline to discover, validate, and index ~68 README files currently excluded from the system. Implement a simplified anchor schema for READMEs (no session qualifiers), add `contentSource` field for filtered retrieval, and update templates/documentation to standardize README indexing across the project.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (SC-001 through SC-006 defined)
- [x] Dependencies identified (memory-parser, memory-index, README template)

### Definition of Done
- [ ] All acceptance criteria met (REQ-001 through REQ-010)
- [ ] Tests passing (backward compatibility + new README tests)
- [ ] Docs updated (readme_template.md, SKILL.md, plan.md, tasks.md)

---

## 3. ARCHITECTURE

### Pattern
**Layered Architecture** with Plugin Extension

```
MCP Server
  ├── Search Layer (memory-search.ts)
  ├── Indexing Layer (memory-index.ts)
  │   ├── findMemoryFiles()          → specs/**/memory/*.md
  │   ├── findConstitutionalFiles()  → .opencode/skill/*/constitutional/*.md
  │   └── findSkillReadmes() [NEW]   → .opencode/skill/**/README.md
  ├── Parsing Layer (memory-parser.ts)
  │   ├── parseMemoryFile()          → anchor extraction
  │   ├── extractSpecFolder()        → spec folder or skill:name
  │   └── isMemoryFile() [MODIFIED]  → include README detection
  └── Storage Layer (better-sqlite3)
      └── memories table [EXTENDED]  → contentSource column added
```

### Key Components
- **findSkillReadmes()**: Discovery function to locate all README.md files in `.opencode/skill/` directories (new)
- **extractSpecFolder()**: Extended to handle README paths, returns `skill:SKILL-NAME` format (modified)
- **isMemoryFile()**: Add `isSpecReadme` condition to detect README files (modified)
- **contentSource field**: Database column to distinguish memory/constitutional/readme content (new)

### Data Flow
1. User invokes `memory_index_scan({ includeReadmes: true })`
2. Discovery: `findSkillReadmes()` returns array of README paths
3. Validation: Each README path validated by `isMemoryFile()` (now returns true for READMEs)
4. Extraction: `extractSpecFolder()` converts path to `skill:SKILL-NAME`
5. Parsing: `parseMemoryFile()` extracts anchors, metadata, content
6. Embedding: `generateEmbedding()` creates vector (existing flow)
7. Storage: Record saved with `contentSource='readme'`, `memoryType='semantic'`, `importanceTier='important'`
8. Retrieval: `memory_search()` can filter by `contentSource` parameter

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Core Pipeline Changes (~81 LOC)
- [ ] Modify `isMemoryFile()` to add README detection condition
- [ ] Extend `extractSpecFolder()` with README path handling
- [ ] Create `findSkillReadmes()` function in memory-index.ts
- [ ] Add `includeReadmes` flag to `handleMemoryIndexScan()`
- [ ] Add `contentSource` column to database schema (migration)
- [ ] Add README pattern to `PATH_TYPE_PATTERNS` in memory-types.ts
- [ ] Update `memory_save` handler to accept README paths

### Phase 2: Template & Standards Updates (~160 LOC)
- [ ] Update readme_template.md with anchor placement guide
- [ ] Add YAML frontmatter schema for READMEs (trigger_phrases, importance_tier, keywords)
- [ ] Add anchor section templates to README template
- [ ] Update system-spec-kit SKILL.md to document README indexing capability
- [ ] Create/update reference docs in system-spec-kit/references/
- [ ] Update mcp_server/README.md with new capabilities

### Phase 3: README Migration (~2000+ LOC across 68 files)
- [ ] Add anchors to 22 mcp_server READMEs (lib/memory, lib/search, lib/validation, etc.)
- [ ] Add anchors to 16 scripts READMEs (dist/, memory/, spec/, templates/, etc.)
- [ ] Add anchors to 4 shared READMEs (lib/validation, lib/anchors, etc.)
- [ ] Add anchors to 10 template READMEs (level_1-3+, core, addendum)
- [ ] Add anchors to 3 skill root READMEs (existing: mcp-figma, mcp-code-mode, system-spec-kit)
- [ ] Add anchors to remaining READMEs (config, constitutional, examples)
- [ ] Create 6 missing skill root READMEs with anchors (workflows-documentation, workflows-git, workflows-code--full-stack, workflows-code--web-dev, workflows-code--opencode, workflows-chrome-devtools)
- [ ] Skip 2 .pytest_cache READMEs (auto-generated, excluded from indexing)

### Phase 4: Testing & Validation (~120 LOC)
- [ ] Unit tests for `isMemoryFile()` with README paths
- [ ] Unit tests for `extractSpecFolder()` with skill paths
- [ ] Integration test for `findSkillReadmes()` discovery
- [ ] Integration test for `contentSource` filtering in search
- [ ] Anchor validation across all migrated READMEs using `check-anchors.sh`
- [ ] Backward compatibility test suite (existing memory tests)
- [ ] Performance benchmark (index scan with READMEs vs. without)

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `isMemoryFile()`, `extractSpecFolder()`, `findSkillReadmes()` | Jest |
| Integration | Full index scan with READMEs, `contentSource` filtering | Jest + SQLite in-memory DB |
| Validation | Anchor syntax, duplicate detection | `check-anchors.sh` script |
| Performance | Index scan time with 68 READMEs | Jest benchmark suite |
| Manual | Search results quality, README content retrieval | Manual `memory_search()` calls |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Memory indexing pipeline | Internal | Green | Cannot implement README indexing |
| README template (readme_template.md) | Internal | Green | Cannot standardize anchor format |
| Anchor validation script (check-anchors.sh) | Internal | Green | Manual validation required |
| Database schema migration | Internal | Yellow | Must ensure backward compatibility |

---

## 7. ROLLBACK PLAN

- **Trigger**: Breaking changes to memory search, performance degradation >20%, data corruption
- **Procedure**: 
  1. Disable README indexing via `includeReadmes: false` flag (immediate mitigation)
  2. Revert database schema if `contentSource` column causes issues (git revert migration)
  3. Revert code changes to memory-parser.ts, memory-index.ts (git revert commits)
  4. Re-index existing memory files to ensure system stability

---


---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Core Pipeline) ──────┐
                              ├──► Phase 3 (README Migration) ──► Phase 4 (Testing)
Phase 2 (Templates) ──────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 3, Phase 4 |
| Phase 2 | None | Phase 3 |
| Phase 3 | Phase 1, Phase 2 | Phase 4 |
| Phase 4 | Phase 1, Phase 3 | None |

**Note**: Phase 2 can run in parallel with Phase 1, but both must complete before Phase 3.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Core Pipeline Changes | High | 6-8 hours |
| Phase 2: Template & Standards | Medium | 4-6 hours |
| Phase 3: README Migration | Medium (repetitive) | 8-12 hours |
| Phase 4: Testing & Validation | High | 6-8 hours |
| **Total** | | **24-34 hours** |

**LOC Estimate**: ~2361 LOC total (81 pipeline + 160 templates + 2000 READMEs + 120 tests)

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (SQLite DB snapshot before schema migration)
- [ ] Feature flag configured (`includeReadmes: false` default)
- [ ] Monitoring alerts set (index scan duration, search latency)

### Rollback Procedure
1. **Immediate action**: Set `includeReadmes: false` in memory-index.ts
2. **Revert code**: `git revert <commit-range>` for memory-parser, memory-index changes
3. **Database rollback**: Drop `contentSource` column if migration applied
4. **Verify rollback**: Run existing test suite, confirm all pass
5. **Notify stakeholders**: Update documentation team if README indexing disabled

### Data Reversal
- **Has data migrations?** Yes (adds `contentSource` column)
- **Reversal procedure**: 
  1. `ALTER TABLE memories DROP COLUMN contentSource;` (SQLite 3.35.0+ required)
  2. Re-index existing memories to rebuild index without READMEs
  3. Verify no orphaned records remain

---


---

## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   Phase 1        │────►│   Phase 3        │────►│   Phase 4        │
│   Core Pipeline  │     │   README Migrate │     │   Testing        │
└──────────────────┘     └──────────────────┘     └──────────────────┘
         │                        ▲
         │                        │
         ▼                        │
┌──────────────────┐              │
│   Phase 2        │──────────────┘
│   Templates      │
└──────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase 1: Core Pipeline | None | README indexing logic, `contentSource` field | Phase 3, Phase 4 |
| Phase 2: Templates | None | Anchor standards, YAML schema | Phase 3 |
| Phase 3: README Migration | Phase 1, Phase 2 | 68 anchored READMEs, 6 new READMEs | Phase 4 |
| Phase 4: Testing | Phase 1, Phase 3 | Test coverage, validation results | None |

---

## L3: CRITICAL PATH

1. **Phase 1: Core Pipeline** - 6-8 hours - CRITICAL
2. **Phase 2: Templates** - 4-6 hours - PARALLEL (can overlap with Phase 1)
3. **Phase 3: README Migration** - 8-12 hours - CRITICAL
4. **Phase 4: Testing** - 6-8 hours - CRITICAL

**Total Critical Path**: 20-28 hours (assumes Phase 2 runs parallel)

**Parallel Opportunities**:
- Phase 1 (Core Pipeline) and Phase 2 (Templates) can run simultaneously
- Phase 3 README migration can be batched by directory (mcp_server, scripts, shared, templates, skills)
- Phase 4 unit tests can begin as soon as Phase 1 completes (before full README migration)

---

## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Core Pipeline Complete | `findSkillReadmes()` working, `contentSource` in DB | End of Phase 1 |
| M2 | Templates Standardized | readme_template.md updated, anchor guide published | End of Phase 2 |
| M3 | READMEs Migrated | All 68 READMEs anchored, 6 new READMEs created | End of Phase 3 |
| M4 | Release Ready | All tests pass, performance benchmarks met | End of Phase 4 |

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Simplified Anchor Schema for READMEs

**Status**: Accepted

**Context**: READMEs are reference documentation (not session context). Session-based anchors include session IDs and spec folder qualifiers (e.g., `<!-- ANCHOR[session123]:decision -->`), which are unnecessary for static documentation.

**Decision**: Use simple anchor format `<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->` without session qualifiers. Standard anchor names: `overview`, `quick-start`, `structure`, `features`, `configuration`, `examples`, `troubleshooting`, `faq`, `related`.

**Consequences**:
- **Positive**: Simpler syntax for documentation maintainers, easier to validate, cleaner content retrieval
- **Positive**: Clear separation between session-based memory and reference documentation
- **Negative**: Two anchor formats to maintain (session-based vs. simple)
- **Mitigation**: Documentation clearly separates use cases, validation scripts support both formats

**Alternatives Rejected**:
- **Option A (Full session anchors)**: Rejected due to unnecessary complexity for static content
- **Option B (No anchors, full-file indexing)**: Rejected due to lack of granular retrieval

---

### ADR-002: `contentSource` Field for Filtered Retrieval

**Status**: Accepted

**Context**: Mixing README content with session-based memory could pollute search results. AI agents need ability to filter by content type (e.g., "only session context" vs. "include READMEs").

**Decision**: Add `contentSource` enum field to database schema with values: `'memory'` (session files), `'constitutional'` (skill constitutional files), `'readme'` (README files). `memory_search()` accepts optional `contentSource` filter parameter.

**Consequences**:
- **Positive**: Clean separation enables filtered searches, prevents README noise in session-focused queries
- **Positive**: Enables content-type-specific ranking/scoring in future
- **Negative**: Database schema migration required (backward compatibility concern)
- **Mitigation**: Migration tested on snapshot, rollback procedure documented

**Alternatives Rejected**:
- **Option A (No filter, rely on ranking)**: Rejected due to unpredictable search result quality
- **Option B (Separate database table)**: Rejected due to unnecessary complexity, single table with filter sufficient

---

### ADR-003: `important` Tier for READMEs (Not `constitutional`)

**Status**: Accepted

**Context**: READMEs provide reference documentation, not foundational system rules. `constitutional` tier is reserved for system-critical memories that always surface first.

**Decision**: Index READMEs as `importanceTier='important'` (not `constitutional`). This places them above `normal` tier but below `constitutional`.

**Consequences**:
- **Positive**: READMEs rank highly in searches without dominating results
- **Positive**: Constitutional tier remains reserved for truly critical system context
- **Negative**: If README content is critical, it may rank below constitutional memories
- **Mitigation**: Users can explicitly search with `contentSource='readme'` to prioritize README results

**Alternatives Rejected**:
- **Option A (constitutional tier)**: Rejected due to semantic mismatch, READMEs are not system-critical
- **Option B (normal tier)**: Rejected due to insufficient visibility in search results

---


---

## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation
**Files**: spec.md (sections 1-9), decision-record.md (ADRs)
**Duration**: ~90s
**Agent**: Primary (@speckit)
**Dependencies**: None

### Tier 2: Parallel Execution
| Agent | Focus | Files | Dependencies |
|-------|-------|-------|--------------|
| Plan Agent | plan.md | Technical approach, architecture | spec.md complete |
| Task Agent | tasks.md | Task breakdown, estimates | spec.md, plan.md outline |
| Checklist Agent | checklist.md | Verification items | spec.md requirements |

**Duration**: ~120s (parallel)
**Dependencies**: Tier 1 complete

### Tier 3: Integration
**Agent**: Primary (@speckit)
**Task**: Merge outputs, resolve conflicts, finalize cross-references
**Duration**: ~60s
**Dependencies**: Tier 2 complete

**Total Estimated Time**: ~270s (4.5 minutes) for full spec folder creation

---

## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-CODE | Core Pipeline Changes | Primary | memory-parser.ts, memory-index.ts, memory-types.ts | Active |
| W-DOCS | Template & Standards | Documentation | readme_template.md, SKILL.md, references/ | Active |
| W-MIGRATE | README Migration | AI-Assisted Batch | All 68 README files | Blocked on W-CODE, W-DOCS |
| W-TEST | Testing & Validation | QA | test/*.test.ts, validation scripts | Blocked on W-CODE |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-CODE Phase 1 complete | W-MIGRATE, W-TEST | Begin README migration, start unit tests |
| SYNC-002 | W-DOCS Phase 2 complete | W-MIGRATE | Finalize anchor format, apply to READMEs |
| SYNC-003 | W-MIGRATE Phase 3 complete | W-TEST | Run full validation suite |
| SYNC-004 | All workstreams complete | All agents | Final integration test, sign-off |

### File Ownership Rules
- Each file owned by ONE workstream (no concurrent edits)
- Cross-workstream changes require SYNC point discussion
- Conflicts resolved via spec.md requirements (single source of truth)

---

## L3+: COMMUNICATION PLAN

### Checkpoints
- **Daily**: Update tasks.md with progress (mark `[x]` completed tasks)
- **Per Phase**: Review milestone completion in plan.md
- **Blockers**: Immediate escalation via tasks.md `[B]` notation

### Escalation Path
1. **Technical blockers** (e.g., schema migration fails) → Engineering Lead
2. **Scope changes** (e.g., additional READMEs discovered) → Update spec.md, notify stakeholders
3. **Resource issues** (e.g., AI-assisted migration too slow) → Adjust tasks.md estimates

### Documentation Updates
- `spec.md` CHANGE LOG section updated per version
- `plan.md` updated if architecture changes
- `tasks.md` updated daily with progress
- `implementation-summary.md` created after completion

---

<!--
LEVEL 3+ PLAN (~420 lines)
- Core + L2 + L3 + L3+ addendums
- AI execution framework, workstream coordination
- Full communication plan
- 3 ADRs, dependency graph, critical path analysis
-->
