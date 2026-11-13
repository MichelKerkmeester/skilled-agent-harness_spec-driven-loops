# Review Iteration 005

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the OpenCode plugin transform, the CLI fallback module, the metrics module and their tests
- Operator review focus addressed this iteration: the pass-two maintainability question ("a defect the fix introduced") on the plugin and fallback code that pass one changed, plus the changed test surfaces.
- Budget profile: `scan` (10 analysis actions)

## Files Reviewed

- `.opencode/plugins/system-skill-advisor.js:550-600`, `:640-675`, `:1582-1592` — `cliRecommendations`, `compiledRouteSummary`, brief metadata, removed transform block
- `.opencode/plugins/tests/system-skill-advisor.test.cjs:300-470` — route-rendering tests and the digest helper cases
- `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:1-130`, `:350-560` — section structure, `recommendationFromCli`, `resultFromCliData`
- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:1-88` — the fallback envelope cases
- `.skilled/skills/system-skill-advisor/runtime/lib/metrics.ts:380-500` — record validation, prompt-free persistence, health section
- `.skilled/skills/system-skill-advisor/hooks/lib/README.md:13-24` — the fallback module's documented request shape
- `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:173-177` — the OpenCode tuning row
- Test run: `node --test tests/system-skill-advisor.test.cjs` from `.opencode/plugins` -> 42 tests passed, exit 0

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The removed compiled-route line left its per-prompt summary computation and response field without a consumer** -- `.opencode/plugins/system-skill-advisor.js:657` -- `compiledRouteSummary(data)` still scans every recommendation, builds the target list and attaches `metadata.compiledRouteSummary` at `:669`, but the block that rendered it was deleted at `:1582-1590` and no code in `.opencode` reads that metadata field. The computation now runs on every delivered brief for a field nothing consumes.
Case: a prompt whose top recommendation carries a `compiledRoute` with five targets; the plugin builds a summary object (outcome, hubId, five targets, digest) and stores it in `metadata`, while the transform emits only the head block and `spec_kit_skill_advisor_status` never reads the field. The same prompt with no compiled route skips the work, which shows the cost is paid only where a route exists.
Finding class: consumer-removal residue (runtime half of `iter2-P2-inert-bounded-summary-option`)
Scope proof: `rg -n "compiledRouteSummary" .opencode/plugins` returns the producer at `:591`, the call at `:657`, the field at `:669`, the lib digest helper and the test-local factory; no reader of `metadata.compiledRouteSummary` exists outside the deleted block.
Affected surface hints: plugin brief metadata, `compiledRouteSummary()` helper, and the plugin test helper that still builds summaries.

2. **The new CLI field pass-through has no test on either delivery path** -- `.skilled/skills/system-skill-advisor/runtime/tests/hooks/skill-advisor-cli-fallback-envelope.vitest.ts:49` -- `recommendationFromCli` keeps a CLI row's `command`, `policy`, `ownerSkillId` and `needsMode` (`.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts:365-390`), and the OpenCode plugin mirrors the same four fields (`.opencode/plugins/system-skill-advisor.js:574-585`). The envelope test covers only the case where the CLI sends no command fields and the row supplies them (`:49-68`) plus `needsMode` (`:70-87`); the plugin's 42 tests never assert any of the four fields on the mapper output.
Case: delete the `...(typeof value.command === 'string' …)` spreads from `recommendationFromCli` and every test in this area stays green, because the generated row refills `command` and `policy` for the fixture ids used. The same deletion in the plugin mapper leaves 42 of 42 passing, which is exactly the pass-one defect the fields were added to fix.
Finding class: test-coverage gap on changed behavior
Scope proof: `grep -n "needsMode|ownerSkillId|policy|command:"` over `.opencode/plugins/tests/system-skill-advisor.test.cjs` returns no assertion; the envelope test's only command-bearing case omits all command fields (`:56`).
Affected surface hints: `hooks/lib/skill-advisor-cli-fallback.ts` mapper, `.opencode/plugins/system-skill-advisor.js` mapper, both test files.

## Pass-One Fix Verification

- **The plugin mapper fix (`command`, `policy`, `ownerSkillId`, `needsMode`) holds in code.** `.opencode/plugins/system-skill-advisor.js:574-585` forwards each field under the same value filters the hook uses; finding 2 is its missing test, not a code defect.
- **The plugin transform no longer prints a compiled-route second entry.** `output.system.length === 1` is asserted at `tests/system-skill-advisor.test.cjs:414` and `:434`, and the plugin test run passes.
- **`SYSTEM_SKILL_ADVISOR_COMPILED_ROUTE_BOUNDING` is documented as status-only** at `hooks/skill-advisor-hook.md:176`; finding `iter2-P2-inert-bounded-summary-option` is narrowed to the plugin jsdoc wording at `system-skill-advisor.js:1080`, and this iteration adds the runtime half as finding 1.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | pass | The fallback README's request shape matches `runCliRecommend` (`hooks/lib/README.md:21`, `skill-advisor-cli-fallback.ts:238-241`). |
| `checklist_evidence` | core | notApplicable | No checklist row governs this pass. |
| `skill_agent` | overlay | notApplicable | No agent definition in this area. |
| `agent_cross_runtime` | overlay | pass | The two mappers feed the same renderer; the hook path and the plugin path now carry the same four fields. |
| `feature_catalog_code` | overlay | pass | `advisor-recommend.md` describes `publicRecommendation` and `command-attach`; the plugin/hook mappers match the documented contract. |
| `playbook_capability` | overlay | notApplicable | No playbook surface in this iteration. |

## Integration Evidence

- OpenCode plugin surface: `.opencode/plugins/system-skill-advisor.js` `experimental.chat.system.transform` block at `:1560-1592`; brief metadata at `:655-672`; status fields at `:1695-1712`.
- Hook fallback surface: `hooks/lib/skill-advisor-cli-fallback.ts` `runCliRecommend` (`:225-300`), `recommendationFromCli` (`:352-390`), `resultFromCliData` (`:460-540`).
- Metrics surface: `runtime/lib/metrics.ts` `persistAdvisorHookDiagnosticRecord` (`:453-462`), `buildAdvisorHookHealthSection` (`:479-493`).

## Edge Cases

- **Generated declaration artifacts.** Four `yes` rows are `.d.mts.map` files. They are emitted TypeScript declaration maps; this pass did not read them line by line because a handwritten defect cannot live in them and the source declarations they mirror were reviewed with the readers. Recorded so the merged report does not imply they were inspected.
- **Two caps, two units.** `subprocess.ts` caps characters at 1 MiB and the hook fallback caps stdout at 1 MiB bytes (`skill-advisor-cli-fallback.ts:92`). They protect different processes and the units differ on purpose (a byte cap for a pipe, a character cap for a string accumulator). Not a duplicated-constant finding.
- **The plugin test-local `compiledRouteSummary()` factory is still used.** It builds summaries for the digest helper cases before and after the transform change (`tests/system-skill-advisor.test.cjs:317`, `:443-445`), so it is not dead.

## Confirmed-Clean Surfaces

- `persistAdvisorHookDiagnosticRecord` writes the prompt-free record on every call and strips `skillLabel` and `errorDetails` unless `SKILL_ADVISOR_DEBUG` is set (`metrics.ts:453-462`); the record validator accepts the new `degraded` field (`:434-439`).
- `buildAdvisorHookHealthSection` computes `rollingDegradedRate` and `lastRecordAt` from the same record window as the existing rates (`metrics.ts:479-493`).
- The plugin's brief metadata still carries `route`, `freshness`, `recommendationCount`, `tokenCap`, `skillLabel` and `cacheHit`; only the route summary is orphaned.
- The hook fallback README describes the new option shape correctly (`hooks/lib/README.md:21`).

## Ruled Out

- **The plugin's orphaned summary changes the emitted brief.** It is stored on the internal metadata object and never reaches `output.system`; the only cost is the per-prompt build recorded in finding 1.
- **`recommendationFromCli` loses an unknown `kind`.** It maps anything outside `skill`/`command` to `skill` (`:369-371`), which is the documented behavior and the safe default for a renderer.
- **The health record's new fields break older consumers.** `AdvisorHookHealthSection` is a structural type read by `advisor-status.ts`; adding fields cannot break a reader that ignores them, and the record validator treats `degraded` as optional.

## Next Focus

- Dimension: cross-reference sweep
- Focus area: re-check the two open finding clusters for reach (the orphaned summary and the inert option share one removal; the stderr cap and the busy marker share one accumulator) and scan the remaining unread `yes` test files for the changed behavior they claim to pin.
- Reason: four dimensions are covered; one sweep confirms no live P0/P1 and settles convergence.
- Rotation status: all four dimensions revisited.
- Blocked/productive carry-forward: none.
- Required evidence: the exact code paths already cited, a `rg` for each finding id in the registry, and one run of the changed test files.

Review verdict: PASS
