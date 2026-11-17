# Iteration 2 - Security: the kill switch and the direct-call off switch

## Dispatcher

- Mode: review, single iteration, dimension `security`.
- Lineage: `vibe-hooks-doctor-5`.
- Reviewed the switch surfaces this lineage owns: the hook contract's switch table and the handler's resolver lookup.
- Operator review focus: the pass-five brief's first check, "whether the advisor kill switch and the direct-call off switch stop every path they claim to stop and nothing else". This iteration read the Vibe, OpenCode and handler paths of every name in the table, plus the direct-call paragraph against `advisor-disabled.ts`, `skill-advisor-cli.ts` and the launcher allowlist. The doctor hooks-file reading and holdout checks remain for iteration 3.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:164-199`
- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:68-77,289-311`
- `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:203-236`
- `.skilled/hooks/shared/hook-flags.cjs:38-115,154-285` (context resolver)
- `.opencode/plugins/system-skill-advisor.js:195-210,255-270` (context plugin)
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:60-180` (context direct call)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1534-1545` (context direct call)
- `.skilled/bin/system-skill-advisor-launcher.cjs:312-342` (context daemon environment)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The handler resolves the shared switch resolver one level above the repository when it runs from source, so the canonical kill switch fails open there** -- `.skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:71` -- `skillAdvisorHookEnabled` builds `../../../../../../hooks/shared/hook-flags.cjs` from the module URL. From the source folder `.skilled/skills/system-skill-advisor/hooks/claude` six parent hops land at the repository's parent, so the `require` throws and the catch returns `true`. Only the separate `process.env.SPECKIT_SKILL_ADVISOR_HOOK_DISABLED === '1'` check at line 301 stops a source-run handler. The compiled file at `runtime/dist/hooks/claude` sits exactly six hops below `.skilled`, so the shipped entry resolves and the canonical switch works there.
   Finding class: fail_open_control_bypass
   Scope proof: The handler is in the declared scope. The shipped settings entry runs the dist shim, so the reach is the source-run consumers the repo itself uses: the vitest suite imports this file, and any development harness that loads it through a TypeScript loader.
   Affected surface hints: canonical kill switch, source-run handler, test harness.
   Case: With `SYSTEM_SKILL_ADVISOR_DISABLED=1` in the environment and the source handler imported under a TypeScript loader, `skillAdvisorHookEnabled()` resolves `<repository-parent>/hooks/shared/hook-flags.cjs`, catches the failed require and returns `true`, so a passing `buildBrief` is called and a brief is returned although the canonical switch is set. The same call through the dist file reads `.skilled/hooks/shared/hook-flags.cjs` and returns `{}`.
   Evidence: `user-prompt-submit.ts:71` and `:73-76`; the resolved source path is `<repository-parent>/hooks/shared/hook-flags.cjs` and the resolved dist path is `.skilled/hooks/shared/hook-flags.cjs`, both read from `import.meta.url` with node's URL resolution; `hook-flags.cjs:256-266` shows the master and kill branches the catch skips.

2. **The switch table implies a hook-versus-plugin split that the shared resolver does not make, so either name silences every adapter** -- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:173` -- The `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED` row says it disables "the native adapters" and the plugin row at line 174 says "every adapter". Both names sit in one alias list for the one `skill-advisor` concern, and every adapter asks that one resolver, so the hook name also silences the OpenCode plugin and the Vibe part.
   Finding class: doc_code_drift
   Scope proof: The hook contract is a declared scope file; the rows are the two the pass-five change edited, and the resolver and plugin are read as context evidence for the claim they make.
   Affected surface hints: kill-switch documentation, OpenCode plugin, Vibe part.
   Case: An operator who wants to silence the shell hooks but keep the OpenCode plugin sets `SYSTEM_SKILL_ADVISOR_HOOK_DISABLED=1`; `envDisablesPlugin()` at `.opencode/plugins/system-skill-advisor.js:205-207` returns `true`, so the plugin delivers nothing. The reverse holds for `SYSTEM_SKILL_ADVISOR_PLUGIN_DISABLED`, which the table says disables every adapter and does.
   Evidence: `skill-advisor-hook.md:173-174`; `hook-flags.cjs:70-77` lists both names in `LEGACY_ALIASES['skill-advisor']`; `.opencode/plugins/system-skill-advisor.js:205-207`; `prompt-advisor.mjs:216`.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | Phase 029 `REQ-001` to `REQ-008` hold: the client answers from `disabledRecommendOutput` before any daemon or scorer at `skill-advisor-cli.ts:1540`, the handler passes an empty config so the daemon never reads the flags file at `handlers/advisor-recommend.ts:542`, and the launcher builds the daemon environment from an allowlist at `system-skill-advisor-launcher.cjs:312-315`. `REQ-009`'s doc claim is the drift in `R2-P2-002`. |
