---
title: "Implementation Summary [Planned]: Pi Dispatch and Compaction"
description: "Placeholder: nothing in this packet has been implemented yet. Previews the planned compact Pi dispatch directive candidate and compaction-aware dedup reset before any code changes land."
trigger_phrases:
  - "pi dispatch directive implementation summary"
  - "compact pi arbitration not yet built"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/006-pi-dispatch-and-compaction"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "opus"
    recent_action: "Recorded the not-yet-built placeholder for Pi dispatch directive compaction"
    next_safe_action: "Begin Phase 1 semantics enumeration once Phase 001 receipts land"
    blockers:
      - "001-measurement-and-receipts-foundation has not yet been built"
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts"
    session_dedup:
      fingerprint: "sha256:84b8ce330010bece492501b92bc3e8227150f321c4a7b08426de60314d9d3fa2"
      session_id: "2026-08-06-hooks-002-006"
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
| **Spec Folder** | 006-pi-dispatch-and-compaction |
| **Completed** | Not yet implemented (Planned) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. No code in `prompt-advisor.ts` or any adjacent Pi advisor test file has changed as a result of this packet. This document previews the planned design so a future implementer or reviewer can see exactly what 006 will deliver and how it will be verified before any change lands.

### Pi Dispatch Directive Compaction (Planned)

Once designed and executed, this candidate will enumerate the five dispatch semantics an earlier 130-byte reminder lost — native default behavior, explicit current-turn override, preload, anti-signal, and child-prompt exclusion — map each to a test case, and prototype a shorter directive behind an independent flag, shadow-only until measured. The full 554-byte `PI_SUBAGENT_DISPATCH_DIRECTIVE` stays the unconditional fallback on every Pi advisor-failure path. A compaction-aware dedup reset will ensure a Pi compact/session boundary always triggers full-directive replay on the next turn.

### Files Planned

| File | Planned Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts` | Modify (not yet started) | Add the prototype-flag-gated compact directive candidate and compaction-aware dedup reset |
| Adjacent Pi advisor test file (path confirmed in Phase 1) | Modify (not yet started) | Add the five-semantics matrix and fail-open negative control |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered yet. The planned verification path is: map all five semantics to test cases, execute the shadow-mode prototype with zero output diff against the 554 B baseline while off, run the five-semantics matrix and the fail-open negative control (flag on and off), record the executed byte count against the 177 B ceiling, and only then hand the candidate to the 007-guardrail-controls-and-activation gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat this candidate as prototype-only until executed | The research's confidence verdict is explicitly "Low-medium; prototype only," and the eliminated 130-byte reminder already proved a naive shrink loses real semantics |
| Keep the full 554 B directive as the unconditional advisor-failure fallback | The dispatch guard must still emit on Pi failure regardless of the prototype's state; this is a fail-open safety property, not a savings opportunity |
| Require an executed byte measurement before citing any savings figure | The ~424 B modeled saving in research.md depends on an unexecuted reminder; citing it as realized before execution would misrepresent the program's own evidence bar |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Five-semantics test matrix (`prompt-advisor.test.ts`, exact filename confirmed in Phase 1) | Not yet run (Planned) |
| Fail-open negative control (flag on/off, `prompt-advisor.ts`) | Not yet run (Planned) |
| Shadow-mode output diff vs. 554 B baseline | Not yet run (Planned); no `vitest` run has been executed yet |
| Executed byte count vs. 177 B ceiling | Not yet run (Planned) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not yet implemented.** This entire candidate is in the planning stage; no compact directive, prototype flag, dedup reset, or test exists yet.
2. **Blocked on Phase 001.** Activation depends on the canonical block IDs, hashes, and delivery-receipt fields that 001-measurement-and-receipts-foundation is expected to supply; semantics-mapping and design work can proceed now.
3. **Prototype-only ceiling.** Even once built, the research explicitly treats the 177 B figure as a modeled ceiling, not an implementation-ready after-state, until it is executed and measured.
<!-- /ANCHOR:limitations -->
