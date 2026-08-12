# Deep Review Report — skill:sk-create-diagram (fan-out)

**Fan-out merge:** `grok` (cli-cursor / cursor-grok-4.6-high) + `deepseek-go` (cli-opencode / opencode-go/deepseek-v4-flash)
**Session:** rvw-2026-08-12T18-59-29Z · Generation 1
**Review packet:** `specs/sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek/review/`

---

## 1. Executive Summary

| Field | Value |
|---|---|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | false |
| **Active P0** | 0 |
| **Active P1** | 4 distinct (7 registry rows incl. 1 cross-lineage duplicate pair + 2 reducer summary-noise rows) |
| **Active P2** | 12 distinct (18 registry rows incl. 6 reducer summary-noise rows) |
| **Scope** | Skill `sk-create-diagram` — SKILL.md, references/ (27 types, foundations, primitives, import-export, ascii-format), assets/ (templates, 34 examples, 6 ascii patterns, icons), scripts/ (2 Python extractors + shell validator), feature-catalog/, manual-testing-playbook/, benchmark reports, hub manifests (mode-registry, hub-router, leaf-manifest, command-metadata), `/create:diagram` + `/create:flowchart` command wiring |
| **Dimensions covered** | 4/4 per lineage (correctness, security, traceability, maintainability) |
| **Lineages** | `grok`: 5 iterations, stop `converged`; `deepseek-go`: 5 iterations, stop `maxIterationsReached` |
| **Merge rule** | Strongest-restriction: both lineages CONDITIONAL → merged CONDITIONAL |

The packet is fundamentally sound. Both independent lineages agree on the core finding: the skill's own authoring contract (SKILL.md, type library, extractors, validator) is coherent, but the surrounding **hub registries and cross-references lag the shipped tree**. The leaf-manifest was identified independently by both lineages (grok `F-T-001` and deepseek-go `F005` are the same finding). No P0. No security boundary breach in the extractors' import path (DTD/ENTITY rejection, bounded decompression hold). The verdict is driven by documentation/integration-integrity P1s, all fixable in-doc without touching the drawing engine.

---

## 2. Planning Trigger

**`/speckit:plan` is required** — the CONDITIONAL verdict (active P1 present) routes to remediation planning before release.

