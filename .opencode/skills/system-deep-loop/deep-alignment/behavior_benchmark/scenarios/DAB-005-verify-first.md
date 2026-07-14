# DAB-005 — Verify-first: re-probe live ground truth before asserting a finding

```json
{
  "id": "DAB-005",
  "title": "Verify-first: re-probe live ground truth before asserting a finding",
  "mode": "alignment",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target :auto --lane-config .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target/lane-config-skdoc.json --max-iterations=2 --convergence=1.0",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx_001_alignment_target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/verif|re-?probe|re-?verif/i",
    "/validate_document|validator|live|ground truth/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-alignment",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "notes": "Invariant-1 probe (SKILL.md §3: 'every finding that claims a drift from live reality is re-probed against the real validator, CLI, or registry before it is asserted. Pattern-matching alone is never sufficient'). The docs/ corpus seeds one artifact that a naive text scan reads as drift (e.g. no visible TOC) but validate_document.py exits 0 for. Pass requires the run to re-probe the real validator and NOT file that false finding. Scoring-nuance cell: confirm the seeded false-positive is ABSENT from the emitted findings-registry and a re-probe step is visible.",
  "watchdog_ms": 480000
}
```

**Rationale.** This cell isolates alignment invariant 1 ([SKILL.md §3 "The Alignment Contract"](../../SKILL.md#the-alignment-contract)): a finding that claims drift from live reality must be re-probed against the real validator, CLI, or registry before it is asserted, and pattern-matching alone is never sufficient grounds for a finding. The fixture's `docs/` corpus seeds one artifact that a surface text scan reads as a violation — for example a document with no visible Table of Contents — but that `validate_document.py` actually exits `0` for, because `template_rules.json` sets `tocRequired: false` for every document type (the same live-config reality the `sk-doc` known-deviation list's TOC entry documents). The correct run does not trust the pattern match.

**Pass shape.** The `deep-alignment` leaf is dispatched with at least one task event; the run visibly re-probes the authority's real validator against the suspect artifact (a `validate_document.py` invocation or equivalent live check) before recording anything; and the seeded pattern-only "drift" is **absent** from the emitted `deep-alignment-findings-registry.json` / `alignment-report.md`, because the live re-probe cleared it. A genuinely-seeded real finding (if the corpus carries one) still appears, so the run is not merely suppressing everything.

**Failure modes.** Filing the pattern-matched "missing TOC" (or similar surface-only) drift with no live re-probe, in violation of invariant 1 (a false positive — scored as a D-quality/scoring-nuance failure and noted); producing findings inline with zero task-dispatch evidence (role_absorption); routing to `deep-review` (route_mismatch); or a stall killed by the watchdog (stuck_no_progress).
