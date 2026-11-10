### .skilled/skills/sk-doc/sk-create-goal/README.md
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:149 | 8 | The scenario index is one file short: `manual-testing-playbook/goal-authoring/` holds ten scenario docs (SCG-001 to SCG-010), the playbook root says ten, and the package validator prints `scenarios=10`, yet this sentence says nine and the table below lists nine. | Replace `holds nine deterministic operator scenarios` with `holds ten deterministic operator scenarios`, and after the `refuse-leftover-placeholder.md` row insert: `| \`refuse-leftover-placeholder-conversation.md\` | An unresolved decision fails first and passes once the operator supplies it on a later turn |`
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:173 | 1 | The documented expected output does not match the command: the suite reports `tests 32, pass 29, fail 3`, not `pass 53, fail 0`, and the three failures are the template-parity tests against `goal.md.tmpl`, so the parity claim is also false. | Replace `\`pass 53\`, \`fail 0\`` with `\`pass 32\`, \`fail 0\`` and repair the three template-parity failures before claiming `fail 0`.
- [P1] .skilled/skills/sk-doc/sk-create-goal/README.md:175 | 1 | The playbook validator prints `scenarios=10` for this package, so `scenarios=9` cannot be the output of a passing run. | Replace `scenarios=9` with `scenarios=10`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/README.md:183 | 8 | The related-documents table maps the packet's files but never lists `ROUTER.md`, the sibling router `SKILL.md` tells readers to open before selecting resources. | After the `SKILL.md` row insert: `| [\`ROUTER.md\`](./ROUTER.md) | The intent model, the pre-write routing decisions and the machine router |`

### .skilled/skills/sk-doc/sk-create-goal/ROUTER.md
- [P1] .skilled/skills/sk-doc/sk-create-goal/ROUTER.md:36 | 1 | The intent model promises that `UNKNOWN_FALLBACK` reports a disambiguation checklist, but the machine block's `UNKNOWN_FALLBACK` object (lines 71-75) carries no checklist and nothing else supplies one; the router template requires `UNKNOWN_FALLBACK_CHECKLIST`. | Replace `and reports \`UNKNOWN_FALLBACK\` with the disambiguation checklist instead of guessing a family.` with `and reports \`UNKNOWN_FALLBACK\` instead of guessing a family.`; the missing constant is a router-source fix.
- [P2] .skilled/skills/sk-doc/sk-create-goal/ROUTER.md:45 | 1 | The sentence has no verb and restates the two H3 headings that follow, so it reads as a leftover list fragment at the head of the machine section. | Delete line 45.

### .skilled/skills/sk-doc/sk-create-goal/SKILL.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/SKILL.md:119 | 1 | The link description names `its scorer`, but `scripts/README.md` and the `scripts/` folder contain no scorer; the sentence describes only the checker, the lint and their tests. | Replace `describes the checker, the advisory criteria lint, its scorer and their tests.` with `describes the checker, the advisory criteria lint and their tests.`

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:13 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the asset template requires a 1-2 sentence hook before the overview. | Insert after line 13: `Settle a drafting question against a classified example when the rule wording alone does not decide it.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/assets/goal-exemplars.md:15 | 4 | The overview is two unlabeled paragraphs, so it opens with neither Purpose nor Usage as the asset template requires. | Insert `### Purpose` before line 17 and `### Usage` before line 19.

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-child-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-phase-parent-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md
- clean

### .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:14 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook before the overview. | Insert after line 14: `Open this while a goal is being drafted or reviewed: each rule names the failure it prevents and the question that settles it.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-doc/sk-create-goal/references/authoring-standards.md:16 | 4 | The overview is an unlabeled paragraph, so it opens with neither Purpose nor When to Use; the reference skeleton requires both before any other overview content. | Replace lines 16-18 with `## 1. OVERVIEW`, a blank line, `### Purpose`, a blank line, the existing paragraph, a blank line, `### When to Use`, a blank line and these bullets: `- Writing or revising a packet \`goal.md\`.`, `- Deciding whether a completion criterion is self-contained.`, `- Reviewing a goal before it is handed to an operator.`

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

