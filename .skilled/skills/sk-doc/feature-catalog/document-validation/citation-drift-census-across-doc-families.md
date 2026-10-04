---
title: "Citation Drift Census Across Doc Families"
description: "Extends the citation drift scan to the spec docs as well as the skill docs, with per-family counts, moved citations resolved through a git-derived redirect table and file-name-only matches kept out of the in-range count."
trigger_phrases:
  - "citation drift census across doc families"
  - "cite-drift-scan corpus specs"
  - "cite-drift-redirects.json"
  - "cite moved lines"
  - "moved citation redirect table"
version: 1.0.0.0
---

# Citation Drift Census Across Doc Families (cite-drift-scan.mjs --corpus)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Extends the citation drift scan to the spec docs as well as the skill docs, with per-family counts, moved citations resolved through a git-derived redirect table and file-name-only matches kept out of the in-range count.

The census is the same `cite-drift-scan.mjs` run described in [citation-drift-scan.md](citation-drift-scan.md), with a choice of corpus and two classes that separate a citation whose target moved from one that is truly gone. The default run makes zero model calls, reads no credential and writes no file.

---

## 2. HOW IT WORKS

### Corpus And Families

`--corpus skills|specs|all` picks the tracked docs the census reads, and `skills` is the default. `skills` groups by skill root. `specs` reads the tracked spec docs, skips any path that runs through a `z_archive` folder and groups by track. `all` reads both. Every run prints one count line per group, one `family <family>:` line per family it read and a totals line that ends `corpus=<corpus> commit=<sha12>`.

### Moved And Basename-Only Classes

A citation whose path no longer exists is tried again through the redirect table `cite-drift-redirects.json`. When a rule rewrites the path to a tracked file, the citation counts as `moved_in_range` if the cited line exists there and `moved_past_end` if the file is now shorter than the cited line. A citation that matches only a unique tracked file name, with no rule behind it, counts as `basename_only` and is never counted in range, because a shared file name is a guess rather than a proof.

### The Redirect Table

`cite-drift-redirects.json` holds directory-prefix rules derived from the repository's git rename records by `deriveRedirects` in the same script. A rule is kept only when at least 50 rename records stand behind it and at least 95% of them agree on the destination. The table records the command, the commit and both thresholds it was derived with. The longest matching prefix wins.

### The --moved Listing

`--moved` adds one `cite moved: <family> <doc>:<line> -> <target>:<line> now <new path> (<class>)` line per moved citation, so an author can repair the citation in place. Without `--moved` the output is unchanged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs` | Script | Picks the corpus, resolves each citation through the redirect table and prints the family counts and the `cite moved:` lines |
| `.skilled/skills/sk-doc/shared/scripts/cite-drift-redirects.json` | Shared | The directory-prefix redirect rules with the command, commit and thresholds they were derived with |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` | Node test | Forty-five tests on a fixture repository, including the redirect-rule move and the corpus filter |
| `.skilled/skills/sk-doc/manual-testing-playbook/document-validation/citation-drift-census-across-doc-families.md` | Manual playbook | Runs the skills census with and without `--moved` and confirms the working tree is unchanged |

---

## 4. SOURCE METADATA

- Group: Document Validation
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `document-validation/citation-drift-census-across-doc-families.md`

Related references:
- [citation-drift-scan.md](citation-drift-scan.md) - the dead-citation scan, label sample and backend arm this census extends
- [shared-frontmatter-value-warning.md](shared-frontmatter-value-warning.md) - the next document-validation entry
