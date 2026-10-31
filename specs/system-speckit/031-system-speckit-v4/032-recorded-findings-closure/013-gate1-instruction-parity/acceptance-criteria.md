---
title: "Acceptance Criteria: Phase 13: gate1-instruction-parity"
description: "The criteria this packet must satisfy before it may be closed, each one met, waived by a decision record, or superseded by one."
trigger_phrases:
  - "gate 1 instruction parity"
  - "runtime instruction file drift"
  - "codex nodeterm block boundary"
  - "trigger index lookup pointer"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/032-recorded-findings-closure/013-gate1-instruction-parity"
    last_updated_at: "2026-09-07T15:05:55Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the acceptance criteria for this packet"
    next_safe_action: "Meet, waive or supersede the open criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-013-gate1-instruction-parity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 13: gate1-instruction-parity

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** system-speckit/033-system-speckit-v4/032-recorded-findings-closure/013-gate1-instruction-parity
**Level:** 2
**Status:** Complete
**Date:** 2026-09-07
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the doctor's retrieval workflow, When phase 0 discovery runs against the repository, Then it reports per-runtime reach for the Gate 1 lookup instruction across all five CLI runtimes | `/doctor speckit-retrieval` phase 0 output naming the `gate1_instruction_parity` signal, or `.opencode/commands/doctor/assets/doctor-speckit-retrieval.yaml` showing the new signal and activity | Met | - |
| AC-002 | REQ-002 | Given `.codex/AGENTS.md` after the generator runs, When the nodeterm-marked region is diffed against its pre-change state, Then it is byte-identical and a Gate 1 pointer exists outside it | A diff of `.codex/AGENTS.md` lines 1-122 (or the then-current marker range) before and after, plus `grep -n "trigger index" .codex/AGENTS.md` outside that range | Met | - |
| AC-003 | REQ-003 | Given the Pi investigation, When its finding is checked against `.pi/SYNC.md`, Then the file states whether Pi reads root AGENTS.md automatically and names the source of that answer | `.pi/SYNC.md`, the section this phase adds documenting the investigation's finding and source | Met | - |
| AC-004 | REQ-004 | Given the Gate 1 pointer generator, When it is run with `--check` against a repository with no drift, Then it exits 0, and When run against a repository where a pointer was hand-edited out of sync, Then it reports drift | `node <generator script path> --check` exit code and output, on both a clean and a deliberately drifted state | Met | - |
| AC-005 | REQ-005 | Given `.cursor/rules/skill-routing.md` after the change, When it is read, Then it carries the Gate 1 pointer that both Cursor and Devin consult | `grep -n "trigger index" .cursor/rules/skill-routing.md` returns a match | Met | - |
| AC-006 | REQ-006 | Given `runtime/cli/retrieval/README.md`, When line 87 is read after this phase closes, Then it accurately describes which runtimes carry a Gate 1 pointer instead of claiming none do | `.opencode/skills/system-spec-kit/runtime/cli/retrieval/README.md:87` (or its corrected line number) | Met | - |

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

**Closeable:** No

This phase is still in planning. No requirement has been implemented, so every
criterion above stays Unmet until the tasks in `tasks.md` are executed and
re-verified against the repository.
<!-- /ANCHOR:closure -->
