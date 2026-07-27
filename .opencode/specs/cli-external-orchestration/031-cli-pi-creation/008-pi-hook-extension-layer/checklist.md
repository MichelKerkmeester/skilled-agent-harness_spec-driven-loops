---
title: "Verification Checklist: Pi hook extension layer"
description: "Verification Date: 2026-07-27 - pre-work closed out; live-session items accepted-deferred, phase status Blocked"
trigger_phrases:
  - "pi hook extension checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T10:34:00Z"
    last_updated_by: "claude-code"
    recent_action: "Pre-work items closed out live; live-session items deferred, phase Blocked"
    next_safe_action: "Commit as Blocked; phase 009 proceeds independently"
    blockers:
      - "Live-session probing requires running an actual pi session, out of this planning phase's own Hard Constraint"
    key_files:
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 55
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 8: pi-hook-extension-layer

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

This phase is **Blocked** — no adapter code, extension file, or live Pi session exists yet. Achievable pre-work (docs re-fetch, dependency status, file-path re-reads) is closed out with evidence below; live-session-dependent items are explicitly `[B]` deferred, since running one is out of this planning phase's own Hard Constraint.

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` documents all P0/P1/P2 requirements (REQ-001 through REQ-008) with a falsifiable acceptance criterion each [EVIDENCE: `spec.md:141` §4, 8/8 REQs present]
- [x] CHK-002 [P0] `plan.md` names both candidate adapter shapes (in-process direct-call vs. `spawnSync` delegate) and states the live-probe finding needed to choose between them [EVIDENCE: `plan.md:85` §3 Key Components, Shape A/B]
- [x] CHK-003 [P1] `plan.md`'s Dependencies table cites phase 001/003/007's real current status, re-verified live during this closeout [EVIDENCE: `plan.md` §6 - 001/003 Complete, 007 Blocked]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [B] CHK-010 [P0] Before any `.pi/extensions/*.ts` file is authored, the live-probe protocol in `plan.md` Phase 1 has actually been executed [DEFERRED: requires a live installed Pi session, out of this planning phase's own scope; the docs re-fetch narrowed but did not replace this requirement]
- [x] CHK-011 [P0] Every future adapter fails open (no-ops / never blocks a Pi session) on malformed or missing input, mirroring the fail-open discipline already proven for `runtime/hooks/codex/`, `runtime/hooks/devin/`, `runtime/hooks/cursor/` [EVIDENCE: `plan.md` §3 documents the fail-open policy as a named design requirement, carried forward from the Codex/Devin/Cursor precedent]
- [B] CHK-012 [P1] The chosen adapter shape (A or B, or a documented hybrid) is recorded with rationale before Phase 2 begins [DEFERRED: gated on the live probe (T004-T006), which is out of this planning phase's own scope; both candidate shapes are documented with tradeoffs, but the choice itself needs live evidence]
- [x] CHK-013 [P1] New sibling directories mirror the existing `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` naming and layout convention [EVIDENCE: `spec.md:124` Files to Change table names each planned sibling directory matching the precedent's convention]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Every one of the 8 runtime-neutral guard cores has an explicit mapping-table row in `plan.md` — none silently missing [EVIDENCE: `plan.md` §3 mapping table, 8/8 rows, each real file path re-confirmed live during this closeout via direct `find`/`Read`]
- [B] CHK-021 [P0] A future live smoke test confirms each wired lifecycle point actually fires under a real `pi` session, with captured evidence [DEFERRED: requires a live installed Pi session, out of this planning phase's own scope]
- [B] CHK-022 [P1] Any Pi lifecycle point the live probe shows does NOT exist, or cannot intercept/deny, is documented as an explicit gap [DEFERRED: gated on the live probe; docs currently confirm `tool_call` CAN block, narrowing but not eliminating the risk this item guards against]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] [DEFERRED: not applicable - this phase is new-capability planning, not a bug fix; no findings to classify]
- [x] CHK-FIX-002 [P0] No producer/consumer inventory applies; the 8 guard cores this phase plans to wrap are enumerated in full and none is modified [EVIDENCE: `git status --porcelain` against all 8 guard-core paths returns nothing]
- [x] CHK-FIX-003 [P0] [DEFERRED: not applicable - no path/parser/redaction core logic is changed by this planning pass]
- [x] CHK-FIX-004 [P1] [DEFERRED: no fix commit exists yet to pin evidence to; this phase's own closeout evidence (docs re-fetch, file re-reads) is timestamped to this session, 2026-07-27, not a fix SHA]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credentials, tokens, or Pi auth material are referenced or embedded in any of this phase's planning docs [EVIDENCE: content review of all 5 phase docs during closeout - markdown planning prose and public `pi.dev` URLs only]
- [x] CHK-031 [P1] Fail-open, no-payload-logging discipline is carried forward from the Codex/Devin/Cursor precedent [EVIDENCE: `plan.md` §3 fail-open policy language, mirroring `runtime/hooks/{codex,devin,cursor}`'s own NFR-S01 discipline]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` are internally consistent [EVIDENCE: direct read, all 5 phase docs share the same Predecessor/Successor and 8-guard-core enumeration]
- [x] CHK-041 [P1] Every claim sourced from pi.dev docs rather than confirmed live behavior is explicitly marked [EVIDENCE: `rg -c "DOCS-CONFIRMED\|not live-session-verified\|UNCONFIRMED" spec.md plan.md`]
- [x] CHK-042 [P2] This phase's open questions (`spec.md` §7) are each routed to a named owner [EVIDENCE: `spec.md` §7 - the two central questions are now marked DOCS-CONFIRMED (still needing live-session confirmation); the remaining two are routed to a future Setup step and phase 006 respectively]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No file outside this phase folder was created or modified by this closeout pass [EVIDENCE: `git status --porcelain` scoped to `031-cli-pi-creation/008-pi-hook-extension-layer/` only]
- [x] CHK-051 [P1] `scratch/` is empty [EVIDENCE: `find 008-pi-hook-extension-layer/scratch -type f` returns nothing]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 8/10 (+2 accepted-deferred: CHK-010/021, both live-session-dependent) |
| P1 Items | 10 | 8/10 (+2 accepted-deferred: CHK-012/022) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. All achievable pre-work is complete and re-verified live — most notably, a docs re-fetch found pi-mcp-extension's sibling package (pi's own extension system) now fully documents its registration model and confirms block-capable tool interception, resolving this phase's two most central open questions at the docs level. Every live-session-dependent item (CHK-010/012/021/022) is accepted-deferred with an explicit reason: running a real Pi session is out of this planning phase's own Hard Constraint. Status is **Blocked**, not Complete.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
