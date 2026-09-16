---
title: "Research Record: Per-Runtime Reference Map for the Skilled Source-Root Move [deepseek-pi lineage]"
description: "The working map someone executing the .opencode -> .skilled move would use: Map A (435 symlinks with both required-target answers), Map B (231 runtime files plus home-level configuration), Map C (4,028 tracked files by area with file:line code citations), each reconciled against the seed inventory, then the UNKNOWNs."
trigger_phrases:
  - "per runtime symlink map"
  - "stale opencode path references"
  - "skilled reference map"
  - "runtime file path inventory"
importance_tier: "important"
contextType: "research"
---

# Per-Runtime Reference Map for the Skilled Source-Root Move — deepseek-pi lineage synthesis

**Scope.** The proposal moves the real files of this repository's shared AI asset library from `.opencode/` to `.skilled/`, and turns every runtime directory, `.opencode/` included, into a consumer linking into `.skilled/`. This synthesis is the working map of what has to change. It does not choose a layout and does not propose a cutover order; where a row's answer depends on whether a `.opencode` compatibility link survives, both answers are given.

**Evidence base.** The deterministic seed inventory (`scratch/seed-inventory/`: 435 links, 4,258 tracked files naming `.opencode` outside `specs/`, home-level counts) is treated as facts without meaning; phase 001's verified findings are treated as verified but incomplete. Every claim below was either read from the live tree or recomputed from the seed; the row-level tables, with long `file:line` citations and truncated constructs, live in `iterations/iteration-001.md` through `iteration-010.md`. Two source disagreements surfaced and were recorded rather than resolved silently (runtime `SYNC.md` manifests against the tree; the seed against the live tree by one file).

**How to read the classifications.** `mechanical` — a scripted retarget or path rewrite handles it; `regenerate` — produced by a named command, so rebuild it rather than edit it; `manual` — someone has to decide something; `freeze` — a historical record that must not be rewritten; `none` — names the path but needs no change, with the reason; `blocker` — cannot be done as proposed, with the reason.

---

