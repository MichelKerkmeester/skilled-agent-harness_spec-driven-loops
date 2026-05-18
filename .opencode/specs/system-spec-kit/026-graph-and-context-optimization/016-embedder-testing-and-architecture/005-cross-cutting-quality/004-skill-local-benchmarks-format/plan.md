---
title: "Plan: 016/005/004 Skill-local benchmarks/ format"
description: "Implementation plan for the skill-local benchmarks/ folder convention + first two adopter populations"
trigger_phrases: ["016/005/004 plan"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/005-cross-cutting-quality/004-skill-local-benchmarks-format"
    last_updated_at: "2026-05-18T19:35:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan to track convention + first-adopter promotion phases"
    next_safe_action: "Execute phases A-D; close out via final strict-validate + commit"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000005004"
      session_id: "016-005-004-skill-local-benchmarks-plan"
      parent_session_id: "016-005-004-skill-local-benchmarks"
    completion_pct: 75
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Plan: 016/005/004 Skill-local benchmarks/ format

<!-- ANCHOR:summary -->
## 1. SUMMARY

Ship a `mcp_server/benchmarks/` folder convention reusable across any MCP in the repo (ours + forks). Two adopters first: mk-spec-memory (May 17, 2026 text-embedder bake-off) + mcp-coco-index (May 18, 2026 code-embedder bake-off). Convention layer lives in a canonical `FORMAT.md` (symlinked across skills). Per-bench reports live in `benchmark-<YYYY-MM-DD>/` subfolders and use sk-doc-compliant `benchmark_report.md` files with a fixed 10-section structure. sk-doc skill itself gets a `references/benchmarks_format.md` + `assets/benchmark/benchmark_report_template.md` so future skill authors can adopt without reverse-engineering.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Criteria |
|---|---|
| Convention completeness | `FORMAT.md` lists 10-section structure + date convention + authority hierarchy + FAQ |
| Adopter parity | Both skills have identical folder layout (README + FORMAT + dated subfolder + benchmark_report + results.csv + SOURCE) |
| sk-doc compliance | All authored `.md` files pass `validate_document.py` with zero blocking errors |
| Cross-link integrity | Sibling cross-links resolve; SOURCE.md cites correct spec packet paths |
| Strict-validate | Returns PASSED for the sub-phase folder |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

```
mcp_server/benchmarks/
├── README.md                                  ← Index of all benchmarks here
├── FORMAT.md                                  ← Single source; symlinked across skills
└── benchmark-<YYYY-MM-DD>/                    ← Dated subfolder per bench run
    ├── benchmark_report.md                    ← 10-section sk-doc-compliant report
    ├── results.csv                            ← Aggregate per-candidate metrics
    ├── per-probe.jsonl                        ← Per-query rows (when applicable)
    ├── runtime-measurements.md                ← Optional RAM/GPU/latency profile
    └── SOURCE.md                              ← Wayfinding pointer to spec packet
```

sk-doc additions (cross-cutting):
- `sk-doc/references/benchmarks_format.md` — the reference doc skill authors consult
- `sk-doc/assets/benchmark/benchmark_report_template.md` — fillable scaffold
- `sk-doc/SKILL.md` — INTENT_SIGNALS + RESOURCE_MAP entries so the advisor surfaces these resources on benchmark-related intents
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A — Convention layer (DONE)
- Author canonical `FORMAT.md` in `system-spec-kit/mcp_server/benchmarks/`
- Symlink into `mcp-coco-index/mcp_server/benchmarks/FORMAT.md` (relative path)

### Phase B — Evidence promotion (DONE)
- Create `benchmark-2026-05-17/` for mk-spec-memory (CSV, JSONL, runtime-measurements, SOURCE)
- Create `benchmark-2026-05-18/` for mcp-coco-index (CSV, JSONL, SOURCE; no runtime-measurements)

### Phase C — sk-doc-routed report writing (DONE)
- Parallel `@markdown` agents write `benchmark_report.md` + top-level `README.md` per skill
- Each runs `validate_document.py` post-write

### Phase D — sk-doc resources + cross-skill polish (DONE)
- Write `sk-doc/references/benchmarks_format.md`
- Write `sk-doc/assets/benchmark/benchmark_report_template.md`
- Update `sk-doc/SKILL.md` INTENT_SIGNALS + RESOURCE_MAP
- Improve SOURCE.md + runtime-measurements.md + FORMAT.md per sk-doc

### Phase E — Validation + commit (IN PROGRESS)
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-packet> --strict`
- Strict-scope commit (one commit per logical batch)
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What it verifies |
|---|---|
| `validate_document.py` per file | sk-doc compliance (anchors, frontmatter, heading hierarchy) |
| `validate.sh --strict` on packet | spec-folder convention compliance |
| Symlink resolution check | FORMAT.md symlink in mcp-coco-index points to live system-spec-kit copy |
| Manual cross-link inspection | Sibling cross-links between two skills' benchmark folders resolve |
| `readlink` exit 0 | Symlink not broken |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source spec packets: `016/002/004-spec-memory-embedder-bake-off/` + `016/004/004-extended-bake-off/`
- sk-doc skill: SKILL.md, scripts/validate_document.py, existing reference + asset patterns
- `@markdown` agent (loads sk-doc on dispatch)
- 013 → 007 renumber happened upstream during this work; all path refs use `007/...`
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This is a docs-only sub-phase. Rollback = `git revert` the commit. The source spec packets are untouched and remain authoritative; reverting only removes the skill-local entry points.

If FORMAT.md needs to evolve, edit the canonical file in `system-spec-kit/mcp_server/benchmarks/`; the symlink in `mcp-coco-index/...` follows automatically.
<!-- /ANCHOR:rollback -->
