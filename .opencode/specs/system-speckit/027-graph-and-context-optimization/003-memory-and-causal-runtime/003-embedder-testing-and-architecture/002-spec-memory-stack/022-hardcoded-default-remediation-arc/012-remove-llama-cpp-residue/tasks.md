---
title: "Tasks: 022/012 Remove llama-cpp Residue"
description: "11 file edits across SETUP / IMPLEMENTATION / VERIFICATION phases."
trigger_phrases:
  - "022/012 tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue"
    last_updated_at: "2026-05-23T20:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b14"
      session_id: "016-002-022-012-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["All 11 file edits shipped + verified"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Tasks: 022/012 Remove llama-cpp Residue

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[ ]` pending | `[~]` deferred | `[T###]` id
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P1] Operator directive captured ("remove all references to llama-cpp")
- [x] [T002] [P1] Live-surface inventory produced via `rg` with explicit exclusions (z_archive, scratch, benchmarks, locks, jsonl, iteration-*.md, descriptions.json, specs/) — 11 live files identified
- [x] [T003] [P1] Categorization complete: 3 source comments + 2 scripts + 6 docs
- [x] [T004] [P1] Out-of-scope hits confirmed frozen (4 in benchmarks/benchmark-2026-05-20/, all z_archive paths)
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T005] [P1] `shared/embeddings/types.ts` — 6-line historical-purge comment → 2-line current-state comment
- [x] [T006] [P1] `system-skill-advisor/mcp_server/lib/embedders/types.ts` — drop 3-line llama-cpp purge reference from shim header
- [x] [T007] [P1] `system-skill-advisor/mcp_server/lib/embedders/index.ts` — simplify 7-line LlamaCppBaselineAdapter-removal block to 4 lines describing the current cascade
- [x] [T008] [P1] `repair-failed-embeddings.mjs:30-32` — delete `process.env.NODE_LLAMA_CPP_GPU ??= 'false'` + the 2-line explanatory comment
- [x] [T009] [P1] `run-substrate-stress-harness.mjs:412` — `'llama cpp'` → `'ollama embed'`
- [x] [T010] [P1] `run-substrate-stress-harness.mjs:430` — natural-language probe prompt rewritten to mention Ollama
- [x] [T011] [P1] `install_guides/README.md` — 7 surgical section edits (provider note, disk breakdown, phase-2 narrative, provider table, cascade priority, env vars, validation checklist, troubleshooting)
- [x] [T012] [P1] `commands/doctor/assets/doctor_memory.yaml:23` — invariant list drops "llama-cpp"
- [x] [T013] [P1] `commands/doctor/update.md:317` — example snapshot_path uses `hf-local` instead of `llama-cpp`
- [x] [T014] [P1] `references/memory/embedder_architecture.md:174` — routing-table column drops `/ llama-cpp` suffix
- [x] [T015] [P1] `manual_testing_playbook/detect-changes/detect-changes-multi-file-diff.md` — 5 `llama-cpp.ts` → `hf-local.ts` substitutions + `LlamaCppProvider` → `HfLocalProvider`
- [x] [T016] [P1] `manual_testing_playbook/mcp-tool-surface/code-graph-query-blast-radius.md:37` — `llama-cpp.ts` → `hf-local.ts` in test scenario subject
- [x] [T017] [P1] Author spec.md, plan.md, tasks.md, implementation-summary.md, description.json, graph-metadata.json
- [x] [T018] [P1] Update parent graph-metadata.json children_ids to include `012-remove-llama-cpp-residue`
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T019] [P0] R1 sweep: `rg -i "llama.?cpp|LLAMA_CPP" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**'` returns empty
- [x] [T020] [P0] R2 typecheck: `npx tsc --noEmit -p .opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` no new errors
- [x] [T021] [P0] R3 syntax: `node --check` passes on both modified `.mjs` files
- [x] [T022] [P0] R4 manual: install guide cascade reads consistent (ollama → hf-local → Voyage → OpenAI)
- [x] [T023] [P0] R5 manual: playbook scenarios point at `shared/embeddings/providers/hf-local.ts`
- [x] [T024] [P0] Strict-validate `--strict` exit 0 on this packet
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
24 of 24 tasks complete. R1–R5 from spec.md §4 all pass.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R5 ↔ T019–T023. plan.md Steps 1–5 ↔ Phases 1–3 (Step 1 source comments + Step 2 script edits + Step 3 doc edits all live in Phase 2 IMPLEMENTATION; Step 4 verification = Phase 3; Step 5 spec packet = T017–T018).
<!-- /ANCHOR:cross-refs -->
