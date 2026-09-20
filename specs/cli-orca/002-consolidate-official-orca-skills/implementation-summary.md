---
title: "Implementation Summary: Consolidate Official Orca Skills Into Standalone cli-orca"
description: "What the extraction produced, how it was verified, and what remains open at the time of writing."
trigger_phrases:
  - "cli-orca implementation summary"
  - "extraction results"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level3-arch | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-consolidate-official-orca-skills |
| **Status** | Complete |
| **Level** | 3 |
| **Started** | 2026-09-20 |
| **Branch** | `skilled/v4.0.0.0` |
| **Layout Revision** | 2026-09-20 - snapshots flattened to `assets/<name>.txt`, per-skill references regrouped under `references/orca-skills/`, first version set to 0.1.0.0 |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:exec-summary -->
## Executive Summary

This packet records the extraction of the Orca CLI subject out of the mcp-tooling parent hub and its promotion to a standalone class-S skill named `cli-orca`, together with the upgrade that embeds the eight official Orca skills as authored references and verbatim snapshot assets. The extraction is finished: the skill corpus, the hub extraction at nine modes, the packet move, the fleet catalog updates, the advisor re-ingestion and the sixteen-gate close-out suite are all complete, and every packet claim below carries a captured result. A post-closure review cycle then ran on the operator's instruction: five recorded review iterations, a fresh-context synthesis fix list, the applied remediations and a full playbook run all landed, the gate suite still shows zero failing gates, and the playbook's runtime wave is recorded as skipped against a named environment blocker rather than a guess.

<!-- /ANCHOR:exec-summary -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Files Changed

| Area | Paths | State |
|------|-------|-------|
| Baseline evidence | `scratch/baseline-pre-extraction.txt` | Written |
| Research artifacts | `scratch/research-official-skills.md`, `scratch/research-orca-cli-surface.md`, `scratch/research-routing-boundaries.md` | Written |
| Verbatim snapshots | `.skilled/skills/cli-orca/assets/*.txt` | Written, digest-verified |
| Provenance record | `.skilled/skills/cli-orca/assets/PROVENANCE.md` | Written |
| Skilled corpus | `.skilled/skills/cli-orca/{SKILL.md,README.md,references/**,feature-catalog/**,manual-testing-playbook/**,changelog/**,benchmark/**,graph-metadata.json,leaf-manifest.config.json}` | Written, every document validated |
| Hub extraction | `.skilled/skills/mcp-tooling/**` | Written, nine modes declared |
| Packet move | `specs/cli-orca/001-mcp-orca-cli/**` | Moved, metadata re-pointed |
| Track metadata | `specs/cli-orca/{description.json,graph-metadata.json}` | Written |
| Fleet catalogs | `.skilled/skills/README.txt`, the create-skill root metadata contract | Updated for fourteen roots |
| Gate evidence | `scratch/gate-results.md`, `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--extraction-routing-verification/**` | Captured |
| Post-closure review cycle | `review/**` (five iterations, ledger, loop report, synthesis fix list) | Recorded, every iteration re-verified |
| Playbook evidence | `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--playbook-post-remediation/**` | Recorded, 4 `PASS` / 0 `FAIL` / 4 `SKIP` |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:review-cycle -->
## Post-Closure Review Cycle

The packet was reopened so that the shipped skill could be reviewed, remediated and exercised as one recorded cycle.

| Stage | Outcome | Evidence |
|-------|---------|----------|
| Five-iteration deep review | Verdict `CONDITIONAL` in every iteration; 0 P0, 1 P1 and 6 P2 findings; dimension coverage 4/4; stop `maxIterationsReached` | `review/iterations/iteration-001..005.md`, `review/deep-review-state.jsonl`, `review/review-report.md` |
| Fresh-context synthesis | Prioritised fix list across 7 sections with 88 file:line citations, every finding tagged | `review/synthesis-remediation-plan.md` |
| Remediation | Seven findings applied (`P1-001`, `P2-001`..`P2-006`), each with its own proving check; 7 skill files at 39 insertions and 8 deletions, plus 3 packet files | `scratch/remediation-evidence.md` |
| Gate re-run against the baseline | `FAILING GATES: 0`; the sixteen baseline gates unchanged, the added router-probe gate passing, no regression | `scratch/gate-results-final-review.md` read against `scratch/gate-results-baseline-review.md` |
| Playbook run | 4 `PASS`, 0 `FAIL`, 4 `SKIP`; the runtime wave is blocked by the resolved executable's app-bundle error | `.skilled/skills/cli-orca/benchmark/reports/2026-09-20--playbook-post-remediation/**` |

Two corrections to the compiled loop report were carried into the fix list rather than silently absorbed: the misroute lane named for the P1 finding (the router returns `TERMINAL`, not `AUTOMATIONS`, because lane selection takes the maximum over an insertion-ordered signal table) and the understated omission set for `P2-001`. The fix list also rejects the report's proposed `startswith("orca")` gate, because three declared compound surfaces would stop routing.

