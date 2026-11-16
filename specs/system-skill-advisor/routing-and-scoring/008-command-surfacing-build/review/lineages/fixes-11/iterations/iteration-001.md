# Review Iteration 001 — fixes-11

**Lineage:** `fixes-11` (detached fan-out, review pass eleven)
**Artifact dir:** `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/fixes-11`
**Session:** `fanout-fixes-11-1794851543294-mlt3r6`
**Diff under review:** `git -c core.fsmonitor=false diff 6d50afe6f39 2f3f893c153` over the five `fixes` paths of `review-scope-11.txt`; whole files read at `2f3f893c153`.

## Dispatcher

- **Operator review focus (bound):** review pass eleven, area `fixes`, per `review/review-brief-11.txt`. The focus names the single quote `commandOnlyMentioned` now drops only where it opens a command name, and the doctor install presentation, workflow and contract test that now name the runtimes the link manifest offers. This iteration addressed the focus by testing the quote rule against refusal and question leads through `COMMAND_OR_LIST`, and by checking the named runtime list against `symlink-manifest.json` and the engine that consumes it.
- **Dimension this iteration:** correctness.
- **Dimensions planned:** correctness, traceability, security, maintainability.
- **Steer file:** absent at iteration start (`steer.md` does not exist in the lineage directory).

## Files Reviewed

| File | Under |
|------|-------|
| `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` | correctness |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts` | correctness |
| `.skilled/commands/doctor/assets/doctor-install-presentation.txt` | correctness |
| `.skilled/commands/doctor/assets/doctor-install.yaml` | correctness |
| `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs` | correctness |

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A quoted command in an or-list hides the refusal for every later command** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427` -- The new fold drops a single quote only when it opens a command name (`/(^|[^a-z0-9])'(?=\/[a-z])/g`), so the closing quote after a name survives. `COMMAND_OR_LIST` (`file:385`) has no room for that mark, and the lead is matched against `before` ending at the name (`file:438-442`), so a list such as `do not run '/create:agent' or '/create:readme'` refuses only the first command. The unquoted form is refused and carries a test (`command-attach-guards.vitest.ts:156`), and the double-quoted form is refused because `"` is removed whole (`file:425`); the straight single-quote form is the gap. `attachCommand` then returns the refused command at `file:504`, and the typed-command path returns it too through `typedCommandForTop` (`file:259`), where the same fold runs.
Case: prompt `do not run '/create:agent' or '/create:readme', just explain them`; `commandOnlyMentioned(prompt, '/create:readme')` returns `false` and `attachCommand('sk-doc', {action:'route',selectionKind:'single',targets:[{workflowMode:'sk-create-readme'}]}, prompt)` returns `/create:readme`.
Finding class: correctness (a refusal the guard exists to honour is not read, so a mutating command is offered and a typed one is delivered).
Scope proof: the input is ordinary chat text the advisor accepts; `/create:readme` is a tracked command row in `command-attach.ts:69` and a mode command in `MODE_COMMANDS['sk-doc']` (`file:30`); the two call sites are `attachCommand` (`file:504`) and `typedCommandForTop` (`file:259`). No shell, config, or runtime-specific surface is needed to reach it.
Affected surface hints: `MODE_COMMANDS['sk-doc']['sk-create-readme']`, the `/create:readme` offer and typed-delivery paths, every or-list of tracked commands (for example `'/doctor:ci report' or '/doctor:ci scaffold'`), and the ask-lead table when a question joins two quoted commands.

```json
{
  "type": "claim_adjudication",
  "findingId": "FIX11-P1-001",
  "claim": "A single-quoted command inside an or-list is read as a mention only for the first command; a later quoted command in the same refused list reads as a request, so attachCommand and typedCommandForTop deliver or offer it.",
  "evidenceRefs": [
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:427",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:385",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:438-442",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:504",
    ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:156",
    ".skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:172-184"
  ],
  "counterevidenceSought": "Ran the shipped compiled module `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js` (which carries the same new fold) over four controls: unquoted or-list returns true, double-quoted or-list returns true, single-quoted first command returns true, and the mixed form `do not run '/create:agent' or /create:readme` returns false. Checked the closing quote is the only break: no lead can start after `or`, and `COMMAND_OR_LIST` cannot consume the quote. Checked that the prompt names a real tracked command and a real mode command, and that both delivery paths call the same guard.",
  "alternativeExplanation": "The scorer might not select the `sk-create-readme` mode for a refusal prompt, or another gate might suppress the offer after `commandOnlyMentioned`. The second was disproved by calling `attachCommand` and `typedCommandForTop` directly, both of which returned `/create:readme`; the first is not a guarantee, because the prompt types the command and `typedCommandForTop` delivers a typed command whenever its owner is the leading skill.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "Downgrade to P2 if routing can be shown to never select a refused mode for a prompt that only quotes tracked commands, or if a later gate is shown to suppress typed-command delivery on a refusal. Upgrade toward P0 only if a delivered command can write without any further operator confirmation."
}
```

