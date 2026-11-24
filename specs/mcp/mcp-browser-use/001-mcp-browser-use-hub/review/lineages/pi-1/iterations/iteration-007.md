# Review Iteration 007

## Dispatcher

- Mode: review (fan-out lineage `pi-1`, generation 1)
- Dimension: traceability (consolidation pass)
- Review target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This is the last iteration under the cap and it closes the focus by testing the 2.0.3.0 changelog's own ratchet claim against the replay artifact: that no browser replay row changed between pass and fail.

## Files Reviewed

- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv` (all 52 rows, `before_verdict`, `verdict`, `before_route_action`, `route_action`)
- `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:40-46`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/goal.md:40-56`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/implementation-summary.md:55-75`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/SKILL.md:75` (carried P1, re-read for the last time)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The open P1 (`pi1-I3-P1-001`) is unchanged at `SKILL.md:75` and `doctor.sh:36`; it is carried into synthesis at its recorded severity.

### P2 Findings

None new.

## Traceability Checks

| Protocol | Class | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | The 2.0.3.0 changelog's ratchet sentence ("No browser replay row changed between pass and fail", `changelog/v2.0.3.0.md:44`) holds against the artifact: of 52 rows, exactly three differ between `before_verdict` and `verdict`, and all three are rows whose `before_verdict` reads `not-captured` — `MBU-N-19` and `MBU-N-20` now `defer` where nothing was captured, and `MBU-B-01` now `route`. No row flipped between `PASS` and `FAIL`. The status stays `partial` only for the carried D2 contradiction. |
| `checklist_evidence` | core | pass | Phase 015's three fixes each own one replay row and each passes: `MBU-B-01` (`use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro`) routes, `MBU-N-19` (`fix the code in the parser`) defers, `MBU-N-20` (the staging loader prompt) defers. The one `FAIL` is `MBU-PB-04`, the staging-site network-inspection playbook row, which the phase log already names as the known stage-one gap (`015/goal.md:53`). |
| `feature_catalog_code` | overlay | pass | Unchanged from iteration 6. |
| `playbook_capability` | overlay | partial | `MBU-PB-04` is the live specimen of the playbook gap: a prompt that names staging and network inspection fails stage one while the packet documents the capability. It is a known limitation recorded by the packet, not a new finding, and it is the one row the phase log declines to claim. |

## Integration Evidence

- The replay artifact's `route_action` column is the front door's decision and the `stage1`/`stage2` columns are the two-stage split, so a single row tests both surfaces the hub owns; `MBU-PB-04` carries `stage1: false`, `stage2: true`, which localises the gap to the hub's stage-one vocabulary rather than the mode packet.
- `015/implementation-summary.md`'s evidence row ("Replay 51 of 52 PASS") matches the artifact count for the third time in this run, from three different readers (index table, CSV count, row-by-row verdict extraction).

## Edge Cases

- **Three rows "changed" without a regression.** A naive diff of `before_verdict` to `verdict` reports three changes; all three are rows added by phase 015, whose prior state is the literal `not-captured`. Counting them as regressions would have inverted the changelog's true claim.
- **The loop cannot legally stop on its own here.** `convergence.cjs` returned `CONTINUE` with `reasonDetail: noStopCandidate` at iteration 6, and its `dimensionCoverageGate` reads `traceabilityCovered`, which is false while a core protocol is `partial`. That is the correct consequence of an open spec contradiction: this lineage reaches its iteration cap instead of converging, and synthesis must say so rather than present a converged stop.
- **The last-iteration protocol reservation did not fire.** Both core protocols were recorded in this run (`spec_code` in iterations 1, 2, 4, 5, 6 and this one; `checklist_evidence` likewise), so the cap was not needed to finish them.

## Confirmed-Clean Surfaces

- The three phase-015 replay rows pass and no prior row regressed.
- The only failing replay row is the pre-existing, packet-documented `MBU-PB-04`.
- The advisor 2.0.3.0 ratchet claim is true against the artifact it cites.

## Ruled Out

- **The advisor 2.0.3.0 change regressed a browser replay row** -- ruled out: zero PASS/FAIL flips across 52 rows.
- **The three changed rows are unrecorded regressions** -- ruled out: each carries `not-captured` as its prior state and each is a phase 015 case.
- **The carried P1 was closed** -- ruled out on a final re-read at `SKILL.md:75`.

## Next Focus

- Loop ends at the iteration cap. Synthesis consolidates six finding rows (one P1, eight P2) and the four traceability protocol statuses.

Review verdict: CONDITIONAL
