---
title: "Behavior Benchmark Scenario Template"
description: "Fillable scaffold for one behavior-benchmark scenario contract, a PREFIX-NNN-slug.md file whose first JSON block is the machine contract scored by the shared framework. Carries both the schema-v1 core scaffold and the opt-in schema-v2 scaffold (direct-dispatch targets, postconditions, boundary)."
trigger_phrases:
  - "behavior benchmark scenario template"
  - "behavior benchmark scenario contract"
  - "DAB scenario scaffold"
  - "behavior scenario machine contract"
  - "schema v2 scenario scaffold"
importance_tier: "important"
contextType: "general"
version: 1.1.0.0
---

<!--
Copy-paste scaffold for ONE behavior-benchmark scenario file:
  <deep-loop-mode>/behavior-benchmark/scenarios/<PREFIX>-NNN-<slug>.md

Usage:
  1. Pick the next zero-padded 3-digit NNN and a lowercase-hyphen slug, then
     cp this file to that path, for example:
     cp .opencode/skills/sk-doc/create-benchmark/assets/behavior-benchmark/behavior-benchmark-scenario-template.md \
        .opencode/skills/system-deep-loop/<mode>/behavior-benchmark/scenarios/<PREFIX>-007-verify-first.md
  2. DELETE this template's own frontmatter and this comment. A shipped scenario
     file has NO frontmatter: it starts at the "# <PREFIX>-NNN" H1.
  3. Choose ONE schema version and keep only that JSON block:
       - SCHEMA V1 (default) for the research/review/ai-council/improvement/context
         behavior packages — no version key, no direct-dispatch/postcondition/boundary
         evidence.
       - SCHEMA V2 for command, direct-tool/plugin, and conformance families that
         need direct-dispatch targets, postcondition probes, or a fixture boundary.
     Delete the JSON block for the version you are NOT authoring.
  4. Fill every {{PLACEHOLDER}}. The FIRST fenced json block is the machine
     contract the runner parses; keep its field order. Prose below the block is
     scoring context only and is never parsed.

Field definitions and enums are normative in:
  .opencode/skills/system-deep-loop/shared/behavior-benchmark/framework.md
  (SCENARIO CONTRACT SCHEMA, SCHEMA VERSIONING, SCORING RUBRIC, DELEGATION
   EVIDENCE KINDS, POSTCONDITION PROBES, CLASSIFICATION TAXONOMY)
-->

## 1. OVERVIEW

This section documents the scaffold and is NOT part of a shipped scenario. A
shipped scenario file carries no frontmatter and no `## OVERVIEW` heading: it is
exactly the region from the `# {{PREFIX}}-{{NNN}}` H1 below down through the
Failure modes line, carrying exactly ONE JSON block — the schema-v1 core OR the
schema-v2 block, never both. Copy that region, delete the JSON block for the
version you are not authoring, then delete this template's frontmatter, the usage
comment above, and this Overview. The remaining fenced json block is the machine
contract the runner parses; the prose below it is scoring context the runner
never reads.

---

# {{PREFIX}}-{{NNN}} — {{SCENARIO_TITLE}}

