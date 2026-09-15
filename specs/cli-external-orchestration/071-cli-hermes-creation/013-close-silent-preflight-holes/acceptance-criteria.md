---
title: "Acceptance Criteria: Phase 1: close-silent-preflight-holes"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "acceptance criteria"
  - "closure gate"
  - "ac traceability"
  - "waiver adr"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/071-cli-hermes-creation/013-close-silent-preflight-holes"
    last_updated_at: "2026-09-15T16:29:32Z"
    last_updated_by: "scaffold"
    recent_action: "Every criterion met with its evidence recorded"
    next_safe_action: "None; the packet is closeable"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-071-013-close-silent-preflight-holes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: close-silent-preflight-holes

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/071-cli-hermes-creation/013-close-silent-preflight-holes
**Level:** 2
**Status:** Complete
**Date:** 2026-09-15
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the seven documented headless dispatches, When each is matched against the shape list and the tokenizer, Then both resolve it to its own skill | `node --test .opencode/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` test "every runtime dispatch shape resolves to its skill"; reverting the codex shape fails it with "no shape matched the documented cli-codex dispatch" | Met | - |
| AC-002 | REQ-002 | Given a Hermes fan-out lineage, When the dispatch environment is built, Then it carries the project-plugin opt-in beside the packet and read-only markers | Hermes adapter stress suite asserts the opt-in equals "1"; removing the line from the runner fails it with "expected null to be '1'" | Met | - |
| AC-003 | REQ-003 | Given a dispatch missing its stdin redirect on any of the seven runtimes, When the preflight evaluates it, Then it is denied rather than advised | All seven packets declare the stdin rule at `error`; the end-to-end hook run denies the codex and pi cases | Met | - |
| AC-004 | REQ-004 | Given a Hermes toolset list without the file toolset, When the preflight evaluates it, Then it is denied | `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` requires the reader toolset; the hook denies `-t search,todo` and allows `-t file,todo` | Met | - |
| AC-005 | REQ-005 | Given a preloading Hermes dispatch with no rules flag, When the preflight evaluates it, Then it is denied | The exemption clause is removed; the two test assertions that pinned the old behaviour now expect the violation, and the corrected shape stays clean | Met | - |
| AC-006 | REQ-006 | Given the repository instruction file, When the Hermes context scanner reads it, Then it returns no finding | Scanner run directly against the file returns CLEAN, and against the symlinked copy too; it returned one joiner finding before | Met | - |
| AC-007 | REQ-007 | Given every living document in the packet, When searched for the disproved dispatch shape, Then none instructs it | The reference, the playbook root and two scenarios corrected; the dated benchmark reports keep it as history by decision | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified. The Verification cell names evidence that was actually observed. |
| `Unmet` | Not yet satisfied. Blocks closure. |
| `Waived` | Deliberately not pursued. Requires an ADR in the Waiver cell. |
| `Superseded` | Replaced by a different criterion or decision. Requires an ADR in the Waiver cell. |

### Waiver cell

Write `-` when the row is `Met` or `Unmet`. Write `ADR-NNN` when the row is
`Waived` or `Superseded`, naming a decision record that exists in
`decision-record.md`. A waiver naming an ADR that is not there fails validation:
the point of a waiver is that someone recorded the reasoning, so an unbacked
waiver is treated as an unmet criterion rather than as a pass.
<!-- /ANCHOR:criteria -->

---

<!-- ANCHOR:closure -->
## 3. CLOSURE STATEMENT

**Closeable:** [Yes/No]

[One or two sentences: which criteria carried the packet, and what was consciously
left out. Write this when the packet is closed, not before.]
<!-- /ANCHOR:closure -->
