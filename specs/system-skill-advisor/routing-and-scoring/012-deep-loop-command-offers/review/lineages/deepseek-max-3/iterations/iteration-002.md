# Review Iteration 002 — security (with the operator traceability focus)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings (unchanged from iteration 1; emitted there in full): target, maxIterations=7, convergence=0.1, mode=review, dimensions=correctness/security/traceability/maintainability, specFolder.
- Review focus for this iteration: the operator's traceability focus carried into the sixth round's degraded paths — REQ-028, REQ-030 and REQ-038 read from requirement to code to the test that pins them, with the security question asked of each: can a string the caller or the child supplies reach a rendered brief, an argv, or an executed command?
- `steer.md` is absent at this iteration.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`), `:1554` (typed-row branch), `:1656` (degraded wiring)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187` (`parseRecommendations`), `:233` (`typedCommandForRecommendation`), `:245` (`withTypedCommand`), `:283` (`spawn` with args array), `:419` (stdin `--stdin` dispatch), `:455` (parse-then-type wiring)
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:108` (`INSTRUCTION_LABEL_PATTERN`), `:163` (`sanitizeSkillLabel`), `:248` (typed command renders plainly), `:519` (renderer as prompt-boundary guard)
- `.skilled/skills/system-skill-advisor/runtime/lib/prompt-policy.ts:245` (`PASTED_REPLY_CUE`), `:267` (`stripLeadingPastedReply`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:545` (`scoredPrompt`), `:642` (`attachTypedCommand(…, scoredPrompt)`)
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:233` (pasted-reply strip plus 10,000-unit cut), `:256` (`spawn` of the shim), `:276` (the comment on stdin versus argv)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:5181` (`_LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:24` (`runAdvisorSubprocess` feed)
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:152` (the tracked-command case)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:252` (REQ-028), `:254` (REQ-030), `:262` (REQ-038)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The P1 carried from iteration 1 (REQ-033 unmet and unwaived) remains active and is what keeps this iteration's verdict at CONDITIONAL.

### P2 Findings

None. See `## Confirmed-Clean Surfaces` and `## Ruled Out` for what the security pass did establish.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | REQ-028, REQ-030 and REQ-038 traced from requirement to code to test this iteration; the full REQ sweep is the traceability pass |

- REQ-028 ("`/deep:review:confirm` renders `/deep:review (ask)` with no `A ` text on both degraded paths"): `render.ts:250` prints the offer only when `recommendation.typed !== true`; `degradedRecommendations` keeps the tracked row as a command row (`skill-advisor-cli.ts:1554-1575`); `withTypedCommand` marks the subprocess row (`subprocess.ts:245-263`). `degradedRecommendations` keeps command, policy and owner only through `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) or `commandRowFor`. Confirmed by read; both named tests exist at the cited lines.
- REQ-030 ("the Python gate reads the same 10,000-code-unit head, bounded prefix scans, 96,000-character prompt under one second"): `ADVISOR_PROMPT_MAX_CHARS = 10_000` (`schemas/advisor-tool-schemas.ts:257`) with `.max()` at `:262`; `_advisor_prompt_head` counts UTF-16 units and never splits a character (`scripts/skill_advisor.py:888-898`); the hook fallback strips the pasted reply and cuts to the same limit before it spawns (`hooks/lib/skill-advisor-cli-fallback.ts:233`); both prefix scans are windowed (`lib/command-attach.ts:748`, `scripts/skill_advisor.py:5181`). Confirmed by read; the timing itself was not re-run.
- REQ-038 ("a supplied command reaches a degraded brief only where the tracked table names it for that row's skill"): `trackedCommandForOwner` requires an own-key hit in `TRACKED_COMMANDS` **and** `tracked.ownerSkillId === skill` (`skill-advisor-cli.ts:1489-1494`); the typed branch then either prints the command row or falls through to a plain `skill` row that carries no `command`, `policy`, `ownerSkillId` or `typed` field (`:1561-1575`, `:1592`). Confirmed by read and by the case at `cli-degraded-command-contract.vitest.ts:152`.

## Integration Evidence

- Native handler boundary: `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:545` strips a pasted earlier reply once and passes the same `scoredPrompt` to `enrichCompiledRoutes` and `attachTypedCommand` (`:642`), so the served head and the compiled-route step read one text.
- Subprocess boundary: `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:419` sends the prompt on stdin with `--stdin`, and `:283` spawns an argument vector with `shell` unset.
- Hook boundary: `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:276` records why the prompt travels on stdin rather than argv ("any local user can read from the process table"), and `:233` applies the same strip and cap the native handler applies.

## Edge Cases

- The security pass could not produce a finding: every path that prints a command filters it through `TRACKED_COMMANDS`, so the worst an unvalidated child string can do is collapse that row to its owner skill. A clean result is recorded as clean rather than converted into a hardening P2.
- One parity detail was checked and deliberately not reported: the hook fallback cuts with `String.prototype.slice` at 10,000 UTF-16 units (`hooks/lib/skill-advisor-cli-fallback.ts:233`) and could split a surrogate pair, while `_advisor_prompt_head` never splits one (`scripts/skill_advisor.py:888-898`). The TS cut matches the zod `.max(10_000)` the schema enforces, the lone surrogate cannot break JSON, and the Python side re-cuts the head anyway, so the reach is a cosmetic payload difference rather than a defect.
- The served-head behavior for a typed-on-stuck prompt was not executed in this iteration (it needs the real `advisor_recommend` head); the reading rests on `attachTypedCommand` and the fixture's `servedReviewKept` column, and is carried as read-only evidence.

## Confirmed-Clean Surfaces

- No untracked string reaches a rendered command: every `command` printed by the native path comes from `MODE_COMMANDS` / `TRACKED_COMMANDS`, and the degraded path additionally requires `trackedCommandForOwner` (`skill-advisor-cli.ts:1489-1494`).
- No shell interpolation on either child path: `subprocess.ts:283` spawns an argv with no `shell` option, `hooks/lib/skill-advisor-cli-fallback.ts:256` spawns `process.execPath` with an argv, and both send the prompt on stdin.
- The renderer refuses free-form text: `render.ts:519` states the renderer ignores reasons, descriptions, stdout/stderr and prompt text, and `sanitizeSkillLabel` (`:163-178`) drops control characters, newlines and instruction-shaped labels.
- Instruction-shaped labels are blocked by `INSTRUCTION_LABEL_PATTERN` (`render.ts:108-109`), which covers `SYSTEM:`/`INSTRUCTION:`/`IGNORE:`/`EXECUTE:`, fenced code, and "ignore previous instructions".
- Bounded input at every entry: MCP schema `.max(10_000)` (`schemas/advisor-tool-schemas.ts:262`), hook fallback cap (`hooks/lib/skill-advisor-cli-fallback.ts:233`), Python head (`scripts/skill_advisor.py:888`), and windowed prefix scans on both copies.

## Ruled Out

- "A command pasted inside an earlier reply is marked typed on the native served head, while the degraded path strips it": the handler strips once at `advisor-recommend.ts:545` and feeds the stripped `scoredPrompt` to both `enrichCompiledRoutes` and `attachTypedCommand` (`:642`); `subprocess.ts:251` and `skill-advisor-cli.ts:1511` strip too. A direct call to `typedCommandForTop` with the raw prompt does mark it, but the handler never makes that call, so the divergence is not in reach.
- "REQ-028 names `parseRecommendations` but the typed marking happens elsewhere": `parseRecommendations` (`subprocess.ts:187-236`) already preserves `command`, `policy`, `ownerSkillId` and `typed` from the child, and `withTypedCommand` only adds what the child omitted. The requirement's parenthetical holds.
- "The 10,000-unit cut is a security-relevant truncation an attacker can use to smuggle a second instruction past the window": both copies cut the head and then scan windowed prefixes of that head; no scan reads the uncut tail, and the renderer prints no prompt text.

## Next Focus

- Dimension: traceability
- Focus area: the core `spec_code` protocol over every requirement, sixth round first (REQ-023 to REQ-034) and then REQ-001 to REQ-022 and REQ-035 to REQ-048, each mapped to the code that implements it or the decision that records it.
- Reason: the operator focus names `spec_code` as unfinished, and the first two iterations only sampled it; the traceability dimension now owns a full sweep.
- Rotation status: correctness and security complete; traceability in progress; maintainability remains.
- Blocked / productive carry-forward: nothing blocked. The fixture probe and the evidence-citation sweep are both productive and will be reused.
- Required evidence: `spec.md` requirement tables, `decision-record.md` ADR-001 to ADR-008, `command-attach.ts`, `skill_advisor.py`, `explicit.ts`, `render.ts`, `reduce-state.cjs`, and the two command documents.

Review verdict: CONDITIONAL
