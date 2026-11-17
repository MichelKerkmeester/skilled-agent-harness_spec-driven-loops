# Iteration 2: Traceability of the Kill-Switch Docs

## Dispatcher

- Run: `fanout-kill-switch-cli-5-1794760565927-i99t40`
- Lineage: `kill-switch-cli-5`; pass-five area `kill-switch-cli`
- Operator review focus: pass-five code review of command surfacing; read `review-brief-5.txt` first; review the `kill-switch-cli` files plus docs that describe them; every finding carries `file:line` and a concrete input.
- Dimension this iteration: D3 traceability. The switch code is clean from iteration 1; this pass asks whether the docs, the env reference and the manual scenario name the same switch set and the same readers the code uses.
- Sources read this iteration: `review-brief-5.txt`, `review-scope-5.txt`, `review-focus-5.txt`, `deep-review-strategy.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:60-90,590-610`, `.skilled/hooks/hook-flags.env.example:1-90`, `.skilled/hooks/README.md:40-50,78-82`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:30-104`, `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:160-200`, `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23`, `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:60-80`, and the resolver and reader lines cited below.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:60-90,590-610`
- `.skilled/hooks/hook-flags.env.example:1-90`
- `.skilled/hooks/README.md:40-50,78-82`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:30-104`
- `.skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:160-200`
- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23`
- `.skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:60-80`
- `.skilled/hooks/shared/hook-flags.cjs:38-41,234-285`
- `.skilled/hooks/shared/env-aliases.cjs:20-49`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:70-93`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:646`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The master-switch row says "No aliases" while the resolver honors `MK_HOOKS_DISABLED`** -- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74` -- The row for `SYSTEM_HOOKS_DISABLED` states "Master switch for every concern below. No aliases." The resolver declares `MASTER_ALIASES = ["MK_HOOKS_DISABLED"]` and checks it in the same master loop as the canonical name `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:38-41,256-258]`; `env-aliases.cjs` also copies every `MK_` value onto its `SYSTEM_` name at load, with `MK_HOOKS_DISABLED` becoming `SYSTEM_HOOKS_DISABLED` `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:20-33,44-49]`. The same alias-column drift exists for the skill-advisor row, which omits `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED` and `MK_SKILL_ADVISOR_PLUGIN_DISABLED` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:70-78]` `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]`, and in the hooks README's concern table `[SOURCE: .skilled/hooks/README.md:44]`.
   Case: An operator with an old `MK_HOOKS_DISABLED=1` in a shell profile reads the table, believes the name is inert, and expects hooks to run; the resolver disables every concern, with the abstain reason naming `SYSTEM_HOOKS_DISABLED` (observed read-only on the built CLI: `recommendations: []`, abstain `Skill advisor disabled by SYSTEM_HOOKS_DISABLED.`). A maintainer adding the next alias also has no table row that would show the previous alias ever existed.
   Finding class: cross-consumer
   Scope proof: `rg -n "MASTER_ALIASES|MK_HOOKS_DISABLED" .skilled/hooks` finds the constant, the master loop and the env bridge; `rg -n "No aliases" .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md` finds the contradicting row. The skill-advisor aliases are the same class in the same table.
   Affected surface hints: ["ENV-REFERENCE hook kill-switches table", "hooks README concern table", "hook-flags resolver MASTER_ALIASES/LEGACY_ALIASES"]

