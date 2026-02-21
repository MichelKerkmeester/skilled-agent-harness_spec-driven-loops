# Verification Checklist: Phase 005 — Rename workflows-git to sk-git

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
- [x] CHK-003 [P1] Dependencies: all other phases must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [ ] CHK-010 [P0] `workflows-git` renamed to `sk-git`
- [ ] CHK-011 [P0] No old folder remains
- [ ] CHK-012 [P0] All 20 internal files present
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (20 files)

- [ ] CHK-020 [P0] SKILL.md updated
- [ ] CHK-021 [P0] index.md updated
- [ ] CHK-022 [P0] nodes/*.md (~5 files) updated
- [ ] CHK-023 [P1] references/*.md (~3 files) updated
- [ ] CHK-024 [P1] assets/*.md (~5 files) updated
- [ ] CHK-025 [P1] scripts/*.sh (~2 files) updated
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:skill-advisor -->
## skill_advisor.py (28 lines — highest)

- [ ] CHK-030 [P0] INTENT_BOOSTERS entries updated (~20 entries)
- [ ] CHK-031 [P0] MULTI_SKILL_BOOSTERS entries updated (~8 entries)
- [ ] CHK-032 [P0] All 28 lines verified correct
<!-- /ANCHOR:skill-advisor -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (39 files)

- [ ] CHK-040 [P0] orchestrate.md updated (4 runtimes)
- [ ] CHK-041 [P1] Install guides updated (4 files)
- [ ] CHK-042 [P1] Root docs updated (3 files)
- [ ] CHK-043 [P1] Other external refs updated
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [ ] CHK-050 [P1] Cross-refs in other skills updated
- [ ] CHK-051 [P1] Changelog dir renamed: `10--sk-git`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] CHK-060 [P0] grep: 0 matches for `workflows-git`
- [ ] CHK-061 [P0] skill_advisor.py: `git commit` → `sk-git`
- [ ] CHK-062 [P0] skill_advisor.py: `push changes` → `sk-git`
- [ ] CHK-063 [P0] skill_advisor.py: `create branch` → `sk-git`
- [ ] CHK-064 [P0] Folder exists
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
| P0 Items | 16 | 0/16 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->
