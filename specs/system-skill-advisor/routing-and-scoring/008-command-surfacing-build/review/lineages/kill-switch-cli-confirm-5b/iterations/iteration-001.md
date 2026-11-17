# Iteration 1: Correctness and Traceability of the Pass-Five Kill-Switch Fixes

## Dispatcher

- Run: `fanout-kill-switch-cli-confirm-5b-1794780590351-ezt1v0`
- Mode: review; target agent: `@deep-review`; execution: single review iteration
- Lineage: `kill-switch-cli-confirm-5b`; confirming-round-`5b` area `kill-switch-cli`
- Operator review focus: confirming round `5b`; read `review-brief-5b.txt` first; review the `kill-switch-cli` files plus docs that describe them; every finding carries `file:line` and a concrete input; check that the kill-switch names agree in code and docs and that docs agree with code; holdout hygiene is counts-only.
- Dimension this iteration: D1 correctness and D3 traceability. This is a confirming round, so the behavior claim and the doc that states it are read together: each of the six confirmed pass-five P2 findings for this area is checked against the fix at `d21dbc1cafe`, then the docs that describe the same switch set are compared with the resolver.
- Sources read this iteration: `review-brief-5b.txt`, `review-scope-5b.txt`, `review-focus-5b.txt`, `verify-5/report.md`, `032-review-pass-five-remediation/plan.md` (D13), `deep-review-strategy.md`, `deep-review-config.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, the diff `2a1a42263cc..d21dbc1cafe` for the five scope paths, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:70-80`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:39-60`, `.skilled/skills/system-skill-advisor/runtime/lib/README.md:54-140`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:9-15,100-175`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:13-22,145-160,215-245`, `.skilled/hooks/shared/hook-flags.cjs:38-106,230-285`, `.skilled/hooks/shared/env-aliases.cjs:1-50`, `.skilled/hooks/README.md:30-50`, `.skilled/hooks/hook-flags.env.example:1-20`, and the pass-five `kill-switch-cli-5` iterations as prior context.
- Steer channel: `steer.md` does not exist in the lineage directory; no lead ruling was available for this iteration.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:70-80` (fix diff plus the surrounding switch table)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:1-60,75-90`
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:54-140`
- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:9-15,100-175`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:13-22,145-160,215-245`
- `.skilled/hooks/shared/hook-flags.cjs:38-106,230-285` (context: the resolver the docs describe)
- `.skilled/hooks/shared/env-aliases.cjs:1-50` (context: the `MK_` bridge that makes the alias names work)
- `.skilled/hooks/README.md:30-50` (context: the doc that calls itself the single source of truth)
- `.skilled/hooks/hook-flags.env.example:1-20` (context: the doc that defers the canonical index to `hooks/README.md`)
- `.skilled/skills/system-skill-advisor/runtime/lib/` (directory listing at `d21dbc1cafe`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hook kill-switch index still omits the four `MK_` aliases the resolver honors and this commit added to ENV-REFERENCE** -- `.skilled/hooks/README.md:44` -- The row for `skill-advisor` lists four aliases (`SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`) and the file has no master row, so `MK_HOOKS_DISABLED`, `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_PLUGIN_DISABLED` appear nowhere while the table calls itself "the single source of truth for repo-authored hook kill-switch names" `[SOURCE: .skilled/hooks/README.md:40]` and the paragraph above it points at "the complete concern and alias inventory" `[SOURCE: .skilled/hooks/README.md:36]`. The resolver honors all four: `MASTER_ALIASES = ["MK_HOOKS_DISABLED"]` is checked in the same master loop as the canonical name `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-41,256-258]`, and the three `MK_SKILL_ADVISOR_*` names sit in `LEGACY_ALIASES['skill-advisor']` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:64-78]`. This commit added exactly those names to the ENV-REFERENCE rows `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75]`, and `hook-flags.env.example` names `hooks/README.md` as the canonical index `[SOURCE: .skilled/hooks/hook-flags.env.example:12-15]`, so the two index tables now disagree. Pass-five iteration 2 named this table as the second site of the same confirmed drift `[SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/kill-switch-cli-5/iterations/iteration-002.md:38]`; the fix commit changed only the ENV-REFERENCE site.
- Case: an operator exports `MK_SKILL_ADVISOR_PLUGIN_DISABLED=1`; the advisor abstains, yet the table they were told is the complete inventory does not list that name, and it also does not say that `MK_HOOKS_DISABLED=1` silences every hook.
- Evidence: a read-only probe of the shared resolver, no daemon and no file write, printed `MK_HOOKS_DISABLED {"enabled":false,"key":"MK_HOOKS_DISABLED","reason":"master"}` and `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED` each `{"enabled":false,...,"reason":"kill"}`. `rg -n "MK_SKILL_ADVISOR|MK_HOOKS_DISABLED" .skilled/hooks/README.md` returns no row and no alias column hit.
- User impact: the file advertised as the one place to look for kill-switch names under-reports the set by four names, including the master alias that switches off every repo-authored hook.
- Finding class: class-of-bug
- Scope proof: compared the four doc copies of the switch list against `ADVISOR_DISABLED_FLAGS` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]`. `ENV-REFERENCE.md:74-75` and `global-disable-flag.md:49` now carry all ten; `hooks/README.md:44` carries six of ten (one canonical, four aliases, one master canonical in prose) and omits every `MK_` name. The generator-side fix is one list in one place, not four hand-edited tables.
- Affected surface hints: ["hook kill-switch index", "ENV-REFERENCE switch table", "CP-003 control command", "resolver alias constants"]
- Recommendation: add `MK_HOOKS_DISABLED` beside the master switch in the prose at `:36` and the three `MK_SKILL_ADVISOR_*` names to the alias column at `:44`, or generate both index tables from the resolver's `MASTER_ALIASES` and `LEGACY_ALIASES`.