2. **The advisor switch row's Source column omits the readers that implement its direct-call claim** -- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75` -- The row says the switch "makes the `advisor_recommend` direct call abstain", but its Source column names only `system-skill-advisor/hooks/claude/user-prompt-submit.ts` and `.opencode/plugins/system-skill-advisor.js`. The direct-call abstain is built in `runtime/lib/advisor-disabled.ts` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:70-93]` and called by the CLI `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540]` and the daemon handler `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:646]`. The table's own preamble says the Source column names "the surface the concern gates, not a literal read site" `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:71]`; the direct-call surface is the CLI and the handler, and neither is named.
   Case: A maintainer who wants to change where the direct call reads the switch greps the two listed sources, finds only the prompt hook and the plugin, and edits them; the CLI and daemon readers keep the old behavior, so the direct call and the prompt surfaces disagree after the change.
   Finding class: cross-consumer
   Scope proof: `rg -n "disabledRecommendOutput|advisorDisabledBy" .skilled/skills/system-skill-advisor/runtime` finds exactly the two direct-call readers and the shared builder; neither appears in the row's Source column. The same row's description is the only place the direct call is claimed, so the omission is on the row itself.
   Affected surface hints: ["ENV-REFERENCE hook kill-switches table", "runtime/lib/advisor-disabled.ts", "runtime/skill-advisor-cli.ts", "runtime/handlers/advisor-recommend.ts"]

