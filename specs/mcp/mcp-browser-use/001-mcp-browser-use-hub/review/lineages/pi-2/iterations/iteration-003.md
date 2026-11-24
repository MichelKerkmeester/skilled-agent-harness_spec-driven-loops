# Review Iteration 003 - mcp-browser-use hub

## Dispatcher

- Mode: review (LEAF, single iteration)
- Run: fanout-pi-2-1795511024070-2cuwlj, generation 4, lineageMode new
- Iteration: 3 of 7
- Dimension: traceability
- Operator review focus: every phase's shipped work against its goal criteria, including the phase 015 fixes and the advisor 2.0.3.0 id-noun change. This iteration is the direct test of that focus: phase 015's three completion criteria and the epic's seven are each traced to a command output or a file:line, and the advisor change is traced from its changelog claim to its live effect.

## Files Reviewed

- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` (epic completion criteria)
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/{goal.md,spec.md,acceptance-criteria.md,tasks.md,implementation-summary.md}`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/014-fix-deep-review-findings/goal.md`
- `specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/{002-hub-scaffold,003-mode-relocation,004-bladebro-mode,007-bladebro-parity-and-changelogs}/goal.md`
- `.skilled/skills/mcp-browser-use/README.md:1-75`
- `.skilled/skills/mcp-browser-use/changelog/` (file set)
- `.skilled/skills/mcp-browser-use/benchmark/reports/compiled-routing/2026-11-24--two-stage-replay--compiled--follow-up/{README.md,results.csv}`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/{fixtures/canary-cases.v1.json,harness/build-artifacts.cjs:100-145}`
- `.skilled/skills/system-skill-advisor/{SKILL.md:5,changelog/v2.0.3.0.md,runtime/lib/scorer/lanes/explicit.ts}`
- `.skilled/skills/mcp-tooling/mode-registry.json`

## Findings

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The hub README's changelog table links three of the five release files, so a reader cannot reach the 1.1.2.0 and 1.1.3.0 entries from the index that claims to list them** -- `.skilled/skills/mcp-browser-use/README.md:70` -- README section 4 opens with "Releases live in `changelog/` with one file per release, named `v[version].md`" (lines 66-68) and then lists 1.1.1.0, 1.1.0.0 and 1.0.0.0 only (lines 70-72). `changelog/` holds five files: `v1.0.0.0.md`, `v1.1.0.0.md`, `v1.1.1.0.md`, `v1.1.2.0.md`, `v1.1.3.0.md`. Phase 015 adjudicated the neighbouring question and only that one: its out-of-scope list says "The README version finding. Each Markdown doc carries its own version line, which the commit hook bumps, so a README at a different version from `SKILL.md` is not drift" (`015-fix-follow-up-review-findings/spec.md:130`). That ruling covers the `version: 1.1.4.0` frontmatter line, not the table, so the missing rows stay unaddressed. The packet's own changelog coverage check walks the top-level changelog mirror, not this skill README (`007-bladebro-parity-and-changelogs/tasks.md:48`), which is why the omission survived it.
   - Finding class: doc-index-drift
   - Scope proof: README is line 240 of the pre-bound review scope; the changelog directory sits under the same skill root.
   - Affected surface hints: `.skilled/skills/mcp-browser-use/README.md`, `.skilled/skills/mcp-browser-use/changelog/`
   Case: an operator on 1.1.3.0 who opens the README to find what changed since 1.1.1.0 sees no entry and no link, while both release notes exist on disk.
   ```json
   {"type":"claim-adjudication","claim":"The hub README changelog table omits the existing v1.1.2.0 and v1.1.3.0 release files, and the phase 015 ruling covers only the version line, not the table.","evidenceRefs":[".skilled/skills/mcp-browser-use/README.md:66-72","specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/015-fix-follow-up-review-findings/spec.md:130"],"counterevidenceSought":"Read the README section verbatim, listed changelog/ (five files), and searched phase 015's out-of-scope list for a ruling on the table itself.","alternativeExplanation":"A reader can list changelog/ directly, and the new release workflow may intend the table to hold only pre-1.1.2 entries.","finalSeverity":"P2","confidence":0.85,"downgradeTrigger":"Closed if README section 4 states the table is a partial index, or if rows for 1.1.2.0 and 1.1.3.0 are added."}
   ```

