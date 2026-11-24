# Review Iteration 005

## Dispatcher

- **Mode**: review
- **Target**: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub` (spec-folder)
- **Dimension**: traceability
- **Operator review focus**: every phase's shipped work against its goal criteria, including the phase 014 fixes and the advisor scorer change it made
- **How this iteration addressed the focus**: it verified the parent criteria that rest on artifacts and on a checker run -- criterion 1 (research iterations), criterion 4 (parent-skill checker), criterion 6 (a recorded run per mode) -- and checked every child phase's goal criteria for unchecked items. It also compared the parent spec's summary of phase 005 against 005's own status row.
- **Sources read**: `goal.md`, `spec.md`, `001-research/research/deep-research-state.jsonl`, `005-routing-and-surfaces/spec.md`, all twelve child `goal.md` files, `.skilled/commands/doctor/scripts/parent-skill-check.cjs`, `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md`, the hub and per-mode `benchmark/reports/` trees, and the 2026-11-24 replay CSV

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:100-140`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:53`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/005-routing-and-surfaces/spec.md:23,140,149,150`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-state.jsonl:1-31`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{002,003,004,005,006,007,008,009,010,011,012,013}-*/goal.md` (criteria blocks)
- `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1` (executed read-only)
- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:60-62`
- `.skilled/skills/mcp-browser-use/benchmark/reports/` and each mode's `benchmark/reports/`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The parent spec overstates phase 005's unmet requirements** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:53` -- The parent status row says "005 still records REQ-003 and REQ-008 as not met as written". Phase 005's own status row says something narrower: "REQ-003 met at the default threshold but not at `--threshold 0.5`; REQ-008 held only after the browser fixtures were relabeled" (`005-routing-and-surfaces/spec.md:23`). REQ-003 is therefore met at the default threshold, and REQ-008 held. The 2026-11-24 replay corroborates the narrower reading: its `mcp_tooling_above_threshold` column is `false` on all 49 rows, so `mcp-tooling` does not score above threshold on any recorded browser request.
   Finding class: traceability
   Scope proof: both rows are canonical packet docs inside the declared target.
   Affected surface hints: parent `spec.md` status row; `005-routing-and-surfaces/spec.md` status row and REQ-003/REQ-008 rows.
   Case: a reader opens the parent spec to decide whether `mcp-tooling` still competes for browser requests, reads that REQ-003 is "not met as written", and schedules remediation for a requirement that is met at the default threshold.

2. **The playbook index names a superseded run as the latest** -- `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md:62` -- The index says "The latest recorded run is `2026-11-21--manual-testing-playbook--hub-routing--post-review`", and names the destination as `.skilled/skills/mcp-browser-use/benchmark/reports/<dated-run-label>/`. That directory now also holds `compiled-routing/2026-11-24--two-stage-replay--compiled`, and each mode's own `benchmark/reports/` holds runs dated 2026-11-22. A reader who follows the index to the newest routing evidence lands three days early and misses the 49-row replay that the 014 work produced.
   Finding class: traceability
   Scope proof: the index and the report trees it points at are shipped files of the declared target's hub.
   Affected surface hints: `.skilled/skills/mcp-browser-use/manual-testing-playbook/manual-testing-playbook.md` result-persistence section; `.skilled/skills/mcp-browser-use/benchmark/reports/README.md`.
   Case: an operator asks for the most recent hub-routing evidence, is pointed at the 2026-11-21 post-review run, and never sees the 2026-11-24 two-stage replay that supersedes it for routing questions.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|----------|--------|----------|---------|
| `spec_code` | pass | `.skilled/commands/doctor/scripts/parent-skill-check.cjs:1` | Parent criterion 4 holds by execution: the checker run against `.skilled/skills/mcp-browser-use` printed `INFO: Parent skill: .skilled/skills/mcp-browser-use` and `OK: parent-skill-check — all hard invariants passed, 0 warnings`, exit 0. |
| `checklist_evidence` | pass | `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/research/deep-research-state.jsonl:1` | Parent criteria 1 and 6 hold: the research state log carries 12 `type: "iteration"` records (criterion 1 asks for at least 10) and `research.md` exists at 33,096 bytes; all three modes have recorded runs under their own `benchmark/reports/`, including `mcp-bladebro/benchmark/reports/2026-11-21--manual-testing-playbook--macos-live` for the live macOS Bladebro run. |

