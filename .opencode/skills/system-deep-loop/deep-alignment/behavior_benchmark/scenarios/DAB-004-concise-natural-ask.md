# DAB-004 — Concise natural ask naming authority + target but not mode

```json
{
  "id": "DAB-004",
  "title": "Concise natural ask naming authority + target but not mode",
  "mode": "alignment",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "check the docs in .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx-001-alignment-target/docs against sk-doc's standards",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/align|conformance|sk-doc/i",
    "/:auto|:confirm|execution mode/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 300000,
  "notes": "Names the authority (sk-doc), the artifact-class (docs), and a scope — the whole lane is resolvable — but not the execution mode. Correct routing recognizes the alignment flow and surfaces the ONE remaining setup choice (:auto/:confirm), rather than free-running or collapsing into an ad-hoc doc review."
}
```

**Rationale.** The ask resolves a whole lane on its own — authority `sk-doc`, artifact-class `docs`, and a concrete scope (`.../docs`) — but never names the execution mode. Routing should land on the deep-alignment setup question for the one remaining unresolved choice rather than free-running the loop or collapsing the ask into an ordinary, ad-hoc documentation review.

**Pass shape.** Output references the alignment / conformance flow and `sk-doc`, confirms it has the lane it needs, and surfaces the execution-mode choice (`:auto`/`:confirm`), then halts for the answer. The deep flow is recognized, not ignored.

**Failure modes.** Free-running the full audit without confirming mode (setup_misbind); ignoring the deep flow and performing a plain inline doc review against remembered sk-doc rules with no dispatch (role_absorption); or going silent after the ask (stuck_no_progress).
