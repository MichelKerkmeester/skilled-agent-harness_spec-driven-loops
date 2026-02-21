# Verification Checklist: Skill Rename — workflows-* to sk-*/mcp-*

<!-- SPECKIT_LEVEL: 3+ -->
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
- [ ] CHK-012 [P0] `sk-code--full-stack` → `sk-code--full-stack` renamed
- [ ] CHK-013 [P0] `workflows-documentation` → `sk-documentation` renamed
- [ ] CHK-014 [P0] `workflows-git` → `sk-git` renamed
- [ ] CHK-015 [P0] `workflows-visual-explainer` → `sk-visual-explainer` renamed
- [ ] CHK-016 [P0] `mcp-chrome-devtools` → `mcp-chrome-devtools` renamed
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

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md
- [ ] CHK-101 [P1] ADR-001 (per-skill phase decomposition) has Accepted status
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
- [ ] CHK-103 [P2] Phase execution order documented (longest-match-first)
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] All 7 phases complete within expected effort estimates
- [ ] CHK-111 [P1] No regression in skill_advisor.py response time
- [ ] CHK-112 [P2] Batch replacement efficiency documented
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented and tested (`git checkout -- .`)
- [ ] CHK-121 [P1] Pre-deployment clean git state confirmed
- [ ] CHK-122 [P1] No concurrent sessions using old skill names
- [ ] CHK-123 [P2] Post-deployment monitoring plan documented
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Naming consistency verified (all folders use sk-*/mcp-* prefix)
- [ ] CHK-131 [P1] skill_advisor.py entries match folder names exactly
- [ ] CHK-132 [P1] Agent files consistent across 4 runtimes
- [ ] CHK-133 [P2] Install guide skill registries updated
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All 7 phase spec folders complete (spec.md, plan.md, tasks.md, checklist.md)
- [ ] CHK-141 [P1] Parent spec.md Phase Documentation Map updated with completion status
- [ ] CHK-142 [P1] Root docs (README.md, CLAUDE.md, .opencode/README.md) use new names
- [ ] CHK-143 [P2] Memory saved for each completed phase
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| User | Project Owner | [ ] Approved | |
| System | Automated Grep Verification | [ ] Approved | |
| System | skill_advisor.py Smoke Test | [ ] Approved | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 0/20 |
| P1 Items | 20 | 0/20 |
| P2 Items | 6 | 0/6 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->

---

<!--
Level 3+ checklist - Architecture + governance verification
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
