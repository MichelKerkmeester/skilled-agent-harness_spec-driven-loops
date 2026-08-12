# Iteration 003: Traceability (D3)

## Focus
Traceability review of the `sk-create-diagram` packet: cross-reference integrity across hub manifests (mode-registry.json, hub-router.json, leaf-manifest.json), feature-catalog vs implementation parity, manual-testing-playbook scenario validity, and the 27-type / template-count / pattern-count claims.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 8 (feature-catalog.md + 8 feature files, manual-testing-playbook.md, mode-registry.json, hub-router.json, leaf-manifest.json, README.md)
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P1, Required
- **F005**: `leaf-manifest.json` is stale after the packet's resource reorganization — 75 of 87 declared leaves resolve to paths that do not exist. `.opencode/skills/sk-doc/leaf-manifest.json` (sk-create-diagram entry, 87 leaves) vs the shipped tree: examples live at `assets/examples/*.html` but the manifest lists `assets/example-*.html`; templates at `assets/templates/template*.html` but the manifest lists `assets/template*.html`; refs at `references/foundations/`, `references/types/`, `references/primitives/`, `references/import-export/` but the manifest lists flat `references/style-guide.md`, `references/type-*.md`, `references/primitive-*.md`, `references/export.md`, `references/import-*.md`. Verified with a filesystem existence check: 75 missing. (The 12 valid leaves are the six `assets/ascii-patterns/*.md`, `assets/icons.html`, and `scripts/validate-flowchart.sh`.)
  - Impact: the hub's leaf inventory for this packet is 86% broken — any consumer (advisor routing, packet-completeness checks, `validate_skill_package.py`, leaf-driven discovery) that resolves these paths fails. `feature-catalog/command-and-hub-integration/hub-registration.md:37` also claims the leaf inventory contract is enforced by the packaging gate; that gate either did not run on the reorganized tree or accepts stale manifests.
  - Alternative explanation: the manifest may be intentionally canonical while the files moved, meaning the reorganization itself (phase 008) broke the manifest. Rejected as acceptable either way: the shipped manifest must match the shipped tree at v1.0.0.0.

### P2, Suggestion
- **F006**: Feature catalog undercounts the registered aliases — `feature-catalog.md:168` and `feature-catalog/command-and-hub-integration/hub-registration.md:29` claim "17 aliases", but `mode-registry.json` lists 27 aliases for `sk-create-diagram`. `.opencode/skills/sk-doc/feature-catalog/feature-catalog.md:168`, `.opencode/skills/sk-doc/mode-registry.json` (sk-create-diagram entry).
  - Impact: the catalog's enumerated alias list (11 generate + 6 import/export) is a subset; 10 aliases (`create flowchart`, `flowchart`, `ASCII flowchart`, `workflow diagram`, `text diagram`, `text characters`, `decision tree`, `decision branch`, `parallel execution diagram`, `approval loop diagram`) are missing from the catalog narrative. Minor, but the catalog is the current-reality reference.

- **F007**: `manual-testing-playbook.md:21` states the feature-catalog package "is authored as a sibling deliverable and is not yet present" and links it as "planned", but the catalog ships in the packet today. `.opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/manual-testing-playbook.md:21` vs `.opencode/skills/sk-doc/sk-create-diagram/feature-catalog/` (root + 8 feature files present).
  - Impact: a reader following the playbook's "not yet present" note may conclude the catalog links are dead; they resolve fine. Stale editorial claim in the release-readiness artifact.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | mode-registry vs leaf-manifest vs tree | F005 stale leaves |
| checklist_evidence | partial | hard | feature-catalog.md:168 | F006 alias undercount |
| feature_catalog_code | fail | advisory | feature-catalog claims vs mode-registry/tree | F005, F006 |
| playbook_capability | partial | advisory | playbook.md:21 vs feature-catalog/ | F007 stale claim; scenarios otherwise runnable per benchmark (9/9 runs, no FAIL verdicts) |
| skill_agent | partial | overlay | README.md:35 also cites §9 (F003) | carried |

## Assessment
- New findings ratio: 1.0
- Dimensions addressed: traceability
- Novelty justification: first traceability pass; the leaf-manifest breakage is the highest-value discovery so far — it indicates the packet's own integration layer did not survive the reorganization.

## Claim Adjudication Packets

