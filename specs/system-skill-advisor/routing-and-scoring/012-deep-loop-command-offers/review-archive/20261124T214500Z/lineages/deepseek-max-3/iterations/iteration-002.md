# Review Iteration 2

## Dispatcher

- Resolved route: mode=review target_agent=deep-review
- Run: `fanout-deepseek-max-3-1795552859377-13gxwk`, lineage `deepseek-max-3`, generation 1
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Dimension: security
- Steer file: absent at dispatch time
- Operator review focus addressed: the security pass the focus asks for inside iterations 1 to 4. It covered the trust boundaries the focus's REQ set depends on (`REQ-030` cost bound, `REQ-038` degraded command ownership, `REQ-047` mode-free withholding, `REQ-053` doctor name) and records no active finding; the REQ-by-REQ trace and the core protocols stay in iterations 4 to 7.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:205-315, 780-1010, 1428-1570`
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:150-330, 400-470`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:105-300`
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:230-285`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1484-1600`
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:150-290`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:255-270`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52, 888-905, 5743-5860`

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new in this iteration. The P1 raised in iteration 1 (`A digit iteration count in an unrelated trailing clause turns a how-to question into a run ask`) is still active and keeps this iteration's verdict at CONDITIONAL.

### P2 Findings

None new in this iteration.

## Traceability Checks

No core or overlay protocol was completed in this iteration; the security dimension does not run the traceability protocols. `spec_code` and `checklist_evidence` start in iteration 4.

## Integration Evidence

Not applicable: the security pass read library and hook code only.

## Edge Cases

- `dist/` is absent from the tree (gitignored, rebuilt by `npm run build`), so the native TypeScript gate could not be executed. The Python fallback was executed in place with `PYTHONDONTWRITEBYTECODE=1`; no bytecode, build output, or file outside the lineage was written.
- The cost bound was measured on the fallback only: a 96,000-character prompt is cut to 10,000 code units in 1 ms, a 10,000-character prompt of repeated `do not run /deep:review.` returns `asksForLoopRun: false` in 4 ms and `commandOnlyMentioned: true` in 17 ms. The native side is read from source, not measured.
- Ambiguity: a prompt that asks for a typed command and later repeats a refusal of the same name (`run /deep:review on the parser, then do not run /deep:review`) is offered by both copies. The reading is defensible as "ask first, refuse a rerun", so it is recorded as an edge case rather than a finding.

## Confirmed-Clean Surfaces

- Prompt text is never placed in argv: both the CLI fallback (`skill-advisor-cli-fallback.ts:276-279`) and the Python subprocess (`subprocess.ts:283-300`) write it to stdin, and both spawns are `spawn()` with an argv array and no `shell`.
- The native prompt is capped at `ADVISOR_PROMPT_MAX_CHARS = 10000` by the input schema (`advisor-tool-schemas.ts:257-262`); the Python head counts UTF-16 code units the way JavaScript does and never splits a character (`skill_advisor.py:888-901`), so both copies read the same head.
- The lead reads are bounded to a 400-character window (`command-attach.ts:784-798`, `skill_advisor.py:5230-5245`), and the repeated-prompt timing above shows no quadratic blowup.
- The compiled-route subprocess passes the prompt on stdin and refuses a front door that predates `--prompt-stdin` rather than falling back to argv (`advisor-recommend.ts:302-337`).
- The degraded CLI path renders only a command string the tracked table names for the row's own skill; an unknown or other-skill string collapses the row to its skill (`skill-advisor-cli.ts:1564-1595`; `trackedCommandForOwner` at `:1489`).
- `render.ts` rejects a label that carries a newline, strips C0/DEL control characters, collapses whitespace, and rejects instruction-shaped labels before printing a command or owner (`render.ts:163-179`).
- `modeCommands` and each command map are read through `hasOwnProperty`, so an inherited name cannot resolve to a command (`command-attach.ts:1628-1630`).
- Both deep-loop commands keep policy `ask` in `COMMAND_ROWS` (`command-attach.ts:64-122`), so a prompt-influenced offer cannot start a run by itself.

## Ruled Out

- Command injection through the prompt: no shell string is built from prompt text anywhere on the offer path; the only spawns use argv arrays and stdin.
- Secret exposure through the hook child: `childEnvForCli` forwards the caller's environment to the repo's own CLI, adds only the socket dir and the prompt-time marker, and no prompt text is placed in the environment (`skill-advisor-cli-fallback.ts:207-213`).
- Visual spoofing of a rendered command with bidi or zero-width characters: `sanitizeSkillLabel` does not strip bidi controls, but the `command` field it prints is not prompt-derived on any current caller (the native handler passes an internal table command; the Python child passes its own tracked rows), so no attacker-controlled value reaches it. Recorded as a hardening gap if a future caller ever forwards a model-supplied command string, not an active finding.
- Prototype pollution through a child-supplied recommendation object: `isRecord` rejects arrays and non-objects, and every field is read by name with a type check (`subprocess.ts:163-230`).
- Regex injection through a tracked command name: the naming patterns escape every command spelling with `escapePhrase` (`command-attach.ts:1467-1469`), and the command grammar admits only `[a-z0-9_:-]`.

## Next Focus

- Dimension: maintainability
- Focus area: the drift and parity machinery (`tests/deep-loop-offer-cases.vitest.ts` `VOCABULARY_PAIRS`/`PATTERN_PAIRS`/`PATTERNS_NOT_COMPARED`), the repeated clause and count predicates, and the closure-doc citation format across the packet's docs
- Reason: the fourth configured dimension must be recorded before iteration 4, and iteration 3 is its slot; traceability then takes iterations 4 to 7 as the focus directs
- Rotation status: correctness and security reviewed; maintainability next; traceability remains
- Blocked/productive carry-forward: the two gate copies remain productive; the fixture and its drift guard are the surface for this pass
- Required evidence: file:line reads of each exported list and pattern plus the guard rows that compare them

Review verdict: CONDITIONAL
