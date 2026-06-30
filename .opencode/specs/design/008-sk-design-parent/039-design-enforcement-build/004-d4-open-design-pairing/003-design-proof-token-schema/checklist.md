---
title: "Verification Checklist: DESIGN_PROOF_TOKEN v1 content-bound token schema"
description: "QA checklist for the new references/design_proof_token.md: schema completeness, deterministic canonicalization, mint/boundary contract, the validate-vs-reject acceptance gate, and the evergreen no-IDs rule."
trigger_phrases:
  - "design proof token checklist"
  - "DESIGN_PROOF_TOKEN v1 verification"
  - "proof token acceptance gate"
  - "design proof token QA"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/003-design-proof-token-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verified every checklist item against the delivered proof token contract"
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
# Verification Checklist: DESIGN_PROOF_TOKEN v1 content-bound token schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Deliverable path and doc type frozen in plan.md
  - **Evidence**: target `sk-design/references/design_proof_token.md` created as a shared schema reference
- [x] CHK-002 [P0] v1 field set traced to cited evidence
  - **Evidence**: field schema (section 2) covers loadedFiles sha256, mode bundle, digests, TTL, and singleUse
- [x] CHK-003 [P1] Consumers enumerated by durable purpose
  - **Evidence**: section 8 names gate, pre-tool-use, source-proof, laundering guard, and freshness by purpose

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Doc created at the exact target path
  - **Evidence**: `.opencode/skills/sk-design/references/design_proof_token.md` (244 lines)
- [x] CHK-011 [P0] Every v1 field documented with type and required/optional status
  - **Evidence**: FIELD SCHEMA table (section 2) covers all 13 field keys with type and status
- [x] CHK-012 [P0] Digest canonicalization is byte-deterministic for every digest
  - **Evidence**: section 4 fixes raw-bytes rule, canonical-JSON rule, and subject-string rule with no ambiguity
- [x] CHK-013 [P1] Mint-side vs boundary-side responsibilities are separated
  - **Evidence**: sections 5 and 6 are distinct; the boundary recomputes from the actual payload

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: a complete, well-typed v1 instance validates per the documented contract
  - **Evidence**: the section 3 JSON instance passes all section 7 VALID rules
- [x] CHK-021 [P0] ACCEPTANCE: an instance missing any required digest is rejected
  - **Evidence**: section 7 missing-`briefDigest` reject example
- [x] CHK-022 [P0] ACCEPTANCE: an instance with malformed `expiresAt` or malformed `singleUse` is rejected
  - **Evidence**: section 7 non-ISO-8601 `expiresAt` and string-typed `singleUse` reject examples
- [x] CHK-023 [P1] At least one valid example plus the reject examples are included in the doc
  - **Evidence**: section 7 VALIDATOR CONTRACT & ACCEPTANCE carries the valid case plus three reject cases

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase authors one new contract doc and produces no code findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one new file and an evergreen grep over the body found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no live consumer changed; consumers are named by purpose in section 8 and none are wired yet
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser or redaction code ships, and the section 7 reject examples cover malformed-input cases
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; this is a documentation-only contract build with no test matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the new file path and its 244-line count

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Token binds content via sha256/digests, not self-attested booleans
  - **Evidence**: `loadedFiles[].sha256` plus four content digests in section 2
- [x] CHK-031 [P0] Boundary-side recompute + fail-closed is documented
  - **Evidence**: section 6 denies on absence, staleness, mismatch, or validator exception
- [x] CHK-032 [P1] Temporal + replay protection specified (`expiresAt` TTL, future-issued reject, single-use nonce)
  - **Evidence**: section 6 temporal and replay rules plus the section 7 TTL acceptance rule

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] EVERGREEN: doc body carries no spec/packet/phase IDs or spec paths
  - **Evidence**: evergreen scan over the body returned no identifiers and no `specs/` paths
- [x] CHK-041 [P1] Consumers named by durable purpose, not by ID
  - **Evidence**: section 8 uses functional names only
- [x] CHK-042 [P1] spec/plan/tasks synchronized with the authored doc
  - **Evidence**: the plan.md outline matches the delivered section order in the reference

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the new reference doc is written; no live target file edited
  - **Evidence**: change set limited to `references/design_proof_token.md`
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts were created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 11 | 11/11 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered contract reference)

<!-- /ANCHOR:summary -->

---
