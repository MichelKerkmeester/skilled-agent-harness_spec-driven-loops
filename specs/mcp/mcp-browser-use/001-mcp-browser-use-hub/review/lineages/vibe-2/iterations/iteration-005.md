# Review Iteration 005

## Dispatcher

- Mode: review
- Target: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- Dimension: cross-reference (all four canonical dimensions already complete)
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change
- Lineage: sessionId `fanout-vibe-2-1795511024070-2cuwlj`, generation 1, lineageMode new
- Iteration: 5 of 7

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:65` -- the BINDING rule and its phase table
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:118` -- the Progress table, rows 120 to 131
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/goal.md:58` -- the three phase 015 completion criteria
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/implementation-summary.md:55` -- the claimed fix sites
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/tasks.md:50` -- the canary task and its recorded evidence
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/fixtures/canary-cases.v1.json:159` -- the three-mode bundle canary case
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/results.csv:1` -- the 52-row replay
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/README.md:101` -- the recorded known limitations
- `.skilled/skills/system-skill-advisor/changelog/v2.0.3.0.md:1` -- the advisor 2.0.3.0 release note
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl:52` -- the re-pinned doctor control row
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261124T070727Z-restart/review-report.md:3` -- the generation 2 report the goal row cites
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261124T090321Z-restart/review-report.md:3` -- the newest archived report

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Four P1 findings from iterations 1 to 3 remain active and keep this iteration's verdict at CONDITIONAL.

### P2 Findings

1. **The parent goal's BINDING table stops at phase 014 while the packet ships a fifteenth phase** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:70` -- The BINDING table lists fourteen rows, `001-research` through `014-fix-deep-review-findings` (`goal.md:70-83`), and the section's own rule at `goal.md:65-66` says each child goal "is authoritative for its phase and binds as if written here". `015-fix-follow-up-review-findings/goal.md` exists on disk and the same file's Progress table records it as Done at `goal.md:131`, so the packet both ships and credits a phase whose goal the directive never binds. Phase 015 is the phase that carries the advisor id-noun change and the Aside installer pin, and its own decisions D1 to D3 (including "A moved advisor pin lands only with the operator's approval") therefore bind nothing.
   Finding class: traceability
   Scope proof: both files are inside the declared review target; the omission is visible by comparing the BINDING row count against `ls -d 0*` of the packet root, which returns fifteen phase folders.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/goal.md`
   Case: an evaluator or a follow-on agent reads the BINDING table to learn which child goals are authoritative, finds fourteen rows, and treats phase 015's decisions as unbound background rather than as binding constraints.

2. **The parent goal cites a review report path that no longer resolves** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:129` -- The Progress row reads "Deep review 2026-11-24 | Done, FAIL | Four opus-medium lineages, 28 iterations: 0 P0, 2 distinct P1, 18 distinct P2. Report at `review/review-report.md`". The packet's `review/` directory holds `deep-review-config.json`, five fan-out files, `lineages/`, `observability-events.jsonl` and `orchestration-status.log`, and no `review-report.md`. The report the row describes is `review-archive/20261124T070727Z-restart/review-report.md`, whose opening line matches the row exactly ("Four lineages (opus-1 to opus-4, cli-claude-code `claude-opus-5-5`), 7 iterations each, 28 iterations in all") and whose counts match too (3 P1 entries folding to 2 defects, 30 P2 entries folding to 18 distinct). The numbers are right; only the path is stale, and it went stale when the run was archived on restart.
   Finding class: traceability
   Scope proof: the citation and the archive are both inside the declared review target; `find` over the packet returns three `review-report.md` files, all under `review-archive/`, and none at the cited path.
   Affected surface hints: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`, `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/review-archive/20261124T070727Z-restart/review-report.md`
   Case: a reader follows the cited path to check the FAIL verdict and the 2 P1 / 18 P2 counts, finds no file, and cannot tell whether the report was deleted, superseded, or never written.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | Carried: the hub version-authority invariant is broken at `README.md:8` (iteration 3) and the same convention is unenforced across the mode READMEs (iteration 4). New: the parent directive does not bind phase 015 (finding 1). |
| `checklist_evidence` | partial | Carried from iteration 3: phase 006 cites a superseded Chrome DevTools run. New: the parent goal's own evidence row cites a path that does not resolve (finding 2). |
| `skill_agent` | pass | Carried: `parent-skill-check.cjs` exits 0 and names the hub. |
| `agent_cross_runtime` | notApplicable | No agent definition carries hub logic. |
| `feature_catalog_code` | fail | Carried from iteration 2: the Aside install catalog documents an unpinned path that decision D2 forbids. |
| `playbook_capability` | pass | Carried: all three modes carry a playbook with a recorded run. |

## Integration Evidence

- **Phase 015 criterion 1, routing half.** `canary-cases.v1.json:159` holds `three-mode-ids-ordered-bundle` with `expectedSelectionKind: "orderedBundle"` and all three modes in `expectedModes`. The replay row `MBU-B-01` in `results.csv` records `route`, `orderedBundle`, `mcp-chrome-devtools+mcp-aside-devtools+mcp-bladebro`, `stage1 true`, `stage2 true`, `PASS`. The criterion holds.
- **Phase 015 criterion 1, harness half.** `tasks.md:50` records `without alias exit=1` ("gold mismatch") and `restored exit=0`. The harness is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/harness/build-artifacts.cjs`; it was not executed here because it writes build artifacts outside this lineage's write surface, so the recorded evidence is accepted as recorded and not re-proven.
- **Phase 015 criterion 3.** `results.csv` holds 52 scenario rows with exactly one `FAIL`, `MBU-PB-04`, and `README.md:101` records it as a known limitation ("MBU-PB-04 still gets no advisor recommendation. The front door routes it to Chrome DevTools."). The criterion holds as written.
- **Advisor 2.0.3.0 id-noun change, end to end.** `changelog/v2.0.3.0.md:15` claims "staging site", "staging url", "staging website" and "staging portal" still route to the hub. Live: `skill-advisor.cjs advisor_recommend --prompt "staging site"` returns `mcp-browser-use` at confidence 0.82. The same changelog's doctor claim is also live: `doctor-prompts.jsonl:52` re-pins `doctor-none-04` to `expected_top: null`, and `--prompt "my doctor update came in"` returns zero recommendations with `ambiguous: false`.
- **Hub keyword removal.** `hub-router.json` contains no `staging` and no `code-mode` entry, and the hub `SKILL.md:10` keyword comment lists no `mcp-code-mode`, matching the changelog's "The browser hub no longer lists `mcp-code-mode` among its keywords".
- **Parent completion criteria, whole checklist.** All fifteen phase `goal.md` files carry zero unchecked criteria; `015/tasks.md` and `015/acceptance-criteria.md` carry zero unchecked items. `001-research/research/deep-research-state.jsonl` holds 12 iteration records against the "at least 10" criterion. Criteria 2, 3, 4 and 6 were verified clean in iterations 1 to 4. Criterion 7 (`validate.sh --strict --recursive`) was not re-run: this lineage's write surface forbids it, so it stands on the recorded evidence only.

