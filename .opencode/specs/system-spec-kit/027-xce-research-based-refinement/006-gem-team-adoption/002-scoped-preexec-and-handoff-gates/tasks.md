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
    packet_pointer: "specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/002-scoped-preexec-and-handoff-gates"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 002 scoped gates from 007 P2 + 009"
    next_safe_action: "Land 001 envelope, then wire the 3 scoped gates"
    blockers: []
    key_files: ["spec.md", "plan.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-002-scoped-preexec-gates-scaffold"
      parent_session_id: null
    completion_pct: 0
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

- [ ] T001 [B] Confirm `001-typed-agent-io-adapter` has shipped the envelope `confidence`/`failure_type` fields this packet reuses.
- [ ] T002 Read `.opencode/agents/orchestrate.md`, `.opencode/agents/debug.md`, and `.opencode/agents/code.md`; mark the dispatch path, handoff section, and verification/return contract.
- [ ] T003 Read `.opencode/skills/sk-code/SKILL.md` and locate the intent-routing point for the boundary contract-first gate (API/schema/integration).
- [ ] T004 Read `.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl` and `.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`; note the 5 template anchors and the stale `SCHEMA SOURCE ... lines 60-89` comment near the script tail.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the three predicates in `@orchestrate`: `diagnosis_crosses_agents`, `change_class ∈ {api,schema,integration}`, `complexity ∈ {medium,high}` (`.opencode/agents/orchestrate.md`).
- [ ] T006 Add typed handoff fields `root_cause`/`target_files`/`fix_recommendations`/`confidence` to `@debug`, framed as a downscale of Gem's `debugger_diagnosis` check; keep the 5-phase method untouched (`.opencode/agents/debug.md`).
- [ ] T007 Preserve the typed handoff in `@orchestrate`'s `@code` dispatch path (`.opencode/agents/orchestrate.md`).
- [ ] T008 Add receiver-validation to `@code`: missing required handoff fields ⇒ BLOCKED/LOW_CONFIDENCE, never a guessed fix (`.opencode/agents/code.md`).
- [ ] T009 Add the boundary contract-first gate to `sk-code`, scoped to API/schema/integration intent only — not universal TDD (`.opencode/skills/sk-code/SKILL.md`).
- [ ] T010 Add the pre-mortem field (risk + top 2-3 failure modes + assumptions) to the `@orchestrate` task format, gated on `complexity ∈ {medium,high}` (`.opencode/agents/orchestrate.md`).
- [ ] T011 Add the typed fields inside the existing debug-delegation template sections; preserve all anchors (`.opencode/skills/system-spec-kit/templates/manifest/debug-delegation.md.tmpl`).
- [ ] T012 Add CLI flags + JSON extraction for the typed fields and refresh the stale schema-line comment (`.opencode/skills/system-spec-kit/scripts/spec/scaffold-debug-delegation.sh`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Walk the gate matrix: low/typo/docs (no gate), ordinary edit (no contract-first), API/schema/integration (contract-first), low vs medium/high (pre-mortem omitted vs required).
- [ ] T014 Walk the debug→implement crossing: handoff emitted → preserved → validated; force a missing required field and confirm `@code` blocks instead of guessing; confirm a legacy report warns rather than fails.
- [ ] T015 Smoke-test `scaffold-debug-delegation.sh` with the new typed-field flags and confirm a valid `debug-delegation.md` is produced.
- [ ] T016 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh specs/system-spec-kit/027-xce-research-based-refinement/006-gem-team-adoption/002-scoped-preexec-and-handoff-gates --strict`; confirm no governance/validator file was modified.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 requirements in `spec.md` are implemented and each gate skips outside its predicate.
- [ ] The debug→implement handoff is emitted, preserved, and receiver-validated end to end.
- [ ] No files outside the six named surfaces changed; no governance/validator edits.
- [ ] Legacy `debug-delegation.md` warns rather than fails; `@debug` remains user-opt-in.
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
