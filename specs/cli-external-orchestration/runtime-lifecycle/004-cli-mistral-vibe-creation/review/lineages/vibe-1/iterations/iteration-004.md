# Review Iteration 004

## Dispatcher

- Mode: review (fan-out lineage `vibe-1`)
- Session: `fanout-vibe-1-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Executor: cli-mistral-vibe, model `deepseek-flash`
- Iteration: 4 of 5
- Dimension: maintainability
- Operator review focus: every Vibe hook and plugin binding, its fail-open behaviour, wire-format and payload edge cases, ordering and kill-switch gaps, and parity against the OpenCode plugins. Only new or still-open issues; the 29 findings dispositioned in `023-vibe-review-remediation/implementation-summary.md` are excluded.

### How this iteration addressed the operator focus

The focus asks whether the bundle is safe to change. This iteration measured three things: whether an adapter can be tested at all, whether the reply contract lives in one place or in eight, and which adapters have no test behind them. The first question found the one session-lifecycle entry point that runs its hook at import time, and the third found that the three adapters with no test reference anywhere are exactly the three that carry findings from this lineage. The parity half of the focus was checked structurally rather than behaviourally: the `.skilled/hooks/*/vibe/` tree turned out to be a symlink farm into `.vibe/plugins/repo-guards/`, so the apparent second copy of eleven guards is not a duplicate and is recorded as confirmed-clean rather than as a finding.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-147` — the whole module, including the unguarded `main()` call at `:145`
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:30-40,110-172` — `IS_CLI_ENTRY`, `readStdin`, the reply write
- `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:24-32,64-122` — `IS_CLI_ENTRY`, `readStdin`, the deny write
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:24-44,75-86` — `IS_CLI_ENTRY`, `readStdin`, the reply write
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:1-381` — the six section headers and the three exports
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-60` — `readPayload` and the seam the repo-guards tree shares
- `.vibe/plugins/repo-guards/post-edit-quality.mjs:30-40`, `dist-freshness.mjs:105-118`, `classifier-injection-screen.mjs:25-40`, `spec-gate-classify.mjs:40-55`, `session-cleanup.mjs:20-35` — the five repo-guards reply writes
- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:1-122` — the whole module, and its absence from every test file
- `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs:1-110` — the whole module, and the `vibe/` directory holding no test
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:1-127` — the whole module, and the `vibe/` directory holding no test
- `.skilled/hooks/task-dispatch/tests/dsh-task-dispatch-guard.test.mjs:8-13` — the imports that show the core and the dsh adapter are tested and the Vibe adapter is not
- `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs:50-60` — the parse-failure branch, for the consistency comparison
- `.skilled/hooks/goal/vibe/goal-inject.mjs:1-42` — the module shape, for the same comparison

Context evidence (read-only, not review targets): the test inventory under `.vibe/plugins/repo-guards/tests/`, `.skilled/hooks/*/tests/`, `.skilled/hooks/*/lib/*.test.*` and `.skilled/hooks/shared/tests/session-readers/`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **`session-start.mjs` calls `main()` at module scope with no `IS_CLI_ENTRY` guard and exports nothing, so it cannot be imported without running the hook, and it is the only one of the five session-lifecycle modules with no test** -- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:145` -- The module ends with a bare `main().catch(() => { process.exitCode = 0; })` and has no `export` statement. Importing it from a test would read the test runner's stdin and write a hook reply to its stdout. The three sibling entry points all guard the call: `turn-start.mjs:35,168`, `turn-end.mjs:28,118` and `compaction-post-tool.mjs:26,82` each compute `IS_CLI_ENTRY` from `process.argv[1]` and `import.meta.url` and call `main()` only when it is true. Those three each have a test beside them (`turn-start.test.mjs`, `turn-end.test.mjs`, `compaction-post-tool.test.mjs`); `session-start.mjs` has none, and the `vibe/` directory holds only the adapter. The missing guard is the reason the file cannot be tested, so the coverage gap and the shape defect are the same defect.
   Finding class: untestable-entry-point
   Scope proof: `:145` is the only top-level `main()` call in the five session-lifecycle modules that is not behind `IS_CLI_ENTRY`, and `session-start.mjs` is the only one of the five with no `export` and no test file.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`
   Case: a test imports `session-start.mjs` to exercise the goal slice or the startup-guard composition. The import runs the hook, consumes the runner's stdin and writes a JSON reply into the runner's stdout, so the test cannot assert on the composed text and the file stays untested.

2. **Eight adapters hand-roll the same reply write and four hand-roll the same stdin read, while the shared seam exports a payload reader for one tree and no reply writer for either** -- `.vibe/plugins/repo-guards/lib/hook-io.mjs:44-56` -- `readPayload` in `hook-io.mjs` reads stdin and parses it, and the twelve repo-guards scripts use it. The four session-lifecycle entry points cannot reach it, so each carries its own six-line `readStdin`: `turn-start.mjs:117-122`, `turn-end.mjs:68-73`, `session-start.mjs:50-55` and `compaction-post-tool.mjs:38-43`, all byte-identical. The reply side has no shared writer at all: `post-edit-quality.mjs:36`, `dist-freshness.mjs:112`, `classifier-injection-screen.mjs:32`, `session-cleanup.mjs:29`, `spec-gate-classify.mjs:47`, `compaction-post-tool.mjs:79`, `session-start.mjs:142` and `turn-start.mjs:165` each write the same `{"hook_specific_output":{"additional_context":...}}` object by hand. The consequence is not the line count: the reply contract is a convention held in eight places and stated in none, which is how `R3-P2-002`'s documentation gap survived — there is no single place a reader or a test could point at to say what a conforming reply is.
   Finding class: duplicated-contract
   Scope proof: the eight reply sites are the complete set of `hook_specific_output` emitters in the declared target, and the four `readStdin` bodies are the complete set outside `hook-io.mjs`.
   Affected surface hints: `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.vibe/plugins/repo-guards/post-edit-quality.mjs`, `.vibe/plugins/repo-guards/dist-freshness.mjs`, `.vibe/plugins/repo-guards/classifier-injection-screen.mjs`, `.vibe/plugins/repo-guards/spec-gate-classify.mjs`, `.vibe/plugins/repo-guards/session-cleanup.mjs`, `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs`
   Case: the reply shape changes, or a new hook is added. The change has to land in eight files, and a hook that keeps the old shape is indistinguishable from a hook that is correct until a live run shows the advisory missing.

3. **Three Vibe adapters have no test reference anywhere in the repository, and they are exactly the three that carry findings from this lineage** -- `.vibe/plugins/repo-guards/deep-loop-guard.mjs:1-122` -- A search of every `*.test.*` file under `.vibe` and `.skilled` for each adapter's name returns zero hits for `deep-loop-guard`, `ask-surface-post-agent` and `completion-evidence-post-agent`. The other nine adapters are named by at least one test, even where the test targets the core or a sibling runtime. The three untested ones are the files that carry `R3-P2-003` (`deep-loop-guard.mjs:32`'s `SPAWN_TOOLS` hedge), `R2-P2-001` (`ask-surface-post-agent.mjs:105`'s `recordFire` root) and `R2-P2-001` (`completion-evidence-post-agent.cjs:62-66,110`'s unguarded write and the `turn-start.mjs:64` unlink). The nearest tests stop one layer short: `task-dispatch/tests/dsh-task-dispatch-guard.test.mjs:11-12` imports `lib/dispatch-guard.cjs` and `dsh/task-dispatch-guard.mjs`, and `ask-surface-guard/lib/ask-surface-core.test.mjs` imports the core, so in both cases the adapter that reads the payload and writes the reply is the untested layer.
   Finding class: untested-adapter-layer
   Scope proof: the search covered every `*.test.*` file under `.vibe` and `.skilled`; the three names return zero hits and the other nine return between one and eight.
   Affected surface hints: `.vibe/plugins/repo-guards/deep-loop-guard.mjs`, `.skilled/hooks/ask-surface-guard/vibe/ask-surface-post-agent.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`, `.skilled/hooks/task-dispatch/tests/dsh-task-dispatch-guard.test.mjs`, `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs`
   Case: a change lands in `deep-loop-guard.mjs`'s `SPAWN_TOOLS` set or in `completion-evidence-post-agent.cjs`'s pending-advisory path. No test fails, because no test names either file, and the defect reaches a live session.

## Traceability Checks

- **`spec_code` — pass.** The binding census and the classification table were settled in iteration 3 and no binding changed. This iteration added no claim about the reference document.
- **`checklist_evidence` — notApplicable.** The declared target is a file set, not a spec folder with a checklist.
- **`skill_agent` (overlay) — pass.** `prompt-advisor.mjs` is named by `system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs`, so the advisor part carries a test even though the Vibe adapter is a symlink into the repo-guards tree.
- **`agent_cross_runtime` (overlay) — pass.** The `.skilled/hooks/*/vibe/` tree was checked for duplication against `.vibe/plugins/repo-guards/`: eleven of the twenty-two entries are symlinks into the repo-guards tree and the rest are real files with no counterpart there, so there is no second copy to drift. Recorded under Confirmed-Clean Surfaces.
- **`feature_catalog_code` (overlay) — notApplicable.** No feature catalogue covers this file set.
- **`playbook_capability` (overlay) — notApplicable for this iteration.** No scenario file was read. Carried to the residual sweep.

## Integration Evidence

- `.vibe/plugins/repo-guards/lib/hook-io.mjs` — the shared seam that `readPayload` lives in, and the seam the session-lifecycle tree cannot reach.
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs` — the `session_start` binding at `hooks.toml:141-144`, and the one entry point without an import guard.
- `.skilled/hooks/task-dispatch/tests/dsh-task-dispatch-guard.test.mjs` — the test that stops at the core and the dsh adapter, leaving the Vibe adapter untested.
- `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.test.mjs` — the same pattern for the ask-surface guard.
- `.vibe/plugins/repo-guards/tests/` — the four adapter-level tests that exist (`dist-freshness`, `env-secret-guard`, `render-home-hooks`, `spec-gate`), against thirteen scripts.

