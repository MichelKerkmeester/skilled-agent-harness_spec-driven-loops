# Brief: are these four router-drift cases worth fixing, and is any fix safe?

## Your role, and the rules that bind you

You are a read-only reviewer working inside this repository. Read anything. Run read-only commands:
`rg`, `find`, `git log`, `git show`, `node .skilled/bin/compiled-route-admission.cjs`,
`node .skilled/bin/compiled-route.cjs`.

- The **only** file you may create or modify is
  `specs/sk-code/009-sk-code-mobile-cli-deprecation/scratch/devin-swe2-drift-advice.md`.
  Do not edit, create, delete or stage anything else.
- Do not run state-changing git commands (no `add`, `commit`, `checkout`, `restore`, `stash`, `reset`).
- Do not dispatch any other agent, CLI or subagent.
- Gate 3 (spec folder) is pre-resolved for you: the artifact root for this work is
  `specs/sk-code/009-sk-code-mobile-cli-deprecation/`.
- Cite `file:line` (or the exact command and its observed output) for every factual claim about this
  repository. Mark anything you did not verify as UNKNOWN.

## Background

`.skilled/bin/compiled-route-admission.cjs` scores each hub's playbook "routing gold" against what the
compiled router actually decides for that scenario's prompt. It reports four scenarios as `drift`,
meaning the written promise and the engine's decision disagree. Every hub still reports `admitted`,
and CI runs this checker with `--warn-only`. A separate class, `stale-gold`, was repaired earlier today
by editing scenarios whose promises were factually wrong (a mode that had moved to another hub, a mode
list that no longer matched `mode-registry.json`, leaf entries attributed to the wrong mode).

The four remaining, with each engine decision observed on 2026-09-19:

1. **SD-H02** — `.skilled/skills/sk-doc/manual-testing-playbook/holdout/doc-quality-natural.md`.
   Prompt: `Go through this skill's write-ups and tell me what wouldn't clear our review bar before I ship it.`
   Written expectation: `sk-create-quality-control`. Engine: `defer` (no target). Its frontmatter marks
   `stage: holdout`, i.e. the prompt deliberately avoids the router's taught phrases.
2. **SD-015** — `.skilled/skills/sk-doc/manual-testing-playbook/token-cost-baseline/max-load.md`.
   Prompt: `Show the full sk-doc toolkit: all templates, frameworks, format guide, references, and assets.`
   Written expectation: every mode's resources load (the on-demand ceiling). Engine: `defer`.
   Its gold was already repaired against `.skilled/skills/sk-doc/leaf-manifest.json`.
3. **AI-003** — `.skilled/skills/system-deep-loop/manual-testing-playbook/advisor-integration/command-bridge-guard.md`.
   Prompt: `Benchmark a model against prompt framework candidates.` Written expectation: `UNKNOWN`, because a
   bare prompt must not enter a command-bridge lane. Engine: routes `model-benchmark`.
   `.skilled/skills/system-deep-loop/mode-registry.json` declares that mode's `routingClass` as
   `command-bridge`.
4. **MO-004** — `.skilled/skills/system-deep-loop/manual-testing-playbook/mode-routing/mode-hint-override.md`.
   Prompt: `research: Investigate whether our deep review findings are repeating because the source context is stale, and write a research summary before any audit verdict.`
   Written expectation: `research`, on the hub rule that a `research:` hint overrides classification.
   Engine: `clarify`.

## Questions, to be answered in this order

1. For each case, which side is wrong: the scenario's expectation, or the engine? Name the command you
   ran or the `file:line` you read to decide, and say what would change your answer.
2. Which of the four can be fixed by a change that is **provably confined** to that hub or that scenario,
   with no effect on other hubs or other intents? For each, name the exact files to change, the check that
   would prove it, and the cost (policy re-mint, policy-hash change, fleet promotion, fixture refresh,
   a holdout that stops testing anything).
3. Which of the four **cannot** be fixed inside the hub because the missing behaviour lives in the shared
   compiled-routing engine? For those, say what the engine change would be and what else it would affect.
4. Is fixing any of them smart now, or is leaving them recorded the better call? Give **one**
   recommendation with its main trade-off, not a survey of options.
5. If you had to fix exactly one, name it, give the concrete change set, and the single check that proves it.
6. What in this framing is wrong or missing? In particular: is any case miscategorised, and is any of the
   four cheaper to fix than this brief assumes?

## What to return

Write the answer to the return file named above, structured as: verdict first, then per-case findings with
citations, then your recommendation and its trade-off, then what would change your mind. Then print a
summary of at most 10 lines as your final message.
