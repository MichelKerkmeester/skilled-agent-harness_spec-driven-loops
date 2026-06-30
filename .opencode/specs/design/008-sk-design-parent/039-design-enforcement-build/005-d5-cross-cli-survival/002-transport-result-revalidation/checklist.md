---
title: "Verification Checklist: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation"
description: "Acceptance and verification gates for the return-path transport result contract and the parent replay."
trigger_phrases:
  - "transport result revalidation checklist"
  - "cli child pairing acceptance"
  - "parent fail-closed verification"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/002-transport-result-revalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Verify all P0/P1/P2 checks; add Fix Completeness section"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
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
# Verification Checklist: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation

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

- [x] CHK-001 [P0] Citation boundary fixed before authoring: `design_proof_token.md` and `guarded_proxy.md` are read and the doc will reference, not redefine, them
  - **Evidence**: both cited as dependencies at `cli_child_pairing.md` lines 21-22; token internals and the request-path precondition are not restated
- [x] CHK-002 [P1] Open Design mutating/destructive verb set and the multi-turn `start_run` build boundary captured from the pairing skill
  - **Evidence**: `start_run`-then-build write is bound to the unlisted-mutating-call DENY (lines 143, 158)
- [x] CHK-003 [P1] Scope boundary confirmed: this phase authors only `cli_child_pairing.md`; the cli-* ALWAYS wiring is the sibling child-resident pairing phase
  - **Evidence**: `git status` shows only the new doc; D5-R5 named as the consumer wiring, not built here

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The contract specifies the `OPEN_DESIGN_TRANSPORT_RESULT v1` result schema (the result a CLI child returns after an Open Design transport op)
  - **Evidence**: result schema table at `cli_child_pairing.md` lines 32-64
- [x] CHK-011 [P0] The schema includes `childLoadedSkills`, `operationClass`, and `toolsCalled[]` (what judgment/transport loaded, the operation class, and the actual calls)
  - **Evidence**: `childLoadedSkills` (line 36), `operationClass` (line 38), `toolsCalled` (lines 40-45)
- [x] CHK-012 [P0] The schema includes the payload digests and a proof-token reference (`designProofTokenRef` = nonce+runId), declared as a reference and never a re-mint
  - **Evidence**: payload digests (lines 49-55); `designProofTokenRef` forbidden to re-mint (lines 56-58)
- [x] CHK-013 [P1] A JSON shape example is present and reuses the token's `sha256:<hex>` digest convention by citation rather than redefining canonicalization
  - **Evidence**: JSON example (lines 66-128) uses `sha256:<digest>`; canonicalization is referenced, not redefined

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The parent re-validation algorithm denies a returned result whose manifest/assertion/result digests do not match the recomputed payload
  - **Evidence**: digest-mismatch deny rule (line 157); recompute-and-compare steps 4-5 (lines 139-140)
- [x] CHK-021 [P0] The algorithm fails closed when Open Design was used but no result envelope is present (missing-result-when-OD-used is a DENY, never a pass)
  - **Evidence**: missing-result deny rule (line 156); algorithm step 2 demands the structured result (line 137)
- [x] CHK-022 [P0] The algorithm denies when a mutating Open Design call is absent from `toolsCalled` (including a `start_run` build that wrote files with no matching entry)
  - **Evidence**: unlisted-mutating-call deny rule (line 158); algorithm step 8 names the multi-turn build (line 143)
- [x] CHK-023 [P1] Fail-closed is stated for validator exceptions, unreadable inputs, and ambiguous reconstruction; operation-class consistency is checked
  - **Evidence**: fail-closed catch-all (line 160); operation-class reconstruction step 7 (line 142)

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class identified: the gap is the return-path counterpart to the already-guarded request path, not a one-off miss
  - **Evidence**: request path guarded by `guarded_proxy.md` + `design_proof_token.md`; the return path had no contract until `cli_child_pairing.md`, which closes the symmetric half
- [x] CHK-FIX-002 [P0] Same-class coverage complete: all three deny vectors are authored, and the riskiest silent-write case is bound to a DENY
  - **Evidence**: missing-result, digest-mismatch, and unlisted-mutating-call rules (lines 156-158); the multi-turn `start_run` build write is explicitly a DENY (line 158)
- [x] CHK-FIX-003 [P1] Consumer integrity preserved: the contract names its consumer without redefining it, and no live wiring was touched this phase
  - **Evidence**: the sibling `cli-*` ALWAYS wiring (D5-R5) is named as the consumer; `git status` confirms no cli-* SKILL was edited

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The text-only `cli-claude-code` residual is named: with no structured tool stream, digest matching degrades to ADVISORY — flagged, not silently passed
  - **Evidence**: Named Residual section degrades digest matching to ADVISORY for the text-only path (line 168)
- [x] CHK-031 [P0] The residual is not overstated: the contract claims no deterministic guarantee on the text-only path
  - **Evidence**: "must not claim a deterministic guarantee"; a structured result + replayable tool metadata is required for a machine-checkable pass (line 168)
- [x] CHK-032 [P1] Agent I/O is documented as optional-advisory and never the gate; its absence must not pass an Open Design handoff
  - **Evidence**: Agent I/O section — optional-advisory; absence never passes, presence never replaces the gate (lines 174-178)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] The contract cites `design_proof_token.md` and `guarded_proxy.md` and does not re-define token internals or the request-path precondition
  - **Evidence**: dependency table cites both contracts and states each is referenced, not redefined (lines 21-22)
- [x] CHK-041 [P1] An Acceptance section enumerates the deny cases (missing result, digest mismatch, unlisted mutating call) and the citation requirement
  - **Evidence**: Acceptance table covers the three deny rules + the cite-not-redefine requirement (lines 182-192)
- [x] CHK-042 [P2] The contract names its consumer (the sibling child-resident cli-* pairing rule) without re-defining it
  - **Evidence**: the D5-R5 `cli-*` ALWAYS wiring is named as the consumer; the contract defines the schema + algorithm only

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] The deliverable carries no spec/packet/phase IDs or spec paths (evergreen contract)
  - **Evidence**: `grep -nE "specs/|packet|phase[ -]|ADR-|REQ-|task-[0-9]|finding|154-|039-|005-|002-"` over the deliverable returned nothing
- [x] CHK-051 [P0] Only `cli_child_pairing.md` was authored; no cli-* SKILL was edited this phase
  - **Evidence**: `git status` shows only `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` (untracked) plus the in-folder spec docs

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-28
**Verified By**: markdown-agent (orchestrator-confirmed grep + git status evidence)

<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
