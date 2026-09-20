---
title: "Acceptance Criteria: Phase 1: jev contract research and pin"
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
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin"
    last_updated_at: "2026-09-20T10:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Closed the contract-pin criteria against the captured probe evidence"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-001-jev-contract-research-and-pin"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Phase 1: jev contract research and pin

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> This document decides whether the packet may close. A packet is closeable when
> every row below is `Met`, `Waived` or `Superseded`. A `Waived` or `Superseded`
> row MUST name an ADR that exists in `decision-record.md`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** cli-external-orchestration/074-cli-jev-creation/001-jev-contract-research-and-pin
**Level:** 3
**Status:** Complete
**Date:** 2026-09-20
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:criteria -->
## 2. CRITERIA

One row per criterion. `AC-ID` is stable once written: supersede a criterion, never renumber it.

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the installed binary, When `jev --version` runs, Then it prints `jev 0.6.2` and exits 0 | `scratch/probe-matrix.txt:4` — `STDOUT: jev 0.6.2`, RC 0 at line 3 | Met | - |
| AC-002 | REQ-001 | Given the vendored source tree, When its project metadata is read, Then version 0.6.2 and the two console scripts `jev` and `jev-mcp` are declared | `context/jev-cli-main/pyproject.toml:3` (version) and `:26` (`jev-mcp` entry point) | Met | - |
| AC-003 | REQ-002 | Given each of the 22 matrix commands, When it runs, Then the exit status matches the mapping recorded from the source | `scratch/probe-matrix.txt:28` onward — every section carries its own `RC:` line | Met | - |
| AC-004 | REQ-002 | Given all provider keys cleared, When `jev noul` runs, Then it exits 3 with empty stdout and one JSON error on stderr | `scratch/probe-matrix.txt:42` — `RC: 3`, `STDOUT: <empty>` | Met | - |
| AC-005 | REQ-003 | Given a sentinel key and an unreachable endpoint, When `jev noul --provider custom --endpoint http://127.0.0.1:9/v1/systemone` runs, Then it exits 4 and the transcript carries no sentinel | `scratch/probe-matrix.txt:146` — RC 4, `CHECK: sentinel absent from stderr`, and the packed command line is redacted to `JEV_API_KEY=<sentinel>` at `:147` | Met | - |
| AC-006 | REQ-004 | Given a live `jev-mcp` process, When a stdio client initializes and lists tools, Then exactly `noul`, `choice`, `score` and `run` are advertised with the documented required arguments | `scratch/probe-surface.txt:111` (initialize) and `:113` through `:116` (per-tool required and optional argument sets) | Met | - |
| AC-007 | REQ-004 | Given the CLI and the MCP server, When a single-option `choice` is attempted, Then the CLI proceeds to the credential check instead of refusing the request | `scratch/probe-matrix.txt:136` — RC 3 from the credential check, so no refusal preceded it | Met | - |
| AC-008 | REQ-005 | Given the transcribed references, When a claim is read, Then it is tagged source-read or live-verified | `cli-jev/references/cli-reference.md:1` — the evidence legend opens the document | Met | - |
| AC-009 | REQ-006 | Given no provider credential is available, When the packet reports its state, Then the unconfirmed claims are listed in one place rather than asserted | `cli-jev/references/providers-and-models.md:1` | Met | - |

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

**Closeable:** Yes

AC-003 and AC-004 carried the packet: the exit taxonomy is the part of the contract everything downstream branches on, and the credential-free control is what makes an exit 3 mean "nothing was billed". AC-005 is the negative control that proves the transport class is reachable and that the key does not leak into the transcript. The two directions of evidence — source and live binary — agree on every claim that was checked, and the four claims that need a provider credential are recorded as unconfirmed in the references instead of being asserted here.
<!-- /ANCHOR:closure -->
