---
title: "Command Topology Taxonomy"
description: "Fail-closed classification of every command in the frozen 36-command census into one and only one of four execution topologies."
trigger_phrases:
  - "command topology taxonomy"
  - "workflow router classification"
  - "command topology census"
importance_tier: "important"
contextType: "implementation"
---

# Command Topology Taxonomy

## 1. OVERVIEW

This taxonomy gives every command in the frozen census one execution-ownership shape so deterministic checks and behavioral scenarios can select the correct evidence contract without guessing.

## 2. CLASSIFICATION CONTRACT

Classification follows execution ownership, not filename, command family, document length, or the presence of argument branches.

| Topology | Required shape |
| --- | --- |
| `workflow router` | The command binds setup or execution mode and hands the substantive workflow to one owned workflow-YAML family or a pinned skill-mode workflow. Branches within that same workflow family do not change the topology. |
| `subaction router` | A semantic subaction or target selects among materially different workflow assets through a command-owned route table or manifest. The selected workflow, not the router Markdown, owns execution. |
| `direct-tool/plugin router` | The command intentionally owns no workflow YAML and dispatches straight to MCP tools, plugin tools, or a bounded script/tool surface. Direct-tool classification takes precedence over its internal action parsing. |
| `monolithic` | The command Markdown owns the substantive end-to-end procedure inline. It may call tools or optionally dispatch an agent, but it has no external workflow asset that owns the procedure and is not a bounded direct-tool/plugin router. |

Precedence is `direct-tool/plugin router` → `subaction router` → `workflow router` → explicit `monolithic`. `Monolithic` is not a catch-all: it requires affirmative evidence that the complete workflow lives in the command document.

## 3. FAIL-CLOSED RULE

A command is `UNCLASSIFIED` when its live source does not satisfy exactly one required shape after applying the precedence rule, its declared target asset is missing, or source evidence is insufficient to prove execution ownership. An unclassified command is never guessed into the closest topology and never silently defaulted to `monolithic`.

Any `UNCLASSIFIED` row makes the taxonomy gate exit nonzero, marks the benchmark instrument invalid, and blocks fixture, adapter, scenario, matrix, and launcher work. A new or materially reshaped command must be added to the canonical census and explicitly classified before the next benchmark run. Subject conformance is not reported from an instrument with an unresolved topology.

## 4. FROZEN CENSUS CLASSIFICATION

