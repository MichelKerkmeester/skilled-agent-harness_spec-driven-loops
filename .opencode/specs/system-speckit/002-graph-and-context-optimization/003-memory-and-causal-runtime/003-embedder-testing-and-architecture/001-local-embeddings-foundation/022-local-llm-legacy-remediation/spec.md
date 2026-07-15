---
title: "Feature Specification: Local-LLM legacy remediation (post-021 review)"
description: "Remediation packet executing 5 batched fixes for the residue surfaced by sibling packet 021's deep-review. User clarified Q1=A (auto-cascade Voyage→OpenAI→llama-cpp→hf-local is the intended ship state, so 014/017's narrative is wrong) and Q2=yes (Voyage auto-pick on key is intentional). This packet (a) corrects 014/017 narrative, (b) purges old model-name defaults (Nomic, MiniLM, 384d → EmbeddingGemma 768d), (c) replaces hardcoded context-index.sqlite paths, (d) purges rejected-ONNX residue, (e) regenerates feature catalogs/playbooks/test fixtures."
trigger_phrases:
  - "local-llm legacy remediation"
  - "022 remediation"
  - "post-021 fixes"
  - "014/017 narrative correction"
importance_tier: "important"
contextType: "remediation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/022-local-llm-legacy-remediation"
    last_updated_at: "2026-05-13T14:30:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffolded L2 remediation packet; 5 batches defined; awaiting dispatch"
    next_safe_action: "Dispatch batch 1 (014/017 narrative correction) via cli-codex gpt-5.5 high fast"
    blockers: []
    key_files:
      - "../021-local-llm-legacy-review/review/review-report.md"
      - "../017-llama-cpp-default-flip/implementation-summary.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/factory.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-022-local-llm-legacy-remediation"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions:
      - "Q1: Is factory.ts auto-llama-cpp the intended ship state? → A=YES; 014/017 narrative is what's wrong, not the code."
      - "Q2: Is Voyage auto-pick on VOYAGE_API_KEY intentional? → YES; entire Voyage→OpenAI→llama-cpp→hf-local cascade is intentional."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Local-LLM legacy remediation (post-021 review)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-05-13 |
| **Branch** | `main` |
| **Parent packet** | `002-graph-and-context-optimization/014-local-embeddings-setup-a` |
| **Depends on** | `021-local-llm-legacy-review` (findings source) |
| **Recovery anchor** | `5e7095d3336510b5756ba5cac383a8e08d1d79db` (from 021 review run) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Sibling packet 021 produced a 10-iter `/deep:start-review-loop:auto` finding tray with verdict FAIL; hasAdvisories=true (P0=2 P1=83 P2=31). The user clarified after the run that the 2 P0s and ~25 of the P1s actually describe **intended behavior** that 014's narrative misrepresented, not real bugs. The remaining ~90 findings ARE legitimate residue: stale model identifiers, stale dimension references, hardcoded legacy sqlite paths, rejected-ONNX cleanup, and generated assets that haven't been regenerated since the actual ship state landed.

### Purpose
Bring the repo's docs, configs, scripts, fixtures, and generated assets into alignment with the **actual** post-014 ship state — which is `EMBEDDINGS_PROVIDER=auto` cascading through `VOYAGE_API_KEY → OPENAI_API_KEY → llama-cpp (when GGUF installed) → hf-local` with EmbeddingGemma-300m 768d as the canonical local profile.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (5 batches)

