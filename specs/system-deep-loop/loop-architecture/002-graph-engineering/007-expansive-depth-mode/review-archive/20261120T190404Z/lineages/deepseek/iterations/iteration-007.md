# Iteration 7 - F-1-003 traceability: fan-out runner and merge against the review packet

## Dispatcher

- Mode: review, detached fan-out lineage `deepseek` (session `fanout-deepseek-1795113418367-pvzn7z`, generation 1, lineageMode new).
- Frontier node: F-1-003, dimension traceability. Node scope: `fanout-run.cjs`, `fanout-merge.cjs` and their unit suites, with the packet docs, feature catalogs and playbooks as traceability evidence.
- Operator review focus covered in this iteration: overengineering (catalog and playbook prose checked against one code rule), operator UX (the dashboard/report text the merge produces), cross-CLI/OS parity (all runtime mirrors checked for the new agent contract).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` -- partition, per-lineage prompt, budget derivation and lineage store.
- `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` -- merged coverage, frontier and provenance.
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md` -- the shipped-behavior claims for depth coverage, stop behavior and pivot.
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md` -- the pivot candidate and retry claims.
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md` and `review-pivot-gates-on-terminal-frontier.md` -- the DRV-083 and DRV-081 commands and expectations.
- `.skilled/agents/deep-review.md` and `.skilled/agents/deep-research.md` against `.claude/agents`, `.codex/agents`, `.pi/agents`, `.dsh/agents` and `.vibe/agents` -- the new frontier/proposal contract in every mirror.
- Traceability sources: `009-fanout-review-coverage-merge` REQ-001..REQ-006, `011-review-frontier-mode` REQ-008/REQ-017, `012-pivot-hygiene` REQ-002/REQ-005/REQ-007.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `011` REQ-008's seed, partition, `frontier_scope`, store and merge guard match the code; REQ-017's candidate order and gate chain match `convergence.cjs`. The iteration 3 REQ-007 admission gap remains the only partial. |
| `checklist_evidence` | partial | AC-010/AC-011 fan-out rows match; AC-008 remains the outstanding row. |
| `skill_agent` | pass | `.skilled/skills/system-deep-loop/deep-review/SKILL.md` expands the depth mode, the veto and the frontier row contract the agent definition carries (`.skilled/agents/deep-review.md`, `frontier_proposal` section). |
| `agent_cross_runtime` | pass | The three new agent-contract additions (frontier proposal rows, frontierNodeId, the CLI output contract) appear in `.skilled/agents`, `.claude/agents`, `.codex/agents`, `.pi/agents`, `.dsh/agents` and `.vibe/agents`; the diffs differ only in runtime frontmatter and the path-convention line. |
| `feature_catalog_code` | partial | The expansive-depth catalog matches seeding, band budget, stop order and dashboard. Its dimension-coverage sentence says "only an attempt that produced evidence counts" but lists only `error`/`failed`/`failure`/`timeout`; the code also counts `thought` and `stuck`, which is the code side of R2-P1-001. |
| `playbook_capability` | pass | DRV-081 names the pivot gate, the `frontier-unanswered` seed and the default-path case; DRV-083 names the 21 drained-frontier cases and the exact test and rg commands. Both match the code's steps and messages. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md:22` says the adapter "continues with the selected read-only direction" and does not claim frontier admission; the feature catalog therefore agrees with the implemented branch and disagrees with AC-008, which narrows the fix for R3-P1-001 to the acceptance criterion and plan text.
- `.skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:34` matches the `frontier_drained` ordering and the gate chain in `convergence.cjs:1164-1217`.
- `.skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-drained-stops-review.md:50-58` cites the stop-decision suite name and the `rg` command the code actually exposes.
- `.skilled/agents/deep-review.md` and all five mirrors carry the same `frontier_proposal` contract; the `.claude`/`.pi` diffs are the runtime frontmatter and path-convention lines only.

## Edge Cases

- The catalog's "produced evidence" sentence and its status list disagree with each other; I recorded the conflict against the existing R2-P1-001 rather than opening a second finding for the same rule.
- The `.vibe` mirror is generated from the canonical agent by `sync-agents-vibe.cjs`; its instruction string carries the full contract, so a hash comparison against the markdown canonical would be misleading.
- The packet's `Met` rows for AC-008 are the traceability defect surface; the code and catalog agree with each other, so the resolution is a packet amendment unless the operator wants the admission behavior.

## Confirmed-Clean Surfaces

- The fan-out review partition, per-lineage budget and merge guard are documented in REQ-008 and implemented line-for-line.
- The feature catalog's band-budget, derived-budget and ledger-store claims match `frontier-admit.cjs` and `reduce-state.cjs`.
- Both new playbooks cite commands and test names that exist and match the current code.
- Every runtime mirror carries the new agent contract; no mirror is stale for this range.

## Ruled Out

- A new finding for the catalog's "produced evidence" sentence: the same rule is already R2-P1-001, and splitting it would double-count one defect across code and docs.
- A stale-mirror finding: all six agent surfaces carry the new contract, so the differences are runtime packaging only.
- A playbook/code mismatch: the DRV-081 and DRV-083 commands and named cases exist as written.

## Next Focus

- Dimension: traceability on F-1-005 (reducers, extension and graph evidence against the packet).
- Reason: F-1-003 is traceable and its only gap is the shared REQ-007 claim; F-1-005 carries the extension, ledger-projection and evidence-edge requirements that the report cites.
- Required evidence: `001` REQ-002/REQ-004, `006` REQ-001..REQ-004 and `011` REQ-018/AС-019 against `reduce-state.cjs`, `upsert.cjs`, the ledger schema and the projections.
- Rotation status: correctness and security covered on all nodes; traceability covered on F-1-003.

Review verdict: CONDITIONAL
