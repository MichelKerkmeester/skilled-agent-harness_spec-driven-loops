---
title: "Tasks: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation"
description: "Ordered authoring tasks and verification for the return-path transport result contract and the parent replay."
trigger_phrases:
  - "transport result revalidation tasks"
  - "cli child pairing contract tasks"
  - "parent replay verification tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/002-transport-result-revalidation"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all D5-R2 authoring and verification tasks complete"
    next_safe_action: "Regenerate generated metadata after doc sync"
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
# Tasks: OPEN_DESIGN_TRANSPORT_RESULT v1 demand-back + parent fail-closed re-validation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

Ground the contract and fix the citation boundary before authoring.

- [x] T001 Re-read `design_proof_token.md`; list the digest convention + validator rules to cite, not restate (`.opencode/skills/sk-design/references/design_proof_token.md`) [10m] — digest convention + validator behavior captured for citation
- [x] T002 Re-read `guarded_proxy.md`; capture the request-path precondition + named-residual pattern this return-path mirrors (`.opencode/skills/mcp-open-design/references/guarded_proxy.md`) [10m] — precondition + deny-by-default posture captured
- [x] T003 [P] Extract the mutating/destructive Open Design verb set + the multi-turn `start_run` build boundary from the pairing skill (`.opencode/skills/mcp-open-design/SKILL.md`) [10m] — verb set + multi-turn build boundary captured

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Author the return-path contract: schema, parent algorithm, deny rules, honesty, citations.

### Scaffold
- [x] T004 Create the new contract file with frontmatter + overview framing it as the return-path counterpart to the token + proxy (`.opencode/skills/mcp-open-design/references/cli_child_pairing.md`) [15m] — created; overview lines 13-24

### Result schema
- [x] T005 Write the `OPEN_DESIGN_TRANSPORT_RESULT v1` field table: `version`, `dispatchId`, `childLoadedSkills`, `direction`, `operationClass`, `liveToolsListVerified`, `toolsCalled[]`, `toolCallDigests[]`, `runId`, `surfaceId` (`cli_child_pairing.md`) [25m] — fields present (lines 34-48)
- [x] T006 Add the payload-digest + lineage fields: `designManifestDigest`, `transportAssertionDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest`, `designProofTokenRef` (nonce+runId reference, never a re-mint), `loadedTransportFiles[]`, `artifactRefs[]`, `validationStatus`, `missingFields[]` (`cli_child_pairing.md`) [25m] — fields present (lines 49-62)
- [x] T007 Add a JSON shape example; reuse the token's `sha256:<hex>` digest convention by citation rather than redefining canonicalization (`cli_child_pairing.md`) [15m] — JSON example lines 66-128

### Parent re-validation algorithm
- [x] T008 Write the parent replay steps: detect OD usage; schema/type check; recompute + compare payload + tool-call digests; reconcile `designProofTokenRef`; operation-class consistency (`cli_child_pairing.md`) [25m] — algorithm steps 1-9 (lines 136-144)
- [x] T009 Write the three deny rules explicitly: (a) missing result when Open Design was used, (b) manifest/assertion/result digest mismatch, (c) a mutating Open Design call absent from `toolsCalled`; each is a fail-closed DENY (`cli_child_pairing.md`) [20m] — Deny Rules table (lines 156-158)
- [x] T010 State fail-closed semantics for exceptions, unreadable inputs, and ambiguous reconstruction; bind the multi-turn build case (files written via `start_run` with no matching `toolsCalled`/result) to a DENY (`cli_child_pairing.md`) [15m] — fail-closed catch-all (line 160); multi-turn build DENY (line 158)

### Honesty + citations
- [x] T011 Name the residual: a text-only `cli-claude-code` child with no structured tool stream degrades digest matching to ADVISORY — flagged, not silently passed, and not a deterministic guarantee (`cli_child_pairing.md`) [15m] — Named Residual section (lines 164-170)
- [x] T012 Add the Agent-I/O note: it may carry the digests but is optional-advisory and never the gate; its absence must not pass an Open Design handoff (`cli_child_pairing.md`) [10m] — Agent I/O section (lines 174-178)
- [x] T013 Add an Acceptance section enumerating the deny cases + the requirement to cite `design_proof_token.md` and `guarded_proxy.md` without redefining them (`cli_child_pairing.md`) [10m] — Acceptance table (lines 182-192)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Contract checks
- [x] T014 Verify the schema, parent algorithm, residual, and acceptance sections are all present (`cli_child_pairing.md`) [5m] — all four sections confirmed
- [x] T015 Verify each of the three deny rules maps to a fail-closed DENY and that missing-result-when-OD-used is rejected (`cli_child_pairing.md`) [10m] — three rules each map to DENY (lines 156-158)
- [x] T016 Verify both contracts are cited by path and neither token internals nor the precondition are redefined (`cli_child_pairing.md`) [5m] — token + proxy cited (lines 21-22), neither redefined

### Boundary checks
- [x] T017 Verify the text-only residual is named and not overstated as a guarantee (`cli_child_pairing.md`) [5m] — advisory-only, no deterministic claim (line 168)
- [x] T018 Verify evergreen: no spec/packet/phase IDs or spec paths in the deliverable; confirm no cli-* SKILL was edited (scope held) (`cli_child_pairing.md`) [5m] — evergreen scan clean; `git status` shows only the new doc

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Schema + parent re-validation + named residual all authored
- [x] Token + proxy contracts cited, not redefined
- [x] Evergreen and scope boundary verified
- [x] Checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS (~105 lines)
- Core + Level 2 detail (effort estimates + explicit verification tasks)
- Deliverable: one return-path contract reference doc
- The cli-* ALWAYS wiring is the sibling pairing phase (D5-R5), not this one
-->
