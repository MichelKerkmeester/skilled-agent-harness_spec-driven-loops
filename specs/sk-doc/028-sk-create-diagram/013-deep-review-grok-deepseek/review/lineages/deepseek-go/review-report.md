# Deep Review Report — skill:sk-create-diagram

**Lineage:** `deepseek-go` (fan-out) · **Session:** fanout-deepseek-go-1786561206858-teuyl2 · **Generation:** 1
**Review packet:** `specs/sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek/review/lineages/deepseek-go/`

---

## 1. Executive Summary

| Field | Value |
|---|---|
| **Verdict** | **CONDITIONAL** |
| **hasAdvisories** | false |
| **Active P0** | 0 |
| **Active P1** | 3 (F001, F003, F005) |
| **Active P2** | 6 (F002, F004, F006, F007, F008, F009) |
| **Scope** | Skill `sk-create-diagram` v1.0.0.0 — SKILL.md, references/ (27 types, foundations, primitives, import-export, ascii-format), assets/ (templates, 34 examples, 6 ascii patterns, icons), scripts/ (2 Python extractors + shell validator), feature-catalog/, manual-testing-playbook/, benchmark reports, hub manifests (mode-registry, hub-router, leaf-manifest), `/create:diagram` command wiring |
| **Dimensions covered** | 4/4 (correctness, security, traceability, maintainability) |
| **Stop reason** | `maxIterationsReached` (5/5 iterations) |
| **Iterations** | 5 (runs 1–5) |

