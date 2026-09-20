---
title: "Feature Specification: Phase 1: jev contract research and pin"
description: "Every claim the cli-jev packet makes about the jev CLI and jev-mcp must come from the vendored 0.6.2 source or a live probe of the same version, never from a vendor README's summary — so the contract is pinned before any packet text depends on it."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin"
    last_updated_at: "2026-09-20T10:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Authored the phase specification as part of the packet closeout"
    next_safe_action: "None; the phase is complete"
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
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: jev contract research and pin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-09-20 |
| **Branch** | `scaffold/001-jev-contract-research-and-pin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 5 |
| **Predecessor** | None |
| **Successor** | 002-cli-jev-skill-packet |
| **Handoff Criteria** | The packet references exist with every claim tagged source-read or live-verified; the exit-code map is observed, not inferred; the unconfirmed set is listed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the cli-jev creation: add Jev as the eighth cli-external-orchestration mode, a transport packet that bridges the jev CLI and its judgment contract specification.

**Scope Boundary**: Pinning the contract only. No packet text is authored here beyond the three reference documents the later phases read, and no hub registration happens in this phase.

**Dependencies**:
- The vendored 0.6.2 tree the plan carries as read-only context
- `uv` for a reversible install of the matching release

**Deliverables**:
- Three probe artifacts under `scratch/`: the surface probe, the exit-code matrix, and the MCP handshake client
- The contract references the packet dispatches against, each claim tagged by evidence class

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The hub is about to route work to a binary it does not control, and the only available accounts of that binary are a vendor README, a vendored source tree, and the binary itself. A packet written from the README would carry the vendor's summary as if it were the contract: the exit codes would be a guess, the credential path an assumption, and the flags a wish list. When the CLI's behavior and the packet's account of it disagree, the failure lands on whoever dispatched — a hang on stdin, or a wrong answer taken as a judgment.

### Purpose

Establish what the binary actually does, from two independent directions that can be compared: the source that defines it and a live process that exhibits it. Then write the result down once, with each claim labelled by how it was established, so the rest of the packet can cite a contract instead of restating a summary.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The subcommand and flag surface, including flags the help text omits
- The state input forms and which of them read stdin
- The exit-code taxonomy, observed class by class
- Provider selection, key resolution order and per-provider translation, as far as they are reachable without a credential
- The `jev-mcp` stdio surface: handshake, tool list and argument schemas

### Out of Scope

- Building or testing a translating proxy for the operator's gateway key
- Any change to the jev CLI, its vendored tree, or the repository's MCP configuration
- A judgment call against a paid provider: no credential exists in this workspace, so a live answer would have cost quota to confirm a shape the source already fixes

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-jev-contract-research-and-pin/scratch/probe-surface.sh` | Create | Version, help surfaces, auth status, source map |
| `001-jev-contract-research-and-pin/scratch/probe-matrix.sh` | Create | 12-command exit-code matrix plus both controls |
| `001-jev-contract-research-and-pin/scratch/probe-surface.txt` | Create | Captured surface output |
| `001-jev-contract-research-and-pin/scratch/probe-matrix.txt` | Create | Captured matrix output |
| `001-jev-contract-research-and-pin/scratch/mcp-probe.py` | Create | Read-only stdio client for `jev-mcp` |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/cli-reference.md` | Create | The CLI contract, transcribed |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/providers-and-models.md` | Create | Provider table, key resolution, translation |
| `.skilled/skills/cli-external-orchestration/cli-jev/references/mcp-server.md` | Create | The MCP surface and the operator step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Establish the CLI's version and resolved flag surface from the live binary | `jev --version` and both help surfaces captured; `--endpoint` known present despite being hidden |
| REQ-002 | Observe every documented exit class rather than inferring it | The 12-command matrix runs and each status matches the source-read mapping |
| REQ-003 | Prove the credential check precedes any network call | A cleared-key run exits 3 with no connection attempt; a sentinel-key run against an unreachable endpoint exits 4 without leaking the key |
| REQ-004 | Pin the `jev-mcp` tool surface | A live handshake advertises exactly four tools with the documented required arguments |
| REQ-005 | Tag every transcribed claim by evidence class | Each reference statement is marked source-read or live-verified |
| REQ-006 | Record what could not be established | The unconfirmed claims appear in one list rather than as scattered hedging |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Note the surfaces where the CLI and the MCP server disagree | The cardinality asymmetry is documented with the surface that enforces it |
| REQ-008 | Keep every probe re-runnable | Each probe is a standalone script whose transcript is the record |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The packet's references disagree with nothing observed in the probes, and every disagreement between source and help text is recorded as a discovery rather than smoothed over
- **SC-002**: A later phase can write hard rules that the live binary's own probes comply with, because the failure modes those rules encode were observed rather than assumed
- **SC-003**: The four claims that need a provider credential are named as unconfirmed, so no downstream document can quietly inherit them as fact
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `uv` available to install the tool | No live probe; the pin degrades to a source read | The install is available in this environment; without it every live claim would be marked unverified |
| Dependency | A provider credential | The live response body and default model ids stay unknown | Recorded as a known limitation; one `jev auth test` settles it later |
| Risk | A probe hangs waiting on stdin | Blocks the phase | Every judgment probe passes its state inline or redirects stdin, and the matrix records which form reads stdin |
| Risk | A probe leaks a credential into a transcript | A secret in the repository | Only a sentinel dummy key is used, and the negative control's stderr was inspected for key material |
| Risk | The installed release drifts from the vendored tree | The references describe a version the hub does not dispatch | Install resolved to the same 0.6.2 the tree carries; a future difference is a re-pin trigger |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None outstanding. The four claims that no available credential could settle are tracked as a known limitation on the packet rather than as an open question, because no further work in this workspace can resolve them.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## 8. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: A pin run completes in minutes; the probes spend no time waiting on a provider because none is called
- **NFR-P02**: Each probe script is standalone, so a re-pin after an upgrade re-runs in one command per script

