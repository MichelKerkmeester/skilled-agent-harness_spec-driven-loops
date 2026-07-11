---
title: "Implementation Summary: Completion Evidence Sentinel (planning stub)"
description: "Planning stub for the completion-evidence sentinel. The phase is planned and not yet implemented. No completion claims."
trigger_phrases:
  - "completion evidence sentinel summary"
  - "completion sentinel planning stub"
  - "sentinel not yet implemented"
  - "completion backstop status"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-plugin-hook-implementation/004-completion-evidence-sentinel"
    last_updated_at: "2026-07-11T06:21:17.573Z"
    last_updated_by: "spec-author"
    recent_action: "Authored Level 3 planning stub for the sentinel phase"
    next_safe_action: "Draft after the core and adapters are built and verified"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/hooks/completion-evidence-sentinel.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts"
      - ".opencode/plugins/mk-completion-sentinel.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/004-completion-evidence-sentinel"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Completion Evidence Sentinel

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

> **Planning stub.** This phase is planned and not yet implemented. Nothing here is a completion claim. This document will be filled in after the core, both adapters, and the first unit test are built and verified.

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-completion-evidence-sentinel |
| **Status** | Planned (not yet implemented) |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is at the planning stage.

### Intended Deliverables

The build will produce a runtime-neutral policy core and two thin runtime adapters that advise when a completion claim outruns recorded evidence, without executing anything:

- A shared core `completion-evidence-sentinel.cjs` that gates on a completion claim plus a resolved spec folder, evaluates recorded evidence, dedups, and appends to a bounded log.
- A Claude adapter that extends the existing `Stop` owner `session-stop.ts` after its atomic state write.
- An OpenCode `session.idle` adapter `mk-completion-sentinel.js` that resolves the last message and packet via `ctx.client`.
- A core unit test that proves the policy and the no-test guarantee.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. See `plan.md` for the intended core-then-adapters sequence and `tasks.md` for the task breakdown.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Shared runtime-neutral core plus two thin adapters | One policy and one log path across two runtimes; mirrors the proven deep-loop guard shape |
| Advisory and fail-open, no block in v1 | The claim detector is broad, so blocking on it would interrupt correct work |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Implementation | Not started; planning stub only |
| Planned: `vitest completion-evidence-sentinel.vitest.ts` | Not written yet; will prove fixture A advises, fixture B is `ok` |
| Planned: `validate.sh <folder> --strict` | Not yet run against a completed build |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented.** This is a planning stub. The OpenCode `session.idle` half is the follow-on, since that event carries neither the last assistant message nor the transcript and the adapter must resolve them via `ctx.client`.
<!-- /ANCHOR:limitations -->
