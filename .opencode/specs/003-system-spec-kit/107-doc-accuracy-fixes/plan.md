# Implementation Plan: Documentation Accuracy Fixes — system-spec-kit

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | system-spec-kit |
| **Storage** | None |

**Overview**: Fix ~120 critical documentation inaccuracies identified by the spec 106 audit. Work is organized into 5 waves of parallel fix agents, prioritized by issue density. All changes are documentation-only — no code modifications.

---

## 2. QUALITY GATES

**Ready When:**
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Spec 106 audit results available as issue inventory

**Done When:**
- [ ] All acceptance criteria met (zero critical inaccuracies)
- [ ] Final verification sweep confirms no remaining issues

---

## 3. IMPLEMENTATION PHASES

### Wave 1: MCP Server lib/ READMEs (37 critical)
- [ ] Fix all `.js` to `.ts` references in lib/ READMEs
- [ ] Remove phantom module references
- [ ] Update file counts and module descriptions

### Wave 2: MCP Server top-level + remaining READMEs (36 critical)
- [ ] Fix top-level MCP Server README inaccuracies
- [ ] Update remaining README files with correct paths
- [ ] Remove stale references

### Wave 3: Scripts READMEs (26 critical)
- [ ] Fix scripts documentation to reflect TypeScript sources
- [ ] Update script counts and descriptions
- [ ] Correct broken script paths

### Wave 4: Env vars, shared/embeddings, templates, core docs (25 critical)
- [ ] Update environment variable documentation
- [ ] Fix shared/embeddings module references
- [ ] Correct template documentation
- [ ] Update core SKILL.md and agent definitions

### Wave 5: Install guides, other skills, mcp-narsil cleanup (8+ critical)
- [ ] Update install guides with correct paths
- [ ] Fix other skill references
- [ ] Remove all mcp-narsil ghost references
- [ ] Final verification sweep

---

## 4. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| Spec 106 audit results | Green | Cannot identify issues to fix |

---

## 5. ROLLBACK

- **Trigger**: Accidental code changes detected or documentation regressions
- **Procedure**: `git checkout` affected files; all changes are to tracked `.md` files
