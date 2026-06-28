---
title: "Implementation Plan: Cross-delegation token laundering guard"
description: "planning. Boundary re-validation contract denying replay/omit/weaken of DESIGN_PROOF_TOKEN across delegation, paired with the transport-result re-validation."
trigger_phrases:
  - "cross delegation laundering guard"
  - "token replay omit weaken deny"
  - "child re-validate design token"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/007-cross-child-laundering-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases complete and align the Level 2 plan anchors"
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
# Implementation Plan: Cross-delegation token laundering guard

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact** | One evergreen Markdown reference contract (prose, no code) |
| **Recommended home** | Extend `cli_child_pairing.md` — add a "Cross-Delegation Token Laundering Guard" section (alternative: new `references/laundering_guard.md`) |
| **Depends on** | `DESIGN_PROOF_TOKEN v1` §2 field schema and §6 boundary rules (referenced, never redefined) |
| **Pairs with** | `OPEN_DESIGN_TRANSPORT_RESULT v1` parent re-validation (return-path twin) |
| **Validation** | Doc-only this phase — no strict-validate, no live edits, no codex |

### Overview
The proof-token contract names "Cross-delegation laundering guard" as a consumer but does not build it. This phase authors that guard: a parent/boundary re-validation contract that denies a child or delegated workflow from **replaying** a consumed token, **omitting** the token on a design-affecting child operation, or **weakening** the token's fields relative to the original mint.

The guard is the **request-path / token-side twin** of the existing **return-path** transport-result re-validation. The transport result is a post-operation receipt that reconciles a `designProofTokenRef`; the laundering guard governs the token as it travels down to the child and is re-validated before the design-affecting call fires. Because both halves are parent-boundary re-validation against the *same minted token*, co-locating them yields the lowest-duplication home.

The guard authors **zero new token schema**. It reuses §2 (replay defense: `singleUse` + `nonce` + `runId`) and §6 (boundary rules: required fields, time/TTL, single-use, replay consumed-set, surface match) and applies them at the cross-delegation boundary.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Gap and named consumer confirmed in the proof-token contract §8
- [x] Return-path twin (transport-result re-validation) read and understood
- [x] Reused source rules located: §2 replay defense, §6 boundary table
- [x] Home options enumerated with a duplication-minimizing recommendation

### Definition of Done (acceptance for the authored doc)
- [x] Doc defines all three attacks: REPLAY, OMIT, WEAKEN — Threat Model table in the appended section
- [x] Doc defines one DENY rule per attack, each reusing §2/§6 (no second schema) — Deny Rules table: consumed-pair replay, missing child design token, relaxed token fields
- [x] Doc names the residual: a fully-compromised child forging a digest-valid token from stolen authorized inputs is out of scope — Named Residual paragraph
- [x] Doc names what still speaks the old contract: an unmodifiable child CLI that ignores the guard — Named Residual paragraph, covered by the parent demand-back floor
- [x] Doc is evergreen — no spec/finding/ADR IDs, iteration numbers, or line numbers — evergreen scan over the appended body clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Boundary re-validation contract. Pure consumer of `DESIGN_PROOF_TOKEN v1`; it adds no fields, no schema, no token internals. It states durable deny rules at the parent/agent boundary the parent controls.

### Home decision (recommended: extend `cli_child_pairing.md`)
Recommend extending `cli_child_pairing.md` rather than a standalone `laundering_guard.md`, because the lowest-duplication home is the document the guard pairs with:

- It already cites `DESIGN_PROOF_TOKEN` as a dependency and explicitly does not redefine token internals — the exact stance the guard needs.
- Its parent re-validation already reconciles `designProofTokenRef.nonce` / `.runId` against the minted token; the replay and weaken checks **extend that same reconciliation** instead of duplicating it.
- Its Deny Rules table already covers missing token reference, token-reference mismatch, surface drift, and stale replay state; OMIT and WEAKEN denials are natural rows in the same table.
- It already carries a Named Residual section (text-only child); the forge-from-stolen-inputs residual joins it rather than spawning a second residual scaffold.

> **Deviation flagged (logic-sync, non-blocking):** the phase `spec.md` and the upstream finding framed the home as a new shared `design_delegation_payload.md` imported by `cli-*` plus an `agent-io-contract.md` extension. This plan narrows to the laundering-guard *deny contract* and homes it with its return-path twin, per the dispatch brief ("recommend the lowest-duplication home; it pairs with the transport-result re-validation"). The dispatch carrier (mandatory token block in `cli-*` dispatch) remains a separate concern; if the implementer prefers, the guard MAY instead land as a new `references/laundering_guard.md` sibling — the contract content is identical, only the home changes. Surface this choice at execution.

### Key Components (of the authored contract)
- **Threat model — three laundering attacks:**
  - **REPLAY** — present a token whose `nonce` + `runId` pair was already consumed by an earlier design-affecting operation (reuse of a single-use credential).
  - **OMIT** — run a design-affecting child operation (run start/redesign, ui respond/prefill, media generate) carrying **no** token, hoping absence is treated as exempt or advisory.
  - **WEAKEN** — present a token derived from a real mint but mutated to relax validation: strip/flip `singleUse`, extend `expiresAt` (or backdate `issuedAt`) to dodge TTL/freshness, or swap `boundSurface` to a different target than was authorized.
