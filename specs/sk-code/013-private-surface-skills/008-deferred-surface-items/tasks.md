---
title: "Tasks: Phase 8: deferred-surface-items"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deferred surface items tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.3 -->
# Tasks: Phase 8: deferred-surface-items

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the four items in phase 007's Out of Scope list and the external block contract (`../007-shared-references-and-detection-order/spec.md` section 3, `.skilled/skills/sk-code/shared/references/stack-detection.md` section 2). Verify: the four items are this phase's In Scope list. Evidence: `spec.md` section 3.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 [P] Back up and add the `surface_detection` block to the private `local-webflow` and `local-obsidian` skills (their `graph-metadata.json`, in two other repositories). Verify: the detection scripts print WEBFLOW then SKILLED and OBSIDIAN then SKILLED for a mixed request. Evidence: both files were copied to the session scratchpad and matched with `cmp` before the edit. Each block uses only path and content markers that the skill's own repository carries and no hub file does, and both pass the T003 rules. Run from the main checkout, the two readers print WEBFLOW then SKILLED and OBSIDIAN then SKILLED for mixed requests, SKILLED alone for a hub path, and nothing for a folder holding only a `go.mod`, all with exit 0. The marker values stay out of tracked files. Known limit: a workspace opened in a subfolder below a path marker gets no hint, which is the matching rule `stack-detection.md` section 2 defines.
- [x] T003 [P] Add the four field rules for an external block (`.skilled/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs`). Verify: `node --check` exits 0. Evidence: `surfaceDetectionProblems(block)` reports one `GRAPH_METADATA_INVALID_SURFACE_DETECTION` finding per broken rule: a missing or blank label, a role other than `specific`, no marker array, and a marker list that is not an array of non-blank strings. `node --check` and the comment-hygiene checker exit 0.
- [x] T004 Add one failing case per rule, a valid block and the absent key (`.skilled/skills/sk-doc/sk-create-skill/scripts/tests/skill-root-metadata-contract.test.cjs`). Verify: `node --test` on the file exits 0. Evidence: 40 of 40 pass, exit 0, against 34 of 34 before the change. With the trim removed, the file fails `contentMarkers [" "] must fail once` with exit 1, so the cases catch the defect they test.
- [x] T005 State the new rules in the external block section (`.skilled/skills/sk-code/shared/references/stack-detection.md`). Verify: `validate_document.py` prints VALID. Evidence: section 2 lists the rules, says a blank marker fails, and says the check skips `local-*` folders. The version is 2.2.6.0, `validate_document.py` prints VALID with 0 issues, and the Hermes sync `--check` prints `PASS: 67 Hermes skill copies in sync`.
- [ ] T006 [P] Classify every overlay check as surface-neutral, Webflow-only and held by `local-webflow`, or Webflow-only and missing there, then remove the second class (`.skilled/skills/sk-code/sk-code-quality/assets/code-quality-checklist/`). Verify: no overlay check requires snake_case JavaScript names, and every naming check that stays is P1.
- [ ] T007 Make the overlay's loaders, playbook, changelog and leaf manifest match the trimmed overlay (`.skilled/skills/sk-code/sk-code-quality/SKILL.md`, `README.md`). Verify: the leaf manifest generator's `--check` exits 0.
- [ ] T008 [P] Keep or remove the WEBFLOW, MOTION and LENIS allowlist entries by whether anything consumes them (`check-comment-hygiene.sh`). Verify: the checker's tests pass.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Run the gate in its CI form over the tree and the sk-code checks (`check-rule-copies.test.sh`, `verify-router-sync.cjs`). Verify: each exits 0 and no existing skill starts failing.
- [ ] T010 Validate the packet. Verify: `validate.sh specs/sk-code/013-private-surface-skills --recursive --strict` prints `RESULT: PASSED` for all nine folders.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
