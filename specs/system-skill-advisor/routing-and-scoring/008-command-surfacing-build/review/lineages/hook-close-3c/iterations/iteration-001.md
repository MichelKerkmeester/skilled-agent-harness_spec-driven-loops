# Review Iteration 001 - hook-close-3c

## Dispatcher

- Lineage: `hook-close-3c` (detached fan-out), session `fanout-hook-close-3c-1794596804847-827gze`, generation 1, mode `new`.
- Executor: `cli-opencode` model `opencode-go/deepseek-v4.1-flash`, reasoning effort max.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`.
- Operator review focus (binding): PASS THREE closing round; the doctor hook check is reviewed first; every finding needs file:line and a concrete input run; the two settled decisions are not re-reported; no holdout text; no code changes; write only inside the lineage.
- Sources read: the full review instructions at `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/c9fe91ef-9b85-4bdc-88fb-4d6f766eaecf/scratchpad/review-instructions-3c.txt`, `review/review-scope-3c.txt`, both commits (`860610d783`, `846eab66b8`), the hook-check driver and its test file in full. `steer.md` does not exist in this lineage (checked before init).
- How this iteration addressed the focus: it is the deepest pass over half (a), the doctor hook check, at the FINAL state after both commits. It reads every function named in the focus, runs the check as the operator instructed against settings fixtures written inside the lineage, proves with the shell and with node that each misread command really runs, and reports only defects outside the two settled decisions. The no-edit half is iteration 2.

## Dimension

Correctness.

## Files Reviewed

- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:119-191` — `readWords`.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:193-216` — `simpleCommands`, `collectCommands`.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:218-280` — flag tables, `nodeFlagSkipsScript`, `commandWords`, `runsNodeOnMarker`.
- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:282-355` — `scriptWord`, `runsMarker`, `inspect`, `main`.
- `.skilled/commands/doctor/scripts/tests/hook-wiring-check.test.cjs:220-267` — the wired/not-wired tables extended by `860610d783`.
- Commits `860610d783` and `846eab66b8` restricted to `.skilled` (the hook half of both diffs).
- The live checkout's four hook files, read through the check (`node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .`).

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **A node flag with a space-separated value is read as the script word, so a working hook is reported missing** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:222` -- `NODE_FLAGS_WITH_ARGUMENT` lists the value-taking flags the reader skips as a pair (`:222-224`), and `runsNodeOnMarker` advances two words only for a listed flag (`:277`). A valid value-taking node flag missing from that list leaves its value standing where the script is read: the value is not the marker, so the command is reported `hook-missing` although node runs the marker. `--env-file <file>` is such a flag: node accepts the spaced form, and the check rejects the command.
   Finding class: class-of-bug (one incomplete table; every unlisted value-taking node flag follows the same path).
   Scope proof: `NODE_FLAGS_WITH_ARGUMENT` at `:222-224` is the only table consulted by the two-word advance at `:277`; no other branch skips a flag's value.
   Affected surface hints: `/doctor:setup` leg, `/doctor:symlink check` hook leg, the check's `--json` consumer and repair guidance.
   Case: a settings file whose `UserPromptSubmit` command is `node --env-file vars .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js` is reported `hook-missing claude .claude/settings.json` and exits 1, while the same flags with an attached value (`node --env-file=vars ...`) report `ok claude` and exit 0.
   Concrete inputs run (fixture roots under `probes/hook-roots/` in this lineage; check run as `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root <root>`):

   ```
   cmd "node --env-file vars <marker>"      -> hook-missing claude .claude/settings.json  (exit 1)
   cmd "node --env-file=vars <marker>"      -> ok claude                                  (exit 0)
   proof: node --env-file <vars> -e "console.log('ENVFILE_SPACED_RAN')" -> ENVFILE_SPACED_RAN
   proof: node --env-file=<vars> -e "console.log('ENVFILE_EQUALS_RAN')" -> ENVFILE_EQUALS_RAN
   ```

   Why P2 and not P1: the command still runs, so no routing or safety behaviour changes; the harm is a false repair instruction in a diagnostic, and the shape is a deliberate node invocation a hook author would have to add, not the installer's shape. The doctrine's reach rule would lift it only if the check claimed to parse every node flag; the file's own comment and settled decision 2 scope it as a wiring heuristic, so the finding stays advisory at P2.

