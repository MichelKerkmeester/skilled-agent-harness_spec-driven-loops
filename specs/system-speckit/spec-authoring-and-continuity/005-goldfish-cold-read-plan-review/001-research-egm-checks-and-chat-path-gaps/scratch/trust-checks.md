# Trust checks on the final recommendation list

Run by the orchestrating session on 2026-11-11, read-only. Each row says what was run and what it showed.

## Confirmed

- Intent keywords match on word boundaries. `references/cli/shared-smart-router.md:68-70` defines `keyword_present` with `(?<![a-z0-9])…(?![a-z0-9])`. Only the on-demand keywords use a bare substring test, at `system-spec-kit/ROUTER.md:394`.
- The plan template's phase line is pinned in four golden snapshots. `rg -F "name the three phases in one line"` hits `scaffold-golden-snapshots.vitest.ts.snap` at lines 483, 943, 1593 and 2433, and `templates/core/plan.md.tmpl`. Nothing else.
- No snapshot pins the fan-out summary shape. `rg -l "fanout|lineage" --glob '*.snap' .skilled` returns nothing.
- No CI workflow names the runner. `rg fanout .github` returns nothing.

## New, and they change the edit set

- `cli-deepseek-harness/references/repin-runbook.md:148-152` calls `fanout-run.cjs` directly and line 160 requires the config to "resolve to one lineage". The refusal breaks this operator procedure unless the runbook passes the escape flag.
- `tests/stress/cli-adapter/fixtures/adapter-fixture.ts:179` builds `executors: [executor]` for the whole adapter stress suite. One fixture edit covers it. The earlier list named three cases in `fanout.vitest.ts` and missed this file.
- All four workflow files invoke the runner in `step_fanout_spawn`, guarded only by `skip_when: "config.fanout is absent"`: `deep-research-auto.yaml:225`, `deep-research-confirm.yaml:238`, `deep-review-auto.yaml:228`, `deep-review-confirm.yaml:210`. A one-entry `--executors` value therefore reaches the runner through the proper command today.
- The advisor does not recommend `system-spec-kit` for a plain write request. `advisor_recommend` on "add a --keep flag to the rotate-logs script" returns `sk-code`, `sk-doc` and `mcp-tooling`, each at 0.82. The request also contains none of the `INTENT_SIGNALS` keywords at `ROUTER.md:160-175`, so the router falls back.

## Checked and found harmless

- The other docs that name the runner describe it and carry no invocation: `cli-opencode/SKILL.md:72`, the five `providers-and-models.md` files, `cli-prompt-quality-card.md:147`, the `cli-codex`, `cli-cursor` and `cli-devin` skill files.
- `write-containment`, `trustworthy-state-records`, `deep-research-run-open`, `postflip-fanout` and `unknown-options` tests read the source or import a helper. None launches a one-lineage run.

## Still unknown

- The exact number of unit tests the refusal turns red. `fanout-run.vitest.ts` has 106 matrix lines and 19 launch sites, and only a run after the edit gives the count.
- Whether the two compiled contracts regenerate from the command docs. `render-command-contract.vitest.ts` suggests so, and it was not run.
- Devin's truncation at runtime, the Reddit post and the EGM reviewer prompts.
