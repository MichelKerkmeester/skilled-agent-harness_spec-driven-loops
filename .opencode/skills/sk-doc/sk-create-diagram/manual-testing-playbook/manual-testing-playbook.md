---
title: "sk-create-diagram: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review/orchestration guidance, execution expectations, and per-feature validation files for the sk-create-diagram sk-doc workflow packet."
version: 1.0.0.0
---

# sk-create-diagram: Manual Testing Playbook

This document combines the full manual-validation contract for the `sk-create-diagram` workflow packet into a single reference. The root playbook acts as the operator directory, review protocol, and orchestration guide: it explains how realistic user-driven tests should be run, how evidence should be captured, how results should be graded, and where each per-feature validation file lives. The per-feature files provide the deeper execution contract for each scenario, including the user request, orchestrator prompt, execution process, source anchors, and validation criteria.

---

This playbook package adopts the Feature Catalog split-document pattern for the `sk-create-diagram` packet. The root document acts as the directory, review surface, and orchestration guide, while per-feature execution detail lives in the category folders at the playbook root.

Canonical package artifacts:
- `manual-testing-playbook.md`
- `diagram-generation/`
- `import-export/`
- `command-and-hub-integration/`

The feature-catalog package ships as a sibling deliverable at `feature-catalog/`. Every `**Catalog:**` reference in this package resolves against it.

### Result persistence

<!-- MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT -->
A scenario run is complete only after its `PASS`, `FAIL`, or `SKIP` outcome and reason are persisted through `run-manual-playbook-scenario.cjs` into `<skill>/benchmark/reports/<dated-run-label>/`; generated report Markdown is renderer-owned and never hand-authored.

---

## 1. OVERVIEW

This playbook covers the full operator-visible surface of the `sk-create-diagram` packet across three categories: diagram generation, import/export, and command/hub integration. Each feature keeps its original ID and links to a dedicated feature file with the full execution contract. The operator validator computes the exact census from the walked tree; this document does not hand-maintain counts.

Coverage note (2026-08-12): every scenario is runnable today against the shipped references, the `assets/templates/template*.html` variants, and the `scripts/drawio_extract.py` / `scripts/mermaid_extract.py` extractors; the PNG export scenario requires a local Playwright install and is otherwise a documented `SKIP` with a named blocker.

### Realistic Test Model

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to work locally, delegate to sub-agents, or invoke another CLI/runtime.
3. The operator captures both the execution process and the user-visible outcome.
4. The scenario passes only when the workflow is sound and the returned result would satisfy a real user.

### What Each Feature File Should Explain

- The realistic user request that should trigger the behavior
- The orchestrator brief or agent-facing prompt that should drive the test
- The expected execution process, including delegation or external CLI use when relevant
- The desired user-visible outcome
- The implementation or regression-test anchors that justify the scenario

---

## 2. GLOBAL PRECONDITIONS

1. Working directory is the repository root, so `.opencode/skills/sk-doc/sk-create-diagram/` subpaths and the `.opencode/commands/create/` assets resolve.
2. Python 3.9+ is available on `PATH` for the extraction scripts (`drawio_extract.py` / `mermaid_extract.py`).
3. For the PNG export step of IMP-003, Playwright (`playwright` Python package + Chromium) must be installed; otherwise IMP-003 is a documented `SKIP` with a named blocker and a surfaced install instruction.
4. Generated artifacts (`.html`, `.svg`, `.png`) are written to a scratch or docs output directory outside the packet. The one documented in-package mutation is `references/foundations/style-guide.md` during the onboarding scenario (DIA-003), which runs on a scratch checkout or is reverted with `git checkout -- .opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md`.
5. No destructive scenarios exist — the skill only writes new files and never mutates source inputs — but every import and export scenario MUST confirm the source file is byte-unchanged afterward.

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

- Command transcript
- User request used
- Orchestrator or agent-facing prompt used
- Delegation or runtime-routing notes when applicable
- The exact prompt, expected signals, and pass/fail criteria from the per-feature file
- Output snippets (digest output, grep results, validator output)
- Generated artifact path and, where applicable, a source-file checksum before and after
- Scenario verdict with rationale (`PASS` / `FAIL` / `SKIP`)

---

## 4. DETERMINISTIC COMMAND NOTATION

- CLI commands shown as `python3 <script> <args>` or `node <script> <args>`.
- Bash commands shown as `bash: <command>`.
- Agent prompts shown as `agent: <instruction>` — these scenarios are agent-driven, so the "command" is what an agent does: read a reference, run a script, write an HTML file.
- `->` separates sequential steps.
- Repo-relative paths are written as `.opencode/skills/sk-doc/sk-create-diagram/...`; `<skill-dir>` means the packet root wherever the packet is installed.

