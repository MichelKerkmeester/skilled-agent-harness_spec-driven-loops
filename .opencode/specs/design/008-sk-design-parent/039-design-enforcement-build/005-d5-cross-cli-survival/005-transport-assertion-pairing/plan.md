---
title: "Implementation Plan: OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing"
description: "Append a child-resident transport-assertion section to the CLI child pairing contract: pair each transport result with a checkable, content-bound assertion the parent re-validates."
trigger_phrases:
  - "transport assertion pairing plan"
  - "open design transport assertion schema"
  - "child-resident pairing re-validation"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/005-transport-assertion-pairing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all plan phases complete; rename L2 anchors to canonical"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/cli_child_pairing.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r5-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Artifact** | Appended section in the existing CLI child pairing contract: `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` |
| **Kind** | Knowledge-base contract doc (extends an existing schema + algorithm; builds no running code) |
| **Mutation class** | APPEND-ONLY — add one new H2 section at the end of the file; modify no existing line |
| **Cited contracts** | `.opencode/skills/sk-design/references/design_proof_token.md` §2 (field/digest schema) and §6 (boundary-side recompute-and-reject); the same file's existing transport-result schema and parent re-validation |
| **Validation** | Doc-level review only — contract completeness, citation correctness, evergreen lint, preserved-content diff. No strict-validate, no codex, no live skill edits this phase. |

### Overview
The return path already has a post-operation receipt: `OPEN_DESIGN_TRANSPORT_RESULT v1` lets the parent replay what a CLI child actually did and fail closed when Open Design was used but no result returns. What is still missing is a **pre-operation self-assertion** the child carries into the boundary — and a rule that **pairs** that assertion with the returned result so the parent re-validates one against the other. Today the result's `transportAssertionDigest` only digests the assertion the child *received*; nothing requires the child to *emit* its own assertion, and nothing forces the assertion's claims (skills loaded, operation class, live tool surface) to be **content-bound and recomputable** rather than a bare claim.

