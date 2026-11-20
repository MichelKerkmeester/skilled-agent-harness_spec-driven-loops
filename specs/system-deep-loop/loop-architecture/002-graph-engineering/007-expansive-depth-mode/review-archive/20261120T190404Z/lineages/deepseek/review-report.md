# Deep Review Report - expansive-depth program (fan-out lineage deepseek)

## 1. Executive Summary

**Verdict: CONDITIONAL** (active P0 = 0, active P1 = 2, active P2 = 6; `hasAdvisories = true`).

The detached `deepseek` lineage reviewed range `21c4b325b5a..de32abbb74d` over `.skilled/skills/system-deep-loop`, `.skilled/commands/deep`, `.skilled/agents` and the `.claude`, `.codex`, `.pi`, `.dsh` and `.vibe` agent mirrors. It completed 12 iterations across the three dealt frontier nodes (`F-1-003`, `F-1-005`, `F-1-007`) and all four configured dimensions. Scope: runtime code and tests, command YAML and presentation, skill docs, feature catalogs and playbooks; `specs/` evidence was used for traceability only.

## 2. Planning Trigger

CONDITIONAL routes to `/speckit:plan`. Two P1 findings need a decision before release:

- the frontier `answered` projection counts `thought`/`stuck` records as dimension evidence (R2-P1-001);
- the packet's REQ-007/AC-008 promise pivot-candidate admission the workflow does not perform (R3-P1-001), where the shipped catalog and the workflow agree on the implemented behavior.

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | Evidence |
|----|----------|-----------|-------|----------|
| R2-P1-001 | P1 | correctness | A `thought` iteration covers a frontier dimension and spends node depth | `runtime/scripts/reduce-state.cjs:1971-1984`, `frontier-admit.cjs:90`, `deep-review/references/convergence/convergence.md:238` |
| R3-P1-001 | P1 | traceability | REQ-007 and AC-008 promise pivot-candidate admission the pivot branch never performs | `deep-review.yaml:1429`, `:1541-1547`; `011-review-frontier-mode/spec.md:147`, `acceptance-criteria.md:63`, `plan.md:67/71` |
| R1-P2-001 | P2 | correctness | Detached lineage contract names a FRONTIER block the CLI prompt never renders | `runtime/scripts/fanout-run.cjs:1791`, `deep-review/assets/prompt-pack-iteration.md.tmpl:28` |
| R1-P2-002 | P2 | correctness | Frontier steering and projection order by locale collation while the merge orders by code unit | `runtime/scripts/reduce-state.cjs:1924`, `:2016`; `deep-research/scripts/reduce-state.cjs:2447`, `:2512`; `fanout-merge.cjs:928` |
| R1-P2-003 | P2 | correctness | A single lineage that omits `graphCoverageMode` erases the mode the others agree on | `runtime/scripts/fanout-merge.cjs:1003` |
| R1-P2-004 | P2 | correctness | The merge re-implements the reducer's traceability summary arithmetic | `runtime/scripts/fanout-merge.cjs:982`, `reduce-state.cjs:1652-1665` |
| R5-P2-001 | P2 | security | Source-quality classification assumes POSIX separators, so Windows-separated paths lose their spec and test classes | `runtime/scripts/upsert.cjs:330` |
| R12-P2-001 | P2 | maintainability | The attempt-1 to attempt-2 config transition writes the config twice and the second write bypasses the conflict check | `runtime/lib/deep-loop/divergent-pivot.ts:1296-1309` |

R2-P2-001 (locale ordering on the reducer/steering surface) was merged into R1-P2-002 as a refinement.

## 4. Remediation Workstreams

1. **Frontier evidence integrity** (R2-P1-001): filter `thought`/`stuck` out of the frontier visit and dimension-coverage path, matching the review doctrine and the research reducer's question-coverage rule.
2. **Packet truth** (R3-P1-001): amend REQ-007, AC-008 and plan lines 67/71 to "the accepted direction becomes `next_dimension` and writes no frontier node", or implement the admission the AC describes. The catalog and code agree on the former.
3. **Fan-out prompt and ordering** (R1-P2-001, R1-P2-002): render the FRONTIER block in the detached CLI prompt, or remove the contract reference to it; replace `localeCompare` node ordering with the code-unit comparator the merge uses.
4. **Merge coverage edges** (R1-P2-003): record a mode disagreement explicitly instead of collapsing it to `null`; collapse R1-P2-004 into the reducer's `buildTraceabilityRollup` when the shared helper is next touched.
5. **Cross-OS and bookkeeping hardening** (R5-P2-001, R12-P2-001): classify paths on both separators; make the attempt transition one guarded write helper.

