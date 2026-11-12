# Review Iteration 003 — Traceability of the command documents against the engine, and the maintainability tail

## Dispatcher

- Mode: `review` · target agent `deep-review` · resolved route `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-1794439428470-vyb51k`, generation 1, lineageMode `new`
- Executor: this process (detached fan-out lineage); no nested dispatch
- Budget profile: `scan`
- Bindings: `BINDING: target=commits c57b7e4cef..e97ca56e8d on main` · `BINDING: maxIterations=3` · `BINDING: convergence=0.1` · `BINDING: mode=review` · `BINDING: dimensions=correctness,security,traceability,maintainability` · `BINDING: specFolder=specs/system-skilled-doctor/001-skill-and-overlay-build/009-overlay-write-checks-follow-up`
- Sources read this iteration (including the lead channel): `steer.md` (absent — no lead ruling to apply), `deep-review-strategy.md`, `deep-review-state.jsonl`, `overlay.md:1-116`, `.skilled/commands/doctor/_routes.yaml:625-670`, `assets/doctor-overlay-status.yaml:1-70`, `assets/doctor-overlay-apply.yaml:34-122`, `assets/doctor-overlay-presentation.txt:86-118,266-284,516-546`, `references/overlays.md:1-20,57-120,190-225`, `manual-testing-playbook/overlays/stale-lock-takeover.md`, `manual-testing-playbook/overlays/relayout-moves-sources.md`, `manual-testing-playbook/overlays/adopt-with-protected-file.md`, `manifest` of the playbook folder, `sk-create-command/assets/command-contract.json` (the overlay hunk of the diff), `overlay-engine.cjs:96-113,1945-1966,2186-2235`

## Dimension

**Traceability** (core) with the **maintainability** tail — whether `overlay.md`, `_routes.yaml`, the two workflow YAMLs, the presentation contract, the reference and the new playbook describe what the engine actually prints and accepts. Operator review focus addressed by its last clause ("whether the command documents match the engine"), on the surfaces iterations 1-2 had not covered: the route steps, the status workflow, the playbook scenarios and the command contract.

## Files Reviewed

