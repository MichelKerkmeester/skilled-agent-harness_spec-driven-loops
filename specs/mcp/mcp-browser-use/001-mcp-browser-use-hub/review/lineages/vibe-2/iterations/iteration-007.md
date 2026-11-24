# Review Iteration 007

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: cross-reference (final carry-forward pass on the seven active P2 findings)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 7 of 7 (final iteration)

## Files Reviewed

- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/registry-compiler.cjs:263` -- the hardcoded `selectionKinds`
- `.skilled/skills/mcp-browser-use/ROUTER.md:53` -- the intent-signal block
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/scripts/install.sh:12` -- the pin-scope comment
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/006-verification/implementation-summary.md:49` -- the recorded run date
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/README.md:1` -- mode README version
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/README.md:1` -- mode README version
- `.skilled/skills/mcp-browser-use/mcp-bladebro/README.md:1` -- mode README version
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:70` -- the BINDING table
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:129` -- the review evidence row

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Four P1 findings remain active and were re-confirmed in iteration 6.

### P2 Findings

None new. All seven P2 findings were re-read against current source and all seven remain active.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Re-read: `registry-compiler.cjs:263` still hardcodes `selectionKinds: ['single', 'orderedBundle']`; `ROUTER.md:53` still declares four intent signals against `hub-router.json`'s three `routerSignals`; the hub README version and the two mode README versions are unchanged. |
| `checklist_evidence` | partial | Re-read: `006-verification/implementation-summary.md:49` still records the 2026-11-21 run; the parent goal's evidence row still cites a path that does not resolve. |
| `skill_agent` | pass | Carried: `parent-skill-check.cjs` exits 0 and names the hub. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | Carried from iteration 6: `install-and-doctor.md:24` still presents the unpinned form as an equal option. |
| `playbook_capability` | pass | Carried: all three modes carry a playbook with a recorded run. |

## Integration Evidence

- **P2-a re-read, `registry-compiler.cjs:263`.** `selectionKinds` is still the literal `['single', 'orderedBundle']` while `bundleKindForModes` can emit `surfaceBundle`. The finding is unchanged.
- **P2-b re-read, `ROUTER.md:53`.** The `INTENT_SIGNALS` block still carries `CHROME_DEVTOOLS`, `LIGHTHOUSE_TRACE`, `ASIDE_DEVTOOLS` and `BLADEBRO`, four classes against the three `routerSignals` in `hub-router.json`. The finding is unchanged.
- **P2-c re-read, `install.sh:12`.** The file now states the limitation in its own comment: "The pin covers this script only; the archive it fetches is not verified." The finding is unchanged and is self-documented rather than hidden.
- **P2-d re-read, `006-verification/implementation-summary.md:49`.** The completion date is still 2026-11-21 and the recorded Chrome DevTools run is still the older one, while the newest playbook run is `2026-11-22--manual-testing-playbook--remaining-live`. The finding is unchanged.
- **P2-e re-read, three mode READMEs.** `mcp-chrome-devtools/README.md` is `1.0.26.0` against `SKILL.md` at `1.0.28.0`; `mcp-aside-devtools/README.md` is `1.1.10.0` against `1.1.13.0`; `mcp-bladebro` is consistent at `1.2.1.0`. The finding is unchanged.
- **P2-f and P2-g re-read, `goal.md:70` and `goal.md:129`.** The BINDING table still ends at `014-fix-deep-review-findings` while `goal.md:131` records 015 as Done, and the review row still cites `review/review-report.md`, which does not exist. Both findings are unchanged.

## Edge Cases

- **No finding was closed in this run.** Nothing under the review target changed between iteration 1 and this iteration, so every finding raised is still active at the cap. The run therefore reports eleven active findings and no resolutions, which is the honest state rather than a convergence failure.
- **The iteration cap, not convergence, ends this run.** The convergence run after iteration 6 reported `CONTINUE` with `reasonDetail: noStopCandidate`, `rollingAverage` 0.667 over iterations 4 to 6, and `dimensionCoverageGate` failing on `traceabilityCovered: false` with `unfinishedCoreProtocols: ["spec_code","checklist_evidence"]`. Those two core protocols cannot pass while four P1 findings are open, so the gate and the findings are consistent and the cap is the correct stop.
- **P2-c is self-documented.** The installer comment states the pin's scope, so the finding is about the residual risk rather than about a misleading claim. It stays P2.
- **Two P2 findings share a file.** P2-f and P2-g are both in `goal.md` and have different fixes and different readers, so they are carried separately into synthesis.

## Confirmed-Clean Surfaces

- `mcp-bladebro`: README and SKILL agree at `1.2.1.0`, so the version drift is confined to two of three modes.
- `install.sh`: the pin-scope limitation is stated in the file itself, so no reader is misled about what the digest covers.
- The four P1 findings and the seven P2 findings together account for every finding this run raised; no finding was dropped between the iteration narratives and the registry.

## Ruled Out

- **A silently fixed P2.** Ruled out: all seven were re-read at their cited lines and all seven are unchanged.
- **A finding raised twice under different ids.** Ruled out: the eleven registry entries map one-to-one onto the eleven findings in the iteration narratives, with no duplicate title or duplicate file:line pair.
- **A convergence stop reachable inside the cap.** Ruled out: the rolling average cannot fall below 0.1 while iterations 4 and 5 both recorded 1.0, and the dimension-coverage gate is blocked by the open P1 findings rather than by missing dimensions.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: the iteration cap is reached with all four dimensions complete and both cross-reference passes done
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference passes 1 and 2 complete
- Blocked/productive carry-forward: nothing blocked; the carry-forward set is four P1 and seven P2 findings, all re-read within the last two iterations
- Required evidence: the eleven registry entries, each with a file:line citation and a re-read iteration

Review verdict: CONDITIONAL