## 5. Spec Seed

- Frontier visit evidence must exclude every status the doctrine calls evidence-free (`thought`, `stuck`), not only `error`/`timeout`.
- The pivot handoff is `restoredFocus` → `next_dimension`, with no frontier node; REQ-007/AC-008 should say so unless admission is chosen.
- `--depth-mode` fan-out prompts must carry the node identity and dimension the leaf contract references.

## 6. Plan Seed

- One code change for R2-P1-001 with a reducer case for a `thought` record and a `stuck` record.
- One packet-text change for R3-P1-001 (or a feature worth its own phase if admission is chosen).
- One prompt change for R1-P2-001 plus a golden prompt test; one comparator change for R1-P2-002.
- Two P2 code changes for R5-P2-001 and R12-P2-001; R1-P2-003/R1-P2-004 as a single merge-hardening change.

## 7. Traceability Status

| Protocol | Status | Notes |
|----------|--------|-------|
| `spec_code` | partial | 001, 006, 007, 010, 012 match; 011 REQ-007/AC-008 admission claim does not. |
| `checklist_evidence` | partial | AC-004, AC-005, AC-010, AC-011, AC-018, AC-019 match; AC-008 does not. |
| `skill_agent` | pass | Skill and agent definition share the depth-mode, veto and frontier-row contract. |
| `agent_cross_runtime` | pass | Canonical agent and five mirrors carry the new frontier contract. |
| `feature_catalog_code` | partial | Catalogs match except the expansive-depth "produced evidence" sentence (R2-P1-001 doc side). |
| `playbook_capability` | pass | DRV-081, DRV-083, DLR-061 and DLR-062 name existing commands and cases. |

## 8. Resource Map Coverage Gate

Omitted: no `resource-map.md` exists in the packet, so the gate does not apply.

## 9. Deferred Items

- P2 advisories: R1-P2-001..004, R5-P2-001, R12-P2-001.
- The command presentation's `--depth-mode` flag row is a contract-length paragraph that restates the reference; that operator-UX cost belongs to the command-presentation node outside this lineage's partition.
- Residual hardening (pre-existing, not range findings): the reducer's plain file writers lack a symlink guard; a corrupt lineage state log aborts the whole merge; `dispatch-iteration.cjs:835` falls back to `/tmp` instead of `os.tmpdir()`.

## 10. Audit Appendix

- **Run:** session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineage mode `new`, artifact directory `review/lineages/deepseek`.
- **Iterations:** 12, each recorded through the append gateway with route proof and an append-only delta. Frontier nodes: F-1-003, F-1-005, F-1-007; each answered on all four dimensions.
- **Stop:** `converged` with reasonDetail `frontier_drained`; no open or active frontier node, three answered, stop gates and graph decision still apply.
- **Replay:** the registry was rebuilt from the state log and deltas on every reduce; convergence score 0.95, search debt 0, corruption 0.
- **Coverage:** all four configured dimensions (correctness, security, traceability, maintainability) across three nodes = 12 node visits; ledger revisions 3-13.
- **Residual risk:** the two P1s are not release blockers for the review loop's utility but block a PASS; the P1 traceability item can be closed by packet amendment if the operator confirms the shipped no-node behavior.
- **Synthesis closeout warning:** `synthesis-closeout.cjs` staged `synthesis_incomplete` (severity `warning`) with `structured_state_findings_partially_reflected_in_registry`, because iteration 2 recorded the refinement R2-P2-001 and the reducer merged it into R1-P2-002 while the closeout counts iteration finding ids against registry findings. Both the closeout count and the `refines` mechanism predate this range, so this is a pre-existing false positive rather than a range finding; the report and registry are complete and the warning is recorded as-is.
