---
title: "create-feature-catalog"
description: "Author canonical feature-inventory packages, a root catalog plus one source-anchored file per feature, for anyone who needs a trustworthy answer to what a system does today."
trigger_phrases:
  - "feature catalog"
  - "feature inventory"
version: 1.0.0.0
---

# create-feature-catalog

> Turn a shipped feature surface into one navigable root catalog and stable, source-anchored per-feature files.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | A canonical, current-state inventory of what a skill, system, MCP surface or CLI surface does today |
| **Invoke with** | `/create:feature-catalog`, or "feature catalog" / "feature inventory" |
| **Works on** | A feature surface too large or too cross-referenced for a trustworthy README-only summary |
| **Produces** | `feature-catalog/feature-catalog.md` plus one per-feature file per root entry, each with source and validation anchors |

---

## 2. OVERVIEW

### Why This Skill Exists

A README can describe five features honestly. Once a system has thirty, a flat bullet list stops being trustworthy: entries go stale, nobody can tell which claim still matches the code and different docs disagree about what a feature is even called. create-feature-catalog exists so a large feature surface gets one canonical, navigable inventory instead of scattered, drifting summaries: a root catalog for orientation and a stable per-feature file behind each entry that ties the claim back to a real source file and a real test.

### What It Does

create-feature-catalog authors a `feature-catalog/` package: a root `feature-catalog.md` that lists capabilities by category in numbered sections, and one per-feature file per root entry carrying the implementation truth (source tables, validation anchors, current-state description). The root catalog stays inventory-first and never grows into a scenario matrix, that boundary belongs to `create-manual-testing-playbook`, which documents how to validate the behavior this catalog says exists.

---

## 3. QUICK START

**Step 1: invoke it.**

```text
/create:feature-catalog for the MCP memory tools
```

**Step 2: build the package in order.** Root catalog first, then one category folder per root section, then one per-feature file per entry.

```bash
# from the repo root, so the validator resolves the readme doc type
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-skill>/feature-catalog/feature-catalog.md
```

A clean run reports the root catalog structure passed: frontmatter, numbered `OVERVIEW`, category sections all present.

**Step 3: validate every per-feature leaf the same way.**

```bash
python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-skill>/feature-catalog/<category-name>/feature-name.md
```

Passes when the file carries its required sections and a Validation And Tests table.

---

## 4. HOW IT WORKS

Authoring runs in a fixed order because names have to stabilize before prose does. Read the target system's docs, source and tests first. Decide the category taxonomy and lock feature names and slugs before writing descriptions, renaming a published slug later breaks every link that points at it. Build the root catalog from `assets/feature-catalog-template.md`, create one kebab-case category folder per root section, then create one per-feature file per entry from `assets/feature-catalog-snippet-template.md`, each with an implementation source table and a validation/test anchor table. Run shared validation on the root and every leaf, then manually check that every root entry has exactly one matching per-feature file and every link resolves.

### Key Concept: Root Catalog vs. Per-Feature File

The root catalog and the per-feature files answer different questions on purpose. The root catalog answers "what exists and where do I find it": short summaries, no exhaustive source tables, no roadmap material. The per-feature file answers "how do I know this is true": the `File | Layer | Role` and `File | Type | Role` tables that let a reviewer trace a claim back to real code and a real test. A catalog entry that only exists in the root, with no per-feature file behind it, is an unfinished catalog, not a lightweight one.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for create-feature-catalog when a feature surface is too large for a README to stay accurate, when multiple docs need one stable source of truth for feature names or when a manual testing playbook or spec needs a canonical list to cross-reference. Skip it when the system only has a handful of features (a README already covers that) or when the product is too volatile for a maintained catalog to stay trustworthy.

### Related Skills

| Skill | Relationship |
|---|---|
| `create-readme` | Owns short capability summaries inside a README. Hand off here once that list outgrows a README. |
| `create-manual-testing-playbook` | Owns execution scenario matrices. The catalog says what exists, the playbook says how to validate it. |
| `create-quality-control` | Audits a single document. Use it to score a catalog you already have, not to build a new one. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Root entry with no per-feature file | Category taxonomy was written before feature files were created | Create the missing per-feature file from the snippet template before delivery |
| Validator flags a missing Validation And Tests table | The leaf file skipped the required per-feature structure | Add the table with real file, type and role columns |
| Category folder has a numeric prefix | Old convention carried over from a different doc family | Rename to a bare descriptive kebab-case slug. The root catalog index owns display order |
| Catalog reads like a roadmap | Planned or speculative behavior was described as current | Remove it, or label it explicitly as a rollout/compatibility layer |
| Validator run from the wrong directory doesn't detect the leaf doc type | `validate_document.py` needs the repo-root-relative `feature-catalog/<category>/` path to classify a leaf correctly | Run the validator from the repo root with the full relative path |

---

## 7. FAQ

**Q: Why this instead of just expanding the README?**

A: A README that tries to hold thirty feature claims with source anchors stops being readable. The catalog separates orientation (root) from proof (per-feature files) so both stay useful.

**Q: What if the catalog needs to describe a planned feature too?**

A: Label it explicitly as planned or a compatibility layer. An unlabeled speculative entry breaks the "current shipped behavior" contract the whole catalog depends on.

**Q: Does the validator check that my links actually resolve?**

A: No. `validate_document.py` checks structure and the leaf's Validation And Tests table. Cross-file link resolution is a CI job (`check-markdown-links.cjs`) plus manual review.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Root catalog structure | `python3 .opencode/skills/sk-doc/shared/scripts/validate_document.py <target-skill>/feature-catalog/feature-catalog.md` passes |
| Per-feature leaf structure | Same command against `<target-skill>/feature-catalog/<category-name>/feature-name.md`, checks the Validation And Tests table |
| New-content naming guard | `python3 .opencode/skills/sk-doc/shared/scripts/check_no_hyphenated_catalog_content.py <new-content-staging-root>` |
| Manual review | Root-entry to feature-file parity, cross-file links and source-anchor accuracy (not machine-checked) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative packet contract, routing and validation rules |
| [`references/README.md`](./references/README.md) | Reference route-map |
| [`references/examples.md`](./references/examples.md) | Annotated walkthrough of a shipped feature catalog |
| [`references/common-pitfalls.md`](./references/common-pitfalls.md) | Recurring catalog defects with worked fixes |
| [`assets/feature-catalog-template.md`](./assets/feature-catalog-template.md) | Root catalog scaffold |
| [`assets/feature-catalog-snippet-template.md`](./assets/feature-catalog-snippet-template.md) | Per-feature file scaffold |