2. **The package topology omits `skill-graph/` while the directory tree and the directory itself have it** -- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:69` -- Section 3 `PACKAGE TOPOLOGY` jumps from `shared/` to `utils/` and never names `skill-graph/`, although section 4 `DIRECTORY TREE` lists it `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:135]` and the folder is on disk `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/]`. The fix for the pass-five finding added the nine missing folders to section 4 and left section 3 one folder short of the fourteen that exist.
- Case: a reader who opens the package topology to find where the graph code lives sees thirteen folders, and `lib/skill-graph/skill-graph-db.js`, which the launcher test imports for `initDb` and the lease uses, has no row in that section.
- Evidence: `git ls-tree --name-only d21dbc1cafe .skilled/skills/system-skill-advisor/runtime/lib/` prints fourteen folders and twenty-two flat modules. Section 4 lists all fourteen folders and all twenty-two modules; section 3 lists thirteen folders and five of the twenty-two modules `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:57-76,98-136]`.
- User impact: the topology map, which is the only section that carries a one-line purpose per folder, silently drops the folder that owns the skill graph.
- Finding class: instance-only
- Scope proof: compared every entry of the `d21dbc1cafe` tree against both sections. Section 4 matches 14/14 folders and 22/22 modules; section 3 matches 13/14 folders. No other section claims a folder inventory `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:150-200]`.
- Affected surface hints: ["lib package topology", "lib directory tree"]
- Recommendation: add `+-- skill-graph/   # Skill graph database, lease and rebuild helpers` between `shared/` and `utils/`.
- Downgrade trigger: if section 3 is meant as a curated overview rather than a complete folder map, this is optional polish; the five-flat-module list suggests curation, but the folder list was complete for every other folder before this commit.

## Traceability Checks

- `spec_code`: pass. The packet's confirming brief asks whether the kill-switch names agree in code and docs. The resolver declares one master flag, one master alias, one canonical concern flag and seven legacy aliases `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-78]`; `ADVISOR_DISABLED_FLAGS` composes exactly those ten names `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-81]`; `ENV-REFERENCE.md:74-75` and `global-disable-flag.md:49` now carry the same ten, and `launcher-bootstrap.vitest.ts` and `skill-advisor-cli-stale-daemon-retry.vitest.ts` both read the constant instead of restating it. The one remaining disagreement is `hooks/README.md:44`, reported as P2 above.
- `checklist_evidence`: partial. The parent packet holds no checklist row that names this area; the confirming brief is the checklist used here. Its two `kill-switch-cli` items (names agree in code and docs; docs agree with code) are both covered, with two residual P2 doc gaps recorded against them rather than a silent pass.
- `feature_catalog_code` and `playbook_capability`: exercised by reading CP-003's control command against the resolver and the two test fixtures; the overlay rows are marked pass for this iteration below.

## Integration Evidence

- `cli-surface`: the CLI disable loop now parameterizes all ten names, including the three `MK_` names the previous round filtered out `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219]`. For an `MK_` name the assertion is one abstain reason with the fixed prefix, because the load-time bridge rewrites the name before the resolver reads it `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:230-235]` `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:31-49]`; a non-`MK_` name still pins the exact reason.
- `daemon-launcher`: the child-env fixture now builds its env from `ADVISOR_DISABLED_FLAGS` and asserts the extracted list has ten entries before asserting the filtered child env `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143]`. A constant that collapsed to an empty array would fail the size assertion rather than pass an empty fixture.
- `manual scenario`: CP-003's control command unsets all ten names before its control call `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`. The set is complete: `DEFAULT_OFF` names only `session-handover`, so the advisor has no enable switch to carry a disable value `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:104-106,270-283]`.
- `env-index`: `ENV-REFERENCE.md:74` now states the master alias, and `:75` lists the seven skill-advisor aliases; both match `MASTER_ALIASES` and `LEGACY_ALIASES['skill-advisor']` name for name `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-78]`.

## Edge Cases