| `checklist_evidence` | core | partial | Phase 029 `AC-009` is Met because the lines `plan.md` lists as unchanged still read as they did, which does not test their truth; the alias rows are the counterexample. |
| `skill_agent` | overlay | notApplicable | No agent definition changed in this area. |
| `agent_cross_runtime` | overlay | partial | The switch resolution is one shared module for Claude, Codex, Cursor, Devin, Pi, DSH, Vibe and the OpenCode plugin; the source-run gap in `R2-P2-001` is runtime-neutral. |
| `feature_catalog_code` | overlay | pending | Deferred to the docs iteration. |
| `playbook_capability` | overlay | pending | Deferred to the docs iteration. |

## Integration Evidence

- The Vibe part asks the same resolver before it runs the handler, at `prompt-advisor.mjs:216`, and the handler asks it again at `user-prompt-submit.ts:301`; a disabled Vibe turn returns an empty string from both.
- The direct call returns before it touches the daemon or the local scorer, at `skill-advisor-cli.ts:1540-1542`; the empty envelope carries `warnings: ["ADVISOR_DISABLED"]` and names the switch in `abstainReasons` at `advisor-disabled.ts:175-176`.
- The daemon-side handler passes `{}` as the config so it reads only its own environment at `handlers/advisor-recommend.ts:542`; the launcher forwards no switch name and no `HOOK_FLAGS_CONFIG` because `createChildEnv` keeps only `CHILD_ENV_ALLOWLIST` at `system-skill-advisor-launcher.cjs:312-315`.

## Edge Cases

- The canonical switch works through the dist handler for every runtime, including Vibe, Pi, DSH and the OpenCode plugin; only the source-run path in `R2-P2-001` is uncovered.
- The standalone Python CLI keeps its own exact-`1` rule and is not an adapter; the table's "every adapter" wording is correct for it.
- A truthy value in `.skilled/hooks/hook-flags.env` disables every surface except the Python CLI, matching the table's resolver note at `skill-advisor-hook.md:168`.

## Confirmed-Clean Surfaces

- `SYSTEM_HOOKS_DISABLED` is checked before every concern and stops Vibe, the handler, the plugin and the direct call (`hook-flags.cjs:256-258`).
- The direct call abstains under the canonical name, both hook names, both plugin names and the `MK_` forms, because `ADVISOR_DISABLED_FLAGS` is built from the resolver's own lists (`advisor-disabled.ts:74-82`).
- The daemon never reads the flags file, and a flagged caller leaves no disabled daemon behind for later callers (`system-skill-advisor-launcher.cjs:312-315`).
- The Vibe child-session marker is independent of the switch, so either one alone returns no brief (`prompt-advisor.mjs:62-66,211-216`).

## Ruled Out

- **The direct call reads its own copy of the switch names.** Ruled out: `advisorDisabledBy` calls `hookFlagDecision` from the shared resolver and builds `ADVISOR_DISABLED_FLAGS` from `MASTER_FLAG`, `MASTER_ALIASES`, `concernFlag` and the alias list.
- **A daemon started by a flagged caller stays disabled.** Ruled out: the launcher's allowlist forwards no switch name and no `HOOK_FLAGS_CONFIG`, so the daemon answers later callers normally.
- **The Vibe part bypasses the handler's switch check.** Ruled out: it checks `isHookEnabled` before calling and the handler checks again.
- **The `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED` explicit check can re-enable a disabled hook.** Ruled out: it is an OR with the resolver, so it can only skip.

## Next Focus

- Dimension: traceability
- Focus area: the doctor hook-wiring check, its test and README, the runtime-mirrors route and CI rows, and the command-reference validator's runtime allowlist.
- Reason: the switch surfaces are read; the pass-five brief puts the doctor hooks-file reading and docs-against-code next, and those files are the rest of this lineage's scope.
- Rotation status: correctness and security complete; traceability and maintainability remaining.
- Blocked/productive carry-forward: the resolver reading is productive; no blocked approach.
- Required evidence: the check's verdict for a real and a filtered entry, the README claim it must match, and the route and CI rows for the three Vibe mirror scripts.

Review verdict: PASS
