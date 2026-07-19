# DAB-006 — Known-deviation suppression: must NOT flag a documented convention

```json
{
  "id": "DAB-006",
  "title": "Known-deviation suppression: must NOT flag a documented convention",
  "mode": "alignment",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target :auto --lane-config .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target/lane-config-skdoc.json --max-iterations=2 --convergence=1.0",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior-benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/known.?deviation|suppress|accepted convention|intentional/i",
    "/compact|pointer.?card|dqi|sk-doc/i"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-alignment",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "notes": "Invariant-2 probe (SKILL.md §3 / NEVER #2: 'Flag an authority's own documented, intentional convention as drift'). Uses sk-doc's ACTIVE compact-pointer-card-dqi deviation (sk-doc-known-deviations.md Section 3): a structurally-conformant readme/asset that sits below the DQI floor is suppressed only when validate_document.py exits 0 AND docType is readme/asset. The docs/ corpus seeds exactly such a compact readme. Pass requires it to be ABSENT from findings. A P0 missing_required_section artifact, if seeded, must STILL be flagged — suppression is selective, never blanket.",
  "watchdog_ms": 480000
}
```

**Rationale.** This cell isolates alignment invariant 2 ([SKILL.md §3 "The Alignment Contract"](../../SKILL.md#the-alignment-contract) and NEVER #2: never flag an authority's own documented, intentional convention as drift). It uses the one `sk-doc` known-deviation that is **active**, not dormant — `compact-pointer-card-dqi` (`references/adapters/sk-doc-known-deviations.md` Section 3): a short, intentionally minimal document is not penalized for brevity alone, so a `dqi-below-threshold` finding is suppressed exactly when, in the same `check()` call, `validate_document.py` exits `0` (structurally conformant) AND the artifact's `docType` is `readme` or `asset`. The fixture's `docs/` corpus seeds precisely such a compact-but-conformant README.

**Pass shape.** The `deep-alignment` leaf is dispatched with at least one task event; the compact, structurally-conformant README is **not** filed as a `dqi-below-threshold` finding in the emitted `alignment-report.md` / `deep-alignment-findings-registry.json`; and the run's narrative attributes that non-finding to the known-deviation list rather than to having missed the artifact. If the corpus also seeds a genuinely non-conformant artifact (a real `missing_required_section` P0), that finding **still** appears — suppression is the documented-convention carve-out, never a blanket exemption (the load-bearing boundary `sk-doc-known-deviations.md` Section 3's own counterevidence check draws).

**Failure modes.** Flagging the compact pointer-card as a DQI drift finding in violation of invariant 2 (the named failure — a false positive against a documented convention); over-suppressing and dropping the genuine P0 alongside it (a false negative — blanket exemption, equally wrong); producing findings inline with zero dispatch (role_absorption); or routing elsewhere (route_mismatch).
