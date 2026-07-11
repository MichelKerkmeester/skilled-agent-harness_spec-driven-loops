# DAB-008 — Per-lane report emission across a multi-authority run

```json
{
  "id": "DAB-008",
  "title": "Per-lane report emission across a multi-authority run",
  "mode": "alignment",
  "entry_surface": "E1",
  "clarity": "C3",
  "prompt": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx-001-alignment-target :auto --lane-config .opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx-001-alignment-target/lane-config-multi.json --max-iterations=2 --convergence=1.0",
  "invocation": {
    "kind": "command",
    "command": "deep/alignment"
  },
  "fixture": ".opencode/specs/system-deep-loop/059-deep-alignment-mode/behavior_benchmark/fixtures/fx-001-alignment-target",
  "expected_interaction": "autonomous",
  "expected_presentation_markers": [
    "/lane/i",
    "/sk-doc.*sk-code|sk-code.*sk-doc/is"
  ],
  "expected_delegation": {
    "leaf_agent": "deep-alignment",
    "min_task_events": 1,
    "route_proof_required": false,
    "role_absorption_forbidden": true
  },
  "budget_ms": 900000,
  "notes": "Emission-contract probe (SKILL.md ALWAYS #5 / NEVER #5b: 'Emit one report per lane, not one blended report across authorities'). lane-config-multi.json pins TWO lanes: sk-doc/docs/paths[docs/] and sk-code/code/globs[src/**]. reduce-alignment-state.cjs renderAlignmentReport() emits one '## Lane:' section per lane. Pass requires the emitted alignment-report.md to carry a distinct section for EACH authority, not one interleaved verdict.",
  "watchdog_ms": 480000
}
```

**Rationale.** This cell probes the report-emission contract (`SKILL.md` ALWAYS #5: "Emit one report per lane, not one blended report across authorities"). The `--lane-config` file pins two lanes of different authorities — `sk-doc / docs / paths:["docs/"]` and `sk-code / code / globs:["src/**"]` — so a single run resolves and audits two authorities at once. `runtime/scripts/reduce-alignment-state.cjs` `renderAlignmentReport()` renders one `## Lane: <authority> / <artifactClass> / <scope>` section per lane plus an overall roll-up, and the overall verdict is the worst per-lane verdict (a single FAIL lane is never averaged away by a clean one).

**Pass shape.** The `deep-alignment` leaf is dispatched with at least one task event; the fixture's `src/` and `docs/` are discovered under their respective lanes; and the emitted `alignment-report.md` carries a **distinct section for each authority** (`sk-doc` and `sk-code`), each with its own verdict and findings, under the single overall summary — not one interleaved, authority-blind verdict.

**Failure modes.** Emitting one blended report that mixes both authorities' findings under a single verdict, in violation of ALWAYS #5 (the named failure); auditing only one lane and dropping the other silently (partial / missing_artifact); producing the report inline with zero dispatch (role_absorption); or routing to `deep-review` (route_mismatch).
