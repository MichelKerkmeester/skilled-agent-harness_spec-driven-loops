# Verification Checklist: Skill Rename — workflows-* to sk-*/mcp-*

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
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Renames (Phase 1)

- [ ] CHK-010 [P0] `workflows-code--opencode` → `sk-code--opencode` renamed
- [ ] CHK-011 [P0] `workflows-code--web-dev` → `sk-code--web` renamed
- [ ] CHK-012 [P0] `workflows-code--full-stack` → `sk-code--full-stack` renamed
- [ ] CHK-013 [P0] `workflows-documentation` → `sk-documentation` renamed
- [ ] CHK-014 [P0] `workflows-git` → `sk-git` renamed
- [ ] CHK-015 [P0] `workflows-visual-explainer` → `sk-visual-explainer` renamed
- [ ] CHK-016 [P0] `workflows-chrome-devtools` → `mcp-chrome-devtools` renamed
- [ ] CHK-017 [P0] No old `workflows-*` folders remain under `.opencode/skill/`
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:content-updates -->
## Content Updates (Phases 2-9)

- [ ] CHK-020 [P0] Internal skill files updated (SKILL.md, index.md, nodes/, refs, assets, scripts)
- [ ] CHK-021 [P0] skill_advisor.py INTENT_BOOSTERS updated
- [ ] CHK-022 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated
- [ ] CHK-023 [P0] Agent files updated — .opencode/agent/ (3 files)
- [ ] CHK-024 [P0] Agent files updated — .opencode/agent/chatgpt/ (3 files)
- [ ] CHK-025 [P0] Agent files updated — .claude/agents/ (3 files)
- [ ] CHK-026 [P0] Agent files updated — .gemini/agents/ (3 files)
- [ ] CHK-027 [P1] Command create/ files updated (12 YAMLs + 6 MDs + 2 READMEs)
- [ ] CHK-028 [P1] Command visual-explainer/ files updated (5 files)
- [ ] CHK-029 [P1] Install guides updated (4 files)
- [ ] CHK-030 [P1] Root docs updated (README.md, CLAUDE.md, .opencode/README.md)
- [ ] CHK-031 [P1] system-spec-kit config.jsonc updated
- [ ] CHK-032 [P1] system-spec-kit templates HVR_REFERENCE paths updated
- [ ] CHK-033 [P1] system-spec-kit test fixtures updated
- [ ] CHK-034 [P1] Changelog directories renamed
- [ ] CHK-035 [P1] Wildcard `workflows-code--*` → `sk-code--*` updated everywhere
- [ ] CHK-036 [P1] Bare `workflows-code` references resolved
<!-- /ANCHOR:content-updates -->

---

<!-- ANCHOR:testing -->
## Verification (Phase 10)

- [ ] CHK-040 [P0] grep verification: 0 matches for old names in active files
- [ ] CHK-041 [P0] skill_advisor.py returns correct new names for test queries
- [ ] CHK-042 [P0] All 7 new skill folders exist with complete file contents
- [ ] CHK-043 [P1] No broken relative paths between skills
- [ ] CHK-044 [P2] system-spec-kit vitest tests pass with updated fixtures
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec/plan/checklist synchronized
- [ ] CHK-051 [P2] Findings saved to memory/
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 2 | 0/2 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
