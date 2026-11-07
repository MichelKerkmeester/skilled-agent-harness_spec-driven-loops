---
title: "Repo Guards Bundle Tests: Patches, Leaf Marker and Adapter Links"
description: "Node test suite for the repo-guards patches, the lineage-leaf marker, the prompt advisor row flag and the adapter links."
trigger_phrases:
  - "repo guards bundle tests"
  - "lineage leaf marker test"
  - "adapter link test"
version: 1.0.0.0
---

# Repo Guards Bundle Tests: Patches, Leaf Marker and Adapter Links

---

## 1. OVERVIEW

`tests/` holds the `node --test` suite for the `repo-guards` bundle itself. The suite runs from the repository root and reads the two patch files under `.dsh/patches/`, so a patch edit that moves the guard row or the lineage marker fails here. It also imports `../index.mjs`, `../lineage-leaf.mjs` and `../adapters/session-role.mjs` to check the bundle in process.

---

## 2. WHAT EACH FILE DOES

| File | Event or role | What it does | On error |
|---|---|---|---|
| `bundle.test.mjs` | `node --test` suite | Checks the guards and lineage patches, the disabled native goal rows, the lineage-leaf marker, the prompt advisor row flag and that every adapter uses the anchored loader. | A failed assertion exits non-zero. |

---

## 3. RELATED

- [`../README.md`](../README.md): the bundle, its adapter policy table and its validation commands.
- [`../../../patches/guards.patch.yml`](../../../patches/guards.patch.yml): the guards patch the suite reads.
- [`../../../patches/lineage.patch.yml`](../../../patches/lineage.patch.yml): the lineage patch the suite reads.