## Edge Cases

- **Finding 1 and finding 3 overlap on `session-start.mjs`.** Finding 1 is the shape defect that makes the file untestable; finding 3 is the coverage census. They are recorded separately because the fix differs: finding 1 is a three-line guard, finding 3 is a test. `session-start.mjs` is named in finding 1 only, and finding 3's three files are the ones with no test reference at all.
- **Finding 2 is a maintainability finding, not a correctness one.** The eight reply writes are all correct today; the cost is that the contract has no home. It is recorded at P2 because nothing is broken, and it is linked to `R3-P2-002` because that finding is the observable consequence.
- **The symlink farm is not duplication.** Eleven `.skilled/hooks/*/vibe/*.mjs` entries are symlinks into `.vibe/plugins/repo-guards/`, so the apparent second copy of the guards is one file with two paths. Node resolves `./lib/hook-io.mjs` against the realpath, which is why the symlinked adapters load. Recorded as confirmed-clean.
- **`compaction-context.mjs` at 381 lines is cohesive, not a god module.** Its six sections are imports, constants, state, handoff pointer, detector and post-tool binding, and its three exports are `buildCompactionPart`, `measureJournal` and `buildPostToolPart`. The size is the detector's, not a mix of concerns, so no finding is raised.
- **`turn-end.mjs` writes a deny object, not a `hook_specific_output` reply.** It is therefore outside finding 2's eight reply sites but inside its four `readStdin` sites. The asymmetry is correct: `post_agent` denies, it does not add context.

