---
title: "SYN-002 -- Context Report Assembly"
description: "This scenario validates Context Report Assembly for `SYN-002`. It focuses on the seven-section Context Report structure, [HARD]/[soft] integration point markers, the context-report.json companion, and the config status update."
---

# SYN-002 -- Context Report Assembly

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `SYN-002`.

---

## 1. OVERVIEW

This scenario validates Context Report Assembly for `SYN-002`. It focuses on `step_compile_report` using `context_report_template.md` to assemble a seven-section report: (1) REUSE Catalog, (2) Integration Points with `[HARD]`/`[soft]` markers, (3) Touch List in implementation order, (4) Conventions with `file:line` exemplars, (5) Pruned Dependency Subgraph (edges within touch radius only), (6) Prior Art / Decisions, and (7) Gaps & Unknowns including marginal near-misses. `step_emit_report_json` writes the same merged findings as `context-report.json`. `step_update_config_status` sets `config.status = "complete"`.

### Why This Matters

The Context Report is the handoff document from the deep-context loop to `/speckit:plan` and `/speckit:implement`. All seven sections must be present for the report to be actionable: a report missing the Touch List means the implementor must rediscover what files to change; a report missing the Pruned Dependency Subgraph means the implementor cannot see structural constraints. The machine-readable JSON companion enables automated tooling to consume the report without parsing markdown.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `SYN-002` and confirm the expected signals without contradictory evidence.

- Objective: Verify the Context Report template has all seven sections, `[HARD]`/`[soft]` markers are used for integration points, and the JSON companion and config status update are present.
- Real user request: `Verify that the deep-context synthesis produces a complete seven-section Context Report along with a machine-readable JSON companion.`
- Prompt: `As a manual-testing orchestrator, validate the Context Report assembly contract for deep-context against the auto YAML phase_synthesis, context_report_template.md, and SKILL.md §3 output description. Verify the report has seven sections (REUSE Catalog, Integration Points, Touch List, Conventions, Pruned Dependency Subgraph, Prior Art/Decisions, Gaps and Unknowns); HARD/soft markers are used for integration points; context-report.json is also written. Return a concise verdict.`
- Expected execution process: Read `context_report_template.md` for the seven sections and marker notation; read auto YAML for `step_emit_report_json` and `step_update_config_status`; read SKILL.md §3 for output description.
- Expected signals: `context_report_template.md` contains all seven section headings; `[HARD]` and `[soft]` notation is documented in the template or SKILL.md; `step_emit_report_json` appears in the auto YAML synthesis phase; `step_update_config_status` sets `config.status = "complete"`.
- Desired user-visible outcome: A completed context loop produces a `context-report.md` and `context-report.json` that `/speckit:plan` can immediately consume with a full map of reuse opportunities, integration constraints, conventions, and gaps.
- Pass/fail: PASS if all seven sections are in the template, `[HARD]`/`[soft]` markers are documented, and the JSON step and config update appear in the YAML; FAIL if any section is missing or the JSON step is absent.

---

## 3. TEST EXECUTION

### Recommended Orchestration Process

1. Restate the user request in plain user language.
2. Stay local; read template and grep YAML.
3. Execute the deterministic steps exactly as written.
4. Compare observed output against the desired outcome.
5. Return a concise final answer.

| Feature ID | Feature Name | Scenario Name / Objective | Exact Prompt | Exact Command Sequence | Expected Signals | Evidence | Pass/Fail Criteria | Failure Triage |
|---|---|---|---|---|---|---|---|---|
| SYN-002 | Context Report Assembly | Verify seven-section report with JSON companion and config status update | `Verify that the deep-context synthesis produces a complete seven-section Context Report along with a machine-readable JSON companion.` | 1. `rg "REUSE\|Integration Points\|Touch List\|Conventions\|Dependency\|Prior Art\|Gaps" .opencode/skills/deep-loop-workflows/context/assets/context_report_template.md` -> 2. `rg "\[HARD\]\|\[soft\]" .opencode/skills/deep-loop-workflows/context/assets/context_report_template.md .opencode/skills/deep-loop-workflows/context/SKILL.md` -> 3. `rg "step_emit_report_json\|context-report\.json\|report_json" .opencode/commands/deep/assets/deep_context_auto.yaml` -> 4. `rg "step_update_config_status\|config.*complete\|status.*complete" .opencode/commands/deep/assets/deep_context_auto.yaml` | Step 1: all seven section keywords found in template; Step 2: marker notation found; Step 3: JSON emit step found; Step 4: config status update found | Grep outputs from all four commands | PASS if steps 1-4 all return matches; FAIL if any section keyword or either YAML step is absent | 1. Open context_report_template.md to count sections manually. 2. Check SKILL.md §3 output description for section naming. 3. Verify the auto YAML synthesis phase structure for the correct step names. |

---

## 4. SOURCE FILES

### Playbook Sources

| File | Role |
|---|---|
| `manual_testing_playbook.md` | Root directory page and scenario summary |
| `../../feature_catalog/05--context-report-synthesis/context-report-assembly.md` | Feature-catalog source describing the implementation contract |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `.opencode/skills/deep-loop-workflows/context/assets/context_report_template.md` | Seven-section report schema, `[HARD]`/`[soft]` markers, field definitions |
| `.opencode/commands/deep/assets/deep_context_auto.yaml` | `step_compile_report`, `step_emit_report_json`, `step_update_config_status` in phase_synthesis |
| `.opencode/skills/deep-loop-workflows/context/SKILL.md` | §3: output description listing both `context-report.md` and `context-report.json` |

---

## 5. SOURCE METADATA

- Group: Context Report Synthesis
- Playbook ID: SYN-002
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `05--context-report-synthesis/context-report-assembly.md`
