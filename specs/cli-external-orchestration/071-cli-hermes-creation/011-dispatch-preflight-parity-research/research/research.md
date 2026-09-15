---
title: "Deep-Research Synthesis: dispatch preflight parity and the Hermes caveat fixes"
description: "Ten-iteration synthesis of the dispatch preflight audit: the severity table for all 23 hard rules, every defect with its fix and the test that proves it, Cursor and OpenCode adapter parity, the ranked plan and a four-phase decomposition."
trigger_phrases:
  - "dispatch preflight parity research"
  - "cli hard rule severity audit"
  - "dispatch preflight defect table"
  - "cursor opencode preflight parity"
---
# Deep-Research Synthesis: dispatch preflight parity and the Hermes caveat fixes

> One lineage, `deepseek-v4.1-flash` at max via cli-pi, ten iterations, stop policy max-iterations. Every load-bearing claim below carries the citation the iteration recorded. A claim the lineage could not confirm by a read or a run is marked inferred and says what would confirm it.

| Charter deliverable | Section |
|---|---|
| 1. Full severity table, one row per rule across seven skills | §1 |
| 2. Defect table: what is wrong, the line, the fix, the test | §2.1, with coverage gaps in §2.2 and fail-open paths in §2.3 |
| 3. Parity table for Cursor and OpenCode | §3 |
| 4. Ranked recommendation list | §4 |
| 5. Proposed phase decomposition | §5 |

## 1. Severity table

`evaluate()` treats `severity === 'block'` or `severity === 'error'` as blocking and everything else, a missing severity included, as advisory. A `warn` rule can never deny a dispatch. [`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:240-253`]

The seven `cli-*` skills declare 23 rules: 7 at `error` and 16 at `warn`. Per skill the declared and error counts are cli-claude-code 2/0, cli-codex 2/1, cli-cursor 2/1, cli-devin 2/1, cli-hermes 8/3, cli-opencode 5/0 and cli-pi 2/1. [`cli-claude-code/SKILL.md:6-14`, `cli-codex/SKILL.md:6-14`, `cli-cursor/SKILL.md:6-14`, `cli-devin/SKILL.md:6-14`, `cli-hermes/SKILL.md:6-38`, `cli-opencode/SKILL.md:6-26`, `cli-pi/SKILL.md:6-14`]

| # | Skill | Rule id | Check | Declared | Detectable from the command string | Recommended | Reason |
|---|---|---|---|---|---|---|---|
| 1 | claude-code | stdin-redirect-required | stdin-redirect-required | warn | yes, `claude -p/--print` shapes at line 81 | **error** | The violation hangs at zero output and is indistinguishable from a slow model. The check is deterministic. |
| 2 | claude-code | non-interactive-permission-mode-risk | non-interactive-permission-mode-risk | warn | partial, it fires whenever the bypass flag is absent whether or not a shell prompt exists | warn, refine the predicate | The check cannot verify the message's second safe path, a prompt that needs no shell approval. The deadlock class is real but not command-detectable. |
| 3 | codex | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 4 | codex | codex-availability-required | command-v-codex-required | error | yes, a PATH probe that fails open without PATH | error, keep | Correct as declared. |
| 5 | cursor | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 6 | cursor | cursor-availability-required | command-v-cursor-agent-required | error | yes | error, keep | Correct as declared. |
| 7 | devin | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 8 | devin | devin-availability-required | command-v-devin-required | error | yes | error, keep | Correct as declared. |
| 9 | hermes | stdin-redirect-required | stdin-redirect-required | warn | yes, `hermes chat` plus a query flag at lines 87-88 | **error** | Same silent-hang class. |
| 10 | hermes | hermes-availability-required | command-v-hermes-required | error | yes | error, keep | Correct as declared. |
| 11 | hermes | yolo-required-for-writes | hermes-yolo-required-for-writes | error | partial, the write-toolset regex covers `terminal|coding|code_execution|browser` and an undocumented name such as `shell` passes | error, keep, widen the roster after confirmation | A flagged step fails the leaf silently mid-task. |
| 12 | hermes | ignore-rules-required | hermes-ignore-rules-required | warn | yes, but the exemption at lines 184-186 is false | **error after the exemption is removed** | A missing flag injects SOUL.md, memories and session search into the leaf. Silent context bleed. The `-s` exemption is disproved by the commissioning A/B. |
| 13 | hermes | explicit-toolsets-required | hermes-explicit-toolsets-required | warn | partial, it does not require `file` at lines 189-194 | **error after the check is fixed** | `-t search,todo` passes the check and the leaf then cannot read a file, exiting 0 with empty stdout. |
| 14 | hermes | no-worktree-flag | hermes-no-worktree-flag | error | yes | error, keep | Correct as declared. |
| 15 | hermes | mcp-config-operator-required | hermes-mcp-config-operator-required | warn | yes | **error**, medium confidence | `hermes mcp add/remove` mutates user-level operator config from inside a leaf and the blast radius survives the run. |
| 16 | hermes | hooks-user-level | hermes-hooks-user-level | warn | yes | warn, keep, consider error | `--accept-hooks` blesses operator-declared shell hooks. That is an unauthorized-action class, not a silent wrong result. |
| 17 | opencode | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 18 | opencode | explicit-model-required | explicit-model-required | warn | yes, at lines 148-151 | **error** | Without `-m` a 429 retries forever and emits no output. Silent by construction. |
| 19 | opencode | no-bare-agent-general | no-bare-agent-general | warn | partial, `--agent=general` slips the `\s+` predicate | warn, keep, fix the predicate | opencode rejects it loudly at run time, so it is not a silent failure. |
| 20 | opencode | command-flag-for-slash-prompt | command-flag-for-slash-prompt | warn | partial, unquoted slash prompts slip | **error after the predicate fix** | Slash text is delivered as raw prose, so the wrong task runs with no error. |
| 21 | opencode | share-requires-confirmation | share-requires-confirmation | warn | partial, `--share=value` slips | warn, keep | Consent is a human step the command string cannot express. Flag it for confirmation only. |
| 22 | pi | stdin-redirect-required | stdin-redirect-required | warn | yes | **error** | Same silent-hang class. |
| 23 | pi | pi-availability-required | command-v-pi-required | error | yes | error, keep | Correct as declared. |

