---
title: "Implementation Summary: OpenCode Route-Line Bounding"
description: "Planned, not yet built. This packet documents the intended bounded compiled-route renderer, reveal path, and receipt registration ahead of implementation."
trigger_phrases:
  - "route line bounding not yet built"
  - "compiled route cap placeholder"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Authored the forward-looking not-yet-built implementation placeholder"
    next_safe_action: "Implement the bounded renderer per plan.md Phase 2 once phase 001 ships"
    blockers:
      - "Blocked on phase 001's policy-plan.ts registry landing first"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: OpenCode Route-Line Bounding

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-opencode-route-line-bounding |
| **Completed** | Not yet completed - planning only |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This packet is a planning spec: `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` describe the intended bounded-rendering branch for `renderCompiledRouteSummaryLine`, its independent off-by-default flag, its reveal/clarification accessor for truncated target lists, and its registration under phase 001's canonical block-ID scheme as `runtime.opencode-compiled-route.v1`. None of these changes exist in `.opencode/plugins/mk-skill-advisor.js` yet, and this phase does not begin implementation until phase `001-measurement-and-receipts-foundation` ships its `policy-plan.ts` registry.

### Planned Files (not yet created)

| File | Planned Action | Purpose |
|------|-----------------|---------|
| `.opencode/plugins/mk-skill-advisor.js` | Modify | Bound `renderCompiledRouteSummaryLine`; add the flag and reveal path |
| `.opencode/plugins/tests/mk-skill-advisor.test.cjs` | Modify | Bounded/flag-off-parity/reveal-path test cases |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts` | Modify | Register `runtime.opencode-compiled-route.v1` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not applicable yet. `plan.md` section 4 lays out the intended delivery order: (1) confirm phase 001's registry is available and capture the target-count distribution to choose a cap, (2) implement the flag, the bounded branch, the reveal accessor, and the receipt registration, (3) prove flag-off parity, target recoverability, and digest stability with fixtures, then run the full plugin test suite. When implementation lands, this section will be rewritten to describe what was actually delivered, replacing this forward-looking description.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bound presentation only, never route resolution | This phase must not change which targets are chosen, only how the target list is rendered - keeps the blast radius to a rendering concern |
| Independent flag, off by default | Matches the parent program's flag-gated, never-combined activation discipline; this candidate can ship and be evaluated without touching phases 003/004 |
| Reveal path recovers everything bounding omits | Research.md explicitly rules out losing required target names as an acceptable trade; the reveal path is the guardrail that keeps bounding safe |
| Hash the full target list, not the bounded rendering | The `runtime.opencode-compiled-route.v1` receipt must reflect ground truth regardless of which render mode is active, so parity checks stay meaningful |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Bounded-line target recoverability fixture in `mk-skill-advisor.test.cjs` | Not yet run |
| Flag-off byte-identical parity fixture in `mk-skill-advisor.test.cjs` | Not yet run |
| Digest-stability fixture pair in `mk-skill-advisor.test.cjs` | Not yet run |
| Full `mk-skill-advisor.test.cjs` suite regression check | Not yet run |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This is a planning artifact, not a shipped fix.** No code exists yet; every row above is a planned action, not a completed one.
2. **This phase is blocked on phase `001-measurement-and-receipts-foundation`.** Implementation cannot register `runtime.opencode-compiled-route.v1` or prove byte-stable parity until 001's `policy-plan.ts` registry exists.
3. **The bounding cap value is not chosen yet.** `spec.md` §7 leaves the exact cap and digest order-sensitivity open, to be resolved from phase 001's fixture data rather than fixed in advance.
<!-- /ANCHOR:limitations -->