3. **CP-003's unflagged control call can still abstain under a switch alias it never unsets** -- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49` -- The scenario's third command unsets only `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED` and `SYSTEM_HOOKS_DISABLED` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49]`, then expects the call to "return at least one recommendation, so the switch did not reach the daemon" `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:80]`. The resolver also honors `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, `SPECKIT_SKILL_ADVISOR_PLUGIN_DISABLED`, `MK_SKILL_ADVISOR_DISABLED`, `MK_SKILL_ADVISOR_HOOK_DISABLED`, `MK_SKILL_ADVISOR_PLUGIN_DISABLED` and `MK_HOOKS_DISABLED` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:41,70-78]`, and the CLI returns the disabled envelope under any of them `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:70-93]`.
   Case: An operator whose shell profile exports `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED=1` runs CP-003 exactly as written. Steps 1-2 abstain as expected, but the control call also abstains (observed read-only: `recommendations: []`, abstain `Skill advisor disabled by SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED.`), so the operator reads "the switch did not reach the daemon" as failing and blocks a release for a reason the scenario never isolated.
   Finding class: class-of-bug
   Scope proof: `rg -n "ADVISOR_DISABLED_FLAGS|LEGACY_ALIASES" .skilled/hooks/shared/hook-flags.cjs .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts` shows the resolved alias set has ten names; the control command unsets four. The other pass-five doc surfaces (`hook-flags.env.example:47`, `feature-catalog/cli-surface/advisor-recommend.md:23`) name the alias set as one switch without claiming the command isolates every name, so CP-003 is the only same-class scenario defect.
   Affected surface hints: ["CP-003 global-disable-flag step 1 control command", "hook-flags resolver LEGACY_ALIASES", "cli client disabled check"]

## Traceability Checks

- `spec_code`: pass for D3. Each doc claim was read against the resolver constant or the reader line: the master loop `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-258]`, the legacy alias list `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:64-97]`, the shared disabled builder `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:70-93]`, the CLI call site `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540]` and the handler call site `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:646]`.
- `checklist_evidence`: partial. The pass-five brief asks for the switch paths, the docs, the scenarios and the holdout rule; the switch paths and the docs/scenario claims are covered. Holdout hygiene is counts-only and was checked by not opening any prompt file.
- `feature_catalog_code`: pass. The feature-catalog row `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]` says the client reads the file and the daemon reads its own environment, which matches the handler's explicit empty config and the CLI's no-config call `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:85-93]`. The INSTALL-GUIDE line that names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the rollback switch `[SOURCE: .skilled/skills/system-skill-advisor/INSTALL-GUIDE.md:174]` is honored by the resolver's legacy alias list.
- `playbook_capability`: fail (one P2, finding 3). CP-003's control command does not isolate the full alias set the resolver honors.

## Integration Evidence

- The manual scenario is the playbook surface for this area, not a CI test. Its commands reach the native CLI `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:45-50]`, the Python shim `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:52-56]`, the OpenCode plugin test `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:58-62]` and the Claude hook `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:64-75]`. The switch-path findings stay on the CLI/handler/launcher/resolver; the hook and plugin are named only where the doc claims they are sources.
- ENV-REFERENCE is the env index consumed by `/doctor:env`; the hook-flags example is the file an operator copies `[SOURCE: .skilled/hooks/hook-flags.env.example:1-16]`. Both are read by operators before they export a switch, so the alias-column drift has a user-facing route, not only a docs route.
- Holdout hygiene: no holdout prompt file was opened this iteration; the finding set uses no prompt rows.

## Edge Cases

- The ENV-REFERENCE preamble at line 71 limits the Source column to the gated surface, so finding 2 is scoped to the row whose own description claims the direct call; the row's surface list does not name the direct-call surface. This is an omission, not a claim that every reader must appear.
- The `MK_` aliases are bridged to the canonical name at load, so the abstain reason names the canonical name rather than the operator's `MK_` name `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:44-49]`. The doc row's "No aliases" is wrong either way: the name is honored, and the reason names a different key.
- `ENV-REFERENCE.md` line 601-602's rollback example exports the canonical switch and the master switch; that example is consistent with the code and is not part of the alias finding.
- The `hook-flags.env.example` per-concern list uses the canonical name only, which is the file's stated shape `[SOURCE: .skilled/hooks/hook-flags.env.example:20-49]`; the alias drift is in the two index tables, not the example file.

## Confirmed-Clean Surfaces

- The changelog's direct-call paragraph matches the code: the call decides in the caller's own process, before any daemon or scorer, under the canonical name, its aliases, the master switch or the flags file `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:70-76]`.
- The feature-catalog paragraph matches the split: the client reads the switch before it connects, and a daemon that answers reads only its own environment `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]`.
- The manual scenario's first two flagged commands use the legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and the canonical `SYSTEM_SKILL_ADVISOR_DISABLED=true`, and both names resolve through the alias list `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:47-48]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:70-78]`.
- The env example's precedence statement ("a real environment variable overrides the file") matches the resolver's `source[key]`-before-`cfg[key]` lookup `[SOURCE: .skilled/hooks/hook-flags.env.example:8-9]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:243-246]`.

## Ruled Out

- **The alias list in `hook-flags.env.example` is incomplete**: the file is a canonical-name checklist, not an alias index; its header points to `.skilled/hooks/README.md` for the canonical index `[SOURCE: .skilled/hooks/hook-flags.env.example:12-15]`. Ruled out as a doc defect in the example; the drift is in the index tables that claim completeness.
- **`INSTALL-GUIDE.md` rollback table is wrong**: it names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` as the switch; the resolver honors it and the CLI abstains under it. Ruled out.
- **The changelog overstates the launcher change**: the launcher child-env allowlist no longer carries a switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189]`, matching "The launcher passes no switch name to a daemon it starts" `[SOURCE: .skilled/skills/system-skill-advisor/changelog/v1.1.0.0.md:73]`. Ruled out.
- **The Python shim's `SPECKIT_`-only reader contradicts CP-003**: CP-003's shim step uses exactly `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:55]`, and the shim honors that name and value `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:210,5491]`. The broader canonical-name question belongs to the shim's own area and is noted as an edge case, not a finding here.
- **A prompt or holdout row is quoted in any doc**: no holdout or prompt file was opened; the switch docs cite no prompt text.

## Next Focus

- Dimension: maintainability (D4)
- Focus area: the test files and the module map that describe this area — `runtime/tests/launcher-bootstrap.vitest.ts`, `runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts`, `runtime/tests/advisor-disabled.vitest.ts`, `runtime/tests/handlers/advisor-recommend.vitest.ts` and `runtime/lib/README.md` — asking whether the switch set the tests pin is the same set the resolver honors and whether the module map matches the directory.
- Reason: iteration 2 closes the doc-to-code question; the remaining question is whether the tests would catch a future regression in the full switch set and whether the lib map stays usable for the next change.
- Rotation status: D1, D2 and D3 are covered for this area; D4 remains.
- Required evidence: exact test lines, the resolver's exported name list, and the actual `runtime/lib` directory listing against the README tree.
- Recovery note: none.

Review verdict: PASS
