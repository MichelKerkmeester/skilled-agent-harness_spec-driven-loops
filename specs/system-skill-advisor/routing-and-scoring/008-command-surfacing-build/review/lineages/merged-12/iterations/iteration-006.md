# Review Iteration 006 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044`; whole files at `05475f9d044`.
**Recovery mode:** iteration 5's stop pass returned `stuckRecovery` again (two zero-ratio passes since the previous recovery reset). This pass keeps the line-level granularity and sweeps residual merge risk before the next stop decision.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. This iteration re-read the merge history behind the two `origin/main` merges, checked that no scope file changed after `05475f9d044`, and recorded one out-of-scope observation the lead may want routed separately.
- **Dimension this iteration:** maintainability (residual sweep; no new dimension coverage asserted).
- **Dimensions planned:** all four covered; both core protocols pass.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | maintainability |
| `.skilled/skills/sk-doc/SKILL.md` | maintainability |
| `.skilled/skills/sk-doc/graph-metadata.json` | maintainability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | maintainability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. `MRG12-P2-001` is unchanged; the sweep found no reason to widen or narrow it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Both scope-file sets are stable: `git diff 05475f9d044 HEAD` over the four paths is empty. REQ-005 passes both mechanical checks; REQ-006's three artifacts agree on the eight manifest runtimes and the suite passes 17/17. |
| `checklist_evidence` | pass | Both doctor `[x]` rows cite evidence that exists; the T015 wording gap remains `MRG12-P2-001`. |

## Integration Evidence

- `git log --oneline --merges 2f3f893c153..05475f9d044` — the branch carries exactly two `origin/main` merges, `2394e8f797c` and `05475f9d044`. The first merge's message records the resolution rule ("Keeps the sk-doc README phrase narrowings over main's install-guide removal, and regenerates the sk-doc manifests, the skill graph and the trigger index"), which matches the observed diff.
- `git merge-base --is-ancestor 56cb7775a8b 640cd0a2499` — the install-guide removal is main's commit, not a branch edit; `ae6a0e6a676` (the mention fix) is branch-only and belongs to the `mention` area.
- `git show 05475f9d044:.skilled/skills/sk-doc/ROUTER.md` — the merged file at the reviewed commit is byte-identical to the working tree for all four scope paths.

## Edge Cases

- **Out-of-scope merge residue (recorded, not filed).** The same merge changed `.skilled/skills/sk-doc/sk-create-readme/ROUTER.md`, and that file still says a repository's install guide is in scope and that the `readme` intent selects "a root-guide template for an install guide" at lines 23 and 47, while main's install-guide removal deleted its template row, its keyword and its template bullet. `.skilled/skills/sk-doc/hub-router.json:254` likewise still lists `security policy` though the hub's `SECURITY_POLICY` intent now fires on `security.md` only. Neither path is one of the four `merged` rows in `review-scope-12.txt`, and the scope lock keeps findings inside the declared target, so this is recorded as a lead-routing observation rather than a finding in this lineage.
- **Three `origin/main` merges appear in `--merges` output but only two are this branch's.** `fd845589ec8` and `35d49e8f638` belong to other worktrees and arrive through main's history; they do not touch the four scope paths.
- **The recovery counter is a trailing-window count.** Two zero-ratio passes trigger it even when the second pass added new protocol evidence; the recovery event resets the count, which is why this run needed a second recovery start rather than a verdict.

## Confirmed-Clean Surfaces

- **The four reviewed files are unchanged after the reviewed commit.**
- **Both `origin/main` merges left the hub ROUTER/SKILL in the state verified in iterations 1-3.**
- **The changed doctor test is green at 17/17 and remains the only defect-bearing surface** (the P2).
- **The generated signal list and the compiled graph both pass their strict checks.**

## Ruled Out

- **A third branch-local merge of main.** Only `2394e8f797c` and `05475f9d044` are on this branch's first-parent path.
- **A post-merge edit to the four scope paths.** The `05475f9d044..HEAD` diff is empty.
- **A second finding in the doctor test.** Re-read all 17 tests; only the workflow half of the runtime-name test under-reaches.

## Next Focus

- Dimension: none; review complete.
- Focus area: stop decision and synthesis.
- Reason: coverage, protocols, and graph are all in the state a legal STOP needs.
- Required evidence: `stop_decision.decision` and `graphDecision`.

Review verdict: PASS