---

## 5. REVIEW PROTOCOL AND RELEASE READINESS

### Inputs Required

1. `manual-testing-playbook.md`
2. Referenced per-feature files under `manual-testing-playbook/<category>/`
3. Scenario execution evidence
4. Feature-to-scenario coverage map
5. Triage notes for all non-pass outcomes

### Scenario Acceptance Rules

For each executed scenario, check:

1. Preconditions were satisfied.
2. Prompt and command sequence were executed as written.
3. Expected signals are present.
4. Evidence is complete and readable.
5. Outcome rationale is explicit.

Scenario verdict:
- `PASS`: all acceptance checks true
- `FAIL`: expected behavior missing, contradictory output, or a critical check failed
- `SKIP`: a specific sandbox or runtime blocker prevents execution (each `SKIP` must name the blocker)

### Feature Verdict Rules

- `PASS`: all mapped scenarios for feature are `PASS`
- `FAIL`: any mapped scenario is `FAIL`
- `SKIP`: every mapped scenario is blocked by a named sandbox or runtime blocker

Hard rule:
- Any critical-path scenario `FAIL` (DIA-001, DIA-002, IMP-001, IMP-002, CMD-001) forces the feature verdict to `FAIL`.

### Release Readiness Rule

Release is releasable only when:

1. No feature verdict is `FAIL`.
2. All critical scenarios are `PASS`.
3. Coverage is 100% of playbook scenarios defined by the root index and backed by per-feature files.
4. No unresolved blocking triage item remains.

### Root-vs-Feature Rule

Keep global verdict logic in the root playbook. Put feature-specific acceptance caveats in the matching per-feature files.

---

## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

### Purpose

This section records wave planning and capacity guidance for the manual testing package. It is not a runtime support matrix by itself.

### Operational Rules

1. Probe runtime capacity at start.
2. Reserve one coordinator.
3. Saturate remaining worker slots.
4. Pre-assign explicit scenario IDs and matching per-feature files to each wave before execution.
5. Run the style-guide mutation scenario (DIA-003) in a wave that first confirms the recovery path (git revert or scratch checkout) is available.
6. After each wave, save context and evidence, then begin the next wave.
7. Record utilization table, per-feature file references, and evidence paths in the final report.

### What Belongs In Per-Feature Files

- Real user request
- Prompt field following the Role -> Context -> Action -> Format contract
- Expected delegation or alternate-CLI routing
- Desired user-visible outcome
- Feature-specific acceptance caveats or isolation constraints

---

## 7. DIAGRAM GENERATION (`DIA-001..DIA-004`)

### DIA-001 | Type selection and routing

#### Description
Verify that the agent selects the correct diagram type from the 27-type selection guide and loads the matching `references/types/type-*.md` convention plus `references/foundations/style-guide.md` before drawing.

#### Scenario Contract
Prompt: `Create an architecture diagram as a self-contained HTML file showing our checkout service, the auth service it calls, and the Postgres store behind it. Load the right type conventions, apply the style guide, and save it to docs/checkout-architecture.html.`

The router classifies the request as GENERATE, the selection guide maps "components + connections" to Architecture, and the agent loads `references/types/type-architecture.md` before drawing. The output must satisfy the type fit and accessible-SVG checks.

Desired user-visible outcome: a correct-typed, self-contained HTML diagram at the requested path.

#### Test Execution
> **Feature File:** [DIA-001](diagram-generation/type-selection-and-routing.md)
> **Catalog:** [type-selection-and-routing](../feature-catalog/diagram-generation/type-selection-and-routing.md)

---

### DIA-002 | Editorial style and connectors

#### Description
Verify the design system is applied exactly: 4px grid, one accent on at most 2 focal elements, the five mandatory connector rules, correct typography roles, and the legend as a bottom strip.

#### Scenario Contract
Prompt: `Create a swimlane diagram as a self-contained HTML file of the support handoff process across L1, L2, and ops. Use the editorial design system: 4px grid, accent on at most 2 focal elements, orthogonal rounded elbows on all off-axis connectors, fanned attach points, masked arrow labels with a visible gap, and a horizontal bottom legend. Save it to docs/support-handoff.html.`

The agent applies `references/types/type-swimlane.md` conventions and runs the taste gate before delivery.

Desired user-visible outcome: a clean, readable swimlane whose every coordinate, connector, and accent obeys the design-system rules.

