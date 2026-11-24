# Iteration 002 - Security

## Dispatcher
- Lineage opus-medium-2, iteration 2 of 5, dimension security. steer.md: not present.
- Review focus coverage: the offer gate in command-attach.ts and the Python fallback copy were measured for input-driven cost (regex and per-match prefix scans), the deep rows' policy was checked against NFR-S01, and the subprocess paths the typed-command flag travels through were checked for shell or argument injection.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:71-72`, `:136-137`, `:614-625`, `:767-808`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52`, `:888-899`, `:1050-1060`, `:4716-4728`, `:4790-4829`, `:5296-5306`, `:5596`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:255-262`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:225-240`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:250-275`, `:390-395`

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **The Python fallback runs the per-match gate scans on an uncapped prompt, so cost grows quadratically with prompt length** -- .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5596 -- `_has_loop_ask` (skill_advisor.py:4716-4728) and `_deep_command_only_mentioned` (skill_advisor.py:4790-4829) run an end-anchored regex over the whole prefix for every loop phrase or command occurrence, so the work is O(matches x length). The TypeScript copy shares the shape (command-attach.ts:616-624, :784-807), but the native schema caps the prompt at 10,000 characters (advisor-tool-schemas.ts:257, :262), where measured cost stays at 18 ms. The Python `analyze_request` applies no cap: it strips a pasted reply and lowercases the full text (skill_advisor.py:5304-5306) before reaching the gate at :5596; `_advisor_prompt_head` is applied only on the native bridge path (skill_advisor.py:1056). Measured: a 10 KB prompt of repeated `don't run /deep:review ` takes 139 ms in the Python gate alone; 60 KB of `no deep review ` takes 2.1 s; 92 KB takes 11.5 s. TypeScript without the cap: 92 KB 1.7 s, 368 KB 22.6 s. The hook's CLI fallback has a 250 ms default timeout (skill-advisor-cli-fallback.ts:89), so the hook path degrades to no brief rather than hanging; a direct `python skill_advisor.py --stdin` call (the Gate 2 B route) on a long paste stalls. The input is the reader's own prompt, so this is availability hardening, not an exploit.
   Finding class: security
   Scope proof: skill_advisor.py is in the review scope and the gate copy was added by the reviewed commit c8eee36a1f5.
   Affected surface hints: analyze_request, _has_loop_ask, _deep_command_only_mentioned, _advisor_prompt_head
   Case: a 90 KB pasted log that repeats "don't run /deep:review" sent through python skill_advisor.py --stdin.

## Traceability Checks
- spec_code (pass for NFR-S01): both deep commands keep `ask` in COMMAND_ROWS (command-attach.ts:71-72, :109-110) and TRACKED_COMMANDS (:136-137), so neither the routed nor the typed path can carry `run` for a deep command.

## Integration Evidence
- `subprocess.ts:231` spawns with an argv array and pipes the prompt on stdin; `skill-advisor-cli-fallback.ts:256` spawns `process.execPath` with fixed argv. No shell, no prompt in argv.
- `skill-advisor-cli-fallback.ts:393` forwards `typed` only when the CLI sent the literal `true`.

## Edge Cases
- The quadratic shape needs many loop phrases or command namings in one prompt; ordinary prompts stay well under a millisecond. Severity held at P2 for that reason.

## Confirmed-Clean Surfaces
- NFR-S01 policy derivation for both deep commands.
- No catastrophic single-regex backtracking found: hyphen runs, apostrophe runs, long gap words and long or-lists all stay linear (0.3-10 ms at 8-26 KB).
- Subprocess argument and shell injection: none.

## Ruled Out
- Prompt-injected `typed: true` flag: the flag is set only by `attachTypedCommand` and by the CLI fallback reading the CLI's own JSON, never from prompt text.

## Next Focus
- Dimension: traceability
- Focus area: spec/AC/tasks/implementation-summary claims for 012 and 013 against code and tests, including the 013 typed-command hint in render.ts and the changelog.
- Reason: rotation; iteration 1's P1 also bears on REQ-020 and AC evidence.
- Rotation status: 2 of 4 dimensions done.
- Required evidence: AC rows with cited evidence, render.ts typed branch, changelog lines.

Review verdict: CONDITIONAL
