---
title: "Implementation Summary: 010 Public Repo Docs Alignment"
description: "Closed docs-alignment residual after the cli-devin 10-iter deep review. 5 main-agent commits across root README, mcp-coco-index references/+assets/+benchmarks/, plus folder rename benchmark-2026-05-20-expanded → benchmark-2026-05-20."
trigger_phrases:
  - "010 implementation summary"
  - "docs alignment closure"
  - "post-arc docs sweep summary"
importance_tier: "important"
contextType: "implementation-summary"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment"
    last_updated_at: "2026-05-20T15:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Packet shipped"
    next_safe_action: "None"
    blockers: []
    completion_pct: 100
---
# Implementation Summary: 010 Public Repo Docs Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Packet | 023/010-public-repo-docs-alignment |
| Status | complete |
| Closed | 2026-05-20 |
| Commits | `048435d63` (cli-codex parallel sweep) + `6466bed56`, `7df22f054`, `8ecdca818`, `b4cdebb4f`, `f35e59505` (main agent) |
| Verification | All 18 docs validate clean; 4 pytest tests pass; live-surface grep returns empty |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Two-phase closure of the docs-alignment scope:

- **Phase 1 (deep review)**: cli-devin SWE-1.6 ran a 10-iteration sweep across every README, INSTALL_GUIDE, SKILL.md, AGENTS.md, feature_catalog, reference doc, and manual_testing_playbook in the public repo. Output = `review/review-report.md` + 9 iteration files + sentinel `DOCS_SWEEP_010_COMPLETE iter=10 verdict=6_P1_REMAINING`. Verdict: high-level docs clean, but 7 P1s in technical implementation docs (1 closed during review, 6 remaining).

- **Phase 2 (remediation, 6 commits)**:
  - `048435d63` — cli-codex parallel sweep closed the 6 remaining P1s from the cli-devin report.
  - `6466bed56` — Closed the residual gap cli-devin marked `✅ Clean on defaults` but missed: 8 stale spots across the root README spanning both mk-spec-memory cascade drift (ADR-013/014: jina-embeddings-v3 → nomic-embed-text-v1.5 as primary, jina-v3 as documented fallback) and the CocoIndex Stage-2 omission (added Qwen3-Reranker-0.6B + two-stage pipeline narrative).
  - `7df22f054` — Sk-doc-aligned mcp-coco-index/{references,assets}/ surfaces: 6 H2 renumberings to fix duplicate `## 1.` headers, 5 evergreen packet-ID violations replaced with feature names + source anchors, tool_reference.md `## Pipeline architecture` block moved from intro region to numbered Section 2 PIPELINE ARCHITECTURE.
  - `8ecdca818` — Filled benchmark-2026-05-20-expanded from 3→15 files: 6 lane-reranker JSONs (direct copies of 023/007 evidence), synthesized results.csv (6 rows: lane × run) + per-probe.jsonl (438 rows: probe × lane × run), 4 narrative sidecars wrapped with sk-doc-compliant frontmatter+TOC+OVERVIEW (expanded-calibration-summary, residual-miss-taxonomy, robust-verdict-gates, calibration-recommendation), canonical 6-section SOURCE.md. Also fixed 2 pre-existing validator failures (benchmark-2026-05-19/SOURCE.md missing TOC+OVERVIEW; benchmark-2026-05-18/risk-analysis missing OVERVIEW).
  - `b4cdebb4f` — Renamed benchmark-2026-05-20-expanded → benchmark-2026-05-20 (15 file `git mv`s).
  - `f35e59505` — Updated 11 path-string references (4 same-skill runtime surfaces + 6 destination lane JSON fixture paths + 1 harness script).
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Sequencing was driven by the user-visible blast radius of each commit:

1. Deep review first to surface the unknown unknowns (cli-devin sweep).
2. Parallel cli-codex remediation to close the explicit P1s.
3. Main agent closes the residual the sweep marked clean but missed (root README), since cli-devin's `✅ Clean on defaults` verdict in iter-001 had only checked CocoIndex Qwen3/nomic and missed both mk-spec-memory cascade drift and Stage-2 omission.
4. Once root surface stable, extend scope to mcp-coco-index/{references,assets,benchmarks}/ — these were not part of the cli-devin sweep but had structural sk-doc drift (H2 numbering, evergreen-rule violations, benchmark folder gaps).
5. Folder rename last, as a clean cap, so the path-string sweep operates against a stable set.

Validation gates between each step: `validate_document.py` on every doc, `pytest test_calibration_perturbation.py` after the rename, live-surface grep before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **D1**: Treat the cli-devin sweep verdict as "good enough" rather than gold-standard. The sweep marked root README clean but had only verified two of the three default surfaces; main agent re-verified manually and caught 8 stale spots.
- **D2**: Drop the `-expanded` suffix from the May 20 benchmark folder. Rationale: sibling folders use plain ISO date; the "expanded" qualifier refers to fixture composition (18→73 probes) which is already encoded in the fixture filename + the SOURCE.md narrative.
- **D3**: Retain old folder name in 7 spec-packet historical markdown files. Per the evergreen rule, spec docs document state at promotion time; the path-history is intentional historical record.
- **D4**: Rewrite the 4 narrative sidecars (copied from 023/007 evidence) with sk-doc-compliant scaffolding instead of dropping them. User said "we need them here" (at destination), so dropping was not an option.
- **D5**: Sk-doc compliance bar = `validate_document.py` output, not the looser informal template-reading. The validator caught H2 numbering warnings, missing TOC, and missing OVERVIEW that prose-only reading would have skipped.
- **D6**: Keep the harness script filename `run-expanded-bench.sh` even after the folder rename. "Expanded" in the script name refers to fixture composition (18→73 probes), not the bench folder.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## 5. VERIFICATION

- `python3 .opencode/skills/sk-doc/scripts/validate_document.py` against every doc in `mcp-coco-index/{references,assets}/` (6 docs) and `mcp_server/benchmarks/` (12 docs): all 18 pass with 0 issues.
- `pytest mcp_server/tests/test_calibration_perturbation.py`: 4 passed.
- Live-surface grep `benchmark-2026-05-20-expanded` excluding spec-packet paths: empty.
- Live-surface grep for evergreen-rule violations across `mcp-coco-index/{assets,references}/`: empty.
- Sentinel from review-report.md: `DOCS_SWEEP_010_COMPLETE iter=10 verdict=6_P1_REMAINING` → after remediation: verdict = `0_P1_REMAINING`.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- 7 spec-packet historical markdown files retain the old `benchmark-2026-05-20-expanded` path string. This is intentional (evergreen rule exempts spec docs), but a reader scanning grep results without context may flag these as drift. Mitigation = SOURCE.md and this implementation-summary both document the convention.
- The 2 P2/INFO follow-ups from the cli-devin report are not closed by this packet (mk-spec-memory embedder cross-check + cocoindex_code module path grep re-run with longer timeout). They are explicitly low-priority and out of this packet's scope.
- No code logic was touched; this packet exclusively addresses docs surface. Code/test correctness was outside scope.
<!-- /ANCHOR:limitations -->
