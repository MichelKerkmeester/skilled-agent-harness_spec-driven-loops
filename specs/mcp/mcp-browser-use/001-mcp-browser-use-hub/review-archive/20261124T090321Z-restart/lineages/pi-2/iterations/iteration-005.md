# Iteration 005: Traceability cross-reference sweep over the remaining acceptance criteria

## Dimension

traceability (D3), cross-reference only. Each pass so far covered one dimension and settled the criteria it touched; this pass sweeps the 014 acceptance rows that none of them re-checked, so `checklist_evidence` can be judged on the whole table rather than on the rows a single dimension happened to touch. Operator review focus is unchanged: every phase's shipped work against its goal criteria, with the 014 fixes as the centre.

## Sources

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md` (AC-003 to AC-016, AC-018 to AC-020)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{003-mode-relocation,004-bladebro-mode,011-bdg-eval-port-note}/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/003-mode-relocation/acceptance-criteria.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/{SKILL.md,README.md,references/troubleshooting.md}`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/manual-testing-playbook/manual-testing-playbook.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/{README.md,results.csv,source.md}`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/changelog/v1.0.27.0.md`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled/results.csv`

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 16 read or grepped
- New findings: P0=0 P1=0 P2=0
- Refined findings: none
- New findings ratio: 0.0 (no new weighted units against a running total of 6 findings)

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The three P2 findings from iterations 1, 3 and 4 and the P1 from iteration 2 are unchanged and still active; their evidence was re-read below.

## Traceability Checks

| Protocol | Status | Gate | Evidence | Notes |
|---|---|---|---|---|
| checklist_evidence | partial | hard | specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/acceptance-criteria.md:84 | Every row re-checked this pass holds; AC-002 remains the one row whose stated verification does not hold, so the protocol stays partial. |
| spec_code | partial | hard | .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/lexical.ts:30 | Unchanged: the scorer contract is not fully met. |
| playbook_capability | pass | advisory | .skilled/skills/mcp-browser-use/mcp-bladebro/manual-testing-playbook/real-browser/attach-mode-reads.md:30 | BB-015 states the branded Chrome 136+ refusal and three builds that satisfy it, and its triage section treats a refused debug port as a precondition FAIL. |

Acceptance rows re-checked this pass and holding:

- AC-003: 003 and 004 each show five ticked criteria and `completion_pct: 100`.
- AC-004: `003-mode-relocation/acceptance-criteria.md:92` reads `Closeable: Yes`, and no 003 surface still carries "Await operator choice on AC-002".
- AC-006: 011's criterion is a presence check, and the only `rg -c` text left is in the goal log rows that record the old count, which the closure statement says is expected.
- AC-007: `rg -n "TBD|505-mcp-browser-use-hub"` on the parent spec prints nothing.
- AC-011: `changelog/v1.0.27.0.md` exists, is titled "the dom eval port note", and `git diff --stat HEAD` over it is empty, so it matches its published text.
- AC-012: every `page.on(` and `page.context()` hit in the Aside packet is a gap statement (`SKILL.md:147,202-205`, `README.md:189`, `references/troubleshooting.md:79`); none teaches the call as working.
- AC-014: the Aside playbook root states that the validator derives the counts from the tree and names no hand-typed census.
- AC-015: `attach-mode-reads.md:30` carries the Chrome 136+ precondition, `:46` the non-default data directory workaround, and `:70` the triage row.
- AC-016: the ClickUp report folder holds `README.md`, `results.csv` and `source.md`, and the cells that would have cited raw output say it was not retained instead of pointing at a missing file.
- AC-018 to AC-020: the 2026-11-24 replay shows `mcp-browser-use` at 0 on all 18 out-of-domain rows, every original and paraphrase row passes, and the single failing row is the playbook row already recorded as deferred.

Carried-forward findings re-read, all still active:

- `PI2-I1-P2-001`: `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md:135` still reads `In Progress` for 014.
- `PI2-I1-P2-002`: `001-research/research/research.md:57` still carries the ungated `npx -y bladebro mcp` row.
- `PI2-I2-P1-001`: `lanes/lexical.ts:30` still declares `staging` as a hint, and `fusion.ts:1229` still treats any hint as the naming anchor.
- `PI2-I3-P2-001`: `.utcp_config.json` still registers `chrome_devtools_live` with `--autoConnect` and no gate in the packet's rules.
- `PI2-I4-P2-001`: `ROUTER.md:53` still omits the eight Chrome DevTools keywords the router applies.

## Integration Evidence

- The acceptance table, the replay report and the ClickUp report are the three evidence surfaces 014 rests on; all three were read directly this pass, so the partial `checklist_evidence` status is narrowed to one row rather than left as a blanket doubt.

## Edge Cases

- Criteria whose only proof is a validator or a checker (`parent-skill-check.cjs`, `validate-playbook-package.cjs`, `validate.sh`) are not re-run in this lineage, which is write-bound to its own directory. They keep packet evidence and are named in the report's audit appendix rather than counted as verified here.
- A zero-finding pass is recorded as zero rather than padded: the sweep had a defined target (the un-rechecked acceptance rows) and the target was exhausted.

## Ruled Out

- AC-003, AC-004, AC-006, AC-007, AC-011, AC-012, AC-014, AC-015, AC-016, AC-018, AC-019, AC-020: each re-checked above, each holding.
- Re-raising the deferred MBU-PB-04 row: the criteria that 014 and the parent goal set are scoped so that it does not block them, and it is disclosed in the replay report; it is listed as follow-up work in synthesis instead.

## Recommended Next Focus

The compiled-routing slice that scope discovery bound but no pass has read: `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/` (policy card, registry compiler, router, canary cases) and the `013-live-activation` manifests, read for correctness against the hub's advertised three-mode contract.

Review verdict: CONDITIONAL
