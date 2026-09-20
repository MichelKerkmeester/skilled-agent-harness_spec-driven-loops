---
title: "Tasks: Portable CLI communication research strategy"
description: "Execution ledger for reference analysis, native web research, forced-depth deep research, synthesis, and Level 2 verification."
trigger_phrases:
  - "portable CLI research tasks"
  - "communication rewrite research status"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/042-improved-communication/001-research-strategy"
    last_updated_at: "2026-08-11T06:40:41Z"
    last_updated_by: "codex"
    recent_action: "Completed local and native primary-source research tasks."
    next_safe_action: "Resolve T009, then execute T010 and T011 through the named deep-loop workflow."
    blockers:
      - "T009 needs user authorization for a temporary isolated executor worktree."
    key_files:
      - "tasks.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-tasks-20260811"
      parent_session_id: "001-research-strategy-20260811"
    completion_pct: 50
    open_questions:
      - "Temporary isolated executor worktree authorization"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Portable CLI communication research strategy

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Ground truth

- [x] T001 Scaffold the lean phase parent and Level 2 phase child with the repository generators (`../`, current folder). [evidence: `find ../ -maxdepth 2 -type f` shows the lean parent trio and five required Level 2 documents.]
- [x] T002 Capture the pre-authoring strict-validation failure as the negative baseline. [evidence: `validate.sh ../ --recursive --strict` exited code 2 for incomplete scaffold and metadata.]
- [x] T003 Inventory every reference file and trace hook, buffering, prompt, provider, display, Markdown, cleanup, and fallback behavior (`../context/claudish-to-english-main/`).
- [x] T004 Verify reference syntax and metadata: `bash -n`, `jq empty`, executable bits, and ShellCheck warning threshold all exit 0; retain informational `SC2012` at `rewrite.sh:145` as read-only evidence.
- [x] T005 Preflight installed OpenCode routes and confirm `opencode-go/deepseek-v4-flash`, `openai/gpt-5.6-sol-fast`, configured providers, and cli-opencode self-invocation eligibility.
- [x] T006 Confirm the Codex-host self-invocation guard prohibits a nested Codex CLI executor; use the approved cli-opencode route for the GPT lineage instead. [evidence: the cli-codex guard and observed `CODEX_THREAD_ID` establish a Codex parent session.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Research and synthesis

- [x] T007 [P] Run native primary-source research for all six runtime integration surfaces and record confirmed versus inferred capabilities (`plan.md`).
- [x] T008 [P] Run native primary-source research for OpenCode Go, arbitrary hosted providers, Ollama, llama.cpp, prompt preservation, fallback, privacy, latency, cost, and evaluation (`plan.md`).
- [x] T009 Reopen the load-bearing official sources and verify the native agents' runtime and provider findings before authoring the matrix (`plan.md`).
- [ ] T010 [B] Obtain authorization for a temporary isolated executor worktree required by the cli-opencode dangerous-permission contract.
- [ ] T011 Run `/deep:research:auto` with `opencode-go/deepseek-v4-flash` for exactly 7 iterations, live web, RCAF fallback, and `max-iterations` stop policy (`research/`).
- [ ] T012 Run `/deep:research:auto` with `openai/gpt-5.6-sol-fast`, high reasoning, for exactly 3 iterations, live web, CRISPE, and `max-iterations` stop policy (`research/`).
- [ ] T013 Validate both lineages through canonical JSONL state, iteration files, deltas, logs, reducer output, and stop reasons (`research/`).
- [ ] T014 Triangulate native, DeepSeek, and GPT evidence; resolve or preserve conflicts and dated claims (`research/`).
- [ ] T015 Finalize the 1:1 fidelity corpus, deterministic rejection gates, blind rubric, operational metrics, and prompt/provider versioning (`research/` and `plan.md`).
- [ ] T016 Recommend downstream child phases, dependencies, handoffs, rollback boundaries, and authoritative checks (`../spec.md` and `implementation-summary.md`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verification and handoff

- [ ] T017 Generate and reconcile parent/child `description.json` and `graph-metadata.json` with final continuity state.
- [ ] T018 Remove only task-created scaffold backup residue and confirm `scratch/` contains no temporary research output.
- [ ] T019 Scan all scoped documents for placeholders, stale scaffold paths, contradictory completion claims, and broken source links.
- [ ] T020 Verify exact artifact paths, required Level 2 shape, iteration counts, and copy-back allowlist from final state.
- [ ] T021 Mark checklist items only with observed evidence and reconcile `spec.md`, `plan.md`, `tasks.md`, checklist, and summary status.
- [ ] T022 Run child strict validation and parent recursive strict validation; both must exit 0 before phase completion.
- [ ] T023 Inspect scoped Git status/diff and confirm no reference or unrelated user file changed.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T001-T023 tasks are marked `[x]` with objective evidence.
- [ ] No `[B]` task remains.
- [ ] The 7+3 iteration split and forced-depth stop reasons are proven from canonical state.
- [ ] All P0 and P1 checklist items are complete or explicitly user-deferred where allowed.
- [ ] Final child and recursive parent strict validation exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Verification**: `checklist.md`
- **Current state**: `implementation-summary.md`
- **Parent epic**: `../spec.md`
<!-- /ANCHOR:cross-refs -->
