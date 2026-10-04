---
title: "Deep Research: is /doctor:update perfected?"
description: "Synthesis of six deep-research iterations auditing /doctor:update end to end. Five P1 and twenty-one P2 defects remain across the router, workflows, presentation and release-update engine, each ranked with file:line evidence, a fix and a proving test."
trigger_phrases:
  - "doctor update perfection research"
  - "release-update engine audit"
  - "doctor update remediation ranking"
  - "doctor update stale apply lock"
importance_tier: important
contextType: research
---

# Deep Research: is /doctor:update perfected?

<!-- ANCHOR:deep-research-doctor-update-perfection -->

## 1. EXECUTIVE OVERVIEW

No. The engine's core invariants hold. Align writes only inside its run directory (`release-update.cjs:1371-1382`). Apply rechecks the local and release blob of every path it writes or keeps local, once before and once under its lock (`release-update.cjs:1644-1661`, `1762-1765`, `1842`, `1877`). Rollback restores what still matches the applied state and skips later edits (`release-update.cjs:2039-2056`). Exit codes, `kind:name` unit keys and the rollback-record-before-first-write order match the workflows. The engine suite passes 56 of 56 (synthesis run, exit 0).

Five P1 defects remain. Each sits in a hand-off, between two actions or between the engine and the operator, which is why tests of one action at a time miss them. All five were reproduced by driving the real engine.

1. **DU-01.** A partial decision set silently drops the release change of every undecided file in a conflict or removed unit and records the release as that unit's base. The next check reports the checkout `current`.
2. **DU-02.** An interrupted apply (Ctrl-C, SIGTERM, a runtime tool timeout) strands `.skilled/release/.apply.lock`. The lock then blocks rollback, re-apply and even `apply --dry-run`, and every documented path forbids removing it.
3. **DU-03.** A copied or vendored tree cannot name the framework upstream through the routed command, because no action routes `--remote`. Check reports UNKNOWN with every unit blocked.
4. **DU-04.** `record-base` accepts whatever release the operator names. Naming a later release than the one installed makes a tree that is a release behind report `current`.
5. **DU-05.** The single startup approval is not bound to the plan apply executes. The dry-run reports no release, and a no-run apply re-plans, so a tag published between preview and approval is written without a second approval.

Twenty-one P2 findings follow. They cover journey gaps (a second apply refused until `base.json` is committed, copied trees missing the run-root ignore rule, a base-recording prompt that never clears, a bare apply that burns a decided alignment run, no routed rollback, a downgrade labelled `update`), drift between the workflows, presentation and engine, sk-create-command contract gaps and test gaps. No P0 was found.

Recommended order: DU-01 and DU-02 first (state integrity and recovery), then the copied-tree cluster DU-03, DU-07, DU-08 and DU-04 as one phase, then DU-05, then the P2 list in Section 11 order.

Iterations: 6 of 6. Iterations 1 to 5 ran in parallel on cli-codex `gpt-6-luna` (reasoning max, fast tier) and iteration 6 ran on a fresh Claude Opus 5.5 at xhigh. Stop reason: `maxIterationsReached` (stop policy `max-iterations`).

## 2. BACKGROUND & CONTEXT

`/doctor:update` updates an operator's framework copy to a newer release while keeping local customizations. The design research in `specs/system-speckit/048-doctor-command-audit/003-update/research/research.md` split it into `check` (read-only), `align` (writes decisions into an ignored run directory) and `apply` (the only writer of release-managed files), and moved the database rebuild to `/doctor:rebuild`. Phases 002 and 004 of this packet then changed the engine and workflows (`spec.md:39`). Phase 002 added the generated file class, base recording and the prerelease opt-in (`002-release-update-customization-signals/implementation-summary.md:58`). Phase 004 added `kind:name` unit keys, numeric prerelease order, rollback under the apply lock and plan paths confined to their units (`004-doctor-scripts-conformance/implementation-summary.md:66`). This phase checks the result end to end before anyone builds on it.