**Planning Packet**

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": false,
  "activeFindings": [
    { "findingId": "F005/F-T-001", "severity": "P1", "dimension": "traceability", "title": "leaf-manifest.json lists pre-reorganization flat paths; 75/87 leaves do not exist" },
    { "findingId": "F-T-002", "severity": "P1", "dimension": "traceability", "title": "command-metadata.json still describes /create:diagram as HTML/SVG-only" },
    { "findingId": "F001", "severity": "P1", "dimension": "correctness", "title": "4px-grid rule contradicts style-guide typography tokens and shipped examples" },
    { "findingId": "F003", "severity": "P1", "dimension": "security", "title": "Systemic stale SKILL.md section-number cross-references" },
    { "findingId": "F-C-001", "severity": "P2", "dimension": "correctness", "title": "UNKNOWN_FALLBACK checklist still asks only for an .html deliverable" },
    { "findingId": "F-C-002", "severity": "P2", "dimension": "correctness", "title": "Validator nesting check treats box-drawing leading spaces as markdown indent" },
    { "findingId": "F-C-003", "severity": "P2", "dimension": "correctness", "title": "LOAD_LEVELS map never consulted by route_diagram_resources" },
    { "findingId": "F-S-001", "severity": "P2", "dimension": "security", "title": "Extract --out writes to arbitrary path with no confinement" },
    { "findingId": "F-T-003", "severity": "P2", "dimension": "traceability", "title": "hub-router create-diagram-aliases omits export diagram" },
    { "findingId": "F-M-001", "severity": "P2", "dimension": "maintainability", "title": "Extract scripts have no committed regression suite" },
    { "findingId": "F002", "severity": "P2", "dimension": "correctness", "title": "Validator-mechanics doc drifts from validator regex" },
    { "findingId": "F004", "severity": "P2", "dimension": "security", "title": "PNG export executes source HTML in headless Chromium" },
    { "findingId": "F006", "severity": "P2", "dimension": "traceability", "title": "Feature catalog undercounts registered aliases (17 vs 27)" },
    { "findingId": "F007", "severity": "P2", "dimension": "traceability", "title": "Playbook claims feature-catalog not present though it ships" },
    { "findingId": "F008", "severity": "P2", "dimension": "maintainability", "title": "Duplicated extractor scaffolding across both IR scripts" },
    { "findingId": "F009", "severity": "P2", "dimension": "maintainability", "title": "Example corpus predates current style-guide skin" }
  ],
  "remediationWorkstreams": [
    { "lane": "R1 - Registry refresh (P1)", "findings": ["F005/F-T-001", "F-T-002", "F-T-003", "F006", "F007"] },
    { "lane": "R2 - Contract reconciliation (P1)", "findings": ["F001", "F003", "F009"] },
    { "lane": "R3 - Documentation/safety polish (P2)", "findings": ["F002", "F004", "F008", "F-C-001", "F-C-002", "F-C-003", "F-S-001", "F-M-001"] }
  ],
  "specSeed": [
    "Regenerate leaf-manifest.json against the reorganized references/ and assets/ trees",
    "Align command-metadata.json /create:diagram description and argumentHint with diagram.md (html + ascii-markdown)",
    "Reconcile the 4px-grid font-size rule with style-guide typography tokens or add an explicit exemption",
    "Correct every SKILL.md §N cross-reference to the real §1-§6 locations",
    "Add a traceability rule that every SKILL.md §N citation and every hub registry resolves to an existing path"
  ],
  "planSeed": [
    "R1: regenerate leaf-manifest.json; patch command-metadata.json; add 'export diagram' to hub-router aliases; fix alias count in feature-catalog; drop stale playbook not-present sentence",
    "R2: amend SKILL.md:337 grid rule and/or style-guide.md:92-99; fix section refs in create-diagram-auto.yaml + import-*.md + notation-and-validator.md; regenerate or demote example corpus",
    "R3: align notation-and-validator.md:32 with validate-flowchart.sh:60; add export.md script-execution caveat; extract shared extractor scaffolding; add extractor fixtures; wire or remove LOAD_LEVELS; confine --out"
  ],
  "findingClasses": {
    "stale-registry": ["F005/F-T-001", "F-T-002"],
    "alias-drift": ["F-T-003", "F006"],
    "stale-claim": ["F007"],
    "spec-contradiction": ["F001", "F009"],
    "stale-cross-reference": ["F003"],
    "doc-script-drift": ["F002"],
    "trust-doctrine-inconsistency": ["F004"],
    "completeness": ["F-C-001"],
    "validator-false-positive": ["F-C-002"],
    "dead-config": ["F-C-003"],
    "path-confinement": ["F-S-001"],
    "missing-tests": ["F-M-001"],
    "maintenance-debt": ["F008"]
  },
  "affectedSurfacesSeed": [
    ".opencode/skills/sk-doc/leaf-manifest.json",
    ".opencode/skills/sk-doc/command-metadata.json",
    ".opencode/skills/sk-doc/hub-router.json",
    ".opencode/skills/sk-doc/sk-create-diagram/SKILL.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/foundations/style-guide.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-drawio.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/import-mermaid.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/import-export/export.md",
    ".opencode/skills/sk-doc/sk-create-diagram/references/ascii-format/notation-and-validator.md",
    ".opencode/skills/sk-doc/sk-create-diagram/scripts/validate-flowchart.sh",
    ".opencode/skills/sk-doc/sk-create-diagram/scripts/drawio_extract.py",
    ".opencode/skills/sk-doc/sk-create-diagram/scripts/mermaid_extract.py",
    ".opencode/skills/sk-doc/sk-create-diagram/manual-testing-playbook/manual-testing-playbook.md",
    ".opencode/skills/sk-doc/feature-catalog/feature-catalog.md",
    ".opencode/commands/create/assets/create-diagram-auto.yaml"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

Merged across both lineages. Cross-lineage duplicate pairs noted inline (`F005 == F-T-001`, emitted independently by both lineages). Reducer `SUMMARY-*` rows from grok iteration-5 cumulative counts are audit noise and excluded from this table (see §8).

| ID | Sev | Dimension | Title | Evidence | Lineage(s) | Status |
|----|-----|-----------|-------|----------|-----------|--------|
| F005 / F-T-001 | P1 | traceability | leaf-manifest.json stale after resource reorganization (75/87 leaves missing) | `.opencode/skills/sk-doc/leaf-manifest.json` vs shipped `references/foundations|types|import-export/`, `assets/templates|examples/` tree | grok + deepseek-go (independent) | active |
| F-T-002 | P1 | traceability | command-metadata.json describes /create:diagram as HTML/SVG-only | `command-metadata.json:397` vs `diagram.md:3` (includes flowchart.md + `--output-format ascii-markdown`) | grok | active |
| F001 | P1 | correctness | 4px-grid rule contradicts style-guide typography tokens and shipped examples | `SKILL.md:337`, `style-guide.md:92-99`, 1,357 off-grid coords in 34 examples | deepseek-go | active |
| F003 | P1 | security | Systemic stale SKILL.md section-number cross-references | `create-diagram-auto.yaml:268/305/337/390/423/504`, `import-drawio.md:100/130/138/159`, `import-mermaid.md:92/100`, `notation-and-validator.md:17/93` (SKILL.md has only §1-§6) | deepseek-go | active |
| F-C-001 | P2 | correctness | UNKNOWN_FALLBACK checklist still asks only for an .html deliverable | `SKILL.md:213` after ascii-markdown shipped | grok | active |
| F-C-002 | P2 | correctness | Validator nesting check treats box-drawing leading spaces as markdown indent | `validate-flowchart.sh:92`; `simple-workflow.md` warns level 9, `decision-tree-flow.md` warns level 21, both exit 0 | grok | active |
| F-C-003 | P2 | correctness | LOAD_LEVELS map never consulted by route_diagram_resources | `SKILL.md:204` declares, `SKILL.md:258-290` router body never reads it | grok | active |
| F-S-001 | P2 | security | Extract --out writes to arbitrary path with no confinement | `drawio_extract.py:958`, `mermaid_extract.py:1411` | grok | active |
| F-T-003 | P2 | traceability | hub-router create-diagram-aliases omits export diagram | `hub-router.json:50` vs `mode-registry.json` aliases | grok | active |
| F-M-001 | P2 | maintainability | Extract scripts have no committed regression suite | `scripts/README.md:95` documents py_compile/--help only | grok | active |
| F002 | P2 | correctness | Validator-mechanics doc drifts from validator regex | `notation-and-validator.md:32` vs `validate-flowchart.sh:60` | deepseek-go | active |
| F004 | P2 | security | PNG export rasterizes source HTML (executes embedded JS) in headless Chromium | `export.md:96-112` `page.goto(file://...)` vs `import-mermaid.md:153` trust doctrine | deepseek-go | active |
| F006 | P2 | traceability | Feature catalog undercounts registered aliases (17 vs 27) | `feature-catalog.md:168`, `hub-registration.md:29` vs `mode-registry.json` | deepseek-go | active |
| F007 | P2 | traceability | Playbook claims feature-catalog not present though it ships | `manual-testing-playbook.md:21` vs `feature-catalog/` (root + 8 files) | deepseek-go | active |
| F008 | P2 | maintainability | Duplicated extractor scaffolding across both IR scripts | `clean_label`, `_has_cycle`, `shape_family`, `analyze`, `digest`, `to_json`, `main` in both `drawio_extract.py` and `mermaid_extract.py` | deepseek-go | active |
| F009 | P2 | maintainability | Example corpus predates current style-guide skin | `style-guide.md:50` acknowledges; 34 examples are reference-and-non-compliant | deepseek-go | active |

---

## 4. Remediation Workstreams

### R1 — Registry refresh (P1, traceability)
Constituents: **F005/F-T-001**, **F-T-002**, **F-T-003**, **F006**, **F007**. Regenerate `leaf-manifest.json` from the shipped tree (87 leaves must resolve; or reduce to the 12 valid leaves), align `command-metadata.json` `/create:diagram` description + argumentHint with `diagram.md` (html + ascii-markdown targets), add `export diagram` to `hub-router.json` `create-diagram-aliases`, fix the alias count in the feature catalog (27 not 17), and drop the stale "not yet present" playbook sentence. Execution order: F005/F-T-001 → F-T-002 → F-T-003 → F006 → F007.

### R2 — Contract reconciliation (P1, correctness/traceability)
Constituents: **F001**, **F003**, **F009**. Resolve the grid-vs-typography contradiction at the source (`SKILL.md:337` vs `style-guide.md:92-99`), correct every `SKILL.md §N` citation to the real §1–§6 anchors (taste gate = §6, connector rules = §4 NEVER 11–15, budget = §3), and regenerate the example corpus against the current skin or demote it to illustrative-only. Execution order: F001 → F003 → F009.

### R3 — Documentation and safety polish (P2)
Constituents: **F002**, **F004**, **F008**, **F-C-001**, **F-C-002**, **F-C-003**, **F-S-001**, **F-M-001**. Align validator doc with the regex, add a script-execution caveat to PNG export (or render the extracted SVG), extract shared extractor scaffolding, add the .md/ascii-markdown option to the disambiguation checklist, measure logical box nesting rather than leading whitespace, wire or remove `LOAD_LEVELS`, confine `--out` to the source tree, and add extractor fixtures.

---

## 5. Spec Seed

- **Registry drift** (F005/F-T-001, F-T-002, F-T-003, F006, F007): hub registries (leaf-manifest, command-metadata, hub-router, feature-catalog, playbook) must reflect shipped reality at release time; regenerating leaf-manifest on any resource move should be a packaging-gate step.
- **Contract contradiction** (F001, F009): the 4px-grid rule and typography tokens must agree; define the example corpus as either canonical (regenerate) or illustrative-only (no compliance expectation).
- **Section integrity** (F003): every `SKILL.md §N` citation must resolve to an existing header; the /create:diagram YAML taste-gate step must cite the real location (`SKILL.md §6`).
- **Validator/security** (F002, F004, F-C-002, F-S-001): doc-script parity, export script-execution caveat, logical nesting measure, `--out` confinement.

---

## 6. Plan Seed

1. **R1a** — Regenerate `.opencode/skills/sk-doc/leaf-manifest.json` (87 leaves → all resolving). (`F005/F-T-001`)
2. **R1b** — Patch `command-metadata.json` `/create:diagram` description + argumentHint to match `diagram.md`. (`F-T-002`)
3. **R1c** — Add `export diagram` to `hub-router.json` `create-diagram-aliases`. (`F-T-003`)
4. **R1d** — Fix alias count in `feature-catalog/feature-catalog.md:168` and `hub-registration.md:29`. (`F006`)
5. **R1e** — Remove the stale not-present sentence in `manual-testing-playbook.md:21`. (`F007`)
6. **R2a** — Amend `SKILL.md:337` grid rule or `style-guide.md:92-99`; regenerate 34 examples or add demotion note. (`F001`, `F009`)
7. **R2b** — Fix section-number citations in `create-diagram-auto.yaml`, `import-drawio.md`, `import-mermaid.md`, `notation-and-validator.md`. (`F003`)
8. **R3a** — Align `notation-and-validator.md:32` tokens with `validate-flowchart.sh:60`. (`F002`)
9. **R3b** — Add headless-browser script-execution caveat to `export.md` PNG procedure. (`F004`)
10. **R3c** — Extract shared extractor scaffolding; add fixtures for DTD reject, size ceilings, `--out`. (`F008`, `F-M-001`)
11. **R3d** — Add .md/ascii-markdown option to disambiguation checklist; wire or remove `LOAD_LEVELS`; confine `--out`. (`F-C-001`, `F-C-003`, `F-S-001`)

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Findings |
|----------|--------|------|----------|----------|
| `spec_code` | partial | hard | SKILL.md vs style-guide.md:337/92-99; leaf-manifest vs tree; section refs | F001, F003, F005/F-T-001, F-T-002 |
| `checklist_evidence` | notApplicable | hard | Skill packet and 013 review packet have no checklist.md; playbook/benchmark evidence used instead | none |

### Overlay Protocols

| Protocol | Status | Gate | Evidence | Findings |
|----------|--------|------|----------|----------|
| `skill_agent` | partial | advisory | Router/presentation split correct; §-references drift | F003 |
| `agent_cross_runtime` | notApplicable | advisory | No per-runtime agent definitions reference sk-create-diagram | — |
| `feature_catalog_code` | fail | advisory | Catalog hub-registration overstates hub-router alias completeness; alias count stale | F-T-003, F005, F006 |
| `playbook_capability` | partial | advisory | CMD-002 cannot confirm `references/types/type-*.md` in current leaf-manifest; stale not-present claim | F005/F-T-001, F007 |

**AC_COVERAGE**: exempt (review target is a skill, not a Level-2+ spec-folder lifecycle target).

**Resource Map Coverage Gate**: `resource-map.md` was not present at init in the spec folder (gate skipped). Review-emitted `review/resource-map.md` covers 7 skill resources analyzed across both lineages with 0 missing on disk.

---

## 8. Deferred Items

- P2 advisories F002, F004, F006, F007, F008, F009, F-C-001, F-C-002, F-C-003, F-S-001, F-T-003, F-M-001 are non-blocking for the verdict but should be swept with R1–R3.
- Example-corpus regeneration is a committed follow-up task (`style-guide.md:50` names it a "v5.1 task").
- The 34-example accessibility contract and no-JS properties were spot-verified; a full per-example audit is deferred.
- Reducer `SUMMARY-*` rows (grok iteration-5 cumulative counts; `SUMMARY-P1-001/002`, `SUMMARY-P2-001..006`) are audit noise produced by the reducer's summary-only fallback and are excluded from the verdict and finding table.
- Coverage-graph DB upserts were skipped at lineage write boundaries (graphless fallback used); parent-level graph convergence not applicable.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated directions: none (all four dimensions covered by both lineages)
- Remaining frontier: none

---

## 9. Search Ledger

- `hasSearchDebt:` false
- `graphCoverageMode:` graphless_fallback (coverage-graph DB writes outside lineage write boundary)
- Covered bug classes: off_by_one, path_traversal, spec_mismatch, missing_tests
- Ruled out: XXE/DTD expansion, Mermaid eval/fetch, decompression bombs, shell injection in validator, secrets in packet, dead markdown links, missing 27 type files, type/template/pattern count claims (verified 27/4/6)
- `*Search-depth state captured in iteration JSONL v2 ledgers (SL-001..SL-501).*`

---

## 10. Audit Appendix

### Convergence Summary

| Lineage | Iterations | Stop reason | Verdict | P0/P1/P2 |
|---------|-----------|-------------|---------|----------|
| grok | 5 | converged (rolling avg 0.031 < 0.08; 4/4 dims; coverage age ≥ 1) | CONDITIONAL | 0/2/6 |
| deepseek-go | 5 | maxIterationsReached (5/5) | CONDITIONAL | 0/3/6 |
| **Merged** | **10** | strongest-restriction | **CONDITIONAL** | **0/7*/18*** |

\* Merged registry counts include 1 cross-lineage duplicate pair (F005/F-T-001) and 8 reducer summary-noise rows (SUMMARY-*). Distinct real findings: **4 P1 / 12 P2**.

### Coverage Summary

- Both lineages covered all four dimensions independently (correctness → security → traceability → maintainability), plus a stabilization/replay iteration.
- Combined reviewed surface: SKILL.md, style-guide, all reference families, both extractors, validator, hub manifests, feature catalog, playbook, command wiring, example corpus.

### Adversarial Self-Check (P0/P1)

Both lineage reports ran independent adversarial checks on their P1 findings; each confirmed its P1s with direct file:line re-reads (e.g. grok re-ran the 87-leaf existence check = 75 missing; deepseek re-grepped all SKILL.md headers §1–§6 only). No P0 downgrades, no false positives adopted.

### Ruled Out (consolidated)

- XXE / decompression bombs / DTD expansion in extractors: ruled out (bounded decompress, `_reject_unsafe_xml`, size caps).
- Shell injection in validator: ruled out (quoted args, no eval).
- Secrets in packet: ruled out (scan clean).
- Dead markdown links: ruled out (0 dead links).
- Mermaid eval/fetch and packet-owned onboarding network fetch: ruled out.
- Type/template/pattern count claims: verified accurate (27/4/6).
- Accessibility SVG contract violations in examples: ruled out (spot-verified `role="img"` + `aria-hidden`).

### Cross-Reference Appendix

**Core Protocols:** `spec_code` (partial), `checklist_evidence` (notApplicable — no checklist.md in scope).

**Overlay Protocols:** `skill_agent` (partial), `agent_cross_runtime` (notApplicable), `feature_catalog_code` (fail), `playbook_capability` (partial).

### Sources Reviewed

Iteration files 1–5 per lineage, per-lineage `deep-review-state.jsonl`, findings registries, dashboards, both lineage `review-report.md` files, plus ~30 distinct source files across the skill packet, hub manifests, and command wiring.
