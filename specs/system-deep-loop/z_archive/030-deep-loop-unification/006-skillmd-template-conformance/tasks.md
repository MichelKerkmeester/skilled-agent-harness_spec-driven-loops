---
title: "Tasks: SKILL.md Template Conformance — system-deep-loop"
description: "Task ledger for the SKILL.md template conformance audit and fix pass."
trigger_phrases:
  - "deep loop skillmd conformance tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/006-skillmd-template-conformance"
    last_updated_at: "2026-07-08T18:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "All tasks complete, verified with real evidence"
    next_safe_action: "None — packet complete"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "deep-loop-unification-052-006"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: SKILL.md Template Conformance — system-deep-loop

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

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

- [x] T001 Run `package_skill.py --check` against all 4 workflow packets — all PASS structurally; soft warnings only.
- [x] T002 Run `package_skill.py --check` + `parent-skill-check.cjs` against the hub — 34/34 hard invariants pass, 0 warnings; the leaf checker's 1 warning confirmed a false positive (hub deliberately has no `references/`/`assets/` to route by runtime key, per its own registry-driven design).
- [x] T003 Scope the blast radius of renaming 131 flagged deep-improvement asset files (glob-discovered vs hardcoded-referenced; embedded case-IDs vs pure filenames) before touching anything.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Generate a deterministic old→new snake_case mapping (basenames only, directories untouched) and `git mv` all 131 files; re-check confirms snake_case warnings dropped from 132 to 1 (`.gitkeep` edge case, not a real violation).
- [x] T005 [P] Fix embedded JSON content (scenarioId fields in 98 renamed skill-benchmark fixtures; fixture-array stems in 7 model-benchmark profile files, including 5 not originally named in scope; missing frontmatter added to `routing_precision.md`).
- [x] T006 [P] Fix every live path/prose reference to a renamed file across the repo (23 files: docs + hardcoded test paths), leaving closed historical records untouched.
- [x] T007 [P] Fix missing `version` frontmatter on 4 `deep-improvement` changelog files.
- [x] T008 [P] Trim `deep-research/SKILL.md` (3260→2894 words) by moving detail to `references/`, preserving all operational content.
- [x] T009 [P] Trim `deep-review/SKILL.md` (3545→2931 words), same method.
- [x] T010 [P] Trim `deep-improvement/SKILL.md` (4586→2844 words), same method.
- [x] T011 Fix the 2 real remaining stale references + 1 missing version field an independent verification pass found (README.md directory-tree example, `routing_precision.md` prose + frontmatter, 1 cosmetic test comment).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Independent agent re-runs `package_skill.py --check` on all 4 packets + hub, `parent-skill-check.cjs` on the hub, greps for remaining stale references, spot-checks fixture-id consistency and config resolution, spot-checks no content was lost from the SKILL.md trims, and runs the skill-benchmark vitest suite (verdict: PASS WITH MINOR FINDINGS — 2 stale references + 1 missing version field; 2 pre-existing test failures confirmed unrelated via git-stash-against-clean-HEAD).
- [x] T013 Re-ran all 5 checkers + the vitest suite after the final fixes: 5/5 PASS (deep-improvement's only remaining warning is the accepted `.gitkeep` edge case), hub still 0 warnings, 0 stale references, same pre-existing 44/46 vitest baseline (2 failures unrelated, unchanged).
- [x] T014 Write `implementation-summary.md` and `checklist.md` with real evidence; run `validate.sh --strict` on this packet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] `validate.sh --strict` exits 0 for this folder.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Precedent**: `../005-validation-and-closeout/`
<!-- /ANCHOR:cross-refs -->
