---
title: "Tasks: Apply opencode-go Cache/Affinity Compat Overlay [specs/hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat]"
description: "Ordered task list for creating the opencode-go session-affinity models.json overlay, wiring the runtime symlink, and documenting it."
trigger_phrases:
  - "opencode-go compat tasks"
  - "models.json overlay tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/013-apply-opencode-go-cache-compat"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "All tasks completed and verified"
    next_safe_action: "None; work complete"
    blockers: []
    key_files:
      - ".pi/models.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Apply opencode-go Cache/Affinity Compat Overlay

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending
- **P0** blocker · **P1** required · **P2** optional
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **P0** Confirm `~/.pi/agent/models.json` absent (no real file to clobber)
- [x] **P0** Inspect `models-store.json` opencode-go/deepseek-v4-pro compat (affinity/retention absent; reasoning/thinking present)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **P0** Create `.pi/models.json` with `providers.opencode-go.compat.sendSessionAffinityHeaders: true`
- [x] **P0** Create relative symlink `~/.pi/agent/models.json` → repo `.pi/models.json` (guarded against clobbering a real file)
- [x] **P1** Add `models.json` to the `SYNC.md` §2 symlinked-canonicals row
- [x] **P1** Add the overlay note under pi-cache-optimizer in `PLUGINS.md` (what/why, long-retention off, no credentials)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **P0** Strict JSON parse of `.pi/models.json` succeeds
- [x] **P0** `readlink -f ~/.pi/agent/models.json` resolves into the repo; affinity flag readable through the symlink
- [x] **P1** `validate.sh <child> --strict` passes; `validate.sh <parent> --recursive --strict` still passes
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- Overlay applied, symlinked, and documented; validation green. Long-retention intentionally deferred (see spec §7).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Summary: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
