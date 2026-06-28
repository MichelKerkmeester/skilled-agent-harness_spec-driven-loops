---
title: "Verification Checklist: Open Design inner-generator payload binding"
description: "QA checklist for the new mcp-open-design/references/inner_generator_binding.md: inner-payload-to-digest mapping, both-turn recompute-and-reject reusing proof-token canonicalization, the allow/deny acceptance gate, the named unmodifiable-daemon residual, and the evergreen no-IDs rule."
trigger_phrases:
  - "inner generator binding checklist"
  - "inner payload binding verification"
  - "build-fire payload acceptance gate"
  - "inner generation binding QA"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/006-inner-generator-payload-binding"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered binding contract doc"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/inner_generator_binding.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Open Design inner-generator payload binding

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
  - **Evidence**: target `mcp-open-design/references/inner_generator_binding.md`, a binding-contract reference (sibling of guarded_proxy / cli_child_pairing)
- [x] CHK-002 [P0] Inner-payload components traced to the multi-turn run flow
  - **Evidence**: start_run → discovery question-form (awaiting_input, zero files) → build-fire turn (form answers / follow-up `--conversation`)
- [x] CHK-003 [P1] Digest targets traced to the proof-token field schema
  - **Evidence**: subject/brief/form-answers/lineage digests already defined by the proof-token contract

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Doc created at the exact target path
  - **Evidence**: `.opencode/skills/mcp-open-design/references/inner_generator_binding.md`
- [x] CHK-011 [P0] Each inner-payload component maps to exactly one token digest
  - **Evidence**: BOUND INNER PAYLOAD table maps subject → subjectDigest, brief → briefDigest, form answers → formAnswersDigest, lineage → openDesignLineageDigest
- [x] CHK-012 [P0] The recompute-and-reject rule binds BOTH turns to the SAME token
  - **Evidence**: RECOMPUTE & REJECT re-binds the build-fire turn; the form-answer/follow-up payload must recompute to formAnswersDigest with the other three digests unchanged
- [x] CHK-013 [P1] The inner agent/model is pinned by declared equality (no new token field)
  - **Evidence**: BOUND INNER PAYLOAD pins the authorized model; RECOMPUTE & REJECT denies a mismatched model

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: an inner payload that recomputes to all four token digests is ALLOWED
  - **Evidence**: positive walk applies the documented rule to a matching payload
- [x] CHK-021 [P0] ACCEPTANCE: a drifted form-answer or follow-up payload is DENIED
  - **Evidence**: negative walk shows a mismatched recomputed digest fails closed at the build-fire turn
- [x] CHK-022 [P0] ACCEPTANCE: a blanket `--skip` / "use recommended defaults" that cannot materialize recomputable answers is DENIED
  - **Evidence**: deny rule requires concrete answers that recompute to formAnswersDigest
- [x] CHK-023 [P1] ACCEPTANCE: a pinned inner model not equal to the authorized model is DENIED
  - **Evidence**: model-pin deny case in the negative walk

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase authors one new contract doc and produces no code findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one new file and an evergreen grep over the body found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no live consumer changed; the guarded-proxy precondition is named as the recompute point, not edited here
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser or redaction code ships — the deny walk covers drift, blanket-defaults, and wrong-model cases
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; this is a documentation-only contract build with no test matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the new file path and its delivered line count

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Canonicalization is REUSED from the proof-token contract §4, not re-authored
  - **Evidence**: RECOMPUTE & REJECT cites §4 (subject-string rule, canonical-JSON rule, empty/no-data values) and contains no second hashing rule
- [x] CHK-031 [P0] The boundary recomputes from the actual inner payload and fails closed
  - **Evidence**: RECOMPUTE & REJECT denies on mismatch, absence, ambiguity, or validator exception
- [x] CHK-032 [P1] The build-fire turn cannot launder a drifted design past a turn-1 token
  - **Evidence**: the second turn is re-bound to the same token before the build writes files

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] NAMED RESIDUAL: the unmodifiable-daemon boundary is stated honestly
  - **Evidence**: the contract names that the adapter cannot reach inside the inner-agent process, and that a raw HTTP-port / in-app Skills-UI call around the adapter still bypasses the bind
- [x] CHK-041 [P0] EVERGREEN: doc body carries no spec/packet/phase IDs or spec paths
  - **Evidence**: evergreen scan over the body returns no identifiers and no `specs/` paths
- [x] CHK-042 [P1] Dependencies cited, not redefined
  - **Evidence**: the proof-token and guarded-proxy contracts are referenced as dependencies; neither is restated

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the new reference doc is written; no live target file edited
  - **Evidence**: change set limited to `references/inner_generator_binding.md`
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification of the delivered binding contract doc)

<!-- /ANCHOR:summary -->

---
