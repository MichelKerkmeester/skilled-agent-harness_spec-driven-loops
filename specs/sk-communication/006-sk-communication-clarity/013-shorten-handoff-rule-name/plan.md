---
title: "Implementation Plan: Phase 13: shorten the handoff rule name"
description: "One rename, four reference sites, and a benchmark that has to keep scoring replies written under two earlier names."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 13: shorten the handoff rule name

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

A rename with a small twist. This rule has now carried three filenames, and the benchmark scores
frozen replies that name whichever one was current when they were written. The coverage case
therefore holds all three and counts them as one item.
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

1. **Rename with `git mv`** so history follows the file rather than reading as a delete and an add.
2. **Rewrite the identity**: title, H1 and version, matching the filename as the sibling rules do.
3. **Repoint the four live sites** as exact string replacements that fail loudly if the text has moved.
4. **Add the new name to the coverage case** beside the two it replaces, then rescore every frozen side to prove nothing moved.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Where |
|------|------|-------|
| 1 | The rename, title, H1 and version | `repo-rules/` |
| 2 | The sentence naming the four reply rules | `AGENTS.md` |
| 3 | The trigger row, the index row and the scope paragraph | `REPO RULES.md` |
| 4 | The misread table | `sk-create-repo-rule/references/creation-standards.md` |
| 5 | The third name on the coverage case, and the release-notes line | `reply-harness/`, v4 changelog |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| Every rule link resolves | `check-repo-rules.cjs` reports 9 of 9 with its link count unchanged |
| No live reference names the old path | Tracked scan outside `specs/`, where only the coverage case may match |
| No rule sentence changed | `git diff -M` shows only title, H1 and version |
| The frozen benchmark still holds | Six reply sets rescored, same weighted means and same blocking rows |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 011, which set the prefix this trims.
- Phase 005, whose coverage case names every rule file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

`git mv` the file back and revert the commit. The third name can stay on the coverage case either
way, because an unused alternative name costs nothing and matching is by any name.
<!-- /ANCHOR:rollback -->

---

