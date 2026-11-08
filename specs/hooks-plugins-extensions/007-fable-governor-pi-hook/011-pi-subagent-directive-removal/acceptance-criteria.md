---
title: "Acceptance Criteria: Pi Subagent Directive Removal"
description: "The criteria this packet must satisfy before it may be closed, drawn from the spec's handoff criteria and the recorded test evidence."
trigger_phrases:
  - "pi subagent directive removal acceptance"
  - "dispatch mandate removal closure"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal"
    last_updated_at: "2026-10-03T15:26:06Z"
    last_updated_by: "spec-validation-backfill"
    recent_action: "Reconstructed acceptance criteria from recorded evidence"
    next_safe_action: "None; all criteria met"
    blockers: []
    key_files:
      - "spec.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-validation-backfill"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Acceptance Criteria: Pi Subagent Directive Removal

<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.
>
> Reconstructed after closure from the handoff criteria in `spec.md` and the
> evidence recorded in `implementation-summary.md`; no new check was run for it.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** hooks/007-fable-governor-pi-hook/011-pi-subagent-directive-removal
**Level:** 2
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | Handoff | Given a Pi input turn, When `prompt-advisor.ts` runs with no advisor context, Then no dispatch directive is appended | `npx vitest run .opencode/skills/system-skill-advisor/mcp-server/tests/hooks/prompt-advisor.vitest.ts` 3 passed (3), including the no-context no-transform test (implementation-summary.md:69) | Met | - |
| AC-002 | Handoff | Given the enforcement hook, When the compact shadow machinery and `DIRECTIVE_MARKER` are removed, Then the deny matrix and boundary authorization tests still pass | `npx vitest run .opencode/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` 32 passed (32) (implementation-summary.md:61) | Met | - |
| AC-003 | Handoff | Given the retained advisor-brief de-dup, When the directive removal lands, Then its suite still passes | `npx vitest run .opencode/hooks/dispatch/pi/directive-dedup.test.ts` 14 passed (14) (implementation-summary.md:65) | Met | - |
| AC-004 | Handoff | Given the runtime docs, When the package is gone, Then `injection-contract.md`, `.pi/PLUGINS.md` and `.pi/SYNC.md` no longer assert the mandate | Change table rows for those three files (implementation-summary.md:50) | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes

The three recorded test suites and the doc change table carry the packet. The dispatch enforcement hook and the cli-pi third-party references were left out by design (spec.md section 3).
<!-- /ANCHOR:closure -->