- `ENV-REFERENCE.md:75`'s Source cell now names the CLI and the daemon handler, which is what the confirming report asked for, but the Vibe adapter is a third reader of the same switch: `buildAdvisorPart` defaults `isEnabled` to `isHookEnabled` and calls it for `skill-advisor` `[SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:212-222]`. That file is `vibe-hooks-doctor` area in the same confirming round (`review-scope-5b.txt:10`), so it is recorded here as a cross-area note rather than raised again under a Source-cell finding that the verifier scoped to the CLI and the handler.
- The fix range `2a1a42263cc..d21dbc1cafe` is not HEAD (`9c031900e44`). Every line cited above was read in the working tree and cross-checked with the diff, and none of the five scope files changed after `d21dbc1cafe`: the diff stat for the five paths and the working-tree content agree.
- `ADVISOR_DISABLED_FLAGS` is empty when `hook-flags.cjs` cannot be found `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:53-81]`. In that state both tests fail loudly (the size assertion and the empty parameter list) instead of passing a narrower fixture, so the fail-open resolver cannot turn into a silent test pass. Recorded, not a finding.
- The pass-five lineage's ruled-out direction "the README's folder list is a file list and must name every folder" is respected: section 3 is treated as the folder map, which is why the missing folder is reported, and the five-flat-module subset is not reported.

## Confirmed-Clean Surfaces

- **`iter2-P2-env-alias-column` is fixed.** `ENV-REFERENCE.md:74` now reads "Alias: `MK_HOOKS_DISABLED`" and `:75` lists the seven legacy names. Compared name for name against `MASTER_ALIASES` and `LEGACY_ALIASES['skill-advisor']`: no omission, no extra name `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-78]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74-75]`.
- **`iter2-P2-env-source-column` is fixed.** The Source cell names the CLI and the handler in addition to the two adapters `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]`; the CLI reaches `disabledRecommendOutput` before any daemon path and the handler reaches it before `computeRecommendationOutput` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:145-160]`.
- **`iter2-P2-cp003-control-aliases` is fixed.** The control command unsets ten names, which is the complete env switch set: one master flag, one master alias, one canonical concern flag and seven legacy aliases `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`.
- **`iter3-P2-launcher-switch-fixture` is fixed.** The fixture is derived from `ADVISOR_DISABLED_FLAGS`, asserts ten names, and still asserts the exact filtered child env `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:129-143]`.
- **`iter3-P2-cli-mk-alias-filter` is fixed.** The filter and its load-order comment are gone; all ten names run, the `MK_` reason is deliberately loose and documented in a comment, and every other name keeps the exact-reason assertion `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:218-238]`.
- **`iter3-P2-lib-readme-tree` is fixed for the section the finding named.** Section 4 now lists twenty-two flat modules and fourteen folders, matching `git ls-tree` at `d21dbc1cafe` exactly `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/README.md:98-136]`.

## Ruled Out

- **The CLI loop's loose `MK_` assertion can hide a wrong switch.** `switchEnv` deletes every name in `ADVISOR_DISABLED_FLAGS` before setting the one under test `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:151-156]`, and the loop also asserts one reason, the fixed prefix, `ADVISOR_DISABLED`, `freshness: unavailable` and zero daemon calls, so the only switch present is the one under test. The looseness covers the load-time rename, not an unset fixture.
- **The launcher size assertion hides a name added to the constant.** It fails closed instead: a new name makes `toHaveLength(10)` fail and forces the fixture to be re-read, which is the guard the comment claims `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:137-139]`.
- **The CP-003 control command can still start disabled through a flags file.** The command sets `HOOK_FLAGS_CONFIG=/dev/null`, so the file config is empty, and the ten env names are unset `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`.
- **`MK_HOOKS_DISABLED` is a second master alias that the resolver ignores.** The probe returns `reason: "master"`, so it is honored; the omission is in the doc, not the code `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-258]`.
- **A tracked dotenv, holdout or prompt file is read by any reviewed file.** No reviewed file opens `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl`; the switch docs name no prompt text. Holdout hygiene holds for this area.
- **The five scope files changed after the fix commit.** The diff and the working tree agree for all five paths; no post-`d21dbc1cafe` edit changes a cited line.

## Next Focus

- Dimension: security and maintainability (D2, D4)
- Focus area: re-read the switch paths the docs promise for a bypass the fix could have introduced: the `MK_` bridge order, the CLI/handler abstain before I/O, and the launcher allowlist. Then judge maintainability: the ten-name list now exists in four hand-maintained places (resolver constants, `ENV-REFERENCE.md`, `hooks/README.md`, CP-003) and the module map in two.
- Reason: iteration 1 confirms five of the six fixes and leaves two P2 doc gaps; the untested half of the round is whether the widened fixtures or the widened doc claims widened the attack surface or the change cost.
- Rotation status: D1 and D3 covered; D2 and D4 remain.
- Required evidence: exact resolver and reader line numbers, the child-env allowlist, and the four copies of the alias list counted rather than inferred.
- Recovery note: none.

Review verdict: PASS
