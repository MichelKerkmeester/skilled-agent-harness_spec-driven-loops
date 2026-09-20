---
title: "Deep Research Synthesis: sk-doc parent-hub conversion (phase 001)"
description: "Consolidated findings from a 30-iteration GPT-5.5-fast xhigh deep research (15 breadth angles + 8 adversarial verdicts + spec-artifact passes) settling the packet set, registry/router/facade/shared specs, and migration invariants for converting sk-doc into a workflow-only parent hub."
contextType: "research"
importance_tier: "high"
parent: "skilled-agent-orchestration/125-sk-doc-parent/001-research-and-canon"
---

# Deep Research Synthesis — sk-doc Parent-Hub Conversion

## 0. Method & confidence

- **Executor:** GPT-5.5-fast (`openai/gpt-5.5-fast`), reasoning effort `xhigh`, `--pure`, dispatched as bounded self-contained research units (Claude-orchestrated, after the sanctioned deep-loop `cli-opencode` executor proved unable to self-host the stateful loop — documented deviation, operator-approved).
- **Volume:** 30 productive dispatches — **15 breadth angles** (94 evidence-grounded rulings) + **8 adversarial verdicts** (refutation of the breadth conclusions) + spec-artifact passes. Every ruling cites `file:line`.
- **Raw findings:** `research/gpt5-iterations/iter-*.json` (breadth), `research/gpt5-depth/depth-*.json` (adversarial). This doc is the synthesis; the JSON is the audit trail.
- **Read-only:** no `sk-doc` file was mutated during research.

The headline result **revised the pre-research plan**: the initial foundation reconciliation proposed folding `create-command` and marked benchmark/changelog provisional. The evidence-grounded research **kept `create-command`, `create-benchmark`, and `create-agent` standalone, folded `create-changelog`, and confirmed a new `doc-quality` packet** — landing at **8 workflow packets**.

---

## 1. FINAL packet set (8 workflow packets)

| # | Packet | Verdict | Owns | Bound command |
|---|--------|---------|------|---------------|
| 1 | **create-skill** | keep (heaviest) | skill templates + `parent_skill_*` templates + `references/skill_creation/`; packet-unique scripts `init_skill.py`, `package_skill.py`. `create-skill-parent` is a **2nd `workflowMode` over the same packet** (no 2nd advisor node). | `/create:sk-skill`, `/create:sk-skill-parent` |
| 2 | **create-readme** | keep | `readme_creation.md` + `install_guide_creation.md` (install-guide **folded** as a 5-phase variant); packet-unique `audit_readmes.py`. | `/create:folder_readme` (+ `install`) |
| 3 | **create-agent** | keep | `agent_creation.md` + `agent_template.md`; distinct OpenCode-component output contract (permission/authority frontmatter). | `/create:agent` |
| 4 | **create-command** | keep (lean) — CONFIRMED under adversarial refutation | `command/` templates + presentation/router split; command-specific `argument-hint`/`allowed-tools` lifecycle. Validator depth is shallow (`extract_structure.py` only checks frontmatter) → keep compact. | *(no `/create:command` today — routing note)* |
| 5 | **create-feature-catalog** | keep | `feature_catalog_creation.md` + template pair; distinct multi-file inventory contract (what-the-system-does-today, no execution matrix). | `/create:feature-catalog` |
| 6 | **create-manual-testing-playbook** | keep | `manual_testing_playbook_creation.md` + template pair; distinct release-review / evidence-collection contract. | `/create:testing-playbook` |
| 7 | **create-benchmark** | keep — **narrowed** | The MCP benchmark-folder **promotion lifecycle** only (`benchmark_report.md` ten-section narrative + `SOURCE.md` wayfinding). NOT the Lane-C skill-benchmark harness. | *(no `/create:benchmark` — routing risk, see §5)* |
| 8 | **doc-quality** | keep — **NEW** (advisor-routable, not backbone) | Validate/score/optimize an EXISTING doc (extract → DQI → HVR → validate); owns `optimization.md` + `workflows.md` as procedure. The `sk-design`-audit analog. | **NEW `/doc:quality`** (report-only default) |

### Folded (not packets)
- **create-changelog → FOLDED** (adversarial **REFUTED** the keep). `changelog_template.md` is a shared *format/style asset*, not a workflow owner; the real workflow lives in `create_changelog_auto.yaml`. **Action:** move `changelog_template.md` → `shared/assets/`, point `/create:changelog` at it. Reconcile the template/YAML header-format drift during the move (`changelog_template.md:38-40, 168-170`). `/create:changelog` stays a public command.
- **install-guide → `create-readme` variant.**
- **flowchart → OPEN** (see §4).

---

## 2. Concrete specs (for phase 002 to lock)

