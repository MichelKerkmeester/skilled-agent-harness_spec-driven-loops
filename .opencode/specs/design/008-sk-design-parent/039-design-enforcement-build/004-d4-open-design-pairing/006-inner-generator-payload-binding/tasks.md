---
title: "Tasks: Open Design inner-generator payload binding"
description: "Ordered implementer work items to author mcp-open-design/references/inner_generator_binding.md (inner-payload component-to-digest mapping, both-turn recompute-and-reject reusing proof-token canonicalization, named daemon residual) plus verification tasks for the allow/deny acceptance gate."
trigger_phrases:
  - "inner generator binding tasks"
  - "inner payload binding implementer"
  - "build-fire payload digest work items"
  - "inner generation drift denial tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/004-d4-open-design-pairing/006-inner-generator-payload-binding"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all tasks complete with evidence for the delivered binding contract"
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
# Tasks: Open Design inner-generator payload binding

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

- [x] T001 Confirm the `references/` directory under mcp-open-design and a free target filename (`.opencode/skills/mcp-open-design/references/`) [5m] — evidence: directory present, target filename free, doc created there
- [x] T002 Scaffold the doc with frontmatter, H1, and the seven section headers (`.opencode/skills/mcp-open-design/references/inner_generator_binding.md`) [10m] — evidence: frontmatter + H1 + seven sections present in the delivered 124-line doc

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Boundary and Mapping
- [x] T003 Author OVERVIEW: a binding contract that pins the inner generator's input payload to the authorized proof-token digests; depends on the proof-token and guarded-proxy contracts and redefines neither (`inner_generator_binding.md`) [15m] — evidence: opening section + dependency table cite both contracts, redefine neither
- [x] T004 Author THE INNER GENERATION BOUNDARY: the multi-turn flow (turn 1 `start_run` → discovery question-form, `awaiting_input`, zero files; turn 2 form answers or follow-up `--conversation` message fires the build that writes files) and name the unbound second turn (`inner_generator_binding.md`) [20m] — evidence: Inner Generation Boundary table names turn-1 and build-fire turns; 18 multi-turn references
- [x] T005 Author BOUND INNER PAYLOAD: a `component → token digest` table (subject → `subjectDigest`, brief/`--message` → `briefDigest`, form answers/follow-up → `formAnswersDigest`, lineage → `openDesignLineageDigest`) plus the inner agent/model pinned by declared equality; all carried as structured metadata (`inner_generator_binding.md`) [25m] — evidence: Bound Inner Payload table maps the four components; model pinned by declared equality

### Recompute, Reject, and Residual
- [x] T006 Author RECOMPUTE & REJECT: cite the proof-token §4 canonicalization by reference (subject-string rule; canonical-JSON rule; each digest's empty/no-data value) and author NO second hashing rule; define the both-turn recompute that re-binds the SAME token at the build-fire turn (`inner_generator_binding.md`) [35m] — evidence: Recompute And Reject cites §4 with 0 sha256/hashlib mentions; both-turn recompute re-binds the same token
- [x] T007 Author the deny rules inside RECOMPUTE & REJECT: any recomputed-digest mismatch is denied; a blanket `--skip` / "use recommended defaults" is denied unless it materializes concrete answers that recompute to `formAnswersDigest`; a pinned model not equal to the authorized model is denied; fail-closed on absence/ambiguity/exception (`inner_generator_binding.md`) [20m] — evidence: deny table covers drift, turn mismatch, changed components, missing answers, wrong model, ambiguous input, validator failure
- [x] T008 Author WHERE IT BINDS: extend the guarded-proxy precondition (the recompute point) to the build-fire turn — the `od ui respond` answer and the follow-up `od run start --conversation` message (`inner_generator_binding.md`) [15m] — evidence: Where It Binds applies the recompute point to turn-1 and build-fire turns with same-token binding
- [x] T009 [P] Author NAMED RESIDUAL (the daemon spawns the inner agent inside the closed app; the adapter cannot reach inside the inner-agent process, and a raw HTTP-port / in-app Skills-UI call around the adapter still bypasses the bind) and ACCEPTANCE (`inner_generator_binding.md`) [15m] — evidence: Named Residual names both residuals; Acceptance table covers positive + drift/defaults/wrong-model + residual honesty

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Acceptance
- [x] T010 Walk an inner payload that recomputes to all four token digests through the rule and confirm ALLOW [10m] — evidence: Acceptance positive walk → ALLOW before inner-agent spawn / build-fire forwarding
- [x] T011 Walk a drifted form-answer/follow-up payload, a blanket `--skip`/defaults case, and a mismatched inner model through the rule and confirm each is DENIED [10m] — evidence: three negative walks each → DENY at the adapter boundary

### Integrity and Docs
- [x] T012 Confirm the doc cites proof-token §4 and contains no second canonicalization rule, and that both residuals (inner-agent process, daemon-side bypass) are named [5m] — evidence: §4 cited, 0 sha256/hashlib mentions, Named Residual states both
- [x] T013 Grep the doc body for spec/packet/phase IDs and `specs/` paths; confirm none remain (evergreen) [5m] — evidence: evergreen scan over the body clean, no IDs or `specs/` paths
- [x] T014 Update `implementation-summary.md` and mark all `checklist.md` items with evidence [5m] — evidence: implementation-summary.md authored; checklist.md fully marked [x] with evidence

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Positive acceptance passes (recomputable inner payload is allowed)
- [x] Negative acceptance passes (drift / blanket defaults / wrong model denied)
- [x] Canonicalization reuse confirmed (proof-token §4 cited, no second hashing rule)
- [x] Both residuals named
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
