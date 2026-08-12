# Iteration 3: Traceability

## Dimension
traceability

## Files Reviewed
- `.opencode/skills/sk-doc/leaf-manifest.json`
- `.opencode/skills/sk-doc/command-metadata.json`
- `.opencode/skills/sk-doc/mode-registry.json`
- `.opencode/skills/sk-doc/hub-router.json`
- `.opencode/commands/create/diagram.md`
- `.opencode/commands/create/flowchart.md`
- `.opencode/skills/sk-doc/sk-create-diagram/SKILL.md`
- `.opencode/skills/sk-doc/sk-create-diagram/feature-catalog/command-and-hub-integration/hub-registration.md`
- `.opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/command-and-hub-integration/hub-registration.md`
- `specs/sk-doc/028-sk-create-diagram/spec.md`

## Findings by Severity

### P0
None.

### P1

- **F-T-001**: `leaf-manifest.json` still lists pre-reorganization flat paths that do not exist on disk. [SOURCE: .opencode/skills/sk-doc/leaf-manifest.json:118]
  - Examples: `references/export.md`, `references/style-guide.md`, `references/type-architecture.md`, `assets/template.html`. Live files are under `references/import-export/`, `references/foundations/`, `references/types/`, `assets/templates/`, `assets/examples/`. Glob of `references/type-*.md` and `assets/template.html` under the packet returned 0 files. Playbook CMD-002 step 2 asks agents to confirm `references/types/type-*.md` are listed.
  - findingClass: stale-registry
  - scopeProof: leaf-manifest.json:118-132 vs glob 0 hits; playbook hub-registration.md:46
  - affectedSurfaceHints: ["leaf-manifest.json", "advisor-leaf-routing", "CMD-002"]

```json
{
  "type": "claim_adjudication",
  "findingId": "F-T-001",
  "claim": "sk-create-diagram leaf-manifest entries use pre-008 flat paths that do not resolve to files on disk.",
  "evidenceRefs": [".opencode/skills/sk-doc/leaf-manifest.json:118", ".opencode/skills/sk-doc/leaf-manifest.json:132"],
  "counterevidenceSought": "Looked for leftover flat files or symlinks at references/type-*.md and assets/template.html under the packet root (0 matches). Checked whether ascii-format paths in the same manifest were already updated (they were, proving mixed freshness).",
  "alternativeExplanation": "Manifest uses logical leaf ids rather than filesystem paths — rejected because playbook CMD-002 treats them as real paths and sibling ascii-format entries already use real nested paths.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "Re-run generate-leaf-manifest.cjs so every listed path exists, or document that leaf-manifest is not a filesystem index."
}
```

Hunter: re-read leaf-manifest.json:118-132 and confirmed nested ascii-format paths sit beside stale flat type/foundation/asset paths. Skeptic: could this be unused packaging metadata? Referee: playbook and hub-registration catalog both treat leaves as real paths — keep P1.

- **F-T-002**: `command-metadata.json` still describes `/create:diagram` as HTML/SVG-only after the ascii-markdown merge. [SOURCE: .opencode/skills/sk-doc/command-metadata.json:397]
  - Description and `argumentHint` mention `<target-diagram.html>` only. Live `diagram.md` argument-hint includes `target-flowchart.md` and `--output-format html-svg|ascii-markdown`. `/create:flowchart` is a pass-through that pre-selects ascii-markdown. Parent spec phase 012 shipped that merge.
  - findingClass: registry-drift
  - scopeProof: command-metadata.json:397-398 vs diagram.md:3-4 vs flowchart.md:9
  - affectedSurfaceHints: ["command-metadata.json", "/create:diagram", "advisor-choreography"]

```json
{
  "type": "claim_adjudication",
  "findingId": "F-T-002",
  "claim": "Hub command-metadata for /create:diagram omits the shipped ascii-markdown flowchart format.",
  "evidenceRefs": [".opencode/skills/sk-doc/command-metadata.json:397", ".opencode/commands/create/diagram.md:3"],
  "counterevidenceSought": "Checked whether command-metadata ownedSignals mention flowchart (they do not). Checked mode-registry aliases — those do include ASCII flowchart terms, so only command-metadata lagged.",
  "alternativeExplanation": "command-metadata is a short blurb and HTML/SVG remains the default — rejected because argumentHint is a machine contract for invocation shape, not marketing copy, and it currently cannot express a .md target.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "Update command-metadata description and argumentHint to match diagram.md, or prove no consumer reads argumentHint."
}
```

Hunter: re-read command-metadata.json:395-405 and diagram.md:1-4. Skeptic: default remains html-svg so maybe advisory. Referee: argumentHint is the invocation contract and currently cannot name a flowchart target — keep P1.

### P2

- **F-T-003**: `hub-router.json` `create-diagram-aliases` omits `export diagram`, which is present in `mode-registry.json` aliases. [SOURCE: .opencode/skills/sk-doc/hub-router.json:50]
  - Independently noted in the hub-registration benchmark report as a minor cross-file drift that did not fail CMD-002's stated pass criterion.
  - findingClass: alias-drift
  - scopeProof: hub-router.json:50 vs mode-registry.json:159
  - affectedSurfaceHints: ["hub-router.json", "mode-registry.json"]

## Traceability Checks

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| spec_code | core | partial | 27 type files match SKILL.md and parent spec. Flowchart merge is shipped in SKILL.md + flowchart.md. Registry files (leaf-manifest, command-metadata) do not match those claims. |
| checklist_evidence | core | notApplicable | Skill packet has no checklist.md; 013 review packet also has none. Playbook/benchmark evidence used instead. |
| skill_agent | overlay | notApplicable | No dedicated create-diagram runtime agent. |
| agent_cross_runtime | overlay | notApplicable | No per-runtime agent definitions. |
| feature_catalog_code | overlay | partial | Catalog hub-registration claims hub-router carries the full alias set; `export diagram` is missing. Leaf paths in catalog/playbook expect `references/types/`. |
| playbook_capability | overlay | partial | CMD-002 step 2 is not executable against current leaf-manifest paths. Other playbook scenarios remain executable. |

## Ruled Out
- Missing type files vs the 27-type claim: 27 `references/types/type-*.md` exist and match the SKILL.md table.
- Packet-local advisor identity: no packet-root `graph-metadata.json` (playbook invariant holds).

## Verdict
CONDITIONAL — two P1 registry-drift findings.

## Next Dimension
maintainability — scripts/README test gap and remaining docs/code hygiene.

Review verdict: CONDITIONAL
