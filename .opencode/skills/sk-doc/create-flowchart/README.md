# create-flowchart

Generate and validate ASCII-style markdown flowcharts from real processes, decisions, journeys, loops, parallel work, or system interactions.

## 1. OVERVIEW

This workflow packet turns a real process, decision tree, user journey, or system interaction into a validator-passing ASCII flowchart, using the packet's six pattern assets and its local validator (`scripts/validate_flowchart.sh`) instead of inventing diagram structure from scratch.

## 2. WHEN TO USE

Use this packet when you need to:

- Turn a written process into a readable markdown flowchart.
- Document branching logic, approval gates, retries, or terminal outcomes.
- Show parallel execution with a join/synchronization point.
- Map a user onboarding journey or multi-step UX path.
- Draw system interactions across services, APIs, storage, queues, caches, or layers.
- Validate an existing markdown flowchart for readability and structural issues.

Do not use it when a short bullet list is clearer, or when the requested output is Mermaid, Graphviz, SVG, HTML, screenshots, or a design-canvas artifact.

## 3. WHAT'S INSIDE

- `SKILL.md`  
  The authoritative packet contract: activation triggers, routing rules, authoring workflow, validation requirements, and success criteria.

- `references/`  
  Overflow guidance beyond the inline contract, dissected into single-concern files behind a route-map: `README.md` (reference map), `worked_example.md` (a validator-passing decision-tree example), `notation_and_validator.md` (validator mechanics, box-width notation, common mistakes, and author judgment), and `pattern_selection.md` (pattern-selection detail and split heuristics).

- `assets/simple_workflow.md`  
  Pattern for linear setup, tutorial, installation, or operational flows.

- `assets/decision_tree_flow.md`  
  Pattern for conditional branching, validation paths, retries, failure handling, and alternate outcomes.

- `assets/parallel_execution.md`  
  Pattern for fan-out/fan-in work, CI/CD, batch jobs, or multi-agent execution.

- `assets/approval_workflow_loops.md`  
  Pattern for review cycles, governance gates, sign-off loops, and rework paths.

- `assets/system_architecture_swimlane.md`  
  Pattern for service, layer, API, database, queue, cache, and error-path interactions.

- `assets/user_onboarding.md`  
  Pattern for onboarding, activation, guided setup, and support journeys.

- `scripts/validate_flowchart.sh`  
  Packet-local validator for flowchart structure, connector use, branch labels, nesting depth, and size warnings.

- `changelog/`  
  Versioned packet changelog entries (for example `v1.0.0.0.md`).

For shared markdown standards and the document-level validator, this packet reuses `../shared` rather than duplicating them.

## 4. QUICK START

`SKILL.md` holds the authoritative numbered authoring workflow — read it first. In brief: pick the closest pattern from `assets/`, draft with real source content and labeled branches, then run the packet-local validator before delivery:

```bash
bash scripts/validate_flowchart.sh <target-flowchart.md>
```

Fix validator errors before delivery; treat warnings as readability issues. Use `SKILL.md` for the full step-by-step workflow and `references/README.md` for overflow depth.

Example request:

```text
Create an ASCII flowchart for the release approval workflow, including rejection loops and final shipped/blocked outcomes.
```

Likely pattern:

```text
assets/approval_workflow_loops.md
```

## 5. HUB RELATIONSHIP

`create-flowchart` is a nested workflow packet of the `sk-doc` parent hub.

The shared create-quality-control backbone lives at:

```text
../shared
```

The single advisor identity and workflow registry live at the sk-doc hub root, not inside this packet. This packet must not add packet-local advisor metadata such as `graph-metadata.json`.
