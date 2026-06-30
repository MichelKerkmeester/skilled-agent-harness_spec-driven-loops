---
title: "Checklist: Local-LLM legacy remediation (post-021 review)"
description: "L2 verification checklist with per-batch gates + final re-review acceptance."
trigger_phrases:
  - "022 checklist"
importance_tier: "important"
contextType: "remediation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
# Checklist: Local-LLM legacy remediation (post-021 review)

<!-- SPECKIT_LEVEL: 2 -->

---

## PRE-DISPATCH GATES

- [x] Packet scaffolded at `026-graph-and-context-optimization/014-local-embeddings-setup-a/022-local-llm-legacy-remediation/`
- [x] Branch is `main` (skip-branch flag used)
- [x] User Q1=A and Q2=yes captured in spec.md answered_questions
- [ ] Recovery anchor SHA captured pre-dispatch
- [ ] Voyage / OpenAI current default model identifiers confirmed
- [ ] cli-codex 0.130.0 availability confirmed

## BATCH 1 GATES — 014/017 narrative correction

- [ ] cli-codex dispatched with batch-1 scope-locked prompt
- [ ] `grep -ri "llama-cpp explicit opt-in\|hf-local restored as automatic default" 014/{spec.md,handover.md,SETUP_A_RECIPE.md,017-llama-cpp-default-flip/}` returns 0 hits
- [ ] `git diff --stat` shows only batch-1 declared files touched
- [ ] Commit landed; conventional commit message includes `(022/B1)`

## BATCH 2 GATES — Old model-name defaults purge

- [ ] cli-codex dispatched with batch-2 scope-locked prompt
- [ ] `rg 'nomic-ai/nomic-embed-text-v1\.5'` returns only test-fixture paths (B5 territory)
- [ ] `rg 'all-MiniLM-L6-v2'` returns only test-fixture paths (B5 territory)
- [ ] `git diff --stat` shows only batch-2 declared files touched
- [ ] Commit landed; conventional commit message includes `(022/B2)`

## BATCH 3 GATES — Hardcoded sqlite paths

- [ ] cli-codex dispatched with batch-3 scope-locked prompt
- [ ] `rg "'context-index\.sqlite'" .opencode/skills/system-spec-kit/{scripts,mcp_server,shared}` returns 0 hits
- [ ] `resolveActiveProfileDbPath` (or equivalent helper) exists and is called
- [ ] Unit tests for touched modules PASS via `vitest`
- [ ] `git diff --stat` shows only batch-3 declared files touched
- [ ] Commit landed; conventional commit message includes `(022/B3)`

## BATCH 4 GATES — ONNX backend cleanup

- [ ] cli-codex dispatched with batch-4 scope-locked prompt
- [ ] `grep -E 'onnxruntime-(node|common)' .opencode/skills/system-spec-kit/{package.json,mcp_server/package.json}` returns 0 hits
- [ ] `check-native-modules.sh` no longer probes ONNX
- [ ] `hf-local.ts:309` recovery hint no longer mentions `npm rebuild onnxruntime-node`
- [ ] `npm install` clean (no lockfile drift errors)
- [ ] `git diff --stat` shows only batch-4 declared files touched
- [ ] Commit landed; conventional commit message includes `(022/B4)`

## BATCH 5 GATES — Generated-asset regeneration

- [ ] cli-codex dispatched with batch-5 scope-locked prompt
- [ ] vitest for touched test files PASSES
- [ ] `rg 'all-MiniLM-L6-v2|nomic-ai/nomic-embed-text-v1\.5'` returns 0 non-archive hits
- [ ] `rg '"embeddingModel":\s*"all-MiniLM-L6-v2"'` returns 0 hits
- [ ] `rg '384[- ]?dim'` returns 0 hits in test fixtures
- [ ] `git diff --stat` shows only batch-5 declared files touched
- [ ] Commit landed; conventional commit message includes `(022/B5)`

## CONFIRMATORY RE-REVIEW GATES

- [ ] `023-post-remediation-re-review/` packet scaffolded as sibling of 022
- [ ] `/deep:start-review-loop:auto` dispatched with same scope as 021
- [ ] `023/review/review-report.md` exists with verdict line
- [ ] Verdict ∈ {PASS, PASS-with-advisories}
- [ ] If verdict CONDITIONAL or FAIL: scope follow-on sub-phase 024 for net-new findings

## SUCCESS CRITERIA TRACEABILITY

| SC | Evidence Location |
|----|-------------------|
| SC-001 | Per-batch `git diff --stat` outputs (recorded in implementation-summary post-run) |
| SC-002 | `023/review/review-report.md` verdict line |
| SC-003 | Final `git status --porcelain` filtered to !022 !023 |
| SC-004 | Wall-time accounting in implementation-summary post-run |
