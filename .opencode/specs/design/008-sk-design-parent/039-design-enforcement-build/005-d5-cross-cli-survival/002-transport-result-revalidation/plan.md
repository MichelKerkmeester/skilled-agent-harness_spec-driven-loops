---
title: "Implementation Plan: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation"
description: "Author a return-path contract defining the transport result schema and the parent replay that fails closed on missing/mismatched digests or unlisted mutating Open Design calls."
trigger_phrases:
  - "transport result revalidation plan"
  - "open design transport result schema"
  - "parent fail-closed re-validation"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/002-transport-result-revalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark plan phases complete; rename L2 anchors to canonical"
    next_safe_action: "Run validate.sh --strict and confirm zero non-metadata findings"
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
# Implementation Plan: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact** | New markdown contract reference: `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` |
| **Kind** | Knowledge-base contract doc (defines a schema + an algorithm; builds no running code) |
| **Cited contracts** | `.opencode/skills/sk-design/references/design_proof_token.md` (the token); `.opencode/skills/mcp-open-design/references/guarded_proxy.md` (the request-path precondition) |
| **Validation** | Doc-level review only — contract completeness, citation correctness, evergreen lint. No strict-validate, no codex, no live skill edits this phase. |

### Overview
The request path is already guarded: `guarded_proxy.md` denies a design-affecting Open Design call unless a valid `DESIGN_PROOF_TOKEN` is bound to the outgoing payload. But once work crosses into a CLI child the parent loses visibility — a child can run a build with no judgment, or write files silently, and a final natural-language summary cannot prove otherwise. This plan authors the **return-path counterpart**: `OPEN_DESIGN_TRANSPORT_RESULT v1`, the structured result a CLI child must demand-back after an Open Design transport op, plus the parent-side replay that recomputes and compares digests and **fails closed** when Open Design was used but no result returns. The deliverable cites the existing token and proxy contracts rather than redefining them, and names the honest residual: a text-only child with no machine-readable tool stream degrades digest matching to advisory.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The request-path contracts (`design_proof_token.md`, `guarded_proxy.md`) are read and their citation boundary is fixed (this doc references, never redefines). — both cited at `cli_child_pairing.md` lines 21-22
- [x] The Open Design mutating/destructive verb set and the multi-turn `start_run` build boundary are understood from the pairing skill. — `start_run`-then-build write bound to a DENY (lines 143, 158)
- [x] The scope boundary is confirmed: this phase authors only `cli_child_pairing.md`; the cli-* ALWAYS wiring is the sibling child-resident pairing phase. — `git status` shows only the new doc; D5-R5 named as consumer
- [x] Agent I/O is confirmed optional-advisory, so the result must not rely on it as the gate. — Agent-I/O-is-not-the-gate section (lines 174-178)

### Definition of Done
- [x] `cli_child_pairing.md` defines the `OPEN_DESIGN_TRANSPORT_RESULT v1` field schema. — schema table lines 32-64
- [x] It defines the parent re-validation algorithm with all three deny rules (missing-result-when-OD-used, digest mismatch, unlisted mutating call) and fail-closed semantics. — algorithm lines 132-160
- [x] It cites the token + proxy contracts and does not re-define token internals or the precondition. — cited as dependencies, neither redefined
- [x] The text-only `cli-claude-code` residual is named as advisory, not a deterministic guarantee. — Named Residual section (line 168)
- [x] The deliverable carries no spec/packet/phase IDs or spec paths (evergreen). — evergreen scan returned nothing

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Return-path contract mirroring the request-path precondition pair. The token proves context flowed INTO the call; the transport result proves what the child actually DID with it, demanded back and re-validated by the parent. Binary outcome, deny-by-default, fail-closed — the same posture as the guarded proxy.

### Key Components
- **`OPEN_DESIGN_TRANSPORT_RESULT v1` schema** — the envelope the child returns: `version`, `dispatchId`, `childLoadedSkills`, `direction` (WIRE/READ/RUN), `operationClass` (read/mutating/destructive/transport), `liveToolsListVerified`, `toolsCalled[]`, `toolCallDigests[]`, `runId`, `surfaceId`, the payload digests (`designManifestDigest`, `transportAssertionDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest`), a `designProofTokenRef` (nonce+runId reference into the minted token, NOT a re-mint), `loadedTransportFiles[]`, `artifactRefs[]`, `validationStatus`, `missingFields[]`.
- **Parent re-validation algorithm** — detect Open Design usage; reject a missing result when OD was used; schema/type check; recompute and compare payload + tool-call digests; reconcile the proof-token reference; require every mutating Open Design call to appear in `toolsCalled`; check operation-class consistency; fail closed on any exception or ambiguous reconstruction.
- **Named residual** — the text-only child path where no replayable tool stream exists, demoting digest matching to advisory.
- **Citations** — the token contract (digest canonicalization, validator rules) and the guarded-proxy precondition (the request-path gate), referenced by skill-relative path.

