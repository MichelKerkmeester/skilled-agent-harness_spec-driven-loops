---
title: "Tasks: 027/012/001 Typed Agent I/O Adapter"
description: "Task list for the optional typed adapter: author the shared agent-io-contract, add the optional dispatch header and result envelope to the 5 agents, and wire the header onto the 4 planning @context dispatches."
trigger_phrases:
  - "027 phase 012/001"
  - "typed agent io adapter"
  - "agent-io-contract"
  - "AGENT_IO_DISPATCH header"
  - "AGENT_IO_RESULT envelope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-gem-team-adoption/001-typed-agent-io-adapter"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 001 from research 007 P1 + 009 integration"
    next_safe_action: "Author agent-io-contract.md, then wire @orchestrate header"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-001-typed-agent-io-adapter-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: 027/012/001 Typed Agent I/O Adapter

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Read `.opencode/agents/orchestrate.md`, `code.md`, `review.md`, `context.md`, and `debug.md`; locate the body, first-line `RETURN:`, and required-section anchors the adapter must respect.
- [ ] T002 Read `/speckit:plan` Step 5 in `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`; locate the four `@context` dispatch blocks.
- [ ] T003 Confirm `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` is absent and the `workflows/` parent exists.
- [ ] T004 Record the preservation baseline: `@code`'s first-line `RETURN:` contract and `@context`'s six required Context-Package section headers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Author `agent-io-contract.md` with `schema_version` and the five grouped sections; fully specify `dispatch` and `result`, and add `handoff` / `pre_execution` / `advisory` as reserved placeholders for children 013/014.
- [ ] T006 In the contract, document the optional `AGENT_IO_DISPATCH` header: `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, `read_directives` buckets; note the compact target under 15 lines.
- [ ] T007 In the contract, document the optional `AGENT_IO_RESULT` envelope: `status`, `confidence { band, numeric }`, `failure_type`; state the after-body placement rule.
- [ ] T008 In the contract, define the deterministic numeric-to-band confidence mapping with the band as the canonical human signal.
- [ ] T009 Add the dispatch-header emit and result-envelope consume sections to `.opencode/agents/orchestrate.md`, including the never-reject-envelope-less degrade path.
- [ ] T010 Add the after-body `AGENT_IO_RESULT` section to `.opencode/agents/code.md`, mapping its escalation classes to `failure_type`; keep the first-line `RETURN:` first.
- [ ] T011 Add the P0/P1/P2-plus-bands to `AGENT_IO_RESULT` mapping section to `.opencode/agents/review.md`.
- [ ] T012 Add the dispatch-header and read-directives accept section to `.opencode/agents/context.md`; keep the six required sections and add no seventh.
- [ ] T013 Add the dispatch/handoff header awareness to `.opencode/agents/debug.md`; leave the 5-phase method untouched (handoff fields reserved for 013).
- [ ] T014 Wire the `AGENT_IO_DISPATCH` header onto the four Step 5 `@context` dispatches in `speckit_plan_auto.yaml`.
- [ ] T015 Wire the `AGENT_IO_DISPATCH` header onto the four Step 5 `@context` dispatches in `speckit_plan_confirm.yaml`.
- [ ] T016 Add the small optional/advisory contract pointer to `AGENTS.md`; leave the Four Laws and Gates text unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T017 Verify the contract doc exists with all fields optional, the header/envelope defined, and the numeric-to-band mapping present and band-derived.
- [ ] T018 Grep-verify `@code`'s first-line `RETURN:` and `@context`'s six required sections survive; verify both plan YAMLs show the header on all four planning dispatches; verify `@orchestrate` documents the envelope-less degrade path; verify no governance/validator file changed except the small `AGENTS.md` pointer.
- [ ] T019 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/012-gem-team-adoption/001-typed-agent-io-adapter --strict`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are satisfied (contract exists, header + envelope defined, mapping defined, header wired, backward-compat documented).
- [ ] An agent with no envelope still works unchanged and `@orchestrate` falls back to the existing markdown contract.
- [ ] `@code` first-line `RETURN:` and `@context` six required sections are preserved; no net-new failure taxonomy introduced.
- [ ] No files outside the nine named surfaces changed.
- [ ] Children 013 and 014 can record this contract as their reusable substrate.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Proposal**: `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` (§ P1)
- **Integration Synthesis**: `../research/009-gem-team-integration-impact/research.md`
- **Downstream Children**: `../002-scoped-preexec-and-handoff-gates`, `../003-planner-review-focus-and-drift-hint`
<!-- /ANCHOR:cross-refs -->
</content>