- `.skilled/commands/doctor/overlay.md:3-116` (argument hint, router contract, mode routing, the argument table, workflow summary steps 1-19)
- `.skilled/commands/doctor/_routes.yaml:625-670` (the `/doctor:overlay` status and apply routes: `allowed_flags`, `gate3_location`, `mutation_class` note, `description`)
- `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:26-70` (invariant, setup vars, execution steps, output templates)
- `.skilled/commands/doctor/assets/doctor-overlay-apply.yaml:34-122` (scope, invariant, setup vars, steps 101-122)
- `.skilled/commands/doctor/assets/doctor-overlay-presentation.txt:86-118` (report shape and the state table), `:266-284` (relayout plan and its outcomes), `:516-546` (result rows and next-command table)
- `.skilled/skills/system-skilled-doctor/references/overlays.md:1-20` (frontmatter, trigger phrases), `:57` (state files), `:89-120` (LAYOUT row, relayout paragraph, the lock paragraph, the credential paragraph), `:190-225` (re-pin and adopt walkthroughs)
- `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/stale-lock-takeover.md` (full), `relayout-moves-sources.md` (full), `adopt-with-unowned-file.md`/`adopt-with-protected-file.md`/`pre-commit-refuses-unowned-change.md`/`status-without-overlays.md`/`strict-guard-refuses-unowned-write.md` (their manifest fixtures and expected-signal lines)
- `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` (the overlay `argument_hint`, `execution_targets`, `mode_matrix` and `execution_summary` hunks)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:96-113` (`COMMAND_WORDS`, `USAGE`), `:1945-1966` (`protectedPathProblem`), `:2186-2235` (`stateLine`, `problemLine`, `stateCounts`, `stateSummary`)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The status workflow names a command that does not exist** -- `.skilled/commands/doctor/assets/doctor-overlay-status.yaml:58` -- the step tells the route to "name `/doctor:overlay relayout` beside each `LAYOUT` line", but `relayout` is a flag of `apply`, not a target: the router binds only `status`, `apply` and `repin` (`overlay.md:55-61`), and the engine's own command words are `status`, `apply`, `repin` and `pre-commit` (`overlay-engine.cjs:96`), so an operator who types the printed form gets the unknown-target failure.
   Finding class: documentation cross-reference that names a non-existent route
   Scope proof: `overlay.md:70` and `:40` describe `--relayout` as part of `apply`; `presentation.txt:538` and `_routes.yaml:664` print `/doctor:overlay apply --relayout`; `references/overlays.md:89` prints the same. `:58` of the status workflow is the only place in the tree that spells the target form (`grep -rn "/doctor:overlay relayout"` finds it alone), and the same file's invariant at `:28` uses bare `relayout` as a mode name.
   Affected surface hints: the status route's display step, `overlay.md` §3 mode routing, `presentation.txt` next-command table, and any operator who copy-pastes the line.
   Case: an operator runs `/doctor:overlay status`, sees `LAYOUT   hub-bundle: source custom/bundle belongs at skilled/skills/hub/bundle`, and the route prints "name /doctor:overlay relayout beside each LAYOUT line". They type `/doctor:overlay relayout` and get the presentation contract's unknown-target failure, which names no route at all; the engine's own `LAYOUT` line already carried the runnable command, so the route's addition is the only wrong thing on screen.

2. **No playbook scenario or test exercises the relayout link retarget the reference promises** -- `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/relayout-moves-sources.md:44` -- both relayout scenarios build their manifest with `"layoutLinks":[]`, so the outcome `references/overlays.md:91` and `overlay.md:108` promise ("The plain `apply` that follows retargets the live links") is verified nowhere: not by the playbook, not by the follow-up suite (`tests/overlay-engine-follow-up.test.cjs:549`), and `relayoutLinkTargets` loses its only guard against regression.
   Finding class: coverage gap on a documented outcome
   Scope proof: the fixture manifests in this file are the only relayout fixtures in the playbook, and both carry `layoutLinks: []`; the engine's relayout link branch lives at `overlay-engine.cjs:4633-4655` and `:4673-4690`.
   Affected surface hints: `references/overlays.md:91`, `overlay.md:108`, `presentation.txt:113`, `apply.yaml:104`, `_routes.yaml:664`, and the operator who runs `apply --relayout` on a tree with a link into the overlay folder.
   Case: a vendoring project follows the only relayout scenario available, whose manifest has no layout link, and finishes with a PASS. The scenario says nothing about the link case, so a release whose retarget is broken (finding R1-P1-002) still passes the whole operator contract.

3. **The lock playbook's canonical scenario can only pass for a lock the current engine wrote** -- `.skilled/skills/system-skilled-doctor/manual-testing-playbook/overlays/stale-lock-takeover.md:48` -- the file calls itself "the canonical operator contract for the overlay lock and its takeover" (`:10`) and its takeover steps write `printf 'overlay-engine apply pid=%s host=%s %s\n'`, i.e. the format this release introduced; the format the previous release wrote (`pid=<n> <stamp>`, no host) appears in no scenario, so the gap in finding R1-P1-001 cannot be caught here.
   Finding class: coverage gap on the input that the previous release left on disk
   Scope proof: `:48` and `:54` are the two lock writes in the scenario, both with `host=%s`; `:30`'s expected signals quote the same shape; the test file's four lock cases (`tests/overlay-engine-follow-up.test.cjs:107-148`) likewise cover a dead pid, a live pid, no pid and another host, never a pid without a host.
   Affected surface hints: this scenario's PASS/FAIL criteria, `references/overlays.md:99`, and every project that upgrades while a killed run's lock is on disk.
   Case: a project that upgrades with a leftover lock from the previous release runs the scenario's own step 11 against its real tree and gets `refuse: the overlay lock is held: ...` — the scenario has no step that produces this input, so a green scenario is read as proof the takeover works for every lock on disk.

## Traceability Checks

| Protocol | Level | Status | Evidence |
|---|---|---|---|
| `spec_code` | core | partial | REQ-001 verified: `references/overlays.md` carries exactly 8 trigger phrases, inside the 3-8 the frontmatter contract allows. REQ-009/findings agree: `status` prints `STALE` for a stale root file and `isInSync` fails on it (`:2443-2446`, `:2472-2496`), matching `presentation.txt:112` ("fails the status"). REQ-010 matches: `LAYOUT` does not enter `isInSync` (`:2443-2446`), matching `presentation.txt:113`. REQ-012 matches: `AUDIT` findings do enter `isInSync`, matching `presentation.txt:114` ("fails the status"). REQ-015 is partly met: two display texts still diverge (findings 1-3). REQ-017 is untested by design (tasks T027/T028 are still `[ ]`), see Edge Cases. |
| `checklist_evidence` | core | partial | The Verification Checklist rows CHK-010 to CHK-051 are all unticked in `tasks.md`, so no checklist row claims a lint, error-handling, docs or file-org check that this review could contradict. T018 ("bring the command documents in line") is marked `[x]` and is the row finding 1 contradicts. |
| `skill_agent` | overlay | pass | `overlay.md:6` carries `<!-- skill_agent: system-skilled-doctor -->`, and the documents this iteration read live in that skill's `references/` and `manual-testing-playbook/`. |
| `agent_cross_runtime` | overlay | pass | The `command-contract.json` overlay hunk is in step with the router: `argument_hint` lists `[--json\|--audit]` and `[--capture\|--adopt <path>\|--relayout]`, `execution_targets` lists `status [--json] [--audit] [--root <dir>]` and `apply [--root <dir>] [--capture <path> \| --adopt <path> \| --relayout]`, and the `execution_summary` line names "apply --relayout followed by an apply". All three match `overlay.md:70` and `_routes.yaml:655`. |
| `feature_catalog_code` | overlay | notApplicable | No feature catalog exists for `system-skilled-doctor` (`find .skilled/skills/system-skilled-doctor -maxdepth 2 -iname '*catalog*'` returns nothing), so this protocol has no surface to cross-check in the declared target. |
| `playbook_capability` | overlay | partial | Seven scenarios were read for their manifests and expected signals. Three match the engine exactly and are named under Confirmed-Clean Surfaces; two carry the coverage gaps in findings 2-3; two (`adopt-with-unowned-file.md`, `status-without-overlays.md`) were read only for their fixture shape. |

## Integration Evidence

- `assets/doctor-overlay-status.yaml:54-58` was traced against `commandStatus`'s print order (`:2472-2500`): destination lines, `stateSummary`, `MISS`, `STALE`, `LAYOUT`, `AUDIT`, `checked=`, `RESULT:`. The order matches, and `stateSummary` emits `in-sync= overlay-edited= live-edited= both-changed= upstream-moved=`, which is the shape the playbook quotes.
- `assets/doctor-overlay-apply.yaml:104` and `:114` were traced against `commandRelayout` (`:4755`) and `relayoutUnderLock`'s exit codes: a refused move prints `refuse:` lines and returns 2 with nothing moved, and the follow-up apply's exit 1 is described correctly. Verified.
- `overlay.md:106-108` (relayout steps 9-11) was traced to `_routes.yaml:657,664`: the route's mutation surface names the layout-link targets, the manifest fields and the backup folder, and `gate3_location` names the same set. Verified, except the retarget outcome itself (finding 2).
- `command-contract.json`'s four overlay hunks were diffed against `overlay.md:70` and `parseArguments` acceptance: the hint, the two selectors, the `purpose` line and the `execution_summary` all agree with the router. Verified.
- No runtime mirror, command file, skill file or canonical agent file was modified by this iteration.

## Edge Cases

- **Plan-tracked pending work, not a finding:** `tasks.md` T022 to T028 are `[ ]`, including the `v4.0.2.1` changelog entry, the `system-skilled-doctor` v1.1.6.0 note (`SKILL.md` still reads `version: 1.1.5.0`) and the tag republish. REQ-017 depends on them. Reporting them as findings would restate the packet's own plan, so they are recorded here and excluded from the registry.
- **Partial success (playbook coverage):** five of the seven scenarios were read fully and their expected signals match `protectedPathProblem` (`:1945-1954`), `stateSummary` (`:2208-2210`) and the relayout print order. The two relayout scenarios pass for what they cover, which is exactly why their gap (finding 2) matters.
- **Ambiguity (route-level "then applies"):** `overlay.md:40` and `:70` say `--relayout` moves the sources, points the manifest there, "then applies". The engine does not apply afterwards; the route does, in a second command (`:108`, `apply.yaml:104`, `_routes.yaml:664`). Read at the route level the sentences are true, so this is recorded as an ambiguity rather than a finding, and finding 1 is limited to the one text that names a form that cannot be typed at all.
- **Missing dependency:** `route-validate.sh` and the contract test cannot be run from this lineage, so the route/contract parity above rests on direct comparison of the documents against `_routes.yaml`, not on the validator's own verdict.

## Confirmed-Clean Surfaces

- **`adopt-with-protected-file.md`**'s expected `MISS` line was compared character by character with `protectedPathProblem` (`:1945-1954`): `refusing to inspect a protected path: <shownPath>; if the overlay owns it, add "<relative>" to this entry's protectedPaths`. Exact match, including the quoting rule.
- **`stale-lock-takeover.md`**'s refusal expectations match `withLock` (`:2319-2323`): `refuse: the overlay lock is held: <owner line>` followed by the two-space `remove <path> by hand once that run has ended` line, exit 2, and the lock file left untouched.
- **`relayout-moves-sources.md`**'s expected print order matches `relayoutUnderLock` (`:4712-4746`): `backup <path>`, then one `moved a -> b` per copy, then `N moved`, then `run <command> apply`.
- **`commandContract.json` overlay hunk**: all four edits agree with the router and the engine's accepted flags.
- **Comment hygiene across the changed engine code**: the comments this review read in the diff (`isLockOwnerGone:2230-2234`, `acquireLock:2248-2252`, `replacedLinkState:1619-1625`, `planLayoutLinks:1668-1674`, `applyLayoutLink:1713-1721`, `removeDroppedItems:1103-1108`, `stateSummary`, `globToRegExp:3930-3933`, `isSameText:4241-4246`, `stagedUnownedChanges:4262-4269`, `auditVendoredTree:4396-4401`, `copyForBackup:4589-4595`, `relayoutUnderLock:4700-4703`, `applyUnderLock:2585-2589`) state a durable why and carry no spec path, ADR, REQ, CHK, task or finding id.
- **`USAGE`/`parseArguments` parity** (`overlay-engine.cjs:96-113` vs `:4770-4825`): every documented form is accepted and every extra flag combination is refused with the usage block and exit 2. `--audit` is limited to `status`, `--relayout` to `apply` and neither may be combined with `--capture` or `--adopt`.
- **Documented state-table claims** (`presentation.txt:110-114`): `STALE` fails the status, `LAYOUT` does not, `AUDIT` does — each matches `commandStatus`'s `isInSync` expression line by line.
- **Trigger-phrase budget** (`references/overlays.md:4-12`): exactly 8 phrases, so REQ-001's frontmatter failure cannot recur from this file.

