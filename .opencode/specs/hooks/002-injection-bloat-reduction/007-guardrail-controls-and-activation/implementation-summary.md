---
title: "Implementation Summary [Planned]: Guardrail Controls and Activation Gate"
description: "Placeholder: nothing in this packet has been implemented yet. Previews the planned behavioral negative-control suite and per-runtime-per-candidate activation gate before any code changes land."
trigger_phrases:
  - "guardrail activation gate implementation summary"
  - "behavioral negative control not yet built"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Recorded the not-yet-built placeholder for the guardrail activation gate"
    next_safe_action: "Begin Phase 1 control specification once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:fd97f2759de9c32d07ba58473acb68e10a76848d5896ddcb7caff605e6adc0fb"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-guardrail-controls-and-activation |
| **Completed** | Not yet implemented (Planned) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. No negative-control suite, activation matrix, or rollback procedure has been created as a result of this packet. This document previews the planned terminal gate so a future implementer or reviewer can see exactly what 007 will deliver before any candidate is activated.

### Guardrail Controls and Activation Gate (Planned)

Once built, this packet will provide the terminal behavioral negative-control suite (a REAL forbidden code comment reject, an unsupported-completion-claim block against `render.ts`'s proof-over-appearance directive, and scored governor scenarios) and the per-runtime-per-candidate activation matrix that candidates 002-006 must each pass before turning on in production. Every runtime x candidate cell without both behavioral and delivery evidence defaults to full baseline emission (fail-open), and every activated cell carries a documented per-block rollback: disable the flag, clear delivery state, restore full emission.

### Files Planned

| File | Planned Action | Purpose |
|------|--------|---------|
| Guardrail negative-control suite (path confirmed in Phase 1) | Create (not yet started) | Forbidden-comment reject, unsupported-completion block, governor scored scenarios |
| Per-runtime-per-candidate activation matrix (path confirmed in Phase 1) | Create (not yet started) | Six-runtime x five-candidate grid with pass/fail evidence and fail-open default |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The planned verification path is: execute the three behavioral negative controls against real guards, populate the activation matrix with placeholder unknown-state cells and confirm every one defaults to emit, and work one hypothetical candidate cell through the rollback procedure end-to-end as proof before this gate is handed to candidates 002-006 for their own evidence submission.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Require BOTH behavioral and delivery evidence before any cell activates | Byte savings alone proved insufficient across this whole program; the research is explicit that unknown state must always emit |
| Score the governor test against behavior, not the directive's exact string | An exact-string test would break on any future wording change and would not actually prove the governor still functions |
| Make rollback per-block and per-runtime, never global | A regression on one runtime x candidate cell must not force disabling every other cell; isolating rollback keeps the blast radius scoped |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Forbidden-comment reject negative control (real guard) | Not yet run (Planned) |
| Unsupported-completion-claim block negative control (real guard) | Not yet run (Planned) |
| Governor scored-scenario test | Not yet run (Planned); no `vitest` run has been executed yet |
| Fail-open default on placeholder unknown-state cells | Not yet run (Planned) |
| Worked rollback example (one hypothetical cell) | Not yet run (Planned) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This entire packet is in the planning stage; no negative-control suite, activation matrix, or rollback procedure exists yet.
2. **Blocked on Phase 001.** Activation depends on the canonical block IDs, hashes, and delivery-receipt fields that 001-measurement-and-receipts-foundation is expected to supply; the gate schema itself can be designed now.
3. **This gate alone activates nothing.** Every runtime x candidate cell still needs its owning candidate (002-006) to supply real behavioral and delivery evidence; this packet only defines and proves the gate mechanism.
<!-- /ANCHOR:limitations -->
