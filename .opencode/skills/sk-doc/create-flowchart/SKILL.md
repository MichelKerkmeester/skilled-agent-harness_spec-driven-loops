---
name: create-flowchart
description: Generate and validate ASCII flowcharts using packet-local patterns plus the flowchart validator gate.
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: create-flowchart, ascii flowchart, diagram, decision tree, workflow diagram, swimlane, parallel execution, approval loop, validate_flowchart -->

# Create Flowchart (generate/validate workflow)

`create-flowchart` is the flowchart-authoring workflow packet of the `sk-doc` family. It turns a real process, decision tree, user journey, approval loop, parallel pipeline, or system interaction into a readable ASCII-style markdown flowchart, then validates it with the packet-local gate before handoff.

This packet owns `assets/flowcharts/*` and `scripts/validate_flowchart.sh`. It consumes shared sk-doc quality standards and markdown validators from `../shared/`; it does not own the parent hub advisor identity and must not add a packet-local `graph-metadata.json`.

---

## 1. WHEN TO USE

### Activation Triggers

Use this workflow when the request involves:
- Creating an ASCII or box-drawing flowchart in markdown.
- Turning a written process into a visual workflow diagram.
- Documenting branching logic, approval gates, retries, or terminal outcomes.
- Showing parallel execution with a join or synchronization point.
- Mapping a user onboarding journey or multi-step UX path.
- Drawing system interactions across services, layers, APIs, databases, queues, or caches.
- Validating an existing markdown flowchart for connector, size, alignment, branch-label, or nesting problems.

Keyword triggers: `flowchart`, `ASCII diagram`, `workflow diagram`, `decision tree`, `process map`, `swimlane`, `parallel execution`, `approval workflow`, `onboarding flow`, `validate flowchart`.

### When NOT to Use

Skip this workflow when:
- A 2-3 step process is clearer as a bullet list.
- The user needs Mermaid, Graphviz, SVG, HTML, or an interactive diagram instead of markdown.
- The diagram requires exact visual design, screenshots, or canvas layout tools.
- The task is general markdown quality without a flowchart deliverable; use the parent `sk-doc` quality workflow.
- The requested artifact is a README, agent, command, skill, benchmark, catalog, or testing playbook; route to that packet instead.

### Packet Boundary

This packet may create or edit markdown flowcharts and their surrounding explanatory text. It does not create new flowchart pattern assets unless explicitly asked, and it does not replace shared markdown quality rules from `../shared`.

---

## 2. SMART ROUTING

### Pattern Selection

Choose one packet-local pattern before drafting:

| User Need | Pattern Asset | Use It For |
| --- | --- | --- |
| Linear sequence | `assets/flowcharts/simple_workflow.md` | Installation steps, setup flows, tutorials, simple operational processes. |
| Conditional branching | `assets/flowcharts/decision_tree_flow.md` | Decision trees, validations, retries, alternate outcomes, failure paths. |
| Concurrent work | `assets/flowcharts/parallel_execution.md` | CI/CD, multi-agent work, batch jobs, fan-out/fan-in pipelines. |
| Approval and revision | `assets/flowcharts/approval_workflow_loops.md` | Review cycles, governance gates, sign-off loops, rework paths. |
| System interaction | `assets/flowcharts/system_architecture_swimlane.md` | Layers, services, APIs, storage, queues, caches, and error paths. |
| User journey | `assets/flowcharts/user_onboarding.md` | Product onboarding, guided setup, activation journeys, support paths. |

### Resource Loading Levels

| Level | When to Load | Resources |
| --- | --- | --- |
| ALWAYS | Any flowchart generation or validation | `../shared/references/global/quick_reference.md`, `../shared/references/global/core_standards.md` |
| ALWAYS | Before delivery | `scripts/validate_flowchart.sh`, `../shared/references/global/validation.md` |
| CONDITIONAL | Linear flow | `assets/flowcharts/simple_workflow.md` |
| CONDITIONAL | Branching flow | `assets/flowcharts/decision_tree_flow.md` |
| CONDITIONAL | Parallel flow | `assets/flowcharts/parallel_execution.md` |
| CONDITIONAL | Approval loop | `assets/flowcharts/approval_workflow_loops.md` |
| CONDITIONAL | System architecture | `assets/flowcharts/system_architecture_swimlane.md` |
| CONDITIONAL | User journey | `assets/flowcharts/user_onboarding.md` |
| ON_DEMAND | Existing-doc quality review | `../shared/scripts/extract_structure.py`, `../shared/scripts/validate_document.py` |

