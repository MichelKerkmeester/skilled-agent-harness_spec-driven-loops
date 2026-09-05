---
title: "Derived packet repair"
description: "Repairs the packet facts recomputable from repository state and refuses the ones that record work a person did, reporting those by rule instead."
trigger_phrases:
  - "derived packet repair"
  - "repair-derived"
  - "packet autofix boundary"
  - "derived versus authored failures"
version: 3.6.0.1
---

# Derived packet repair

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Packet validation failures divide into two kinds, and only one is a machine's
work.

Derived failures are facts the repository already knows and a document records
wrongly: where a packet sits after a rename, what level it declares, whether its
generated metadata still matches its sources. The correct value is recomputable,
so a tool can write it and be right every time.

Authored failures are records of something a person did — evidence for a
completed item, a verification result, a decision and its consequences. Nothing
in the repository can supply them, because the information never existed outside
the head of whoever did the work.

The tool repairs the first and refuses the second. The refusal is the
feature: filling in authored records would turn a red gate green by making
packets assert things nobody established.

## 2. HOW IT WORKS

For each packet it asks the validator what is wrong, intersects the reported
rules with an explicit allow-list of repairable ones, and acts only on that
intersection. A rule absent from the list is refused by construction rather than
by remembering to skip it.

Re-derivation of graph metadata happens inside the repair, not after it. Editing
a document invalidates the fingerprint taken over that document, so a repair
that stopped short would trade one error for another.

Reporting is the default and `--apply` writes, so the tool cannot rewrite the
fleet as a side effect of being run. Archived trees, scratch trees and
pre-rename snapshots are skipped: all three are frozen copies whose recorded
location is deliberately historical, and "repairing" a snapshot destroys what it
was kept to preserve.

In CI it runs without `--apply`. A gate that silently rewrote packets would
erase the drift it exists to surface.

## 3. SOURCE FILES

| File | Role |
|------|------|
| `runtime/cli/spec/repair-derived.cjs` | The tool |
| `runtime/cli/spec/README-repair-derived.md` | Usage and the derived-versus-authored boundary |
| `runtime/cli/tests/repair-derived.vitest.ts` | Fixture tests covering repair, refusal, containment and idempotence |
| `runtime/cli/spec/validate.sh` | Supplies the diagnosis and the detected level |
| `runtime/cli/graph/backfill-graph-metadata.ts` | The re-derivation entry point |
| `.github/workflows/strict-pass-freshness-sweep.yml` | Runs it in reporting mode |

## 4. SOURCE METADATA

Introduced after a remediation pass repaired 517 packets by hand and established
that the mechanical half of that work was recomputation rather than judgement.
The first fleet run found 306 further packets whose recorded facts disagreed
with the repository, most of them invisible to the weekly sweep because it only
inspects packets claiming completion.
