---
title: "Tasks: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline [template:level_2/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "tasks"
  - "name"
  - "template"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "scaffold/004-doctrine-quick-wins"
    last_updated_at: "2026-06-15T14:06:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialized Level 2 template"
    next_safe_action: "Replace continuity placeholders"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-doctrine-quick-wins"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Doctrine quick-wins: fix the AGENTS.md dead hook pointer plus a pointer-resolution check, add an efficiency doctrine spine, and a scar-tissue cold-successor handoff discipline

<!-- SPECKIT_LEVEL: 2 -->

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

_A1 — dead pointer fix and fail-loud pointer-resolution check._

- [ ] T001 Rename the dead pointer at `AGENTS.md:217` from `references/hooks/skill-advisor-hook.md` to `references/hooks/skill_advisor_hook.md` (`AGENTS.md`). Verify: `grep -n skill_advisor_hook.md AGENTS.md` matches and no hyphenated form remains.
- [ ] T002 Apply the byte-identical pointer rename to its twin (`CLAUDE.md`). Verify: `diff -q AGENTS.md CLAUDE.md` reports no difference.
- [ ] T003 Create the fail-loud pointer check (`.opencode/skills/system-spec-kit/scripts/rules/check-doc-pointers.sh`): extract each `references/*.md` citation from AGENTS.md, stat each target against the repo root, exit non-zero listing missing targets, fail on a missing input file; make it executable. Verify: broken-fixture run exits non-zero and names the offender; repaired-tree run exits 0.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_A2 / A3 — efficiency doctrine spine and handover scar tissue._

- [ ] T004 Add the ~10-line efficiency doctrine spine to §1 of `AGENTS.md` (root conviction: spend lavishly where confirmation is cheapest to skip; two-register voice; letter-vs-intent). Verify: spine lines present; `wc -l AGENTS.md` at or under 500.
- [ ] T005 Mirror the identical spine into `CLAUDE.md`. Verify: `diff -q AGENTS.md CLAUDE.md` still reports no difference; `wc -l CLAUDE.md` at or under 500.
- [ ] T006 Extend the handover template (`.opencode/skills/system-spec-kit/templates/manifest/handover.md.tmpl`) with a scar-tissue traps ledger (blast site / reactivation trigger / load-bearing vs defensive) and a numbered cold-read order, preserving every existing HTML-comment anchor. Verify: `grep -n 'ANCHOR\|scar' handover.md.tmpl` shows the new section and the unchanged anchors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T008 Re-run `check-doc-pointers.sh` against the live repaired tree (expect exit 0) and confirm the byte-sync + budget invariants with `diff -q AGENTS.md CLAUDE.md` (clean) and `wc -l AGENTS.md CLAUDE.md` (each at or under 500).
- [ ] T009 Exercise the check's edge cases: pointer-absent input passes trivially, missing input file fails, and a second broken pointer is also reported (no stop-at-first).
- [ ] T010 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-phase-folder> --strict`, mark `checklist.md` items with evidence, and reconcile completion metadata across spec/plan/tasks/implementation-summary.
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

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->

