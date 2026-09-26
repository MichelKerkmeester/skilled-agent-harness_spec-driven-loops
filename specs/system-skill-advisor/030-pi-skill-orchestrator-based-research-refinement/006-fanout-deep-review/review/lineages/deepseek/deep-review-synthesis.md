# Deep Review Synthesis — Lineage Summary

- Session: fanout-deepseek-1790437845885-htqb7q (generation 1, lineage mode new, parent run null)
- Target: `specs/system-skill-advisor/030-pi-skill-orchestrator-based-research-refinement/006-fanout-deep-review`
- Target type: spec-folder
- Executor: cli-pi model=deepseek-v4.1-flash (executed inline; no nested dispatch)
- Iterations: 3 of 3
- Stop reason: **maxIterationsReached**
- Verdict: **PASS** (no active P0/P1; 5 P2 advisories)
- Release readiness: converged
- Artifact root: `review/lineages/deepseek/`
- Scope: every path in `goal-file-manifest.txt` (38 entries), phases 2-5 of packet 030 plus the phase-1 research-workflow fix

## 1. What this lineage reviewed

Three iterations, one dimension focus each, over the full manifest:

| Iteration | Dimension | Files | Outcome |
|-----------|-----------|-------|---------|
| 1 | D1 Correctness | 18 | Phase 2/3 hook wiring, nested deadline chain, stale-daemon retry, casual-prompt gate, runtime labels, Pi dual import verified; F001, F002 (P2) |
| 2 | D2 Security | 15 | Renderer prompt-safety, plugin argv spawn, plugin/renderer fallback parity, workspace-root allowlist, schema strictness, diagnostics content verified; F003, F004 (P2) |
| 3 | D3 Traceability + D4 Maintainability | 14 | Phases 002-005 swept against code/tests/docs; fan-out close, `edit_lines` refusals, dedup isolation verified; F005 (P2) |

All four declared dimensions are covered. `spec_code` = pass across the manifest-visible requirements; `checklist_evidence` = notApplicable (Level 1 target). Overlay protocols not applicable.

## 2. Findings (all P2, all active)

| ID | Severity | Dimension | Title | Key surface |
|----|----------|-----------|-------|-------------|
| F001 | P2 | maintainability | Dead exported fallback-gate helper has no caller | `hooks/lib/skill-advisor-cli-fallback.ts:160` |
| F002 | P2 | correctness | Operator budget above the shim kill ceiling is silently ineffective | `system-spec-kit/.../claude/user-prompt-submit.ts:105` |
| F003 | P2 | maintainability | Runtime vocabulary drift — three enum copies reject the four runtimes phase 002 added | `runtime/schemas/advisor-tool-schemas.ts:349`, `runtime/tools/advisor-validate.ts:22`, `runtime/skill-advisor-cli-manifest.ts:89` |
| F004 | P2 | security | Diagnostics log created with default permissions under `os.tmpdir()` | `runtime/lib/metrics.ts:182`, `:274-278`, `:302-325` |
| F005 | P2 | traceability | Confirm-mode review workflow never consumes `stop_policy`, so `max-iterations` can stop before the ceiling | `deep-review-confirm.yaml:38` (contract) vs. `:618-660` |

No P0, no P1, no repeated findings, no severity changes, no resolved findings. Two findings (F003, F005) have explicit upgrade conditions recorded in their iteration reports; none has been met by evidence in scope.

## 3. Verification notes the merge should keep

- Fan-out review close: `step_convergence_report` exempts the root dashboard when lineage logs exist; proven both ways by `run-now-yaml-control.vitest.ts:293-400`.
- `edit_lines`: the short-count refusal names the final empty line and offers a safe retry; the moved-line refusal and the strict-other-mismatch path are unchanged (`pi-cache-optimizer/index.ts:8148-8175`, tests `hash-verified-edits.test.ts:123-127`).
- Plugin mirror: `.opencode` and `.skilled` copies byte-identical (md5 `28114f4c629b341a44ce9f7bfef76ef5`); duplication remains a follow-on change risk, not drift.
- Ledger scope shapes: review events use `{runId, sessionId}` and research events use `{runId, lineageId}`, each matching its mode's ledger schema (`deep-review-ledger-schema.vitest.ts:162`). The four YAML blocks are correct.
- Not reviewable in manifest scope: phase 005 REQ-006 (`check-contract-drift.cjs`) and REQ-007 (trigger index) — recorded as out of scope, not passed.

## 4. Execution disclosure

This lineage ran under the detached fan-out executor: every iteration and the synthesis were performed inline by the process that received the orchestration prompt. No nested CLI, agent or subprocess ran an iteration; the workflow's per-iteration executor-dispatch steps are satisfied by that process. The terminal `synthesis_complete` record is written directly to the lineage state log; the canonical ledger gateway path was not exercised for this event.

## 5. Handoff

- Merged root report (`review/review-report.md`) and cross-lineage dedup are the orchestrator's step, together with the sibling lineage.
- If the merged report adjudicates F003 or F005 upward, the citations above are the evidence base; if F005 is accepted as a confirm-mode design difference, it can be closed as documented behavior with a one-line note at `deep-review-confirm.yaml:38`.

Synthesis status: complete
