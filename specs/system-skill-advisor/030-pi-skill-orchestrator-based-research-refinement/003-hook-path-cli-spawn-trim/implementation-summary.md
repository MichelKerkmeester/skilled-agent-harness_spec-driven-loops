---
title: "Implementation Summary: Hook Path CLI Spawn Trim"
description: "Not started. This phase is planned: the hook-side CLI caller will stop paying for compiled-route children it never reads, and casual prompts will stop spawning the advisor CLI."
trigger_phrases:
  - "hook path cli spawn summary"
  - "casual prompt gate summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/003-hook-path-cli-spawn-trim"
    last_updated_at: "2026-09-26T11:10:00Z"
    last_updated_by: "orchestrate"
    recent_action: "Planned R2 and R5 with verified code anchors, including the stale-daemon retry"
    next_safe_action: "Wait for 002 to ship its durationMs baseline, then start with T001"
    blockers:
      - "002-hook-deadline-and-diagnostics has not shipped, so REQ-006 has no baseline"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-030-orchestrate"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Research Q2: the operator chose to fix the docs to match the CLI-only hook."
      - "Only the OpenCode plugin reads compiledRoute; the hook-side caller never does."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Hook Path CLI Spawn Trim

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-hook-path-cli-spawn-trim |
| **Completed** | Not started |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is planned and waits on 002.

### Planned change

Hook turns will stop starting `compiled-route.cjs` children whose output nothing on the hook path reads, and prompts the casual-prompt gate declines will cost no advisor CLI spawn. The OpenCode plugin keeps its compiled-route line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | None | The planned files are listed in `spec.md` section 3 |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning checks so far read the code: the hook-side caller has no `compiledRoute` reference, the plugin reads it at `.skilled/plugins/system-skill-advisor.js:606` and `:1347`, and `shouldFireAdvisor` has no live caller since `a87379aa610`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The option travels in the request, not in an environment variable | The handler runs in the daemon, where a hook-side variable cannot reach |
| The CLI retries once without the option when an older daemon rejects it | Both sides report protocol `'1'`, so the handshake cannot catch a daemon still running the old strict schema |
| Reconnect the gate rather than delete it | The commit that disconnected it says nothing visible changed, so its loss reads as a side effect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Tests and typecheck | Not run. The phase is not implemented |
| `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement --strict --recursive` | RESULT: PASSED on the planning docs, 0 errors |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The retry's trigger is read from code, not observed.** T002 records the error an older daemon actually returns before T009 is written.
<!-- /ANCHOR:limitations -->

---
