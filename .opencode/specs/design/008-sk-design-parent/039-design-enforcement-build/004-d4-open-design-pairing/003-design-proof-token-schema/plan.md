---
title: "Implementation Plan: DESIGN_PROOF_TOKEN v1 content-bound token schema"
description: "Plan to author a new shared sk-design reference defining DESIGN_PROOF_TOKEN v1: field schema, digest canonicalization, mint vs boundary responsibilities, and the validator/acceptance contract."
trigger_phrases:
  - "design proof token plan"
  - "DESIGN_PROOF_TOKEN v1"
  - "content-bound token schema"
  - "design proof token canonicalization"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/003-design-proof-token-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Confirmed the plan against the delivered proof token contract"
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
# Implementation Plan: DESIGN_PROOF_TOKEN v1 content-bound token schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Deliverable** | One new doc: `.opencode/skills/sk-design/references/design_proof_token.md` |
| **Doc type** | Shared skill reference — `DESIGN_PROOF_TOKEN v1` schema + validator contract |
| **Imported by** | The design skill (mint side) and the open-design transport (boundary side) |
| **Format** | Markdown reference with a typed field table, a canonical JSON instance, and explicit digest rules |
| **Status** | Planned — authored when a gpt-5.5 implementer runs this brief; not yet implemented |

### Overview
Loading is self-attested today: a caller ticks checkboxes that no boundary can recompute. This plan specifies a single content-bound token so the run/build gate, the pre-tool-use precondition, the source-proof checker, the cross-delegation laundering guard, and the freshness checker all validate against ONE schema instead of inventing five. The token carries per-file `sha256`, the workflow-mode bundle, canonical subject/brief/form-answer/lineage digests, and `issuedAt`/`expiresAt`/`singleUse` so a boundary can recompute every field from the actual outgoing payload and deny on absence, staleness, or mismatch. This phase produces the schema reference only; the consuming gates are named, not built. Status: planning complete, implementation pending.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Objective and deliverable path frozen (new `references/design_proof_token.md`)
- [x] Field set sourced from cited evidence (iteration-035 minimum fields + research §7 token line)
- [x] Consumers enumerated by durable purpose (gate, pre-tool-use, source-proof, laundering guard, freshness)
- [x] Evergreen constraint understood (skill content carries no spec/packet/phase IDs)

### Definition of Done
- [x] Doc exists at the exact target path with the required frontmatter and section order
- [x] Every v1 field is documented with type and required/optional status
- [x] Digest canonicalization is byte-deterministic for each `sha256`/digest
- [x] Mint-side vs boundary-side responsibilities are separated and fail-closed is stated
- [x] Validator contract holds: a complete well-typed instance validates; a missing-digest or malformed `expiresAt`/`singleUse` instance is rejected
- [x] Doc body carries no spec/packet/phase IDs or spec paths (durable WHY only)
- [x] `checklist.md` items verified with evidence

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single shared reference doc that defines a structured token (carried as metadata, never free prose) plus a deterministic validator contract. Mint side computes; boundary side recomputes and compares; fail-closed on any gap.

### Target doc outline (the implementer authors these sections, in order)
1. **OVERVIEW** — what `DESIGN_PROOF_TOKEN v1` is; a content-bound, run-scoped, transport-neutral currency that replaces self-attested checkboxes; one schema imported by both the design skill and the open-design transport.
2. **FIELD SCHEMA (v1)** — a table of `field | type | required | meaning` covering: `version` (int, =1); `loadedFiles[]` of `{path, sha256}` (non-empty); `workflowModes[]` (non-empty, registry-valid); `subjectDigest`; `briefDigest`; `formAnswersDigest`; `openDesignLineageDigest`; `issuedAt` (ISO-8601 UTC); `expiresAt` (ISO-8601 UTC, ~300s TTL); `singleUse` (bool); `nonce`/`runId` (required when `singleUse` true); `mintedBy`; `boundSurface`.
3. **JSON SHAPE** — one complete, well-typed example instance.
4. **DIGEST CANONICALIZATION** — exactly which bytes feed each `sha256`/digest: `loadedFiles[].sha256` over raw file bytes as read (no normalization), `path` as repo-relative POSIX key; a canonical-JSON rule (UTF-8, code-point-sorted keys, compact separators, NFC strings, integers without exponent, arrays order-preserving, the digest field excluded from its own input) used by the structured digests; `subjectDigest` over an NFC, outer-trimmed, internal-whitespace-collapsed subject string; `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest` over their canonical-JSON objects, each with an explicit empty/no-data canonical value.
5. **MINT-SIDE RESPONSIBILITIES** — the design skill mints at the point design is authorized: hash each loaded file, compute the four content digests from the actual outgoing subject/brief/form-answers/lineage, set `version`/`issuedAt`/`expiresAt`/`singleUse`/`nonce`/`mintedBy`/`boundSurface`, and emit the token as structured metadata.
6. **BOUNDARY-SIDE RESPONSIBILITIES** — the tool boundary re-validates: required-field + type + supported-version checks; temporal check (`issuedAt` <= now < `expiresAt`, reject future-issued); single-use/nonce replay rejection; RECOMPUTE the four digests from the actual outgoing payload and deny on mismatch; recompute `loadedFiles` hashes when files are reachable; fail-closed on absence, staleness, mismatch, or validator exception.
7. **VALIDATOR CONTRACT & ACCEPTANCE** — enumerated PASS and REJECT rules plus a valid example and reject examples (missing required digest; malformed `expiresAt`; malformed `singleUse`).
8. **CONSUMERS** — the shared currency consumed by the all-surface run/build gate, the executable pre-tool-use precondition, the source-proof checker, the cross-delegation laundering guard, and the temporal/subject freshness checker; named by durable purpose only; this doc defines the token, it does not build the consumers.
9. **VERSIONING** — v1 frozen; additive forward evolution; unknown/unsupported version is rejected at the boundary.