| Canonical source | Generated mirror | Topology | Shape evidence |
| --- | --- | --- | --- |
| `.opencode/commands/agent_router.md` | `.codex/prompts/agent_router.md` | `monolithic` | Inline discovery, identity adoption, and execution procedure; no workflow YAML. |
| `.opencode/commands/create/agent.md` | `.codex/prompts/create-agent.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/benchmark.md` | `.codex/prompts/create-benchmark.md` | `workflow router` | Presentation contract plus auto/confirm YAML; create/update stays inside one benchmark workflow family. |
| `.opencode/commands/create/changelog.md` | `.codex/prompts/create-changelog.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/command.md` | `.codex/prompts/create-command.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/feature-catalog.md` | `.codex/prompts/create-feature-catalog.md` | `workflow router` | Presentation contract plus auto/confirm YAML; create/update stays inside one catalog workflow family. |
| `.opencode/commands/create/flowchart.md` | `.codex/prompts/create-flowchart.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/manual-testing-playbook.md` | `.codex/prompts/create-manual-testing-playbook.md` | `workflow router` | Presentation contract plus auto/confirm YAML; create/update stays inside one playbook workflow family. |
| `.opencode/commands/create/readme.md` | `.codex/prompts/create-readme.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/skill-parent.md` | `.codex/prompts/create-skill-parent.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/create/skill.md` | `.codex/prompts/create-skill.md` | `workflow router` | Presentation contract plus auto/confirm workflow YAML. |
| `.opencode/commands/deep/agent-improvement.md` | `.codex/prompts/deep-agent-improvement.md` | `workflow router` | Setup binds the lane and loads owned deep-improvement workflow YAML. |
| `.opencode/commands/deep/ai-council.md` | `.codex/prompts/deep-ai-council.md` | `workflow router` | Setup and mode resolution hand the session loop to owned workflow YAML. |
| `.opencode/commands/deep/alignment.md` | `.codex/prompts/deep-alignment.md` | `workflow router` | Setup and mode resolution hand orchestration to owned alignment workflow YAML. |
| `.opencode/commands/deep/model-benchmark.md` | `.codex/prompts/deep-model-benchmark.md` | `workflow router` | Setup binds model-benchmark mode and loads owned workflow YAML. |
| `.opencode/commands/deep/research.md` | `.codex/prompts/deep-research.md` | `workflow router` | Setup and mode resolution hand the loop to owned research workflow YAML. |
| `.opencode/commands/deep/review.md` | `.codex/prompts/deep-review.md` | `workflow router` | Setup and mode resolution hand the loop to owned review workflow YAML. |
| `.opencode/commands/deep/skill-benchmark.md` | `.codex/prompts/deep-skill-benchmark.md` | `workflow router` | Setup binds Lane C and loads owned benchmark workflow YAML. |
| `.opencode/commands/design/audit.md` | `.codex/prompts/design-audit.md` | `workflow router` | Pins the sk-design audit mode and selects auto/confirm workflow YAML. |
| `.opencode/commands/design/foundations.md` | `.codex/prompts/design-foundations.md` | `workflow router` | Pins the sk-design foundations mode and selects auto/confirm workflow YAML. |
| `.opencode/commands/design/interface.md` | `.codex/prompts/design-interface.md` | `workflow router` | Pins the sk-design interface mode and selects auto/confirm workflow YAML. |
| `.opencode/commands/design/md-generator.md` | `.codex/prompts/design-md-generator.md` | `workflow router` | Pins the sk-design md-generator mode and selects auto/confirm workflow YAML. |
| `.opencode/commands/design/motion.md` | `.codex/prompts/design-motion.md` | `workflow router` | Pins the sk-design motion mode and selects auto/confirm workflow YAML. |
| `.opencode/commands/doctor/mcp.md` | `.codex/prompts/doctor-mcp.md` | `subaction router` | Positional `install` or `debug` selects distinct workflow YAML and flag schema. |
| `.opencode/commands/doctor/speckit.md` | `.codex/prompts/doctor-speckit.md` | `subaction router` | Target resolves through `_routes.yaml` to a target-specific workflow and mutation class. |
| `.opencode/commands/doctor/update.md` | `.codex/prompts/doctor-update.md` | `workflow router` | One update workflow YAML owns execution; flags configure that workflow rather than select unrelated targets. |
| `.opencode/commands/goal_opencode.md` | `.codex/prompts/goal_opencode.md` | `direct-tool/plugin router` | State-free action routing directly to `mk_goal` or `mk_goal_status`. |
| `.opencode/commands/memory/learn.md` | `.codex/prompts/memory-learn.md` | `direct-tool/plugin router` | Explicit no-YAML route to memory MCP tools and bounded constitutional-rule writes. |
| `.opencode/commands/memory/manage.md` | `.codex/prompts/memory-manage.md` | `direct-tool/plugin router` | Explicit no-YAML route to memory MCP lifecycle tools. |
| `.opencode/commands/memory/save.md` | `.codex/prompts/memory-save.md` | `direct-tool/plugin router` | Explicit no-YAML route to memory MCP tools and `generate-context.js`. |
| `.opencode/commands/memory/search.md` | `.codex/prompts/memory-search.md` | `direct-tool/plugin router` | Explicit no-YAML route to memory and code-graph MCP tools. |
| `.opencode/commands/prompt-improve.md` | `.codex/prompts/prompt-improve.md` | `monolithic` | Phase 0, setup, framework selection, inline/agent dispatch, and completion procedure live in the command Markdown. |
| `.opencode/commands/speckit/complete.md` | `.codex/prompts/speckit-complete.md` | `workflow router` | Presentation contract plus auto/confirm completion workflow YAML. |
| `.opencode/commands/speckit/implement.md` | `.codex/prompts/speckit-implement.md` | `workflow router` | Presentation contract plus implementation workflow YAML. |
| `.opencode/commands/speckit/plan.md` | `.codex/prompts/speckit-plan.md` | `workflow router` | Presentation contract plus planning workflow YAML; unattended flags remain workflow inputs. |
| `.opencode/commands/speckit/resume.md` | `.codex/prompts/speckit-resume.md` | `workflow router` | Presentation contract plus auto/confirm resume workflow YAML. |

## 5. COUNT RECONCILIATION

| Topology | Count |
| --- | ---: |
| `workflow router` | 27 |
| `subaction router` | 2 |
| `direct-tool/plugin router` | 5 |
| `monolithic` | 2 |
| **Total classified** | **36** |
| **Unclassified** | **0** |

The total equals the frozen source census in `census-snapshot.md`. The post-launcher 37th command is not preclassified here: phase 009 must add it as a `workflow router` only after its live source and generated mirror exist, then phase 010 must reconcile the final `37 / 37` census.
