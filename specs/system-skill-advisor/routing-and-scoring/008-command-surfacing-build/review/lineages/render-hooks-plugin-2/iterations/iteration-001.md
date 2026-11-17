# Review Iteration 001

## Dispatcher

- Mode: review (fan-out lineage `render-hooks-plugin-2`, pass two)
- Session: `fanout-render-hooks-plugin-2-1794570021136-noekp0`, generation 1, lineage mode `new`
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`
- Area: `render-hooks-plugin` — the 59 rows of `review/review-scope-2.txt` for this area, plus shared docs that describe them. Pass-one report `review/review-report-pass-1.md` section 3.1 read first for this area's findings.
- Operator review focus addressed this iteration: "Check each pass-one fix in your area holds" — this pass took the three pass-one fixes that landed in `runtime/lib/render.ts` (`R1-P2-005`, `R2-P2-003`, `R4-P2-002--de3d8b259d8e`) and re-read the committed code plus the tests that pin them. The remaining area fixes (session readers, `subprocess.ts`, docs) are scheduled for iterations 2-4.
- Budget profile: `verify` (11 analysis actions)

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:1-275` — imports, `doctorCommandString`, `parentNamedOnly`, `policyWord`, `commandLabel`, `recommendationLabel`, `companionCommandLabel`
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:500-620` — child-session flag, top label fallback, `(needs a mode)` head, ambiguous branch, cap
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1-205` — `COMMAND_ROWS` keys and `commandRowFor` (consumer context)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-brief-golden.vitest.ts:1-254` — golden heads, `needs a mode` case, ambiguous two-command head
- `.skilled/skills/system-skill-advisor/runtime/tests/render-child-session.vitest.ts:1-154` — child downgrade matrix and `isChildSession` parity
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts@35c3188681` (git) — the deleted `DOCTOR_COMMAND_STRINGS` map, compared key-for-key with `COMMAND_ROWS`
- Git diff `35c3188681..HEAD` for `render.ts` — every changed hunk read line by line

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None. The three pass-one fixes in this file hold; the checks that could have failed are recorded under Confirmed-Clean Surfaces and Ruled Out.

## Pass-One Fix Verification

- **R1-P2-005 (`render.ts:226`, `needsMode` overridden by a generated row) — fix holds.** `commandLabel` at `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:226` now sets `const row = recommendation.needsMode === true ? undefined : commandRowFor(recommendation.skill);`, so a hub that withheld its mode cannot regain the row's command. The top fallback at `:551` resolves the owner skill (`commandRowFor(top.skill)?.ownerSkillId`) and the head at `:558-560` appends `(needs a mode)`. Both the row-id case and the `needsMode` + explicit-command case are pinned by `tests/command-brief-golden.vitest.ts:233-244` (asserts `use sk-doc (needs a mode)` and the absence of `command-` and `/create:agent`) and `:152-165` (an explicit command still wins).
- **R2-P2-003 (`render.ts:233`, the child downgrade read the wrong row) — fix holds.** `commandLabel` at `:236-240` computes the class from the row whose command equals the printed command, then falls back to a scan over `COMMAND_ROWS` for that command. `tests/render-child-session.vitest.ts:88-108` reproduces the pass-one input (`skill: 'command-speckit-search'`, `command: '/doctor:speckit'`, `policy: 'run'`) and asserts `/doctor:speckit (parent-named only)`, which is the class of `/doctor:speckit` (`command-attach.ts:105`, `run`/`add-only`), not the carrier row.
- **R4-P2-002--de3d8b259d8e (`render.ts:522`, literal vs exported constant) — fix holds.** The renderer keeps its own `process.env.AI_SESSION_CHILD === '1'` literal at `:529` and `tests/render-child-session.vitest.ts:146-153` compares its output against `isChildSession` from `system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs` over `'1'`, `'0'`, `'true'` and `''`. The two rules agree on every value in the matrix.
- Test run: `env -u AI_SESSION_CHILD npx vitest run tests/command-brief-golden.vitest.ts tests/render-child-session.vitest.ts` -> 2 files, 25 tests passed, exit 0.

## Traceability Checks