### P2 Findings

None recorded under correctness this iteration.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | `039-main-sk-doc-routing-repair/spec.md:134` (REQ-006) asks that "a single-quoted command name reads like a plain one before its refusal or question lead". The quoted single-command form is present at `command-attach.ts:427` with tests at `command-attach-guards.vitest.ts:178-181`; the quoted or-list form in one sentence still diverges from the plain form, so the requirement is met for the tested shape and not for the joined shape. The doctor half of REQ-006 is met on membership: the presentation at `doctor-install-presentation.txt:78`, the workflow at `doctor-install.yaml:58` and the manifest at `.skilled/commands/doctor/assets/symlink-manifest.json` all carry the same eight runtimes. |

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:504` — `attachCommand` consults `commandOnlyMentioned` before returning a hub command; `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:259` — `typedCommandForTop` consults it before delivering a typed command. Both are production call sites inside the reviewed file, not test-only helpers.
- `.skilled/commands/doctor/scripts/symlink-engine.cjs:435-438` — the engine rejects a runtime name the manifest does not hold, which is why naming `dsh` in the presentation is now correct: `.skilled/commands/doctor/assets/symlink-manifest.json` holds a `dsh` row.
- `.skilled/commands/doctor/scripts/tests/doctor-install-contract.test.cjs:241-243` — the contract test derives the expected names from `symlink-manifest.json`, so the presentation and manifest are checked against one source.

## Edge Cases

- **Closing-quote asymmetry.** The fold is intentionally one-sided (only an opening quote before `/`), which is what keeps contractions such as `don't` intact. The cost is the or-list case above; a future fix has to strip the closing quote only when it follows a command name, or teach `COMMAND_OR_LIST` to tolerate it.
- **Compiled copy.** `.skilled/skills/system-skill-advisor/runtime/dist/runtime/lib/command-attach.js` is gitignored and already carries the new fold, so the shipped copy and the source agree; this was verified, not assumed.
- **Runtime list order.** The presentation names the runtimes in sorted order (`doctor-install-presentation.txt:78`) while the prompt and workflow name them in manifest order (`doctor-install-presentation.txt:58`, `doctor-install.yaml:58`). Membership is identical; only the order differs.
- **Ambiguity resolved toward the safer reading.** Whether the refusal is reachable depends on routing, which this iteration did not exercise end to end; the finding keeps P1 rather than P0 because the delivered `/create:readme` row is `policy: 'start'` (`command-attach.ts:69`), so a setup question still precedes a write.

## Confirmed-Clean Surfaces

- `commandOnlyMentioned` now reads the single-command quote shapes it claims: `"do not run '/create:readme' yet"`, `"what's '/create:readme' for?"`, `['never use ‘/deep:review’ here']`, and `['do not run “/create:readme” yet']` all return `true` against the compiled module.
- A marked-up request stays a request: `run '/create:readme' for the advisor skill` and `don't skip '/create:readme', run it` return `false`.
- The doctor presentation's runtime sentence matches the manifest exactly: `outside claude, codex, cursor, devin, dsh, opencode, pi and vibe or the ones already there` against the eight manifest keys.
- The workflow's `Ask` step names the same eight runtimes (`doctor-install.yaml:58`), and no stale `DSH is not offered` sentence remains in the doctor assets.

## Ruled Out

- **Longer command read as the shorter one** — `commandOnlyMentioned('do not run /create:sk-skill-parent', '/create:sk-skill')` returns `false`, matching the existing test at `command-attach-guards.vitest.ts:287-289`; the negative lookahead at `command-attach.ts:431` holds.
- **Curly/double quote handling regressed by the new fold** — `“`/`”` are still removed whole and `‘`/`’` normalized before the fold; the compiled module returns `true` for both quoted refusal cases.
- **Doctor membership mismatch** — the manifest, engine, presentation and workflow all carry `claude, codex, cursor, devin, dsh, opencode, pi, vibe`; no missing or extra runtime was found.
- **Stale shipped build** — the gitignored `runtime/dist` copy carries the new fold; the fix is not source-only.

## Next Focus

- **Dimension:** traceability.
- **Focus area:** `039-main-sk-doc-routing-repair/spec.md:134` (REQ-006), `acceptance-criteria.md:59` (AC-006), `tasks.md:60-61` (T010/T011), and the claim in `doctor-install-contract.test.cjs:238` that both the presentation and the workflow are checked.
- **Reason:** REQ-006 names presentation, workflow and contract test as an agreeing set; the test body now checks the presentation against the manifest only.
- **Rotation status:** correctness reviewed; traceability next, then security and maintainability.
- **Blocked/productive carry-forward:** correctness is productive (one P1 with a reproducible input); no approach is blocked.
- **Required evidence:** the exact assertion lines in the contract test, the workflow's runtime sentence, and the spec/tasks evidence rows that claim the set agrees.

Review verdict: CONDITIONAL
