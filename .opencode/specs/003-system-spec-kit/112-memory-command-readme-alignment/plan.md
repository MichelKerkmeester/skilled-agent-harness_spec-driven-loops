<!-- SPECKIT_LEVEL: 2 -->
# Implementation Plan: Memory Command README Alignment

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Type** | Documentation alignment |
| **Files** | 10 command/YAML files |
| **Estimated LOC** | ~200 lines of documentation changes |
| **Parent Spec** | 003-system-spec-kit/111-readme-anchor-schema |

### Overview

Align memory-related command documentation (`.md`) and YAML workflow assets with the README indexing features implemented in spec 111. This is a documentation-only change — no code modifications. The work covers 8 specific features that need to be reflected across 10 files, prioritized by user impact.

---

## 2. QUALITY GATES

### Definition of Ready

- [x] Analysis complete: 8 features identified, 10 files mapped with priorities
- [x] Parent spec 111 implementation-summary.md available as source of truth
- [x] All target files exist and have been identified with specific gaps

### Definition of Done

- [ ] All P0 requirements met (REQ-001 through REQ-003): `manage.md` fully updated
- [ ] All P1 requirements met (REQ-004 through REQ-006): `save.md` fully updated
- [ ] All P2 requirements met (REQ-007 through REQ-010): `CONTEXT.md` + YAMLs updated
- [ ] All P3 requirements met (REQ-011 through REQ-012): create YAMLs updated
- [ ] Cross-reference consistency verified across all modified files
- [ ] No YAML syntax errors in modified YAML files
- [ ] Weight values consistent: 0.5 (user), 0.4 (project), 0.3 (skill) in all documents

---

## 3. APPROACH

### Strategy

Each file is read first to understand its current structure, then specific sections are added or modified to incorporate the missing documentation. All content is sourced from spec 111's `implementation-summary.md` and the actual MCP server code.

### Key Content to Propagate

| Feature | Source Reference | Target Documents |
|---------|-----------------|------------------|
| `includeReadmes` parameter | `tool-schemas.ts`, `memory-index.ts` | manage.md, save.md |
| 4-source indexing pipeline | `handleMemoryIndexScan()` in memory-index.ts | manage.md, save.md |
| `findProjectReadmes()` / `findSkillReadmes()` | memory-index.ts L139-208 | manage.md, save.md |
| `README_EXCLUDE_PATTERNS` | memory-parser.ts | manage.md |
| Tiered importance weights (0.3/0.4/0.5) | `calculateReadmeWeight()` in memory-save.ts | manage.md, save.md, CONTEXT.md |
| YAML frontmatter extraction | memory-parser.ts | save.md |
| Title-based trigger generation | memory-parser.ts | save.md |
| Anchor prefix matching | search-results.ts | save.md, CONTEXT.md, implement YAMLs |

---

## 4. IMPLEMENTATION PHASES

### Phase 1: P0 — manage.md (Critical)

**Priority**: P0 CRITICAL — Most impactful file, primary command reference for memory management.

- [ ] Read `manage.md` to understand current structure and parameter documentation format
- [ ] Add `includeReadmes` parameter to the parameter/options section (REQ-001)
- [ ] Add README scan workflow documentation describing 4-source pipeline (REQ-002)
- [ ] Add tiered importance weight table with scoring formula (REQ-003)

**Verification**: Re-read modified file, confirm all 3 REQs addressed, weight values match spec 111.

### Phase 2: P1 — save.md (Important)

**Priority**: P1 IMPORTANT — Second most-used command reference for memory operations.

- [ ] Read `save.md` to understand current structure
- [ ] Add `includeReadmes` to parameter table, consistent with manage.md format (REQ-004)
- [ ] Add 4-source indexing pipeline description (REQ-005)
- [ ] Add anchor prefix matching documentation in anchor section (REQ-006)

**Verification**: Re-read modified file, confirm consistency with manage.md, anchor docs accurate.

### Phase 3: P2 — CONTEXT.md + Implement YAMLs (Moderate)

**Priority**: P2 MODERATE — Context file and workflow YAMLs used during implementation workflows.

- [ ] Read `CONTEXT.md`, add README context mention and prefix matching docs (REQ-007, REQ-008)
- [ ] Read `spec_kit_implement_auto.yaml`, add prefix matching note to anchor pattern (REQ-009)
- [ ] Read `spec_kit_implement_confirm.yaml`, add prefix matching note to anchor pattern (REQ-010)

**Verification**: YAML files parse correctly, CONTEXT.md content is concise and accurate.

### Phase 4: P3 — Create YAMLs (Low Priority)

**Priority**: P3 LOW — Create workflow YAMLs that could benefit from awareness of README auto-indexing.

- [ ] Read `create_folder_readme.yaml`, add auto-indexing weight note (REQ-011)
- [ ] Read remaining create YAMLs, add prefix matching mentions where anchor patterns exist (REQ-012)

**Verification**: All YAMLs parse correctly, notes are brief and non-intrusive.

### Phase 5: Verification & Memory Save

- [ ] Re-read all 10 modified files for cross-reference consistency
- [ ] Verify weight values (0.3/0.4/0.5) are consistent across all documents
- [ ] Verify no contradictions with spec 111 implementation-summary.md
- [ ] Generate memory context for spec 112

---

## 5. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 111 implementation-summary.md | Reference | Available | Cannot verify feature accuracy |
| Target command files | Files to modify | Exist | Cannot proceed with phase |
| Spec 111 MCP server code | Reference | Available | Cannot verify parameter details |

---

## 6. ROLLBACK PLAN

- **Trigger**: Incorrect documentation creates user confusion or contradicts implementation
- **Procedure**: Revert individual file changes via git; documentation-only changes have no runtime impact
- **Risk Level**: Low — all changes are documentation, no code execution affected

---

## L2: PHASE DEPENDENCIES

```
Phase 1 (manage.md P0) ──► Phase 2 (save.md P1) ──► Phase 3 (CONTEXT.md + YAMLs P2)
                                                          │
                                                          ▼
                                                     Phase 4 (Create YAMLs P3)
                                                          │
                                                          ▼
                                                     Phase 5 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1 | None | Phase 2 (format reference) |
| Phase 2 | Phase 1 (consistency reference) | Phase 3 |
| Phase 3 | Phase 2 | Phase 4 |
| Phase 4 | Phase 3 | Phase 5 |
| Phase 5 | All phases | None |

**Note**: Phases are sequential because each subsequent phase references the format and content established in earlier phases for consistency.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: manage.md (P0) | Medium | 1-2 hours |
| Phase 2: save.md (P1) | Medium | 1-2 hours |
| Phase 3: CONTEXT.md + YAMLs (P2) | Low | 1 hour |
| Phase 4: Create YAMLs (P3) | Low | 0.5-1 hour |
| Phase 5: Verification | Low | 0.5 hour |
| **Total** | | **4-6.5 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [ ] All target files backed up (git tracked)
- [ ] YAML syntax validated after each edit
- [ ] Cross-reference check completed

### Rollback Procedure

1. **Identify**: Which file(s) have incorrect documentation
2. **Revert**: `git checkout -- <file>` for individual files
3. **Verify**: Confirm reverted file matches pre-change state
4. **No runtime impact**: Documentation-only changes cannot break functionality

---

<!--
LEVEL 2 PLAN
- Core + L2 addendum
- Phase dependencies, effort estimation, enhanced rollback
- 5 phases covering P0 through P3 + verification
-->