### Security

- **NFR-S01**: No credential is written into any artifact; the only key-shaped value in the record is a dummy sentinel
- **NFR-S02**: The references state that a custom endpoint receives the bearer key, so only a trusted endpoint may be used

### Reliability

- **NFR-R01**: The transcript is the evidence: a claim can be re-checked without re-running anything
- **NFR-R02**: Source-read claims are marked as such, so an unverifiable claim is never presented as observed
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8b. EDGE CASES

### Data Boundaries

- Empty state: the CLI reports a usage-class failure rather than sending an empty judgment request
- State from a file that does not exist: exits 2 naming the unreadable file
- State flagged as JSON but not JSON: exits 2 with an explicit invalid-JSON message

### Error Scenarios

- Unreachable endpoint: exits 4 with a connection-failure message, and the sentinel key does not appear in it
- Missing credential: exits 3 before any connection is attempted, with empty stdout
- Single-option choice and single-level score: the CLI sends them; the MCP server refuses them; the refusal carries no exit status because it never becomes a process

### State Transitions

- Interrupt: exit 130, distinct enough from the transport class that a caller can tell a cancel from a failure
- Repeat probe: the matrix is idempotent, because every case ends in a usage or transport failure rather than a stored change
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | Three scripts, two transcripts and three reference documents; no repository behavior changes |
| Risk | 8/25 | No credentials, no writes outside the packet, and the install is reversible |
| Research | 16/20 | Two entry points read end to end, a 12-command matrix, and one cross-surface disagreement to explain |
| Multi-Agent | 2/15 | One workstream |
| Coordination | 4/15 | Depends on the vendored context tree only |
| **Total** | **40/100** | **Level 3 by the packet's declared level; the recommend-level scorer returned Level 1** |
<!-- /ANCHOR:complexity -->