This plan authors `OPEN_DESIGN_TRANSPORT_ASSERTION v1`: a child-resident assertion carrying `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, and content-bound `payloadDigests`, plus the **pairing rule** that every transport op carries both an assertion (pre-op) and a result (post-op), and the parent re-validation extension that recomputes the assertion's digests and reconciles assertion ↔ result ↔ originating manifest, failing closed on any gap. The deliverable reuses the proof-token §2 digest schema and §6 recompute-and-reject discipline by citation — exactly as the existing laundering guard reuses them — and names the honest residual where the assertion degrades to advisory.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The existing transport-result schema and parent re-validation algorithm are read, and the citation boundary is fixed (extend, never redefine the result or the token).
- [x] The proof-token §2 field/digest schema and §6 boundary-side recompute-and-reject rules are read, so the assertion's `payloadDigests` and the re-validation extension cite them rather than restating them.
- [x] The placement decision is fixed: APPEND one new H2 section at the end of the file so no existing line (result schema, parent re-validation, result deny rules, result residual, Agent I/O, result acceptance, laundering guard) is touched.
- [x] The scope reconciliation is recorded: the phase spec names the three cli-* SKILLs as the eventual embed target; this phase authors the CONTRACT home, and the cli-* ALWAYS-rule embedding is named as the downstream consumer (see Dependencies).

### Definition of Done
- [x] The appended section defines the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` field schema (`childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, plus `version`, `dispatchId`, and a self-excluding `assertionDigest`).
- [x] It states the result↔assertion pairing rule: every Open Design transport op carries both, and the assertion's digests must reconcile against the matching result digests and the originating dispatch manifest.
- [x] It defines the parent re-validation extension citing proof-token §2 (digest field schema) and §6 (recompute-and-reject), with all assertion deny rules mapping to fail-closed `DENY`.
- [x] The text-only / unmodifiable-child residual is named as advisory, with the parent demand-back + transport-result re-validation as the enforceable floor.
- [x] The deliverable carries no spec/packet/phase IDs or spec paths (evergreen), and a diff confirms every pre-existing section is preserved verbatim.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Pre-op self-assertion paired with the existing post-op receipt. The proof token proves design context flowed INTO the boundary; the transport result proves what the child DID; the transport **assertion** is the child's own pre-op declaration of pairing state, made **checkable** by binding the same content digests the parent can recompute. Binary outcome, deny-by-default, fail-closed — the same posture as the guarded proxy, the transport-result re-validation, and the laundering guard.

### Key Components
- **`OPEN_DESIGN_TRANSPORT_ASSERTION v1` schema** — the child-resident block: `version`; `dispatchId`; `childLoadedSkills` (MUST include design judgment + transport for a design-affecting op); `operationClass` (`read`/`mutating`/`destructive`/`transport`, conservative — never downgrade observed behavior); `liveToolsListVerified` (boolean — the child confirmed the live Open Design tool surface before relying on tool names or mutability); `payloadDigests` (the content-bound subject/brief/form-answer/lineage/manifest digests, reusing the proof-token §2 digest fields and canonicalization by citation); and `assertionDigest` (digest of the assertion envelope excluding itself, so altered assertion metadata is detectable — the twin of `transportResultDigest`).
- **Result↔assertion pairing rule** — every transport op carries BOTH blocks. The assertion's `payloadDigests` must reconcile against (a) the `transportAssertionDigest`/manifest digests the parent issued, and (b) the corresponding digests in the returned `OPEN_DESIGN_TRANSPORT_RESULT`. A claim with no recomputable digest is not an assertion.
- **Parent re-validation extension** — reuses proof-token §6: recompute the assertion's `payloadDigests` from the material available to the parent and reject on mismatch; reject a missing assertion when Open Design was used; reject an `operationClass` that downgrades observed behavior; reject `liveToolsListVerified=false` on a tool-name/mutability-dependent call; reject `childLoadedSkills` lacking design judgment; reject a non-recomputing `assertionDigest`. Fail closed on any exception or ambiguous reconstruction.
- **Named residual** — text-only / unmodifiable child paths where the assertion is prose-only or absent, demoting assertion checking to advisory and leaving the parent demand-back + transport-result re-validation as the floor.
- **Citations** — the proof-token §2 (digest schema) and §6 (boundary-side rules), and the file's own existing transport-result schema, referenced rather than redefined.

### Data Flow
1. Parent dispatches a CLI child for Open Design transport work, carrying the dispatch manifest + transport assertion digests.
2. Child loads judgment + transport, then emits an `OPEN_DESIGN_TRANSPORT_ASSERTION v1` declaring loaded skills, operation class, live-tools verification, and content-bound payload digests BEFORE the design-affecting op.
3. Child performs the Open Design op and emits the `OPEN_DESIGN_TRANSPORT_RESULT v1` receipt.
4. Parent recomputes the assertion's `payloadDigests` from the material it holds and compares them to the result digests and the originating manifest.
5. Parent confirms `childLoadedSkills` carries design judgment, `operationClass` does not downgrade observed behavior, `liveToolsListVerified` holds where tool names/mutability mattered, and `assertionDigest` recomputes.
6. Parent returns `ALLOW` only when assertion and result reconcile completely; otherwise `DENY` (fail closed). A missing assertion when Open Design was used is a `DENY`, never a pass.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Ground and fix the append boundary
- [x] Re-read the existing `cli_child_pairing.md` (result schema, parent re-validation, deny rules, residual, Agent I/O, acceptance, laundering guard) and record the exact end-of-file insertion point.
- [x] Re-read proof-token §2 (field/digest schema) and §6 (boundary-side recompute-and-reject) and fix the reference wording so the new section cites them, never restates them.
- [x] Confirm which result fields the assertion pairs against (`transportAssertionDigest`, `designManifestDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest`).

### Phase 2: Author the assertion-pairing section (append-only)
- [x] Append a new H2 section "Open Design Transport Assertion Pairing" at the end of the file, leaving every prior line untouched.
- [x] Write the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` field schema (table + a JSON shape example), reusing the proof-token `sha256:<hex>` convention by reference.
- [x] Write the result↔assertion pairing rule (both blocks per op; assertion digests reconcile against result digests and the originating manifest).
- [x] Write the parent re-validation extension citing §2 and §6, with explicit fail-closed semantics.
- [x] Write the assertion deny-rules table (missing assertion when OD used; assertion↔result mismatch; assertion↔manifest mismatch; operationClass downgrade; liveToolsListVerified false on a dependent call; childLoadedSkills missing judgment; assertionDigest non-recompute).
- [x] Write the named residual (text-only/unmodifiable child → advisory; parent demand-back + transport-result re-validation as the floor; compromised-child forgery out of scope) and an Acceptance subsection.

### Phase 3: Verification
- [x] Confirm the four required assertion fields plus `version`, `dispatchId`, and `assertionDigest` are all defined.
- [x] Confirm the pairing rule and the re-validation extension both cite §2 and §6 and redefine neither the token nor the result.
- [x] Confirm each assertion deny rule maps to a fail-closed `DENY` and the residual is advisory, not a guarantee.
- [x] Confirm a diff shows every pre-existing section preserved verbatim (append-only).
- [x] Confirm the deliverable contains no spec/packet/phase IDs or spec paths (evergreen).

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Required subsections present (assertion schema, pairing rule, re-validation extension, deny rules, residual, acceptance) | Manual read / grep |
| Preserved-content | Every pre-existing section byte-identical; change is purely additive | `git diff` of the target file |
| Citation | Proof-token §2 and §6 referenced and not redefined; existing result schema referenced, not duplicated | grep for the reference anchors |
| Negative-control reasoning | Each assertion deny rule rejects its case; missing-assertion-when-OD-used is a DENY | Walkthrough against the named scenarios |
| Evergreen lint | No spec/packet/phase IDs, no spec paths in the deliverable | grep for digit-prefixed IDs and `specs/` paths |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing `cli_child_pairing.md` transport-result schema + parent re-validation | Internal (extended) | Green — exists | Cannot pair an assertion against a result; nothing to extend |
| `design_proof_token.md` §2 (field/digest schema) | Internal (cited) | Green — exists | Cannot bind `payloadDigests` to a recomputable schema; would have to inline (forbidden) |
| `design_proof_token.md` §6 (boundary-side recompute-and-reject) | Internal (cited) | Green — exists | Cannot reuse the recompute-and-reject discipline for the assertion |
| Parent MANDATORY PAIRING precondition in the Open Design transport skill | Internal (evidence) | Green — exists | Cannot mirror the precondition the child-resident assertion re-states across the boundary |
| cli-* ALWAYS-rule embedding (the three CLI SKILLs named as the eventual embed target) | Internal (consumer) | Out of scope here | None for authoring; that step consumes this contract and is reconciled here — the phase spec lists the cli-* SKILLs as TARGET, this phase homes the CONTRACT |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The appended section conflicts with the existing result schema or the token contract, or over-claims enforcement on the text-only path.
- **Procedure**: Delete the appended H2 section only; every pre-existing line is untouched, so removal restores the prior file exactly.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Ground + append boundary) ──> Phase 2 (Author section) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Ground + append boundary | None | Author |
| Author section | Ground + append boundary | Verify |
| Verify | Author section | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Ground + fix append boundary | Low | 30 minutes |
| Author assertion schema + pairing + re-validation extension + residual | Medium | 1.5-2 hours |
| Verification | Low | 30 minutes |
| **Total** | | **2.5-3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Confirm the change is append-only: the prior end-of-file is the insertion point and no existing section is edited.
- [x] Confirm no cli-* SKILL is edited this phase (scope boundary held).

### Rollback Procedure
1. **Immediate**: Remove the appended "Open Design Transport Assertion Pairing" H2 section from `cli_child_pairing.md`.
2. **Verify**: `git diff` shows the file back to its prior content; no other reference links to the removed section.
3. **Note**: Single-file, additive change — no migration, no data, no cross-skill edits to reverse.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: Not applicable (documentation-only)

<!-- /ANCHOR:enhanced-rollback -->

---

<!--
LEVEL 2 PLAN (~150 lines)
- Core + Level 2 addendum (phase deps, effort, enhanced rollback)
- Documentation-authoring deliverable: one appended contract section
- Scope boundary: this phase authors the CONTRACT home (append-only); the cli-* ALWAYS embedding is the downstream consumer
-->
