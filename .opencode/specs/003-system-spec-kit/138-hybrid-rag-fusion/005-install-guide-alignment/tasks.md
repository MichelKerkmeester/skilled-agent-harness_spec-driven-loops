# Tasks: Install Guide Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Research & Setup

- [x] T001 Scan spec 136 features for install guide impact
- [x] T002 Scan spec 138 features for install guide impact
- [x] T003 Scan spec 139 features for install guide impact
- [x] T004 Read all 4 existing INSTALL_GUIDE.md files
- [x] T005 Read install guide template and HVR standards
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation (Parallel)

- [x] T006 [P] Rewrite Spec Kit Memory MCP INSTALL_GUIDE.md (`.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md`)
  - Add new feature flags: SPECKIT_GRAPH_UNIFIED, SPECKIT_GRAPH_MMR, SPECKIT_GRAPH_AUTHORITY
  - Document skill graph system (72 nodes, 9 skills)
  - Document graph enrichment pipeline
  - Add check-links.sh script reference
  - Update behavior changes (causal graph active, cross-encoder reranking on, co-activation working)
  - HVR compliance rewrite
  - Template alignment (11 sections)
  - Add version number v3.0.0

- [x] T007 [P] Rewrite Chrome DevTools INSTALL_GUIDE.md (`.opencode/skill/workflows-chrome-devtools/INSTALL_GUIDE.md`)
  - Fix broken Code Mode cross-reference link
  - HVR compliance rewrite
  - Template alignment (11 sections)
  - Standardize validation checkpoints to phase_N_complete
  - Add Quick Reference section if missing

- [x] T008 [P] Rewrite Code Mode INSTALL_GUIDE.md (`.opencode/skill/mcp-code-mode/INSTALL_GUIDE.md`)
  - HVR compliance rewrite
  - Template alignment (11 sections)
  - Add version number v2.0.0
  - Standardize validation checkpoints

- [x] T009 [P] Rewrite Figma MCP INSTALL_GUIDE.md (`.opencode/skill/mcp-figma/INSTALL_GUIDE.md`)
  - Fix outdated cross-references (Code Mode, Narsil links)
  - HVR compliance rewrite
  - Template alignment (11 sections)
  - Standardize validation checkpoints

- [x] T010 Cross-guide consistency review and fixes
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 HVR compliance scan (grep for banned words across all 4 guides)
- [x] T012 Template structure verification (11 sections per guide)
- [x] T013 Cross-reference link validation
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
