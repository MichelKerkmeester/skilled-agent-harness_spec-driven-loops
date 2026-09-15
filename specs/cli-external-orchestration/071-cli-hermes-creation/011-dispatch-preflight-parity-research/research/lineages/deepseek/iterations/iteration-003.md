---
title: "Iteration 3: Check Completeness — Silent-Wrong-Result Classes and Their Predicates"
trigger_phrases: []
---
# Iteration 3: Check Completeness — Silent-Wrong-Result Classes and Their Predicates

## Focus
For each `cli-*` runtime, enumerate dispatch mistakes that produce a silent wrong result rather than an error (missing read toolset, wrong provider, model outside the allowlist, missing stdin redirect, budget shorter than the work); decide which are detectable from the command string alone; write the check predicate for each detectable one.

## Findings

1. **Per-runtime inventory of silent-wrong-result classes, with the enforcing surface that exists today** (P = preflight check, B = fan-out builder, R = prose rule only):

| Runtime | Silent class | Command-detectable | Enforced today |
|---|---|---|---|
| all 7 | stdin not redirected → hang at zero output | yes | P (`stdin-redirect-required`, warn) |
| claude | model omitted → CLI default substitutes silently | yes | R (default documented, not checked) |
| claude | `-p` without `--output-format text` → parse shape drift | yes | R |
| codex | model omitted → CLI default substitutes; builder default `o4-mini` differs from packet default `gpt-5.5` | yes | R / B (builder sets its own) |
| codex | approval policy default → non-interactive stall | yes (inferred) | B (`-c approval_policy=never`); no P |
| cursor | `--model auto` (or omitted) → router silently resolves outside allowlist | yes | R ("`auto` is NOT used"); B rejects off-roster ids |
| cursor | `--sandbox`/`--force` posture omitted | partial | B |
| devin | `--permission-mode accept-edits` for implementation work → spends whole budget, writes nothing, exits 0 | yes | R (documented at cli-devin/SKILL.md:210-218); no P |
| hermes | `-t` list without `file` → cannot read, exits 0 empty stdout | yes | R/P (defect 3: check does not require `file`) |
| hermes | `--provider` omitted → config default provider, not `llmgateway` | yes | R; B pins it |
| hermes | `--source tool` omitted → run enters operator session lists | yes | R; B pins it |
| hermes | top-level `-z` oneshot → drops session id, auto-approves everything | yes | R ("never used"); no P |
| hermes | `--run-budget` ≥ caller timeout → wrap-up loses the race with the kill | yes when both numbers present | R; B computes margin |
| hermes | model outside the 2-id roster | only with a roster table | B (`HERMES_ALLOWED_MODELS`) |
| opencode | `-m` omitted → 429 retry loop, no output | yes | P (warn) |
| opencode | slash prompt without `--command` → prose delivery | yes | P (warn) |
| opencode | `--dir` omitted → CWD ambiguity, writes land relative to an unknown root | yes | R; B pins it |
| pi | `--offline` omitted → hangs minutes on startup network probes | yes | R + B comment ("mandatory"); no P |
| pi | provider omitted → `google` default, not the intended provider | yes | R (`pi --help` default google); B pins qualified model |

2. **Detectable predicates that do not exist yet** (written in the same style as the registry, each returning `true` when satisfied):

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

3. **Pi's `--offline` gap is the strongest new check candidate.** The fan-out builder makes the flag mandatory and its comment states the reason ("a non-interactive dispatch without it can hang for minutes on startup network probes"), but no hard rule declares it and no check implements it — an ad-hoc `pi -p "..."` that satisfies the stdin rule can still hang for minutes on network probes with the same observable shape as a slow model. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2559-2565 (builder comment and `args = ['-p','--offline','--model',...]`)] [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:9]

4. **Hermes provider/source/`-z` gaps are command-string-detectable with no roster data.** The packet pins `--provider llmgateway`, `--source tool`, and the `chat -Q --oneshot --query-file -` headless form; the builder emits all three unconditionally, while the preflight checks none of them. `-z` is the only documented Hermes form the packet expressly never uses ("it drops the session id and auto-approves everything"), which makes it a candidate for a straight ban rather than a warning. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2670-2680] [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/references/fanout-dispatch/hermes-executor-kind.md:32]

