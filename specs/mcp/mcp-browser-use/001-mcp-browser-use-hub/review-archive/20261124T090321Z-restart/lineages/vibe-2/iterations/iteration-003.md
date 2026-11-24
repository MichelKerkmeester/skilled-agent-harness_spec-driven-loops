# Review Iteration 003

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: traceability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- Artifact dir: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review/lineages/vibe-2`
- Session: `fanout-vibe-2-1795504079797-ay97sx`, generation 1, lineageMode new
- Sources read this iteration: `steer.md` (absent), `deep-review-strategy.md`, `deep-review-findings-registry.json`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`, `014-fix-deep-review-findings/{goal.md,acceptance-criteria.md,tasks.md,decision-record.md,implementation-summary.md}`

## How this iteration addressed the operator focus

The focus is a goal-criteria question, so this iteration is the one that answers it directly. It
walked the parent goal's seven completion criteria and phase 014's twenty acceptance rows, ran the
verification command each row names where the command is read-only, and followed the phase 014
closure claim into the registry that D1 names. Three rows did not survive that walk: one acceptance
row names a verification command that cannot produce its evidence, the registry D1 names was never
updated to record the closures, and one mode's recorded playbook run is mostly failing.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:1-60`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:1-80`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/tasks.md:27,45,52,57,64,99`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/decision-record.md:55`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261124T044326Z-restart/deep-review-findings-registry.json`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261124T070727Z-restart/deep-review-findings-registry.json`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh:25,34`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/{README.md,results.csv}`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md:1-40`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Two P1 findings from earlier iterations remain active: `R1-P1-001` (advisor id-noun anchor) and `R2-P1-003` (Aside session-dir guard).

### P2 Findings

1. **Acceptance row AC-013 names a verification command that cannot produce the evidence the row claims, and the row is marked Met** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:63` -- the row reads "Given the Aside example, When it runs with no argument, Then it writes under `./tmp/`" with verification "`rg -n 'OUT_DIR' mcp-aside-devtools/examples/repl-evidence-capture.sh` prints the `./tmp/` default". The script defines no `OUT_DIR`; it defines `SESSION_DIR="${2:-./tmp}"` at `repl-evidence-capture.sh:25`. Running the named command exits 1 with no output, so the row's stated evidence cannot be produced.
   Finding class: traceability
   Scope proof: the acceptance row and the script line it names are both inside the pre-bound scope list; the criterion, the command and the actual variable are cited at line level.
   Affected surface hints: `014-fix-deep-review-findings/acceptance-criteria.md`, `.skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh`, and any later review that re-runs the acceptance rows.
   Case: a follow-up review re-runs AC-013's verification command to confirm the row; it prints nothing and exits 1, so the reviewer cannot tell whether the row is Met or the command is stale.

2. **The findings registry that phase 014's D1 names was never updated to record the closures, so the record a follow-up review reads still shows every pre-014 finding active** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md:24` -- D1 reads "Every open finding in `../review/deep-review-findings-registry.json` is fixed or closed by a recorded decision. None is dropped." The closures are recorded in `tasks.md` by finding id (T004 closes `O1-I1-P1-001` and `R1-P1-001`, T011 closes `R2-P1-001`, T016 closes `R6-P2-001` with `R7-P2-001`, T023 closes the 005 halves), so D1's letter is satisfied. The registry itself was never updated: the closest pre-014 snapshot records 21 open and 2 resolved with 4 P1 and 17 P2, and the next snapshot records 33 open and 0 resolved.
   Finding class: traceability
   Scope proof: the goal decision, the tasks rows and both registry snapshots are inside the packet; the counts are read from the JSON rather than inferred.
   Affected surface hints: `014-fix-deep-review-findings/goal.md`, `014-fix-deep-review-findings/tasks.md`, `review/deep-review-findings-registry.json`, and the follow-up review the phase objective names.
   Case: the follow-up review the phase objective exists to enable opens the registry D1 names, sees 3 P1 and 30 P2 active with 0 resolved, and cannot tell which of them phase 014 closed without reading `tasks.md` instead.

3. **The Chrome DevTools playbook's recorded run is 4 PASS and 13 FAIL, and the failures are attributed to stale scenario text that was never corrected** -- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md:9-13` -- the report states "Verdict: FAIL" and "Tally: 4 PASS, 13 FAIL", and explains that "Most failures are stale scenario text, not broken tools": five scenarios pipe `bdg` text output into `jq`, and five MCP scenarios use a top-level `await` that Code Mode rejects. The parent goal's criterion "Each of the three modes has a manual testing playbook with a recorded run" is satisfied because a run is recorded, so this is not a criterion failure; it is a `playbook_capability` gap, because the playbook still teaches the failing forms.
   Finding class: traceability
   Scope proof: the report is inside the pre-bound scope list and inside the mode packet the parent goal names; the verdict, the tally and the two failure classes are cited at line level.
   Affected surface hints: `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--remaining-live/README.md`, the five `jq`-piping scenarios under `manual-testing-playbook/`, and the five `mcp-parallel-instances/` scenarios.
   Case: an agent follows `manual-testing-playbook/console-and-network/console-list.md` as written, pipes `bdg console --list` into `jq`, and gets a parse error, because the scenario was never updated to `--json`.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | pass | `goal.md:1-60` vs the tree | Six of the seven parent criteria hold on the tree; the seventh (`validate.sh --strict --recursive`) is blocked for this lineage by the dispatch write limits |