## Traceability Checks

Protocol `spec_code` -- pass. Each phase 015 completion criterion traced to command output or file:line:

| Criterion (015 goal) | Evidence | Result |
|---|---|---|
| Three-mode bundle prompt routes `orderedBundle` to all three modes | `node .skilled/bin/compiled-route.cjs --hub mcp-browser-use --prompt "use mcp-chrome-devtools, mcp-aside-devtools and mcp-bladebro"` printed `selectionKind: orderedBundle` with targets chrome-devtools, aside-devtools, bladebro in tie-break order, exit 0 | Met |
| ... and the canary harness exits 0 | In-process `typedGold()` over `fixtures/canary-cases.v1.json`: 16 of 16 cases satisfy their gold, the `three-mode-ids-ordered-bundle` case included, policy hash `fc55eafa`. Run without `buildArtifacts()` so no artifact outside this lineage was written | Met |
| The five probe prompts no longer lift a skill they do not name | Live advisor probes: "fix the infinite loop in this function" (none), "update the build tooling for the monorepo" (none), "update the plan for the mode rollout" (system-spec-kit, cli-external-orchestration; the hub's keyword `mcp-code-mode` is gone), "fix the code in the parser" (sk-code, local-webflow), "fix the config loader ... in staging" (sk-code only) | Met |
| ... and "run the doctor update check" still reaches system-skilled-doctor | Same probe: `sk-doc:0.82, cli-classifier:0.82, system-skilled-doctor:0.82` | Met |
| ... and the advisor suite fails only the known `system-skilled-bots` test | Not re-run. The suite is a Vitest workspace of 2,737 tests that builds `dist` first, which both exceeds this iteration's budget and writes outside this lineage | Not re-verified (UNKNOWN) |
| The two-stage replay fails only MBU-PB-04 | All 52 rows of `results.csv` replayed: advisor hub confidence, front-door action and front-door target reproduced on 52 of 52 rows, 0 drift. The single recorded FAIL is MBU-PB-04, whose stage one yields no hub recommendation | Met |
| `validate.sh --strict --recursive` on the hub epic prints RESULT: PASSED | Blocked by this run's limits: the dispatched worker may not run `validate.sh`. The claim is recorded as unverified rather than assumed | Not re-verified (blocked) |

Protocol `spec_code` -- epic criteria spot-checked, all pass where runnable:

| Epic criterion | Evidence | Result |
|---|---|---|
| `.skilled/skills/mcp-browser-use/mode-registry.json` lists exactly three modes | iteration 1 registry read: three modes, packetKind workflow, backendKind cli-plus-mcp | Met |
| `.skilled/skills/mcp-tooling/mode-registry.json` lists six | `node -e` read: 6 modes (click-up, figma, refero, mobbin, obsidian, notion) | Met |
| No stale `mcp-tooling/mcp-chrome-devtools` or `.../mcp-aside-devtools` id under `.skilled` | `rg` over `.skilled` excluding changelog and benchmark/reports: no match, exit 0 | Met |
| One real browser request per mode reaches the hub from the advisor and the mode from the router | replay rows MBU-R-01..03: hub 0.95 / 0.9441 / 0.9295, each routed to its mode | Met |
| Each mode has a manual-testing playbook with a recorded run, live Bladebro on macOS included | `mcp-{chrome-devtools,aside-devtools,bladebro}/manual-testing-playbook/manual-testing-playbook.md` exist; `benchmark/reports/2026-11-21--manual-testing-playbook--macos-live` records the live run | Met (presence and report, not re-run) |
| `validate.sh --strict --recursive` prints RESULT: PASSED | Blocked by this run's limits | Not re-verified (blocked) |

Protocol `checklist_evidence` -- pass. Phase 015 `tasks.md` rows re-executed rather than trusted:

| Row | Claimed evidence | Re-run |
|---|---|---|
| T004 | config-loader probe shows sk-code only | Reproduced: `sk-code:0.82` |
| T008 | harness `exit=1` without the alias, `exit=0` with it | `exit=0` reproduced in-process over all 16 gold cases; the `exit=1` direction needs an edited tree, so it is not reproducible in a read-only review |
| T019 | replay `{"PASS":51,"FAIL":1}` | Reproduced exactly, 52 of 52 rows |

Advisor 2.0.3.0 id-noun change, traced end to end:

- Claim (`system-skill-advisor/changelog/v2.0.3.0.md`): the id noun names a skill only beside another shared word, bare `staging` stops anchoring the hub, and the hub drops `mcp-code-mode` from its keywords.
- Version parity: `SKILL.md:5` is `2.0.3.0`, `changelog/v2.0.3.0.md` exists, and the hub's own `SKILL.md`, `ROUTER.md`, `hub-router.json`, `mode-registry.json` and `description.json` are all `1.1.3.0`.
- Effect: verified live on the six probe prompts above, with the outcome the changelog predicts.
- Disclosed residual: the changelog's Known Limitation says "fix the container orchestration config" still lifts sk-code, mcp-code-mode and the browser hub to 0.82. Re-ran it: `sk-code:0.82, mcp-code-mode:0.82, mcp-browser-use:0.82`. The disclosure is accurate, so this is a documented shared-anchor limitation and not a finding for this hub.
- Cross-hub consistency: the phase 015 out-of-scope list explains why the install guides keep `@latest` ("Three install guides share that convention"), and `.utcp_config.json` pins `chrome-devtools-mcp@0.26.0`, so the registration and the guide differ by design rather than by drift.

## Edge Cases

- Phase 014's criteria cite `node --test .skilled/bin/tests/mcp-installers.test.cjs` (pass 5, fail 0) as the installer parity proof. Not re-run here: the installer behaviour it asserts was read directly in iteration 2, and the test file is outside the pre-bound scope.
- Phase 006's criteria are historical records ("the goal log records the operator's install answer", "step 4 records a SHA-256 check") that describe what a past session captured; they cannot be re-proved from the tree and are outside this iteration's dimension.
- The `exit=1` half of AC-001 needs the alias removed from `mode-registry.json`; a review may not edit the reviewed tree, so only the positive half is provable here.
- Epic criterion 6 ("a live Bladebro run on macOS included") is verified as a recorded report, not as a live run; a re-run would install and launch a browser, which is an operator stop-for-yes and out of bounds for this worker.

## Confirmed-Clean Surfaces

- Phase 015's claimed replay numbers match the recorded CSV row for row and the CSV reproduces against the live tree, so the phase's central evidence is not stale.
- The advisor changelog's two behavioural claims and its one disclosed limitation all reproduce.
- Phase 003's stale-id criterion still holds on the current tree (rg exit 0, no match).
- `mcp-tooling` still lists exactly six modes, so the relocation did not drift back.

## Ruled Out

- "Phase 015 claims 51 of 52 with stale artifacts": ruled out -- every row reproduces.
- "The advisor 2.0.3.0 change is documented but not shipped": ruled out -- version parity holds and the six probes show the new behaviour.
- "The Chrome `@latest` guide rows and the pinned UTCP registration are drift": ruled out -- phase 015 records the shared-convention decision, and the registration pins a version the guide treats as the MCP entry point.
- "The README version line 1.1.4.0 is drift": ruled out by the phase 015 ruling; only the changelog table is left open, and that is the iteration's P2.

## Next Focus

- Dimension: maintainability
- Focus area: the hub's own doc and version consistency -- ROUTER/SKILL/README cross-references, changelog coverage in the top-level mirror, the capability-matrix cell counts, and whether the mode packets' changelogs and the hub changelog tell one story.
- Reason: iteration 3 opened exactly one doc-index gap; the maintainability pass should find whether it is isolated or one of a class, and whether the packet's coverage tooling can see the class at all.
- Required evidence: file:line per cross-reference plus the coverage tool's output.
- Rotation status: D1, D2 and D3 covered; D4 next.

Review verdict: PASS
