---
name: create-flowchart
description: Generate and validate ASCII flowcharts using packet-local patterns plus the flowchart validator gate.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-flowchart, ascii flowchart, diagram, decision tree, workflow diagram, swimlane, parallel execution, approval loop, validate_flowchart -->

# Create Flowchart

`create-flowchart` is the `sk-doc` workflow packet for creating ASCII-style markdown flowcharts from real processes, decision trees, user journeys, approval loops, parallel pipelines, and system interactions. The core creation workflow lives here. The pattern assets under `assets/flowcharts/` are examples and shape guides, not the primary contract.

This packet owns flowchart authoring and `scripts/validate_flowchart.sh`. It uses shared sk-doc quality standards from `../shared/` when surrounding markdown quality is in scope. It must not add packet-local advisor metadata such as `graph-metadata.json`.

---

## 1. When To Use

Use this packet when the request asks to:

- Create an ASCII or box-drawing flowchart in markdown.
- Turn a written process into a visual workflow diagram.
- Document branching logic, decision outcomes, retries, escalation paths, or terminal states.
- Show parallel execution with fan-out, fan-in, and synchronization points.
- Map onboarding, activation, guided setup, or support journeys.
- Draw system interactions across services, layers, APIs, databases, queues, caches, or error paths.
- Validate an existing markdown flowchart for structure, connector, size, branch-label, nesting, or readability issues.

Do not use this packet when:

- A short 2-3 step bullet list is clearer.
- The requested output is Mermaid, Graphviz, SVG, HTML, screenshot, canvas, or interactive design work.
- The work is general markdown quality without a flowchart deliverable.
- The requested artifact is a README, skill, command, agent, benchmark, catalog, or testing playbook.

If the target path is unknown and writing would be a guess, ask for the path before creating or editing a file.

---

## 2. Required Inputs

Before drafting, establish:

- Target artifact: standalone flowchart file or embedded section in an existing markdown document.
- Source process: the real workflow, user journey, system interaction, approval cycle, or decision tree being represented.
- Audience: who must understand the diagram and what decision or action it should support.
- Scope boundary: what is included, what is intentionally omitted, and whether surrounding prose is in scope.
- Terminal outcomes: success, failure, blocked, canceled, complete, published, deployed, or equivalent end states.
- Validation command: the exact path that will be passed to `scripts/validate_flowchart.sh`.

Read the target file before editing it. Use `Glob` or `Grep` to locate nearby diagrams and preserve the local style when editing an existing document.

---

## 3. Pattern Selection

Choose one closest pattern before drafting. Load the asset for visual guidance and adapt it to the real workflow.

| Workflow Shape | Pattern Asset | Use For |
| --- | --- | --- |
| Linear sequence | `assets/flowcharts/simple_workflow.md` | Installation steps, setup flows, tutorials, basic operational processes. |
| Conditional branching | `assets/flowcharts/decision_tree_flow.md` | Decision trees, validations, retries, alternate outcomes, failure handling. |
| Parallel execution | `assets/flowcharts/parallel_execution.md` | CI/CD, multi-agent work, batch jobs, fan-out/fan-in pipelines. |
| Approval and revision | `assets/flowcharts/approval_workflow_loops.md` | Review cycles, governance gates, sign-off loops, rework paths, escalation. |
| System swimlane | `assets/flowcharts/system_architecture_swimlane.md` | Layers, services, APIs, storage, caches, queues, data flows, error paths. |
| User journey | `assets/flowcharts/user_onboarding.md` | Onboarding, activation, progressive setup, education, completion states. |

Use the pattern's demonstrated features, not its content. Do not copy placeholder business logic, fake timings, fake owners, or unrelated system components.

---

## 4. Output Shape

For a standalone flowchart file, use this shape unless the surrounding project has a stronger local convention:

```markdown
# <Flowchart Name>

Brief purpose, audience, and scope.

```text
<ASCII flowchart>
```

Validation:
- `<command>` -> `<result>`
```

