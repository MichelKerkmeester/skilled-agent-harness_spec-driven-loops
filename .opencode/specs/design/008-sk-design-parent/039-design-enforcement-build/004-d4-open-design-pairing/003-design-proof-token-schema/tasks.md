---
title: "Tasks: DESIGN_PROOF_TOKEN v1 content-bound token schema"
description: "Ordered implementer work items to author references/design_proof_token.md (field schema, digest canonicalization, mint/boundary contract) plus verification tasks for the acceptance gate."
trigger_phrases:
  - "design proof token tasks"
  - "DESIGN_PROOF_TOKEN v1 tasks"
  - "design proof token implementer"
  - "proof token schema work items"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/003-design-proof-token-schema"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Marked all proof token schema work items and acceptance tasks complete"
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
# Tasks: DESIGN_PROOF_TOKEN v1 content-bound token schema

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

- [x] T001 Create the `references/` directory under sk-design (`.opencode/skills/sk-design/references/`) [5m]
- [x] T002 Scaffold the doc with frontmatter, H1, and the nine section headers (`.opencode/skills/sk-design/references/design_proof_token.md`) [10m]

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Schema and Shape
- [x] T003 Author the OVERVIEW section: content-bound, run-scoped, transport-neutral currency replacing self-attested checkboxes (`design_proof_token.md`) [15m]
- [x] T004 Author the v1 FIELD SCHEMA table — `version`, `loadedFiles[]{path,sha256}`, `workflowModes[]`, `subjectDigest`, `briefDigest`, `formAnswersDigest`, `openDesignLineageDigest`, `issuedAt`, `expiresAt`, `singleUse`, `nonce`/`runId`, `mintedBy`, `boundSurface` — each with type + required/optional (`design_proof_token.md`) [30m]
- [x] T005 Author a complete, well-typed JSON SHAPE example instance (`design_proof_token.md`) [15m]

### Canonicalization and Contract
- [x] T006 Author DIGEST CANONICALIZATION: raw-bytes rule for `loadedFiles[].sha256`; the canonical-JSON rule (UTF-8, code-point-sorted keys, compact separators, NFC, integers without exponent, digest field excluded); subject-string rule; `briefDigest`/`formAnswersDigest`/`openDesignLineageDigest` objects each with an explicit empty/no-data canonical value (`design_proof_token.md`) [40m]
- [x] T007 Author MINT-SIDE RESPONSIBILITIES: who mints, what is computed from the actual outgoing context, structured-metadata emission (`design_proof_token.md`) [15m]
- [x] T008 Author BOUNDARY-SIDE RESPONSIBILITIES: field/type/version checks, temporal + replay checks, digest recomputation from the actual payload, fail-closed on absence/staleness/mismatch/exception (`design_proof_token.md`) [20m]
- [x] T009 Author the VALIDATOR CONTRACT & ACCEPTANCE rules with one valid example and three reject examples (missing required digest, malformed `expiresAt`, malformed `singleUse`) (`design_proof_token.md`) [25m]
- [x] T010 [P] Author CONSUMERS (run/build gate, pre-tool-use precondition, source-proof checker, laundering guard, freshness checker — durable purpose, no IDs) and VERSIONING (`design_proof_token.md`) [15m]

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T011 Walk the complete well-typed instance through the documented validator rules and confirm it validates [10m]
- [x] T012 Walk a missing-digest instance, a malformed-`expiresAt` instance, and a malformed-`singleUse` instance through the rules and confirm each is rejected [10m]

### Integrity and Docs
- [x] T013 Grep the doc body for spec/packet/phase IDs and `specs/` paths; confirm none remain (evergreen) [5m]
- [x] T014 Update `implementation-summary.md` and mark all `checklist.md` items with evidence [5m]

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Positive acceptance passes (complete instance validates)
- [x] Negative acceptance passes (missing-digest / malformed instances rejected)
- [x] Evergreen scan clean (no spec/packet/phase IDs in doc body)
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---
