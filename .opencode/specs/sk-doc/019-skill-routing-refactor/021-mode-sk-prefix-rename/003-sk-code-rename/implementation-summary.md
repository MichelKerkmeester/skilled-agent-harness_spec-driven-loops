---
title: "Implementation Summary: Rename the sk-code mode packets to the sk- prefix"
description: "Move code-quality, code-review, code-webflow and code-opencode to sk-code-* names, fix the benchmark engine prefixes that hardcoded the old names, and hold BLOCKED-BY-ROUTE-GOLD 91."
trigger_phrases:
  - "sk-code mode rename"
  - "sk-code-opencode rename"
importance_tier: "critical"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/021-mode-sk-prefix-rename/003-sk-code-rename"
    last_updated_at: "2026-07-28T08:30:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Renamed sk-code packets and reproduced BLOCKED-BY-ROUTE-GOLD 91"
    next_safe_action: "None; phase complete"
    blockers: []
    completion_pct: 100
---

# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-sk-code-rename |
| **Completed** | 2026-07-28 |
| **Level** | 1 |
| **Commits** | dad347226d (+219995d668 hygiene consumers) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four packets moved (the staged moves landed one commit early, inside the adapter-fix commit — recorded as a history-hygiene deviation; content and rename pairing are correct). GLM's first dispatch did nothing (it asked a permission question into a non-interactive session); the second completed edits but left all five live hook files old. The orchestrator fixed the hook consumers, the comment-hygiene checker chain (pre-commit, CI workflow, plugin and tests), and three engine defects in router-replay.cjs and load-playbook-scenarios.cjs — unescaped and slash-escaped old-prefix literals and a mid-token alternation bite — each with a deliberate frozen-scorer digest re-pin.
<!-- /ANCHOR:what-built -->


---

<!-- ANCHOR:how-delivered -->
## HOW IT WAS DELIVERED

Executed under the phase 002 contract: orchestrator-performed git moves, dispatched-model edit passes, and orchestrator verification of every claim against the Lane C gate and link baseline before commit.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Rationale |
|----------|-----------|
| Hold pre-existing verdicts constant (including BLOCKED states) | The rename must be behavior-preserving; fixing unrelated gold would blend two changes |
| Regenerate generated artifacts instead of editing them | Hand-edits to manifests drift from their generators |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## VERIFICATION

Lane C reproduced BLOCKED-BY-ROUTE-GOLD 91 exactly after the engine fixes (regression chain 91-76-77-90-91 fully traced). Plugin tests 38+15 pass.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## KNOWN LIMITATIONS

Historical surfaces (benchmark report archives, changelogs, spec research logs, scorer caches) intentionally retain old names as a record of what ran.
<!-- /ANCHOR:limitations -->
