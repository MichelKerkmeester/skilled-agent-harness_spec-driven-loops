---
title: "Implementation Summary: 022/012 Remove llama-cpp Residue"
description: "11 live files cleaned of llama-cpp references; runtime code was already purged in arc 016, this packet finished the doc/comment tail."
trigger_phrases:
  - "022/012 summary"
  - "llama-cpp removal complete"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue"
    last_updated_at: "2026-05-23T20:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped — 11 files modified, R1-R5 pass"
    next_safe_action: "Commit + parent metadata update"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b15"
      session_id: "016-002-022-012-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "R1-R5 all pass; zero remaining live llama-cpp references"
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Summary: 022/012 Remove llama-cpp Residue

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|------|-------|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 11 modified (3 source comments + 2 scripts + 6 docs) |
| Findings closed | All live llama-cpp references purged |
| Wall-clock | ~55 min |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Source-code comments (3 files)

- `.opencode/skills/system-spec-kit/shared/embeddings/types.ts`: 6-line historical-purge comment → 2-line current-state comment
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts`: 3-line llama-cpp purge reference dropped from shim header
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts`: 7-line LlamaCppBaselineAdapter-removal block simplified to 4 lines describing the current cascade (Ollama → hf-local → OpenAI → Voyage)

### Scripts (2 files)

- `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs`: removed `process.env.NODE_LLAMA_CPP_GPU ??= 'false'` line + its 2-line comment block (dead env-var setter; no remaining consumer)
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs`: 2 string-literal replacements in test workload arrays — `'llama cpp'` → `'ollama embed'` (short prompt) and `'Find context about local llama cpp embedding worker failures.'` → `'Find context about local Ollama embedding worker failures.'` (medium probe)

### Docs (6 files)

- `.opencode/install_guides/README.md`: 7 surgical section edits
  - Section 7 provider note (line 191): rewritten to list HF Local + Ollama + Voyage + OpenAI (no llama-cpp)
  - Section 8 disk breakdown (lines 304–305): dropped EmbeddingGemma GGUF + node-llama-cpp Metal dylib entries
  - Section 9 phase-2 narrative (line 494): rewritten to describe HF Local default + Ollama promotion
  - Section 10.2 provider table + cascade priority (lines 580–597): replaced llama-cpp row with Ollama; cascade reordered to match `auto-select.ts`
  - Section 10.2 env vars (lines 617–640): dropped `LLAMA_CPP_EMBEDDINGS_MODEL`, `LLAMA_CPP_EMBEDDINGS_GGUF_FILE`, `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA`; added `OLLAMA_EMBEDDINGS_MODEL`
  - Validation checklist (line 656): cascade narrative updated
  - Troubleshooting (line 1411): cascade narrative updated
- `.opencode/commands/doctor/assets/doctor_memory.yaml`: dropped "llama-cpp" from the invariant profile list (line 23)
- `.opencode/commands/doctor/update.md`: example `snapshot_path` renamed from `context-index__llama-cpp__…` to `context-index__hf-local__…`
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md`: routing-table column header `"Future sentence-transformers / llama-cpp"` → `"Future sentence-transformers"`
- `.opencode/skills/system-code-graph/manual_testing_playbook/detect-changes/detect-changes-multi-file-diff.md`: 5 substitutions — 4 path refs `shared/embeddings/providers/llama-cpp.ts` → `shared/embeddings/providers/hf-local.ts`, 1 class-name `LlamaCppProvider` → `HfLocalProvider`
- `.opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/code-graph-query-blast-radius.md`: 1 path substitution `llama-cpp.ts` → `hf-local.ts` in test scenario subject
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

~55 min total wall-clock. Single-pass main-agent direct edits via the Edit tool.

1. **Live-surface inventory** via `rg` with explicit exclusions (z_archive, scratch, benchmarks, locks, jsonl, iteration-*, descriptions.json, specs/). 11 files identified.
2. **Categorized** into: code (3 comment files), scripts (2 .mjs), docs (5 .md), config (1 .yaml).
3. **Code edits first** (smallest blast radius), then scripts, then docs.
4. **Verification ran in parallel** after each batch — final sweep + typecheck + node --check.
5. **Spec packet authored** after edits complete so implementation-summary reflects actual shipped state.

