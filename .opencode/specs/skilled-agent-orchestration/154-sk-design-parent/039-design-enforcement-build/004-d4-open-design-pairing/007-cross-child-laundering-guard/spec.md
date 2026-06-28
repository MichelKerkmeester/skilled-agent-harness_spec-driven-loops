---
title: "D4-R7 — Cross-delegation token laundering guard: replay/omit/weaken deny + child re-validate + demand-back"
description: "Append a Cross-Delegation Token Laundering Guard section to mcp-open-design/references/cli_child_pairing.md: the three laundering attacks (replay/omit/weaken), one fail-closed deny rule each reusing DESIGN_PROOF_TOKEN §2/§6, two enforcement points (child PreToolUse re-validation + parent demand-back), and the named parent-boundary-only residual."
trigger_phrases:
  - "d4-r7 cross-child laundering guard"
  - "child re-validate design build"
  - "token replay omit weaken deny"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/007-cross-child-laundering-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Upgrade spec to Level 2 and record the cli_child_pairing home deviation and residual"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# D4-R7 — Cross-delegation token laundering guard: replay/omit/weaken deny + child re-validate + demand-back

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Enforcement class** | hybrid |
| **Dimension** | D4 — mcp-open-design Pairing |
| **Completed** | 2026-06-28 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The proof-token contract names a "cross-delegation laundering guard" as a consumer but never builds it. Without that guard, a child or delegated workflow can launder design intent past a valid mint three ways: REPLAY a token whose `nonce` and `runId` pair was already consumed, OMIT the token on a design-affecting child operation and hope absence is treated as exempt, or WEAKEN a real-mint token by relaxing `singleUse`, freshness, or `boundSurface`. The transport-result re-validation already covers the return path; the request path down to the child was unguarded.

### Purpose
Author the laundering guard as the request-path token-side twin of the existing transport-result re-validation, homed where it pairs with that twin. The guard defines the three attacks, maps each to one fail-closed deny rule that reuses `DESIGN_PROOF_TOKEN v1` §2 (replay defense) and §6 (boundary rejection), names two enforcement points (child PreToolUse re-validation and the parent demand-back floor), and authors zero second token schema. The deliverable is an evergreen prose contract; the enforceable spine (proof token + transport-result re-validation + the parent boundary) already exists, and this binds the cross-delegation boundary as a re-validating consumer of it.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- One appended section, "Cross-Delegation Token Laundering Guard", in `.opencode/skills/mcp-open-design/references/cli_child_pairing.md`
- The three-attack threat model: REPLAY, OMIT, WEAKEN
- One fail-closed deny rule per attack, each reusing §2/§6 (consumed-pair replay, missing child design token, relaxed token fields)
- The two enforcement points: child PreToolUse re-validation before the design-affecting call, and the parent demand-back as the enforceable floor
- The named residuals: the unmodifiable-child CLI (covered only by the parent floor) and the fully-compromised-child forge-from-stolen-inputs case (out of scope for child-side guarantees)

