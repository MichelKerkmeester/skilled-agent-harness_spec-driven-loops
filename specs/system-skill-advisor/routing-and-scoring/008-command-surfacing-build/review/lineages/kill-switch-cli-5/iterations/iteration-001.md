# Iteration 1: Correctness and Security of the Kill Switch

## Dispatcher

- Run: `fanout-kill-switch-cli-5-1794760565927-i99t40`
- Mode: review; target agent: `@deep-review`; execution: single review iteration
- Lineage: `kill-switch-cli-5`; pass-five area `kill-switch-cli`
- Operator review focus: pass-five code review of command surfacing; read `review-brief-5.txt` first; review the `kill-switch-cli` files plus docs that describe them; every finding carries `file:line` and a concrete input; holdout hygiene is counts-only.
- Dimension this iteration: D1 correctness and D2 security. The switch is a safety control, so the behavior and the trust boundary are read together: the resolver, the CLI client, the daemon handler, the launcher child-env filter and the manual disable scenario.
- Sources read this iteration: `review-brief-5.txt`, `review-scope-5.txt`, `review-focus-5.txt`, `deep-review-strategy.md`, `deep-review-config.json`, `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, `.skilled/hooks/shared/hook-flags.cjs`, `.skilled/hooks/shared/env-aliases.cjs`, `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts`, `runtime/skill-advisor-cli.ts:1330-1660`, `runtime/handlers/advisor-recommend.ts:600-655`, `.skilled/bin/system-skill-advisor-launcher.cjs:130-190,312-342,1536-1560`, `runtime/lib/compat/daemon-probe.ts`, `runtime/scripts/skill_advisor.py:5488-5500`, `.opencode/plugins/system-skill-advisor.js:200-270,360-375`, and the pass-four lineage report and strategy as prior context.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:1-179`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1330-1660`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:600-655`
- `.skilled/bin/system-skill-advisor-launcher.cjs:130-190,312-342,1536-1560`
- `.skilled/hooks/shared/hook-flags.cjs:1-350`
- `.skilled/hooks/shared/env-aliases.cjs:1-64`
- `.skilled/skills/system-skill-advisor/runtime/lib/compat/daemon-probe.ts:1-70` (context: a second switch reader)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5488-5500` (context: the shim's switch reader)
- `.opencode/plugins/system-skill-advisor.js:200-270,360-375` (context: the plugin's resolver use)
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:39-104`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None this iteration. The candidate "disabled envelope bypasses the workspace allowlist" was ruled out at the CLI boundary: `advisor_recommend`'s JSON input schema allows only `prompt` and `options` with `additionalProperties: false`, so a `workspaceRoot` argument never reaches `disabledRecommendOutput` through the CLI; the handler Zod-parses the allowlist before the disabled check. The disabled envelope is therefore only built from a workspace root the enabled path also accepts. See Ruled Out.

## Traceability Checks

- `spec_code`: pass for this dimension. The packet brief asks whether the kill switch and the direct-call switch stop every path they claim to stop. The disabled path is checked in the CLI client and in the daemon handler by the same resolver: `advisorDisabledBy` builds the decision through `hookFlagDecision('skill-advisor', env, fileConfig)` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:85-93]`. The CLI calls it before `invokeToolPayload`, so no daemon probe or local scorer runs `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1537-1543]`; the handler calls it before `computeRecommendationOutput` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]`.
- `checklist_evidence`: partial. The parent packet holds no checklist row that names this area; the pass-five brief is the checklist used here, and its switch checks are covered below and in Ruled Out.
- `feature_catalog_code` and `playbook_capability`: deferred to the traceability iteration, where the docs and CP-003 commands are read line by line.

## Integration Evidence

- `cli-surface`: `disabledRecommendOutput(args)` is the first statement in `invokeAdvisorRecommendPayload`, before the `try` that reaches `invokeToolPayload` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1535-1543]`. The existing test "abstains with no daemon and starts no launcher" asserts the launcher pid stays absent and the socket is never created `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317]`.
- `daemon`: the handler passes `process.env` and an explicit empty config, so a shared daemon reads its own environment and never the caller's flags file `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]`. That matches the module's stated split, where the client reads the file in its own process `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:1-9,83-93]`.
- `launcher`: the child-env allowlist no longer names any skill-advisor switch, so a flagged parent call cannot silence every later caller through the daemon `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:156-163,312-342]`. The pass-five diff removed the two switch names from that allowlist.
- `manual scenario`: CP-003's first command set runs the native CLI with the legacy `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` and the canonical `SYSTEM_SKILL_ADVISOR_DISABLED=true`, and expects each flagged call to abstain although the warm daemon would answer `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:43-50,77-83]`.
- Observed behavior (read-only probe of the built CLI, no daemon started): `SYSTEM_SKILL_ADVISOR_DISABLED=1`, `SYSTEM_HOOKS_DISABLED=1`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=yes` and `MK_SKILL_ADVISOR_DISABLED=1` each returned `recommendations: []`, `freshness: unavailable`, `warnings: ["ADVISOR_DISABLED"]` and an abstain reason naming `SYSTEM_HOOKS_DISABLED`, `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED`, `SYSTEM_SKILL_ADVISOR_DISABLED` and `SYSTEM_SKILL_ADVISOR_DISABLED` respectively. The MK_ name is bridged to the canonical name by `env-aliases.cjs` before the resolver reads it `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:34-49]`, so the canonical name in the reason is the documented outcome.

