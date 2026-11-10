# Iteration 2: Process errors (c) to (e) and the generated-artifact drift family (f)

## Focus

Continue Part 1: the reviewer wildcard `rm` that deleted scratch helpers (c), the regenerated scratch tree that got committed (d), and the claims made before verification (e); then open the generated-artifact re-mint family (f) with its inventory and producer mechanism. Drawn from the round-one to round-four child records, the round parent logs, and the git history of the epic's worktree branch.

## Actions Taken

1. Read the round-four parent log, all eleven round-four child logs, the round-two and round-three parent logs, and the child implementation summaries' Known Limitations.
2. Searched all packet records for delete, `rm`, scratch-commit, before-state and claim language; inspected the scratch trees that the epic's commits added.
3. Read the generated-artifact writers and checks: `sync-skills-hermes.cjs` and sibling sync scripts' role, `compiled-route-guard.cjs`, leaf-manifest freshness, and the trigger-index rebuild commits.
4. Read the merge commit `144b1d339e` body and the two competing v2.7.1.0/v2.7.2.0 changelogs for process error (g).

## Findings

1. **Process error (c) is a namespace collision, not a rogue reviewer: disposable run outputs and planner helpers share one `scratch/` directory, so a wildcard cleanup cannot tell them apart.** The executors' safety layers refuse `rm -rf` where they are configured (the cli-codex run in round one stopped at T003 because "the command runner refuses `rm -rf`"), and every later build brief carries an explicit do-not-delete rule aimed at exactly this ("Do not delete any temporary tree with `rm -rf`"; "Do not edit or delete anything under `$F/scratch/` except the outputs you write"; "`$F/scratch/canary-assert.cjs` is the read-only canary assertion. Do not delete it"). The incident itself is not recorded in the packet; the mechanism is the shared namespace plus a cleanup that runs under a host without the refusal guard. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix/implementation-summary.md:71] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate/tasks.md:39] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/build_tasks.py:116] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/tasks.md:31] — **CONFIRMED** for the guards and the convention; **INFERRED** for the incident mapping. **P2**. **Smallest fix**: none in code — keep planner tools under a `tools/` child of scratch (or the existing `plan-`/`probe-` prefixes) and make the cleanup rule target only `scratch/out/`; that is a brief convention, not a new tool.

2. **Process error (d) matches an observable artifact: the packet commits scratch as evidence, and three regenerations of one unit tree were committed in a single commit with their generators.** Commit `ceb8ff216c` added `010-round-three-remediation/001-shared-and-hub-docs/scratch/units/` (195 files), `units-extra/` (32) and `units-extra2/` (8) together with `gen_units.py`, `gen_extra.py` and `gen_extra2.py`; the extras are regenerations of the first tree. Under the packet's evidence-keeping convention a regenerated tree is committed like any other output, and nothing marks which generation is authoritative. The incident itself is **UNKNOWN** in the records; what would settle it is the commit that first introduced a regenerated tree and its message. [SOURCE: git:ceb8ff216c] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/001-shared-and-hub-docs/scratch/gen_extra2.py] — **CONFIRMED** for the artifact; **INFERRED** for the mapping. **P2**. **Smallest fix**: name regenerated generations distinctly (for example keep only `units/` and record the extra pass in its file names) — a packet convention, no code change.

