---
title: "Acceptance Criteria: Port Orca CLI into mcp-tooling"
description: "Closure criteria for the executable planning packet and its delivered Orca integration; live mutation, publishing, and compiled-serving gates remain explicit."
trigger_phrases:
  - "Orca specification acceptance"
  - "mcp-orca closure gate"
  - "Orca evidence criteria"
  - "workflow packet acceptance"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/021-mcp-orca-cli"
    last_updated_at: "2026-09-19T12:31:05Z"
    last_updated_by: "implementation-owner"
    recent_action: "Reconciled acceptance matrix with delivered leaf and hub integration"
    next_safe_action: "Obtain authorization for disposable mutation/publishing tests or compiled-route activation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-021-mcp-orca-cli"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Which repository effects does a controlled disposable Orca mutation probe observe?"
      - "When may the compiled-routing activation manifest be refreshed and promoted?"
    answered_questions:
      - "Use a flat Level 3 packet rather than a phase-parent tree."
      - "Use an evidence-gated conservative runtime posture."
      - "The inspected Orca CLI surface is CLI-only for this packet."
---
<!-- SPECKIT_TEMPLATE_SOURCE: acceptance-criteria | v2.2 -->
# Acceptance Criteria: Port Orca CLI into mcp-tooling

> This document decides whether the planning packet may close. The rows verify specification readiness and document the delivered integration evidence where available; live mutating, publishing, and compiled-serving lanes remain separate operator gates.

<!-- ANCHOR:metadata -->
## 1. METADATA

**Packet:** mcp-tooling/021-mcp-orca-cli  
**Level:** 3  
**Status:** Complete — specification and source integration evidence captured
**Date:** 2026-09-19
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:criteria -->
## 2. CRITERIA

| AC-ID | REQ | Given / When / Then | Verification | Status | Waiver |
|-------|-----|---------------------|--------------|--------|--------|
| AC-001 | REQ-001 | Given the official `orca-cli` package is a discovery stub, when the source inventory is read, then executable resolution, guide loading, installation, documented domains, and non-guessing rules are recorded. | `research/research.md`, official source and docs URLs, and the source excerpt captured during research. | Met | - |
| AC-002 | REQ-002 | Given Orca behavior may mutate worktrees or terminals, when the implementation plan is reviewed, then workflow classification, mutation gates, unknowns, and required observations are explicit. | `spec.md` §§4, 6–8; `plan.md` phases 0–3 and rollback. | Met | - |
| AC-003 | REQ-003 | Given mcp-tooling uses coupled routing layers and one advisor identity, when the delivered integration is inspected, then every required registry, router, graph, human, and generated-manifest surface is present with its consistency proof. | `spec.md` implementation-surface table; `plan.md` affected-surfaces table and Phase 2; `research/research.md` local convention and integration evidence. | Met | - |
| AC-004 | REQ-004 | Given Orca browser behavior overlaps existing members, when the delivered routing boundary is inspected, then Orca-managed browser state, generic agentic browser work, and CDP work have distinct owners and aliases are replay-tested. | `spec.md` REQ-004, risk matrix, edge cases, leaf ownership rules, and dated routing evidence. | Met | - |
| AC-005 | REQ-006, REQ-007 | Given the packet must be maintainable after implementation, when the delivered scope is inspected, then leaf references, install guidance, manual playbook, benchmark evidence, changelog, and verification evidence are present. | `.pi/skills/mcp-tooling/mcp-orca-cli/`, hub playbook, `.skilled/skills/mcp-tooling/benchmark/reports/orca-integration/`, and `implementation-summary.md`. | Met | - |
| AC-006 | REQ-008 | Given read-only live preflight was authorized but state-changing operations remain separately gated, when the packet is closed, then it must state exactly what was delivered, what remains deferred, and what authorization is required. | `decision-record.md`, `implementation-summary.md`, `research/research.md`, and the dated benchmark report. | Met | - |
| AC-007 | REQ-009 | Given comment hygiene is a hard invariant, when the delivered implementation is inspected, then comments use durable rationale without spec paths or temporary identifiers. | `tasks.md` CHK-012 and the final implementation comment scan. | Met | - |
| AC-008 | REQ-005 | Given this packet is a Level 3 spec, when the final gate runs, then all scaffold placeholders are gone and strict validation prints `RESULT: PASSED`. | `tasks.md` CHK-031; final `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/mcp-tooling/021-mcp-orca-cli --strict` output. | Met | - |

### Status values

| Value | Meaning |
|-------|---------|
| `Met` | Verified; the Verification cell names observed evidence. |
| `Unmet` | Not yet satisfied; blocks closure. |
| `Waived` | Deliberately not pursued and backed by a decision record. |
| `Superseded` | Replaced by another criterion and backed by a decision record. |

<!-- /ANCHOR:criteria -->

## 3. CLOSURE STATEMENT

**Closeable:** Yes — specification and source integration deliverable; operator-gated runtime lanes remain.

All planning criteria are met with document and command evidence. The leaf and hub integration are evidenced separately; closure does not certify repository mutation, publishing, browser-driving, authentication, or compiled serving.
