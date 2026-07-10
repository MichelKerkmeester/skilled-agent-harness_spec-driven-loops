---
title: "Tasks: Isolated Install + CacheAligner Detector"
description: "Install Headroom in an isolated, telemetry-off environment and run CacheAligner (detector-only, never mutates) over captured prompts to produce a real findings report, cross-checked against the 002 manual audit."
trigger_phrases:
  - "cachealigner detector"
  - "headroom isolated install"
  - "cache aligner findings"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-headroom-utilization/004-cachealigner-detector"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded the cachealigner-detector phase"
    next_safe_action: "Stand up an isolated Headroom venv with telemetry off"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-28-029-004-cachealigner-detector"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Isolated Install + CacheAligner Detector

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

- [ ] T001 Create disposable venv; pip install minimal Headroom extras
- [ ] T002 Set clean-room env vars; verify no telemetry/update network calls
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 Capture a representative prompt; run CacheAligner.apply()
- [ ] T004 Assert input message bytes unchanged; collect VolatileFinding output
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T005 Write the findings report; reconcile with the 002 audit
- [ ] T006 Run validate.sh; STOP for review
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Report artifact written and `validate.sh` green
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
