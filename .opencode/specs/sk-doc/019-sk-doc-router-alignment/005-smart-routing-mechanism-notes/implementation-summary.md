---
title: "Implementation Summary: sk-doc Smart Routing Mechanism Notes"
description: "Gave the 10 create-* packets an explicit Smart Routing posture: create-skill/create-flowchart already carry the keyed-discovery mechanism, create-readme already had its N/A note, and 6 flat-resource packets gained a documented N/A routing note (routing basis + no-keyed-discovery + resilience rules, modeled on create-readme). create-benchmark is a documented exception (already family-routes, at the 5000-word cap). All 10 package_skill.py --check PASS."
trigger_phrases:
  - "017 summary smart routing mechanism notes"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/005-smart-routing-mechanism-notes"
    last_updated_at: "2026-07-12T14:23:42Z"
    last_updated_by: "claude-code"
    recent_action: "6 N/A notes added; 10/10 --check PASS; pushed to v4"
    next_safe_action: "Terminal gates + memory save"
    blockers: []
    completion_pct: 100
    status: "Complete"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata
| Field | Value |
|-------|-------|
| **Packet** | 017 — sk-doc Smart Routing Mechanism Notes |
| **Status** | Complete |
| **Track** | sk-doc |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
An explicit Smart Routing posture for all 10 create-* packets.

| Packet(s) | Posture |
|---|---|
| create-skill | keyed-discovery mechanism present (canon) |
| create-flowchart | mechanism present |
| create-readme | N/A note already present |
| create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-changelog, create-quality-control | N/A routing note added (routing basis + no keyed resource discovery + resilience rules) |
| create-benchmark | documented exception — already routes by its 6-family table; at the 5000-word hard cap, so no note added |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
A GPT-5.6-sol-fast batch added the notes to the 6 flat-resource packets, modeled on create-readme's precedent (does-not-use-keyed-discovery + resilience rules), tailored per packet. Orchestrator-verified.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
- **Document, don't force-fit.** Packets with flat resources (keyed:0) get an honest note explaining the absence, not the literal pseudocode markers just to silence the advisory checker warning.
- **create-benchmark reverted.** Its note pushed the SKILL to 5082 words, over the 5000 hard cap → `--check` FAIL. Reverted; create-benchmark already documents routing via its family table + boundary, so the advisory marker warning is an accepted word-cap-constrained limitation.
- **create-command warnings pre-existing.** Its 2 `non_sequential_numbering` warnings are from illustrative code-block section numbers (HEAD had 3), not this change.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
| Check | Result |
|---|---|
| `package_skill.py --check` all 10 packets | 10/10 PASS |
| N/A note present in the 6 edited packets | 6/6 |
| create-benchmark restored | --check PASS, 4983 words |
| Deep-alignment / advisor-registry edits | None |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
- The advisory smart-router-marker warning still appears for the flat-resource packets (the checker greps for the literal markers) — now explained by an in-file note rather than silenced.
- create-benchmark carries the advisory warning by necessity (word cap).
<!-- /ANCHOR:limitations -->

---

## Post-Completion Follow-Up
- Sibling `sk-code/019-split-doc-template-alignment` completes Request 1.
