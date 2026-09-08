---
title: "Acceptance Criteria: 002-port-cache-economics"
description: "The criteria this phase must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/016-cache-optimizer-absorbs-deep-pi/002-port-cache-economics"
    last_updated_at: "2026-09-08T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "All criteria met against observed evidence"
    next_safe_action: "None; phase closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-016-002-port-cache-economics"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: 002-port-cache-economics

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the phase may close. A phase is closeable when
> every row below is `Met`, `Waived` or `Superseded`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** 002-port-cache-economics
**Level:** 3
**Status:** Complete
**Date:** 2026-09-08
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Cost and savings come from provider-reported usage | Computed from usage records; `unpriced` rendered when the cost block carries no positive rates | Met | - |
| AC-002 | REQ-002 | A no-cache-fields response counts as a full miss | All four adapters count it; test asserts both Pi-normalized and OpenAI-shape paths | Met | - |
| AC-003 | REQ-003 | An existing persisted record migrates forward without loss | Round-trip test preserves migrated counters alongside new fields | Met | - |
| AC-004 | REQ-004 | The report renders for a non-DeepSeek model | Live turn on `llmgateway/deepseek-v4-flash-vision-exp` recorded a real row | Met | - |
| AC-005 | REQ-005 | Prefix churn is detected and counted | Test detects churn across two turns and stays quiet on a stable prefix | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR. |
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** Yes. Every row is `Met` against an observation rather than an inference.

Each verification cell names a command that was run and read, not a diff that was eyeballed. Where
a check could not be run in this environment it is recorded in the phase's implementation summary
under known limitations rather than being marked met.
<!-- /ANCHOR:closure -->