Two loop-runtime quirks are recorded rather than fixed, because they belong to the deep-review runtime and not to this skill: the sanctioned append gateway refused the workflow's own `synthesis_complete` telemetry, and the findings registry still reads `status: INITIALIZED` with a null terminal stop while the config reads `complete`, because the reducer derives the terminal stop only from that refused event.

<!-- /ANCHOR:review-cycle -->

---

<!-- ANCHOR:arch-decisions -->
## Architecture Decisions Summary

| ADR | Decision | Status |
|-----|----------|--------|
| ADR-001 | Extract the subject into a standalone class-S skill | Accepted |
| ADR-002 | Carry each official skill as an authored reference plus a verbatim snapshot | Accepted |
| ADR-003 | Keep verbatim snapshots outside the documentation extension scope | Accepted |
| ADR-004 | Remove the repository copy after proving equivalence | Accepted |
| ADR-005 | Dispatch research and writing to external read-only workers | Accepted |
| ADR-006 | Keep the packet flat at Level 3 | Accepted |
| ADR-007 | Keep three deliberate Orca deferral mentions in the hub root files | Accepted |
| ADR-008 | Record the hub compiled-routing posture instead of republishing the activation manifest | Accepted |
| ADR-009 | Redact the upstream client key from the vendored snapshot | Accepted |

<!-- /ANCHOR:arch-decisions -->

---

<!-- ANCHOR:impl-decisions -->
## Key Decisions (Implementation)

- The repository copy was removed only after a recursive comparison against the vendored snapshot returned zero differences and an intact archive was located for rollback.
- The research wave ran as three parallel read-only workers, and each return was saved with a verification header and spot-checked citations before use.
- Verbatim snapshots were stored with a non-markdown extension so the fleet document gate stays honest without editing upstream bytes.
- The dispatch envelope named in the plan relocated the agent directory, which broke provider resolution. The override was dropped and the deviation is recorded below.

<!-- /ANCHOR:impl-decisions -->

---

<!-- ANCHOR:verification -->
## Verification Results

| Check | Result |
|-------|--------|
| Snapshot equivalence before removal | Passed, zero differing files |
| Snapshot bytes against the manifest digest | Passed, 8 of 8 |
| Research returns usable | Passed, three non-trivial cited reports |
| Root metadata gate | Passed, `checked=15 passed=15 failed=0` with the new root classified class S |
| Hub parent check | Passed, all hard invariants with 0 warnings at nine modes |
| Packet validation | Passed, both cli-orca packets print `RESULT: PASSED` under `--strict` with 0 errors |
| Advisor replay | Passed, the Orca phrase ranks `cli-orca` first and the OpenOrca holdout returns no recommendation |
| Feature catalog package | Passed, 0 violations |
| Playbook package | Passed, 8 scenarios across 4 categories, 0 violations and 1 advisory census warning |
| Document corpus | Passed, 33 documents with 0 blocking issues |
| Retired-leaf sweep | Passed, 0 live references to the retired leaf path outside changelog history |
| Frozen directory manifest | Passed after a sanctioned refresh, 816 directories reproduced |
| Post-closure review cycle | Passed, five iterations re-verified, the ledger complete, and both the loop report and the fix list present |
| Final gate suite | Passed, `FAILING GATES: 0` across 17 gates, read gate by gate against the baseline capture |
| Playbook run | Recorded, 4 `PASS` / 0 `FAIL` / 4 `SKIP` with the runtime blocker named; no release recommendation claimed |

### NFR Achievement

No performance, security or reliability NFR was placed at risk. The work touches documentation and metadata only.

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:milestones -->
## Milestone Achievement

| Milestone | State |
|-----------|-------|
| M1 Baseline captured and snapshot removed with proof | Achieved |
| M2 Skill root authored | Achieved |
| M3 Corpus complete | Achieved |
| M4 Hub clean at nine modes | Achieved |
| M5 Packets moved and metadata live | Achieved |
| M6 Fleet catalogs, re-ingestion and gates closed | Achieved |
| M7 Post-closure review cycle closed and the leaked key remediated | Achieved |

<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- The live Orca runtime was probed and is blocked in this shell: the executable that the documented resolution order selects, `/usr/local/bin/orca`, exits non-zero for every command with `Unable to determine Orca.app path from symlink: /usr/local/bin/orca`. The app bundle itself is present and healthy (`com.stablyai.orca`, version `1.4.205`), so the runtime wave of the playbook is recorded `SKIP` rather than failed, and three of those skips are critical-path, which is why the playbook run supports no release recommendation.
- The snapshot carries no source commit, so provenance is pinned by revision and digest.
- The advisor recall hole is unresolved. A long prompt that mixes an Orca phrase with generic worktree and terminal vocabulary scores below the surfacing threshold, because the lexical lane normalizes token overlap against the unexpanded prompt length. Short Orca-qualified phrases route, long mixed ones can return nothing.
- The hub compiled route reports a stale activation manifest. Republishing it needs the authored compiled-routing tree, which the sync tool cannot locate because that tree now lives under `specs/sk-doc/z_archive/`, so the hub serves through its prose router and the posture is recorded as legacy authority.

<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:risks-realized -->
## Risks Realized

