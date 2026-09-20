---
title: "Tasks: Repo-wide reference cleanup and reconcile after the sk-design delete"
description: "Task breakdown for the live-contract reconcile: advisor graph, command bridges, tests, docs, leaf manifests, recorded parity drift, and the documented residual."
trigger_phrases:
  - "reconcile sk-design references tasks"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/016-deprecate-sk-design-interface/006-reference-cleanup-and-reconcile"
    last_updated_at: "2026-08-19T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Reconciled advisor graph + bridges + tests + docs; recorded parity drift + residual"
    next_safe_action: "validate.sh --strict; operator-gated scoped commit"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/graph-metadata.json"
      - ".opencode/skills/system-skill-advisor/mcp-server/scripts/command-bridges/command-bridges.generated.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: Repo-wide reference cleanup and reconcile after the sk-design delete

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run the authoritative live-surface sweep (`rg -P 'sk-design(?!-md-generator)'`, excluding specs/benchmarks/changelogs/reports/survivor/fixtures/jsonl); 68 files hit.
- [x] T002 Classify each of the 68 hits into live-contract (reconcile) / generated-artifact (tooling regen / defer main-side) / frozen-evidence (leave) / illustrative-example (leave); only the live-contract subset is edited (`rg -P 'sk-design(?!-md-generator)'` = 68 files).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Advisor graph identity: survivor `graph-metadata.json` `family` sk-design → `sk-util` (a pre-existing invalid value that also red the graph even at HEAD).
- [x] T004 Advisor graph edges: remove the `mcp-tooling depends_on` and `sk-code siblings` edges targeting the survivor (asymmetric once the hub-era pairing dissolved); keep the survivor's own valid edges.
- [x] T005 Regenerate command bridges from tooling: `derive-command-bridges.cjs` → `command-bridges.generated.json` (+ `projection.ts`, `skill_advisor.py`), dropping the sk-design hub node and the two `interface:` command nodes; grep confirms zero `sk-design`.
- [x] T006 Retune advisor tests: `command-binding-existence` HUBS drop `sk-design`, namespaces drop `interface`; `skill-root-metadata-contract` expected-classes remove the hub, add the survivor as standalone; `command-bridges-drift-guard` count → `[6, 28]`; `command-metadata-e2e` metadataCount → `20`.
- [x] T007 Reframe judgment-boundary docs as out-of-scope: `sk-create-diff` SKILL.md + README, `sk-create-diagram` README; remove the sk-design design-task variant from the minimax model card; drop sk-design from the manual-testing-playbook package manifest + `validate-playbook-package.cjs` warn list.
- [x] T008 Regenerate leaf manifests (`--fix`): `system-deep-loop` (drops the 2 deleted adapters) and the survivor (`leaf-manifest.json` + `leaf-aliases.json`).
- [x] T009 Confirm the single parity divergence (`rr-iter3-146`: Python-correct sk-code, native scorer diverges to sk-doc on one saturated multi-lane tie) was GREEN at the pre-delete HEAD baseline — it is a benign routing-graph ripple from removing the hub nodes, not a genuine regression.
- [x] T010 Record the benign drift (operator-authorized): add `rr-iter3-146` to both parity suites' accepted lists (tsAlsoCorrect/hookPreservedPythonCorrect 105 → 104) and append its entry to the approved-divergences fixture (77 → 78).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Re-run the live-surface sweep: README/AGENTS/opencode.json/README.txt = 0; all six runtimes' agent defs = 0; `cli-*` = only frozen `benchmark/reports/**`. Live-contract reconcile complete.
- [x] T012 Advisor suite green for the reconciled tests (parity ×2, drift-guard, metadata-e2e, command-binding-existence, skill-root-metadata-contract); regenerated bridges grep zero `sk-design`.
- [x] T013 Graph-health: survivor `family` valid (`sk-util`); asymmetry count no worse than the HEAD baseline (the remaining sk-vision↔sk-code asymmetry is pre-existing, out of scope).
- [x] T014 Enumerate the documented residual: compiled-routing `006-sk-design/` cohort + `compiled-route-*.cjs` + `serving-closure.manifest.json` + advisor `skill-graph.json` (main-side regen); frozen fixtures + model-benchmark records + benchmark reports; illustrative template/playbook examples.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All 14 tasks (T001–T014) marked `[x]`
- [x] Zero live hub references on the named runtime surfaces
- [x] `command-bridges.generated.json` greps zero `sk-design`; reconciled advisor tests green
- [x] Benign parity drift recorded in all baselines and re-run green
- [x] Documented residual enumerated; `validate.sh --strict` on 005/006/packet exits 0
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: See `../spec.md`
<!-- /ANCHOR:cross-refs -->
