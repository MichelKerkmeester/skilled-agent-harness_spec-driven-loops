---
title: "Tasks: OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing"
description: "Ordered tasks to append a child-resident transport-assertion section to the CLI child pairing contract, with explicit verification per deliverable."
trigger_phrases:
  - "transport assertion pairing tasks"
  - "open design assertion section tasks"
  - "child-resident pairing build tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/005-transport-assertion-pairing"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all authoring and verification tasks complete"
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
# Tasks: OPEN_DESIGN_TRANSPORT_ASSERTION v1 result-assertion pairing

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

**Target file (build output, not edited this planning phase)**: `.opencode/skills/mcp-open-design/references/cli_child_pairing.md` — APPEND-ONLY.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

_Ground and fix the append boundary (30m)._

- [x] T001 Re-read the existing transport-result schema + parent re-validation + deny rules + residual + Agent I/O + acceptance + laundering guard; record the end-of-file insertion point (`cli_child_pairing.md`) [15m] — DONE: insertion point fixed at EOF after the laundering guard; new H2 starts at line 247
- [x] T002 [P] Re-read proof-token §2 (field/digest schema) and §6 (boundary-side recompute-and-reject); fix the cite-not-restate wording (`design_proof_token.md`) [10m] — DONE: §2/§6 cited at lines 249, 306, 339; not restated
- [x] T003 [P] List the result digest fields the assertion pairs against: `transportAssertionDigest`, `designManifestDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `proofCardDigest` (`cli_child_pairing.md`) [5m] — DONE: all six enumerated in payloadDigests (line 264)

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

_Author the assertion-pairing section (1.5-2h)._

### Section scaffold (append-only)
- [x] T004 Append a new H2 "Open Design Transport Assertion Pairing" at end of file; leave every prior line untouched (`cli_child_pairing.md`) [10m] — DONE: H2 at line 247; git diff = 99 insertions, 0 deletions

### Assertion schema
- [x] T005 Write the `OPEN_DESIGN_TRANSPORT_ASSERTION v1` field table: `version`, `dispatchId`, `childLoadedSkills`, `operationClass`, `liveToolsListVerified`, `payloadDigests`, `assertionDigest` (`cli_child_pairing.md`) [30m] — DONE: 7-field table at lines 257-265
- [x] T006 Add a JSON shape example reusing the proof-token `sha256:<hex>` convention by reference (`cli_child_pairing.md`) [15m] — DONE: JSON shape at lines 268-285 uses sha256:<digest>

### Pairing + re-validation
- [x] T007 Write the result↔assertion pairing rule: every transport op carries both blocks; assertion digests reconcile against result digests and the originating manifest (`cli_child_pairing.md`) [20m] — DONE: pairing rule at lines 288-297
- [x] T008 Write the parent re-validation extension citing §2 (digest schema) and §6 (recompute-and-reject), with fail-closed semantics (`cli_child_pairing.md`) [25m] — DONE: 9-step extension at lines 299-311; step 4 cites §2/§6 (line 306)

### Deny rules + residual + acceptance
- [x] T009 Write the assertion deny-rules table (missing assertion when OD used; assertion↔result mismatch; assertion↔manifest mismatch; operationClass downgrade; liveToolsListVerified false on a dependent call; childLoadedSkills missing judgment; assertionDigest non-recompute) (`cli_child_pairing.md`) [20m] — DONE: 7-row deny table at lines 315-323, each → DENY
- [x] T010 Write the named residual (text-only/unmodifiable child → advisory; parent demand-back + transport-result re-validation as floor; compromised-child forgery out of scope) (`cli_child_pairing.md`) [10m] — DONE: Named Residual at lines 325-329 (ADVISORY; floor fail-closed)
- [x] T011 Write the Acceptance subsection enumerating schema, pairing, citations, deny mapping, residual, and preserved-content requirements (`cli_child_pairing.md`) [10m] — DONE: Acceptance table at lines 331-342 (6 rows incl. file integration)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

_Confirm schema, pairing, citations, deny mapping, residual, evergreen (30m)._

- [x] T012 Confirm all four assertion fields + `version`, `dispatchId`, `assertionDigest` are defined [5m] — DONE: all 7 fields confirmed at lines 259-265
- [x] T013 Confirm pairing rule + re-validation extension cite §2 and §6 and redefine neither token nor result [5m] — DONE: §2/§6 cited (lines 306, 339); "defines no second token schema" (line 249)
- [x] T014 Confirm each assertion deny rule maps to a fail-closed `DENY` and the residual is advisory, not a guarantee [5m] — DONE: 7 rules → DENY (317-323); residual ADVISORY only (327-329)
- [x] T015 Confirm `git diff` shows every pre-existing section preserved verbatim (append-only) [10m] — DONE: git diff --numstat = 99 insertions, 0 deletions
- [x] T016 Confirm no spec/packet/phase IDs or spec paths in the deliverable (evergreen) [5m] — DONE: evergreen grep over appended section clean

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Assertion schema, pairing rule, re-validation extension, deny rules, residual, and acceptance all present
- [x] Preserved-content diff confirms append-only
- [x] Evergreen lint passes
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
LEVEL 2 TASKS (~95 lines)
- Core + Level 2 detail
- Effort estimates per task
- Explicit verification tasks; deliverable is one appended contract section
-->