| Batch | Group | Approx findings | Brief |
|------:|-------|----------------:|-------|
| 1 | 014/017 narrative correction | 4-6 | Update `017-llama-cpp-default-flip/implementation-summary.md` to say "llama-cpp auto-selected when GGUF installed; cascade Voyage→OpenAI→llama-cpp→hf-local" (replacing the "llama-cpp explicit opt-in" wording). Cross-check 014 parent spec.md, handover.md, SETUP_A_RECIPE.md for the same phrasing |
| 2 | Old model-name defaults purge | ~30 | `nomic-ai/nomic-embed-text-v1.5` → `onnx-community/embeddinggemma-300m-ONNX`; `all-MiniLM-L6-v2` → `google/embeddinggemma-300m`; `384` dims → `768` dims; remove model identifiers that aren't the active default |
| 3 | Hardcoded sqlite paths | ~15 | Replace literal `context-index.sqlite` and `context-index__voyage__voyage-4__1024.sqlite` paths in 7 eval/checkpoint/cleanup/setup scripts with active-profile resolution (or accept `--db` override) |
| 4 | ONNX backend cleanup | ~5 | Remove `onnxruntime-node` and `onnxruntime-common` from package.json dependencies (both spec-kit and mcp_server); remove ONNX probe from `check-native-modules.sh`; update `hf-local.ts:309` recovery hint to drop the `npm rebuild onnxruntime-node` line |
| 5 | Generated-asset regeneration | ~30 P2 | After batches 1-4 land, regenerate `feature_catalog/**` aggregates and `manual_testing_playbook/**` entries; update vitest fixtures asserting old model names |