#### Test Execution
> **Feature File:** [DIA-002](diagram-generation/editorial-style-and-connectors.md)
> **Catalog:** [editorial-style-and-connectors](../feature-catalog/diagram-generation/editorial-style-and-connectors.md)

---

### DIA-003 | Onboarding flow

#### Description
Verify the style-guide gate fires before the first diagram in a project and that onboarding (URL / skill / folder) extracts tokens, proposes a mapped diff, and rewrites `style-guide.md` only after approval.

#### Scenario Contract
Prompt: `This is the first diagram in this project. The style guide is still at the shipped default accent. Run the onboarding gate, then onboard from my site https://example.com — extract the palette and fonts, map them to the semantic roles, propose the style-guide.md diff, and wait for my approval before writing.`

The gate is skipped only when the `accent` token differs from the shipped default; extraction maps roles with confidence, runs contrast checks, and never writes without approval.

Desired user-visible outcome: a confirmed gate question and a style-guide.md that reflects only the approved tokens.

#### Test Execution
> **Feature File:** [DIA-003](diagram-generation/onboarding-flow.md)
> **Catalog:** [onboarding-flow](../feature-catalog/diagram-generation/onboarding-flow.md)

---

### DIA-004 | Primitive variants

#### Description
Verify the on-demand primitives: annotation callouts (italic serif, dashed Bézier leader, max 2), the sketchy filter (shapes only, never text), the terminal skin (mono throughout, one accent), and the monochrome icon library (`currentColor`).

#### Scenario Contract
Prompt: `Create a loop diagram as a self-contained HTML file in a sketchy, hand-drawn register with two annotation callouts and an editorial light layout. Save it to docs/compounding-loop.html.`

The agent loads the matching primitives on demand, filters shapes but not text, keeps callouts in the margins, and optionally audits the terminal variant.

Desired user-visible outcome: a hand-drawn-register diagram with crisp legible text and at most two editorial callouts.

#### Test Execution
> **Feature File:** [DIA-004](diagram-generation/primitive-variants.md)
> **Catalog:** [primitive-variants](../feature-catalog/diagram-generation/primitive-variants.md)

---

## 8. IMPORT AND EXPORT (`IMP-001..IMP-003`)

### IMP-001 | draw.io import

#### Description
Verify that a `.drawio` source is extracted via `drawio_extract.py`, read as a digest of untrusted content, redrawn (not converted) at the four dials, and delivered with a fidelity ledger.

#### Scenario Contract
Prompt: `Import docs/system.drawio and redraw it as an editorial architecture diagram for a blog post (format html, size doc-inline, detail balanced, audience mixed). Run the extraction script, read the digest, set the four dials, redraw with the type conventions, and report the fidelity ledger. Save it to docs/system-redrawn.html.`

The source is never rendered and never mutated; every merge, collapse, or drop appears in the ledger.

Desired user-visible outcome: a fresh editorial layout of the source content plus an honest account of what changed.

#### Test Execution
> **Feature File:** [IMP-001](import-export/drawio-import.md)
> **Catalog:** [drawio-import](../feature-catalog/import-export/drawio-import.md)

---

### IMP-002 | Mermaid import

#### Description
Verify that a `.mmd`, `.mermaid`, or fenced-Mermaid source is extracted via `mermaid_extract.py`, redrawn without copying the renderer layout or theme, and delivered with a fidelity ledger; unsupported kinds are reported verbatim.

#### Scenario Contract
Prompt: `Import the first Mermaid block from docs/onboarding.md and redraw it as a clean flowchart for our docs (format html, size doc-inline, detail simplified, audience mixed). Run the extraction script, read the digest, redraw with flowchart conventions — don't copy the renderer layout — and report the fidelity ledger. Save it to docs/onboarding-flow.html.`

Theme classes, init directives, and click targets are discarded; unsupported kinds are never approximated.

Desired user-visible outcome: an editorial flowchart that keeps the source meaning without inheriting Mermaid's automatic layout or styling.

#### Test Execution
> **Feature File:** [IMP-002](import-export/mermaid-import.md)
> **Catalog:** [mermaid-import](../feature-catalog/import-export/mermaid-import.md)

---

### IMP-003 | Export guidance

#### Description
Verify that PNG/SVG export is manual-only, diagram-only, follows `references/import-export/export.md`, keeps the source HTML byte-unchanged, and never runs unprompted.

#### Scenario Contract
Prompt: `Export docs/checkout-architecture.html to PNG for a slide deck (scale 2) and also save it as SVG. Follow the export procedure: extract the first svg node for SVG, render the original HTML and screenshot the svg bounding box for PNG with a transparent background. Don't modify the source HTML. Save the outputs next to the source.`

