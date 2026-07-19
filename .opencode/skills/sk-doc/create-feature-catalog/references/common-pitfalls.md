---
title: Feature Catalog Common Pitfalls
description: Deep-dive on recurring feature-catalog defects with worked before/after fixes, plus the template-versus-reference split for the catalog package.
trigger_phrases:
  - "feature catalog pitfalls"
  - "feature catalog common mistakes"
  - "feature catalog roadmap drift"
  - "feature catalog source anchors"
  - "template versus reference split"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Feature Catalog Common Pitfalls

The deep-dive companion to the Common Mistakes table in `SKILL.md`. The table names each defect in one line; this reference expands the load-bearing ones with a worked fix so the failure mode is recognizable during authoring and review.

---

## 1. OVERVIEW

A feature catalog fails quietly. Structure validation passes, links resolve, and the package still misleads readers — because the failures are about *content trust*, not markup. The pitfalls below are the ones that erode that trust. Each entry states the symptom, why it breaks reader trust, and the concrete fix.

---

## 2. RECURRING PITFALLS

### Treating the catalog like a roadmap

**Symptom**: Entries describe planned or in-flight behavior — "will support", "is being added", "coming in the next release".

**Why it breaks**: A catalog's one job is to answer "what does the system do today?" The moment a reader finds one aspirational claim, every claim becomes suspect.

**Fix**: Rewrite to current behavior anchored to a source file, or drop it. `Will support batch deletion` becomes `Supports batch deletion by tier (see mcp-server/handlers/memory-bulk-delete.ts)`. If a rollout or compatibility layer genuinely ships behind a flag, label it explicitly as a feature-flag surface rather than as future work.

### Renaming published slugs

**Symptom**: A category folder or per-feature filename is renamed after other docs already link to it.

**Why it breaks**: Playbooks, READMEs, and specs link to catalog paths. A rename silently breaks every inbound link, and CI catches it only if those links live in checked markdown.

**Fix**: Treat slugs as an API. Stabilize category names, feature names, and slugs *before* polishing prose, and keep them fixed after publication. If a rename is genuinely required, do it as a deliberate migration that updates every referrer in the same change.

### Missing source anchors

**Symptom**: A per-feature file describes behavior with no `## 3. SOURCE FILES` implementation or validation rows, or with vague ones.

**Why it breaks**: The per-feature file exists precisely so claims are auditable. Without file-level anchors it is just prose that no reviewer can verify against the code.

**Fix**: Every feature claim gets an implementation row (`File | Layer | Role`) and, where behavior is tested, a validation row (`File | Type | Role`), pointing at real, stable paths. If nothing is implemented yet, say so in `HOW IT WORKS` and leave a single stub row rather than fabricating anchors.

### Execution-heavy scenario detail in the catalog

**Symptom**: A catalog entry grows step-by-step "do X, observe Y" validation scenarios.

**Why it breaks**: That is a manual testing playbook's job. Mixing it in blurs the boundary and bloats the inventory the catalog is supposed to keep scannable.

**Fix**: Keep execution matrices in the playbook. In the catalog, describe *what* the behavior is and link to the playbook for *how to validate it*. See the catalog/playbook boundary in `SKILL.md`.

### Playbook cross-references drifting from catalog names

**Symptom**: A feature is renamed or re-scoped in the catalog, but the playbook that links to it still uses the old name.

**Why it breaks**: Inventory and validation silently disagree, and a reader following either one lands on stale information.

**Fix**: When a feature name changes, update the catalog entry and every playbook link in the same change. The two documents are a pair; edit them together.

### Wall of prose in HOW IT WORKS

**Symptom**: A `## 2. HOW IT WORKS` section runs five or more paragraphs with no sub-headings.

**Why it breaks**: Long unbroken prose has no navigation anchors, so readers cannot scan to the aspect they need, and the section becomes write-only.

**Fix**: Once the section exceeds three paragraphs, break it into H3 sub-headings — `### Core Behavior`, `### Configuration`, `### Edge Cases`, `### Async & Safety`. Short sections stay plain prose; the rule triggers only on length. The live `unified-context-retrieval-memorycontext.md` file shows this applied well.

### Missing trigger_phrases in frontmatter

**Symptom**: A per-feature file ships without a `trigger_phrases` list.

**Why it breaks**: The skill advisor harvests doc triggers from that frontmatter (memory deliberately does not index skill docs), so a file with no triggers is invisible to routing.

**Fix**: Add at least three phrases, leading with the exact H3 heading used in the root catalog, then natural-language alternates and the tool or command name:

```yaml
trigger_phrases:
  - "memory indexing"          # matches the root-catalog H3
  - "index a saved memory"     # natural-language alternate
  - "memory_save"              # tool name
```

---

## 3. TEMPLATE VS REFERENCE SPLIT

The packet ships two kinds of authoring aids, and using the wrong one for the wrong question wastes effort:

- Use the **templates** in `../assets/feature-catalog/` to scaffold the actual files — the empty root-catalog and per-feature shapes, their frontmatter blocks, and their publishing checklists.
- Use the **references** here (and the primary contract in `SKILL.md`) to decide *what belongs where*: which claims live in the root versus the per-feature file, how to keep slugs stable, and how to keep the package aligned with current standards.

In short: templates answer "what does the file look like?"; `SKILL.md` and these references answer "what should it say and why?". Scaffold from the template, then judge the content against the contract.

---

## 4. RELATED RESOURCES

- [../SKILL.md](../SKILL.md) - the Common Mistakes table this reference expands, and the full rules
- [examples.md](examples.md) - a live catalog that avoids these pitfalls
- [../assets/feature-catalog/feature-catalog-snippet-template.md](../assets/feature-catalog/feature-catalog-snippet-template.md) - per-feature scaffold with its own authoring notes
- [create-manual-testing-playbook references](../../create-manual-testing-playbook/references/README.md) - the playbook side of the catalog/playbook boundary
