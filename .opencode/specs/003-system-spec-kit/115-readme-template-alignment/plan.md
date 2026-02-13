# Implementation Plan: README Template Alignment & Root README Restructuring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown |
| **Framework** | GitHub-Flavored Markdown (GFM) |
| **Storage** | Git repository (file-based) |
| **Testing** | Manual review, anchor validation, line count verification |

### Overview
This plan covers a 3-phase documentation alignment project. Phase 1 updates the README template to codify evolved patterns. Phase 2 fixes structural defects in the root README (anchors, sections, TOC). Phase 3 adds missing feature content to the root README. Phases are sequential: template rules must exist before applying them, and structural fixes must precede content additions.

---

## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable (line count, section count, feature coverage)
- [x] Dependencies identified (specs 111, 112, 113, 114)

### Definition of Done
- [ ] All acceptance criteria from spec.md met
- [ ] `readme_template.md` has 5 new pattern sections
- [ ] Root `README.md` has 9 sections, zero broken anchors, zero phantom TOC links
- [ ] Root `README.md` line count between 800 and 1000
- [ ] All 10 underrepresented features have content

---

## 3. ARCHITECTURE

### Pattern
Content-first documentation with progressive enhancement. Each phase builds on the previous.

### Key Components
- **`readme_template.md`**: The canonical template that defines README structure and patterns for all project READMEs
- **Root `README.md`**: The project's primary README, which must conform to the template's 9-section standard

### Data Flow
```
Phase 1: Template Update
  readme_template.md += [badges, diagrams, Before/After, anchors, TOC rules]
      |
Phase 2: Structural Fix
  README.md: fix anchors → add missing sections (2, 3) → renumber to 9 → sync TOC
      |
Phase 3: Content Addition
  README.md += [10 feature areas, respecting 1000-line budget]
```

---

## 4. IMPLEMENTATION PHASES

### Phase 1: Template Alignment
- [ ] Audit current `readme_template.md` for gaps vs. practiced patterns
- [ ] Add badge pattern documentation (placement, format, recommended badges)
- [ ] Add architecture diagram guidelines (ASCII/mermaid, when to use)
- [ ] Add Before/After comparison format (table or code-block pattern)
- [ ] Add anchor placement rules (open/close pairing, naming convention, positioning)
- [ ] Add TOC consistency rules (manual maintenance, phantom link prevention)

### Phase 2: Root README Restructuring
- [ ] Audit current root README anchors (find broken open/close pairs)
- [ ] Fix broken anchor tags (close overview, open structure)
- [ ] Add Quick Start section (section 2) with installation/setup content
- [ ] Add Structure section (section 3) with directory overview
- [ ] Renumber all sections from current 7 to target 9
- [ ] Synchronize TOC to match actual section headings (remove 2 phantom links)
- [ ] Verify all internal links resolve

### Phase 3: Root README Feature Content
- [ ] Add Local-First/Privacy callout in OVERVIEW section
- [ ] Update Key Stats (scripts count)
- [ ] Expand CWB explanation in Agent Network section
- [ ] Add 24 failure patterns note in Gate System section
- [ ] Add Multi-stack auto-detection table in Skills Library section
- [ ] Add Command Architecture subsection (rename + two-layer .md/.yaml explanation)
- [ ] Add Code Mode MCP section (98.7% context reduction stat)
- [ ] Add Chrome DevTools Integration section (300+ CDP methods stat)
- [ ] Add Git Workflows section (3-phase, worktrees)
- [ ] Add Extensibility section (custom skills/agents/commands)
- [ ] Verify final line count stays within 800-1000 range

---

## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual review | All markdown content | Visual inspection in editor and GitHub preview |
| Anchor validation | Root README | Grep for unmatched `<!-- ANCHOR:` open/close pairs |
| TOC verification | Root README | Compare TOC entries against actual `##` headings |
| Line count | Root README | `wc -l README.md` must return 800-1000 |
| Link resolution | Both files | Grep for `](#` patterns and verify targets exist |

---

## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Spec 111 (anchor schema) | Internal | Complete | Anchor naming rules must align |
| Spec 112 (memory README) | Internal | Complete | No conflict - different file scope |
| Spec 113 (style alignment) | Internal | Complete | Style conventions must be applied |
| Spec 114 (doc reduction) | Internal | Complete | Line budget constraint applies |

---

## 7. ROLLBACK PLAN

- **Trigger**: Content additions exceed 1000-line budget or break existing anchor references
- **Procedure**: `git checkout -- README.md` and `git checkout -- .opencode/skill/workflows-documentation/references/readme_template.md` to revert both files

---


---

## L2: PHASE DEPENDENCIES

```
Phase 1 (Template) ──► Phase 2 (Structure) ──► Phase 3 (Content)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Template Alignment | None | Phase 2 (rules must exist before applying) |
| Phase 2: Structural Fix | Phase 1 | Phase 3 (structure must be correct before adding content) |
| Phase 3: Feature Content | Phase 2 | None |

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Template Alignment | Low | 30-45 minutes |
| Phase 2: Root README Restructuring | Medium | 45-60 minutes |
| Phase 3: Root README Feature Content | Medium | 60-90 minutes |
| **Total** | | **2.25-3.25 hours** |

---

## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Both files backed up via git (committed state before changes)
- [ ] Line count baseline recorded (current README.md: 756 lines)
- [ ] Current anchor inventory documented

### Rollback Procedure
1. Revert files: `git checkout -- README.md .opencode/skill/workflows-documentation/references/readme_template.md`
2. Verify revert: `wc -l README.md` should return 756
3. Confirm no orphaned anchor references in codebase

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - pure documentation changes

---
