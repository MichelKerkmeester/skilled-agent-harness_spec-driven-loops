---
title: "Plan: Local-LLM legacy remediation (post-021 review)"
description: "5-batch cli-codex dispatch plan that lands narrative correction (batch 1), model-name purge (batch 2), sqlite-path normalization (batch 3), ONNX cleanup (batch 4), and asset regeneration (batch 5); confirmatory re-review at the end."
trigger_phrases:
  - "022 remediation plan"
  - "local-llm legacy remediation plan"
importance_tier: "important"
contextType: "remediation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Local-LLM legacy remediation (post-021 review)

<!-- SPECKIT_LEVEL: 2 -->

---

## 1. APPROACH

Five sequential cli-codex dispatches with gpt-5.5 reasoning=high service_tier=fast, each scoped to one batch from sibling packet 021's review findings (post user Q1=A / Q2=yes reclassification). Per-batch prompt-pack enforces RM-8 BANNED OPERATIONS (no `rm`/`mv`/`git rm`/`sed -i` outside the declared file scope; scope violations → in-finding record, not executed). Each batch ends with a grep-based acceptance check before the next batch starts.

Closing: a confirmatory `/spec_kit:deep-review:auto` re-run against the same scope as 021 to confirm the FAIL → PASS transition.

This follows the `013/003` precedent: cli-codex batched remediation worked there with zero out-of-scope writes across 28-min walltime per batch.

---

## 2. PER-BATCH DISPATCH CONTRACTS

### Batch 1 — 014/017 narrative correction (4-6 findings, ~10 min)

Scope:
- `../017-llama-cpp-default-flip/implementation-summary.md` (primary target)
- `../spec.md` (parent 014 spec — check for "llama-cpp opt-in" wording)
- `../handover.md` (if exists at parent)
- `../SETUP_A_RECIPE.md` (if exists at parent)

Prompt outline:
> Replace "hf-local restored as automatic default; llama-cpp explicit opt-in" with "auto-cascade is Voyage → OpenAI → llama-cpp (when GGUF runtime installed) → hf-local; llama-cpp auto-selected by availability probe, not by explicit opt-in flag. Explicit override via EMBEDDINGS_PROVIDER=<provider> remains available." Preserve all other historical context (014/014 ONNX rejection, 014/015 parity-failed evidence, 014/016 retrieval-equivalent finding, 014/017 migration evidence). Do not touch any file outside the listed scope.

Acceptance: `grep -ri "llama-cpp explicit opt-in\|hf-local restored as automatic default" 014/{spec.md,handover.md,SETUP_A_RECIPE.md,017-llama-cpp-default-flip/}` returns 0 hits.

### Batch 2 — Old model-name defaults purge (~30 findings, ~25 min)

Scope (one dispatch, file list bound in prompt):
- `.opencode/skills/system-spec-kit/shared/embeddings.ts:868` (`DEFAULT_MODEL_NAME`)
- `.opencode/skills/system-spec-kit/shared/README.md` (HF env default + provider tree)
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` (default model list — keep cascade narrative)
- `.opencode/skills/system-spec-kit/references/memory/embedding_resilience.md` (1024-dim cache key + Voyage primary diagram)
- `.opencode/skills/system-spec-kit/README.md` (hybrid-search channel docs + provider table + Voyage env row)
- `.opencode/skills/system-spec-kit/feature_catalog/19--feature-flag-reference/05-5-embedding-and-api.md` (EMBEDDING_DIM + EMBEDDINGS_PROVIDER rows)
- `.opencode/skills/system-spec-kit/references/config/environment_variables.md`
- `.opencode/skills/mcp-coco-index/README.md` (default model line, settings YAML sample)
- `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md` (default+recommended table, primary recommendation block, 5 config-template samples, defaults summary table)
- `.opencode/skills/mcp-coco-index/SKILL.md` (`(primary)` annotation on voyage-code-3)
- `.opencode/skills/mcp-coco-index/references/settings_reference.md` (default rows + example block)
- `.opencode/skills/mcp-coco-index/assets/config_templates.md` (3 template notes)
- `.opencode/install_guides/README.md` (provider table, recommended notes, default export examples lines 671-678)
- `.mcp.json` (note about Voyage 8% better)
- `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `opencode.json` (Voyage recommendation lines only — leave cascade lines intact)
- Root `README.md` (multiple lines: 139, 517, 828, 1257, 1261, 1289, 1434)

