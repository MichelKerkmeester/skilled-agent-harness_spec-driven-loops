---
title: "Implementation Summary: DESIGN_PROOF_TOKEN v1 content-bound token schema"
description: "Post-build record for the new sk-design DESIGN_PROOF_TOKEN v1 contract reference: what was built, how it was verified, the acceptance mapping, and that it is contract documentation not yet wired into consumers."
trigger_phrases:
  - "design proof token implementation summary"
  - "DESIGN_PROOF_TOKEN v1 summary"
  - "proof token contract build record"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/003-design-proof-token-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase implementation record and marked the checklist verified"
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
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-design-proof-token-schema |
| **Completed** | 2026-06-28 |
| **Level** | 2 |
| **Deliverable** | `.opencode/skills/sk-design/references/design_proof_token.md` (244 lines) |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

This phase delivered the single shared reference that defines `DESIGN_PROOF_TOKEN v1`, the content-bound proof token for design-affecting work. The token replaces self-attested loading checkboxes with structured metadata a boundary can recompute from the actual outgoing payload, so a gate can deny on absence, staleness, replay, surface drift, or digest mismatch. This is the shared currency that later gate, hook, and check phases validate against, defined once instead of reinvented per surface.

The reference carries the full v1 field schema (`section 2`), a complete well-typed JSON instance (`section 3`), byte-exact digest canonicalization rules (`section 4`), separated mint-side and boundary-side responsibilities (`sections 5 and 6`), a VALID/REJECTED validator contract with concrete reject examples (`section 7`), consumers named by durable purpose only (`section 8`), and a frozen versioning rule (`section 9`).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/references/design_proof_token.md` | Created | Defines `DESIGN_PROOF_TOKEN v1`: field schema, digest canonicalization, mint vs boundary contract, and the validator/acceptance gate |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementer authored one new reference file and verified it in place. A positive walk pushed the complete JSON instance through the documented validator rules and confirmed it validates. A negative walk pushed three malformed instances (missing required digest, malformed `expiresAt`, malformed `singleUse`) through the same rules and confirmed each is rejected. An evergreen scan over the document body found no spec, packet, or phase identifiers and no `specs/` paths. A scope check confirmed the change set is limited to the one new file, with no live gate, hook, or skill file touched. The contract is documentation only at this stage; no consumer imports or wires it yet.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Define the token in one shared `sk-design` reference | Gate, freshness, and laundering surfaces all validate one schema instead of inventing divergent variants |
| Hash `loadedFiles[].sha256` over raw file bytes as read | Gives the boundary a deterministic recompute target with no normalization ambiguity |
| Carry the token as structured metadata, never prose | A boundary can parse and recompute fields; prose cannot be validated |
| Name consumers by durable purpose only | Keeps the contract evergreen and free of mutable spec or phase identifiers |
| Ship the schema without building consumers | This phase owns the currency; the gate, hook, and check phases consume it later |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deliverable exists at the target path | PASS, `.opencode/skills/sk-design/references/design_proof_token.md` (244 lines) |
| v1 field schema complete and typed (section 2) | PASS, all 13 field keys carry type and required/optional status |
| Digest canonicalization byte-exact (section 4) | PASS, raw-byte rule plus canonical-JSON rule plus subject-string rule, no ambiguity |
| Mint-side vs boundary-side separated (sections 5 and 6) | PASS, boundary recomputes from the actual payload and fails closed |
| ACCEPTANCE: complete well-typed instance validates (section 7) | PASS, JSON instance passes all VALID rules |
| ACCEPTANCE: missing required digest rejected (section 7) | PASS, missing-`briefDigest` reject example |
| ACCEPTANCE: malformed `expiresAt` rejected (section 7) | PASS, non-ISO-8601 `expiresAt` reject example |
| ACCEPTANCE: malformed `singleUse` rejected (section 7) | PASS, string-typed `singleUse` reject example |
| Consumers named by purpose only (section 8) | PASS, functional names, no identifiers |
| Evergreen scan (no spec/packet/phase IDs in body) | PASS, no identifiers or `specs/` paths found |
| Scope clean (one new file, no live target edited) | PASS, change set limited to the new reference |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Contract only, not yet wired.** This phase defines `DESIGN_PROOF_TOKEN v1` and names its consumers by purpose. The run/build gate, pre-tool-use precondition, source-proof check, laundering guard, and freshness check are out of scope here and are built in later phases.
2. **No runtime mint or validate code.** The mint-side and boundary-side responsibilities are specified as a contract; no executable minter or validator ships in this phase.

<!-- /ANCHOR:limitations -->

---

<!--
LEVEL 2 IMPLEMENTATION SUMMARY
- Core + Level 2 verification focus
- Contract documentation for the DESIGN_PROOF_TOKEN v1 shared reference
-->
