---
title: "Implementation Summary: OpenCode plugin browsability symlinks"
description: "Planned-state record for the OpenCode plugin symlink mirror phase: not yet built. This document records the intended shape (7 relative symlinks + README updates) ahead of implementation, per phase-authoring order in the parent packet plan."
trigger_phrases:
  - "opencode symlink summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/032-goal-hooks-cross-runtime/007-opencode-plugin-symlinks"
    last_updated_at: "2026-07-28T20:35:00Z"
    last_updated_by: "claude"
    recent_action: "Authored spec/plan/tasks/implementation-summary scaffold for this phase"
    next_safe_action: "Implement per tasks.md once phases 001-006 are ready or this phase is picked up independently"
    blockers:
      - "Not yet built; this doc records the planned shape only."
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "goal-hooks-cross-runtime-20260728"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-opencode-plugin-symlinks |
| **Completed** | Not yet built |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not yet delivered. This document records the planned shape ahead of implementation, per the parent packet's authoring order (author all 8 phase children first, then implement 001->008 in order).

Once implemented, this phase will add 7 relative symlinks inside the `opencode/` subfolder of the relevant concern/skill hook folders, each pointing back at the real OpenCode plugin file that must remain in `.opencode/plugins/` for OpenCode's plugin discovery to find it:

- `.opencode/hooks/dispatch/opencode/mk-cli-dispatch-audit.js`
- `.opencode/hooks/mcp-route-guard/opencode/mk-mcp-route-guard.js`
- `.opencode/hooks/post-edit-quality/opencode/mk-post-edit-quality.js`
- `.opencode/hooks/task-dispatch/opencode/mk-deep-loop-guard.js`
- `.opencode/hooks/goal/opencode/mk-goal.js`
- `.opencode/skills/system-spec-kit/mcp-server/hooks/opencode/mk-spec-gate.js`
- `.opencode/skills/sk-git/scripts/hooks/opencode/mk-git-preflight-advisory.js`

Plus documentation updates to `.opencode/hooks/README.md`, the 4 affected concern READMEs, and the 2 skill-owned hook READMEs.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Per `plan.md`, delivery will proceed as: confirm real plugin targets exist unmodified -> create the 7 relative symlinks -> update the 7 affected READMEs -> verify symlink resolution and doc validation -> confirm zero double-load with a live OpenCode session.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Symlinks point from the hooks tree into `.opencode/plugins/`, reversing the Pi pattern used elsewhere in the same tree. | OpenCode's plugin discovery only scans `.opencode/plugins/`; the real file cannot move, so the browsability mirror has to run in the opposite direction from Pi's `.pi/extensions/` symlinks. |
| The `goal/opencode/mk-goal.js` row is included in this phase rather than deferred to a later one. | Phase 001's `.opencode/hooks/goal/` concern folder already exists as a real, populated directory at spec-authoring time, so the stated dependency is already satisfied. |
| Live OpenCode session required before claiming REQ-004 satisfied. | Documentation states plugin discovery scans only `.opencode/plugins/`, but this must be confirmed live rather than assumed, since a wrong assumption here would silently double-fire a guard hook. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Symlink resolution (`readlink -f` on all 7) | Not yet run |
| `git status` on `.opencode/plugins/` clean | Not yet run |
| `validate_document.py` on touched READMEs | Not yet run |
| Live OpenCode session, zero double-load | Not yet run |
| This packet's own `validate.sh --strict` | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet built.** This phase has only been scaffolded (spec/plan/tasks/implementation-summary authored); no symlink, README edit, or verification step has been executed.
2. **Live OpenCode double-load confirmation is the one requirement that cannot be satisfied by static analysis alone.** Documentation review can suggest OpenCode only scans `.opencode/plugins/`, but only a live session run proves it; this phase's success criteria explicitly require the live check.
<!-- /ANCHOR:limitations -->
