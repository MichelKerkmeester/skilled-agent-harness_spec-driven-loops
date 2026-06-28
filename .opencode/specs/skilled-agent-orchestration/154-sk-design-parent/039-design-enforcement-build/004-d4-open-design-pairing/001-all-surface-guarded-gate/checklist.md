---
title: "Verification Checklist: All-surface guarded proxy + openDesignDesignPrecondition contract"
description: "P0/P1 verification items for references/guarded_proxy.md and its policy block, including the three acceptance conditions, fail-closed semantics, fix completeness, and the evergreen [HARD] check."
trigger_phrases:
  - "guarded proxy checklist"
  - "opendesigndesignprecondition checklist"
  - "all-surface gate checklist"
importance_tier: "normal"
contextType: "general"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/001-all-surface-guarded-gate"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the delivered guarded proxy contract"
    next_safe_action: "Let the parent process refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: All-surface guarded proxy + openDesignDesignPrecondition contract

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

- [x] CHK-001 [P0] Token boundary contract read and understood as the validity authority the precondition delegates to
  - **Evidence**: the precondition's Token-validity row delegates schema, freshness, replay, digest, and file-hash checks to `design_proof_token.md` and does not redefine token internals
- [x] CHK-002 [P0] Tool inventory + classification grounded before authoring
  - **Evidence**: the embedded policy block derives `guarded` and `exemptTransport` sets from the Open Design tool-surface reference (mcpTools, cliVerbs, httpRoutes, skillsActions)
- [x] CHK-003 [P1] Convergent-chokepoint evidence captured
  - **Evidence**: the Boundary section states one daemon backs four interchangeable surfaces and places the proxy at the agent-side run/build chokepoint

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `guarded_proxy.md` markdown is valid; all nine sections present and ordered
  - **Evidence**: Boundary, Canonical Request, Surface Mapping, Classification, `openDesignDesignPrecondition`, Exemption Model, Policy, Named Residual, and Acceptance are present in order (212 lines)
- [x] CHK-011 [P0] Embedded JSON policy block parses
  - **Evidence**: `jq` over the fenced JSON policy block exits 0
- [x] CHK-012 [P1] Internal references resolve
  - **Evidence**: the precondition links to `../../sk-design/references/design_proof_token.md`; the policy is derived from the tool-surface reference
- [x] CHK-013 [P1] Doc follows `mcp-open-design/references/` style and frontmatter conventions
  - **Evidence**: frontmatter carries title, description, trigger_phrases, importance_tier, contextType, and version, matching sibling reference shape

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] ACCEPTANCE — a design-feeding/mutating call WITHOUT a valid fresh token is DENIED on every wired surface (MCP, HTTP, CLI, Skills)
  - **Evidence**: Acceptance scenario 1 returns `DENY` before inner-agent spawn, build-fire, or mutation; Surface Mapping routes all four surfaces through the precondition
- [x] CHK-021 [P0] ACCEPTANCE — a pure-transport exempt call PASSES (is not blocked)
  - **Evidence**: Acceptance scenario 2 returns `ALLOW` for a listed transport op with `feedsDesignDecision: false`; the precondition MUST NOT block listed pure-transport reads
- [x] CHK-022 [P0] ACCEPTANCE — the daemon-side residual is NAMED as out of scope, not silently passed
  - **Evidence**: the Named Residual section names the raw-HTTP-port and in-app Skills-UI bypass; cause = the bundled daemon ships unmodifiable
- [x] CHK-023 [P0] Deny-by-default holds — an unlisted/unknown tool defaults to GUARDED, not exempt
  - **Evidence**: Policy `defaultDecision` is `guarded`; the Classification table guards any missing/ambiguous op; "Anything omitted from `exemptTransport` is guarded"
- [x] CHK-024 [P1] Classifier completeness — every tool in the tool-surface inventory maps to GUARDED or EXEMPT
  - **Evidence**: the policy block enumerates guarded mcpTools/read-when-feeds/cliVerbs plus the positive `exemptTransport` allowlist, with httpRoutes and skillsActions mapped by rule

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: instance-only; this phase authors one new contract doc and produces no code findings
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: instance-only; the change set is one new file and an evergreen grep over the body found no IDs or `specs/` paths
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: no live consumer changed; the policy block classifies the tool surface but nothing is wired to enforce it yet
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser or redaction code ships; the precondition's fail-closed and deny-by-default rules cover malformed, ambiguous, and unmapped input
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; this is a documentation-only contract build with no test matrix
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: evidence pinned to the new file path and its 212-line count

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Precondition delegates token validity to the `DESIGN_PROOF_TOKEN` boundary contract (does NOT re-define token internals)
  - **Evidence**: the Token-validity row references `design_proof_token.md`; no duplicated or weakened token rules appear in the doc
- [x] CHK-031 [P0] Surface-binding check present — `boundSurface` must match the canonical request's target surface (cross-surface replay defense)
  - **Evidence**: the Bound-surface row rejects unless `designProofToken.boundSurface` matches the normalized `target`
- [x] CHK-032 [P0] Fail-closed semantics — missing token, unreadable input, validator exception, or ambiguous classification → DENY
  - **Evidence**: "The proxy MUST fail closed"; the Exception-handling row denies on absence, ambiguity, stale state, exceptions, and unmapped surfaces
- [x] CHK-033 [P1] Request-normalization is lossless on security-relevant fields across all four surfaces
  - **Evidence**: the Canonical Request carries surface, toolOrVerb, mutationClass, feedsDesignDecision, target, token, and payloadDigestInputs; "Normalization MUST be lossless"

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Evergreen [HARD] — no spec/packet/phase IDs or spec paths in `guarded_proxy.md` or its policy block
  - **Evidence**: an `rg` scan for `specs/`, `NNN-`, and phase tokens over the document body returned no matches
- [x] CHK-041 [P1] Scope held — only `guarded_proxy.md` + its policy authored; `SKILL.md` not rewritten (optional one-line cross-link only)
  - **Evidence**: the change set is the one new doc; the optional SKILL.md cross-link was deferred and SKILL.md left untouched
- [x] CHK-042 [P1] spec/plan/tasks synchronized with the final doc
  - **Evidence**: the plan's nine-section outline matches the delivered section order in the reference

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp/working notes in scratch only
  - **Evidence**: no temp files were created outside scratch
- [x] CHK-051 [P1] scratch cleaned before completion
  - **Evidence**: no scratch artifacts were created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (post-build verification of the delivered guarded-proxy contract)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Acceptance items: CHK-020, CHK-021, CHK-022. Evergreen [HARD]: CHK-040.
-->
