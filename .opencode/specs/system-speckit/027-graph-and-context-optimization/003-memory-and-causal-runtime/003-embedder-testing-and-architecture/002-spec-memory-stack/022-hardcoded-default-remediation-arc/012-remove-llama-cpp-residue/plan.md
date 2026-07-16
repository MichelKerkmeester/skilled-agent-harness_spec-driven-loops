---
title: "Plan: 022/012 Remove llama-cpp Residue"
description: "Single-pass surgical edits across 11 live files; no code logic change. R1-R5 verification via rg + tsc + node --check."
trigger_phrases:
  - "022/012 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/012-remove-llama-cpp-residue"
    last_updated_at: "2026-05-23T20:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-execution"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002b13"
      session_id: "016-002-022-012-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Single-pass surgical edits across 11 files; no test changes needed"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 022/012 Remove llama-cpp Residue

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Surface | TS source comments + Markdown docs + YAML config + 1 `.mjs` env-var line + 2 `.mjs` test-fixture strings |
| Verification | `rg` sweep + `tsc --noEmit` + `node --check` |
| Risk | LOW — no behavior change; runtime code was already llama-cpp-free post arc 016 |

### Overview

One-pass surgical edits across 11 live files. Sweep verifies zero residual references in non-archived, non-benchmark paths.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Operator directive captured ("remove all references to llama-cpp")
- Live-surface inventory produced (11 files; benchmark + z_archive + scratch excluded)
- Zero-behavior-change established (runtime code is already llama-cpp-free)

### Definition of Done

- R1–R5 from spec.md §4 pass
- Strict-validate `--strict` exit 0
- Parent `graph-metadata.json` children_ids includes `012-remove-llama-cpp-residue`
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pure removal pattern; no logic introduced. Replacements where needed are minimal:

- Test fixtures: `llama-cpp.ts` → `hf-local.ts`; `LlamaCppProvider` → `HfLocalProvider`
- Stress-test workload strings: `'llama cpp'` → `'ollama embed'`; natural-language probe prompt rewritten to mention Ollama
- Doctor example snapshot path: `context-index__llama-cpp__…` → `context-index__hf-local__…`
- Install-guide cascade narrative: `llama-cpp` provider row removed; Ollama + HF Local presented as the local pair (matches actual `auto-select.ts` cascade order)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1 — Source-code comments (3 files)

Remove historical purge-narrative paragraphs from `shared/embeddings/types.ts` and the two `system-skill-advisor/embedders/` shim files. Replace with concise current-state comments.

### Step 2 — Script edits (2 files)

- `repair-failed-embeddings.mjs`: delete the `process.env.NODE_LLAMA_CPP_GPU ??= 'false'` line plus its 2-line comment block
- `run-substrate-stress-harness.mjs`: 2 string-literal replacements in the test workload arrays

### Step 3 — Doc edits (6 files)

`install_guides/README.md` (7 surgical section edits), `commands/doctor/update.md`, `commands/doctor/assets/doctor_memory.yaml`, `references/memory/embedder_architecture.md`, 2 manual-testing-playbook scenario files.

### Step 4 — Verification

`rg` sweep returns empty in non-archived non-benchmark paths. `tsc --noEmit` runs clean on changed `.ts` files. `node --check` passes on both modified `.mjs` files.

### Step 5 — Spec packet + parent metadata

Author 4 Level-1 docs (spec/plan/tasks/implementation-summary) + description.json + graph-metadata.json. Update parent `022-hardcoded-default-remediation-arc/graph-metadata.json` children_ids. Strict-validate exit 0.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **R1 sweep:** `rg -i "llama.?cpp|LLAMA_CPP" .opencode/ -g '!z_archive/**' -g '!*/scratch/**' -g '!benchmarks/**' -g '!*/specs/**'` returns empty
- **R2 typecheck:** `npx tsc --noEmit -p .opencode/skills/system-skill-advisor/mcp_server/tsconfig.json` no new errors
- **R3 syntax check:** `node --check` passes on the 2 modified `.mjs` files
- **R4 manual read:** install guide cascade is internally consistent and references only Ollama, HF Local, Voyage, OpenAI
- **R5 manual read:** manual-testing-playbook scenarios point at `shared/embeddings/providers/hf-local.ts` (a real current file)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Arc 016 phases 003/006/007 (the original llama-cpp runtime purge) — completed
- Sibling 011-arc-022-followons — completed; this packet is the documentation tail of the same arc
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on the 11 modified paths reverts every edit cleanly. No DB migrations, no env-var defaults, no behavior surface affected. The new spec-folder docs can be deleted via `git clean -fd .opencode/specs/.../012-remove-llama-cpp-residue/` or removed from parent children_ids.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

This packet (012) depends only on the runtime purge already shipped by arc 016 phases 003/006/007. No coordination with in-flight work; commits cleanly under the 022 arc parent as the 14th child.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Step | Wall-clock |
|------|------------|
| 1 Source comments | ~5 min |
| 2 Script edits | ~5 min |
| 3 Doc edits | ~20 min |
| 4 Verification | ~5 min |
| 5 Packet docs + metadata | ~20 min |
| **Total** | **~55 min** |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If a downstream consumer references the removed `LLAMA_CPP_EMBEDDINGS_MODEL` env var or expects the deleted install-guide section: `git revert <commit-sha>` restores all 11 files. The 4 frozen benchmark hits remain in z_archive paths and are not affected by the revert. No partial-rollback scenarios; all 11 edits are independent and can be cherry-picked individually if needed.
<!-- /ANCHOR:enhanced-rollback -->
