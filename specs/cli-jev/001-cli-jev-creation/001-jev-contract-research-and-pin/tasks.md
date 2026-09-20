---
title: "Tasks: Phase 1: jev-contract-research-and-pin"
description: "Task ledger for the jev contract pin: source map, live install, surface probes, the exit-code matrix, the MCP handshake and the evidence transcription."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/001-cli-jev-creation/001-jev-contract-research-and-pin"
    last_updated_at: "2026-09-20T10:00:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Contract-pin tasks closed; evidence under scratch/, references transcribed"
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
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: jev-contract-research-and-pin

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Map the vendored jev-cli tree: package metadata, console scripts, module sizes (`001-jev-contract-research-and-pin/context/jev-cli-main`)
- [x] T002 Read the CLI entry point end to end and record the subcommand, flag, provider and exit-code surface (`context/jev-cli-main/src/jev_cli/__init__.py`)
- [x] T003 Read the MCP server and record its tool set, schemas and error mapping (`context/jev-cli-main/src/jev_cli/mcp_server.py`)
- [x] T004 Read the vendor's own skill and CLI references for pitfall claims to test (`context/jev-cli-main/skills/jev-cli/`)
- [x] T005 Install the binary for live probing: `uv tool install jev-cli` (`jev 0.6.2`, rollback `uv tool uninstall jev-cli`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Capture the version, both help surfaces and the auth-status probe (`scratch/probe-surface.sh`, `scratch/probe-surface.txt`)
- [x] T007 Capture the exit-code matrix: missing flags, unknown subcommand, bad state file, invalid JSON state, invalid provider, custom without endpoint, custom with endpoint and no key (`scratch/probe-matrix.sh`, `scratch/probe-matrix.txt`)
- [x] T008 Run the credential-free credential control and record the stderr payload (`scratch/probe-matrix.txt`)
- [x] T009 Run the negative control: sentinel key against `http://127.0.0.1:9`, confirm exit 4 and confirm the transcript carries no sentinel (`scratch/probe-matrix.txt:146`)
- [x] T010 Write a read-only stdio client for `jev-mcp` and capture the handshake plus the tool list (`scratch/mcp-probe.py`)
- [x] T011 Transcribe the pinned contract into the packet references, tagging every claim source-read or live-verified (`cli-jev/references/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-run the surface probe against the installed binary and diff it against the source-read flag list
- [x] T013 Confirm the MCP tool list matches the source tool definitions one for one
- [x] T014 Confirm the exit codes observed for all 22 matrix commands match the source-read mapping
- [x] T015 Record the unconfirmed claims explicitly rather than asserting them (`references/providers-and-models.md` section 5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — see the Verification Checklist below
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md`
- Plan: `plan.md`
- Evidence: `scratch/probe-surface.txt`, `scratch/probe-matrix.txt`, `scratch/mcp-probe.py`
- Consumed by: `../002-cli-jev-skill-packet/` (references), `../003-hub-mode-registration/` (hook checks and rules)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

### Pre-Task Checklist

- Confirm the phase folder and that its predecessor's handoff criteria are met
- Re-read the evidence the outgoing phase left rather than trusting a summary of it
- Name the command that will prove each row before running it

### Task Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ | Do the upstream read before the downstream write; a reference cannot cite a transcript that does not exist yet |
| TASK-EVIDENCE | A row may only be marked `[x]` with an observable result behind it, and the observable is recorded, not remembered |
| TASK-SCOPE | Out-of-scope findings are recorded for the parent packet and never folded into this phase's files |

### Status Reporting Format

Status Reporting is one line per task: the id, the outcome, and the artifact that proves it. A task that produced no artifact says so and says why.

### Blocked Task Protocol

A task is marked `[B]` only when an external dependency is missing and no in-scope substitute exists. The row names the dependency, the exact command that reproduces the block, and the safe fallback that keeps the phase honest — in this phase, an unavailable binary or credential would have moved every live claim into the source-read column rather than stopping the work.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] The vendored tree version matches the installed binary version (0.6.2)
- [x] [P0] The install is reversible and its rollback sentence is recorded
- [x] [P1] The probe scripts are re-runnable and their output files are the record
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] Probe scripts are plain shell with no arguments and no ambient state assumptions
- [x] [P1] The MCP probe exits after the tool list and calls no tool
- [x] [P2] Shellcheck-class issues reviewed by reading; no linter is configured for `scratch/`
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] [P0] Exit-code matrix: every command's status read from the process, not inferred
- [x] [P0] Negative control run, with its own expected failure and its own leak check
- [x] [P1] Credential control run with all provider keys cleared
- [x] [P1] MCP handshake run against a live server process the probe owns
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] [P0] No known defect left open in the pinned contract
- [x] [P1] The `--endpoint` flag's absence from help is documented as a discovery, not worked around
- [x] [P2] The vendor's own pitfall list was tested where testable without a key, and recorded as untested where not
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] No credential was written to any probe artifact; the sentinel string is the only key-shaped value and it is a dummy
- [x] [P0] The stderr of the negative-control run was checked for key material and carries none
- [x] [P1] The packet documents that a custom endpoint receives the bearer key, so only a trusted endpoint may be used
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] Every load-bearing claim in the references is tagged source-read or live-verified
- [x] [P1] The unconfirmed set is listed in one place instead of being scattered as hedges
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] Evidence lives under `scratch/`, which the retrieval conventions exclude from index scans
- [x] [P1] The packet references, not the probe transcripts, are what downstream phases read
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Eleven tasks and sixteen checklist rows closed. The contract is pinned from two independent directions that agree: the vendored source and a live 0.6.2 binary. The 22-command matrix includes one negative control whose expected failure is the transport class itself, and the transcript redacts its own sentinel so a leak would be visible. Four claims are deliberately left unconfirmed because settling them needs a provider credential, and they are listed rather than papered over.
<!-- /ANCHOR:summary -->
