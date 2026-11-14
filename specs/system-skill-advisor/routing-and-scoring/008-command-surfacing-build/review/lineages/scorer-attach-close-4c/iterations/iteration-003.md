# Review Iteration 003 — Maintainability with a Security cross-reference

## Dispatcher

- Mode: review (deep-review LEAF iteration, detached fan-out lineage `scorer-attach-close-4c`).
- Iteration: 3 of 3 (final iteration; the cap is reached at this iteration).
- Run: `fanout-scorer-attach-close-4c-1794682797954-pcdanq`, generation 1, lineageMode `new`.
- Budget profile: `adjudicate` (short, focused confirmation of two clean surfaces).
- Sources read: `iterations/iteration-001.md`, `iterations/iteration-002.md`, `deep-review-strategy.md` (post-reducer), `command-attach.ts:356-441` (comment and the four insertions), `command-attach-guards.vitest.ts:145-215`, and the commit diff for comment-hygiene review. `steer.md` is absent.
- Operator review focus: the closing round of review pass four. This iteration addresses the last two checks the brief leaves in this lineage's file scope — whether the comment and tests make the grammar maintainable, and whether the new regex is safe on an untrusted prompt.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:356-441` (comment accuracy, repeated constant, RegExp construction).
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:145-215` (table placement and title style).
- The commit diff for `command-attach.ts` (comment hygiene: no path, task id or ADR id in the added lines).

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. SAC4C-P1-001 remains active from iteration 1.

### P2 Findings

None new. SAC4C-P2-001 remains active from iteration 2.

## Traceability Checks

| Protocol | Level | Status | Note |
|----------|-------|--------|------|
| `spec_code` | core | carried from iteration 2 (partial) | No new code claim to check this iteration; SAC4C-P2-001 and SAC4C-P1-001 are the open alignment items. |
| `checklist_evidence` | core | carried from iteration 2 (partial) | T028/T029 evidence still matches; AC closeout still belongs to AC-011. |
| `feature_catalog_code` | overlay | carried from iteration 2 (pass) | No skill doc describes the grammar, so no new doc claim surfaced. |
| `skill_agent`, `agent_cross_runtime`, `playbook_capability` | overlay | notApplicable | No agent or mirror surface is in this lineage's scope. |

## Security cross-reference

- **Prompt text never reaches a pattern.** `commandOnlyMentioned` lowercases and normalises the prompt, then tests it; the only `new RegExp` inputs are the module constants and `${name}`, and `name` is `escapePhrase(command)` from an internal table (`command-attach.ts:418`). A prompt cannot inject regex syntax, and no `eval`, `Function`, shell or file path is involved.
- **Backtracking is bounded.** The new group is `(?:(?:the )?\/tok(?::tok)?(?: command)?,? or (?:the )?)*`. Every iteration must consume a `/` plus at least one character and then the literal `or`, so the outer loop runs at most once per `or` in the prompt. The inner `(?:the )?` and `(?: command)?` are prefix-distinct (the skip branch requires `/` next), and the token body has no nested unbounded quantifier, so a failing `${name}$` anchor backtracks one iteration at a time, not exponentially. The pattern is compiled per lead (five at most) and run over one `matchAll`; a hostile prompt costs a linear pass per lead.
- **No new trust boundary is crossed.** The change only widens which prompted names count as refusals or questions; it never reads a file, a command or an environment value. This matches the iteration-1 probe, where a request over a list still carried its command, so the supply of commands to the reader did not widen.

## Maintainability review

- **Comment accuracy.** The sentence at `command-attach.ts:376-381` states the refusal/question carry, the second-use-verb boundary, the per-item article, the per-item `command` word and the trailing article. Each clause matches the regex except the word "every", which the active P1 shows is true only for the token shape the pattern can express. That overstatement is the P1's contract evidence, not a second finding.
- **No duplicated literal.** The four insertions all use the one `COMMAND_OR_LIST` constant; there is no second copy of the grammar to drift.
- **Style and placement.** The new test rows sit in the tables that already own refusal, request and question rows, and the `it.each` titles follow the file's "reads %s as …" pattern. The added rows reuse the existing fixtures rather than introducing a new harness.
- **Comment hygiene.** The added comment lines carry no spec path, ADR id, task id or finding id; they state the durable reason for the grammar. No debug output, dead branch or `TODO` was added.
- **No new dependency.** The module still has no imports, so its header claim ("kept free of imports") remains true.

## Integration Evidence

- The maintained surface is the single predicate used by all three callers (`typedCommandForTop`, `attachCommand`, `withholdMentionedCommands`), so the comment and tests describe one behaviour rather than three copies. No caller needed a change for this fix.

## Edge Cases

- **The comment's "every" is load-bearing.** Because the code's own comment states the generalized contract, the P1 is supported by the module's stated intent, not only by the reviewer's reading; the downgrade trigger in SAC4C-P1-001 therefore requires an explicit recorded limit, not a judgement call.
- **The reducer's strategy blocks.** After iterations 1 and 2 the reducer rewrote the managed strategy anchors and listed the iteration's traceability bullets under "Exhausted Approaches". The narrative is unaffected; the strategy will be tidied at synthesis so the merge reads a coherent strategy. Recorded as a state-presentation issue, not a code finding.
- **Cap vs convergence.** This iteration's ratio is 0.0 and every dimension is covered, but the loop reaches `maxIterations` at the same time, so the terminal record carries `maxIterationsReached` as the stop reason and the convergence telemetry as evidence.

## Confirmed-Clean Surfaces

- No catastrophic backtracking shape, no prompt-controlled pattern construction, and no new trust boundary.
- The comment, test titles and module structure match the file's conventions; the change adds no dependency, dead code or id-bearing comment.
- All four `${COMMAND_OR_LIST}` insertions reference the same constant, so the grammar has one definition.

## Ruled Out

- **A ReDoS-class denial of service in the new group**: every iteration consumes a command token and the literal `or`; the outer loop is bounded by the number of `or` occurrences, and no nested unbounded quantifier overlaps.
- **Prompt-driven regex injection**: the command name is escaped and the leads are constants; no prompt text is concatenated into a pattern unescaped.
- **A maintainability finding in the duplicated insertions**: the four uses share one constant, so there is no copy to drift.
- **A comment-hygiene violation in the added lines**: no path, task, ADR or finding id appears in the changed comments.
- **A new behaviour supplied to the reader**: the iteration-1 request probes kept their commands, so the change withholds commands only on refusals and questions.

## Next Focus

- Dimension: none remaining (all four dimensions covered; synthesis next).
- Focus area: synthesis — merge the active P1 and P2 into the report, derive CONDITIONAL, and carry `maxIterationsReached` as the stop reason.
- Reason: the cap is reached and no dimension is uncovered.
- Rotation status: correctness, traceability, maintainability and the security cross-reference complete.
- Blocked/productive carry-forward: nothing blocked; the P1 and P2 stay open for the merge.
- Required evidence: reducer registry counts and the iteration files, which synthesis reads.
- Recovery note: none.

Review verdict: CONDITIONAL
