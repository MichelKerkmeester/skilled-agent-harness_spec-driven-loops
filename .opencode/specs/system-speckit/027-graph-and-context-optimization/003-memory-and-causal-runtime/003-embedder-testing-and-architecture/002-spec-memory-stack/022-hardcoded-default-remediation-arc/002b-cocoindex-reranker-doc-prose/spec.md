---
title: "Spec: 022/002b CocoIndex Reranker Doc Prose Resync"
description: "Reranker-side doc-drift corrections deferred from phase 002. Updates BAAI/bge-reranker-v2-m3 → Qwen/Qwen3-Reranker-0.6B (023B follow-on canonical) across 3 doc files with verified Qwen3 disk footprint (1.1 GB) AND corrects stale daemon-log observability claims (the daemon does not emit positive load-trace lines on successful CrossEncoder init — verified by 0 hits in 509KB daemon.log)."
trigger_phrases:
  - "022/002b reranker doc resync"
  - "Qwen3-Reranker doc prose"
  - "daemon-log silent-success correction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose"
    last_updated_at: "2026-05-23T17:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 002b shipped — 4 P0 reranker doc-prose corrections + daemon-log observability rewrite"
    next_safe_action: "Move to phase 003 (codex agents mirror investigation already complete)"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md"
      - ".opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022d1"
      session_id: "016-002-022-002b"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Qwen3-Reranker-0.6B disk footprint verified at 1.1 GB (HF cache /Users/michelkerkmeester/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B)"
      - "Daemon-log model-load identifier: DOES NOT EXIST. Verified 0 hits for 'rerank|BAAI|Qwen|jina|CrossEncoder' across 509KB daemon.log. Original doc prose claiming 'daemon log shows X load activity' was wishful even for the BGE default. Corrected prose: silent success is the daemon-log signal; warnings only appear on failure paths via logger.warning() in reranker.py."
      - "Council-recommended phase ordering followed: 002b → 003 → 004 → 005 → 007 → 006 → 008 → 009 → 010"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/002b CocoIndex Reranker Doc Prose Resync

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | Doc-only resync (reranker side; deferred from phase 002) |
| Owner | main_agent direct (no executor dispatch) |
| Parent | `../spec.md` (022-hardcoded-default-remediation-arc) |
| Sibling | `../002-cocoindex-embedder-doc-drift-resync/` (shipped); upstream of phase 003 |
| Council recommendation | First-in-order per `<parent>/ai-council/executor-instructions.md` |
| Estimated wall-clock | 30–60 min (actual ~30 min including daemon-log discovery + prose rewrite) |
| Risk class | LOW (docs-only, no code path) |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

3 CocoIndex doc files cite `BAAI/bge-reranker-v2-m3` as the default reranker. Actual default since the 023B follow-on is `Qwen/Qwen3-Reranker-0.6B` (verified at `registered_embedders.py:256`).

Additionally, ALL three docs cite "daemon.log shows BAAI/bge-reranker-v2-m3 cross-encoder load activity" as a positive observability signal. **This claim was never accurate** — verified by grepping the 509KB live `~/.cocoindex_code/daemon.log` for `rerank|BAAI|Qwen|jina|CrossEncoder` and getting 0 hits. The CocoIndex daemon does NOT emit a positive load-trace line on successful CrossEncoder init; only `logger.warning()` calls in `reranker.py` produce output (and only on failure paths). The original prose was wishful even for the prior BGE default.

Per packet 021 audit findings:
- f-iter006-002, f-iter006-003, f-iter006-004 (3 P0 doc-drift reranker name + size + log)
- 1 additional P0 surfaced during phase 002b (daemon-log false-claim across 3 files)

Purpose: bring reranker doc prose into both (a) name+size alignment with current 023B canonical AND (b) factual alignment with actual daemon-log behavior (silent-success on load; warnings only on failure).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- `manual_testing_playbook/03--configuration/007-reranker-opt-in.md` (121 lines): comprehensive rewrite of model name + size + daemon-log observability semantics across Description, Scenario Contract, Test Execution, Pass/Fail, Failure Triage, and Source Files sections.
- `manual_testing_playbook/manual_testing_playbook.md:402,407`: 3 prose sites updated (Description, Scenario Contract Prompt summary, Expected signals).
- `mcp_server/benchmarks/README.md:202`: Skill internals line (reranker.py default callout).

### Out of Scope

- Source code changes (no `config.py` / `reranker.py` / `registered_embedders.py` edits; the actual default was already correctly set to Qwen3 in 023B).
- Pinning examples that intentionally cite different models (e.g., `Alibaba-NLP/gte-multilingual-reranker-base` for override-path testing) — these are deliberate non-default examples.
- Historical changelog entries (`INSTALL_GUIDE.md:1091` v1.2.1 line) — those preserve audit-trail.
- Benchmark report content under `benchmark-2026-05-18/` and `benchmark-2026-05-19/` — historical artifacts, immutable.

### Why Split From Phase 002