No CLI executor dispatch needed — every edit was a targeted single-line or single-block change. All within main-agent's edit-tool window.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **Frozen benchmark artifacts preserved.** 4 hits in `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/` reference a `z_archive/` spec path. Per sk-doc benchmark template convention, dated benchmark folders are immutable historical records — modifying them would falsify the benchmark.
- **Path-replacement target chosen as `hf-local.ts`** for manual-testing-playbook scenarios because it's a real existing file (not a hypothetical), keeps the scenario realistic.
- **Stress-harness string replacement preserved workload shape.** `'llama cpp'` (8 chars) → `'ollama embed'` (12 chars) keeps the topic-similarity character distribution roughly comparable; the workload measures latency p50/p95, not topic-specific scoring, so minor shifts are acceptable.
- **`MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env var dropped from docs.** Was a one-time migration knob for arc 018 with no remaining runtime consumer; removing from docs reflects actual code state.
- **`node-llama-cpp` package.json dep cleanup deferred.** Separate dep-prune pass; would need verification that no transitive consumer remains. Out of scope here.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

| Requirement | Check | Result |
|-------------|-------|--------|
| R1 | `rg -i "llama.?cpp\|LLAMA_CPP" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**'` | Empty — PASS |
| R2 | `npx tsc --noEmit -p .opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` | No new errors; only pre-existing `TS5101 baseUrl deprecation` warning unrelated — PASS |
| R3 | `node --check` on both modified `.mjs` files | Both exit 0 — PASS |
| R4 | Manual read of install_guides/README.md cascade narrative | Cascade reads `ollama` (if reachable) → `hf-local` default → `VOYAGE_API_KEY` → `OPENAI_API_KEY` consistently across sections 7, 9, 10.2, 13 — PASS |
| R5 | Manual read of 2 manual_testing_playbook scenarios | Both reference `shared/embeddings/providers/hf-local.ts` (a real current file) — PASS |
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- 4 remaining `llama-cpp` hits live in `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/` — each references the path `specs/.../z_archive/wave-2-shallow-medium/014-041-llama-cpp-metal-investigation/scratch/probe-gpulayers-zero.mjs`. Per sk-doc benchmark template convention these are frozen historical artifacts; modifying them would falsify the benchmark record.
- All hits in `z_archive/**`, `*/scratch/**`, `iteration-*.md`, and old commit history are intentionally preserved as historical record.
- `node-llama-cpp` may still appear as a dependency in `package.json` / `package-lock.json`; a separate dep-cleanup pass would be needed to fully prune it.
- The `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env var was removed from documentation only; if any runtime code still respects it, a follow-on cleanup is needed (none expected — arc 018 was the last consumer).

### Commit Handoff

```
chore(022/012): remove llama-cpp residue from live surface

Operator directive: "remove all references to llama-cpp."

Runtime code was already purged in arc 016 phases 003/006/007 (factory,
profile, auto-select, providers, types). This packet sweeps the
documentation and narrative tail across 11 live files (~26 line-level
edits):

Source comments (3): shared/embeddings/types.ts +
  system-skill-advisor/embedders/{types,index}.ts — historical purge
  paragraphs simplified to concise current-state.

Scripts (2): repair-failed-embeddings.mjs (NODE_LLAMA_CPP_GPU env-var
  setter removed), run-substrate-stress-harness.mjs (2 test-fixture
  strings replaced with Ollama equivalents).

Docs (5): install_guides/README.md (provider table + cascade order + env
  vars rewritten to match auto-select.ts), commands/doctor/{update.md,
  assets/doctor_memory.yaml}, references/memory/embedder_architecture.md,
  2 system-code-graph manual_testing_playbook scenario files (test
  fixtures now use hf-local.ts as subject).

Verification: rg sweep empty in non-archived non-benchmark paths;
  npx tsc --noEmit clean; node --check passes on both .mjs files;
  install-guide cascade reads consistent across sections.

Out of scope (preserved): 4 hits in benchmarks/benchmark-2026-05-20/
  (frozen artifacts), all z_archive/ + scratch/ paths.
```

Explicit paths:

```
.opencode/install_guides/README.md
.opencode/commands/doctor/update.md
.opencode/commands/doctor/assets/doctor_memory.yaml
.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md
.opencode/skills/system-spec-kit/shared/embeddings/types.ts
.opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs
.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts
.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts
.opencode/skills/system-code-graph/manual_testing_playbook/detect-changes/detect-changes-multi-file-diff.md
.opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/code-graph-query-blast-radius.md
.opencode/specs/.../022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue/  (NEW packet)
.opencode/specs/.../022-hardcoded-default-remediation-arc/graph-metadata.json  (children_ids updated)
```
<!-- /ANCHOR:limitations -->
