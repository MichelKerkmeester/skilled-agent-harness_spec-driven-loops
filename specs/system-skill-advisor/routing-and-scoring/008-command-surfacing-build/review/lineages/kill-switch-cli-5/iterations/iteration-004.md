# Iteration 4: Stabilization Read and Holdout Hygiene

## Dispatcher

- Run: `fanout-kill-switch-cli-5-1794760565927-i99t40`
- Lineage: `kill-switch-cli-5`; pass-five area `kill-switch-cli`
- Operator review focus: pass-five code review of command surfacing; read `review-brief-5.txt` first; review the `kill-switch-cli` files plus docs that describe them; every finding carries `file:line` and a concrete input; holdout hygiene is counts-only.
- Dimension this iteration: all four (stabilization). No new direction is opened. The pass re-reads the six active P2s, their counterevidence and the switch surfaces not re-read since iteration 1, then checks the holdout rule by counts only.
- Sources read this iteration: `review-brief-5.txt`, `review-scope-5.txt`, `deep-review-strategy.md`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, the six finding sites (`.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:71-75`, `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49,80`, `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:124-145`, `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219-232`, `.skilled/skills/system-skill-advisor/runtime/lib/README.md:100-140`), `.skilled/hooks/shared/hook-flags.cjs:38-41,70-78,256-258`, `.skilled/hooks/shared/env-aliases.cjs:20-49`, `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-93`, and the holdout files by `jq del(.prompt)` counts only.

## Files Reviewed

