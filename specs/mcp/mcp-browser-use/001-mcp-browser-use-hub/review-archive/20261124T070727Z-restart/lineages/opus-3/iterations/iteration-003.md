# Iteration 003 — Traceability

## Dispatcher

- Lineage: opus-3 (fan-out), session `fanout-opus-3-1795495435655-lf6jf3`, generation 1
- Dimension: traceability
- Operator focus (every phase's shipped work against its goal criteria): this pass re-ran the goal criteria of phases 006-013 that can be run read-only (guard, playbook and catalog validators, recorded-run tallies, stale-pointer greps, the positional-JSON grep, advisor positive and negative controls, sk-code router sync) and compared each with its ticked box.
- Sources: no `steer.md` present.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/0{06..13}-*/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` (phase handoff table, lines 140-153)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/010-mcp-tooling-browser-pointers/spec.md:67`, `013-.../spec.md:120,150`, `013-.../tasks.md:47,71`, `011-.../implementation-summary.md:91`, `012-.../implementation-summary.md:102`
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-21--two-stage-replay--compiled/results.csv`
- `.skilled/skills/mcp-browser-use/mcp-bladebro/benchmark/reports/2026-11-22--manual-testing-playbook--clickup-real-browser/results.csv`
- `.skilled/skills/mcp-browser-use/mcp-aside-devtools/benchmark/reports/2026-11-22--manual-testing-playbook--signed-in-live/results.csv`
- `.skilled/skills/mcp-browser-use/mcp-chrome-devtools/references/troubleshooting.md` (lines 327-499, 826)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **011's goal criterion and the parent handoff row no longer reproduce: the guide count is 5, not 3** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/011-bdg-eval-port-note/goal.md:56` -- The ticked criterion says `rg -c 'Session target not found|returnByValue'` on the troubleshooting guide "prints 3", and the parent handoff row 011→012 (`spec.md:151`) uses the same check. Today it prints 5: 013's fixes added matching lines (`troubleshooting.md:499` `returnByValue` in a corrected `bdg cdp` example and `:826` in the exit-code table). The note 011 shipped is still there (`troubleshooting.md:467-472`), so the outcome holds, but an equality count on a file later phases edit cannot be re-run as proof.
   Finding class: non-durable-criterion.
   Scope proof: `rg -c` prints 5; 011's own evidence (`011-.../implementation-summary.md:91`) recorded 3 before 013 ran.
   Affected surface hints: `011-bdg-eval-port-note/goal.md`, parent `spec.md` handoff table.
   Case: an auditor reruns 011's criterion verbatim to confirm the phase; it prints 5 and reads as a failed criterion.

2. **The parent handoff table still carries template placeholders for 006→007** -- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md:146` -- The row reads `[Criteria TBD] | [Verification TBD]` while every other transition names a check, and the phase map marks both phases Complete. The handoff from verification into the parity phase was never defined, so nothing records what 007 inherited from 006.
   Finding class: template-residue.
   Scope proof: `grep -n TBD spec.md` prints only this row.
   Affected surface hints: parent `spec.md` Phase Handoff Criteria.
   Case: a resume of 007 asks what 006 had to prove before 007 could start; the parent spec answers "TBD".

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| spec_code | pass | 006: compiled-routing `results.csv` 6 rows, 6 PASS (3 mode requests plus 3 tie-breaks). 007: `check-mcp-mutation-class.sh` prints `GUARD PASS` listing both Bladebro scripts. 008: Bladebro run 5 rows 4 PASS 1 FAIL, Aside signed-in run 15 rows 10 PASS 5 FAIL, three playbook validators exit 0, Bladebro catalog validator "0 violations". 009: `parent-skill-check.cjs .skilled/skills/sk-code` OK 0 warnings, `router-sync: 5/5 checks passed`. 010: stale-pointer `git grep` prints 0. 013: positional-JSON `rg` empty over the hub and adjacent skills; negative control returns no recommendation; own-Chrome attach request reaches `mcp-browser-use` → `mcp-chrome-devtools` (0.8996). |
| checklist_evidence | partial | 011 criterion count drifted (finding 1); 006→007 handoff undefined (finding 2). 012's out-of-repo run folder `~/.local/state/local-doc-alignment/Skilled/20261123T181518Z/` exists and holds `report.md` and `findings.json`. |
| playbook_capability | pass | Each mode has a recorded run folder with `README.md`, `results.csv`, `source.md`; parent goal criterion 6 holds. |

## Integration Evidence

- `.skilled/commands/doctor/scripts/check-mcp-mutation-class.sh` (GUARD PASS).
- `validate-playbook-package.cjs --package mcp-browser-use/{mcp-bladebro,mcp-aside-devtools,mcp-chrome-devtools}`: exit 0 each.
- `validate_catalog_package.py --package mcp-browser-use/mcp-bladebro`: "PASS: 0 violations".
- `.skilled/bin/skill-advisor.cjs advisor_recommend` positive and negative controls from 013.

## Edge Cases

- Criteria in 009-013 that require `validate.sh --strict --recursive` were not re-run: the lineage contract forbids that tool. Recorded as unverified, not as pass or fail.
- 007's "changelog coverage check prints 0 uncovered" names no script; not re-run. Deferred.
- The `results.csv` files start with a `#` provenance comment line; row counts above exclude it and the header.

## Confirmed-Clean Surfaces

- 006, 007, 008, 009, 010 and 013 runnable criteria all reproduce on the current tree.

## Ruled Out

- Recorded-run tallies disagreeing with goal claims: Bladebro 4/1 and Aside 10/5 match exactly.
- Remaining positional-JSON `bdg cdp` calls in the hub or in sk-code, mcp-tooling, mcp-code-mode: none.

## Verdict

No new P0/P1 this iteration; two P1 findings from iterations 1 and 2 stay active, so the verdict over active findings is CONDITIONAL.

## Next Focus

- Dimension: maintainability
- Focus area: doc and version drift across the hub (SKILL/README/changelog versions, 005's stale "servingAuthority legacy" claims vs the now-compiled route, parent goal/spec status consistency, duplicated helper libraries).
- Reason: last canonical dimension not yet covered.
- Rotation status: correctness, security, traceability done; maintainability remains.
- Required evidence: file:line for each drift.

Review verdict: CONDITIONAL
