# Review Iteration 003

- Dimension: security, traceability, maintainability
- Operator review focus: the closing pass over commit `860610d783`. This iteration reads the safety consequence of the no-edit gate change across its four gates, proves the traceability claims against the two test files and the doctor callers, and checks the changed lines for comment and naming quality. It also records the holdout proof, which the focus requires, as counts only.
- Budget profile: adjudicate (8-10 calls)
- Base/HEAD: `860610d783cb75e496eb97cd0808355512e547a2`

## Dispatcher

`@deep-review` LEAF iteration driven by the fan-out lineage `noedit-confirm-3b`, session `fanout-noedit-confirm-3b-1794595021404-69frey`, generation 1, lineage mode `new`. Sources read this iteration: `hook-wiring-check.cjs:1-100,310-357`, `command-attach.ts:287-295`, the two test files' changed regions, `review-instructions-3b.txt`, `convergence.md:150-292`, and `git show --numstat 860610d783`. `steer.md` remains absent.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:1-100,310-357` (trust boundary and output path, unchanged but load-bearing for the security read)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-295` (the changed pattern and helper)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:25-80`
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:226-268`
- Holdout files inspected as counts only, not text: `scripts/routing-accuracy/holdout-prompts.jsonl` 65 rows, `command-prompts.jsonl` 176 rows.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The three findings raised in iterations 1 and 2 are carried unchanged; this pass adds none.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Commit `860610d783` names two fixes and both are present at the cited lines: `command-attach.ts:289` adds the `(?! (?:to|in)\b)` guard, and `hook-wiring-check.cjs:231-237` adds `nodeFlagSkipsScript` with `runsNodeOnMarker:276` calling it. The two behavior gaps are recorded as `NE3-P1-001` and `NE3-P2-002`; `NE3-P2-003` is the hook fix's residual window. |
| `checklist_evidence` | pass | The two changed test files each pass on their own: `env -u AI_SESSION_CHILD npx vitest run tests/command-attach-guards.vitest.ts` reported 26 passed, exit 0; `node --test .skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs` reported 32 passed, 0 failed, exit 0. Each added case would fail if its fix were reverted: the two no-edit cases assert `false` for prompts the old pattern read as no-edit, and the three attached-flag cases assert `hook-missing` for commands the old whole-token test read as launches. That last statement is read from the revert behavior, not run, because the review target is read-only. |
| `skill_agent` | notApplicable | No agent file in the changed set. |
| `agent_cross_runtime` | notApplicable | No agent file in the changed set. |
| `feature_catalog_code` | notApplicable | No catalog page in the changed set. |
| `playbook_capability` | notApplicable | No playbook in the changed set. |

## Integration Evidence

- `handlers/advisor-recommend.ts:474` is the only production caller of `attachCommand`; `scorer/text.ts:150`, `scorer/fusion.ts:677` and `scorer/fusion.ts:881` are the only other readers of `isNoEditRequest`. The security consequence of `NE3-P1-001` therefore reaches every mutating-command gate at once.
- `assets/doctor-setup.yaml:61` and `assets/doctor-symlink-check.yaml:60` are the two consumers of the hook check's exit status; both treat exit 0 as a passing or unchanged state, so `NE3-P2-003` is a false green on the delivery leg rather than a displayed warning.
- The check's trust boundary is a JSON settings file: `inspect:310-321` only calls `fs.readFileSync` and `JSON.parse`, `eventPayload:106-113` walks plain objects, and `main:327-345` prints status lines. No command from the file is executed and no file is written.

## Edge Cases

- The commit message claims a full-suite result (184 files, 1798 passed) and a doctor figure (1215). The review focus forbids the full suite and a build, so only the two named files were run. The claim is recorded as an unverified assertion, not as evidence for or against the fixes.
- The holdout proof is a pair of counts plus the commit's numstat, which touches neither prompt file. No row text was read or printed.
- `nodeFlagSkipsScript` treats `--` (end of options) as a continuing flag, so `node -- <marker>` reports `ok`, which matches node's behavior of running the script after `--`.

## Confirmed-Clean Surfaces

- No security exposure in the changed lines: the check never executes a settings command, never writes, and the no-edit helper is pure string work with no new input path.
- Comment hygiene: the two added comments state a durable why ("a flag can carry its value in the same word", "a short preload flag takes the rest of its word") and carry no spec, packet, task or finding ids.
- The changed regex cannot backtrack pathologically: it is a fixed alternation with one bounded lookahead, and the input is lowercased before the test at `command-attach.ts:294`.
- `readWords` still groups a quoted word, so an echoed command stays a mention: the suite case at `tests/hook-wiring-check.test.cjs:202-210` passes in the run above.

## Ruled Out

- A command-injection path through a hook settings file: the check reads JSON and prints lines; there is no `spawn`, `exec` or write in the module.
- A holdout leak in this commit: the numstat lists four source and test files plus two scratch files, and neither prompt file.
- A gate that reads `NO_EDIT_REQUEST` directly and so escapes the helper: ruled out in iteration 1 by `rg` over the runtime.
- A regression in the `-r`/`-C` attached preload path: ruled out in iteration 2; both print `ok` and the loop advances past them correctly.

## Next Focus

- Dimension: none remaining
- Focus area: synthesis
- Reason: correctness, security, traceability and maintainability each have a pass, and the third iteration adds no new defect.
- Rotation status: complete.
- Blocked/productive carry-forward: `NE3-P1-001` is active and keeps the verdict CONDITIONAL; `NE3-P2-002` and `NE3-P2-003` are advisories.
- Required evidence: the findings registry totals, the three iteration verdicts, and the synthesis report.

Review verdict: CONDITIONAL