### 2.1 `mode-registry.json` (modes[])
- **Every entry `packetKind: "workflow"`** — no surface/evidence-base entries (`parent_skill_registry_template.json:123`).
- **Two `backendKind` values only:** `template-scaffold` (the create-* generators) and `doc-quality` (the doc-quality workflow) (`parent_skill_registry_template.json:9`).
- **`routingClass: "metadata"` default** for the create-* + doc-quality modes, with a per-mode **`command` field** recorded even on metadata-routed modes (`parent_skill_registry_template.json:36, 75`). Use **`command-bridge` only** for a mode reachable solely via its command and never advisor-scored — do NOT use it broadly.
- **No `lexical`/`alias-fold`** (would drag in the `advisor-projection` extension + a CI drift-guard for no benefit).
- `create-skill-parent` = a second `workflowMode` inside the `create-skill` packet (`sk-code` precedent: multiple modes per packet).

### 2.2 `hub-router.json`
- **Bidirectional:** `set(routerSignals.keys) == set(modes[].workflowMode)` exactly (`parent_skill_hub_router_template.json:2`).
- `vocabularyClasses` disambiguating each create-* verb + doc-quality; `tieBreak` covers every mode; `outcomes` = `single | orderedBundle | defer` — **NO `surfaceBundle`** (no surface axis).

### 2.3 `shared/` backbone (canonical-in-shared, symlinked inward)
- **`shared/scripts/`** (generic validators, root facades preserved): `extract_structure.py`, `validate_document.py`, `quick_validate.py`, `frontmatter-version.mjs`, `check-frontmatter-versions.sh`, `validate-doc-model-refs.js`. (`validate_flowchart.sh` too, if flowchart is retired.) The `validate_document.py` per-type checks stay as **adapters inside the shared validator**, not per-packet scripts.
- **Packet-unique scripts (NOT shared):** `init_skill.py` + `package_skill.py` → `create-skill`; `audit_readmes.py` → `create-readme`.
- **`shared/references/global/`** (cross-cutting vocabulary/standards): `hvr_rules.md`, `evergreen_packet_id_rule.md`, `core_standards.md`, `validation.md`, `quick_reference.md` (front-door — **pointers only**, move its DQI/transform sections out), `frontmatter_versioning.md` (folded — not its own packet).
- **doc-quality-owned procedure (NOT shared):** `optimization.md`, `workflows.md` → under the `doc-quality` packet.
- **`shared/assets/`:** `frontmatter_templates.md`, `llmstxt_templates.md`, `template_rules.json`, `changelog_template.md` (folded in), `flowcharts/*` (if retired).

### 2.4 Facade / symlink topology
- **Canonical implementations live under `sk-doc/shared/`; root paths are symlinks pointing INWARD** to shared — never the reverse, never cyclic (`sk-code/SKILL.md:37, 93`).
- `references/` and `assets/` stay **real root directories** containing only the needed symlink leaves/subtrees (preserves external path resolution).
- Consumer→shared links only, e.g. `scripts → shared/scripts`, `references/skill_creation → ../shared/references/skill_creation`.

### 2.5 Companion files
- **Hub root:** `SKILL.md`, `mode-registry.json`, `hub-router.json`, `description.json` (NEW), `graph-metadata.json` (rewritten), `changelog/`, `manual_testing_playbook/`, `benchmark/`.
- **Each packet:** `SKILL.md`, `README.md`, `changelog/` — real files. **No packet `description.json`/`graph-metadata.json`.**
- **Changelogs are real files at both tiers, never symlinked or cross-pointed** (`parent_skills_nested_packets.md:180-185`).

---

## 3. Invariants — adversarially verified

| Invariant | Verdict | Note |
|-----------|---------|------|
| **Exactly ONE `graph-metadata.json`** (hub only) | **CONFIRMED** | The advisor scanner recursively discovers every `graph-metadata.json` and throws on `skill_id != folder`; a child one = rogue identity. `sk-code` proves nested files ride in the hub's `source_docs`/`key_files` (`skill-graph-db.ts:610-635`, `sk-code/graph-metadata.json:182-220`). |
| **Single flat public identity `sk-doc`** | **CONFIRMED** | Keep public trigger phrases at the hub graph/router layer, project into workflow aliases + `routerSignals`; nested packets are internal modes only. |
| **ZERO active named extensions (base)** | **CONFIRMED w/ one conditional** | Correct base case. **`deprecated-modes` is conditionally needed IF flowchart is retired** rather than promoted (§4). No surface-axis / runtime-loop / transform-verbs / advisor-projection. |
| **`create-skill-parent` = 2nd mode, not 2nd node** | **CONFIRMED** | No surface axis or advisor projection required. |

