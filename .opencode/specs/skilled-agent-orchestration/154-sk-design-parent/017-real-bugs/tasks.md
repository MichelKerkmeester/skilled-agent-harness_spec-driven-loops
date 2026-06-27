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
    recent_action: "Enumerated the two-bug tasks from the 015 evidence"
    next_safe_action: "Regenerate the backend manifest, then patch the audit router loop"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-017-real-bugs"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 Read the md-generator `backend/package-lock.json` root metadata and `backend/README.md` dependency list (`.opencode/skills/sk-design/design-md-generator/backend/`)
- [ ] T002 Read the audit router scoring loop and its keyword/weight config in `design-audit/SKILL.md` (the `for keyword, weight in cfg["keywords"]:` loop over a string list)
- [ ] T003 Confirm the `../016-register-loader-contract` loader mechanism so the audit register-load reuses it rather than adding a second path
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Author `backend/package.json` reconciled from the lockfile root metadata and the documented dependencies, devDependencies, and bin (`.opencode/skills/sk-design/design-md-generator/backend/package.json`)
- [ ] T005 Fix the audit scoring loop so it iterates the keyword list and adds each intent's configured weight, making the router parseable and runnable (`.opencode/skills/sk-design/design-audit/SKILL.md`)
- [ ] T006 Ensure the audit router-replay loads `../shared/register.md` via the 016 loader mechanism (`.opencode/skills/sk-design/design-audit/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run `cd backend && npm install` and confirm it succeeds against the regenerated manifest
- [ ] T008 Parse the audit router and replay the five representative audit prompts, confirming `../shared/register.md` loads and each intent's weight applies
- [ ] T009 Run `validate.sh --strict` on this packet (0 errors)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `npm install` succeeds, the audit router parses and loads the register, and strict validation passes

### Status note

This packet is NOT STARTED. It scaffolds the two real bugs the 014 and 015 work surfaced: the md-generator backend missing `package.json`, and the audit router scoring loop that iterates a string list as if it held `(keyword, weight)` tuples while never loading the shared register. A later subagent regenerates the manifest, fixes the loop and the register load, and records the evidence.
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
