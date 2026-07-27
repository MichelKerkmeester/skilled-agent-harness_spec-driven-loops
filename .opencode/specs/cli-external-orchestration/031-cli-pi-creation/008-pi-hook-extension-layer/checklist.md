---
title: "Verification Checklist: Pi hook extension layer"
description: "Verification Date: Not yet executed - phase status is Planned"
trigger_phrases:
  - "pi hook extension checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer"
    last_updated_at: "2026-07-27T08:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored checklist.md for phase 008; all items unchecked, phase status Planned"
    next_safe_action: "No action needed until phase 001, 003, and 007 land"
    blockers:
      - "depends on 001-pi-contract-pin and 003-cli-pi-skill-packet landing first"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
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

This phase is **Planned** — no adapter code, extension file, or live Pi session exists yet. Every item below is unchecked by design; it becomes a future implementer's or CI's verification bar once phases 001/003/007 have landed and `tasks.md` T001-T010 have actually run.

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

- [ ] CHK-001 [P0] `spec.md` documents all P0/P1/P2 requirements (REQ-001 through REQ-008) with a falsifiable acceptance criterion each
- [ ] CHK-002 [P0] `plan.md` names both candidate adapter shapes (in-process direct-call vs. `spawnSync` delegate) and states the live-probe finding needed to choose between them
- [ ] CHK-003 [P1] `plan.md`'s Dependencies table cites phase 001/003/007's real status (Red/not started, as of this authoring pass) rather than assuming any has landed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Before any `.pi/extensions/*.ts` file is authored, the live-probe protocol in `plan.md` Phase 1 has actually been executed, and its findings (confirmed lifecycle callback names, payload shapes, block-capability) are recorded in a follow-on `decision-record.md`
- [ ] CHK-011 [P0] Every future adapter fails open (no-ops / never blocks a Pi session) on malformed or missing input, mirroring the fail-open discipline already proven for `runtime/hooks/codex/`, `runtime/hooks/devin/`, `runtime/hooks/cursor/`
- [ ] CHK-012 [P1] The chosen adapter shape (A or B, or a documented hybrid) is recorded with rationale before Phase 2 (Core Implementation) begins, not decided implicitly mid-implementation
- [ ] CHK-013 [P1] New sibling directories mirror the existing `hooks/codex/`, `hooks/devin/`, `hooks/cursor/` naming and layout convention (`mcp-server/hooks/pi/`, `runtime/hooks/pi/`, plus each guard-owning packet's own `hooks/pi/` sibling)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Every one of the 8 runtime-neutral guard cores has an explicit mapping-table row in `plan.md` (bridged-candidate, deferred-pending-probe, or documented-unreachable) — none silently missing
- [ ] CHK-021 [P0] A future live smoke test confirms each wired lifecycle point actually fires under a real `pi` session, with captured evidence — not just static extension-file presence
- [ ] CHK-022 [P1] Any Pi lifecycle point the live probe shows does NOT exist, or cannot intercept/deny (`spec-gate-enforce`'s core requirement), is documented as an explicit gap, not silently assumed closed
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] N/A — this phase is new-capability planning, not a bug fix; no findings to classify
- [ ] CHK-FIX-002 [P0] N/A — no producer/consumer inventory applies; the 8 guard cores this phase plans to wrap are enumerated in full in `spec.md` §3 / `plan.md` §3, and none is modified by this authoring pass (confirmed by `git diff` being empty against those paths)
- [ ] CHK-FIX-003 [P0] N/A — no path/parser/redaction core logic is changed by this planning pass
- [ ] CHK-FIX-004 [P1] Evidence for the eventual implementation phase must pin to that phase's own commit SHA, not this planning phase's spec-doc-only diff
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credentials, tokens, or Pi auth material are referenced or embedded in any of this phase's planning docs
- [ ] CHK-031 [P1] `plan.md`'s data-flow section states that no future adapter may log or transmit raw hook/extension payload contents, carrying forward the same discipline as the Codex/Devin/Cursor precedent's NFR-S01
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`/`plan.md`/`tasks.md`/`checklist.md` are internally consistent (same Predecessor/Successor, same 8-guard-core enumeration, same two candidate shapes)
- [ ] CHK-041 [P1] Every claim sourced from pi.dev docs rather than confirmed live behavior is explicitly marked (e.g. "per pi.dev docs, unconfirmed:") rather than stated as verified
- [ ] CHK-042 [P2] This phase's open questions (`spec.md` §7) are each routed to either phase 001, this phase's own future Setup step, or phase 006 (subagent-tool-name dependency), not left unowned
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] No file outside this phase folder (`.opencode/specs/cli-external-orchestration/031-cli-pi-creation/008-pi-hook-extension-layer/`) was created or modified by this authoring pass
- [ ] CHK-051 [P1] `scratch/` is empty or removed before this phase is marked ready for implementation
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 0/10 |
| P1 Items | 10 | 0/10 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not yet executed — phase status is Planned as of 2026-07-27.
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
