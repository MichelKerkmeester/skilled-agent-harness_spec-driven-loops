## Focus

Iteration 1 audited arc `008-rerank-sidecar-arc`, with emphasis on phase `006-cocoindex-dedup-from-shared-sidecar`, phase `007-spec-memory-mps-rerank-promotion`, and commit `9349f5f4a` (`feat(rerank-sidecar): multi-model serving + per-consumer model selection`). The pass treated the current working tree as evidence, but flagged uncommitted/source-drift cases as `SUSPECTED` where the shipped commit and current files diverged.

## Actions Taken

1. Ran skill routing and loaded `deep-research/SKILL.md`; confirmed this is a leaf iteration with required markdown + JSONL artifacts and no sub-dispatch.
2. Listed all arc 008 phase docs and ran the requested grep probes for sidecar ensure helpers, frozen hashes, rerank env vars, dataclasses, commit history, and `9349f5f4a`.
3. Read arc parent `spec.md`, phase 006/007 `spec.md`, `tasks.md`, and `implementation-summary.md` to compare REQ/SC/D-NNN claims against code.
4. Inspected `9349f5f4a` Python/TS diffs for `/rerank` model-field wiring and sidecar multi-model behavior.
5. Read current reranker code: `reranker.py`, `config.py`, `cli.py`, `ensure_rerank_sidecar.py`, `rerank_sidecar.py`, `start.sh`, `cross-encoder.ts`, and `search-flags.ts`.
6. Checked benchmark artifacts for `benchmark-2026-05-21-spec-memory-mps`; found fixture + two run files, but no `benchmark_report.md`.
7. Checked git status for touched source/docs; phase 007 docs and the MPS benchmark folder are untracked, and `cross-encoder.ts` has an uncommitted model flip.
8. Compared `cross-encoder.ts` at `9349f5f4a^`, `9349f5f4a`, and the current worktree to isolate the current Qwen flip from the multi-model commit.
9. Verified the phase 006 default-dispatch remediation is present in current code: `_rerank_via_sidecar_enabled()` defaults true and `_ensure_rerank_sidecar_for_mcp()` passes `skip_if_disabled=False`.
10. Wrote this iteration narrative, appended the canonical state record, and created the per-iteration delta file.

## Findings

