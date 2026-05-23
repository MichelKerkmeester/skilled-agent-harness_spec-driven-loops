---
title: "Summary: 016/004/012 Fixture Audit (Probe 10 First)"
description: "Implementation summary placeholder; updated during/after research execution"
trigger_phrases: ["016/004/012 summary"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes"
    last_updated_at: "2026-05-18T20:42:02Z"
    last_updated_by: "main_agent"
    recent_action: "Completed fixture audit"
    next_safe_action: "Main agent commit handoff"
    blockers: []
    key_files:
      - "research.md"
      - "evidence/code-retrieval-fixture-proposed.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000004012"
      session_id: "016-004-012-summary"
      parent_session_id: "016-004-012"
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Summary: 016/004/012 Fixture Audit (Probe 10 First)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | COMPLETE (research audit executed; commit deferred to main agent) |
| Branch | main |
| Verdict counts | KEEP 16 / CHANGE 1 / AMBIGUOUS 1 |
| Recommendation | Update probe 10 expected path to tracked TypeScript source; defer probe 18 clarification |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

Produced a full 18-probe expected-source-path audit in `research.md`, prioritizing probe 10 and universal-ceiling probes 1, 6, 11, 12, and 15. The audit found one source-path change: probe 10 should point at `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` instead of generated dist output at `.opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js`.

Created `evidence/code-retrieval-fixture-proposed.json` as a non-destructive proposed fixture copy. The original fixture was not overwritten.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

Read the baseline fixture, the May 18 margin analysis, each expected source file, and targeted alternatives found via `rg`. The final verdicts are documented in `research.md` §2-3, and the proposed fixture diff changes only probe 10's `expected_source_path`.

No `SpawnAgent`, no `ccc`, no git commit, and no writes outside this spec folder.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **CHANGE probe 10**: The TypeScript source is the right benchmark target because it owns structured JSON parsing, `runWorkflow()` dispatch, and graph metadata refresh logic. The dist JavaScript artifact is generated runtime output and encourages source-vs-generated path-class bias.
- **KEEP universal-ceiling probes 1, 6, 11, 12, 15**: each expected path remains the implementation source after reading alternatives. Their May 18 misses are better explained by lexical-density, mirrors, tests, or docs outranking implementation, not by clearly wrong expected paths.
- **AMBIGUOUS probe 18**: the current path tests MCP refresh/search split, while `.opencode/skills/mcp-coco-index/tests/test_e2e.py` is closer to incremental indexing. Neither proves "only changed files" accounting, so changing the path without clarifying the query would move the ambiguity instead of fixing it.
- **Side finding**: probes 7 and 14 have stale `expected_symbol` values (`executeStage2Fusion`, `StructuralIndexer`) even though their source paths are still correct. This audit did not change symbols because the requested scope was `expected_source_path`.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Concrete verification commands when executed:

```bash
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes --strict
```

Checklist (filled during/after execution):

- [x] `research.md` exists with all 18 verdicts and a recommendation.
- [x] `evidence/code-retrieval-fixture-proposed.json` exists with the probe 10 proposed path change.
- [x] Strict validation passed on this packet: `RESULT: PASSED`, 0 errors, 0 warnings.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

Research-only packet. The proposed fixture is evidence only; applying it to the canonical baseline fixture should be done by the main agent in a follow-on commit or direct fixture update.

Probe 18 remains clarification-needed because the query currently conflates MCP refresh/search split with incremental changed-file reprocessing.

## Commit Handoff

Paths touched in this packet:

- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/research.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/evidence/code-retrieval-fixture-proposed.json`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/tasks.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/004-code-index-stack/012-fixture-audit-10-probes/implementation-summary.md`
<!-- /ANCHOR:limitations -->