| Risk | Outcome |
|------|---------|
| The repository copy might be unrecoverable | Did not materialize, an intact archive and the vendored copy both exist |
| The plan's dispatch envelope might not resolve models | Materialized, resolved by dropping the agent-directory override |
| Verbatim snapshots might fail the fleet document gate | Materialized, resolved by keeping the bytes and leaving the doc scope |
| The extraction might break an unrelated frozen fixture | Materialized, the sk-doc directory manifest was refreshed with its own writer and the test passes |
| The hub might lose compiled serving when its mode set changed | Materialized, recorded as `stale-manifest` and reported rather than hidden |
| The playbook runtime wave might need a live Orca session | Materialized, the resolved executable cannot locate its app bundle; the wave is recorded `SKIP` with the exact error named |
| The loop's own telemetry gateway might refuse the synthesis event | Materialized, recorded as a deferred item together with the refused payload shapes and their errors |
| A count recorded in an earlier pass might go stale as the fleet and corpus grow | Materialized twice, and both were corrected in this closeout: the root-metadata fleet count and the document corpus count |

<!-- /ANCHOR:risks-realized -->

---

## What Went Well

Baseline capture happened before any destructive action, so the equivalence proof exists. Dispatch of the research wave produced cited reports without falling back to the second route.

## What Could Improve

The dispatch envelope carried an environment override that had not been tested against provider resolution, which cost one diagnostic cycle. A playbook run's runtime preconditions are also worth probing before the run is planned, so that an environment blocker is discovered as a precondition rather than as four recorded skips.

## Recommendations for Future

Test a dispatch envelope with a model listing before launching a wave, and treat verbatim upstream assets as an extension question rather than a frontmatter question.

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| Relocate the agent directory for child runs | Ran against the real agent directory | A temporary agent directory resolves no models, so every dispatch would have failed before reaching a provider |
| Dispatch writing passes for the packet documents | Authored by the orchestrator | The packet records decisions and observed results that the orchestrator already holds |
| Store verbatim snapshots as markdown | Stored flat as `assets/<name>.txt` | Two fleet gates require a version field on markdown documents, which the snapshots may not gain |
| Move the hub evidence after the packet move | Moved in the same wave as the hub edits | The archived hub scenarios and the moved evidence need the packet to exist at its new path first |
| Remove every Orca mention from the hub root files | Three deliberate deferral mentions were kept | They point at the standalone skill and document the new cross-skill boundary, so removing them would delete the boundary contract |
| Leave the skill router pseudocode as prose | Raised to the canonical smart-router block | The create-skill contract expects the named resilience markers, and the stricter package check is part of the closing suite |
| Group the skill documents as `official-skills` | Snapshots flattened into `assets/` and the group renamed `orca-skills` in both the reference and catalog trees | The operator asked for no folder name that claims officialdom, and a flat asset directory scans faster than eight single-file subdirectories |
| Release the skill at 1.0.0.0 | Released at 0.1.0.0 | The operator set the first version, which also matches how the sibling first-release skills open |
| Run the review loop on a spread of executors | Every dispatch ran on `llmgateway/deepseek-v4.1-flash` through `cli-pi` | The Cline route is absent from every deep-loop executor allowlist, so the operator chose the llmgateway route for all five iterations |
| Author the declared audit surfaces under `review/` | Authored at the packet root as `resource-map.md` | The loop detects the packet-root map, while the reducer owns and would overwrite the `review/` copy |
| Run the synthesis reducer with `--no-resource-map` | Ran it without the opt-in `--emit-resource-map` | The reducer has no `--no-resource-map` flag; the declared map is hand-authored, and the only effect of the emit flag would be a second, generated index |
| Run the workflow's save phase at loop closeout | Deferred to this packet closeout | Writing continuity mid-cycle would create claims that the remediation immediately restales |
| Stage the review trail with `git add` at closeout | Skipped | The shared index held another session's staged rows, so a plain add would have swept foreign work into this packet's history |
| Treat an absent Orca binary as the only playbook skip condition | Recorded `SKIP` with the executable's exact error while the binary is present | The resolved executable cannot locate its app bundle, and the scenario contracts forbid falling through to a different Orca executable after an execution error |
| Add the router-probe gate to the persisted suite without touching what was already there | Repaired a duplicated gate-16 label that the append introduced | The duplicate would have printed the gate block twice and made the gate-by-gate read against the baseline ambiguous |

<!-- /ANCHOR:deviations -->

---

<!-- ANCHOR:follow-up -->
## Follow-Up Items

- [x] Split a phased parent if the remaining work needs independent child packets (not needed, the flat Level 3 packet closed)
- [ ] Re-point the compiled-routing sync tool at the archived authored tree and republish the hub activation manifest
- [ ] Address the advisor lexical normalization so a long mixed Orca prompt can surface the skill
- [ ] Refresh the snapshot when a newer upstream release is vendored
- [ ] Repair the Orca executable resolution so the playbook's runtime wave can run; three of its scenarios are critical-path and currently block a release recommendation
- [ ] Re-run the playbook once that blocker clears and refresh the dated room
- [ ] Refresh the findings registry's terminal stop once the loop's telemetry gateway accepts the synthesis event

<!-- /ANCHOR:follow-up -->
