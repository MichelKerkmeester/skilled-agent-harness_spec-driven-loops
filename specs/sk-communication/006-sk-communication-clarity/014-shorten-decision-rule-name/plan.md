---
title: "Implementation Plan: Phase 14: shorten the decision rule name"
description: "One rename, six reference sites including two sibling rules, and a check that the file says what the shorter name leaves out."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 14: shorten the decision rule name

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The same shape as the previous phase with one extra step. Because this trim drops a word that
carries meaning, the file was read first to confirm it already says that thing. It does, twice,
in the two lines under its own heading. Had it not, the fix would have been a sentence in the file
rather than a longer filename.
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

1. **Read before renaming.** Confirm the file states that it governs presenting a decision, since the filename will stop saying so.
2. **Rename with `git mv`**, then match the title and H1 to the filename as the sibling rules do.
3. **Repoint six sites**, including the two rule files that link here, as exact replacements that fail loudly if the text has moved.
4. **Add the new name to the coverage case** beside the one it replaces, then rescore every frozen side.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Where |
|------|------|-------|
| 1 | Read the opening lines for the meaning the name gives up | `repo-rules/communication-decisions.md` |
| 2 | The rename, title, H1 and version | `repo-rules/` |
| 3 | The sentence naming the four reply rules | `AGENTS.md` |
| 4 | The trigger row and the index row | `REPO RULES.md` |
| 5 | The inbound links from the reply rule and the handoff rule | `repo-rules/` |
| 6 | The misread table, the coverage case and the release-notes line | `sk-doc`, `reply-harness`, v4 changelog |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

| Claim | Check |
|-------|-------|
| The file carries what the name drops | Read the two lines under the heading and the rule sentence |
| Every rule link resolves | `check-repo-rules.cjs` reports 9 of 9 |
| No live reference names the old path | Tracked scan outside `specs/`, where only the coverage case may match |
| The corpus names sit in one band | Measure every rule filename |
| The frozen benchmark still holds | Six reply sets rescored |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 013, which shortened the handoff rule and left this as the last long name.
- Phase 005, whose coverage case names every rule file.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

`git mv` the file back and revert the commit. The extra name can stay on the coverage case either
way, since an unused alternative costs nothing and matching is by any name.
<!-- /ANCHOR:rollback -->

---

