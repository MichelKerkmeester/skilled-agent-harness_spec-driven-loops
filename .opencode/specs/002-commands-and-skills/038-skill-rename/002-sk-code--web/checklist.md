# Verification Checklist: Phase 002 — Rename workflows-code--web-dev to sk-code--web

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
- [x] CHK-003 [P1] Dependencies identified: Phases 1 and 3 must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [ ] CHK-010 [P0] `workflows-code--web-dev` folder renamed to `sk-code--web`
- [ ] CHK-011 [P0] No `workflows-code--web-dev` folder remains
- [ ] CHK-012 [P0] All 51 internal files present in new folder
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (51 files)

- [ ] CHK-020 [P0] SKILL.md updated — name, title, self-references
- [ ] CHK-021 [P0] index.md updated — name, description
- [ ] CHK-022 [P0] nodes/*.md updated (~8 files) — cross-refs, self-refs
- [ ] CHK-023 [P1] references/*.md updated (~8 files) — hard-coded paths
- [ ] CHK-024 [P1] assets/*.md updated (~25 files) — template paths, examples
- [ ] CHK-025 [P1] scripts/*.{sh,mjs} updated (~5 files) — paths
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (17 files)

- [ ] CHK-030 [P0] skill_advisor.py INTENT_BOOSTERS updated (25 lines)
- [ ] CHK-031 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated
- [ ] CHK-032 [P0] Agent orchestrate.md files updated (4 runtimes)
- [ ] CHK-033 [P0] Agent review.md files updated (4 runtimes)
- [ ] CHK-034 [P1] Install guides updated (2 files)
- [ ] CHK-035 [P1] Root docs updated (CLAUDE.md, .opencode/README.md)
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:bare-refs -->
## Bare Reference Resolution

- [ ] CHK-040 [P0] All bare `workflows-code` references resolved to `sk-code--web` or `sk-code--*`
- [ ] CHK-041 [P1] No stale `workflows-code/` path references remain
<!-- /ANCHOR:bare-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [ ] CHK-045 [P1] References to `workflows-code--web-dev` in other skill folders updated
- [ ] CHK-046 [P1] Changelog directory renamed: `08--sk-code--web`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] CHK-050 [P0] grep verification: 0 matches for `workflows-code--web-dev` in active files
- [ ] CHK-051 [P0] grep verification: 0 bare `workflows-code` references
- [ ] CHK-052 [P0] skill_advisor.py returns `sk-code--web` for test queries
- [ ] CHK-053 [P0] Folder `.opencode/skill/sk-code--web/` exists with complete contents
- [ ] CHK-054 [P1] No broken relative paths
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P1] Spec/plan/tasks synchronized
- [ ] CHK-061 [P2] Findings saved to memory/
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 0/15 |
| P1 Items | 11 | 0/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->
