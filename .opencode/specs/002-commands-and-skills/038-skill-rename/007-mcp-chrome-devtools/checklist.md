# Verification Checklist: Phase 007 — Rename mcp-chrome-devtools to mcp-chrome-devtools

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies: Phases 3, 1, 2 must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [ ] CHK-010 [P0] `mcp-chrome-devtools` renamed to `mcp-chrome-devtools`
- [ ] CHK-011 [P0] No old folder remains
- [ ] CHK-012 [P0] All 21 internal files present
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (21 files)

- [ ] CHK-020 [P0] SKILL.md updated (including MCP designation)
- [ ] CHK-021 [P0] index.md updated
- [ ] CHK-022 [P0] nodes/*.md (~5 files) updated
- [ ] CHK-023 [P1] references/*.md (~3 files) updated
- [ ] CHK-024 [P1] assets/*.md (~5 files) updated
- [ ] CHK-025 [P1] scripts/*.sh (~3 files) updated
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (36 files)

- [ ] CHK-030 [P0] skill_advisor.py updated (20 lines)
- [ ] CHK-031 [P0] orchestrate.md updated (4 runtimes)
- [ ] CHK-032 [P1] Install guides updated (4 files)
- [ ] CHK-033 [P1] Root docs updated (3 files)
- [ ] CHK-034 [P1] system-spec-kit refs updated (2 files)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:mcp-alignment -->
## MCP Categorization

- [ ] CHK-040 [P0] Folder name uses `mcp-` prefix (not `sk-`)
- [ ] CHK-041 [P1] Naming aligns with existing `mcp-figma`, `mcp-code-mode`
- [ ] CHK-042 [P1] skill_advisor.py categorizes as MCP integration
<!-- /ANCHOR:mcp-alignment -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [ ] CHK-050 [P1] Cross-refs in other skills updated
- [ ] CHK-051 [P1] Changelog dir renamed: `11--mcp-chrome-devtools`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] CHK-060 [P0] grep: 0 matches for `mcp-chrome-devtools`
- [ ] CHK-061 [P0] skill_advisor.py: `take screenshot` → `mcp-chrome-devtools`
- [ ] CHK-062 [P0] skill_advisor.py: `devtools` → `mcp-chrome-devtools`
- [ ] CHK-063 [P0] Folder exists with all contents
- [ ] CHK-064 [P1] `ls .opencode/skill/mcp-*` shows 3 MCP skills
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-070 [P1] Spec/plan/tasks synchronized
- [ ] CHK-071 [P2] Memory saved
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->
