---
title: "Implementation Plan: Phase 12: reply rule delegation repair"
description: "One headline sentence, chosen from what the file already carries, and a sweep that proves it was the only duplicate."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 12: reply rule delegation repair

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

One sentence. The work is the sweep that found it and the sweep that proves nothing else like it
remains, because a duplicated instruction is invisible when you read one file at a time.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

- `node .opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` → `RESULT: PASSED (9/9 checks)`
- `validate.sh <folder> --strict` → `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

1. **Compare every directive against every other.** Pull the bolded lead of each directive from all twelve rule files, then score each cross-file pair on shared content words.
2. **Read every candidate in context before calling it a duplicate.** A shared vocabulary is not a shared instruction, and three of the four candidates turned out to be complementary.
3. **Replace rather than delete.** The headline keeps its shape and its promise, with both clauses drawn from sections the same file carries.
4. **Rerun the sweep** to confirm the pair is gone and no new one appeared.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Where |
|------|------|-------|
| 1 | The directive sweep across all twelve rules | `repo-rules/` |
| 2 | The headline sentence and the version | `repo-rules/communication.md` |
| 3 | The corpus checker and the repeat sweep | both |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| The pair is gone | The sweep is rerun and reports no directive stated in two files |
| Nothing else duplicates | The same sweep covers all twelve files, not only the four that fire on a reply |
| Both new clauses are this file's | Each is matched to a numbered section of the same file |
| The corpus still holds | `check-repo-rules.cjs` reports 9 of 9 |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 003, which created the seam this repairs.
- Phase 011, which gave the four reply rules one name shape.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

Restore the previous headline sentence and the prior version. Nothing reads this line
mechanically, so the change has no state behind it.
<!-- /ANCHOR:rollback -->

---

