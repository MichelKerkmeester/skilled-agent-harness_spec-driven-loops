# Review Iteration 005 — merged-12

**Lineage:** `merged-12` (detached fan-out, review pass twelve, area `merged`)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/merged-12`
**Session:** `fanout-merged-12-1794856957949-n58dw7`
**Diff under review:** `git -c core.fsmonitor=false diff 2f3f893c153 05475f9d044`; whole files at `05475f9d044`.

## Dispatcher

- **Operator review focus (bound):** review pass twelve, area `merged`, per `review/review-brief-12.txt`. This iteration closes the two core traceability protocols the stop decision still listed as unfinished, with file:line evidence for each pass, and it repairs the coverage graph's duplicate seed dimension ids so the graph measures the coverage the four iterations actually performed.
- **Dimension this iteration:** traceability (protocol completion).
- **Dimensions planned:** all four already reviewed in iterations 1-4; this pass revisits traceability for the protocol result only.
- **Steer file:** absent at iteration start.

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/sk-doc/ROUTER.md` | traceability |
| `.skilled/skills/sk-doc/SKILL.md` | traceability |
| `.skilled/skills/sk-doc/graph-metadata.json` | traceability |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | traceability |

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. `MRG12-P2-001` remains the one active advisory: the workflow runtime leg of the contract test is asserted by phrase absence, not by comparison with the link manifest.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | REQ-005 (`.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` scope): `generate-router-intent-signals.cjs --check --hub sk-doc --json` reports `added=0, orphans=0` (`.skilled/skills/sk-doc/graph-metadata.json:601` is the generated list it validates), and `skill-graph-freshness.cjs --strict` exits 0. REQ-006: the presentation names the eight manifest runtimes at `.skilled/commands/doctor/assets/doctor-install-presentation.txt:78`, the workflow names them at `.skilled/commands/doctor/assets/doctor-install.yaml:60`, the manifest holds them at `.skilled/commands/doctor/assets/symlink-manifest.json:5-13`, and the contract test derives its expectation from the manifest at `doctor-install-contract.test.cjs:237-238`; the suite passes 17/17. The observable requirement holds; its workflow-leg guard is the separately recorded P2. |
| `checklist_evidence` | pass | `039-main-sk-doc-routing-repair/tasks.md:61` (T011) cites the 17/17 run and the 16/1 main-text control; `tasks.md:65` (T015) cites the doctor suite and the gate file, and the change it claims exists at `doctor-install-contract.test.cjs:239-240`. Both `[x]` marks have supporting evidence. T015's wording is wider than the assertion, which is exactly `MRG12-P2-001`; that is a finding about guard strength, not a missing citation. |
| `skill_agent` | notApplicable | No agent definition owns or mirrors these files. |
| `agent_cross_runtime` | notApplicable | No runtime-mirrored copies. |
| `feature_catalog_code` | notApplicable | No feature-catalog row covers them. |
| `playbook_capability` | notApplicable | No playbook scenario covers them. |

## Integration Evidence

- `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` — the coverage repair added 16 `COVERS` edges (`e-seed-<dimension>-<n>`) from the four seeded DIMENSION ids to the four FILE nodes, so the graph counts each dimension once per file instead of splitting the same dimension across two ids. The per-iteration `dimension:*` nodes keep their own edges; both id families now describe the same reviewed coverage.
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:237-240` — the file the `spec_code` pass rests on; re-read at line level for this pass.

## Edge Cases

- **Duplicate dimension ids in the graph.** The init seed used `d-*` ids and the iteration record used `dimension:*`. Both are valid in the session namespace, but only the iteration ids carried full COVERS edges, so the graph reported 5/8 coverage after four passes. The repair adds the missing edges rather than deleting either id family, because both record real review acts.
- **Protocol status is not the same as finding severity.** `spec_code` and `checklist_evidence` can pass while a P2 remains: the protocols check spec-to-code and claim-to-evidence, and the P2 says one guard is weaker than its title. The report states both.

## Confirmed-Clean Surfaces

- **REQ-005** is fully satisfied by both mechanical checks.
- **REQ-006's observable outcome** holds: all three doctor artifacts name the same eight runtimes the link manifest offers.
- **The contract suite is green** (17 tests, 17 pass).
- **Every core protocol now has a recorded result with file:line evidence**, so the stop decision's `unfinishedCoreProtocols` should be empty on the next pass.

## Ruled Out

- **A REQ-005 regression.** Neither mechanical check reports a defect.
- **A missing-evidence checklist row.** Both doctor `[x]` rows cite a command result that exists.
- **A graph-node naming collision across sessions.** The namespace is session-scoped; the duplicate ids are same-session, so the repair is an edge add, not a cross-session merge.

## Next Focus

- Dimension: none; all four dimensions and both core protocols are covered.
- Focus area: stop decision and, if allowed, synthesis.
- Reason: the remaining blocker after iteration 4 was coverage accounting and protocol completion, both addressed here.
- Required evidence: the stop decision's `blockedBy` (expect empty) and `graphDecision` (expect not blocked).

Review verdict: PASS