## Edge Cases

- The resolver is fail-open when `hooks/shared/hook-flags.cjs` is absent: `ADVISOR_DISABLED_FLAGS` is empty and `advisorDisabledBy` returns null `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:53-93]`. `ENV-REFERENCE.md:68` states the same fail-open rule for resolver failures. Recorded, not a finding: the runtime is repo-installed, so the resolver is present, and a missing resolver cannot widen a working switch.
- The Python shim reads `DISABLE_ADVISOR_ENV` from `compat-contract.json` and compares it to the literal string `"1"` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5491]`; the contract names `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/compat-contract.json:3]` and the shim binds it at `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:210]`. CP-003's shim step uses exactly that name and value, so the scenario is reachable `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:52-56]`. A canonical-name-only shim invocation is out of this area's declared file scope; the docs question is carried to the traceability iteration.
- The pass-five scope excludes `runtime/lib/command-attach.ts` and the Python shim, so their command-offer and shim behavior is context, not a finding. The brief's refusal/question/history/mention check is therefore limited to the switch paths this area owns; the offer module is noted as out of scope in Ruled Out rather than silently marked covered.

## Confirmed-Clean Surfaces

- The master switch, the canonical concern switch and every legacy alias resolve through one decision function, not a hand-rolled list `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:234-285]`. The CLI, the handler, the Claude hook (`isHookEnabled('skill-advisor')`) and the OpenCode plugin (`envDisablesPlugin()` → `!isHookEnabled('skill-advisor')`) all consume that function or the shared helper `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:85-93]` `[SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:68-77]` `[SOURCE: .opencode/plugins/system-skill-advisor.js:205-207]`.
- A caller's explicit `0` beats a truthy flags file, because the resolver reads the injected environment before the file for the same key `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:243-246]`; the test "still asks a warm daemon when the environment sets the switch to 0 over the file" pins it `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:326-343]`.
- The disabled envelope carries no prompt text: it is built from `workspaceRoot`, thresholds, timestamps and the switch name only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:125-179]`.
- The daemon path cannot be silenced by a caller's switch after the launcher fix, because the child env is an allowlist that no longer carries a switch name `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-342]`.
- The manual scenario's first flagged call cannot start a daemon: the CLI check precedes `invokeToolPayload`, and the test "abstains with no daemon and starts no launcher" asserts no launcher pid and no socket `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317]`.

## Ruled Out

- **Disabled envelope bypasses the workspace allowlist**: `requestWorkspaceRoot` in `disabledRecommendOutput` does not call `isAllowedWorkspaceRoot` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:169-172]`, but the CLI's `advisor_recommend` JSON schema accepts only `prompt` and `options` with `additionalProperties: false` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli-manifest.ts:43-64]`, and the handler Zod-parses `BoundedWorkspaceRootSchema` before the disabled check `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:285-303]`. No reachable caller supplies an unvalidated root to the disabled envelope. Ruled out, not a finding.
- **The switch leaks the prompt through the abstain reason**: the reason is `Skill advisor disabled by <switch key>.`; the key comes from the resolver's constant names, never from prompt text `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:150-178]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:256-285]`. Ruled out.
- **The launcher still forwards a switch to the daemon**: the pass-five diff removed `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` and `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` from `CHILD_ENV_ALLOWLIST`, and the filter is exact-set membership `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-315]`. The remaining switch names are not in the set either. Ruled out for the names inspected; the test-coverage gap for the other names is carried to the maintainability iteration.
- **A project-level `hook-flags.env` disables the shared daemon for every caller**: the handler passes `{}` as the explicit config, so `hookFlagDecision` uses the daemon's own environment only `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:235-242]`. Ruled out by design; the docs statement that the client reads the file and the daemon reads its own environment is consistent `[SOURCE: .skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:23]`.
- **`runtime/lib/command-attach.ts` refusal/question/history behavior**: out of the pass-five declared file scope (not in `review-scope-5.txt`); read only as context and not reported as a finding. The scope note is recorded rather than converted into a silent pass.

## Next Focus

- Dimension: traceability (D3)
- Focus area: the docs and scenarios that describe the kill switch — `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md`, `.skilled/hooks/hook-flags.env.example`, `.skilled/hooks/README.md`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md`, `INSTALL-GUIDE.md`, `feature-catalog/cli-surface/advisor-recommend.md` and `changelog/v1.1.0.0.md` — against the resolver's `MASTER_ALIASES`, `LEGACY_ALIASES` and the readers in `advisor-disabled.ts`, the CLI and the handler.
- Reason: iteration 1 confirms the code paths; the remaining question is whether every doc names the same switch set and the same readers the code uses.
- Rotation status: D1 and D2 are covered for this area; D3 and D4 remain.
- Required evidence: exact doc lines, the resolver constants and the reader line numbers for every claim.
- Recovery note: none.

Review verdict: PASS
