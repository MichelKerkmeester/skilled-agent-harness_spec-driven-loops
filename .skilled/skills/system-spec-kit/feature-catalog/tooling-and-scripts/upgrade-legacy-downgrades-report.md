---
title: "Upgrade-legacy Downgrades and grouped detail"
description: "Prints the findings a repaired packet keeps as warnings, the failing rules grouped by packet and the lane-mode refusals each run records in the packet baseline."
trigger_phrases:
  - "Upgrade-legacy Downgrades and grouped detail"
  - "upgrade-legacy downgrades"
  - "upgrade-baseline.json"
  - "grouped detail upgrade-legacy"
version: 1.0.0.0
---

# Upgrade-legacy Downgrades and grouped detail (upgrade-legacy.mjs)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

A legacy packet that fails validation can often be repaired without losing its meaning, but some findings can only be recorded. Upgrade-legacy writes those findings into `upgrade-baseline.json` beside the packet, and the validator reads a recorded finding as a warning rather than an error. The report makes that trade visible before anyone approves an apply.

The report is printed in two places. The dry run predicts it, and the apply run prints what it actually recorded.

---

## 2. HOW IT WORKS

### Dry Run Report

A dry run validates every packet in scope and prints one `failing` line per packet with its failing rules. It then prints the grouped detail, one heading per packet and rule with the number of details behind it, followed by the Downgrades section. The Downgrades section lists one line for each finding a repaired packet would keep as a warning, in the form packet, rule, `error -> warning` and the detail.

The prediction comes from a preview. The repairs run on a copy of the failing packets, the copy is removed afterward and the live tree is not written. A packet that passes shows the entries already stored in its baseline. When a complete reversibility manifest exists, the dry run shows only the stored entries and skips the preview.

### Apply Report

After the repairs, the apply run prints one `recorded` line per packet with its remaining findings, in the form `recorded <packet> (<n> findings)`. A packet that also has lane-mode refusals gets `, <m> refusals` after the findings count on the same line. It then prints the Downgrades section from what was recorded, the count of recorded findings by rule and the grouped detail for every packet that still fails.

Lane-mode refusals are the defects that a repair mode named and could not derive, for example a packet whose spec.md declares no level, so no template can be proven for its headers. They are kept in the baseline next to the findings, so a later dry run shows them again.

### Layout Line

The dry run prints the repository era block near its end, and the line that names the steps `--apply` would run follows it. The apply run prints no era block and ends with the grouped detail. Read the dry run's block before approving an apply, because a checkout whose `specs` path is an alias of the legacy `.opencode` spec root reads as v4 there.

### Linked Packets and Baselines

A packet whose top-level link resolves outside the packet is refused before its repairs. The dry run prints `would refuse <packet>: <name> is a symbolic link, not followed, and does not resolve inside the packet`, apply prints `refused <packet>` with the same reason, and the packet is left out of the repairs. A linked `upgrade-baseline.json` is left out of the Downgrades section, which prints `refused <packet>: upgrade-baseline.json is a symbolic link, not followed, so its findings are not read`. The validator warns `UPGRADE_BASELINE_LINK` and keeps that packet's findings as errors.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` | Script | Prints the dry run report, predicts the Downgrades in a preview, records findings and refusals and prints the grouped detail |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` | Script | Produces the lane-mode refusals that the run records for each packet |
| `.skilled/skills/system-spec-kit/runtime/cli/spec/repo-era.mjs` | Script | Supplies the layout block the dry run prints near its end |

### Validation And Tests

| File | Type | Role |
|------|------|------|
| `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` | Vitest | Checks that the dry run Downgrades match the baseline the apply run records |
| `.skilled/skills/system-spec-kit/runtime/tests/upgrade-baseline.vitest.ts` | Vitest | Checks which recorded entries are downgraded and which stay errors |

---

## 4. SOURCE METADATA

- Group: Tooling And Scripts
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `tooling-and-scripts/upgrade-legacy-downgrades-report.md`

Related references:
- [upgrade-legacy-reversibility-manifest.md](upgrade-legacy-reversibility-manifest.md) - The manifest and the refusals that stop an apply
- [heal-spec-docs-lane-modes.md](heal-spec-docs-lane-modes.md) - The lane modes whose refusals the report lists