The SVG keeps the prefixed `<title>` / `<desc>` and merges the font `@import`; the PNG is transparent at `viewBox × device_scale_factor`.

Desired user-visible outcome: a `.svg` and a transparent `.png` beside the source, with the source untouched.

#### Test Execution
> **Feature File:** [IMP-003](import-export/export-guidance.md)
> **Catalog:** [export-guidance](../feature-catalog/import-export/export-guidance.md)

---

## 9. COMMAND AND HUB INTEGRATION (`CMD-001..CMD-002`)

### CMD-001 | create-diagram command

#### Description
Verify the `/create:diagram` command router: presentation contract loaded, mode resolved to `:auto` or `:confirm`, the bound workflow YAML executed, and the presentation boundary respected.

#### Scenario Contract
Prompt: `Run the /create:diagram command with argument docs/order-flow.html, description "sequence diagram of our order placement flow", mode :auto. Verify the router loads the presentation contract, binds create-diagram-auto.yaml, and the workflow produces the diagram without interactive questions.`

Workflow behavior lives in the YAML; user-facing wording lives only in the presentation contract.

Desired user-visible outcome: an HTML sequence diagram at the argument path, produced by the bound workflow without the router inventing prompts.

#### Test Execution
> **Feature File:** [CMD-001](command-and-hub-integration/create-diagram-command.md)
> **Catalog:** [create-diagram-command](../feature-catalog/command-and-hub-integration/create-diagram-command.md)

---

### CMD-002 | Hub registration

#### Description
Verify the packet is registered in the `sk-doc` hub: `workflowMode`, command, and aliases in `mode-registry.json`, leaves in `leaf-manifest.json`, no packet-local `graph-metadata.json`, and a clean package-structure validator run.

#### Scenario Contract
Prompt: `Verify the sk-create-diagram packet is correctly registered in the sk-doc hub: its workflowMode, command, and aliases in mode-registry.json, its leaf references in leaf-manifest.json, and that the packet root carries no packet-local graph-metadata.json. Report PASS or FAIL for each registration fact.`

Natural-language aliases such as `drawio`, `mermaid diagram`, `redraw diagram`, and `export diagram` must route to the packet.

Desired user-visible outcome: a registration verdict backed by the two manifest excerpts and the validator exit code.

#### Test Execution
> **Feature File:** [CMD-002](command-and-hub-integration/hub-registration.md)
> **Catalog:** [hub-registration](../feature-catalog/command-and-hub-integration/hub-registration.md)

---

## 10. AUTOMATED TEST CROSS-REFERENCE

| Test Module | Coverage | Playbook Overlap |
|---|---|---|
| `scripts/drawio_extract.py` | draw.io IR extraction, digest, budget flags | IMP-001 |
| `scripts/mermaid_extract.py` | Mermaid IR extraction, digest, supported kinds | IMP-002 |
| `sk-create-skill/scripts/validate_skill_package.py` | Packet structure and metadata invariants | CMD-002 |

Note: `sk-create-diagram` ships no committed automated feature test suite. The two extraction scripts are executable tooling exercised directly by the import scenarios, and the packet-structure validator is a packaging gate, not a feature test. This playbook is the operator-facing manual equivalent and does not claim otherwise.

---

## 11. FEATURE CATALOG CROSS-REFERENCE INDEX

| Feature ID | Feature Name | Category | Feature File |
|---|---|---|---|
| DIA-001 | Type selection and routing | DIAGRAM GENERATION | [DIA-001](diagram-generation/type-selection-and-routing.md) |
| DIA-002 | Editorial style and connectors | DIAGRAM GENERATION | [DIA-002](diagram-generation/editorial-style-and-connectors.md) |
| DIA-003 | Onboarding flow | DIAGRAM GENERATION | [DIA-003](diagram-generation/onboarding-flow.md) |
| DIA-004 | Primitive variants | DIAGRAM GENERATION | [DIA-004](diagram-generation/primitive-variants.md) |
| IMP-001 | draw.io import | IMPORT AND EXPORT | [IMP-001](import-export/drawio-import.md) |
| IMP-002 | Mermaid import | IMPORT AND EXPORT | [IMP-002](import-export/mermaid-import.md) |
| IMP-003 | Export guidance | IMPORT AND EXPORT | [IMP-003](import-export/export-guidance.md) |
| CMD-001 | create-diagram command | COMMAND AND HUB INTEGRATION | [CMD-001](command-and-hub-integration/create-diagram-command.md) |
| CMD-002 | Hub registration | COMMAND AND HUB INTEGRATION | [CMD-002](command-and-hub-integration/hub-registration.md) |
