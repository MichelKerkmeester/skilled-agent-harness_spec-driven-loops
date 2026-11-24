# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `pi-1`), target agent `@deep-review`, resolved route `Resolved route: mode=review target_agent=deep-review`.
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder).
- Dimension: cross-reference.
- Operator focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made.
- Focus addressed in this iteration: closed the two remaining overlays, re-read every landed finding against the file it cites at HEAD, and re-checked the goal-criteria ledger against the packet's own recorded runs.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/transport/cli-lane-and-output-envelope.md:32-45`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/references/cli-reference.md:39-76`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/SKILL.md:123,148`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/feature-catalog/feature-catalog.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/feature-catalog/limits-and-safety/capability-gaps-and-handoffs.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/manual-testing-playbook.md:320-330`
- `git status --porcelain` over the three skill packets and the packet's phase folders (dirtiness check)
- All four prior iteration files' finding rows, re-read against the files they cite

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Cross-Reference Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `feature_catalog_code` | pass | The Bladebro transport entry's envelope claim (`feature-catalog/transport/cli-lane-and-output-envelope.md:32-36`: one object with `ok`, `is_error`, `text`, plus `image_path`; exit 0/1/2) matches the CLI reference (`references/cli-reference.md:61`) and the SKILL's read rule (`SKILL.md:123`). The capability-gaps entry is linked from the playbook root as a catalog entry without a scenario, and the root says so at `manual-testing-playbook.md:328`. |
| `agent_cross_runtime` | notApplicable | No agent definition in `.skilled/agents/` names the hub or any of its modes, so there is no cross-runtime agent binding to reconcile. |
| `spec_code` | pass (re-affirmed) | No reviewed file is dirty at HEAD `ec3ed74ad01`, so the criteria evidence recorded in iteration 3 still describes the shipped tree. |
| `checklist_evidence` | pass (re-affirmed) | The two overstated evidence sentences (iteration 1 P2, iteration 3 P2) are recorded as findings rather than as clean rows; every other sampled row's evidence holds at HEAD. |

## Finding Re-Read

| Finding | File at HEAD | Still valid | Note |
|---------|--------------|-------------|------|
| `pi1-I1-P1-001` (id-noun anchor) | `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:332` | yes | The helper and its call site are unchanged; the shipped changelog promise it contradicts is unchanged. |
| `pi1-I1-P2-001` (AC-002 evidence overstatement) | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:103` | yes | The changelog line that breaks the claim is still at `mcp-bladebro/changelog/v1.2.1.0.md:21`. |
| `pi1-I2-P1-001` (unpinned registration teaching) | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:361` | yes | All four copies remain unpinned; the live config remains pinned at `0.26.0`. |
| `pi1-I2-P2-001` (ungated npx launch) | `.utcp_config.json:56-58` | yes | Three chrome_devtools manuals still launch npx with no operator gate. |
| `pi1-I3-P2-001` (stale derived status) | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/graph-metadata.json:54` | yes | The parent and `006-verification` still read `in_progress`. |
| `pi1-I4-P2-001` (duplicated pin authority) | `.skilled/skills/mcp-browser-use/mcp-bladebro/scripts/doctor.sh:21` | yes | Both files still declare the five constants and no test mentions bladebro. |
| `pi1-I4-P2-002` (four guide copies) | `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/INSTALL-GUIDE.md:354` | yes | Four blocks remain, one authoritative snapshot. |

## Goal Criteria Ledger

| Criterion | Evidence class | Result |
|-----------|----------------|--------|
| 1 - research iterations and `research.md` | direct inspection | holds (12 iteration records) |
| 2 - three hub modes, six `mcp-tooling` modes | direct inspection | holds |
| 3 - no `mcp-tooling` browser mode remains | direct search | holds |
| 4 - `parent-skill-check.cjs` exits 0 | packet-recorded run | recorded, not re-run |
| 5 - one real request per mode through both stages | packet-recorded replay | holds for the three mode rows (48 of 49 overall, one stage-one miss disclosed) |
| 6 - playbooks with recorded runs, Bladebro on macOS | direct inspection | holds |
| 7 - `validate.sh --strict --recursive` PASSED | packet-recorded run | recorded, not re-run |

## Edge Cases

- The unrecorded `parent-skill-check` and `validate.sh` results are the only two criteria this lineage cannot observe; both are named as recorded rather than asserted, and neither hides a contradicting file.
- `feature_catalog_code` was sampled at one entry, not swept across the Bladebro catalog's 17 entries; the sampled entry is the transport contract every other entry depends on.

## Ruled Out

- **A catalog claim contradicting the CLI reference.** Ruled out for the transport entry: envelope fields and exit codes match in three places.
- **A reviewed file changed under the review.** Ruled out: `git status --porcelain` over the three skill packets and the phase folders prints nothing, so every finding still describes HEAD.
- **A catalog entry silently missing its scenario.** Ruled out: the playbook root names the entries without a scenario and their reasons.

## Next Focus

- Dimension: synthesis
- Focus area: hand the seven findings, the six bug classes and the goal-criteria ledger to the report, and stop the loop.
- Reason: every dimension is swept, the depth ledger is complete, and the last iteration added no new finding.
- Rotation status: correctness, security, traceability, maintainability and cross-reference complete.
- Blocked/productive carry-forward: productive — the re-read confirmed all seven findings against HEAD.
- Required evidence: a stop decision from the convergence script and a complete synthesis record.

## Verdict

Review verdict: CONDITIONAL
