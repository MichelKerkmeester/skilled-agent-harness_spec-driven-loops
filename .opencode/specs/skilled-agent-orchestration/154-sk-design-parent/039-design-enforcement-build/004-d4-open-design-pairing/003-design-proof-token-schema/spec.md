---
title: "D4-R3 — DESIGN_PROOF_TOKEN v1 content-bound token schema"
description: "Define a shared content-bound token (loadedFiles[].sha256, workflowModes, subject/brief/formAnswers/lineage digests, issuedAt/expiresAt, singleUse) in a new shared references/design_proof_token.md."
trigger_phrases:
  - "d4-r3 proof token schema"
  - "design proof token design build"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/003-design-proof-token-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked the proof token schema phase complete after build verification"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/references/design_proof_token.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R3 — DESIGN_PROOF_TOKEN v1 content-bound token schema

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
| **Enforcement class** | hybrid |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Design-context loading is self-attested today. A caller ticks checkboxes that no boundary can recompute, so a request can claim it loaded the right context while carrying none of it. Without a shared, content-bound proof, every enforcement surface would invent its own scheme.

### Purpose
Specify `DESIGN_PROOF_TOKEN v1` as a shared, content-bound structured token that carries `loadedFiles[].sha256`, `workflowModes`, subject, brief, form-answer, and lineage digests, and `issuedAt`, `expiresAt`, and `singleUse`. The token is defined once and imported by both the design skill (mint side) and the open-design transport (boundary side), so a boundary can recompute every field from the actual outgoing payload and deny on absence, staleness, or mismatch.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The v1 field set, types, and required/optional status
- Digest canonicalization rules that fix exactly which bytes feed each `sha256`/digest
- Mint-side versus boundary-side responsibilities and fail-closed semantics
- A VALID/REJECTED validator contract with a valid example and reject examples
- Consumers named by durable purpose only

### Out of Scope
- Building the run/build gate, pre-tool-use precondition, source-proof check, laundering guard, or freshness check
- Any executable minter or validator code
- Editing any live gate, hook, skill, or CLI file

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/references/design_proof_token.md` | Create | Shared `DESIGN_PROOF_TOKEN v1` schema and validator contract |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define the complete v1 field schema | Every field carries a type and required/optional status |
| REQ-002 | Specify byte-exact digest canonicalization | Each `sha256`/digest has a deterministic, unambiguous byte rule |
| REQ-003 | Separate mint-side and boundary-side responsibilities | Boundary recomputes from the actual payload and fails closed |
| REQ-004 | Document the VALID/REJECTED validator contract | A complete instance validates; missing-digest and malformed instances are rejected |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Name consumers by durable purpose | No spec, packet, or phase identifiers in the document body |
| REQ-006 | Freeze v1 and define forward evolution | Unknown or unsupported versions are rejected at the boundary |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A token instance with a complete, well-typed v1 field set validates under the documented contract.
- **SC-002**: A token missing any required digest, or with a malformed `expiresAt` or `singleUse`, is rejected by the shared validator.
- **SC-003**: The document body carries no spec, packet, or phase identifiers and no `specs/` paths.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Cited minimum token field set | Field schema loses its source anchor | Trace the schema to the cited content-bound field set |
| Dependency | `sk-design/references/` directory | Target path does not exist yet | Create the directory as part of the build |
| Risk | Ambiguous canonicalization | Mint and boundary derive different digests | Fix raw-byte and canonical-JSON rules with no normalization gaps |
| Risk | Consumers drift from one schema | Surfaces reinvent divergent tokens | Define the token once and name consumers by purpose |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Determinism
- **NFR-D01**: The same inputs always produce the same digest bytes, with no normalization gaps.

### Security
- **NFR-S01**: The token binds content through `sha256` and digests, never through self-attested booleans.
- **NFR-S02**: The boundary recomputes every digest from the actual outgoing payload and fails closed on any gap.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- **Empty optional data**: Each structured digest has an explicit empty/no-data canonical value.
- **Unreachable files**: The boundary recomputes `loadedFiles` hashes only when files are reachable and denies on mismatch.

### Error Scenarios
- **Future-issued token**: Rejected when `issuedAt` is in the future.
- **Replayed token**: Rejected when the `nonce` and `runId` pair has already been consumed.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One shared reference defines the token; two surfaces import it (mint side and boundary side).
- **Risk concentration**: Canonicalization ambiguity is the main risk, mitigated by byte-exact rules in section 4.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should the default TTL stay near 300 seconds for all surfaces? **RESOLVED: Yes, the contract sets an approximate 300-second default and rejects unreasonable spans.**
- Should the token prove design quality? **RESOLVED: No, it proves context and payload lineage only, not that the resulting design is good.**

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
- Evidence: the content-bound token field set (loaded-file sha256s, mode bundle, digests, TTL, single-use) this schema formalizes
-->
