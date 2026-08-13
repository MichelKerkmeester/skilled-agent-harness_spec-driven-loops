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
- [ ] T002 Reconcile `hvr-rules.md` §9 wording so it stops endorsing TOC + anchors on general docs
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

- [ ] T009 Triage the ~54 `<!-- ANCHOR -->` files into a keep (continuity) vs strip (nav) allowlist
- [x] T010 [P] Added missing `---` dividers via a deterministic insert-only fixer (`scratch/fix_dividers.py`): 993 files / 2,642 gaps (strict ALL-CAPS) + 16 files / 26 gaps (ALL-CAPS with lowercase parenthetical qualifier, per operator scope choice) = 1,009 files / 2,668 gaps. Content-preservation proven on clean HEAD copies (0 content lost); deepseek-flash read-only audit confirmed non-destructive. Detection widened via `_section_caps_ignoring_qualifier`. Strict round committed in `947f8a6b58`; widening round on disk, uncommitted.
- [ ] T011 [P] Strip vestigial TOC (7 files) and nav-anchors; normalize any remaining single-dash slugs per the T003 finding
- [~] T012 Re-run census: in-scope divider gaps = 0 (done). 60 genuinely-title-case gaps (e.g. `## 1. first failing stage:`, function-signature headings) intentionally OUT of scope per operator choice. TOC/nav-anchor count pending T009/T011.
- [ ] T013 After T011, flip `SKDOC_ENFORCE_STRUCTURE` to default-on (blocking) — NOT before, or the un-stripped TOC files fail
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
