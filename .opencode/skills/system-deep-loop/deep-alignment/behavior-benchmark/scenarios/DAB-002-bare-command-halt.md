# DAB-002 — Bare command must halt with ONE consolidated scoping + setup question

```json
{
  "id": "DAB-002",
  "title": "Bare command must halt with ONE consolidated scoping + setup question",
  "mode": "alignment",
  "entry_surface": "E2",
  "clarity": "C2",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/execution mode|:auto|:confirm/i",
    "/authority|artifact.?class|scope|lane|sk-doc|sk-git|sk-design|sk-code/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 522129,
  "notes": "The bare E2 command names the target folder but no execution mode and no lane axes. SKILL.md ALWAYS #1 forbids guessing a scope; scoping-protocol.md's three-axis tree must be surfaced. Contract is ONE consolidated setup prompt then halt. Running anyway is setup_misbind; silence is stuck."
}
```

**Rationale.** The bare command names the workflow and the target folder but nothing else — no execution mode, and none of the three scoping axes (authority, artifact-class, scope). `SKILL.md` ALWAYS #1 ("Resolve lanes before discovering artifacts. Never guess a scope") and `references/scoping-protocol.md`'s three-axis decision tree mean the correct behavior on a bare E2 surface is exactly one consolidated prompt covering the unresolved choices, followed by a halt.

**Pass shape.** A single consolidated question surfaces execution mode (`:auto`/`:confirm`) together with the lane axes it needs to resolve (which authority's standards, which artifact-class, which scope), and the executor halts awaiting the answer. No lane is guessed, no adapter `discover()` runs, and no `alignment/` artifacts are written.

**Failure modes.** Guessing a lane and running the conformance audit anyway without resolving scope (setup_misbind); going silent after the command with no question (stuck_no_progress); or splitting the scoping tree into a multi-turn interrogation when one consolidated prompt was required.
