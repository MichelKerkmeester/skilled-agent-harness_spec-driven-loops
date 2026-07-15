---
title: "Feature Specification: 010 Public Repo Docs Alignment"
description: "Bring public-repo documentation back into alignment with current code defaults (Qwen3-Reranker-0.6B, nomic-embed-text-v1.5, nomic-CodeRankEmbed, mcp_server feature-grouped layout) after the May 2026 retrieval-pipeline arc, the 023B Qwen3 promotion, and the post-restructure rename of benchmark-2026-05-20-expanded → benchmark-2026-05-20."
trigger_phrases:
  - "010 public repo docs alignment"
  - "docs alignment 023/010"
  - "post-arc README sweep"
  - "qwen3 nomic README alignment"
importance_tier: "important"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment"
    last_updated_at: "2026-05-20T15:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Closed P1 residual + renamed bench folder"
    next_safe_action: "Close packet"
    blockers: []
    key_files:
      - "README.md"
      - ".opencode/skills/mcp-coco-index/references/settings_reference.md"
      - ".opencode/skills/mcp-coco-index/references/tool_reference.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md"
      - ".opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20/"
    session_dedup:
      fingerprint: "sha256:010c0d0e0f1a1b1c1d1e1f2a2b2c2d2e2f3a3b3c3d3e3f4a4b4c5a5b5c5d5e5f"
      session_id: "023-deep-research-arc-blind-spots/010-public-repo-docs-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root README mk-spec-memory cascade default → nomic-embed-text-v1.5 (ADR-013/014)."
      - "Root README CocoIndex defaults → nomic-CodeRankEmbed (Stage 1) + Qwen3-Reranker-0.6B (Stage 2)."
      - "Benchmark folder convention drops '-expanded' suffix; only ISO date unless same-day disambiguation needed."
---
# Feature Specification: 010 Public Repo Docs Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | complete |
| Level | 1 (lean control file) |
| Type | docs-alignment (deep-review + remediation) |
| Owner | main agent |
| Started | 2026-05-19 |
| Closed | 2026-05-20 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

After the May 2026 retrieval-pipeline arc (013-018 + nomic promotion + 023B Qwen3 reranker promotion + the mcp_server feature-grouped restructure), public-repo documentation drifted from current code defaults. The root README still cited `jina-embeddings-v3` as the auto-cascade default for mk-spec-memory and `jinaai/jina-embeddings-v2-base-code` as the CocoIndex default; no surface mentioned `Qwen3-Reranker-0.6B` or the two-stage pipeline architecture; module paths still pointed at the pre-restructure flat layout; and several runtime docs cited mutable spec/phase packet numbers, violating the evergreen packet-ID rule.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

- Root `README.md` — embedder/reranker default callouts, db-filename examples, fallback-hint paragraphs.
- `.opencode/skills/mcp-coco-index/` — `assets/config_templates.md`, `references/*.md` (5 files), all docs under `mcp_server/benchmarks/` (3 subfolders, 12 .md files).
- `mcp_server/cocoindex_code/embedders/registered_embedders.py` + `mcp_server/tests/test_calibration_perturbation.py` — path-string updates after the benchmark folder rename.
- One bench harness script (`phase2-bench/run-expanded-bench.sh`) — live operational, not historical.

Out of scope:

- Spec-packet historical markdown — kept at old names per the evergreen rule (spec docs describe state at promotion time).
- Code logic changes — pure docs + path strings + folder rename.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

R1. Root README must cite `nomic-embed-text-v1.5` as the mk-spec-memory cascade primary (ADR-013/014), with `jina-embeddings-v3` as documented fallback.

R2. Root README must cite the two-stage CocoIndex pipeline: Stage 1 `sbert/nomic-ai/CodeRankEmbed` (MIT) + Stage 2 `Qwen/Qwen3-Reranker-0.6B` (Apache-2.0, ADR-027).

R3. Every doc under `mcp-coco-index/{references,assets}/` and `mcp_server/benchmarks/` must pass `validate_document.py` with 0 issues.

R4. Every runtime doc must be free of evergreen-rule violations: no mutable spec/phase packet number citations (`026/011`, `078/004`, `018`, `023B`, commit hashes).

R5. The benchmark folder for the 2026-05-20 Qwen3 promotion must be named `benchmark-2026-05-20` (consistent with sibling 2026-05-18, -19) and contain the full sk-doc-compliant set: `benchmark_report.md`, `SOURCE.md`, `results.csv`, `per-probe.jsonl`, raw lane JSONs, narrative sidecars.

R6. Every live runtime surface (skill code, skill docs, harness scripts, destination lane JSONs) referencing the benchmark folder must point at `benchmark-2026-05-20`; spec-packet historical markdown retains the old name as historical record.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- ✅ All 6 P1 findings from `review/review-report.md` closed.
- ✅ Both gaps the deep-review missed (mk-spec-memory cascade drift + CocoIndex Stage-2 omission) closed in root README.
- ✅ All 18 docs in `mcp-coco-index/{references,assets,mcp_server/benchmarks}/` pass `validate_document.py` with 0 issues.
- ✅ `pytest mcp_server/tests/test_calibration_perturbation.py` passes (4 tests).
- ✅ Live-surface grep for `benchmark-2026-05-20-expanded` excluding spec-packet paths returns empty.
- ✅ Live-surface grep for evergreen packet-ID violations across `mcp-coco-index/{assets,references}/` returns empty.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Stale path strings in fixture JSONs** (mitigated): the 6 destination lane JSONs reference the fixture path; updating without renaming would break replay. Mitigation = `git mv` folder + sed all path strings in one batch.
- **Spec-packet historical markdown drift** (accepted): 7 spec docs retain the old folder name. Per evergreen rule, spec docs document point-in-time state; not a defect.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

All resolved during execution. See `_memory.continuity.answered_questions` in frontmatter.
<!-- /ANCHOR:questions -->