| `checklist_evidence` | partial | `acceptance-criteria.md:1-80`, `tasks.md:45-64` | 19 of 20 acceptance rows hold; AC-013's named verification command cannot produce its evidence |
| `playbook_capability` | partial | `remaining-live/README.md:9-13` | All three modes have a recorded run; the Chrome DevTools run is 4 PASS / 13 FAIL and the failing scenario text was not corrected |

## Integration Evidence

- `rg -n 'OUT_DIR' .skilled/skills/mcp-browser-use/mcp-aside-devtools/examples/repl-evidence-capture.sh` exited 1 with no output, while `rg -n 'SESSION_DIR'` printed `SESSION_DIR="${2:-./tmp}"` at line 25.
- `review-archive/20261124T044326Z-restart/deep-review-findings-registry.json` records `openFindingsCount: 21`, `resolvedFindingsCount: 2`, `findingsBySeverity: {P0:0,P1:4,P2:17}`.
- `review-archive/20261124T070727Z-restart/deep-review-findings-registry.json` records `openFindingsCount: 33`, `resolvedFindingsCount: 0`, `findingsBySeverity: {P0:0,P1:3,P2:30}`.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv` marks every row "Raw output not retained", which is the disclosure AC-016 requires, and every path its README cites resolves under the playbook.
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/` holds seven recorded runs, and `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/` holds one, so all three modes have a recorded run.

## Edge Cases

- **D1's named path no longer resolves.** `../review/deep-review-findings-registry.json` was moved into `review-archive/20261124T070727Z-restart/` by this run's restart, so the path D1 names is absent on the current tree. Recorded as an edge case rather than a finding because the move is an artifact of the current fan-out run, not of phase 014.
- **The seventh parent criterion is blocked, not failed.** `validate.sh --strict --recursive` is a repo-wide write-capable command that this lineage's dispatch forbids, so the criterion is recorded as blocked for this lineage and left to the merge.
- **The Chrome DevTools report has no `results.csv`.** Its aggregate table lives in the README instead. The criterion asks for "a recorded run", not for a specific file, so the absence is not a finding.
- **Phase 014's defect count does not match the registry.** The summary says "2 P1 and 18 P2"; the pre-014 snapshot says 4 P1 and 17 P2 open. Recorded inside finding 2 rather than as a separate finding, because the count difference is a symptom of the same un-updated registry.

## Confirmed-Clean Surfaces

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`: the three-mode registry criterion, the six-mode `mcp-tooling` criterion, the stale-id criterion, the parent-skill-checker criterion and the per-mode recorded-run criterion all hold on the tree.
- `014-fix-deep-review-findings/acceptance-criteria.md`: AC-001 through AC-012 and AC-014 through AC-020 hold; AC-009's `browser-debugger-cli@alpha` search prints nothing and AC-002's `npx -y bladebro` search prints only gated, pinned hits.
- `014-fix-deep-review-findings/tasks.md`: every task names the finding ids it closes, which is the recorded decision D1 asks for.
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/`: every cited path resolves and every unretained row says so.

## Ruled Out

- **A mode has no recorded playbook run.** Ruled out: Bladebro has one report, Aside has seven, and Chrome DevTools has three with the aggregate table in the README.
- **The ClickUp evidence citations are broken.** Ruled out: every path the README cites resolves under the playbook, and every `results.csv` row discloses that raw output was not retained.
- **Phase 014 dropped a finding.** Ruled out: `tasks.md` names the finding ids each task closes, so no finding is silently dropped; the gap is that the registry was not updated to match.
- **The parent goal's stale-id criterion regressed.** Ruled out in iteration 1 and re-confirmed here: the search prints no match.

## Next Focus

- Dimension: maintainability
- Focus area: the hub SKILL.md and ROUTER.md prose against the registries, the changelog convention, and the Aside capture example's structure
- Reason: traceability is covered; maintainability is the last configured dimension and the packet carries a large documentation surface
- Rotation status: correctness, security and traceability complete; maintainability not started
- Blocked/productive carry-forward: the `validate.sh --strict --recursive` criterion stays blocked for this lineage; the Chrome DevTools playbook is productive and may be revisited under maintainability
- Required evidence: file:line citations from the pre-bound scope list

Review verdict: CONDITIONAL
