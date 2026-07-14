---
title: "Feature Specification: sk-doc Smart Routing Mechanism Notes"
description: "Request 2 of the create-skill alignment: give the sk-doc create-* packets whose SMART ROUTING mechanism is absent an explicit, honest routing note rather than a force-fit router. Packets with real keyed resource subdirs (references/<key>/) already carry the discover_markdown_resources/_guard_in_skill/UNKNOWN_FALLBACK mechanism; the 7 flat-resource packets get a documented N/A note modeled on create-readme's precedent (does not use keyed resource discovery + router-resilience rules)."
trigger_phrases:
  - "sk-doc smart routing mechanism notes"
  - "create-skill smart router N/A note"
  - "sk-doc packet keyed resource discovery"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/005-smart-routing-mechanism-notes"
    last_updated_at: "2026-07-12T14:23:42Z"
    last_updated_by: "claude-code"
    recent_action: "Complete; verified and pushed to v4"
    next_safe_action: "Terminal gates"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-doc Smart Routing Mechanism Notes

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-12 |
| **Track** | sk-doc |
| **Sibling** | 009-packet-smart-routing-conformance |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Packet 015 split the merged Smart Routing header so all 10 sk-doc create-* packets pass `package_skill.py --check`. But the checker also emits an advisory warning when a SMART ROUTING section lacks the smart-router markers (`discover_markdown_resources`, `_guard_in_skill`, `UNKNOWN_FALLBACK`) — the keyed resource-discovery mechanism. create-skill and create-flowchart carry the mechanism; create-readme documents an honest N/A note; the other 7 packets neither carry the mechanism nor explain its absence.

**Purpose:** for the 7 flat-resource packets (no `references/<key>/` keyed subdirs), add an explicit routing note — modeled on create-readme's precedent — that documents the actual routing and states the packet does not use keyed resource discovery, rather than force-fitting a router that does not apply.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:** the SMART ROUTING section of 7 packets — create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-benchmark, create-changelog, create-quality-control — add a routing note + router-resilience rules (load-after-confirm, references/README fallback, ask-when-unclear, do-not-add-keyed-router-unless-real-subdirs-appear). Version bump + packet changelog.

**Out of scope:** create-skill / create-flowchart (mechanism already present); create-readme (note already present); adding the literal router markers to satisfy the checker (force-fit — the goal forbids it); any packet with real keyed resource subdirs (none of the 7 have them — keyed:0 confirmed); the shared advisor registry.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: Each of the 7 packets gains a SMART ROUTING note stating its actual routing basis and that it does not use runtime keyed resource discovery (`references/<key>/`), because its resources are flat.
- R2: Each note carries router-resilience rules matching create-readme's precedent (confirm-before-load, references/README fallback, ask-when-unclear, no keyed router unless real keyed subdirs appear).
- R3: Content is additive/structural; no existing routing content deleted; `--check` still PASS.
- R4: `validate_document.py` passes on each edited SKILL.md.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- 10/10 create-* packets: mechanism present where keyed subdirs exist (create-skill), else a documented routing/N-A note (all others).
- `package_skill.py --check` PASS for all 10 (unchanged); `validate_document.py` 0 issues on edited files.
- The advisory smart-router-marker warning on the 7 packets is now explained by an in-file note (not silenced by a force-fit).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Force-fitting the literal markers to clear the advisory warning would misrepresent packets that genuinely lack keyed resources — explicitly avoided per the goal.
- Depends on 015 (header split, on v4) and create-readme's note as the precedent.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. Per-packet wire-vs-note decision resolved by the keyed-subdir analysis (all 7 in scope are keyed:0 → note).
<!-- /ANCHOR:questions -->
