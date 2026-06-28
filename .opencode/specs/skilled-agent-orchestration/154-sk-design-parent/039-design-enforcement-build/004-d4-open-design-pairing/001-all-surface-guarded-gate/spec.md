---
title: "D4-R1 — All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "Author a deny-by-default guarded-proxy CONTRACT that normalizes MCP/HTTP/CLI/Skills requests into one canonical shape and runs openDesignDesignPrecondition before inner-agent spawn or build-fire."
trigger_phrases:
  - "d4-r1 guarded proxy gate"
  - "all-surface gate design build"
  - "opendesigndesignprecondition contract"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/001-all-surface-guarded-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark guarded proxy spec complete and record the daemon-side residual as a known limit"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R1 — All-surface guarded proxy + openDesignDesignPrecondition contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Enforcement class** | enforceable |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
One Open Design daemon backs four interchangeable surfaces (stdio MCP, HTTP API, the `od` CLI, in-app Skills). No single per-surface hook covers them all, so absent a shared chokepoint any surface can fire a design build or mutate state with no precondition check.

### Purpose
Author a guarded-proxy CONTRACT (not a running server) at the one convergent run/build boundary. The contract normalizes every surface's request into one canonical shape, then runs `openDesignDesignPrecondition` as a deny-by-default validator that requires a valid, fresh `DESIGN_PROOF_TOKEN` for every design-feeding or mutating call while letting pure-transport calls pass untouched. It also names, honestly, the residual it cannot close: the bundled daemon ships unmodifiable inside the Mac app, so a raw-HTTP-port call or in-app Skills-UI message that bypasses the agent-side adapter cannot be forced through the proxy.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The guarded-proxy boundary placement at the agent-side run/build chokepoint
- The request-normalization contract: one canonical request shape plus per-surface (MCP/HTTP/CLI/Skills) adapter mapping, lossless on security fields
- The two-axis `mutationClass × feedsDesignDecision` classifier (GUARDED vs EXEMPT)
- `openDesignDesignPrecondition`: deny-by-default validator that delegates token validity to the `DESIGN_PROOF_TOKEN` contract and adds a bound-surface match, fail-closed
- An embedded JSON policy block enumerating guarded vs exempt-transport tools, with a positive exemption allowlist
- A NAMED residual: the daemon-side bypass stated as out of scope

### Out of Scope
- Standing up an actual proxy server, minting or validating tokens at runtime, or shipping executable code
- Modifying the bundled Open Design daemon or the desktop app
- Rewriting `SKILL.md` (an optional single-line cross-link only)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/guarded_proxy.md` | Create | Guarded-proxy boundary CONTRACT, canonical request, classifier, precondition, embedded JSON policy, and named residual |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the request-normalization contract | A canonical request shape plus per-surface adapters; lossless on `surface`, `toolOrVerb`, `mutationClass`, `feedsDesignDecision`, `target`, token, and payload digest inputs |
| REQ-002 | Specify `openDesignDesignPrecondition` as deny-by-default | Delegates token validity to the `DESIGN_PROOF_TOKEN` contract, adds a bound-surface match, and fails closed on any gap |
| REQ-003 | Enumerate guarded vs exempt tools in a policy block | An embedded JSON policy parses and lists guarded sets plus a positive `exemptTransport` allowlist; unlisted defaults to GUARDED |
| REQ-004 | Name the daemon-side residual honestly | The contract states the raw-HTTP-port / in-app-Skills-UI bypass as out of scope because the bundled daemon is unmodifiable |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep the authored doc evergreen | No spec, packet, or phase identifiers and no `specs/` paths in the document body |
| REQ-006 | Cover the full tool inventory | Every tool in the tool-surface reference maps to GUARDED or EXEMPT in the policy block |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A design-feeding or mutating Open Design call WITHOUT a valid fresh `DESIGN_PROOF_TOKEN` is DENIED at the proxy on every wired surface (MCP, HTTP, CLI, Skills).
- **SC-002**: A listed pure-transport call with `feedsDesignDecision: false` is ALLOWED without requiring a token.
- **SC-003**: The daemon-side bypass is NAMED as out of scope, not silently passed, and the document body carries no spec/packet/phase identifiers.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Limitation | Daemon-side bypass (named residual) | A raw HTTP-port call or in-app Skills-UI message that skips the agent-side adapter cannot be forced through the proxy | Named in the contract as out of scope; honest agent-side enforcement boundary, not implied away |
| Dependency | `DESIGN_PROOF_TOKEN` contract | The precondition has nothing to validate token validity against | Delegate schema, freshness, replay, and digest checks to the token contract; do not redefine internals |
| Dependency | Tool-surface reference (inventory + classification) | The policy block cannot enumerate guarded vs exempt sets | Derive `guarded[]` and `exemptTransport[]` from the tool-surface classification |
| Risk | Lossy normalization across surfaces | A surface could launder a guarded call through a degraded canonical shape | Treat any field that cannot be reconstructed as guarded and deny unless a token checks against the real payload |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The proxy fails closed — absence, ambiguity, stale token state, validator exceptions, or unmapped surfaces are denial conditions.
- **NFR-S02**: The bound-surface check rejects a token minted for surface A and replayed on surface B.

### Determinism
- **NFR-D01**: Classification of any given tool is deterministic; an unlisted or unmapped operation always defaults to GUARDED.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Classification Boundaries
- **Design-feeding read**: A nominally read-only call whose output decides layout, styling, motion, or a build brief is GUARDED, not exempt.
- **Unlisted tool**: A new tool, route, command, or Skills action starts GUARDED until the tool-surface reference classifies it and the policy is updated.

### Error Scenarios
- **Unmapped HTTP route or Skills message**: Treated as guarded, not exempt transport, and denied when no token can be checked.
- **Token bound to the wrong target**: Denied when `boundSurface` does not match the normalized request target.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One contract governs four wired adapters (MCP, HTTP, CLI, Skills) through a single canonical request shape.
- **Risk concentration**: The daemon-side residual is the main uncovered surface and is named explicitly rather than hidden.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Can the bundled daemon be governed by this proxy? **RESOLVED: No. The daemon ships unmodifiable in the Mac app; the raw-HTTP-port and in-app-Skills-UI bypass is named as the out-of-scope residual, not silently passed.**
- Should pure-transport reads require a token? **RESOLVED: No. A positive `exemptTransport` allowlist passes inventory, status, and polling when `feedsDesignDecision` is false; everything unlisted defaults to GUARDED.**

<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`

---

<!--
LEVEL 2 SPEC
- Core + Level 2 verification focus
- Deliverable: references/guarded_proxy.md + embedded JSON policy block (CONTRACT, not a running server)
- Named residual: bundled daemon-side bypass is out of scope and stated honestly
-->
