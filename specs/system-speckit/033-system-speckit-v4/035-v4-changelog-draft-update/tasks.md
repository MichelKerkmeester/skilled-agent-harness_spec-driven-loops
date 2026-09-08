---
title: "Tasks: v4 changelog draft update"
description: "The three tasks that brought the changelog draft in line with the repository and the check that proves it."
trigger_phrases:
  - "changelog draft update tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: v4 changelog draft update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:tasks -->
## Tasks

- [x] T001 Patch every confirmed drift row at its cited line with an anchor-asserting replacement (../CHANGELOG-v4.0.0.0.md)
- [x] T002 Add the late-cycle subsections and the corrected upgrade notes (../CHANGELOG-v4.0.0.0.md)
- [x] T003 Verify no stale name survives outside a removal sentence and the parent validates strict
- [x] T004 Digest the last ten changelog entries of every skill and mode, one agent each, into scratch/changelog-digests/ with a merged index
- [x] T005 Turn the digests into a numbered change plan per draft section (scratch/changelog-update-plan.md)
- [x] T006 Apply the plan to the draft through the markdown agent and verify the HVR scan, residue grep, counts and structure
<!-- /ANCHOR:tasks -->

---

<!-- ANCHOR:verification -->
## Verification

Gate: `bash .opencode/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-speckit/033-system-speckit-v4 --strict` first verdict `RESULT: PASSED`; residue check: `rg -n 'memory_search|/interface|alignment|prompt-models|sk-create-diagram|MK_HOOKS|NNNN|1,314|/doc:quality|pi-subagents|eight modes' specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` returns only removal or correction sentences.
<!-- /ANCHOR:verification -->
