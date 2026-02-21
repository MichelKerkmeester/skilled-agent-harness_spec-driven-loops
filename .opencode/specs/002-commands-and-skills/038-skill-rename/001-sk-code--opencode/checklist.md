# Verification Checklist: Phase 001 — Rename workflows-code--opencode to sk-code--opencode

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
- [x] CHK-003 [P1] Dependencies identified: Phase 3 must complete first
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:filesystem -->
## Filesystem Rename

- [ ] CHK-010 [P0] `workflows-code--opencode` folder renamed to `sk-code--opencode`
- [ ] CHK-011 [P0] No `workflows-code--opencode` folder remains under `.opencode/skill/`
- [ ] CHK-012 [P0] All 35 internal files present in new folder
<!-- /ANCHOR:filesystem -->

---

<!-- ANCHOR:internal-content -->
## Internal Content Updates (35 files)

- [ ] CHK-020 [P0] SKILL.md updated — name, title, self-references
- [ ] CHK-021 [P0] index.md updated — name, description
- [ ] CHK-022 [P0] nodes/*.md updated (~6 files) — cross-refs, self-refs
- [ ] CHK-023 [P1] references/*.md updated (~5 files) — hard-coded paths
- [ ] CHK-024 [P1] assets/*.md updated (~15 files) — template paths, examples
- [ ] CHK-025 [P1] scripts/*.sh updated (~3 files) — hard-coded paths
<!-- /ANCHOR:internal-content -->

---

<!-- ANCHOR:external-refs -->
## External Reference Updates (13 files)

- [ ] CHK-030 [P0] skill_advisor.py INTENT_BOOSTERS updated (19 lines)
- [ ] CHK-031 [P0] skill_advisor.py MULTI_SKILL_BOOSTERS updated
- [ ] CHK-032 [P0] .opencode/agent/orchestrate.md updated
- [ ] CHK-033 [P0] .opencode/agent/chatgpt/orchestrate.md updated
- [ ] CHK-034 [P0] .claude/agents/orchestrate.md updated
- [ ] CHK-035 [P0] .gemini/agents/orchestrate.md updated
- [ ] CHK-036 [P1] .opencode/install_guides/README.md updated
- [ ] CHK-037 [P1] .opencode/install_guides/SET-UP - AGENTS.md updated
- [ ] CHK-038 [P1] CLAUDE.md updated
<!-- /ANCHOR:external-refs -->

---

<!-- ANCHOR:cross-refs -->
## Cross-Skill References

- [ ] CHK-040 [P1] References to `workflows-code--opencode` in other skill folders updated
- [ ] CHK-041 [P1] Changelog directory renamed: `07--sk-code--opencode`
<!-- /ANCHOR:cross-refs -->

---

<!-- ANCHOR:verification -->
## Verification

- [ ] CHK-050 [P0] grep verification: 0 matches for `workflows-code--opencode` in active files
- [ ] CHK-051 [P0] skill_advisor.py returns `sk-code--opencode` for test queries
- [ ] CHK-052 [P0] Folder `.opencode/skill/sk-code--opencode/` exists with complete contents
- [ ] CHK-053 [P1] No broken relative paths from this skill to other skills
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
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: [pending]
<!-- /ANCHOR:summary -->