3. **Process error (e) has a precise mechanism: tasks encode process steps whose only evidence is the executor's report, and the orchestrator's rerun rule (E2) can only recheck outcome criteria.** The parent rule says "The executor's report is a claim. The orchestrator reruns every completion criterion in the phase's `goal.md` itself before the phase counts as done" — that works for goal criteria but not for tasks such as "read these five contracts" or "capture before-state". Four recorded instances where the process claim could not be verified: the round-three quality child's builder "skipped Phase 1" so no `before-*` files exist; the round-three follow-up's "before state was not captured by the builder"; another child's "builder captured no before-state files"; and round four's `Task T009 has no build report. The DeepSeek units did not name the authoring contracts they read, so that process step is unticked`. The same class appeared in research tooling: an r2 lineage pass "nearly produced a false Hermes claim" because terminal rendering corrupted path strings, corrected only by re-reading the file. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/spec.md:87] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards/goal.md:91] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode/implementation-summary.md:76] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups/goal.md:93] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/implementation-summary.md:123] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/lineages/r2-dsflash-llmgw/deep-research-strategy.md] — **CONFIRMED**. **P1 by external-user impact**: an adopter's executor can skip a mandated process step and still pass every outcome check, so the packet's completion claim overstates what was done. **Smallest fix**: mark a task process-only when its evidence is prose, and require one artifact per process claim (round four's `Contracts read` row shows the shape) — a task-authoring rule, no new tooling.

4. **Process error (f) is a design decision with a cost, not an accident: sources and generated artifacts are split across writers, so every parallel build leaves drift that only the orchestrator may clear.** Round four's decision D4 states it: "Builders never run the Hermes generator or a compiled-route re-mint in write mode; the orchestrator runs each once after the builds"; round two records the reason ("Both skip the Codex, Pi and Hermes generators, which rewrite every agent's mirror"). Each child therefore logs a `PENDING-ORCHESTRATOR` block — for example `sync-skills-hermes.cjs --check` exits 1 with `DRIFT sk-code` and `DRIFT sk-code-review`, and `compiled-route-guard.cjs` exits 1 with `sk-code stale-manifest ... Re-mint: sk-code` — and each child's verified column then reads "Orchestrator steps | Done on 2026-10-10. Hermes `--check` prints `PASS: 70 Hermes skill copies in sync`, `compiled-route-guard.cjs` prints `sk-code fresh` after the re-mint and archive copy, and the trigger index `--check` exits 0". [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md:50] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/goal.md:113] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/goal.md:91] — **CONFIRMED**. **P1**: an external user following the build flow hits red gates at every build and must know the four writer commands; the gates name the drift but the recovery is orchestrator lore. **Smallest fix**: none in code yet — the artifact family inventory (finding 5) plus one `regenerate-all` line in the workflow docs would remove the lore, and that is the candidate phase in the synthesis.

5. **The drift family is larger than the brief names: four writers, plus retrieval fixtures that only surfaced at merge.** The writers are `sync-skills-hermes.cjs` (70 Hermes skill copies), the Codex and Pi agent syncs (`.codex`/`.pi` mirrors), `compiled-route-manifest.cjs refresh` (manifest plus an authored archive copy), `generate-leaf-manifest.cjs` (leaf manifest), and the trigger-index rebuild. At merge the list grew: "Rebuild the Hermes copy, the trigger index and its retrieval fixtures from the merged sources" — the index's retrieval fixtures are a fifth artifact family the brief does not name. Child-side drift on the leaf manifest traces to a real generator defect fixed inside the epic: the walk listed git-ignored files (`__pycache__`), so a Python test run made a committed manifest look stale. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs] [SOURCE: .skilled/skills/sk-code/sk-code-skilled/SKILL.md] [SOURCE: git:144b1d339e] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/002-leaf-generator-ignores/implementation-summary.md:69] [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs] — **CONFIRMED**. **P2**. **Smallest fix**: extend the drift documentation table by one row for the retrieval fixtures; no new generator.

6. **Process error (g) is a branch-local version mint with no remote check; the repair was a renumber plus a rule, not a mechanism.** Main minted system-spec-kit `v2.7.1.0` for repairs and upgrades while the epic branch minted its own `v2.7.1.0` for the hook stdin deadline; the merge kept main's note and folded the branch's two hook notes into `v2.7.2.0`, which SKILL.md already carried. The changelog states it plainly: "The deadline was built in two rounds. The first round was written up as its own 2.7.1.0, but that number went to the repair and upgrade release, so both rounds ship together here." The version is minted from the local changelog folder, so two branches that fork before the other's mint both pick the same next number, and nothing compares against the remote before the merge. [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18] [SOURCE: .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:12] [SOURCE: git:144b1d339e] [SOURCE: git:5b7fd10983] — **CONFIRMED**. **P1 by external-user impact**: any adopter with two branches touching one skill meets the same collision, and the version is user-visible routing metadata. **Smallest fix**: one rule in the changelog authoring contract plus a check that the newest changelog version is not already present on `origin/main` before minting; a full ledger service is REJECTED (see Ruled Out).

## Ruled Out

- **A version-reservation service or a lock on changelog numbers.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: the collision happens at most once per concurrent branch pair, both sides can already see `origin/main`'s changelog with a read, and a reservation layer adds a dependency and a failure mode with no caller today. The one-line contract rule plus the read is the smallest complete fix.
- **A scratch-lifecycle manager for packets.** Rejected for the same reason: the packet already carries the convention (planner prefixes, do-not-delete lines); the missing piece is naming, not machinery.

## Dead Ends

- Searching for a recorded incident of (c) and (d) across every goal log, implementation summary, commit body and review artifact in this worktree found no statement of either event. They are named in the 013 brief and nowhere else; the artifacts they produced survive, the run records do not. Carried as UNKNOWN with the settling artifact named per finding.

## Edge Cases

- Ambiguous input: "(c) a reviewer wildcard rm" could refer to an executor reviewer, a research reviewer, or a human; the namespace-collision mechanism holds for all three, and the incident stays UNKNOWN.
- Contradictory evidence: none. The executors refuse `rm -rf` in the sandboxes used here, yet a deletion happened somewhere with weaker guards; recorded as a guard-coverage difference, not a contradiction.
- Missing dependencies: none.
- Partial success: (c) and (d) are answered as mechanisms with UNKNOWN incidents; (e), (f) and (g) are answered with named evidence. `Status: complete`.

## Questions Answered

- Q2: What mechanisms produced process errors (b) to (e): the validator parsing link-shaped task text, the reviewer wildcard rm, the committed regenerated scratch tree and the claims made before verification? — answered at mechanism level for all four; the (b), (c) and (d) incidents themselves are UNKNOWN with the settling artifacts named.
- Q3: Why did the generated artifacts — the trigger index, the Hermes agent copies, the compiled-route manifests and the leaf manifests — drift and need orchestrator re-mints? — answered (findings 4 and 5).
- Q4: Why did a changelog version collision occur at merge when main and the branch both minted system-spec-kit v2.7.1.0? — answered (finding 6).

## Questions Remaining

- Q5 to Q10.

## Sources Consulted

- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/goal.md:50,110-118
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/goal.md:91-92
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/001-review-canary-pins/implementation-summary.md:123
- specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/goal.md:113
- specs/sk-code/011-sk-code-poinytail-based-refinement/008-round-two-recommendations/001-restraint-routing/tasks.md:31
- specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate/tasks.md:39
- specs/sk-code/011-sk-code-poinytail-based-refinement/004-webflow-checker-fix/implementation-summary.md:71
- specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/003-quality-mode/implementation-summary.md:76
- specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/005-opencode-and-guards/goal.md:91
- specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/006-deep-loop-follow-ups/goal.md:93
- specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/goal.md:123
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/scratch/build_tasks.py:116
- .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md:12
- .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md:18
- git:144b1d339e (merge body), git:5b7fd10983, git:ceb8ff216c, git:5ccf783d26

## Assessment

- New information ratio: 0.85
- Questions addressed: Q2 (complete at mechanism level), Q3, Q4
- Questions answered: Q3, Q4; Q2 completed per the answered-questions bar below

## Reflection

- What worked and why: reading every round parent log and the per-child "Orchestrator steps" rows exposed (f) as a designed split with a documented cost, rather than an accident; the merge commit body named (g) directly.
- What did not work and why: persistent searching for (c) and (d) run records failed because the packet records outcomes, not incidents; only the guard rules and regenerated artifacts survive.
- What I would do differently: for Part 2, confirm each claim by executing the test or reading the exact line before writing the finding, because these are machine-checkable and do not need incident archaeology.

## Recommended Next Focus

Iteration 3: Part 2's test and canary cluster — the jev-transport-single canary deferral, the compiled-route-admission `LIVE_CORPUS_SIZE 80` pin against 86 scenarios, and the manifest tests at 26 pass / 16 fail — confirmed by reading the tests and, where safe, running them read-only.