Phase 002 originally bundled embedder + reranker doc drift. During phase 002 execution, the reranker prose surfaced as cascade-complex: model-name swap requires footprint correction (~2.3 GB → ~1.1 GB) AND daemon-log claim correction (silent-success reality vs. wishful prose). Phase 002 shipped the unambiguous embedder side; 002b was tracked for the cascade-complex reranker side once verification (Qwen3 footprint + daemon-log identifier) completed.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | All 3 doc files cite `Qwen/Qwen3-Reranker-0.6B` as the default model name | `rg "Qwen/Qwen3-Reranker-0.6B" <3 files>` → ≥3 hits, ≥1 per file |
| R2 | All 3 doc files reflect the ~1.1 GB Qwen3-0.6B disk footprint (the ~2.3 GB BGE figure persists only as historical/fallback context) | `rg "1\.1 GB" <3 files>` → ≥1 hit; remaining "2.3 GB" hits limited to historical/fallback context lines |
| R3 | Daemon-log observability claims accurately describe silent-success on load (NO positive trace line) with warnings ONLY on failure paths | Manual prose review of 007 §1 + §2 + §3 step 6 + §3 Expected step 6 + §3 Pass/Fail + §3 Failure Triage item 1 |
| R4 | BGE entry remains visible as opt-in fallback / historical reference (not removed) | `rg "BAAI/bge-reranker-v2-m3" <3 files>` returns ≥1 hit in historical/fallback context only |
| R5 | Strict-validate this phase → exit 0 | `bash validate.sh 002b-cocoindex-reranker-doc-prose --strict` |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- R1–R5 verifications all pass.
- 4 P0 audit-flagged reranker doc-drift sites closed.
- Daemon-log false-claim cleaned up — no future operator will follow the docs into expecting a load-trace line that doesn't exist.
- BGE references preserved as historical/fallback context (no audit-trail loss).
- Parent arc graph-metadata.json `children_ids` extended with `002b-cocoindex-reranker-doc-prose`.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

Main-agent direct Edit. No executor dispatch (3 file edits across 8-10 prose sites; below cli-X dispatch overhead threshold once daemon-log discovery resolved scope).

Pre-edit verification:
1. Read `registered_embedders.py:256` to confirm `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` — VERIFIED.
2. Measure Qwen3 disk footprint at `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` — VERIFIED 1.1 GB.
3. Grep daemon.log for model-load identifiers — DISCOVERED that the daemon emits NO positive load-trace line; original doc prose was wishful for ANY reranker.

Edits applied via Edit tool: 8 distinct prose sites in 007 (frontmatter description, §1 Overview, §2 Scenario Contract Objective + Prompt + Expected execution + Expected signals + Pass/Fail, §3 Test Execution steps 3-6 + Expected steps 4-6 + Evidence + Pass/Fail + Failure Triage items 1-4 + Source Files cache line), 1 site in manual_testing_playbook.md (CFG-007 row), 1 site in benchmarks/README.md (Skill internals reranker.py callout).
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Daemon-log prose rewrite changes the pass/fail criteria too aggressively | Preserved warn-on-fallback as a fail signal (the daemon DOES emit warnings on failure paths). Only changed the positive-trace claim. Pass criterion still requires non-null `pre_rerank_score`/`reranker_score` populated. |
| Operators following prior doc version expect a load-trace line and report false-negatives | Explicit "silent success is normal" language added throughout 007. |
| `BAAI` references removed where they should remain as historical/fallback context | Verified: 2 BGE references remain in 007, both in historical/fallback context (size comparison + cached-fallback table row). |
| Memory entry `project_2026_05_19_cocoindex_arc_shipped.md` still says jina-reranker-v3 | Already updated earlier in session with 023B Qwen3-0.6B promotion note. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS

- None. Daemon-log behavior verified empirically (0 hits in live log); future reranker swaps inherit the silent-success prose convention.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Parent arc: `../spec.md`
- Predecessor: `../002-cocoindex-embedder-doc-drift-resync/` (embedder side; this phase closes the reranker side)
- Council brief: `../ai-council/convergence-report.md` + `../ai-council/executor-instructions.md` (recommended 002b first-in-order)
- Audit findings: `../../021-hardcoded-default-audit-deep-research/research/research.md` f-iter006-002..005
- Reranker source: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` (CrossEncoder init silent on success; logger.warning only on failure)
- Canonical promotion: `registered_embedders.py:256` `DEFAULT_RERANKER_NAME = "Qwen/Qwen3-Reranker-0.6B"` (023B follow-on)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

- No code path affected; behavior unchanged.
- No new dependencies.
- Documentation must remain operator-readable; daemon-log "silent success is normal" language must be explicit enough to avoid confusion.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- BGE size reference (~2.3 GB) preserved as historical context AND as the fallback model row size — both are legitimate uses; ban-list grep limited to non-historical contexts.
- Step 6 grep command changed from `grep -Ei "rerank|bge|crossencoder"` to `grep -Ei "warn|error|fallback|fail"` — the new grep matches actual daemon log behavior (warnings only).
- 023B follow-on terminology used consistently to avoid implying it's a packet identifier (it's a benchmark-driven default promotion).
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2 documentation rewrite. 3 files modified, ~10 prose sites, 0 lines of code changed. Above pure-mechanical edit threshold due to daemon-log semantic correction but below cli-X dispatch ROI since each site was verified independently before editing.
<!-- /ANCHOR:complexity -->
