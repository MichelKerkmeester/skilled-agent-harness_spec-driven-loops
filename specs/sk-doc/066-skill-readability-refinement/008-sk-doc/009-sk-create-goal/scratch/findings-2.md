### .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:13 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook before the overview, so the file opens with no intro. | Insert after line 13: `Open this reference when a goal is at or near the 4,000-character cap, or before a parent goal's chat slice goes to an operator.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:15 | 4 | The overview is a single unlabeled paragraph, so it opens with neither Purpose nor When to Use. | Replace lines 15-17 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Use the packet report to check a top-level goal or phase parent. Keep every completion criterion when cutting an over-budget parent.

    ### When to Use

    Open section 2 for the one rule on which goals carry the cap, section 3 for the one full cut order and section 4 for the one full rule on what a parent goal sent in chat contains. Other documents point here rather than restating them.
    ```
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md:33 | 5 | The cap's applicability rule sits after the command and the instructions for reading its output, so a reader can measure a phase child that is exempt and read the resulting `packet_budget=unknown` as a manifest fault. | Move the paragraph beginning `The cap applies to a top-level packet` (line 33) to immediately before `Run this command from the repository root:` (line 23), keeping the paragraph and its citations unchanged.

### .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:14 | 3 | The H1 is followed by the `---` divider and `## 1. OVERVIEW AND SOURCE CHECK`; the reference template requires a 1-2 sentence hook before the overview. | Insert after line 14: `Open this before drafting any packet goal, especially when the phase map and the folders on disk might disagree.` followed by a blank line, leaving the existing `---` in place.
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/parent-and-nested-goals.md:18 | 1,2,4 | The first H2 compounds OVERVIEW with `AND SOURCE CHECK` (validator: `render_overview_heading`), and the section then opens with source-check prose rather than Purpose and When to Use. | Replace the block from line 18 through `Never create or edit \`goal.md.tmpl\` in this mode.` with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Draft or revise a packet goal from the packet's own sources, following the workflow for its kind.

    ### When to Use

    Use these workflows only after the packet and its phase structure exist.

    ### Source Check

    Read [`authoring-standards.md`](authoring-standards.md) and [`goal-exemplars.md`](../assets/goal-exemplars.md) before drafting. Start from the template for the goal's kind: [`goal-top-level-template.md`](../assets/goal-top-level-template.md), [`goal-phase-parent-template.md`](../assets/goal-phase-parent-template.md) or [`goal-phase-child-template.md`](../assets/goal-phase-child-template.md). Each is a checked copy of system-spec-kit's [goal template](../../../system-spec-kit/templates/addons/goal.md.tmpl), which owns the file structure.

    Classify the target before writing. A top-level packet has its own specification and no parent packet spec. A phase parent has direct numbered phase-child folders. A nested child has a parent folder that contains `spec.md`.

    Read the target's own `spec.md` and `acceptance-criteria.md`. For a phase parent, also read its Phase Documentation Map. For a nested child, use only that child's specification and acceptance criteria for its phase goal. Stop if a required source is missing or if the sources conflict. Name the conflict instead of choosing a truth silently.

    Use [`create.sh`](../../../system-spec-kit/runtime/cli/spec/create.sh) when scaffolding a packet with its other documents, and fill the `goal.md` it writes. For an existing packet or a missing goal, copy the block between the markers of the matching asset template. Never create or edit `goal.md.tmpl` in this mode.
    ```
