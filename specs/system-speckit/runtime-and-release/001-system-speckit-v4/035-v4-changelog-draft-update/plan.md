---
title: "Implementation Plan: v4 changelog draft update"
description: "Apply the confirmed drift table to the changelog draft with one scripted, anchor-asserting patch, then verify by grep and by the parent's strict validation."
trigger_phrases:
  - "changelog draft patch plan"
  - "apply confirmed drift to release notes"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: v4 changelog draft update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Input** | `../034-v4-state-inventory-research/research/confirmed-drift.md` and `research.md` |
| **Method** | One Python patch whose every replacement asserts its anchor, so a missed anchor fails loudly |
| **Verification** | `rg` for each stale name, parent `validate.sh --strict` |

Each confirmed row maps to one anchored replacement at its cited line. The four subsections the draft lacks (memory decommission, runtime rename, completion gate, simplification and closure) replace the two subsections that described the retired engine. Unreproduced numbers are removed rather than restated.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:phases -->
## 2. PHASES

| Phase | Work | Output |
|-------|------|--------|
| 1 | Anchored replacements for rows 1 to 17 and the three dropped findings | patched draft |
| 2 | New paragraphs for the late-cycle packets in the draft's voice | patched draft |
| 3 | Grep residue check, parent validation, commit | pass three committed |
| 4 | Fifty-four changelog digests, a numbered change plan, one markdown-agent pass over the draft, verification | pass four committed |
| 5 | Read the cli-pi and pi-cache commit series, rewrite the Pi section around the shipped extension set, roster and measured economics | pass five committed, this packet closed |
<!-- /ANCHOR:phases -->
