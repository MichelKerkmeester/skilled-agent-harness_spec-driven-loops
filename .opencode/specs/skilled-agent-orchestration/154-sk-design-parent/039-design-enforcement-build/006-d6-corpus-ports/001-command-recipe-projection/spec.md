---
title: "D6-R1 — Command-surface projection layer"
description: "Add a sibling `command-metadata.json` (argumentGrammar + choreography[] + outputContract + nextOptions[]) projecting over the 5 workflowMode keys and generate the design command wrappers from it."
trigger_phrases:
  - "d6-r1 command recipe projection"
  - "command metadata design build"
importance_tier: "normal"
contextType: "planning"
status: "planned"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-scaffold | v1.0 -->
# D6-R1 — Command-surface projection layer

## 1. OBJECTIVE
Port the command-as-workflow-recipe architecture into sk-design's thin `/design:*` wrappers by adding a parseable command projection layer over the existing mode registry.

## 2. WHY
designer-skills-main treats commands as task recipes carrying typed `argument-hint` grammar, ordered named-skill choreography, and follow-up suggestions ("commands are workflows - verbs / skills run underneath them"). sk-design's wrappers today return only `STATUS=OK|FAIL` with no machine-readable argument or choreography contract.

## 3. TARGET & CLASS
- **Target file(s):** `.opencode/skills/sk-design/command-metadata.json` (new sibling); generated `.opencode/commands/design/*.md`; `.opencode/skills/sk-design/mode-registry.json` (kept as identity)
- **Severity:** P1
- **Enforcement class:** enforceable
- **Dimension:** D6 — Corpus Ports
- **Feeds:** D2

## 4. BUILD OUTLINE
- Define the `command-metadata.json` schema: `command`, `ownerModes[]`, `argumentGrammar`, `choreography[]`, `outputContract`, `nextOptions[]`.
- Project the schema over the 5 `workflowMode` keys; keep `mode-registry.json` identity-only.
- Generate `commands/design/{audit,foundations,interface,md-generator,motion}.md` from the metadata.
- Add a regen/drift hook so wrapper frontmatter equals metadata.

## 5. ACCEPTANCE
- `command-metadata.json` parses; every `workflowMode` key resolves to one recipe; generated wrappers match metadata (consumed by the D6-R8 surface check).

## 6. EVIDENCE
- `.opencode/specs/skilled-agent-orchestration/154-sk-design-parent/external/designer-skills-main/README.md:113` — "What are skills and commands?" defines commands-as-workflow-verbs.
- Source: `research/research.md` §9 (D6-R1)

## 7. STATUS
planned — plan.md / tasks.md / checklist.md authored when executed.
