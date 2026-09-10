---
title: "Tasks: Remove the deleted pre-push naming gate's residue"
description: "Trace, map, remove and verify."
trigger_phrases:
  - "prepush residue tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Remove the deleted pre-push naming gate's residue

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

- [x] T001 Reproduce both failures and trace them to the commit that removed the gate
- [x] T002 Map every surface still describing it: tests, scenarios, catalog, flag, classifier branches, docs
- [x] T003 Remove the dead test cases and relabel the ones now passing through the permission gate
- [x] T004 Delete the six scenarios and the catalog document, add one scenario for the surviving gate
- [x] T005 Replace the unreachable classifier branch in both scripts with the gate the hook actually emits
- [x] T006 Remove the dead flag from every live file and correct the gate descriptions
- [x] T007 Verify both suites, the absence of dangling links and the shell syntax of every edited script
<!-- /ANCHOR:tasks -->

---

<!-- ANCHOR:verification -->
## Verification

Gate: `bash .opencode/scripts/git-hooks/tests/pre-push.test.sh` and `.../pre-commit.test.sh` both pass. Residue: a repository grep for `SPECKIT_SKIP_PREPUSH_NAMING` and the six deleted filenames returns only the sentence recording the removal.
<!-- /ANCHOR:verification -->
