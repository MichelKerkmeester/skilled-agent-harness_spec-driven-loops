# Iteration 002 — Docs band deep: decisions, research recs, defect-fix

- **Focus (shared):** 001 research deliverables, 008 implementation-summary, high-signal decision-records (003/004/007)
- **Seat:** `mimo` — 109s, exit 0, ~$0.058, 23 findings
- **Known-context suppression worked:** all 23 findings NEW (firstIteration=2); no overlap with iter-1.

## Merged findings
Cumulative: **47 findings, 46 agreement-eligible**, 0 contradictions. This pass is convention-heavy (ADRs/recommendations a planner must honor):

- **conventions / ADRs (27 total now)** — ranked research recommendations (R1 honest-measurement-first, R10 trust-axis-separation replacing structural-bundle); ADR-014 local-first embedder cascade; daemon RC-1..RC-4 root-cause roadmap (RSS→OOM, no auto-restart, dead-socket reconnect, build-wipes-live-dist); WAL checkpoint-on-close; non-destructive build; manifest-driven template levels.
- **gaps** — 008 dual-writer-hazard revert (bridge inert until 028 IPC transport); open research questions (warm-start bundle promotion; auditor-vs-discoverer contract).
- **dependencies (3)** — research baselines (001) gate memory/runtime (003); code-graph stability (004) gates adoption uplift (005); advisor evidence (002) feeds affordance display.

## Coverage / convergence
- sliceCoverage(graph) = 0.55 (unchanged — iter 2 deepens already-covered docs slices; no new frontier slices).
- agreementRate=1.0, contradictions=0, seatValidationWarnings=0.
- graph decision: STOP_BLOCKED (code band still uncovered — expected).
- host saturation: newInfoRatio 23/23 = 1.00 ≫ 0.10 → **CONTINUE**.

## Next focus
Iter 3 — Code band: code-graph MCP (`system-code-graph/mcp_server`) + memory continuity runtime (`mcp_server/lib/memory`) + embedder runtime (`mcp_server/lib/embedders`, `shared/embeddings.ts`). Surface reuse_candidates, integration_points, conventions, dependencies with real code symbols.
