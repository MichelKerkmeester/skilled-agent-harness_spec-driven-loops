# Review Iteration 003 - hook-close-3c

## Dispatcher

- Lineage: `hook-close-3c` (detached fan-out), session `fanout-hook-close-3c-1794596804847-827gze`, iteration 3 of 3 (final).
- Operator review focus (binding): the closing round must check the final state, not just the diff; every finding needs file:line and a concrete input run; a clean result must be stated plainly; the two settled decisions are not re-reported.
- Sources read: `review/review-scope-3c.txt`, both commit messages, the two changed test files, the three doc surfaces that describe the no-edit gate, the packet's pass-two acceptance rows, and the Known Limitations sections of phases 014 and 017. `steer.md` still does not exist.
- How this iteration addressed the focus: it is the traceability and maintainability rotation. It checks the test rows against the real module (can they fail?), the doc claims against the pattern and the callers, and the packet's acceptance rows against the final state. It finds no new defect and states that plainly; the P1 from iteration 2 stays active and keeps the verdict CONDITIONAL.

## Dimension

Traceability and maintainability.

## Files Reviewed

- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:1-267` — every new row and the fixture harness.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:24-148` — `SINGLE`, `NOEDIT4`, the scope-limit table, the settled-phrase table, the deep-loop table and the generated-table test.
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:132` and `runtime/lib/scorer/README.md:55` — the two prose descriptions of the no-edit gate.
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:36` — the catalog description of `commandMeaningEligible`.
- Commit messages `860610d783` and `846eab66b8` (the `-- .skilled` diffs plus their bodies).
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/017-review-pass-two-remediation/acceptance-criteria.md:56,82` and the phase-014/017 Known Limitations.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. The iteration-2 P1 (`HC3-P1-001`, the contracted "make changes" family) remains active and is carried forward; this iteration adds no new P1.

### P2 Findings

None new. The iteration-1 P2s (`HC3-P2-001`, `HC3-P2-002`) remain active and are carried forward.

## Traceability Checks

- `spec_code` — **pass**. Commit `860610d783` claims "It now reads the flag name first": verified by probes (`node -e1 <marker>` → `hook-missing`, `node -r./preload.cjs <marker>` → `ok`). Commit `846eab66b8` claims "Words alone cannot tell the two readings apart, so the phrase rules out a change whatever follows it. Tests pin both readings": the two rows at `tests/command-attach-guards.vitest.ts:80-85` both return `true` in the real module, and the five scope/attach rows in that file return the values the file pins (`probes/noedit-tests-probe.mjs`). Packet `017-review-pass-two-remediation/acceptance-criteria.md:56` claims four no-edit wordings; `NOEDIT4` at `tests/command-attach-guards.vitest.ts:30-35` is exactly those four, and all four return `true`. AC-027 at `:82` claims seven wrapper launches plus a quoted `echo`; the probe run in iteration 1 produced `ok` for the wrapper shapes and `hook-missing` for the quoted echo.
- `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; nothing to reconcile.
- `skill_agent` — **pass**. The attach gate and the three scorer/explainer call sites were read at their lines in iteration 2, and the doctor YAML consumers at `doctor-setup.yaml:40,61` and `doctor-symlink-check.yaml:37,60` in iteration 1.
- `agent_cross_runtime` — **not applicable**. Neither changed file is an agent definition or a runtime mirror; the changed surfaces are a script and a runtime library module, and no `.claude/agents/*` mirror describes them.
- `feature_catalog_code` — **pass**. `feature-catalog/scorer-fusion/command-meaning-matching.md:36` says a prompt matching `NO_EDIT_REQUEST`, "such as 'no edits', 'do not change', 'just show' or 'just list'", rules out every command on meaning and that `readOnlyRouteAllowed` reads the same pattern. Every listed example is a literal alternative in the pattern, and `fusion.ts:677` reads the same predicate; no drift.
- `playbook_capability` — **not applicable**. The advisor manual-testing playbook has no scenario for the no-edit gate or the hook-wiring check (content search over the playbook returned no row).

## Integration Evidence

