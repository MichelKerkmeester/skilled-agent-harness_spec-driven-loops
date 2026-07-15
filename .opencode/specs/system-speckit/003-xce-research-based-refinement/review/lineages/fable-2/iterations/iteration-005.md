# Iteration 005 — Stabilization Replay (all dimensions)

Session: `fanout-fable-2-1781112180955-4japyt` | Dimensions: correctness, security, traceability, maintainability | Status: complete

## Scope Reviewed

Adversarial replay of all 8 active findings against live file state, with special attention to the concurrent-session watch item (phases 012–015). Every cited line re-read.

## Replay Results

### Concurrent-session churn materially changed two cited surfaces mid-review

Between iteration 1 (17:42 UTC inventory) and this pass, a concurrent session updated the parent: the spec.md phase map NOW lists 011 (Planned) and new rows 012–015 (Spec-scaffolded) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:140-144], a new amendment bullet documents phases 012–015 ownership [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:161], and `graph-metadata.json` `children_ids` now reaches 015 [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:18-22].

### F001 — REFINED, still active (P1): description.json is now the lone lagging inventory surface

The original three-surface disagreement is partially healed (spec.md map and graph-metadata now agree, 000–015), but the parent `description.json` `children` array STILL stops at `010-mcp-to-cli-tool-transition` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/description.json:28-38] — now lagging the 16 on-disk children by five (011–015, count verified by directory listing). Memory-search/graph consumers of description.json see an inventory 5 children short. Severity unchanged: P1.

### F002 — HOLDS (P1)

Map rows for 002/008/009 still read "Spec-scaffolded" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:131,137-138] vs child statuses Complete [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/spec.md:60; 008-openltm-retrieval-observability/spec.md:45; 009-openltm-continuity-resilience/spec.md:45]. The "All three programs are scaffolded and planned, not implemented" narrative persists (now at line 146) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:146]. Even the NEW 012–015 rows introduce vocabulary drift ("Spec-scaffolded" vs the children's own "Planned" [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-causal-traversal-bfs/spec.md:49]) — noted as refinement evidence, not a new finding.

### F003–F008 — ALL HOLD

- F003 (P2): 002 `description.json` still `"status": "spec-scaffolded"` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-write-safety/description.json:13].
- F004 (P2): dispatch artifacts and `.gitignore` rules unchanged (stable surfaces).
- F005 (P1): resource-map still frozen at 2026-06-04 with the stale "last active child is `002-memory-write-safety`" claim [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/resource-map.md:74] vs `"last_active_child_id": null` (line shifted 236→240 by the concurrent edit) [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/graph-metadata.json:240]; the coverage gap now spans phases 002–015.
- F006 (P2): context-index stale current-folder column unchanged [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/context-index.md:35-39].
- F007 (P2): continuity block untouched by the concurrent map update — `completion_pct: 0` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:44], stale `next_safe_action` [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/spec.md:27] — now MORE inconsistent relative to the refreshed map.
- F008 (P2): changelog index claims unchanged [SOURCE: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/changelog/README.md:14,20].

## Coverage Confirmation

All four dimensions covered (iters 1–4) plus this stabilization pass. Core protocols: `spec_code` partial (F001/F002 persist), `checklist_evidence` pass. Overlays: `feature_catalog_code` partial (F005), `playbook_capability` n/a. Resource-map coverage gate executed (iteration 3). No new findings this pass; newFindingsRatio 0.05.

## Adversarial Self-Check

No P0 at any point; no downgrades required. Considered closing F001 after the concurrent fix: rejected — the description.json surface remains factually wrong right now, and the mid-review fix actually demonstrates the failure mode (partial multi-surface updates) the finding warns about.

Review verdict: CONDITIONAL
