---
title: "Implementation Plan: Remove the deleted pre-push naming gate's residue"
description: "Trace the two failures to their producer, map every surface the deleted gate left behind, then remove or correct each one."
trigger_phrases:
  - "prepush residue plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Remove the deleted pre-push naming gate's residue

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

The first hypothesis was wrong and is worth recording. A permission-gate change in late August had tightened a bare approval so it can no longer create a branch, and three of five call sites using that approval with a creation were migrated in the same commit. Patching the two that were missed cleared one failure and immediately produced a different one, which is the signal to stop patching and look one level up. The producer was a separate commit that deleted the naming gate outright.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. PHASES

| Phase | Work | Output |
|-------|------|--------|
| 1 | Reproduce, then trace the failure to the commit that removed the behavior | the producer |
| 2 | Map every test, scenario, catalog entry, flag and code path that still describes the gate | the residue map |
| 3 | Remove or correct each, and add one scenario so the surviving gate keeps coverage | the change |
| 4 | Both suites green, no dangling link, no dead flag | verification |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:rollback -->
## 3. ROLLBACK

`git revert` the commit. Nothing here is generated, and the deleted files return with it.
<!-- /ANCHOR:rollback -->
