---
title: "Spec: make validate_document.py number-agnostic + add a no-new-numbers guard"
description: "Phase 002 of the numbered-prefix deprecation. Re-base the sk-doc catalog/playbook leaf classifier in validate_document.py (both copies) from the number-anchored `^\\d{2}--` parent test to a structural test — the file sits in a SUBfolder of feature_catalog/ (resp. manual_testing_playbook/), so both the numbered NN--slug form and the de-numbered slug form validate during the transition while the root index file stays excluded. Adds a regression guard that FAILS when a NEW feature_catalog/NN--*/ or manual_testing_playbook/NN--*/ folder is introduced, so the deprecated numbered form is self-enforcing after Phase 004. No folders are renamed here."
trigger_phrases:
  - "number-agnostic leaf classification"
  - "no-new-numbers guard"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix"
_memory:
  continuity:
    packet_pointer: "sk-doc/014-sk-doc-parent/025-deprecate-numbered-category-prefix/002-validator-and-guard"
    last_updated_at: "2026-07-10T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored"
    next_safe_action: "Implement the classifier change"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Spec: Make validate_document.py Number-Agnostic + Add a No-New-Numbers Guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 025/002-validator-and-guard |
| **Level** | 2 |
| **Status** | Complete |
| **Phase** | 002 of 005 (foundation) |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
The sk-doc validator classifies a markdown file as `feature_catalog` / `playbook_feature` — running its taxonomy
and placeholder-row checks — **only when the file's immediate parent matches `^\d{2}--`**
(`.opencode/skills/sk-doc/scripts/validate_document.py:129,135` and the identical
`.opencode/skills/sk-doc/shared/scripts/validate_document.py:129,135`). That number-anchored test is the single
hard runtime dependency on the prefix (research.md, B): de-numbering a folder without changing it silently
downgrades every child to the generic `readme` type and drops the catalog/playbook checks. The prefix therefore
cannot be dropped folder-by-folder while this regex stands.

**Purpose:** change leaf classification to a *structural* test (per ADR-003) — "the file sits in a subfolder of
`feature_catalog/` (resp. `manual_testing_playbook/`), i.e. its parent is not the catalog/playbook root file
itself" — so both the numbered `NN--slug` form and the de-numbered `slug` form validate during the transition
and the root index file stays excluded. Add a regression guard (per ADR-005) that FAILS when a **new** numbered
category folder appears, making the de-numbered form self-enforcing after Phase 004. This is the change that
makes the whole migration safe; it must land before any folder is renamed (ADR-002).
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
**In scope — de-couple the classifier from the number and guard against its return:**
- `.opencode/skills/sk-doc/scripts/validate_document.py` — `detect_document_type()` (approx. lines 119–161):
  replace the `^\d{2}--` parent tests at `:129` (`manual_testing_playbook`) and `:135` (`feature_catalog`) with
  the structural "parent is a subfolder, not the catalog/playbook root" test.
- `.opencode/skills/sk-doc/shared/scripts/validate_document.py` — the identical `:129,135` tests; both copies
  change identically.
- `.opencode/skills/sk-doc/shared/assets/template_rules.json` **only if** it hard-codes the number in an
  executable rule. (Confirmed at authoring time: it does not — the `feature_catalog` / `playbook_feature`
  entries mention `NN--category` in prose `description` fields only; those are edited for accuracy, not
  behavior.)
- The new **no-new-numbers guard**: a check surfaced through the sk-doc validator / CI that FAILS on a freshly
  created `feature_catalog/NN--*/` or `manual_testing_playbook/NN--*/` folder and passes on a de-numbered one.

**Out of scope:** renaming existing folders (Phase 004); convention docs + `/create:*` generators (Phase 001);
the migration script (Phase 003); any non-sk-doc skill.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Both `validate_document.py` copies classify a **de-numbered** catalog/playbook leaf as its typed
  document (`feature_catalog` / `playbook_feature`), not the generic `readme`.
- **R2:** Both copies STILL classify the **numbered** `NN--slug` leaf as its typed document — tolerate-both
  during the transition (ADR-002/ADR-003).
- **R3:** The root `feature_catalog.md` / `manual_testing_playbook.md` index file stays **excluded** from leaf
  classification (its parent is the catalog/playbook root itself, not a subfolder).
- **R4:** The no-new-numbers guard **FAILS** on a freshly created `NN--` category folder and **PASSES** on a
  de-numbered one (ADR-005; grandfather nothing).
- **R5:** Existing sk-doc validator tests still pass — no regression in the current suite.
- **R6:** The two copies stay byte-identical in the changed region so no drift is introduced between
  `scripts/` and `shared/scripts/`.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. A de-numbered fixture leaf (`feature_catalog/<slug>/feature.md`, `manual_testing_playbook/<slug>/feature.md`)
   is classified `feature_catalog` / `playbook_feature`.
2. A numbered fixture leaf (`feature_catalog/NN--<slug>/feature.md`) is still classified as its typed document.
3. The root index file (`feature_catalog.md` / `manual_testing_playbook.md`) is NOT classified as a leaf.
4. A newly created `NN--` category folder trips the guard (non-zero / FAIL); a de-numbered one does not.
5. `validate.sh --strict` on this phase folder is Errors 0.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Risk:* the structural test over-broadens and classifies a non-leaf file (e.g. an asset that happens to sit
  under `feature_catalog/`) as a leaf → scope the test to real leaf files and cover it with a negative fixture.
- *Risk:* the two `validate_document.py` copies drift → change both identically and assert equality (R6).
- *Dependency:* independent of Phase 001; both are foundation and must land before Phase 003 authors against
  them and before Phase 004 renames any folder (sequencing invariant, ADR-002).
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None.
<!-- /ANCHOR:questions -->
