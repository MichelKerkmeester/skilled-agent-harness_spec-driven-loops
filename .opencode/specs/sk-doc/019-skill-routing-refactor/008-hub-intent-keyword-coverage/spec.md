---
title: "Feature Specification: hub intent keyword coverage for create-agent and create-changelog"
description: "The sk-doc hub router keyed each mode on multi-word exact aliases (create agent, create changelog), so natural phrasings (create an agent file, write a changelog entry) matched only the generic authoring verb and tied across every intent, mis-routing to create-skill. Add artifact-noun keyword coverage across all three synced surfaces so those prompts route to the right packet, with zero vocab-sync drift and zero routing regression."
trigger_phrases:
  - "hub intent keyword coverage"
  - "create-agent create-changelog mis-routing"
  - "sk-doc hub router keyword fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/007-hub-intent-keyword-coverage"
    last_updated_at: "2026-07-13T15:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Added hub keyword coverage for two intents"
    next_safe_action: "Terminal validation and optional commit"
    blockers: []
    completion_pct: 100
    status: "Complete"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: hub intent keyword coverage for create-agent and create-changelog

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Parent Packet** | `sk-doc/019-skill-routing-refactor` |
| **Sibling** | `006-create-skill-router-marker-gap` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The sk-doc hub router scores each mode by counting keyword hits times the mode weight. Every mode shares the generic `authoring-actions` class (create, make, new, write, …), and the mode-specific alias classes held only multi-word exact phrases (`create agent`, `create changelog`). Natural phrasings break the adjacency: `create an agent file` and `write a changelog entry` matched only the generic verb, tying every mode at the same score, so the stable-sort tiebreak sent them to `create-skill`.

### Purpose
Add artifact-noun keyword coverage to the `create-agent` and `create-changelog` alias classes so those prompts hit a mode-specific keyword and route to the correct packet — without introducing vocab-sync drift or regressing any other mode's routing.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add `agent file`, `new agent`, `agent persona` to the `create-agent` alias vocabulary.
- Add `changelog`, `changelog entry` to the `create-changelog` alias vocabulary.
- Apply consistently across all three synced surfaces: packet `Keyword triggers:` line, `mode-registry.json` aliases, `hub-router.json` vocabularyClasses.

### Out of Scope
- The `create-benchmark` mis-route (`create a benchmark package` → create-skill): same root cause, but create-benchmark is at the 5000-word hard cap, so it needs a separate operator decision. Recorded as a follow-up.
- Any change to the skill-advisor registry (a separate routing system).
- The other eight modes, which already route correctly.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- R1: `create an agent file` and `create a new agent persona` route to `create-agent`.
- R2: `write a changelog entry` and `update the changelog` route to `create-changelog`.
- R3: The new keywords appear in all three synced surfaces so `parent-hub-vocab-sync` reports no drift (score 100).
- R4: No regression — every other mode's representative prompt still routes to its own mode.
- R5: The two edited packets still pass `package_skill.py --check` (errors 0) with no word-cap breach.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Routing battery: `create-agent` and `create-changelog` prompts route correctly; the other ten intents unchanged.
- `parent-hub-vocab-sync`: score 100, `driftDetected: false`, 0 orphan aliases, 0 collisions.
- `d5-connectivity`: hub gate stays clean (connectivity 100, hub-registry 100).
- `package_skill.py --check` on both edited packets: errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Risk:** a new keyword could steal routing from another mode via substring match. Mitigated by choosing artifact-specific terms and re-running the full battery (adding keywords only raises the two target modes' scores; it cannot lower another mode's).
- **Dependency:** the three-surface sync contract enforced by `parent-hub-vocab-sync.cjs`; the router semantics in `router-replay.cjs`.
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- The `create-benchmark` mis-route resolution (accept a documented vocab exception vs. trim its word-capped SKILL.md) is deferred to the operator; see the follow-up note in `implementation-summary.md`.
<!-- /ANCHOR:questions -->