| Protocol | Level | Status | Notes |
|---|---|---|---|
| `spec_code` | core | partial | The render-side command label matches the pass-one report's documented shape (`owner → command (policy)`); the doc rows that describe it are reviewed in iteration 4. |
| `checklist_evidence` | core | notApplicable | The review target is the spec folder, whose checklist is not the evidence for this code pass; pass-one findings are the evidence baseline. |
| `skill_agent` | overlay | notApplicable | No agent definition is in this area's changed set. |
| `agent_cross_runtime` | overlay | partial | The renderer is runtime-agnostic; `AI_SESSION_CHILD` is the only runtime-adjacent input and its parity with the spec gate is tested. Per-runtime hook entry points are iteration 5. |
| `feature_catalog_code` | overlay | deferred | `feature-catalog/cli-surface/advisor-recommend.md` and `hooks-and-plugin/claude-hook.md` are scheduled for iteration 4. |
| `playbook_capability` | overlay | notApplicable | No manual-testing-playbook surface in this area. |

## Integration Evidence

- Dispatcher command `.skilled/commands/deep/review.md` owns the loop; this lineage runs detached under its fan-out contract and writes only under `review/lineages/render-hooks-plugin-2/`.
- Append gateway contract read from `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:456-486`: a `type:"iteration"` record travels whole under `deep_review.iteration_recorded`.
- Reducer `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` owns the registry, dashboard and strategy anchors.

## Edge Cases

- **Renamed `doctorCommandString` source.** The function switched from a generated 35-entry map to `commandRowFor` (`render.ts:186-190`). A key present in the old map but absent from `COMMAND_ROWS` would make a doctor bridge render nothing. Compared both key sets from `git show 35c3188681:...render.ts` and `runtime/lib/command-attach.ts`: every old id is present (35/35), and the new table adds `command-doctor-skill-advisor-embedder`, so the switch is key-complete.
- **Duplicate command strings in `COMMAND_ROWS`.** The new class lookup scans by command string; a duplicate with a different class would make `find` pick a wrong class. Parsed all 54 rows: only `/deep:research` and `/deep:review` repeat, and both pairs carry `ask`/`mutates`, so the first hit is the correct class today.
- **Child marker vs 320-character head cap.** `(parent-named only)` is 12 characters longer than `(run)`. The longest label this renderer can produce is under 100 characters, so the cap at `render.ts:150-156` cannot cut the marker on any current row. No finding; recorded so a future long command row knows the bound.

## Confirmed-Clean Surfaces

- `commandLabel` never prints an internal row id: the golden suite asserts `not.toContain('command-')` on all twelve heads and on the ambiguous head (`command-brief-golden.vitest.ts:227`, `:242`, `:252`).
- The ambiguous branch uses `headLabel`, so a top hub that needs a mode says so in the ambiguous head too (`render.ts:584`).
- `recommendationLabel` falls back to the skill label when a recommendation carries no command, so an id with no row keeps the plain head (golden case at `:121-129`).
- `render.ts` imports `command-attach.js` only for the generated table; `command-attach.ts` has no imports (header at `:6-8`), so no import cycle is introduced.

## Ruled Out

- **A missing policy word makes a command unprintable.** `policyWord` returns `null` for `policy === undefined` and the head prints `owner → command` without a parenthesis; the golden case at `command-brief-golden.vitest.ts:130-141` pins it. Not a defect.
- **`metadataSkillLabel` can leak a row id into a `needs a mode` head.** It reads `sharedPayload.metadata.skillLabel` only (`render.ts:315-318`); the golden `needs a mode` case exercises the fallback chain without that field and asserts no `command-` prefix. No reachable producer sets it to a row id.
- **The new scan over `COMMAND_ROWS` is a hot-path cost.** 54 rows, one pass per rendered head, on a prompt-time path that already runs a scorer; no measurement justifies a finding.

## Next Focus

- Dimension: security
- Focus area: `runtime/lib/subprocess.ts` output caps (`R2-P2-002`), `hooks/lib/skill-advisor-cli-fallback.ts`, `hooks/claude/user-prompt-submit.ts`, and holdout hygiene on the render/hook path.
- Reason: the correctness fixes in `render.ts` hold; the next pass-one fix cluster in this area is the hook fallback and process output handling, which is where a child environment or an uncaught process write can leak or truncate text.
- Rotation status: dimension 2 of 4.
- Blocked/productive carry-forward: none.
- Required evidence: direct reads of the cited lines, the `subprocess-output-cap` test, and the hook fallback envelope test.

Review verdict: PASS
