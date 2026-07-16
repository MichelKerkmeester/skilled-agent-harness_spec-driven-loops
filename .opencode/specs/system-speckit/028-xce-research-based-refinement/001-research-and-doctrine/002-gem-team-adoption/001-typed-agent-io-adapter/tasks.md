---
title: "Tasks: 027/006/001 Typed Agent I/O Adapter"
description: "Task list for the optional typed adapter: author the shared agent-io-contract, add the optional dispatch header and result envelope to the 5 agents, and wire the header onto the 4 planning @context dispatches."
trigger_phrases:
  - "027 phase 006/001"
  - "typed agent io adapter"
  - "agent-io-contract"
  - "AGENT_IO_DISPATCH header"
  - "AGENT_IO_RESULT envelope"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter"
    last_updated_at: "2026-06-10T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed implementation and verification prep for the typed agent I/O adapter"
    next_safe_action: "Ready for handoff"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-001-typed-agent-io-adapter-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 027/006/001 Typed Agent I/O Adapter

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

- [x] T001 Read `.opencode/agents/orchestrate.md`, `code.md`, `review.md`, `context.md`, and `debug.md`; located the native return/body sections and preservation anchors.
- [x] T002 Read `/speckit:plan` Step 5 in `.opencode/commands/speckit/assets/speckit_plan_auto.yaml` and `speckit_plan_confirm.yaml`; located the four `@context` dispatch blocks.
- [x] T003 Confirmed `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` was absent and the `workflows/` parent existed before creation.
- [x] T004 Recorded the preservation baseline: `@code`'s first-line `RETURN:` contract and `@context`'s six required Context-Package section headers.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Authored `agent-io-contract.md` with `schema_version` and the five grouped sections; specified `dispatch` and `result`, and added `handoff` / `pre_execution` / `advisory` as reserved placeholders.
- [x] T006 Documented the optional `AGENT_IO_DISPATCH` header: `dispatch_id`, `agent`, per-agent `task_definition`, `context_snapshot`, `read_directives`; header is under 15 lines.
- [x] T007 Documented the optional `AGENT_IO_RESULT` envelope: `status`, `confidence_band`, derived `confidence_numeric`, `failure_type`; stated the after-body placement rule.
- [x] T008 Defined deterministic numeric-to-band confidence mapping with the band as canonical.
- [x] T009 Added dispatch-header emit and result-envelope consume sections to `.opencode/agents/orchestrate.md`, including the never-reject-envelope-less degrade path.
- [x] T010 Added the after-body `AGENT_IO_RESULT` section to `.opencode/agents/code.md`, mapping escalation classes to `failure_type`; first-line `RETURN:` remains first.
- [x] T011 Added the P0/P1/P2-plus-bands to `AGENT_IO_RESULT` mapping section to `.opencode/agents/review.md`.
- [x] T012 Added the dispatch-header and read-directives accept section to `.opencode/agents/context.md`; kept the six required sections and added no seventh.
- [x] T013 Added dispatch/handoff header awareness to `.opencode/agents/debug.md`; left the 5-phase method untouched.
- [x] T014 Wired the `AGENT_IO_DISPATCH` header onto the four Step 5 `@context` dispatches in `speckit_plan_auto.yaml`.
- [x] T015 Wired the `AGENT_IO_DISPATCH` header onto the four Step 5 `@context` dispatches in `speckit_plan_confirm.yaml`.
- [x] T016 Added the small optional/advisory contract pointer to `AGENTS.md`; Four Laws and Gates text unchanged.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Verified the contract doc exists with all fields optional, the header/envelope defined, and the numeric-to-band mapping present and band-derived.
- [x] T018 Grep-verified `@code`'s first-line `RETURN:` and `@context`'s six required sections survive; both plan YAMLs show the header on all four planning dispatches; `@orchestrate` documents the envelope-less degrade path; AGENTS keeps the Four Laws and Gate 3 headings with only the pointer added.
- [x] T019 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/001-typed-agent-io-adapter --strict`. — PASSED (exit 0, Errors 0 / Warnings 0, 2026-06-10; reproduced by Fable verifier).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0 requirements in `spec.md` are satisfied (contract exists, header + envelope defined, mapping defined, header wired, backward-compat documented).
- [x] An agent with no envelope still works unchanged and `@orchestrate` falls back to the existing markdown contract.
- [x] `@code` first-line `RETURN:` and `@context` six required sections are preserved; no net-new failure taxonomy introduced.
- [x] Changes stayed within the approved logical surfaces plus `.claude`/`.codex` runtime mirrors and phase docs.
- [x] Children 002 and 003 can record this contract as their reusable substrate.
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
