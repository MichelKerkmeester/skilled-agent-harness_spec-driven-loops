---
title: "Tasks: 037 llama-cpp embedding worker deep-dive"
description: "Three-phase canonical checklist mapped onto the 5 implementation phases."
trigger_phrases:
  - "037 tasks"
  - "llama-cpp embedding worker tasks"
importance_tier: "important"
contextType: "spec"
status: "in_progress"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/037-llama-cpp-embedding-worker-deep-dive"
    last_updated_at: "2026-05-14T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Authored tasks from approved plan"
    next_safe_action: "Dispatch Phase 1 codex job"
    completion_pct: 10
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks | v2.2 -->
# Tasks: 037 llama-cpp embedding worker deep-dive

<!-- SPECKIT_LEVEL: 2 -->

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

Maps to plan Phase 0 (scaffold) + Phase 1 (3.15.1 reproduction harness authoring).

- [x] T001 Run create.sh --phase --level 2 --skip-branch (plan Phase 0)
- [x] T002 Rename auto-numbered 033 → 037 (plan Phase 0)
- [x] T003 Patch parent spec.md Phase Documentation Map lines 117, 140 (plan Phase 0)
- [x] T004 Author spec.md with canonical Level-2 anchors (metadata, problem, scope, requirements, success-criteria, risks, nfr, edge-cases, questions, complexity)
- [x] T005 Author plan.md with canonical Level-2 anchors (summary, quality-gates, architecture, phases, testing, dependencies, rollback, phase-deps, effort, enhanced-rollback)
- [x] T006 Author tasks.md (this file)
- [x] T007 Author checklist.md with canonical Level-2 anchors (protocol, pre-impl, code-quality, testing, fix-completeness, security, docs, file-org, summary)
- [x] T008 Author implementation-summary.md scaffold with what-built concrete citation
- [x] T009 Author description.json + graph-metadata.json with child-level shape
- [ ] T010 Verify `unsloth/embeddinggemma-300m-GGUF` is cached locally on this machine (plan Phase 1 preflight)
- [ ] T011 Author `_sandbox/37--llama-cpp-context-size/repro.mjs` — direct provider import, size sweep, tokenized counts, JSONL + TSV output (plan Phase 1)
- [ ] T012 Dispatch via cli-codex gpt-5.5 high fast (single dispatch, pre-bound Gate 3 D-Skip for _sandbox, `</dev/null` on stdin, `service_tier="fast"`)
- [ ] T013 Verify `run-3.15.1.jsonl` has ≥ 11 rows; at least one with `result=null`
- [ ] T014 Verify `run-3.15.1.summary.tsv` is human-readable
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Maps to plan Phase 2 (3.17.1 comparison) + Phase 3 (verdict) + Phase 4 (source patch).

- [ ] T015 Initialize `_sandbox/37--llama-cpp-context-size/v3.17.1/` (mkdir + minimal package.json)
- [ ] T016 Dispatch cli-codex gpt-5.5 high fast for `npm install node-llama-cpp@^3.17.1` + harness copy + run (pass `-c sandbox_workspace_write.network_access=true`)
- [ ] T017 Collect `run-3.17.1.jsonl` + `run-3.17.1.summary.tsv`
- [ ] T018 Author `version-comparison.md` side-by-side table
- [ ] T019 Read both summary TSVs + version-comparison.md (plan Phase 3)
- [ ] T020 Write verdict to implementation-summary.md > "Hypothesis verdict" section: CONFIRMED or FALSIFIED with timestamp + evidence file:line refs
- [ ] T021 HALT if FALSIFIED — open 038 with new evidence (plan Phase 3)
- [ ] T022 Patch `shared/embeddings/providers/llama-cpp.ts:216` — contextSize 512 → 2048 (env-overridable `SPECKIT_LLAMA_CPP_CONTEXT_SIZE`) (plan Phase 4)
- [ ] T023 Add token-count preflight in `generateEmbedding` around line 331 (tokenize once, truncate if over budget, console.warn)
- [ ] T024 Author vitest at `mcp_server/tests/llama-cpp-context-size.vitest.ts` with 3 cases (short body, long body w/ truncation, expanded query)
- [ ] T025 `npm run build` in mcp_server/ — exit 0 expected
- [ ] T026 Verify source-only patch is sufficient (no dist dual-patch unless build verified broken)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

Maps to plan Phase 5 (verify + ADR-003).

- [ ] T027 `npx vitest run tests/llama-cpp-context-size.vitest.ts` — 3 PASS
- [ ] T028 `npx vitest run tests/governance-ephemeral-decouple.vitest.ts` — regression PASS
- [ ] T029 Live round-trip: write 4000-char body to /tmp/test-037.md; memory_save → confirm embedding_status='success'; memory_search → top-3 recall
- [ ] T030 Live `memory_health` after 10-save soak: circuitBreakerOpen=false, embeddingRetry.flapping=false
- [ ] T031 [P] Single-scenario replay of 401 via cli-codex; capture VERDICT
- [ ] T032 [P] Single-scenario replay of 411 via cli-codex; capture VERDICT
- [ ] T033 Author `decision-record.md` (ADR-003) — contract change rationale + alternatives + evidence chain
- [ ] T034 Update `032/handover.md` with one-line completion note
- [ ] T035 Update `_memory.continuity` blocks in spec.md / plan.md / tasks.md / implementation-summary.md
- [ ] T036 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <037-folder> --strict` — exit 0
- [ ] T037 Cleanup: rm /tmp/test-037.md; delete the test memory row
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All T-tasks marked `[x]` OR explicitly deferred with reason in implementation-summary.md
- [ ] No `[B]` blocked tasks remaining (unblock or move out of scope)
- [ ] checklist.md items all marked with evidence
- [ ] strict validate exit 0
- [ ] handover note added to 032
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **ADR-003**: `decision-record.md` (created in Phase 5)
- **Parent**: `../spec.md` (014-local-embeddings-migration phase parent)
- **Predecessor**: `../032-substrate-repair-followups/handover.md`
<!-- /ANCHOR:cross-refs -->
