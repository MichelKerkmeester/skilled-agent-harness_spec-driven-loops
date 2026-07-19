# DAB-003 — Vague natural ask with no authority and no scope

```json
{
  "id": "DAB-003",
  "title": "Vague natural ask with no authority and no scope",
  "mode": "alignment",
  "entry_surface": "E3",
  "clarity": "C1",
  "prompt": "can you check whether this follows our standards?",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/which|what|whose|authority|standard|sk-doc|sk-git|sk-design|sk-code/i",
    "/scope|target|where|point me/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 180000,
  "notes": "Most-realistic under-specified cell: 'our standards' names no authority, no artifact-class, no scope. A lane is (authority x artifact-class x scope); none is resolvable. Correct behavior is a targeted lane-resolution question, not a guessed lane and not a generic essay on conformance."
}
```

**Rationale.** The most realistic cell — a natural-language ask that says "our standards" but names no authority, no artifact-class, and no scope. An alignment lane is a `(authority, artifactClass, scope)` tuple (`references/scoping-protocol.md` §2), and none of the three axes is resolvable here. `SKILL.md` ALWAYS #1 forbids guessing a scope, so the correct behavior is a targeted lane-resolution question that pins the missing axes — above all *whose* standards ("our standards" is not an authority the registry knows), never a guess.

**Pass shape.** Output asks which authority's standards to check against (`sk-doc` / `sk-git` / `sk-design` / `sk-code`) and what scope to point at, or otherwise requests the clarification the three-axis tree needs, then halts. No lane is guessed, no adapter runs, and no conformance audit is started.

**Failure modes.** Picking an arbitrary authority (for example defaulting to `sk-doc` because the target has markdown in it) and running (setup_misbind); answering with a generic essay about how conformance review works instead of asking (refused / stuck_no_progress); or hanging with no output at all (stuck_no_progress).
