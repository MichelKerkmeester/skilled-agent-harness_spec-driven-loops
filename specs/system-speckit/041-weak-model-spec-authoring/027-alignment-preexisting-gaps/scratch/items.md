# Phase 027 work items

Phase 026 recorded three gaps as already there before it and outside its scope. Two runs of the operator-local alignment command on commit 5b9509576a exposed them:
- the alignment run output (gitignored), run 20261027T154036Z (DeepSeek lanes)
- the alignment run output (gitignored), run 20261027T171418Z (Opus high lanes)

The operator directed fixing all three. Each lane owns its own files.

## Lane R: README checkers (sk-doc, tracked)

Files: `.skilled/skills/sk-doc/sk-create-readme/scripts/check_readme_references.py`, `check_derived_readme_counts.py` and their tests.

- R1: `check_readme_references.py` reads an inline slash command such as `/create:changelog`, `/speckit:resume` or `/doctor:env` as a file path and reports it unresolved. On the seven READMEs that phase 025 fired (`.skilled/bin/README.md`, `.skilled/commands/create/README.md`, `.skilled/skills/sk-doc/README.md`, `.skilled/skills/sk-doc/sk-create-changelog/README.md`, `.skilled/skills/sk-doc/sk-create-frontmatter/README.md`, `.skilled/skills/system-spec-kit/README.md`, `README.md`), the root README alone reports 305 unresolved references.
  - Classify the false-positive classes: slash commands, bare filenames such as `SKILL.md` or `handover.md`, gitignored personal files such as `.skilled/hooks/hook-flags.env`, and anything else.
  - Fix each at the checker, never by editing READMEs. A slash command should resolve against the command tree (`.skilled/commands/<group>/<name>.md`) and be reported only when that command does not exist.
  - A real broken path must still fail.
- R2: `check_derived_readme_counts.py` flags prose like "one file" or "a few characters in one file" as a numeric count claim. The root README reports 41 claims and 41 failures. Find why the heuristic fires on non-claims and narrow it so a real wrong count still fails.
- Tests: add focused tests that pin each fixed class, plus one that a real broken path or wrong count still fails. Use the existing test location (`.skilled/skills/sk-doc/scripts/tests/`, run by `sk-doc-script-tests.yml`) or the checker's own folder, whichever the CI workflow runs.
- Report the before and after counts on the seven READMEs. List every residual failure and say whether it is real.

## Lane A: advisor routing (system-skill-advisor and sk-doc metadata, tracked)

- A1: the advisor ranks system-spec-kit first for packet-local changelog requests:
  - "Write a nested changelog for this packet" scores system-spec-kit 0.560, sk-doc 0.349.
  - "Create a packet changelog for the work I just finished" scores 0.591 against 0.260.
  - "Write a packet-local changelog entry" scores 0.599 against 0.333.
  - "Create a changelog entry for this spec folder" scores 0.867 against 0.306.
- sk-doc carries the compiled route to sk-create-changelog, the mode that refuses these requests and offers a global entry. Make sk-doc win these prompts without stealing true spec-kit prompts. These must stay on system-spec-kit:
  - "Close out this spec folder: run completion validation and mark the packet done"
  - "Generate the implementation summary for a finished spec packet"
  - "Re-render the existing per-packet change history files so they show the deprecation notice"
  - "Create a spec folder for this feature"
- Work at the right layer: sk-doc or sk-create-changelog routing vocabulary and graph-metadata, compiled through the normal generators. No scorer hacks. Lock the result in the advisor regression corpus or golden prompts with these probes.
- Gates that must stay green:
  - `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict`
  - `node .skilled/bin/compiled-route-guard.cjs`
  - `node .skilled/bin/compiled-route-admission.cjs --all`
  - `node .skilled/skills/sk-doc/sk-create-skill/scripts/generate-router-intent-signals.cjs --check`
  - `python3 .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py --validate-only`
  - The advisor vitest suites the CI runs: `tests/parity/local-native-divergence-ratchet.vitest.ts`, `tests/routing-registry-drift-guard.vitest.ts`, the routing-parity suites and `routing-golden-prompts.vitest.ts`.
- If the fix needs a scorer change after all, stop and report why instead of making it.

## Lane T: the alignment tool (gitignored, operator-local)

Files: the alignment command's aggregator (gitignored, operator-local), with its two workflow YAMLs and its presentation contract beside it. The main checkout holds an identical copy of that folder, which the conductor syncs afterwards.

- T1: the aggregator crashes (`a.id.localeCompare is not a function`) when a lane returns numeric finding ids. Coerce ids to strings, prefixed with the lane id when bare.
- T2: the aggregator keeps every finding at its lane severity even after the critic overturns it, for example a finding the critic shows predates the scope, or a duplicate.
  - Add an optional `overrides` array to the critic contract: `[{id, verdict: "refuted"|"pre-existing"|"duplicate"|"severity", severity?, note}]`.
  - Make the aggregator apply it. A refuted or duplicate finding leaves the counts and is listed in an "Overturned by the critic" section. A pre-existing finding moves to the outside-scope section. A severity override changes the severity and keeps the note.
  - Update the critic step in both YAMLs to ask for `overrides`.
- Verify by re-running the aggregator on copies of both run folders above, with an `overrides` array added to the DeepSeek run's critic.json that encodes CR-1 (D2 pre-existing), CR-2 (PRB-01 to PRB-03 refuted) and CR-5 (A-2 duplicate of C-5). Show the counts change as expected. Also show a lane file with numeric ids no longer crashes.