- `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:71-75`
- `.skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:49,80`
- `.skilled/skills/system-skill-advisor/runtime/tests/launcher-bootstrap.vitest.ts:124-145`
- `.skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:219-232`
- `.skilled/skills/system-skill-advisor/runtime/lib/README.md:100-140`
- `.skilled/hooks/shared/hook-flags.cjs:38-41,70-78,256-258`
- `.skilled/hooks/shared/env-aliases.cjs:20-49`
- `.skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:74-93`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (counts only, `jq del(.prompt)`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` (counts only, `jq del(.prompt)`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl` (counts only, `jq del(.prompt)`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. All six active P2s from iterations 2 and 3 were re-read at their reported lines and remain live; none was downgraded, disproved or converted into a P1.

- `iter2-P2-env-alias-column` remains live: `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:74` still says "No aliases" and `hook-flags.cjs:41,256-258` still honors `MK_HOOKS_DISABLED`.
- `iter2-P2-env-source-column` remains live: `.skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75` still names only the hook and plugin as sources while the direct-call readers are the CLI and handler `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540]` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:646]`.
- `iter2-P2-cp003-control-aliases` remains live: `global-disable-flag.md:49` still unsets four names while the resolver honors ten `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:41,70-78]`.
- `iter3-P2-launcher-switch-fixture` remains live: `launcher-bootstrap.vitest.ts:127-145` still sets only two switch names.
- `iter3-P2-cli-mk-alias-filter` remains live: `skill-advisor-cli-stale-daemon-retry.vitest.ts:219-221` still filters every `MK_` name.
- `iter3-P2-lib-readme-tree` remains live: `runtime/lib/README.md:100-122` still omits the five flat modules.

## Traceability Checks

- `spec_code`: pass. The final read re-checked each finding's cited line against the current file and found no drift; no new claim was introduced.
- `checklist_evidence`: pass for the pass-five brief. Kill-switch paths (iterations 1), docs-vs-code and CP-003 (iteration 2), switch tests and the module map (iteration 3), and holdout hygiene (this iteration) are each covered by at least one iteration.
- `feature_catalog_code`: pass. The advisor-recommend feature row's client/file and daemon/own-env split was checked in iteration 2 and is unchanged.
- `playbook_capability`: pass for the same reason; the one CP-003 defect is an active P2 and is reported, not hidden.

## Integration Evidence

- The switch paths were re-read end to end in this pass: the resolver `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:234-285]`, the shared disabled builder `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:85-93]`, the CLI call `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1540]`, the handler call `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:646]` and the launcher filter `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:312-315]`. No switch path outside the pass-five area was claimed as covered.
- The plugin's disabled reason label is a diagnostic nuance, not a behavior gap: the plugin is disabled through `isHookEnabled('skill-advisor')` `[SOURCE: .opencode/plugins/system-skill-advisor.js:205-207]`, while `disabledEnvName()` recognizes only four exact names `[SOURCE: .opencode/plugins/system-skill-advisor.js:257-270]`. Under the canonical or master name the plugin is disabled but its reason text falls back to a config label. Recorded as an edge case for the owning plugin area, not a finding here.
- The Python shim's `SPECKIT_`-only reader is recorded in iteration 1's edge cases; the pass-five docs that name the shim use that exact name and value. No finding is claimed against the shim from this area.

## Edge Cases

- Holdout hygiene, counts only: `command-prompts.jsonl` has 224 rows, `holdout-prompts.jsonl` has 63 rows and `behaviour-fresh-prompts.jsonl` has 36 rows, read through `jq -c 'del(.prompt)' | wc -l`. No prompt text was printed, stored or used in any finding.
- The lib README tree's five missing modules include two (`compiled-routing-flag.ts`, `private-skill-target.ts`) that appear in neither README section; the finding stays scoped to the tree, and the key-files omission is named as the second half of the same drift.
- The `MK_` filter in the CLI test is a string-reason convenience: the abstain reason names the canonical name because `env-aliases.cjs` bridges `MK_` at load `[SOURCE: .skilled/hooks/shared/env-aliases.cjs:44-49]`. The finding asks for an abstain assertion without the exact reason, not for a different resolver behavior.
- No P0 or P1 exists in this area; the six active findings are P2 advisories. A PASS verdict with `hasAdvisories: true` is the supported mapping for this state.

## Confirmed-Clean Surfaces

- The switch does not start a daemon or the local scorer when disabled: the CLI check is the first statement in `invokeAdvisorRecommendPayload` `[SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1535-1543]`, and the no-daemon test pins it `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/skill-advisor-cli-stale-daemon-retry.vitest.ts:303-317]`.
- The daemon child env cannot carry a switch: the allowlist is exact-set membership and names no switch `[SOURCE: .skilled/bin/system-skill-advisor-launcher.cjs:131-189,312-315]`.
- The disabled envelope carries no prompt text and names the deciding switch `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/advisor-disabled.ts:150-179]`.
- The handler reads only its own environment, not a caller's flags file `[SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:643-646]`.
- The manual scenario's first two flagged commands are reachable against the code: the legacy `SPECKIT_` name and the canonical `SYSTEM_` name both resolve through the alias list `[SOURCE: .skilled/skills/system-skill-advisor/manual-testing-playbook/compat-and-disable/global-disable-flag.md:47-48]` `[SOURCE: .skilled/hooks/shared/hook-flags.cjs:70-78]`.

## Ruled Out

- **A missed switch path in `advisor_status` or the graph tools**: the docs claim the switch for prompt injection and the `advisor_recommend` direct call, not for status or graph maintenance `[SOURCE: .skilled/skills/system-spec-kit/runtime/ENV-REFERENCE.md:75]` `[SOURCE: .skilled/hooks/hook-flags.env.example:47]`. Ruled out as outside the stated contract.
- **A P1 for the plugin's reason label**: behavior is disabled correctly; only the diagnostic string is imprecise, and the plugin is outside the pass-five file list. Recorded as an edge case, not raised to P1.
- **A finding against the Python shim's canonical-name handling**: CP-003 uses the name the shim honors, and the shim is out of the pass-five scope. Ruled out for this lineage.
- **A new finding in the holdout path**: no prompt row was opened or printed; the counts-only check shows the three files are present and non-empty, and no doc or test under review reads them. Ruled out.

## Next Focus

- Dimension: none; all four dimensions are covered and the run reached `maxIterations=4`.
- Focus area: synthesis and the closeout record, not another dispatch.
- Reason: the final iteration found no new finding; the active set is six P2 advisories, so the verdict is PASS with `hasAdvisories: true`. The legal stop reason is `maxIterationsReached`, because the coverage graph is unavailable and no graph-backed convergence decision exists.
- Rotation status: D1, D2, D3 and D4 covered; no new dimension remains.
- Required evidence: the six active findings, the four iteration files, the four deltas and the reducer's final registry.
- Recovery note: the run did not claim a graph-backed convergence; the report must say the stop reason is `maxIterationsReached` and that the P2s remain advisories.

Review verdict: PASS
