---
title: "Repository era report"
description: "Classifies a repository as a v3 or v4 spec layout and counts its packets, documents, frontmatter, template markers, generated metadata and level declarations, without changing any file."
trigger_phrases:
  - "Repository era report"
  - "repo-era.mjs"
  - "v3 v4 layout detection"
  - "spec layout era"
version: 1.0.0.0
---

# Repository era report (repo-era.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The era report answers one question before a migration: which spec layout does this checkout use, and how far along is its content. It reads the tree and writes nothing. Its output is a JSON report on stdout. Upgrade-legacy prints a short form of the same report at the end of every dry run.

Two things matter when reading it. The layout kind decides which migration applies, and the counts show how many packets already carry the current frontmatter, template markers and generated metadata.

---

## 2. HOW IT WORKS

### Layout Detection

The layout comes from two roots, the `specs` folder under the repository and the legacy spec root under the `.opencode` folder. When both exist and resolve to the same folder, the tree is a v4 layout and the legacy root is not counted. A legacy root that does not resolve to the same folder as `specs` is counted. With no `specs` folder the kind reads v3 when the legacy root exists and unknown when neither root exists, and with both real folders it reads both. When a `specs` root exists and description.json files record a legacy `.opencode` spec path in their `specFolder` field, the report sets the v3 flag as well and names `description-residue` as the source, so the kind reads both.

### Counting

Packets count only when they sit under a track folder, so the path has the form `specs/<track>/<packet>`. A packet placed directly under `specs` has no track folder and is not counted. Scratch folders, changelog trees and the research, review and context containment copies are excluded and counted in `excludedCount`.

For each counted packet the report tallies frontmatter as present or missing, template markers as new, legacy or none, generated metadata as present, stub or missing, and level declarations as match, mismatch or unknown. The totals object sums those tallies.

### Caveat for Symlinked Checkouts

A v3 checkout whose `specs` path is a symlink into the legacy `.opencode` spec root is an alias, so the report reads it as v4. The kind field alone therefore cannot prove a checkout is still v3. Check the `specs` path with a listing before trusting the kind.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs` | Script | Classifies the layout, walks the packets, tallies the signals and prints the JSON report |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/corpus.mjs` | Shared | Supplies the shared corpus walk and the git-ignored path list the classifier starts from |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/repo-era.vitest.ts` | Vitest | Covers packet counting, the v3 and v4 root distinction, the alias case and the level mismatch tally |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/repo-era-report.md`

Related references:
- [upgrade-legacy-reversibility-manifest.md](upgrade-legacy-reversibility-manifest.md) - The refusals that depend on the layout this report reads
- [upgrade-legacy-downgrades-report.md](upgrade-legacy-downgrades-report.md) - The dry run report that prints the short form of this block