### Schema v1 core (default — keep this block OR the v2 block, not both)

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
    "command": {{COMMAND_STRING_OR_RAW_NULL}}
  },
  "fixture": "{{FIXTURE_PATH}}",
  "expected_interaction": "{{AUTONOMOUS_OR_QUESTION_HALT_OR_FAIL_FAST}}",
  "expected_presentation_markers": [
    "{{MARKER_ONE_LITERAL_OR_REGEX}}",
    "{{MARKER_TWO_LITERAL_OR_REGEX}}"
  ],
  "expected_delegation": {
    "evidence_kind": "{{TASK_DISPATCH_OR_SEAT_ARTIFACTS_OR_CANDIDATE_EVIDENCE}}",
    "leaf_agent": {{LEAF_AGENT_STRING_OR_RAW_NULL}},
    "min_task_events": {{MIN_TASK_EVENTS}},
    "route_proof_required": {{TRUE_OR_FALSE}},
    "role_absorption_forbidden": {{TRUE_OR_FALSE}},
    "min_seats": {{MIN_SEATS}}
  },
  "budget_ms": {{BUDGET_MS}},
  "watchdog_ms": {{WATCHDOG_MS_OR_OMIT}},
  "notes": "{{ONE_LINE_INTENT_PLUS_THE_INVARIANT_AND_SOURCE_FUNCTION}}"
}
```

### Schema v2 (command / direct-tool / conformance families needing direct-dispatch targets, postconditions, or a fixture boundary — keep this block OR the v1 block, not both)

```json
{
  "schema_version": 2,
  "id": "{{PREFIX}}-{{NNN}}",
  "title": "{{SCENARIO_TITLE}}",
  "mode": "{{MODE}}",
  "command_topology": "{{TOPOLOGY}}",
  "entry_surface": "{{ENTRY_SURFACE}}",
  "clarity": "{{CLARITY}}",
  "prompt": "{{VERBATIM_USER_PROMPT}}",
  "invocation": {
    "kind": "{{INVOCATION_KIND}}",
    "command": {{COMMAND_STRING_OR_RAW_NULL}}
  },
  "fixture": "{{FIXTURE_PATH}}",
  "expected_interaction": "{{AUTONOMOUS_OR_QUESTION_HALT_OR_FAIL_FAST}}",
  "expected_presentation_markers": [
    "{{MARKER_ONE_LITERAL_OR_REGEX}}",
    "{{MARKER_TWO_LITERAL_OR_REGEX}}"
  ],
  "expected_delegation": {
    "evidence_kind": "{{TASK_DISPATCH_OR_DIRECT_DISPATCH_OR_SEAT_ARTIFACTS_OR_CANDIDATE_EVIDENCE}}",
    "leaf_agent": {{LEAF_AGENT_STRING_OR_RAW_NULL}},
    "min_task_events": {{MIN_TASK_EVENTS}},
    "route_proof_required": {{TRUE_OR_FALSE}},
    "role_absorption_forbidden": {{TRUE_OR_FALSE}},
    "min_seats": {{MIN_SEATS}},
    "expected_targets": [
      "{{EXPECTED_TARGET_LITERAL_OR_REGEX}}"
    ],
    "forbidden_targets": [
      "{{FORBIDDEN_TARGET_LITERAL_OR_REGEX}}"
    ]
  },
  "artifacts_required": {{TRUE_OR_FALSE}},
  "postconditions": [
    { "kind": "file_exists", "path": "{{FIXTURE_RELATIVE_PATH}}" },
    { "kind": "text_contains", "path": "{{FIXTURE_RELATIVE_PATH}}", "substring": "{{REQUIRED_SUBSTRING}}" },
    { "kind": "changed_paths_within", "prefix": "." }
  ],
  "boundary": {
    "allow_prefixes": ["."]
  },
  "budget_ms": {{BUDGET_MS}},
  "watchdog_ms": {{WATCHDOG_MS_OR_OMIT}},
  "notes": "{{ONE_LINE_INTENT_PLUS_THE_INVARIANT_AND_SOURCE_FUNCTION}}"
}
```

<!--
Field guidance (see framework.md for the authoritative enums):
  schema_version      : V2 ONLY. The exact int 2 opts into schema v2; omit it (or 1) for the v1 core block.
                        v1-in => v1-out is a compatibility requirement: a v1 scenario adds no v2 keys.
  command_topology    : V2 command families. "workflow router" | "subaction router" | "direct-tool/plugin router" | "monolithic".
                        Informational topology label carried by shipped command scenarios; it is not in the framework's normative
                        machine-contract field table and the runner does not parse it. Omit it for non-command v2 cells.
  mode                : the package mode value (context|research|review|ai-council|improvement, or a declared extension such as alignment).
  entry_surface       : E1 command+suffix | E2 bare command (must halt) | E3 natural ask | E4 orchestrate-routed.
  clarity             : C1 vague | C2 concise-but-scoped | C3 fully specified.
  invocation.kind     : "command" (with command "namespace/name") or "natural" (command null).
  invocation.command  : a RAW JSON value, not a quoted placeholder. For "command" kind, fill a quoted string (e.g.
                        "review <target> :auto"). For "natural" kind, use the bare JSON literal null — never the quoted
                        text "null" (a quoted "null" is a non-empty string, not the JSON null a natural-entry cell needs;
                        see DAB-003's shipped `"command": null`).
  fixture             : REQUIRED repo-relative directory string that absorbs all writes for the run. Never null — every
                        scenario, including question_halt cells, binds a fixture.
  expected_interaction: "autonomous" (runs to a terminal) | "question_halt" (must ask ONE consolidated setup question then
                        stop) | "fail_fast" (must terminate on an unmet precondition).
  presentation markers: literal strings or /regex/ (case-insensitive is always applied). Keep them minimal and mode-distinctive.
  leaf_agent          : a RAW JSON value — a quoted "agent-name" string when the cell delegates to a named LEAF, or the bare
                        literal null (most command/direct-dispatch and question_halt cells set null).
  expected_delegation : evidence_kind (optional, default task_dispatch) selects how delegation is measured and is valid in
                        BOTH schema versions; only expected_targets/forbidden_targets are v2-only (direct_dispatch):
                        task_dispatch  => Agent/task tool events, min_task_events + optional route_proof to leaf_agent (research, review).
                        seat_artifacts => ai-council; distinct seat ids >= min_seats named in the persisted ai-council artifacts.
                        candidate_evidence => improvement; a packet-local candidate AND an evaluator score, counted separately.
                        direct_dispatch => v2 ONLY; case-insensitive stdout-line matches of expected_targets, guarded by forbidden_targets.
                        min_seats applies ONLY to seat_artifacts; expected_targets/forbidden_targets apply ONLY to direct_dispatch.
                        Each target is a literal substring or /regex/[flags]. question_halt cells usually set leaf_agent:null,
                        min_task_events:0.
  artifacts_required  : V2. Whether the run owes new fixture artifacts; defaults to min_task_events > 0. Set false on
                        inline-reporting hand-off cells that produce no new files.
  postconditions      : V2. Allowlisted post-run probes; every declared probe must pass for a `pass`. Kinds:
                        file_exists {path} | text_contains {path, substring} | json_field_equals {path, field, value} |
                        changed_paths_within {prefix}. A probe with "binds_setup": true that fails on an autonomous run
                        produces setup_misbind. Relative path/prefix resolve from the fixture dir.
  boundary            : V2. { "allow_prefixes": [dir, ...] }. Any created, rewritten, or deleted fixture path outside every
                        allowed prefix is a boundary_violation.
  budget_ms           : provisional framework floor (180000 ms) until a baseline lands, capped by mode at 900000 ms
                        (research/review) or 1500000 ms (ai-council/improvement/alignment) — see framework.md BUDGET
                        POLICY; do not invent a per-scenario number. Recompute from tTerminal once a baseline lands.
  watchdog_ms         : OPTIONAL, placed BEFORE the mandatory final "notes" field so deleting this one line never strands
                        a trailing comma. Set (e.g. 480000) only on autonomous delegating cells that legitimately go
                        quiet; OMIT the line otherwise.
-->

**Rationale.** {{WHY_THIS_CELL_EXISTS_WHICH_INVARIANT_OR_BOUNDARY_IT_ISOLATES_WITH_A_SKILL_MD_OR_REFERENCE_CITE}}

**Pass shape.** {{CONCRETE_DESCRIPTION_OF_A_PASSING_RUN_DISPATCH_EXPECTATION_ARTIFACTS_PRESENT_SPECIFIC_MARKERS}}

**Failure modes.** {{NAMED_FAILURE_BUCKETS_TO_WATCH_EACH_TAGGED_WITH_ITS_TERMINAL_BUCKET_LABEL}}
