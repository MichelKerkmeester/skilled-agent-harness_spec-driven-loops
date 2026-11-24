# Deep Review Iteration 002 - Security

## Dispatcher
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iteration: 2 of 5
- Dimension: security
- Operator review focus: The traceability focus is covered here by reading the REQ-030 long-prompt bound and the prompt-trust boundary the fix round's refusal predicates sit on, and recording what this iteration can and cannot certify for REQ-030.
- Scope: the 46 files in the pre-bound review scope file; security reading concentrated on the hook bridge, the subprocess parse path and the new regex vocabulary.

## Files Reviewed
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:222]
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:256]
- [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:274]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:245]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1180]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:6165]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | partial | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886, .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257 | REQ-030's two bounds are implemented: a 400-character lead window on both sides and a shared 10,000-code-unit head matching the schema cap. This supports the REQ but does not complete the REQ-by-REQ table, which iterations 3 and 4 finish. |

## Integration Evidence
- Hook bridge: `skill-advisor-cli-fallback.ts:256` spawns the CLI with `process.execPath` and an argument array (no shell), `:272` passes an allowlisted child env, `:274` pipes the prompt on stdin. The comment at `:275` states the reason: argv is readable from the process table. Timeout and process-group kill at `:285` bound a hung child.
- Fallback parse: `subprocess.ts:187` (`parseRecommendations`) validates every element's `skill`, `confidence` and `uncertainty` and only carries non-empty command fields, so a malformed or hostile stdout cannot inject a command row.
- Degraded path: `skill-advisor-cli.ts:1490` (`degradedRecommendations`) accepts only rows that passed threshold and marks `typed: true` only for a tracked command the reader actually typed, so a mention cannot hide the offer options.
- Prompt handling: `command-attach.ts:1180` (`commandOnlyMentioned`) strips markup and quote characters before matching, and `:592` keeps every lead read on a bounded window. The Python copy keeps the same window at `:4886` and the same head at `:888`, passed at `:6165`.

## Edge Cases
- A 96,000-character prompt: the TypeScript gate reads at most the schema-capped 10,000-unit prompt from the handler, and the Python fallback cuts to the same head before the gate. Neither side scans the full prompt per candidate match, so the untrusted length cannot drive quadratic work.
- An adversarial prompt naming every command: `typedCommandIn`/`typedCommandsIn` iterate a fixed key list and indexOf per key, which is linear in prompt length times a constant key count.
- A pasted earlier advisor reply: `stripLeadingPastedReply` is applied before the degraded and subprocess typed-mark evaluation, so pasted reply text cannot mark a command as typed.

## Confirmed-Clean Surfaces
- No `eval`, `exec`, `shell: true`, or prompt-driven file write exists in the reviewed gate, render, handler or fallback modules; the only spawn sites pass an argv array.
- `escapePhrase` (`command-attach.ts:469`) escapes every list word before it becomes a pattern, so list data cannot become regex syntax.
- No secret, token or environment value is read or rendered by the offer path; `childEnvForCli` (`:207`) is an allowlist.

## Ruled Out
- ReDoS in the new refusal grammar: every quantified group carries a bounded `{0,2}`/`{0,3}` or a negative lookahead, and every read is limited to a 400-character window; no nested unbounded quantifier exists in `RUN_ASK_NEGATED_SOURCE` or the command-decline leads.
- Command injection through the fallback: the prompt is stdin data, never interpolated into an argv string or a shell.
- Privilege escalation through a typed row: a typed mark only suppresses the offer text; it grants no execution.

## Next Focus
- Dimension: traceability
- Focus area: complete the `spec_code` protocol by mapping REQ-023 to REQ-034 to the implementing line and to ADR-005/ADR-006
- Reason: correctness and security are covered; the operator focus names the REQ/ADR mapping as the remaining deliverable
- Rotation status: correctness complete, security complete, traceability next, maintainability pending
- Required evidence: one file:line per REQ row; one ADR section per recorded decision; quote any REQ whose implementation is missing

Review verdict: PASS