## Integration Evidence

- `.skilled/commands/doctor/scripts/parent-skill-check.cjs` -- the parent-skill checker named by parent criterion 4 and by `.skilled/scripts/git-hooks/pre-commit:593`; executed read-only (it contains no write call) and returned exit 0 with 0 warnings.
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv` -- the 49-row replay whose `mcp_tooling_above_threshold` column is `false` throughout, corroborating REQ-003 at the default threshold.
- `.skilled/skills/mcp-browser-use/{mcp-chrome-devtools,mcp-aside-devtools,mcp-bladebro}/benchmark/reports/` -- the per-mode recorded runs that satisfy criterion 6.

## Edge Cases

- **Ambiguity: is the playbook index's "latest recorded run" claim scoped to the hub-routing corpus?** The sentence sits in the hub-level index and names the hub's `benchmark/reports/` root as the destination, which now holds the compiled-routing replay. Read as scoped to the hub-routing corpus alone, the claim is true. Kept at P2 with the ambiguity recorded rather than raised, because the impact is a reader landing on older evidence, not a wrong result.
- **Missing dependency: parent criterion 7 and 014 criterion 6 rest on `validate.sh --strict --recursive`, which this lineage may not run.** Recorded as unverified, not as passed or failed.
- **Missing dependency: 014 criterion 1 rests on `node --test .skilled/bin/tests/mcp-installers.test.cjs`, which this lineage did not run.** Recorded as unverified.
- **Partial success**: parent criteria 1, 2, 3, 4 and 6 are now verified from shipped artifacts or a read-only checker run. Criterion 5 is partly verified (per-mode requests hold; a plain-language request does not, finding R4-P1-001). Criterion 7 is unverified.

## Confirmed-Clean Surfaces

- Every one of the twelve child phases has all of its goal criteria checked: 002 (4), 003 (5), 004 (5), 005 (5), 006 (6), 007 (4), 008 (5), 009 (5), 010 (3), 011 (3), 012 (3), 013 (5), with zero unchecked items in any file.
- The parent-skill checker's 40-plus invariants all pass, including `5k-alias` (every registry alias is a keyword of its routerSignal classes), `5k-canary` (every routerSignals mode is the expected route of a canary case), `10b-byte-drift` (the committed `leaf-manifest.json` matches a fresh regeneration byte for byte) and `13a-version`/`13b-version`/`13d-packet-version` (all JSON routing files and all three mode packets carry version 1.1.2.0, matching the newest changelog entry).
- Parent criterion 1 holds: 12 iteration records, above the "at least 10" the criterion asks for.
- Parent criterion 6 holds on the artifact side for all three modes, including the live macOS Bladebro run.

## Ruled Out

- **A child phase shipping with unchecked goal criteria**: ruled out -- all twelve child goal files have zero unchecked criteria.
- **The parent-skill checker failing or not naming the hub**: ruled out by execution -- exit 0, 0 warnings, and the hub path printed as the subject.
- **The research loop falling short of D1's ten iterations**: ruled out -- 12 records.
- **A mode missing a recorded playbook run**: ruled out -- each of the three modes has its own `benchmark/reports/` tree with at least three dated runs.

## Next Focus

- **Dimension**: maintainability
- **Focus area**: the hub's documentation and metadata discipline -- the changelog entries against the changes they claim, the `README.md` and `ROUTER.md` structure, the `graph-metadata.json` files, and the `benchmark/reports/README.md` indexes.
- **Reason**: traceability has now covered the criteria, the child phases, the checker and the recorded runs. Maintainability is the last unreviewed dimension and the packet ships a large documentation surface.
- **Rotation status**: correctness, security and traceability complete; maintainability remains.
- **Blocked/productive carry-forward**: productive -- running the read-only checker settled criterion 4 in one call instead of inferring it from prose.
- **Required evidence**: file:line for each changelog claim checked against the tree, and for each documentation index that names a path.

Review verdict: CONDITIONAL