Prompt outline:
> Replace `nomic-ai/nomic-embed-text-v1.5` with `onnx-community/embeddinggemma-300m-ONNX` (HF default). Replace `all-MiniLM-L6-v2` (CocoIndex default contexts) with `google/embeddinggemma-300m`. Replace `384` dimensions with `768`. Drop "(primary)" and "recommended (8% better than OpenAI)" marketing wording where it appears in default/required contexts; keep functional cascade descriptions intact. Do NOT change Voyage cascade lines — those describe correct intended behavior per user Q2=yes.

Acceptance: `rg -l 'nomic-ai/nomic-embed-text-v1\.5|all-MiniLM-L6-v2' .opencode/skills/ .opencode/install_guides/ README.md` returns only test-fixture paths (batch 5 territory).

### Batch 3 — Hardcoded sqlite paths (~15 findings, ~20 min)

Scope:
- `.opencode/skills/system-spec-kit/mcp_server/lib/eval/memory-state-baseline.ts:65`
- `.opencode/skills/system-spec-kit/scripts/evals/map-ground-truth-ids.ts:34`
- `.opencode/skills/system-spec-kit/scripts/evals/run-ablation.ts:50`
- `.opencode/skills/system-spec-kit/scripts/evals/run-bm25-baseline.ts:39`
- `.opencode/skills/system-spec-kit/scripts/memory/cleanup-index-scope-violations.ts:77` (voyage 1024)
- `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:79` (legacy generic branch)
- `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/create-checkpoint.ts:37`
- `.opencode/skills/system-spec-kit/mcp_server/scripts/migrations/restore-checkpoint.ts:36`
- `.opencode/skills/system-spec-kit/scripts/setup/install.sh:253`
- Config-note database lines in 4 runtime configs (`.codex/config.toml:21`, `.claude/mcp.json:17`, `.gemini/settings.json:34`, `opencode.json:27`, `.mcp.json:N` if applicable)

Prompt outline:
> Replace literal `'context-index.sqlite'` paths with `resolveActiveProfileDbPath()` (or equivalent named helper in the same module). Where the helper doesn't yet exist, add a minimal one to `shared/embeddings/profile.ts` that returns the filename-keyed sqlite path for the currently-active embedding profile. Update each call site. Remove the hardcoded `context-index__voyage__voyage-4__1024.sqlite` reference in cleanup-index-scope-violations.ts; require an explicit `--db` argument instead. For config notes, replace "Default DB: context-index__llama-cpp__..." with "Default DB: auto-derived from active embedding profile (provider+model+dim+dtype)".

Acceptance: `rg "'context-index\.sqlite'|\"context-index\.sqlite\"" .opencode/skills/system-spec-kit/{scripts,mcp_server,shared}` returns 0 hits.

### Batch 4 — ONNX backend cleanup (~5 findings, ~10 min)

