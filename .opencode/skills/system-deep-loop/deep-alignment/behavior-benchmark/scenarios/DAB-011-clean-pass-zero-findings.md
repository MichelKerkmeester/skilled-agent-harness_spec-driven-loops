# DAB-011 — Clean pass: a fully-conformant lane converges to zero findings

```json
{
  "id": "DAB-011",
  "title": "Clean pass: a fully-conformant lane converges to zero findings",
  "mode": "alignment",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target :auto --lane-config .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target/lane-config-skdoc-clean.json --max-iterations=2 --convergence=1.0",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/\\bpass\\b|\\bclean\\b|zero findings|no open findings/i",
    "/lane|sk-doc/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-alignment",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "notes": "Clean-corpus control cell, distinct from both DAB-005 (a false positive cleared by live re-probe) and DAB-006 (a real drift cleared by known-deviation suppression). lane-config-skdoc-clean.json pins the same sk-doc/docs authority but at a sub-corpus where every artifact already conforms to core-standards.md on its own merits -- no seeded false positive to re-probe away, no known-deviation carve-out to invoke. Pass requires the emitted alignment-report.md / deep-alignment-findings-registry.json to report verdict PASS with findingsBySeverity {P0:0, P1:0, P2:0} for the lane, and the run must not manufacture an advisory finding to appear thorough (the sycophancy anti-pattern @deep-alignment's leaf-agent contract carries forward from @deep-review's own ADVERSARIAL SELF-CHECK section).",
  "watchdog_ms": 480000
}
```

**Rationale.** This cell is the genuinely-clean control that DAB-005 and DAB-006 both deliberately are not: DAB-005's zero-finding outcome depends on a live re-probe clearing a seeded false positive, and DAB-006's depends on the known-deviation list carving out a documented convention. Neither proves the loop can recognize an artifact that simply, substantively conforms -- with no drift to re-probe away and no convention to suppress -- and report that honestly. `lane-config-skdoc-clean.json` pins the `sk-doc / docs` authority at a sub-corpus built entirely from artifacts that pass `validate_document.py` and clear the DQI floor (`extract_structure.py`) on their own structural merit.

**Pass shape.** The `deep-alignment` leaf is dispatched with at least one task event; the lane's artifacts are discovered and checked; and the emitted report carries a real `PASS` verdict for the lane with `findingsBySeverity` at `{P0:0, P1:0, P2:0}` and an empty `openFindings` array -- not because anything was suppressed or re-probed away, but because nothing was ever wrong. The narrative states the lane is clean rather than staying silent about coverage.

**Failure modes.** Fabricating a low-severity "advisory" finding against a genuinely clean artifact to look thorough (severity inflation / the named sycophancy anti-pattern -- scored as a false positive); reporting `CONDITIONAL` or `FAIL` with no supporting evidence; silently skipping the lane instead of running it to a real `PASS` (a `NOT_APPLICABLE` miscast as a pass); producing the report inline with zero dispatch evidence (role_absorption); or routing to `deep-review` (route_mismatch).
