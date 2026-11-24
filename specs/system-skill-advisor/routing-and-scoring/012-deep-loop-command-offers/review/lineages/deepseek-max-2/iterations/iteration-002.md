# Review Iteration 002

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-2-1795511183570-92w0ez`, generation 1, lineageMode `new`
- Iteration 2 of 5. Dimension: security. Operator review focus: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.

## Dimension

Security: `spec.md` NFR-S01 and NFR-S02, and the security checklist rows `tasks.md` CHK-030 to CHK-032. Three questions: can a prompt make the advisor start a costly deep run without a yes; does the gate touch anything it should not; and can attacker-controlled prompt text make the gate itself expensive.

The operator focus was addressed by pinning each security claim to the requirement and the code that carries it: NFR-S01 to the two `policy: 'ask'` rows, NFR-S02 to the build of the gate function itself, and REQ-030's cost claim to measured run times rather than to the prose. `spec_code` stays `partial` because REQ-004 to REQ-014 are still unread against their evidence; `checklist_evidence` is still not started.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:64-122` (`COMMAND_ROWS` policy and `mutating` columns)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1189-1235` (`commandOnlyMentioned`, its `runsWithoutAsking` branch)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1252-1264` (the stuck branch and the doctor command)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592-618` (`LEAD_WINDOW`, `endsBefore`)
- `.skilled/skills/system-deep-loop/command-metadata.json:9`, `:57` (`ask_first` for both deep commands)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (policy-bearing rows)
- Live timing probe of `asksForLoopRun` over eight adversarial prompt shapes, 10,000 to 70,016 characters.

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `command-attach.ts:71-72`, `command-metadata.json:9`, `:57` | NFR-S01 and NFR-S02 resolved to code; REQ-001 to REQ-030 security-relevant behaviour exercised; REQ-004 to REQ-014 still open |
| `checklist_evidence` | not run | - | deferred to iteration 3 |

Security results:

- **No unprompted spend.** `attachCommand` returns a deep command only on a loop ask or a typed command (`command-attach.ts:1350-1354`), and both deep commands carry `policy: 'ask'` (`command-attach.ts:71-72`) with `ask_first: ["spend"]` in `.skilled/skills/system-deep-loop/command-metadata.json:9` and `:57`. NFR-S01 therefore holds at the offer layer: the command is offered with `ask`, never with `run`. The one `run`-policy command the gate can return is `/doctor:deep-loop` (`command-attach.ts:77` in the table, branch at `:1256-1263`), which is `mutating: 'add-only'`; REQ-024's withholding is the guard that keeps a refusing prompt from triggering it.
- **The gate reads no ambient state.** `rg` over `command-attach.ts` for `eval(`, `new Function`, `child_process`, `execSync`, `spawn(`, `readFileSync` and `process.env` returns nothing: the module is a pure function of its arguments. NFR-S02's "no credential or user data is read or written" is supported by construction.
- **No secret material in the changed files.** A case-insensitive search for `api_key`, `password`, `token=` and a private-key header over the five changed runtime files and the shared fixture returns nothing (CHK-030).
- **No denial-of-service shape in the gate.** Eight adversarial prompts, from 10,004 to 70,016 characters, all complete under 10 ms; the slowest is a 40,012-character filler prompt at 9.9 ms. The bounded 400-character lead window (`command-attach.ts:592`) is the reason the lead reads do not scale with prompt length, and a 2,000-clause `/deep:review or …` list returns in 0.28 ms (REQ-030).
- **CHK-031** (both `/deep` commands keep `ask`) is confirmed in the command table rather than only in the probe output, so the claim survives a probe file being moved.

## Integration Evidence

- `.skilled/skills/system-deep-loop/command-metadata.json:9` and `:57`: `ask_first: ["spend"]` on both deep commands.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71-72`: `policy: 'ask'`, `mutating: 'mutates'` on both deep commands.
- `.skilled/skills/system-skill-advisor/runtime/dist/`: absent in this worktree and ignored by `.gitignore:60`, so it is not a stale build here; the pending freshness markers (`dist/runtime/*.pending`) are inside the ignored tree and are not evidence of a shipped artefact.

## Edge Cases

- A prompt that repeats "do not" ten thousand words before the loop name reads as a loop ask, because the refusal lead is deliberately bounded to a two-word gap. Recorded as intended behaviour, unchanged from the fifth-round design: an unbounded gap would let an early refusal swallow a later request.
- The doctor command is `run`-policy and `add-only`; a stuck complaint that refuses the run is therefore the only prompt shape that can trigger it without a yes, and REQ-024 withholds exactly there.
- `dist/` absent: the CLI shim would refuse a stale build, but the directory is gitignored and rebuilt locally, so absence in a fresh worktree is environmental and not a packet defect. It does mean REQ-006's "probe run prints live" cannot be reproduced from this tree without a build, which is recorded for `checklist_evidence` as a dependency note rather than a finding.

## Confirmed-Clean Surfaces

- The offer-policy surface: `COMMAND_ROWS` deep entries, `MODE_COMMANDS` deep entries, and the metadata `ask_first` rows agree.
- The stuck-run branch: returns the doctor only when the prompt does not refuse a run or fix, and when the doctor is not merely named.
- The gate function's dependency surface: no I/O, no process environment, no dynamic evaluation.

## Ruled Out

- A route by which a plain prompt starts a deep run: ruled out. No path returns a deep command with `policy: run`; the only `run`-policy return is the add-only doctor.
- A catastrophic-backtracking regression in the new patterns: ruled out by timing eight adversarial shapes; the worst case is 9.9 ms at 40,012 characters.
- A secret in the changed files: ruled out by search over the five changed runtime files and the fixture.

## Next Focus

- Dimension: traceability
- Focus area: complete `spec_code` over REQ-004 to REQ-014 and REQ-021 to REQ-022 (the probe groups, the offer docs, the drift rows, the corpus rows), then open `checklist_evidence` on the ticked tasks.
- Reason: the operator focus; the two remaining untouched requirement bands carry the documentation-side claims that correctness and security could not settle.
- Rotation status: second rotation; correctness and security now covered.
- Blocked/productive carry-forward: productive category "producer read then live exercise" has no live surface here, so the traceability passes read anchors and files.
- Required evidence: the two presentation assets, the two command documents, `hub-router.json`/`ROUTER.md`, the corpus rows, and the exact line each REQ row names.

## Verdict

No active P0, no active P1 and no active P2. Security is clean on the surfaces read and measured.

Review verdict: PASS