Four supporting findings from the same iteration:

- **Both zero-error skills are an oversight.** cli-claude-code declares 2 rules and cli-opencode 5, all `warn`, and each contains at least one rule whose violation is a silent hang or a silent wrong result. The posture is not a considered stance: cli-claude-code simply lacks the availability rule its peers mark `error`. [`cli-claude-code/SKILL.md:6-14`, `cli-opencode/SKILL.md:6-26`]
- **`stdin-redirect-required` is the single highest-value severity flip.** Seven identical `warn` declarations sit on one deterministic check that already recognizes every documented headless shape and passes on a redirect, a heredoc, a herestring or an upstream pipe. Flipping the seven declarations converts the largest class of silent hangs into refusals with no check-code change. [`dispatch-rule-checks.mjs:72-89,136-144`]
- **Detectability was probed live against the registry on 2026-09-15.** Confirmed fires: `claude --print "x"`, `hermes chat -q "x"`, `pi --print "x"`, `--agent general`, a quoted `"/memory:search q"`, `-t terminal` without `--yolo` and `claude -p "x" </dev/null`. Confirmed silent passes: `hermes chat "x"` with no query flag, `--agent=general`, `--share=public`, an unquoted `/memory:search q`, `hermes chat -q x -t search,todo`, `hermes chat -q x -s cli-hermes -t file,todo` and `-t shell` without `--yolo`. [`dispatch-rule-checks.mjs:133-209`, probe 2026-09-15]
- **Availability coverage is inconsistent.** Five skills carry an availability rule at `error`. claude-code and opencode carry none and the registry implements no `command-v-claude-required` or `command-v-opencode-required`. The registry's own comment states the fail-open rationale, so this is a coverage decision rather than a technical limit. [`dispatch-rule-checks.mjs:115-131,166-170`]

## 2. Defects and coverage gaps

### 2.1 Defect table