---

## 4. Open decision — flowchart disposition (the one genuine fork)

ASCII flowchart creation is either:
- **(A) Retire** it as a public route → fold `assets/flowcharts/*` + `validate_flowchart.sh` into `shared/`, and add a **`deprecated-modes`** shim so the existing `FLOWCHART`/`ascii-diagram` public routing does not dangle; **or**
- **(B) Promote** it to a thin **`create-flowchart`** workflow packet (9th packet).

The 124/022 near-empty-shell bar favors **(A)** (flowchart is a fat asset library behind a ~3-line workflow), but (A) then requires the `deprecated-modes` extension (otherwise `zero extensions` holds but a public route dangles). **Phase 002 / operator picks A or B.**

---

## 5. Risks & required follow-ups

1. **⚠️ FACADE-COVERAGE GAP (adversarial REFUTED the zero-edit claim).** The naive 3-path facade set (`scripts/`, `references/skill_creation/`, `assets/frontmatter_templates.md`) is **insufficient**. External referrers also name: the **root `skill_creation.md`** file (not just the subtree), and **many asset templates beyond `frontmatter_templates.md`** — `agent_template`, skill templates, `feature_catalog`, `testing_playbook`, `readme` templates (`agents/markdown.md:189-192`, `create/README.txt:197`, `install_guides/README.md:1244`, `scripts/git-hooks/pre-commit:22`, `sk-git/SKILL.md:463`). **REQUIRED before cutover:** produce the COMPLETE external-ref → facade map (full grep, every individual referenced path), then either expand the facade set to cover all of them OR accept a bounded, enumerated set of external edits.
2. **Self-hosting order (REVISED — facade-first).** Safe order: (1) create nested packet + `shared/` destinations; (2) add root facade symlinks for **every** old `sk-doc` path consumed by the `/create:*` YAMLs (auto **and** confirm); (3) keep both auto+confirm working; (4) only then any optional explicit repoint (isolated later commit). Moving `parent_skill_*` templates before facades exist = `missing_hub_template` hard stop for `/create:sk-skill-parent`. Never edit workflow YAML mid-run.
3. **Command rebinding: facade-preserve all 7 `/create:*` YAMLs in the split commit;** explicit-repoint only as later isolated cleanup after facades pass.
4. **create-benchmark naming/routing:** no `/create:benchmark` command exists → the hub router must word it clearly so users don't expect a slash-command; decide `create-benchmark` vs `benchmark-creation` mode name.
5. **create-command:** minor open — standalone packet (adversarial CONFIRMED) vs a 2nd `workflowMode` of `create-skill` (backward-compat suggested). Evidence leans standalone-lean; 002 confirms.
6. **changelog fold:** reconcile the template↔YAML header-format drift; keep confirm-mode parity (`create_changelog_confirm.yaml` also reads the template).
7. **Advisor explicit-lane coverage:** current boosts cover `docs`/`documentation`/`playbook` etc.; the conversion must add high-specificity `sk-doc` lane coverage for all create-* verbs so single-identity routing doesn't misroute authoring prompts.

---

## 6. Phase-002 architecture-decision dossier

Decisions 002 must lock, with the research ruling + confidence:

| # | Decision | Ruling | Confidence |
|---|----------|--------|-----------|
| D1 | Packet set | **8 packets** (§1); changelog folded, install-guide folded | HIGH |
| D2 | `create-command` shape | standalone lean packet (vs create-skill 2nd-mode) | MED |
| D3 | `doc-quality` + `/doc:quality` command | routable workflow packet + report-only command | HIGH |
| D4 | Flowchart | **A (retire+deprecated-modes) vs B (create-flowchart)** — OPEN | operator |
| D5 | Registry schema | 2 backendKinds, all workflow, metadata default + command field, no surfaceBundle | HIGH |
| D6 | Router schema | bidirectional routerSignals==modes, tieBreak, no surfaceBundle | HIGH |
| D7 | shared/ vs doc-quality-owned split | §2.3 (optimization+workflows → doc-quality; hvr/quick_ref/frontmatter-ver → shared) | HIGH |
| D8 | Extensions | zero base + conditional `deprecated-modes` (flowchart-dependent) | HIGH |
| D9 | Advisor | one identity; add create-* explicit-lane coverage | HIGH |
| D10 | **Complete facade map** | **REQUIRED artifact** — full external-ref enumeration before cutover (§5.1) | HIGH (must-do) |
| D11 | Cutover order | facade-first, then command-repoint, then advisor-rebuild (§5.2) | HIGH |

**Next step:** human review of this synthesis → approve the phase-002 architecture decision (lock D1–D3, D5–D9, D11; decide D4 flowchart; commission D10 the complete facade map).
