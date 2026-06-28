---
title: "Verification Checklist: Cross-delegation token laundering guard"
description: "QA checklist for the Cross-Delegation Token Laundering Guard appended to mcp-open-design/references/cli_child_pairing.md: the three laundering attacks (replay/omit/weaken), one fail-closed deny rule each reusing DESIGN_PROOF_TOKEN §2/§6, the two enforcement points, the no-second-schema reuse, and the named parent-boundary-only residual."
trigger_phrases:
  - "laundering guard checklist"
  - "replay omit weaken acceptance"
  - "token re-validation acceptance"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/007-cross-child-laundering-guard"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the appended guard section"
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
# Verification Checklist: Cross-delegation token laundering guard

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

- [x] CHK-001 [P0] Home decided and recorded with deviation flagged
  - **Evidence**: appended to `cli_child_pairing.md`; the standalone `laundering_guard.md` alternative and the `design_delegation_payload.md` scaffold deviation are recorded in plan.md and spec.md
- [x] CHK-002 [P0] Reused source rules identified
  - **Evidence**: `DESIGN_PROOF_TOKEN v1` §2 replay defense and §6 boundary table cited as the rules the guard consumes

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Section appended at the exact target as a pure append
  - **Evidence**: `.opencode/skills/mcp-open-design/references/cli_child_pairing.md`, 51 insertions, 0 deletions; existing transport-result + parent re-validation content preserved (7 refs)
- [x] CHK-011 [P0] All three laundering attacks defined
  - **Evidence**: Threat Model table — REPLAY (consumed `nonce`+`runId`), OMIT (design-affecting child op with no token), WEAKEN (relaxed `singleUse`/freshness/`boundSurface`)
- [x] CHK-012 [P0] One deny rule per attack, each reusing §2/§6
  - **Evidence**: Deny Rules table — consumed-pair replay (§2+§6), missing child design token (§6 required-field, elevated), relaxed token fields (§6 single-use/time/TTL/surface/digest)
- [x] CHK-013 [P0] No second token schema authored
  - **Evidence**: §2/§6 reused by citation; 18 token references in the section, no new token schema or field table

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE: a consumed `nonce`+`runId` pair reappearing is DENIED
  - **Evidence**: replay deny walk against the parent-owned run-scoped consumed-set → DENY
- [x] CHK-021 [P0] ACCEPTANCE: a design-affecting child operation with no token is DENIED
  - **Evidence**: omit deny walk; absence is never exempt, fail closed → DENY
- [x] CHK-022 [P0] ACCEPTANCE: a relaxed-field re-mint is DENIED
  - **Evidence**: weaken deny walk; single-use/freshness/surface/digest re-validation against the original mint → DENY
- [x] CHK-023 [P1] ACCEPTANCE: ALLOW only on complete, non-laundered reconciliation
  - **Evidence**: parent demand-back returns ALLOW only when presence, consumed-set, field integrity, surface, freshness, and digest all reconcile

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase appends one section to one existing contract and produces no code findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one pure append and an evergreen grep over the appended body found no IDs
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no live consumer changed; §2/§6 and the transport-result re-validation are cited as dependencies, not edited
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser or redaction code ships — the deny walk covers replay, omit, and weaken adversarial cases
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; this is a documentation-only deny contract with no test matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the appended section and its 51-insertion / 0-deletion delta

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Two enforcement points documented
  - **Evidence**: child PreToolUse re-validation before the design-affecting call AND parent demand-back reconciling `designProofTokenRef` against the mint, with parent demand-back named as the enforceable floor
- [x] CHK-031 [P0] The boundary fails closed on every laundering path
  - **Evidence**: DENY on replay, omission, weakening, ambiguity, stale state, or validator exception
- [x] CHK-032 [P1] Pairs with the transport-result re-validation
  - **Evidence**: the section positions the guard as the request-path/token-side twin of the return-path `OPEN_DESIGN_TRANSPORT_RESULT` re-validation

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] NAMED RESIDUAL: the forge-from-stolen-inputs case is stated honestly
  - **Evidence**: a fully-compromised child re-minting a digest-valid token from captured authorized inputs inside the freshness window is out of scope for child-side guarantees; the enforceable control is the parent boundary
- [x] CHK-041 [P0] EVERGREEN: appended body carries no spec/packet/phase IDs or `specs/` paths
  - **Evidence**: evergreen scan over the appended section returns no identifiers and no `specs/` paths
- [x] CHK-042 [P1] Old-contract residual named; dependencies cited, not redefined
  - **Evidence**: an unmodifiable child CLI that ignores the guard loses the child-side deny and stays covered by the parent demand-back floor; §2/§6 and the transport-result contract are cited, not restated

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only the named append is written; no other live file edited
  - **Evidence**: change set limited to the Cross-Delegation Token Laundering Guard section in `cli_child_pairing.md` (51 insertions, 0 deletions)
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: no scratch artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification of the appended laundering-guard section)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - complete
- Cross-delegation token laundering guard appended to cli_child_pairing.md
- Three attacks (replay/omit/weaken) each map to one fail-closed deny rule reusing §2/§6; two enforcement points; parent-boundary-only residual named
- GENERATED_METADATA (description.json / graph-metadata.json) regenerated by the orchestrator; not hand-written
-->
