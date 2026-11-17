# Review Iteration 003 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044`; whole files at `05475f9d044`.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. This iteration mapped the three obligations to packet `039`'s requirement and checklist rows: REQ-005 (generated intent signals and graph freshness) and REQ-006 (doctor presentation, workflow and contract test agree with the link manifest), plus the merge-equality claim in `039`'s implementation summary. It also ran the changed doctor contract test to pin its 17/17 result.
- **Dimension this iteration:** traceability.
- **Dimensions planned:** correctness, security, traceability, maintainability.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | traceability |
| `.skilled/skills/sk-doc/SKILL.md` | traceability |
| `.skilled/skills/sk-doc/graph-metadata.json` | traceability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | traceability |

Packet evidence read as context: `039-main-sk-doc-routing-repair/spec.md:134` (REQ-006), `spec.md:135` (REQ-005 text is `spec.md:133`), `acceptance-criteria.md:59` (AC-006), `tasks.md:61` (T011), `tasks.md:65` (T015), `implementation-summary.md:68-73,107`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The iteration 1 P2 (`MRG12-P2-001`) is the live code defect behind this pass's traceability shortfall; it is not re-filed.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-005 (`.skilled`-side): `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` exits 0 with "SIGNAL DRIFT compiled vs disk: none" and states it wrote nothing; `generate-router-intent-signals.cjs --check --hub sk-doc --json` reports `added=0, orphans=0`. REQ-006: presentation (`doctor-install-presentation.txt:78`), workflow (`doctor-install.yaml:60`) and manifest (`symlink-manifest.json:5-13`) agree on the same eight names today, and the contract test passes 17/17; the workflow leg is asserted only by the phrase check at `doctor-install-contract.test.cjs:240`, so the requirement's testable form is partial. |
| `checklist_evidence` | partial | `039-main-sk-doc-routing-repair/tasks.md:65` marks T015 `[x]` with "the contract test checks the workflow and drops a subsumed line". The test does not check the workflow's runtime names; it checks that one field lacks "is not offered" (`doctor-install-contract.test.cjs:240`). `acceptance-criteria.md:59` (AC-006) is defensible because its stated evidence is the contract passing (17/17 verified), not workflow-name coverage. |
| `skill_agent` | notApplicable | No agent definition owns or mirrors the sk-doc hub or the doctor command test. |
| `agent_cross_runtime` | notApplicable | The four scope files have no runtime-mirrored agent copies. |
| `feature_catalog_code` | notApplicable | No feature-catalog row describes the merged sk-doc intents or the doctor contract test. |
| `playbook_capability` | notApplicable | No manual-testing-playbook scenario covers these four files. |

## Integration Evidence

- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` — `node --test tests/doctor-install-contract.test.cjs` from `.skilled/commands/doctor/scripts` reports `tests 17 / pass 17 / fail 0`, which reproduces AC-006's count and confirms the test is green on the merged tree.
- `039-main-sk-doc-routing-repair/implementation-summary.md:68-70` — its three claims (ROUTER narrowing, regenerated graph metadata, recompiled graph) match the merge result; `:107` reports `--check RESULT: PASSED` and `--strict exit 0`, both reproduced here.
- `039-main-sk-doc-routing-repair/spec.md:134` — REQ-006 is the only requirement that names the doctor trio; the packet has no separate requirement for a workflow-name assertion.

## Edge Cases

- **Two sources of "agreement".** REQ-006 asks the three doctor artifacts to agree; the test enforces agreement between presentation and manifest only. Today the workflow agrees by inspection, so the requirement's observable outcome holds while its guard is narrower than the brief's wording. The distinction is recorded, not collapsed into a new finding, because the code defect is already `MRG12-P2-001`.
- **Historical vs live checklist rows.** `014-review-remediation/tasks.md:132` (T038) describes the superseded "DSH is not offered" sentence; `039/tasks.md:65` (T015) describes the pass-eleven attempt. Both are history; only T015 overstates the *current* test, so only T015 is cited.
- **Test execution writes nothing.** The doctor test reads assets and parses YAML in memory; its run left no artifact in the lineage or the packet.

## Confirmed-Clean Surfaces

- **Merge-equality claim holds.** The three sk-doc files match `origin/main 640cd0a2499` except the three README phrase narrowings, two version bumps, and `/create:sk-skill`; the implementation summary's description of that change is accurate.
- **REQ-005 is satisfied by both mechanical checks**, including the compiled graph's `SIGNAL DRIFT ... none`.
- **The doctor test is green and self-consistent** for the presentation and manifest legs.
- **The command name resolves.** `/create:sk-skill` is a real route at `.skilled/commands/create/sk-skill.md:7` and the same name appears in `SKILL.md:29`.

## Ruled Out

- **A false AC-006 mark.** AC-006's evidence is the contract's pass count, which the run reproduces (17/17); it does not claim workflow-name coverage, so it is not a false acceptance claim.
- **A stale generated-signal orphan introduced by the merge.** The generator check exits 0 with `orphans=0`.
- **A graph-freshness drift introduced by the merge.** `--strict` exits 0 with no drift row.

## Next Focus

- Dimension: maintainability.
- Focus area: clarity and safe follow-on cost of the changed doctor test assertion and of the merged sk-doc prose; check that the narrowing rationale is stated where a future editor will read it, and that no test title or comment now claims more than its assertion.
- Reason: last uncovered dimension; coverage completion is required before a legal STOP.
- Required evidence: file:line for each clarity claim.

Review verdict: PASS