The packet is fundamentally sound: import trust boundaries hold (bounded decompression, DTD/ENTITY rejection, no source execution in the extractors), the accessibility SVG contract is honored by shipped examples, self-contained no-JS HTML is verified, the 27-type / 4-template / 6-pattern counts are accurate, no dead markdown links exist, and no secrets were found. The CONDITIONAL verdict is driven by three live documentation/integration-integrity contradictions (P1) — all fixable in-doc without touching the drawing engine.

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
    { "findingId": "F001", "severity": "P1", "dimension": "correctness", "title": "4px-grid rule contradicts style-guide typography tokens and shipped examples" },
    { "findingId": "F003", "severity": "P1", "dimension": "traceability", "title": "Stale SKILL.md section-number cross-references across workflow YAML and references" },
    { "findingId": "F005", "severity": "P1", "dimension": "traceability", "title": "leaf-manifest.json 75/87 leaves resolve to nonexistent paths" },
    { "findingId": "F002", "severity": "P2", "dimension": "correctness", "title": "Validator-mechanics doc drifts from validator regex" },
    { "findingId": "F004", "severity": "P2", "dimension": "security", "title": "PNG export executes source HTML in headless Chromium" },
    { "findingId": "F006", "severity": "P2", "dimension": "traceability", "title": "Feature catalog undercounts aliases (17 vs 27)" },
    { "findingId": "F007", "severity": "P2", "dimension": "traceability", "title": "Playbook claims feature-catalog not present though it ships" },
    { "findingId": "F008", "severity": "P2", "dimension": "maintainability", "title": "Duplicated extractor scaffolding across both IR scripts" },
    { "findingId": "F009", "severity": "P2", "dimension": "maintainability", "title": "Example corpus predates current style-guide skin" }
  ],
  "remediationWorkstreams": [
    { "lane": "R1 - Contract reconciliation", "findings": ["F001", "F009"] },
    { "lane": "R2 - Cross-reference integrity", "findings": ["F003", "F005", "F006", "F007"] },
    { "lane": "R3 - Documentation/safety polish", "findings": ["F002", "F004", "F008"] }
  ],
  "specSeed": [
    "Reconcile the 4px-grid font-size list with the style-guide typography tokens, or add an explicit exemption",
    "Regenerate or explicitly demote the shipped example corpus to illustrative-only",
    "Correct every SKILL.md §N cross-reference to the real §1-§6 locations",
    "Regenerate leaf-manifest.json against the reorganized tree"
  ],
  "planSeed": [
    "R1: update SKILL.md:337 grid rule and/or style-guide.md:92-99; regenerate examples or add demotion note",
    "R2: fix create-diagram-auto.yaml:268/337 + import-*.md + notation-and-validator.md section refs; regenerate leaf-manifest; fix alias count in feature-catalog",
    "R3: align notation-and-validator.md:32 with validate-flowchart.sh:60; add export.md script-execution caveat; extract shared extractor scaffolding"
  ],
  "findingClasses": {
    "spec-contradiction": ["F001"],
    "stale-cross-reference": ["F003", "F005", "F006", "F007"],
    "doc-script-drift": ["F002"],
    "trust-doctrine-inconsistency": ["F004"],
    "maintenance-debt": ["F008", "F009"]
  },
  "affectedSurfacesSeed": [
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
    ".opencode/skills/sk-doc/leaf-manifest.json",
    ".opencode/skills/sk-doc/feature-catalog/feature-catalog.md",
    ".opencode/commands/create/assets/create-diagram-auto.yaml"
  ],
  "fixCompletenessRequired": false
}
```

---

## 3. Active Finding Registry

| ID | Sev | Dimension | Title | Evidence | First/Last | Status |
|----|-----|-----------|-------|----------|------------|--------|
| F001 | P1 | correctness | 4px-grid rule contradicts style-guide typography tokens and shipped examples | `SKILL.md:337`, `style-guide.md:92-99`, examples (1,357 off-grid coords) | 1/1 | active |
| F003 | P1 | traceability | Stale SKILL.md section-number cross-references | `create-diagram-auto.yaml:268`, `import-drawio.md:100`, `import-mermaid.md:92`, `notation-and-validator.md:17` | 2/2 | active |
| F005 | P1 | traceability | leaf-manifest.json 75/87 leaves resolve to nonexistent paths | `leaf-manifest.json` vs reorganized tree | 3/3 | active |
| F002 | P2 | correctness | Validator-mechanics doc drifts from validator regex | `notation-and-validator.md:32` vs `validate-flowchart.sh:60` | 1/1 | active |
| F004 | P2 | security | PNG export executes source HTML in headless Chromium | `export.md:108` vs `import-mermaid.md:153` | 2/2 | active |
| F006 | P2 | traceability | Feature catalog undercounts aliases (17 vs 27) | `feature-catalog.md:168`, `mode-registry.json` | 3/3 | active |
| F007 | P2 | traceability | Playbook claims feature-catalog not present though it ships | `manual-testing-playbook.md:21` vs `feature-catalog/` | 3/3 | active |
| F008 | P2 | maintainability | Duplicated extractor scaffolding across both IR scripts | `drawio_extract.py`, `mermaid_extract.py` | 4/4 | active |
| F009 | P2 | maintainability | Example corpus predates current style-guide skin | `style-guide.md:50`, `assets/examples/*.html` | 4/4 | active |

---

## 4. Remediation Workstreams

### R1 — Contract reconciliation (P1, correctness)
Constituents: **F001**, **F009**. Resolve the grid-vs-typography contradiction at the source: either amend `SKILL.md:337` to exempt the token-table sizes (9px/7px/8px/14px) or re-express the typography table in grid-valid sizes, then regenerate the example corpus against the current skin or explicitly demote the examples to illustrative-only (`style-guide.md:50` already flags this as a v5.1 task — promote it). Execution order: F001 first (it drives F009).

### R2 — Cross-reference integrity (P1, traceability)
Constituents: **F003**, **F005**, **F006**, **F007**. Correct every `SKILL.md §N` citation to the real §1–§6 anchors (taste gate = §6, connector rules = §4 NEVER 11–15, budget = §3), regenerate `leaf-manifest.json` from the shipped tree (or reduce the leaf set to the 12 valid entries), fix the alias count in the feature catalog (27 not 17), and drop the stale "not yet present" playbook sentence. Execution order: F005 → F003 → F006 → F007.

### R3 — Documentation and safety polish (P2)
Constituents: **F002**, **F004**, **F008**. Align `notation-and-validator.md` connector tokens with `validate-flowchart.sh`; add a script-execution caveat to the PNG export path (or render the extracted SVG); extract shared digest/analysis scaffolding between the two extractors.

---

## 5. Spec Seed

- **F001/F009**: Amend the 4px-grid font-size rule (`SKILL.md:337`) or the typography token table (`style-guide.md:92-99`) so they agree; define the example corpus as either canonical (regenerate to the current skin) or illustrative-only (no compliance expectation).
- **F003**: Add a traceability rule that every `SKILL.md §N` citation resolves to an existing header; the /create:diagram YAML's taste-gate step must cite the real location (`SKILL.md §6`).
- **F005**: Bind `leaf-manifest.json` generation to the packet tree (regenerate on any resource move); the packaging gate should fail on unresolved leaves.
- **F006/F007**: Feature catalog and playbook must reflect shipped reality at release time (alias count, catalog presence).

---

## 6. Plan Seed

1. **R1** — `SKILL.md` §3 grid rule: add explicit font-size exemption for token-table sizes OR change the typography table to 8/12/16; regenerate 34 examples or add a demotion note. (`F001`, `F009`)
2. **R2a** — Regenerate `.opencode/skills/sk-doc/leaf-manifest.json` (87 leaves → all resolving). (`F005`)
3. **R2b** — Fix section-number citations in `create-diagram-auto.yaml`, `import-drawio.md`, `import-mermaid.md`, `notation-and-validator.md`, `README.md`. (`F003`)
4. **R2c** — Fix alias count in `feature-catalog/feature-catalog.md:168` and `hub-registration.md:29`. (`F006`)
5. **R2d** — Remove the stale not-present sentence in `manual-testing-playbook.md:21`. (`F007`)
6. **R3a** — Align `notation-and-validator.md:32` tokens with `validate-flowchart.sh:60`. (`F002`)
7. **R3b** — Add a headless-browser script-execution caveat to `export.md` PNG procedure. (`F004`)
8. **R3c** — Extract shared scaffolding (`clean_label`, `_has_cycle`, `shape_family`, `analyze`, `digest`, `to_json`) into a common module used by both extractors. (`F008`)

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Findings |
|----------|--------|------|----------|----------|
| `spec_code` | partial | hard | SKILL.md:337 vs style-guide.md:92; leaf-manifest vs tree | F001, F003, F005 |
| `checklist_evidence` | partial | hard | SKILL.md:508 grid checklist fails on shipped examples; alias count mismatch | F001, F006 |

### Overlay Protocols

| Protocol | Status | Gate | Evidence | Findings |
|----------|--------|------|----------|----------|
| `skill_agent` | partial | advisory | Router/presentation split correct; §-references drift | F003 |
| `agent_cross_runtime` | notApplicable | advisory | No agent definitions reference sk-create-diagram | — |
| `feature_catalog_code` | fail | advisory | Catalog claims don't match tree/registry | F005, F006 |
| `playbook_capability` | partial | advisory | Playbook scenarios runnable (9/9 benchmark runs, no FAIL); stale not-present claim | F007 |

**AC_COVERAGE**: exempt (review target is a skill, not a Level-2+ spec-folder lifecycle target).

---

## 8. Deferred Items

- P2 advisories F002, F004, F006, F007, F008, F009 are non-blocking for the verdict but should be swept with R1–R3.
- Example-corpus regeneration is a committed follow-up task (`style-guide.md:50` names it a "v5.1 task").
- The 34-example accessibility contract and no-JS properties were spot-verified; a full per-example audit is deferred.

---

## 9. Audit Appendix

### Iteration Table

| Run | Focus | Dimension | Files | New P0/P1/P2 | Ratio | Verdict |
|-----|-------|-----------|-------|--------------|-------|---------|
| 1 | Correctness | D1 | SKILL.md, style-guide, notation-and-validator, validate-flowchart.sh, drawio_extract.py, mermaid_extract.py, examples/templates scan | 0/1/1 | 1.0 | CONDITIONAL |
| 2 | Security | D2, traceability | import-drawio, import-mermaid, export.md, create-diagram-auto.yaml, README | 0/1/1 | 1.0 | CONDITIONAL |
| 3 | Traceability | D3 | feature-catalog, playbook, mode-registry, hub-router, leaf-manifest | 0/1/2 | 1.0 | CONDITIONAL |
| 4 | Maintainability | D4 | changelog, benchmark README, scripts README, extractors, style-guide | 0/0/2 | 1.0 | PASS |
| 5 | Stabilization | all | SKILL.md, style-guide, leaf-manifest, examples | 0/0/0 | 0.0 | PASS |

### Convergence Replay

- **Stop reason:** `maxIterationsReached` (iteration_count=5 >= maxIterations=5). Hard-stop precedence over composite convergence.
- **Rolling average (last 2 ratios):** mean(0.0, 1.0) = 0.50 → not below 0.08; would not have voted STOP.
- **MAD noise floor:** ratios [1.0,1.0,1.0,1.0,0.0]; MAD=0.0, latest 0.0 <= 0.0 → would have voted STOP.
- **Dimension coverage:** 4/4 covered, stabilization pass >= 1 → coverage vote STOP.
- **Composite stop score:** (0.30×0)+(0.25×1)+(0.45×1) = 0.70 >= 0.60 → composite vote STOP. However, the max-iteration hard stop fired first (priority 1); the composite signal corroborates saturation.
- **Legal-stop gates (recorded at terminal stop):** convergenceGate pass (hard stop met); dimensionCoverageGate pass (4/4); p0ResolutionGate pass (activeP0=0); evidenceDensityGate pass (every active P0/P1 has file:line); hotspotSaturationGate pass; claimAdjudicationGate pass (last claim_adjudication passed:true, activeP0P1=3 all packetized); fixCompletenessReplayGate pass (securitySensitive=false); candidateCoverageGate pass (no search debt); graphlessFallbackGate pass (graph mode n/a).
- **P0 override:** none triggered (no new P0).
- **Verdict derivation:** activeP0=0, activeP1=3 → CONDITIONAL (per review-mode-contract).

### Coverage Matrix

| File group | D1 | D2 | D3 | D4 |
|------------|----|----|----|----|
| SKILL.md / style-guide.md | x | | | x |
| import-drawio.md / import-mermaid.md / export.md | | x | | |
| create-diagram-auto.yaml / diagram.md | | x | | |
| mode-registry / hub-router / leaf-manifest | | | x | |
| feature-catalog / manual-testing-playbook | | | x | |
| drawio_extract.py / mermaid_extract.py / validate-flowchart.sh | x | x | | x |
| templates / examples / ascii-patterns | x | | | x |
| changelog / benchmark / scripts README | | | | x |

### Adversarial Self-Check (P0/P1)

- **F001** (P1): re-read SKILL.md:337 and style-guide.md:92-99 and re-counted 1,357 off-grid coords in iteration 5 — confirmed, no downgrade. Alternative "earlier skin" explanation rejected: style-guide.md is the declared single source of truth and still prescribes 9/7/14px.
- **F003** (P1): re-grepped all SKILL.md headers (§1–§6 only) and re-counted the drift set — confirmed, no downgrade. The HARD_BLOCK taste-gate step citing a non-existent section is a real integrity defect for an authoring skill.
- **F005** (P1): re-ran the 87-leaf existence check (75 missing) — confirmed, no downgrade. Hub leaf inventory is 86% broken after reorganization.

### Ruled Out (consolidated)

- Accessibility SVG contract violations in examples: ruled out (spot-verified `role="img"` + `aria-hidden` decoration in high-level example).
- XXE / decompression bombs in extractors: ruled out (`_reject_unsafe_xml`, bounded decompress, size caps).
- Shell injection in validator: ruled out (quoted args, no eval).
- Secrets in packet: ruled out (scan clean).
- Dead markdown links: ruled out (proper per-file resolution = 0 dead links).
- Type/template/pattern count claims: verified accurate (27/4/6).

### Sources Reviewed

Iteration files 1–5, deep-review-state.jsonl (12 records), findings registry (9 active), dashboard, plus ~25 distinct source files across the skill packet, hub manifests, and command wiring.
