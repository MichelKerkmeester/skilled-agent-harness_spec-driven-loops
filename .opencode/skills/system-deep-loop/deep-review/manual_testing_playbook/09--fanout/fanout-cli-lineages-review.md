---
title: "Fan-out review with two CLI lineages"
description: "Validate that a two-CLI-lineage fan-out review config triggers step_fanout_spawn → fanout-run.cjs pool → two isolated lineages sub-packets → step_fanout_merge with p0/p1/p2 binding → step_derive_verdict using merged counts → review-report.md."
version: 1.11.0.3
---

# DRV-064 -- Fan-out review with two CLI lineages

This document captures the validation contract, execution flow, and metadata for `DRV-064`.

---

## 1. OVERVIEW

End-to-end structural validation of the CLI fan-out path in the review loop, with particular
attention to the review-specific `bind_from_output` that feeds merged P0/P1/P2 counts to
`step_derive_verdict`.

### Why This Matters

The review fan-out has one critical additional requirement beyond the research fan-out: the
`bind_from_output` binding in `step_fanout_merge`. Without it, `step_derive_verdict` reads
zero counts from the empty base artifact dir state log and produces an incorrect PASS verdict.

---

## 2. SCENARIO CONTRACT

- Objective: Confirm the review YAML dispatches CLI lineages, that `step_fanout_merge` has `bind_from_output` for P0/P1/P2 counts, and that `step_derive_verdict` would use merged counts.
- Real user request: `/deep:review:auto "skill:deep-research" --executor=cli-opencode --model=o4-mini --label=opencode --executor=cli-claude-code --model=claude-opus-4-8 --label=claude --concurrency=2`
- Expected execution process: 1. Setup binds two executors → `config.fanout`. 2. `step_fanout_spawn_cli` calls `fanout-run.cjs --loop-type review`. 3. Pool spawns two subprocesses. 4. `step_fanout_merge` calls `fanout-merge.cjs --loop-type review` and binds `active_p0/p1/p2` → `p0_count/p1_count/p2_count`. 5. `step_derive_verdict` derives verdict from bound counts.
- Expected signals: `step_fanout_merge` YAML block has `bind_from_output: {p0_count: "active_p0", ...}`; `fanout-merge.vitest.ts` review tests pass (5 tests).
- Pass/fail: PASS if `bind_from_output` present and review tests pass; FAIL if binding absent.

---

## 3. TEST EXECUTION

### Prerequisites

- Working directory is repository root.
- `deep_review_auto.yaml` and `review.md` present.

### Steps

1. `bash: grep -n "step_fanout_spawn\|step_fanout_merge\|bind_from_output\|active_p0\|active_p1\|skip_when" .opencode/commands/deep/assets/deep_review_auto.yaml | head -25`
2. Confirm `step_fanout_merge` has `bind_from_output:` mapping `active_p0` → `p0_count`, `active_p1` → `p1_count`, `active_p2` → `p2_count`.
3. Confirm `step_fanout_spawn_cli` calls `fanout-run.cjs` with `--loop-type review`.
4. `bash: grep -n "fanout_executors\|--executor\|strongest.restriction\|merged FAIL" .opencode/commands/deep/review.md | head -15`
5. Confirm strongest-restriction note in review command docs.
6. `bash: cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run ../../runtime//tests/unit/fanout-merge.vitest.ts --reporter=verbose`
7. Confirm 10/10 pass (5 review tests + 3 research tests + 2 e2e tests).

### RECOMMENDED ORCHESTRATION PROCESS

1. Check `bind_from_output` in the YAML first — this is the review-specific requirement.
2. Verify the loop type in the CLI call (`--loop-type review`).
3. Confirm the review command docs include the strongest-restriction note.
4. Run fanout-merge tests last as regression confirmation.

### Expected Outcome

Source inspection confirms `bind_from_output` mapping is present. Review command docs include strongest-restriction. fanout-merge.vitest.ts 10/10 pass.

### Failure Modes

- `bind_from_output` absent: `step_derive_verdict` reads zero counts → incorrect PASS even when lineages found P0.
- `--loop-type research` used instead of `review` in CLI call: merge uses research dedup instead of strongest-restriction.
- Review strongest-restriction note absent from docs: operators don't know P0 in any lineage blocks.

---

## 4. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `.opencode/commands/deep/assets/deep_review_auto.yaml` | `step_fanout_spawn`, `step_fanout_merge` (with `bind_from_output`), `step_resolve_artifact_root` |
| `.opencode/commands/deep/review.md` | `--executor` flag docs, strongest-restriction note |
| `.opencode/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Review strongest-restriction merge |

### Validation

| File | Role |
|---|---|
| `.opencode/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | 10 tests including 5 review strongest-restriction |

---

## 5. SOURCE_METADATA

- Group: Fan-Out
- Canonical root source: `manual_testing_playbook/manual_testing_playbook.md`
- Scenario file path: `manual_testing_playbook/09--fanout/fanout-cli-lineages-review.md`
- Expected verdict mode: GREEN when bind_from_output confirmed + 10/10 fanout-merge tests pass
- Wall-time estimate: 10-20 min