## Confirmed-Clean Surfaces

- `.skilled/hooks/*/vibe/*.mjs` — eleven of the twenty-two entries are symlinks into `.vibe/plugins/repo-guards/`, so there is no duplicated guard tree to drift.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:44-56` `readPayload` — decodes across chunk boundaries with `setEncoding('utf8')`, so a multi-byte character split between reads is not corrupted, and returns `null` rather than throwing on a non-object payload.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:35,168`, `turn-end.mjs:28,118`, `compaction-post-tool.mjs:26,82` — each guards its `main()` call behind `IS_CLI_ENTRY`, so each can be imported by its test.
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:1-381` — six named sections and three exports, with the state directory, the watermark and the detector each in their own section.
- `.skilled/hooks/decision-capture/vibe/ask-capture-post-tool.mjs:56-59` — a malformed payload returns through `done()` with a comment naming the fail-open intent, matching the other adapters' parse-failure branch.
- `.vibe/plugins/repo-guards/tests/` — four adapter-level tests exist (`dist-freshness`, `env-secret-guard`, `render-home-hooks`, `spec-gate`), so the repo-guards tree is not uniformly untested.

## Ruled Out

- **The `.skilled/hooks/*/vibe/` tree as a duplicated second copy of the guards.** Ruled out: eleven of the entries are symlinks into `.vibe/plugins/repo-guards/`, verified with `-L`, and the remaining real files have no counterpart in the repo-guards tree.
- **`compaction-context.mjs` as a god module.** Ruled out: its six sections are cohesive and its three exports are the detector, the journal measurement and the post-tool composition.
- **`turn-end.mjs` missing from the reply-write duplication.** Ruled out as an omission: it writes a deny object rather than a context reply, which is the correct shape for `post_agent`.
- **The `main().catch(() => { process.exitCode = 0; })` pattern as an error-swallowing defect.** Ruled out: it is the documented fail-open contract for a non-strict hook, and every adapter that uses it also documents the intent in its header comment.
- **`goal-inject.mjs` and `ask-surface-post-agent.mjs` as parse-failure inconsistencies.** Ruled out: neither parses stdin itself; both take a payload from a shared reader, so the parse-failure branch lives one layer down.

## Next Focus

- Dimension: cross-reference (residual sweep)
- Focus area: the findings this lineage carries that no single dimension owned — `R1-P1-001`'s downgrade trigger, the playbook's hook-scenario verdict table as the live-verdict surface, and a re-read of every active P1 and P2 against the current file content to confirm none has been fixed or invalidated during the run.
- Reason: four dimensions are complete and the cap is one iteration away. The remaining work is to re-verify the carried findings rather than to open a fifth angle, so the synthesis reports a verdict the evidence still supports.
- Rotation status: correctness, security, traceability and maintainability complete; residual sweep next.
- Blocked/productive carry-forward: productive — measuring test coverage by name rather than by directory found the three untested adapters in one pass.
- Required evidence: a current `file:line` read for every active finding, and the playbook verdict row for each binding that has one.

Review verdict: CONDITIONAL