| Finding ID | Category | File:line + grep evidence | Recommended action |
|---|---|---|---|
| f-iter001-001 | MISSED | `.opencode/specs/.../008-rerank-sidecar-arc/007-spec-memory-mps-rerank-promotion/spec.md:36-37` says arc 008 is reopened and now has phase 007, but parent `.opencode/specs/.../008-rerank-sidecar-arc/graph-metadata.json:6-13` lists children only through 006 and `.opencode/specs/.../008-rerank-sidecar-arc/graph-metadata.json:53-55` still points `last_active_child_id` at 006. Parent `spec.md:55-62` also has no row 007. | Register phase 007 in the parent phase map and graph metadata, or change 007's docs to say it is not yet attached to the arc. |
| f-iter001-002 | UNSHIPPED | Phase 007 requires preserved bench evidence at `.opencode/specs/.../007-spec-memory-mps-rerank-promotion/spec.md:117-119`, and tasks `T013`, `T018`, `T019` remain open at `tasks.md:60,73-75`. Actual artifact probe found only `rerank-ab-fixture.json`, `runs/arm-a-off.jsonl`, and `runs/arm-b-mps.jsonl`; `benchmark_report.md` is absent. | Finish the MPS benchmark closeout report and strict validation before treating 007 as evidence-bearing. |
| f-iter001-003 | BUGGED | Phase 007 says the model flip is PROMOTE-only at `spec.md:86-93` and requires default flip + validation at `spec.md:110`; current worktree has only `cross-encoder.ts:54` changed from `cross-encoder/ms-marco-MiniLM-L-6-v2` to `Qwen/Qwen3-Reranker-0.6B` (`git diff`), while `implementation-summary.md:23,43-45` is still pre-implementation and `search-flags.ts` has no diff. Confidence: SUSPECTED because the source delta is uncommitted. | Either complete the PROMOTE path with report, default gate, rebuild, validation, and docs, or remove/park the model flip until evidence exists. |
| f-iter001-004 | BUGGED | Commit `9349f5f4a` claims spec-memory can request `cross-encoder/ms-marco-MiniLM-L-6-v2` while cocoindex requests Qwen, but sidecar default allowlist is only `{DEFAULT_MODEL_NAME}` at `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py:40-43`, rejects non-allowlisted models at `rerank_sidecar.py:93-103`, and `start.sh:39-43` only passes `RERANK_ALLOWED_MODELS` if the operator already set it. In the committed state, `cross-encoder.ts:54` is ms-marco (`git show 9349f5f4a:.../cross-encoder.ts`). Confidence: SUSPECTED because the current worktree flips that line to Qwen. | Make launcher/default env include both consumer models, or document that multi-model spec-memory requires `RERANK_ALLOWED_MODELS=Qwen/...,cross-encoder/ms-marco...`. |
| f-iter001-005 | BUGGED | Sidecar invariant says model loading must pin `revision=<sha>` at `.opencode/skills/system-rerank-sidecar/SKILL.md:239`; multi-model code only pins `DEFAULT_MODEL_NAME` at `rerank_sidecar.py:45-49` and passes a revision only when `MODEL_REVISIONS.get(model_name)` exists at `rerank_sidecar.py:85-87`. Non-default allowlisted models therefore load from local cache without a pinned revision. | Require `RERANK_MODEL_REVISIONS` entries for every non-default allowlisted model, or explicitly narrow the invariant to the default Qwen model. |
| f-iter001-006 | BUGGED | Docs still show the old `/health` response shape: `.opencode/skills/system-rerank-sidecar/SKILL.md:90-93` and `.opencode/skills/system-rerank-sidecar/README.md:70` omit `default_model`, `allowed_models`, and `loaded_models`, while current code returns those fields at `rerank_sidecar.py:144-151`. | Update SKILL.md and README examples to the v0.2.0 health contract. |
| f-iter001-007 | MISSED | Phase 006 limitation tracks follow-on packet `007-cocoindex-rerank-baseline-drift` at `.opencode/specs/.../006-cocoindex-dedup-from-shared-sidecar/implementation-summary.md:155-157`; the actual phase 007 is `spec-memory MPS rerank promotion` at `007-spec-memory-mps-rerank-promotion/spec.md:2,36-37`. No `007-cocoindex-rerank-baseline-drift` packet exists in the arc child list. | Create the baseline-drift follow-on under a non-conflicting phase number, or update phase 006 to point at the actual tracking location. |
| f-iter001-008 | UNSHIPPED | Phase 006 tasks are checked complete while evidence cells still say `(pending)`: examples include `tasks.md:40-41`, `tasks.md:55`, and `tasks.md:72-75`. This conflicts with the packet's own completion criterion at `tasks.md:87-92` requiring all tasks complete with evidence. | Backfill exact command/file evidence into phase 006 `tasks.md`, or move the evidence references to implementation-summary and cross-link them explicitly. |

## Questions Answered

Partial answers for Q1-Q6 (UNSHIPPED): phase 006 runtime remediation exists, but phase 006 task evidence is incomplete and phase 007 is not closeout-complete.  
Partial answers for Q13-Q19 (BUGGED): the prior 006 default-dispatch bug is fixed in current code, but commit `9349f5f4a` introduces allowlist/revision edge cases for non-default models.  
Partial answers for Q20-Q24 (MISSED): the requested cpu/MPS follow-on exists as phase 007, but parent metadata does not register it, and a separate baseline-drift follow-on promised by phase 006 is missing.

## Questions Remaining

Q1-Q24 remain open for the umbrella. This pass did not audit arcs 001-007 outside the sampled arc 008 surface, did not inspect dead code/caller counts broadly, and did not validate every historical benchmark recommendation.

## Next Focus

Iteration 2 should pivot from arc 008 parent/007 hygiene into `008/001-005` and the spec-memory side of the launcher/rerank stack: verify the phase 001 flag-routing fix against `search-flags.ts`, `cross-encoder.ts`, `local-reranker.ts`, and dist outputs, then confirm whether the phase 004/005 HOLD docs still match the current default behavior.