2. **A command that starts after a shell keyword or the `command` builtin is not read as a command start** -- `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:240` -- `simpleCommands` ends a command only at separators (`:193-206`), and `commandWords` strips only the prefixes in `COMMAND_PREFIXES` (`{`, `exec`; `:240`, `:256-268`). `if ...; then node <marker>; fi` therefore yields a simple command whose first word is `then`, and `command node <marker>` yields one whose first word is `command`; both fail `isNodeExecutable(rest[0])` at `:272` and the hook is reported missing even though the shell launches node. The function's own rule, stated at `:299-300`, is that node must stand where a shell starts a command, and after `then` or `command` it does.
   Finding class: class-of-bug (the prefix list models `exec` but not the other words a shell allows before the command).
   Scope proof: `COMMAND_PREFIXES` at `:240` is the only prefix list; `commandWords` at `:256-268` is the only consumer, and no other branch removes a leading keyword.
   Affected surface hints: `/doctor:setup` leg, `/doctor:symlink check` hook leg, settings repair guidance.
   Case: a settings file whose `UserPromptSubmit` command is `if [ -f vars ]; then node .skilled/skills/system-spec-kit/runtime/dist/hooks/claude/user-prompt-submit.js; fi` is reported `hook-missing claude .claude/settings.json` and exits 1, and `command node <marker>` is reported missing too, although both forms launch node.
   Concrete inputs run:

   ```
   cmd "if [ -f vars ]; then node <marker>; fi" -> hook-missing claude  (exit 1)
   cmd "command node <marker>"                  -> hook-missing claude  (exit 1)
   proof: bash -c 'if [ -f vars ]; then echo IF_THEN_RAN; fi' -> IF_THEN_RAN
   proof: command node -e "console.log('COMMAND_NODE_RAN')"   -> COMMAND_NODE_RAN
   ```

   Why P2 and not P1: the same reasoning as finding 1 — a false diagnostic on a plausible but hand-written guard; the hook itself still runs. Unlike the node-flag case this is a shell-word gap, but it is not quoting or expansion (the settled decision's exotica), so it is reported rather than folded into the heuristic carve-out.

## Traceability Checks

- `spec_code` — **partial**. Commit `860610d783` claims: "It now reads the flag name first, so those commands report a missing hook." Verified: `node -e1 <marker>`, `node --eval=1 <marker>` and `node --print=1 <marker>` each print `hook-missing claude` and exit 1, while `node -r./preload.cjs <marker>`, `node -r ./preload.cjs <marker>` and `node --require ./preload.cjs <marker>` print `ok claude`. The stated mechanism (`nodeFlagSkipsScript` at `:231-237`) is what runs. The partial status is the incomplete value-taking flag table recorded as finding 1, not a failure of the stated fix.
- `checklist_evidence` — **not applicable**. The target packet has no `checklist.md`; the review target is the final source state, not a checklist row. Recorded rather than silently passed.
- `skill_agent` — **pass**. The command surface that consumes this check was read, not inferred: `.skilled/commands/doctor/assets/doctor-setup.yaml:40,61` and `.skilled/commands/doctor/assets/doctor-symlink-check.yaml:37,60` invoke `hook-wiring-check.cjs --root` and map exit 1 to DEGRADED/WARN, so a false `hook-missing` line becomes an operator-visible repair instruction.
- `feature_catalog_code`, `agent_cross_runtime`, `playbook_capability` — deferred to iteration 3 (traceability/maintainability rotation).

## Integration Evidence

- Exact surface exercised: the check's CLI contract (`--root`, `--json`, exit 0 wired / 1 hook-missing / 2 refused) at `.skilled/commands/doctor/scripts/hook-wiring-check.cjs:327-355`, run as the operator instructed against a settings root per case.
- Live checkout: `node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .` printed `ok claude`, `ok codex`, `ok cursor`, `ok devin` and exited 0 against the real installer-generated commands, so the shipped wiring is not misread.
- Consumers named: `/doctor:setup` (`doctor-setup.yaml:61`) and `/doctor:symlink check` (`doctor-symlink-check.yaml:60`).
- Not exercised this iteration: the installers that write each runtime's hook file, and the two single test files (the dispatch permits single test files, but the probe evidence answers the question without running them; see Edge Cases).

## Edge Cases

- Probe settings roots were written under `probes/hook-roots/` inside this lineage rather than a `mktemp` folder: the dispatch forbids writes outside the lineage, and the CLI depends only on the root's contents. The roots are retained as evidence.
- The env-secret guard refused a probe whose flag value was literally a dotenv file name, so the fixtures use the value `vars` instead. The flag shape (`--env-file <value>` versus `--env-file=<value>`) is unchanged, and node's acceptance of both forms was verified with `-e` on the same value.
- The two named test files were not run: the dispatch allows single test files but the probe evidence is sufficient, and running them writes temporary directories outside the lineage.
- No `steer.md` existed at iteration start (checked before init), so no lead ruling applied.
- The commits' suite claims ("184 files, 1798 passed") were not re-run; out of scope for a single-file closing review.

## Confirmed-Clean Surfaces

- The two fix claims hold at the final state: attached evaluation/print/syntax flags report `hook-missing`, and the attached-preload and spaced-require forms report `ok`.
- Real installer commands pass for all four runtimes (`ok claude`, `ok codex`, `ok cursor`, `ok devin`, exit 0).
- Working wrapper forms: `exec node`, `bash -c 'exec node'`, `sh -c 'node'`, `zsh -c 'node'`, `bash -lc "node"`, `env node`, `/usr/bin/env node`, `env -u VAR node`, `{ node; }`, `(node)`, `node "\${CLAUDE_PROJECT_DIR:-$PWD}"/<marker>`, `(cd . && node <marker>)` all report `ok`.
- New test rows can fail for the reason they state: each drives the real process and asserts exit code plus output; no vacuous row was found in `tests/hook-wiring-check.test.cjs:220-267`.
- No repository doc describes this check (a content search for `hook-wiring-check` found only the two YAML consumers, the script and its test), so there is no doc-versus-code claim to contradict.

## Ruled Out

- "The `860610d783` flag-name fix regresses a spaced flag" — ruled out: `--require ./preload.cjs`, `-r ./preload.cjs` and `-C development` still report `ok`; the new branch only changes long flags read by name and short clusters.
- "The check crashes or hangs on malformed input" — ruled out by reading every loop in `readWords`/`simpleCommands`/`runsMarker` and by the CLI's exit-2 path for a bad argument; no unbounded loop or undefined dereference exists (`scriptWord` cannot return `undefined` because of its `index < rest.length - 1` guard).
- "Settled decision 2 inputs (`node -rc <marker>`, `node --eval"1" <marker>`)" — not re-reported; they are the wiring heuristic's documented carve-out (already recorded as P2 in the prior confirming round).
- "A test that cannot fail" — none found; the two new negative rows and the `--json` assertions change outcome if the matcher changes.

## Next Focus

- Dimension: security.
- Focus area: `NO_EDIT_REQUEST` and `isNoEditRequest` in `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:287-298`, with all three callers (`attachCommand` at `:338`, `readOnlyRouteAllowed` at `fusion.ts:677`, `commandMeaningEligible` at `fusion.ts:881`, `isReadOnlyExplainer` at `text.ts:150`) and the test file.
- Reason: half (b) of the operator focus must be checked at the final state, including whether the safe-reading decision leaves a plausible no-edit prompt unprotected.
- Rotation status: correctness complete (PASS, two P2); security next.
- Blocked/productive carry-forward: the hook check is saturated at the operator's requested depth; do not re-enter except to confirm these two P2s stay advisory.
- Required evidence: concrete predicate outputs for plausible no-edit prompts and the command each one attaches, plus the settle-rule boundary.

## Verdict

The hook check's final state is correct for the installer's commands and for every wrapper a person would plausibly write except two hand-written shapes, both reported as P2 advisories. No P0 or P1 was found in this half.

Review verdict: PASS