Scope:
- `.opencode/skills/system-spec-kit/package.json` (remove `onnxruntime-common` line 50)
- `.opencode/skills/system-spec-kit/mcp_server/package.json` (remove `onnxruntime-common` line 58)
- `.opencode/skills/system-spec-kit/scripts/setup/check-native-modules.sh:63` (remove ONNX probe)
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts:309` (remove `npm rebuild onnxruntime-node` line from recovery hints)
- `.opencode/skills/system-spec-kit/package.json:39` (remove onnxruntime-node devEngines/optionalDependencies block if present)

Prompt outline:
> Remove `onnxruntime-node` and `onnxruntime-common` from package.json (and lockfile if applicable — run `npm install` if lockfile drift). Remove the ONNX runtime probe block in `check-native-modules.sh`. Update `hf-local.ts:309` recovery-hint console.error message to drop the rebuild line. Do not touch any file outside this list.

Acceptance: `grep -E 'onnxruntime-(node|common)' .opencode/skills/system-spec-kit/{package.json,mcp_server/package.json}` returns 0 hits.

### Batch 5 — Generated-asset regeneration (~30 P2 findings, ~30 min)

Scope:
- `.opencode/skills/mcp-coco-index/feature_catalog/**/*.md`
- `.opencode/skills/mcp-coco-index/manual_testing_playbook/**/*.md`
- `.opencode/skills/mcp-coco-index/tests/test_config.py`
- `.opencode/skills/mcp-coco-index/tests/test_settings.py`
- `.opencode/skills/system-spec-kit/feature_catalog/**/*.md`
- `.opencode/skills/system-spec-kit/manual_testing_playbook/**/*.md`
- `.opencode/skills/system-spec-kit/scripts/tests/test-embeddings-behavioral.js`
- `.opencode/skills/system-spec-kit/scripts/tests/test-embeddings-factory.js`
- `.opencode/skills/system-spec-kit/scripts/tests/memory-pipeline-regressions.vitest.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/fixtures/manual-playbook-fixture.ts`
- `.opencode/skills/system-spec-kit/scripts/tests/test-utils.js`
- `.opencode/skills/system-spec-kit/mcp_server/tests/embeddings.vitest.ts`
- `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/sample-memories.json`
- `.opencode/skills/system-spec-kit/mcp_server/tests/fixtures/similarity-test-cases.json`

Prompt outline:
> Regenerate feature_catalog/** and manual_testing_playbook/** entries from their canonical source (look for `feature_catalog/feature_catalog.md` aggregate generator or per-entry source). Update vitest/JS test fixtures: replace `nomic-ai/nomic-embed-text-v1.5` → `onnx-community/embeddinggemma-300m-ONNX`, `all-MiniLM-L6-v2` → `google/embeddinggemma-300m`, `384` dim assertions → `768`. Update `sample-memories.json` and `similarity-test-cases.json` fixture content + metadata.

Acceptance: Re-run `vitest` for the touched test files; all PASS. `rg 'all-MiniLM-L6-v2|nomic-ai/nomic-embed-text-v1\.5|"embeddingModel":\s*"voyage"|384[- ]?dim' .opencode/skills/` returns 0 hits in non-archive paths.

### Confirmatory re-review

After batches 1-5 land, dispatch `/spec_kit:deep-review:auto` against the same scope as packet 021 used. Target spec folder: a new sibling phase `023-post-remediation-re-review` (Level 2). Expected verdict: PASS or PASS-with-advisories (no P0/P1).

---

## 3. RM-8 / DESTRUCTIVE-SCOPE GUARD

| Layer | Status | Notes |
|-------|--------|-------|
| 1 — Prompt-pack BANNED OPERATIONS | Built into per-batch prompt | List allowed write paths; declare scope-violation-as-finding protocol |
| 2 — Worktree isolation | Optional | Each batch's diff small enough to inspect manually before next |
| 3 — Commit baseline | Captured per batch | `git rev-parse HEAD` before dispatch; commit after grep-acceptance passes |
| 4 — Model fallback | N/A | cli-codex + gpt-5.5 high fast is the chosen executor |

---

## 4. SUCCESS CRITERIA TRACEABILITY

| SC | Verification |
|----|--------------|
| SC-001 | Per-batch `git diff --stat` ≤ declared scope |
| SC-002 | `023-post-remediation-re-review/review/review-report.md` verdict ∈ {PASS, PASS-with-advisories} |
| SC-003 | Final `git status --porcelain` outside 022/023 packets matches baseline |
| SC-004 | Sum of per-batch elapsed seconds ≤ 10800s |