| # | What is wrong | Location | Fix | Test that proves it |
|---|---|---|---|---|
| D1 | The codex entry in `DISPATCH_SHAPES` demands `-p|--print` after `codex exec`, but `codex exec` has no such flag. Both the documented dispatch and a minimal `codex exec --sandbox workspace-write -` return NO-MATCH, so codex `hard_rules` never fire and the audit writes no line. The stdin check uses a different list that matches correctly, so the two registries disagree about the same command. | `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:27-41`, especially `:33`, against `dispatch-rule-checks.mjs:78-89` | Drop the print-flag clause so the shape is `/\bcodex\s+exec\b/`, matching the headless list. | A shape fixture per runtime asserting that `DISPATCH_SHAPES` resolves the documented codex command to cli-codex and that `HEADLESS_DISPATCH_SHAPES` recognizes the same string. The codex fixture fails today. |
| D2 | `hermes-ignore-rules-required` exempts any command carrying `-s`/`--skills`, on the false premise that `--ignore-rules` also suppresses the skill preload. | `dispatch-rule-checks.mjs:184-186`, constant and comment at `:99-101` | Delete the `|| HERMES_SKILL_PRELOAD.test(cmd)` clause and the constant with its comment. | `dispatch-rule-checks.test.mjs:118` and `:119` flip from `[]` to `['ignore-rules-required']`, the comment at `:116-117` is replaced with the A/B result and one new positive case carrying both `-s cli-hermes` and `--ignore-rules` expects `[]`. |
| D3 | `hermes-explicit-toolsets-required` requires an explicit list excluding `delegation` and `memory` but never requires `file`, so `-t search,todo` passes and the leaf cannot read any file, exiting 0 with empty stdout. | `dispatch-rule-checks.mjs:189-194` | Require `file` in the parsed list, as the `hermes-read-toolset-required` predicate in §2.2. | `hermes chat -q x -t search,todo` reports a violation and `-t file,todo` reports none. |
| D4 | The rule message repeats the false preload claim verbatim, and the generated Hermes mirror carries the same text. | `cli-hermes/SKILL.md:19-22`, mirror at `.hermes/skills/cli-hermes/SKILL.md:19-21` | Drop the two exception clauses, keep "Every dispatch MUST pass `--ignore-rules`" and the injection rationale. Fix the canonical file then regenerate through `sync-skills-hermes.cjs`. Never hand-edit the mirror. | A regenerated mirror whose rule text matches the canonical file. |
| D5 | The persona dispatch contract rests on the same false premise and states that `--ignore-rules` is omitted because `-s` is in play. | `cli-hermes/references/agent-delegation.md:48`, `manual-testing-playbook/agent-routing/persona-via-agent-skill-and-plugin.md:46`, `manual-testing-playbook/skills-and-plugins/project-skill-preload.md:34,55,76,80` | Add `--ignore-rules` to every persona and preload command and replace the "documented exception" notes with the A/B result. The persona still arrives through `-s`, and the plugin's `skill_view` fallback covers a stripped preload. | The HERMES-016 scenario re-run with `--ignore-rules` present, its expected evidence rewritten to require the flag. |
| D6 | The upstream flag table transcribes Hermes's live help as `--ignore-rules` skipping "preloaded skills injection", which is where every downstream artifact inherited the claim. | `cli-hermes/references/cli-reference.md:50`, correct statement already at `:88` | Keep the flag name and correct or annotate the preload clause against the A/B counterexample. | None beyond review. The two statements in the same file become consistent once the exemption is gone. |
| D7 | `stdin-redirect-required` is declared `warn` in all seven skills, so the largest silent-hang class never blocks. | every `cli-*/SKILL.md` `hard_rules:` block | Flip the seven declarations to `error`. No check code changes. | The existing stdin cases assert a blocking violation rather than an advisory one. |
| D8 | `explicit-model-required` and `command-flag-for-slash-prompt` are `warn` on opencode, covering a 429 silence and a prose-delivered slash command. | `cli-opencode/SKILL.md:11-22` | Flip both to `error`, after D9 fixes the slash predicate. | A fixture pair per rule, one passing and one violating, asserting the blocking severity. |
| D9 | Three predicates are bypassable by an equals sign or by quoting: `--agent=general` slips the `\s+` predicate, `--share=<value>` slips and an unquoted slash prompt slips. | `dispatch-rule-checks.mjs:153-161` | Accept `(\s+|=)` after the flag and match a slash prompt whether or not it is quoted. | The three shapes confirmed as silent passes in the 2026-09-15 probe each become a reported violation. |
| D10 | The write-toolset roster behind `yolo-required-for-writes` covers four names, and a write-capable toolset outside that list passes. `-t shell` without `--yolo` was a confirmed silent pass. **Inferred:** whether Hermes accepts any write-capable toolset name beyond the four. An unknown name may be rejected loudly, which would lower the risk. | `dispatch-rule-checks.mjs:98` | Widen the roster once the accepted toolset names are confirmed against the runtime. | Confirming check: enumerate Hermes's accepted toolset names, then a fixture per write-capable name. |
| D11 | `AGENTS.md` section 7 carries one `U+200D` joiner, the only one in the file, and Hermes's context scanner blocks the whole file on it. The file measures 25,085 characters and 25,263 bytes. The heading is `## 7. 🧑‍🏫 ESCALATION & CONFLICT`, codepoints `0x1f9d1 0x200d 0x1f3eb`. | `AGENTS.md:247` | Replace the sequence with a single-codepoint emoji. Any replacement must avoid ZWJ sequences, because the scanner blocks on the joiner rather than on the emoji. | A Hermes session that injects rules, meaning no `--ignore-rules`, quoting a section 7 line, with the pre-fix block recorded as the control. |
| D12 | The fan-out builder wires `HERMES_SPEC_FOLDER` and the read-only marker but never sets `HERMES_ENABLE_PROJECT_PLUGINS=1` or `HERMES_AGENT_PERSONA`. Without the first, a Hermes lineage runs with no repo guard hooks, so the read-only refusal is inert, the spec folder is unused and the session-context section never appears. Without the second, `_persona()` returns empty and no persona binds. | `fanout-run.cjs:3268-3272`, `.hermes/plugins/repo-guards/__init__.py:133,689-713`, `cli-hermes/references/hook-contract.md:53` | Add both env lines to the `extraEnv` block. The operator's `plugins.enabled` line stays a documented step. | A builder unit asserting a cli-hermes lineage's dispatch env contains both variables, plus one live lineage whose agent log shows a session plugin prompt section. |
| D13 | Five builder paths probe `command -v` and throw before constructing anything. The Claude and OpenCode paths do not, so the two richest runtimes are the two the builder cannot refuse. | `fanout-run.cjs:2066,2104,2200,2309,2431,2536,2654,2737-2790` | Mirror the existing helper into both paths. | A unit with a PATH lacking the binary expecting `inputError` naming the executor. |
| D14 | Builder model defaults diverge from packet defaults. Codex builds `o4-mini` against a documented `gpt-5.5`, and OpenCode builds `anthropic/claude-opus-4-8` against a documented `opencode-go/deepseek-v4.1-flash`. Neither kind validates against a roster, because Claude, Codex and OpenCode have no `*_ALLOWED_MODELS`. Codex also appends `-c service_tier` only when the lineage sets one, while the packet says the tier stays on `fast`. | `fanout-run.cjs:2070,2071-2083,2200-2203`, `cli-codex/SKILL.md:201,219`, `cli-opencode/SKILL.md:174` | Point each default at the packet's pinned model, default the codex service tier to `fast` and assert defaults against the documented value rather than a literal. | A unit per kind asserting the default model when `lineage.model` is unset, and `-c service_tier=fast` for a codex lineage with no explicit tier. |
| D15 | The Devin dispatch hook entry is a bare `bash -c` with no drift fallback, so a moved adapter is invisible there. Claude, Codex and Cursor entries all carry `mkHookDrift`. | `.devin/hooks.v1.json:72`, against `.claude/settings.json` and `.codex/hooks.json:69` | Extend the drift-fallback pattern to the Devin entry. | A registration test that fails when a config entry is deliberately removed, plus a path-existence assertion per entry. |
| D16 | Documentation states counts the code contradicts. The dispatch README says "the five checks currently registered" against a 17-check registry and documents Cursor as audit only with no preflight, while `.cursor/hooks.json` wires three `preToolUse` adapters. The availability block's comment says "The four availability rules below" above five implementations. | `.opencode/hooks/dispatch/README.md` §1, §2 and §3, `dispatch-rule-checks.mjs:162-170` | Correct the counts and the Cursor row. | Review. A severity audit run from the README alone would be wrong, which this research demonstrated in iteration 1. |
| D17 | The CI bijection test asserts only that every declared check id exists in `KNOWN_CHECKS`. A check added to `CHECKS` and wired into no skill would be invisible dead code that still fails open. | `dispatch-rule-checks.test.mjs:29-45` | Add the reverse assertion. Orphans are zero in both directions today, verified by running the parser and the registry over all seven skills on 2026-09-15. | The extra assertion fails when a check is added to `CHECKS` without a skill declaring it. |
| D18 | `non-interactive-permission-mode-risk` fires purely on the absence of the bypass flag, which is a proxy for a condition the command string does not carry. | `dispatch-rule-checks.mjs:205-208` | Redesign the predicate or leave the rule advisory. At `error` the current predicate would produce false refusals. | A fixture set covering a safe prompt that needs no shell approval, which the current predicate cannot distinguish. |

