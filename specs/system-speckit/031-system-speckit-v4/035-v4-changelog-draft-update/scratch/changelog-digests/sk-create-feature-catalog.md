# sk-create-feature-catalog changelog digest

Skill path: `.opencode/skills/sk-doc/sk-create-feature-catalog/` · Versions covered: v1.0.0.0 through v1.0.1.2 (all four entries in the changelog, fewer than ten exist) · Date range: none, no entry carries a date field in its frontmatter or body.

---

## Per-version digest, newest first

### v1.0.1.2 - README rewrite on the refined template

`v1.0.1.2.md` records a README-only rewrite onto the refined skill README template. The README now opens with a one-line pitch and a problem-first overview, adds a capability table covering the root catalog, the per-feature files and the category folders, documents the authoring order and the root-versus-leaf boundary, and closes with troubleshooting, FAQ, verification and related documents. The voice was cleaned to the Human Voice Rules, with three Oxford-comma constructions and two forced three-item enumerations rewritten so the body carries no em dashes, no semicolons and no Oxford commas. The entry is explicit that nothing else moved: the `/create:feature-catalog` invocation, the `feature-catalog/feature-catalog.md` root path, the per-feature file shape with source and validation anchors, the kebab-case category folder rule, the playbook boundary and the validation workflow all survive unchanged, and no SKILL.md content, template asset, reference file, vault file or runtime data was relocated. The README frontmatter version jumped from 1.0.0.0 straight to 1.0.1.2 to realign the README with the top of the changelog, which is a version-stamp correction rather than a content change.

The same entry lists the six README relative links as resolving to unchanged targets, and two of them are `assets/feature-catalog-template.md` and `assets/feature-catalog-snippet-template.md`. MOVED PATH: those two asset paths differ from the `assets/feature-catalog/feature-catalog-template.md` and `assets/feature-catalog/feature-catalog-snippet-template.md` paths that `v1.0.0.0.md` shipped, so the assets lost their intermediate `feature-catalog/` directory somewhere between the two entries without any changelog entry claiming the move.

### v1.0.1.1 - Router resilience

`v1.0.1.1.md` is a single-sentence entry. It documents catalog-decision routing resilience and records the packet's deliberate choice to keep flat resources rather than adopt keyed runtime discovery. No workflow, path or contract change is claimed.

### v1.0.1.0 - Smart-routing section conformance

`v1.0.1.0.md` is a structural normalization of `SKILL.md` so the file satisfies the canonical section contract enforced by the shared `package_skill.py --check`. RENAME: the merged `WHEN TO USE + SMART_ROUTING` heading was split into two conformant sections, `## 1. WHEN TO USE` carrying activation triggers and the when-not-to-use boundary, and `## 2. SMART ROUTING` carrying the creation decision rule, the decision pseudocode and the family boundary, because the older underscore-joined heading did not match the required `SMART ROUTING` section token. The entry also adds a dedicated `## 11. REFERENCES` section so the references surface is a first-class heading instead of an inline resource list, adds a `## 10. SUCCESS CRITERIA` section carrying the completion bar for a catalog package, adds the top-of-file `<!-- Keywords: ... -->` discovery comment, and renumbers every H2 contiguously with the one intra-file cross-reference updated to follow. The entry states plainly that the headings blocked packaging validation and that no workflow, rule or authoring guidance changed.

### v1.0.0.0 - Initial Release

`v1.0.0.0.md` is the initial release of `create-feature-catalog`, described there as one of the ten workflow packets in the `sk-doc` parent hub's workflow-only architecture. The packet authors feature-inventory packages: a root catalog at `feature-catalog/feature-catalog.md` organized into numbered category folders, with one source-anchored per-feature file per root entry, so a system's shipped behavior has a single reviewable current-state reference. It shipped four things. `SKILL.md` carries the inline workflow contract covering when to create a catalog versus keep a README summary, the canonical package shape, the 14-step creation workflow, the root-catalog and per-feature-file content requirements, the catalog-versus-playbook boundary and the ALWAYS, NEVER and ESCALATE rules. `references/feature_catalog_creation.md` is the deep-dive creation reference for overflow guidance. `assets/feature-catalog/feature-catalog-template.md` scaffolds the root catalog and `assets/feature-catalog/feature-catalog-snippet-template.md` scaffolds each per-feature file. The entry notes the packet ships no packet-local `scripts/` and no `graph-metadata.json`, consuming validation and advisor identity from the shared `sk-doc` backbone instead.

