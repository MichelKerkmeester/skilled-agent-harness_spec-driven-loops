# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the `yes` documentation in this area plus the shared docs that describe the command brief
- Operator review focus addressed this iteration: "docs that disagree with code", and pass-one fix verification for the documentation findings in this area (`R3-P2-002--ecbea1260371`, `Q2`) and the shared doc fixes (`R3-P2-001--0e0d904eb571`, `R3-P2-002--5522ea1fe8dd`).
- Budget profile: `verify` (10 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:26-70` — compiled-route enrichment, the two request options, the recommendation contract, the file table
- `.skilled/skills/system-skill-advisor/feature-catalog/hooks-and-plugin/claude-hook.md:20-45` — CLI request options and diagnostics paragraph
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:30-125`, `:170-195` — brief head form, degraded contract, runtime table, OpenCode tuning, diagnostics row
- `.skilled/skills/system-skill-advisor/ARCHITECTURE.md:139-146` — hook and plugin integration paragraph
- `.skilled/skills/system-skill-advisor/README.md:174-176` — command-row count
- `.skilled/skills/system-skill-advisor/feature-catalog/scorer-fusion/command-meaning-matching.md:24-28` — command-row count
- `.skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:285-322` — the cited schema fields
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:626-636`, `:700-710` — the cited skip ranges
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1529-1556` — the `-32602` retry that the hook reference describes
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:190-245` — `commandRowFor` own-key lookup and the `TRACKED_COMMANDS` policy source

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Five line citations in `advisor-recommend.md` point at unrelated code** -- `.skilled/skills/system-skill-advisor/feature-catalog/cli-surface/advisor-recommend.md:33` -- The rewritten enrichment section cites `schemas/advisor-tool-schemas.ts:310` for the `command` field, `:287` for `includeCompiledRoute` and `:290` for `compiledRouteTopOnly`, and `handlers/advisor-recommend.ts:563-565` / `:632-634` for the two skip branches. The first three land on `skillId` (`:321` is the field), `workspaceRoot` (`:295` is the field) and `topK` (`:298` is the field); the handler ranges land on `outputAbstainReasons` and the `enrichCompiledRoutes` call (`:630-632` and `:705-707` are the two skips).
Case: a reader opens §"Compiled-Routing Enrichment" and follows `schemas/advisor-tool-schemas.ts:287` to learn what `includeCompiledRoute` validates; the line is `workspaceRoot: BoundedWorkspaceRootSchema.optional()`, and the same call at `:310` is `skillId: z.string().min(1)`. The other three citations are off in the same way.
Finding class: documentation traceability
Scope proof: `grep -n` over the two cited files returns the actual field and skip lines; every cited line was read directly and the mismatched token at each is named above.
Affected surface hints: `advisor-recommend.md` sections "Compiled-Routing Enrichment" and the two option paragraphs; the same schema offsets are likely cited by the CLI-surface leaf in other areas.

## Withdrawn Finding

**`iter2-P2-hook-health-doc-scope` is withdrawn.** Iteration 2 read `skill-advisor-hook-validation.md:100` ("Every hook run writes a prompt-free health record") as covering the OpenCode plugin. It does not: the sentence is scoped to hook runs, and every hook adapter reaches the same handler that persists the record — the Claude handler directly, Pi and DSH through `handleClaudeUserPromptSubmit` with a runtime label, and the Codex, Cursor and Devin shims through `runClaudeHookAdapter`, which sets `SPECKIT_RUNTIME` before spawning the compiled handler (`system-spec-kit/runtime/hooks/devin/shared.ts:95-110`). The OpenCode plugin is a plugin, not a hook, and the playbook covers it in its own Step 4. The finding over-read the sentence; recorded as resolved in this iteration's state record so the merged report does not carry it.

## Pass-One Fix Verification

- **Q2 (`advisor-recommend.md:45`, name `TRACKED_COMMANDS[command].policy`) — fix holds.** The Recommendation Contract paragraph at `:51` now says "A command attached through the compiled route takes its `policy` from `TRACKED_COMMANDS[command].policy`, the table keyed by runnable string that covers every tracked command". `command-attach.ts:242` is that lookup.
- **R3-P2-002--ecbea1260371 (`advisor-recommend.md:45`, document `mutating`) — fix holds.** The same paragraph documents `{ command, policy?, mutating?, ownerSkillId }` and names `mutating` as the class the renderer's child downgrade reads, with `/doctor:env list` as the read-only example. The renderer's `parentNamedOnly` matches that rule.
- **R3-P2-001--0e0d904eb571 (README and `command-meaning-matching.md` say 46 rows) — fix holds.** `.skilled/skills/system-skill-advisor/README.md:176` says "46 command rows" and `feature-catalog/scorer-fusion/command-meaning-matching.md:26` says "46 rows in all". No other count appears in either paragraph.
- **R3-P2-002--5522ea1fe8dd (ARCHITECTURE names the DSH adapter) — fix holds.** `ARCHITECTURE.md:143` names `hooks/dsh/prompt-advisor.mjs` and states it runs the Claude handler from `runtime/dist/hooks/claude/user-prompt-submit.js`.
- **The hook reference's `-32602` retry claim holds.** `skill-advisor-cli.ts:1529-1556` drops both compiled-route keys when the rejected list names `includeCompiledRoute`, and otherwise drops the keys the daemon named; the doc says "retries once without them".

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | pass | The three new documentation sections (`Recommendation Contract`, brief head form, degraded contract) match the code read in iterations 1-3. |
| `checklist_evidence` | core | notApplicable | No checklist row governs the documentation pass. |
| `skill_agent` | overlay | notApplicable | No agent definition in this area. |
| `agent_cross_runtime` | overlay | pass | `skill-advisor-hook.md` adds the DSH row and a per-runtime command-start table; the runtime rows match `ARCHITECTURE.md:143` and the adapter files. |
| `feature_catalog_code` | overlay | partial | The catalog leaf matches the code in substance; finding 1 is its line-citation drift. |
| `playbook_capability` | overlay | pass | The validation playbook's changed diagnostics sentence survives the withdrawal above: every hook adapter persists. |

## Integration Evidence

- CLI option contract: `runtime/schemas/advisor-tool-schemas.ts:295`, `:298`, `:321`; retry at `runtime/skill-advisor-cli.ts:1529-1556`; hook payload at `hooks/lib/skill-advisor-cli-fallback.ts:238-241`.
- Renderer contract: `runtime/lib/render.ts:219-246` (label), `:557-560` (`needs a mode`), `:529` (`AI_SESSION_CHILD`).
- Runtime adapters named by the doc: `.skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs`, `hooks/pi/prompt-advisor.ts`, `.opencode/plugins/system-skill-advisor.js`, and the system-spec-kit shims at `.skilled/hooks/skill-advisor/{claude,codex,cursor,devin}/`.

## Edge Cases

- **`SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING` is documented as status-only.** `skill-advisor-hook.md:176` says the variable is "kept for existing configs: the transform adds no compiled-route line, so it changes only the `bounded_compiled_route_summary` status field". That confirms the behavior iteration 2 recorded and narrows it: the defect is the plugin's own jsdoc (`system-skill-advisor.js:1080`) still saying "Bound long compiled-route target lists", not the env var's existence. Finding `iter2-P2-inert-bounded-summary-option` stands on the jsdoc wording and the status field.
- **`claude-hook.md` lists the status vocabulary without `stale`.** `metrics.ts:24` includes `stale` in `ADVISOR_HOOK_STATUS_VALUES`. The sentence predates this pass and is unchanged by it; not reported here to keep pass two to defects the change introduced or re-exposed.
- **The command-start table in `skill-advisor-hook.md:104-115` is not code-verifiable in this pass.** It describes model-side tool reach per runtime (for example 33 of 45 names for Claude Code); no repository artifact can confirm the host's tool list, and the pass already covers the runtime routing itself. Recorded as unverified, not as a finding.

## Confirmed-Clean Surfaces

- The brief head form documented at `skill-advisor-hook.md:74-90` matches `commandLabel` and `policyWord` exactly: `owner → command (policy)`, no parenthesis when the policy is unknown, `(needs a mode)` when the hub withheld its command.
- The degraded contract documented at `:92-100` matches `recommendationFromCli` and the degraded path: a typed bare slash command keeps the command fields, every other row collapses to its owner skill.
- `advisor-recommend.md:33` accurately describes `attachCommand`'s gates (`route`, `selectionKind: 'single'`, one target, `MODE_COMMANDS`, `DEPTH_WORDING`, `NO_EDIT_REQUEST`).
- The shared doc rows for the runtime adapters match `ARCHITECTURE.md` and the adapter files.

## Ruled Out

- **The OpenCode plugin's missing health record is a doc defect.** Withdrawn above: the changed sentence is about hook runs, and the plugin is a separate delivery path with its own playbook step.
- **The documented `includeCompiledRoute` default contradicts the hook's explicit `true`.** Not a contradiction: the option defaults to true and the hook states its explicit value and why, in both `claude-hook.md:26` and `skill-advisor-hook.md:38`.
- **The catalog's `command` field claim overstates the schema.** `command: z.string().min(1).optional()` exists at `advisor-tool-schemas.ts:321`; only its citation is wrong.

## Next Focus

- Dimension: maintainability
- Focus area: the remaining `yes` code in this area — `.opencode/plugins/system-skill-advisor.js` mapper and transform, `hooks/lib/skill-advisor-cli-fallback.ts` structure, `runtime/lib/metrics.ts`, and the runtime-mirror sync scripts with their tests.
- Reason: correctness, security and traceability are covered; maintainability is the last dimension, and the plugin/fallback changes left dead or duplicate surfaces worth one pass.
- Rotation status: dimension 4 of 4.
- Blocked/productive carry-forward: none.
- Required evidence: the diffs already read plus one direct read of each remaining changed block; no new scan of the whole tree.

Review verdict: PASS