Two integrity findings bound the defect list. No adapter re-implements severity mapping, rule parsing or dispatch-shape detection: Claude, Codex, Devin and Pi import `readHardRules`, `evaluate` and `DISPATCH_SHAPES` from the shared library, Cursor's post-tool proxy delegates to the Claude audit adapter and the OpenCode plugin uses the shared audit core. [`claude/dispatch-preflight-lint.mjs:21-22,86-88`, `codex/dispatch-preflight-lint.mjs:21-22`, `devin/dispatch-preflight-lint.mjs:20-21`, `pi/dispatch-preflight-lint.ts:261-275`] The realized drift is data rather than logic: two dispatch-shape registries that disagree (D1) and four model rosters duplicated as plain JS literals in `fanout-run.cjs` that each state they mirror `executor-config.ts`. [`fanout-run.cjs:2242-2244,2279-2282,2395-2397,2591-2595`, `executor-config.ts:241,262,366,438`]

One builder behavior must not be read as a defect. The fan-out builder closes stdin through process `stdio` rather than a `</dev/null` token, so the command strings a lineage logs would each trip `stdin-redirect-required` if pasted into a shell while the lineage itself cannot hang. A shape-parity guard must treat spawn-level stdin handling as satisfying the rule. [`fanout-run.cjs:63,1877,2676-2683`]

### 2.2 Coverage gaps: silent-wrong-result classes and the predicates that would catch them

Per runtime, the classes that produce a silent wrong result rather than an error, with the surface that enforces each today. P is a preflight check, B the fan-out builder and R prose only.

