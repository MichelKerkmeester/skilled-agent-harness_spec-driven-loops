---
title: "Artifact Inventory: tracked footprint under specs/"
description: "Files and bytes for the tracked tree, for specs/, and for each loop-state folder kind under it, measured from the git index at one commit."
trigger_phrases:
  - "specs artifact inventory"
  - "tracked footprint by category"
  - "loop state checkout size"
importance_tier: "normal"
contextType: "general"
---
# Artifact Inventory: tracked footprint under specs/

Every CI job checks out the whole tree, so the loop-state folders under `specs/` cost something on every run whether or not a test runner collects them. This document records how large that footprint is at one commit, so the tracking policy can be argued from numbers instead of an impression.

- **Branch**: `worktrees/350-test-ci-wait-cuts`
- **HEAD**: `8b10b60540`
- **Measured**: 2026-11-12

## Measurement

| Category | Path pattern | Files | Bytes |
|---|---|---:|---:|
| all tracked files | every path in the index | 134068 | 2242717397 |
| specs/ | `specs/` | 113819 | 1998439515 |
| research | `:(glob)specs/**/research/**` | 24097 | 430836210 |
| review | `:(glob)specs/**/review/**` | 14604 | 417580430 |
| scratch | `:(glob)specs/**/scratch/**` | 33454 | 668349668 |
| z_archive | `:(glob)specs/**/z_archive/**` | 29531 | 592408599 |
| union | the four patterns, de-duplicated by path | 88151 | 1665212310 |

**Overlap**: the four patterns nest. A file under `specs/.../scratch/.../research/` is counted in both the `scratch` row and the `research` row, and a folder named `z_archive` can sit inside any of the other three. The per-category rows therefore sum to more than the tree they came from: 24097 + 14604 + 33454 + 29531 = 101686 files, against a union of 88151. Quote the union row for checkout size and the per-category rows for where the weight sits.

## How To Read The Rows

The file counts are what a checkout materializes. The byte counts are blob sizes read from the index, so they measure the objects a clone or fetch transfers and say nothing about the compressibility of a given pack.

The four category rows are the loop-state folders: research notes, review reports, scratch working files and archives. They overlap as described above. `research` also matches a folder named `research` at any depth under `specs/`, including one nested inside a `scratch` or `z_archive` folder.

This measurement was taken at `8b10b60540`, which is two commits ahead of the commit named in the packet's `spec.md`. The file counts are unchanged from that earlier figure. The byte totals are 146121 larger in both the repository row and the `specs/` row, and the four category rows and the union row are unchanged, so the growth sits under `specs/` outside the four loop-state folders. Rerun the command below at the commit under discussion rather than quoting these numbers for a different tree.

## Command

The table above came from this script, run from the repository root. It prints the table directly, so a reader can compare a fresh run against the rows without transcribing anything.

```text
{
printf '| Row | Files | Bytes |\n|---|---:|---:|\n'
printf '| all tracked files | %s | %s |\n' "$(git ls-files | wc -l | tr -d ' ')" "$(git ls-files -s | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
printf '| specs/ | %s | %s |\n' "$(git ls-files -- 'specs/' | wc -l | tr -d ' ')" "$(git ls-files -s -- 'specs/' | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
for d in research review scratch z_archive; do
  printf '| specs/**/%s/ | %s | %s |\n' "$d" "$(git ls-files -- ":(glob)specs/**/$d/**" | wc -l | tr -d ' ')" "$(git ls-files -s -- ":(glob)specs/**/$d/**" | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
done
printf '| union of the four categories | %s | %s |\n' "$( { for d in research review scratch z_archive; do git ls-files -- ":(glob)specs/**/$d/**"; done; } | sort -u | wc -l | tr -d ' ')" "$( { for d in research review scratch z_archive; do git ls-files -s -- ":(glob)specs/**/$d/**"; done; } | sort -u -t "$(printf '\t')" -k2,2 | awk '{print $2}' | git cat-file --batch-check='%(objectsize)' | awk '{s+=$1} END {print s}')"
}
```

The printed labels are `all tracked files`, `specs/`, `specs/**/research/`, `specs/**/review/`, `specs/**/scratch/`, `specs/**/z_archive/` and `union of the four categories`. The table at the top of this document renames the four category labels to the bare folder names and adds the path pattern column.
