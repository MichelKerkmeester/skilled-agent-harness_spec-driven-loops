---
title: "Architecture Decision Record: sk-doc parent-hub conversion"
description: "Locks the sk-doc monolith-to-parent-hub architecture from the phase 001 deep research: final 8-packet set, mode-registry/hub-router schema, the complete 35-leaf facade map (D10), shared/ split, advisor plan, extensions, and the facade-first cutover sequencing. Gates the build phases (003+) behind operator approval."
contextType: "implementation"
importance_tier: "high"
parent: "skilled-agent-orchestration/125-sk-doc-parent/002-architecture-decision"
---

# ADR — sk-doc Parent-Hub Architecture

**Status:** Approved-pending-review — operator decided D4=B (create-flowchart packet) and requested an ADR review before build phases 003+ begin.
**Inputs:** `../001-research-and-canon/research/research.md` (30-iteration GPT-5.5 deep research) + the D10 facade sweep in this phase.
**Gate:** Build phases 003+ begin ONLY after operator review sign-off. D4 is now RESOLVED (B).

---

## 1. Context

`sk-doc` is a 6-mode monolith and the last major authoring skill not on the canonical two-axis parent-hub pattern. The phase-001 deep research (94 breadth rulings + 8 adversarial verdicts, all `file:line`-cited) settled the packet set, invariants, and the dominant migration constraint (external-path coupling). This ADR converts those findings into locked decisions + concrete specs.

---

## 2. Decisions

### D1 — Packet set: **9 workflow packets** (HIGH; D4 resolved to a live flowchart packet)
`create-skill` (+ `create-skill-parent` as a 2nd `workflowMode` over the same packet), `create-readme` (install-guide folded), `create-agent`, `create-command` (lean), `create-feature-catalog`, `create-manual-testing-playbook`, `create-benchmark` (narrowed to the MCP benchmark-folder promotion lifecycle), `doc-quality` (NEW), **`create-flowchart` (NEW — operator D4=B).** **`create-changelog` FOLDS** (its `changelog_template.md` → `shared/assets/`; `/create:changelog` — the real workflow owner — points at it). This revised the pre-research 6-packet guess; `create-command`/`create-benchmark`/`create-agent` each passed the 124/022 distinct-lifecycle bar under adversarial refutation. **`create-flowchart` MITIGATION (124/022 shell risk):** it must own real behaviour — the flowchart pattern library + `validate_flowchart.sh` gate + a distinct "generate/validate an ASCII diagram" contract — not just wrap the assets; keep it lean and give it a bound command/route so it is not a near-empty shell.

### D2 — `create-command` shape (MED → resolved to standalone-lean)
Keep `create-command` a standalone lean packet (adversarial CONFIRMED: distinct `argument-hint`/`allowed-tools` frontmatter lifecycle + presentation/router split). Its validator depth is shallow (`extract_structure.py` frontmatter-only), so keep it compact; do not add packet-only scripts.

### D3 — `doc-quality` (HIGH)
Advisor-routable WORKFLOW packet (not backbone) — the `sk-design`-audit analog: validate/score/optimize an existing doc (extract → DQI → HVR → validate). **Add a `/doc:quality` command, report-only by default.** It OWNS `optimization.md` + `workflows.md` as procedure; it CITES the shared pipeline.

### D4 — Flowchart disposition: **RESOLVED → B (promote to `create-flowchart` packet)** (operator)
Operator chose **B**: `create-flowchart` becomes a live 9th workflow packet owning `assets/flowcharts/*` + `validate_flowchart.sh` + a distinct generate/validate-ASCII-diagram contract. Consequences: packet count = 9; **no `deprecated-modes` shim** (the public `FLOWCHART`/`ascii-diagram` route now maps to a live packet, so nothing dangles → D8 stays truly zero-extension). Shell-risk mitigation per D1. (Rejected A = retire + `deprecated-modes`.)

### D5 — `mode-registry.json` schema (HIGH)
Every entry `packetKind: "workflow"` (no surface/evidence-base). Two `backendKind` values: `template-scaffold` (create-* generators) and `doc-quality`. `routingClass: "metadata"` default with a per-mode `command` field even on metadata modes; `command-bridge` only for command-only modes; **no** `lexical`/`alias-fold`. `create-skill-parent` = a 2nd `workflowMode` inside `create-skill`.

### D6 — `hub-router.json` schema (HIGH)
`set(routerSignals.keys) == set(modes[].workflowMode)` bidirectionally; `vocabularyClasses` per create-* verb + doc-quality; `tieBreak` covers every mode; `outcomes` = `single | orderedBundle | defer` — **no `surfaceBundle`**.

### D7 — `shared/` vs packet-owned split (HIGH)
- **shared/scripts/**: `extract_structure`, `validate_document`, `quick_validate`, `frontmatter-version.mjs`, `check-frontmatter-versions.sh`, `validate-doc-model-refs.js`. Per-type `validate_document` checks stay as adapters inside the shared validator.
- **Packet-owned scripts:** `init_skill.py` + `package_skill.py` → `create-skill`; `audit_readmes.py` → `create-readme`; `validate_flowchart.sh` → `create-flowchart` (D4=B).
- **shared/references/global/**: `hvr_rules`, `evergreen_packet_id_rule`, `core_standards`, `validation`, `quick_reference` (front-door, pointers only), `frontmatter_versioning` (folded).
- **doc-quality-owned:** `optimization.md`, `workflows.md`.
- **create-flowchart-owned:** `assets/flowcharts/*` (the pattern library) + `validate_flowchart.sh` (D4=B).
- **shared/assets/**: `frontmatter_templates`, `llmstxt_templates`, `template_rules.json`, `changelog_template` (folded).

### D8 — Named extensions (HIGH)
**Zero active extensions — definitive** (D4=B: flowchart is a live packet, so no `deprecated-modes` shim is needed and nothing dangles). No surface-axis / runtime-loop / transform-verbs / advisor-projection. `sk-doc` is the pure two-tier core.

### D9 — Advisor / skill-graph (HIGH)
Exactly ONE `graph-metadata.json` at the hub (adversarial CONFIRMED: the scanner recursively discovers every `graph-metadata.json` and throws on `skill_id != folder`; a child one = rogue identity). Keep `sk-doc` as the single flat public identity; project trigger phrases into workflow aliases + `routerSignals`. Rewrite the hub `graph-metadata.json` `derived.*` to span all surfaces; create `description.json` (new). **Add high-specificity `sk-doc` explicit-lane coverage in `skill_advisor.py` for the create-* verbs** (benchmark/command/feature-catalog/skill/agent/readme/playbook + doc-quality) so single-identity routing doesn't misroute.

### D10 — Complete facade map (HIGH — the load-bearing artifact)
**Finding:** 14,408 external reference *lines* exist, but only **36 distinct RUNTIME-referenced leaf paths** (command YAMLs + pre-commit + `/doctor` `audit_descriptions.py` + `check-markdown-links.cjs`) actually break if a path moves. The other ~14K are **stale-but-non-breaking doc/text mentions** (specs, changelogs, playbook markdown) — out of facade scope; optional evergreen-rule cleanup later.

**Facade strategy:** keep `sk-doc/{scripts,references,assets}` as **real root directories** whose leaves are **symlinks inward** to the relocated canonical homes (`shared/` or the owning child packet). This resolves all 36 runtime paths → **zero external edits**. The 35 facade leaves (SKILL.md excluded — it's the hub's own file):

| Root facade path | → canonical home |
|---|---|
| `scripts/extract_structure.py`, `validate_document.py`, `quick_validate.py`, `validate-doc-model-refs.js` | `shared/scripts/` |
| `scripts/init_skill.py`, `scripts/package_skill.py` | `create-skill/scripts/` |
| `references/skill_creation.md`, `references/skill_creation/parent_skills_nested_packets.md`, `parent_hub_router_schema.md` | `create-skill/references/` |
| `references/agent_creation.md` | `create-agent/references/` |
| `references/feature_catalog_creation.md` | `create-feature-catalog/references/` |
| `references/manual_testing_playbook_creation.md` | `create-manual-testing-playbook/references/` |
| `references/global/core_standards.md`, `references/global/validation.md` | `shared/references/global/` |
| `assets/skill/*` (5 skill templates + 5 `parent_skill_*` templates) | `create-skill/assets/skill/` |
| `assets/agent_template.md` | `create-agent/assets/` |
| `assets/command/command_template.md` | `create-command/assets/` |
| `assets/readme/readme_template.md`, `readme/install_guide_template.md` | `create-readme/assets/` |
| `assets/feature_catalog/*` (2) | `create-feature-catalog/assets/` |
| `assets/testing_playbook/*` (2) | `create-manual-testing-playbook/assets/` |
| `assets/benchmark/benchmark_report_template.md` | `create-benchmark/assets/` |
| `assets/changelog_template.md` | `shared/assets/` (folded) |
| `assets/frontmatter_templates.md` | `shared/assets/` |

Additionally reconcile the two fail-open code sites explicitly (not via facade alone): `/doctor` `audit_descriptions.py` budget-constant import and `check-markdown-links.cjs` allowlist keys. Sibling `SKILL.md` citations (`sk-git`, `sk-design`) point at doc paths under the facade and resolve unchanged.

### D11 — Cutover order: **facade-first** (HIGH)
1. Create nested packet dirs + `shared/` tree with canonical files.
2. Create the 35 root facade symlinks (both `references/`+`assets/` leaves) for every runtime path.
3. Verify all 14 `/create:*` YAMLs (auto **and** confirm) + pre-commit + `audit_descriptions.py` + `check-markdown-links.cjs` resolve.
4. Rewrite `graph-metadata.json` + create `description.json` + advisor boosters; regenerate `skill-graph.json`.
5. ONLY THEN any optional explicit command-repoint (isolated later commit).
**Never** move `parent_skill_*` templates before their facades exist (`missing_hub_template` hard-stop for `/create:sk-skill-parent`). **Never** edit workflow YAML mid-run. Command YAMLs are **facade-preserved** in the split commit, not repointed.

---

## 3. Consequences

- **Zero external edits** for the ~14K doc mentions and the 36 runtime refs (facade-covered).
- `sk-doc` presents one advisor identity; 8 create-* + doc-quality routes reachable by verb.
- Reversible: the split is symlink-based; rollback = restore the monolith tree from VCS.
- Open risk retired: the research's "facade gap" is closed by the enumerated 35-leaf map + the preserve-root-dir-shape strategy.

## 4. Alternatives rejected
- 6-packet fold (folding command/benchmark) — rejected by adversarial evidence (distinct lifecycles).
- Surface axis for doc-quality — category error (universal doctrine, not orthogonal stack-evidence).
- 3-symlink facade — insufficient (misses 33 of 36 runtime leaves).
- Explicit-repoint in the split commit — breaks the self-hosting `/create:sk-skill-parent` flow.

## 5. Open for operator
- **D4 flowchart — RESOLVED to B** (`create-flowchart` packet, 9 total).
- Remaining: operator **review sign-off** on `001/research.md` + this ADR before the build phases (003+) mutate `sk-doc`.

## 6. Next
On approval: phase 003 scaffolds the hub shell via `/create:sk-skill-parent` (templates read at their current path, pre-facade); phase 004 builds `shared/` + the facades; 005–012 build the packets; 013 repoints commands; 014 advisor; 015 verifies external couplings; 016 benchmark; 017 cutover + rollup.
