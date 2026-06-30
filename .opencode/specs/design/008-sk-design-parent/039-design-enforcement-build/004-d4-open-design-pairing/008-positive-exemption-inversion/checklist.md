---
title: "Verification Checklist: Invert Open Design exemption to deny-by-default positive purpose"
description: "QA checklist for the positive-purpose inversion: deny-by-default on both axes, unclassified-denied, unknown-equals-guarded, exemptTransport allowlist preserved, od-CLI cross-ref folded in, old-boolean-consumer residual named."
trigger_phrases:
  - "open design exemption inversion checklist"
  - "deny by default positive purpose checklist"
  - "opendesignpurpose unclassified checklist"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/008-positive-exemption-inversion"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify every checklist item against the inverted contract and recompute the counts"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-open-design/references/guarded_proxy.md"
      - ".opencode/skills/mcp-open-design/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Invert Open Design exemption to deny-by-default positive purpose

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

- [x] CHK-001 [P0] Current policy stance read and recorded (deny-by-default at proxy; boolean axis is the residue)
  - **Evidence**: `guarded_proxy.md` Policy block `defaultDecision: "guarded"`, `exemptTransport` is a positive allowlist; the boolean design-influence axis was the remaining leak
- [x] CHK-002 [P0] Boolean default sites located in the skill gate (`feeds_design_decision=False`)
  - **Evidence**: `route_open_design_resources(..., feeds_design_decision=False)` and `design_gate(intents, feeds_design_decision)` located in `SKILL.md`
- [x] CHK-003 [P1] Two positive purpose values + `unclassified` deny-state agreed
  - **Evidence**: `openDesignExemption` / `skDesignGate` / `unclassified`

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `openDesignPurpose` is required; no caller default remains
  - **Evidence**: `feeds_design_decision` grep count = 0 in `SKILL.md`; gate signature is `design_gate(intents, openDesignPurpose)`
- [x] CHK-011 [P0] Missing/unknown `openDesignPurpose` maps to `unclassified` → DENIED for design
  - **Evidence**: `classify_open_design_purpose` returns `unclassified` for non-members; `design_gate` raises `PermissionError` on `unclassified`
- [x] CHK-012 [P1] Exemption requires a positive `openDesignExemption` AND allowlist membership
  - **Evidence**: Exemption Model — "allowed without DESIGN_PROOF_TOKEN only when the caller supplies openDesignExemption and the operation is listed... Either condition missing means guarded"
- [x] CHK-013 [P1] Contract reads consistently across Canonical Request, Classification, Exemption Model, and Policy JSON
  - **Evidence**: all four sections key on `openDesignPurpose`; Policy JSON uses `requiresOpenDesignPurpose: "openDesignExemption"`

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Policy is deny-by-default (positive `exemptTransport` allowlist is the only carve-out)
  - **Evidence**: `defaultDecision: "guarded"`; "Anything omitted from exemptTransport is guarded... deny-by-default on both axes"
- [x] CHK-021 [P0] An unknown/new design-affecting tool is GUARDED (deny without token), not exempt — "unknown ⇒ guarded"
  - **Evidence**: Classification "Operation is missing from the policy block... not listed in exemptTransport... Guarded"; Acceptance row → DENY
- [x] CHK-022 [P0] A call with no `openDesignPurpose` is DENIED for design
  - **Evidence**: Acceptance "A caller omits openDesignPurpose... DENY for design; the purpose is unclassified, and unknown ⇒ guarded"
- [x] CHK-023 [P1] The explicit `exemptTransport` ops remain ALLOWED without a token (no new gate)
  - **Evidence**: `list_projects`/`list_files`/`list_skills`/`list_plugins`/`list_agents` + read-only CLI verbs gated on `openDesignExemption`, no token; Acceptance row → ALLOW

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: cross-consumer; one contract axis is inverted in two files, and the old-boolean readers (other consumers) are named as the residual class rather than migrated here
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: `feeds_design_decision` grep across `SKILL.md` = 0; `feedsDesignDecision` in `guarded_proxy.md` is only the intentional residual mention
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: the old-boolean consumers (`tool_surface.md`, `.codex/policy.json`, `pre-tool-use.ts`, any adapter/caller) are inventoried in the Named Residual and the plan residual
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: not applicable; no parser/redaction code ships — the Acceptance table covers the adversarial cases (omitted purpose, unknown purpose, unlisted design-affecting tool, exemption-then-design)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: not applicable; documentation-only deny contract with no test matrix — the two decision axes (mutationClass, openDesignPurpose) are documented in the Classification table
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: not applicable; no code reads process-wide state in this phase
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: pinned to the two-file delta — `guarded_proxy.md` +27/-30, `SKILL.md` +18/-7

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] "unknown ⇒ guarded" is documented as the controlling invariant
  - **Evidence**: stated in the contract intro, the Policy block ("deny-by-default on both axes"), and the Acceptance table
- [x] CHK-031 [P0] `openDesignExemption` forbids any later design use of the same artifact
  - **Evidence**: Exemption Model "A caller that asserts openDesignExemption also asserts that the returned artifact will not later be used as design-decision input"; Policy `forbidsLaterDesignUse: true`
- [x] CHK-032 [P1] `skDesignGate` continues to require a valid `DESIGN_PROOF_TOKEN` bound to the target
  - **Evidence**: Classification "openDesignPurpose is skDesignGate → Guarded; requires a valid DESIGN_PROOF_TOKEN"; the precondition delegates to the token contract

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Residual section names every old-contract consumer (boolean signature, `requiresFeedsDesignDecisionFalse`, any `feedsDesignDecision` hook)
  - **Evidence**: `guarded_proxy.md` "## Named Residual" flags any PreToolUse hook, policy file, adapter, or caller still reading a `feedsDesignDecision` boolean
- [x] CHK-041 [P1] od-CLI cross-reference folded in (discharges D4-R5 P1); `tool_surface.md` alignment deferred and named in the residual
  - **Evidence**: "The od CLI design-mutating Bash surface is enforced by the codex PreToolUse hook's od CLI lane"; `tool_surface.md` left untouched (scope held to 2 files), named in the plan residual
- [x] CHK-042 [P0] Evergreen: no spec/finding IDs or ephemeral paths embedded in the edited policy docs
  - **Evidence**: scan over `guarded_proxy.md` and `SKILL.md` edits returns no spec/finding/phase IDs and no `specs/` paths

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Edits confined to the two named targets (`guarded_proxy.md`, `SKILL.md`); no other live skill file touched
  - **Evidence**: `git diff --name-only` for `mcp-open-design` = exactly 2 files; `tool_surface.md`, `.codex/policy.json`, `pre-tool-use.ts` not touched
- [x] CHK-051 [P1] No temp files created outside scratch/
  - **Evidence**: no scratch or temp artifacts created for this phase

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 12 | 12/12 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (independent re-verification of the inverted guarded-proxy contract and the boolean removal)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - complete
- Positive-purpose inversion: feeds_design_decision boolean replaced by a required openDesignPurpose; missing/unknown ⇒ unclassified ⇒ guarded
- exemptTransport allowlist preserved and not newly token-gated; od-CLI cross-ref folded in (discharges D4-R5 P1); old-boolean-consumer residual named; scope held to 2 files
- GENERATED_METADATA (description.json / graph-metadata.json) regenerated by the orchestrator; not hand-written
-->