## Edge Cases

- **Two findings land on the same file.** Both new findings are bookkeeping defects in `goal.md`. They are reported separately because they have different fixes and different readers: the BINDING table governs which child goals bind, the Progress row governs where the evidence lives. Neither is a duplicate of the other.
- **The stale path is not a missing report.** The report exists three times under `review-archive/`. The finding is scoped to the citation, not to the report's content, and the generation 2 numbers were checked against the archive and match.
- **The canary harness was not executed.** Running `build-artifacts.cjs` writes outside this lineage's write surface, so the harness half of phase 015 criterion 1 rests on the recorded `tasks.md:50` evidence. This is recorded as unverified rather than as clean.
- **`validate.sh` was not executed.** Same reason. Criterion 7 is carried on recorded evidence.
- **The advisor changelog is outside the review target.** It is cited as context evidence for the operator focus only; no finding is raised against it, and the two live probes confirm its claims rather than contradict them.

## Confirmed-Clean Surfaces

- All fifteen phase `goal.md` files: zero unchecked completion criteria.
- `015-fix-follow-up-review-findings/tasks.md` and `acceptance-criteria.md`: zero unchecked items.
- `canary-cases.v1.json:159`: the three-mode bundle case asserts `orderedBundle` with all three modes, matching live front-door behaviour.
- `results.csv`: 52 rows, one `FAIL`, and that row is the documented MBU-PB-04 limitation.
- `doctor-prompts.jsonl:52` plus the live probe: the doctor control row is re-pinned and routes nowhere.
- `hub-router.json`: no `staging` and no `code-mode` entry.
- `001-research/research/deep-research-state.jsonl`: 12 iteration records, above the "at least 10" criterion.

## Ruled Out

- **The generation 2 review counts are wrong.** Ruled out: `review-archive/20261124T070727Z-restart/review-report.md:3` states four opus lineages, 7 iterations each, 28 in all, and its section 1 folds 3 P1 entries to 2 defects and 30 P2 entries to 18 distinct. The goal row's "0 P0, 2 distinct P1, 18 distinct P2" matches.
- **A missing phase 015 goal document.** Ruled out: `015-fix-follow-up-review-findings/goal.md` exists with three checked criteria and a Progress table.
- **The advisor id-noun change regressed the staging anchor.** Ruled out: "staging site" still returns the hub at 0.82 live, and the hub's own MBU-PB-04 failure is the pre-existing long-prompt dilution recorded at `README.md:101`, not a new regression.
- **The doctor control row was left un-re-pinned.** Ruled out: `doctor-prompts.jsonl:52` carries `expected_top: null` and the live probe returns no recommendation.

## Next Focus

- Dimension: cross-reference
- Focus area: the remaining core protocol `spec_code` and the two open P1 surfaces, re-read against current source to decide whether any can be closed before the iteration cap
- Reason: the cross-reference pass found only bookkeeping defects; the four active P1 findings are the ones that decide the verdict and none has been re-read since it was raised
- Rotation status: correctness, security, traceability and maintainability complete; cross-reference pass 1 of 2 complete
- Blocked/productive carry-forward: the version-consistency scan and the phase-goal checklist are exhausted as sources of new findings
- Required evidence: file:line citations from `router.cjs`, `SKILL.md`, `ROUTER.md`, the Aside install catalog and the hub README, each re-read in the iteration that closes or carries it

Review verdict: CONDITIONAL