### Routing Rules

Use `Glob` or `Grep` to locate existing target documents and nearby diagrams before creating a new file. Match the local visual style when editing an existing document. If no target path is provided, ask where the flowchart should live before writing.

---

## 3. HOW IT WORKS

### Generate and Validate Workflow

1. Identify the flowchart purpose, audience, target file, and source process.
2. Read the target document before editing, or confirm the new output path before writing.
3. Select the closest pattern from `assets/flowcharts/`.
4. Extract the real nodes: start state, actions, decisions, branches, retries, parallel lanes, joins, terminal states, and failure paths.
5. Draft the diagram using consistent box widths, vertical flow where possible, labeled decision branches, and explicit terminal outcomes.
6. Add brief surrounding prose only when it improves interpretation: purpose, assumptions, legend, or follow-up notes.
7. Run the packet-local validator:

```bash
bash scripts/validate_flowchart.sh <target-flowchart.md>
```

8. Fix validator errors before delivery. Treat warnings as readability issues and address them when cheap.
9. If the flowchart is embedded in a larger markdown document, run shared document validation when the surrounding document is in scope:

```bash
python ../shared/scripts/validate_document.py <document.md>
```

10. Report or hand off the validator result with the exact command and outcome.

### Validator Contract

`scripts/validate_flowchart.sh` checks:
- Box-width consistency.
- Presence of arrows or connectors when boxes exist.
- Decision branch labels for detected decision points.
- Nesting depth.
- Overall line count and split recommendations.

Exit `0` means the flowchart passed, including warning-only runs. Exit `1` blocks delivery until flowchart errors are fixed.

### Authoring Standards

Flowcharts should be scannable in a terminal and in rendered markdown. Prefer fewer, clearer nodes over dense exhaustive diagrams. Use decision diamonds for questions, rectangular boxes for actions, rounded terminal boxes for start/end states, and branch labels such as `Yes`, `No`, `Approved`, `Rejected`, `Success`, or `Failed`.

---

## 4. RULES

### ALWAYS

1. Read the target file before editing it.
2. Choose and load one pattern asset before drafting.
3. Preserve the user's actual process; do not invent missing decisions or success criteria.
4. Label every decision branch with clear outcomes.
5. Include at least one terminal success or failure state when the workflow can end.
6. Keep connector paths readable in plain text, not just rendered markdown.
7. Run `bash scripts/validate_flowchart.sh <target-flowchart.md>` before delivery.
8. Use `../shared` validators and standards for surrounding markdown quality when editing a full document.

### NEVER

1. Never add a packet-local `graph-metadata.json`.
2. Never deliver an unvalidated flowchart unless the validator cannot run and the failure is reported.
3. Never use a flowchart when a short list is clearer.
4. Never mix incompatible diagram styles in the same target document without a reason.
5. Never leave decision nodes with unlabeled branches.
6. Never turn the pattern assets into static wrappers; adapt them to the user's actual workflow.
7. Never add placeholder nodes, fake timings, fake owners, or invented system components.

### ESCALATE IF

1. The source process is ambiguous enough that branch outcomes would be invented.
2. The diagram exceeds practical markdown size and should be split.
3. The user needs Mermaid, HTML, SVG, or a design-tool artifact instead of ASCII markdown.
4. The validator reports errors that conflict with an existing required document style.
5. The target path is unknown and writing a new markdown file would be a scope guess.

---

## 5. SUCCESS CRITERIA

- The selected pattern matches the workflow shape.
- The diagram is based on real source content, not generic filler.
- Branches, retries, joins, and terminal states are explicit.
- The result is readable in raw markdown and rendered markdown.
- `scripts/validate_flowchart.sh` passes for the flowchart target.
- Shared sk-doc validation is run when the flowchart is part of a larger edited markdown document.
- No packet-local advisor metadata is created.
