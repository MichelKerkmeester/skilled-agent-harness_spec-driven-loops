---
title: "Tasks: Phase 11: skdoc-doc-conformance"
description: "Completed tasks for the sk-doc conformance remediation of deep-alignment's own 83 shipped docs, the snake_case category-folder rename, and the build-state honesty reconcile."
trigger_phrases:
  - "sk-doc conformance tasks"
  - "deep-alignment doc remediation tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/059-deep-alignment-mode/011-skdoc-doc-conformance"
    last_updated_at: "2026-07-12T09:11:00Z"
    last_updated_by: "claude"
    recent_action: "All 13 tasks executed and verified"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
      - ".opencode/skills/system-deep-loop/deep-alignment/feature_catalog/"
      - ".opencode/skills/system-deep-loop/deep-alignment/manual_testing_playbook/"
      - ".opencode/skills/system-deep-loop/deep-alignment/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-skdoc-doc-conformance"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 11: skdoc-doc-conformance

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

- [x] T001 Run a parallel sk-doc conformance audit across all 83 `deep-alignment` markdown docs against their matching sk-doc create-* standards. Evidence: MAJOR_GAPS verdict, 4 P0, 13 P1, 11 P2, 25 clean.
- [x] T002 [P] Read the operator's snake_case category-folder-convention directive and scope it to this packet's category subfolders, excluding skill/mode-packet/spec folders and per-feature file slugs. Evidence: exception applied, `behavior_benchmark/` single-word subdirs left unchanged, skill/spec folders kept hyphenated.
- [x] T003 [P] Independently verify `/deep:alignment`, both YAML workflows, and `@deep-alignment` are BUILT and REGISTERED on disk before correcting any build-state doc language. Evidence: `mode-registry.json`'s `"alignment"` entry confirmed present.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Remediate `SKILL.md`: add `## 2. SMART ROUTING`, add `### ESCALATE IF`, add `## SUCCESS CRITERIA`, trim the frontmatter description from 226 to 120 characters, replace the stale REFERENCES placeholder. Evidence: validator's `missing_required_section: smart_routing` flips false to true.
- [x] T005 [P] Remediate `README.md`: add Feature Catalog and Manual Testing Playbook subsections to VERIFICATION. Evidence: both subsections present.
- [x] T006 Remediate `feature_catalog/` (root plus 21 leaves): rename `#### How It Works` to `#### Current Reality` across 21 entries, add `trigger_phrases` and `last_updated` to the root frontmatter, normalize Implementation `Layer`/Validation `Type` columns to the canonical taxonomy, add SOURCE METADATA blank lines, fix 5 paraphrased trigger_phrases. Evidence: `off_taxonomy_validation_type` warnings cleared on all 21 leaves.
- [x] T007 Remediate `manual_testing_playbook/` (31 files): insert the blank line before H3 under TEST EXECUTION, add feature-catalog cross-reference lines to SOURCE FILES on 17 files. Evidence: all 17 added links verified resolving.
- [x] T008 Remediate `references/` (4 contract docs): rename `## 1. Purpose` to `## 1. OVERVIEW`, fix a JSON-asset hyperlink, correct DAB-011's mis-cited "@deep-review Adversarial Self-Check" claim. Evidence: validator's blocking missing-overview cleared on all 4.
- [x] T009 Rename 12 category subfolders (4 under `feature_catalog/`, 8 under `manual_testing_playbook/`) from kebab-case to snake_case via `git mv` and rewrite 223 path references across 54 files. Evidence: 0 residual kebab-case path forms, 0 broken links, 0 cross-skill contamination.
- [x] T010 Correct 12 docs' stale "not yet built" build-state framing to the real BUILT-and-REGISTERED state, preserving 2 permanent design facts verbatim (`remediate-hook.cjs`'s no-op stub, the intentionally absent live-render known-deviations file). Evidence: 0 residual stale build-state claims outside those 2 permanent facts.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the final validator sweep across all 83 md docs. Evidence: 71 valid; the only 12 invalid are the documented `behavior_benchmark` "missing overview" false positive, explicitly out of scope.
- [x] T012 [P] Run the final relative-link check across the packet's docs. Evidence: 224/224 links resolve, 0 broken.
- [x] T013 Confirm 0 residual stale build-state claims outside the 2 flagged permanent design facts. Evidence: manual sweep confirms clean.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed, see Phase 3 evidence above and `implementation-summary.md` Verification table
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
