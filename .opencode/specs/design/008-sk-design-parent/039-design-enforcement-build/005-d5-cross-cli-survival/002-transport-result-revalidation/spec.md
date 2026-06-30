---
title: "Feature Specification: D5-R2 — OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation"
description: "The return path into Open Design is blind: once work crosses into a CLI child the parent cannot prove what the child did, so a build with no judgment or a silent file write passes undetected."
trigger_phrases:
  - "d5-r2 transport result revalidation"
  - "open design transport result design build"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/002-transport-result-revalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 contract; mark phase complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r2-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: D5-R2 — OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `002-transport-result-revalidation` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The request path into Open Design is already guarded: the guarded proxy denies a design-affecting call unless a valid `DESIGN_PROOF_TOKEN` is bound to the outgoing payload. The return path has no equivalent. Once work crosses into a CLI child the parent loses visibility — a child can run an Open Design build with no design judgment loaded, or write files silently, and a final natural-language summary cannot prove otherwise.

### Purpose
Define `OPEN_DESIGN_TRANSPORT_RESULT v1`, the structured receipt a CLI child must demand-back after an Open Design transport op, plus the parent-side replay that recomputes and compares digests and **fails closed** when Open Design was used but no result returns. The contract cites the existing token and proxy contracts rather than redefining them, and names the honest residual: a text-only child with no machine-readable tool stream degrades digest matching to advisory.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author the `OPEN_DESIGN_TRANSPORT_RESULT v1` field schema (child-loaded skills, operation class, tools called, payload + lineage digests, proof-token reference).
- Author the parent re-validation algorithm with the three deny rules and explicit fail-closed semantics.
- Cite the proof-token and guarded-proxy contracts; name the text-only advisory residual; document the Agent-I/O-is-not-the-gate boundary.

### Out of Scope
- The `cli-*` ALWAYS wiring that demands the result back at dispatch time — that is the sibling phase D5-R5.
- Any change to the proof-token or guarded-proxy contracts, or to any live cli-* SKILL.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Create | The 192-line return-path contract: result schema, parent re-validation algorithm, three deny rules, named residual, Agent I/O boundary, and the cited token + proxy dependencies |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `OPEN_DESIGN_TRANSPORT_RESULT v1` result schema defined | schema names `childLoadedSkills`, `operationClass`, `toolsCalled[]`, the payload digests, and `designProofTokenRef` |
| REQ-002 | Three parent deny rules, each a fail-closed `DENY` | missing-result-when-OD-used, digest mismatch, and unlisted mutating call all map to `DENY` |
| REQ-003 | `designProofTokenRef` is a reference, never a re-mint | declared as nonce+runId pointing at the minted token; re-minting forbidden |
| REQ-004 | Multi-turn `start_run` build bound to the unlisted-mutating-call DENY | a `start_run` flow whose later build wrote files with no matching `toolsCalled` record is a `DENY` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Proof-token and guarded-proxy contracts cited, not redefined | both referenced by path; token internals and the request-path precondition are not restated |
| REQ-006 | Text-only `cli-claude-code` residual named as advisory | the residual is stated as advisory-only with no deterministic guarantee, not silently passed |
| REQ-007 | Agent I/O documented as not the gate | optional-advisory; its absence never passes and its presence never replaces the structured result |
| REQ-008 | Deliverable is evergreen | no spec path / packet / phase / ADR / REQ / task / finding ID in the contract |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Parent re-validation rejects a returned result whose manifest/assertion/result digests do not match, and fails closed when Open Design was used but no result envelope is present.
- **SC-002**: A text-only child without a structured tool stream is flagged advisory, not silently passed; the contract claims no deterministic guarantee on that path.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The text-only `cli-claude-code` path has no machine-readable tool stream | Digest matching cannot be deterministic there | Name the residual as advisory-only; require a structured result + replayable tool metadata for a machine-checkable pass |
| Risk | The contract could drift from the token/proxy contracts if it restated them | Two copies of the digest convention or the precondition would diverge | Reference both contracts by path; redefine neither |
| Dependency | `design_proof_token.md` (digest convention, validator behavior) | Cited | Green — exists; the schema reuses its `sha256:<hex>` convention by reference |
| Dependency | `guarded_proxy.md` (request-path precondition) | Cited | Green — exists; the return path mirrors its deny-by-default posture |
| Dependency | Sibling `cli-*` ALWAYS wiring (D5-R5) | Consumer | Out of scope here; that phase demands this result back at dispatch time |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The contract references the token and proxy contracts so each rule has a single source of truth and the copies cannot drift.
- **NFR-M02**: The deliverable is evergreen — no ephemeral artifact IDs — so it survives doc reorganization.

### Safety
- **NFR-S01**: The parent fails closed on every missing, ambiguous, mismatched, stale, or exception path; ALLOW requires a complete replay.
- **NFR-S02**: The return receipt cannot manufacture authorization; `designProofTokenRef` may only point at the token already minted for the run boundary.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Multi-turn build
- `start_run` returns a discovery form and a later UI response fires a build that writes files: every mutating call must appear in `toolsCalled`; an absent record is a `DENY`.

### Operation-class drift
- A child may classify a pure read as guarded when the read fed a design decision, but it may not downgrade observed writes, run advancement, generated files, or UI responses to `read` or `transport`.

### Text-only channel
- A `cli-claude-code` child returns prose only: report the advisory residual, compare any supplied digests, but never claim a deterministic pass.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 9/25 | One new markdown contract: schema + algorithm, no running code |
| Risk | 11/25 | No code/DB; risk is the honest text-only residual and citation discipline |
| Research | 6/20 | Mirrors the established request-path token + proxy pair |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None outstanding. The text-only `cli-claude-code` advisory residual and the D5-R5 `cli-*` wiring boundary are documented design boundaries, not open defects.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
