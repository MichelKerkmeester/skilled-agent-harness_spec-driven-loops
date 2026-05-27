---
title: "Tasks: Forbid ephemeral-artifact references in code comments"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "comment hygiene tasks"
  - "ephemeral reference cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored task breakdown"
    next_safe_action: "Author sk-code prevention rule (Part A)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Tasks: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Create Level 3 spec folder + scratch
- [x] T002 Author spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md
- [x] T003 Generate description.json + graph-metadata.json
- [ ] T004 Run validate.sh --strict baseline and fix any structural gaps
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Part A — sk-code rule (authored by Claude)

- [ ] T010 Add canonical "No ephemeral-artifact pointers" rule (references/universal/code_style_guide.md §4) + fix `#1234` example
- [ ] T011 Mirror a P0 entry (references/universal/code_quality_standards.md §3)
- [ ] T012 Aggressive §4 revision: remove T###/REQ-###/CHK-### recommendations, keep durable SEC:/CWE (references/opencode/shared/universal_patterns.md)
- [ ] T013 Fix §3 line ~204 REQ-005 example + §3 line ~205 bug-#123 example + §7 Pattern C (references/opencode/shared/universal_patterns.md)
- [ ] T014 Add Webflow pointer (references/webflow/shared/cross_language_rules.md §7)
- [ ] T015 [P] Reconcile echo sites: opencode/{javascript,typescript,python,shell}/style_guide.md
- [ ] T016 [P] Remove contradictory P2 REQ-### recommendation (references/opencode/config/quality_standards.md:75)
- [ ] T017 [P] Add checklist pointers (assets/opencode + assets/webflow checklists; webflow/javascript/quick_reference.md)

### Part B — cleanup (CLI-DEVIN executes, CLI-CODEX reviews)

- [ ] T020 Part B0 pre-flight: Read cli-devin/SKILL.md + cli-codex/SKILL.md; consult sk-prompt-small-model
- [ ] T021 Commit/stash already-dirty working tree; confirm green baseline per skill
- [ ] T022 Validation phase: deep-agent-improvement .cjs scripts (~5 sites)
- [ ] T023 Validation phase: system-skill-advisor embedders + server + py (~7 sites)
- [ ] T024 code-graph phase: mcp_server/lib/** + handlers/** (~17 sites)
- [ ] T025 system-spec-kit: scripts/core/workflow.ts (own chunk, ~8 sites)
- [ ] T026 system-spec-kit: mcp_server/context-server.ts (own chunk, :836 trap, ~8 sites)
- [ ] T027 system-spec-kit: handlers/** comment chunks
- [ ] T028 system-spec-kit: lib/search/** comment chunks (skip JSDoc @example literals)
- [ ] T029 system-spec-kit: lib/{session,cognitive,storage,governance,embedders} chunks
- [ ] T030 system-spec-kit: shared/embeddings/** chunks (skip notes: literals)
- [ ] T031 system-spec-kit: scripts/** remainder (confirm comment-only; most shell/py are Bucket B)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T040 Full suites green: system-spec-kit, system-code-graph, system-skill-advisor; node --check for deep-agent-improvement
- [ ] T041 Completeness ripgrep (comment-line restricted) = 0 across cleaned skills
- [ ] T042 Re-read revised sk-code §4 to confirm no surviving prefix recommendation
- [ ] T043 validate.sh --strict Exit 0
- [ ] T044 Complete checklist.md with evidence; reconcile completion metadata across docs
- [ ] T045 Final scoped commit(s)/push to main; memory save
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] All P0 requirements verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decisions**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
