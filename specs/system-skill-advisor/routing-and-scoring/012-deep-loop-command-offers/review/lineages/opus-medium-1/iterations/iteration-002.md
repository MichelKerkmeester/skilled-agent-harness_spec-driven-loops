# Iteration 002 — Security

## Dispatcher
- Executor: cli-claude-code (claude-opus-5-5, medium), inline lineage opus-medium-1
- Sources read: steer.md (absent), strategy, registry, iteration-001.md

## Dimension
security, covering what untrusted prompt text can do to the deep-loop offer gate (TS `command-attach.ts`, Python `skill_advisor.py`), and whether the packet 013 `typed` flag can be forged into the brief head.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:767-808` (commandOnlyMentioned), `:572-625` (LOOP_REQUEST scan)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4793-4823` (_deep_command_only_mentioned)
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257-262, 306-308`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233, 363-399`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:227-253`

## How this iteration addressed the review focus
I timed both gates on adversarial prompts built for backtracking or rescans: long word runs, an unterminated `check … for`, nested `more` gaps, a long or-list of commands, and a led command repeated many times. Probes: `probes/redos.mjs`, `probes/redos2.mjs`, `probes/redos.py`. Then I traced where the `typed` flag comes from and how the head sanitizes the command it prints.

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **commandOnlyMentioned rescans the whole prefix for every occurrence, so cost grows with the square of the repeat count** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784` -- Each occurrence of the command builds fresh `RegExp`s anchored with `$` over `before = text.slice(0, nameEnd)`, and each one scans from the start of the string: the decline leads, the ask leads, the bare lead, the document check and `runCommandRequested`. A prompt that repeats a led naming therefore costs O(occurrences × length). The Python copy (`skill_advisor.py:4793-4823`) has the same shape and runs slower. The 10,000-character cap (`advisor-tool-schemas.ts:257`, `skill-advisor-cli-fallback.ts:233`) bounds this, so it is a latency cost rather than a hang.
   Finding class: algorithmic complexity on untrusted input (bounded)
   Scope proof: TS `'do not run /deep:review. '` repeated: 5,000 chars 10.5 ms, 20,000 chars 506 ms, 80,000 chars 1,517 ms. Python on the same 10,000-char prompt: 349 ms for the gate alone.
   Affected surface hints: command-attach.ts commandOnlyMentioned; skill_advisor.py _deep_command_only_mentioned; typedCommandForTop and attachCommand both call it
   Case: a pasted log of 400 lines that each read "do not run /deep:review." (about 10,000 chars) adds about 0.35 s to the Python fallback for each deep run row it checks.

## Traceability Checks
- spec_code (pass, security slice): no gate regex backtracks catastrophically. Every other adversarial shape stayed under 32 ms at 24,000 to 28,000 chars in TS and Python (redos probe output).
- checklist_evidence: not run this iteration.

## Integration Evidence
- `typed` enters the hook only from the advisor CLI's own JSON (`skill-advisor-cli-fallback.ts:393-395`), which the schema restricts to `z.literal(true)` (`advisor-tool-schemas.ts:308`). It is never parsed from prompt text, so a prompt cannot set it.
- `commandLabel` passes `command` through `sanitizeSkillLabel` before printing (`render.ts:234`), and the command comes from `TRACKED_COMMANDS` or the generated rows, not from the prompt.

## Edge Cases
- These timings come from one machine with no warm-up. Read them as orders of magnitude.

## Confirmed-Clean Surfaces
- LOOP_REQUEST, ITERATIVE_ASK, MULTI_PASS, LOOP_COUNT, DEFECT_CHECK: linear on the probe shapes.
- The typed-flag trust boundary: not forgeable from the prompt.

## Ruled Out
- Prompt injection into the brief head through the command label: the label is built from known command keys only.

## Next Focus
- Dimension: traceability
- Focus area: spec REQ-001..REQ-007 and acceptance-criteria rows against the code and tests; 013 spec vs render.ts; injection-contract.md head example
- Reason: rotation
- Rotation status: correctness, security done (2/4)
- Required evidence: file:line for each REQ claim

Review verdict: PASS
