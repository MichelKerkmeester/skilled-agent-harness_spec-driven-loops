# Review Iteration 001

## Dispatcher

- Lineage: `docs-7`, area `docs`.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Focus: traceability, with correctness, security and maintainability lenses applied to the same two changed README lines. The pass-seven operator focus is the docs area: this branch's net change to the root `README.md` against `origin/main`, where `/create:skill` was renamed `/create:sk-skill`, so every command name the README gives is checked against `.skilled/commands`. `review/review-brief-7.txt` and `review/review-scope-7.txt` were read first; this iteration covers the area they assign to `docs-7`.
- Diff base: `git -c core.fsmonitor=false diff origin/main 1c3d62def5a -- README.md`, the command on line 1 of the scope file. It reports two lines changed, 2 insertions and 2 deletions: `README.md:269` and `README.md:603`.
- `steer.md` does not exist in the lineage directory, so no lead ruling applied.
- Recorded limits and the holdout rule were honoured: no prompt corpus was opened, no `git diff`/`show`/`log -p` ran over a path containing one, `score-command-transcripts.mjs --summary` was not run, and no CLI session store was read.

## Files Reviewed

| File | Lines read | What was checked |
|------|-----------|------------------|
| `README.md` | 266-271 | The changed extending-Skilled paragraph: the renamed `/create:sk-skill` and the remaining `/create:*` names, plus the `:auto`/`:confirm` sentence |
| `README.md` | 580-613 | The agent list and the whole commands section: all 44 names, the six group counts, and the changed Create list |
| `README.md` | 640-663 | The Doctor table, to test the `Doctor (17)` count against real files |
| `README.md` | 341 | The runtime goal-command paragraph, to confirm the four runtime-owned goal commands are outside the 44 |
| `.skilled/commands/README.txt` | 1-40 | The command tree's own six-group index and counts |
| `.skilled/commands/create/README.txt` | 50-95, 119-180 | The create group index rows, the command-map tree, and every example invocation of the renamed command |
| `.skilled/commands/create/sk-skill.md` | 1-40 | The renamed router's frontmatter name, description, argument hint and owned assets |
| `.skilled/commands/create/sk-skill.md` | 40-80 | The mode routing and execution targets for `:auto` and `:confirm` |
| `.skilled/skills/sk-doc/README.md` | 60-70, 190-198 | The sk-doc hub's thirteen-command sentence and its how-do-I answer naming `/create:sk-skill` |

Context evidence (read-only, outside the docs scope path): `.skilled/commands/**` file inventory, `.skilled/commands/create/assets/create-skill-presentation.txt:1,28`, `.skilled/commands/create/assets/create-skill-auto.yaml:113`, `.skilled/commands/create/assets/create-skill-confirm.yaml:30,39-40`, `.opencode/commands/create/sk-skill.md`, `.claude/commands/create/sk-skill.md`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Both changed lines name a command file that exists: `/create:sk-skill` resolves to `.skilled/commands/create/sk-skill.md` and every other `/group:name` token in `README.md` resolves to `.skilled/commands/<group>/<name>.md` (44 of 44). The two changed lines agree with each other. |
| `checklist_evidence` | notApplicable | The review target has no `checklist.md` at the packet root; the pass-seven brief and scope file are the operative checklist and both were read. |
| `skill_agent` | pass | The renamed command's own surfaces agree with the README name: `.skilled/commands/create/sk-skill.md:1-13` routes `/create:sk-skill`, and `.skilled/commands/create/assets/create-skill-presentation.txt:1,28` presents the same name. |
| `agent_cross_runtime` | notApplicable | No agent body is in the docs scope; the command mirrors that do exist are recorded under Integration Evidence. |
| `feature_catalog_code` | notApplicable | No feature-catalog claim is touched by the two changed README lines. |
| `playbook_capability` | notApplicable | No manual-testing-playbook claim is touched by the two changed README lines. |

## Integration Evidence

