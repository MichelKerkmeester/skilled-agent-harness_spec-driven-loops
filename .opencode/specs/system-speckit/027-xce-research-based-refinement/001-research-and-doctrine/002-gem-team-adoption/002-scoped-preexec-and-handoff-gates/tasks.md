---
title: "Tasks: 027/006/002 Scoped Pre-Execution & Handoff Gates"
description: "Task list for the three scoped gates: typed debug→implement handoff schema, boundary contract-first for API/schema/integration, and a pre-mortem field for medium/high work."
trigger_phrases:
  - "027 phase 006/002"
  - "scoped preexec gates"
  - "debug handoff schema"
  - "boundary contract-first"
  - "pre-mortem field"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-10T05:18:20Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Landed scoped agent gates"
    next_safe_action: "Report out-of-scope skill/scaffold items"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: 027/006/002 Scoped Pre-Execution & Handoff Gates

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

- [x] T001 Confirm `001-typed-agent-io-adapter` shipped the envelope `confidence`/`failure_type` fields this packet reuses. Evidence: child `001-typed-agent-io-adapter/tasks.md` marks the contract/result-envelope tasks complete, and the shared contract already contained dispatch/result groups before this edit.
- [x] T002 Read `.opencode/agents/orchestrate.md`, `.opencode/agents/debug.md`, and `.opencode/agents/code.md`; marked the dispatch path, handoff section, and verification/return contract. Evidence: agent edits landed in all three runtime mirrors.
- [x] T003 Read `.opencode/skills/sk-code/SKILL.md` and located the API/schema/integration routing area. Evidence: file read completed; edit was not applied because the approved write scope excludes skill files.
- [x] T004 Read `.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` and `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`; noted the existing template anchors and stale scaffold comment. Evidence: both files read; edits were not applied because the approved write scope excludes these paths.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Defined the three predicates in `@orchestrate`: `diagnosis_crosses_agents`, `change_class in {api,schema,integration}`, `complexity in {medium,high}`. Evidence: `.opencode/agents/orchestrate.md` plus `.claude`/`.codex` mirrors include the scoped pre-execution predicates table.
- [x] T006 Added typed handoff fields `root_cause`/`target_files`/`fix_recommendations`/`confidence` to `@debug`, framed as a downscale of Gem's `debugger_diagnosis` check; kept the 5-phase method untouched. Evidence: debug agent context handoff and optional handoff group updated in all three mirrors.
- [x] T007 Preserved the typed handoff in `@orchestrate`'s `@code` dispatch path. Evidence: orchestrator task format and handoff block carry debug-to-implementation fields in all three mirrors.
- [x] T008 Added receiver-validation to `@code`: missing required handoff fields returns BLOCKED/LOW_CONFIDENCE, never a guessed fix. Evidence: code agent diagnosis-based handoff validation section added in all three mirrors.
- [x] T009 Scoped boundary contract-first at the allowed surfaces. Evidence: shared contract and orchestrator predicates require boundary contract evidence for API/schema/integration dispatches; direct `sk-code/SKILL.md` edit was flagged out of approved write scope.
- [x] T010 Added the pre-mortem field (risk + top 2-3 failure modes + assumptions) to the `@orchestrate` task format, gated on `complexity in {medium,high}`. Evidence: task format updated in all three mirrors.
- [x] T011 Flagged the debug-delegation template update as out of approved write scope. Evidence: template read; no edit made because only the shared contract path under skills was approved.
- [x] T012 Flagged scaffold flags/JSON extraction/comment refresh as out of approved write scope. Evidence: scaffold read; no edit made because scripts were not approved write paths.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Walked the gate matrix: low/typo/docs has all predicates false; ordinary edit has no contract-first gate; API/schema/integration requires boundary evidence; low omits pre-mortem and medium/high requires it. Evidence: orchestrator predicate table and contract pre-execution rules.
- [x] T014 Walked the debug-to-implementation crossing: `@debug` emits typed fields, `@orchestrate` carries them, `@code` blocks on missing fields, and legacy reports warn rather than fail. Evidence: debug/orchestrate/code agent mirror edits plus contract handoff rules.
- [x] T015 Smoke-test not run because `scaffold-debug-delegation.sh` was out of approved write scope and received no new flags. Evidence: task flagged rather than silently editing a banned script.
- [x] T016 Run strict validation with the approved `.opencode/specs/...` path; confirm no governance/validator file was modified. Evidence: see implementation-summary verification row for command result.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Approved P0 requirements in `spec.md` are implemented at the contract/agent layer and each gate skips outside its predicate.
- [x] The debug-to-implement handoff is emitted, preserved, and receiver-validated end to end across the three agent mirrors.
- [x] No governance/validator edits were made; mirror files and shared contract were changed per approved write scope.
- [x] Legacy `debug-delegation.md` warns rather than fails in the contract/agent docs; `@debug` remains user-opt-in.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source Proposal**: `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` § P2
- **Integration Synthesis**: `../research/009-gem-team-integration-impact/research.md` §2, §4
- **Upstream Dependency**: `../001-typed-agent-io-adapter/spec.md`
<!-- /ANCHOR:cross-refs -->