5. **Budget-shorter-than-work is detectable only in the co-present form.** A preflight never knows the work size; the only decidable relation is between two numbers the command itself carries (`--run-budget N` against a `timeout M` wrapper) or against the runner's own timeout — which the builder already computes with a 60-second margin. The predicate above encodes the margin; a budget with no timeout in sight stays `n/a`. [SOURCE: .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md:210,233-234]

6. **Model-allowlist checks are detectable only with a roster table, and the repo already carries two copies of each roster — a third in the hook engine would be the drift the shared-library angle is about.** `HERMES_ALLOWED_MODELS`, `PI_ALLOWED_MODELS`, `CURSOR_ALLOWED_MODELS`, `DEVIN_ALLOWED_MODELS` live in `fanout-run.cjs` explicitly duplicating `executor-config.ts` ("Mirrors … in executor-config.ts; duplicated as plain JS literal"). Codex, claude and opencode have no allowlist at all in either place, and cli-opencode's own SKILL.md records that: "cli-opencode has no code-enforced allowlist" (a hard discipline rule only). Recommendation: do **not** hand-copy rosters into `dispatch-rule-checks.mjs`; derive a read-only roster from `executor-config.ts` in the CI guard instead, and add per-runtime model checks only for the runtimes whose preflight runs in an environment that can resolve that single source. [SOURCE: .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:2242-2282,2395-2410,2591-2595] [SOURCE: .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md:200]

7. **Classes that are not command-string-detectable** (so no predicate is proposed): model capability/mismatch vs task; quality of the prompt; credential/auth state (needs a run — the packet's own rule is to inspect output text, never exit code); task-dependent toolset adequacy (whether a run needs `web`/`terminal` at all); the devin task-intent half of `accept-edits` (the flag is visible, the intent is not — hence advisory only). [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/SKILL.md:162,187]

8. **The devin `accept-edits` case is the one fully documented silent-wrong-result with no detector.** Under `accept-edits`, every tool call other than file edits is refused with `warning: rejected a tool call that requires confirmation`; in `-p` there is nobody to confirm, so "the observed failure is not an error — it is a dispatch that spends its whole budget exploring, writes nothing, and exits 0." The flag is visible in the command string, so the advisory predicate above is implementable; the task-intent half is not. [SOURCE: .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md:210-218]

## Ruled Out
- Predicting budget adequacy from a single number: without a second number (caller timeout / runner ceiling) the work size is unknown, and any threshold would be invented. [INFERENCE: based on the builder's margin computation at fanout-run.cjs:HERMES_RUN_BUDGET_MARGIN_SECONDS]
- Copying the model rosters into the preflight engine now: it adds a third copy of data that already drifts by design, before the CI drift guard iteration 6 will propose. [SOURCE: fanout-run.cjs:2242-2244,2395-2397]

## Dead Ends
- Probing for a `--offline` check by name: `grep` over the registry finds no `offline` check and no rule declaring one; the flag appears only in the builder and cli-pi prose. [SOURCE: .opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs:133-209]

## Edge Cases
- Contradictory evidence: codex builder default is `o4-mini` while the packet default is `gpt-5.5`; both "defaults" are real but belong to different callers (lineage builder vs ad-hoc skill dispatch). Recorded as a divergence, not a defect, since a preflight cannot see which caller composes the command. [SOURCE: fanout-run.cjs:2070] [SOURCE: cli-codex/SKILL.md:201]
- Partial success: the codex approval-policy stall is inferred from the builder's explicit `-c approval_policy=never`, not from an observed stall; mark `inferred` until a live stall is reproduced. [SOURCE: fanout-run.cjs:2083]
- Missing dependencies: none; every predicate uses flags documented in the packet.

## Sources Consulted
- .opencode/skills/cli-external-orchestration/cli-claude-code/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-codex/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-cursor/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-devin/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-hermes/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-opencode/SKILL.md
- .opencode/skills/cli-external-orchestration/cli-pi/SKILL.md
- .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs
- .opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts
