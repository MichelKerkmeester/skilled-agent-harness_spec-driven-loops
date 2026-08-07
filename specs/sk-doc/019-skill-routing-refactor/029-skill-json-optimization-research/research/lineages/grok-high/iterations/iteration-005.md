# Iteration 005 — Testing and integration

## Focus
Dimension (5): per-JSON test/CI coverage, end-to-end scaffold→gate→ingest→routing, failure modes.

## Actions Taken
1. Inventoried create-skill unit tests and counted test/bin files touching each JSON surface.
2. Checked `.github/workflows` for gate and advisor e2e wiring.
3. Verified packet 024 journey-proof checklist items still open.
4. Confirmed zero tests reference orphan `manual.related`.

## Findings

### F28 — Coverage is uneven: strong on class/presence, weak on unused-field and selection quality

| Surface | Test/bin file hits (approx) | CI in `routing-registry-drift.yml` | Gap |
|---------|----------------------------:|------------------------------------|-----|
| graph-metadata | 37 | via doctor + ingest elsewhere | No unknown-key / manual-orphan lint |
| mode-registry | 24 | parent-skill-check per hub | Good structural coverage |
| hub-router | 21 | parent-skill-check | Good |
| compiled-route | 14 | not in that workflow grep | Scenario validator exists separately |
| intent_signals | 14 | no selection acceptance CI | No Gate-2 golden prompts in GH |
| description.json | 4 | doctor 8a/8b only | Dead-field lint absent |
| leaf-manifest | 4 | class gate + freshness | Good freshness, journey scaffold missing |
| command-metadata | 3 | class gate schema | Core schema tested; sparse e2e |
| leaf-aliases | 2 | class gate (S generated) | Thin |
| `manual.*` | **0** | none | Orphan field never tested |

[SOURCE: create-skill/scripts/tests listing]
[SOURCE: rg file-count census]
[SOURCE: routing-registry-drift.yml:95-110]

### F29 — Two-class journey proof still unchecked (open CHK-005 / CHK-009)
Packet 024 checklist still has unchecked:
- CHK-005: scaffold → gate `--fix` → clean gate → doctor 0
- CHK-009: workflow conformance uses `--fix` then clean re-run

No matching automated journey test file under `create-skill/scripts/tests/` (search for journey/scaffold.*fix returned empty). Integration hole: presence gates can be green fleet-wide while *new* scaffolds fail the documented journey.

[SOURCE: 024-create-journey-gate-fixes/checklist.md:63,74]
[SOURCE: live test-dir search]

### F30 — No GitHub workflow runs `advisor_recommend` / `skill_graph_scan` acceptance
`.github` grep for `advisor_recommend`, `skill_graph_scan`, `validate-compiled-routing` under workflows returned **no matches**. Routing quality regressions like F22 (sk-prompt beating sk-doc on parent-hub scaffold) would not fail CI. Compiled-routing scenario validator exists as a script+unit test but is not wired into the same drift workflow.

[SOURCE: .github/workflows grep — empty]
[SOURCE: validate-compiled-routing-scenarios.cjs:1-40]

### F31 — Failure-mode map (scaffold → gate → ingest → routing)

```text
init_skill (H/S)
  │  FAIL: no --fix → MISSING_GENERATED_FILE (F15/F16)
  ▼
ci-skill-root-metadata / freshness / doctor
  │  PASS: presence + schema (fleet currently 11/11)
  │  MISS: unread fields, manual orphan, intent quality (F9/F11/F19)
  ▼
watcher / skill_graph_scan → skill-graph.sqlite
  │  FAIL: skip rebuild → stale projection (documented in skill-graph-drift)
  │  MISS: not in create-journey or GH acceptance (F20/F30)
  ▼
advisor_recommend (+ compiled-route-manifest for hubs)
  │  FAIL: wrong top skill despite correct compiledRoute when ranked (F22)
  │  MISS: no CI golden prompts (F30)
  ▼
Operator invokes skill
```

### F32 — Highest-leverage testing/integration opportunities
1. **Land automated two-class journey proof** (closes 024 CHK-005) and make `init_skill` call `--fix` so the journey is one command.
2. **Add Gate-2 golden prompt suite** (sk-doc parent-hub, sk-git commit, system-deep-loop research, …) asserting top-1/top-3 — would have caught F22.
3. **Unknown-key / orphan-field lint** on graph-metadata (`manual`, extra description fields) with unit tests (today `manual.related` has zero tests).
4. **Wire validate-compiled-routing-scenarios + journey proof into CI** beside class/freshness gates.
5. **Optional post-scaffold `syncDerivedMetadata` + `skill_graph_scan` smoke** in trusted CI only.

## Questions Answered
- Where are test/CI and end-to-end scaffold→gate→ingest→routing gaps sharpest? → Journey proof open; no advisor selection CI; orphan `manual` untested; compiled-routing validator unwired (F28–F32).

## Ruled Out
- Claiming fleet green implies routing quality — contradicted by F22 + F30.

## Next Focus
Synthesis — ranked opportunity map across all five dimensions (max-iterations stop).
