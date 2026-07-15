---
title: "Tasks: create-benchmark completeness remediation"
description: "Task ledger mapping every verified P1/P2 finding from the Fable 5 + Sol Ultra dual review to a scoped, behavior-preserving fix, plus the Sol Ultra re-review gate."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task ledger from dual-review findings"
    next_safe_action: "Execute T003 (router fix)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: create-benchmark completeness remediation

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its severity, target file(s), and the fix, grounded in the dual-review evidence under `evidence/`. Findings are hypotheses until confirmed against the real file at edit time.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Fold the remediation into packet 066 as this child; author spec, plan, tasks, checklist; generate metadata.
- [x] T002 — Archive the two dual-review reports verbatim under `evidence/` as the finding source of truth.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**P1 (functional + authoring blockers)**

- [ ] T003 (P1) — **Router fallback + family keying.** `create-benchmark/SKILL.md`: repoint `DEFAULT_RESOURCE` from non-existent `references/README.md` to `references/shared/README.md`; add a family-to-disk-key map so `mcp_promotion` loads `assets/shared/`. Confirmed by both reviewers (SKILL.md:113).
- [ ] T004 (P1) — **Behavior schema-v2 scaffold.** Extend `assets/behavior_benchmark/behavior_benchmark_scenario_template.md` with the v2 fields (schema_version, topology, postconditions, direct-dispatch expected/forbidden targets, boundary); make `behavior_benchmark_index_template.md` schemaVersion wording conditional; update `references/behavior_benchmark/behavior_benchmark_guide.md` §3 for the fixed DAB prefix and alignment framing.
- [ ] T005 (P1) — **Conformance exemplar completion.** Author `deep-alignment/assets/conformance_benchmark/command-surface/` family README + `conformance_benchmark.md` from the shipped templates; correct the "planned adapter" wording in the conformance authoring guide §8.

**P2 (create-benchmark-local)**

- [ ] T006 (P2) — **Command-benchmark first-classing.** Add a matrix-manifest field guide/section (schemaVersion, bounds.scenarioIds, driverLegs, samples, requiredCellCount, fanoutGap); add a composition entry + `command benchmark` routing keys and an unknown-fallback line in `SKILL.md`.
- [ ] T007 (P2) — **Route-map refresh.** `references/shared/README.md`: add the conformance and Lane A families (currently omits them).
- [ ] T008 (P2) — **Phantom Lane D + guide wording.** `references/model_benchmark/model_benchmark_fixture_guide.md`: remove the "Lane A/D" phantom; reconcile the fixed-seed/scorer sentence with the profile template.
- [ ] T009 (P2) — **Deep-command links.** Make `/deep:command-benchmark` a real link in the behavior/conformance guides; fix the Lane A guide's mis-targeted `/deep:agent-improvement` link; add the direct `/deep:model-benchmark` link.
- [ ] T010 (P2) — **Lane C fixture-authoring link.** Link `scenario_authoring.md` from SKILL §10 / the storage guide; note the `create-manual-testing-playbook` corpus handoff.

**P2 (cross-tree exemplar sweep — full-sweep, hyphen-pilot-aware)**

- [ ] T011 (P2) — **MCP consumer README + template href.** `system-spec-kit/mcp_server/benchmarks/README.md`: repoint the stale "Section 6" reference to create-benchmark SKILL §4–§6; fix the obsolete validator path to `sk-doc/shared/scripts/`. Fix `assets/shared/benchmark_report_template.md` index href `../../README.md` → `../README.md`. Label non-promoted MCP folders legacy.
- [ ] T012 (P2) — **Lane C exemplar READMEs.** `system-deep-loop/benchmark/README.md`: add missing run-label rows. `sk-code/benchmark/README.md`: align hyphen/underscore toward the hyphen-naming pilot (NEVER revert hyphens to snake_case); label the legacy sidecars. `deep-improvement/benchmark/`: add the missing README index.
- [ ] T013 (P2) — **Behavior-index back-pointers.** Add a create-benchmark back-pointer to the `deep-research`, `deep-review`, `deep-ai-council`, and `deep-improvement` behavior_benchmark.md indexes.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 (P1) — **GPT-5.6 Sol Ultra Fast re-review.** Re-dispatch the completeness review against the patched tree; confirm no surviving P1 and no new regression. Capture the report under `evidence/`.
- [ ] T015 (P1) — **Validate + ship.** `validate_document.py` on every edited doc; `validate.sh --strict` on this child Errors:0; pathspec-scoped commits + FF-push to `skilled/v4.0.0.0`; reconcile completion metadata.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All P1/P2 findings closed or explicitly labeled legacy, both review reports archived under `evidence/`, the Sol Ultra re-review clean of surviving P1, and strict validation green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Evidence: `evidence/review-sol-ultra.md`, `evidence/review-fable.md`. Related closeout: `../010-scorecard-and-closeout/`.
<!-- /ANCHOR:cross-refs -->