### Withdrawn from review findings (per user Q1=A, Q2=yes — not residue)
- Both P0s in `factory.ts:819-823` (llama-cpp auto-select is INTENDED)
- 5 P1s in `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `.mcp.json`, `opencode.json` (config notes correctly describe the cascade)
- ~10-15 P1s describing the cascade order Voyage → OpenAI → llama-cpp → hf-local across docs (correct precedence)
- ~5 P1s with "Voyage recommended" wording (intentional with Q2=yes)

### Out of Scope
- Any changes to `factory.ts` provider-resolution logic (the code is correct per Q1=A)
- Any changes to the cascade order itself (correct per Q2=yes)
- Code-graph or memory-index data row updates (those are derived data, not source)

### Files to Change

| Batch | Representative File Paths |
|------:|--------------------------|
| 1 | `../017-llama-cpp-default-flip/implementation-summary.md`, parent `spec.md`, `handover.md`, `SETUP_A_RECIPE.md` |
| 2 | `.opencode/skills/system-spec-kit/{shared/embeddings.ts, shared/README.md, mcp_server/ENV_REFERENCE.md, references/memory/embedding_resilience.md, README.md}`, `.opencode/skills/mcp-coco-index/{README.md,INSTALL_GUIDE.md,SKILL.md,references/settings_reference.md,assets/config_templates.md}`, `.opencode/install_guides/README.md`, root `README.md` |
| 3 | `.opencode/skills/system-spec-kit/{mcp_server/lib/eval/memory-state-baseline.ts, scripts/evals/{map-ground-truth-ids,run-ablation,run-bm25-baseline}.ts, scripts/memory/cleanup-index-scope-violations.ts, mcp_server/scripts/migrations/{create,restore}-checkpoint.ts, shared/embeddings/profile.ts, scripts/setup/install.sh}` |
| 4 | `.opencode/skills/system-spec-kit/{package.json, mcp_server/package.json, scripts/setup/check-native-modules.sh, shared/embeddings/providers/hf-local.ts}` |
| 5 | `.opencode/skills/mcp-coco-index/{feature_catalog/**, manual_testing_playbook/**, tests/test_config.py, tests/test_settings.py}`, `.opencode/skills/system-spec-kit/{feature_catalog/**, manual_testing_playbook/**, scripts/tests/{test-embeddings-behavioral.js, test-embeddings-factory.js, memory-pipeline-regressions.vitest.ts, fixtures/manual-playbook-fixture.ts, test-utils.js}, mcp_server/tests/{embeddings.vitest.ts, fixtures/{sample-memories,similarity-test-cases}.json}}` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 batches executed read-write within their declared file scope | `git diff` after each batch shows mutations ONLY in files listed for that batch |
| REQ-002 | Batch 1 narrative correction is consistent across all four 014 control files | `grep -ri "llama-cpp explicit opt-in\|hf-local restored as automatic default" 014/{spec.md,handover.md,SETUP_A_RECIPE.md,017-llama-cpp-default-flip/}` returns zero matches post-batch-1 |
| REQ-003 | Old model-name strings fully purged from active defaults | `rg -l 'all-MiniLM-L6-v2.*default\|nomic-ai/nomic-embed-text-v1.5.*Default'` returns zero hits in non-archive paths |
| REQ-004 | No hardcoded `context-index.sqlite` literals remain in scripts/code | `rg '"context-index\.sqlite"' .opencode/skills/system-spec-kit/{scripts,mcp_server,shared}` returns zero hits |
| REQ-005 | ONNX runtime dependencies removed | `grep -E 'onnxruntime-node\|onnxruntime-common' .opencode/skills/system-spec-kit/{package.json,mcp_server/package.json}` returns zero hits |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Feature catalogs + playbooks regenerated post-batches-1-4 | Re-run the catalog-regen pipeline; diff shows EmbeddingGemma 768d as default, no MiniLM/Nomic strings remain |
| REQ-007 | Vitest fixtures asserting old model names updated | All test assertions on `MODEL_NAME` / `embeddingModel` reference `onnx-community/embeddinggemma-300m-ONNX` or `google/embeddinggemma-300m` |
| REQ-008 | Confirmatory re-review post-batch-5 | Run `/deep:start-review-loop:auto` with same scope as 021; verdict flips FAIL → PASS |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 batches landed; per-batch git diff confined to declared file scope
- **SC-002**: Confirmatory `/deep:start-review-loop:auto` re-run produces verdict PASS (or PASS-with-advisories, no P0/P1)
- **SC-003**: Zero out-of-scope mutations vs recovery anchor `5e7095d3336510b5756ba5cac383a8e08d1d79db`
- **SC-004**: Total walltime ≤ 3h (5 batches × ~30 min cli-codex dispatch each)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex availability | Batch dispatch fails | Codex 0.130.0 confirmed available |
| Risk | Batch 5 (regeneration) overwrites correct user edits | Lost work | Regenerate via deterministic pipeline only; never hand-edit a regenerated file |
| Risk | Stale Voyage/OpenAI model identifiers (e.g., `voyage-3.5` vs current `voyage-4`) | Findings list misclassified | Verify current Voyage/OpenAI default model names before batch 2; if a name is genuinely current, leave it |
| Risk | RM-8 destructive-scope violation | Files mutated outside batch | Use cli-codex `workspace-write` sandbox + per-batch prompt-pack constraints (013/003 precedent) |
| Risk | Re-review surfaces new P0/P1 categories | Pass blocked | Iterate: scope a sub-phase 023 for any genuinely-new finding category |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Each batch completes within 1800s codex timeout per dispatch
- **NFR-P02**: Total walltime ≤ 3h end-to-end (5 batches + re-review)

### Security
- **NFR-S01**: cli-codex sandbox `workspace-write` is the ceiling; no `--dangerously-skip-permissions`
- **NFR-S02**: No secrets/credentials read or surfaced in batch outputs

### Reliability
- **NFR-R01**: Each batch produces a verifiable diff + grep-based acceptance check before next batch starts
- **NFR-R02**: Recovery anchor SHA is captured before batch 1 dispatch
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A finding's file no longer exists at quoted path: skip with a note in the batch report
- A finding's quoted line content has drifted: redo the grep, fix the current content
- A batch produces zero diff: mark the batch as no-op-needed and continue

### Error Scenarios
- cli-codex timeout: retry batch with smaller scope or split into sub-batches
- Pre-commit hook fails after batch: fix the issue and create a NEW commit (never amend)
- Grep acceptance check fails: re-dispatch with explicit "fix these remaining lines" prompt

### State Transitions
- Mid-batch interruption: each batch is atomic — re-run from scratch on next dispatch
- Re-review FAIL after all 5 batches: scope a follow-on 023 packet for the new category
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 17/25 | ~85 active findings across code/docs/configs/scripts/assets; 5 batched surface families |
| Risk | 11/25 | Read-write; RM-8 layers in place; cli-codex sandbox bound; 013/003 precedent proven |
| Research | 6/20 | Findings list is authoritative source (021 review); judgment limited to confirming Voyage/OpenAI current default model names |
| **Total** | **34/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- Are `voyage-3.5` and `voyage-4` both current valid Voyage default model identifiers, or is one obsolete?
- After batch 1 narrative correction, should 017's status field be updated from "complete" to "narrative-corrected"?
<!-- /ANCHOR:questions -->