For an embedded flowchart, preserve the host document's heading level and style. Add only the surrounding prose needed to interpret the diagram, such as purpose, assumptions, legend, or follow-up notes.

A valid flowchart includes:

- A clear title or section heading.
- A start or entry state.
- Action boxes for concrete steps.
- Decision points where the workflow branches.
- Explicit branch labels on every decision. The validator (§8) recognizes `[YES]`/`[NO]` or `✓`/`✗`, so each decision node must carry at least one of those forms; add a descriptive word (`Approved`, `Rejected`, `Success`, `Failed`, `Valid`, `Invalid`) alongside when it helps the reader.
- Retry, loop-back, escalation, skip, or fallback paths when they exist in the real workflow.
- Join or synchronization points for parallel work.
- At least one terminal outcome for workflows that can end.
- Plain-text connectors that remain readable in raw markdown.

---

## 5. Notation Rules

Use consistent ASCII or box-drawing notation throughout one diagram.

Preferred shapes:

- Rounded boxes with `╭ ╮ ╰ ╯` for start, end, and major terminal states.
- Rectangular boxes with `┌ ┐ └ ┘` for action steps, stages, components, and grouped blocks.
- Diamond-like shapes with `╱ ╲` for decisions or questions.
- Vertical arrows `▼` for primary top-to-bottom flow.
- Horizontal arrows `──▶` or branch lines for side-by-side steps.
- Branch labels placed next to the outgoing path, not buried in prose. On decision branches use `[YES]`/`[NO]` or `✓`/`✗` so the diagram passes the validator's decision-label check (§8); pair them with a descriptive word when clarity needs it.
- Section bands for stages, swimlanes, layers, or grouped phases when they improve scanning.

Keep widths consistent. The validator allows limited width variation, but too many widths create warnings or errors. Prefer fewer, clearer nodes over exhaustive detail.

---

## 6. Creation Workflow

Follow this order for every creation or rewrite task:

1. Identify the workflow type, target path, audience, and source material.
2. Read the existing target document before editing, or confirm the new file path before writing.
3. Search nearby documents for existing diagram style when editing an established docs area.
4. Select and read exactly the closest pattern asset from `assets/flowcharts/`.
5. Extract the real nodes from the source: start state, actions, decisions, branch outcomes, retries, parallel lanes, joins, terminal states, and failure paths.
6. Remove anything not supported by the source. Mark unknowns as unknown or ask, rather than inventing steps.
7. Draft the diagram in a fenced code block using consistent width, spacing, connectors, and branch labels.
8. Add only necessary prose around the diagram: purpose, assumptions, legend, or validation evidence.
9. Validate the diagram with the packet-local script.
10. Fix validator errors before delivery. Treat warnings as readability defects and address them when practical.
11. If the flowchart is embedded in a larger edited markdown document and surrounding markdown is in scope, run the shared document validator.
12. Report or include the exact validation command and outcome when handing off.

Validator command from this packet directory:

```bash
bash scripts/validate_flowchart.sh <target-flowchart.md>
```

Shared document validation, only when the surrounding markdown document is in scope:

```bash
python3 ../shared/scripts/validate_document.py <document.md>
```

---

## 7. Pattern-Specific Build Rules

For linear workflows:

- Use a single top-to-bottom path.
- Number stages only when sequence matters.
- Include durations, owners, or details only when present in the source.
- End with a concrete completion state.

For decision trees:

- Make each decision a visible question.
- Label every outgoing branch.
- Show retry and fallback paths explicitly.
- Merge paths only where the real process converges.
- Split the diagram if branching becomes too dense to read.

For parallel execution:

- Show the fan-out point before concurrent work begins.
- Use separate boxes for each concurrent lane.
- Show the fan-in or synchronization point.
- Add an aggregate result or gate after the join when the workflow depends on all branches.
- Include failure handling for branch or aggregate failure when it exists.

For approval loops:

