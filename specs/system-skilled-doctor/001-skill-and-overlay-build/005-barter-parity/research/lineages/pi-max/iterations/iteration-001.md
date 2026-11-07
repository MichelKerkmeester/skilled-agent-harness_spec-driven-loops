# Iteration 1: Skilled-side overlay engine contract (manifest, status, protectedPaths, repin roots)

## Focus

Establish the engine's actual contract before judging Barter's gaps: how the overlay folder is resolved, what makes `status` exit 2, how a protected path is refused, which roots a re-pin copies and deletes, and which post-write regeneration the engine performs. The known-gap list from the dispatch brief is treated as hypotheses to verify, not as facts.

## Findings

1. A missing `.skilled-overlays.json` does not itself fail status: `resolveOverlayDir` silently falls back to the literal folder `skilled-overlays`, and the run only dies one step later when `loadManifest` throws `no overlay manifest at …/overlay-manifest.json`, which the CLI catch turns into exit 2 with the message on stderr. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:375] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:425] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:3340]
2. The protected-path refusal is a whole-run throw, not a per-entry block: `assertSafeToPlan` raises for any `token`-named path it meets inside a directory or skill-root walk, and `analyze` raises again for a protected destination or source, so one `*token*` file aborts every other overlay's report with exit 2 and no `MISS` line naming the entry. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1688] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1801]
3. That throw is inconsistent with the engine's own reporting model: classified states in `BLOCKING_STATES` are printed per overlay as `blocked <overlay>: <state> <path>` and collected into the report, so an overlay-level refusal already has a shape the protected-path throw bypasses. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:58] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2884]
4. `DEFAULT_RUNTIME_FOLDERS` lists `.claude`, `.codex`, `.cursor`, `.devin`, `.opencode`, `.pi` and omits `.dsh`, while the doctor's own runtime-mirror contract treats `.dsh` as a first-class surface with `dsh_skills`, `dsh_prompts` and `dsh_agents` sync scripts, so a re-pin of a tree that ships `.dsh` mirrors copies stale mirrors unless the manifest overrides `repin.runtimeFolders`. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:74] [SOURCE: .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46]
5. A re-pin copies only `.skilled/**` plus the runtime folders and deletes only paths under `.skilled` and the runtime folders, so a root file such as `AGENTS.md` or `REPO RULES.md` is neither carried forward nor removed when upstream changes it; the vendored root copy silently drifts from the new pin. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2531] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2539]
6. `repin.exclude` already exists, is validated as a list of relative paths, and is covered by a test that keeps a real `.opencode/scripts` folder where upstream ships a link, so the brief's "no repin.exclude for .opencode/scripts" is a Barter manifest gap rather than a missing engine feature. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2503] [SOURCE: .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:456]
7. Post-write regeneration is declared entirely by the manifest: `layoutLinks` recreate links, `regenerate` runs `argv` steps and snapshots their `outputs`, and `verifyGenerated` re-runs read-only checks with `fresh-true` or `zero-changed` expectations, so dsh skill links, runtime mirrors, hook registrations, trigger index and advisor graph can all be re-pinned today only if a manifest names them; the engine ships no default step set. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1424] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1516] [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:1531]
8. A staged re-pin deliberately drops the regenerate and verify blocks before writing the copy, so a clean `RESULT: STAGED` report is not evidence that the live post-repin tree regenerated or verified. [SOURCE: .skilled/commands/doctor/scripts/overlay-engine.cjs:2914]

## Ruled Out

- Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703).
- Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item.
- Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean.

## Dead Ends

- Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief.
- Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4.

## Edge Cases

- Ambiguous input: "protectedPaths refusal" could mean capture restriction or read refusal; both exist (lines 1649-1657 and 1620-1624), and this iteration scoped to the read/plan refusal, which is the one that aborts status.
- Contradictory evidence: the brief asserts `repin.exclude` is missing; the engine and its test show it present. Recorded in finding 6 as a manifest-side gap.
- Missing dependencies: none.
- Partial success: all planned reads succeeded; status was not executed by choice, so the exit-2 claim rests on the CLI catch path plus the throw sites rather than on an observed run.

## Sources Consulted

- .skilled/commands/doctor/scripts/overlay-engine.cjs:58, 61, 74, 375, 425, 1424, 1516, 1531, 1688, 1801, 2503, 2531, 2539, 2884, 2914, 3340
- .skilled/commands/doctor/overlay.md:1
- .skilled/commands/doctor/scripts/tests/overlay-engine-repin.test.cjs:456
- .skilled/commands/doctor/scripts/tests/doctor-runtime-mirrors-contract.test.cjs:46

## Assessment

- New information ratio: 1.0
- Questions addressed: Q1 (engine changes around status/exit 2 and protectedPath aborts)
- Questions answered: Q1

## Reflection

- What worked and why: reading throw sites together with the CLI catch, then comparing them against the existing per-entry blocked reporting, turned three separate symptoms into one design inconsistency with a clear fix shape.
- What did not work and why: trusting the dispatch brief's gap list cost one verification pass and produced one direct contradiction; the brief mixes engine gaps with manifest gaps.
- What I would do differently: read the engine's tests first, since the tests state intended behavior more compactly than the 3,363-line engine.

## Recommended Next Focus

Barter side (Q2): read `barter-overlays/README.md`, `overlay-manifest.json`, `replay.cjs`, `sync.cjs`, `sync-state.json` and the `overlay-sync` hook to determine what the runbook actually does, what its manifest validates, and which of its behaviors the Skilled engine cannot express.

## SCOPE VIOLATIONS

Recorded, not executed, because this lineage may write only inside its artifact directory:

- The workflow's `step_writeback_spec_findings` and `step_validate_post_synthesis_spec_doc` would edit `{spec_folder}/spec.md` and run `validate.sh`; both are outside the lineage write surface and are skipped.
- `phase_save` (`generate-context.js`) and `step_stage_artifact_dir` (`git add`) are skipped for the same reason.
- `step_preinit_spec_branch` would append pre-init context to `spec.md`; skipped, so `folder_state` is not recorded as a ledger event for this lineage.
