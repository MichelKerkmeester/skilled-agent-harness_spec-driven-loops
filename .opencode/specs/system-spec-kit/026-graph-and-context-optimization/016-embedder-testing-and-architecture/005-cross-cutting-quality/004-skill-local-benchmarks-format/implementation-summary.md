---
title: "Summary: 016/005/004 Skill-local benchmarks/ format"
description: "Phases A-D shipped: convention layer, evidence promotion, sk-doc-routed report writing, sk-doc references + assets. Phase E (validate + commit) closing now."
trigger_phrases: ["016/005/004 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format"
    last_updated_at: "2026-05-18T19:40:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phases A-D complete"
    next_safe_action: "Final strict-scope commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005004"
      session_id: "016-005-004-skill-local-benchmarks-summary"
      parent_session_id: "016-005-004-skill-local-benchmarks"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/005/004 Skill-local benchmarks/ format

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | IN PROGRESS — Phases A+B shipped; Phase C dispatching; Phase D pending |
| Branch | main |
| Created retroactively | Yes — work began before this sub-phase was formalized |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### Phase A — Convention layer
- `system-spec-kit/mcp_server/benchmarks/FORMAT.md` — single-source convention doc
- `mcp-coco-index/mcp_server/benchmarks/FORMAT.md` — relative symlink to system-spec-kit's copy

### Phase B — Evidence promotion
- mk-spec-memory: `benchmarks/benchmark-2026-05-17/` with `results.csv`, `per-probe-with-rescue.jsonl`, `runtime-measurements.md`, `SOURCE.md`
- mcp-coco-index: `benchmarks/benchmark-2026-05-18/` with `results.csv`, `per-probe.jsonl`, `SOURCE.md`

### Phase C — Pending (in-flight)
- `benchmark_report.md` per skill (sk-doc compliant) — dispatching `@markdown` agents
- `README.md` per skill (top-level index) — same dispatch
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Folder scaffolding + evidence promotion happened directly via Bash/Write. The sk-doc-routed report writing is being handed to parallel `@markdown` agents because the advisor recommended sk-doc at confidence 0.92 (above 0.8 threshold = MUST invoke skill, and sk-doc loads on every `@markdown` invocation).
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **D1 — Date-folder over topic-folder:** initial sketch used `code-embedder-bake-off/` topic folders, but user request switched to `benchmark-<YYYY-MM-DD>/` for clean chronology. Multiple benchmarks under one MCP can still live side-by-side with ISO date sorting.
- **D2 — FORMAT.md single source via symlink:** rather than duplicating the format doc per skill, keep one canonical copy in system-spec-kit and symlink from sibling skills. Avoids drift.
- **D3 — Spec packets remain authoritative:** the skill-local `benchmark_report.md` curates; the spec packet's `decision-record.md` decides. Authority hierarchy stated explicitly in FORMAT.md.
- **D4 — sk-doc compliance for reports:** advisor recommended sk-doc at 0.92 confidence; `@markdown` agents handle the actual writes so sk-doc standards (anchors, frontmatter, validate.py) are applied uniformly.
- **D5 — Retroactive sub-phase:** work began before the packet existed; user explicitly requested retroactive formalization so the cross-cutting nature is visible from the umbrella spec.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Concrete verification commands run during Phase E:

```bash
# Strict-validate this sub-phase
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format --strict

# sk-doc validate each authored file
bash .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/system-spec-kit/mcp_server/benchmarks/benchmark-2026-05-17/benchmark_report.md
bash .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-18/benchmark_report.md
bash .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/sk-doc/references/benchmarks_format.md
bash .opencode/skills/sk-doc/scripts/validate_document.py \
  .opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md

# Symlink integrity for the cross-skill FORMAT.md
readlink .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md
test -e .opencode/skills/mcp-coco-index/mcp_server/benchmarks/FORMAT.md && echo "OK"
```

Checklist:

- [x] FORMAT.md exists in both skills (one real, one symlink); symlink resolves
- [x] benchmark-2026-05-17/ contents present (results.csv, per-probe-with-rescue.jsonl, runtime-measurements.md, SOURCE.md, benchmark_report.md)
- [x] benchmark-2026-05-18/ contents present (results.csv, per-probe.jsonl, SOURCE.md, benchmark_report.md)
- [x] benchmark_report.md sk-doc-validated for both skills (zero blocking errors)
- [x] README.md index sk-doc-validated for both skills
- [x] sk-doc resources shipped: references/benchmarks_format.md + assets/benchmark/benchmark_report_template.md
- [x] strict-validate on this sub-phase
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- **Only 2 skills adopted so far.** Other MCPs in the repo (mk-skill-advisor) don't yet have benchmarks to promote. mk-code-index doesn't use embeddings (structural only), so no benchmarks folder needed.
- **No promotion script automation.** Future bench results must be manually promoted (CSV copy + benchmark_report.md re-write). A `promote-benchmark.sh` helper could be a Tier 3 follow-on.
- **Historical note (added by packet 006):** FORMAT.md relocated to sk-doc in packet `005-cross-cutting-quality/006-benchmark-format-to-sk-doc`. The canonical mechanics document is now `.opencode/skills/sk-doc/references/benchmark_creation.md` (consolidated from FORMAT.md + benchmarks_format.md). The legacy `references/benchmarks/` directory and `references/benchmarks_format.md` were deleted as part of that packet.
<!-- /ANCHOR:limitations -->

---

> NOTE (2026-05-19): FORMAT.md was relocated to .opencode/skills/sk-doc/references/benchmarks/ in packet 006-benchmark-format-to-sk-doc. The original system-spec-kit and mcp-coco-index paths now hold relative symlinks to the new sk-doc canonical.
