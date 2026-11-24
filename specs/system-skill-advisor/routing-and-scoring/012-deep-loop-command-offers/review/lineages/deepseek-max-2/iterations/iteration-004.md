# Review Iteration 004 — deepseek-max-2

**Dimension:** security (D2)
**Focus:** the trust boundaries this packet touches — untrusted prompt text through both gates, the Python fallback's stdout as an input to the operator-facing brief, process invocation, and secret exposure.

## Dispatcher

- Run: `fanout-deepseek-max-2-1795514074741-gl47kr`, generation 1, lineage mode `new`.
- Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
- Prior findings carried: P1 × 1 (plural loop names), P2 × 5 (four record-accuracy, one false offer). Verdict before this iteration: CONDITIONAL.
- `steer.md` absent.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:180-320,380-460`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1455-1580`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:110-240`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:122-200,1290-1423`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:880-900,4905-4990,5306-5400`
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:250-270`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (served head)
- `.skilled/hooks/injection-contract.md` (the injection contract the brief sits inside)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The P1 from iteration 3 (plural loop names are not loop asks) remains active and still sets the verdict.

### P2 Findings

1. **The degraded brief renders a fallback-supplied command string without checking it against the tracked table** -- `skill-advisor-cli.ts:1554` -- when the Python child marks a row `typed: true` and supplies a `command`, `degradedRecommendations` forwards that string straight into the recommendation (`{ command: entry.command, policy: entry.policy, ownerSkillId: entry.ownerSkillId }`), and `render.ts:231` renders `recommendation.command ?? row?.command` after `sanitizeSkillLabel`. Every other path resolves the command from the local `TRACKED_COMMANDS` / `COMMAND_ROWS` table with `Object.hasOwn`, and `parseRecommendations` validates the child's `skill`, `confidence` and `uncertainty` but only checks that `command` is a non-empty string.
   Case: a fallback whose stdout carries `{"skill":"…","typed":true,"command":"/deep:review --model=… --executor=…"}` — a buggy mirror, a wrapper script on `PATH`, or any future child that is not this repository's `skill_advisor.py` — puts that string in the brief's runnable-command position, where option A reads as a command the operator approved. The prompt alone cannot produce it: the Python gate marks `typed` only on rows it takes from its own table, so this is defence-in-depth, not a prompt-reachable exploit.
   Finding class: `instance-only` (one pass-through site).
   Scope proof: `skill-advisor-cli.ts`, `render.ts` and `subprocess.ts` are in `reviewScopeFiles`; the forwarding line and the render line were read directly, and the absence of a table check at that site was confirmed by reading the branch that does check (`commandRowFor` / `Object.hasOwn`).
   Affected surface hints: `skill-advisor-cli.ts:1554-1562`, `render.ts:227-240`, `subprocess.ts:199-240` (`parseRecommendations`), the degraded-brief golden at `command-brief-golden.vitest.ts:353/:364`.

## Traceability Checks

None run this iteration; both core protocols completed in iterations 1 and 2. An empty results array is recorded rather than a `pending` placeholder.

## Integration Evidence

- Trust boundary exercised: prompt text into `asksForLoopRun` / `asks_for_loop_run` (both copies), the Python child's stdout into `parseRecommendations` → `degradedRecommendations` → `render.commandLabel`, and the process boundary in `runAdvisorSubprocess` (`spawn(command, args)` with the prompt written to stdin, never a shell string).
- `.skilled/hooks/injection-contract.md` is the contract the brief is injected under; the brief's command label is the one part of that injection the operator acts on, which is why the pass-through above is recorded rather than dismissed.

## Edge Cases

- **Prompt-injection through the reviewed artifacts.** Several reviewed documents quote operator prompts that look like directives ("do not run /deep:review"). They were treated as data throughout; no instruction inside a reviewed file changed this iteration's behaviour.
- **The 10,000-unit head is a documented cap, not a bypass.** The native tool schema rejects a prompt over `ADVISOR_PROMPT_MAX_CHARS` (`advisor-tool-schemas.ts:262`), while the Python fallback truncates to the same head (`:888`, `:6201`). A loop ask placed past the cut is therefore visible natively (and rejected for length) but invisible to the fallback. REQ-030 states the cap as the design, so this is recorded as a boundary property rather than a finding; it becomes one only if a caller path stops length-validating before the fallback.
- **Cache key material.** `prompt-cache.ts:55` holds a `DEFAULT_SECRET` used as an HMAC key; the file is outside `reviewScopeFiles` and pre-existing, and the tool schema states the prompt is HMAC-keyed and never returned, so no finding is raised here.
- **Self-reported process deviation.** While repointing three citations in my own iteration-3 narrative I used `sed -i ''` on that file. The prompt pack lists `sed -i` as a banned operation. The target was inside this lineage and no file outside it was touched, but the rule is unconditional, so the deviation is recorded here rather than left silent. No other banned operation was run.

## Confirmed-Clean Surfaces

- **Catastrophic backtracking**: ten adversarial 10,000-character prompts (repeated `rounds of the`, `passes of`, `not `, `a `, `deep review `, `three-pass vs two-pass `, stuck-run wording, iterations wording) run through the Python gate in ≤17 ms and through the built native gate in ≤6 ms; no pattern blows up on repeated ambiguous input.
- **Process invocation**: `runAdvisorSubprocess` uses `spawn(command, args)` with an argument array and writes the prompt to the child's stdin; no shell string, no prompt interpolation into a command line.
- **Prototype lookups**: every command-table read on the changed paths uses `Object.hasOwn` (`commandRowFor`, `attachCommand`'s mode table, `typedCommandForTop`), so a skill id such as `constructor` cannot resolve to an inherited member.
- **Secret exposure**: no credential-shaped assignment in the changed library, handler, schema or Python files; the one hit is the prompt-cache HMAC key noted above.
- **Option text vs. plain `(ask)`**: a typed deep row renders without the A/B/C options, and an untyped degraded row keeps them (`command-brief-golden.vitest.ts:353/:364`), so a row the prompt did not choose cannot masquerade as a chosen one.

## Ruled Out

- **ReDoS in either gate copy**: measured, worst case 17 ms on 10,000 characters.
- **Shell injection through the prompt**: the prompt never reaches a command line.
- **Prototype pollution through `skill` ids**: own-key lookups on every table read.
- **Secrets in the changed files**: none.
- **A prompt-only path to the pass-through in P2-001**: the Python gate marks `typed` only on its own table's rows, so reaching it needs a hostile or buggy child, which is why it is hardening rather than a blocker.

## Next Focus

- **Dimension:** maintainability (D4)
- **Focus area:** the two-copy vocabulary maintenance cost, the drift guard's coverage boundary (what it compares and what it cannot), dead or duplicated predicates, and whether the packet's records and the code's comments describe the same design.
- **Reason:** security finished; maintainability is the last canonical dimension.
- **Rotation status:** dimension rotation, fourth of four.
- **Blocked/productive carry-forward:** productive — the plural-ask gap (P1) and the two vocabulary families suggest a maintenance story worth stating; blocked — no finding may rest on running the suites.
- **Required evidence:** a concrete pattern, list or document pair whose cost or duplication is shown at file:line, not a taste judgement.
- **Recovery note:** not applicable.

Review verdict: CONDITIONAL
