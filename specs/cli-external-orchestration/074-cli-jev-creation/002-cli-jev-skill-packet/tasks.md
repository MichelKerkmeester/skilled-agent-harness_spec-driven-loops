---
title: "Tasks: Phase 2: cli-jev-skill-packet"
description: "Task ledger for authoring the cli-jev packet: the transport SKILL.md with its eight enforced rules, four contract references, the question-shaping card, changelog and benchmark baseline."
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/074-cli-jev-creation/002-cli-jev-skill-packet"
    last_updated_at: "2026-09-20T10:10:00Z"
    last_updated_by: "claude-fable-5-1"
    recent_action: "Packet authored from phase 001 evidence; all rows closed"
    next_safe_action: "None; the phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-074-002-cli-jev-skill-packet"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2: cli-jev-skill-packet

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

- [x] T001 Confirm the packet folder shape against the hub's other modes (`cli-jev/`)
- [x] T002 Re-read phase 001's references so no claim is restated from memory
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Author the transport `SKILL.md`: when to use, how it works, rules, references, success criteria (`cli-jev/SKILL.md`)
- [x] T004 Declare eight hard rules with the check ids that enforce them (`cli-jev/SKILL.md` frontmatter)
- [x] T005 Author the CLI contract reference (`cli-jev/references/cli-reference.md`)
- [x] T006 Author the provider and model reference, including the gateway-key answer (`cli-jev/references/providers-and-models.md`)
- [x] T007 Author the integration patterns and the what-not-to-do table (`cli-jev/references/integration-patterns.md`)
- [x] T008 Author the MCP surface reference with the operator wiring block (`cli-jev/references/mcp-server.md`)
- [x] T009 Author the question-shaping card (`cli-jev/assets/question-shaping-card.md`)
- [x] T010 Author the mode README, the changelog entry and the benchmark baseline (`cli-jev/README.md`, `cli-jev/changelog/v1.0.0.0.md`, `cli-jev/benchmark/`)
- [x] T011 Author the playbook root so the scenario files have a declared parent (`cli-jev/manual-testing-playbook/manual-testing-playbook.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the frontmatter-versions gate over the packet and fix what it flags
- [x] T013 Confirm each declared rule id has an implemented check in the dispatch library
- [x] T014 Confirm every reference claim maps to a phase 001 evidence tag
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
- Consumes: `../001-jev-contract-research-and-pin/scratch/`
- Consumed by: `../003-hub-mode-registration/`, `../004-catalog-and-playbook/`
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

- Confirm the contract this packet documents is already pinned before writing a sentence of it
- Name the gate that will judge the artifact before authoring the artifact

### Task Execution Rules

| ID | Rule |
|----|------|
| TASK-SEQ | The reference cites the transcript; the transcript is never reconstructed from the reference |
| TASK-EVIDENCE | Every rule id is resolved against the implemented check registry before the packet is called done |
| TASK-SCOPE | Registration and enforcement wiring belong to the next phase; the packet only declares |

### Status Reporting Format

Status Reporting is one line per task naming the artifact produced. A task with no artifact says so.

### Blocked Task Protocol

A task is marked `[B]` only when an external dependency is missing. No task in this phase was blocked: every claim came from evidence the previous phase already captured.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] Phase 001 handoff criteria met: references exist and every claim is tagged
- [x] [P1] The mode is classified before its contract is written, so the rules follow the classification
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P1] No file-tool capability is declared: the mode cannot write even if asked
- [x] [P1] Frontmatter carries the four-part version the documentation gate requires
- [x] [P2] Each reference opens with its trigger phrases so retrieval can find it
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] [P0] Every declared rule id resolves to an implemented check (CI guard)
- [x] [P1] The frontmatter-versions gate passes over all four references
- [x] [P1] The eight rules were compared against the probes that exhibit their failure modes
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] [P0] The one gate failure found during authoring (a reference missing its version field) was fixed at the source, not suppressed
- [x] [P1] No rule was declared without a check, and no check was written that no rule declares
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] The packet never instructs a reader to put a key on a command line, and one rule refuses it
- [x] [P1] The custom-endpoint warning states that the bearer key travels to the endpoint named
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] The references are the contract; the SKILL.md links them instead of restating them
- [x] [P1] The two advisory rules explain which violation is legitimate
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P1] The packet follows the hub's mode layout: `SKILL.md`, `README.md`, `references/`, `assets/`, `manual-testing-playbook/`, `changelog/`
- [x] [P1] Benchmark and feature-catalog trees exist where the hub's other modes keep them
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Fourteen tasks and fourteen checklist rows closed. The packet declares its contract and its enforcement together, so a reader can check either against the other.
<!-- /ANCHOR:summary -->
