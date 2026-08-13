---
title: "Tasks: Reconcile the numbered-H2 divider and TOC/anchor conventions across the structured .md fleet"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "divider anchor tasks"
  - "fleet normalization tasks"
  - "validate_document tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/029-doc-divider-and-anchor-standard"
    last_updated_at: "2026-08-13T06:10:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across 3 phases"
    next_safe_action: "Begin T001 after operator approval"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-029-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Reconcile the numbered-H2 divider and TOC/anchor conventions across the structured .md fleet

<!-- SPECKIT_LEVEL: 3 -->

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
## Phase 1: Ratify the standard

- [x] T001 Record the ratified rule in `decision-record.md` (bare numbered-H2: no TOC, no nav-anchors, `---` between numbered ALL-CAPS H2) — ADR-001 Accepted
- [x] T002 Reconciled `hvr-rules.md` §9 wording (deepseek-flash): dropped the "with anchors" / "TOC entries … with correct anchors" endorsements in favor of "numbered ALL CAPS, separated by `---`" + "No Table of Contents and no `<!-- ANCHOR -->` navigation comments". `core-standards.md` already consistent (no change).
- [ ] T003 [P] Empirically confirm GitHub slug output for `## 1. OVERVIEW` (single vs double dash) and note it in `research.md`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Enforce in the validator (DONE — gpt-5.6-luna, verified)

- [x] T004 Negative + positive fixtures + test added under `scripts/tests/structure/` and `test_structure_validation.py` (4 cases pass)
- [x] T005 General-path `validate_general_structure()` in `validate_document.py`: fence-aware, HTML-comment-transparent, ALL-CAPS-only, gated by `SKDOC_ENFORCE_STRUCTURE` (default OFF = CI-safe)
- [x] T006 README/skill-doc TOC + `<!-- ANCHOR -->` nav prohibition in the general path; spec-type continuity anchors confirmed exempt
- [x] T007 `template-rules.json` flags added (`h2DividerRequired` / `tocForbidden` / `anchorNavigationForbidden`)
- [x] T008 Dry-run (flag ON, read-only): 993 ALL-CAPS files flagged / 2,671 gaps, reconciles to the 1,016-file census baseline (delta = 23 mixed-case-heading files, out of ALL-CAPS scope)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Normalize the fleet (dividers DONE; TOC/anchor strip pending)

- [x] T009 Triaged the 54 `<!-- ANCHOR -->` files: most are FUNCTIONAL (spec-doc `level-*` templates, deep-research state, command tooling) or prose mentions — only 7 system-spec-kit folder READMEs/contracts carry vestigial TOC + nav-anchors. Strip scoped to exactly those 7.
- [x] T010 [P] Added missing `---` dividers via a deterministic insert-only fixer (`scratch/fix_dividers.py`): 993 files / 2,642 gaps (strict ALL-CAPS) + 16 files / 26 gaps (ALL-CAPS with lowercase parenthetical qualifier, per operator scope choice) = 1,009 files / 2,668 gaps. Content-preservation proven on clean HEAD copies (0 content lost); deepseek-flash read-only audit confirmed non-destructive. Detection widened via `_section_caps_ignoring_qualifier`. Strict round committed in `947f8a6b58`; widening round on disk, uncommitted.
- [x] T011 [P] Stripped TOC + standalone nav-anchor lines from the 7 files (gpt-5.6-luna), removals-only (0 additions). Also fixed the anchor-nav check to only flag standalone `<!-- ANCHOR:… -->` lines, not prose/inline-code mentions (was false-positiving on docs that describe the syntax).
- [x] T012 Full flag-on dry-run across 8,627 files: general_h2_separator=0, general_no_toc=0, general_no_anchor=0. 60 genuinely-title-case gaps (e.g. `## 1. first failing stage:`, function-signature headings) intentionally OUT of scope per operator choice.
- [ ] T013 READY (0 blocking proven) but HELD: flipping `SKDOC_ENFORCE_STRUCTURE` to default-on makes the rule blocking repo-wide. Deferred to a quiet window / operator go-ahead — with ~7 sessions actively committing (drift reappeared mid-run), flipping now would fail their in-flight drifted docs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Negative control fails before the fix and passes after
- [ ] `007-valid-anchors` fixtures pass unchanged
- [ ] Census reports 0 gaps and 0 vestigial TOC/anchors
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Investigation**: See `research.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
