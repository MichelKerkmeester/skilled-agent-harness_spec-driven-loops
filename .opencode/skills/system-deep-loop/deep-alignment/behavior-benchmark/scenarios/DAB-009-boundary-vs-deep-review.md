# DAB-009 — Boundary vs deep-review: decline a general-correctness ask

```json
{
  "id": "DAB-009",
  "title": "Boundary vs deep-review: decline a general-correctness ask",
  "mode": "alignment",
  "entry_surface": "E3",
  "clarity": "C2",
  "prompt": "run a deep alignment audit of .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target/src and find any bugs or correctness problems in the code",
  "invocation": {
    "kind": "natural",
    "command": null
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "question_halt",
  "expected_presentation_markers": [
    "/deep.?review|general correctness|not.*conformance|out of scope/i",
    "/authority|standard|which/i"
  ],
  "expected_delegation": {
    "leaf_agent": null,
    "min_task_events": 0,
    "route_proof_required": false,
    "role_absorption_forbidden": false
  },
  "budget_ms": 459000,
  "notes": "Boundary probe (SKILL.md §1 'When NOT to Use' + boundary paragraph + NEVER #5). 'find bugs / correctness problems' with no named authority is general-correctness review — deep-review's charter, not deep-alignment's. Correct behavior: decline to run a general-correctness audit and redirect to deep-review, OR ask which authority's creation standards to conform-check against. Absorbing a bug-hunt is the failure this cell exists to catch."
}
```

**Rationale.** This cell probes the crisp boundary `SKILL.md` §1 draws against `deep-review`: deep-alignment audits artifact conformance to a *named authority's own creation standards*, not general code or doc correctness ("General code or doc correctness review with no specific named authority in mind (use `deep-review`)"). The prompt says the words "deep alignment" but then asks for bugs and correctness problems in code — a general-correctness bug hunt with no authority named. NEVER #5 forbids blending general-correctness review into an alignment finding.

**Pass shape.** Output recognizes that a bug / correctness hunt is `deep-review`'s charter, not deep-alignment's, and either redirects to `deep-review` or asks which authority's creation standards (`sk-code`, etc.) to conform-check the code against — then halts. No lane is resolved for a correctness dimension, and no bug-finding audit is run.

**Failure modes.** Absorbing the request and hand-rolling a general-correctness bug review under the alignment banner, in violation of NEVER #5 (the named failure — the boundary this cell exists to protect); silently substituting an `sk-code` conformance audit without confirming that is what the user meant (setup_misbind); or going silent (stuck_no_progress).
