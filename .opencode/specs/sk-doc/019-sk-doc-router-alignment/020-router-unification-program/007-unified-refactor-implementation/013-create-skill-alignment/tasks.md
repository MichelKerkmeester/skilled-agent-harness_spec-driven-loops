---
title: "Tasks: create-skill Compiled-Routing Alignment"
description: "Completed task record for parent-hub directive rendering, explicit legacy/ready onboarding, canonical manifest minting, and regression verification."
trigger_phrases:
  - "create-skill compiled routing tasks"
  - "parent hub onboarding tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: create-skill Compiled-Routing Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Verified after implementation evidence exists |
| `[P]` | Parallelizable after dependencies are green |
| `[B]` | Blocked by an explicit dependency |

**Task Format**: `T### [P?] Description (requirement; target file) {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the P3 minter, manifest-location, freshness, and runtime-discovery interfaces. (REQ-001, REQ-004; shared compiled-routing interface)
- [x] T002 Capture baseline standalone and parent generator outputs plus existing test results. (REQ-006; temp fixtures)
- [x] T003 Extract and approve the canonical directive block and hub-name substitution points. (REQ-002; both parent templates)
- [x] T004 Define the parent-only `legacy|ready` option and backward-compatible default. (REQ-003, REQ-006; `init_skill.py`)

**Evidence**: interface note, baseline fixture tree, directive text fixture, and option matrix.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Add the directive to `assets/parent-skill/scaffold/hub-skill-scaffold.md`. (REQ-002)
- [x] T006 [P] Add the matching directive to `assets/parent-skill/parent-skill-hub-template.md`. (REQ-002) {deps: T003}
- [x] T007 Render the generated hub name into the directive command and fallback sentence. (REQ-002; `init_skill.py`) {deps: T005}
- [x] T008 Parse and validate `--compiled-routing legacy|ready`, rejecting ready for standalone generation. (REQ-003, REQ-006; `init_skill.py`) {deps: T004}
- [x] T009 Add ready-mode canonical manifest minting after final router inputs are written. (REQ-001, REQ-004; `init_skill.py`) {deps: T001, T007, T008}
- [x] T010 Verify the returned manifest through the shared predicate before reporting compiled-ready. (REQ-004, REQ-005; `init_skill.py`) {deps: T009}
- [x] T011 Add explicit output for legacy, ready, and fail-closed outcomes. (REQ-003, REQ-005; `init_skill.py`) {deps: T010}
- [x] T012 [P] Update create-skill `SKILL.md`, README, parent reference, and package validation. (REQ-007, REQ-008) {deps: T001, T003, T004}

**Evidence**: generated hub samples, minter adapter output, freshness result, and synchronized docs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify both templates carry the same normalized directive. (REQ-002, REQ-008; template parity test)
- [x] T014 Verify legacy parent generation emits no manifest and reports legacy. (REQ-003, REQ-006; pytest temp fixture)
- [x] T015 Verify ready parent generation mints a fresh canonical manifest and reports compiled-ready. (REQ-004, REQ-007; test minter fixture)
- [x] T016 Verify missing minter, stale manifest, malformed manifest, and invalid option fail without a ready claim. (REQ-005, REQ-007; negative matrix)
- [x] T017 Verify existing standalone and parent invocations remain compatible. (REQ-006, REQ-007; regression suite)
- [x] T018 Run strict skill-package validation on generated fixtures and strict spec-folder validation on this packet. (REQ-007, REQ-008)

**Evidence**: pytest output, generated-file assertions, strict validator output, and explicit legacy/ready status samples.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] REQ-001 through REQ-008 have direct test or document evidence.
- [x] Parent hubs always receive the canonical directive.
- [x] Legacy emits no manifest; ready requires a verified fresh manifest.
- [x] No failure path prints or records compiled-ready.
- [x] Existing CLI behavior remains backward compatible.
- [x] No runtime router, existing hub manifest, or frozen scorer file is modified.
- [x] Strict packet validation reports zero errors.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Implementation record**: `implementation-summary.md`
- **Consumed eligibility authority**: `../012-default-on-decision/decision-record.md`
<!-- /ANCHOR:cross-refs -->