- Exact surfaces exercised this iteration: the real module through `node --experimental-strip-types probes/noedit-tests-probe.mjs` (the five pinned rows) and the hook CLI through `probes/hook-probe.cjs` (iteration-1 fixtures retained).
- Doc surfaces read and compared: the two runtime READMEs, the feature-catalog page, the packet's pass-two acceptance rows and the two commits' messages.
- Not exercised: the two single test files as processes (the dispatch permits them but does not require them; the probe rows reproduce their assertions on the real module) and the `--json` path beyond iteration 1.

## Edge Cases

- **Stale phase-014 limitations.** `014-review-remediation/implementation-summary.md:158` still says `node --no-warnings`, `/usr/bin/env node` and `zsh -c` read as missing, and `:161` still says `scorer/text.ts` keeps its own no-edit pattern. Both statements are false at the final state (the tests at `tests/hook-wiring-check.test.cjs:145-183` and the shared predicate at `text.ts:150`). Read as a historical phase snapshot, not a live claim: phase 014's section is its close-out state, and phase 017 carries the current limitation list (`017/implementation-summary.md:167-179`). Recorded here rather than raised as a finding; the honest cost is that a reader who opens 014 first sees an outdated limitation.
- **Suite claims not re-run.** Both commits claim "184 files, 1798 passed"; the dispatch permits single test files only, and the probe evidence answers the closing questions. The claim is unverified in this lineage rather than passed.
- **Resource map absent.** `resource-map.md` does not exist at the packet root, so the Resource Map Coverage Gate section stays skipped, consistent with `config.resource_map_present: false`.
- **No steer.md.** Checked before init and at each iteration start; none exists, so no lead ruling applies.

## Confirmed-Clean Surfaces

- The new test rows can fail for the reason they state: every hook row drives the real process and asserts exit code plus printed line; every attach row asserts a value returned by the real predicate or the real `attachCommand`.

- The docs that describe the current behavior agree with the code: `runtime/lib/README.md:132` (a prompt matching the pattern gets no command — implemented at `command-attach.ts:338`), `runtime/lib/scorer/README.md:55` (the same pattern rules out every command on meaning — implemented at `fusion.ts:881`), and the feature-catalog page's examples.
- The packet's pass-two acceptance rows (AC-001, AC-027) hold at the final state for the four wordings and seven wrapper launches they name.
- The settled decisions are pinned where the operator said: `tests/command-attach-guards.vitest.ts:80-85` for the safe reading, and `tests/hook-wiring-check.test.cjs:248-267` for the not-wired shapes.

## Ruled Out

- **Reporting the stale phase-014 limitations as a P2.** Ruled out: phase summaries record their own close-out state, phase 017 supersedes the list with the current limitations, and neither statement describes the code the two commits under review changed. Evidence and the drift are recorded under Edge Cases so the operator can still see it.
- **A vacuous assertion in the generated-table test.** `tests/command-attach-guards.vitest.ts:137-147` reads the interface block and the README sentence and fails if a field is missing or the sentence omits one; it changes outcome with either artifact, so it is not vacuous.
- **A doc that claims the contracted `make changes` form is covered.** Searched the three doc surfaces that mention the gate; none names the contracted form, so the gap is a code gap (`HC3-P1-001`), not a doc/code contradiction.
- **The `sh` hook case missing from the test table.** Recorded as a known limitation at `017/implementation-summary.md:176`; not a defect the closing round can treat as new.

## Next Focus

- Dimension: none remaining.
- Focus area: synthesis.
- Reason: correctness (iteration 1), security (iteration 2), traceability and maintainability (this iteration) are covered; iteration 3 adds no new finding, so `newFindingsRatio` is 0 and the loop converges at the iteration cap.
- Rotation status: all four dimensions covered.
- Blocked/productive carry-forward: no blocked approach; the active P1 and two P2s are carried to synthesis unchanged.
- Required evidence: the reconciliation of the registry, the three iteration files and the review report at synthesis.

## Verdict

No new finding. The final state is traceable to the commits, the packet's acceptance rows, and the docs that describe it; the two settled decisions are pinned by tests. One P1 and two P2 findings remain active from iterations 1 and 2, so the verdict stays conditional.

Review verdict: CONDITIONAL
