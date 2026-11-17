# Review Iteration 003

## Dispatcher

- Lineage: `docs-merge-10`, area `docs-merge`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: traceability and maintainability, as the closing cross-reference pass. This iteration re-checked the carried findings against HEAD, tied the remaining doc counts to their producers, and tested whether the merged files agree with the surfaces they name. The pass-ten operator focus still binds: docs claims against HEAD code, merge paths against both parents.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- The holdout rule and the recorded limits were honoured exactly as in iterations 1 and 2.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `.skilled/skills/system-skill-advisor/README.md` | 176-193 | The nine-command table against `references/runtime/cli-front-door-contract.md`, and the `vec_cmd_<dim>` table name against `embedders/schema.ts:92` |
| `.skilled/skills/system-skill-advisor/SKILL.md` | 69-88, 205 | The same nine ids and exit codes, and the adapter paragraph that carries F003 |
| `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md` | 36-70 | The at-a-glance bullets against their bodies and the producer code |
| `.env.example` | 401-414 | The fresh-prompt line and the alias list it sits above |
| `.skilled/skills/sk-doc/SKILL.md` | 27-42 | The mode table row and command names after the merge |
| `.skilled/skills/sk-doc/sk-create-skill/ROUTER.md` | 27-34, 96-99 | The three `/create:sk-skill` mentions and the pseudocode keyword list |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | 58, 78 | The eight-name list and the "nine" sentence that carry F002 |
| `.skilled/changelog/skilled/v4.0.2.1.md` | 43-69, 213-219 | The rename, Vibe and hook-entry claims that the merge brought in |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | 154-232 | The holdout and fit guards, to confirm the merged test still backs the capture |

Context evidence: `.skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:52-70`, `.skilled/skills/system-skill-advisor/references/graph/skill-graph-query-cookbook.md:3`, `.skilled/skills/system-skill-advisor/runtime/lib/embedders/schema.ts:92`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried active: F001.

### P2 Findings

None new. Carried active: F002, F003, F004.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | notApplicable | No spec implementation surface maps to this docs area; the doc-to-code checks are recorded as findings and integration evidence. |
| `checklist_evidence` | notApplicable | No `checklist.md` at the packet root; the pass-ten brief and scope file remain the checklist. |
| `skill_agent` | pass | `.skilled/skills/sk-doc/SKILL.md:29` and `ROUTER.md:27,33,97` name `/create:sk-skill` and `/create:skill-parent`, and both command files exist. |
| `agent_cross_runtime` | pass | The Vibe adapter proxies the compiled Claude handler; Pi and DSH import the same module; the hook contract document names Vibe. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched. |
| `playbook_capability` | notApplicable | No playbook claim is touched. |

## Integration Evidence

- **Nine command ids:** `cli-front-door-contract.md:52-70` lists exactly the nine ids the README table and SKILL list name, and the mutating flags match (`advisor_rebuild`, `skill_graph_scan`, apply-mode `propagate_enhances`).
- **Ten query types:** `skill-graph-query-cookbook.md:3` lists the same ten query types as `README.md:158`.
- **Vector table name:** `embedders/schema.ts:92` returns `vec_cmd_${dim}`, matching the README's `vec_cmd_<dim>` phrase.
- **Exit taxonomy:** `README.md:86` and `SKILL.md:89-94` give the same five exits (0, 1, 64, 69, 75); the contract keeps the same ids.
- **Carried F001:** `doctor-install-contract.test.cjs:240-241` still asserts text the merged asset no longer carries; re-read at HEAD, unchanged.
- **Carried F002:** the asset list at `:58` still has eight names and the sentence at `:78` still says "nine"; the manifest still has eight runtime keys.
- **Carried F003:** `README.md:244` and `SKILL.md:205` still omit Vibe while the adapter and hook contract document name it.
- **Carried F004:** `changelog/v1.1.0.0.md:44` still says no command at all, while the gate keeps read-only commands (`fusion.ts:1227-1229`).

## Edge Cases

- **Cross-reference scope:** this pass checked claims the changed lines point at, not the whole advisor reference tree. A claim outside the nine files would need its own lineage.
- **No new finding:** the nine-command table, the ten query types, the vector table name and the exit taxonomy all resolve; the absence of a new finding is recorded as clean evidence, not as skipped coverage.
- **Carried P1 is not downgraded by a clean iteration:** F001 stays active because the test/asset pair is unchanged; the final line stays CONDITIONAL.
- **Measurement claims:** the 185-file and 2121-test figures were not re-run and remain unverified; they are not code claims.

## Confirmed-Clean Surfaces

- **Nine commands:** README, SKILL and the CLI contract agree.
- **Ten query types:** README and the query cookbook agree.
- **Vector table:** the README name matches the embedder schema.
- **Exit taxonomy:** README and SKILL agree with the contract.
- **sk-doc rename:** the hub, the ROUTER and the command files agree on `/create:sk-skill`.
- **Merged routing test:** the holdout and fit guards still read fields the capture emits.

## Ruled Out

- **A wrong command inventory in the README table:** the nine ids and their mutating flags match the contract.
- **A wrong query-type count:** ten names in both the README and the cookbook.
- **A wrong vector-table name:** `vec_cmd_${dim}` in the schema.
- **A contradictory exit taxonomy:** the same five codes in both advisor files and the contract.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis of the carried F001 P1 and F002-F004 P2 findings
- Reason: all four dimensions have at least one pass, every carried finding was re-read, and this iteration added no new finding; the stop decision should now converge
- Rotation status: complete
- Required evidence: the `convergence.cjs` stop decision for iteration 3
- Recovery note: none

Review verdict: CONDITIONAL
