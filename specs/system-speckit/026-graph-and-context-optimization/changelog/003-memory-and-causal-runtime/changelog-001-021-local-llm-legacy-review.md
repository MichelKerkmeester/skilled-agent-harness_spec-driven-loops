---
title: "Local-LLM Legacy and Config-Drift Review (post-014)"
description: "10-iteration deep-review loop via cli-codex surfaced 2 P0 + 83 P1 + 31 P2 findings across code, docs, configs and assets. Verdict FAIL. The P0s are real code bugs in factory.ts where the auto path unconditionally selects llama-cpp, contradicting 014's documented ship state. Remediation packet 022 recommended."
trigger_phrases:
  - "local-llm legacy review"
  - "post-014 config drift"
  - "factory.ts llama-cpp auto-path bug"
  - "embedding default drift review"
  - "voyage residue deep review"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-13

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/021-local-llm-legacy-review` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation`

### Summary

Packet 014 shipped a default-embedding migration that demoted llama-cpp to explicit opt-in and promoted hf-local EmbeddingGemma q8 768d as the automatic default. After the migration, approximately 147 active-file surfaces across code, docs, runtime configs and assets still asserted old provider defaults without any post-014 audit.

A 10-iteration `/deep:start-review-loop:auto` run was executed via cli-codex (gpt-5.5, reasoning=high, service_tier=fast, 900s per iteration timeout). The run started at 20 planned iterations and was reduced to 10 mid-run at the user's request. Iters 1-2 were preserved across the restart using a skip-existing guard. The run produced a verdict of FAIL with hasAdvisories=true.

The two P0 findings are real code bugs in `shared/embeddings/factory.ts` at lines 819-823. The auto path calls `getLlamaCppAvailability()` and unconditionally returns `{ name: 'llama-cpp' }` whenever the GGUF runtime is installed, directly contradicting 014's documented ship state in packet `017-llama-cpp-default-flip`. The 83 P1 findings span correctness issues in runtime configs that document `auto resolves to llama-cpp`, plus traceability drift in ENV_REFERENCE.md, install guides, CocoIndex docs, README files and eval scripts that still reference Voyage, MiniLM, Nomic, OpenAI and generic sqlite paths. The 31 P2 findings cover test fixtures and ONNX cleanup residue. Three P1 findings were hand-validated against source to confirm evidence is real.

Remediation packet 022 was recommended to address the P0 factory.ts auto-path, align all runtime config notes, replace generic sqlite paths with profile-derived resolution and update CocoIndex and Memory MCP docs to post-014 canonical defaults.

### Added

None. Review-only phase.

### Changed

None. Review-only phase.

### Fixed

None. Review-only phase.

### Verification

| Artifact | Status |
|---|---|
| `review/review-report.md` (188 lines, full 10-section structure) | Created |
| `review/resource-map.md` | Created |
| `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md` | Created (10 files) |
| `review/deep-review-state.jsonl` | Created (state log) |
| Verdict | FAIL. hasAdvisories=true. P0=2, P1=83, P2=31. |
| P0 finding 1 hand-validated | `factory.ts:819-823` confirmed via direct read. `const llamaCppAvailability = getLlamaCppAvailability(); if (llamaCppAvailability.available) { return { name: 'llama-cpp', ... } }` matches exactly. |
| P0 finding 2 hand-validated | `factory.ts:822` `name: 'llama-cpp',` confirmed via direct read. |
| P1 spot-check (ENV_REFERENCE.md:445) | Confirmed: exact match for Voyage voyage-4 primary text. |
| P1 spot-check (mcp-coco-index/INSTALL_GUIDE.md:101) | Confirmed: exact match for all-MiniLM-L6-v2 default text. |
| P1 spot-check (install_guides/README.md:671) | Confirmed: exact match for VOYAGE_EMBEDDINGS_MODEL=voyage-3.5 default text. |
| HEAD unchanged vs recovery anchor | `5e7095d3336510b5756ba5cac383a8e08d1d79db` confirmed. Zero mutations outside packet. |
| RM-8 scope discipline | All iteration writes confined to `review/iterations/`. No rm/sed -i/mv invoked outside packet. |
| Executor | cli-codex 0.130.0, gpt-5.5, reasoning=high, service_tier=fast, workspace-write sandbox. |

### Files Changed

| File | What changed |
|---|---|
| `021-local-llm-legacy-review/review/review-report.md` (NEW) | 188-line review report with verdict FAIL, P0/P1/P2 finding tables, release-readiness assessment and remediation recommendations. |
| `021-local-llm-legacy-review/review/resource-map.md` (NEW) | Resource map of reviewed surfaces and reviewer notes. |
| `021-local-llm-legacy-review/review/iterations/iteration-001.md` through `iteration-010.md` (NEW) | Per-iteration finding files from the 10-iteration deep-review loop. |
| `021-local-llm-legacy-review/review/deep-review-state.jsonl` (NEW) | Append-only state log for the deep-review run. |

### Follow-Ups

- Scaffold `022-local-llm-legacy-remediation/` as a Level 2 sibling under the parent, dispatching batched cli-codex gpt-5.5 high fast remediations across the six finding groups from review-report.md section 10.
- Resolve the P0 framing question: determine whether `factory.ts` auto-llama-cpp selection is the actual ship state (making the 014 implementation-summaries wrong) or whether 014 incompletely landed the opt-in flip (making factory.ts wrong). Remediation 022 must pick which truth wins before writing the fix.
- Confirm whether the Voyage cloud-fallback in factory.ts is intentional opt-in behavior via env or also residue from 014.
- Run a confirmatory `/deep:start-review-loop:auto` pass after remediation 022 ships to confirm FAIL transitions to PASS.
