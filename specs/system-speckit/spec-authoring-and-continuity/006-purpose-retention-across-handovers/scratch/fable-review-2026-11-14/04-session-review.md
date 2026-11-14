**Verdicts: Part A is CONDITIONAL, Part B is CONDITIONAL. No P0 in either.** Part A's code does what its phase criteria say, but what it prints is often not a purpose, and the feature has no catalog, playbook or README coverage. Part B's design holds on all four safety points, but two questions the spec leaves open should close before the build.

I did not rerun any test suite (read-only), so the pass counts in the phase `goal.md` files are unverified by me.

Paths in Part A are relative to the main checkout, with `R` standing for `.skilled/skills/system-spec-kit/runtime`. Paths in Part B are relative to the worktree, with `P17` standing for the phase 017 folder and `DL` for `.skilled/skills/system-deep-loop/runtime`.

## Part A: purpose-carry remediation

### P1

1. **A problem sentence is printed as `Purpose:` for 239 live packets.**
   - Evidence: `R/lib/spec/packet-purpose.ts:89-97` falls back to the opening paragraph of `## PROBLEM & PURPOSE`. I ran the built reader over all 2,980 live packets. Of the 272 that lack `### Purpose`, 33 use a labelled paragraph and 239 use the opening paragraph. The 30 I sampled were all problem or context statements, for example "The authority-flip substrate is implemented but deliberately dark."
   - Phase 007 counts these as "own purpose read: 272 of 292", and its test "reads the first paragraph under a combined problem and purpose heading" in `R/tests/packet-purpose.vitest.ts` pins the behaviour.
   - Fix: when the text comes from the opening paragraph of a combined heading, return it as `problem` and keep looking for a purpose in the parent or `goal.md`. Keep `Purpose:` for `### Purpose`, a labelled paragraph, `## PURPOSE` and `## ROOT PURPOSE`.

2. **Eight live phase parents still resolve to layout boilerplate as their own purpose.**
   - Evidence: `packet-purpose.ts:36` only rejects the "Keep parent documentation lean" sentence. The eight parents `001-…` to `008-…` under `specs/system-deep-loop/loop-architecture/001-deep-loop-innovation/` return "This phase groups the related child phases below so parent-level context stays a short thematic map."
   - Phase 006 REQ-001 and the phase 011 list of 21 both missed them, because the reader reports them as `packet`.
   - Fix: add that sentence to the scaffold pattern and to `purpose_row`, `handoff.md` and `nudge.cjs`, then backfill the eight.

3. **No feature catalog entry, playbook scenario or README text covers the feature.**
   - Evidence: a search for the purpose labels finds nothing in `system-spec-kit/feature-catalog`, `manual-testing-playbook`, `references` or `SKILL.md`. The sibling feature has `feature-catalog/context-preservation/compaction-history-lookup.md` and a matching playbook file.
   - `.skilled/hooks/injection-contract.md:212-216` and `:240-246` describe the compaction output without the `## Packet Purpose` section.
   - Root `README.md:45`, `:522`, `:536-548`, `:1052`, `:1175` and `:1199` describe resume, compaction and handoff with no mention of the purpose line.
   - Fix: add one catalog entry, one playbook scenario per hop (resume, relaunch, Claude compaction, Pi compaction, save), the section in `injection-contract.md` and one sentence in each of those README passages.

### P2

1. **Pi lags the Claude adapter.** `R/hooks/pi/session-compact-context.ts:80-86` has no walk-up from a `scratch` or `research` subfolder, unlike `R/hooks/claude/session-prime.ts:240-244`. It also loads the reader from `dist` at `:73-75`, so a stale build drops the purpose silently. Fix: move the walk-up into `resolvePacketPurpose` and log when the import fails.

2. **The relaunch nudge states a narrower rule than the other hops.** `.skilled/hooks/session-relaunch/lib/nudge.cjs:24-33` omits `## PURPOSE`, `## ROOT PURPOSE` and `UNKNOWN`, which `.skilled/commands/speckit/handoff.md:136-137` and both resume YAMLs name. Phase 008's "same rule" objective is therefore not fully met. Its test checks four substrings only. Fix: align the text and assert the three missing terms.

3. **The purpose folder is taken from the cached brief before the brief is validated.** `session-prime.ts:417-419` runs before the staleness and quarantine checks at `:156-173`, so a quarantined brief still chooses which `spec.md` is read. Fix: use the brief's folder only when `handleCompact` accepted the payload.

4. **Folder detection splits its votes.** `R/hooks/claude/compact-inject.ts:331-339` does not strip a `:12` line suffix, so `spec.md:12` and `spec.md:40` count as different folders. A path from another worktree also resolves against the main checkout. Fix: strip `:\d+` before the file strip.

