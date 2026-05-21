DEEP-REVIEW

# Deep-Review Iteration 1 — Inventory Pass

## STATE

STATE SUMMARY (auto-generated):
Iteration: 1 of 20
Dimension: inventory_pass
Prior Findings: P0=0 P1=0 P2=0
Dimension Coverage: [] (0/4)
Traceability: core=pending overlay=pending
Resource Map Coverage: resource-map.md not present; skipping coverage gate.
Coverage Age: 0
Last 2 ratios: N/A -> N/A
Stuck count: 0
Provisional Verdict: PENDING hasAdvisories=false

Review Iteration: 1 of 20
Mode: review
Dimension: inventory_pass (will queue correctness → security → traceability → maintainability from iter 2)
Review Target: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar
Prior Findings: P0=0 P1=0 P2=0

## CONTEXT (read these before reviewing)

Scope: packet `006-cocoindex-dedup-from-shared-sidecar` PROMOTE shipment plus the `system-rerank-sidecar` feature catalog + manual testing playbook docs (commit `131838c96`).

Two commits shipped in this session:

1. `c0941055f` feat(016/008/006): cocoindex dedup via shared sidecar — PROMOTE
   - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py` — added `HttpSidecarRerankerAdapter` class + updated `get_reranker_adapter()` dispatch
   - `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/config/config.py` — added `COCOINDEX_RERANK_VIA_SIDECAR` env var (default `True` after PROMOTE)
   - `.opencode/skills/mcp-coco-index/mcp_server/tests/test_http_sidecar_adapter.py` — 9 new tests
   - `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-cocoindex-via-sidecar/` — `run_ab.py`, `benchmark_report.md`, fixture JSONs, `runs/` outputs
   - `.opencode/skills/mcp-coco-index/SKILL.md` + `INSTALL_GUIDE.md` — updated
   - Packet 006 spec docs created
   - Arc 008 parent re-opened then re-closed

2. `131838c96` docs(system-rerank-sidecar): feature catalog + manual testing playbook
   - `.opencode/skills/system-rerank-sidecar/feature_catalog/feature_catalog.md`
   - `.opencode/skills/system-rerank-sidecar/manual_testing_playbook/manual_testing_playbook.md`

## SHARED DOCTRINE

Load `.opencode/skills/sk-code-review/references/review_core.md` before final severity calls.

## REVIEW DIMENSIONS

correctness, security, traceability, maintainability

## TRACEABILITY PROTOCOLS

- **Core**: spec_code, checklist_evidence
- **Overlay**: skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability

## QUALITY GATES

evidence, scope, coverage

## VERDICTS

`FAIL | CONDITIONAL | PASS` — PASS may set `hasAdvisories=true` when only P2 remain.

## CLAIM ADJUDICATION

Every new P0/P1 must include: claim, evidenceRefs, counterevidenceSought, alternativeExplanation, finalSeverity, confidence, and downgradeTrigger.

## STATE FILES (paths relative to repo root)

- Config: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-config.json
- State Log: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-state.jsonl
- Findings Registry: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-findings-registry.json
- Strategy: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deep-review-strategy.md
- Iteration narrative: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/iterations/iteration-001.md
- Iteration delta: .opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/006-cocoindex-dedup-from-shared-sidecar/review/deltas/iter-001.jsonl

## CONSTRAINTS

- You are a LEAF agent. Do NOT dispatch sub-agents.
- Target 12 tool calls. Soft max 18, hard max 24.
- Write ALL findings to files. Do not hold in context.
- Review target is READ-ONLY. Do not modify reviewed files.
- Do not implement fixes during review. Report findings only.
- **ALLOWED WRITE PATHS (the ONLY paths you may create/modify)**:
  - `<review-packet>/iterations/iteration-001.md`
  - `<review-packet>/deltas/iter-001.jsonl`
  - `<review-packet>/deep-review-state.jsonl` (append-only)
  - `<review-packet>/deep-review-strategy.md` (in-place)
  - `<review-packet>/deep-review-findings-registry.json` (in-place)
- **BANNED**: `rm`, `mv`, `sed -i`, `git ...`, any modification to reviewed source/tests/docs/specs.
- Reading is unrestricted; writing is scoped.
- This is the INVENTORY PASS — focus on building an artifact map. Light findings only.

## ASSIGNED FOCUS (this iteration)

INVENTORY PASS. Do all of the following:

1. Read all 13 review-scope files listed in `deep-review-config.json` (or the strategy's "FILES UNDER REVIEW" table). Note file sizes, structure, and key entry points.
2. Map cross-references: which spec REQ-IDs land on which code lines; which feature_catalog sections map to which scripts/lib code; which playbook RS-NNN scenarios map to which test/command capabilities.
3. Estimate per-file review complexity (rough P0-risk surface): which files are the highest-risk targets for correctness/security?
4. Validate the dimension queue: correctness → security → traceability → maintainability is the right order given the artifact map. If anything in the scope strongly suggests reordering, say so in the iteration narrative.
5. Flag any first-pass red flags (light findings only — P2 or "PENDING-VERIFY") so iteration 2 has anchor points. Do NOT inflate findings to look productive.

## OUTPUT CONTRACT

Produce THREE artifacts. (The orchestrator validates each — missing/malformed = iteration error.)

1. **Iteration narrative** at `<review-packet>/iterations/iteration-001.md`. Structure with headings: Dimension Focus, Files Reviewed, Findings by Severity (P0/P1/P2), Traceability Checks, Verdict, Next Dimension. End with exactly: `Review verdict: PENDING` (inventory pass — no verdict yet).

2. **Canonical JSONL iteration record** APPENDED to `<review-packet>/deep-review-state.jsonl` with `"type":"iteration"` exactly. Schema:

```json
{"type":"iteration","iteration":1,"mode":"review","run":"run-001","status":"complete","focus":"inventory_pass","dimensions":["inventory"],"filesReviewed":["path:line", ...],"findingsCount":<n>,"findingsSummary":{"P0":0,"P1":0,"P2":<n>},"findingsNew":[],"findingDetails":[...],"traceabilityChecks":{"summary":{"required":6,"executed":0,"pass":0,"partial":0,"fail":0,"blocked":0,"notApplicable":0,"gatingFailures":0},"results":[]},"newFindingsRatio":0.0,"sessionId":"2026-05-20T20:30:00Z","generation":1,"lineageMode":"new","timestamp":"<ISO-8601>","durationMs":<n>,"graphEvents":[]}
```

Append on its own newline (no pretty-print). Use the actual file paths and timestamps.

3. **Per-iteration delta file** at `<review-packet>/deltas/iter-001.jsonl`. Must contain at least one `{"type":"iteration",...}` record (same shape as the state-log record). Additional `{"type":"finding",...}`, `{"type":"classification",...}`, `{"type":"ruled_out",...}` records may follow, one per line.

After the iteration completes:
- Update `<review-packet>/deep-review-strategy.md`: §12 NEXT FOCUS with the next dimension (correctness); §13 KNOWN CONTEXT with any new inventory insights; §15 FILES UNDER REVIEW per-file status; §14 CROSS-REFERENCE STATUS as artifact map findings dictate.
- Update `<review-packet>/deep-review-findings-registry.json`: refresh `findingsBySeverity`, `openFindingsCount`, `dimensionCoverage` (inventory not in queue, leave the 4 false).

## STOP CRITERIA FOR THIS ITERATION

Stop when artifact map is complete and outputs are written. This is inventory only; defer deep findings to subsequent iterations.

Final line of iteration-001.md MUST be exactly: `Review verdict: PENDING`