### Data flow
1. Design skill loads context and authorizes a design decision.
2. Mint side computes file hashes + subject/brief/form-answers/lineage digests, stamps `issuedAt`/`expiresAt`/`singleUse`/`nonce`, and attaches the token as structured metadata.
3. The token travels with the outgoing request to the open-design transport.
4. Boundary side recomputes every digest from the actual payload, checks expiry and replay, and denies on any mismatch or absence.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create the `references/` directory under `sk-design` (does not exist yet)
- [x] Scaffold `design_proof_token.md` with frontmatter, H1, and the nine section headers from the outline

### Phase 2: Core Implementation
- [x] Author OVERVIEW and the v1 FIELD SCHEMA table (all fields typed, required/optional marked)
- [x] Author the complete JSON SHAPE example instance
- [x] Author DIGEST CANONICALIZATION with byte-exact rules for every digest
- [x] Author MINT-SIDE and BOUNDARY-SIDE responsibilities, including fail-closed semantics
- [x] Author the VALIDATOR CONTRACT & ACCEPTANCE rules with valid + reject examples
- [x] Author CONSUMERS (durable purpose, no IDs) and VERSIONING

### Phase 3: Verification
- [x] Walk a complete well-typed instance through the validator rules, it validates
- [x] Walk missing-digest, malformed-`expiresAt`, and malformed-`singleUse` instances, each is rejected
- [x] Grep the doc body for spec/packet/phase IDs and spec paths, none present
- [x] Update `implementation-summary.md` and mark `checklist.md` with evidence

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Schema completeness | Every v1 field has type + required status | Manual table walk against the cited field set |
| Canonicalization determinism | Same inputs always yield same digest bytes | Trace each digest's byte rule for ambiguity |
| Acceptance (positive) | Complete well-typed instance validates | Apply the documented validator rules to the JSON SHAPE example |
| Acceptance (negative) | Missing digest / malformed `expiresAt` / malformed `singleUse` rejected | Apply validator rules to the reject examples |
| Evergreen | No spec/packet/phase IDs or spec paths in body | `rg` over the doc body for ID and `specs/` patterns |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Cited field set (minimum token fields) | Evidence | Green | Field schema loses its source anchor |
| Cited research token line (loadedFiles/digests/TTL/singleUse) | Evidence | Green | Digest + TTL scope underspecified |
| Existing proof primitives (proof cards, deterministic proof checker) | Reference | Green | Voice/shape alignment weakens |
| `sk-design/references/` directory | Internal | Missing | Must be created in Phase 1 |
| Run/build gate, pre-tool-use, source-proof, laundering guard, freshness checker | Downstream | Not built here | Consumers reference this schema later; out of scope |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Schema is wrong, ambiguous, or conflicts with a consuming gate's needs.
- **Procedure**: Delete the single new file `references/design_proof_token.md` (and the empty `references/` dir if newly created), or `git revert` the authoring commit. No live target file is modified by this phase, so rollback has no blast radius beyond the new doc.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──> Phase 2 (Author) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Author |
| Author | Setup | Verify |
| Verify | Author | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (dir + skeleton) | Low | 15 minutes |
| Author (schema + canonicalization + contract) | Medium | 1.5-2.5 hours |
| Verification (acceptance walk + evergreen scan) | Low | 30 minutes |
| **Total** | | **2.25-3.25 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] New file path confirmed inside `sk-design/references/` (no live target touched)
- [x] No edits to any existing skill, gate, hook, or CLI file
- [x] Authoring commit isolated to the new reference doc

### Rollback Procedure
1. **Immediate**: Delete `references/design_proof_token.md`
2. **Revert code**: `git revert HEAD` for the authoring commit if already committed
3. **Cleanup**: Remove the `references/` directory only if it was created empty by this phase
4. **Verify**: Confirm no consuming file imported the doc yet (this phase ships none)

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A, documentation-only artifact, no schema or data state created

<!-- /ANCHOR:enhanced-rollback -->

---
