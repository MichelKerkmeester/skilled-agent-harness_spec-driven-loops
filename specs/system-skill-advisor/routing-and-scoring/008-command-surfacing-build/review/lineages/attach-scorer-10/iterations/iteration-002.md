# Review Iteration 002 - attach-scorer-10

## Dispatcher

- Mode: review, leaf iteration 2 of the `attach-scorer-10` fan-out lineage.
- Target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the seven `attach-scorer` rows of `review/review-scope-10.txt`.
- Focus read first: `review/review-brief-10.txt`; this iteration answers its security dimension for the same four changed surfaces. The brief's review focus is the mention guard, the shared scratch pattern, the re-captured baseline and the Vibe bench row, and every check below stays inside that area.
- Prior state read: `deep-review-state.jsonl` (iteration 1 complete), `deep-review-findings-registry.json` (AC10-P1-001 open), `deep-review-strategy.md` (next focus: security).
- Holdout rule honoured: no prompt corpus was opened, no `git diff/show/log -p` over a corpus path was run, `--summary` was not run, no CLI session text was printed.

## Files Reviewed

| File | Lines read | Dimension |
|------|-----------|-----------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | 316-318, 409-451, 480-505 | security |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | 140-240, 455-485 | security |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | 700-760, 1495-1545 | security |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | 1430-1455, 1500-1560 | security |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | 1-60 | security |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | 134-138 | security |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | 1-134 | security |

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. AC10-P1-001 from iteration 1 stays active; it is a correctness input, not a privilege or trust-boundary bypass.

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- partial for this dimension. `REQ-002` and `REQ-006` own the guarded-write and scratch rules, and `AC-002`/`AC-006` record their evidence; the security read confirms the code honours them. The full requirement comparison follows in iteration 3.
- `checklist_evidence` -- notApplicable: no `checklist.md` in this phase-parent packet.

## Integration Evidence

- Prompt text reaches `commandOnlyMentioned` from `handlers/advisor-recommend.ts:401` (`attachCommand`), `command-attach.ts:259` (`typedCommandForTop`) and `scorer/fusion.ts:1213`, `:1232`, `:1248`. All are in-process calls with the raw prompt, so the trust boundary is the hook input, not the function.
- The prompt is bounded before this code sees it: `hooks/claude/user-prompt-submit.ts:161` caps the request at 64 KiB and `hooks/skill-advisor-hook.md:226` names the same `SYSTEM_SKILL_ADVISOR_MAX_PROMPT_BYTES` default with a 3 s OpenCode hook timeout, so the per-occurrence prefix scan has a hard input ceiling.
- The guarded-write path is fed `event.path` from a session reader and `checkoutDir` from `locator.projectDir`; `guardedWriteCounts` normalises the path with `posix.normalize` at `score-command-transcripts.mjs:1528` before any scratch test and reads no filesystem, so a `..` step cannot walk out of a scratch prefix.

## Edge Cases

- A traversal spelling such as `/tmp/../Users/someone/notes.txt` is normalised by `guardedWriteCounts` before its scratch test and therefore counts as unsafe, while the un-normalised `insideCheckout` fallback would call it scratch. That asymmetry is pre-existing (the old `^/tmp/` test had the same behaviour) and the start-shape reader is a measurement, not the guard; recorded here, not raised.
- A symlink under a scratch folder that points into the checkout stays a recorded contract limit from pass eight (the scorer compares path text and never resolves links).
- A crafted prompt with thousands of command occurrences is bounded by the 64 KiB input cap and the hook timeout; the per-occurrence prefix scan is unchanged by this diff.

## Confirmed-Clean Surfaces

- No injection: `escapePhrase` escapes every regex metacharacter, and the command string comes from the internal `MODE_COMMANDS`/`TRACKED_COMMANDS` tables, never from prompt text.
- No ReDoS growth from the change: the new strip is one global linear replace; the lead patterns keep bounded gaps and no nested quantifier over one span.
- No path escape: `posix.normalize` runs before the scratch test in `guardedWriteCounts`, and a home path or an unreadable path stays on the cautious (unsafe) side.
- No secret exposure: none of the seven files reads an environment credential, prints prompt text, or writes a session store.
- The widened scratch set is spec-owned by `REQ-006`; `/var/tmp` is not a workflow-owned folder, so treating it as scratch does not hide a workflow write.

## Ruled Out

- Regex injection through a command name: the name is internal and escaped.
- ReDoS through the mention guard: bounded input plus bounded leads.
- A `..` traversal escaping the guarded-write rule: normalised before the test.
- A symlinked scratch path as a false negative: recorded contract limit from pass eight.
- The `/var/tmp` widening as an unsafe-write bypass: `REQ-006` owns it and it hides no workflow-owned folder.
- Secret or credential exposure in the area: no such surface exists in the seven files.

## Verdict

No new security finding. One active P1 carries from iteration 1, so the iteration is CONDITIONAL by the active-finding mapping.

## Next Focus

- Dimension: traceability
- Focus area: `REQ-006`/`AC-006` and the D-01 disposition against the code at HEAD; the re-captured baseline's provenance and the README claim
- Reason: security is complete; traceability is the next uncovered dimension and the baseline's recorded sha needs a full read
- Rotation status: D1-D2 complete, D3-D4 pending
- Required evidence: each protocol row names `file:line`; a provenance claim names the commit and the line
- Recovery note: none

Review verdict: CONDITIONAL