| Part | Path |
|---|---|
| Router | `.skilled/commands/doctor/update.md` |
| Workflows | `.skilled/commands/doctor/assets/doctor-update-check.yaml`, `doctor-update-align.yaml`, `doctor-update-apply.yaml` |
| Presentation | `.skilled/commands/doctor/assets/doctor-update-presentation.txt` |
| Engine | `.skilled/commands/doctor/scripts/release-update.cjs` (2,214 lines) |
| Tests | `.skilled/commands/doctor/scripts/tests/release-update.test.cjs` (56 tests) |
| Contract | `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `assets/command-contract.json` |

The workflow files live directly under `assets/`. Iteration 1 cited them under `assets/workflows/`, which does not exist. Its line numbers match the real files, so this synthesis keeps its content and corrects the path. `research/resource-map.md` lists the two `assets/workflows/` paths as MISSING for the same reason.

Short file names below refer to the paths in this table.

## 3. RESEARCH QUESTIONS

- Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?
- Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?
- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes, align never writes skill bodies, apply applies only accepted decisions?
- Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

## 4. METHODOLOGY

**Workflow.** `/deep:research:auto` (`deep-research-auto.yaml`) with stop policy `max-iterations` and six iterations (`deep-research-config.json`). The convergence threshold of 0.05 was telemetry only.

**Parallel batch, iterations 1 to 5.** At the operator's request ("run more in parallel"), iterations 1 to 5 ran concurrently on cli-codex `gpt-6-luna` with reasoning `max`, service tier `fast` and sandbox `workspace-write`, as the recorded dispatch arguments show. Iteration 1 was dispatched at 19:15:57Z and iterations 2 to 5 between 19:20:07Z and 19:20:17Z, while iteration 1 was still running. Each held one key question and none saw the others' work. Iteration 1 was meant for Q1 but ran an unfocused cross-check and recorded Q3 as answered. Iterations 2, 3, 4 and 5 took Q2, Q3, Q4 and Q5. This departs from the workflow's sequential loop, where each iteration reads the state its predecessor left. Three consequences show in the record. The stale-lock defect was reported three times (iterations 1, 2 and 5). Two contradictions, about the vendored path and the acceptance gate, stood until iteration 6. The newInfoRatio values measure novelty against one shared starting state, so they are not a convergence trend. The reducer ran once after the batch.

**Iteration 6.** A fresh Claude Opus 5.5 at xhigh, run as the native subagent `opus-xhigh`, cross-checked iterations 1 to 5 and hunted defects where the questions meet. It ran the engine suite (56 of 56), four fixture probes and a signal probe. The workflow's cli-claude-code branch was tried first, and its nested-dispatch guard refused it because `claude` was in the process ancestry. The native branch is the workflow's route for a Claude host. The orchestrator reports that the refusal was recorded as a `dispatch_failure` event. This synthesis found no such event in `deep-research-state.jsonl`, in the nine decoded frames of `deep-research-ledger/frames/` or of `deep-research-audit-ledger/frames/`, in `observability-events.jsonl` or in the lock grant journal under `locks-and-fencing-v1/`, so the record is unconfirmed from packet artifacts.

**Provenance.** For iterations 1 to 5 the evidence is the intent and completion receipts in `research/dispatch-receipts/dispatch-research-i{1..5}-g1.*.json` (exit status 0, model and flags in the recorded arguments) and each delta file. Iteration 6's executor block (`native`, `claude-opus-5-5`, `xhigh`, agent `opus-xhigh`) is in `deltas/iter-006.jsonl`. In the final `deep-research-state.jsonl`, rows 1 to 5 carry the cli-codex stamp and row 6 carries none. The orchestrator reports that the state-log projection drops the executor stamp on each gateway refresh. That is a deep-loop defect outside this topic.

**Registry note.** The reducer lifted only bullet rows from iteration 6 into `findings-registry.json`, which holds 49 key findings in total. Iteration 6's headline findings P1-A to P2-L appear only in its narrative and in `deltas/iter-006.jsonl` (28 rows), which this synthesis treats as the complete record. The registry's fourth ruled-out row, "None. Every action produced evidence.", is lifted from iteration 6's empty Dead Ends section and is not a direction.

**Synthesis (this document).** A fresh Claude Opus 5.5 leaf that ran none of the iterations. It read every input listed in Section 14 and opened the cited file:line of every finding. It re-ran `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` (`tests 56`, `pass 56`, `fail 0`, exit 0, 176 s). It drove the real engine in throwaway repositories under the session scratchpad, outside the repository (probes listed in Section 14). One early signal probe was inconclusive because it carried no start marker. It was repeated three times per signal with markers before any conclusion was drawn.

Labels used below. **Confirmed**: the synthesis opened the code at the cited lines and it says what the finding says. **Reproduced**: an executable probe showed the behaviour, and the label names who ran it. **Inferred**: reasoning from code only, with what would confirm it.

## 5. KEY FINDINGS SUMMARY

`/doctor:update` is not perfected. The six iterations reported 49 registry rows and 28 delta rows, which deduplicate to 26 findings: 0 P0, 5 P1 and 21 P2. One iteration finding was dropped as not a defect and one P2 was promoted to P1.

| ID | Sev | Finding | Q | Iteration sources | Status |
|---|---|---|---|---|---|
| DU-01 | P1 | Partial decisions drop undecided release changes and advance the base | Q4, Q1 | 6 (new), refutes a claim of 4 | Confirmed. Reproduced by 6 and synthesis |
| DU-02 | P1 | An interrupted apply strands the lock that rollback and re-apply need | Q2, Q5, Q1 | 1, 2, 5, widened by 6 | Confirmed. Reproduced by 6 and synthesis (real engine) |
| DU-03 | P1 | Copied trees cannot name the framework upstream through the routed command | Q1, Q2, Q5 | 6 (new), narrows 2, merges 5 | Confirmed. Reproduced by 6 and synthesis |
| DU-04 | P1 | record-base trusts the named release, and a wrong answer reports a behind tree as current | Q4 | 6 (P2-H, promoted) | Confirmed. Reproduced by synthesis |
| DU-05 | P1 | The startup approval is not bound to the plan apply executes | Q1, Q3 | 6 (new) | Confirmed. Reproduced by 6 and synthesis |
| DU-06 | P2 | A second apply is refused until base.json is committed, and nothing says to commit | Q5 | 6 | Confirmed. Reproduced by 6 and synthesis |
| DU-07 | P2 | Copied trees lack the run-root ignore rule the align and apply preflights require | Q5 | synthesis (new) | Confirmed layout. Refusal inferred from workflow text |
| DU-08 | P2 | The base-recording prompt never clears on a copied tree | Q5, Q4 | 6 | Confirmed. Reproduced by 6 and synthesis |
| DU-09 | P2 | A bare apply after align consumes the run and discards its decisions | Q5, Q4 | 6 | Confirmed. Reproduced by 6 and synthesis |
| DU-10 | P2 | Rollback and record-base have no route | Q3, Q5 | 6 | Confirmed |
| DU-11 | P2 | An explicit older --release plans and applies a downgrade labelled update | Q2 | 6 (P2-I) | Confirmed. Reproduced by synthesis |
| DU-12 | P2 | Generator follow-ups are displayed but never acted on | Q1, Q5 | 6 | Confirmed |
| DU-13 | P2 | Field-level drift between workflows, presentation and engine (six items) | Q1 | 6, one item new in synthesis | Confirmed |
| DU-14 | P2 | Align and apply map --include-prerelease without declaring the input | Q1 | 1, confirmed by 6 | Confirmed |
| DU-15 | P2 | Prefilled adopt-release decisions apply without a decide call | Q4 | 4, widened by 6 | Confirmed. Reproduced by the passing suite |
| DU-16 | P2 | The generated-artifact inventory is a closed list with unlisted candidates | Q2 | 2, confirmed by 6 and synthesis | Confirmed. Candidates inferred |
| DU-17 | P2 | Renames are a delete plus an add, unlinked in the evidence, with no test | Q2 | 2, confirmed by 6 | Confirmed |
| DU-18 | P2 | Cancellation is recorded as DECLINED, not CANCELLED | Q3 | 3, confirmed by 6 | Confirmed |
| DU-19 | P2 | Apply says its dry-run writes nothing, then writes a state log | Q3, Q1 | 3, confirmed by 6 | Confirmed |
| DU-20 | P2 | The canonical argument hint omits --include-prerelease | Q3 | 3, confirmed by 6 | Confirmed |
| DU-21 | P2 | The router carries next-step wording the presentation owns | Q3 | 1, confirmed by 6 | Confirmed |
| DU-22 | P2 | The router overstates that apply never writes generated files | Q1 | 6 (narrows 2) | Confirmed |
| DU-23 | P2 | Read-only check wording omits the fetch exception in two places | Q3 | 3, narrowed by 6 | Confirmed |
| DU-24 | P2 | Grep and Glob are granted but unused | Q3 | 3, confirmed by 6 | Confirmed |
| DU-25 | P2 | A base record without a tree fingerprint is accepted as recorded | Q4 | 4, narrowed by 6 | Confirmed code path. Impact inferred |
| DU-26 | P2 | The release-note index is stale (outside the update surface) | Q5 | 5, narrowed by 6 | Confirmed |

**Verdict changes against the iterations.**

| Iteration claim | Verdict | Reason |
|---|---|---|
| Iteration 2: valid-UTF-8, NUL-free binary content can reach text merging (P2) | Dropped | Git's own test for binary content is a NUL byte in the first 8000 bytes. The engine is stricter (`release-update.cjs:555-560`). A synthesis check showed `git diff --numstat` treating such content as text, and treating a file whose only NUL follows byte 8000 as text while the engine calls it binary. |
| Iteration 6 P2-H: record-base trusts the named release (P2, inferred) | Promoted to P1 (DU-04) | Reproduced. The wrong answer yields a `current` report on a tree a release behind, and it replaces an inference that was right. |
| Iteration 6 P1-D: approval not bound to the plan | Kept P1, narrowed (DU-05) | Only the no-run path re-plans. A `--decisions` run and a reused run are pinned to their plan's release (`release-update.cjs:1566-1571`, `1827-1829`). |
| Iteration 6 P2-I: explicit older release downgrades (P2, inferred) | Kept P2, now reproduced (DU-11) | Synthesis probe I wrote the v1.0 content back as an `update`. |
| Iteration 6 P2-K: no workflow maps the report status | Narrowed (DU-13) | `doctor-update-check.yaml:120` maps `unknown`. Only `blocked` has no mapping. |
| Iteration 6 P1-B, sub-claim: a kill inside writeAtomic strands a temp file | Code path confirmed, not reproduced | The synthesis kill left 0 temp files (`release-update.cjs:1809-1821`). |
| Iteration 4: the routed workflow closes the acceptance gate, and no silent loss path exists | Refuted for partial decision sets (DU-01) | Reproduced by iteration 6 and the synthesis. The claims hold for local content and complete decision sets only. |
| Iteration 4: legacy base records can lack a fingerprint | Narrowed (DU-25) | Every current writer records a tree (`release-update.cjs:1730`, `1997-2000`). |
| Iteration 2: the vendored tree works when a remote is reachable | Narrowed (DU-03) | It works only through the raw engine with `--remote`, or when `origin` is the framework. |
| Iteration 2: offline plus a tagless vendor is untested | Merged into DU-03 | The routed command fails the same way online. |
| Iteration 2: generated handling is a closed allowlist | Confirmed and sharpened (DU-16) | The synthesis found two unlisted candidates. |
| Iteration 3: read-only does not disclose Git metadata writes | Narrowed (DU-23) | The check workflow discloses the fetch (`doctor-update-check.yaml:16-24`) and the router summary qualifies it (`update.md:64`). |
| Iteration 5: the release-note index is stale | Narrowed (DU-26) | The engine never reads it (`release-update.cjs:389-392`). Docs only. |
| Iteration 5: copied-tree acquisition is undocumented | Merged into DU-03 | The same fix documents the copied-tree route. |
| Iteration 1: citations under `assets/workflows/` | Path corrected | No such directory exists. Line numbers match the real files. |

## 6. FINDINGS: Q1 WORKFLOW PROMISES VERSUS THE ENGINE

Answer: no. Iteration 6 settled Q1 and the synthesis re-checked each item.

What matches the engine (Confirmed):

- Exit codes: 0 for a completed command, 1 for a refusal or failure, 2 for a usage error (`release-update.cjs:2166-2172`), as `doctor-update-check.yaml:120` describes.
- Unit identity: `kind:name` keys (`release-update.cjs:468-470`), as `doctor-update-check.yaml:118` and `doctor-update-presentation.txt:162` say.
- Lock acquisition and refusal (`release-update.cjs:1775-1795`, `1834-1836`) and `rollback.json` before the first target write (`release-update.cjs:1889`, before the loop at `1893-1897`), as `doctor-update-apply.yaml:123-125` promises.
- Lock release on a normal return and on a caught write error (`release-update.cjs:1903-1905`), tested at `release-update.test.cjs:1067`.
- Align's dry-run creates no run directory (`release-update.cjs:1373`), as `doctor-update-align.yaml:96` says, tested at `release-update.test.cjs:458-460`.

What the workflows promise and the engine does not keep:

- **DU-05.** Approval covers "the exact displayed plan" (`doctor-update-apply.yaml:115`), but the dry-run carries no release or run directory and a no-run apply re-plans.
- **DU-02.** "Release the lock in the engine finally path on every exit after acquisition" (`doctor-update-apply.yaml:126`) does not hold for signals.
- **DU-03.** No action routes the `--remote` that a copied tree needs.
- **DU-13.** Six field-level mismatches: the upstream status vocabulary, the unmapped `blocked` status, rollback's exit 1 on skipped paths, hub names against hub directories, apply's missing `--offline` and `--remote`, and `even` against `at-release`.
- **DU-12.** Generator follow-ups that no battery phase runs.
- **DU-14.** An `include_prerelease` mapping with no declared input in align and apply.
- **DU-19.** "Dry run writes nothing" next to a state-log write.
- **DU-22.** The router's claim that apply never writes generated files. Reclassification to `generated` covers only `local-only` and `conflict` (`release-update.cjs:703`), so a release change to an artifact the operator never regenerated is applied. That behaviour is correct, and the sentence at `update.md:66` is what is wrong.

## 7. FINDINGS: Q2 OPERATOR SCENARIOS AND TEST COVERAGE

Answer: the engine fails closed in most scenarios. Three break: interruption (DU-02), copied trees through the routed command (DU-03) and an explicit older release (DU-11). A partial decision set breaks silently (DU-01).

| Scenario | Engine behaviour | Test | Verdict |
|---|---|---|---|
| Vendored tree, no tags | Infers the base from the nearest release tree when a framework remote is reachable (`release-update.cjs:820-835`) | Only with explicit `--remote` (`release-update.test.cjs:541-574`, `1194-1202`) | Routed path broken (DU-03) |
| Offline | Upstream `unknown`, and `current` units become `unknown`, never up to date (`release-update.cjs:743-744`, `1098-1101`) | `release-update.test.cjs:427-431`, `603-617` | Holds. A tagless vendor offline is untested (folded into the DU-03 test) |
| Prereleases | Stable by default, opt-in, numeric order (`release-update.cjs:166-202`, `252-259`) | `release-update.test.cjs:362-375`, `391-399`, `576-586` | Holds in the engine. Align and apply cannot bind the flag (DU-14) |
| Renames | A deletion plus an addition joined by exact path (`release-update.cjs:1020-1057`) | None | Unedited renames work. Edited renames are unlinked (DU-17) |
| Deletions | An unedited deletion is `take-release`, an edited one a `deleted-in-release` conflict (`release-update.cjs:645-650`) | `release-update.test.cjs:588-601`, `985-1015` | Holds |
| Binary | NUL or invalid UTF-8 is binary and conflicts (`release-update.cjs:555-560`, `658-661`) | NUL case (`release-update.test.cjs:985-1015`) | Holds. Stricter than git (Eliminated Alternatives) |
| Generated files | Four patterns, class `generated`, generator named (`release-update.cjs:79-100`, `701-724`) | Leaf manifest and graph metadata (`release-update.test.cjs:503-539`) | Closed list with unlisted candidates, trigger-index untested (DU-16) |
| Partial apply, caught error | The error names the rollback command and the lock is released (`release-update.cjs:1898-1905`) | `release-update.test.cjs:1045-1071` | Holds |
| Interrupted apply | Lock stranded, rollback and re-apply refused | None | Breaks (DU-02) |
| Rollback | Restores matching paths, skips later edits, keeps modes and symlinks (`release-update.cjs:2039-2056`, `1811-1816`) | `release-update.test.cjs:895-925`, `1123-1136` | Holds. Exit 1 on a skip is undocumented (DU-13) |
| Older release named | A downgrade planned and applied as `update` | None | Breaks (DU-11) |
| Second release after a commit | Plans from the current check (`release-update.cjs:1554-1561`) | `release-update.test.cjs:927-943` | Holds |
| Partial decision set | Undecided release changes dropped, base advanced | None | Breaks silently (DU-01) |

Reconciliation: iteration 2's "vendored tree works when a remote is reachable" holds only for the raw engine with `--remote` or a framework `origin` (DU-03).

## 8. FINDINGS: Q3 THE SK-CREATE-COMMAND CONTRACT

Answer: the structure meets the contract. The safety semantics do not.

- **Thin router.** `update.md` uses the six canonical sections in order (`update.md:12`, `22`, `33`, `46`, `56`, `62`, against `sk-create-command/SKILL.md:341-350`) and carries no dashboard, prompt or result template. Confirmed.
- **Presentation split.** One leak: the first-run next step (DU-21).
- **argument-hint.** 139 characters, within the 140 limit (`update.md:3`, `sk-create-command/SKILL.md:217`). The canonical contract's hint omits `--include-prerelease` (DU-20). Adding `--remote` for DU-03 would pass 140, which only warns, and the rule asks the hint to summarize.
- **allowed-tools.** `Grep` and `Glob` are unused (DU-24).
- **Approval gates.** One startup approval plus one approval per repair (`doctor-update-apply.yaml:12`, `114-117`, `177`). The startup approval is not bound to what runs (DU-05).
- **Dry-run.** Present for align and apply (`update.md:37-38`) and absent for the read-only check, as the 048 research recommended. Apply's wording conflicts with its state-log write (DU-19).
- **Cancellation.** Recorded as `DECLINED` (DU-18).
- **Recovery design.** Rollback exists only inside an apply session (DU-10), and a stranded lock blocks it (DU-02).
- **Read-only claim.** Qualified in the check workflow and the router summary, unqualified at `update.md:16` and in the presentation (DU-23).

## 9. FINDINGS: Q4 CUSTOMIZATION HANDLING

Answer: sound for complete decision sets and a correct base, unsound for partial decision sets and a wrongly named base.

- **Base recording.** Record-base writes the release and a per-unit tree fingerprint (`release-update.cjs:1996-2001`). Apply records the release tree for each applied unit (`release-update.cjs:1728-1731`). The fingerprint covers paths, modes and blob ids (`release-update.cjs:432-443`). It guards against a moved tag, not against a wrongly named release (DU-04). A record without a tree is accepted (DU-25).
- **Three-way merge.** `git merge-file` when all three blobs are in the object store, a line merge otherwise (`release-update.cjs:858-877`). A conflict with no base gets a whole-file conflict proposal (`release-update.cjs:651-657`).
- **Hashes.** `decide` stores the proposal's sha256 (`release-update.cjs:1461-1470`), and apply re-hashes it and rejects conflict markers (`release-update.cjs:1518-1525`).
- **Align never writes skill bodies.** Confirmed (`release-update.cjs:1371-1382`) and asserted by the suite (`release-update.test.cjs:473-474`).
- **Apply applies only accepted decisions.** No. Undecided files lose their release change through the base advance (DU-01), and prefilled `adopt-release` records apply without a `decide` call (DU-15).
- **Silent overwrite of local content.** None found. Apply rechecks the local and release blobs of every path it writes or keeps local (`release-update.cjs:1644-1661`, `1762-1765`) and the HEAD-dirty state of every path it writes, before and under the lock (`release-update.cjs:1755-1760`, `1842`, `1877-1882`). Rollback skips paths edited after apply (`release-update.cjs:2045-2047`).
- **Decided runs.** A bare apply burns a decided run (DU-09).
- **Generated versus authored.** A change confined to a listed generated artifact never customizes a unit, and a `graph-metadata.json` edit outside `derived` stays authored (`release-update.cjs:701-724`, tested at `release-update.test.cjs:503-539`). The list itself is closed (DU-16).

Reconciliation: iteration 4 found no silent loss path in the routed apply and judged that the routed workflow closes the acceptance gate. Both hold for local content and for complete decision sets. A partial set, which align keeps on failure (`doctor-update-align.yaml:125`), loses release changes silently (DU-01, reproduced).

## 10. FINDINGS: Q5 THE OPERATOR JOURNEY END TO END

Answer: a cloned framework checkout can complete the journey, with one undocumented commit step. A copied tree cannot get past the first check through the routed command.

1. **Acquire.** The symlink model needs no sync step (`PUBLIC-RELEASE.md:76`). A copied tree has no documented way to name its upstream (DU-03).
2. **First check.** A copied tree gets a base-recording prompt (`doctor-update-presentation.txt:82-88`) whose answer is unchecked (DU-04) and which never clears (DU-08).
3. **Run directory.** Align and apply require the run root to be ignored, and in a copied tree it is not (DU-07).
4. **Apply, then align.** The second apply is refused until `base.json` is committed (DU-06). A bare apply after align burns the decided run (DU-09).
5. **Post-apply battery.** Hook installers run only when `followUps.reinstallHooks` is set (`doctor-update-apply.yaml:169-176`, `release-update.cjs:1948`). Runtime mirrors and the prompt syncs are always checked (`doctor-update-apply.yaml:153-168`). Generator follow-ups are not (DU-12).
6. **Rebuild.** The `/doctor:rebuild` prompt exists, and a skipped or failed rebuild warns (`doctor-update-apply.yaml:183-189`, `doctor-update-presentation.txt:265-282`). Iteration 5 ruled out a missing handoff, and the synthesis agrees.
7. **Recovery.** A caught failure names its rollback command. An interrupted apply strands the lock (DU-02). After the session there is no routed rollback (DU-10).
8. **Release notes.** The index is stale (DU-26), outside the engine's path.

## 11. RECOMMENDATIONS

Ranked P0, then P1, then P2, then by operator blast radius. No P0 was found. Planning notes:

- DU-03 exposes DU-07, DU-08 and DU-04 to more operators, so ship those four together.
- DU-01's completeness rule and DU-15's prefill policy change the same function (`prepareWrites`), so land them together.
- DU-10's routed rollback should carry DU-02's stale-lock recovery.
- One new contract test (proposed name `scripts/tests/doctor-update-contract.test.cjs`) that loads the router, the three workflows and the presentation can carry the proving checks for DU-13, DU-14 and DU-18 to DU-24.

A workable phase split: (A) engine integrity, DU-01, DU-15 and DU-02. (B) copied-tree journey, DU-03, DU-07, DU-08, DU-04 and DU-25. (C) approval and journey, DU-05, DU-06, DU-09, DU-10, DU-11 and DU-12. (D) contract hygiene and tests, DU-13, DU-14, DU-16 to DU-24 and DU-26.

### 1. DU-01 (P1). Partial decisions drop undecided release changes and advance the base

- **Defect.** For a customized, conflict or removed unit, `prepareWrites` marks the whole unit applied as soon as any one of its files has a decision (`release-update.cjs:1691-1718`). It then records the release tree as the base of every applied unit (`release-update.cjs:1728-1731`). An undecided file is not written, but its base now equals the release, so the next check classifies it `local-only` (`release-update.cjs:648`). The unit reads `local`, the quiet no-action status (`release-update.cjs:916`, `doctor-update-presentation.txt:49`). Align pre-fills nothing in a conflict unit, because it pre-fills only `customized` units (`release-update.cjs:1277-1279`). Align keeps a partial run on failure or interruption (`doctor-update-align.yaml:125`), and apply checks no completeness (`doctor-update-apply.yaml:96`). The damage persists: later releases merge against a base the file never had.
- **Status.** Confirmed. Reproduced by iteration 6, which decided only the take-release file and lost the conflict file's change. Reproduced and widened by synthesis probe A, which decided only the conflict file as `keep-local`. The take-release file `b.md` was never written, `base.json` recorded `skill:demo` at v1.1.0.0, and the re-check reported `b.md` as `local-only`, the unit `local` and the whole report `current`. No test covers it, since the decision test decides every planned file (`release-update.test.cjs:951-956`).
- **Fix.** In `prepareWrites`, for a non-update unit, require a decision for every planned file whose class is `take-release` or `conflict`, and exempt `same`, `generated`, `local-only` and `kept-local`. When any is missing, skip the unit with reason `undecided files` and the paths, and do not advance its base. Fill the align summary's existing slot for unresolved files (`doctor-update-presentation.txt:172`).
- **Proving test.** A fixture unit with `a.md` in conflict and `b.md` take-release. Decide only `a.md`, then apply. Assert the unit is skipped with reason `undecided files`, `base.json` has no record for it, and a re-check still reports it `conflict` with `b.md` as `take-release`. Repeat deciding only `b.md`.

### 2. DU-02 (P1). An interrupted apply strands the lock that rollback and re-apply need

- **Defect.** `acquireLock` creates `.skilled/release/.apply.lock` exclusively and writes the owner's `pid` and `startedAt` (`release-update.cjs:1775-1794`). Nothing reads the owner back: the only other uses are an existence refusal and the two acquisitions (`release-update.cjs:1834-1836`, `1875`, `2035`). The lock is removed only in `finally` (`release-update.cjs:1903-1905`, `2057-2059`), and the engine installs no signal handler, since its only process listener is for `stdout` errors (`release-update.cjs:2178`). Node runs no `finally` on SIGINT or SIGTERM, so an ordinary Ctrl-C or a tool-timeout kill strands the lock, as SIGKILL and power loss do. Afterwards `apply` refuses, including `--dry-run`, which checks the lock at `release-update.cjs:1834`, and so does `rollback`. The apply workflow forbids removing a pre-existing lock (`doctor-update-apply.yaml:98`, `101`, `129`, `131`), and its promise to release the lock "on every exit after acquisition" (`doctor-update-apply.yaml:126`) does not hold for signals. The rollback command is printed on a caught write error and when an applied run is applied again (`release-update.cjs:1899-1901`, `1830-1832`). A killed process prints nothing, so after a kill the operator must find the run directory alone. The lock path is not gitignored, because only `runs/` is (`.gitignore:256`), so a stranded lock shows as untracked and `git add -A` would commit it. A kill inside `writeAtomic` can also leave a `<target>.release-update-<pid>-<ms>` temp file that rollback does not know about (`release-update.cjs:1809-1821`).
- **Status.** Confirmed. Reproduced by iteration 6 with a signal probe, and by synthesis probe B on the real engine. A 2,000-file apply was sent SIGTERM as soon as `rollback.json` appeared. The lock survived with `{"pid":62280,...}`, 2 of the 2,000 files were at the release, `git status` showed `?? .skilled/release/.apply.lock`, and both `apply --dry-run` and `rollback --run <runDir>` exited 1 with `apply lock already exists: .skilled/release/.apply.lock`. A minimal Node probe skipped `finally` on SIGINT (exit 130) and SIGTERM (exit 143) in 3 of 3 runs each. The temp-file case was not reproduced, with 0 temp files in that run.
- **Likelihood note.** One measurement on one machine: that 2,000-file apply ran 144 s before it took the lock and held it at least 92 s before the first target write. The lock-held section runs `assertPlanFresh` and then two `git diff` spawns per written path (`release-update.cjs:1877-1882`, `1499-1506`). Inferred: a runtime that kills a tool call at a fixed timeout would interrupt such a run. The Claude Code Bash tool used for this synthesis defaults to 120 s, and `doctor-update-apply.yaml` gives phase 4 no timeout guidance.
- **Fix.** (1) On `EEXIST`, read the owner. If its pid is not alive (`process.kill(pid, 0)` raises `ESRCH`), report a stale lock with the owner and the newest run holding `rollback.json`, and accept an explicit, approved recovery such as an engine flag `--break-stale-lock`, routed per DU-10. (2) Install SIGINT, SIGTERM and SIGHUP handlers around the lock-held sections of apply and rollback that remove the lock and any temp file, then re-raise the signal. (3) Ship an ignore rule for `.apply.lock` with DU-07. (4) Add a presentation template for the stale-lock state that names the rollback command. (5) Narrow the window by checking all written paths with one `git status --porcelain -z` call instead of two spawns per path, and tell the executor in phase 4 to run the engine with a timeout above its expected duration. Signal handlers alone are not enough, because SIGKILL and power loss cannot be handled.
- **Proving test.** Spawn `apply` on a fixture, wait for the lock, send SIGTERM, and assert that the lock and temp files are gone and `rollback` succeeds. A second test writes a lock whose pid is dead and asserts that `apply` reports it stale, the recovery flag clears it, and `rollback` then restores the tree.

### 3. DU-03 (P1). Copied trees cannot name the framework upstream through the routed command

- **Defect.** The engine lists and fetches release tags from `--remote`, default `origin` (`release-update.cjs:2073`, `745`, `754`, `801`, `823`). The router and all three workflows expose no `--remote` (`update.md:3`, `36-38`, `doctor-update-check.yaml:34-40`, `doctor-update-align.yaml:33-38`, `doctor-update-apply.yaml:37-42`). In a copied tree, `origin` is the operator's own project or absent. When `origin` exists with no `vN.N.N.N` tags, `ls-remote` succeeds, so `upstream.error` is null (`release-update.cjs:394-406`, `771-773`) and the dashboard shows UNKNOWN with no reason. The presentation's record-base command omits `--remote` too (`doctor-update-presentation.txt:86`), and record-base must fetch the named tag when it is not local (`release-update.cjs:1978-1979`). Every vendored test passes `--remote` explicitly (`release-update.test.cjs:545`, `551`, `555`, `563`, `1197`, `1207`), so the routed path is untested. The deployment docs describe only the symlink model (`PUBLIC-RELEASE.md:3`, `21-28`, `76`), while the router promises a first run "after copying or installing `.skilled/`" (`update.md:68`). Iteration 5's documentation finding is merged here.
- **Status.** Confirmed. Reproduced by iteration 6 and by synthesis probe C. With `origin` set to an operator repository that has no tags, the routed check returned `upstream.status unknown` with `error null`, report status `unknown`, and `skill:hub-a` `blocked` with base `none`. The same tree with `--remote <framework>` returned `known`, `v1.1.0.0`, `updates-available` and `skill:hub-a` `update` with base `inferred`. `record-base --release v1.0.0.0` without `--remote` exited 1 with `release tag could not be resolved: v1.0.0.0`.
- **Fix.** Route `--remote=<name-or-url>` for check, align and apply. Better, persist the framework remote beside the base, for example as `upstream.remote` in `base.json` written by record-base, and use it as the default. Put it in the record-base template. When the remote answers with no release tags, set `upstream.error` to say so. Document the supported copied-tree path. Keep the argument hint within 140 characters by summarizing (`sk-create-command/SKILL.md:217`).
- **Proving test.** A vendored fixture whose `origin` has no framework tags. Assert that the routed flag or the persisted remote yields `update` with base `inferred`, that the template's record-base command succeeds, and that a check with neither reports `unknown` with a non-null `upstream.error`.

### 4. DU-04 (P1). record-base trusts the named release, and a wrong answer reports a behind tree as current

- **Defect.** `recordBase` fingerprints the named release's unit trees and writes them as the base without comparing them to the local tree (`release-update.cjs:1996-2001`), although check computes exactly that distance when it infers a base (`release-update.cjs:820-835`). A recorded base outranks inference (`release-update.cjs:797-810`). If the operator names a later release than the one installed, every file that later release changed reads `local-only` (`release-update.cjs:648`), the unit reads `local`, and the update never lands. The prompt asks for "the release this tree was installed from" and offers no way to check the answer (`doctor-update-presentation.txt:85-86`). The router says recording makes later checks compare "against a recorded base instead of an inferred one" (`update.md:68`). Here, following the prompt makes the result worse than the inference it replaces. Record-base also writes `base.json` without the apply lock (`release-update.cjs:2003`, against `1875`), a narrow race.
- **Status.** Confirmed. Reproduced by synthesis probe H, where iteration 6 had only an inference. On a vendored copy of v1.0.0.0, `record-base --release v1.1.0.0` and a commit made the next check report `skill:hub-a` as `local`, its file as `local-only`, its content still at the v1.0 line, and the whole report `current`. With the correct v1.0.0.0 base (probe G) the same unit reads `update`.
- **Fix.** In record-base, compute each unit's distance from the local tree to every candidate release, reusing the loop at `release-update.cjs:820-835`. When another release is strictly nearer than the named one, refuse and name the nearest release per unit, unless an explicit override is passed. Take the apply lock for the `base.json` write.
- **Proving test.** A vendored v1.0.0.0 copy. Assert that `record-base --release v1.1.0.0` exits 1 and names v1.0.0.0 as nearest for `skill:hub-a`, and that `record-base --release v1.0.0.0` succeeds.

### 5. DU-05 (P1). The startup approval is not bound to the plan apply executes

- **Defect.** The apply dry-run returns `ok`, `command`, `dryRun`, `withoutRun`, `writes`, `skippedUnits`, `appliedUnits` and `followUps`, and no `release` or `runDir` (`release-update.cjs:1860-1873`, `doctor-update-apply.yaml:54`). The plan template shows both (`doctor-update-presentation.txt:191-193`), and approval covers "the exact displayed plan" (`doctor-update-apply.yaml:115`). With no `--decisions` and no reusable run, the approved call re-plans from a fresh check (`release-update.cjs:1554-1561`, `1566-1568`), whose release is the upstream latest at that moment (`release-update.cjs:751`). The `changed_plan` rule covers only changes before approval is recorded (`doctor-update-apply.yaml:117`). The engine already refuses a `--release` that differs from a run's plan (`release-update.cjs:1827-1829`), but the workflow cannot pass the release because it never learns it. The canonical contract says apply "writes only the engine's displayed release plan after one startup approval" (`command-contract.json:244`). Scope: only the no-run path, since a `--decisions` run and a reused run are pinned to their plan's release. Local edits in the window are refused or skipped (`release-update.cjs:1644-1661`), not overwritten.
- **Status.** Confirmed. Reproduced by iteration 6 (the dry-run keys) and by synthesis probe D. The dry-run planned `hub-a` at v1.1.0.0. A v1.2.0.0 tag was then published, and the same apply call exited 0 with `release v1.2.0.0` and the v1.2 content in `hub-a`. A first probe run, with the operator already at v1.1.0.0, showed the write set growing as well: the displayed plan had no `hub-a` write, and the real apply wrote `hub-a` at v1.2.
- **Fix.** Have the dry-run return `release`, `releaseCommit`, the run directory it would create and a `planDigest`, a sha256 over the sorted writes with their before and after states, the applied and skipped units and the release. Have the workflow pass `--release <release>` and the digest to the real apply. Have the engine recompute the digest and refuse a mismatch with a message to rerun the dry-run.
- **Proving test.** Dry-run, publish a newer tag, then apply with the dry-run's release and digest. Assert that the approved release is written. Then change a planned file and assert that the digest mismatch is refused.

### 6. DU-06 (P2). A second apply is refused until base.json is committed, and nothing says to commit

- **Defect.** Apply always writes `base.json`, plus `divergence.json` once it exists, and runs its HEAD-dirty check over those ledgers along with the planned files (`release-update.cjs:1733-1760`, `1499-1506`). The documented journey applies update and new units first, then aligns the customized ones (`doctor-update-presentation.txt:68-79`, `doctor-update-align.yaml:130-131`). Neither the apply workflow nor the apply result template mentions committing (`doctor-update-presentation.txt:310-322`). The tests commit between applies (`release-update.test.cjs:932`, `979`), which hides the gap. It fails closed with a clear error.
- **Status.** Confirmed. Reproduced by iteration 6 and synthesis probe E: a bare apply exited 0, then align, decide and `apply --decisions` exited 1 with `target has staged or unstaged changes against HEAD: .skilled/release/base.json`.
- **Fix.** Add a commit step to the apply result template and the align handoff ("commit the applied files and `.skilled/release/base.json` before the next apply"), and name it in the engine's error. Letting apply accept its own uncommitted ledgers is possible, but it would need `before` recorded from the worktree instead of HEAD (`release-update.cjs:1761`). Otherwise a later rollback would also undo the earlier apply's base records.
- **Proving test.** A contract assertion that the apply result template contains the commit instruction, plus an engine test that the refusal names `base.json` and the commit remedy.

### 7. DU-07 (P2). Copied trees lack the run-root ignore rule the align and apply preflights require

- **Defect.** Align requires `git check-ignore` to match its run directory (`doctor-update-align.yaml:29`, `68`, `87`), and apply requires its run artifacts and state log to be gitignored (`doctor-update-apply.yaml:74`, `99`). The only rule lives in the framework repository's root `.gitignore:256`. There is no `.skilled/.gitignore`, so a copied `.skilled/` tree does not carry the rule, and no doc tells the operator to add it. Once DU-03 is fixed, this is the next wall on the copied-tree journey.
- **Status.** Confirmed for the layout. In synthesis probe C, `git check-ignore` matched with the root rule and did not without it. The routed refusal is inferred from the workflow text, which an executor follows.
- **Fix.** Ship the rule with the tree as a tracked `.skilled/release/.gitignore` listing `runs/` and `.apply.lock`, together with DU-08's exclusion of that directory from units. Otherwise make the preflight failure template print the exact line to add.
- **Proving test.** A vendored fixture with no root `.gitignore`. Assert that `git check-ignore` matches `.skilled/release/runs/x` and `.skilled/release/.apply.lock` after the tree is copied.

### 8. DU-08 (P2). The base-recording prompt never clears on a copied tree

- **Defect.** Every top-level `.skilled/` directory becomes a `directory` unit (`release-update.cjs:535`), including the engine's own `.skilled/release/` once `base.json` is committed. Check asks for base recording whenever any unit's base is `inferred` or `none` (`release-update.cjs:1102-1111`). Record-base records only units present in the named release (`release-update.cjs:1980-1981`), so it can never record `directory:release` or a unit new in the target release. The test asserts the new-unit case as expected (`release-update.test.cjs:569`). Following the prompt's "Commit that file, then run /doctor:update again" (`doctor-update-presentation.txt:82-88`) therefore never satisfies it.
- **Status.** Confirmed. Reproduced by iteration 6 and synthesis probe G. After `record-base --release v1.0.0.0` and a commit, `baseRecording.needed` was true with units `skill:hub-d` and `directory:release`, the latter with status `local` and base `inferred`.
- **Fix.** Skip `.skilled/release/` in `enumerateUnits`. Leave units with no local files, which are new in the target release, out of `baseRecording`, or report them separately as new.
- **Proving test.** The probe G sequence, asserting that `baseRecording.needed` is false after record-base and a commit.

### 9. DU-09 (P2). A bare apply after align consumes the run and discards its decisions

- **Defect.** With no `--decisions`, apply reuses the newest run made at HEAD that has no `rollback.json`, but empties its decisions (`release-update.cjs:1545`, `1566-1571`). It writes `rollback.json` into that run (`release-update.cjs:1889`), and the run is "already applied" from then on (`release-update.cjs:1830-1832`). The workflow documents dropping decisions (`doctor-update-apply.yaml:46`), but no prompt warns that this burns a decided run. The reuse rule checks only HEAD and the absence of `rollback.json`, so a run aligned for an older release would be reused after a newer tag appears (inferred from `release-update.cjs:1545`), and the dry-run cannot show which release (DU-05). The rollback test relies on the reuse without saying so (`release-update.test.cjs:898-903`).
- **Status.** Confirmed. Reproduced by iteration 6 and synthesis probe F. The bare apply ran in the align run directory and skipped `skill:hub-b/child-c` with reason `no decisions`, and `apply --decisions` on that run then exited 1 with `this run was already applied (rollback.json exists)`. The older-release reuse is inferred, not reproduced.
- **Fix.** When the reusable run holds any operator decision, meaning a record without `source: 'prefilled'`, refuse a bare apply and name the `--decisions` path, or show those decisions and apply them. Report the reused run's release in the dry-run, with DU-05.
- **Proving test.** Align, decide one file, then run a bare apply. Assert that it refuses or applies the decision, and that the decided run stays applicable.

### 10. DU-10 (P2). Rollback and record-base have no route

- **Defect.** The router accepts only `check`, `align` and `apply` (`update.md:35`, `doctor-update-presentation.txt:10-11`). Rollback is reachable only inside the apply battery or its failure path (`doctor-update-apply.yaml:131`, `177-181`). After the session ends, or after an interruption, the operator is pointed at a raw engine command (`release-update.cjs:1899-1901`) with no approval prompt, path validator or state log. Record-base is a raw command too (`doctor-update-presentation.txt:86`). sk-create-command asks destructive commands for recovery guidance (`sk-create-command/SKILL.md:378`).
- **Status.** Confirmed.
- **Fix.** Add routed `rollback` and `record-base` actions, each with an approval gate, the canonical path validator and a state log. Give rollback DU-02's stale-lock recovery. Register both in `command-contract.json`.
- **Proving test.** `route-validate.sh` plus a router contract check that every engine write command has a routed action with an approval gate, alongside the existing engine rollback tests.

### 11. DU-11 (P2). An explicit older --release plans and applies a downgrade labelled update

- **Defect.** With base B newer than release R and local content equal to B, every changed file is `take-release` (`release-update.cjs:647`) and the unit is `update` (`release-update.cjs:919`). Nothing compares the release with a unit's base release before planning (`release-update.cjs:797-837`, `907-921`), so a bare apply writes it.
- **Status.** Confirmed. Reproduced by synthesis probe I, where iteration 6 had only an inference. After applying v1.1.0.0 and committing, `check --release v1.0.0.0` reported `skill:hub-a` as `update` with base v1.1.0.0 and its file as `take-release`. `apply --release v1.0.0.0` exited 0 and restored the v1.0 content. `skill:hub-d` read `removed` and was skipped.
- **Fix.** Compare the release with each unit's `baseRelease` using `compareVersions` (`release-update.cjs:166-180`). Report `downgrade` when the release is older, and skip such units unless an explicit, approval-gated downgrade flag is passed.
- **Proving test.** The probe I sequence, asserting that `skill:hub-a` reads `downgrade` and that a plain apply leaves it unwritten.

### 12. DU-12 (P2). Generator follow-ups are displayed but never acted on

- **Defect.** `followUps.regenerate` is a declared follow-up field (`doctor-update-apply.yaml:56`), shown in the plan as "generated files and their generators" (`doctor-update-presentation.txt:201`). No battery step runs or checks the trigger-index generator (`release-update.cjs:78`, `doctor-update-apply.yaml:133-176`). The leaf-manifest step keys on `regenerateHubs`, which only child-skill writes set (`release-update.cjs:1944-1947`), not on `followUps.regenerate`. The trigger index refreshes only if the operator accepts the optional rebuild (`doctor-rebuild.yaml:170`, `doctor-update-apply.yaml:183-189`). Confirmed.
- **Fix.** Add a battery step that walks `followUps.regenerate` and runs each named generator in its check mode, with its write mode as the approved repair.
- **Proving test.** An engine test where an applied unit holds a locally regenerated trigger-index artifact, asserting that `followUps.regenerate` names `generate-trigger-index.mjs`. This also closes DU-16's test gap. Add a contract check that every generator constant at `release-update.cjs:76-78` has a battery step.

### 13. DU-13 (P2). Field-level drift between the workflows, the presentation and the engine

- **Defect.** Six items, all Confirmed:
  - `upstream_status: available|unknown|offline` (`doctor-update-check.yaml:79`) against the engine's `known` or `unknown`, with offline only as the error string `offline mode` (`release-update.cjs:744`, `771`).
  - The report status `blocked` has no terminal mapping (`doctor-update-check.yaml:148-151`, `release-update.cjs:1092-1097`). `unknown` is mapped (`doctor-update-check.yaml:120`).
  - Rollback exits 1 with `ok: false` when it skips a path (`release-update.cjs:2060`, `2188`). The rollback steps handle skipped paths through `git restore` (`doctor-update-apply.yaml:180`) but never say that this case arrives as exit 1 with `ok: false`, so an executor that reads the exit code first can report a failed rollback.
  - `regenerateHubs` holds hub names (`release-update.cjs:1946`), while the battery command takes a hub directory (`doctor-update-apply.yaml:137-138`, `generate-leaf-manifest.cjs:12-15`).
  - Apply cannot pass `--offline` or `--remote` (`update.md:38`), although the engine accepts both (`release-update.cjs:51-54`) and a no-run apply does network work through its fresh check.
  - New in this synthesis: the dashboard's position word `even` (`doctor-update-presentation.txt:44`) against the engine's `at-release` (`release-update.cjs:841`).
- **Fix.** Use the engine's vocabulary in the check state schema and the dashboard. Map `blocked` to `STATUS=UNKNOWN` with the blocked units named. State that rollback's exit 1 with skipped paths is the partial path. Emit hub directories or document the mapping. Route `--offline`, and DU-03's `--remote`, for apply.
- **Proving test.** The contract test, comparing the YAML enums and presentation placeholders with the values the engine emits on fixtures.

### 14. DU-14 (P2). Align and apply map --include-prerelease without declaring the input

- **Defect.** The router accepts the flag for both actions (`update.md:37-38`), and both engine commands include it (`doctor-update-align.yaml:53`, `93`, `doctor-update-apply.yaml:51-52`, `105`, `121`). Neither `user_inputs` block declares it (`doctor-update-align.yaml:33-38`, `doctor-update-apply.yaml:37-42`), while check does (`doctor-update-check.yaml:40`). The router binds only declared inputs (`update.md:50`), so a strict executor drops the flag and plans against the stable release. Confirmed.
- **Fix.** Declare `include_prerelease` with a default in both input blocks.
- **Proving test.** The contract test, asserting that every flag the router accepts for an action has a declared input in that action's YAML.

### 15. DU-15 (P2). Prefilled adopt-release decisions apply without a decide call

- **Defect.** Align pre-fills `adopt-release` for the take-release files of customized units (`release-update.cjs:1277-1279`), and `apply --decisions` consumes those records with no operator decision (`release-update.cjs:1691-1703`). The suite asserts this behaviour (`release-update.test.cjs:832-838`). The routed workflow requires a `decide` call for every file (`doctor-update-align.yaml:123`), so the engine alone does not enforce acceptance. Confirmed, and reproduced by the passing suite. Iteration 4 reported it and iteration 6 widened it into DU-01.
- **Fix.** Decide the policy first (Section 12). If a prefill is not consent, treat records with `source: 'prefilled'` as undecided in DU-01's completeness rule. A real `decide` call already writes a record without `source` (`release-update.cjs:1472`).
- **Proving test.** Align on a customized unit and apply the untouched `decisions.json`. Assert that the unit is skipped as undecided, then decide `adopt-release` and assert that it applies. Update `release-update.test.cjs:832-838` to match.

### 16. DU-16 (P2). The generated-artifact inventory is a closed list with unlisted candidates

- **Defect.** Four patterns define generated files (`release-update.cjs:79-100`). Anything else a generator rewrites counts as an authored edit, so it can make a unit `customized` or a file a conflict that the operator must decide on machine output. Phase 002 built the list by walking the writers and recorded `graph-metadata.json` as the one hybrid file (`002-release-update-customization-signals/implementation-summary.md:58`, `88`). The synthesis found two candidates it missed. `generate-router-intent-signals.cjs` writes the top-level `intent_signals` key of a hub's `graph-metadata.json` (`generate-router-intent-signals.cjs:55`, `66-67`), outside the `derived` block that the engine treats as generated (`release-update.cjs:701-724`). It appends to the authored list and keeps its order (`generate-router-intent-signals.cjs:64-66`), so that key mixes authored and generated entries. Fourteen tracked compiled-routing activation files (`manifest.json` and `fence-state.json` under `.skilled/bin/lib/compiled-routing/013-live-activation/activation/`) match no pattern. No test touches the trigger-index patterns (grep of `release-update.test.cjs`). Confirmed for the closed list and the test gap. Whether operators regenerate the two candidates in place is inferred, and a probe of a real operator tree would settle it.
- **Fix.** Decide per candidate whether it is generated. Add patterns where it is, or a list of generator-owned keys for `graph-metadata.json` that includes `intent_signals`.
- **Proving test.** A fixture where the operator regenerates a trigger-index artifact and appends an intent signal, asserting that both read `generated` and the unit stays `update`.

### 17. DU-17 (P2). Renames are a delete plus an add, unlinked in the evidence, with no test

- **Defect.** The report joins base, local and release entries by exact path (`release-update.cjs:1020-1057`), so a rename inside a unit is a deletion plus an addition. A locally edited renamed file becomes a `deleted-in-release` conflict plus a `take-release` addition that no evidence card links. Combined with DU-01, deciding only the conflict drops the addition. No test renames a file (grep of `release-update.test.cjs`). Confirmed.
- **Fix.** Pair a deleted path with an added path in the same unit when the release blob of one equals the base blob of the other, or passes a similarity threshold, and show the pair as one rename card.
- **Proving test.** Fixtures for an unedited rename, where both paths apply in an `update` unit, and an edited rename, which shows one rename card and moves local edits only on an explicit decision.

### 18. DU-18 (P2). Cancellation is recorded as DECLINED

- **Defect.** `doctor-update-presentation.txt:212` maps no, cancellation, ambiguity and interruption alike to `STATUS=DECLINED`, and `doctor-update-apply.yaml:89` and `197-203` have no cancelled status. sk-create-command requires `STATUS=CANCELLED ACTION=cancelled` when the user aborts (`sk-create-command/SKILL.md:379`), and the contract lists update apply as a gated destructive operation (`command-contract.json:244`). Confirmed.
- **Fix.** Keep `DECLINED` for an explicit no. Add `CANCELLED` with `ACTION=cancelled` for cancellation and interruption, in the presentation, the state schema and the terminal statuses.
- **Proving test.** The contract test, asserting that `STATUS=CANCELLED` appears in the apply terminal statuses and the presentation.

### 19. DU-19 (P2). Apply says its dry-run writes nothing, then writes a state log

- **Defect.** `dry_run_writes_nothing: true` (`doctor-update-apply.yaml:33`) sits beside a state log written on dry-run (`doctor-update-apply.yaml:111`, `195`). The engine call itself writes nothing (`doctor-update-apply.yaml:106`, confirmed at `release-update.cjs:1860-1873`). Align writes no log on dry-run (`doctor-update-align.yaml:72`, `136-138`), so the two workflows disagree. Confirmed.
- **Fix.** Rename the key to say that the dry-run writes no release file, lock or rollback record, or drop the dry-run log to match align.
- **Proving test.** The contract test, asserting that both workflows state the same dry-run write rule.

### 20. DU-20 (P2). The canonical argument hint omits --include-prerelease

- **Defect.** `command-contract.json:203` lacks the flag that `update.md:3` carries. The router hint is 139 characters, within `sk-create-command/SKILL.md:217`. Confirmed.
- **Fix.** Sync the hint. When DU-03 adds `--remote`, summarize the flags instead of listing them, as `SKILL.md:217` directs.
- **Proving test.** A contract assertion that `update.md:3` and `command-contract.json:203` carry the same hint. `generate-command-routers.cjs --check` (`sk-create-command/SKILL.md:365`) may already compare them, which this synthesis did not verify.

### 21. DU-21 (P2). The router carries next-step wording the presentation owns

- **Defect.** `update.md:68` tells the operator to run record-base and commit `base.json`, wording the presentation owns (`doctor-update-presentation.txt:82-88`). sk-create-command forbids next-step wording in a router that has a presentation asset (`sk-create-command/SKILL.md:354`). Confirmed.
- **Fix.** Replace the paragraph with a pointer to the presentation's base-recording template.
- **Proving test.** A contract assertion that `update.md` contains no `record-base` invocation or commit instruction.

### 22. DU-22 (P2). The router overstates that apply never writes generated files

- **Defect.** `update.md:66` says apply "names their generators instead of writing them". Reclassification to `generated` applies only to `local-only` and `conflict` files (`release-update.cjs:703`), so a release change to an artifact the operator never regenerated stays `take-release`, and apply writes the release bytes. The behaviour is correct, and the sentence is what is wrong. Confirmed.
- **Fix.** Reword it: a locally regenerated artifact never counts as a customization and apply names its generator, while a release change to an unregenerated artifact is applied like any other file.
- **Proving test.** An engine test asserting that a release change to an unregenerated leaf manifest appears in the apply dry-run writes, which pins the behaviour the corrected sentence states.

### 23. DU-23 (P2). Read-only check wording omits the fetch exception in two places

- **Defect.** `update.md:16` calls check read-only, and the presentation lists `--offline` without saying that a normal check may fetch release objects (`doctor-update-presentation.txt:23-31`). The check workflow discloses the fetch (`doctor-update-check.yaml:16-24`), and the router summary qualifies it as "without changing checkout files" (`update.md:64`). Confirmed.
- **Fix.** Say "read-only for the checkout" at `update.md:16`, and add one presentation line about the object-store fetch and `--offline`.
- **Proving test.** The contract test, asserting that the presentation mentions the fetch exception next to `--offline`.

### 24. DU-24 (P2). Grep and Glob are granted but unused

- **Defect.** `update.md:4` grants `Read, Bash, Grep, Glob`. Neither Grep nor Glob appears in the router, the three workflows or the presentation (synthesis grep). sk-create-command asks for only the tools a command uses (`sk-create-command/SKILL.md:218-219`). Confirmed, low impact.
- **Fix.** `allowed-tools: Read, Bash`.
- **Proving test.** The contract test, asserting that each granted tool is used by the router or a workflow.

### 25. DU-25 (P2). A base record without a tree fingerprint is accepted as recorded

- **Defect.** `baseForUnit` accepts a record when its tag resolves and it has no `tree` (`release-update.cjs:806`), and check asks for base recording only for `inferred` or `none` (`release-update.cjs:1102-1104`). Every current writer records a tree (`release-update.cjs:1730`, `1997-2000`), so only a hand-edited or pre-fingerprint `base.json` is exposed, and then only to a moved tag. Confirmed code path. Practical impact inferred.
- **Fix.** Report such a record as `recorded-unverified` and list it in `baseRecording`.
- **Proving test.** A `base.json` record with no `tree`, asserting that its unit appears in `baseRecording.units`.

### 26. DU-26 (P2, outside the update surface). The release-note index is stale

- **Defect.** `.skilled/changelog/skilled/README.md:23-25` lists current entries through v4.0.0.2 and calls v4.0.0.2 the upcoming release, while `v4.0.0.3.md` exists. The engine identifies releases from git tags only (`release-update.cjs:389-392`), so this affects operators reading release notes, not the update itself. Confirmed.
- **Fix.** Refresh the index when v4.0.0.3 ships. The changelog workflow owns it.
- **Proving test.** An index check that lists every top-level `vN.N.N.N.md` entry.

## ELIMINATED ALTERNATIVES

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat local edits between dry-run and approval as an overwrite risk | Apply rechecks the blobs and HEAD-dirty state of every path it writes under the lock, and a no-run re-plan reclassifies an edited file and skips its unit | `release-update.cjs:1644-1661`, `1755-1760`, `1877-1882` | 6, synthesis |
| Expect a tracked `.skilled/release/` to collide with apply's ledger writes | Nothing under `.skilled/release/` is tracked in the framework repository, and `runs/` is ignored | `git ls-files .skilled/release` (empty), `.gitignore:256` | 6, synthesis |
| Expect an offline downgrade through a stale local tag | An unresolvable recorded base falls back to ancestry, so newer local content reads `local-only` | `release-update.cjs:797-819` | 6 |
| Add a post-apply rebuild handoff | It exists. Apply phase 6 prompts for `/doctor:rebuild` and records `rebuilt`, `skipped` or `failed` with a stale-index warning | `doctor-update-apply.yaml:183-189`, `doctor-update-presentation.txt:265-282` | 5 |
| Treat valid-UTF-8, NUL-free content as binary | Git treats it as text, and the engine is already stricter than git | `release-update.cjs:555-560`, synthesis `git diff --no-index --numstat` check | 2, synthesis |
| Use the changelog index to identify releases | The engine identifies releases from git tags only | `release-update.cjs:389-392` | 5, 6 |
| Rely on the routed workflow alone for per-file acceptance | A partial decision set reaches apply and loses release changes | DU-01, `doctor-update-align.yaml:125`, `doctor-update-apply.yaml:96` | 4 (claim), refuted by 6 and synthesis |
| Fix the stale lock with signal handlers alone | SIGKILL and power loss cannot be handled, so owner validation is the part that cannot be skipped | `release-update.cjs:1775-1794`, synthesis probe B | synthesis |
| Widen the generated list for `mode-registry.json` and skill `description.json` | Both are inputs or authored files, not generator output, as phase 002 also found | `generate-leaf-manifest.cjs:348-352`, `ci-skill-root-metadata.cjs:170`, `002-release-update-customization-signals/implementation-summary.md:88` | synthesis |

## DIVERGENCE MAP

- **Saturated directions:** none recorded. The registry's `divergence` block is empty.
- **Pivots taken:** none. Convergence mode was `default` and no divergent pivot ran.
- **Pivot failures and audited overrides:** none.
- **Remaining frontier:** the open questions in Section 12, chiefly the lock window at real release sizes, the temp-file case, tag-namespace collision in copied trees, the prefill consent policy and whether copied trees are a supported deployment model.
- **Breadth note:** iterations 1 to 5 each held one key question in parallel, and none built on another. Iteration 6 was the only pass across questions, and this synthesis added its own probes. Stopping at the iteration cap says nothing about convergence. Four of the defects (DU-01, DU-05, DU-06, DU-09) live in sequences of two actions that no test runs, which suggests more may remain in untested sequences.

## 12. OPEN QUESTIONS

- **Lock window at real release sizes.** There is one measurement on one machine: 2,000 files, 144 s before the lock and at least 92 s held before the first write. Timing `apply --dry-run` and `apply` on a real release delta would settle how often a runtime timeout lands inside the window (DU-02).
- **Temp-file stranding.** The `writeAtomic` temp file (`release-update.cjs:1809-1821`) was not reproduced. A kill during the write loop with large files would settle it.
- **Tag-namespace collision in copied trees (inferred, not reproduced).** The engine reads every `vN.N.N.N` tag of the repository and its remote as a framework release (`release-update.cjs:389-392`, `394-406`, `751`), and takes the newest such tag in HEAD's ancestry as a base (`release-update.cjs:760-766`). A copied tree whose own project uses four-part tags would compare against its own history. A fixture with an operator tag would settle it, and DU-03's fix should account for it.
- **Prefill consent policy.** The suite asserts that a prefilled `adopt-release` is applied (`release-update.test.cjs:822-839`), while the workflow requires an explicit `decide` for every file (`doctor-update-align.yaml:123`). The policy must be chosen before DU-01's completeness rule is coded (DU-15).
- **Copied-tree support.** `PUBLIC-RELEASE.md` describes only the symlink model, while `update.md:68` addresses copied trees. The answer sets the priority of DU-03, DU-04, DU-07 and DU-08.
- **Generated candidates.** Whether `intent_signals` and the compiled-routing activation files are regenerated in operator trees (DU-16).
- **Run record.** The `dispatch_failure` event for iteration 6's refused cli-claude-code attempt is not in the packet's state log, either ledger, the telemetry log or the lock grant journal. Whether the workflow writes that event elsewhere is unknown.

## 13. REFERENCES

Iteration narratives: `research/iterations/iteration-001.md` through `iteration-006.md`. Structured deltas: `research/deltas/iter-001.jsonl` through `iter-006.jsonl`. Dispatch receipts: `research/dispatch-receipts/dispatch-research-i1-g1.*.json` through `dispatch-research-i5-g1.*.json`. Run state: `research/deep-research-config.json`, `deep-research-state.jsonl`, `deep-research-strategy.md`, `deep-research-dashboard.md`, `findings-registry.json`, `deep-research-ledger/frames/`, `deep-research-audit-ledger/frames/`, `observability-events.jsonl` and `locks-and-fencing-v1/`. No packet-level resource map is cited, because `resource_map_present` was false at init.

Main repository sources: `.skilled/commands/doctor/update.md`, `.skilled/commands/doctor/assets/doctor-update-check.yaml`, `doctor-update-align.yaml`, `doctor-update-apply.yaml`, `doctor-update-presentation.txt`, `doctor-rebuild.yaml`, `.skilled/commands/doctor/scripts/release-update.cjs`, `.skilled/commands/doctor/scripts/tests/release-update.test.cjs`, `.skilled/skills/sk-doc/sk-create-command/SKILL.md`, `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json`, `.skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs`, `generate-router-intent-signals.cjs`, `ci-skill-root-metadata.cjs`, `PUBLIC-RELEASE.md`, `.skilled/changelog/skilled/README.md` and `.gitignore`. Prior design research: `specs/system-speckit/048-doctor-command-audit/003-update/research/research.md`.

## 14. SOURCES CONSULTED (aggregate)

- **Research inputs:** all six iteration narratives, all six delta files, the findings registry, strategy, dashboard, config, resource map, state log, dispatch receipts, the iteration 6 prompt pack, the nine frames of each ledger (decoded), the telemetry log and the lock grant journal.
- **Repository reads:** the surface files and contracts in Section 13, plus the synthesis phase of `.skilled/commands/deep/assets/deep-research-auto.yaml` and `.skilled/skills/system-spec-kit/runtime/cli/validation/unactioned-recorded-failure-audit.mjs`.
- **Commands:** `node --test .skilled/commands/doctor/scripts/tests/release-update.test.cjs` (56 pass, 0 fail, exit 0, 176 s), `git ls-files`, `git check-ignore`, `git diff --no-index --numstat`, `rg` and `grep` searches.
- **Synthesis probes,** driving the real engine in throwaway repositories under the session scratchpad:
  - A: partial decisions in a conflict unit.
  - B: SIGTERM during a real 2,000-file apply.
  - C: a vendored tree checked through the routed flags and with `--remote`, record-base without `--remote`, and the run-root ignore rule.
  - D: dry-run keys, and a newer tag published between dry-run and apply.
  - E: a second apply without a commit.
  - F: a bare apply after align.
  - G: record-base with the right release, then a commit.
  - H: record-base with a wrong, later release.
  - I: an explicit older release.
  - A Node signal probe, three runs per signal with start markers.
  - A comparison of git's binary test with the engine's.
- **Registry totals:** 49 key findings, 4 ruled-out rows (one a reducer artifact) and 5 of 5 questions resolved.

## 15. RESOURCE MAP

`resource_map_present` was false at init (`deep-research-config.json`), so no packet-level map existed. The workflow generated `research/resource-map.md` at the synthesis step (2026-10-03T19:48:30Z) from the iteration deltas. It lists 17 references: 3 READMEs, 2 documents, 10 command files and 2 skill files. Two are marked MISSING, which are iteration 1's `assets/workflows/` citations of files that live directly under `assets/`. It omits files that only this synthesis read: `generate-leaf-manifest.cjs`, `generate-router-intent-signals.cjs`, `ci-skill-root-metadata.cjs`, `.gitignore` and `deep-research-auto.yaml`.

## 16. CONVERGENCE REPORT

- Stop reason: maxIterationsReached
- Total iterations: 6
- Questions answered: 5 / 5
- Remaining questions: 0
- Last 3 iteration summaries: run 3: Q3 only, the router and presentation against the sk-create-command contract and the three workflows (0.46), run 4: Q4 only, customization handling end to end in the engine and the align and apply workflows (0.66), run 6: independent cross-check of iterations 1 to 5 that re-verified the P0, P1 and strongest P2 findings and settled Q1 (0.62). These are the latest three records in the state log. The state-log rows carry no focus field, so the focus text comes from the dashboard's iteration table (`deep-research-dashboard.md:32-39`). The parallel batch completed in the order 1, 2, 5, 3, 4, 6, so by iteration number the last three are 4 (0.66), 5 (0.68) and 6 (0.62).
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded
- newInfoRatio by iteration: 0.68, 0.70, 0.46, 0.66, 0.68, 0.62. Under the max-iterations policy the threshold was telemetry only. Iterations 1 to 5 were each measured against the same starting state, so their ratios are not a trend.
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 17. APPENDIX: EXECUTION LOG

| Iteration | Executor | Model | Effort | Duration | Focus | newInfoRatio |
|---|---|---|---|---|---|---|
| 1 | cli-codex, parallel batch | gpt-6-luna | max, fast tier | 9 min 23 s | Router, presentation and workflows against engine flags, apply and rollback. Meant for Q1, recorded Q3 answered | 0.68 |
| 2 | cli-codex, parallel batch | gpt-6-luna | max, fast tier | 9 min 18 s | Q2 operator scenarios and test coverage | 0.70 |
| 3 | cli-codex, parallel batch | gpt-6-luna | max, fast tier | 10 min 45 s | Q3 sk-create-command contract | 0.46 |
| 4 | cli-codex, parallel batch | gpt-6-luna | max, fast tier | 12 min 25 s | Q4 customization handling | 0.66 |
| 5 | cli-codex, parallel batch | gpt-6-luna | max, fast tier | 10 min 05 s | Q5 operator journey | 0.68 |
| 6 | native subagent `opus-xhigh`, after a refused cli-claude-code attempt | claude-opus-5-5 | xhigh | 13 min 37 s | Independent cross-check of 1 to 5, Q1 settled | 0.62 |

Durations for iterations 1 to 5 are the dispatch-receipt window from intent to completion. Iteration 6's is the `durationMs` of 817,400 in its delta. By these windows, iterations 3 to 6 ran past the 10-minute per-iteration budget in the config. The synthesis was written by a separate Claude Opus 5.5 leaf that ran none of the six iterations.

<!-- /ANCHOR:deep-research-doctor-update-perfection -->
