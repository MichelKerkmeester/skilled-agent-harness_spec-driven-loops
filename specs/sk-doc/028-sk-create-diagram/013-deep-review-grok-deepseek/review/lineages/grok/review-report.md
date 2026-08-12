# Review Report — skill:sk-create-diagram (grok lineage)

## 1. Executive Summary

- **Verdict:** CONDITIONAL
- **hasAdvisories:** false (advisories apply only to PASS; this run is CONDITIONAL because P1s remain)
- **Active counts (authored, excluding reducer SUMMARY-* slots):** P0=0, P1=2, P2=6
- **Scope:** `skill:sk-create-diagram` nested under `sk-doc`. State home is `specs/sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek`. Fan-out lineage `grok` / session `fanout-grok-1786561206858-teuyl2`.
- **Stop reason:** `converged` after 5 iterations (4 dimensions + 1 stabilization). Rolling `newFindingsRatio` 0.0625 → 0.0 (average 0.031 < 0.08). Coverage age >= 1. No active P0.
- **Release readiness:** `converged` (loop complete). Product ship decision remains CONDITIONAL until F-T-001 and F-T-002 are fixed.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": ["F-T-001", "F-T-002", "F-C-001", "F-C-002", "F-C-003", "F-S-001", "F-T-003", "F-M-001"],
  "remediationWorkstreams": ["registry-refresh", "command-metadata-align", "validator-and-docs"],
  "specSeed": ["Regenerate leaf-manifest after phase 008 path moves", "Document ascii-markdown on the /create:diagram command-metadata surface"],
  "planSeed": ["T1 regenerate leaf-manifest", "T2 update command-metadata argumentHint", "T3 add export diagram to hub-router aliases"],
  "findingClasses": ["stale-registry", "registry-drift", "completeness", "validator-false-positive", "dead-config", "path-confinement", "alias-drift", "missing-tests"],
  "affectedSurfacesSeed": ["leaf-manifest.json", "command-metadata.json", "hub-router.json", "validate-flowchart.sh", "drawio_extract.py"],
  "fixCompletenessRequired": true
}
```

## 2. Planning Trigger

`/speckit:plan` is required. Two P1 registry-drift findings block a clean ship of the hub/advisor surface even though the skill's own SKILL.md, type library (27 files), extractors, and `/create:diagram` + `/create:flowchart` commands are otherwise aligned with parent spec 028 / phase 012.

### Planning Packet

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    {
      "id": "F-T-001",
      "severity": "P1",
      "findingClass": "stale-registry",
      "file": ".opencode/skills/sk-doc/leaf-manifest.json:118",
      "title": "leaf-manifest lists pre-reorganization flat paths that do not exist"
    },
    {
      "id": "F-T-002",
      "severity": "P1",
      "findingClass": "registry-drift",
      "file": ".opencode/skills/sk-doc/command-metadata.json:397",
      "title": "command-metadata still describes /create:diagram as HTML/SVG-only"
    }
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-registry",
      "priority": "P1",
      "actions": ["Re-run generate-leaf-manifest.cjs", "Align command-metadata with diagram.md"]
    },
    {
      "id": "WS-hygiene",
      "priority": "P2",
      "actions": ["Add export diagram to hub-router aliases", "Fix validator nesting check", "Add extractor fixtures"]
    }
  ],
  "specSeed": [
    "Leaf-manifest paths must match the phase-008 nested references/ and assets/ trees",
    "Command-metadata for /create:diagram must name ascii-markdown / .md targets"
  ],
  "planSeed": [
    "Regenerate .opencode/skills/sk-doc/leaf-manifest.json from the live packet tree",
    "Update command-metadata.json description and argumentHint to match .opencode/commands/create/diagram.md",
    "Add export diagram to hub-router.json create-diagram-aliases"
  ],
  "findingClasses": ["stale-registry", "registry-drift"],
  "affectedSurfacesSeed": ["leaf-manifest.json", "command-metadata.json", "hub-router.json", "CMD-002"],
  "fixCompletenessRequired": true
}
```

## 3. Active Finding Registry

Authored findings only. Reducer `SUMMARY-*` rows from iteration 5's cumulative `findingsSummary` are audit noise and are not counted in the verdict.

| ID | Severity | Title | Dimension | File:line | Evidence | Impact | Recommendation | Disposition | findingClass | scopeProof | affectedSurfaceHints |
|----|----------|-------|-----------|-----------|----------|--------|----------------|-------------|--------------|------------|----------------------|
| F-T-001 | P1 | leaf-manifest lists pre-008 flat paths that do not exist | traceability | `.opencode/skills/sk-doc/leaf-manifest.json:118` | `references/export.md`, `references/style-guide.md`, `references/type-architecture.md`, `assets/template.html` listed; those files live under nested folders (`references/import-export/export.md`, `references/foundations/style-guide.md`, `references/types/type-architecture.md`, `assets/templates/template.html`) | Advisor/playbook CMD-002 cannot confirm `references/types/type-*.md` from the published leaf list | Re-run `generate-leaf-manifest.cjs` | active | stale-registry | glob of listed flat paths returned 0; nested paths exist; playbook hub-registration.md:46 expects `references/types/type-*.md` | leaf-manifest.json, advisor-leaf-routing, CMD-002 |
| F-T-002 | P1 | command-metadata still describes /create:diagram as HTML/SVG-only | traceability | `.opencode/skills/sk-doc/command-metadata.json:397` | description + argumentHint are `<target-diagram.html>` only; live `diagram.md:3` includes flowchart.md and `--output-format ascii-markdown` | Agents following command-metadata miss ascii-markdown / `.md` targets | Align description and argumentHint with diagram.md | active | registry-drift | command-metadata.json:397-398 vs diagram.md:3-4 | command-metadata.json, /create:diagram |
| F-C-001 | P2 | UNKNOWN_FALLBACK checklist still asks only for an .html deliverable | correctness | `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md:213` | checklist item is html-only after ascii-markdown shipped | Disambiguation path can drop a valid markdown flowchart request | Add a .md / ascii-markdown option to the disambiguation checklist | active | completeness | SKILL.md:211-216 vs diagram.md:3 | skill-router, command-setup |
| F-C-002 | P2 | Validator nesting check treats box-drawing leading spaces as markdown indent | correctness | `.opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh:92` | `simple-workflow.md` warned level 9; `decision-tree-flow.md` warned level 21; both exit 0 | Shipped ASCII pattern assets warn on a check that is not a real nesting defect | Measure logical box nesting, not raw leading whitespace | active | validator-false-positive | ran validate-flowchart.sh on both ascii-patterns assets | validate-flowchart.sh |
| F-C-003 | P2 | LOAD_LEVELS map is never consulted by route_diagram_resources | correctness | `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md:204` | LOAD_LEVELS declared; router body never reads it | Load-level claims in SKILL.md are not enforced | Delete or wire LOAD_LEVELS | active | dead-config | SKILL.md:258-290 | skill-router |
| F-S-001 | P2 | Extract --out writes to an arbitrary path with no confinement | security | `.opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py:958` | `Path(args.out).write_text` unbounded; same in mermaid_extract.py:1411. Downgraded from P1 because the caller already has Write | A crafted `--out` can write outside the intended source tree | Resolve --out against the source dir or reject extra-workspace absolute paths | active | path-confinement | direct read of both main() --out branches | drawio_extract.py, mermaid_extract.py |
| F-T-003 | P2 | hub-router create-diagram-aliases omits export diagram | traceability | `.opencode/skills/sk-doc/hub-router.json:50` | mode-registry aliases include `export diagram`; hub-router keyword class does not | Hub keyword routing can miss an export-diagram prompt that mode-registry would catch | Add `export diagram` to create-diagram-aliases | active | alias-drift | hub-router.json:50 vs mode-registry.json:159 | hub-router.json, mode-registry.json |
| F-M-001 | P2 | Extract scripts have no committed regression suite | maintainability | `.opencode/skills/sk-doc/sk-create-diagram/scripts/README.md:95` | README documents py_compile and --help only; no scripts/tests | DTD reject, size ceilings, and `--out` behavior can regress unnoticed | Add fixtures for DTD reject, size ceilings, and --out | active | missing-tests | scripts/README.md:93-99; scripts/tests missing | drawio_extract.py, mermaid_extract.py |

## 4. Remediation Workstreams

1. **P1 registry refresh** — regenerate `leaf-manifest.json` from the live packet tree so `references/types/`, `references/foundations/`, `references/import-export/`, `assets/templates/`, and `assets/examples/` replace the flat paths.
2. **P1 command-metadata align** — copy the live `diagram.md` argument-hint (html + markdown targets, `--output-format`) into `command-metadata.json`.
3. **P2 hub alias** — add `export diagram` to `hub-router.json` `create-diagram-aliases`.
4. **P2 validator/docs/tests** — nesting-depth false positive, UNKNOWN_FALLBACK html-only checklist, unused LOAD_LEVELS, extractor `--out` confinement, extractor fixtures.

## 5. Spec Seed

- After any `references/` or `assets/` move, leaf-manifest must be regenerated before hub/playbook checks.
- `/create:diagram` command-metadata must name both `html-svg` and `ascii-markdown` targets once that format is in SKILL.md.
- Hub-router keyword classes should stay a superset of mode-registry aliases for the same packet.

## 6. Plan Seed

1. Run `.opencode/skills/sk-doc/sk-create-skill/scripts/generate-leaf-manifest.cjs` (or the playbook-named generator) and confirm every `sk-create-diagram` leaf path exists.
2. Patch `command-metadata.json` `/create:diagram` `description` and `argumentHint` to match `.opencode/commands/create/diagram.md`.
3. Add `export diagram` to `hub-router.json` `vocabularyClasses.create-diagram-aliases.keywords`.
4. Optional follow-ups: validator nesting heuristic, SKILL.md fallback checklist, extractor `--out` confinement, extractor fixtures.

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Evidence | Unresolved |
|----------|--------|----------|------------|
| spec_code | partial | 27 `references/types/type-*.md` match SKILL.md and parent spec 028. Flowchart merge is shipped in SKILL.md + `flowchart.md` pass-through. | F-T-001, F-T-002 — hub registries lag those claims |
| checklist_evidence | notApplicable | Skill packet and 013 review packet have no `checklist.md`. Playbook/benchmark evidence used instead. | none |

### Overlay Protocols

| Protocol | Status | Evidence | Unresolved |
|----------|--------|----------|------------|
| skill_agent | notApplicable | No dedicated create-diagram runtime agent | none |
| agent_cross_runtime | notApplicable | No per-runtime agent definitions | none |
| feature_catalog_code | partial | Catalog hub-registration overstates hub-router alias completeness | F-T-003 |
| playbook_capability | partial | CMD-002 step 2 cannot confirm `references/types/type-*.md` in the current leaf-manifest | F-T-001 |

AC_COVERAGE: exempt (skill target, not a Level 2+ spec folder with checklist.md).

## 8. Deferred Items

- F-C-001, F-C-002, F-C-003, F-S-001, F-T-003, F-M-001 (all P2)
- Coverage-graph upsert skipped (lineage write-boundary); graphless fallback used
- Continuity save via `generate-context.js` skipped (would write outside the lineage directory)
- Reducer `SUMMARY-*` rows from iteration 5 cumulative counts — ignore for remediation

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none
- Pivot lineage: none
- Remaining frontier: none (all four dimensions covered)

## 9. Search Ledger

- `hasSearchDebt:` false
- `graphCoverageMode:` graphless_fallback (coverage-graph DB writes are outside the lineage write boundary)
- Covered bug classes: off_by_one, path_traversal, spec_mismatch, missing_tests
- Ruled out: XXE/DTD expansion, Mermaid eval/fetch, packet-owned onboarding network fetch, missing 27 type files
- `*Search-depth state captured in iteration JSONL v2 ledgers SL-001 through SL-501.*`

## 10. Audit Appendix

### Coverage

| Dimension | Iteration | Verdict |
|-----------|-----------|---------|
| correctness | 1 | PASS (P2 only) |
| security | 2 | PASS (P2 only) |
| traceability | 3 | CONDITIONAL (2 P1) |
| maintainability | 4 | CONDITIONAL (no new P1; prior P1s remain) |
| stabilization | 5 | CONDITIONAL (P1s replayed, no new findings) |

### Replay validation

Recomputed from JSONL iteration records in run order:

| Iter | newFindingsRatio | notes |
|------|------------------|-------|
| 1 | 1.0 | 3 P2 |
| 2 | 0.25 | 1 P2 |
| 3 | 0.733 | 2 P1 + 1 P2 |
| 4 | 0.0625 | 1 P2 |
| 5 | 0.0 | stabilization |

Rolling average of last two: (0.0625 + 0.0) / 2 = 0.03125 < 0.08. Dimension coverage 4/4 with coverage_age >= 1 after iteration 5. P0 override not triggered. Recorded stop reason `converged` matches the replay.

Iteration 4 attempted STOP was correctly blocked (`blocked_stop`, `dimensionCoverageGate`, coverageAge 0).

### Claim adjudication

Iterations 3 and 5: typed packets present for F-T-001 and F-T-002. `claim_adjudication` events `passed: true`.

### Sources reviewed

SKILL.md, drawio_extract.py, mermaid_extract.py, validate-flowchart.sh, scripts/README.md, mode-registry.json, hub-router.json, leaf-manifest.json, command-metadata.json, diagram.md, flowchart.md, feature-catalog hub-registration.md, playbook hub-registration.md, parent spec 028, ascii-patterns simple-workflow.md and decision-tree-flow.md.

### Core vs overlay appendix

See §7. Graph seed/upsert skipped. Memory save skipped (write-boundary).
