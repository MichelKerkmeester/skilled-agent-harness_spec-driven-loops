---
name: sk-documentation
description: "Unified markdown and OpenCode component specialist providing document quality enforcement, content optimization, component creation workflows (skills, agents, commands), ASCII flowcharts and install guides."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 1.1.1.0
---

# Documentation Creation Specialist

Orchestrates document quality enforcement, component scaffolding, and flowchart generation across OpenCode skill graphs, READMEs, and structured markdown.

> **Navigation note:** This is a supplemental deep-dive index. `SKILL.md` remains the primary entrypoint for activation rules, routing logic, and core behavior. Use this index for focused content on specific topics.

## Map of Content (MOC)

### Foundation
- [[nodes/when-to-use|When to Use]] — Triggers for document validation, README creation, component scaffolding, and flowchart generation.
- [[nodes/rules|Rules]] — Mandatory rules (ALWAYS, NEVER, ESCALATE) separated by modes (Quality, Skills, Flowcharts, etc.).
- [[nodes/success-criteria|Success Criteria]] — Definition of Document Quality Index (DQI), and checklists for completing documentation tasks.

### Workflow & Routing
- [[nodes/smart-routing|Smart Routing]] — Intent scoring and resource loading logic for the documentation workflows.

### Workflows by Mode
- [[nodes/mode-document-quality|Mode 1: Document Quality]] — How the Document Quality Index (DQI) pipeline uses extract_structure.py to evaluate READMEs, specs, and knowledge docs.
- [[nodes/mode-component-creation|Mode 2: Component Creation]] — Workflows for creating Skills, Agents, and Commands in OpenCode.
- [[nodes/mode-flowchart-creation|Mode 3: Flowchart Creation]] — Patterns and syntax for generating ASCII flowcharts for workflows and decision trees.