## Ruled Out

- **`--audit` changing the exit code contrary to the docs:** dismissed. `presentation.txt:114`, `_routes.yaml:638` and `overlay.md:70` all say a finding fails the status, and `commandStatus:2443-2446` includes `audit.findings.length === 0` in `isInSync`. Docs and code agree.
- **`status` taking the lock, contrary to its invariant:** dismissed. `commandStatus` calls no `withLock`, and `status.yaml:28`'s invariant matches.
- **The relayout "then applies" sentences being wrong:** dismissed as an ambiguity at the route level, see Edge Cases.
- **The playbook's protected-path MISS line being out of date:** dismissed by exact comparison; the playbook already quotes the current fix wording including the quoting rule.
- **A missing `v1.1.6.0` skill version as a finding:** dismissed; `tasks.md` T027 owns it and is still open.
- **`command-contract.json` still describing the pre-`--audit` router:** dismissed by diff; all four overlay hunks were updated.

## SCOPE VIOLATIONS

None. No file outside the lineage directory was created, modified or deleted.

## Next Focus

- Dimension: none remaining — traceability and maintainability closed at this iteration
- Focus area: synthesis
- Reason: `maxIterations` is 3 and the loop stops on the cap; the three active P1 findings and four active P2 findings are the input to the report
- Rotation status: all four dimensions have been reviewed (D1, D2 CONDITIONAL; D3, D4 CONDITIONAL with P2 advisories only)
- Blocked/productive carry-forward: productive — the doc-sentence-versus-code-line pairing produced one P1 and one P2 in this iteration; nothing is blocked
- Required evidence: none further; synthesis reads the registry
- Recovery note: not applicable

Review verdict: CONDITIONAL
