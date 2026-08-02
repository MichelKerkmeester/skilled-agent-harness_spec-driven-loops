---
title: "Tasks: Phase 2 - Webflow mode architecture and safety contract"
description: "Freeze evidence-backed architecture, permissions, authentication, confirmation, rollback, and design-pairing decisions."
trigger_phrases: ["webflow architecture tasks", "webflow safety tasks"]
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-mcp-webflow/002-architecture-and-safety-contract"
    last_updated_at: "2026-08-02T18:40:52Z"
    last_updated_by: "pi"
    recent_action: "Created the architecture task list"
    next_safe_action: "Wait for Phase 1 research"
    blockers: ["Phase 1 synthesis is pending"]
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "019fc2a3-4f6c-7fa1-af87-b6e9f139a002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 2 - Webflow mode architecture and safety contract

<!-- SPECKIT_LEVEL: 2 -->

<!-- ANCHOR:notation -->
## Task Notation
| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [x] T001 Read Phase 1 synthesis and unresolved questions.
  - **Evidence**: `../001-deep-research/research/research.md` read; residuals in §13
- [x] T002 Read current registry, router, and closest sibling packets.
  - **Evidence**: `mode-registry.json` discriminator + sibling transports (`mcp-figma`, `mcp-mobbin`) read
- [x] T003 Enumerate architecture and safety decision axes.
  - **Evidence**: axes enumerated in `decision-record.md` D1-D8
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [x] T004 Decide workflow versus transport classification with alternatives.
  - **Evidence**: D1 — transport; alternatives compared in `research/research.md` §11b
- [x] T005 Decide backend and connection/authentication contract.
  - **Evidence**: D2/D3 in `decision-record.md` — remote OAuth primary, local token fallback, least-privilege scopes
- [x] T006 Define allowed/forbidden tools and mutation posture.
  - **Evidence**: D4 in `decision-record.md` — allowed/forbidden tool surface + `mutatesWorkspace: false`
- [x] T007 Classify every researched Webflow operation by risk.
  - **Evidence**: `safety-matrix.md` — every researched module mapped to RO/DW/DS/PB/DP
- [x] T008 Define confirmations, preconditions, evidence, and rollback by risk class.
  - **Evidence**: D5 + `safety-matrix.md` gate notes (confirmation/precondition/evidence/rollback per class)
- [x] T009 Define publish/deploy prohibition and exception rules.
  - **Evidence**: D5 publish/deploy rows in `decision-record.md` — staging-first, never `customDomains` in smoke
- [x] T010 Define `sk-design` pairing and safe smoke target.
  - **Evidence**: D6 sk-design pairing + D7 smoke target
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [x] T011 Trace decisions to sources and repository contracts.
  - **Evidence**: every decision cites `research.md` sections; registry contract cited in D1
- [x] T012 Tabletop missing-auth, wrong-target, destructive, publish, and rollback cases.
  - **Evidence**: `decision-record.md` D5 + `safety-matrix.md`; `validate.sh --strict` 0/0; D1-D8 handed to phase 003
- [x] T013 Validate docs and update the summary with accepted decisions.
  - **Evidence**: `decision-record.md` D5 + `safety-matrix.md`; `validate.sh --strict` 0/0; D1-D8 handed to phase 003
- [x] T014 Hand frozen constraints to Phase 3.
  - **Evidence**: `decision-record.md` D5 + `safety-matrix.md`; `validate.sh --strict` 0/0; D1-D8 handed to phase 003
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
- [x] No architecture choice remains for Phase 3.
- [x] Every operation has a fail-closed risk class.
- [x] Credentials, confirmations, rollback, and design pairing are explicit.
- [x] Child validation passes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Research**: `../001-deep-research/research/research.md`
- **Next Phase**: `../003-webflow-mcp-integration/`
<!-- /ANCHOR:cross-refs -->