- Separate review stages clearly.
- Show who reviews or what gate is being applied when known.
- Show revision loops back to the correct stage.
- Show escalation paths for major changes, priority issues, or repeated failure.
- Avoid infinite-looking loops; include a terminal blocked, rejected, restart, or approved outcome where applicable.

For system swimlanes:

- Use layer or service bands for client, gateway, service, database, cache, queue, or similar boundaries.
- Annotate connector transitions with data or protocol when known.
- Show success and error paths when both matter.
- Keep request and response direction clear.
- Do not invent services, databases, queues, or caches.

For user journeys:

- Show user-facing milestones, validation, feedback, and completion states.
- Include education or value-proposition moments only when they are part of the journey.
- Use embedded sub-processes for multi-step setup flows.
- Show draft, skip, retry, support, or completion options when present.
- Preserve motivation and progress cues if they are part of the source experience.

---

## 8. Validator Contract

`scripts/validate_flowchart.sh` is required before delivery for any generated or edited flowchart file.

It checks:

- Box-width consistency by counting horizontal rule width variations.
- Connector presence when boxes exist.
- Decision branch labeling when decision-like text is detected.
- Nesting depth based on indentation.
- Overall line count, with split recommendations for large diagrams.

Exit behavior:

- Exit `0`: validation passed, including warning-only runs.
- Exit `1`: validation failed and blocks delivery until errors are fixed.

Important thresholds and messages:

- More than 5 box width variations is an error.
- More than 3 box width variations is a warning.
- Boxes with no arrows or connectors is an error.
- Detected decisions without `[YES]`, `[NO]`, `✓`, or `✗` labels can error.
- Nesting deeper than level 6 warns to split or use swimlanes.
- Files over 200 lines warn that the flowchart may need splitting.

If the validator cannot run, report the exact command, failure, and what was manually checked. Do not claim a clean validation result.

---

## 9. Rules

Always:

- Read before editing.
- Load the closest pattern asset before drafting.
- Base nodes and outcomes on real source content.
- Label every decision branch.
- Include terminal states when the workflow can end.
- Keep raw markdown readable in a terminal.
- Use one visual style within a diagram.
- Run `bash scripts/validate_flowchart.sh <target-flowchart.md>` before handoff.
- Run shared markdown validation when editing the larger document is in scope.

Never:

- Add packet-local `graph-metadata.json`.
- Deliver an unvalidated flowchart unless the validator failure is reported.
- Use a diagram where a short list is clearer.
- Mix incompatible diagram styles without a local-document reason.
- Leave decision nodes with unlabeled branches.
- Treat pattern assets as static wrappers.
- Add placeholder nodes, fake timings, fake owners, fake services, fake databases, or invented success criteria.
- Hide unresolved ambiguity inside a polished-looking diagram.

Escalate or ask when:

- Branch outcomes are ambiguous enough that drafting would invent behavior.
- The flowchart is too large and should be split into multiple diagrams.
- The user needs Mermaid, HTML, SVG, or a design-tool artifact.
- Validator errors conflict with a required existing document style.
- The target path is unknown and writing would be a scope guess.

---

## 10. Success Criteria

The task is successful when:

- The chosen pattern matches the workflow shape.
- The diagram reflects the real source process rather than generic filler.
- Branches, retries, joins, escalations, skip paths, and terminal states are explicit where applicable.
- The flowchart is readable in raw markdown and rendered markdown.
- `scripts/validate_flowchart.sh` exits `0` for the flowchart target, or the validator failure is explicitly reported.
- Shared sk-doc validation is run when the surrounding markdown document is edited and in scope.
- No packet-local advisor metadata is created.

For long examples and visual pattern details, use `assets/flowcharts/*`. For deeper creation guidance — a worked decision-tree example, validator mechanics and notation, pattern selection, and common pitfalls — use the reference route-map at `references/README.md`, which maps each concern to a focused single-concern file. For shared markdown standards and document-level validation behavior, use `../shared/`.
