---
title: "Behavior Benchmark Scenario Template"
description: "Fillable scaffold for one behavior-benchmark scenario contract, a PREFIX-NNN-slug.md file whose first JSON block is the machine contract scored by the shared framework."
trigger_phrases:
  - "behavior benchmark scenario template"
  - "behavior benchmark scenario contract"
  - "DAB scenario scaffold"
  - "behavior scenario machine contract"
importance_tier: "important"
contextType: "general"
version: 1.0.0.0
---

<!--
Copy-paste scaffold for ONE behavior-benchmark scenario file:
  <deep-loop-mode>/behavior_benchmark/scenarios/<PREFIX>-NNN-<slug>.md

Usage:
  1. Pick the next zero-padded 3-digit NNN and a lowercase-hyphen slug, then
     cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/behavior_benchmark/behavior_benchmark_scenario_template.md \
        .opencode/skills/system-deep-loop/<mode>/behavior_benchmark/scenarios/<PREFIX>-007-verify-first.md
  2. DELETE this template's own frontmatter and this comment. A shipped scenario
     file has NO frontmatter: it starts at the "# <PREFIX>-NNN" H1.
  3. Fill every {{PLACEHOLDER}}. The FIRST fenced json block is the machine
     contract the runner parses; keep its field order. Prose below the block is
     scoring context only and is never parsed.

Field definitions and enums are normative in:
  .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
  (SCENARIO CONTRACT SCHEMA, SCORING RUBRIC, CLASSIFICATION TAXONOMY)
-->

## 1. OVERVIEW

This section documents the scaffold and is NOT part of a shipped scenario. A
shipped scenario file carries no frontmatter and no `## OVERVIEW` heading: it is
exactly the region from the `# {{PREFIX}}-{{NNN}}` H1 below down through the
Failure modes line. Copy that region only, then delete this template's frontmatter,
the usage comment above, and this Overview. The first fenced json block in the
copied region is the machine contract the runner parses; the prose below it is
scoring context the runner never reads.

---

# {{PREFIX}}-{{NNN}} — {{SCENARIO_TITLE}}

```json
{
  "id": "{{PREFIX}}-{{NNN}}",
  "title": "{{SCENARIO_TITLE}}",
  "mode": "{{MODE}}",
  "entry_surface": "{{ENTRY_SURFACE}}",
  "clarity": "{{CLARITY}}",
  "prompt": "{{VERBATIM_USER_PROMPT}}",
  "invocation": {
    "kind": "{{INVOCATION_KIND}}",
    "command": "{{COMMAND_OR_NULL}}"
  },
  "fixture": "{{FIXTURE_PATH_OR_NULL}}",
  "expected_interaction": "{{AUTONOMOUS_OR_QUESTION_HALT}}",
  "expected_presentation_markers": [
    "{{MARKER_ONE_LITERAL_OR_REGEX}}",
    "{{MARKER_TWO_LITERAL_OR_REGEX}}"
  ],
  "expected_delegation": {
    "leaf_agent": "{{LEAF_AGENT_OR_NULL}}",
    "min_task_events": {{MIN_TASK_EVENTS}},
    "route_proof_required": {{TRUE_OR_FALSE}},
    "role_absorption_forbidden": {{TRUE_OR_FALSE}}
  },
  "budget_ms": {{BUDGET_MS}},
  "notes": "{{ONE_LINE_INTENT_PLUS_THE_INVARIANT_AND_SOURCE_FUNCTION}}",
  "watchdog_ms": {{WATCHDOG_MS_OR_OMIT}}
}
```

<!--
Field guidance (see framework.md for the authoritative enums):
  mode                : the package mode value (context|research|review|ai-council|improvement, or a declared extension such as alignment).
  entry_surface       : E1 command+suffix | E2 bare command (must halt) | E3 natural ask | E4 orchestrate-routed.
  clarity             : C1 vague | C2 concise-but-scoped | C3 fully specified.
  invocation.kind     : "command" (with command "namespace/name") or "natural" (command null).
  expected_interaction: "autonomous" (runs to a terminal) or "question_halt" (must ask ONE consolidated setup question then stop).
  presentation markers: literal strings or /regex/ (case-insensitive is always applied). Keep them minimal and mode-distinctive.
  expected_delegation : use evidence_kind (default task_dispatch) + min_seats only when the mode delegates via seat_artifacts (ai-council).
                        question_halt cells usually set leaf_agent:null and min_task_events:0.
  budget_ms           : provisional framework floor until a baseline lands (e.g. 300000 question_halt, 900000 autonomous). Recompute from tTerminal later.
  watchdog_ms         : OPTIONAL. Set (e.g. 480000) only on autonomous delegating cells that legitimately go quiet; OMIT the line otherwise.
-->

**Rationale.** {{WHY_THIS_CELL_EXISTS_WHICH_INVARIANT_OR_BOUNDARY_IT_ISOLATES_WITH_A_SKILL_MD_OR_REFERENCE_CITE}}

**Pass shape.** {{CONCRETE_DESCRIPTION_OF_A_PASSING_RUN_DISPATCH_EXPECTATION_ARTIFACTS_PRESENT_SPECIFIC_MARKERS}}

**Failure modes.** {{NAMED_FAILURE_BUCKETS_TO_WATCH_EACH_TAGGED_WITH_ITS_TERMINAL_BUCKET_LABEL}}
