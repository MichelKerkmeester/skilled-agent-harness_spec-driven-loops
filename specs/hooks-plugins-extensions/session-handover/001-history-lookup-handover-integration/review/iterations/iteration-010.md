# Iteration 010 — Terminal Closeout and Severity Re-Examination

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`, execution `single_review_iteration`.
- Iteration: 10 of 10. `stopPolicy=max-iterations` ends the loop after this record; this pass is closeout and may not invent findings.
- Focus: severity re-examination (any carried P2 warranting P1) plus final re-confirmation of all eight active findings at HEAD `5bd9d54ef96`.
- Packet: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/review/`.
- Registry state at read: `openFindings` 8, `resolvedFindings` 0, status active for all eight.

## Dimension

All four dimensions are complete (correctness, security, traceability, maintainability). This iteration is a cross-dimension consolidation pass: re-read every active finding's anchor at the final HEAD, adjudicate whether any P2 has acquired P1-level impact, and assemble the Planning Packet. The dispatch's dimension line names severity escalation with security as the least-covered dimension; the security anchors (`I1-P2-004`, `I2-P2-001`) were re-read directly rather than inferred from the registry.

## Files Reviewed

- `.skilled/hooks/session-handover/history/package.json:11` (build script) and `:6` (the registry's stale anchor).
- `.github/workflows/spec-kit-check.yml:7-8,48-49` (trigger filters), `:227,230` (install targets), `:296-302` (engine step).
- `.skilled/package.json:1-25` (workspace declaration checked for the P1 counterevidence).
- `.skilled/hooks/shared/tests/session-readers/project.test.mjs:25-34,141-142` (schema path and skip guard).
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278,281-284` (pinned bound and predicate).
- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33,52-58,68-75` (bound, quote transform, command interpolation).
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147,166,185-186`.
- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18,22`.
- Drift proof: `git diff --stat 1c7bc3d9d63..HEAD` over the target directories returned empty; `git status --porcelain` over the same paths returned empty; `git log --oneline 1c7bc3d9d63..HEAD` shows one commit (`5bd9d54ef96`), whose touched files (`002-session-handover-loop/goal.md`, `.../graph-metadata.json`) are outside `reviewScopeFiles`.

## Findings - New

No new findings this iteration. `findingsNew` is empty and `findingsCount` reports the eight carried active findings.

### P0 Findings

None. No active P0 exists; no candidate P0 was raised or carried.

### P1 Findings

1. **The history-engine CI step cannot resolve `tsc` on a clean runner** -- `.skilled/hooks/session-handover/history/package.json:11` -- The `build` script hardcodes `../../../skills/system-spec-kit/node_modules/.bin/tsc`, which resolves to `.skilled/skills/system-spec-kit/node_modules/.bin/tsc`. The workflow's engine step (`spec-kit-check.yml:301`) runs `npm --prefix .skilled/hooks/session-handover/history run build`, but the workflow installs only `.opencode/skills/system-spec-kit` (`:227`) and `.skilled` (`:230`). `.skilled/package.json` declares no `workspaces` field, so `npm ci` at `.skilled` provisions `.skilled/node_modules` only and never creates the `.skilled/skills/system-spec-kit/node_modules` tree the build script names. The registry anchor (`line: 6`) points at the `engines` field; the proving anchor is `:11`.
   Finding class: correctness
   Scope proof: build invocation at `package.json:11`, CI caller at `spec-kit-check.yml:301`, install set at `:227,230`, workspace absence at `.skilled/package.json:1-25`.
   Affected surface hints: `.github/workflows/spec-kit-check.yml:296-302`, `.skilled/hooks/session-handover/history/package.json:11`.
   Case: a clean GitHub runner executes the engine step, `npm run build` resolves a `tsc` path no install step created, and the step exits non-zero (127) before any test runs.
   ```json
   {"type":"carried_reconfirmation","claim":"The history-engine CI step cannot resolve tsc on a clean runner because package.json:11 invokes .skilled/skills/system-spec-kit/node_modules/.bin/tsc, a tree the workflow never installs.","evidenceRefs":[".skilled/hooks/session-handover/history/package.json:11",".github/workflows/spec-kit-check.yml:301",".github/workflows/spec-kit-check.yml:227",".github/workflows/spec-kit-check.yml:230",".skilled/package.json:1-25"],"counterevidenceSought":"Checked whether .skilled/package.json declares workspaces that would create .skilled/skills/system-spec-kit/node_modules, and whether the workflow installs the .skilled mirror of system-spec-kit; neither holds.","alternativeExplanation":"A developer shell with a prior .skilled/skills/system-spec-kit install masks the failure, so the step looks green locally and has never run on GitHub.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if the workflow adds an install that provisions .skilled/skills/system-spec-kit/node_modules, or package.json:11 stops hardcoding that path."}
   ```

### P2 Findings

1. **Engine-only changes never run the engine vitest suites** -- `.github/workflows/spec-kit-check.yml:7-8` -- Both trigger filters (`push` `:6-44`, `pull_request` `:47-85`) list `.skilled/skills/system-spec-kit/**` but not `.skilled/hooks/**`, so a change confined to `.skilled/hooks/session-handover/history/**` does not trigger the workflow whose `runtime-vitest` job runs the engine build and suite (`:296-302`).
   Finding class: traceability
   Scope proof: both filter blocks read directly at HEAD; the engine step's path is under `.skilled/hooks/**`, absent from both lists.
   Affected surface hints: `.github/workflows/spec-kit-check.yml:6-44,47-85,296-302`.
   Case: a commit touching only the engine library merges with no CI run, so its suite is never executed on that change.
2. **The projection schema test degrades to a skip when the schema file is missing** -- `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141` -- `if (!existsSync(SCHEMA_PATH))` registers a skipped test instead of failing, so deleting or moving `history-entry.schema.json` turns the published-schema validation green-and-silent. The schema exists today, so the gap is latent.
   Finding class: correctness
   Scope proof: skip guard read at `:141-142`; the resolved schema path is built at `:25-34` and currently resolves.
   Affected surface hints: `.skilled/hooks/shared/tests/session-readers/project.test.mjs:141-142`.
   Case: the schema file is renamed, the suite reports one skipped test and exits 0, and projection drift is no longer caught.
3. **The pinned 66-character bound is only behaviourally pinned in one direction** -- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278` -- The hook-state copy (`:278,281-284`) and the engine copy (`lookup-offer.ts:33,52-58`) remain equal at 66 with the same quote transform, so the residual is the pinning asymmetry: the engine tests hold the copies equal behaviourally, not by comparing the constants, so a hook-state-side edit can drift without an engine-side failure.
   Finding class: maintainability
   Scope proof: both constants and both predicates read at HEAD; values and transforms match exactly.
   Affected surface hints: `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:278,281-284`, `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:33,52-58`.
   Case: the hook-state constant is reduced to 60 while the engine keeps 66, hook-state rejects an id the offer would print, and no engine test fails.
4. **The lookup offer interpolates the runtime label into a model-pasted shell command** -- `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:69` -- `SPECKIT_RUNTIME=${locator.runtime} ` is inserted raw into the command text at `:70`; the schema enum is the only guard, and this module does not re-validate. No in-tree producer passes an unsafe label, so impact stays P2.
   Finding class: security
   Scope proof: interpolation read at `:69-70`; `shellQuote` is used for session id and handle but not for `runtime`.
   Affected surface hints: `.skilled/hooks/session-handover/history/lib/lookup-offer.ts:68-75`.
   Case: a producer passes a runtime label containing whitespace and `;`, the offer prints it unquoted, and a model copying the command executes the injected tail.
5. **The handoff-lookup playbook still points at the retired runtime test paths** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185` -- The Source Files table names `.skilled/skills/system-spec-kit/runtime/tests/history-lookup-cli.vitest.ts` (`:185`) and `history-locator.vitest.ts` (`:186`); both retired with the engine move to `.skilled/hooks/session-handover/history/tests/`.
   Finding class: traceability
   Scope proof: table rows read at HEAD; the moved counterparts are the engine's `tests/` files named elsewhere in the same packet.
   Affected surface hints: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:185-186`.
   Case: an operator opens a listed suite path and finds nothing there.
6. **Two capability lines in the handoff-lookup playbook drop Vibe** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147` -- Both `:147` and `:166` say "a Claude Code or Codex session" while the shipped reader set includes Vibe, contradicting the playbook's own Vibe example at `:140`.
   Finding class: traceability
   Scope proof: both lines read at HEAD; `:140` carries a `SPECKIT_RUNTIME=cursor` example and the engine README documents the supported runtimes.
   Affected surface hints: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/compaction-history-lookup.md:147,166`.
   Case: a Vibe operator reads the capability line, concludes Vibe is unsupported, and skips a scenario that would pass.
7. **The hop-recall pair still describes a hop that prints no lookup offer** -- `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18` -- The overview says "the hop prints no lookup offer" while the Why-This-Matters paragraph at `:22` says "The claim prints a `## History Lookup` section", and the shipped claim behavior agrees with `:22`.
   Finding class: traceability
   Scope proof: both paragraphs read at HEAD; the contradiction is internal to one document.
   Affected surface hints: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/hop-recall-conversation.md:18,22`.
   Case: a tester follows the overview, expects no offer, sees the printed section, and cannot tell whether the scenario passed.

## Severity Escalation Review

No P2 is upgraded. The escalation question was applied per finding with the same release bar the earlier iterations used:

- `I1-P2-002` is the only gate-shaped candidate. It is coverage debt: the engine's build already fails on the first run (the active P1), so this filter gap cannot hide a currently-green regression. It stays P2 until the P1 lands, at which point the missing trigger becomes the primary guard gap and should be re-examined.
- `I1-P2-003` stays P2 because the schema exists today; the skip is latent, not a live silent pass.
- `I1-P2-004` stays P2 because the copies agree at HEAD; the residual is pinning direction, not present drift.
- `I2-P2-001` stays P2 because no in-tree producer supplies an unsafe runtime label; upgrading would rest on an unreachable input today.
- `I3-P2-001`, `I3-P2-002`, `I3-P2-003` stay P2: documentation accuracy, no runtime control flow.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` (core) | pass | Engine path, constant and command behavior match the parent phase intent; unchanged since the iteration-3 pass and zero target drift. |
| `checklist_evidence` (core) | pass | Phase 008 remains Draft with T001-T011 unchecked; the owned T002 line (`hop-recall.sh:18`) is still present and is recorded as known, not as a new finding. |
| `skill_agent` (overlay) | notApplicable | No SKILL.md, command document or agent definition inside the declared target. |
| `agent_cross_runtime` (overlay) | notApplicable | No runtime mirror path inside the declared target. |
| `feature_catalog_code` (overlay) | pass | Cap 600 (`lookup-offer.ts:21`), prefix rule (`:69`) and refusal exit 2 remain unchanged; both cited reader tests exist. |
| `playbook_capability` (overlay) | fail | `I3-P2-001` retired test anchors (`:185-186`), `I3-P2-002` Vibe omitted (`:147,166`), `I3-P2-003` hop-recall contradiction (`:18` vs `:22`). |

## Integration Evidence

- `.github/workflows/spec-kit-check.yml` — re-read the engine step (`:296-302`), both trigger filters and the install targets; this is the integration surface for `I1-P1-001` and `I1-P2-002`.
- `.skilled/package.json` — checked the absence of a `workspaces` declaration; this is the counterevidence that keeps the P1 standing.
- `.github/scripts/npm-ci-retry.sh` — referenced only through the workflow's install lines; not re-read this pass (no drift over target paths).
- `.skilled/hooks/shared/tests/session-readers/project.test.mjs` — the consuming surface for the published schema (`:25-34,141-142`).
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts` — the duplicate-bound producer that the engine tests hold equal (`:278,281-284`).

## Edge Cases

- Registry anchor mismatch: `deep-review-findings-registry.json` records `I1-P1-001` at `package.json:6` (the `engines` field). The proving anchor is `package.json:11`. The registry is reducer-owned and read-only, so the correction is carried in this narrative and in the strategy's Next Focus for synthesis. `downgradeTrigger` for the P1 is unaffected.
- HEAD is one commit past the dispatch baseline (`1c7bc3d9d63..HEAD` = `5bd9d54ef96`), but that commit touches only `002-session-handover-loop/goal.md` and its graph metadata, outside `reviewScopeFiles`; target drift is zero by path, not by assumption.
- Iteration 9's canonical record is legacy/unversioned. This record adds the v2 depth fields, so cross-iteration search-coverage comparisons are partial by construction; the finding state itself is unchanged.
- Operator residual 1 (old-path sweep) is recorded BLOCKED and was not re-entered. The known phase-1 harness reference (`hop-recall.sh:18`) is owned by phase 008 task T002 and is recorded as known, not as a new finding.
- The engine build was not executed in this read-only pass; the P1 remains statically proven from `package.json:11` plus the CI install set, not observed red on GitHub.

## Confirmed-Clean Surfaces

- The old-engine-path sweep: no live executable reference outside the known harness line and the documented compatibility fixtures (carried from iterations 1, 4, 6, 8; zero target drift).
- The two 66-character bounds are numerically equal with the same quote transform at HEAD (`hook-state.ts:278,281-284`; `lookup-offer.ts:33,52-58`).
- The argv session id is hashed before it becomes a state filename (carried; no target drift).
- The transcript path is read-only and the offer carries no transcript text (carried; no target drift).
- All eight registry anchors, except the P1 line number, resolve to the behavior they describe.

## Ruled Out

- A carried P2 acquiring P1 impact at the terminal pass: no new impact evidence exists for any of the seven.
- Any active finding being fixed or its anchor moving at HEAD: zero drift over all target paths; only later commit is outside the review scope.
- A fresh dimension or unread target source remaining: all four dimensions complete, registry has no unread target source.
- A new finding from the terminal re-read: every re-read reproduced an existing finding or a previously confirmed clean surface.

## Next Focus

Loop terminated by `stopPolicy=max-iterations` (10 of 10). Synthesis consumes this record; no further iteration is dispatched.

Planning Packet fix order and owners:

1. `I1-P1-001` — engine owner. Replace the hardcoded `tsc` path at `package.json:11` with a workspace-relative invocation, or add an install step that provisions `.skilled/skills/system-spec-kit/node_modules`.
2. `I1-P2-002` — CI owner. Add `.skilled/hooks/**` to both trigger filters (`spec-kit-check.yml:7-8,48-49`).
3. `I1-P2-003` — shared-session-readers owner. Make the missing-schema branch fail rather than skip (`project.test.mjs:141-142`).
4. `I1-P2-004` — hook-state owner. Pin the two constants equal in both directions (compare constants, not only behavior).
5. `I2-P2-001` — engine owner. Quote or allowlist `locator.runtime` before interpolation (`lookup-offer.ts:69-70`).
6. `I3-P2-001` to `I3-P2-003` — manual-testing-playbook owner. Refresh the two Source Files rows, add Vibe to `:147,:166`, and reconcile `:18` with `:22`.

All eight findings remain active (0 resolved). Active P1 `I1-P1-001` remains and no P0 exists, so the verdict is CONDITIONAL.

## Verdict

CONDITIONAL — one active P1 (`I1-P1-001`), seven active P2, no P0.

## SCOPE VIOLATIONS

None. No out-of-scope mutation was attempted or executed; every write is confined to this iteration's narrative, the strategy update, the gateway record and the delta artifact.

Review verdict: CONDITIONAL