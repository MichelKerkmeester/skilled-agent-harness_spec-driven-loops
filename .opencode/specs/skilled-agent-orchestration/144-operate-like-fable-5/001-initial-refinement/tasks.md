---
title: "Tasks: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "fable 5"
  - "tasks"
  - "operating doctrine"
  - "constitutional rules"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-operate-like-fable-5"
    last_updated_at: "2026-06-14T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored Level 2 tasks for the Fable 5 distribution work"
    next_safe_action: "Owner decision on Barter git-posture contradiction"
    blockers: []
    key_files:
      - "AGENTS.md"
      - ".opencode/skills/system-spec-kit/constitutional/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Distribute Fable 5 Operating Doctrine Across Spec-Kit Surfaces

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

Research & validation — establish the evidence base before any edit.

- [x] T001 Run a deep-research loop over Fable5.md and the current stack (cli-codex gpt-5.5, reasoning_effort=xhigh, service_tier=fast, max 10 iterations)
- [x] T002 Reach convergence (5 iterations; 5/5 questions answered; newInfoRatio fell to 0.08)
- [x] T003 Capture the canonical synthesis (`research/research.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Surgical edits across the enforced surfaces.

- [x] T004 Add the Operating Discipline subsection to §1 of the Public root `AGENTS.md` (+13 → 446) (`AGENTS.md`)
- [x] T005 Verify the byte-identical `CLAUDE.md` twin auto-synced (`CLAUDE.md`)
- [x] T006 Add the read-only-git variant of the subsection (+13 → 467) (`Barter/ai-speckit/coder/AGENTS.md`)
- [x] T007 Create `regression-baseline-and-delta.md`, Public + Barter mirror (`.opencode/skills/system-spec-kit/constitutional/regression-baseline-and-delta.md`)
- [x] T008 Create `finding-is-a-hypothesis.md`, Public + Barter mirror (`.opencode/skills/system-spec-kit/constitutional/finding-is-a-hypothesis.md`)
- [x] T009 Fold a 5th "How to apply" bullet for non-git outward/irreversible actions (`.opencode/skills/system-spec-kit/constitutional/main-branch-direct-push.md`)
- [x] T010 Add the Baseline & blast-radius line after the Iron Law (`.opencode/skills/sk-code/SKILL.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Confirm `diff AGENTS.md CLAUDE.md` is clean and both AGENTS files are under the ~500-line budget
- [x] T012 Confirm the subsection and both rule files are present across all surfaces (Public + Barter, + `.claude` mirror)
- [x] T013 [B] Re-index constitutional rules into spec-memory — blocked by a pre-existing stale spec-memory dist; deferred to the next daemon scan
- [x] T014 Drop the two superseded embeddings (sk-git, orchestrate.md) after reading the files, and record why in the implementation summary
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All non-blocked tasks marked `[x]`
- [x] The single `[B]` task (constitutional re-index) has a documented deferral reason and owner-visible follow-up
- [x] Verification checks passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