```json
{
  "findingId": "F005",
  "claim": "leaf-manifest.json declares 87 leaves for sk-create-diagram but 75 of those paths do not exist in the shipped tree (examples/templates/references were reorganized into subfolders), so the hub's leaf inventory for the packet is broken.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/leaf-manifest.json",
    ".opencode/skills/sk-doc/sk-create-diagram/assets/examples/example-sequence.html",
    ".opencode/skills/sk-doc/sk-create-diagram/assets/templates/template.html",
    ".opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/types/type-architecture.md"
  ],
  "counterevidenceSought": "Ran a filesystem existence check over all 87 manifest leaves against the packet root; 75 were missing and the valid set was exactly the ascii-patterns, icons, and validator-script entries. Confirmed the real files exist at the reorganized paths.",
  "alternativeExplanation": "The manifest could be listing intended leaves while a re-index step is pending. Rejected: hub-router.json and mode-registry.json were updated for the reorganization, so the manifest is simply out of sync.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If leaf-manifest.json is regenerated so all 87 leaves resolve (or the leaf set is reduced to the 12 valid entries), downgrade to P2 housekeeping.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P1", "reason": "Initial discovery — hub leaf inventory 86% broken after reorganization" }
  ]
}
```

```json
{
  "findingId": "F006",
  "claim": "The feature catalog undercounts sk-create-diagram's registered aliases: it claims 17 while mode-registry.json carries 27.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/feature-catalog/feature-catalog.md:168",
    ".opencode/skills/sk-doc/feature-catalog/command-and-hub-integration/hub-registration.md:29",
    ".opencode/skills/sk-doc/mode-registry.json"
  ],
  "counterevidenceSought": "Parsed mode-registry.json directly and counted 27 aliases in the sk-create-diagram entry; compared against the 17 enumerated in both catalog documents.",
  "alternativeExplanation": "The catalog may deliberately enumerate only the 'primary' aliases. Rejected: it states an explicit count ('17 aliases') that is factually wrong and lists a subset without marking it as such.",
  "finalSeverity": "P2",
  "confidence": 0.92,
  "downgradeTrigger": "Resolved when the catalog either states 27 and enumerates all, or labels the list as a curated subset.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery — documentation count mismatch, advisory" }
  ]
}
```

```json
{
  "findingId": "F007",
  "claim": "manual-testing-playbook.md claims the feature-catalog package is not yet present, but the catalog ships in the packet today.",
  "evidenceRefs": [
    ".opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/manual-testing-playbook.md:21",
    ".opencode/skills/sk-doc/sk-create-diagram/feature-catalog/feature-catalog.md"
  ],
  "counterevidenceSought": "Confirmed feature-catalog/ exists with root + 8 feature files and that the playbook's ../feature-catalog/... links resolve.",
  "alternativeExplanation": "The sentence may predate the catalog landing. Rejected as acceptable: it is a release-readiness artifact and must reflect shipped reality.",
  "finalSeverity": "P2",
  "confidence": 0.9,
  "downgradeTrigger": "Resolved when the playbook drops or rewrites the 'not yet present' sentence.",
  "transitions": [
    { "iteration": 3, "from": null, "to": "P2", "reason": "Initial discovery — stale claim, advisory" }
  ]
}
```

## Ruled Out
- 27-type claim: PASS — exactly 27 `references/types/type-*.md` files exist.
- Template count: PASS — exactly 4 `assets/templates/template*.html` variants exist.
- ASCII pattern count: PASS — exactly 6 `assets/ascii-patterns/*.md` exist.
- Hub registration core: PASS — mode-registry.json has the sk-create-diagram entry with command `/create:diagram`; hub-router.json routes the `create-diagram-aliases` class at weight 3.
- No-packet-local-graph-metadata invariant: PASS — the packet root carries neither `graph-metadata.json` nor `description.json` (verified absent).
- Benchmark health: PASS — 9/9 playbook benchmark runs report no FAIL verdicts (only export-guidance shows 0 PASS in the naive CSV grep; its finding file reports no FAIL verdicts, consistent with a SKIP on Playwright).

## Dead Ends
- [Parsing every leaf-manifest entry for semantic correctness]: superseded by the filesystem existence check, which is the decisive evidence. (Iteration 3)

## Recommended Next Focus
D4 Maintainability — assess documentation quality, duplication (feature-catalog vs SKILL.md vs README), the redundancy between the two import reference files, dead links beyond leaf-manifest, and whether the 34-example corpus plus the reorganization created residual debt; also confirm the changelog and benchmark READMEs are coherent.

Review verdict: CONDITIONAL
