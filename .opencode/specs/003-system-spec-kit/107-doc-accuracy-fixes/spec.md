# Feature Specification: Documentation Accuracy Fixes — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-02-11 |
| **Branch** | `107-doc-accuracy-fixes` |

---

## 2. PROBLEM & PURPOSE

### Problem Statement
The spec 106 audit identified ~120 critical documentation inaccuracies across 176 files in the system-spec-kit codebase. These include stale `.js` references that should be `.ts` after the TypeScript migration, phantom file/module references, incorrect counts/metrics, broken paths, and lingering mcp-narsil ghost references. This makes onboarding unreliable and causes AI agents to hallucinate outdated paths.

### Purpose
Eliminate all critical documentation inaccuracies so that every README, SKILL.md, agent definition, command file, and install guide accurately reflects the post-migration TypeScript codebase.

---

## 3. SCOPE

### In Scope
- Fix stale `.js` to `.ts` references across all documentation
- Remove phantom file/module references that no longer exist
- Update counts, metrics, and statistics in READMEs
- Correct broken file paths
- Remove mcp-narsil ghost references
- Update SKILL.md, agent definitions, command files, and install guides

### Out of Scope
- Code changes — documentation fixes only
- New feature documentation — only correcting existing content
- Template content changes — templates are not in scope

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| MCP Server `lib/` READMEs | Modify | Fix 37 critical issues (Wave 1) |
| MCP Server top-level + remaining READMEs | Modify | Fix 36 critical issues (Wave 2) |
| Scripts READMEs | Modify | Fix 26 critical issues (Wave 3) |
| Env vars, shared/embeddings, templates, core docs | Modify | Fix 25 critical issues (Wave 4) |
| Install guides, other skills, mcp-narsil cleanup | Modify | Fix 8+ critical issues (Wave 5) |

---

## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All `.js` references updated to `.ts` where applicable | `grep -r "\.js" docs/` returns zero false positives |
| REQ-002 | All phantom file/module references removed | Every referenced file exists on disk |
| REQ-003 | All broken paths corrected | Every documented path resolves to a real file |
| REQ-004 | All mcp-narsil ghost references removed | `grep -ri "narsil"` returns zero hits in docs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Counts and metrics updated to reflect actual codebase | Documented counts match reality |
| REQ-006 | SKILL.md accurately describes current module structure | Cross-reference with file system confirms accuracy |

---

## 5. SUCCESS CRITERIA

- **SC-001**: Zero critical documentation inaccuracies remaining across all 176 files audited in spec 106
- **SC-002**: All five fix waves completed and verified

---

## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Spec 106 audit results | Need issue list to fix | Audit already completed |
| Risk | Accidental code changes during doc fixes | Med | Scope locked to `.md` files only |
| Risk | Missing issues not caught in audit | Low | Final verification sweep after all waves |

---

## 7. OPEN QUESTIONS

- None — spec 106 audit provides the complete issue inventory.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|----------|---------|
| [`plan.md`](./plan.md) | Implementation approach and phases |
| [`tasks.md`](./tasks.md) | Detailed task breakdown |
| [`implementation-summary.md`](./implementation-summary.md) | Post-implementation record |
| `specs/003-memory-and-spec-kit/106-*/` | Source audit with issue inventory |
