---
title: "Implementation Plan: Phase 11: communication rule naming"
description: "Rename the two unprefixed reply rules, repoint every live reference, and prove completeness with the corpus checker rather than with a grep alone."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: communication rule naming

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Two `git mv` calls, a title and H1 edit in each renamed file, and seven reference sites. The work
is mechanical. What makes it worth a packet is proving the sweep is complete, because a dead rule
link fails silently: a rule that does not load is indistinguishable from a rule that loaded and
did not apply.

Completeness is proved two ways rather than one. The corpus checker resolves every link inside the
rule corpus, and a scan over every tracked file outside the spec archives catches references from
anywhere else.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 5. QUALITY GATES

- `node .opencode/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs` → `RESULT: PASSED (9/9 checks)`
- `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh <folder> --strict` → `RESULT: PASSED`
- The six fleet synchronizers report no drift before the commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. APPROACH

1. **Rename with `git mv`**, so history follows each file rather than reading as a delete and an add.
2. **Rewrite each file's identity**: the frontmatter title, the H1 and the version. The pattern is
   the one phase 003 set, where `prose-mechanics.md` became `communication-prose.md` and its title
   became `Rule: Communication prose`.
3. **Repoint every live reference** in one pass, each as an exact string replacement that fails
   loudly if the text is not where it is expected.
4. **Teach the benchmark that one rule can have two names.** Its coverage case names every rule
   file, and the frozen replies from before the rename name the old ones. An expected item becomes
   a list of alternative names satisfied by any of them, so every frozen side stays scorable.
5. **Leave the archives alone.** A research log or a captured transcript records what was true when
   it was written, the same call the Gate 3 letter merge made.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 3. WORK BREAKDOWN

| Step | What | Where |
|------|------|-------|
| 1 | Both renames | `repo-rules/` |
| 2 | Title, H1, version, and the link between the two rules | the two renamed files |
| 3 | The one sentence naming all four reply rules | `AGENTS.md` |
| 4 | Two trigger rows, two index rows, one scope paragraph | `REPO RULES.md` |
| 5 | The inbound link from the reply-shape rule | `repo-rules/communication.md` |
| 6 | The misread table naming both rules | `sk-create-repo-rule/references/creation-standards.md` |
| 7 | Alternative names on the coverage case, and alias support in the scorer | `benchmark/reply-harness/` |
| 8 | The parent's phase map, its status, and the release notes line naming both rules | parent `spec.md`, v4 changelog |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. PROOF PLAN

Defined before the first edit.

| Claim | Check |
|-------|-------|
| Every rule link resolves | `check-repo-rules.cjs` reports 9 of 9, with its link count unchanged at 32 |
| No live reference names an old path | `git ls-files` minus `specs/`, scanned for both old slugs, returns nothing |
| No rule sentence changed | `git diff -M` on the two renamed files shows only the identity lines and the one cross-link |
| The frozen benchmark stays valid | All six reply sets rescore to the same weighted mean and the same blocking rows |
| Nothing else drifted | The gate-1 pointer, runtime-mirror, hook-registration, leaf-manifest, root-metadata and compiled-route checks all report no drift |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 003 for the naming convention this phase completes.
- Phase 005 for the benchmark whose coverage case names the rule files.
- Nothing downstream depends on this phase.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK

`git mv` both files back and revert the commit. Nothing is generated from these filenames, no
database records them and the trigger index does not carry them, so the rename has no state to
unwind beyond the tracked files themselves.
<!-- /ANCHOR:rollback -->

---

