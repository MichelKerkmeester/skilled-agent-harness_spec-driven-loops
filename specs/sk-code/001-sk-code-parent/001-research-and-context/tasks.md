---
title: "Tasks: Phase 1 — research and context"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "sk-code research and context tasks"
  - "two-track deep loop tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/001-sk-code-parent/001-research-and-context"
    last_updated_at: "2026-07-03T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Author phase-1 tasks"
    next_safe_action: "Run setup tasks (confirm executor + write both configs)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bootstrap-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1 — research and context

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

- [x] T001 Read `cli-opencode/SKILL.md`; confirmed `openai/gpt-5.5-fast --variant high`; provider pre-flight PASS (OpenAI configured)
- [x] T002 Track R lineage = GPT-5.5 solo (pattern already settled → applied research, not open-ended fan-out)
- [x] T003 Write `research/deep-research-config.json` (single gpt55fast lineage, 12-iter cap)
- [x] T004 Write `context/deep-context-config.json` (C1–C5 targets, sweep scope)
- [x] T005 Capture the seed-input reconnaissance as Track C starting notes (spec §Phase Context)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Executor wiring verified via provider pre-flight + self-invocation guard (bounded real dispatch subsumes the smoke)
- [x] T007 Track R: GPT-5.5-fast dispatch complete (clean stop, 33 reads) → R1–R5 recommendation extracted to `research/gpt55-taxonomy-recommendation.md`
- [x] T008 Track C: `context/context-map.md` produced from two-scout reconnaissance (verify advisor-rebuild in execution)
- [ ] T009 Merge both tracks into one decision-ready recommendation summary
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Verified Track R clean stop + `research.md` citations to real sk-code / sk-code-review / sk-design / pattern lines
- [x] T011 `context-map.md` cross-checked against the scout repo-wide ripgrep inventory (a final fresh `rg` is recommended at cutover, phase 007)
- [x] T012 Merged synthesis written (`research/research.md`); STOPPING for human review at the 002 gate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Research + context deliverables ready for the 002 human-review gate
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
