# Deep Research Synthesis: GPT Fan-Out Lineage

## Verdict

The packet is not ready to be treated as cleanly complete. It contains real shipped work, especially `008/007-fan-out-hardening`, but the evidence surfaces are out of sync: parent maps, continuity blocks, scaffold docs, review registries, graph metadata, ADR/checklist artifacts, and workflow YAML still contradict completion claims.

## Stop Report

- Stop reason: `converged`
- Iterations completed: 11
- Last three `newInfoRatio` values: `0.0, 0.0, 0.0`
- Convergence threshold: `0.01`
- Source diversity: packet docs, implementation summaries, tasks, graph metadata, review reports, review registries, workflow YAML, runtime code, tests, and validation scripts.

## Priority Recommendations

1. Run a packet-wide completion reconciliation before any more feature work. Update top-level and phase-parent maps, stale `completion_pct: 0` continuity, scaffold plan/tasks/summary docs, and `graph-metadata.json` in one controlled pass. Evidence: phase maps and scaffold docs in iterations 001, 002, 005, and 008.

2. Remove all workflow YAML ephemeral finding markers. Confirmed live markers: `deep_review_auto.yaml:395`, `deep_review_auto.yaml:408`, `deep_review_auto.yaml:988`, `deep_research_auto.yaml:301`, `deep_research_auto.yaml:319`, and `deep_research_auto.yaml:1099`. Evidence: iterations 004 and 008.

3. Fix deep-research fan-out threshold threading. `deep_research_auto.yaml` must pass `--convergence-threshold {convergence_threshold}` and likely `--stop-policy {stop_policy}` into `fanout-run.cjs`, matching review fan-out. Add a regression proving `config.convergenceThreshold: 0.01` reaches the detached lineage prompt. Evidence: iteration 004.

4. Add a configurable per-lineage wall-clock cap. `computeLineageTimeoutMs` hard-caps every lineage at 4 hours, so a 35-iteration high-effort run has far less time than its own per-iteration timeout math implies. Evidence: iteration 004.

5. Re-adjudicate codex/glm review findings after `008/007-fan-out-hardening`. The remediation child claims fixes shipped, but codex and GLM registries/reports still show active P1/P2 findings and CONDITIONAL verdicts. Emit per-finding `resolved`, `still_active`, or `accepted_risk` evidence. Evidence: iteration 003.

6. Repair discovery metadata. Root and 008 `graph-metadata.json` do not expose the real runtime/workflow/command implementation surfaces needed for resume and review. Backfill key files or generate resource maps from actual scope and continuity. Evidence: iteration 005.

7. Add missing governance artifacts. No `checklist.md` exists anywhere under the packet; only one `decision-record.md` exists despite multiple Complete Level 2/3 ADR-style phases. Evidence: iteration 006.

8. Add validators to prevent recurrence: `SCAFFOLD_COMPLETION_DRIFT`, `PHASE_MAP_STATUS_SYNC`, `STATUS_COMPLETION_PCT_SYNC`, `KEY_FILES_COVERAGE`, review-finding adjudication, command-asset comment hygiene, and YAML fan-out argument contract tests. Evidence: iteration 007.

## Answered Questions

1. Completion drift exists across phase maps, continuity, tasks, summaries, metadata, and review status.
2. Review lineage artifacts are stale/unreconciled after 007; native has an expired lock with an old packet id; old-path reports remain searchable.
3. Runtime/YAML bugs exist in comment hygiene, research threshold threading, session id initialization, prompt framing, and timeout caps.
4. Weak-evidence phases include `008/003`, `006/005`, `006/006`, and additional stale 002 children.
5. The best optimization is not more manual cleanup; it is validator-backed completion reconciliation and fan-out contract tests.

## References

- `iterations/iteration-001.md` through `iterations/iteration-011.md`
- `deep-research-state.jsonl`
- `deep-research-findings-registry.json`
- `resource-map.md`
