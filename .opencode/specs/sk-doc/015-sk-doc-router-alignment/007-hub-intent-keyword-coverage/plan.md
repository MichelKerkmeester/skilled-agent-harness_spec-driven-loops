---
title: "Implementation Plan: hub intent keyword coverage for create-agent and create-changelog"
description: "Add artifact-noun keywords to two alias classes across the three synced surfaces, then prove the fix and the guards with the Lane C tooling."
trigger_phrases:
  - "007 plan hub intent keyword coverage"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-router-alignment/007-hub-intent-keyword-coverage"
    last_updated_at: "2026-07-13T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Three-surface keyword edits verified"
    next_safe_action: "Terminal validation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: hub intent keyword coverage for create-agent and create-changelog

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Routing-config edit in the sk-doc parent hub: two mode alias classes gain artifact-noun keywords. No application-logic change; the router semantics are unchanged.
### Overview
Keep the packet source, registry, and hub projection in agreement so the drift guard stays green while the two target prompts start routing correctly.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
Root cause confirmed (multi-word-only aliases + shared generic verb → tie) via `router-replay` scores.
### Definition of Done
Battery routes the two modes correctly, no regression, vocab-sync 100, d5 clean, `--check` errors 0 on both packets.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Source-of-truth first: edit the packet `Keyword triggers:` line, then mirror into `mode-registry.json` aliases and `hub-router.json` vocabularyClasses so all three surfaces agree. Choose artifact-specific terms so added keywords cannot steal routing from another mode.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
1. Diagnose the tie via `router-replay` scores for the failing prompts.
2. Edit the two packet `Keyword triggers:` lines.
3. Mirror the additions into `mode-registry.json` and `hub-router.json`.
4. Verify routing battery, vocab-sync, d5, and `--check`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Run a 13-prompt routing battery through `router-replay` (two target modes plus every other mode as a regression guard); run `parent-hub-vocab-sync` and `d5-connectivity` on the hub; run `package_skill.py --check` on both edited packets.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- `parent-hub-vocab-sync.cjs` (three-surface drift guard), `router-replay.cjs` (router semantics), `d5-connectivity.cjs` (hub gate).
- Sibling `006-router-conformance-gap-analysis` (which surfaced the mis-routing).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
Additive keyword edits across four files. Rollback = revert the commit; the router returns to the prior tie behavior.
<!-- /ANCHOR:rollback -->

---

## RELATED DOCUMENTS
- `./spec.md`, `./tasks.md`, `./checklist.md`, `./implementation-summary.md`
- Sibling: `../006-router-conformance-gap-analysis/`