### Data Flow
1. Parent dispatches a CLI child for Open Design transport work, carrying the dispatch manifest + transport assertion digests.
2. Child loads judgment + transport, performs the Open Design op (possibly multi-turn: `start_run` → discovery form → `ui respond` → build that writes files).
3. Child emits `OPEN_DESIGN_TRANSPORT_RESULT v1` as structured metadata, recording the calls it made and the digests of its actual payload.
4. Parent recomputes the digests from the returned payload and compares them to the result + the originating manifest/assertion.
5. Parent reconciles the proof-token reference against the token minted for this run boundary.
6. Parent confirms every mutating Open Design call is listed; verifies operation-class consistency.
7. Parent returns ALLOW (accept the handoff) or DENY (reject; fail closed). Missing result when OD was used is a DENY, never a pass.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground and fix the citation boundary
- [x] Re-read `design_proof_token.md` (field schema, digest canonicalization, validator/acceptance) and `guarded_proxy.md` (canonical request, classification, precondition, named residual). — both read; citation boundary fixed
- [x] Extract the Open Design mutating/destructive verb set and the `start_run` multi-turn build boundary from the pairing skill. — verb set + multi-turn build boundary captured
- [x] Decide the exact reference wording so the doc cites token internals + the precondition rather than restating them. — references-by-path wording chosen

### Phase 2: Author the contract
- [x] Write the `OPEN_DESIGN_TRANSPORT_RESULT v1` field schema (table + a JSON shape example), reusing the token's `sha256:<hex>` digest convention by reference. — schema table + JSON example (lines 32-128)
- [x] Write the parent re-validation algorithm with the three deny rules and explicit fail-closed semantics. — algorithm + Deny Rules table (lines 132-160)
- [x] Write the named residual: text-only `cli-claude-code` with no structured tool stream → digest matching is advisory, not deterministic. — Named Residual section (line 168)
- [x] Add the Agent-I/O-is-not-the-gate note (it may carry digests; its absence must never pass an Open Design handoff). — Agent I/O section (lines 174-178)
- [x] Add an Acceptance section enumerating the deny cases and the citation requirement. — Acceptance table (lines 182-192)

### Phase 3: Verification
- [x] Confirm the three deny rules are each stated and each map to a fail-closed DENY. — lines 156-158 verified
- [x] Confirm both contracts are cited by path and neither is redefined. — token + proxy cited (lines 21-22)
- [x] Confirm the residual is named and not overstated as a guarantee. — advisory-only, no deterministic claim (line 168)
- [x] Confirm the deliverable contains no spec/packet/phase IDs or spec paths. — evergreen scan clean
- [x] Confirm scope: only `cli_child_pairing.md` was authored; no cli-* SKILL was edited. — `git status` shows only the new doc

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Required sections present (schema, parent algorithm, residual, acceptance) | Manual read / grep |
| Citation | The two cited contracts resolve and are referenced, not redefined | grep for the reference paths |
| Negative-control reasoning | Each deny rule rejects its case; missing-result-when-OD-used is a DENY | Walkthrough against the named scenarios |
| Evergreen lint | No spec/packet/phase IDs, no spec paths in the deliverable | grep for digit-prefixed IDs and `specs/` paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `design_proof_token.md` | Internal (cited) | Green — exists | Cannot reference token digest/validator rules; would have to inline (forbidden) |
| `guarded_proxy.md` | Internal (cited) | Green — exists | Cannot reference the request-path precondition counterpart |
| `mcp-open-design/SKILL.md` pairing + verb surface | Internal (evidence) | Green — exists | Cannot enumerate mutating verbs / the multi-turn build boundary |
| `agent-io-contract.md` (advisory status) | Internal (evidence) | Green — exists | Cannot justify why the result, not Agent I/O, is the gate |
| Sibling cli-* ALWAYS wiring (child-resident pairing phase) | Internal (consumer) | Out of scope here | None for authoring; that phase consumes this contract |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The contract conflicts with the token/proxy contracts, or over-claims enforcement on the text-only path
- **Procedure**: Delete the single new `cli_child_pairing.md` (additive, one file; nothing else is touched this phase)

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Ground + cite) ──> Phase 2 (Author contract) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Ground + cite | None | Author |
| Author contract | Ground + cite | Verify |
| Verify | Author contract | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Ground + fix citation boundary | Low | 30 minutes |
| Author schema + parent algorithm + residual | Medium | 1.5-2 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2.5-3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the file is net-new and additive (no existing reference is overwritten). — `git status` shows `cli_child_pairing.md` as untracked (net-new)
- [x] Confirm no cli-* SKILL was edited (scope boundary held). — no cli-* SKILL appears in `git status`; only the new doc

### Rollback Procedure
1. **Immediate**: Remove `.opencode/skills/mcp-open-design/references/cli_child_pairing.md`
2. **Verify**: No other reference links to the removed file
3. **Note**: Single-file, additive change — no migration, no data, no cross-skill edits to reverse

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable (documentation-only)

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~150 lines)
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Documentation-authoring deliverable: one contract reference doc
- Scope boundary: this phase authors the contract; the cli-* ALWAYS wiring is the sibling pairing phase
-->