| Runtime | Silent class | Command-detectable | Enforced today |
|---|---|---|---|
| all seven | stdin not redirected, so the run hangs at zero output | yes | P, `stdin-redirect-required` at warn |
| claude | model omitted, so the CLI default substitutes silently | yes | R |
| claude | `-p` without `--output-format text`, so the parse shape drifts | yes | R |
| codex | model omitted, and the builder default differs from the packet default | yes | R and B |
| codex | approval policy default stalls a non-interactive run (**inferred** from the builder's explicit `-c approval_policy=never`, not from an observed stall) | yes | B at `fanout-run.cjs:2083`, no P |
| cursor | `--model auto` or omitted, so the router resolves outside the allowlist | yes | R. B rejects off-roster ids |
| cursor | sandbox or force posture omitted | partial | B |
| devin | `--permission-mode accept-edits` for implementation work, which spends the whole budget, writes nothing and exits 0 | yes | R at `cli-devin/SKILL.md:210-218`, no P |
| hermes | `-t` list without `file`, so the leaf cannot read and exits 0 empty | yes | P, defect D3 |
| hermes | `--provider` omitted, so the config default applies instead of `llmgateway` | yes | R, B pins it |
| hermes | `--source tool` omitted, so the run enters operator session lists | yes | R, B pins it |
| hermes | top-level `-z` oneshot, which drops the session id and auto-approves everything | yes | R, no P |
| hermes | `--run-budget` at or above the caller timeout, so wrap-up loses the race with the kill | yes when both numbers are present | R, B computes a margin |
| hermes | model outside the two-id roster | only with a roster table | B, `HERMES_ALLOWED_MODELS` |
| opencode | `-m` omitted, so a 429 retry loop produces no output | yes | P at warn |
| opencode | slash prompt without `--command`, delivered as prose | yes | P at warn |
| opencode | `--dir` omitted, so writes land relative to an unknown root | yes | R, B pins it |
| pi | `--offline` omitted, so startup network probes hang for minutes | yes | R and a B comment, no P |
| pi | provider omitted, so the `google` default applies | yes | R, B pins a qualified model |

The detectable classes with no check yet, written in the registry's own style, each returning `true` when satisfied:

```js
// Hermes: search is web-only and todo cannot read; file holds read+write tools.
'hermes-read-toolset-required': (cmd) => {
  if (!/\bhermes\s+chat\b/.test(cmd)) return true;
  const m = cmd.match(/(?:^|\s)(?:-t|--toolsets)(?:\s+|=)([^\s]+)/);
  if (!m) return true;                        // no list: explicit-toolsets-required reports it
  return m[1].split(',').map((s) => s.trim()).includes('file');
},
'hermes-provider-pinned':        (cmd) => !/\bhermes\s+chat\b/.test(cmd) || /(^|\s)--provider(\s|=)/.test(cmd),
'hermes-source-tool':            (cmd) => !/\bhermes\s+chat\b/.test(cmd) || /(^|\s)--source\s+tool(\s|$)/.test(cmd),
'hermes-no-oneshot-z':           (cmd) => !/\bhermes\s+(?:[^|;&]*\s)?-z\b/.test(cmd),
'hermes-budget-under-timeout':   (cmd) => {
  const budget = cmd.match(/--run-budget(?:\s+|=)(\d+)/);
  const timeout = cmd.match(/\b(?:timeout|gtimeout)\s+(?:-k\s*\S+\s+)?(\d+)/);
  if (!budget || !timeout) return true;        // nothing to compare: n/a
  return Number(budget[1]) <= Number(timeout[1]) - 60;
},
// Pi: without --offline a non-interactive run can hang minutes on startup probes.
'pi-offline-required': (cmd) => !/\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/.test(cmd) || /(^|\s)--offline(\s|$)/.test(cmd),
// Pi: provider is encoded as `provider/model`; a bare id falls back to the google default.
'pi-provider-qualified-model': (cmd) => {
  if (!/\bpi\s+(?:[^|;&]*\s)?(?:-p|--print)\b/.test(cmd)) return true;
  const m = cmd.match(/(?:^|\s)(?:-m|--model)(?:\s+|=)([^\s]+)/);
  return Boolean(m) && m[1].includes('/');
},
// opencode: writes land relative to an unknown CWD without --dir.
'opencode-dir-pinned': (cmd) => !/\bopencode\s+run\b/.test(cmd) || /(^|\s)--dir(\s|=)/.test(cmd),
// cursor: the `auto` router silently leaves the allowlist; a bare -p with no model also routes.
'cursor-model-pinned': (cmd) => {
  if (!/\bcursor-agent\s+(?:[^|;&]*\s)?-p\b/.test(cmd)) return true;
  const m = cmd.match(/--model(?:\s+|=)([^\s]+)/);
  return Boolean(m) && m[1].toLowerCase() !== 'auto';
},
'claude-model-pinned': (cmd) => !/\bclaude\s+(?:-p|--print)\b/.test(cmd) || /(^|\s)--model(\s|=)/.test(cmd),
'codex-model-pinned':  (cmd) => !/\bcodex\s+exec\b/.test(cmd) || /(^|\s)--model(\s|=)/.test(cmd),
// devin: accept-edits is the documented silent-empty-result posture for implementation work.
'devin-permission-mode-advisory': (cmd) => !/\bdevin\s+(?:[^|;&]*\s)?-p\b/.test(cmd) || /--permission-mode(\s+|=)(dangerous|autonomous)/.test(cmd),
```

Three notes bound that block. Pi's `--offline` gap is the strongest new candidate: the builder makes the flag mandatory and its comment gives the reason, yet no rule declares it and no check implements it, so an ad-hoc `pi -p` that satisfies the stdin rule can still hang for minutes with the same observable shape as a slow model. [`fanout-run.cjs:2559-2565`, `cli-pi/SKILL.md:9`] Budget adequacy is decidable only between two numbers the command itself carries, since a preflight never knows the work size. [`cli-hermes/SKILL.md:210,233-234`] Model-allowlist checks need a roster table, and the repo already carries two copies of each roster, so the recommendation is to derive a read-only roster from `executor-config.ts` inside the CI guard rather than hand-copy a third into the hook engine. [`fanout-run.cjs:2242-2282,2395-2410,2591-2595`, `cli-opencode/SKILL.md:200`]

Classes with no predicate proposed, because the command string cannot carry them: model capability against the task, prompt quality, credential state, task-dependent toolset adequacy and the intent half of the devin `accept-edits` case. [`cli-pi/SKILL.md:162,187`, `cli-devin/SKILL.md:210-218`]

### 2.3 Fail-open paths that silently disable enforcement

The fail-open design is deliberate and documented, and it converts every internal error into approval. `readHardRules` returns `[]` on any read or parse error, `evaluate` skips unknown checks and treats a throwing check as satisfied and every adapter approves on an unparseable payload. The stated rationale for availability probing, that a false pass only costs the exec failure the caller would have seen anyway, does not carry to the dispatch surface, where a false pass is exactly the silent hang this research targets. [`dispatch-rule-checks.mjs:60-67,103-109,227-239`, `dispatch/README.md` §7]

| # | Path | Mechanism | Operator notices | Cheapest detector |
|---|---|---|---|---|
| 1 | SKILL.md missing or `packetPath` renamed | `readHardRules` returns `[]` and the dispatch is approved | no | CI: every `DISPATCH_SHAPES.packetPath` resolves to a SKILL.md that parses to at least one rule |
| 2 | Frontmatter parse failure | `parseHardRules` returns `[]` and the bijection test passes vacuously on an empty list | no | CI: assert a parsed rule count above zero per `cli-*` skill, one line in the existing test |
| 3 | Unknown check id | skipped in the hot path, caught by the existing guard | yes, at CI | exists, `dispatch-rule-checks.test.mjs` |
| 4 | A check throws at runtime | `evaluate` catches, treats it as satisfied and approves | no | CI: one passing and one violating fixture per check id |
| 5 | Hook not registered | the adapter never runs, so there is nothing to fail open | no | CI: assert each runtime config declares the preflight entry for its event or tool |
| 6 | Adapter renamed or moved | Claude and Codex emit `mkHookDrift`, Cursor entries carry per-entry fallbacks, Devin's entry has none | partial | the same registration test, plus D15's fallback |
| 7 | Kill switch persisted in `hook-flags.env` | `isHookEnabled('dispatch')` is false and every dispatch hook no-ops, from a gitignored file | no | a session-start advisory listing active kill switches |
| 8 | Shape registry no-match, realized for codex | the preflight resolves no skill and the audit records nothing | no | CI shape-parity fixtures, one documented command per runtime |
| 9 | Pi extension symlink broken | no Pi adapter loads | no | CI: symlink resolution over `.pi/extensions/` |
| 10 | Wiring env gap, the Hermes plugin opt-in and persona | the guard exists but its loader or input is absent | no | builder env unit assertions plus one live lineage |
| 11 | Compiled dist stale | stale adapter behavior | partial, Cursor session start runs a staleness check | exists where it applies. Dispatch adapters are `.mjs` today, so this is latent |
| 12 | Malformed or non-dispatch payload | approve | not applicable | none, correct by design |

For paths 1, 2, 4, 5, 6, 7, 8, 9 and 10 the disabled state and the passing state are byte-identical at runtime: approve, exit 0, no output. Registration drift is real rather than hypothetical, because only Codex is reconciled, by `install-codex-hooks.mjs` with a `--check` surfaced at session start. `.claude/settings.json`, `.cursor/hooks.json` and `.devin/hooks.v1.json` are versioned in-repo and nothing asserts they still contain the dispatch entry. [`.opencode/hooks/hook-install/README.md` §1-2]

## 3. Parity table for Cursor and OpenCode

Both runtimes have a live pre-execution surface. The charter's premise that Cursor carries only a post-tool-use file is true of the dispatch adapters and false of the runtime: `.cursor/hooks.json` already wires three `preToolUse` adapters, one of them a `Shell`-matcher advisory built on the same hard-rule engine. The gap is wiring, not platform.

| Runtime | Pre-execution surface available | Adapter shape | Cost | Detection latency |
|---|---|---|---|---|
| Cursor | yes. `.cursor/hooks.json` `preToolUse` array with a `matcher` field, three adapters wired today, one confirmed live-firing under cursor-agent 2026.07.23-e383d2b | A translation shim on the `Shell` matcher that spawns the 106-line `claude/dispatch-preflight-lint.mjs` as its core, normalizes the Cursor payload to `{tool_name:'Bash', tool_input:{command}, cwd: workspace_roots[0]}` and translates the reply into `{permission:'deny', user_message, agent_message}` with exit 2 or into `{permission:'allow', agent_message}` for an advisory | roughly the size of the existing `task-dispatch-guard.mjs` shim. The shared check library and `DISPATCH_SHAPES` are reused unchanged, so the only new code is payload and output translation | zero, before the spawn |
| Cursor today | no preflight. `cursor/post-tool-use.mjs` is a multiplexed proxy that never blocks, routing `Shell` payloads into the Claude dispatch-audit adapter and emitting `{permission:'allow'}` | audit only | already paid | after the full dispatch completes, and a hung dispatch produces no post event at all |
| OpenCode | yes. The plugin API denies by throwing from `tool.execute.before`, and the plugins README names throwing as the deny signal | A `tool.execute.before` hook added to the existing audit plugin or a sibling under the same `dispatch` kill switch. It imports `readHardRules` and `evaluate` plus `DISPATCH_SHAPES`, reads `output?.args?.command`, resolves the SKILL.md under `projectDir`, evaluates, throws a prefixed error to deny and buffers advisory text for the next `experimental.chat.system.transform` | lower than Cursor's. No subprocess is spawned, so the added cost is one regex match plus one small file read on dispatch-shaped commands only | zero for blocks. Advisories arrive on the next system transform, so a warning can trail the dispatch it is about |
| OpenCode today | no preflight. `cli-dispatch-audit.js` runs `tool.execute.after` for `bash` only, builds a scrubbed JSONL line through `recordDispatch` and is explicitly observational | audit only | already paid | after the tool result exists, and never for a hung run |

Citations: [`.cursor/hooks.json` preToolUse array], [`.opencode/hooks/task-dispatch/cursor/task-dispatch-guard.mjs:3-10,104-124`], [`.opencode/hooks/dispatch/cursor/post-tool-use.mjs:1-40,56-64`], [`.opencode/hooks/dispatch/claude/dispatch-preflight-lint.mjs:1-106`], [`.opencode/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-enforce.mjs:32-49`], [`.opencode/plugins/README.md:35,84,122-123`], [`.opencode/plugins/system-deep-loop-guard.js:71,73-76,93-96`], [`.opencode/plugins/cli-dispatch-audit.js:1-16,22-31,44-48,60-90`], [`.opencode/plugins/sk-git-preflight-advisory.js:92`].

Three facts shape both adapters:

- **The shared engine already runs on Cursor.** `sk-git/scripts/hooks/git-preflight-advisory.mjs` imports `evaluate` and `readHardRules` straight from the dispatch library, reads the same `hard_rules:` frontmatter, accepts Claude, Codex, Devin and Cursor payloads in one body and resolves the Cursor project root from `payload.workspace_roots[0]`. A Cursor dispatch preflight needs no new library. [`git-preflight-advisory.mjs:28-33,95-101,140-147`]
- **Emit the Cursor-native envelope rather than the raw Claude one.** Both dispatch-relevant shims translate explicitly, so the native `permission`/`agent_message` shape is the lower-uncertainty choice. Open question: whether a plain `.mjs` `preToolUse` hook emitting raw `hookSpecificOutput` is honored on Cursor without translation.
- **A plugin only sees its own host.** An OpenCode-session plugin sees commands executed inside an OpenCode session. A `claude -p "opencode run ..."` chain, or a command typed in Cursor, still needs that host's adapter. OpenCode parity is exactly parallel to the other adapters in coverage, not a replacement for them. [**inferred** from the plugin event wiring, since `tool.execute.before` fires in the host that loads the plugin]
- **Check the kill switch first.** The audit plugin gates on `isHookEnabled('dispatch')` and the deep-loop guard's comment requires that check before any policy evaluation or denial, so a disabled dispatch concern can never block.

## 4. Ranked recommendations

Score is severity times confidence divided by cost. Severity runs 1 to 5, where 5 is a silent wrong run or a whole runtime unenforced. Confidence runs 0 to 1 and reflects verification strength. Cost runs 1 to 5, where 1 is a frontmatter, regex or test flip, 3 is a new adapter with tests and 5 is a multi-file subsystem. The ratio orders the table and the grouping applies judgment on top of that order.

| Rank | Recommendation | Sev | Conf | Cost | Ratio | Group |
|---|---|---|---|---|---|---|
| 1 | Fix the codex dispatch shape in the shared registry, dropping the print flag. The whole runtime's preflight and audit are inert today. [`dispatch-audit.mjs:33`] | 5 | 0.95 | 1 | 4.75 | **now** |
| 2 | Set `HERMES_ENABLE_PROJECT_PLUGINS=1` in the runner's dispatch env. Without it the repo plugin, the read-only marker and the spec-folder wiring are all inert. [`fanout-run.cjs:3268-3272`, `hook-contract.md:53`] | 5 | 0.80 | 1 | 4.00 | **now** |
| 3 | Remove the `-s` exemption from `hermes-ignore-rules-required`, flip the two test assertions and fix the message, then raise to error. The premise is disproved. [`dispatch-rule-checks.mjs:184-186`, `dispatch-rule-checks.test.mjs:116-119`, `cli-hermes/SKILL.md:19-22`] | 4 | 0.95 | 1 | 3.80 | **now** |
| 4 | Flip `stdin-redirect-required` from warn to error in all seven skills. Deterministic check, largest silent-hang class. [`cli-*/SKILL.md` hard_rules blocks] | 4 | 0.90 | 1 | 3.60 | **now** |
| 5 | Fix `hermes-explicit-toolsets-required` to require `file`, then raise to error. `-t search,todo` passes and the leaf exits 0 empty. [`dispatch-rule-checks.mjs:189-194`] | 4 | 0.90 | 1 | 3.60 | **now** |
| 6 | Flip opencode's `explicit-model-required` and `command-flag-for-slash-prompt` from warn to error. 429 silence and prose delivery. [`cli-opencode/SKILL.md:11-22`] | 4 | 0.85 | 1 | 3.40 | **now** |
| 7 | Remove the `U+200D` joiner from `AGENTS.md` section 7. It clears the Hermes scanner block, and the blast radius is one line with zero automated checks. [`AGENTS.md:247`] | 3 | 0.90 | 1 | 2.70 | **now** |
| 8 | Add the `pi-offline-required` and `pi-provider-qualified-model` checks. Multi-minute startup hang and a google-default provider. [`fanout-run.cjs:2559-2565`] | 4 | 0.90 | 2 | 1.80 | **next** |
| 9 | OpenCode preflight: add `tool.execute.before` to the audit plugin, throwing to deny and buffering to advise. [`cli-dispatch-audit.js:60-90`, `plugins/README.md:84`] | 4 | 0.90 | 2 | 1.80 | **next** |
| 10 | Fix the three predicate bypasses: `--agent=general`, `--share=<value>` and unquoted slash prompts. [`dispatch-rule-checks.mjs:153-161`] | 2 | 0.90 | 1 | 1.80 | **next** |
| 11 | Raise `hermes-mcp-config-operator-required` to error, because it mutates operator state. [`cli-hermes/SKILL.md:31-34`] | 3 | 0.60 | 1 | 1.80 | **next** |
| 12 | Cursor preflight shim over the Claude adapter, on the `Shell` matcher with the Cursor permission envelope. [`task-dispatch-guard.mjs:104-124`, `.cursor/hooks.json` preToolUse] | 4 | 0.85 | 2 | 1.70 | **next** |
| 13 | Add the Devin drift fallback on the dispatch entry, plus registration assertions for claude, cursor, devin and pi. [`.devin/hooks.v1.json:72`] | 2 | 0.85 | 1 | 1.70 | **next** |
| 14 | Add a kill-switch advisory line at session start. [`hook-flags.cjs:1-20`] | 2 | 0.85 | 1 | 1.70 | **next** |
| 15 | Builder parity: claude and opencode availability probes, codex `o4-mini` to `gpt-5.5`, opencode default alignment, codex service tier defaulting to `fast`. [`fanout-run.cjs:2070,2104,2200-2203,2737-2790`] | 3 | 0.85 | 2 | 1.28 | **next** |
| 16 | Build the one CI guard: shape parity across both registries, bijection in both directions, at least one rule per skill, per-check pass and violation fixtures, runtime registrations. [`dispatch-rule-checks.test.mjs:33-45`] | 4 | 0.90 | 3 | 1.20 | **next** |
| 17 | Doc drift sweep: the README's five-of-17 check list, the "four availability rules" comment, the Cursor audit-only row and the skill prose contradictions. [`dispatch/README.md`, `dispatch-rule-checks.mjs:162-170`] | 1 | 0.95 | 1 | 0.95 | **next** |
| 18 | Persona wiring: `HERMES_AGENT_PERSONA` plus `-s agent-<name>`, sequenced after the exemption fix. [`repo-guards/__init__.py:133`, `agent-delegation.md:48`] | 3 | 0.80 | 3 | 0.80 | **next** |
| 19 | Add the Hermes provider, source, no-`-z` and budget checks, plus opencode `--dir`, cursor `auto`, claude and codex model pinning and the devin permission-mode advisory. [§2.2 predicates] | 3 | 0.75 | 3 | 0.75 | **next** |
| 20 | Redesign the `non-interactive-permission-mode-risk` predicate, which currently demands the bypass flag. [`dispatch-rule-checks.mjs:205-208`] | 2 | 0.60 | 2 | 0.60 | **next** |

### Do not

| Recommendation | Why not |
|---|---|
| A repo-rules digest prompt section [`repo-guards/__init__.py:126-129`] | A 4,000-character section carries at most 16% of a 25,085-character file, an over-cap section is skipped rather than truncated and the digest becomes a fifth ungoverned copy of governance content. Name the file in the dispatch prompt instead. |
| A per-dispatch runtime self-test of all checks | It multiplies per-call cost to catch static conditions CI catches once. |
| A third model-roster copy inside the hook engine | The two existing copies already drift. Derive from `executor-config.ts` in the CI guard instead. |
| A Cursor-specific or OpenCode-specific reimplementation of the engine | The shared `evaluate` and `readHardRules` already run on both. A copy is a second thing to drift. |
| Hand-editing the generated `.hermes` mirror, or rewriting the dated benchmark reports | The mirror regenerates. The reports are dated history, and correcting them would obscure how the defect entered. |
| A fail-closed posture | It trades a silent failure for a hard one. The detectors in §2.3 restore the signal without the trade. |
| Wiring the Hermes persona before the exemption fix | It would freeze the disproved `-s` exemption into the builder. |

### The measured budget behind the digest decision

Hermes caps every plugin prompt section at 4,000 characters and skips a section that exceeds the cap rather than truncating it. No total cap exists anywhere in the plugin or the packet. The adjacent budgets are `PROMPT_CONTEXT_MAX_CHARS = 3000` and `ADVISOR_BRIEF_MAX_CHARS = 1200`. [`repo-guards/__init__.py:54-55,126-129,841-853`]

| Section | Cap | Cost | Headroom | Evidence |
|---|---|---|---|---|
| session-context | 4000 | 303 without a bound packet, 3402 with a bound packet plus a goal slice | 3697, or **598** in the packed case | Playbook HERMES-015 first pass and second-pass re-verify |
| persona | 4000 | 276 for `code` up to 321 for `deep-research`, a fixed template | about 3679 to 3724 | computed by replicating the renderer template |
| goal | 4000 | 0 with no bound goal, up to 3621 when the directive block exceeds the 3600-character slice cap plus a 21-character truncation notice | 4000, or **379** in the worst case | renderer caps at `GOAL_SLICE_MAX_CHARS = 3600`, then the section slice at 4000 |
| session-advisories | 4000 | variable, one `name: warning` line per warning session-start guard | up to 4000, the renderer truncates | renderer joins guard lines and slices at `SECTION_MAX_CHARS` |

Worst case across the four registered sections is 16,000 characters. The realistic bound is roughly 3,700 to 7,300. The scarcest section is session-context at 598 characters of headroom whenever a bound packet carries a large goal. [`repo-guards/__init__.py:54,128-129,615-637,703-713,735-775`]

The section 7 joiner removal is safe on every repo-side consumer checked. `validate_document.py` sets `EMOJI_REQUIRED_TYPES = set()` and no longer enforces heading emojis, and `extract_structure.py` tests single-codepoint ranges, so the leading 🧑 alone keeps `has_emoji` true. [`extract_structure.py:171,307-331`, `validate_document.py:259,666-668`] The only generator that reads `AGENTS.md` is `sync-gate1-pointers.cjs`, which extracts the Gate 1 marker line, so a heading change produces no diff in either pointer file. The pre-commit mirror checker does not cover `AGENTS.md`, and `CLAUDE.md` is a symlink to it. [`sync-gate1-pointers.cjs:24,30-35,55`, `.opencode/scripts/git-hooks/pre-commit:88-100,126-129`] Only two archived snapshots under `specs/sk-doc/055-governance-doc-alignment/scratch/` carry the same heading, and no automated check compares them.

## 5. Phase decomposition

| Phase | One-line scope | Dependencies | Closing gate |
|---|---|---|---|
| **1. Close the silent holes** | Land ranks 1 to 7: the codex shape, the Hermes plugin opt-in, the three severity flips, the exemption removal, the `file` toolset requirement and the `AGENTS.md` joiner, plus the doc sweep those edits touch | none | `node --test dispatch-rule-checks.test.mjs` green with the flipped assertions, shape fixtures green on all seven documented commands, a builder env unit test for the Hermes opt-in and a Hermes session quoting a section 7 line |
| **2. Extend coverage** | Land ranks 8 to 14 and 17, 19 and 20: the new predicates and bypass fixes, the OpenCode `tool.execute.before` hook, the Cursor shim, the Devin fallback and the registration plus kill-switch detection | Phase 1, so the shape registry and the severities are stable | one live denial per new adapter, on the Cursor `Shell` matcher and on OpenCode bash, a pass and violation fixture per new predicate and a registration test that fails on a deliberately removed config entry |
| **3. Wire the builders** | Land ranks 15 and 18: availability parity, model-default alignment, the service-tier default and the persona env plus preload | Phase 1, because the persona shape depends on the exemption fix | builder unit tests per kind, plus one live Hermes lineage whose agent log shows the persona and session-context sections and the read-only refusal |
| **4. Make silence loud** | Land rank 16 as the closure of Phase 2's detection half: both-registry shape parity, bijection plus rule count, per-check fixtures, roster agreement and registrations, in one mutation-proofed file | Phases 1 and 3, so shapes and rosters are frozen | the guard is green on main and red when any single assertion is mutated by hand |

The guard in Phase 4 assembles three assertion families over a fixture table of one documented dispatch command per runtime. Shape parity requires that `DISPATCH_SHAPES` resolves each documented command to that runtime's skill and that `HEADLESS_DISPATCH_SHAPES` recognizes the same string as headless. Bijection requires that declared check ids across the `cli-*` skills equal `KNOWN_CHECKS` in both directions. Roster agreement requires that each `*_ALLOWED_MODELS` literal in `fanout-run.cjs` equals its `executor-config.ts` counterpart and that each builder default model is inside its own roster. The roster assertion must live in the runtime tests rather than the hook tests, because only the runtime side can read the TypeScript source. Severity mapping and rule parsing need no guard, since each has exactly one implementation site. [`dispatch-rule-checks.test.mjs:29-45`, `sk-git-preflight-advisory.js:17-21,101-114`, `git-rule-checks.mjs:28`]

## 6. Open questions and inferred claims

| Question | Status | What would confirm it |
|---|---|---|
| Does Hermes accept any write-capable toolset name beyond `terminal`, `coding`, `code_execution` and `browser`? | inferred gap. `-t shell` is a confirmed silent pass of the check, but an unknown toolset name may be rejected loudly by the runtime | Enumerate Hermes's accepted toolset names, then widen `HERMES_WRITE_TOOLSETS` to match |
| Does the codex approval-policy default actually stall a non-interactive run? | inferred from the builder's explicit `-c approval_policy=never` at `fanout-run.cjs:2083`, never observed | Reproduce a live stall without the setting |
| Does a plain `.mjs` `preToolUse` hook emitting raw `hookSpecificOutput` work on Cursor without translation? | open. Both dispatch-relevant Cursor shims translate explicitly, which is why translation is the recommended shape | One Cursor run with an untranslated envelope |
| When does an OpenCode buffered advisory reach the operator? | open. The repo documents draining on the next `experimental.chat.system.transform`, so a warning can trail its dispatch. Blocking throws are pre-execution by construction | Observe the transform timing in a live OpenCode session |
| Do other Hermes preload forms behave like `-s cli-hermes` under `--ignore-rules`? | inferred. The A/B covered one form, and `HERMES_SKILL_PRELOAD` matches both the short and long flags on the same code path | An A/B over `--skills=` and a multi-skill list |
| Does the Hermes section-7 joiner have consumers outside this repository? | bounded claim. The scanner is outside the repo, so the no-other-consumer finding covers this repository only | The Hermes-side proof run named in D11 |
