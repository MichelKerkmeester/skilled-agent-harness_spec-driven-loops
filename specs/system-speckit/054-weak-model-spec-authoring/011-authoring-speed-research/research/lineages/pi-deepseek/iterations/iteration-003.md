# Iteration 3: Verify clauses, acceptance criteria and the cost of the protection surfaces

## Focus

What do task `Verify:` clauses, `acceptance-criteria.md` checklists and the authoring card cost to author, and where do they prevent rework? Measure the volume of each protection surface per level and check whether the shipped examples show the author what the template demands.

## Actions Taken

- Counted tasks, table rows and `Verify:` occurrences in the shipped level-1, level-2 and level-3 example packets.
- Compared the task-format contract in the `tasks.md` template body against the same template's frontmatter description.
- Read the level-2 and level-3 acceptance-criteria examples for the criterion row shape and its verification column.
- Read the level recommender's scoring weights, thresholds and level mapping, then read `create.sh`'s accepted `--level` values to test whether the recommender's output is reachable.
- Read the authoring card's BOUNDS, PICK THE LEVEL and CLOSE sections for what the author is allowed and required to do.
- Read the framework's small-task definition in the workflow quick reference.

## Findings

1. The task-format contract contradicts itself inside one template: the body requires `T### [P?] Description (file path). Verify: <command> prints <expected output>`, while the same file's frontmatter description states the format without any `Verify:` clause at all. [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:53] [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:15]
2. No shipped example demonstrates the Verify clause the template demands: the level-1, level-2 and level-3 example `tasks.md` files hold 16, 27 and 42 tasks and zero `Verify:` occurrences between them, so a model that copies the example writes the one element the template calls mandatory zero times. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md:54] [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md:1]
3. The Verify clause is the most expensive per-task element and the only one that cannot be authored from the packet alone: at Level 3 it is 42 command-plus-expected-output pairs, each of which must name a command that actually runs, against a fill note that asks for exactly that and gives one worked example per section. [SOURCE: .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl:71]
4. Acceptance criteria author the same proof a second time: one row per criterion with `AC-ID`, `REQ`, Given/When/Then, `Verification`, `Status` and `Waiver` (13 rows in both the Level-2 and Level-3 examples), where the `Verification` cell cites the same test path a task's `Verify:` command would run. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md:39]
5. Level selection is not where the ceremony lives: the recommender is one command with fixed weights (35 LOC, 20 file count, 25 risk flags, 20 complexity) and fixed thresholds (25, 45, 70), so choosing costs one call and is deterministic, while everything the chosen level then requires is authored by hand. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:37]
6. The floor for any non-exempt work is four documents: the recommender can print Level 0 below 25 points, `create.sh` accepts only levels 1, 2, 3, 3+, phase-parent, review or research, and the authoring card closes the gap by telling the author to use `--level 1`, so quick work still means `spec.md`, `plan.md`, `tasks.md` and later `implementation-summary.md`. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh:44] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:95] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:38]
7. "Small" is defined by documentation burden rather than risk: the quick reference defines small as exempt work or work that stays Level 1 after every factor, and explicitly says a Level 2 or Level 3 task that fails phase qualification is not automatically small, so nothing between "exempt" and "four documents" exists. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/quick-reference.md:258]
8. The authoring card forbids the author to save continuity: its BOUNDS section lists `generate-context.js` and `/speckit:save` as forbidden, and its CLOSE checklist never mentions a continuity save, so the one step that survives across sessions is off-card and left to whoever runs after the author. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:25] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:150]
9. The card models the ceremony it imposes: 11 numbered sections, each carrying its own acceptance condition and its own `Verify:` line, which is 22 more authoring slots to read before the packet's first write. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:162]
10. Level volume scales the task list but not the fixed checks, and the card does not distinguish them: Level 1 carries 16 tasks and 5 table rows against Level 3's 42 tasks and 19 rows, while the required anchor counts stay fixed per document at 7, 14, 21 and 3. [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-1/tasks.md:1] [SOURCE: .skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md:42]

## Questions Answered

- What do task Verify clauses, acceptance criteria checklists and the authoring card cost to author, and where do they prevent rework? Answered: Verify clauses cost one runnable command per task and have no shipped example; acceptance criteria duplicate the same proof; the card adds two more slots per section.
- What does the level-selection and required-section path cost on small work, and which sections are ceremony rather than protection? Answered in part: selection is cheap and deterministic, the floor is four documents, and "small" is defined by documentation rather than risk.

## Questions Remaining

- Which derived-metadata refreshes are mandatory per edit.
- The final ranked change list.

## Ruled Out

- Claiming the recommender's Level 0 is a dead end without reading the card first: the card author documents the bridge to `--level 1`, so Level 0 is a naming gap rather than a broken path.
- Counting guidance volume as a proxy for authoring cost at Level 3: the level-3 example already demonstrates 42 tasks with no Verify lines, so the cost there is a behaviour gap, not a text-volume gap.

## Dead Ends

- Looking for a Verify-clause example anywhere in the addon templates: the acceptance-criteria template carries a verification column but no task-level example, so the model has no worked `Verify:` line to copy.

## Reflection

**What worked and why**: comparing the shipped examples against the template contract. Both are small files, and the contradiction (mandatory Verify clause, zero in every example) is exactly the kind of finding that a byte count misses.

**What did not work and why**: hypothesising that the recommender's Level 0 was unusable. The card documents the bridge, so the claim would have been wrong; reading the card before writing the finding is what caught it.

**What I would do differently**: for every contract clause, check the examples in the same pass rather than treating templates and examples as separate evidence sets.

## Sources Consulted

- .skilled/skills/system-spec-kit/templates/core/tasks.md.tmpl
- .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl
- .skilled/skills/system-spec-kit/templates/examples/level-1/tasks.md
- .skilled/skills/system-spec-kit/templates/examples/level-2/tasks.md
- .skilled/skills/system-spec-kit/templates/examples/level-3/tasks.md
- .skilled/skills/system-spec-kit/templates/examples/level-2/acceptance-criteria.md
- .skilled/skills/system-spec-kit/runtime/cli/spec/recommend-level.sh
- .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh
- .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md
- .skilled/skills/system-spec-kit/references/workflows/quick-reference.md

## Recommended Next Focus

Iteration 4: derived metadata and continuity upkeep. Read how `description.json` and `graph-metadata.json` are generated and refreshed, and what `generate-context.js` writes on every save. Then determine which of those refreshes must run after each document edit and which only at packet close.

## SCOPE VIOLATIONS

- None executed. `recommend-level.sh`, `create.sh` and `generate-context.js` were read, not run, because each writes outside this lineage.