- `.skilled/commands/README.txt:21-35` gives the six-group table: create 13, deep 2, doctor 17, design 3, prompt 1, speckit 8, which sums to the README's `Forty-four commands ship in six groups` at `README.md:599`; `local-skilled-alignment.md` sits at the tree root and is not counted in the six groups.
- `.skilled/commands/create/README.txt:57` names `/create:sk-skill <skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm]`, and `:88` maps `sk-skill.md` to `/create:sk-skill`; both agree with `README.md:269` and `:603`.
- `.skilled/skills/sk-doc/README.md:67` names the same thirteen `/create:*` commands including `/create:sk-skill`, and `:194` answers the how-do-I question with the same name.
- `.opencode/commands/create/sk-skill.md` and `.claude/commands/create/sk-skill.md` exist under the same name, so the two runtime command trees that mirror this group carry the renamed file rather than a stale `skill.md`.
- `.skilled/commands/create/assets/create-skill-presentation.txt:28` restarts the workflow with `@markdown /create:sk-skill ...`, the exact name the README now gives.

## Edge Cases

- Iteration numbering: this is the lineage's first iteration (the state log held only the run-initialized config row), so `iteration-001.md` is correct.
- Diff base direction: the scope file prescribes a two-dot `origin/main..1c3d62def5a` README diff. The branch merged `origin/main` at `2b946c9e842`, so the endpoint diff is the branch's own rename and not main's movement; a merge-base-only diff would have hidden nothing because the file's two endpoints differ only in the rename.
- Pre-existing prose: `README.md:599-611` count and group sentences predate this branch. They are context for the changed Create row, not branch findings; the two changed lines do not alter any count.
- The changed line at `:269` also names eight other create commands. Each was resolved individually, because a rename that repaired one name could still leave a sibling broken in the same sentence.
- `security` lens: the changed text is inert documentation. It adds no shell invocation, no path, no secret and no trust boundary, so the lens produced no candidate; that is a clean result, not skipped coverage.
- `maintainability` lens: the new spelling appears in both places that describe the skill command, and no third README sentence retains the old spelling; a future reader has one name to search.

## Confirmed-Clean Surfaces

- **Command-name resolution:** all 44 `/group:name` tokens in `README.md` resolve to a Markdown file under `.skilled/commands`; the only README command names outside that tree are the four runtime-owned goal commands at `README.md:341` and `:613`, which are documented as runtime additions.
- **Rename completeness:** the old token `/create:skill` (excluding `/create:skill-parent`) appears nowhere in `README.md`; both occurrences were updated in the same change.
- **Create count:** `Create (13)` lists thirteen names and `.skilled/commands/create` holds thirteen command Markdown files (plus `README.txt` and the `assets/` folder).
- **Mode support:** all thirteen create commands carry `[:auto|:confirm]` in their `argument-hint` and own both an `-auto.yaml` and a `-confirm.yaml` asset, so `README.md:269`'s "Every one runs with `:auto` or with `:confirm`" holds for the renamed command and its twelve siblings.
- **Confirm semantics:** the renamed command's confirm workflow sets `approvals: step_by_step` and describes "approval gates at each checkpoint" (`create-skill-confirm.yaml:30,39-40`), matching the README's "pause at each step".
- **Command behaviour claim:** `README.md:269` says the command "creates or updates a skill"; `create-skill-auto.yaml:113` sets `skill_path: .skilled/skills/` and the presentation contract offers `full-create`, `full-update`, `reference-only` and `asset-only`, so the README's scope is the shared skill tree rather than one runtime's copy.
- **Doctor count:** the seventeen table rows at `README.md:646-662` match the seventeen command files in `.skilled/commands/doctor`.

## Ruled Out

- **A stale second `/create:skill` reference in the README:** `grep -n "create:skill" README.md` returns only the two renamed lines, both already `/create:sk-skill`.
- **A broken command in the changed sentence:** all nine names in the `:269` sentence and all thirteen names in the `:603` list resolve to existing files.
- **A wrong Create count after the rename:** the heading, the list and the folder each carry thirteen entries; renaming a file did not change the count.
- **A command that exists only in the source tree:** the `.opencode` and `.claude` command mirrors carry `create/sk-skill.md`, so the README name is reachable on the runtime surfaces that mirror the group.
- **A stale instruction inside the renamed command:** the presentation contract, the confirm workflow's completion actions and the group index all use `/create:sk-skill`; no old name remains in the commands tree.

## Next Focus

- Dimension: correctness and maintainability
- Focus area: the two changed lines as claims rather than names, plus the counts and mode sentences they sit in, checked against the files they describe
- Reason: traceability is swept; the remaining risk is a true-looking name attached to a false behaviour, count or mode claim
- Rotation status: traceability complete; correctness, security and maintainability have a first pass and need a second read
- Required evidence: per-claim file:line read with one concrete input per candidate
- Recovery note: none

Review verdict: PASS
