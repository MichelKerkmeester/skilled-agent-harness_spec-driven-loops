---
title: "Implementation Summary"
description: "This packet is specified and not started: it records the router shape, the three mutation classes, the contract suite and the generated surfaces it will refresh."
trigger_phrases:
  - "agents md plumbing implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Recorded the specification state; implementation has not started"
    next_safe_action: "Start with the contract suite once both engines answer"
    blockers:
      - "Waits on /doctor:sk-skill (packet sk-doc/075-doctor-sk-skill-command) landing on main"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-command-plumbing |
| **Completed** | Not started |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing is built. This packet holds the specification, the plan and the acceptance criteria for the surface that makes the two engines reachable, and no file has been written against it.

### Phase 4: command plumbing

When it is built, `/doctor:agents-md` will run the check, take an embed through a plan and a yes, and restore a run from its backup, with the same router shape, phrase rule, mutation class and setup row every sibling command already carries.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/agents-md.md` | Planned create | Router, six canonical sections |
| `.skilled/commands/doctor/assets/doctor-agents-md-check.yaml` | Planned create | Read-only workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-embed.yaml` | Planned create | Plan-then-yes workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-restore.yaml` | Planned create | Restore workflow |
| `.skilled/commands/doctor/assets/doctor-agents-md-presentation.txt` | Planned create | Presentation templates |
| `.skilled/commands/doctor/_routes.yaml` | Planned modify | Three routes and the header list |
| `.skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | Planned create | The contract suite |
| Generated advisor blocks, mirrors and prompt stubs | Regenerate | Never hand-edited |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The baseline route count and the six baseline commands were captured on this worktree at `006d96370d` and are recorded in `spec.md` section 2; they are re-measured when implementation starts.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The router copies the read-only exemplar's six sections | The family already asserts that shape, so a different shape would be a second convention |
| The advisor bridge ships inactive | Activation shifts scoring for every prompt, and the exemplar ships inactive too |
| The generated surfaces are never hand-edited | A hand edit is reverted by the next generation run, silently |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/commands/doctor/scripts/route-validate.sh` | NOT RUN for this child; the pre-implementation figure is `OK: route-validate — 19 routes validated, 3 warnings` |
| `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` | PENDING: suite does not exist yet |
| Every generator `--check` | PENDING: the surfaces do not exist yet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Discovery depends on the operator knowing the name.** The bridge stays inactive, so the command is reachable by name and through the setup list, not through advisor routing.
<!-- /ANCHOR:limitations -->

---