5. **Five new tests create folders in the working tree.** `R/tests/hook-session-start.vitest.ts:168`, `:199`, `:258`, `:296` and `:331` use `process.cwd()`, and `git check-ignore` reports the `.tmp-session-prime-*` name as not ignored. A crashed run leaves untracked folders. Fix: let `runSessionStartHook` take a project root and use the system temp folder.

Three smaller P2 items are held back: seven packets reduce to fragments such as "Measure it." or "Not recorded", all six phase `goal.md` files keep `completion_pct: 0` at line 24 with every box ticked, and each `implementation-summary.md:14` still names a pre-merge next action.

### The 21 backfilled sentences

All 21 are live, match `scratch/sentences.md` and resolve as `packet`. Against each child's first purpose sentence they read true, with three reservations:
- `005-smart-rule-injection` describes two of its four children. `003-shallow-evidence-claims` and `004-agents-md-concision` fall outside it.
- `001-on-write-quality` says "navigable as one track", which describes layout more than outcome.
- `sk-design/020-chart-and-diagram-review` claims four iterations on two models. Its children state no purpose, so I could not confirm that.

## Part B: phase 017 plan

The four safety points hold on reading:
- **`DSH_HOME` isolation:** the home is set only in `dispatchEnv`, so the guard at `DL/lib/deep-loop/executor-audit.ts:947-958` still refuses a nested dispatch.
- **Never at the repo root:** the working directory comes from the builder at `DL/scripts/fanout-run.cjs:3056`.
- **Completion check:** it runs only on exit 0.
- **Env allowlist:** the merge sits after the filter.

### P1

1. **The spec gate stays live inside the child.**
   - Evidence: `fanout-run.cjs:3724-3731` sets `SYSTEM_SPEC_GATE_DISABLED=1` and says enforcement off alone is not enough. `.dsh/plugins/repo-guards/README.md:82-83` says both gate adapters are off only through that variable. `P17/spec.md:243` leaves it out as an open question.
   - This is inferred from those two sources. I did not read the gate core.
   - Fix: add the key to `dispatchEnv` in `P17/scratch/apply-edits.py:115-119` and to the env test cell.

2. **The one check that proves the leaf can work is not a gate.**
   - Evidence: `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl:82` says all paths are relative to the repo root, and `:147` runs `node .skilled/…/append-mode-event.cjs`. The leaf now starts in the artifact folder.
   - `P17/spec.md:185` and `:242` name this risk, yet no requirement or success criterion requires the keyed run. The stub smoke never reads the prompt.
   - Fix: prepend the repo-root line to `promptBody` now, and add an acceptance row that a keyed single-lineage run writes a ledger record.

### P2

1. **Home cleanup is weaker than fan-out.** Fan-out sweeps pending homes on exit at `fanout-run.cjs:2952-2965`. The plan relies on `finally` alone (`apply-edits.py:124-126`). The step timeout equals the executor timeout (`:156`), and the runner's own timeout is only one second shorter (`executor-audit.ts:1213-1215`). A kill from the outer timeout would leave a `dsh-home-*` folder. Fix: give the step a margin or sweep stale homes at start.

2. **`dispatchEnv` accepts any key for any executor kind.** `apply-edits.py:199` would let a later caller pass `PATH` or a secret past the allowlist. Fix: check keys against a short per-kind list.

3. **The runner echoes the child's whole output into the step.** `executor-audit.ts:1225-1227` writes stdout through, and dsh runs with `--json`. The cap is 10 MiB at `:1221`. Fix: measure the stream size in the keyed run and suppress the echo for this kind if it is large.

4. **Doc gaps in scope.** `tasks.md`, `acceptance-criteria.md` and `implementation-summary.md` are still scaffold text, and the summary is pre-stamped `Completed 2026-11-14` at `:40`. No changelog entry is planned, although `.skilled/skills/system-deep-loop/changelog/v1.6.24.0.md:25` says the harness is fan-out only.

## What I could not check

- The pass counts in the phase `goal.md` files, because I ran no test suite.
- Whether the literal `'dsh-home-'` at `apply-edits.py:101` trips the ancestry guard. I did not read `commandLineContainsBinary`. The plan says the prototype dispatched.
- What `:confirm` does with a dsh executor. The spec puts it out of scope. It should refuse, not run native.
- The five parents rewritten in commit `43bff36f9d`, and whether the continuity save writes the purpose correctly end to end.
- `plan.md` was being rewritten while I read it, so my reading of its edit list comes from `scratch/apply-edits.py`.

## Status

Nothing in either checkout was edited, committed or dispatched. I wrote four throwaway probe scripts to `/tmp/probe-purpose.mjs`, `/tmp/probe2.mjs`, `/tmp/probe3.mjs` and `/tmp/probe4.mjs`, which only read the repository. Residual risk: findings rest on my reading plus those probes, not on a test run.

Yours to decide: whether Part B's two P1 items are fixed before the phase 017 build starts.