### Out of Scope
- Any edit to a live skill, gate, hook, or CLI file beyond the named append to `cli_child_pairing.md`
- Defining a second `DESIGN_PROOF_TOKEN` schema or any new token field — §2/§6 are reused by citation only
- Closing the fully-compromised-child forge case or forcing an unmodifiable child CLI to run the child-side re-validation
- The mandatory dispatch-block carrier (a separate concern from the deny contract)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` | Modify (pure append) | Append the Cross-Delegation Token Laundering Guard section: threat model, three deny rules, two enforcement points, named residual, acceptance — 51 insertions, 0 deletions; the existing transport-result content is preserved |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Define all three laundering attacks | The section defines REPLAY (consumed `nonce`+`runId`), OMIT (design-affecting child op with no token), and WEAKEN (strip/flip `singleUse`, extend `expiresAt`/backdate `issuedAt`, swap `boundSurface`) |
| REQ-002 | One fail-closed deny rule per attack reusing §2/§6 | Replay → consumed-pair check (§2 + §6); Omit → required-token-on-child-design-op (§6 required-field, elevated); Weaken → field-integrity re-validation against the mint (§6 single-use/time/TTL/surface/digest) |
| REQ-003 | Author no second token schema | The section consumes proof-token fields and applies §6 rules by citation; it introduces no new token schema or field table |
| REQ-004 | Name two enforcement points | Child PreToolUse re-validation before the design-affecting call, and the parent demand-back reconciling `designProofTokenRef` against the mint, with parent demand-back named as the enforceable floor |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Name the parent-boundary-only residuals | The section names the unmodifiable-child CLI (loses child-side deny, covered by the parent floor) and the fully-compromised child forging a digest-valid token from stolen inputs (out of scope for child-side guarantees) |
| REQ-006 | Keep the section evergreen and pure-append | No spec, packet, or phase IDs and no `specs/` paths in the body; the existing transport-result / parent re-validation content is preserved (0 deletions) |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Cross-Delegation Token Laundering Guard section exists in `cli_child_pairing.md` as a pure append (51 insertions, 0 deletions) with the existing OPEN_DESIGN_TRANSPORT_RESULT and parent re-validation content fully preserved.
- **SC-002**: A replay (consumed pair), an omit (no token on a design-affecting child op), and a weaken (relaxed single-use/freshness/surface) each map to one fail-closed `DENY`; the section cites §2/§6 and adds no second schema.
- **SC-003**: Both enforcement points are named with parent demand-back as the floor, both residuals are stated honestly, and the body carries no spec/packet/phase IDs or `specs/` paths.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Home deviation from the scaffold framing | The scaffold framed a new shared `design_delegation_payload.md` + an `agent-io-contract.md` extension; the delivered home is an append to `cli_child_pairing.md` | Logic-sync recorded: the append co-locates the guard with its return-path twin (transport-result re-validation) for the lowest-duplication home; the dispatch-block carrier remains a separate, out-of-scope concern |
| Risk | The contract is prose, not code | A runtime that ignores the contract is not mechanically stopped by it | The enforceable spine (proof token + transport-result re-validation + the parent boundary) already exists; this binds the cross-delegation boundary as a re-validating consumer |
| Risk | A fully-compromised or unmodifiable child | The child-side early deny cannot be guaranteed on a child that forges a digest-valid token or ignores the guard | Residual NAMED, not implied away; the enforceable control is the parent demand-back floor at the boundary the parent controls |
| Dependency | `DESIGN_PROOF_TOKEN v1` §2 replay defense + §6 boundary rules | Green | No replay/required-field/integrity rules to reuse without it; the guard would have nothing to re-validate |
| Dependency | `OPEN_DESIGN_TRANSPORT_RESULT v1` parent re-validation | Green | Loses the return-path demand-back floor the guard pairs with |
| Dependency | Parent-owned run-scoped consumed-set | Assumed | Replay defense degrades to advisory without a parent-owned consumed-set |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Security
- **NFR-S01**: The boundary fails closed — replay, omission, weakening, ambiguity, stale state, or a validator exception returns DENY, never a silent allow.
- **NFR-S02**: A child cannot re-mint, mutate, summarize, or substitute the token to pass a looser boundary; the content-bound digests are the tamper evidence for weakening.

### Defense-in-Depth
- **NFR-DD01**: The guard adds a re-validation boundary, not a new token. The proof token plus the transport-result re-validation remain the authoritative spine; this re-applies §2/§6 at the cross-delegation boundary at two points.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Attack Variants
- **Consumed-pair reuse**: A token whose `nonce`+`runId` was already consumed reappears on a later child op → DENY against the parent-owned run-scoped consumed-set.
- **Absent token on a design op**: A design-affecting child operation carrying no token → DENY; absence is never exempt, fail closed.
- **Relaxed-field re-mint**: A token with `singleUse` flipped, the freshness window extended/backdated, or `boundSurface` swapped → DENY on field-integrity re-validation against the mint.

### Boundary Modes
- **Modifiable child**: Runs the child-side PreToolUse re-validation (consumed-set, presence, field integrity) before the guarded call; still reconciled at the parent floor.
- **Unmodifiable child CLI**: Cannot run the child-side re-validation; loses the early deny but stays covered by the mandatory, fail-closed parent demand-back.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

- **Surface count**: One appended section in an existing reference re-applies two already-defined rule sets (§2/§6) at the cross-delegation boundary; no source change.
- **Risk concentration**: The single material gap is a fully-compromised or unmodifiable child, which the section names as a parent-boundary-only residual rather than claiming to close.

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Where should the laundering guard live? **RESOLVED: Appended to `cli_child_pairing.md` as the lowest-duplication home — it co-locates with the return-path transport-result re-validation the guard twins, reuses the same parent re-validation reconciliation, and extends the existing Deny Rules and Named Residual sections instead of spawning a parallel scaffold. This is a logic-sync deviation from the scaffold framing (a new shared `design_delegation_payload.md` + `agent-io-contract.md` extension); recorded honestly. The mandatory dispatch-block carrier remains a separate concern, out of scope here.**
- Can this guard close a fully-compromised or unmodifiable child? **RESOLVED: No. A child that forges a digest-valid token from stolen authorized inputs inside the freshness window, or an unmodifiable child CLI that ignores the guard, cannot be stopped at the child side. The enforceable control is the parent demand-back floor — reconcile against the original mint, the run-scoped consumed-set, the outgoing target surface, and the replayable operation evidence, then deny anything that cannot be reconstructed. This is the honest parent-boundary-only residual; no taste claim.**

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
- Prose deny contract: cross-delegation token laundering guard, appended to cli_child_pairing.md as the request-path twin of the transport-result re-validation
- Home deviation (append to cli_child_pairing.md, not a new design_delegation_payload.md) and the parent-boundary-only residual recorded in RISKS/OPEN QUESTIONS
-->