- **Deny rule per attack (each reusing §2/§6):**
  - **Replay → consumed-set check.** Reuse §2 replay defense and §6 "Replay: reject a `nonce` and `runId` pair already consumed." The parent owns the run-scoped consumed-set; any reappearance of a consumed pair → DENY.
  - **Omit → required-token-on-child-design-op.** Reuse §6 "reject if any required field is absent," elevated so that token *presence* is mandatory on the child design boundary. Absence is never "exempt" — fail closed.
  - **Weaken → field-integrity re-validation against the original mint.** Reuse §6 (single-use must be exactly `true`; time/TTL window must not exceed the original mint; `boundSurface` must match both the minted surface and the outgoing op target) plus §2 schema. Any relaxation vs. the original mint → DENY. The content-bound digests (subject/brief/form/lineage + `loadedFiles` hashes) make silent weakening detectable: an edited/re-minted token cannot reproduce the digests without re-doing the authorized load and canonicalization.
- **Two enforcement points:**
  - **Child boundary** — PreToolUse re-validation before the design-affecting call: catches replay (consults consumed-set), omit (no token → deny), weaken (field-integrity check before the call). Best-effort; available only on modifiable children.
  - **Parent demand-back** — the existing post-operation parent re-validation reconciles `designProofTokenRef` against the mint and denies any handoff whose referenced token was replayed, omitted, or weakened. This is the enforceable floor.
- **Named residuals (honest boundary):**
  - The text-only child residual already named in the pairing contract extends here — a text-only child can claim a token in prose the parent cannot deterministically reconcile (advisory only).
  - The guard is enforceable at the parent/agent boundary; a **fully-compromised child that forges a digest-valid token from stolen authorized inputs** (real loaded files, real subject/brief/form/lineage, re-minted inside the freshness window before consumption is recorded) is **out of scope**.
  - An **unmodifiable child CLI that ignores the guard** cannot run the child-side re-validation; it remains covered by the parent demand-back floor but loses the early child-side deny. Named as the component still speaking the old contract.

### Data Flow
1. Parent mints `DESIGN_PROOF_TOKEN` after sk-design context load and authorization.
2. Parent dispatches to the child carrying the token.
3. Child boundary re-validates before the design-affecting call: consumed-set (replay), presence (omit), field-integrity vs. mint (weaken).
4. On pass, the operation runs and consumes the `nonce` + `runId`.
5. Parent demand-back reconciles the returned `designProofTokenRef` against the minted token and the consumed-set.
6. Return ALLOW only on complete, non-laundered reconciliation; DENY on every missing, replayed, omitted, weakened, ambiguous, stale, or exception path.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| Phase | Deliverable | Status |
|-------|-------------|--------|
| Frame | Re-read §2/§6, lock the home (append to `cli_child_pairing.md`), record the deviation | [x] Done |
| Author | Append the threat model, the three §2/§6-reusing deny rules, two enforcement points, the named residual | [x] Done |
| Verify | Confirm attack→deny mapping, no second schema, residuals named, evergreen, pure append | [x] Done |

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Check | Scope | Method |
|-------|-------|--------|
| Attack coverage | All three attacks (replay/omit/weaken) are defined with a worked example each | Manual read-through |
| Deny mapping | Each attack maps to exactly one deny rule that cites §2/§6 | Cross-reference against proof-token §2/§6 |
| No schema drift | Doc references token fields but defines no new schema/fields | Grep for field-definition tables |
| Residual honesty | Forge-from-stolen-inputs and unmodifiable-child residuals are stated, not hidden | Manual read-through |
| Evergreen | No spec/finding/ADR IDs, iteration numbers, or line numbers in the contract | Grep for ID/path patterns |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `DESIGN_PROOF_TOKEN v1` §2/§6 | Internal contract | Green | Guard has nothing to re-validate; blocked |
| `OPEN_DESIGN_TRANSPORT_RESULT v1` re-validation | Internal contract | Green | Loses the return-path demand-back floor |
| Parent-owned consumed-set | Boundary capability | Assumed | Replay defense degrades to advisory |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The authored guard duplicates token schema, contradicts §2/§6, or over-claims enforcement against a forged-input child.
- **Procedure**: Revert the `cli_child_pairing.md` section addition (or delete the new reference); the proof-token consumer line remains a named-but-unbuilt placeholder as before.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Frame) ──> Phase 2 (Author) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Frame | None | Author |
| Author | Frame | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Frame (read deps, lock home) | Low | 30 minutes |
| Author (threat model + 3 deny rules + residuals) | Medium | 1.5-2 hours |
| Verify (acceptance + evergreen) | Low | 30 minutes |
| **Total** | | **2.5-3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-authoring Checklist
- [x] Home recommendation recorded with deviation flagged
- [x] §2/§6 reuse points identified (no new schema)
- [x] Implementer confirmed the home choice at execution — appended to `cli_child_pairing.md` (51 insertions, 0 deletions)

### Rollback Procedure
1. **Immediate**: Revert the appended Cross-Delegation Token Laundering Guard section in `cli_child_pairing.md`.
2. **Verify**: Confirm the proof-token §8 consumer line still reads as named-but-unbuilt.

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN
- Doc-authoring phase (one evergreen reference contract)
- Planning only: no live edits, no codex, no strict-validate
-->
