---
title: "Tasks: sk-design two real bugs (md-generator manifest and audit router)"
description: "Task list for the two real bugs: regenerate the backend package.json and fix the audit router scoring loop plus its shared-register load. Not started."
trigger_phrases:
  - "sk-design real bugs tasks"
  - "audit router loop fix tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/017-real-bugs"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Restored the backend manifest and fixed the audit scoring loop, verified"
    next_safe_action: "Move to 018 routing wiring"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design two real bugs (md-generator manifest and audit router)

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

- [x] T001 Read the md-generator backend lockfile root metadata and README dependency list (`.opencode/skills/sk-design/design-md-generator/backend/`)
- [x] T002 Read the audit router scoring loop and its keyword config in `design-audit/SKILL.md` (the `for keyword, weight in cfg["keywords"]:` loop over a string list)
- [x] T003 Confirmed the 016 loader mechanism so the audit register-load reuses the always-loaded `DEFAULT_RESOURCE` slot rather than a second path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Authored `backend/package.json` reconciled from the lockfile (name, version, deps, devDeps) plus build, typecheck, test and the three ts-node pipeline scripts, marked private for an internal backend (`.opencode/skills/sk-design/design-md-generator/backend/package.json`)
- [x] T005 Fixed the audit scoring loop to iterate the keyword list and add each intent's configured weight, matching the correct foundations and motion template (`.opencode/skills/sk-design/design-audit/SKILL.md`)
- [x] T006 The audit register loads via the 016 `DEFAULT_RESOURCE` slot. Also closed a 016 spillover: the audit, foundations and motion pseudocode (path guard, default-load loop, resource bases) now agree with the register living in the sibling shared dir (`.opencode/skills/sk-design/design-{audit,foundations,motion}/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 `npm install` succeeds against the regenerated manifest (dry-run up to date, `npm ls` clean) and the backend vitest suite passes 68 of 68
- [x] T008 The audit router parses and replays correctly: the gate scores 100 with 0 escapes, the register loads with 0 missing, and the fixed scoring routes four representative prompts to the right intent with positive weighted scores
- [x] T009 `validate.sh --strict` on this packet passes with 0 errors and 0 warnings
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks complete
- [x] No blocked tasks remaining
- [x] `npm install` succeeds, the audit router parses and loads the register and scores correctly, and strict validation passes

### Status note

COMPLETE. The md-generator backend `package.json` was reconstructed from the lockfile so `npm install` works again and the backend suite passes 68 of 68. The audit router scoring loop was fixed to weight keyword hits correctly; it previously tried to unpack each keyword string as a `(keyword, weight)` tuple and would crash on any keyword longer than two characters. While fixing the audit router, the audit, foundations and motion prose pseudocode was also brought into line with the 016 register loading: the path guard sanctions the sibling shared dir, the default-load iterates the list, and the resource bases no longer glob the shared dir. All four mode router blocks compile, the gate scores 100 with 0 escapes on all five modes, and packaging passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See `../015-per-skill-improvement-research/005-md-generator` and `../015-per-skill-improvement-research/004-audit` lineage research
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
