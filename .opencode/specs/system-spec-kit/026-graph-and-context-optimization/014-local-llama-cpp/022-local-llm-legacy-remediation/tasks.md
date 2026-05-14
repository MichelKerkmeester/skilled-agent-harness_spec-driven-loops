---
title: "Tasks: Local-LLM legacy remediation (post-021 review)"
description: "Per-batch task list with acceptance checks; one cli-codex dispatch per batch + final re-review."
trigger_phrases:
  - "022 tasks"
  - "local-llm legacy remediation tasks"
importance_tier: "important"
contextType: "remediation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Local-LLM legacy remediation (post-021 review)

<!-- SPECKIT_LEVEL: 2 -->

---

## TASK BREAKDOWN

| ID | Task | Status | Owner | Evidence |
|----|------|--------|-------|----------|
| T-001 | Capture recovery anchor SHA pre-dispatch | TODO | main-agent | `git rev-parse HEAD` recorded in batch 1 dispatch |
| T-002 | Verify current Voyage / OpenAI default model identifiers (open question #1) | TODO | main-agent | Confirm `voyage-3.5` vs `voyage-4` and `text-embedding-3-small` are current |
| **Batch 1 — 014/017 narrative correction** | | | | |
| T-011 | Dispatch cli-codex for narrative correction | TODO | cli-codex | iter log |
| T-012 | Run grep acceptance: zero "llama-cpp explicit opt-in" or "hf-local restored as automatic default" hits | TODO | main-agent | `rg ... 014/` output empty |
| T-013 | Inspect `git diff --stat` confined to batch-1 scope | TODO | main-agent | diff stat |
| T-014 | Commit batch 1 changes | TODO | main-agent | conventional commit hash |
| **Batch 2 — Old model-name defaults purge** | | | | |
| T-021 | Dispatch cli-codex for model-name purge | TODO | cli-codex | iter log |
| T-022 | Run grep acceptance: zero `nomic-ai/nomic-embed-text-v1.5\|all-MiniLM-L6-v2` outside test fixtures | TODO | main-agent | `rg ...` output empty |
| T-023 | Inspect `git diff --stat` confined to batch-2 scope | TODO | main-agent | diff stat |
| T-024 | Commit batch 2 changes | TODO | main-agent | conventional commit hash |
| **Batch 3 — Hardcoded sqlite paths** | | | | |
| T-031 | Dispatch cli-codex for sqlite-path normalization | TODO | cli-codex | iter log |
| T-032 | Run grep acceptance: zero literal `'context-index.sqlite'` in scripts/mcp_server/shared | TODO | main-agent | `rg ...` output empty |
| T-033 | Run unit tests for touched modules | TODO | main-agent | `vitest` PASS |
| T-034 | Commit batch 3 changes | TODO | main-agent | conventional commit hash |
| **Batch 4 — ONNX backend cleanup** | | | | |
| T-041 | Dispatch cli-codex for ONNX dep purge | TODO | cli-codex | iter log |
| T-042 | Run grep acceptance: zero `onnxruntime-node\|onnxruntime-common` in package.jsons | TODO | main-agent | `grep ...` output empty |
| T-043 | Run `npm install` to refresh lockfile if drifted | TODO | main-agent | lockfile diff |
| T-044 | Commit batch 4 changes | TODO | main-agent | conventional commit hash |
| **Batch 5 — Generated-asset regeneration** | | | | |
| T-051 | Dispatch cli-codex for catalog + playbook + fixture regeneration | TODO | cli-codex | iter log |
| T-052 | Run vitest for touched test files | TODO | main-agent | all PASS |
| T-053 | Run grep acceptance: zero old model strings in non-archive paths | TODO | main-agent | `rg ...` output empty |
| T-054 | Commit batch 5 changes | TODO | main-agent | conventional commit hash |
| **Confirmatory re-review** | | | | |
| T-061 | Scaffold `023-post-remediation-re-review/` (Level 2) | TODO | main-agent | packet exists |
| T-062 | Dispatch `/spec_kit:deep-review:auto` against same scope as 021 | TODO | main-agent | 023/review/review-report.md exists |
| T-063 | Verify verdict ∈ {PASS, PASS-with-advisories} | TODO | main-agent | verdict line in report |
| T-064 | Update 022 implementation-summary with final verdict + close 022 | TODO | main-agent | summary updated, status="complete" |

---

## DEPENDENCIES

- T-001, T-002 must complete before T-011
- Each batch (T-01x → T-02x → T-03x → T-04x → T-05x) is sequential; later batch may rely on earlier batch's changes
- T-06x re-review depends on T-054 commit landing

---

## ESTIMATED WALLTIME

| Batch | Codex dispatch | Acceptance check | Commit | Subtotal |
|------:|---------------:|-----------------:|-------:|---------:|
| 1 | ~10 min | <1 min | <1 min | ~12 min |
| 2 | ~25 min | <1 min | <1 min | ~27 min |
| 3 | ~20 min | ~2 min (vitest) | <1 min | ~23 min |
| 4 | ~10 min | <1 min | <1 min | ~12 min |
| 5 | ~30 min | ~3 min (vitest) | <1 min | ~34 min |
| Re-review | ~50 min (10 iters + synth) | ~2 min (validation) | <1 min | ~53 min |
| **Total** | | | | **~161 min ≈ 2h 40m** |
