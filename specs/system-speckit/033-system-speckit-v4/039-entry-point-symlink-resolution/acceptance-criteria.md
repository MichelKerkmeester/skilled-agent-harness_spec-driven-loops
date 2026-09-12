---
title: "Acceptance Criteria: Entry-point resolution through a link"
description: "The criteria this packet must satisfy: a module reached through a link knows it was run, an imported one stays dormant, resolution failure does not raise, and the every-turn lookup returns the same bytes either way."
trigger_phrases:
  - "entry point acceptance criteria"
importance_tier: "supporting"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria-core | v2.2 -->
# Acceptance Criteria: Entry-point resolution through a link

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:criteria -->
## 1. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given a module executed through a symlinked launch path, When it asks whether it is the entrypoint, Then the answer is yes | `runtime/tests/esm-entry-symlink.vitest.ts` asserts it in-process against the typed helper and through a spawned child against the twin. Both fail against the previous implementation | Met | - |
| AC-002 | REQ-001 | Given a module that was imported rather than executed, When it asks the same question, Then the answer is no | Same file, both homes. This is the control: a fix that answered yes unconditionally would satisfy AC-001 and fail here | Met | - |
| AC-003 | REQ-002 | Given a launch path that cannot be resolved, When the question is asked, Then it returns false rather than raising | Same file, asserting both that it does not throw and that the answer is false | Met | - |
| AC-004 | REQ-003 | Given the trigger-index lookup that runs on every turn, When it is reached through a symlinked path, Then it returns the same bytes as a direct invocation | Measured on this repository through a symlinked parent: 5757 bytes either way and byte-identical, against 0 bytes and exit 0 before | Met | - |
| AC-005 | REQ-003 | Given a guard that matches on a filename rather than comparing paths, When the migration runs, Then it is left alone | That shape cannot be displaced by a link, so changing it would add risk without removing any | Met | - |
| AC-006 | REQ-004 | Given the spec-kit suite, When it runs from the final state, Then it passes and the delta is the added cases | Pending | Pending | - |

<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 2. STATUS VALUES

| Value | Meaning |
|-------|---------|
| Met | Verified against evidence named in the row |
| Pending | Not yet verified |
<!-- /ANCHOR:closure -->
