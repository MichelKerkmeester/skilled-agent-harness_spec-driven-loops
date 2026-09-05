---
title: "Tasks: Codex Lineage Credential Isolation"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Codex Lineage Credential Isolation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce the symptom directly: the same prompt through the same code path returns status 0 with the inherited home and status 1 with a lineage-style home (spec.md, THE ROOT CAUSE, reproduced)
- [x] T002 Rule out a spawnSync pipe deadlock: spawnSync drains 5MB in 32ms, measured (spec.md frontmatter, answered_questions)
- [x] T003 Rule out a shared-state lock: an isolated fresh home fails identically (spec.md frontmatter, answered_questions)
- [x] T004 Trace why the mandatory auth pre-flight did not catch the failure: it reads the operator's CODEX_HOME, not the dispatch's (spec.md, WHY THE PRE-FLIGHT DID NOT CATCH IT)
- [x] T005 Compare against the sibling executors: the macOS keychain-based credential sits outside the home, so isolating state does not isolate identity. cli-cursor has no home override and completes (spec.md, WHY THE SIBLING EXECUTORS DO NOT HIT IT)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Add a credential guarantee to the single codex execution adapter: link, not copy, the operator's credential into a relocated home before spawning (spec.md, THE FIX AS BUILT)
- [x] T007 Add a refuse-before-spawn path that names authentication when no credential resolves anywhere (spec.md, THE FIX AS BUILT)
- [x] T008 Add the missing gitignore rule for lineage homes, real and kept after the revert (spec.md, WITHDRAWN, What survives)
- [x] T009 Revert T006 and T007 after a fresh security-and-correctness review returned FAIL (spec.md, WITHDRAWN)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Measure the fix before revert: a lineage-style home moved from a 900s timeout with a 401 reconnect loop to status 0 in 4s (spec.md, THE FIX AS BUILT, before/after table)
- [x] T011 Measure the fix before revert: a fully missing credential moved from a 900s-then-120s timeout to a 0s refusal naming authentication (spec.md, THE FIX AS BUILT, before/after table)
- [x] T012 Confirm the credential form is a symlink, not a copy, so no OAuth token reaches git history (spec.md, THE FIX AS BUILT and WITHDRAWN, What survives)
- [x] T013 Find that the patched module is not on the failing fan-out path: the fan-out runner has zero references to it and builds its own argv through a different helper (spec.md, WITHDRAWN)
- [x] T014 Find that the 401 reconnect loop is bounded at five attempts and exits status 1 in about nineteen seconds, so it does not hang the way the root-cause section claimed (spec.md, WITHDRAWN)
- [x] T015 Find that the change broke the stress suite, from 26 passing to 16 failing, because the new check read the operator's real home through a fixture that had been hermetic (spec.md, WITHDRAWN)
- [x] T016 Find that the existence check followed symlinks, so a stale link would be certified as a reachable credential (spec.md, WITHDRAWN)
- [x] T017 Confirm the revert: stress suite restored to 26 passing at exit 0, and no .codex-home directory or credential symlink remains in the tree (spec.md, WITHDRAWN)
- [ ] T018 NOT DONE: put the credential guarantee where the dispatch env is actually built, so it covers the path that failed (spec.md, WITHDRAWN, What a correct attempt looks like)
- [ ] T019 NOT DONE: resolve a link rather than testing existence through it, so a stale one is repaired instead of certified (spec.md, WITHDRAWN, What a correct attempt looks like)
- [ ] T020 NOT DONE: run the credential check after the availability check, so a missing binary is not reported as an auth problem and no directory is created before the binary is known to exist (spec.md, WITHDRAWN, What a correct attempt looks like)
- [ ] T021 NOT DONE: investigate the timeout separately, since on this evidence it is not the 401 (spec.md, WITHDRAWN, What a correct attempt looks like)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]` (T018 to T021 remain not-done, carried forward for a future packet)
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed (the security-and-correctness review ran and returned a verdict, spec.md WITHDRAWN)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
