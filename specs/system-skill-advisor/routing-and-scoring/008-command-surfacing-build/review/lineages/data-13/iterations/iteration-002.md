# Review Iteration 002

## Dispatcher

- Mode: review, lineage `data-13`, iteration 2 of 8.
- Declared target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Area: `data`; scope files are the graph metadata, the CL-009 playbook and ADR-001.
- Dimensions this iteration: security and maintainability, with the cross-scorer contract checked under maintainability.
- Operator review focus binding: `review_brief-13.txt` asks for four things in this area -- the seven phrases must not pull ordinary prompts to the advisor, the playbook prompt must match its expected lines, ADR-001 must keep P05 on `/doctor:helper`, and no tune/fix/report path may read holdout rows. Iteration 1 answered the first three; this iteration closes the holdout question and the two remaining dimensions.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/graph-metadata.json:96-110` (signal list, re-read for control characters and duplication)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/cli-hooks-and-plugin/brief-command-policy-word.md:60-198` (command blocks, expected signals, failure triage, source metadata)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md:30-38`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/scratch/probes.json:79-135`
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:30-200` (whole contract, including the cross-scorer case)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4200-4215` (intent signal phrase reader)
- `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs:1-60,240-260,1230-1390` (input surfaces, no corpus read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs:20-130` (holdout refusal, read as the named hygiene surface)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` (signal map, re-read)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md:196` (catalog row for CL-009)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-findings-registry.json` (reduced state)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/data-13/deep-review-strategy.md` (reduced state)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. F001 from iteration 1 remains active: the new signals are indexed as ordinary words in the native lexical lane.

### P2 Findings

1. **The declared-phrase contract holds in one scorer and not the other** -- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts:169-200` -- The specificity test asserts cross-scorer parity for exact declared phrases, but after the seven-signal addition the two shipped scorers disagree on an ordinary sense of one of them. `the arena is clean now` returns `system-skill-advisor` at 0.82 in the native scorer and no skill at all in the Python fallback; `clean arena seating chart for the stadium` puts the advisor first natively and `sk-design` first in Python. The test's cross-scorer case still covers only `browser agent` and `css extraction`, so this class is unpinned.
   Finding class: test-coverage
   Scope proof: Ran the Python fallback in-process with the committed `skill-graph.json` signals and no SQLite graph, and compared its top-1 with the native `scoreAdvisorPrompt` top-1 for the same prompt set; the divergence reproduces on both prompts and disappears for the two phrases the test already pins.
   Affected surface hints: `.skilled/skills/system-skill-advisor/runtime/tests/scorer/declared-phrase-specificity.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py`, `.skilled/skills/system-skill-advisor/graph-metadata.json`
   Case: `the arena is clean now`
   Recommendation: add the ordinary-sense prompts as cross-scorer fixtures once the phrase-scoring fix lands, so both scorers agree on what a declared phrase means.

No P0 candidates. The P2 is a coverage gap rather than a behavior claim, so it needed no Hunter/Skeptic/Referee pass.

## Traceability Checks

- `skill_agent` -- pass. `graph-metadata.json:101-107` and the compiled `skill-graph.json` signal map carry the identical seven strings; the projection reads 61 skills from SQLite and exposes the same `intentSignals` list.
- `agent_cross_runtime` -- not applicable (`applicable: false`). This area defines no agent file; the only runtime-specific artifact is the Claude hook the CL-009 playbook drives, and that hook is unchanged by the diff.
- `playbook_capability` -- pass. The parent and child labels were reproduced with `renderAdvisorBrief` from the committed row: `system-skilled-doctor → /doctor:update (ask)` and `(parent-named only)`, matching `brief-command-policy-word.md:148` and `:160-161`.

## Integration Evidence

- Holdout hygiene: `derive-command-bridges.cjs` reads route YAML, skill frontmatter and the two scorer sources (lines 251, 539, 1247-1249); it never opens `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`. `measure-brief-cost.mjs:124` refuses a holdout row before spawning. No tune, fix or report path in this area reads a holdout row.
- Playbook: the six hook invocations use `mktemp -d` state directories and literal JSON payloads; the changed lines add no credential, token or environment dump. `rm -rf "$T"` runs on the mktemp path only.
- ADR: `decision-record.md:37` and `acceptance-criteria.md:59` still describe P05's helper ranking; `probes.json` P05 row agrees at 0.8.

## Edge Cases

- The Python fallback has no command-bridge layer, so P05 there returns `system-skill-advisor` rather than `command-doctor-helper`. This is a scorer-scope difference, not a contradiction of ADR-001, which names a command-level helper route; it is recorded so a later reader does not treat the fallback result as a regression.
- The seven signals are unique in the file (39 entries, 0 duplicates) and contain no control characters, backticks, `$` or backslashes, so they cannot alter the JSON or inject shell text.
- `manual-testing-playbook.md:196` carries only the CL-009 title and link, so the feature-file version bump needs no catalog edit.

## Confirmed-Clean Surfaces

- Security: the signal addition is static author data read by substring and token checks, with no prompt-built regular expression, no filesystem read, no network call and no credential surface. The playbook's temp handling and the bridge generator's inputs are clean for this change.
- Maintainability: the CL-009 feature version bumped `1.0.1.0 -> 1.0.2.0`, all three prompt occurrences and the Expected block agree, and the failure triage still names the two render tests that exist.
- The reducer-owned state is coherent: two open findings, correctness and traceability covered, security and maintainability marked here.

## Ruled Out

- A holdout leak through command-bridge generation: the generator's input list has no corpus path.
- A secret or environment exposure in the playbook's changed blocks: the payloads carry a prompt, cwd, hook event name and session id only.
- A JSON or shell injection through a signal string: every entry is plain lowercase text with no metacharacter.
- A duplicate-signal amplification: the file has no duplicate intent signal.

## Next Focus

- Dimension: all four re-verified (convergence pass).
- Focus area: re-run the F001 and F003 cases from the final tree, confirm the registry and strategy agree with the iteration records, and take the stop decision.
- Reason: correctness, traceability, security and maintainability all have evidence; the only open question is whether the run may stop.
- Rotation status: security and maintainability complete; no new dimension remains.
- Blocked/productive carry-forward: F001 is the only active P1 and stays open; F002 and F003 are P2.
- Required evidence: a reproduction run and a convergence decision naming any blocker.

Review verdict: CONDITIONAL
