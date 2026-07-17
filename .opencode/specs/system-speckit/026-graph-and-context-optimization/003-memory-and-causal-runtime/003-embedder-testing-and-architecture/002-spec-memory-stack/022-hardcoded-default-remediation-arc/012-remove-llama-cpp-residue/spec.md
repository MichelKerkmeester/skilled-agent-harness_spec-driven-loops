---
title: "Spec: 022/012 Remove llama-cpp Residue from Live Surface"
description: "Operator directive: remove all live references to llama-cpp. Runtime code was already purged in arc 016 phases 003/006/007; this packet sweeps the remaining narrative + doc/config residue (11 live files, ~26 line-level edits) so the codebase no longer mentions llama-cpp as a supported provider."
trigger_phrases:
  - "022/012 remove llama-cpp"
  - "llama-cpp purge residue"
  - "remove llama-cpp references"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue"
    last_updated_at: "2026-05-23T20:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Removed llama-cpp from 11 live files"
    next_safe_action: "Strict validate + commit"
    blockers: []
    key_files:
      - ".opencode/install_guides/README.md"
      - ".opencode/commands/doctor/update.md"
      - ".opencode/commands/doctor/assets/doctor_memory.yaml"
      - ".opencode/skills/system-spec-kit/references/memory/embedder_architecture.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/types.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/scripts/repair-failed-embeddings.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/embedders/types.ts"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/embedders/index.ts"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/detect-changes/detect-changes-multi-file-diff.md"
      - ".opencode/skills/system-code-graph/manual_testing_playbook/mcp-tool-surface/code-graph-query-blast-radius.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b12"
      session_id: "016-002-022-012"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Runtime code was already llama-cpp-free — only historical comments + docs + a stray env var + 2 test-fixture strings remained"
      - "Frozen benchmark artifacts under .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/ are out of scope per sk-doc benchmark template convention"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Spec: 022/012 Remove llama-cpp Residue

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Phase | 012 |
| Title | Remove llama-cpp Residue from Live Surface |
| Level | 1 |
| Parent | 022-hardcoded-default-remediation-arc |
| Predecessor | All 11 prior phases shipped (001–011) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Operator directive: "remove all references to llama-cpp." Arc 016 phases 003/006/007 already purged llama-cpp from runtime code paths (factory, profile, auto-select, providers, types), but historical narrative and documentation residue remained across 11 live files: source-code comments documenting the prior purge, install-guide sections listing llama-cpp as a supported provider, a `NODE_LLAMA_CPP_GPU` env var setter in a repair script, two test-fixture strings, doctor-command examples, an embedder architecture table column, and two manual-testing-playbook scenario fixtures using `llama-cpp.ts` as the example subject path.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (shipped this packet)

11 live files, ~26 line-level edits:
- **Source-code comments (3 files):** `shared/embeddings/types.ts`, `system-skill-advisor/embedders/types.ts`, `system-skill-advisor/embedders/index.ts` — historical-purge narrative simplified to concise current-state comments.
- **Scripts (2 files):** `repair-failed-embeddings.mjs` (dead `NODE_LLAMA_CPP_GPU` env-var setter removed + its explanatory comment), `run-substrate-stress-harness.mjs` (2 test-workload string replacements: `'llama cpp'` → `'ollama embed'`, and the natural-language probe prompt rewritten to mention Ollama).
- **Docs (5 files):** `install_guides/README.md` (7 surgical section edits — provider list, cascade priority, model size, env vars, validation checklist, troubleshooting), `commands/doctor/assets/doctor_memory.yaml` (1 word drop from invariant list), `commands/doctor/update.md` (1 example snapshot_path rename), `references/memory/embedder_architecture.md` (table column header trim), 2 manual-testing-playbook scenario files (path/class-name substitutions to `hf-local.ts` / `HfLocalProvider`).

### Out of Scope (intentionally preserved)

- 4 hits in `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/` — frozen historical benchmark artifacts per sk-doc benchmark template convention; their hits reference a `z_archive/` spec path that is also immutable.
- All `z_archive/**` and `*/scratch/**` spec content — historical artifacts.
- `node-llama-cpp` package.json dependency cleanup — separate dep-prune pass, not in scope here.
- Pre-commit hook wiring for `validate-doc-model-refs.js` — task #39, separate work.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|----|-------------|--------------|
| R1 | Zero live `llama-cpp` / `LLAMA_CPP` hits remain in non-archived, non-benchmark paths | `rg -i "llama.?cpp\|LLAMA_CPP" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**'` returns empty |
| R2 | TypeScript compiles cleanly on the changed `.ts` files | `npx tsc --noEmit` exits 0 (modulo pre-existing `baseUrl` deprecation warning) |
| R3 | Both modified `.mjs` files pass syntax checks | `node --check <path>` exits 0 |
| R4 | Install guide narrative still describes a working auto-cascade for embeddings | Manual read: cascade order documents `ollama` (if reachable) → `hf-local` default → `VOYAGE_API_KEY` → `OPENAI_API_KEY` |
| R5 | Manual-testing-playbook scenarios use a real, current file as the diff subject (no dangling reference to a deleted `llama-cpp.ts`) | Manual read confirms `hf-local.ts` is used |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R5 pass. 11 live files cleaned. No runtime behavior change (code was already llama-cpp-free). Strict-validate exit 0 on the new packet.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Single-pass surgical edits, main-agent direct via Read + Edit tool. No dispatched executors. Verification via `rg` sweep + `tsc --noEmit` + `node --check`. No new tests written; no existing test logic depends on llama-cpp.
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| Stress-harness string replacement changes test corpus character distribution | Replacement preserves length + topic shape (`'llama cpp'` ≈ `'ollama embed'`); workload is for latency p50/p95 measurement, not topic-specific scoring |
| Install-guide cascade narrative loses the GGUF runtime story | Replaced with the actual current cascade (Ollama → HF Local → Voyage → OpenAI per `auto-select.ts`); narrative now matches code |
| `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env var still referenced in old packet docs / z_archive | Out-of-scope (z_archive); the runtime no longer reads this env var |
| Manual-testing-playbook scenario subject change requires a real existing file | `hf-local.ts` exists at `shared/embeddings/providers/hf-local.ts` — confirmed |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- Should `node-llama-cpp` be removed from `package.json` / `package-lock.json` as a dep-prune follow-on? (Out of scope here; would need verification no transitive consumer remains.)
- Should the install guide also drop the `MEMORY_AUTO_MIGRATE_HF_TO_LLAMA` env var documentation entirely? (Removed in this packet; if any runtime code still respects it, a follow-on should clean that up.)
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Sibling: `011-arc-022-followons` (closed the validator + RERANKER tail; 012 closes the llama-cpp narrative tail)
- Predecessor runtime purge: arc 016 phases 003/006/007 (`002-spec-memory-stack/016-*`)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- Zero runtime semantics change (verified by typecheck + node syntax checks)
- No new tests required (no llama-cpp-shaped behavior contract existed pre-cleanup)
- Documentation remains internally consistent (cascade order, provider table, env vars)
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- Stress harness latency measurement: replacement strings preserve the workload shape; no expected p50/p95 drift.
- Doctor's `:apply` mode encountering a pre-existing `context-index__llama-cpp__*.sqlite` snapshot on disk: still handled (snapshot files are matched by glob pattern, not by exact name).
- Operator running `git log -S "llama-cpp"` historical search: still works against z_archive and pre-cleanup commits.
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 1 doc-and-comment cleanup. Single-pass edits across 11 live files. ~-12 net LOC. Zero behavior change.
<!-- /ANCHOR:complexity -->
