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
    packet_pointer: "cli-external-orchestration/035-improved-communication/001-research-strategy"
    last_updated_at: "2026-08-11T08:14:47Z"
    last_updated_by: "codex"
    recent_action: "Completed Phase 001 verification."
    next_safe_action: "Scaffold Phase 002 contracts and fixtures."
    blockers: []
    key_files:
      - "tasks.md"
      - "plan.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "001-research-strategy-tasks-20260811"
      parent_session_id: "001-research-strategy-20260811"
    completion_pct: 100
    open_questions:
      - "Version-pinned runtime fixture fields belong to Phase 002."
    answered_questions:
      - "The authorized executor worktree was .worktrees/0138-system-deep-loop-communication-research."
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
- [x] T010 Obtain authorization for a temporary isolated executor worktree required by the cli-opencode dangerous-permission contract. [evidence: `.worktrees/0138-system-deep-loop-communication-research` on `system-deep-loop/0138-communication-research`, recovery base `414936c3151fb04837b1bfd1735532da4940f8d1`.]
- [x] T011 Run `/deep:research:auto` with `opencode-go/deepseek-v4-flash` for exactly 7 iterations, live web, RCAF fallback, and `max-iterations` stop policy (`research/`). [evidence: seven canonical iteration records/files/deltas and `maxIterationsReached` in `research/lineages/deepseek-go/`.]
- [x] T012 Run `/deep:research:auto` with `openai/gpt-5.6-sol-fast`, high reasoning, for exactly 3 iterations, live web, CRISPE, and `max-iterations` stop policy (`research/`). [evidence: three canonical iteration records/files/deltas and `maxIterationsReached` in `research/lineages/gpt-sol-fast/`.]
- [x] T013 Validate both lineages through canonical JSONL state, iteration files, deltas, logs, reducer output, and stop reasons (`research/`). [evidence: all ten `verify-iteration.cjs` invocations exit 0; `orchestration-summary.json` records 2/2 successful lineages, zero failures, and the timestamp qualification.]
- [x] T014 Triangulate native, DeepSeek, and GPT evidence; resolve or preserve conflicts and dated claims (`research/`). [evidence: `research/research.md` sections 12 and 14 preserve unknowns, Pi divergence, and dated provider claims.]
- [x] T015 Finalize the 1:1 fidelity corpus, deterministic rejection gates, blind rubric, operational metrics, and prompt/provider versioning (`research/` and `plan.md`). [evidence: `research/research.md` sections 9, 10, 11, and 13.]
- [x] T016 Recommend downstream child phases, dependencies, handoffs, rollback boundaries, and authoritative checks (`../spec.md` and `implementation-summary.md`). [evidence: `research/research.md` section 15 and the parent Phase Documentation Map define Phases 002-008.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Verification and handoff

- [x] T017 Generate and reconcile parent/child `description.json` and `graph-metadata.json` with final continuity state. [evidence: both scoped description generators and graph backfills exited 0; strict metadata-integrity checks pass.]
- [x] T018 Remove only task-created scaffold backup residue and confirm `scratch/` contains no temporary research output. [evidence: residue scan returns no backup/temp files; `scratch/` contains only `.gitkeep`.]
- [x] T019 Scan all scoped documents for placeholders, stale scaffold paths, contradictory completion claims, and broken source links. [evidence: strict `PLACEHOLDER_FILLED`, status consistency, `SPEC_DOC_INTEGRITY`, and 11-entry resource-map path checks pass.]
- [x] T020 Verify exact artifact paths, required Level 2 shape, iteration counts, and copy-back allowlist from final state. [evidence: live packet has 7 DeepSeek and 3 GPT narratives/records/deltas; 52 research JSON/JSONL files parse; canonical validators pass 10/10.]
- [x] T021 Mark checklist items only with observed evidence and reconcile `spec.md`, `plan.md`, `tasks.md`, checklist, and summary status. [evidence: all five required Level 2 documents classify Phase 001 as complete and point to Phase 002.]
- [x] T022 Run child strict validation and parent recursive strict validation; both must exit 0 before phase completion. [evidence: `validate.sh 001-research-strategy --strict` and `validate.sh 035-improved-communication --recursive --strict` each reported `RESULT: PASSED`, exit 0, on 2026-08-11.]
- [x] T023 Inspect scoped Git status/diff and confirm no reference or unrelated user file changed. [evidence: scoped status is confined to `035-improved-communication/`; reference diff against the isolated recovery copy is empty.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All T001-T023 tasks are marked `[x]` with objective evidence.
- [x] No `[B]` task remains.
- [x] The 7+3 iteration split and forced-depth stop reasons are proven from canonical state.
- [x] All P0 and P1 checklist items are complete or explicitly user-deferred where allowed.
- [x] Final child and recursive parent strict validation exit 0.
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
