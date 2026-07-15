---
title: "Tasks: 010 Public Repo Docs Alignment"
description: "Task tracking for the 010 docs-alignment closure. Phase 1 = cli-devin 10-iter deep review (review-report.md). Phase 2 = remediation across 6 commits."
trigger_phrases:
  - "010 tasks"
  - "docs alignment tasks"
importance_tier: "important"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/010-public-repo-docs-alignment"
    last_updated_at: "2026-05-20T15:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "All tasks complete"
    next_safe_action: "Close packet"
    blockers: []
    completion_pct: 100
---
# Tasks: 010 Public Repo Docs Alignment

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` = complete with evidence (commit hash cited).
- `[ ]` = open.
- P1 = blocking; P2 = follow-up; INFO = nice-to-have.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] T1.1 — Scaffold packet folder + dispatch cli-devin SWE-1.6 with 10-iter sweep contract.
- [x] T1.2 — Capture iteration evidence under `review/iterations/iteration-{001..009}.md`.
- [x] T1.3 — Synthesize `review/review-report.md` with 7 P1 findings + 2 P2/INFO follow-ups.
- [x] T1.4 — Emit sentinel `DOCS_SWEEP_010_COMPLETE iter=10 verdict=6_P1_REMAINING`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] T2.1 — Close 6 of 7 P1s via cli-codex docs-alignment sweep — `048435d63`.
- [x] T2.2 — Close residual root README gap that cli-devin marked `✅ Clean` but missed (mk-spec-memory ADR-013/014 cascade drift + CocoIndex Stage-2 Qwen3 omission, 8 stale spots across lines 122, 134, 174-177, 566, 895, 1346, 1352, 1355, 1380) — `6466bed56`.
- [x] T2.3 — Sk-doc-align mcp-coco-index references/+assets/ (6 H2 renumberings + 5 packet-ID corrections + tool_reference.md Pipeline architecture restructure) — `7df22f054`.
- [x] T2.4 — Fill benchmark-2026-05-20-expanded gap (3→15 files: 6 lane JSONs + results.csv + per-probe.jsonl + 4 sk-doc-aligned narrative sidecars + canonical SOURCE.md) + fix 2 pre-existing validator failures in 18/19 benchmark folders — `8ecdca818`.
- [x] T2.5 — Rename benchmark-2026-05-20-expanded → benchmark-2026-05-20 — `b4cdebb4f`.
- [x] T2.6 — Update 11 path-string references across same-skill runtime surfaces + 6 destination lane JSONs + harness script — `f35e59505`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] T3.1 — Create canonical spec.md/plan.md/tasks.md/implementation-summary.md for the packet (post-hoc; deep-review-only packets sometimes ship without these).
- [x] T3.2 — Set `graph-metadata.json.derived.status` = complete, `completion_pct` = 100.
- [x] T3.3 — Update parent 023 `graph-metadata.json.derived.last_active_child_id` → this packet.
- [x] T3.4 — Strict-validate the packet (Level 1, all required files present + frontmatter + anchors).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

All 14 tasks complete. Packet shipped via 5 commits in main; 6th commit (`048435d63`) was the cli-codex parallel sweep prior to this main-agent session.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- Predecessor: `023/007-fixture-calibration/` (produces the lane JSONs + sidecars this packet promotes forward).
- ADRs cited: ADR-013, ADR-014 (nomic cascade promotion), ADR-027 (Qwen3 reranker promotion).
- Sibling docs aligned by this work: mk-spec-memory references in root README; CocoIndex defaults across `mcp-coco-index/` skill surfaces.
<!-- /ANCHOR:cross-refs -->
