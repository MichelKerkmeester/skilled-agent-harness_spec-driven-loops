---
title: "deep-loop-workflows: Manual Testing Playbook (merged index)"
description: "Hub-level manual testing playbook for the deep-loop-workflows skill. Partitioned by the five modes (context, research, review, ai-council, improvement), linking to each mode's per-mode playbook and mode-qualifying cross-mode CP- scenario IDs. Per-mode scenario IDs are preserved and never renumbered here."
trigger_phrases:
  - "deep-loop-workflows manual testing playbook"
  - "deep loop test scenarios"
  - "merged testing playbook"
last_updated: "2026-06-15"
---

# deep-loop-workflows: Manual Testing Playbook (merged index)

This is the hub directory for the `deep-loop-workflows` validation surface. Each mode keeps its own verbatim manual-testing playbook under `deep-loop-workflows/<mode>/manual_testing_playbook/`. This index links to those five per-mode playbooks, reports the merged scenario totals, and qualifies the cross-mode `CP-` scenario namespace. It holds no scenario content of its own.

Per-mode scenario files and their local IDs are authoritative and are never renumbered here. Each mode's own `manual_testing_playbook.md` carries the per-scenario objective, prompt, expected signals, and release-readiness rule (scoped to that mode's subtotal).

---

## 1. MODE PARTITIONS

| Mode | Per-mode playbook | Categories | Scenarios |
| --- | --- | ---: | ---: |
| context | [`context/manual_testing_playbook/manual_testing_playbook.md`](../context/manual_testing_playbook/manual_testing_playbook.md) | 7 | 25 |
| research | [`research/manual_testing_playbook/manual_testing_playbook.md`](../research/manual_testing_playbook/manual_testing_playbook.md) | 8 | 44 |
| review | [`review/manual_testing_playbook/manual_testing_playbook.md`](../review/manual_testing_playbook/manual_testing_playbook.md) | 9 | 49 |
| ai-council | [`ai-council/manual_testing_playbook/manual_testing_playbook.md`](../ai-council/manual_testing_playbook/manual_testing_playbook.md) | 9 | 32 |
| improvement | [`improvement/manual_testing_playbook/manual_testing_playbook.md`](../improvement/manual_testing_playbook/manual_testing_playbook.md) | 11 | 48 + 1 |
| **Merged total** | | **44** | **198 + 1** |

The merged numbered total is **198 scenarios** (`25 + 44 + 49 + 32 + 48`), which matches the plan 007 reconciliation.

The improvement partition declares 48 numbered scenarios (`IS-001..SB-048`, Lanes A/B/C) and additionally carries one Lane D scenario, `PR-001` under `11--non-dev-ai-system/`. Lane D is packaging-owned and is excluded from the 198 reconciliation, so the on-disk scenario-file count is **199** (`198 + PR-001`). The release-readiness self-check inside the improvement playbook is scoped to its own subtotal and does not assert the merged total.

Scenario counts are file-backed (`find <mode>/manual_testing_playbook -mindepth 2 -name '*.md' | wc -l`) and can be reverified directly. The single off-by-one between improvement's declared 48 and its 49 files is the Lane D `PR-001` file described above, not a missing or extra scenario.

---

## 2. CROSS-MODE CP- ID NAMESPACE

The `CP-NNN` command-flow stress-test scenarios live in three modes. Their number ranges are currently disjoint, a legacy of the original single `CP-` campaign that spanned the pre-merge deep-* skills, so no two modes share a `CP-NNN` number today. To keep the merged namespace collision-proof and to make mode-ownership explicit, this index qualifies each `CP-` scenario with a mode prefix. The per-mode files keep their local `CP-NNN` IDs unchanged.

| Mode | Prefix | Local IDs | Mode-qualified IDs | Location |
| --- | --- | --- | --- | --- |
| research | `RES` | `CP-046..051` | `RES-CP-046..RES-CP-051` | `research/manual_testing_playbook/07--command-flow-stress-tests/` |
| review | `REV` | `CP-052..057` | `REV-CP-052..REV-CP-057` | `review/manual_testing_playbook/07--command-flow-stress-tests/` |
| improvement | `IMP` | `CP-032..037` | `IMP-CP-032..IMP-CP-037` | `improvement/manual_testing_playbook/08--agent-discipline-stress-tests/` |

Resolution rule: at this index a bare `CP-046` is ambiguous only in principle (it is uniquely `RES-CP-046` today), so always cite the mode-qualified form when referencing a stress-test scenario across modes. Inside a single mode's playbook the bare `CP-NNN` form remains correct.

Ancillary `CP-` references that are not their own numbered scenarios, left as-is in the per-mode files:

- `CP-026`, `CP-027`: cross-reference pointers in `improvement/manual_testing_playbook/08--agent-discipline-stress-tests/skill-load-not-protocol.md` (`Related scenarios`), not improvement-owned scenarios.
- `CP-061`: the shared sandbox setup-helper identifier invoked by the improvement agent-discipline stress tests, not a scenario.

Context and ai-council define no `CP-` scenarios.

---

## 3. CASING

All five mode playbooks use the lowercase filename `manual_testing_playbook.md`. The companion merged feature catalog is [`../feature_catalog/feature_catalog.md`](../feature_catalog/feature_catalog.md).