Two naming inconsistencies live inside this one entry. The prose names the root catalog `feature-catalog/feature-catalog.md` while the `SKILL.md` bullet in the same file names the canonical package shape `feature_catalog.md`, and the reference file is named `references/feature_catalog_creation.md` in underscore form. Both underscore forms predate the repo-wide kebab-case settlement.

---

## Facts the v4 draft gets wrong or misses

- MISSING: the draft never names this packet or its command. The Documentation as a System section names `sk-create-skill`, `sk-create-readme`, `sk-create-agent`, `sk-create-diff`, `sk-create-changelog`, `sk-create-repo-rule` and `sk-create-quality-control` (draft line 132) and gives `sk-create-repo-rule` and `sk-create-diff` their own subsection (draft lines 142 and 143), but `sk-create-feature-catalog` and `/create:feature-catalog` appear nowhere in the draft. `v1.0.0.0.md` establishes the packet as a first-class `sk-doc` workflow packet and `v1.0.1.2.md` confirms `/create:feature-catalog` as its live invocation.
- COUNT MISMATCH: draft line 132 says `sk-doc` routes to fourteen nested `sk-create-*` workflow packets. `v1.0.0.0.md` describes the hub as holding ten workflow packets at this packet's initial release. The entries do not carry a later count, so the ten is a point-in-time figure rather than a refutation, but the draft's fourteen is not supported by anything in this packet's changelog and the packet directory holds thirteen `sk-create-*` siblings today.
- SUPPORTED, NOT CONTRADICTED: draft line 147 to 149 claims the repo settled on kebab-case and retired the underscore convention. The entries corroborate the direction. `v1.0.0.0.md` ships `references/feature_catalog_creation.md` and a `feature_catalog.md` package-shape reference in underscore form, while `v1.0.1.2.md` records the current root path as `feature-catalog/feature-catalog.md` and the current reference surface as `references/README.md`, `references/examples.md` and `references/common-pitfalls.md`. The draft does not need a correction here, only a note that this packet is one of the surfaces the migration touched.
- MISSING: the draft has no entry for the asset path change. `v1.0.0.0.md` ships the two templates under `assets/feature-catalog/` and `v1.0.1.2.md` links them at `assets/`. Anyone with a pinned path to `assets/feature-catalog/feature-catalog-template.md` is broken and the draft warns about underscore renames only.
- MISSING: the draft has no entry for the SKILL.md section-contract normalization. `v1.0.1.0.md` shows `package_skill.py --check` enforcing a canonical section contract that renamed a heading and added three required surfaces. The draft treats packaging and routing validation elsewhere but never states that skill section headings became machine-checked, which is the rule that would break a third-party packet.
- NO CONTRADICTION FOUND on the packet's contract claims. Nothing in the four entries conflicts with the draft's statement at line 136 that the `/create:*` command family itself is untouched, and `v1.0.1.2.md` explicitly preserves `/create:feature-catalog`.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.0.1.2`, matching the newest changelog entry `v1.0.1.2.md`.
- Identity: a MODE, not a hub and not standalone. The packet root `.opencode/skills/sk-doc/sk-create-feature-catalog/` holds no `mode-registry.json`, no `hub-router.json`, no `description.json` and no `graph-metadata.json`, which `v1.0.0.0.md` confirms was deliberate. The parent `.opencode/skills/sk-doc/` holds `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json`, and its registry carries this packet at `workflowMode` `sk-create-feature-catalog` bound to command `/create:feature-catalog`.
